/**
 * POST /api/submit
 * 
 * Endpoint for submitting a new release
 * 
 * Request Body (FormData):
 * {
 *   title: string,
 *   description: string,
 *   artists?: string,
 *   mediaFile: File (MP3)
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   data: {
 *     id: "PDA-001",
 *     status: "pending",
 *     title: "...",
 *     ...
 *   }
 * }
 * 
 * Error:
 * {
 *   success: false,
 *   error: "error message"
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { query as dbQuery } from '@/lib/db/database';
import { validateReleaseSubmission } from '@/lib/validation';
import fs from 'fs';
import { extractCoverArt } from '@/lib/services/musicMetadata';
import { getNextEROSNumber, formatEROSNumber } from '@/lib/services/ens';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Processing release submission...');

    // Parse FormData
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const artists = formData.get('artists') as string | null;
    const mediaFile = formData.get('mediaFile') as File | null;
    const createdBy = formData.get('createdBy') as string | null;

    // Validate form inputs
    if (!title || !description || !mediaFile || !createdBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, description, mediaFile, createdBy' },
        { status: 400 }
      );
    }

    // Validate wallet address format
    if (!createdBy.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json(
        { success: false, error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!mediaFile.type.startsWith('audio/')) {
      return NextResponse.json(
        { success: false, error: 'File must be an audio file (MP3, WAV, etc.)' },
        { status: 400 }
      );
    }

    // Validate file size (50MB max for temporary storage)
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    if (mediaFile.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: `File size exceeds 50MB limit (got ${(mediaFile.size / 1024 / 1024).toFixed(2)}MB)` },
        { status: 400 }
      );
    }

    // Validate submission against schema
    const validationResult = validateReleaseSubmission({
      title,
      description,
      artists,
      mediaFile: `data:${mediaFile.type};base64,placeholder`, // Placeholder for validation
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.message },
        { status: 400 }
      );
    }

    // Generate release ID using next available ARES number
    // We need to check both ENS and database to avoid duplicates
    // Allow resubmission with same ID if status is 'pending' or 'approved' (not published)
    console.log(`📌 Getting next available ARES number...`);
    let aresNumber = await getNextEROSNumber();
    let releaseId = formatEROSNumber(aresNumber);
    let attempts = 0;
    const maxAttempts = 10;
    let isResubmission = false;

    // Check if this ID already exists in database and find next available
    while (attempts < maxAttempts) {
      const existingCheck = await dbQuery(
        `SELECT id, status FROM releases WHERE id = $1`,
        [releaseId]
      );
      
      if (existingCheck.rows.length === 0) {
        // ID is available, break out of loop
        break;
      }
      
      // ID exists in database, check status
      const existingStatus = existingCheck.rows[0].status;
      
      if (existingStatus === 'published') {
        // Published releases lock the ID - try next number
        console.log(`⚠️ Release ID ${releaseId} is published, trying next number...`);
        attempts++;
        aresNumber++;
        releaseId = formatEROSNumber(aresNumber);
      } else if (existingStatus === 'pending' || existingStatus === 'approved') {
        // Allow resubmission for pending or approved (not yet published) releases
        console.log(`🔄 Release ID ${releaseId} exists with status '${existingStatus}' - allowing resubmission`);
        isResubmission = true;
        break;
      } else {
        // Unknown status, try next number to be safe
        console.log(`⚠️ Release ID ${releaseId} has unknown status '${existingStatus}', trying next number...`);
        attempts++;
        aresNumber++;
        releaseId = formatEROSNumber(aresNumber);
      }
    }

    if (attempts >= maxAttempts) {
      throw new Error(`Could not find available release ID after ${maxAttempts} attempts`);
    }

    console.log(`📌 ${isResubmission ? 'Resubmitting' : 'Generated'} release ID: ${releaseId} (ARES number: ${aresNumber})`);
    console.log(`👤 Submitted by: ${createdBy}`);

    const now = Math.floor(Date.now() / 1000); // Unix seconds
    const expiresAt = now + (7 * 24 * 60 * 60); // 7 days from now

    // Step 1: INSERT or UPDATE releases table
    console.log(`Step 1️⃣: ${isResubmission ? 'Update' : 'Create'} releases record`);
    let releaseResult;
    if (isResubmission) {
      // Clear rejectionReason when resubmitting to make it visible in curator dashboard
      releaseResult = await dbQuery(
        `UPDATE releases 
         SET title = $1, description = $2, artists = $3, status = $4, createdAt = $5, rejectionreason = NULL
         WHERE id = $6
         RETURNING id, status`,
        [title, description, artists || null, 'pending', now, releaseId]
      );
    } else {
      releaseResult = await dbQuery(
        `INSERT INTO releases 
         (id, title, description, artists, createdBy, createdAt, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, status`,
        [releaseId, title, description, artists || null, createdBy, now, 'pending']
      );
    }

    if (releaseResult.rows.length === 0) {
      throw new Error(`Failed to ${isResubmission ? 'update' : 'insert'} into releases`);
    }
    console.log(`✅ Release record ${isResubmission ? 'updated' : 'created'}: ${releaseId}`);

    // Step 2: INSERT or UPDATE temporary_submissions
    console.log(`Step 2️⃣: ${isResubmission ? 'Update' : 'Insert'} metadata into temporary_submissions`);
    let submissionResult;
    if (isResubmission) {
      submissionResult = await dbQuery(
        `UPDATE temporary_submissions 
         SET title = $1, description = $2, artists = $3, createdAt = $4, status = $5
         WHERE releaseId = $6
         RETURNING *`,
        [title, description, artists || null, now, 'pending', releaseId]
      );
      
      // If update didn't affect any rows, insert instead
      if (submissionResult.rows.length === 0) {
        submissionResult = await dbQuery(
          `INSERT INTO temporary_submissions 
           (releaseId, title, description, artists, createdBy, createdAt, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING *`,
          [releaseId, title, description, artists || null, createdBy, now, 'pending']
        );
      }
    } else {
      submissionResult = await dbQuery(
        `INSERT INTO temporary_submissions 
         (releaseId, title, description, artists, createdBy, createdAt, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [releaseId, title, description, artists || null, createdBy, now, 'pending']
      );
    }

    if (submissionResult.rows.length === 0) {
      throw new Error(`Failed to ${isResubmission ? 'update' : 'insert'} into temporary_submissions`);
    }
    console.log(`✅ Submission metadata ${isResubmission ? 'updated' : 'stored'}: ${releaseId}`);

    // Step 3: Convert file to Buffer and extract cover art
    console.log(`Step 3️⃣: Convert file to Buffer and extract cover art`);
    const fileBuffer = Buffer.from(await mediaFile.arrayBuffer());
    
    // Extract cover art from MP3
    let coverBuffer: Buffer | null = null;
    try {
      const tempMp3Path = `/tmp/${releaseId}-extract.mp3`;
      fs.writeFileSync(tempMp3Path, fileBuffer);
      console.log(`   Extracting cover art from MP3...`);
      
      const coverResult = await extractCoverArt(tempMp3Path);
      if (coverResult && coverResult.data) {
        coverBuffer = Buffer.isBuffer(coverResult.data) ? coverResult.data : Buffer.from(coverResult.data);
        console.log(`✅ Cover art extracted: ${(coverBuffer.length / 1024).toFixed(2)} KB`);
      } else {
        console.log(`⚠️ No cover art found in MP3`);
      }
      
      // Cleanup temp file
      fs.unlinkSync(tempMp3Path);
    } catch (coverError) {
      console.warn(`⚠️ Cover extraction failed (non-fatal):`, coverError instanceof Error ? coverError.message : String(coverError));
    }
    
    // Step 4: INSERT or UPDATE temp_files with both file and cover data
    console.log(`Step 4️⃣: ${isResubmission ? 'Update' : 'Insert'} file BLOBs into temp_files`);
    let tempFilesResult;
    if (isResubmission) {
      tempFilesResult = await dbQuery(
        `UPDATE temp_files 
         SET file_data = $1, cover_data = $2, file_size = $3, cover_size = $4, uploadedAt = $5, expiresAt = $6, status = $7
         WHERE releaseId = $8
         RETURNING id`,
        [fileBuffer, coverBuffer, fileBuffer.length, coverBuffer ? coverBuffer.length : null, now, expiresAt, 'pending', releaseId]
      );
      
      // If update didn't affect any rows, insert instead
      if (tempFilesResult.rows.length === 0) {
        tempFilesResult = await dbQuery(
          `INSERT INTO temp_files 
           (releaseId, file_data, cover_data, file_size, cover_size, uploadedAt, expiresAt, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id`,
          [releaseId, fileBuffer, coverBuffer, fileBuffer.length, coverBuffer ? coverBuffer.length : null, now, expiresAt, 'pending']
        );
      }
    } else {
      tempFilesResult = await dbQuery(
        `INSERT INTO temp_files 
         (releaseId, file_data, cover_data, file_size, cover_size, uploadedAt, expiresAt, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [releaseId, fileBuffer, coverBuffer, fileBuffer.length, coverBuffer ? coverBuffer.length : null, now, expiresAt, 'pending']
      );
    }

    if (tempFilesResult.rows.length === 0) {
      throw new Error(`Failed to ${isResubmission ? 'update' : 'insert'} into temp_files`);
    }
    console.log(`✅ File BLOB ${isResubmission ? 'updated' : 'stored'}: ${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB${coverBuffer ? `, Cover: ${(coverBuffer.length / 1024).toFixed(2)} KB` : ''}`);

    console.log(`✅ ${isResubmission ? 'Resubmission' : 'Submission'} complete: ${releaseId}`);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: releaseId,
          title,
          description,
          artists,
          status: 'pending',
          createdBy: createdBy,
          createdAt: now,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Submit error:', errorMsg);
    return NextResponse.json(
      { success: false, error: errorMsg || 'Internal server error' },
      { status: 500 }
    );
  }
}

