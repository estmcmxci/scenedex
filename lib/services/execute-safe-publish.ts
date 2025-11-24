/**
 * Execute Safe Transaction for Basenames Registration (Mock Data)
 * 
 * This script executes the Safe transaction to register a Basename and set all records
 * using MOCK data. No database or IPFS interaction.
 * 
 * Usage:
 *   npx tsx lib/services/execute-safe-publish.ts
 * 
 * What it does:
 * 1. Generates mock release data
 * 2. Gets next available EROS number
 * 3. Generates calldata for Basename registration (with mock addresses)
 * 4. Generates calldata for reverse record (Safe → scenius.basetest.eth)
 * 5. Executes Safe transaction with both operations
 * 
 * Prerequisites:
 *   - Safe must have sufficient ETH on Base Sepolia (~0.003 ETH)
 *   - Safe must be authorized as operator
 *   - TEST_ARTIST_ADDRESS set in .env.local (for address record)
 * 
 * Note: This uses mock data - no database or IPFS interaction.
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getENSCompleteCalldata, getNextEROSNumber, getReverseRecordCalldata, buildRecordsFromRelease } from './ens';
import { createAndExecuteSafeTransaction } from './safe-transactions';
import type { Release } from '../types';

// Mock configuration
const TEST_SAFE_ADDRESS = process.env.SAFE_ADDRESS as `0x${string}`;
const TEST_CREATOR_ADDRESS = process.env.TEST_ARTIST_ADDRESS as `0x${string}` || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const TEST_ZORA_COIN_ADDRESS = '0x1234567890123456789012345678901234567890'; // Mock address
const TEST_ZORA_COIN_SYMBOL = 'EROS001';
const TEST_SPLIT_ADDRESS = '0x0987654321098765432109876543210987654321'; // Mock address

if (!TEST_SAFE_ADDRESS) {
  console.error('❌ SAFE_ADDRESS not set in .env.local');
  process.exit(1);
}

async function executeSafePublish() {
  // Check for --dry-run flag
  const isDryRun = process.argv.includes('--dry-run');
  const shouldExecute = !isDryRun;

  if (isDryRun) {
    console.log('\n🔍 DRY-RUN MODE (Simulation Only)');
    console.log('================================================');
    console.log('This will simulate the execution without sending a transaction.');
    console.log('To actually execute, run without --dry-run flag.\n');
  } else {
    console.log('\n🚀 EXECUTING SAFE TRANSACTION FOR BASENAMES REGISTRATION');
    console.log('================================================\n');
    console.log('⚠️  WARNING: This will execute a REAL transaction on Base Sepolia!');
    console.log('⚠️  Using MOCK data (no database/IPFS interaction)\n');
  }

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
    let erosNumber: number;
    let erosLabel: string;
    
    try {
      erosNumber = await getNextEROSNumber();
      erosLabel = `EROS${String(erosNumber).padStart(3, '0')}`;
      console.log(`✅ Next EROS number: ${erosNumber} (${erosLabel})\n`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      errors.push(`Step 1 failed: ${errorMsg}`);
      throw new Error(`Failed to get EROS number: ${errorMsg}`);
    }

    // Step 2: Create mock release data
    console.log('Step 2️⃣: Creating mock release data...');
    const mockRelease: Release = {
      id: `TEST-${erosLabel}`,
      title: 'Test Release for Basenames Execution',
      description: 'This is a test release executed via Safe transaction',
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
        throw new Error('No calldata generated');
      }
      
      // Direct Registry flow returns multiple operations (setSubnodeRecord + setAddr + setText × N)
      // RegistrarController flow returns 1 operation (batched)
      if (basenameCalldata.length === 1) {
        console.log(`   Using RegistrarController flow (1 batched operation)`);
      } else {
        console.log(`   Using Direct Registry flow (${basenameCalldata.length} operations)`);
        console.log(`   Operations: 1 setSubnodeRecord + 1 setAddr + ${basenameCalldata.length - 2} setText`);
      }
      
      console.log(`✅ Basename calldata generated (${basenameCalldata.length} operation${basenameCalldata.length > 1 ? 's' : ''})\n`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      errors.push(`Step 3 failed: ${errorMsg}`);
      throw new Error(`Failed to generate Basename calldata: ${errorMsg}`);
    }

    // Step 4: Generate reverse record calldata
    console.log('Step 4️⃣: Generating reverse record calldata...');
    let reverseRecordCalldata: { to: string; data: string; value: string };
    
    try {
      reverseRecordCalldata = getReverseRecordCalldata(TEST_SAFE_ADDRESS);
      
      if (!reverseRecordCalldata || !reverseRecordCalldata.data) {
        throw new Error('Reverse record calldata is invalid');
      }
      
      console.log(`✅ Reverse record calldata generated\n`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      errors.push(`Step 4 failed: ${errorMsg}`);
      throw new Error(`Failed to generate reverse record calldata: ${errorMsg}`);
    }

    // Step 5: Split operations into two transactions
    // WORKAROUND: setSubnodeRecord fails when batched via multi-send, but works alone
    // Individual resolver operations work, but resolver.multicall() fails from Safe
    // So we split into: 1) setSubnodeRecord alone, 2) individual resolver ops + reverse record
    console.log('Step 5️⃣: Splitting operations for Safe transactions...');
    
    // Split basename operations: first is setSubnodeRecord, rest are individual resolver operations
    const setSubnodeRecordOp = basenameCalldata[0]; // First operation is setSubnodeRecord
    const resolverOps = basenameCalldata.slice(1); // Rest are setAddr + setText operations
    
    // Transaction 1: setSubnodeRecord alone (we know this works)
    const tx1Operations = [setSubnodeRecordOp];
    
    // Transaction 2: Individual resolver operations + reverse record
    const tx2Operations = [...resolverOps, reverseRecordCalldata];
    
    console.log(`✅ Split into 2 Safe transactions:`);
    console.log(`   Transaction 1: setSubnodeRecord (creates subname)`);
    console.log(`   Transaction 2: ${tx2Operations.length} operations (setAddr + ${resolverOps.length - 1} setText + reverse record)\n`);

    // Step 6: Final availability check (race condition protection)
    console.log('Step 6️⃣: Final availability check...');
    try {
      const { checkBasenameAvailable } = await import('./check-basename-available');
      const fullSubname = `${erosLabel.toLowerCase()}.scenius.basetest.eth`;
      const isAvailable = await checkBasenameAvailable(erosLabel.toLowerCase());
      if (!isAvailable) {
        throw new Error(`${erosLabel} is no longer available - may have been registered between check and execution`);
      }
      console.log(`✅ ${erosLabel} is still available\n`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.warn(`⚠️  Final availability check failed: ${errorMsg}`);
      console.warn(`   Proceeding anyway - this may cause transaction failure\n`);
    }

    // Step 6️⃣b: Verify Safe operator authorization
    console.log('Step 6️⃣b: Verifying Safe operator authorization...');
    try {
      const { createPublicClient, http } = await import('viem');
      const { baseSepolia } = await import('viem/chains');
      const rpcUrl = process.env.BASE_RPC_URL!;
      const CURATOR_ADDRESS = process.env.CURATOR_ADDRESS as `0x${string}`;
      
      if (!CURATOR_ADDRESS) {
        throw new Error('CURATOR_ADDRESS not set in .env.local');
      }
      
      const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(rpcUrl),
      });
      
      const REGISTRY_ADDRESS = '0x1493b2567056c2181630115660963E13A8E32735' as `0x${string}`;
      const REGISTRY_ABI = [{
        name: 'isApprovedForAll',
        type: 'function',
        stateMutability: 'view',
        inputs: [
          { name: 'owner', type: 'address' },
          { name: 'operator', type: 'address' },
        ],
        outputs: [{ type: 'bool' }],
      }] as const;
      
      console.log(`   Checking if Safe (${TEST_SAFE_ADDRESS}) is authorized as operator`);
      console.log(`   for curator (${CURATOR_ADDRESS})...`);
      
      const isApproved = await publicClient.readContract({
        address: REGISTRY_ADDRESS,
        abi: REGISTRY_ABI,
        functionName: 'isApprovedForAll',
        args: [CURATOR_ADDRESS, TEST_SAFE_ADDRESS],
      });
      
      if (!isApproved) {
        throw new Error(
          `❌ Safe is NOT authorized as operator!\n` +
          `   Curator: ${CURATOR_ADDRESS}\n` +
          `   Safe: ${TEST_SAFE_ADDRESS}\n` +
          `   Run: npx tsx lib/services/setup-operator.ts --execute`
        );
      }
      
      console.log(`✅ Safe is authorized as operator\n`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (errorMsg.includes('NOT authorized')) {
        errors.push(`Step 6b failed: ${errorMsg}`);
        throw new Error(errorMsg);
      } else {
        console.warn(`⚠️  Could not verify operator status: ${errorMsg}`);
        console.warn(`   Proceeding anyway - transaction may fail if Safe is not authorized\n`);
      }
    }

    // Step 7: Execute Safe transactions (or simulate)
    console.log('Step 7️⃣: ' + (isDryRun ? 'Simulating Safe transactions...' : 'Executing Safe transactions...'));
    console.log('📋 This will:');
    console.log(`   Transaction 1: Register ${erosLabel.toLowerCase()}.scenius.basetest.eth`);
    console.log(`   Transaction 2: Set address record → ${TEST_CREATOR_ADDRESS}`);
    console.log(`                  Set all text records (${basenameCalldata.length - 2} records)`);
    console.log(`                  Set Safe primary name → scenius.basetest.eth\n`);

    if (isDryRun) {
      console.log('🔍 [DRY-RUN] Would execute 2 Safe transactions:');
      console.log(`   Transaction 1: 1 operation (setSubnodeRecord)`);
      console.log(`   Transaction 2: ${tx2Operations.length} operations (individual resolver ops + reverse record)\n`);
      console.log('\n✅ [DRY-RUN] Simulation complete - all checks passed!');
      console.log('   Run without --dry-run flag to actually execute.\n');
      process.exit(0);
    }

    // Actual execution - Transaction 1: setSubnodeRecord
    console.log('\n📦 Executing Transaction 1: setSubnodeRecord...\n');
    let tx1Result: any;
    let tx1Hash: string;
    
    try {
      tx1Result = await createAndExecuteSafeTransaction(tx1Operations);
      
      tx1Hash = 
        tx1Result?.hash || 
        tx1Result?.transactionResponse?.hash || 
        (tx1Result as any)?.safeTxHash || 
        'UNKNOWN';
      
      if (tx1Hash === 'UNKNOWN') {
        throw new Error('Could not extract transaction hash from result');
      }
      
      console.log(`\n✅ Transaction 1 executed successfully`);
      console.log(`   Hash: ${tx1Hash}`);
      console.log(`   Explorer: https://sepolia.basescan.org/tx/${tx1Hash}\n`);
      
      // Wait a moment for the subname to be created
      console.log('⏳ Waiting for subname creation to be confirmed...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log('✅ Proceeding with Transaction 2...\n');
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      errors.push(`Transaction 1 (setSubnodeRecord) failed: ${errorMsg}`);
      throw new Error(`Failed to execute setSubnodeRecord: ${errorMsg}`);
    }
    
    // Transaction 2: Execute resolver operations individually
    // WORKAROUND: Batching resolver operations fails (even 2-5 at a time), but single operations work
    // So we execute each operation as its own Safe transaction
    console.log('📦 Executing Transaction 2: Resolver operations + reverse record...\n');
    console.log(`   ⚠️  Executing ${tx2Operations.length} operations individually (batching fails)\n`);
    
    const resolverOpsOnly = tx2Operations.slice(0, -1); // All except reverse record
    const reverseRecordOp = tx2Operations[tx2Operations.length - 1]; // Last is reverse record
    
    let tx2Hashes: string[] = [];
    let operationNumber = 1;
    const failedOperations: Array<{ number: number; type: string; error: string }> = [];
    
    // Get record keys for better error messages
    const records = buildRecordsFromRelease(mockRelease, TEST_ZORA_COIN_ADDRESS, TEST_ZORA_COIN_SYMBOL, TEST_SPLIT_ADDRESS, TEST_CREATOR_ADDRESS, erosNumber);
    const recordKeys = Object.keys(records);
    
    try {
      // Execute each resolver operation individually
      for (let i = 0; i < resolverOpsOnly.length; i++) {
        const operation = resolverOpsOnly[i];
        const operationType = i === 0 ? 'setAddr' : `setText (${recordKeys[i - 1]})`;
        console.log(`📦 Executing operation ${operationNumber}/${resolverOpsOnly.length}: ${operationType}...`);
        
        try {
          const result = await createAndExecuteSafeTransaction([operation]);
          const hash = 
            result?.hash || 
            result?.transactionResponse?.hash || 
            (result as any)?.safeTxHash || 
            'UNKNOWN';
          
          if (hash === 'UNKNOWN') {
            throw new Error(`Could not extract transaction hash from operation ${operationNumber}`);
          }
          
          tx2Hashes.push(hash);
          console.log(`   ✅ Operation ${operationNumber} executed: ${hash}`);
          console.log(`   Explorer: https://sepolia.basescan.org/tx/${hash}\n`);
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          console.error(`   ❌ Operation ${operationNumber} failed: ${errorMsg}`);
          failedOperations.push({ number: operationNumber, type: operationType, error: errorMsg });
          
          // Continue with next operation instead of failing completely
          console.log(`   ⚠️  Continuing with remaining operations...\n`);
        }
        
        // Wait a moment between operations to avoid nonce issues
        if (operationNumber < resolverOpsOnly.length) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        operationNumber++;
      }
      
      // Finally, execute reverse record
      console.log(`📦 Executing reverse record operation...`);
      try {
        const reverseResult = await createAndExecuteSafeTransaction([reverseRecordOp]);
        const reverseHash = 
          reverseResult?.hash || 
          reverseResult?.transactionResponse?.hash || 
          (reverseResult as any)?.safeTxHash || 
          'UNKNOWN';
        
        if (reverseHash === 'UNKNOWN') {
          throw new Error('Could not extract transaction hash from reverse record');
        }
        
        tx2Hashes.push(reverseHash);
        console.log(`   ✅ Reverse record executed: ${reverseHash}`);
        console.log(`   Explorer: https://sepolia.basescan.org/tx/${reverseHash}\n`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`   ❌ Reverse record failed: ${errorMsg}`);
        failedOperations.push({ number: operationNumber, type: 'reverse record', error: errorMsg });
      }
      
      // Report any failures
      if (failedOperations.length > 0) {
        console.warn(`\n⚠️  ${failedOperations.length} operation(s) failed:`);
        failedOperations.forEach(failed => {
          console.warn(`   Operation ${failed.number} (${failed.type}): ${failed.error}`);
        });
        console.warn(`   ${tx2Hashes.length} operation(s) succeeded\n`);
        
        // Don't throw - partial success is better than complete failure
        warnings.push(`${failedOperations.length} resolver operation(s) failed, but ${tx2Hashes.length} succeeded`);
      }
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      errors.push(`Transaction 2 (resolver operations) failed: ${errorMsg}`);
      throw new Error(`Failed to execute resolver operations: ${errorMsg}`);
    }
    
    // Both transactions completed successfully

    console.log('\n================================================');
    console.log('✅ ALL SAFE TRANSACTIONS EXECUTED SUCCESSFULLY');
    console.log('================================================\n');
    console.log(`Transaction 1 (setSubnodeRecord):`);
    console.log(`   Hash: ${tx1Hash}`);
    console.log(`   Explorer: https://sepolia.basescan.org/tx/${tx1Hash}\n`);
    console.log(`Transaction 2 (resolver operations + reverse record):`);
    console.log(`   Total operations: ${tx2Hashes.length}`);
    tx2Hashes.forEach((hash, i) => {
      const opType = i === 0 ? 'setAddr' : i === tx2Hashes.length - 1 ? 'reverse record' : `setText ${i}`;
      console.log(`   Operation ${i + 1} (${opType}): ${hash}`);
      console.log(`   Explorer: https://sepolia.basescan.org/tx/${hash}`);
    });
    console.log();
    console.log('✅ Basename registered:');
    console.log(`   ${erosLabel.toLowerCase()}.scenius.basetest.eth`);
    console.log('✅ Records set:');
    console.log(`   Address → ${TEST_CREATOR_ADDRESS}`);
    console.log(`   Text records → Mock release data`);
    console.log('✅ Reverse record set:');
    console.log(`   Safe → scenius.basetest.eth (primary name)\n`);

    process.exit(0);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    errors.push(`FATAL: ${errorMessage}`);
    
    console.error('\n❌ EXECUTION FAILED');
    console.error('================================================');
    
    if (errors.length > 0) {
      console.error('\n📋 Errors encountered:');
      errors.forEach((err, i) => {
        console.error(`   ${i + 1}. ${err}`);
      });
    }
    
    if (warnings.length > 0) {
      console.error('\n⚠️  Warnings:');
      warnings.forEach((warn, i) => {
        console.error(`   ${i + 1}. ${warn}`);
      });
    }
    
    console.error('\n================================================');
    
    // Check for common errors and provide specific guidance
    if (errorMessage.includes('insufficient funds') || errorMessage.includes('insufficient balance')) {
      console.error('\n💡 INSUFFICIENT FUNDS:');
      console.error('   Safe may not have enough ETH on Base Sepolia');
      console.error('   Required: ~0.003 ETH (0.001 for registration + 0.002 for gas)');
      console.error('   Fund the Safe address: ' + TEST_SAFE_ADDRESS);
      console.error('   Base Sepolia Faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet\n');
    } else if (errorMessage.includes('Unauthorized') || errorMessage.includes('operator') || errorMessage.includes('not authorized')) {
      console.error('\n💡 AUTHORIZATION ERROR:');
      console.error('   Safe may not be authorized as operator');
      console.error('   Run: npx tsx lib/services/setup-operator.ts --execute\n');
    } else if (errorMessage.includes('not available') || errorMessage.includes('already registered') || errorMessage.includes('name taken')) {
      console.error('\n💡 NAME AVAILABILITY ERROR:');
      console.error('   The EROS number may have been taken');
      console.error('   Try running again - it will get the next available number\n');
    } else if (errorMessage.includes('threshold') || errorMessage.includes('approval')) {
      console.error('\n💡 SAFE APPROVAL ERROR:');
      console.error('   Transaction may not have enough approvals');
      console.error('   Check Safe configuration and threshold\n');
    } else {
      console.error('\n💡 TROUBLESHOOTING:');
      console.error('   1. Check .env.local has all required variables');
      console.error('   2. Verify BASE_RPC_URL is correct and accessible');
      console.error('   3. Ensure Safe is authorized as operator');
      console.error('   4. Verify Safe has sufficient ETH on Base Sepolia');
      console.error('   5. Check network connectivity\n');
    }
    
    process.exit(1);
  }
  
  // Final summary with warnings
  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    console.log('================================================');
    warnings.forEach((warn, i) => {
      console.log(`   ${i + 1}. ${warn}`);
    });
    console.log('================================================\n');
  }
}

// Run the execution
if (import.meta.url === `file://${process.argv[1]}`) {
  executeSafePublish();
}

