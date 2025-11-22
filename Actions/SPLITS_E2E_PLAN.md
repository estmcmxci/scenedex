# 🔄 Splits Integration - End-to-End Test Plan

**Objective:** Implement and test trustless 50/50 revenue split between Safe multisig (curator) and submitter for each Zora coin release.

---

## 📋 Step-by-Step Implementation

### **Step 1: Install Splits SDK**
```bash
npm install @0xsplits/splits-sdk
```

### **Step 2: Add Environment Variables**
```env
# .env.local (already exists: BASE_RPC_URL, CURATOR_PRIVATE_KEY)
SPLITS_CHAIN_ID=8453  # Base Sepolia = 84532, Base Mainnet = 8453
PLATFORM_REFERRER_ADDRESS=0x...  # Catalogue's address (earns Zora fees)
```

### **Step 3: Create `lib/services/splits.ts`**

Implement core split creation function:

```typescript
import { SplitsSDK } from '@0xsplits/splits-sdk';
import { createPublicClient, createWalletClient, http, Address } from 'viem';
import { base } from 'viem/chains';

export async function createSplitForRelease(
  safeAddress: Address,
  submitterAddress: Address,
  releaseId: string
): Promise<string> {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(process.env.BASE_RPC_URL),
  });

  const walletClient = createWalletClient({
    account: process.env.CURATOR_PRIVATE_KEY as Address,
    chain: base,
    transport: http(process.env.BASE_RPC_URL),
  });

  const sdk = new SplitsSDK({
    chainId: process.env.SPLITS_CHAIN_ID || 8453,
    publicClient,
    walletClient,
  });

  // Create split: 50% Safe, 50% Submitter
  const splitTx = await sdk.createSplit({
    splitType: 'pull',
    recipients: [safeAddress, submitterAddress],
    shares: [50, 50],
    controller: safeAddress, // Safe can manage split if needed
  });

  console.log(`✅ Split created: ${splitTx.hash}`);
  
  // Get split address from transaction
  const splitAddress = await sdk.getSplitAddress(splitTx.hash);
  console.log(`✅ Split address: ${splitAddress}`);
  
  return splitAddress;
}
```

### **Step 4: Update Database Schema**

Add split_address to releases:

```sql
ALTER TABLE releases ADD COLUMN IF NOT EXISTS split_address VARCHAR(42) NULL;
```

OR include in migration:

```sql
-- In 001-initial-schema.sql
ALTER TABLE releases ADD COLUMN split_address VARCHAR(42) NULL;
```

### **Step 5: Create Test File `lib/services/test-splits-e2e.ts`**

Test split creation end-to-end:

```typescript
import { createSplitForRelease } from './splits';
import { query as dbQuery } from '../db/database';

async function testSplitsE2E() {
  console.log('\n🔄 SPLITS E2E TEST\n');

  const SAFE_ADDRESS = '0x...';  // Your Safe address
  const SUBMITTER_ADDRESS = '0x...';  // Test submitter
  const RELEASE_ID = `PDA-SPLIT-${Date.now()}`;

  try {
    // Step 1: Create split on-chain
    console.log(`📋 Step 1️⃣: Create split contract`);
    const splitAddress = await createSplitForRelease(
      SAFE_ADDRESS,
      SUBMITTER_ADDRESS,
      RELEASE_ID
    );

    // Step 2: Verify split address is valid
    console.log(`\n📋 Step 2️⃣: Verify split address`);
    if (!splitAddress || !splitAddress.startsWith('0x')) {
      throw new Error('Invalid split address');
    }
    console.log(`✅ Split address valid: ${splitAddress}`);

    // Step 3: Store split in database
    console.log(`\n📋 Step 3️⃣: Store split in database`);
    await dbQuery(
      `UPDATE releases SET split_address = $1 WHERE id = $2`,
      [splitAddress, RELEASE_ID]
    );
    console.log(`✅ Split stored in DB`);

    // Step 4: Verify database update
    console.log(`\n📋 Step 4️⃣: Verify database storage`);
    const result = await dbQuery(
      `SELECT split_address FROM releases WHERE id = $1`,
      [RELEASE_ID]
    );

    if (result.rows.length === 0) {
      throw new Error('Release not found in DB');
    }

    const storedSplit = result.rows[0].split_address;
    if (storedSplit !== splitAddress) {
      throw new Error('Stored split address does not match');
    }
    console.log(`✅ Database verification passed`);

    // Step 5: Summary
    console.log(`\n✨ SPLITS E2E TEST PASSED!\n`);
    console.log(`Split Details:`);
    console.log(`  Safe Address: ${SAFE_ADDRESS}`);
    console.log(`  Submitter Address: ${SUBMITTER_ADDRESS}`);
    console.log(`  Split Address: ${splitAddress}`);
    console.log(`  Split Stored: ${storedSplit}\n`);

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testSplitsE2E();
```

### **Step 6: Run Test**

```bash
# Run splits test
npx tsx lib/services/test-splits-e2e.ts
```

### **Step 7: Verify Split on-chain**

After test, check split was created:

```bash
# View split at: https://app.splits.org/
# Search for split address from test output
```

### **Step 8: Integrate into publishRelease() Job**

Update `lib/services/jobs.ts`:

```typescript
// In publishRelease() function, after IPFS pinning:

// Step 7: Create split for revenue distribution
console.log(`Step 7️⃣: Create split contract (Safe 50% + Submitter 50%)`);
const splitAddress = await createSplitForRelease(
  safeAddress,
  release.createdBy,  // Submitter's wallet
  releaseId
);
console.log(`✅ Split created: ${splitAddress}`);

// Step 8: Update releases with split address
await dbQuery(
  `UPDATE releases SET split_address = $1 WHERE id = $2`,
  [splitAddress, releaseId]
);
```

### **Step 9: Test Full Job Workflow**

Create integration test that:
1. Submits release
2. Approves release (triggers job)
3. Job creates split
4. Verify split stored in DB
5. Verify split address is valid on-chain

---

## 🧪 Test Checklist

- [ ] Splits SDK installed
- [ ] Environment variables set
- [ ] `lib/services/splits.ts` created
- [ ] Database schema updated
- [ ] Test file created
- [ ] Test runs successfully
- [ ] Split created on-chain
- [ ] Split address stored in DB
- [ ] Split appears on splits.org
- [ ] Ready for Zora coin integration (Step 3)

---

## 🎯 Success Criteria

✅ Split contract created on Base testnet/mainnet  
✅ Split configured with Safe (50%) + Submitter (50%)  
✅ Split address stored in releases table  
✅ Addresses valid and accessible  
✅ Ready to use as `payoutRecipient` in Zora coin creation  

---

## 📞 Next Step After Splits

Once splits e2e passes:
→ **Step 3️⃣: Zora Coins Integration**
- Use split_address as payoutRecipient
- Create coin with metadataURI from IPFS
- Store coin_address in releases table

