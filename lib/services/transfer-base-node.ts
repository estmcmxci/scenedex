/**
 * Transfer Base Node Ownership to BaseRegistrar
 * 
 * This script transfers ownership of scenius.basetest.eth from the curator
 * to the BaseRegistrar contract. This is REQUIRED for the RegistrarController
 * to be able to create subnames.
 * 
 * Usage:
 *   npx tsx lib/services/transfer-base-node.ts --execute
 * 
 * Prerequisites:
 *   - CURATOR_PRIVATE_KEY set in .env.local
 *   - BASENAMES_BASE_REGISTRAR_BASE_SEPOLIA set in .env.local
 *   - Curator wallet has ETH on Base Sepolia for gas
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import { namehash } from 'viem/ens';
import { encodeFunctionData } from 'viem';

// Registry contract address (Base Sepolia)
const REGISTRY_ADDRESS = '0x1493b2567056c2181630115660963E13A8E32735' as `0x${string}`;
const PARENT_DOMAIN = process.env.ENS_DOMAIN || 'scenius.basetest.eth';

// Get environment variables
const CURATOR_PRIVATE_KEY = process.env.CURATOR_PRIVATE_KEY;
const BASE_REGISTRAR = process.env.BASENAMES_BASE_REGISTRAR_BASE_SEPOLIA as `0x${string}`;
const BASE_RPC_URL = process.env.BASE_RPC_URL;

if (!CURATOR_PRIVATE_KEY) {
  console.error('❌ CURATOR_PRIVATE_KEY not set in .env.local');
  process.exit(1);
}

if (!BASE_REGISTRAR) {
  console.error('❌ BASENAMES_BASE_REGISTRAR_BASE_SEPOLIA not set in .env.local');
  process.exit(1);
}

if (!BASE_RPC_URL) {
  console.error('❌ BASE_RPC_URL not set in .env.local');
  process.exit(1);
}

// Registry ABI for setOwner
const REGISTRY_ABI = [
  {
    name: 'setOwner',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'node', type: 'bytes32' },
      { name: 'owner', type: 'address' },
    ],
    outputs: [],
  },
  {
    name: 'owner',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'node', type: 'bytes32' }],
    outputs: [{ type: 'address' }],
  },
] as const;

async function transferBaseNode() {
  // Check for --execute flag
  const shouldExecute = process.argv.includes('--execute');
  const isDryRun = !shouldExecute;

  if (isDryRun) {
    console.log('\n🔍 DRY-RUN MODE (Simulation Only)');
    console.log('================================================');
    console.log('This will show what the script will do without sending a transaction.');
    console.log('To actually execute, run: npx tsx lib/services/transfer-base-node.ts --execute\n');
  } else {
    console.log('\n🔧 TRANSFERRING BASE NODE OWNERSHIP (EXECUTING)');
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
  console.log(`   BaseRegistrar: ${BASE_REGISTRAR}`);
  console.log(`   Domain: ${PARENT_DOMAIN}`);
  console.log(`   Registry: ${REGISTRY_ADDRESS}`);
  console.log(`   Network: Base Sepolia\n`);

  // Step 1: Check current ownership
  console.log('🔍 Step 1: Checking current ownership...');
  const parentNode = namehash(PARENT_DOMAIN);
  
  try {
    const currentOwner = await publicClient.readContract({
      address: REGISTRY_ADDRESS,
      abi: REGISTRY_ABI,
      functionName: 'owner',
      args: [parentNode],
    });

    console.log(`   Current owner: ${currentOwner}`);
    console.log(`   Expected owner: ${BASE_REGISTRAR}`);
    
    if (currentOwner.toLowerCase() === BASE_REGISTRAR.toLowerCase()) {
      console.log('   ✅ BaseRegistrar already owns the domain!');
      console.log('   No action needed.\n');
      return;
    } else {
      console.log(`   ⚠️  Current owner is NOT BaseRegistrar`);
      if (isDryRun) {
        console.log('   [DRY-RUN] Would proceed with transfer...\n');
      } else {
        console.log('   Proceeding with transfer...\n');
      }
    }
  } catch (error) {
    console.log('   ⚠️  Could not check ownership, proceeding anyway...\n');
  }

  if (isDryRun) {
    console.log('📝 Step 2: [DRY-RUN] Would send setOwner transaction...');
    console.log(`   [DRY-RUN] Transferring ${PARENT_DOMAIN} from curator to BaseRegistrar\n`);
    console.log('   [DRY-RUN] Transaction would be sent here.\n');
    console.log('================================================');
    console.log('✅ DRY-RUN COMPLETE');
    console.log('================================================\n');
    console.log('After transfer, BaseRegistrar will be able to create subnames');
    console.log('via the RegistrarController.\n');
    return;
  }

  // Step 2: Send transaction
  console.log('📝 Step 2: Sending setOwner transaction...');
  console.log(`   Transferring ${PARENT_DOMAIN} from curator to BaseRegistrar\n`);

  try {
    const txHash = await walletClient.writeContract({
      address: REGISTRY_ADDRESS,
      abi: REGISTRY_ABI,
      functionName: 'setOwner',
      args: [parentNode, BASE_REGISTRAR],
    });

    console.log(`   ✅ Transaction sent: ${txHash}`);
    console.log(`   📊 Explorer: https://sepolia.basescan.org/tx/${txHash}\n`);

    // Step 3: Wait for confirmation
    console.log('⏳ Step 3: Waiting for confirmation...');
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
      confirmations: 2,
    });

    if (receipt.status === 'success') {
      console.log(`   ✅ Transaction confirmed at block ${receipt.blockNumber}\n`);
    } else {
      throw new Error('Transaction reverted');
    }

    // Step 4: Verify
    console.log('🔍 Step 4: Verifying ownership transfer...');
    const newOwner = await publicClient.readContract({
      address: REGISTRY_ADDRESS,
      abi: REGISTRY_ABI,
      functionName: 'owner',
      args: [parentNode],
    });

    if (newOwner.toLowerCase() === BASE_REGISTRAR.toLowerCase()) {
      console.log('   ✅ Verification successful!');
      console.log(`   BaseRegistrar now owns ${PARENT_DOMAIN}\n`);
    } else {
      throw new Error(`Verification failed - owner is ${newOwner}, expected ${BASE_REGISTRAR}`);
    }

    console.log('================================================');
    console.log('✅ TRANSFER COMPLETE');
    console.log('================================================\n');
    console.log('BaseRegistrar can now create subnames via RegistrarController.');
    console.log('You can now retry the Basename registration.\n');

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('\n❌ TRANSFER FAILED');
    console.error('================================================');
    console.error(`Error: ${errorMessage}`);
    console.error('================================================\n');
    process.exit(1);
  }
}

// Run the transfer
if (import.meta.url === `file://${process.argv[1]}`) {
  transferBaseNode()
    .then(() => {
      console.log('✅ Script completed successfully\n');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

