/**
 * Quick diagnostic script to check if a subname was created
 * Usage: npx tsx lib/services/check-subname-created.ts eros001
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { namehash, normalize } from 'viem/ens';

const SUBNAME_LABEL = process.argv[2] || 'eros001';
const PARENT_DOMAIN = 'scenius.basetest.eth';
const REGISTRY_ADDRESS = '0x1493b2567056c2181630115660963E13A8E32735' as `0x${string}`;
const RPC_URL = process.env.BASE_RPC_URL!;

async function checkSubname() {
  console.log(`\n🔍 CHECKING IF SUBNAME WAS CREATED`);
  console.log(`================================================\n`);
  
  const normalizedLabel = normalize(SUBNAME_LABEL);
  const fullSubname = `${normalizedLabel}.${PARENT_DOMAIN}`;
  const subnameNode = namehash(fullSubname);
  
  console.log(`Subname: ${fullSubname}`);
  console.log(`Node: ${subnameNode}\n`);
  
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(RPC_URL),
  });
  
  try {
    // Check if subname exists by querying Registry.owner()
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
    
    if (owner === '0x0000000000000000000000000000000000000000') {
      console.log(`❌ Subname does NOT exist`);
      console.log(`   Owner: ${owner}`);
      console.log(`\n💡 This means Registry.setSubnodeRecord() FAILED`);
      console.log(`   The failure is in operation #1 (setSubnodeRecord)`);
    } else {
      console.log(`✅ Subname EXISTS!`);
      console.log(`   Owner: ${owner}`);
      console.log(`\n💡 This means Registry.setSubnodeRecord() SUCCEEDED`);
      console.log(`   The failure is in a later operation:`);
      console.log(`   - Operation #2: Resolver.setAddr()`);
      console.log(`   - Operations #3-12: Resolver.setText() × 10`);
      console.log(`   - Operation #13: ReverseRegistrar.setNameForAddr()`);
    }
    
    // Also check resolver
    try {
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
      
      console.log(`\n📋 Resolver: ${resolver}`);
      if (resolver === '0x0000000000000000000000000000000000000000') {
        console.log(`   ⚠️  No resolver set`);
      }
    } catch (e) {
      console.log(`   ⚠️  Could not check resolver: ${e}`);
    }
    
  } catch (error) {
    console.error(`❌ Error checking subname: ${error}`);
    process.exit(1);
  }
}

checkSubname();

