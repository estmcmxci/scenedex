import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { namehash } from 'viem/ens';
import { encodeAbiParameters } from 'viem';

const ENS_DOMAIN = process.env.ENS_DOMAIN || 'scenedex.eth';
const ENS_PARENT_NODE = process.env.ENS_PARENT_NODE!;
const ENS_RESOLVER = process.env.ENS_RESOLVER_SEPOLIA!;

async function testENSInfrastructure() {
  console.log('\n🧪 Testing ENS Infrastructure...\n');

  try {
    // Test 1: Calculate namehash for parent domain
    console.log('Test 1: Calculate parent domain namehash');
    const calculatedParentNode = namehash(ENS_DOMAIN);
    console.log(`   Expected: ${ENS_PARENT_NODE}`);
    console.log(`   Calculated: ${calculatedParentNode}`);
    
    if (calculatedParentNode === ENS_PARENT_NODE) {
      console.log('   ✅ Parent node hash matches!\n');
    } else {
      console.log('   ❌ Mismatch! Check ENS_PARENT_NODE in .env\n');
      process.exit(1);
    }

    // Test 2: Calculate subname namehash
    console.log('Test 2: Calculate subname namehash for EROS001');
    const subnameNode = namehash(`EROS001.${ENS_DOMAIN}`);
    console.log(`   EROS001.${ENS_DOMAIN}`);
    console.log(`   Node: ${subnameNode}\n`);

    // Test 3: Build a sample setText transaction
    console.log('Test 3: Build sample setText transaction');
    const sampleTx = {
      to: ENS_RESOLVER,
      value: '0n' as any,
      data: encodeAbiParameters(
        [{ type: 'bytes32' }, { type: 'string' }, { type: 'string' }],
        [subnameNode, 'eth.scenedex.releaseId', 'EROS001']
      ),
    };
    console.log(`   Transaction target: ${sampleTx.to}`);
    console.log(`   Data (first 66 chars): ${(sampleTx.data as string).slice(0, 66)}...\n`);

    console.log('✅ All infrastructure tests passed!\n');
    console.log('Ready to implement registerEROSRelease() function.\n');
    
  } catch (error) {
    console.error('❌ Infrastructure test failed:');
    console.error(error);
    process.exit(1);
  }
}

testENSInfrastructure();