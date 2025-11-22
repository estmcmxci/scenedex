/**
 * Test Suite for Releases CRUD Operations
 * Tests all database functions against real PostgreSQL
 */

require('dotenv').config({ path: '.env.local' });

// Import functions - note: we need to use dynamic import or compile TS
const path = require('path');

async function runTests() {
  console.log('🧪 Starting Releases CRUD Tests\n');

  try {
    // Import the compiled releases module
    // Note: In production, this would be compiled TS
    // For now, we'll test via a simple direct approach
    
    const {
      createRelease,
      getReleaseById,
      getAllReleases,
      updateReleaseStatus,
      updateReleaseWithIPFSHashes,
      updateReleaseWithNFT,
      updateReleaseWithENS,
      deleteRelease,
    } = require('./releases');

    const testReleaseId = `PDA-TEST-${Date.now()}`;
    const createdAt = Date.now();
    const testAddress = '0x1234567890123456789012345678901234567890';

    // ========================================================================
    // TEST 1: Create Release
    // ========================================================================
    console.log('📝 TEST 1: Create Release (pending)');
    const createResult = await createRelease({
      id: testReleaseId,
      title: 'Test Release',
      description: 'This is a test release',
      artists: 'Test Artist',
      createdBy: testAddress,
      createdAt,
      status: 'pending',
      duration: 180,
      temp_file_path: '/tmp/test-audio.mp3',
    });

    if (!createResult.success) {
      console.error('❌ FAILED:', createResult.error);
      return;
    }

    console.log('✅ PASSED\n');
    const createdRelease = createResult.data;

    // ========================================================================
    // TEST 2: Get Release by ID
    // ========================================================================
    console.log('🔍 TEST 2: Get Release by ID');
    const getResult = await getReleaseById(testReleaseId);

    if (!getResult.success || !getResult.data) {
      console.error('❌ FAILED:', getResult.error);
      return;
    }

    if (getResult.data.id !== testReleaseId) {
      console.error('❌ FAILED: ID mismatch');
      return;
    }

    console.log('✅ PASSED\n');

    // ========================================================================
    // TEST 3: Get All Releases
    // ========================================================================
    console.log('📚 TEST 3: Get All Releases');
    const getAllResult = await getAllReleases({ limit: 10 });

    if (!getAllResult.success || !Array.isArray(getAllResult.data)) {
      console.error('❌ FAILED:', getAllResult.error);
      return;
    }

    console.log(`✅ PASSED (found ${getAllResult.data.length} releases)\n`);

    // ========================================================================
    // TEST 4: Filter by Status
    // ========================================================================
    console.log('🔎 TEST 4: Get Releases by Status (pending)');
    const filterResult = await getAllReleases({ status: 'pending', limit: 10 });

    if (!filterResult.success || !Array.isArray(filterResult.data)) {
      console.error('❌ FAILED:', filterResult.error);
      return;
    }

    console.log(`✅ PASSED (found ${filterResult.data.length} pending releases)\n`);

    // ========================================================================
    // TEST 5: Update Status to Approved
    // ========================================================================
    console.log('📝 TEST 5: Update Release Status (pending → approved)');
    const updateStatusResult = await updateReleaseStatus(
      testReleaseId,
      'approved',
      {
        approvalThreshold: 3,
        approvalRequirementsMet: true,
        multisigAddress: '0x9876543210987654321098765432109876543210',
      }
    );

    if (!updateStatusResult.success) {
      console.error('❌ FAILED:', updateStatusResult.error);
      return;
    }

    if (updateStatusResult.data.status !== 'approved') {
      console.error('❌ FAILED: Status not updated');
      return;
    }

    console.log('✅ PASSED\n');

    // ========================================================================
    // TEST 6: Add IPFS Hashes
    // ========================================================================
    console.log('📌 TEST 6: Add IPFS Hashes');
    const ipfsResult = await updateReleaseWithIPFSHashes(testReleaseId, {
      mediaIPFSHash: 'QmVeryLongIPFSHashForAudio1234567890',
      coverImageIPFSHash: 'QmVeryLongIPFSHashForImage1234567890',
      metadataURI: 'ipfs://QmMetadataURI1234567890',
    });

    if (!ipfsResult.success) {
      console.error('❌ FAILED:', ipfsResult.error);
      return;
    }

    if (ipfsResult.data.mediaIPFSHash !== 'QmVeryLongIPFSHashForAudio1234567890') {
      console.error('❌ FAILED: IPFS hash not set');
      return;
    }

    console.log('✅ PASSED\n');

    // ========================================================================
    // TEST 7: Add NFT Details
    // ========================================================================
    console.log('🎨 TEST 7: Add NFT Details');
    const nftResult = await updateReleaseWithNFT(testReleaseId, {
      zoraNFT: 'base:0xZoraContractAddress/12345',
      tokenId: '12345',
    });

    if (!nftResult.success) {
      console.error('❌ FAILED:', nftResult.error);
      return;
    }

    if (nftResult.data.zoraNFT !== 'base:0xZoraContractAddress/12345') {
      console.error('❌ FAILED: Zora NFT not set');
      return;
    }

    console.log('✅ PASSED\n');

    // ========================================================================
    // TEST 8: Add ENS Subname
    // ========================================================================
    console.log('📛 TEST 8: Add ENS Subname');
    const ensResult = await updateReleaseWithENS(
      testReleaseId,
      'pda-test-001.palaupalau.eth'
    );

    if (!ensResult.success) {
      console.error('❌ FAILED:', ensResult.error);
      return;
    }

    if (ensResult.data.ensSubname !== 'pda-test-001.palaupalau.eth') {
      console.error('❌ FAILED: ENS subname not set');
      return;
    }

    console.log('✅ PASSED\n');

    // ========================================================================
    // TEST 9: Verify Final State
    // ========================================================================
    console.log('✨ TEST 9: Verify Final State');
    const finalResult = await getReleaseById(testReleaseId);

    if (!finalResult.success || !finalResult.data) {
      console.error('❌ FAILED:', finalResult.error);
      return;
    }

    const final = finalResult.data;
    const checks = [
      ['Status is published', final.status === 'approved'],
      ['Has IPFS hash', !!final.mediaIPFSHash],
      ['Has NFT', !!final.zoraNFT],
      ['Has ENS', !!final.ensSubname],
      ['Has approval threshold', final.approvalThreshold === 3],
    ];

    let allPassed = true;
    checks.forEach(([check, result]) => {
      console.log(`  ${result ? '✅' : '❌'} ${check}`);
      if (!result) allPassed = false;
    });

    if (!allPassed) {
      console.error('\n❌ FAILED: Some checks did not pass');
      return;
    }

    console.log('\n✅ PASSED\n');

    // ========================================================================
    // TEST 10: Delete Release (Cleanup)
    // ========================================================================
    console.log('🗑️  TEST 10: Delete Release (Cleanup)');
    const deleteResult = await deleteRelease(testReleaseId);

    if (!deleteResult.success) {
      console.error('❌ FAILED:', deleteResult.error);
      return;
    }

    console.log('✅ PASSED\n');

    // ========================================================================
    // VERIFY DELETION
    // ========================================================================
    console.log('🔍 Verifying Deletion');
    const verifyDeleteResult = await getReleaseById(testReleaseId);

    if (!verifyDeleteResult.success) {
      console.error('❌ FAILED:', verifyDeleteResult.error);
      return;
    }

    if (verifyDeleteResult.data !== null) {
      console.error('❌ FAILED: Release still exists after deletion');
      return;
    }

    console.log('✅ PASSED (Release successfully deleted)\n');

    // ========================================================================
    // ALL TESTS PASSED
    // ========================================================================
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ ALL TESTS PASSED!');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('Summary:');
    console.log('  ✅ Create release');
    console.log('  ✅ Get by ID');
    console.log('  ✅ Get all');
    console.log('  ✅ Filter by status');
    console.log('  ✅ Update status');
    console.log('  ✅ Add IPFS hashes');
    console.log('  ✅ Add NFT details');
    console.log('  ✅ Add ENS subname');
    console.log('  ✅ Verify final state');
    console.log('  ✅ Delete release\n');
    process.exit(0);
  } catch (err) {
    console.error('\n💥 FATAL ERROR:', err.message);
    console.error(err);
    process.exit(1);
  }
}

runTests();

