/**
 * Test resolver.multicall() alone (without reverse record)
 * This helps isolate if the issue is with multicall or with batching
 * Usage: npx tsx lib/services/test-resolver-multicall.ts
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createPublicClient, http, encodeFunctionData } from 'viem';
import { baseSepolia } from 'viem/chains';
import { namehash, normalize } from 'viem/ens';
import { createAndExecuteSafeTransaction } from './safe-transactions';

const SUBNAME_LABEL = 'eros002';
const PARENT_DOMAIN = 'scenius.basetest.eth';
const RESOLVER = '0x85C87e548091f204C2d0350b39ce1874f02197c6' as `0x${string}`;
const TEST_ADDRESS = process.env.TEST_ARTIST_ADDRESS as `0x${string}` || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

async function testResolverMulticall() {
  console.log(`\n🧪 TESTING RESOLVER.MULTICALL() FROM SAFE`);
  console.log(`================================================\n`);
  
  const normalizedLabel = normalize(SUBNAME_LABEL);
  const fullSubname = `${normalizedLabel}.${PARENT_DOMAIN}`;
  const subnameNode = namehash(fullSubname);
  
  console.log(`Subname: ${fullSubname}`);
  console.log(`Node: ${subnameNode}`);
  console.log(`Resolver: ${RESOLVER}`);
  console.log(`Test Address: ${TEST_ADDRESS}\n`);
  
  // Build multicall data with setAddr + a few setText calls
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
    {
      name: 'setText',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'node', type: 'bytes32' },
        { name: 'key', type: 'string' },
        { name: 'value', type: 'string' },
      ],
      outputs: [],
    },
    {
      name: 'multicall',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'data', type: 'bytes[]' },
      ],
      outputs: [
        { name: 'results', type: 'bytes[]' },
      ],
    },
  ] as const;
  
  const multicallData: `0x${string}`[] = [];
  
  // Add setAddr
  multicallData.push(
    encodeFunctionData({
      abi: RESOLVER_ABI,
      functionName: 'setAddr',
      args: [subnameNode, TEST_ADDRESS],
    })
  );
  console.log(`✅ Added setAddr to multicall`);
  
  // Add a few setText calls (not all 10, just test with 2-3)
  const testRecords = {
    'avatar': 'ipfs://QmTest',
    'description': 'Test description',
  };
  
  for (const [key, value] of Object.entries(testRecords)) {
    multicallData.push(
      encodeFunctionData({
        abi: RESOLVER_ABI,
        functionName: 'setText',
        args: [subnameNode, key, value],
      })
    );
  }
  console.log(`✅ Added ${Object.keys(testRecords).length} setText calls to multicall`);
  console.log(`   Total multicall operations: ${multicallData.length}\n`);
  
  // Create single operation: resolver.multicall()
  const multicallCalldata = encodeFunctionData({
    abi: RESOLVER_ABI,
    functionName: 'multicall',
    args: [multicallData],
  });
  
  const operation = {
    to: RESOLVER,
    data: multicallCalldata,
    value: '0',
  };
  
  try {
    console.log(`📝 Executing resolver.multicall() as single Safe operation...`);
    const result = await createAndExecuteSafeTransaction([operation]);
    
    const txHash = 
      result?.hash || 
      result?.transactionResponse?.hash || 
      (result as any)?.safeTxHash || 
      'UNKNOWN';
    
    console.log(`\n✅ SUCCESS!`);
    console.log(`   Transaction hash: ${txHash}`);
    console.log(`   Explorer: https://sepolia.basescan.org/tx/${txHash}\n`);
    
    // Verify the records were set
    console.log(`🔍 Verifying records were set...`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const addr = await createPublicClient({
      chain: baseSepolia,
      transport: http(process.env.BASE_RPC_URL!),
    }).readContract({
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
    process.exit(1);
  }
}

testResolverMulticall();

