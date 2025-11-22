/**
 * SPLITS E2E TEST
 * 
 * Tests the complete splits integration workflow:
 * 1. Create split contract (Safe 50% + Submitter 50%)
 * 2. Verify split address is valid
 * 3. Store in database
 * 4. Verify database storage
 * 5. Summary and next steps
 */

import { createSplitForRelease, verifySplitContract } from './splits';
import { query as dbQuery } from '../db/database';
import { Address } from 'viem';

const SAFE_ADDRESS = (process.env.SAFE_ADDRESS || '0xf2fa1E8e06641C76Cfe2854c1e4D932a8b6e29fD') as Address;
const SUBMITTER_ADDRESS = ('0x' + '3'.repeat(40)) as Address; // Test submitter
const RELEASE_ID = `PDA-SPLIT-${Date.now()}`;

async function testSplitsE2E() {
  console.log('\n🔄 SPLITS E2E TEST');
  console.log('==================\n');

  try {
    // ──────────────────────────────────────────────────────────────────────────
    // PHASE 1: Create split contract
    // ──────────────────────────────────────────────────────────────────────────

    console.log('📋 Phase 1️⃣: Create Split Contract');
    console.log('----------------------------------');

    const splitAddress = await createSplitForRelease(
      SAFE_ADDRESS,
      SUBMITTER_ADDRESS,
      RELEASE_ID
    );

    if (!splitAddress || !splitAddress.startsWith('0x')) {
      throw new Error('Invalid split address returned');
    }

    console.log(`✅ Split created: ${splitAddress}\n`);

    // ──────────────────────────────────────────────────────────────────────────
    // PHASE 2: Verify split address format
    // ──────────────────────────────────────────────────────────────────────────

    console.log('📋 Phase 2️⃣: Verify Split Address');
    console.log('--------------------------------');

    if (splitAddress.length !== 42) {
      throw new Error(`Invalid split address length: ${splitAddress.length}`);
    }

    console.log(`✅ Split address format valid: ${splitAddress}\n`);

    // ──────────────────────────────────────────────────────────────────────────
    // PHASE 3: Verify split contract on-chain
    // ──────────────────────────────────────────────────────────────────────────

    console.log('📋 Phase 3️⃣: Verify Split on-Chain');
    console.log('----------------------------------');

    const isValid = await verifySplitContract(splitAddress as Address);
    if (!isValid) {
      throw new Error('Split contract verification failed');
    }

    console.log(`✅ Split contract verified\n`);

    // ──────────────────────────────────────────────────────────────────────────
    // PHASE 4: Store split in database
    // ──────────────────────────────────────────────────────────────────────────

    console.log('📋 Phase 4️⃣: Store Split in Database');
    console.log('-------------------------------------');

    // First ensure release exists (for FK constraint)
    console.log(`Creating test release: ${RELEASE_ID}`);
    const now = Math.floor(Date.now() / 1000);
    
    try {
      await dbQuery(
        `INSERT INTO releases 
         (id, title, description, artists, createdBy, createdAt, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [RELEASE_ID, 'Split Test Release', 'Testing splits integration', 'Test Artist', SUBMITTER_ADDRESS, now, 'pending']
      );
      console.log(`✅ Release created: ${RELEASE_ID}`);
    } catch (error) {
      // Release might already exist, that's okay
      console.log(`⚠️ Release insert (may already exist): ${error instanceof Error ? error.message.substring(0, 50) : 'unknown'}`);
    }

    // Now update with split address
    console.log(`Storing split address in releases table...`);
    await dbQuery(
      `UPDATE releases SET split_address = $1 WHERE id = $2`,
      [splitAddress, RELEASE_ID]
    );
    console.log(`✅ Split address stored\n`);

    // ──────────────────────────────────────────────────────────────────────────
    // PHASE 5: Verify database storage
    // ──────────────────────────────────────────────────────────────────────────

    console.log('📋 Phase 5️⃣: Verify Database Storage');
    console.log('-------------------------------------');

    const result = await dbQuery(
      `SELECT id, title, split_address FROM releases WHERE id = $1`,
      [RELEASE_ID]
    );

    if (result.rows.length === 0) {
      throw new Error(`Release ${RELEASE_ID} not found in database`);
    }

    const release = result.rows[0];
    const storedSplit = release.split_address;

    if (storedSplit !== splitAddress) {
      throw new Error(`Stored split doesn't match: expected ${splitAddress}, got ${storedSplit}`);
    }

    console.log(`✅ Split address verified in database`);
    console.log(`   Release: ${release.id}`);
    console.log(`   Title: ${release.title}`);
    console.log(`   Split: ${storedSplit}\n`);

    // ──────────────────────────────────────────────────────────────────────────
    // PHASE 6: Summary
    // ──────────────────────────────────────────────────────────────────────────

    console.log('✨ SPLITS E2E TEST PASSED!');
    console.log('=========================\n');

    console.log('Summary:');
    console.log(`  Release ID: ${RELEASE_ID}`);
    console.log(`  Safe Address: ${SAFE_ADDRESS}`);
    console.log(`  Submitter Address: ${SUBMITTER_ADDRESS}`);
    console.log(`  Split Address: ${splitAddress}`);
    console.log(`  Split Stored: ✅`);
    console.log(`  Revenue Split: 50% Safe + 50% Submitter\n`);

    console.log('Next Steps:');
    console.log('  1️⃣  Update database schema (add split_address column)');
    console.log('  2️⃣  Drop existing tables and re-migrate');
    console.log('  3️⃣  Integrate into publishRelease() job');
    console.log('  4️⃣  Create Zora coins with split as payoutRecipient\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

testSplitsE2E();

