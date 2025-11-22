# 🔐 Safe Authorization Flow — The Upstream Gate
## Understanding How We Detect & Trigger Downstream Operations

**Document Purpose:** Map the Safe approval mechanism before building IPFS/Zora/ENS services.

---

## 1. CURRENT UNDERSTANDING (MVP/Beta)

### From @PHASE3_IMPLEMENTATION_GUIDE.md

**Current release flow (from section 5: Multisig Authentication):**

```
1. Curator connects wallet → submit signature
2. Backend records approval in DB
3. Backend checks: approvals.count >= threshold
4. If threshold met → Publish (somehow)
5. Release published
```

**Problem:** Step 4 is unclear. How exactly do we trigger publishing?

---

## 2. THE THREE POSSIBLE APPROACHES

### Approach A: Database-Driven (Most Likely for MVP)

```
UPSTREAM (Safe Authorization Gate):
├─ Release submitted → status = "pending"
├─ Curator 1: POST /api/curator/approve
│  └─ Verify: signer is Safe member
│  └─ Store: signature in approvals table
│  └─ Check: approvals.count >= threshold?
│     └─ NO → Return: "1/2 signatures needed"
│
├─ Curator 2: POST /api/curator/approve
│  └─ Verify: signer is Safe member
│  └─ Store: signature in approvals table
│  └─ Check: approvals.count >= threshold?
│     └─ YES → TRIGGER: publishRelease job
│
DOWNSTREAM (Automatic Execution):
└─ Job runs:
   ├─ IPFS pin
   ├─ Zora mint
   ├─ Safe TX: ENS subname creation
   └─ Database update: status = "published"
```

**Implementation:**
- DB stores approvals (signer, signature, timestamp)
- POST /api/curator/approve checks threshold
- On threshold met → Enqueue async job (Bull/Node-cron)
- Job uses Safe SDK for on-chain transactions

**Pros:**
- ✅ Simple to implement
- ✅ We control the flow entirely
- ✅ No external webhook dependencies

**Cons:**
- ⚠️ Safe contract is not source of truth (we query it once to verify members)
- ⚠️ Signatures stored in DB, not on Safe (off-chain coordination)

---

### Approach B: Safe Transaction Service (Safe's Official Method)

```
UPSTREAM (Safe Authorization Gate):
├─ Curator 1: Creates Safe TX proposal in Safe UI
├─ Curator 2: Signs in Safe UI
├─ Safe TX Service: Detects threshold met → EXECUTES TX
│
DOWNSTREAM (On-Chain Events):
└─ Safe TX execution emits event
   ├─ Webhook: Safe notifies us → Trigger job
   ├─ OR Event listener: We poll Safe contract
   └─ publishRelease job starts
```

**Implementation:**
- Safe TX service handles threshold detection
- We register webhook callback URL
- On Safe TX execution, webhook fires → we process event

**Pros:**
- ✅ Safe is source of truth
- ✅ On-chain native
- ✅ Transparent

**Cons:**
- ⚠️ Requires Safe API key + webhook setup
- ⚠️ Slower (Safe TX service latency)
- ⚠️ More complex integration

---

### Approach C: Direct Safe Contract Events

```
UPSTREAM (Safe Authorization Gate):
├─ We deploy event listener on Safe contract
├─ Listen for: ExecutionSuccess, ExecutionFailure, AddedOwner, etc.
│
DOWNSTREAM:
└─ On Safe event, trigger job
```

**Implementation:**
- ethers.js listener on Safe contract
- On relevant events, trigger job

**Pros:**
- ✅ Real-time
- ✅ Decentralized

**Cons:**
- ⚠️ Complex event filtering
- ⚠️ Only works if Safe is source of truth for transactions

---

## 3. RECOMMENDATION: Approach A (Database-Driven) for MVP

**Why:**
- ✅ Aligns with current codebase (we already have approvals table)
- ✅ Simple to implement by Day 6
- ✅ Safe members verified once (via query) → signatures coordinated in DB
- ✅ Gives us agency over the trigger timing

**Flow for MVP:**

```
┌──────────────────────────────────────────────────────────────┐
│                  UPSTREAM: Safe Authorization Gate            │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  Step 1: Release Submitted                                   │
│  ├─ POST /api/submit (existing)                              │
│  ├─ Store: release (status = "pending")                      │
│  ├─ Store: temp file path (/tmp/release-{id})               │
│  └─ Return: releaseId, approve link                          │
│                                                                │
│  Step 2: Curator Approval (x2, x3, etc.)                    │
│  ├─ Curator visits: /curator/approve?releaseId=X             │
│  ├─ Connects wallet (MetaMask)                               │
│  ├─ Calls: POST /api/curator/approve                         │
│  │  {                                                          │
│  │    "releaseId": "PDA-001",                                │
│  │    "curatorAddress": "0xCurator1",                        │
│  │    "signature": "0x..."  ← Message signed                 │
│  │  }                                                          │
│  │                                                              │
│  │  Backend validates:                                        │
│  │  ├─ Recover address from signature                        │
│  │  ├─ Check: Is signer in CURATOR_SAFE members?            │
│  │  ├─ Store: Approval in DB                                 │
│  │  └─ Check: approvals.count >= threshold?                 │
│  │                                                              │
│  └─ Return: { approvals: 1/2 }                              │
│                                                                │
│  Step 3: Threshold Met → Trigger                            │
│  ├─ Curator 2 signs, calls POST /api/curator/approve        │
│  ├─ Backend checks: approvals.count >= 2 ✓                 │
│  │                                                              │
│  ├─ [CRITICAL] Enqueue job:                                  │
│  │  const job = await publishQueue.add('publishRelease', {  │
│  │    releaseId: 'PDA-001',                                 │
│  │    approvals: [sig1, sig2],                              │
│  │    metadatURI: 'ipfs://...'                             │
│  │  });                                                        │
│  │                                                              │
│  └─ Return: { approvalRequirementsMet: true, jobId }         │
│                                                                │
└──────────────────────────────────────────────────────────────┘
         ↓ [GATE CLOSED - THRESHOLD MET]
┌──────────────────────────────────────────────────────────────┐
│          DOWNSTREAM: Automatic Execution (Async Job)         │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  Step 3A: IPFS Pinning                                       │
│  ├─ Load temp file: /tmp/release-PDA-001.mp3                │
│  ├─ Storacha upload → directoryHash                         │
│  ├─ Extract CIDs: mediaIPFSHash, coverIPFSHash, etc.       │
│  └─ Store: IPFS hashes in DB                                │
│                                                                │
│  Step 3B: Zora Mint (Base L2)                                │
│  ├─ Call: Factory.publishRelease()                           │
│  ├─ Parameters: metadataURI (IPFS), contributor             │
│  ├─ Returns: tokenId                                         │
│  └─ Store: tokenId in DB                                    │
│                                                                │
│  Step 3C: ENS Subname (Safe Batched TX)                      │
│  ├─ Build 3 transactions:                                    │
│  │  ├─ setContenthash(node, encoded_metadata_cid)           │
│  │  ├─ setText(node, "zoraNFT", "base:0x.../tokenId")      │
│  │  └─ setText(node, "metadataURI", "ipfs://...")          │
│  │                                                              │
│  ├─ Send via Safe SDK: client.send({ transactions: [...] }) │
│  ├─ Returns: safeTxHash                                      │
│  └─ Store: ensSubname, safeTxHash in DB                     │
│                                                                │
│  Step 3D: Database Update + Events                           │
│  ├─ Update: release.status = "published"                    │
│  ├─ Update: all IPFS hashes, tokenId, ensSubname            │
│  ├─ Emit: ReleaseAdded event (for Graph indexer)            │
│  └─ Cleanup: Delete /tmp/release-{id}                       │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. KEY IMPLEMENTATION QUESTIONS

### Question 1: How do we verify a curator is a Safe member?

**Option A: Query Safe contract (Recommended for MVP)**
```typescript
// In POST /api/curator/approve handler
const safe = new ethers.Contract(
  process.env.CURATOR_SAFE_ADDRESS,
  SAFE_ABI,
  provider
);

const owners = await safe.getOwners();
const isMember = owners
  .map(o => o.toLowerCase())
  .includes(curatorAddress.toLowerCase());

if (!isMember) {
  return { error: 'Not a curator' };
}
```

**Option B: Hardcoded list (Not recommended)**
```typescript
const VALID_CURATORS = ['0x...', '0x...', '0x...'];
```

**Decision:** Query Safe contract dynamically. Allows curator rotation without code changes.

---

### Question 2: How do we detect and store the approval threshold?

**At Setup Time:**
```typescript
// Store in database during setup (or per-board in Full Vision)
const APPROVAL_THRESHOLD = 2;  // 2-of-3, etc.

INSERT INTO curator_settings (
  safe_address,
  approval_threshold,
  curator_count
) VALUES (
  '0xSafeAddress',
  2,
  3
);
```

**At Approval Time:**
```typescript
const threshold = await db.curatorSettings.getThreshold();
const currentApprovals = await db.approvals.countByRelease(releaseId);

if (currentApprovals >= threshold) {
  // TRIGGER: Job time
}
```

---

### Question 3: What job queue do we use?

**Options:**

| Option | Complexity | Reliability | Setup |
|--------|-----------|------------|-------|
| **Bull** | Medium | ✅ High | Redis required |
| **Node-cron** | Low | ⚠️ Medium | No external deps |
| **AWS SQS** | Medium | ✅ High | AWS required |
| **Direct call** | Low | ⚠️ Low | Synchronous (blocks) |

**Recommendation for MVP:** **Bull** (industry standard, battle-tested)

```typescript
// lib/queue.ts
import Queue from 'bull';

export const publishQueue = new Queue('publish-release', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

publishQueue.process('publish-release', async (job) => {
  const { releaseId } = job.data;
  return await publishRelease(releaseId);
});
```

---

### Question 4: What happens if the job fails?

**Bull provides built-in retry logic:**

```typescript
await publishQueue.add(
  'publish-release',
  { releaseId: 'PDA-001' },
  {
    attempts: 3,                      // Retry 3 times
    backoff: {
      type: 'exponential',
      delay: 2000                     // Start with 2s, exponential backoff
    },
    removeOnComplete: true,           // Clean up on success
    removeOnFail: false               // Keep failure records for debugging
  }
);
```

**On failure:**
- Database flags release: `status = "failed"`
- Curator notified
- Curator can retry (manually call API or auto-retry from queue)

---

### Question 5: Where does the Safe contract call happen?

**Two places:**

**A. Approval checking (POST /api/curator/approve)**
```typescript
// Verify signer is Safe member (read-only query)
const safe = ethers.Contract(...);
const owners = await safe.getOwners();
```

**B. ENS transaction execution (publishRelease job, Step 3C)**
```typescript
// Execute ENS transactions via Safe (write transaction)
import { createSafeClient } from '@safe-global/sdk-starter-kit';

const safeClient = await createSafeClient({
  provider: L1_RPC_URL,
  signer: CURATOR_SIGNER_KEY,      // ← Must be Safe member + have signing role
  safeAddress: CURATOR_SAFE_ADDRESS
});

const result = await safeClient.send({
  transactions: [
    { to: ENS_RESOLVER, value: '0', data: encodedSetContenthash },
    { to: ENS_RESOLVER, value: '0', data: encodedSetText1 },
    { to: ENS_RESOLVER, value: '0', data: encodedSetText2 }
  ]
});
```

**Critical:** `CURATOR_SIGNER_KEY` must be:
- A Safe member
- Have signing role configured in Safe
- Have enough ETH for gas

---

## 5. REVISED WEEK 2 ROADMAP

### Day 6: Safe Authorization Gate Setup

**Build:**
- [ ] Database: `curator_settings` table (threshold, safe address, members)
- [ ] Service: `lib/services/safe.ts` (Safe contract queries)
  - [ ] `verifyCuratorSignature()` - Recover address from signature
  - [ ] `isSafeMember()` - Query Safe contract for owners
  - [ ] `getApprovalThreshold()` - Read from DB
- [ ] Job queue: `lib/queue.ts` (Bull setup)
  - [ ] Redis connection
  - [ ] Job processor registration
- [ ] API route: `app/api/curator/approve/route.ts` (MODIFIED)
  - [ ] Signature verification
  - [ ] Threshold checking
  - [ ] Job enqueueing on threshold

**Test:**
- [ ] Verify curator signature recovery works
- [ ] Verify Safe member query works
- [ ] Verify threshold detection works
- [ ] Test job enqueueing

**Deliverable:** When curator 2 approves → Job is enqueued (not yet executed)

---

### Days 7-9: Downstream Execution (IPFS → Zora → ENS)

**Build:**
- [ ] Job processor: `lib/queue.ts` - `publishRelease` handler
  - [ ] STEP 3A: IPFS (via `lib/services/ipfs.ts`)
  - [ ] STEP 3B: Zora (via `lib/services/factory.ts`)
  - [ ] STEP 3C: ENS (via `lib/services/safe.ts` + `lib/services/ens.ts`)
  - [ ] STEP 3D: DB update + cleanup

**Test:**
- [ ] Job triggers on threshold met
- [ ] IPFS pinning works
- [ ] Zora mint works
- [ ] ENS subname created
- [ ] Database updated
- [ ] Release is discoverable

**Deliverable:** Full pipeline: Approval → Job → Published

---

### Day 10: Integration & E2E Testing

**Test:**
- [ ] End-to-end: Submit → Approve (x2) → Job → Published
- [ ] ENS resolves to IPFS
- [ ] Zora NFT shows on Base
- [ ] Metadata is valid ERC-721

---

## 6. CRITICAL DEPENDENCIES

**Must be in place before Day 6:**

1. **Storacha token** (`STORACHA_TOKEN`)
   - Used by IPFS service (Day 7)
   
2. **Safe contract deployed** (testnet)
   - Address: `CURATOR_SAFE_ADDRESS`
   - Members: List curator addresses
   - Threshold: 2-of-3 (or whatever)
   - Query-able address: `L1_RPC_URL`

3. **Safe API key** (`SAFE_API_KEY`)
   - From safe.global developer dashboard
   - Needed for Safe SDK on Day 8

4. **Redis instance** (local or cloud)
   - For Bull job queue
   - Can use Docker: `docker run -d -p 6379:6379 redis`

5. **ENS domain ownership** (`palaupalau.eth`)
   - Already owned by DAO Safe
   - Resolver address (`ENS_RESOLVER_ADDRESS`)

6. **Factory contract** (deployed to testnet)
   - `FACTORY_ADDRESS`
   - `FACTORY_ABI`

7. **Zora Creator address** (Base L2)
   - `ZORA_ADDRESS`
   - Or use Zora's public creator

---

## 7. SUMMARY: Safe Authorization is the Gate

```
Everything downstream depends on:
  1. Release submitted → pending
  2. Safe threshold detection (curator signatures)
  3. Job enqueueing (when threshold met)
  
THEN:
  4. IPFS → Zora → ENS → DB (automatic, no more manual steps)
```

**Safe authorization = the gatekeeper**. Once that threshold is met, everything else flows automatically.

---

## NEXT STEPS

**Before Day 6, confirm:**

1. [ ] Safe contract deployed + configured (testnet)
2. [ ] Redis available locally
3. [ ] Storacha token obtained
4. [ ] Safe API key obtained
5. [ ] ENS domain ready
6. [ ] Factory contract designed (ready for Day 8-9)

**Then proceed with Day 6: Safe Authorization Gate Setup**

---

**Document Version:** 1.0  
**Status:** Architecture Blueprint  
**Created:** November 16, 2025

