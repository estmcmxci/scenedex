/**
 * ZORA COINS E2E SMOKE TEST (DIRECT FACTORY CALL)
 *
 * Tests the complete Zora coins integration flow with direct factory contract calls:
 * 1. Pin MP3 and cover art to IPFS (Storacha)
 * 2. Extract metadata from MP3
 * 3. Create metadata JSON and pin to IPFS
 * 4. Create release in database
 * 5. Create split contract (0xSplits)
 * 6. Deploy Zora coin using DIRECT FACTORY CALL (bypasses broken SDK API)
 *    - Uses factory: 0x777777751622c0d3258f214F9DF38E35BF45baF3
 *    - Generates pool config for ETH pair
 *    - Generates unique salt
 *    - Simulates then broadcasts transaction
 *    - Extracts coin address from logs
 * 7. Update database with coin info
 * 8. Verify all data in database
 *
 * Requirements:
 * - ZORA_COIN_FACTORY_ADDRESS in .env.local
 * - BASE_RPC_URL pointing to Base Sepolia
 * - CURATOR_ADDRESS and CURATOR_PRIVATE_KEY for signing
 *
 * Uses royalty-free test content from test-artifacts/
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import { Address } from 'viem';
import { query as dbQuery } from '../db/database';
import { pinBufferToIPFS, extractAndPinCoverArt } from './ipfs';
import { extractDuration, extractAllMetadata } from './musicMetadata';
import { createSplitForRelease } from './splits';
import { createCoinForRelease } from './zora';

const RELEASE_ID = `BETA-${Date.now()}`;
const MP3_FILE = path.join(process.cwd(), 'test-artifacts', 'Post-Rational Anthem.mp3');
const SAFE_ADDRESS = (process.env.SAFE_ADDRESS || '0xf2fa1E8e06641C76Cfe2854c1e4D932a8b6e29fD') as Address;
const SUBMITTER_ADDRESS = ('0x' + '3'.repeat(40)) as Address;

async function runTest() {
  console.log('\n🪙 ZORA COINS E2E SMOKE TEST (DIRECT FACTORY CALL)');
  console.log('==================================================\n');

  let mediaIPFSHash: string | null = null;
  let coverIPFSHash: string | null = null;
  let metadataURI: string | null = null;
  let splitAddress: string | null = null;

  try {
    // PHASE 1: Pin MP3 to IPFS
    console.log('📋 Phase 1️⃣: Pin MP3 to IPFS');
    console.log('------------------------------');
    const mp3Buffer = fs.readFileSync(MP3_FILE);
    console.log(`   📁 Loaded: ${(mp3Buffer.length / 1024 / 1024).toFixed(2)} MB`);
    mediaIPFSHash = await pinBufferToIPFS(mp3Buffer, 'release.mp3', RELEASE_ID);
    console.log(`   ✅ Pinned: ${mediaIPFSHash}\n`);

    // PHASE 2: Extract and pin cover art
    console.log('📋 Phase 2️⃣: Extract & Pin Cover Art');
    console.log('-------------------------------------');
    const tempMp3 = `/tmp/${RELEASE_ID}-extract.mp3`;
    fs.writeFileSync(tempMp3, mp3Buffer);
    coverIPFSHash = await extractAndPinCoverArt(tempMp3);
    if (coverIPFSHash) {
      console.log(`   ✅ Pinned: ${coverIPFSHash}\n`);
    } else {
      console.log(`   ⚠️ No cover art found\n`);
    }

    // PHASE 3: Extract metadata (keep temp file for this)
    console.log('📋 Phase 3️⃣: Extract Metadata');
    console.log('------------------------------');
    const duration = await extractDuration(tempMp3);
    const metadata = await extractAllMetadata(tempMp3);
    console.log(`   ✅ Title:    ${metadata.title}`);
    console.log(`   ✅ Artist:   ${metadata.artist}`);
    console.log(`   ✅ Duration: ${Math.round(duration)}s\n`);

    // PHASE 4: Create metadata JSON and pin
    console.log('📋 Phase 4️⃣: Create & Pin Metadata JSON');
    console.log('----------------------------------------');
    const metadataJSON = {
      name: metadata.title || 'Untitled',
      description: `${metadata.artist || 'Unknown'} - ${metadata.album || 'Album'}`,
      image: coverIPFSHash ? `ipfs://${coverIPFSHash}` : undefined,
      animation_url: `ipfs://${mediaIPFSHash}`,
      content: {
        mime: 'audio/mpeg',
        uri: `ipfs://${mediaIPFSHash}`,
      },
      properties: {
        catalogueId: RELEASE_ID,
        duration: Math.round(duration),
        artist: metadata.artist,
        album: metadata.album,
        codec: metadata.codec,
      },
    };
    const metadataBuffer = Buffer.from(JSON.stringify(metadataJSON, null, 2), 'utf-8');
    metadataURI = await pinBufferToIPFS(metadataBuffer, 'metadata.json', RELEASE_ID);
    console.log(`   ✅ Pinned: ${metadataURI}\n`);

    // PHASE 5: Create release in database
    console.log('📋 Phase 5️⃣: Create Release in Database');
    console.log('----------------------------------------');
    await dbQuery(
      `INSERT INTO releases 
       (id, title, description, artists, createdBy, createdAt, status, 
        mediaIPFSHash, coverImageIPFSHash, duration, metadataURI, 
        album, genre, year, bitrate, sampleRate, channels, codec)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
      [
        RELEASE_ID,
        metadata.title || 'Untitled',
        'E2E smoke test',
        metadata.artist || 'Unknown',
        SUBMITTER_ADDRESS,
        Math.floor(Date.now() / 1000),
        'pending',
        mediaIPFSHash,
        coverIPFSHash || null,
        Math.round(duration),
        metadataURI,
        metadata.album || null,
        metadata.genre || null,
        metadata.year || null,
        metadata.bitrate ? Math.round(metadata.bitrate) : null,
        metadata.sampleRate || null,
        metadata.numberOfChannels || null,
        metadata.codec || null,
      ]
    );
    console.log(`   ✅ Created: ${RELEASE_ID}\n`);

    // PHASE 6: Create split contract
    console.log('📋 Phase 6️⃣: Create Split Contract');
    console.log('-----------------------------------');
    splitAddress = await createSplitForRelease(SAFE_ADDRESS, SUBMITTER_ADDRESS, RELEASE_ID);
    console.log(`   ✅ Split: ${splitAddress}\n`);

    // PHASE 7: Deploy Zora coin (via direct factory call)
    console.log('📋 Phase 7️⃣: Deploy Zora Coin (Direct Factory Call)');
    console.log('----------------------------------------------------');
    console.log('   🏭 Using factory: 0x777777751622c0d3258f214F9DF38E35BF45baF3');
    console.log('   📍 Method: simulateContract → writeContract → verify\n');
    
    const coinResult = await createCoinForRelease(
      RELEASE_ID,
      SUBMITTER_ADDRESS, // Creator owns the coin
      splitAddress as Address, // Revenue goes to split
      `ipfs://${metadataURI}`,
      metadata.title || 'Untitled',
      undefined,
      'metadata.json'
    );
    
    console.log(`   ✅ Coin Address: ${coinResult.coinAddress}`);
    console.log(`   ✅ Symbol:       ${coinResult.symbol}`);
    console.log(`   ✅ Tx Hash:      ${coinResult.transactionHash}`);
    console.log(`   📊 Explorer:     https://sepolia.basescan.org/tx/${coinResult.transactionHash}\n`);

    // PHASE 8: Update database with coin info
    console.log('📋 Phase 8️⃣: Update Database with Coin Info');
    console.log('------------------------------------------');
    await dbQuery(
      `UPDATE releases 
       SET split_address = $1, zora_coin_address = $2, zora_coin_symbol = $3, status = 'published'
       WHERE id = $4`,
      [splitAddress, coinResult.coinAddress, coinResult.symbol, RELEASE_ID]
    );
    console.log(`   ✅ Database updated\n`);

    // PHASE 9: Verify everything in database
    console.log('📋 Phase 9️⃣: Verify All Data in Database');
    console.log('------------------------------------------');
    const result = await dbQuery(
      `SELECT id, title, mediaIPFSHash, metadataURI, split_address, zora_coin_address, zora_coin_symbol
       FROM releases WHERE id = $1`,
      [RELEASE_ID]
    );

    if (result.rows.length === 0) {
      throw new Error('Release not found in database');
    }

    const release = result.rows[0];
    console.log(`   ✅ Release ID:      ${release.id}`);
    console.log(`   ✅ Title:           ${release.title}`);
    console.log(`   ✅ Media IPFS:      ${release.mediipfshash}`);
    console.log(`   ✅ Metadata URI:    ${release.metadatauri}`);
    console.log(`   ✅ Split Address:   ${release.split_address}`);
    console.log(`   ✅ Coin Address:    ${release.zora_coin_address}`);
    console.log(`   ✅ Coin Symbol:     ${release.zora_coin_symbol}\n`);

    console.log('✨ SMOKE TEST PASSED!');
    console.log('======================\n');
    console.log('Summary:');
    console.log(`  Release ID:           ${RELEASE_ID}`);
    console.log(`  Media IPFS:           ${mediaIPFSHash}`);
    console.log(`  Cover IPFS:           ${coverIPFSHash || 'None'}`);
    console.log(`  Metadata URI:         ${metadataURI}`);
    console.log(`  Split Address:        ${splitAddress}`);
    console.log(`  Zora Coin Address:    ${coinResult.coinAddress}`);
    console.log(`  Zora Coin Symbol:     ${coinResult.symbol}`);
    console.log(`  Transaction Hash:     ${coinResult.transactionHash}`);
    console.log(`  Factory Used:         0x777777751622c0d3258f214F9DF38E35BF45baF3`);
    console.log(`  Deployment Method:    Direct Factory Call (no SDK API)\n`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ TEST FAILED');
    console.error('===============');
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
      console.error(`Stack: ${error.stack}`);
    } else {
      console.error(`Error: ${String(error)}`);
    }
    process.exit(1);
  } finally {
    // Cleanup temp files
    try {
      const tempMp3 = `/tmp/${RELEASE_ID}-extract.mp3`;
      if (fs.existsSync(tempMp3)) {
        fs.unlinkSync(tempMp3);
      }
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

runTest();
