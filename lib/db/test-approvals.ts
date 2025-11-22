/**
 * Test Suite for Approvals CRUD Operations
 * Tests all database functions against real PostgreSQL
 */

import {
  createApproval,
  getApprovalsByReleaseId,
  countApprovalsForRelease,
  hasApprovalFromSigner,
  deleteApproval,
  deleteAllApprovalsForRelease,
} from './approvals';
import { createRelease } from './releases';

async function runTests() {
  console.log('🧪 Starting Approvals CRUD Tests\n');

  try {
    const testReleaseId = `PDA-TEST-${Date.now()}`;
    const curator1 = '0x1111111111111111111111111111111111111111';
    const curator2 = '0x2222222222222222222222222222222222222222';
    const curator3 = '0x3333333333333333333333333333333333333333';

    // ========================================================================
    // SETUP: Create a test release
    // ========================================================================
    console.log('📝 SETUP: Creating test release');
    const releaseResult = await createRelease({
      id: testReleaseId,
      title: 'Test Release for Approvals',
      description: 'Testing approval signatures',
      createdBy: '0x9999999999999999999999999999999999999999',
      createdAt: Date.now(),
      status: 'pending',
      mediaIPFSHash: 'QmTestHash',
      duration: 180,
    });

    if (!releaseResult.success) {
      console.error('❌ SETUP FAILED:', releaseResult.error);
      process.exit(1);
    }
    console.log('✅ Test release created\n');

    // ========================================================================
    // TEST 1: Create First Approval
    // ========================================================================
    console.log('✍️  TEST 1: Create First Approval');
    const approval1Result = await createApproval({
      releaseId: testReleaseId,
      signer: curator1,
      signature: '0x' + '1'.repeat(130),
      timestamp: Date.now(),
    });

    if (!approval1Result.success) {
      console.error('❌ FAILED:', approval1Result.error);
      process.exit(1);
    }
    console.log('✅ PASSED\n');

    // ========================================================================
    // TEST 2: Create Second Approval
    // ========================================================================
    console.log('✍️  TEST 2: Create Second Approval');
    const approval2Result = await createApproval({
      releaseId: testReleaseId,
      signer: curator2,
      signature: '0x' + '2'.repeat(130),
      timestamp: Date.now(),
    });

    if (!approval2Result.success) {
      console.error('❌ FAILED:', approval2Result.error);
      process.exit(1);
    }
    console.log('✅ PASSED\n');

    // ========================================================================
    // TEST 3: Get All Approvals for Release
    // ========================================================================
    console.log('🔍 TEST 3: Get All Approvals for Release');
    const approvalsResult = await getApprovalsByReleaseId(testReleaseId);

    if (!approvalsResult.success) {
      console.error('❌ FAILED:', approvalsResult.error);
      process.exit(1);
    }

    if (!Array.isArray(approvalsResult.data)) {
      console.error('❌ FAILED: Data is not an array');
      process.exit(1);
    }

    if (approvalsResult.data.length !== 2) {
      console.error(`❌ FAILED: Expected 2 approvals, got ${approvalsResult.data.length}`);
      process.exit(1);
    }

    console.log(`✅ PASSED (found ${approvalsResult.data.length} approvals)\n`);

    // ========================================================================
    // TEST 4: Count Approvals
    // ========================================================================
    console.log('📊 TEST 4: Count Approvals');
    const countResult = await countApprovalsForRelease(testReleaseId);

    if (!countResult.success) {
      console.error('❌ FAILED:', countResult.error);
      process.exit(1);
    }

    if (countResult.data !== 2) {
      console.error(`❌ FAILED: Expected count 2, got ${countResult.data}`);
      process.exit(1);
    }

    console.log(`✅ PASSED (count: ${countResult.data})\n`);

    // ========================================================================
    // TEST 5: Check if Signer Already Approved
    // ========================================================================
    console.log('🔎 TEST 5: Check if Signer Already Approved');
    const hasCurator1Result = await hasApprovalFromSigner(testReleaseId, curator1);

    if (!hasCurator1Result.success) {
      console.error('❌ FAILED:', hasCurator1Result.error);
      process.exit(1);
    }

    if (!hasCurator1Result.data) {
      console.error('❌ FAILED: Curator 1 should have approved');
      process.exit(1);
    }

    console.log('✅ PASSED (curator1 has approved)\n');

    // ========================================================================
    // TEST 6: Check if Non-Approver is Not Listed
    // ========================================================================
    console.log('🔎 TEST 6: Check if Non-Approver is Not Listed');
    const hasCurator3Result = await hasApprovalFromSigner(testReleaseId, curator3);

    if (!hasCurator3Result.success) {
      console.error('❌ FAILED:', hasCurator3Result.error);
      process.exit(1);
    }

    if (hasCurator3Result.data) {
      console.error('❌ FAILED: Curator 3 should not have approved');
      process.exit(1);
    }

    console.log('✅ PASSED (curator3 has not approved)\n');

    // ========================================================================
    // TEST 7: Create Third Approval
    // ========================================================================
    console.log('✍️  TEST 7: Create Third Approval');
    const approval3Result = await createApproval({
      releaseId: testReleaseId,
      signer: curator3,
      signature: '0x' + '3'.repeat(130),
      timestamp: Date.now(),
    });

    if (!approval3Result.success) {
      console.error('❌ FAILED:', approval3Result.error);
      process.exit(1);
    }
    console.log('✅ PASSED\n');

    // ========================================================================
    // TEST 8: Verify Count is Now 3
    // ========================================================================
    console.log('📊 TEST 8: Verify Count is Now 3');
    const count2Result = await countApprovalsForRelease(testReleaseId);

    if (!count2Result.success) {
      console.error('❌ FAILED:', count2Result.error);
      process.exit(1);
    }

    if (count2Result.data !== 3) {
      console.error(`❌ FAILED: Expected count 3, got ${count2Result.data}`);
      process.exit(1);
    }

    console.log(`✅ PASSED (count: ${count2Result.data})\n`);

    // ========================================================================
    // TEST 9: Delete Single Approval
    // ========================================================================
    console.log('🗑️  TEST 9: Delete Single Approval');
    const deleteResult = await deleteApproval(testReleaseId, curator2);

    if (!deleteResult.success) {
      console.error('❌ FAILED:', deleteResult.error);
      process.exit(1);
    }
    console.log('✅ PASSED\n');

    // ========================================================================
    // TEST 10: Verify Count is Now 2
    // ========================================================================
    console.log('📊 TEST 10: Verify Count After Delete is 2');
    const count3Result = await countApprovalsForRelease(testReleaseId);

    if (!count3Result.success) {
      console.error('❌ FAILED:', count3Result.error);
      process.exit(1);
    }

    if (count3Result.data !== 2) {
      console.error(`❌ FAILED: Expected count 2, got ${count3Result.data}`);
      process.exit(1);
    }

    console.log(`✅ PASSED (count: ${count3Result.data})\n`);

    // ========================================================================
    // TEST 11: Delete All Approvals
    // ========================================================================
    console.log('🗑️  TEST 11: Delete All Approvals');
    const deleteAllResult = await deleteAllApprovalsForRelease(testReleaseId);

    if (!deleteAllResult.success) {
      console.error('❌ FAILED:', deleteAllResult.error);
      process.exit(1);
    }

    if (deleteAllResult.data !== 2) {
      console.error(`❌ FAILED: Expected 2 deleted, got ${deleteAllResult.data}`);
      process.exit(1);
    }

    console.log(`✅ PASSED (deleted ${deleteAllResult.data} approvals)\n`);

    // ========================================================================
    // TEST 12: Verify All Deleted
    // ========================================================================
    console.log('📊 TEST 12: Verify All Deleted');
    const finalCountResult = await countApprovalsForRelease(testReleaseId);

    if (!finalCountResult.success) {
      console.error('❌ FAILED:', finalCountResult.error);
      process.exit(1);
    }

    if (finalCountResult.data !== 0) {
      console.error(`❌ FAILED: Expected count 0, got ${finalCountResult.data}`);
      process.exit(1);
    }

    console.log(`✅ PASSED (count: ${finalCountResult.data})\n`);

    // ========================================================================
    // ALL TESTS PASSED
    // ========================================================================
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ ALL TESTS PASSED!');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('Summary:');
    console.log('  ✅ Create approvals');
    console.log('  ✅ Get all approvals by release');
    console.log('  ✅ Count approvals');
    console.log('  ✅ Check if signer approved');
    console.log('  ✅ Check if non-signer not listed');
    console.log('  ✅ Delete single approval');
    console.log('  ✅ Delete all approvals\n');
    process.exit(0);
  } catch (err) {
    console.error('\n💥 FATAL ERROR:', err instanceof Error ? err.message : err);
    if (err instanceof Error) console.error(err.stack);
    process.exit(1);
  }
}

runTests();

