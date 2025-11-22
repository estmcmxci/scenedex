# 🎨 Safe Patterns — Visual Summary

## The 3 Critical Safe Patterns (from @safe-context.md)

### Pattern 1: Verify Curator Membership

```
┌─────────────────────────────────────────────────────────┐
│                   CURATOR APPROVAL FLOW                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Curator 1 wants to approve Release X                   │
│         ↓                                                │
│  POST /api/curator/approve                              │
│  {                                                       │
│    releaseId: "X",                                       │
│    curatorAddress: "0xCurator1",                         │
│    signature: "0x..."                                    │
│  }                                                       │
│         ↓                                                │
│  STEP 1: Verify Safe Membership                          │
│  ┌─────────────────────────────────────────┐             │
│  │ safe.getOwners()                        │             │
│  │ → ['0xCurator1', '0xCurator2', ...]    │             │
│  │                                         │             │
│  │ Check: '0xCurator1' in owners?          │             │
│  │ Result: ✅ YES                           │             │
│  └─────────────────────────────────────────┘             │
│         ↓                                                │
│  Continue to verification...                            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Code Pattern:**
```typescript
const owners = await safe.getOwners()
const isMember = owners.includes(curatorAddress)
if (!isMember) throw new Error('Not a Safe member!')
```

---

### Pattern 2: Check Approval Threshold

```
┌─────────────────────────────────────────────────────────┐
│           THRESHOLD DETECTION (The Gate!)                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Database: approvals for Release X                      │
│  ┌──────────┬──────────┬──────────┐                      │
│  │ Curator1 │ Curator2 │ Curator3 │  (3 total curators)│
│  ├──────────┼──────────┼──────────┤                      │
│  │    ✅    │    ❌    │    ❌    │  (Status after C1)  │
│  └──────────┴──────────┴──────────┘                      │
│         ↓                                                │
│  Count: 1 approval stored                               │
│  Threshold required: 2 (from safe.getThreshold())       │
│  Result: 1 < 2 → NOT MET ❌                              │
│         ↓                                                │
│  Response to user: "1 more approval needed"             │
│                                                          │
│  [5 minutes later: Curator 2 approves]                   │
│  ┌──────────┬──────────┬──────────┐                      │
│  │ Curator1 │ Curator2 │ Curator3 │                      │
│  ├──────────┼──────────┼──────────┤                      │
│  │    ✅    │    ✅    │    ❌    │  (Status after C2)  │
│  └──────────┴──────────┴──────────┘                      │
│         ↓                                                │
│  Count: 2 approvals stored                              │
│  Threshold required: 2                                  │
│  Result: 2 >= 2 → MET! ✅                                │
│         ↓                                                │
│  🎉 TRIGGER: Enqueue publishRelease job!                │
│  Release status: 'approval_threshold_met'               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Code Pattern:**
```typescript
const threshold = await safe.getThreshold()
const approvalCount = await db.countApprovals(releaseId)

if (approvalCount >= threshold) {
  // GATE OPENS! Trigger downstream execution
  await enqueuePublishJob(releaseId)
}
```

---

### Pattern 3: Verify Signature (EIP-191)

```
┌─────────────────────────────────────────────────────────┐
│         SIGNATURE VERIFICATION (EIP-191 Standard)        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Curator uses their wallet (MetaMask, WalletConnect...)│
│          ↓                                               │
│  Sign Message:                                          │
│  "RELEASE_APPROVAL" + "Release-ID-X"                    │
│          ↓                                               │
│  Wallet creates cryptographic signature:                │
│  signature = "0xabc123...xyz789"                        │
│          ↓                                               │
│  Backend receives:                                      │
│  {                                                       │
│    releaseId: "X",                                       │
│    curatorAddress: "0xCurator1",                         │
│    signature: "0xabc123...xyz789"                        │
│  }                                                       │
│          ↓                                               │
│  VERIFY:                                                │
│  1. Hash message same way curator did                   │
│     messageHash = keccak256("RELEASE_APPROVAL" + "X")   │
│                                                          │
│  2. Use signature to recover signer address             │
│     recovered = recoverAddress(messageHash, signature)  │
│     → recovered = "0xCurator1"                           │
│                                                          │
│  3. Compare recovered == claimed                        │
│     "0xCurator1" == "0xCurator1" ✅                      │
│     → Signature is authentic!                           │
│          ↓                                               │
│  Result: ✅ Proven that 0xCurator1 signed this approval │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Code Pattern:**
```typescript
// What curator signs (in their wallet):
const messageHash = ethers.solidityPackedKeccak256(
  ['string', 'string'],
  ['RELEASE_APPROVAL', releaseId]
)

// What backend verifies:
const recovered = ethers.recoverAddress(messageHash, signature)
if (recovered.toLowerCase() === curatorAddress.toLowerCase()) {
  // ✅ Signature is authentic!
}
```

---

## Complete Day 6 Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    COMPLETE SAFE GATE FLOW                    │
└──────────────────────────────────────────────────────────────┘

START: Curator submits approval
│
├─ INPUT: releaseId, curatorAddress, signature
│
├─ STEP 1: VERIFY SIGNATURE (Pattern 3)
│  └─ ✅ Recovered address = curatorAddress?
│     └─ If NO: Reject ❌
│     └─ If YES: Continue ✅
│
├─ STEP 2: VERIFY MEMBERSHIP (Pattern 1)
│  └─ ✅ Curator in safe.getOwners()?
│     └─ If NO: Reject ❌
│     └─ If YES: Continue ✅
│
├─ STEP 3: STORE APPROVAL
│  └─ ✅ INSERT into approvals table
│
├─ STEP 4: COUNT APPROVALS & CHECK THRESHOLD (Pattern 2)
│  └─ approvalCount = SELECT COUNT(*) FROM approvals
│  └─ threshold = safe.getThreshold()
│     └─ If approvalCount < threshold:
│        └─ Response: "{current}/{ threshold} approvals"
│     └─ If approvalCount >= threshold:
│        └─ 🎉 THRESHOLD MET!
│        └─ ENQUEUE publishRelease JOB
│        └─ Update release status: 'approval_threshold_met'
│        └─ Response: "Publish job enqueued!"
│
END: Job ready for Days 7-9 (IPFS → Zora → ENS)
```

---

## Which Files Implement Each Pattern?

```
PATTERN 1: Verify Membership (getOwners)
└─ lib/services/safe.ts → isSafeMember()
└─ Integrated in: app/api/curator/approve/route.ts

PATTERN 2: Check Threshold (getThreshold)
└─ lib/services/safe.ts → getApprovalThreshold()
└─ lib/db/approvals.ts → countApprovals()
└─ Integrated in: app/api/curator/approve/route.ts

PATTERN 3: Verify Signature (EIP-191)
└─ lib/services/safe.ts → verifyCuratorSignature()
└─ Integrated in: app/api/curator/approve/route.ts
```

---

## Safe Contract Method Calls (Visual)

```
Your Application Code                Safe Contract (On-Chain)
│                                     │
├─ call: getOwners()         ─────→   ├─ Returns: address[]
│ (view function, no gas)             │ ("0xCurator1", "0xCurator2", ...)
│                                     │
├─ call: getThreshold()      ─────→   ├─ Returns: uint256
│ (view function, no gas)             │ (2)
│                                     │
└─ send: signature + message ─────→   └─ (verified locally, no call needed)
  (ethers.recoverAddress)
```

---

## Database-Backed Job Queue (Visual)

```
┌─────────────────────────────────────────────────────────┐
│              THRESHOLD MET → ENQUEUE JOB                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  POST /api/curator/approve (Curator 2)                 │
│         ↓                                               │
│  [Verification passes]                                 │
│         ↓                                               │
│  approvalCount = 2, threshold = 2 ✅                    │
│         ↓                                               │
│  INSERT INTO jobs (                                     │
│    id: "uuid-123",                                      │
│    release_id: "RELEASE-X",                             │
│    job_type: "publish_release",                         │
│    status: "pending",  ← Job is queued!                 │
│    data: { approvals: [...] }                           │
│  )                                                      │
│         ↓                                               │
│  [Every 5 seconds: Job worker polls]                    │
│  ┌──────────────────────────────┐                       │
│  │ SELECT * FROM jobs           │                       │
│  │ WHERE status = 'pending'     │                       │
│  │                              │                       │
│  │ Found: 1 pending job         │                       │
│  │         ↓                    │                       │
│  │ UPDATE status = 'processing' │                       │
│  │         ↓                    │                       │
│  │ [Days 7-9: Process job]      │                       │
│  │ - IPFS pinning               │                       │
│  │ - Zora minting               │                       │
│  │ - ENS subname                │                       │
│  │         ↓                    │                       │
│  │ UPDATE status = 'completed'  │                       │
│  └──────────────────────────────┘                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Summary: What You're Building

```
INPUT: Curator approval (signature + address)
         ↓
STEP 1:  Verify signature is authentic
         ↓ (Pattern 3: ethers.recoverAddress)
STEP 2:  Check curator is Safe member
         ↓ (Pattern 1: safe.getOwners)
STEP 3:  Store approval in database
         ↓
STEP 4:  Count approvals
         ↓
STEP 5:  Check if >= threshold
         ↓ (Pattern 2: safe.getThreshold)
RESULT A: Not met → "X more needed"
RESULT B: Met! → Enqueue job → Days 7-9 execute automatically
```

---

## Key Numbers for Day 6

| Metric | Value |
|--------|-------|
| New database tables | 2 |
| New service files | 1 |
| API endpoints modified | 1 |
| Functions to implement | 3 |
| Total lines of code | ~390 |
| Install command length | 1 (npm install ethers@6) |
| Safe contract calls | 2 (getOwners, getThreshold) |
| RPC calls needed | ~5-10 (during testing) |
| Expected build time | 2-3 hours |

---

**Document Version:** 1.0  
**Created:** November 16, 2025  
**Status:** READY FOR IMPLEMENTATION

