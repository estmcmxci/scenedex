/**
 * Check Operator Status
 * 
 * Verifies if Safe is authorized as operator for curator's names
 * 
 * Usage:
 *   npx tsx lib/services/check-operator-status.ts
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

// Registry contract address (Base Sepolia)
const REGISTRY_ADDRESS = '0x1493b2567056c2181630115660963E13A8E32735' as `0x${string}`;

// Get environment variables
const CURATOR_ADDRESS = process.env.CURATOR_ADDRESS as `0x${string}`;
const SAFE_ADDRESS = process.env.SAFE_ADDRESS as `0x${string}`;
const BASE_RPC_URL = process.env.BASE_RPC_URL;

if (!CURATOR_ADDRESS) {
  console.error('❌ CURATOR_ADDRESS not set in .env.local');
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

// Registry ABI for isApprovedForAll
const REGISTRY_ABI = [
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

async function checkOperatorStatus() {
  console.log('\n🔍 CHECKING OPERATOR STATUS');
  console.log('================================================\n');

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(BASE_RPC_URL),
  });

  console.log('📋 Configuration:');
  console.log(`   Curator Address: ${CURATOR_ADDRESS}`);
  console.log(`   Safe Address: ${SAFE_ADDRESS}`);
  console.log(`   Registry: ${REGISTRY_ADDRESS}`);
  console.log(`   Network: Base Sepolia\n`);

  try {
    console.log('🔍 Querying contract...');
    const isApproved = await publicClient.readContract({
      address: REGISTRY_ADDRESS,
      abi: REGISTRY_ABI,
      functionName: 'isApprovedForAll',
      args: [CURATOR_ADDRESS, SAFE_ADDRESS],
    });

    console.log('\n================================================');
    if (isApproved) {
      console.log('✅ OPERATOR IS AUTHORIZED');
      console.log('================================================\n');
      console.log('The Safe can create subnames under scenius.basetest.eth');
      console.log('and any other names owned by the curator.\n');
    } else {
      console.log('❌ OPERATOR IS NOT AUTHORIZED');
      console.log('================================================\n');
      console.log('The Safe is NOT authorized as operator.');
      console.log('Run: npx tsx lib/services/setup-operator.ts --execute\n');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('\n❌ ERROR CHECKING STATUS');
    console.error('================================================');
    console.error(`Error: ${errorMessage}`);
    console.error('================================================\n');
    process.exit(1);
  }
}

// Run the check
if (import.meta.url === `file://${process.argv[1]}`) {
  checkOperatorStatus()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

