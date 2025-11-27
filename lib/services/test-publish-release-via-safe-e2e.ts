/**
 * E2E Test: Publish Release Via Safe (Full Flow)
 * 
 * Tests the complete publishReleaseViaSafe() flow programmatically:
 * 1. Creates mock release in database
 * 2. Stores test MP3 file in temp_files table
 * 3. Calls publishReleaseViaSafe() directly
 * 4. Tests: metadata extraction, IPFS pinning, Safe transaction execution
 * 
 * Usage:
 *   npx tsx lib/services/test-publish-release-via-safe-e2e.ts
 *   npx tsx lib/services/test-publish-release-via-safe-e2e.ts --file "Post-Rational Anthem.mp3"
 * 
 * Prerequisites:
 *   - Test MP3 file in test-artifacts/ directory
 *   - SAFE_ADDRESS set in .env.local
 *   - BASE_RPC_URL set in .env.local
 *   - ZORA_COIN_FACTORY_ADDRESS set in .env.local
 *   - CURATOR_PRIVATE_KEY set in .env.local (for Safe execution)
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import { Address } from 'viem';
import { query as dbQuery } from '../db/database';
import { extractCoverArt } from './musicMetadata';
import { publishReleaseViaSafe } from './jobs';

// Configuration
const TEST_RELEASE_ID = `TEST-PUBLISH-${Date.now()}`;
const DEFAULT_TEST_FILE = 'Post-Rational Anthem.mp3';
const TEST_ARTIST_ADDRESS = process.env.TEST_ARTIST_ADDRESS as Address || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const SAFE_ADDRESS = process.env.SAFE_ADDRESS;

// Parse command line arguments
let testFileName = DEFAULT_TEST_FILE;
const fileArgIndex = process.argv.findIndex(arg => arg.startsWith('--file'));
if (fileArgIndex !== -1 && fileArgIndex < process.argv.length) {
  const fileArg = process.argv[fileArgIndex] ?? '';
  if (fileArg.includes('=')) {
    // Format: --file=filename.mp3
    const extracted = fileArg.split('=')[1];
    if (extracted && !extracted.startsWith('/') && extracted.endsWith('.mp3')) {
      testFileName = extracted;
    }
  } else if (fileArgIndex + 1 < process.argv.length) {
    // Format: --file filename.mp3
    const extracted = process.argv[fileArgIndex + 1] ?? '';
    if (extracted && !extracted.startsWith('--') && !extracted.startsWith('/')) {
      testFileName = extracted;
    }
  }
}

if (!SAFE_ADDRESS) {
  console.error('❌ SAFE_ADDRESS not set in .env.local');
  process.exit(1);
}

async function testPublishReleaseViaSafe() {
  console.log('\n🧪 E2E TEST: Publish Release Via Safe');
  console.log('================================================\n');
  console.log('Configuration:');
  console.log(`   Release ID: ${TEST_RELEASE_ID}`);
  console.log(`   Test File: ${testFileName}`);
  console.log(`   Artist Address: ${TEST_ARTIST_ADDRESS}`);
  console.log(`   Safe Address: ${SAFE_ADDRESS}`);
  console.log('');

  try {
    // ========================================================================
    // PHASE 1: CREATE MOCK RELEASE IN DATABASE
    // ========================================================================
    console.log('📋 PHASE 1️⃣: Create Mock Release\n');

    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + (7 * 24 * 60 * 60); // 7 days

    // Step 1: Create release record
    console.log('Step 1️⃣: Create release record in database');
    await dbQuery(
      `INSERT INTO releases 
       (id, title, description, artists, createdBy, createdAt, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        TEST_RELEASE_ID,
        'Test Release - E2E Publish Flow',
        'Testing complete publishReleaseViaSafe() flow: metadata extraction, IPFS pinning, Safe transaction',
        'Test Artist',
        TEST_ARTIST_ADDRESS.toLowerCase(),
        now,
        'pending',
      ]
    );
    console.log(`✅ Release created: ${TEST_RELEASE_ID}\n`);

    // Step 2: Load MP3 file from test-artifacts
    console.log('Step 2️⃣: Load MP3 file from test-artifacts');
    const testFilePath = path.join(process.cwd(), 'test-artifacts', testFileName);
    
    if (!fs.existsSync(testFilePath)) {
      throw new Error(`Test file not found: ${testFilePath}`);
    }
    
    const mp3Buffer = fs.readFileSync(testFilePath);
    const fileSize = mp3Buffer.length;
    console.log(`✅ MP3 loaded: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   File: ${testFileName}\n`);

    // Step 3: Extract cover art from MP3
    console.log('Step 3️⃣: Extract cover art from MP3');
    let coverBuffer: Buffer | null = null;
    try {
      const tempMp3Path = `/tmp/${TEST_RELEASE_ID}-extract.mp3`;
      fs.writeFileSync(tempMp3Path, mp3Buffer);
      
      const coverResult = await extractCoverArt(tempMp3Path);
      if (coverResult?.data) {
        coverBuffer = Buffer.isBuffer(coverResult.data) 
          ? coverResult.data 
          : Buffer.from(coverResult.data);
        console.log(`✅ Cover art extracted: ${(coverBuffer.length / 1024).toFixed(2)} KB`);
      } else {
        console.log(`⚠️ No cover art found in MP3`);
      }
      
      fs.unlinkSync(tempMp3Path);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.log(`⚠️ Cover extraction failed (non-fatal): ${errMsg}`);
    }
    console.log('');

    // Step 4: Store files in temp_files table
    console.log('Step 4️⃣: Store files in temp_files table');
    await dbQuery(
      `INSERT INTO temp_files 
       (releaseId, file_data, cover_data, file_size, cover_size, uploadedAt, expiresAt, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        TEST_RELEASE_ID,
        mp3Buffer,
        coverBuffer,
        fileSize,
        coverBuffer?.length || null,
        now,
        expiresAt,
        'pending',
      ]
    );
    console.log(`✅ Files stored in database`);
    console.log(`   MP3: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);
    if (coverBuffer) {
      console.log(`   Cover: ${(coverBuffer.length / 1024).toFixed(2)} KB`);
    }
    console.log('');

    // ========================================================================
    // PHASE 2: EXECUTE PUBLISH RELEASE VIA SAFE
    // ========================================================================
    console.log('📋 PHASE 2️⃣: Execute publishReleaseViaSafe()');
    console.log('================================================\n');
    console.log('⚠️  WARNING: This will execute a REAL Safe transaction on Base Sepolia!');
    console.log('⚠️  This will:');
    console.log('   - Pin files to IPFS (real IPFS pinning)');
    console.log('   - Extract metadata from MP3');
    console.log('   - Execute Safe transaction (Split + Zora + Basename)');
    console.log('   - Deploy contracts on-chain');
    console.log('   - Register Basename');
    console.log('   - Update database with addresses\n');
    
    // Optional: Add confirmation prompt
    const shouldProceed = process.argv.includes('--execute') || process.argv.includes('--yes');
    if (!shouldProceed) {
      console.log('⏸️  Execution paused. To proceed, run with --execute flag:');
      console.log(`   npx tsx lib/services/test-publish-release-via-safe-e2e.ts --file "${testFileName}" --execute\n`);
      return;
    }

    console.log('🚀 Executing publishReleaseViaSafe()...\n');

    // Call the actual publish function
    const txHash = await publishReleaseViaSafe(TEST_RELEASE_ID);

    // ========================================================================
    // PHASE 3: VERIFY RESULTS
    // ========================================================================
    console.log('\n📋 PHASE 3️⃣: Verify Results');
    console.log('================================================\n');

    // Check database for updated release
    const releaseResult = await dbQuery(
      `SELECT 
        id, title, status, 
        mediaIPFSHash, coverImageIPFSHash, metadataURI,
        split_address, zora_coin_address, zora_coin_symbol, ensSubname,
        duration, album, genre, year, bitrate, sampleRate, channels, codec
       FROM releases 
       WHERE id = $1`,
      [TEST_RELEASE_ID]
    );

    if (releaseResult.rows.length === 0) {
      throw new Error('Release not found in database after publication');
    }

    const release = releaseResult.rows[0];
    
    console.log('✅ Publication Results:');
    console.log(`   Release ID: ${release.id}`);
    console.log(`   Status: ${release.status}`);
    console.log(`   Transaction Hash: ${txHash}`);
    console.log('');
    
    if (release.mediaIPFSHash) {
      console.log(`   ✅ Media IPFS: ${release.mediaIPFSHash}`);
    }
    if (release.coverImageIPFSHash) {
      console.log(`   ✅ Cover IPFS: ${release.coverImageIPFSHash}`);
    }
    if (release.metadataURI) {
      console.log(`   ✅ Metadata URI: ${release.metadataURI}`);
    }
    console.log('');
    
    if (release.split_address) {
      console.log(`   ✅ Split Address: ${release.split_address}`);
    }
    if (release.zora_coin_address) {
      console.log(`   ✅ Zora Coin: ${release.zora_coin_address} (${release.zora_coin_symbol || 'N/A'})`);
    }
    if (release.ensSubname) {
      console.log(`   ✅ ENS Subname: ${release.ensSubname}`);
    }
    console.log('');
    
    if (release.duration) {
      console.log(`   ✅ Metadata Extracted:`);
      console.log(`      Duration: ${release.duration}s`);
      if (release.album) console.log(`      Album: ${release.album}`);
      if (release.genre) console.log(`      Genre: ${release.genre}`);
      if (release.year) console.log(`      Year: ${release.year}`);
      if (release.bitrate) console.log(`      Bitrate: ${release.bitrate} kbps`);
      if (release.sampleRate) console.log(`      Sample Rate: ${release.sampleRate} Hz`);
      if (release.channels) console.log(`      Channels: ${release.channels}`);
      if (release.codec) console.log(`      Codec: ${release.codec}`);
    }
    console.log('');

    // Verify temp_files were cleaned up
    const tempFilesResult = await dbQuery(
      `SELECT COUNT(*) as count FROM temp_files WHERE releaseId = $1`,
      [TEST_RELEASE_ID]
    );
    const tempFilesCount = parseInt(tempFilesResult.rows[0].count);
    
    if (tempFilesCount === 0) {
      console.log('✅ Temp files cleaned up (deleted after publication)');
    } else {
      console.log(`⚠️  Temp files still exist (${tempFilesCount} records)`);
    }
    console.log('');

    console.log('================================================');
    console.log('✅ E2E TEST COMPLETE');
    console.log('================================================\n');
    console.log(`Transaction Hash: ${txHash}`);
    console.log(`Release ID: ${TEST_RELEASE_ID}`);
    console.log(`Explorer: https://sepolia.basescan.org/tx/${txHash}\n`);

  } catch (error) {
    console.error('\n❌ E2E TEST FAILED');
    console.error('================================================');
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${errorMsg}`);
    if (error instanceof Error && error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    console.error('');
    
    // Cleanup: Optionally delete test release on failure
    const shouldCleanup = process.argv.includes('--cleanup-on-failure');
    if (shouldCleanup) {
      console.log('🧹 Cleaning up test release...');
      try {
        await dbQuery(`DELETE FROM temp_files WHERE releaseId = $1`, [TEST_RELEASE_ID]);
        await dbQuery(`DELETE FROM releases WHERE id = $1`, [TEST_RELEASE_ID]);
        console.log('✅ Cleanup complete\n');
      } catch (cleanupError) {
        console.error('⚠️  Cleanup failed:', cleanupError);
      }
    }
    
    process.exit(1);
  }
}

// Run test if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testPublishReleaseViaSafe().catch(console.error);
}

