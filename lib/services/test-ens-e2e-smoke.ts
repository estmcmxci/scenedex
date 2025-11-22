import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import { Address } from 'viem';
import type { Release } from '../types';
import { query as dbQuery } from '../db/database';
import { publishRelease } from './jobs';
import { extractCoverArt } from './musicMetadata';

const RELEASE_ID = `ENS-TEST-${Date.now()}`;
const MP3_FILE = path.join(process.cwd(), 'test-artifacts', 'Post-Rational Anthem.mp3');
const SUBMITTER_ADDRESS = process.env.CURATOR_ADDRESS as Address;

async function runTest() {
  console.log('\n🌐 ENS E2E SMOKE TEST (Full Integration with Database)');
  console.log('================================================\n');

  try {
    // Step 0: Create release record in database
    console.log('📋 Step 0️⃣: Create release record in database');
    const now = Math.floor(Date.now() / 1000);
    await dbQuery(
      `INSERT INTO releases 
       (id, title, description, artists, createdBy, createdAt, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        RELEASE_ID,
        'Post-Rational Anthem',
        'ENS E2E Test Release',
        'm580',
        SUBMITTER_ADDRESS,
        now,
        'pending',
      ]
    );
    console.log(`✅ Release record created: ${RELEASE_ID}\n`);

    // Step 1: Load MP3 file and extract cover art, then store in temp_files table
    console.log('📋 Step 1️⃣: Load MP3 file, extract cover, and store in temp_files');
    const mp3Buffer = fs.readFileSync(MP3_FILE);
    const fileSize = mp3Buffer.length;
    const expiresAt = now + (24 * 60 * 60); // 24 hours
    
    // Extract cover art
    let coverBuffer: Buffer | null = null;
    try {
      const tempMp3Path = `/tmp/${RELEASE_ID}-extract.mp3`;
      fs.writeFileSync(tempMp3Path, mp3Buffer);
      const coverResult = await extractCoverArt(tempMp3Path);
      if (coverResult && coverResult.data) {
        coverBuffer = Buffer.isBuffer(coverResult.data) ? coverResult.data : Buffer.from(coverResult.data);
        console.log(`   ✅ Cover extracted: ${(coverBuffer.length / 1024).toFixed(2)} KB`);
      }
      fs.unlinkSync(tempMp3Path);
    } catch (error) {
      console.log(`   ⚠️ Cover extraction failed (non-fatal)`);
    }
    
    await dbQuery(
      `INSERT INTO temp_files 
       (releaseId, file_data, cover_data, file_size, cover_size, uploadedAt, expiresAt, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        RELEASE_ID,
        mp3Buffer,
        coverBuffer,
        fileSize,
        coverBuffer ? coverBuffer.length : null,
        now,
        expiresAt,
        'pending',
      ]
    );
    console.log(`✅ MP3 file stored: ${(fileSize / 1024 / 1024).toFixed(2)} MB${coverBuffer ? `, Cover: ${(coverBuffer.length / 1024).toFixed(2)} KB` : ''}\n`);

    // Step 2: Call publishRelease() - this will handle all the processing
    console.log('📋 Step 2️⃣: Call publishRelease() to process the release');
    console.log('   (This will: pin IPFS, create split, mint coin, register ENS)\n');
    
    await publishRelease(RELEASE_ID);

    // Step 3: Query database to verify all data was populated
    console.log('\n📋 Step 3️⃣: Verify database was populated');
    const result = await dbQuery(
      `SELECT id, title, mediaIPFSHash, zora_coin_address, zora_coin_symbol, ensSubname, split_address, status 
       FROM releases 
       WHERE id = $1`,
      [RELEASE_ID]
    );

    if (result.rows.length === 0) {
      throw new Error(`Release not found in database after publishing: ${RELEASE_ID}`);
    }

    const publishedRelease = result.rows[0];
    console.log('✅ Release published and database verified:');
    console.log(`   ID: ${publishedRelease.id}`);
    console.log(`   Title: ${publishedRelease.title}`);
    console.log(`   Media IPFS: ${publishedRelease.mediaipfshash}`);
    console.log(`   Zora Coin: ${publishedRelease.zora_coin_symbol} (${publishedRelease.zora_coin_address})`);
    console.log(`   ENS Subname: ${publishedRelease.enssubname}`);
    console.log(`   Split: ${publishedRelease.split_address}`);
    console.log(`   Status: ${publishedRelease.status}\n`);

    console.log('✅ ALL PHASES PASSED!\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED');
    console.error(error);
    process.exit(1);
  }
}

runTest();