/**
 * Execute Safe Transaction for Basenames Registration (Batched - 2 Transactions)
 * 
 * This script executes the Safe transaction to register a Basename and set all records
 * using MOCK data. No database or IPFS interaction.
 * 
 * Usage:
 *   npx tsx lib/services/execute-safe-publish-batched.ts
 * 
 * What it does:
 * 1. Generates mock release data
 * 2. Gets next available EROS number
 * 3. Generates calldata for Basename registration (with mock addresses)
 * 4. Executes 2 Safe transactions:
 *    - Transaction 1: setSubnodeRecord (creates subname)
 *    - Transaction 2: All resolver operations batched (setAddr + all setText calls)
 * 
 * Prerequisites:
 *   - Safe must have sufficient ETH on Base Sepolia (~0.003 ETH)
 *   - Safe must be authorized as operator
 *   - TEST_ARTIST_ADDRESS set in .env.local (for address record)
 * 
 * Note: This uses mock data - no database or IPFS interaction.
 * Note: Reverse record is skipped for now (can be added later).
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getENSCompleteCalldata, getNextEROSNumber } from './ens';
import { createAndExecuteSafeTransaction } from './safe-transactions';
import type { Release } from '../types';

// Mock configuration
const TEST_SAFE_ADDRESS = process.env.SAFE_ADDRESS as `0x${string}`;
const TEST_CREATOR_ADDRESS = process.env.TEST_ARTIST_ADDRESS as `0x${string}` || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const TEST_ZORA_COIN_ADDRESS = '0x1234567890123456789012345678901234567890'; // Mock address
const TEST_ZORA_COIN_SYMBOL = 'EROS001'; // Mock symbol
const TEST_SPLIT_ADDRESS = '0x0987654321098765432109876543210987654321'; // Mock split

async function executeSafePublishBatched() {
  // Check for --dry-run flag
  const isDryRun = process.argv.includes('--dry-run');
  
  console.log('\n🚀 EXECUTING SAFE TRANSACTION FOR BASENAMES REGISTRATION (BATCHED)');
  console.log('================================================\n');
  
  if (isDryRun) {
    console.log('⚠️  DRY RUN MODE - No transactions will be executed\n');
  } else {
    console.log('⚠️  WARNING: This will execute a REAL transaction on Base Sepolia!');
  }
  console.log('⚠️  Using MOCK data (no database/IPFS interaction)\n');
  
  console.log('📋 Configuration:');
  console.log(`   Safe Address: ${TEST_SAFE_ADDRESS}`);
  console.log(`   Creator Address: ${TEST_CREATOR_ADDRESS}`);
  console.log(`   Mock Zora Coin: ${TEST_ZORA_COIN_ADDRESS}`);
  console.log(`   Mock Split: ${TEST_SPLIT_ADDRESS}\n`);
  
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    // Step 1: Get next available EROS number
    console.log('Step 1️⃣: Getting next available EROS number...');
    const erosNumber = await getNextEROSNumber();
    const erosLabel = `EROS${erosNumber.toString().padStart(3, '0')}`;
    console.log(`✅ Next EROS number: ${erosNumber} (${erosLabel})\n`);
    
    // Step 2: Create mock release data
    console.log('Step 2️⃣: Creating mock release data...');
    const mockRelease: Release = {
      id: `TEST-${erosLabel}`,
      title: 'Test Release for Basenames Execution (Batched)',
      description: 'This is a test release executed via Safe transaction with batched operations',
      artists: 'Test Artist',
      mediaIPFSHash: 'QmTestMediaHash',
      coverImageIPFSHash: 'QmTestCoverHash',
      metadataURI: 'ipfs://QmTestMetadataHash',
      createdBy: TEST_CREATOR_ADDRESS,
      createdAt: Date.now(),
      status: 'published',
      duration: 180,
    };
    console.log(`✅ Mock release created: ${mockRelease.title}\n`);
    
    // Step 3: Generate Basename registration calldata
    console.log('Step 3️⃣: Generating Basename registration calldata...');
    let basenameCalldata: Array<{ to: string; data: string; value: string }>;
    
    try {
      basenameCalldata = await getENSCompleteCalldata(
        mockRelease,
        TEST_ZORA_COIN_ADDRESS,
        TEST_ZORA_COIN_SYMBOL,
        TEST_SPLIT_ADDRESS,
        TEST_CREATOR_ADDRESS,
        TEST_SAFE_ADDRESS,
        erosNumber
      );
      
      if (!basenameCalldata || basenameCalldata.length === 0) {
        throw new Error('Basename calldata is empty');
      }
      
      console.log(`✅ Basename calldata generated (${basenameCalldata.length} operations)\n`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      errors.push(`Step 3 failed: ${errorMsg}`);
      throw new Error(`Failed to generate Basename calldata: ${errorMsg}`);
    }
    
    // Step 4: Split operations into two transactions
    // Transaction 1: setSubnodeRecord alone (we know this works)
    // Transaction 2: All resolver operations batched together (setAddr + all setText)
    console.log('Step 4️⃣: Splitting operations for Safe transactions...');
    
    const setSubnodeRecordOp = basenameCalldata[0]; // First operation is setSubnodeRecord
    const resolverOps = basenameCalldata.slice(1); // Rest are setAddr + setText operations
    
    // Transaction 1: setSubnodeRecord alone
    const tx1Operations = [setSubnodeRecordOp];
    
    // Transaction 2: All resolver operations batched
    const tx2Operations = resolverOps; // All resolver operations in one batch
    
    console.log(`✅ Split into 2 Safe transactions:`);
    console.log(`   Transaction 1: setSubnodeRecord (creates subname)`);
    console.log(`   Transaction 2: ${tx2Operations.length} resolver operations batched (setAddr + ${tx2Operations.length - 1} setText)\n`);
    
    // Step 5: Final availability check (race condition protection)
    console.log('Step 5️⃣: Final availability check...');
    try {
      const { checkBasenameAvailable } = await import('./check-basename-available');
      const isAvailable = await checkBasenameAvailable(erosLabel);
      if (!isAvailable) {
        throw new Error(`${erosLabel} is no longer available (race condition)`);
      }
      console.log(`✅ ${erosLabel} is still available\n`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      errors.push(`Step 5 failed: ${errorMsg}`);
      throw new Error(`Availability check failed: ${errorMsg}`);
    }
    
    // Step 6: Verify Safe operator authorization
    console.log('Step 6️⃣: Verifying Safe operator authorization...');
    try {
      const { checkOperatorStatus } = await import('./check-operator-status');
      const isAuthorized = await checkOperatorStatus();
      if (!isAuthorized) {
        throw new Error('Safe is not authorized as operator');
      }
      console.log(`✅ Safe is authorized as operator\n`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      warnings.push(`Operator check failed: ${errorMsg}`);
      console.log(`⚠️  Warning: Could not verify operator status: ${errorMsg}\n`);
    }
    
    // Step 7: Execute Safe transactions
    console.log('Step 7️⃣: Executing Safe transactions...');
    console.log('📋 This will:');
    console.log(`   Transaction 1: Register ${erosLabel.toLowerCase()}.scenius.basetest.eth`);
    console.log(`   Transaction 2: Set address record → ${TEST_CREATOR_ADDRESS}`);
    console.log(`                  Set all text records (${tx2Operations.length - 1} records)`);
    console.log(`                  (Reverse record skipped for now)\n`);
    
    if (isDryRun) {
      console.log('✅ DRY RUN: Would execute 2 Safe transactions');
      console.log(`   Transaction 1: ${tx1Operations.length} operation(s)`);
      console.log(`   Transaction 2: ${tx2Operations.length} operation(s) batched\n`);
      return;
    }
    
    // Execute Transaction 1: setSubnodeRecord
    console.log('📦 Executing Transaction 1: setSubnodeRecord...\n');
    const tx1Result = await createAndExecuteSafeTransaction(tx1Operations);
    const tx1Hash = 
      tx1Result?.hash || 
      tx1Result?.transactionResponse?.hash || 
      (tx1Result as any)?.safeTxHash || 
      'UNKNOWN';
    
    if (tx1Hash === 'UNKNOWN') {
      throw new Error('Could not extract transaction hash from Transaction 1');
    }
    
    console.log(`✅ Transaction 1 executed successfully`);
    console.log(`   Hash: ${tx1Hash}`);
    console.log(`   Explorer: https://sepolia.basescan.org/tx/${tx1Hash}\n`);
    
    // Wait a moment for subname creation to be confirmed
    console.log('⏳ Waiting for subname creation to be confirmed...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('✅ Proceeding with Transaction 2...\n');
    
    // Execute Transaction 2: All resolver operations batched
    console.log('📦 Executing Transaction 2: All resolver operations (batched)...\n');
    console.log(`   ⚠️  Executing ${tx2Operations.length} operations in a single Safe transaction\n`);
    
    try {
      const tx2Result = await createAndExecuteSafeTransaction(tx2Operations);
      const tx2Hash = 
        tx2Result?.hash || 
        tx2Result?.transactionResponse?.hash || 
        (tx2Result as any)?.safeTxHash || 
        'UNKNOWN';
      
      if (tx2Hash === 'UNKNOWN') {
        throw new Error('Could not extract transaction hash from Transaction 2');
      }
      
      console.log(`✅ Transaction 2 executed successfully`);
      console.log(`   Hash: ${tx2Hash}`);
      console.log(`   Explorer: https://sepolia.basescan.org/tx/${tx2Hash}\n`);
      
      // Both transactions completed successfully
      console.log('\n================================================');
      console.log('✅ ALL SAFE TRANSACTIONS EXECUTED SUCCESSFULLY');
      console.log('================================================\n');
      console.log(`Transaction 1 (setSubnodeRecord):`);
      console.log(`   Hash: ${tx1Hash}`);
      console.log(`   Explorer: https://sepolia.basescan.org/tx/${tx1Hash}\n`);
      console.log(`Transaction 2 (resolver operations - batched):`);
      console.log(`   Hash: ${tx2Hash}`);
      console.log(`   Operations: ${tx2Operations.length} (setAddr + ${tx2Operations.length - 1} setText)`);
      console.log(`   Explorer: https://sepolia.basescan.org/tx/${tx2Hash}\n`);
      
      console.log(`✅ Basename registered:`);
      console.log(`   ${erosLabel.toLowerCase()}.scenius.basetest.eth`);
      console.log(`✅ Records set:`);
      console.log(`   Address → ${TEST_CREATOR_ADDRESS}`);
      console.log(`   Text records → Mock release data`);
      console.log(`⚠️  Reverse record skipped (can be added later)\n`);
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      errors.push(`Transaction 2 (resolver operations) failed: ${errorMsg}`);
      throw new Error(`Failed to execute resolver operations: ${errorMsg}`);
    }
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    errors.push(`Fatal error: ${errorMsg}`);
    
    console.log('\n================================================');
    console.log('❌ EXECUTION FAILED');
    console.log('================================================\n');
    console.log('📋 Errors encountered:');
    errors.forEach((err, i) => {
      console.log(`   ${i + 1}. ${err}`);
    });
    
    if (warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      warnings.forEach((warn, i) => {
        console.log(`   ${i + 1}. ${warn}`);
      });
    }
    
    console.log('\n💡 AUTHORIZATION ERROR:');
    console.log('   Safe may not be authorized as operator');
    console.log('   Run: npx tsx lib/services/setup-operator.ts --execute\n');
    
    process.exit(1);
  }
}

executeSafePublishBatched().catch(console.error);

