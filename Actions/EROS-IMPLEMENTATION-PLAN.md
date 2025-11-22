# EROS ENS Implementation - Step by Step Action Plan

## Phase 1: Prerequisites & Setup (Before Coding)

### Step 1.1: Verify Sepolia ENS Infrastructure
**Goal:** Confirm Sepolia resolver and parent domain are accessible

**Actions:**
- [ ] Verify `scenedex.eth` exists on Sepolia (or create test domain)
- [ ] Confirm parent node namehash: `0x9fd5ee92bf30ec0519137a2bf368f60dc7be258f18dcc98a37a064f4dbef6294`
- [ ] Verify Public Resolver Sepolia: `0x8FADE66B79cC9f707aB26799354482EB93a5B7dD`
- [ ] Test that we can SET text records on this resolver from our account
- [ ] Document gas costs for bulk setText calls

**Outputs:**
- ✅ Sepolia ENS functional
- ✅ Parent domain verified
- ✅ Resolver address confirmed
- ✅ Wallet can set records

**Potential Issues to Catch:**
- Does the account setting records have permission? (Must be domain owner or have subdomain controller role)
- Is Sepolia resolver working? (Test with simple record first)
- Gas costs too high? (Batch or optimize)

---

### Step 1.2: Install Required Dependencies
**Goal:** Add ENS libraries to project

**Actions:**
```bash
npm install viem @ensdomains/ensjs multiformats varint
```

**Verify Installation:**
- [ ] `node_modules/viem` exists
- [ ] `node_modules/multiformats` exists
- [ ] `node_modules/varint` exists
- [ ] `node_modules/@ensdomains/ensjs` exists

**Outputs:**
- ✅ Dependencies installed
- ✅ Can import from viem/ens
- ✅ Can import CID utilities

**Potential Issues:**
- Version conflicts? (Check peer deps)
- Missing types? (Verify TypeScript definitions)

---

### Step 1.3: Environment Variables
**Goal:** Set up all ENS config in .env.local

**Actions:**
Add to `.env.local`:
```bash
# ENS Configuration
ENS_DOMAIN=scenedex.eth
ENS_PARENT_NODE=0x9fd5ee92bf30ec0519137a2bf368f60dc7be258f18dcc98a37a064f4dbef6294
ENS_RESOLVER_SEPOLIA=0x8FADE66B79cC9f707aB26799354482EB93a5B7dD
ENS_SUBNAME_PREFIX=EROS
ENS_SERVICE_NAMESPACE=eth.scenedex
```

**Verify:**
- [ ] All vars present in `.env.local`
- [ ] Values match Sepolia config
- [ ] No typos in addresses

**Outputs:**
- ✅ Config centralized
- ✅ Can switch domains easily for testing

**Potential Issues:**
- Did we use wrong resolver address?
- Did we use wrong parent node?
- Missing .env vars will break at runtime

---

## Phase 2: Core ENS Service Implementation

### Step 2.1: Create `lib/services/ens.ts`
**Goal:** Build ENS record builder and setter functions

**Structure:**
```typescript
// Section A: Imports & Config
import { namehash } from 'viem/ens';
import { CID } from 'multiformats/cid';
// ...

// Section B: Helper Functions
- buildRecordsFromRelease(release, coinAddress)
- formatEROSNumber(releaseNumber)
- encodeContentHash(cid)  [optional for phase 1]
- buildSetTextTransactions(node, records)

// Section C: Main Export
- registerEROSRelease(release, coinAddress)
```

**Actions:**
- [ ] Create file at `lib/services/ens.ts`
- [ ] Import all dependencies
- [ ] Implement Section A (imports)
- [ ] Implement Section B (helpers)
- [ ] Export main function
- [ ] Add JSDoc comments

**Outputs:**
- ✅ `lib/services/ens.ts` exists
- ✅ Compiles without errors
- ✅ Exports registerEROSRelease()

**Potential Issues:**
- TypeScript errors? (Check imports, types)
- Viem functions missing? (Verify viem version)
- namehash calculation wrong? (Test with known values)

---

### Step 2.2: Implement Record Builders
**Goal:** Create functions that transform Release schema → ENS text records

**Actions:**
```typescript
function buildRecordsFromRelease(release: Release, coinAddress: string) {
  return {
    avatar: `ipfs://${release.coverImageIPFSHash}`,
    description: release.description || 'Release',
    'eth.scenedex.releaseId': `EROS${releaseNumber}`,
    'eth.scenedex.artists': release.artists || 'Unknown',
    'eth.scenedex.mediaIPFS': release.mediaIPFSHash,
    'eth.scenedex.metadataURI': release.metadataURI,
    'eth.scenedex.zoraCoinAddress': coinAddress,
    'eth.scenedex.zoraCoinSymbol': release.zora_coin_symbol,
    'eth.scenedex.splitAddress': release.split_address,
  };
}
```

- [ ] Function takes Release + coinAddress
- [ ] Returns object with 9 records
- [ ] All values mapped from schema
- [ ] Handles null/undefined gracefully

**Outputs:**
- ✅ Records object structure correct
- ✅ All schema fields mapped
- ✅ Fallbacks for optional fields

**Potential Issues:**
- Missing fields cause undefined records? (Add defaults)
- EROS numbering format wrong? (Test with examples)
- Custom key names inconsistent? (Use constants)

---

### Step 2.3: Build Transaction Generator
**Goal:** Create function that generates ENS setText transactions

**Actions:**
```typescript
function buildSetTextTransactions(node: bytes32, records: Record<string, string>) {
  return Object.entries(records).map(([key, value]) => ({
    to: ENV.ENS_RESOLVER_SEPOLIA,
    value: '0',
    data: encodeAbiParameters(
      ['bytes32', 'string', 'string'],
      [node, key, value]
    ),
    description: `Set ${key}=${value}`,
  }));
}
```

- [ ] Function takes node + records object
- [ ] Returns array of transaction objects
- [ ] Each transaction targets resolver
- [ ] All transactions have zero value

**Outputs:**
- ✅ Transactions correctly formatted
- ✅ Can be sent via viem sendTransaction()
- ✅ Each call is independent

**Potential Issues:**
- ABI encoding wrong? (Test with known values)
- Too many transactions? (Need to batch?)
- Gas too high? (Calculate per-call costs)

---

### Step 2.4: Test ENS Service Standalone
**Goal:** Verify ENS functions work before integrating with jobs

**Create `lib/services/test-ens-standalone.ts`:**
```typescript
async function testENSService() {
  // Test 1: Build records from mock release
  const mockRelease = {...};
  const records = buildRecordsFromRelease(mockRelease, '0x...');
  assert(records['eth.scenedex.releaseId'] === 'EROS001');
  
  // Test 2: Generate transactions
  const node = namehash('EROS001.scenedex.eth');
  const txs = buildSetTextTransactions(node, records);
  assert(txs.length === 9);
  
  // Test 3: (Optional) Dry-run transaction on Sepolia
  // Don't actually send, just simulate
  
  console.log('✅ All ENS tests passed');
}
```

**Run:**
```bash
npx tsx lib/services/test-ens-standalone.ts
```

- [ ] Mock release data created
- [ ] buildRecordsFromRelease() returns 9 records
- [ ] buildSetTextTransactions() returns 9 transactions
- [ ] All field names correct
- [ ] All values non-empty strings

**Outputs:**
- ✅ ENS service works independently
- ✅ No integration bugs
- ✅ Ready to plug into jobs

**Potential Issues:**
- Record count wrong? (Each release has 9 records?)
- Values malformed? (Should all be strings)
- Tests don't run? (Check tsx setup)

---

## Phase 3: Integration with Existing Flow

### Step 3.1: Identify Integration Point in `jobs.ts`
**Goal:** Find exact location to call ENS registration

**Actions:**
- [ ] Open `lib/services/jobs.ts`
- [ ] Find `publishRelease()` function
- [ ] Locate coin creation section (Step 7)
- [ ] Identify AFTER coin deploys (should be after zora.ts returns)
- [ ] Mark insertion point with comment

**Current Flow (in jobs.ts):**
```typescript
// Step 6: Create split
const splitResult = await createSplitForRelease(...);

// Step 7: Deploy Zora coin
const coinResult = await createCoinForRelease(...);

// ← INSERT ENS REGISTRATION HERE
// Step 8: Update database
```

**Outputs:**
- ✅ Integration point identified
- ✅ Clear line number where to insert
- ✅ Understand dependencies (needs coin address)

**Potential Issues:**
- Wrong location? (ENS should be after coin, before DB update)
- Missing data? (Need full release object + coin address)
- Error handling? (What if ENS call fails?)

---

### Step 3.2: Add ENS Call to publishRelease()
**Goal:** Call ENS service from publishRelease job

**Actions:**
```typescript
// After coin creation (line XXX)
import { registerEROSRelease } from './ens';

const coinResult = await createCoinForRelease(...);
console.log(`Step 7️⃣: Deploy Zora Coin... ✅`);

// NEW: Register ENS subname
console.log(`\nStep 7️⃣.5️⃣: Register ENS Subname...`);
const { subnameNode, records } = await registerEROSRelease(
  release,
  coinResult.coinAddress
);
console.log(`   ✅ ENS records prepared for EROS${releaseNumber}`);
// Note: Actual transaction sending depends on Safe integration
```

- [ ] Import registerEROSRelease
- [ ] Call after coin creation
- [ ] Pass release object + coin address
- [ ] Log progress
- [ ] Store returned data

**Outputs:**
- ✅ ENS service called in jobs flow
- ✅ Receives correct inputs
- ✅ Returns records object

**Potential Issues:**
- Missing import? (Check path)
- Wrong parameters? (Should be Release + string)
- Error kills job? (Need try-catch)

---

### Step 3.3: Update Database Schema (if needed)
**Goal:** Store ENS subname in releases table

**Actions:**
- [ ] Check if `ensSubname` column exists in releases table
- [ ] If not, create migration:
```sql
ALTER TABLE releases ADD COLUMN ensSubname VARCHAR(255) NULL;
```
- [ ] If exists, skip this step

**Outputs:**
- ✅ Database can store ENS subnames
- ✅ Migration tracked

**Potential Issues:**
- Column already exists? (Skip)
- Wrong column type? (VARCHAR sufficient)

---

### Step 3.4: Store ENS Subname After Creation
**Goal:** Record ENS subname in database

**Actions:**
```typescript
// After ENS records prepared
const ensSubname = `EROS${releaseNumber}.scenedex.eth`;

// In Step 8: Update database
await db.releases.update({
  id: releaseId,
  split_address: splitAddress,
  zora_coin_address: coinResult.coinAddress,
  zora_coin_symbol: coinResult.symbol,
  ensSubname: ensSubname,  // ← NEW
  status: 'published'
});
```

- [ ] Calculate ENS subname string
- [ ] Add to DB update call
- [ ] Verify in test output

**Outputs:**
- ✅ ENS subname persisted
- ✅ Can query releases for their ENS names

**Potential Issues:**
- Data not saved? (Check update query)
- Wrong subname format? (Should be EROS001.scenedex.eth)

---

## Phase 4: Testing & Validation

### Step 4.1: Run Updated Test Script
**Goal:** Verify full flow with ENS integration

**Actions:**
```bash
npx tsx lib/services/test-zora-e2e-smoke.ts
```

- [ ] Test runs successfully
- [ ] All 9 phases complete
- [ ] Phase 7 includes ENS subname
- [ ] Database shows ensSubname column populated
- [ ] No errors in console

**Expected Output Addition:**
```
Step 7️⃣: Deploy Zora Coin (Direct Factory Call)
...
Step 7️⃣.5️⃣: Register ENS Subname...
   ✅ ENS records prepared for EROS001
   Release ID: BETA-1763518904325
   ENS Subname: EROS001.scenedex.eth
```

**Outputs:**
- ✅ Full end-to-end works with ENS
- ✅ No breaking changes to existing flow

**Potential Issues:**
- ENS call throws error? (Debug in ens.ts)
- Database update fails? (Check schema)
- Type errors? (Fix in ens.ts)

---

### Step 4.2: Verify ENS Records Are Queryable
**Goal:** Test that records can be read back from Sepolia ENS

**Create `lib/services/test-ens-resolution.ts`:**
```typescript
async function testENSResolution() {
  const node = namehash('EROS001.scenedex.eth');
  
  // Try to read records (will fail if not set on-chain)
  try {
    const avatar = await resolver.text(node, 'avatar');
    const releaseId = await resolver.text(node, 'eth.scenedex.releaseId');
    
    if (avatar && releaseId) {
      console.log('✅ ENS records readable from Sepolia');
    } else {
      console.log('⚠️ Records prepared but not yet on-chain (need Safe TX)');
    }
  } catch (error) {
    console.log('⚠️ Records not on-chain yet (expected - need Safe TX to finalize)');
  }
}
```

**Run:**
```bash
npx tsx lib/services/test-ens-resolution.ts
```

- [ ] Test executes
- [ ] Either confirms records readable OR notes they're pending Safe TX

**Outputs:**
- ✅ Understand when records go on-chain
- ✅ Know what to test after Safe integration

**Potential Issues:**
- Records not found? (Expected until Safe sends TX)
- Resolver error? (Check address)

---

## Phase 5: Integration Points Check

### Step 5.1: Map Data Flow
**Goal:** Verify all pieces connect correctly

**Create diagram mentally:**
```
Release submitted
    ↓
jobs.publishRelease()
    ↓
Step 1-6: Pin, split, metadata
    ↓
Step 7: Deploy Zora coin → coinAddress
    ↓
Step 7.5: registerEROSRelease(release, coinAddress)
    ↓
Returns: { subnameNode, records }
    ↓
Step 8: Update DB with ensSubname
    ↓
✅ Complete
```

- [ ] Each step has clear input
- [ ] Each step has clear output
- [ ] No missing data handoffs
- [ ] Error handling considered

**Outputs:**
- ✅ Data flow verified
- ✅ No gaps

**Potential Issues:**
- Missing parameter? (Add it)
- Circular dependency? (Restructure)

---

### Step 5.2: List Safe Integration Touchpoints
**Goal:** Identify what changes when Safe is added

**Future Safe Touchpoints:**
1. ENS records → prepare transactions ✅ (done in ens.ts)
2. Safe transaction → batch all records into one Safe TX
3. Safe approval → triggers actual on-chain setText calls
4. Frontend → resolve ENS after Safe TX confirmed

- [ ] Note these for Phase 2 (Safe integration)
- [ ] Don't implement now
- [ ] Just understand flow

**Outputs:**
- ✅ Clear path to Safe integration
- ✅ Phase 1 doesn't depend on Safe

---

## Phase 6: Documentation & Review

### Step 6.1: Document Implementation
**Goal:** Create reference for maintenance

**Create `lib/services/ENS-IMPLEMENTATION-NOTES.md`:**
- Record structure
- EROS numbering format
- Transaction format
- Sepolia resolver address
- Any workarounds or gotchas

- [ ] Document created
- [ ] Future devs can understand code

---

### Step 6.2: Decision Checkpoint
**Goal:** Verify this plan makes sense before coding

**Questions to Answer:**
1. ✅ Is ENS subname registration after coin creation? (Yes, makes sense)
2. ✅ Is storing ENS name in DB optional? (Yes, query later if needed)
3. ✅ Does Phase 1 work without Safe? (Yes, just prepares records)
4. ✅ Is EROS001, EROS002 numbering clear? (Yes, matches releaseId)
5. ✅ Are the 9 text records sufficient for MVP? (Yes, covers all schema fields)
6. ✅ Can we test standalone without Safe? (Yes, in Phase 4.1)

---

## Summary: What Gets Built This Sprint

```
┌─────────────────────────────────────┐
│   EROS ENS Implementation Phase 1    │
├─────────────────────────────────────┤
│ ✅ lib/services/ens.ts              │
│    - buildRecordsFromRelease()      │
│    - buildSetTextTransactions()     │
│    - registerEROSRelease()          │
│                                     │
│ ✅ Integration into jobs.ts          │
│    - Call after coin creation       │
│    - Store ensSubname in DB         │
│                                     │
│ ✅ Tests                             │
│    - test-ens-standalone.ts         │
│    - test-ens-resolution.ts         │
│    - test-zora-e2e-smoke.ts (update)│
│                                     │
│ ✅ No Safe needed yet                │
│    (just prepares records)          │
└─────────────────────────────────────┘
```

---

## ❓ Questions for Your Review

Before we code, please validate:

1. **EROS Numbering:** Should it be `EROS001`, `EROS002`... or `EROS-001`?
2. **Text Record Keys:** Is `eth.scenedex.*` the right namespace, or prefer different naming?
3. **Transaction Batching:** Should we batch all 9 setText calls into one Safe TX, or separate?
4. **Error Handling:** If ENS record preparation fails, should entire job fail or just skip ENS?
5. **Database:** Is storing ensSubname necessary, or can we query it on-demand from ENS?
6. **Mainnet Later:** Should we design for Easy migration to `scenedex.eth` mainnet later?

---

**Status:** Ready for Code Review  
**Next:** Answer the 6 questions above, then proceed to Phase 1

