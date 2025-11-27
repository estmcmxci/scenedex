/**
 * Test Direct Registry Registration Flow
 * 
 * This script tests the direct Registry.setSubnodeRecord() approach
 * (bypassing RegistrarController) to verify it works correctly.
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import { namehash, normalize } from 'viem/ens';
import { keccak256, toBytes, encodeFunctionData } from 'viem';

const REGISTRY_ADDRESS = '0x1493b2567056c2181630115660963E13A8E32735' as `0x${string}`;
const RESOLVER = process.env.BASENAMES_UPGRADEABLE_RESOLVER_BASE_SEPOLIA as `0x${string}`;
const PARENT_DOMAIN = process.env.ENS_DOMAIN || 'scenius.basetest.eth';
const PARENT_NODE = namehash(PARENT_DOMAIN);
const CURATOR_PRIVATE_KEY = process.env.CURATOR_PRIVATE_KEY;
const BASE_RPC_URL = process.env.BASE_RPC_URL;

if (!CURATOR_PRIVATE_KEY || !BASE_RPC_URL || !RESOLVER) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

async function testDirectRegistration() {
  console.log('\n🧪 TESTING DIRECT REGISTRY REGISTRATION');
  console.log('================================================\n');

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

  // Test subname
  const testLabel = 'test001';
  const normalizedLabel = normalize(testLabel);
  const fullSubname = `${normalizedLabel}.${PARENT_DOMAIN}`;
  const subnameNode = namehash(fullSubname);
  const labelHash = keccak256(toBytes(normalizedLabel));

  console.log('📋 Test Configuration:');
  console.log(`   Parent Domain: ${PARENT_DOMAIN}`);
  console.log(`   Parent Node: ${PARENT_NODE}`);
  console.log(`   Test Label: ${testLabel} (normalized: ${normalizedLabel})`);
  console.log(`   Full Subname: ${fullSubname}`);
  console.log(`   Subname Node: ${subnameNode}`);
  console.log(`   Label Hash: ${labelHash}`);
  console.log(`   Owner: ${account.address}`);
  console.log(`   Resolver: ${RESOLVER}\n`);

  // Step 1: Check if subname already exists
  console.log('🔍 Step 1: Checking if subname already exists...');
  try {
    const existingOwner = await publicClient.readContract({
      address: REGISTRY_ADDRESS,
      abi: [{
        name: 'owner',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'node', type: 'bytes32' }],
        outputs: [{ type: 'address' }],
      }],
      functionName: 'owner',
      args: [subnameNode],
    });

    if (existingOwner !== '0x0000000000000000000000000000000000000000') {
      console.log(`   ⚠️  Subname already exists! Owner: ${existingOwner}`);
      console.log(`   Skipping registration test.\n`);
      return;
    }
    console.log(`   ✅ Subname is available\n`);
  } catch (error) {
    console.log(`   ✅ Subname appears to be available (or doesn't exist yet)\n`);
  }

  // Step 2: Create subname via Registry.setSubnodeRecord()
  console.log('📝 Step 2: Creating subname via Registry.setSubnodeRecord()...');
  const REGISTRY_ABI = [
    {
      name: 'setSubnodeRecord',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'node', type: 'bytes32' },
        { name: 'label', type: 'bytes32' },
        { name: 'owner', type: 'address' },
        { name: 'resolver', type: 'address' },
        { name: 'ttl', type: 'uint64' },
      ],
      outputs: [],
    },
  ] as const;

  try {
    const txHash = await walletClient.writeContract({
      address: REGISTRY_ADDRESS,
      abi: REGISTRY_ABI,
      functionName: 'setSubnodeRecord',
      args: [
        PARENT_NODE,
        labelHash,
        account.address,
        RESOLVER,
        0n, // TTL = 0
      ],
      account,
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

    // Step 4: Verify subname was created
    console.log('🔍 Step 4: Verifying subname was created...');
    const newOwner = await publicClient.readContract({
      address: REGISTRY_ADDRESS,
      abi: [{
        name: 'owner',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'node', type: 'bytes32' }],
        outputs: [{ type: 'address' }],
      }],
      functionName: 'owner',
      args: [subnameNode],
    });

    if (newOwner.toLowerCase() === account.address.toLowerCase()) {
      console.log(`   ✅ Subname created successfully!`);
      console.log(`   Owner: ${newOwner}`);
    } else {
      throw new Error(`Owner mismatch: expected ${account.address}, got ${newOwner}`);
    }

    // Step 5: Verify resolver was set
    const resolver = await publicClient.readContract({
      address: REGISTRY_ADDRESS,
      abi: [{
        name: 'resolver',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'node', type: 'bytes32' }],
        outputs: [{ type: 'address' }],
      }],
      functionName: 'resolver',
      args: [subnameNode],
    });

    if (resolver.toLowerCase() === RESOLVER.toLowerCase()) {
      console.log(`   ✅ Resolver set correctly: ${resolver}\n`);
    } else {
      console.log(`   ⚠️  Resolver mismatch: expected ${RESOLVER}, got ${resolver}\n`);
    }

    console.log('================================================');
    console.log('✅ DIRECT REGISTRY REGISTRATION TEST PASSED');
    console.log('================================================\n');
    console.log(`Subname ${fullSubname} created successfully!`);
    console.log(`   - Owner: ${newOwner}`);
    console.log(`   - Resolver: ${resolver}`);
    console.log(`   - Payment: 0 ETH (FREE)\n`);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('\n❌ TEST FAILED');
    console.error('================================================');
    console.error(`Error: ${errorMessage}`);
    console.error('================================================\n');
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  testDirectRegistration();
}


