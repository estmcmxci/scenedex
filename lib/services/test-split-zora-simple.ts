/**
 * Simple Split + Zora Test via Safe
 * 
 * A minimal test script that creates Split and Zora coin via Safe
 * using the direct Protocol Kit flow (no complex approval waiting).
 * 
 * For 1-of-1 Safes, the flow is:
 * 1. Create transaction
 * 2. Sign transaction  
 * 3. Execute transaction (skipping approval for 1-of-1)
 * 4. Wait for confirmation
 * 
 * Usage:
 *   npx tsx lib/services/test-split-zora-simple.ts --test split
 *   npx tsx lib/services/test-split-zora-simple.ts --test zora
 *   npx tsx lib/services/test-split-zora-simple.ts --test both
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import Safe from '@safe-global/protocol-kit';
import { createPublicClient, http, type Address } from 'viem';
import { baseSepolia } from 'viem/chains';
import { getSplitCalldata } from './splits';
import { getZoraCoinCalldata } from './zora';

// Configuration
const SAFE_ADDRESS = process.env.SAFE_ADDRESS as Address;
const PRIVATE_KEY = process.env.CURATOR_PRIVATE_KEY!;
const RPC_URL = process.env.BASE_RPC_URL!;
const TEST_CREATOR_ADDRESS = (process.env.TEST_ARTIST_ADDRESS || '0xf39Fd6e51aad88F6F4ce6ab8827279cffFb92266') as Address;
const TEST_RELEASE_ID = `TEST-${Date.now()}`;

// Validate env
if (!SAFE_ADDRESS) {
  console.error('❌ SAFE_ADDRESS not set');
  process.exit(1);
}
if (!PRIVATE_KEY) {
  console.error('❌ CURATOR_PRIVATE_KEY not set');
  process.exit(1);
}
if (!RPC_URL) {
  console.error('❌ BASE_RPC_URL not set');
  process.exit(1);
}

// Create viem public client for waiting
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(RPC_URL),
});

/**
 * Execute a single operation via Safe (simplified flow)
 */
async function executeSafeOperation(
  operation: { to: string; data: string; value: string },
  operationName: string
): Promise<string> {
  console.log(`\n🔧 Executing ${operationName}...`);
  
  // Initialize Protocol Kit fresh each time
  console.log('   Initializing Safe Protocol Kit...');
  const safe = await Safe.init({
    provider: RPC_URL,
    signer: PRIVATE_KEY,
    safeAddress: SAFE_ADDRESS,
  });
  
  // Get Safe info
  const threshold = await safe.getThreshold();
  const owners = await safe.getOwners();
  const nonce = await safe.getNonce();
  console.log(`   Safe: ${SAFE_ADDRESS}`);
  console.log(`   Threshold: ${threshold}, Owners: ${owners.length}`);
  console.log(`   Current nonce: ${nonce}`);
  
  // Create transaction
  console.log('   Creating Safe transaction...');
  const safeTransaction = await safe.createTransaction({
    transactions: [{
      to: operation.to,
      data: operation.data,
      value: operation.value,
    }],
  });
  
  console.log(`   safeTxGas: ${safeTransaction.data.safeTxGas}`);
  console.log(`   nonce: ${safeTransaction.data.nonce}`);
  
  // Sign transaction
  console.log('   Signing transaction...');
  const signedTransaction = await safe.signTransaction(safeTransaction);
  console.log('   ✅ Transaction signed');
  
  // For 1-of-1 Safe, execute directly (skip approval)
  if (threshold === 1 && owners.length === 1) {
    console.log('   1-of-1 Safe detected - executing directly...');
  } else {
    console.log(`   Multi-sig Safe (${threshold} of ${owners.length}) - executing with signatures...`);
  }
  
  // Execute transaction
  console.log('   Executing transaction...');
  const txResult = await safe.executeTransaction(signedTransaction);
  
  // Extract hash
  const txHash = (txResult as any)?.hash || 
                 (txResult as any)?.transactionResponse?.hash || 
                 'UNKNOWN';
  
  console.log(`   Transaction hash: ${txHash}`);
  
  // Wait for confirmation using viem (more reliable)
  if (txHash && txHash !== 'UNKNOWN') {
    console.log('   Waiting for confirmation...');
    try {
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash as `0x${string}`,
        timeout: 60000, // 60 second timeout
      });
      
      console.log(`   ✅ Confirmed in block ${receipt.blockNumber}`);
      console.log(`   Status: ${receipt.status === 'success' ? '✅ Success' : '❌ Failed'}`);
      
      // Check for ExecutionFailure event
      const EXECUTION_FAILURE_TOPIC = '0x23428b18acfb3ea64b08dc0c1d296ea9c09702c09083ca5272e64d115b687d23';
      const failureLogs = receipt.logs.filter(log => 
        log.topics[0] === EXECUTION_FAILURE_TOPIC &&
        log.address.toLowerCase() === SAFE_ADDRESS.toLowerCase()
      );
      
      if (failureLogs.length > 0) {
        throw new Error(`ExecutionFailure event detected - internal operation reverted`);
      }
      
      if (receipt.status !== 'success') {
        throw new Error(`Transaction failed with status: ${receipt.status}`);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('ExecutionFailure')) {
        throw error;
      }
      console.warn(`   ⚠️ Could not wait for receipt: ${error}`);
    }
  }
  
  return txHash;
}

/**
 * Test Split creation
 */
async function testSplit(): Promise<{ success: boolean; txHash?: string; splitAddress?: string; error?: string }> {
  console.log('\n🧪 TESTING SPLIT CREATION');
  console.log('================================================');
  
  try {
    // Get Split calldata
    console.log('\n📝 Generating Split calldata...');
    const splitCalldata = await getSplitCalldata(SAFE_ADDRESS, TEST_CREATOR_ADDRESS);
    
    console.log(`   To: ${splitCalldata.to}`);
    console.log(`   Data: ${splitCalldata.data.substring(0, 20)}...`);
    console.log(`   Value: ${splitCalldata.value}`);
    console.log(`   Predicted address: ${splitCalldata.predictedAddress}`);
    
    // Check if this is a no-op (split already exists)
    if (splitCalldata.to === SAFE_ADDRESS && splitCalldata.data === '0x') {
      console.log('\n⚠️  Split already exists - skipping creation');
      return { success: true, splitAddress: splitCalldata.predictedAddress };
    }
    
    // Execute via Safe
    const txHash = await executeSafeOperation(
      {
        to: splitCalldata.to,
        data: splitCalldata.data,
        value: splitCalldata.value,
      },
      'Split Creation'
    );
    
    console.log('\n✅ SPLIT CREATION SUCCESSFUL');
    console.log(`   Transaction: https://sepolia.basescan.org/tx/${txHash}`);
    console.log(`   Split Address: ${splitCalldata.predictedAddress}`);
    
    return { success: true, txHash, splitAddress: splitCalldata.predictedAddress };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('\n❌ SPLIT CREATION FAILED');
    console.error(`   Error: ${errorMsg}`);
    return { success: false, error: errorMsg };
  }
}

/**
 * Test Zora coin creation
 */
async function testZora(splitAddress?: Address): Promise<{ success: boolean; txHash?: string; error?: string }> {
  console.log('\n🧪 TESTING ZORA COIN CREATION');
  console.log('================================================');
  
  try {
    // Use provided split address or a test one
    const payoutRecipient = splitAddress || TEST_CREATOR_ADDRESS;
    
    console.log(`\n📝 Generating Zora coin calldata...`);
    console.log(`   Release ID: ${TEST_RELEASE_ID}`);
    console.log(`   Creator: ${TEST_CREATOR_ADDRESS}`);
    console.log(`   Payout Recipient (Split): ${payoutRecipient}`);
    
    // Use a gateway URL format (what worked in successful tx)
    const metadataURI = `https://QmTestMetadataHash123456789.ipfs.w3s.link/${TEST_RELEASE_ID}-metadata.json`;
    console.log(`   Metadata URI: ${metadataURI}`);
    
    const zoraCalldata = getZoraCoinCalldata(
      TEST_RELEASE_ID,
      TEST_CREATOR_ADDRESS,
      payoutRecipient,
      metadataURI, // Pass gateway URL directly
      'Test Release Title'
    );
    
    console.log(`   To: ${zoraCalldata.to}`);
    console.log(`   Data: ${zoraCalldata.data.substring(0, 20)}...`);
    console.log(`   Value: ${zoraCalldata.value}`);
    
    // Execute via Safe
    const txHash = await executeSafeOperation(
      {
        to: zoraCalldata.to,
        data: zoraCalldata.data,
        value: zoraCalldata.value,
      },
      'Zora Coin Creation'
    );
    
    console.log('\n✅ ZORA COIN CREATION SUCCESSFUL');
    console.log(`   Transaction: https://sepolia.basescan.org/tx/${txHash}`);
    
    return { success: true, txHash };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('\n❌ ZORA COIN CREATION FAILED');
    console.error(`   Error: ${errorMsg}`);
    return { success: false, error: errorMsg };
  }
}

/**
 * Test both operations sequentially
 */
async function testBoth(): Promise<void> {
  console.log('\n🧪 TESTING BOTH: SPLIT + ZORA');
  console.log('================================================');
  
  // Step 1: Create Split
  console.log('\n📍 Step 1: Create Split');
  const splitResult = await testSplit();
  
  if (!splitResult.success) {
    console.error('\n❌ TEST FAILED: Split creation failed');
    process.exit(1);
  }
  
  // Wait a bit for state to settle
  console.log('\n⏳ Waiting 5 seconds for blockchain state to settle...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Step 2: Create Zora coin using the split address
  console.log('\n📍 Step 2: Create Zora Coin');
  const zoraResult = await testZora(splitResult.splitAddress as Address);
  
  if (!zoraResult.success) {
    console.error('\n❌ TEST FAILED: Zora coin creation failed');
    process.exit(1);
  }
  
  // Summary
  console.log('\n================================================');
  console.log('✅ ALL TESTS PASSED');
  console.log('================================================');
  console.log(`Split Transaction: ${splitResult.txHash || 'N/A (already existed)'}`);
  console.log(`Split Address: ${splitResult.splitAddress}`);
  console.log(`Zora Transaction: ${zoraResult.txHash}`);
  console.log('================================================\n');
}

// Main
async function main() {
  const testArg = process.argv.find(arg => arg.startsWith('--test='))?.split('=')[1] ||
                  (process.argv.includes('--test') ? process.argv[process.argv.indexOf('--test') + 1] : null) ||
                  'both';
  
  console.log('🧪 SIMPLE SPLIT/ZORA TEST');
  console.log('================================================');
  console.log(`Safe: ${SAFE_ADDRESS}`);
  console.log(`Creator: ${TEST_CREATOR_ADDRESS}`);
  console.log(`Release ID: ${TEST_RELEASE_ID}`);
  console.log(`Test: ${testArg}`);
  
  switch (testArg?.toLowerCase()) {
    case 'split':
      await testSplit();
      break;
    case 'zora':
      await testZora();
      break;
    case 'both':
      await testBoth();
      break;
    default:
      console.error(`\n❌ Unknown test: ${testArg}`);
      console.error('   Usage: --test split | --test zora | --test both');
      process.exit(1);
  }
}

main().catch(error => {
  console.error('\n💥 Unhandled error:', error);
  process.exit(1);
});


