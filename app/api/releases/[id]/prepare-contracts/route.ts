/**
 * POST /api/releases/[id]/prepare-contracts
 * 
 * Prepares contract transaction data for split and Zora coin creation
 * Called when curator clicks "Create Contracts" button after threshold is met
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/database';
import { getSplitCalldata } from '@/lib/services/splits';
import { getZoraCoinCalldata } from '@/lib/services/zora';
import { pinBufferToIPFS } from '@/lib/services/ipfs';
import { getSafeAddress } from '@/lib/services/safe';
import dotenv from 'dotenv';

// Load .env.local explicitly
dotenv.config({ path: '.env.local' });

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: releaseId } = await params;

    console.log(`\n📝 PREPARE CONTRACTS for release: ${releaseId}`);
    console.log('================================================\n');

    // Step 1: Get release data
    console.log('Step 1️⃣: Get release data');
    const releaseResult = await query(
      `SELECT r.*, ts.artists 
       FROM releases r 
       LEFT JOIN temporary_submissions ts ON r.id = ts.releaseid
       WHERE r.id = $1`,
      [releaseId]
    );

    if (releaseResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Release not found' },
        { status: 404 }
      );
    }

    const release = releaseResult.rows[0];
    console.log(`   Title: ${release.title}`);
    console.log(`   Creator: ${release.createdby || release.createdBy}`);

    // Step 2: Get Safe address
    console.log('\nStep 2️⃣: Get Safe address');
    let safeAddress: string | undefined;
    
    // First try to get from getSafeAddress (checks DB and env)
    try {
      safeAddress = await getSafeAddress();
    } catch (error) {
      // Fall back to direct env check
      safeAddress = process.env.SAFE_ADDRESS || process.env.CURATOR_SAFE_ADDRESS;
    }
    
    if (!safeAddress) {
      console.error('Failed to get Safe address: not configured');
      return NextResponse.json(
        { success: false, error: 'Safe address not configured. Please set SAFE_ADDRESS environment variable or configure curator_settings.' },
        { status: 500 }
      );
    }
    console.log(`   Safe: ${safeAddress}`);

    // Step 3: Get temp files and pin to IPFS
    console.log('\nStep 3️⃣: Get temp files and pin to IPFS');
    const tempFilesResult = await query(
      `SELECT * FROM temp_files WHERE releaseid = $1`,
      [releaseId]
    );

    let mediaIPFSHash = release.mediaipfshash || release.mediaIPFSHash;
    let coverImageIPFSHash = release.coverimagepfshash || release.coverImageIPFSHash;
    let metadataURI = release.metadatauri || release.metadataURI;

    // Pin files if not already pinned
    if (tempFilesResult.rows.length > 0) {
      const tempFile = tempFilesResult.rows[0];
      
      // Pin audio file if not already pinned
      if (!mediaIPFSHash && tempFile.file_data) {
        console.log('   Pinning audio file...');
        const audioBuffer = Buffer.from(tempFile.file_data);
        mediaIPFSHash = await pinBufferToIPFS(audioBuffer, 'audio.mp3', releaseId);
        console.log(`   ✅ Audio pinned: ${mediaIPFSHash}`);
      }
      
      // Pin cover image if not already pinned
      if (!coverImageIPFSHash && tempFile.cover_data) {
        console.log('   Pinning cover image...');
        const coverBuffer = Buffer.from(tempFile.cover_data);
        coverImageIPFSHash = await pinBufferToIPFS(coverBuffer, 'cover.jpg', releaseId);
        console.log(`   ✅ Cover pinned: ${coverImageIPFSHash}`);
      }
    } else {
      console.log('   No temp files found, checking if files already pinned...');
      if (!mediaIPFSHash) {
        return NextResponse.json(
          { success: false, error: 'No audio file found for release' },
          { status: 400 }
        );
      }
    }

    // Step 4: Create and pin metadata JSON
    console.log('\nStep 4️⃣: Create and pin metadata JSON');
    if (!metadataURI) {
      const metadata = {
        name: release.title,
        description: release.description,
        image: `ipfs://${coverImageIPFSHash}`,
        animation_url: `ipfs://${mediaIPFSHash}`,
        properties: {
          artist: release.artists || release.title,
          releaseId: releaseId,
          publishedBy: safeAddress, // Publisher (Safe address)
          publishedAt: Date.now(), // Publication timestamp (Unix milliseconds)
        },
      };

      const metadataJSON = JSON.stringify(metadata, null, 2);
      const metadataBuffer = Buffer.from(metadataJSON, 'utf-8');
      metadataURI = await pinBufferToIPFS(metadataBuffer, 'metadata.json', releaseId);
      console.log(`   ✅ Metadata pinned: ${metadataURI}`);
      console.log(`   Publisher: ${safeAddress}`);
      console.log(`   Published at: ${new Date().toISOString()}`);
    }

    // Update release with IPFS hashes
    await query(
      `UPDATE releases SET mediaIPFSHash = $1, coverImageIPFSHash = $2, metadataURI = $3 WHERE id = $4`,
      [mediaIPFSHash, coverImageIPFSHash, metadataURI, releaseId]
    );

    // Step 5: Prepare split calldata
    console.log('\nStep 5️⃣: Prepare split calldata');
    const submitterAddress = release.createdby || release.createdBy;
    if (!submitterAddress) {
      return NextResponse.json(
        { success: false, error: 'Submitter address not found' },
        { status: 400 }
      );
    }

    const splitCalldata = await getSplitCalldata(
      safeAddress as `0x${string}`,
      submitterAddress as `0x${string}`,
      releaseId
    );
    console.log(`   ✅ Split calldata prepared`);
    console.log(`   Predicted split address: ${splitCalldata.predictedAddress}`);

    // Step 6: Prepare Zora calldata
    console.log('\nStep 6️⃣: Prepare Zora calldata');
    const zoraCalldata = getZoraCoinCalldata(
      releaseId,
      submitterAddress as `0x${string}`,
      splitCalldata.predictedAddress as `0x${string}`,
      `ipfs://${metadataURI}`,
      release.title,
      'metadata.json'
    );
    console.log(`   ✅ Zora calldata prepared`);

    // Step 7: Return contract transaction data
    console.log('\nStep 7️⃣: Return contract transaction data');
    console.log('✅ ALL STEPS PASSED!\n');

    return NextResponse.json({
      success: true,
      data: {
        contractTxData: {
          splitTransaction: {
            to: splitCalldata.to,
            data: splitCalldata.data,
            value: splitCalldata.value,
          },
          zoraTransaction: {
            to: zoraCalldata.to,
            data: zoraCalldata.data,
            value: zoraCalldata.value,
          },
          predictedSplitAddress: splitCalldata.predictedAddress,
        },
      },
    });
  } catch (error) {
    console.error('Failed to prepare contracts:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Provide more helpful error messages for connection issues
    if (errorMessage.toLowerCase().includes('connection') || 
        errorMessage.toLowerCase().includes('timeout')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection error. Please try again in a moment.',
        },
        { status: 503 } // Service Unavailable
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

