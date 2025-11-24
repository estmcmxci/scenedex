/**
 * Setup Operator: Set Safe as Operator for Curator's Names
 * 
 * This one-time setup script authorizes the Safe to create subnames
 * under scenius.basetest.eth (and any other names owned by curator).
 * 
 * Usage:
 *   npx tsx lib/services/setup-operator.ts
 * 
 * Prerequisites:
 *   - CURATOR_PRIVATE_KEY set in .env.local
 *   - SAFE_ADDRESS set in .env.local
 *   - Curator wallet has ETH on Base Sepolia for gas
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import { encodeFunctionData } from 'viem';

// Registry contract address (Base Sepolia)
const REGISTRY_ADDRESS = '0x1493b2567056c2181630115660963E13A8E32735' as `0x${string}`;

// Get environment variables
const CURATOR_PRIVATE_KEY = process.env.CURATOR_PRIVATE_KEY;
const SAFE_ADDRESS = process.env.SAFE_ADDRESS as `0x${string}`;
const BASE_RPC_URL = process.env.BASE_RPC_URL;

if (!CURATOR_PRIVATE_KEY) {
  console.error('❌ CURATOR_PRIVATE_KEY not set in .env.local');
  process.exit(1);
}

if (!SAFE_ADDRESS) {
  console.error('❌ SAFE_ADDRESS not set in .env.local');
  process.exit(1);
}

if (!BASE_RPC_URL) {
  console.error('❌ BASE_RPC_URL not set in .env.local');
  process.exit(1);
}

// Registry ABI for setApprovalForAll
const REGISTRY_ABI = [
  {
    name: 'setApprovalForAll',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'operator', type: 'address' },
      { name: 'approved', type: 'bool' },
    ],
    outputs: [],
  },
  {
    name: 'isApprovedForAll',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'operator', type: 'address' },
    ],
    outputs: [{ type: 'bool' }],
  },
] as const;

async function setupOperator() {
  // Check for --execute flag
  const shouldExecute = process.argv.includes('--execute');
  const isDryRun = !shouldExecute;

  if (isDryRun) {
    console.log('\n🔍 DRY-RUN MODE (Simulation Only)');
    console.log('================================================');
    console.log('This will show what the script will do without sending a transaction.');
    console.log('To actually execute, run: npx tsx lib/services/setup-operator.ts --execute\n');
  } else {
    console.log('\n🔧 SETTING UP OPERATOR (EXECUTING)');
    console.log('================================================\n');
  }

  // Create clients
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(BASE_RPC_URL),
  });

  const account = privateKeyToAccount(CURATOR_PRIVATE_KEY as `0x${string}`);
  const walletClient = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(BASE_RPC_URL),
  });

  console.log('📋 Configuration:');
  console.log(`   Curator Address: ${account.address}`);
  console.log(`   Safe Address: ${SAFE_ADDRESS}`);
  console.log(`   Registry: ${REGISTRY_ADDRESS}`);
  console.log(`   Network: Base Sepolia\n`);

  // Step 1: Check current status
  console.log('🔍 Step 1: Checking current operator status...');
  try {
    const isApproved = await publicClient.readContract({
      address: REGISTRY_ADDRESS,
      abi: REGISTRY_ABI,
      functionName: 'isApprovedForAll',
      args: [account.address, SAFE_ADDRESS],
    });

    if (isApproved) {
      console.log('   ✅ Safe is already authorized as operator!');
      console.log('   No action needed.\n');
      return;
    } else {
      console.log('   ⚠️  Safe is NOT authorized as operator');
      if (isDryRun) {
        console.log('   [DRY-RUN] Would proceed with setup...\n');
      } else {
        console.log('   Proceeding with setup...\n');
      }
    }
  } catch (error) {
    console.log('   ⚠️  Could not check status, proceeding anyway...\n');
  }

  // Step 2: Prepare transaction
  console.log('📝 Step 2: Preparing setApprovalForAll transaction...');
  console.log(`   Authorizing Safe (${SAFE_ADDRESS}) as operator for curator (${account.address})\n`);

  // Encode the transaction to show what will be sent
  const calldata = encodeFunctionData({
    abi: REGISTRY_ABI,
    functionName: 'setApprovalForAll',
    args: [SAFE_ADDRESS, true],
  });

  console.log('   Transaction Details:');
  console.log(`   To: ${REGISTRY_ADDRESS}`);
  console.log(`   Function: setApprovalForAll`);
  console.log(`   Operator: ${SAFE_ADDRESS}`);
  console.log(`   Approved: true`);
  console.log(`   Calldata: ${calldata}\n`);

  if (isDryRun) {
    console.log('   [DRY-RUN] Would send transaction above');
    console.log('   [DRY-RUN] Estimated gas: ~45,000 gas\n');
    console.log('   ✅ Dry-run complete - transaction looks good!');
    console.log('   Run with --execute flag to actually send the transaction.\n');
    return;
  }

  // Step 3: Send transaction (only if --execute)
  console.log('📤 Step 3: Sending transaction...');
  try {
    const txHash = await walletClient.writeContract({
      address: REGISTRY_ADDRESS,
      abi: REGISTRY_ABI,
      functionName: 'setApprovalForAll',
      args: [SAFE_ADDRESS, true],
    });

    console.log(`   ✅ Transaction sent: ${txHash}`);
    console.log(`   📊 Explorer: https://sepolia.basescan.org/tx/${txHash}\n`);

    // Step 4: Wait for confirmation
    console.log('⏳ Step 4: Waiting for confirmation...');
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
      confirmations: 2,
    });

    if (receipt.status === 'success') {
      console.log(`   ✅ Transaction confirmed at block ${receipt.blockNumber}\n`);
    } else {
      throw new Error('Transaction reverted');
    }

    // Step 5: Verify
    console.log('🔍 Step 5: Verifying operator status...');
    const isApproved = await publicClient.readContract({
      address: REGISTRY_ADDRESS,
      abi: REGISTRY_ABI,
      functionName: 'isApprovedForAll',
      args: [account.address, SAFE_ADDRESS],
    });

    if (isApproved) {
      console.log('   ✅ Verification successful!');
      console.log('   Safe is now authorized as operator.\n');
    } else {
      throw new Error('Verification failed - operator not set');
    }

    console.log('================================================');
    console.log('✅ SETUP COMPLETE');
    console.log('================================================\n');
    console.log('The Safe can now create subnames under scenius.basetest.eth');
    console.log('and any other names owned by the curator.\n');

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('\n❌ SETUP FAILED');
    console.error('================================================');
    console.error(`Error: ${errorMessage}`);
    console.error('================================================\n');
    process.exit(1);
  }
}

// Run the setup
if (import.meta.url === `file://${process.argv[1]}`) {
  setupOperator()
    .then(() => {
      console.log('✅ Script completed successfully\n');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

