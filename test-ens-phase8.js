#!/usr/bin/env node

/**
 * Phase 8 Test - Create ENS Subname via NameWrapper
 * Run with: node test-ens-phase8.js
 */

require('dotenv').config({ path: '.env.local' });

console.log('\n╔════════════════════════════════════════╗');
console.log('║  Phase 8️⃣: ENS Subname Creation      ║');
console.log('║  Create subname via NameWrapper L1    ║');
console.log('╚════════════════════════════════════════╝\n');

// Get env variables
const parentNode = process.env.ENS_PARENT_NODE;
const subnamePrefix = process.env.ENS_SUBNAME_PREFIX || 'SOMA';
const ensDomain = process.env.ENS_DOMAIN || 'scenedex.eth';

// Validation
console.log('📋 Configuration:');
console.log(`   ENS_DOMAIN: ${ensDomain}`);
console.log(`   ENS_PARENT_NODE: ${parentNode}`);
console.log(`   ENS_SUBNAME_PREFIX: ${subnamePrefix}`);
console.log(`   ENS_RESOLVER_SEPOLIA: ${process.env.ENS_RESOLVER_SEPOLIA}`);
console.log(`   ENS_NAMEWRAPPER_SEPOLIA: ${process.env.ENS_NAMEWRAPPER_SEPOLIA}`);
console.log(`   CURATOR_ADDRESS: ${process.env.CURATOR_ADDRESS}`);
console.log(`   CURATOR_PRIVATE_KEY: ${process.env.CURATOR_PRIVATE_KEY ? '✅ SET' : '❌ NOT SET'}`);
console.log();

if (!parentNode) {
  console.error('❌ ENS_PARENT_NODE not set in .env.local');
  process.exit(1);
}

if (!process.env.CURATOR_PRIVATE_KEY) {
  console.error('❌ CURATOR_PRIVATE_KEY not set in .env.local');
  process.exit(1);
}

if (!process.env.CURATOR_ADDRESS) {
  console.error('❌ CURATOR_ADDRESS not set in .env.local');
  process.exit(1);
}

// Phase 8 Flow
console.log('🚀 Phase 8 Flow:\n');

console.log('STEP 1️⃣: Format subname label');
const subnameNumber = 1;
const subnameLabel = `${subnamePrefix}${String(subnameNumber).padStart(3, '0')}`;
console.log(`   Label: ${subnameLabel}`);
console.log(`   Full: ${subnameLabel}.${ensDomain}\n`);

console.log('STEP 2️⃣: Validate prerequisites');
const checks = [
  { name: 'Parent node provided', value: !!parentNode },
  { name: 'Curator address set', value: !!process.env.CURATOR_ADDRESS },
  { name: 'Curator private key set', value: !!process.env.CURATOR_PRIVATE_KEY },
  { name: 'Resolver configured', value: !!process.env.ENS_RESOLVER_SEPOLIA },
  { name: 'NameWrapper configured', value: !!process.env.ENS_NAMEWRAPPER_SEPOLIA },
];

let allChecked = true;
checks.forEach(({ name, value }) => {
  console.log(`   ${value ? '✅' : '❌'} ${name}`);
  if (!value) allChecked = false;
});

if (!allChecked) {
  console.error('\n❌ Some prerequisites missing');
  process.exit(1);
}

console.log('\nSTEP 3️⃣: Function to call');
console.log(`   createENSSubname(subnameLabel, parentNode)`);
console.log(`   → createENSSubname("${subnameLabel}", "${parentNode}")\n`);

console.log('STEP 4️⃣: What the function will do:\n');
console.log('   1. Validate curator private key & address');
console.log('   2. Initialize viem clients (public + wallet)');
console.log('   3. Calculate 1-year expiry timestamp');
console.log('   4. Simulate setSubnodeRecord call');
console.log('   5. Execute setSubnodeRecord transaction');
console.log('   6. Wait for confirmation');
console.log('   7. Return transaction hash\n');

console.log('STEP 5️⃣: Transaction details');
console.log('   Contract: NameWrapper (Sepolia)');
console.log('   Function: setSubnodeRecord');
console.log('   Parameters:');
console.log(`     - parentNode: ${parentNode}`);
console.log(`     - label: "${subnameLabel}" (string, not hash)`);
console.log(`     - owner: ${process.env.CURATOR_ADDRESS}`);
console.log(`     - resolver: ${process.env.ENS_RESOLVER_SEPOLIA}`);
console.log(`     - ttl: 0`);
console.log(`     - fuses: 0 (parent retains control)`);
console.log(`     - expiry: (1 year from now)\n`);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Ready to run Phase 8');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('✅ All checks passed!');
console.log('✅ Configuration valid');
console.log('✅ Ready for transaction execution\n');

console.log('Next: Run the actual Phase 8 test when ready');
console.log('Command: npx ts-node lib/services/test-ens-phase8-only.ts\n');

// Also show the complete test summary
console.log('Or run the complete ENS analysis:');
console.log('Command: node test-ens-complete.js\n');

process.exit(0);


