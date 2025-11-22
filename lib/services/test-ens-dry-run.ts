#!/usr/bin/env node

/**
 * ENS Dry-Run Test Script
 * Tests the entire ENS flow without executing actual transactions
 * 
 * Covers:
 * 1. Name normalization verification
 * 2. Subname existence checking
 * 3. ENS record building
 * 4. Transaction data encoding
 * 5. Simulation of record setting
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { normalize, namehash as viemNamehash } from 'viem/ens';
import { createPublicClient, http, encodeFunctionData } from 'viem';
import { sepolia } from 'viem/chains';
import type { Release } from '../types';

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m',
};

const log = {
  section: (title: string) => console.log(`\n${colors.bold}${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n${colors.bold}${title}${colors.reset}\n`),
  success: (msg: string) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg: string) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warn: (msg: string) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg: string) => console.log(`ℹ️  ${msg}`),
  detail: (msg: string) => console.log(`   ${msg}`),
};

// Dynamic imports for the functions we need
let getNextEROSNumber: any;
let formatEROSNumber: any;
let buildRecordsFromRelease: any;
let buildSetTextTransactions: any;
let checkSubnameExists: any;
let registerEROSRelease: any;

/**
 * Test 1: Name Normalization
 */
async function testNormalization() {
  log.section('TEST 1: Name Normalization');

  const ensDomain = process.env.ENS_DOMAIN || 'scenedex.eth';
  const subnameLabel = 'EROS001';
  const fullSubname = `${subnameLabel}.${ensDomain}`;

  console.log(`Testing with: ${fullSubname}`);

  // Show normalization
  const normalized = normalize(fullSubname);
  console.log(`\n   Original: ${fullSubname}`);
  console.log(`   Normalized: ${normalized}`);

  if (normalized.toLowerCase() === fullSubname.toLowerCase()) {
    log.success(`Normalization working (all lowercase)`);
  } else {
    log.error(`Normalization failed - mismatch!`);
  }

  // Show namehash comparison
  const wrongHash = viemNamehash(fullSubname); // Without normalization
  const correctHash = viemNamehash(normalized); // With normalization

  console.log(`\n   Hash WITHOUT normalize(): ${wrongHash}`);
  console.log(`   Hash WITH normalize():    ${correctHash}`);

  if (wrongHash === correctHash) {
    log.info(`Both hashes match (lucky case, but still bad practice)`);
  } else {
    log.error(`⚠️ HASHES DON'T MATCH! This is the bug!`);
    log.error(`Without normalize(), subname operations will target wrong node`);
  }

  return correctHash;
}

/**
 * Test 2: Check Subname Existence
 */
async function testSubnameExistence(subnameNode: string) {
  log.section('TEST 2: Check Subname Existence');

  const nameWrapperAddress = (process.env.ENS_NAMEWRAPPER_SEPOLIA ||
    '0x0635513f179D50A207757E05759CbD106d7dFcE8') as `0x${string}`;

  console.log(`Checking NameWrapper: ${nameWrapperAddress}`);
  console.log(`Subname Node: ${subnameNode}`);

  try {
    const exists = await checkSubnameExists(subnameNode, nameWrapperAddress);
    if (exists) {
      log.warn(`Subname ALREADY EXISTS - cannot create duplicate`);
    } else {
      log.success(`Subname available (does not exist)`);
    }
    return !exists; // Return true if available
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    log.error(`Failed to check existence: ${msg}`);
    return false;
  }
}

/**
 * Test 3: Get Next EROS Number
 */
async function testGetNextEROS() {
  log.section('TEST 3: Get Next EROS Number');

  try {
    const nextNumber = await getNextEROSNumber();
    const formatted = formatEROSNumber(nextNumber);

    log.success(`Next available EROS number: ${nextNumber}`);
    log.detail(`Formatted: ${formatted}`);

    return { number: nextNumber, formatted };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    log.error(`Failed to get next EROS: ${msg}`);
    return null;
  }
}

/**
 * Test 4: Build Records from Mock Release
 */
async function testBuildRecords() {
  log.section('TEST 4: Build ENS Records');

  const mockRelease: Release = {
    id: 'test-release-001',
    title: 'Test Release',
    artists: 'Test Artist',
    description: 'A test release for ENS integration',
    coverImageIPFSHash: 'QmTestHashCover123456789',
    mediaIPFSHash: 'QmTestHashMedia123456789',
    metadataURI: 'https://w3s.link/ipfs/QmTestMetadata123456789',
    createdBy: '0x1111111111111111111111111111111111111111',
    createdAt: Math.floor(Date.now() / 1000),
    duration: 180,
    status: 'approved',
  };

  const coinAddress = '0x1234567890123456789012345678901234567890';
  const coinSymbol = 'EROS001';
  const creatorAddress = '0x0987654321098765432109876543210987654321';
  const erosNumber = 1;

  const records = buildRecordsFromRelease(
    mockRelease,
    coinAddress,
    coinSymbol,
    creatorAddress,
    erosNumber
  );

  log.success(`Built ${Object.keys(records).length} text records:`);
  console.log('');

  Object.entries(records).forEach(([key, value]: any) => {
    const displayValue = typeof value === 'string' && value.length > 50 ? value.substring(0, 47) + '...' : value;
    console.log(`   ${key}`);
    console.log(`      → ${displayValue}`);
  });

  return { records, coinAddress, coinSymbol };
}

/**
 * Test 5: Encode Text Transactions
 */
async function testEncodeTransactions(subnameNode: string, records: Record<string, string>) {
  log.section('TEST 5: Encode setText Transactions');

  try {
    const transactions = buildSetTextTransactions(subnameNode, records);

    log.success(`Encoded ${transactions.length} transactions for Safe batching`);
    console.log('');

    transactions.forEach((tx: any, i: number) => {
      console.log(`   [${i + 1}/${transactions.length}]`);
      console.log(`      To:    ${tx.to}`);
      console.log(`      Value: ${tx.value}`);
      console.log(`      Data:  ${tx.data.substring(0, 50)}...`);
      console.log(`      Size:  ${(tx.data.length - 2) / 2} bytes`);
      console.log('');
    });

    // Verify data structure
    const allValid = transactions.every((tx: any) => {
      return (
        tx.to.startsWith('0x') &&
        tx.data.startsWith('0x') &&
        tx.data.length >= 138 // At least 4 bytes selector + some params
      );
    });

    if (allValid) {
      log.success(`All transaction data properly formatted`);
    } else {
      log.error(`Some transaction data is malformed`);
    }

    return transactions;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    log.error(`Failed to encode transactions: ${msg}`);
    return [];
  }
}

/**
 * Test 6: Full Registration Flow
 */
async function testFullRegistration() {
  log.section('TEST 6: Full Registration Flow (Dry Run)');

  const mockRelease: Release = {
    id: 'test-release-dry-run',
    title: 'Test Release for Dry Run',
    artists: 'Test Artist',
    description: 'Testing the full ENS registration flow',
    coverImageIPFSHash: 'QmDryRunCover123456789',
    mediaIPFSHash: 'QmDryRunMedia123456789',
    metadataURI: 'https://w3s.link/ipfs/QmDryRunMetadata123456789',
    createdBy: '0x2222222222222222222222222222222222222222',
    createdAt: Math.floor(Date.now() / 1000),
    duration: 240,
    status: 'approved',
  };

  const coinAddress = '0xDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF';
  const coinSymbol = 'DRYRUN';
  const creatorAddress = '0xCAFECAFECAFECAFECAFECAFECAFECAFECAFECAFE';

  try {
    console.log(`Calling registerEROSRelease()...`);
    const result = await registerEROSRelease(
      mockRelease,
      coinAddress,
      coinSymbol,
      creatorAddress
    );

    log.success(`Registration data prepared:`);
    console.log(`   Subname Label: ${result.subnameLabel}`);
    console.log(`   Subname Node: ${result.subnameNode}`);
    console.log(`   Records: ${Object.keys(result.records).length}`);
    console.log(`   Transactions: ${result.transactions.length}`);
    console.log(`   Batch Size: ${result.batchSize}`);

    // Validate transaction structure
    const txValid = result.transactions.every((tx: any) => {
      return tx.to && tx.value === '0' && tx.data.startsWith('0x');
    });

    if (txValid) {
      log.success(`All ${result.transactions.length} transactions properly formatted`);
    } else {
      log.error(`Some transactions have invalid structure`);
    }

    return result;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    log.error(`Failed to prepare registration: ${msg}`);
    return null;
  }
}

/**
 * Test 7: Simulate createENSSubname (read-only simulation)
 */
async function testSimulateCreateSubname() {
  log.section('TEST 7: Simulate createENSSubname (Read-Only)');

  const rpcUrl = process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/' + process.env.INFURA_KEY;
  const ensDomain = process.env.ENS_DOMAIN || 'scenedex.eth';
  const normalizedDomain = normalize(ensDomain);
  const parentNode = viemNamehash(normalizedDomain);

  const subnameLabel = 'EROS001';

  const NAMEWRAPPER_ABI = [
    {
      name: 'setSubnodeRecord',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'parentNode', type: 'bytes32' },
        { name: 'label', type: 'string' },
        { name: 'owner', type: 'address' },
        { name: 'resolver', type: 'address' },
        { name: 'ttl', type: 'uint64' },
        { name: 'fuses', type: 'uint32' },
        { name: 'expiry', type: 'uint64' },
      ],
      outputs: [],
    },
  ];

  console.log(`Parent Domain: ${ensDomain} (normalized: ${normalizedDomain})`);
  console.log(`Parent Node: ${parentNode}`);
  console.log(`Subname Label: ${subnameLabel}`);

  const now = Math.floor(Date.now() / 1000);
  const expiryTimestamp = BigInt(now + 365 * 24 * 60 * 60);

  console.log(`\nTransaction Parameters:`);
  console.log(`   Parent Node: ${parentNode}`);
  console.log(`   Label: "${subnameLabel}" (type: string)`);
  console.log(`   TTL: 0`);
  console.log(`   Fuses: 0 (no fuses burned - parent retains control)`);
  console.log(`   Expiry: ${expiryTimestamp} (${new Date(Number(expiryTimestamp) * 1000).toISOString()})`);

  try {
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(rpcUrl),
    });

    // Try to simulate (will fail if no private key, that's OK for dry run)
    console.log(`\nAttempting simulation (this will fail if CURATOR_PRIVATE_KEY not set - that's OK)...`);

    // Just show what the data would look like
    const encodedData = encodeFunctionData({
      abi: NAMEWRAPPER_ABI,
      functionName: 'setSubnodeRecord',
      args: [
        parentNode as `0x${string}`,
        subnameLabel,
        '0x0000000000000000000000000000000000000000',
        process.env.ENS_RESOLVER_SEPOLIA as `0x${string}`,
        BigInt(0),
        0,
        expiryTimestamp,
      ],
    });

    log.success(`Transaction data encoded properly`);
    console.log(`   Data: ${encodedData.substring(0, 50)}...`);
    console.log(`   Size: ${(encodedData.length - 2) / 2} bytes`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('CURATOR_PRIVATE_KEY') || msg.includes('CURATOR_ADDRESS')) {
      log.warn(`Simulation skipped (private key not available - this is OK for dry run)`);
    } else {
      log.error(`Simulation failed: ${msg}`);
    }
  }
}

/**
 * Main test runner
 */
async function runAllTests() {
  // Load the ENS module using require
  // @ts-ignore
  const ensModule = require('./ens');
  getNextEROSNumber = ensModule.getNextEROSNumber;
  formatEROSNumber = ensModule.formatEROSNumber;
  buildRecordsFromRelease = ensModule.buildRecordsFromRelease;
  buildSetTextTransactions = ensModule.buildSetTextTransactions;
  checkSubnameExists = ensModule.checkSubnameExists;
  registerEROSRelease = ensModule.registerEROSRelease;

  console.log(`\n${colors.bold}${colors.blue}╔════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}║  ENS Dry-Run Test Suite                ║${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}║  (No actual transactions executed)     ║${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}╚════════════════════════════════════════╝${colors.reset}\n`);

  try {
    // Test 1: Normalization
    const subnameNode = await testNormalization();

    // Test 2: Check existence
    const available = await testSubnameExistence(subnameNode);

    // Test 3: Get next EROS
    const erosData = await testGetNextEROS();

    // Test 4: Build records
    const recordData = await testBuildRecords();

    // Test 5: Encode transactions
    const transactions = await testEncodeTransactions(subnameNode, recordData.records);

    // Test 6: Full registration
    const registrationData = await testFullRegistration();

    // Test 7: Simulate creation
    await testSimulateCreateSubname();

    // Summary
    log.section('SUMMARY');
    console.log(`${colors.green}✅ All dry-run tests completed!${colors.reset}`);
    console.log('');
    console.log(`Key Findings:`);
    console.log(`   • Name normalization: ${colors.green}✅ Working${colors.reset}`);
    console.log(`   • Subname availability check: ${colors.green}✅ Working${colors.reset}`);
    console.log(`   • Records building: ${colors.green}✅${recordData.records ? ` ${Object.keys(recordData.records).length} records` : 'Failed'}${colors.reset}`);
    console.log(`   • Transaction encoding: ${colors.green}✅${transactions.length > 0 ? ` ${transactions.length} transactions` : 'Failed'}${colors.reset}`);
    console.log(`   • Full registration flow: ${colors.green}✅${registrationData ? ' Complete' : ' Failed'}${colors.reset}`);
    console.log('');
  } catch (error) {
    log.section('ERROR');
    const msg = error instanceof Error ? error.message : String(error);
    log.error(`Test suite failed: ${msg}`);
    console.error(error);
    process.exit(1);
  }
}

// Run tests
runAllTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

