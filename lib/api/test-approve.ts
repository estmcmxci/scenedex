/**
 * Test the /api/approve endpoint
 * 
 * This test:
 * 1. Takes the most recent ENS-TEST release
 * 2. Signs an approval message with the curator private key
 * 3. POSTs to /api/approve
 * 4. Verifies the response
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { ethers } from 'ethers';
import { query as dbQuery } from '../db/database';

const CURATOR_PRIVATE_KEY = process.env.CURATOR_PRIVATE_KEY!;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function testApproveEndpoint() {
  console.log('\n🧪 TESTING /api/approve ENDPOINT');
  console.log('================================================\n');

  try {
    // Step 1: Get latest ENS-TEST release from database
    console.log('Step 1️⃣: Get latest ENS-TEST release from database');
    const releaseResult = await dbQuery(
      `SELECT id FROM releases WHERE id LIKE 'ENS-TEST%' ORDER BY createdAt DESC LIMIT 1`
    );

    if (releaseResult.rows.length === 0) {
      throw new Error('No ENS-TEST release found. Run the E2E smoke test first.');
    }

    const releaseId = releaseResult.rows[0].id;
    console.log(`✅ Found release: ${releaseId}\n`);

    // Step 2: Create signature using curator private key
    console.log('Step 2️⃣: Create EIP-191 signature');
    const messageHash = ethers.solidityPackedKeccak256(
      ['string', 'string'],
      ['RELEASE_APPROVAL', releaseId]
    );

    const signingKey = new ethers.SigningKey(CURATOR_PRIVATE_KEY);
    const signature = signingKey.sign(messageHash).serialized;

    console.log(`✅ Signature created: ${signature.substring(0, 20)}...\n`);

    // Step 3: POST to /api/approve
    console.log('Step 3️⃣: POST to /api/approve');
    const response = await fetch(`${BASE_URL}/api/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ releaseId, signature }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Request failed: ${data.error}`);
    }

    console.log(`✅ Response received\n`);

    // Step 4: Verify response
    console.log('Step 4️⃣: Verify response');
    console.log(`   Success: ${data.success}`);
    console.log(`   Release ID: ${data.data.releaseId}`);
    console.log(`   Curator: ${data.data.curator}`);
    console.log(`   Approvals: ${data.data.approvalCount}/${data.data.threshold}`);
    console.log(`   Threshold Met: ${data.data.thresholdMet}`);
    console.log(`   Message: ${data.data.message}\n`);

    if (data.data.thresholdMet) {
      console.log('✅ THRESHOLD MET - Release should be publishing!\n');
    } else {
      console.log('⏳ More approvals needed\n');
    }

    console.log('✅ TEST PASSED!\n');
  } catch (error) {
    console.error('❌ TEST FAILED');
    console.error(error);
    process.exit(1);
  }
}

testApproveEndpoint();

