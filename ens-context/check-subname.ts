#!/usr/bin/env node

import { createPublicClient, http, getContract } from 'viem';
import { sepolia } from 'viem/chains';
import { config } from './config.js';
import { SEPOLIA_ADDRESSES, NAME_WRAPPER_ABI } from './contracts.js';
import { getNamehash } from './utils.js';

/**
 * Diagnostic script to check detailed subname state
 */
async function checkSubname() {
  console.log('\n🔍 Subname State Diagnostic');
  console.log('━'.repeat(80));

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(config.rpcUrl),
  });

  const fullSubname = `${config.subnamePrefix}.${config.parentName}`;
  const subnameNode = getNamehash(fullSubname);
  const tokenId = BigInt(subnameNode);

  console.log(`\n📛 Checking: ${fullSubname}`);
  console.log(`🔑 Token ID: ${tokenId}`);
  console.log(`🔑 Node Hash: ${subnameNode}`);
  console.log('');

  const nameWrapper = getContract({
    address: SEPOLIA_ADDRESSES.NameWrapper,
    abi: [
      ...NAME_WRAPPER_ABI,
      {
        inputs: [{ name: 'id', type: 'uint256' }],
        name: 'getData',
        outputs: [
          { name: 'owner', type: 'address' },
          { name: 'fuses', type: 'uint32' },
          { name: 'expiry', type: 'uint64' }
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    client: publicClient,
  });

  try {
    // Try to get the owner
    console.log('[1] Checking Owner...');
    try {
      const owner = await nameWrapper.read.ownerOf([tokenId]) as `0x${string}`;
      console.log(`✅ Owner: ${owner}`);
      
      if (owner === '0x0000000000000000000000000000000000000000') {
        console.log('✅ Owner is ZERO ADDRESS - subname DOES NOT EXIST (available to create)');
      } else {
        console.log('⚠️  Subname already exists and is owned by above address');
      }
    } catch (error) {
      console.log('✅ ownerOf() reverted - subname does not exist (available)');
    }

    // Try to get full data
    console.log('\n[2] Checking Full Data (owner, fuses, expiry)...');
    try {
      const data = await nameWrapper.read.getData([tokenId]) as [string, number, bigint];
      const [owner, fuses, expiry] = data;
      
      console.log(`✅ Owner: ${owner}`);
      console.log(`✅ Fuses: ${fuses}`);
      console.log(`✅ Expiry: ${expiry} (${expiry > 0 ? new Date(Number(expiry) * 1000).toISOString() : 'No expiry'})`);
      
      if (expiry > 0 && BigInt(Math.floor(Date.now() / 1000)) > expiry) {
        console.log('⚠️  Subname has EXPIRED!');
      }
    } catch (error) {
      console.log('❌ getData() reverted');
      console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    }

  } catch (error) {
    console.log('❌ Failed to check subname state');
    console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
  }

  console.log('\n━'.repeat(80));
  console.log('💡 Recommendations:');
  console.log('');
  
  console.log('If owner is 0x0:');
  console.log('  → Subname is AVAILABLE - you can create it!');
  console.log('  → Run: npm run create');
  console.log('');
  
  console.log('If owner is another address:');
  console.log('  → Subname already exists - choose a different prefix');
  console.log('  → Or check if you control that owner address');
  console.log('');
  console.log('━'.repeat(80));
  console.log('\n');
}

checkSubname().catch((error) => {
  console.error('\n❌ Error:', error);
  process.exit(1);
});

