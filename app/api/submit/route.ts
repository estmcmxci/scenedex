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

// Helper: Generate PDA ID (PDA-001, PDA-002, etc.)
function generateReleaseId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `PDA-${timestamp}-${random}`;
}

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

    // Generate release ID
    const releaseId = generateReleaseId();
    console.log(`📌 Generated release ID: ${releaseId}`);
    console.log(`👤 Submitted by: ${createdBy}`);

    const now = Math.floor(Date.now() / 1000); // Unix seconds
    const expiresAt = now + (7 * 24 * 60 * 60); // 7 days from now

    // Step 1: INSERT into releases (minimal record for foreign key reference)
    console.log(`Step 1️⃣: Create minimal releases record`);
    const releaseResult = await dbQuery(
      `INSERT INTO releases 
       (id, title, description, artists, createdBy, createdAt, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, status`,
      [releaseId, title, description, artists || null, createdBy, now, 'pending']
    );

    if (releaseResult.rows.length === 0) {
      throw new Error('Failed to insert into releases');
    }
    console.log(`✅ Release record created: ${releaseId}`);

    // Step 2: INSERT into temporary_submissions
    console.log(`Step 2️⃣: Insert metadata into temporary_submissions`);
    const submissionResult = await dbQuery(
      `INSERT INTO temporary_submissions 
       (releaseId, title, description, artists, createdBy, createdAt, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [releaseId, title, description, artists || null, createdBy, now, 'pending']
    );

    if (submissionResult.rows.length === 0) {
      throw new Error('Failed to insert into temporary_submissions');
    }
    console.log(`✅ Submission metadata stored: ${releaseId}`);

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
    
    // Step 4: INSERT into temp_files with both file and cover data
    console.log(`Step 4️⃣: Insert file BLOBs into temp_files`);
    const tempFilesResult = await dbQuery(
      `INSERT INTO temp_files 
       (releaseId, file_data, cover_data, file_size, cover_size, uploadedAt, expiresAt, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [releaseId, fileBuffer, coverBuffer, fileBuffer.length, coverBuffer ? coverBuffer.length : null, now, expiresAt, 'pending']
    );

    if (tempFilesResult.rows.length === 0) {
      throw new Error('Failed to insert into temp_files');
    }
    console.log(`✅ File BLOB stored: ${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB${coverBuffer ? `, Cover: ${(coverBuffer.length / 1024).toFixed(2)} KB` : ''}`);

    console.log(`✅ Submission complete: ${releaseId}`);

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

