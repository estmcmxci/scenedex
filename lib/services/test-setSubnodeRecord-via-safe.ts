/**
 * Test setSubnodeRecord through Safe (single operation, not batched)
 * This will help us determine if the issue is with batching or with Safe execution
 * Usage: npx tsx lib/services/test-setSubnodeRecord-via-safe.ts
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createPublicClient, http, encodeFunctionData, keccak256, toBytes } from 'viem';
import { baseSepolia } from 'viem/chains';
import { namehash, normalize } from 'viem/ens';
import { createAndExecuteSafeTransaction } from './safe-transactions';

const PARENT_DOMAIN = 'scenius.basetest.eth';
const PARENT_NODE = namehash(PARENT_DOMAIN);
const REGISTRY_ADDRESS = '0x1493b2567056c2181630115660963E13A8E32735' as `0x${string}`;
const RESOLVER = process.env.BASENAMES_UPGRADEABLE_RESOLVER_BASE_SEPOLIA!;
const SAFE_ADDRESS = process.env.SAFE_ADDRESS!;
const RPC_URL = process.env.BASE_RPC_URL!;

async function testViaSafe() {
  console.log(`\n🧪 TESTING setSubnodeRecord THROUGH SAFE (SINGLE OPERATION)`);
  console.log(`================================================\n`);
  
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(RPC_URL),
  });
  
  // Use a unique test label
  const testLabel = `testsafe${Date.now()}`;
  const normalizedLabel = normalize(testLabel);
  const labelHash = keccak256(toBytes(normalizedLabel));
  const fullSubname = `${normalizedLabel}.${PARENT_DOMAIN}`;
  const subnameNode = namehash(fullSubname);
  
  console.log(`Test Label: ${normalizedLabel}`);
  console.log(`Label Hash: ${labelHash}`);
  console.log(`Full Subname: ${fullSubname}`);
  console.log(`Subname Node: ${subnameNode}`);
  console.log(`Safe Address: ${SAFE_ADDRESS}`);
  console.log(`Parent Node: ${PARENT_NODE}\n`);
  
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
      console.log(`⚠️  Subname already exists, owner: ${existingOwner}`);
      console.log(`   Skipping test.\n`);
      return;
    }
  } catch (e) {
    // Continue
  }
  
  // Create calldata for setSubnodeRecord
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
  
  const calldata = encodeFunctionData({
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
  
  console.log(`📋 Calldata: ${calldata.substring(0, 100)}...\n`);
  
  // Execute through Safe (single operation, not batched)
  console.log(`🚀 Executing setSubnodeRecord through Safe (single operation)...\n`);
  
  try {
    const operations = [{
      to: REGISTRY_ADDRESS,
      data: calldata,
      value: '0',
      operation: 0, // Explicitly set to CALL (0)
    }];
    
    const result = await createAndExecuteSafeTransaction(operations);
    
    const txHash = (result as any)?.hash || (result as any)?.transactionResponse?.hash;
    console.log(`\n✅ Transaction executed: ${txHash}`);
    console.log(`   Explorer: https://sepolia.basescan.org/tx/${txHash}\n`);
    
    // Wait a bit and check if subname was created
    await new Promise(resolve => setTimeout(resolve, 3000));
    
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
    
    if (owner.toLowerCase() === SAFE_ADDRESS.toLowerCase()) {
      console.log(`✅ SUCCESS! Subname created through Safe`);
      console.log(`   Owner: ${owner}\n`);
      console.log(`💡 This means setSubnodeRecord works through Safe when NOT batched`);
      console.log(`   The issue is likely with how multi-send batches operations.\n`);
    } else {
      console.log(`❌ Subname not created or wrong owner`);
      console.log(`   Owner: ${owner}\n`);
    }
  } catch (error) {
    console.error(`❌ Failed: ${error}`);
    if (error instanceof Error) {
      console.error(`   Error message: ${error.message}\n`);
    }
    
    // Check if subname was created despite the error
    try {
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
      
      if (owner !== '0x0000000000000000000000000000000000000000') {
        console.log(`⚠️  Subname was created despite error: ${owner}`);
      }
    } catch (e) {
      // Ignore
    }
  }
}

testViaSafe();

