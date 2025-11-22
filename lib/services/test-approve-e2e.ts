/**
 * E2E Test: Complete Approval Flow (Direct Call - No HTTP)
 * 
 * This test directly calls the approval logic without going through Next.js API routes,
 * ensuring environment variables are correctly loaded from .env.local
 * 
 * Flow:
 * 1. Artist submits release (creates release + temp_files)
 * 2. Curator signs approval
 * 3. Verify signature and Safe membership
 * 4. Store approval in database
 * 5. Check threshold and trigger publishRelease()
 * 6. Verify ENS subname uses correct prefix (SOMA, not EROS)
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';
import { Address } from 'viem';
import { query as dbQuery } from '../db/database';
import { extractCoverArt } from './musicMetadata';
import { publishRelease } from './jobs';
import { verifyCuratorSignature, isSafeMember, getApprovalThreshold, getSafeAddress } from './safe';
import { createApproval, countApprovalsForRelease, hasApprovalFromSigner } from '../db/approvals';

const TEST_RELEASE_ID = `APPROVE-E2E-${Date.now()}`;
const MP3_FILE = path.join(process.cwd(), 'test-artifacts', 'Post-Rational Anthem (1).mp3');
const CURATOR_PRIVATE_KEY = process.env.CURATOR_PRIVATE_KEY!;
const CURATOR_ADDRESS = process.env.CURATOR_ADDRESS as Address;

if (!CURATOR_PRIVATE_KEY || !CURATOR_ADDRESS) {
  console.error('❌ Missing CURATOR_PRIVATE_KEY or CURATOR_ADDRESS in .env.local');
  process.exit(1);
}

// Verify ENS_SUBNAME_PREFIX is loaded correctly
console.log(`\n🔍 ENVIRONMENT CHECK`);
console.log(`================================================`);
console.log(`ENS_SUBNAME_PREFIX: "${process.env.ENS_SUBNAME_PREFIX}"`);
console.log(`CURATOR_ADDRESS: ${CURATOR_ADDRESS}`);
console.log(`================================================\n`);

async function runApprovalE2E() {
  console.log('🧪 E2E APPROVAL FLOW TEST (Direct Call)');
  console.log('================================================\n');

  try {
    // ========================================================================
    // PHASE 1: ARTIST SUBMITS RELEASE
    // ========================================================================
    console.log('📋 PHASE 1️⃣: Artist Submits Release\n');

    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + (7 * 24 * 60 * 60); // 7 days

    // Step 1: Create release record
    console.log('Step 1️⃣: Create release record');
    await dbQuery(
      `INSERT INTO releases 
       (id, title, description, artists, createdBy, createdAt, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        TEST_RELEASE_ID,
        'E2E Approval Test Track',
        'Testing full approval flow with ENS prefix verification',
        'm580',
        CURATOR_ADDRESS.toLowerCase(),
        now,
        'pending',
      ]
    );
    console.log(`✅ Release created: ${TEST_RELEASE_ID}\n`);

    // Step 2: Load MP3 and extract cover
    console.log('Step 2️⃣: Load MP3 and extract cover art');
    const mp3Buffer = fs.readFileSync(MP3_FILE);
    const fileSize = mp3Buffer.length;

    let coverBuffer: Buffer | null = null;
    try {
      const tempMp3Path = `/tmp/${TEST_RELEASE_ID}-extract.mp3`;
      fs.writeFileSync(tempMp3Path, mp3Buffer);
      const coverResult = await extractCoverArt(tempMp3Path);
      if (coverResult?.data) {
        coverBuffer = Buffer.isBuffer(coverResult.data) 
          ? coverResult.data 
          : Buffer.from(coverResult.data);
        console.log(`   ✅ Cover extracted: ${(coverBuffer.length / 1024).toFixed(2)} KB`);
      } else {
        console.log(`   ⚠️ No cover art found`);
      }
      fs.unlinkSync(tempMp3Path);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.log(`   ⚠️ Cover extraction failed: ${errMsg}`);
    }

    // Step 3: Store in temp_files
    console.log('\nStep 3️⃣: Store files in temp_files table');
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
    console.log(`✅ Files stored: MP3=${(fileSize / 1024 / 1024).toFixed(2)}MB${coverBuffer ? `, Cover=${(coverBuffer.length / 1024).toFixed(2)}KB` : ''}\n`);

    // ========================================================================
    // PHASE 2: CURATOR APPROVES RELEASE
    // ========================================================================
    console.log('📋 PHASE 2️⃣: Curator Approves Release\n');

    // Step 1: Create signature (sign raw hash, no prefix)
    console.log('Step 1️⃣: Curator signs approval message');
    const messageHash = ethers.solidityPackedKeccak256(
      ['string', 'string'],
      ['RELEASE_APPROVAL', TEST_RELEASE_ID]
    );
    // Use SigningKey to sign the raw hash directly (no EIP-191 prefix)
    const signingKey = new ethers.SigningKey(CURATOR_PRIVATE_KEY);
    const signature = signingKey.sign(messageHash).serialized;
    console.log(`✅ Signature created: ${signature.substring(0, 30)}...\n`);

    // Step 2: Verify signature (EIP-191)
    console.log('Step 2️⃣: Verify signature (EIP-191)');
    const signatureResult = verifyCuratorSignature(TEST_RELEASE_ID, signature);
    if (!signatureResult.success) {
      throw new Error(`Signature verification failed: ${signatureResult.error}`);
    }
    const recoveredAddress = signatureResult.address?.toLowerCase();
    const expectedAddress = CURATOR_ADDRESS.toLowerCase();
    if (recoveredAddress !== expectedAddress) {
      throw new Error(`Address mismatch: recovered=${recoveredAddress}, expected=${expectedAddress}`);
    }
    console.log(`✅ Signature verified`);
    console.log(`   Recovered address: ${signatureResult.address}\n`);

    // Step 3: Load Safe address
    console.log('Step 3️⃣: Load Safe address from database');
    const safeAddress = await getSafeAddress();
    console.log(`✅ Safe address: ${safeAddress}\n`);

    // Step 4: Verify Safe membership
    console.log('Step 4️⃣: Verify curator is Safe member');
    const isMember = await isSafeMember(CURATOR_ADDRESS, safeAddress);
    if (!isMember) {
      throw new Error(`${CURATOR_ADDRESS} is not a Safe owner`);
    }
    console.log(`✅ ${CURATOR_ADDRESS} is a Safe owner\n`);

    // Step 5: Check if already approved
    console.log('Step 5️⃣: Check if curator already approved');
    const hasApprovedResult = await hasApprovalFromSigner(TEST_RELEASE_ID, CURATOR_ADDRESS);
    if (!hasApprovedResult.success) {
      throw new Error(hasApprovedResult.error);
    }
    if (hasApprovedResult.data) {
      console.log(`⚠️ Curator has already approved this release\n`);
    } else {
      console.log(`✅ Curator has not yet approved\n`);
    }

    // Step 6: Store approval
    console.log('Step 6️⃣: Store approval in database');
    const approvalResult = await createApproval({
      releaseId: TEST_RELEASE_ID,
      signer: CURATOR_ADDRESS,
      signature,
      timestamp: Date.now(),
    });
    if (!approvalResult.success) {
      throw new Error(approvalResult.error);
    }
    console.log(`✅ Approval stored\n`);

    // Step 7: Get threshold
    console.log('Step 7️⃣: Get approval threshold from Safe');
    const threshold = await getApprovalThreshold(safeAddress);
    console.log(`✅ Threshold: ${threshold}\n`);

    // Step 8: Count approvals
    console.log('Step 8️⃣: Count approvals for release');
    const approvalCountResult = await countApprovalsForRelease(TEST_RELEASE_ID);
    if (!approvalCountResult.success) {
      throw new Error(approvalCountResult.error);
    }
    const currentApprovals = approvalCountResult.data;
    console.log(`✅ Current approvals: ${currentApprovals}/${threshold}\n`);

    // Step 9: Check threshold
    console.log('Step 9️⃣: Check if threshold met');
    if (currentApprovals < threshold) {
      console.log(`⏳ Threshold NOT met (${currentApprovals}/${threshold})`);
      console.log(`   Skipping publishing step\n`);
      return;
    }
    console.log(`✅ THRESHOLD MET! (${currentApprovals}/${threshold})\n`);

    // ========================================================================
    // PHASE 3: AUTO-PUBLISH (Triggered by threshold)
    // ========================================================================
    console.log('📋 PHASE 3️⃣: Auto-Publish Release\n');
    console.log('🚀 Triggering publishRelease() job...\n');

    await publishRelease(TEST_RELEASE_ID);

    console.log('\n✅ Publishing completed!\n');

    // ========================================================================
    // PHASE 4: VERIFICATION
    // ========================================================================
    console.log('📋 PHASE 4️⃣: Verify Database Population\n');

    console.log('Step 1️⃣: Query releases table');
    const releaseResult = await dbQuery(
      `SELECT id, title, mediaIPFSHash, coverImageIPFSHash, metadataURI,
              zora_coin_address, zora_coin_symbol, ensSubname, split_address, status
       FROM releases WHERE id = $1`,
      [TEST_RELEASE_ID]
    );

    if (releaseResult.rows.length === 0) {
      throw new Error('Release not found in database');
    }

    const release = releaseResult.rows[0];
    console.log('✅ Release found:');
    console.log(`   Status: ${release.status}`);
    console.log(`   Media IPFS: ${release.mediaipfshash || 'MISSING'}`);
    console.log(`   Cover IPFS: ${release.coverimageipfshash || 'MISSING'}`);
    console.log(`   Metadata: ${release.metadatauri || 'MISSING'}`);
    console.log(`   Zora Coin: ${release.zora_coin_symbol || 'MISSING'} (${release.zora_coin_address || 'MISSING'})`);
    console.log(`   ENS Subname: ${release.enssubname || 'MISSING'}`);
    console.log(`   Split: ${release.split_address || 'MISSING'}\n`);

    // Verify ENS prefix
    console.log('Step 2️⃣: Verify ENS subname prefix');
    const ensSubname = release.enssubname;
    const expectedPrefix = process.env.ENS_SUBNAME_PREFIX || 'SOMA';
    
    if (!ensSubname) {
      throw new Error('❌ ENS subname is missing!');
    }
    
    if (!ensSubname.startsWith(expectedPrefix)) {
      throw new Error(
        `❌ ENS prefix mismatch!\n` +
        `   Expected prefix: ${expectedPrefix}\n` +
        `   Actual subname: ${ensSubname}\n` +
        `   This indicates environment variables are not loading correctly.`
      );
    }
    console.log(`✅ ENS subname has correct prefix: ${ensSubname} (starts with ${expectedPrefix})\n`);

    // Verify temp_files cleanup
    console.log('Step 3️⃣: Verify temp_files cleanup');
    const tempResult = await dbQuery(
      `SELECT COUNT(*) as count FROM temp_files WHERE releaseId = $1`,
      [TEST_RELEASE_ID]
    );
    const tempCount = parseInt(tempResult.rows[0].count, 10);
    if (tempCount === 0) {
      console.log(`✅ Temp files cleaned up\n`);
    } else {
      console.warn(`⚠️ Temp files NOT cleaned up (count: ${tempCount})\n`);
    }

    // Verify all fields populated
    console.log('Step 4️⃣: Verify all critical fields populated');
    const missingFields = [];
    if (!release.mediaipfshash) missingFields.push('mediaIPFSHash');
    if (!release.metadatauri) missingFields.push('metadataURI');
    if (!release.zora_coin_address) missingFields.push('zora_coin_address');
    if (!release.enssubname) missingFields.push('ensSubname');
    if (!release.split_address) missingFields.push('split_address');

    if (missingFields.length > 0) {
      throw new Error(`Missing fields: ${missingFields.join(', ')}`);
    }
    console.log(`✅ All critical fields populated\n`);

    // ========================================================================
    // SUMMARY
    // ========================================================================
    console.log('✅ ✅ ✅  E2E TEST PASSED!  ✅ ✅ ✅\n');
    console.log('📊 Summary:');
    console.log(`   Release ID: ${TEST_RELEASE_ID}`);
    console.log(`   Status: ${release.status}`);
    console.log(`   ENS: ${release.enssubname} (prefix: ${expectedPrefix} ✅)`);
    console.log(`   Zora Coin: ${release.zora_coin_symbol} (${release.zora_coin_address})`);
    console.log(`   Split: ${release.split_address}`);
    console.log(`   Temp Files Cleaned: ${tempCount === 0 ? '✅' : '⚠️'}\n`);

  } catch (error) {
    console.error('\n❌ ❌ ❌  TEST FAILED  ❌ ❌ ❌\n');
    if (error instanceof Error) {
      console.error('Error:', error.message);
      if (error.stack) {
        console.error('\nStack trace:');
        console.error(error.stack);
      }
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

// Run the test
runApprovalE2E();
