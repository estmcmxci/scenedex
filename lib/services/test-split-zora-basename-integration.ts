/**
 * Test Script: Split + Zora + Basename Integration (Phase 2)
 * 
 * Tests the critical integration flow where all three operations
 * (Split creation, Zora coin creation, Basename registration) are
 * batched into a single Safe transaction.
 * 
 * Usage:
 *   npx tsx lib/services/test-split-zora-basename-integration.ts
 *   npx tsx lib/services/test-split-zora-basename-integration.ts --dry-run
 *   npx tsx lib/services/test-split-zora-basename-integration.ts --tx-hash <hash>
 * 
 * Test Scenarios:
 * 1. Calldata Generation - Verify all calldata functions work
 * 2. Address Prediction - Verify split address prediction
 * 3. Calldata Batching - Verify operations can be batched
 * 4. Address Extraction - Verify addresses can be extracted from logs
 * 5. Full Flow (optional) - Execute actual transaction (use --execute flag)
 * 
 * Prerequisites:
 *   - SAFE_ADDRESS set in .env.local
 *   - TEST_ARTIST_ADDRESS set in .env.local (or uses default)
 *   - BASE_RPC_URL set in .env.local
 *   - ZORA_COIN_FACTORY_ADDRESS set in .env.local
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createPublicClient, http, Address, zeroAddress } from 'viem';
import { baseSepolia } from 'viem/chains';
import { getSplitCalldata, extractSplitAddressFromLogs } from './splits';
import { getZoraCoinCalldata, extractZoraCoinAddressFromLogs } from './zora';
import { getENSCompleteCalldata, getNextEROSNumber, formatEROSNumber } from './ens';
import { createAndExecuteSafeTransaction } from './safe-transactions';
import type { Release } from '../types';

// Test configuration
const TEST_SAFE_ADDRESS = process.env.SAFE_ADDRESS as `0x${string}`;
const TEST_CREATOR_ADDRESS = process.env.TEST_ARTIST_ADDRESS as `0x${string}` || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const TEST_RELEASE_ID = `TEST-${Date.now()}`;
const TEST_TITLE = 'Test Release for Integration';
const TEST_METADATA_URI = 'ipfs://QmTestMetadataHash123456789';

if (!TEST_SAFE_ADDRESS) {
  console.error('❌ SAFE_ADDRESS not set in .env.local');
  process.exit(1);
}

if (!process.env.ZORA_COIN_FACTORY_ADDRESS) {
  console.error('❌ ZORA_COIN_FACTORY_ADDRESS not set in .env.local');
  process.exit(1);
}

// Test results tracking
interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  details?: any;
}

const testResults: TestResult[] = [];

function recordTest(name: string, passed: boolean, error?: string, details?: any) {
  testResults.push({ name, passed, error, details });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${name}`);
  if (error) {
    console.log(`   Error: ${error}`);
  }
  if (details) {
    console.log(`   Details:`, details);
  }
  console.log('');
}

async function testCalldataGeneration() {
  console.log('\n📋 TEST 1️⃣: Calldata Generation');
  console.log('================================================\n');

  try {
    // Test 1a: Split calldata
    console.log('   Testing getSplitCalldata()...');
    const splitCalldata = await getSplitCalldata(
      TEST_SAFE_ADDRESS,
      TEST_CREATOR_ADDRESS
    );
    
    const splitCalldataValid = Boolean(
      splitCalldata.to &&
      splitCalldata.data &&
      splitCalldata.value !== undefined &&
      splitCalldata.predictedAddress &&
      splitCalldata.predictedAddress.startsWith('0x') &&
      splitCalldata.predictedAddress.length === 42
    );
    
    recordTest(
      'Split calldata generation',
      splitCalldataValid,
      splitCalldataValid ? undefined : 'Invalid calldata format',
      {
        to: splitCalldata.to,
        dataLength: splitCalldata.data.length,
        value: splitCalldata.value,
        predictedAddress: splitCalldata.predictedAddress,
      }
    );

    // Test 1b: Zora coin calldata
    console.log('   Testing getZoraCoinCalldata()...');
    const zoraCalldata = getZoraCoinCalldata(
      TEST_RELEASE_ID,
      TEST_CREATOR_ADDRESS,
      splitCalldata.predictedAddress as Address,
      TEST_METADATA_URI,
      TEST_TITLE
    );
    
    const zoraCalldataValid = Boolean(
      zoraCalldata.to &&
      zoraCalldata.data &&
      zoraCalldata.value !== undefined &&
      zoraCalldata.salt &&
      zoraCalldata.to.toLowerCase() === process.env.ZORA_COIN_FACTORY_ADDRESS!.toLowerCase()
    );
    
    recordTest(
      'Zora coin calldata generation',
      zoraCalldataValid,
      zoraCalldataValid ? undefined : 'Invalid calldata format',
      {
        to: zoraCalldata.to,
        dataLength: zoraCalldata.data.length,
        value: zoraCalldata.value,
        salt: zoraCalldata.salt,
      }
    );

    // Test 1c: Basename calldata
    console.log('   Testing getENSCompleteCalldata()...');
    const erosNumber = await getNextEROSNumber();
    const mockRelease: Release = {
      id: TEST_RELEASE_ID,
      title: TEST_TITLE,
      description: 'Test release',
      artists: 'Test Artist',
      mediaIPFSHash: 'QmTestMedia',
      coverImageIPFSHash: 'QmTestCover',
      metadataURI: TEST_METADATA_URI,
      createdBy: TEST_CREATOR_ADDRESS,
      createdAt: Date.now(),
      status: 'pending',
      duration: 180,
    };
    
    const basenameCalldata = await getENSCompleteCalldata(
      mockRelease,
      zeroAddress, // Placeholder - will extract from logs
      'TEST001', // Mock symbol
      splitCalldata.predictedAddress, // Use predicted split address
      TEST_CREATOR_ADDRESS,
      TEST_SAFE_ADDRESS,
      erosNumber
    );
    
    const basenameCalldataValid =
      Array.isArray(basenameCalldata) &&
      basenameCalldata.length > 0 &&
      basenameCalldata.every(op => op.to && op.data && op.value !== undefined);
    
    recordTest(
      'Basename calldata generation',
      basenameCalldataValid,
      basenameCalldataValid ? undefined : 'Invalid calldata format',
      {
        operationCount: basenameCalldata.length,
        operations: basenameCalldata.map(op => ({
          to: op.to,
          dataLength: op.data.length,
        })),
      }
    );

    return {
      splitCalldata,
      zoraCalldata,
      basenameCalldata,
      erosNumber,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    recordTest('Calldata generation', false, errorMsg);
    throw error;
  }
}

async function testAddressPrediction() {
  console.log('\n📋 TEST 2️⃣: Address Prediction');
  console.log('================================================\n');

  try {
    // Test 2a: Split address prediction
    console.log('   Testing split address prediction...');
    const splitCalldata1 = await getSplitCalldata(
      TEST_SAFE_ADDRESS,
      TEST_CREATOR_ADDRESS
    );
    
    // Call again to verify determinism
    const splitCalldata2 = await getSplitCalldata(
      TEST_SAFE_ADDRESS,
      TEST_CREATOR_ADDRESS
    );
    
    const predictionDeterministic =
      splitCalldata1.predictedAddress.toLowerCase() ===
      splitCalldata2.predictedAddress.toLowerCase();
    
    recordTest(
      'Split address prediction (deterministic)',
      predictionDeterministic,
      predictionDeterministic ? undefined : 'Prediction is not deterministic',
      {
        firstPrediction: splitCalldata1.predictedAddress,
        secondPrediction: splitCalldata2.predictedAddress,
      }
    );

    // Test 2b: Verify predicted address format
    const addressFormatValid =
      splitCalldata1.predictedAddress.startsWith('0x') &&
      splitCalldata1.predictedAddress.length === 42;
    
    recordTest(
      'Split address format validation',
      addressFormatValid,
      addressFormatValid ? undefined : 'Invalid address format',
      {
        address: splitCalldata1.predictedAddress,
      }
    );

    return splitCalldata1.predictedAddress;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    recordTest('Address prediction', false, errorMsg);
    throw error;
  }
}

async function testCalldataBatching() {
  console.log('\n📋 TEST 3️⃣: Calldata Batching');
  console.log('================================================\n');

  try {
    // Generate all calldata
    const splitCalldata = await getSplitCalldata(
      TEST_SAFE_ADDRESS,
      TEST_CREATOR_ADDRESS
    );
    
    const zoraCalldata = getZoraCoinCalldata(
      TEST_RELEASE_ID,
      TEST_CREATOR_ADDRESS,
      splitCalldata.predictedAddress as Address,
      TEST_METADATA_URI,
      TEST_TITLE
    );
    
    const erosNumber = await getNextEROSNumber();
    const mockRelease: Release = {
      id: TEST_RELEASE_ID,
      title: TEST_TITLE,
      description: 'Test release',
      artists: 'Test Artist',
      mediaIPFSHash: 'QmTestMedia',
      coverImageIPFSHash: 'QmTestCover',
      metadataURI: TEST_METADATA_URI,
      createdBy: TEST_CREATOR_ADDRESS,
      createdAt: Date.now(),
      status: 'pending',
      duration: 180,
    };
    
    const basenameCalldata = await getENSCompleteCalldata(
      mockRelease,
      zeroAddress, // Placeholder
      'TEST001',
      splitCalldata.predictedAddress,
      TEST_CREATOR_ADDRESS,
      TEST_SAFE_ADDRESS,
      erosNumber
    );

    // Batch all operations
    const allOperations = [
      {
        to: splitCalldata.to,
        data: splitCalldata.data,
        value: splitCalldata.value,
      },
      {
        to: zoraCalldata.to,
        data: zoraCalldata.data,
        value: zoraCalldata.value,
      },
      ...basenameCalldata,
    ];

    const batchingValid =
      allOperations.length === 2 + basenameCalldata.length &&
      allOperations.every(op => op.to && op.data && op.value !== undefined) &&
      allOperations[0].to === splitCalldata.to &&
      allOperations[1].to === zoraCalldata.to;

    recordTest(
      'Operations batching',
      batchingValid,
      batchingValid ? undefined : 'Invalid batching',
      {
        totalOperations: allOperations.length,
        splitOperation: { to: allOperations[0].to, dataLength: allOperations[0].data.length },
        zoraOperation: { to: allOperations[1].to, dataLength: allOperations[1].data.length },
        basenameOperations: basenameCalldata.length,
      }
    );

    // Test operation order
    const orderValid =
      allOperations[0].to === splitCalldata.to && // Split first
      allOperations[1].to === zoraCalldata.to; // Zora second

    recordTest(
      'Operation order (Split → Zora → Basename)',
      orderValid,
      orderValid ? undefined : 'Operations not in correct order',
      {
        order: allOperations.map((op, i) => ({
          index: i,
          to: op.to.substring(0, 20) + '...',
        })),
      }
    );

    return allOperations;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    recordTest('Calldata batching', false, errorMsg);
    throw error;
  }
}

async function testAddressExtraction(txHash?: string) {
  console.log('\n📋 TEST 4️⃣: Address Extraction from Logs');
  console.log('================================================\n');

  if (!txHash) {
    console.log('   ⚠️  No transaction hash provided - skipping extraction test');
    console.log('   💡 Use --tx-hash <hash> to test address extraction from actual transaction\n');
    recordTest('Address extraction', true, undefined, { skipped: true, reason: 'No transaction hash' });
    return;
  }

  try {
    const rpcUrl = process.env.BASE_RPC_URL;
    if (!rpcUrl) {
      throw new Error('BASE_RPC_URL not set');
    }

    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(rpcUrl),
    });

    console.log(`   Fetching transaction receipt: ${txHash}...`);
    const receipt = await publicClient.getTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

    console.log(`   ✅ Receipt found: ${receipt.logs.length} logs\n`);

    // Test 4a: Extract split address
    console.log('   Testing extractSplitAddressFromLogs()...');
    const splitCalldata = await getSplitCalldata(
      TEST_SAFE_ADDRESS,
      TEST_CREATOR_ADDRESS
    );
    
    const extractedSplitAddress = await extractSplitAddressFromLogs(
      receipt,
      splitCalldata.predictedAddress as Address
    );
    
    const splitExtractionValid = extractedSplitAddress !== null;
    const splitAddressMatches = extractedSplitAddress?.toLowerCase() === splitCalldata.predictedAddress.toLowerCase();
    
    recordTest(
      'Split address extraction',
      splitExtractionValid,
      splitExtractionValid ? undefined : 'Could not extract split address',
      {
        predicted: splitCalldata.predictedAddress,
        extracted: extractedSplitAddress,
        matches: splitAddressMatches,
      }
    );

    // Test 4b: Extract Zora coin address
    console.log('   Testing extractZoraCoinAddressFromLogs()...');
    const factoryAddress = process.env.ZORA_COIN_FACTORY_ADDRESS as Address;
    const extractedZoraAddress = extractZoraCoinAddressFromLogs(
      receipt,
      factoryAddress
    );
    
    const zoraExtractionValid = extractedZoraAddress !== null;
    
    recordTest(
      'Zora coin address extraction',
      zoraExtractionValid,
      zoraExtractionValid ? undefined : 'Could not extract Zora coin address',
      {
        factoryAddress: factoryAddress,
        extracted: extractedZoraAddress,
      }
    );

    return {
      splitAddress: extractedSplitAddress,
      zoraCoinAddress: extractedZoraAddress,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    recordTest('Address extraction', false, errorMsg);
    throw error;
  }
}

async function testFullFlow() {
  console.log('\n📋 TEST 5️⃣: Full Flow (Dry Run)');
  console.log('================================================\n');
  console.log('   ⚠️  This test only validates calldata generation and batching');
  console.log('   ⚠️  It does NOT execute a transaction\n');

  try {
    // Generate all calldata
    const splitCalldata = await getSplitCalldata(
      TEST_SAFE_ADDRESS,
      TEST_CREATOR_ADDRESS
    );
    
    const zoraCalldata = getZoraCoinCalldata(
      TEST_RELEASE_ID,
      TEST_CREATOR_ADDRESS,
      splitCalldata.predictedAddress as Address,
      TEST_METADATA_URI,
      TEST_TITLE
    );
    
    const erosNumber = await getNextEROSNumber();
    const mockRelease: Release = {
      id: TEST_RELEASE_ID,
      title: TEST_TITLE,
      description: 'Test release',
      artists: 'Test Artist',
      mediaIPFSHash: 'QmTestMedia',
      coverImageIPFSHash: 'QmTestCover',
      metadataURI: TEST_METADATA_URI,
      createdBy: TEST_CREATOR_ADDRESS,
      createdAt: Date.now(),
      status: 'pending',
      duration: 180,
    };
    
    const basenameCalldata = await getENSCompleteCalldata(
      mockRelease,
      zeroAddress, // Placeholder
      'TEST001',
      splitCalldata.predictedAddress,
      TEST_CREATOR_ADDRESS,
      TEST_SAFE_ADDRESS,
      erosNumber
    );

    // Batch all operations
    const allOperations = [
      {
        to: splitCalldata.to,
        data: splitCalldata.data,
        value: splitCalldata.value,
      },
      {
        to: zoraCalldata.to,
        data: zoraCalldata.data,
        value: zoraCalldata.value,
      },
      ...basenameCalldata,
    ];

    const fullFlowValid =
      allOperations.length > 0 &&
      allOperations.every(op => op.to && op.data && op.value !== undefined);

    recordTest(
      'Full flow validation (calldata generation + batching)',
      fullFlowValid,
      fullFlowValid ? undefined : 'Full flow validation failed',
      {
        totalOperations: allOperations.length,
        splitAddress: splitCalldata.predictedAddress,
        zoraSymbol: 'TEST001',
        erosNumber: erosNumber,
      }
    );

    return {
      operations: allOperations,
      predictedSplitAddress: splitCalldata.predictedAddress,
      erosNumber,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    recordTest('Full flow', false, errorMsg);
    throw error;
  }
}

async function runAllTests() {
  const isDryRun = process.argv.includes('--dry-run');
  // Parse --tx-hash argument (supports both --tx-hash=0x123 and --tx-hash 0x123)
  let txHash: string | undefined;
  const txHashIndex = process.argv.findIndex(arg => arg.startsWith('--tx-hash'));
  if (txHashIndex !== -1) {
    const txHashArg = process.argv[txHashIndex];
    if (txHashArg.includes('=')) {
      // Format: --tx-hash=0x123
      txHash = txHashArg.split('=')[1];
    } else {
      // Format: --tx-hash 0x123
      txHash = process.argv[txHashIndex + 1];
    }
  }
  const shouldExecute = process.argv.includes('--execute') && !isDryRun;

  console.log('\n🧪 SPLIT + ZORA + BASENAME INTEGRATION TEST');
  console.log('================================================\n');
  console.log('Configuration:');
  console.log(`   Safe Address: ${TEST_SAFE_ADDRESS}`);
  console.log(`   Creator Address: ${TEST_CREATOR_ADDRESS}`);
  console.log(`   Release ID: ${TEST_RELEASE_ID}`);
  console.log(`   Mode: ${isDryRun ? 'DRY-RUN' : shouldExecute ? 'EXECUTE' : 'TEST-ONLY'}`);
  if (txHash) {
    console.log(`   Transaction Hash: ${txHash}`);
  }
  console.log('');

  try {
    // Test 1: Calldata Generation
    await testCalldataGeneration();

    // Test 2: Address Prediction
    await testAddressPrediction();

    // Test 3: Calldata Batching
    await testCalldataBatching();

    // Test 4: Address Extraction (if tx hash provided)
    if (txHash) {
      await testAddressExtraction(txHash);
    } else {
      await testAddressExtraction();
    }

    // Test 5: Full Flow
    await testFullFlow();

    // Summary
    console.log('\n📊 TEST SUMMARY');
    console.log('================================================\n');
    const passed = testResults.filter(r => r.passed).length;
    const failed = testResults.filter(r => !r.passed).length;
    const total = testResults.length;

    testResults.forEach(result => {
      const icon = result.passed ? '✅' : '❌';
      console.log(`${icon} ${result.name}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });

    console.log(`\n   Total: ${total} tests`);
    console.log(`   Passed: ${passed}`);
    console.log(`   Failed: ${failed}`);

    if (failed === 0) {
      console.log('\n   ✅ All tests passed!\n');
      process.exit(0);
    } else {
      console.log('\n   ❌ Some tests failed. Review errors above.\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  }
}

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}

