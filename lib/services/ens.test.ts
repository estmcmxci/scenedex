import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { 
  formatEROSNumber, 
  buildRecordsFromRelease, 
  buildSetTextTransactions 
} from './ens';
import type { Release } from '../types';

// ============================================================================
// ENS Unit Tests - Dry Run (No Transactions)
// ============================================================================

const tests: { name: string; fn: () => void | Promise<void> }[] = [];
let passed = 0;
let failed = 0;

function test(name: string, fn: () => void | Promise<void>) {
  tests.push({ name, fn });
}

function assertEqual(actual: any, expected: any, message: string) {
  if (actual !== expected) {
    throw new Error(`${message}\n  Expected: ${expected}\n  Got: ${actual}`);
  }
}

function assertExists(value: any, message: string) {
  if (!value) {
    throw new Error(`${message} - value does not exist`);
  }
}

function assertArrayLength(arr: any[], length: number, message: string) {
  if (!Array.isArray(arr) || arr.length !== length) {
    throw new Error(`${message}\n  Expected length: ${length}\n  Got length: ${arr?.length || 'N/A'}`);
  }
}

// ============================================================================
// Test Suite
// ============================================================================

test('formatEROSNumber: formats number 1 as EROS001', () => {
  const result = formatEROSNumber(1);
  assertEqual(result, 'EROS001', 'Format failed for 1');
});

test('formatEROSNumber: formats number 42 as EROS042', () => {
  const result = formatEROSNumber(42);
  assertEqual(result, 'EROS042', 'Format failed for 42');
});

test('formatEROSNumber: formats number 999 as EROS999', () => {
  const result = formatEROSNumber(999);
  assertEqual(result, 'EROS999', 'Format failed for 999');
});

test('buildRecordsFromRelease: creates text records with correct keys', () => {
  const mockRelease: Release = {
    id: 'test-001',
    title: 'Test Release',
    description: 'A test release',
    mediaIPFSHash: 'QmTestMedia',
    coverImageIPFSHash: 'QmTestCover',
    metadataURI: 'https://example.com/metadata',
    artists: 'Test Artist',
    duration: 180,
    createdBy: '0x1234567890123456789012345678901234567890',
    createdAt: Math.floor(Date.now() / 1000),
    status: 'approved',
  };

  const records = buildRecordsFromRelease(
    mockRelease,
    '0xCoinAddress1234567890123456789012345678',
    'EROS001',
    '0xCreator1234567890123456789012345678901234',
    1
  );

  // Check key records exist
  assertExists(records.avatar, 'avatar record missing');
  assertExists(records.description, 'description record missing');
  assertExists(records.address, 'address record missing');
  assertEqual(records['eth.scenedex.releaseId'], 'EROS001', 'releaseId mismatch');
});

test('buildRecordsFromRelease: avatar uses ipfs:// prefix', () => {
  const mockRelease: Release = {
    id: 'test-002',
    title: 'Test',
    description: 'Test',
    mediaIPFSHash: 'QmMedia123',
    coverImageIPFSHash: 'QmCover456',
    createdBy: '0x1111111111111111111111111111111111111111',
    createdAt: 1234567890,
    duration: 100,
    status: 'approved',
  };

  const records = buildRecordsFromRelease(
    mockRelease,
    '0x1111111111111111111111111111111111111111',
    'TEST',
    '0x2222222222222222222222222222222222222222',
    1
  );

  if (!records.avatar.startsWith('ipfs://')) {
    throw new Error(`Avatar should start with ipfs:// but got: ${records.avatar}`);
  }
});

test('buildSetTextTransactions: encodes transactions with proper structure', () => {
  const mockRecords = {
    'test.key1': 'value1',
    'test.key2': 'value2',
    'test.key3': 'value3',
  };

  const subnameNode = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
  const transactions = buildSetTextTransactions(subnameNode, mockRecords);

  // Should have one transaction per record
  assertArrayLength(transactions, 3, 'Transaction count mismatch');

  // Each transaction should have proper structure
  transactions.forEach((tx, i) => {
    assertExists(tx.to, `Transaction ${i} missing 'to' field`);
    assertExists(tx.value, `Transaction ${i} missing 'value' field`);
    assertExists(tx.data, `Transaction ${i} missing 'data' field`);

    assertEqual(tx.value, '0', `Transaction ${i} value should be '0'`);

    if (!tx.data.startsWith('0x')) {
      throw new Error(`Transaction ${i} data should start with 0x`);
    }

    // Should be at least 138 bytes (4 byte selector + params)
    const dataBytes = (tx.data.length - 2) / 2;
    if (dataBytes < 100) {
      throw new Error(`Transaction ${i} data too short: ${dataBytes} bytes`);
    }
  });
});

test('buildSetTextTransactions: data includes function selector', () => {
  const records = { 'email': 'test@example.com' };
  const node = '0x' + '0'.repeat(64);
  
  const [tx] = buildSetTextTransactions(node, records);
  
  // setText function selector is 0x10f13a8c
  if (!tx.data.startsWith('0x10f13a8c')) {
    throw new Error(`Expected setText selector 0x10f13a8c but got: ${tx.data.substring(0, 10)}`);
  }
});

test('buildSetTextTransactions: handles multiple records', () => {
  const records: Record<string, string> = {};
  for (let i = 0; i < 10; i++) {
    records[`key${i}`] = `value${i}`;
  }

  const node = '0x' + '0'.repeat(64);
  const transactions = buildSetTextTransactions(node, records);

  assertArrayLength(transactions, 10, 'Should create one transaction per record');
});

test('buildSetTextTransactions: all transactions have same resolver address', () => {
  const records = {
    'key1': 'value1',
    'key2': 'value2',
  };

  const node = '0x' + '0'.repeat(64);
  const transactions = buildSetTextTransactions(node, records);

  const resolverAddress = transactions[0].to;
  
  transactions.forEach((tx, i) => {
    assertEqual(tx.to, resolverAddress, `Transaction ${i} has different resolver address`);
  });
});

// ============================================================================
// Test Runner
// ============================================================================

async function runTests() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║  ENS Unit Tests - Dry Run              ║');
  console.log('╚════════════════════════════════════════╝\n');

  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${name}`);
      const msg = error instanceof Error ? error.message : String(error);
      console.log(`   ${msg}`);
      failed++;
    }
  }

  console.log(`\n╔════════════════════════════════════════╗`);
  console.log(`║  Results                              ║`);
  console.log(`╚════════════════════════════════════════╝\n`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total:  ${tests.length}\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});


