import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import type { Release } from '../types';
import { registerEROSRelease } from './ens';

async function testENSStandalone() {
  console.log('\n🧪 Testing ENS Service with Mock Release...\n');

  // Mock release data
  const mockRelease: Release = {
    id: 'PDA-001-xyz',
    title: 'Test Release',
    description: 'A test release for EROS ENS',
    mediaIPFSHash: 'bafybeigyelay5wbodkt6lhqq4ep5ptho4tzuexlazaqyz3o4henjnuhzii',
    coverImageIPFSHash: 'bafybeidbxkyox7l2xmqdovj5i5yuthhin6qal4yev7lb7jvnozf2tvvl54',
    metadataURI: 'bafybeiefr4aizxdxsv36wc4n4el56zrldq6cvoj7slw6z4kb7slnn7pe2y',
    artists: 'm580',
    duration: 253,
    createdBy: '0x1234567890123456789012345678901234567890',
    createdAt: Date.now(),
    status: 'pending',
  };

  const coinAddress = '0x96a958ef265b4129bd578fcc22054030b7bed8ae';
  const coinSymbol = 'EROS'; // Coin symbol from Zora deployment

  try {
    // Call registerEROSRelease
    const result = await registerEROSRelease(mockRelease, coinAddress, coinSymbol, mockRelease.createdBy);

    console.log('✅ registerEROSRelease() succeeded!\n');
    console.log('Result:', {
      subnameLabel: result.subnameLabel,
      subnameNode: result.subnameNode,
      recordCount: Object.keys(result.records).length,
      transactionCount: result.transactions.length,
      batchSize: result.batchSize,
    });

    console.log('\n📋 Records prepared:');
    Object.entries(result.records).forEach(([key, value]) => {
      console.log(`   ${key}: ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);
    });

    console.log('\n✅ All tests passed!\n');

  } catch (error) {
    console.error('❌ Test failed:');
    console.error(error);
    process.exit(1);
  }
}

testENSStandalone();