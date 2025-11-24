/**
 * Test setSubnodeRecord directly (not through Safe) to verify operator authorization works
 * Usage: npx tsx lib/services/test-setSubnodeRecord-direct.ts
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createPublicClient, createWalletClient, http, encodeFunctionData } from 'viem';
import { baseSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { namehash, normalize } from 'viem/ens';
import { keccak256, toBytes } from 'viem';

const REGISTRY_ADDRESS = '0x1493b2567056c2181630115660963E13A8E32735' as `0x${string}`;
const RESOLVER = process.env.BASENAMES_UPGRADEABLE_RESOLVER_BASE_SEPOLIA!;
const PARENT_DOMAIN = 'scenius.basetest.eth';
const PARENT_NODE = namehash(PARENT_DOMAIN);
const RPC_URL = process.env.BASE_RPC_URL!;
const CURATOR_PRIVATE_KEY = process.env.CURATOR_PRIVATE_KEY!;
const SAFE_ADDRESS = process.env.SAFE_ADDRESS!;

async function testDirect() {
  console.log(`\n🧪 TESTING setSubnodeRecord DIRECTLY`);
  console.log(`================================================\n`);
  
  const account = privateKeyToAccount(CURATOR_PRIVATE_KEY as `0x${string}`);
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(RPC_URL),
  });
  const walletClient = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(RPC_URL),
  });
  
  console.log(`Curator: ${account.address}`);
  console.log(`Safe: ${SAFE_ADDRESS}`);
  console.log(`Parent: ${PARENT_DOMAIN}`);
  console.log(`Parent Node: ${PARENT_NODE}\n`);
  
  // Step 1: Verify operator authorization
  console.log(`Step 1️⃣: Verifying operator authorization...`);
  const isApproved = await publicClient.readContract({
    address: REGISTRY_ADDRESS,
    abi: [{
      name: 'isApprovedForAll',
      type: 'function',
      stateMutability: 'view',
      inputs: [
        { name: 'owner', type: 'address' },
        { name: 'operator', type: 'address' },
      ],
      outputs: [{ type: 'bool' }],
    }],
    functionName: 'isApprovedForAll',
    args: [account.address, SAFE_ADDRESS],
  });
  
  console.log(`   Operator authorized: ${isApproved ? '✅ Yes' : '❌ No'}\n`);
  
  if (!isApproved) {
    console.error(`❌ Safe is not authorized as operator!`);
    console.error(`   Run: npx tsx lib/services/setup-operator.ts --execute`);
    process.exit(1);
  }
  
  // Step 2: Test setSubnodeRecord as curator (should work)
  console.log(`Step 2️⃣: Testing setSubnodeRecord as curator (direct call)...`);
  const testLabel = 'testdirect';
  const normalizedLabel = normalize(testLabel);
  const labelHash = keccak256(toBytes(normalizedLabel));
  const fullSubname = `${normalizedLabel}.${PARENT_DOMAIN}`;
  const subnameNode = namehash(fullSubname);
  
  console.log(`   Label: ${normalizedLabel}`);
  console.log(`   Label Hash: ${labelHash}`);
  console.log(`   Full Subname: ${fullSubname}`);
  console.log(`   Subname Node: ${subnameNode}\n`);
  
  // Check if it already exists
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
      console.log(`   ⚠️  Subname already exists, owner: ${existingOwner}`);
      console.log(`   Skipping test.\n`);
      return;
    }
  } catch (e) {
    // Continue
  }
  
  // Try to call setSubnodeRecord
  const REGISTRY_ABI = [{
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
  }] as const;
  
  try {
    console.log(`   Simulating setSubnodeRecord...`);
    await publicClient.simulateContract({
      account,
      address: REGISTRY_ADDRESS,
      abi: REGISTRY_ABI,
      functionName: 'setSubnodeRecord',
      args: [
        PARENT_NODE,
        labelHash,
        SAFE_ADDRESS as `0x${string}`,
        RESOLVER as `0x${string}`,
        0n,
      ],
    });
    console.log(`   ✅ Simulation passed\n`);
    
    console.log(`   Executing setSubnodeRecord...`);
    const txHash = await walletClient.writeContract({
      address: REGISTRY_ADDRESS,
      abi: REGISTRY_ABI,
      functionName: 'setSubnodeRecord',
      args: [
        PARENT_NODE,
        labelHash,
        SAFE_ADDRESS as `0x${string}`,
        RESOLVER as `0x${string}`,
        0n,
      ],
    });
    
    console.log(`   ✅ Transaction sent: ${txHash}`);
    console.log(`   📊 Explorer: https://sepolia.basescan.org/tx/${txHash}\n`);
    
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
    if (receipt.status === 'success') {
      console.log(`   ✅ Transaction confirmed!`);
      console.log(`   Block: ${receipt.blockNumber}\n`);
      
      // Verify subname was created
      const owner = await publicClient.readContract({
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
      
      console.log(`   ✅ Subname owner: ${owner}`);
      if (owner.toLowerCase() === SAFE_ADDRESS.toLowerCase()) {
        console.log(`   ✅ Subname created successfully!\n`);
      }
    }
  } catch (error) {
    console.error(`   ❌ Failed: ${error}`);
    if (error instanceof Error) {
      console.error(`   Error message: ${error.message}`);
    }
    process.exit(1);
  }
}

testDirect();

