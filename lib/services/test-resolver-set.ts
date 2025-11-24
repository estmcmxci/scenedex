/**
 * Test setting a single resolver record from Safe
 * This helps isolate if the issue is with batching or authorization
 * Usage: npx tsx lib/services/test-resolver-set.ts
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createPublicClient, http, encodeFunctionData } from 'viem';
import { baseSepolia } from 'viem/chains';
import { namehash, normalize } from 'viem/ens';
import { createAndExecuteSafeTransaction } from './safe-transactions';

const SUBNAME_LABEL = 'eros001';
const PARENT_DOMAIN = 'scenius.basetest.eth';
const RESOLVER = '0x85C87e548091f204C2d0350b39ce1874f02197c6' as `0x${string}`;
const TEST_ADDRESS = process.env.TEST_ARTIST_ADDRESS as `0x${string}` || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

async function testResolverSet() {
  console.log(`\n🧪 TESTING SINGLE RESOLVER OPERATION FROM SAFE`);
  console.log(`================================================\n`);
  
  const normalizedLabel = normalize(SUBNAME_LABEL);
  const fullSubname = `${normalizedLabel}.${PARENT_DOMAIN}`;
  const subnameNode = namehash(fullSubname);
  
  console.log(`Subname: ${fullSubname}`);
  console.log(`Node: ${subnameNode}`);
  console.log(`Resolver: ${RESOLVER}`);
  console.log(`Test Address: ${TEST_ADDRESS}\n`);
  
  // Test 1: Try setting address record
  console.log(`📝 Test 1: Setting address record (setAddr)...`);
  
  const RESOLVER_ABI = [
    {
      name: 'setAddr',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'node', type: 'bytes32' },
        { name: 'addr', type: 'address' },
      ],
      outputs: [],
    },
  ] as const;
  
  const setAddrCalldata = encodeFunctionData({
    abi: RESOLVER_ABI,
    functionName: 'setAddr',
    args: [subnameNode, TEST_ADDRESS],
  });
  
  const operation = {
    to: RESOLVER,
    data: setAddrCalldata,
    value: '0',
  };
  
  try {
    console.log(`   Executing Safe transaction...`);
    const result = await createAndExecuteSafeTransaction([operation]);
    
    const txHash = 
      result?.hash || 
      result?.transactionResponse?.hash || 
      (result as any)?.safeTxHash || 
      'UNKNOWN';
    
    console.log(`\n✅ SUCCESS!`);
    console.log(`   Transaction hash: ${txHash}`);
    console.log(`   Explorer: https://sepolia.basescan.org/tx/${txHash}\n`);
    
    // Verify the record was set
    console.log(`🔍 Verifying record was set...`);
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(process.env.BASE_RPC_URL!),
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const addr = await publicClient.readContract({
      address: RESOLVER,
      abi: RESOLVER_ABI,
      functionName: 'addr',
      args: [subnameNode],
    });
    
    if (addr.toLowerCase() === TEST_ADDRESS.toLowerCase()) {
      console.log(`   ✅ Address record verified: ${addr}`);
    } else {
      console.log(`   ⚠️  Address mismatch:`);
      console.log(`      Expected: ${TEST_ADDRESS}`);
      console.log(`      Got: ${addr}`);
    }
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`\n❌ FAILED: ${errorMsg}\n`);
    
    if (errorMsg.includes('NotAuthorized') || errorMsg.includes('Unauthorized')) {
      console.error(`💡 AUTHORIZATION ERROR:`);
      console.error(`   The Safe may not be authorized to set records on this resolver.`);
      console.error(`   The resolver checks if msg.sender (Safe) is the owner of the node.`);
      console.error(`   Let's verify the Safe is the owner...\n`);
      
      const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(process.env.BASE_RPC_URL!),
      });
      
      const REGISTRY = '0x1493b2567056c2181630115660963E13A8E32735' as `0x${string}`;
      const SAFE_ADDRESS = process.env.SAFE_ADDRESS as `0x${string}`;
      
      const owner = await publicClient.readContract({
        address: REGISTRY,
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
      
      console.log(`   Registry owner: ${owner}`);
      console.log(`   Safe address: ${SAFE_ADDRESS}`);
      console.log(`   Match: ${owner.toLowerCase() === SAFE_ADDRESS.toLowerCase() ? '✅ Yes' : '❌ No'}`);
      
      if (owner.toLowerCase() !== SAFE_ADDRESS.toLowerCase()) {
        console.error(`\n   ❌ OWNER MISMATCH!`);
        console.error(`      The Safe is not the owner of the subname.`);
        console.error(`      This explains why resolver operations fail.`);
      }
    }
    
    process.exit(1);
  }
}

testResolverSet();

