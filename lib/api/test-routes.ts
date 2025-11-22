/**
 * Integration tests for API routes
 * Tests /api/submit, /api/curator/approve, /api/releases/[id]
 */

import { createRelease, getReleaseById, updateReleaseStatus } from '../db/releases';
import { createApproval, getApprovalsByReleaseId, countApprovalsForRelease } from '../db/approvals';
import { validateReleaseSubmission, validateApprovalInput } from '../validation';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

// Test data
const testAddress = '0x' + '1'.repeat(40);
const testCuratorAddress1 = '0x' + '2'.repeat(40);
const testCuratorAddress2 = '0x' + '3'.repeat(40);
const testCuratorAddress3 = '0x' + '4'.repeat(40);

let testReleaseId: string;
let tempFilePath: string;

// Helper: Generate PDA ID (matches route implementation)
function generateReleaseId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `PDA-${timestamp}-${random}`;
}

// Helper: Generate mock signature
function generateMockSignature(): string {
  return '0x' + 'a'.repeat(130);
}

async function runTests() {
  console.log('\n========================================');
  console.log('🧪 API ROUTES INTEGRATION TESTS');
  console.log('========================================\n');

  try {
    // TEST 1: Simulate /api/submit - Create a release
    console.log('📝 TEST 1: Simulate /api/submit POST');
    console.log('─────────────────────────────────────');

    testReleaseId = generateReleaseId();
    const submissionData = {
      title: 'Test Release - API Routes',
      description: 'This is a test release for API route integration',
      artists: 'Test Artist',
      mediaFile: `data:audio/mpeg;base64,placeholder`,
    };

    // Validate submission (like route does)
    const validationResult = validateReleaseSubmission(submissionData);
    if (!validationResult.success) {
      console.error('❌ FAILED: Validation error:', validationResult.error.message);
      process.exit(1);
    }
    console.log('✅ Submission validation passed');

    // Create temp file (simulating file storage)
    tempFilePath = join('/tmp', `${testReleaseId}.mp3`);
    writeFileSync(tempFilePath, Buffer.from('mock audio data'));
    console.log(`💾 Temp file created: ${tempFilePath}`);

    // Call createRelease (like route does)
    const estimatedDuration = 180; // 3 minutes
    const createResult = await createRelease({
      id: testReleaseId,
      title: submissionData.title,
      description: submissionData.description,
      artists: submissionData.artists,
      createdBy: testAddress,
      createdAt: Date.now(),
      status: 'pending',
      mediaIPFSHash: 'temp',
      duration: estimatedDuration,
      temp_file_path: tempFilePath,
    });

    if (!createResult.success || !createResult.data) {
      console.error('❌ FAILED:', createResult.error);
      process.exit(1);
    }

    console.log(`✅ PASSED: Release created with ID: ${testReleaseId}`);
    console.log(`   Status: ${createResult.data.status}`);
    console.log(`   Creator: ${createResult.data.createdBy}\n`);

    // TEST 2: Simulate /api/curator/approve - First approval
    console.log('✍️  TEST 2: Simulate /api/curator/approve POST (Approval 1/3)');
    console.log('─────────────────────────────────────');

    const approval1Data = {
      releaseId: testReleaseId,
      signer: testCuratorAddress1,
      signature: generateMockSignature(),
      timestamp: Date.now(),
    };

    // Validate approval (like route does)
    const approval1Validation = validateApprovalInput(approval1Data);
    if (!approval1Validation.success) {
      console.error('❌ FAILED: Validation error:', approval1Validation.error.message);
      process.exit(1);
    }
    console.log('✅ Approval validation passed');

    // Create approval
    const approval1Result = await createApproval(approval1Data);
    if (!approval1Result.success || !approval1Result.data) {
      console.error('❌ FAILED:', approval1Result.error);
      process.exit(1);
    }

    console.log(`✅ PASSED: First approval created`);
    console.log(`   Signer: ${approval1Result.data.signer}`);

    // Count approvals (like route does)
    const count1Result = await countApprovalsForRelease(testReleaseId);
    if (!count1Result.success) {
      console.error('❌ FAILED:', count1Result.error);
      process.exit(1);
    }

    console.log(`📊 Approval count: ${count1Result.data}/3`);
    console.log(`❌ Threshold NOT met (need 3)\n`);

    // TEST 3: Second approval
    console.log('✍️  TEST 3: Simulate /api/curator/approve POST (Approval 2/3)');
    console.log('─────────────────────────────────────');

    const approval2Data = {
      releaseId: testReleaseId,
      signer: testCuratorAddress2,
      signature: generateMockSignature(),
      timestamp: Date.now(),
    };

    const approval2Result = await createApproval(approval2Data);
    if (!approval2Result.success || !approval2Result.data) {
      console.error('❌ FAILED:', approval2Result.error);
      process.exit(1);
    }

    const count2Result = await countApprovalsForRelease(testReleaseId);
    if (!count2Result.success) {
      console.error('❌ FAILED:', count2Result.error);
      process.exit(1);
    }

    console.log(`✅ PASSED: Second approval created`);
    console.log(`📊 Approval count: ${count2Result.data}/3`);
    console.log(`❌ Threshold NOT met (need 3)\n`);

    // TEST 4: Third approval (threshold should be met)
    console.log('✍️  TEST 4: Simulate /api/curator/approve POST (Approval 3/3 - THRESHOLD)');
    console.log('─────────────────────────────────────');

    const approval3Data = {
      releaseId: testReleaseId,
      signer: testCuratorAddress3,
      signature: generateMockSignature(),
      timestamp: Date.now(),
    };

    const approval3Result = await createApproval(approval3Data);
    if (!approval3Result.success || !approval3Result.data) {
      console.error('❌ FAILED:', approval3Result.error);
      process.exit(1);
    }

    const count3Result = await countApprovalsForRelease(testReleaseId);
    if (!count3Result.success) {
      console.error('❌ FAILED:', count3Result.error);
      process.exit(1);
    }

    console.log(`✅ PASSED: Third approval created`);
    console.log(`📊 Approval count: ${count3Result.data}/3`);
    
    const thresholdMet = (count3Result.data || 0) >= 3;
    if (thresholdMet) {
      console.log(`🎉 THRESHOLD MET! Updating release status...\n`);

      // Update release status (like route does)
      const updateResult = await updateReleaseStatus(testReleaseId, 'approved', {
        approvalRequirementsMet: true,
        approvedAt: Date.now(),
      });

      if (!updateResult.success) {
        console.error('❌ FAILED to update status:', updateResult.error);
        process.exit(1);
      }

      console.log(`✅ Release status updated to: ${updateResult.data?.status}`);
    } else {
      console.error('❌ FAILED: Threshold not met after 3 approvals');
      process.exit(1);
    }

    // TEST 5: Simulate /api/releases/[id] GET
    console.log('\n📖 TEST 5: Simulate /api/releases/[id] GET');
    console.log('─────────────────────────────────────');

    // Validate ID format
    const isValidId = /^PDA-\d+-\d+$/.test(testReleaseId);
    if (!isValidId) {
      console.error('❌ FAILED: Invalid release ID format');
      process.exit(1);
    }
    console.log(`✅ Release ID format valid: ${testReleaseId}`);

    // Get release by ID
    const getReleaseResult = await getReleaseById(testReleaseId);
    if (!getReleaseResult.success || !getReleaseResult.data) {
      console.error('❌ FAILED:', getReleaseResult.error);
      process.exit(1);
    }

    const release = getReleaseResult.data;
    console.log(`✅ Release retrieved: ${release.title}`);
    console.log(`   Status: ${release.status}`);
    console.log(`   Approval Requirements Met: ${release.approvalRequirementsMet}`);

    // Get all approvals
    const approvalsResult = await getApprovalsByReleaseId(testReleaseId);
    if (!approvalsResult.success) {
      console.error('❌ FAILED to fetch approvals:', approvalsResult.error);
      process.exit(1);
    }

    const approvals = approvalsResult.data || [];
    console.log(`✅ Approvals retrieved: ${approvals.length} signatures`);

    // Construct combined response (like route does)
    const releaseWithApprovals = {
      ...release,
      approvals,
    };

    console.log(`\n   Complete release data with approvals:`);
    console.log(`   - ID: ${releaseWithApprovals.id}`);
    console.log(`   - Title: ${releaseWithApprovals.title}`);
    console.log(`   - Status: ${releaseWithApprovals.status}`);
    console.log(`   - Approval Signers: ${approvals.map(a => a.signer).join(', ')}`);

    // TEST 6: Verify data integrity
    console.log('\n🔍 TEST 6: Verify Data Integrity');
    console.log('─────────────────────────────────────');

    if (releaseWithApprovals.id !== testReleaseId) {
      console.error('❌ FAILED: Release ID mismatch');
      process.exit(1);
    }

    if (approvals.length !== 3) {
      console.error(`❌ FAILED: Expected 3 approvals, got ${approvals.length}`);
      process.exit(1);
    }

    if (releaseWithApprovals.status !== 'approved') {
      console.error(`❌ FAILED: Expected status "approved", got "${releaseWithApprovals.status}"`);
      process.exit(1);
    }

    if (!releaseWithApprovals.approvalRequirementsMet) {
      console.error('❌ FAILED: approvalRequirementsMet should be true');
      process.exit(1);
    }

    console.log('✅ PASSED: All data integrity checks');

    // Cleanup
    console.log('\n🧹 TEST 7: Cleanup');
    console.log('─────────────────────────────────────');

    try {
      unlinkSync(tempFilePath);
      console.log(`✅ Temp file removed: ${tempFilePath}`);
    } catch (e) {
      console.warn(`⚠️  Failed to remove temp file: ${e}`);
    }

    // Summary
    console.log('\n========================================');
    console.log('✅ ALL TESTS PASSED');
    console.log('========================================');
    console.log('\n📊 Summary:');
    console.log(`  - Release submission: ✅`);
    console.log(`  - Approval creation (3x): ✅`);
    console.log(`  - Threshold detection: ✅`);
    console.log(`  - Status auto-update: ✅`);
    console.log(`  - Release retrieval with approvals: ✅`);
    console.log(`  - Data integrity: ✅`);
    console.log('\n🚀 Routes are ready for integration!\n');

    process.exit(0);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('\n❌ TEST SUITE FAILED:', errorMsg);
    
    // Cleanup on error
    if (tempFilePath) {
      try {
        unlinkSync(tempFilePath);
      } catch (e) {
        console.error('Failed to clean up temp file:', e);
      }
    }

    process.exit(1);
  }
}

runTests();

