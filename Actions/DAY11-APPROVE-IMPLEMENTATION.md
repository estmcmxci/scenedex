# Day 11: Safe Multisig Approval Endpoint ✅

## What We Built

**New Endpoint:** `POST /api/approve`

Integrates Safe multisig authentication into the release publishing flow.

---

## 3 Critical Patterns Implemented

### **Pattern 1: Verify Signature (EIP-191)**
```typescript
const messageHash = ethers.solidityPackedKeccak256(
  ['string', 'string'],
  ['RELEASE_APPROVAL', releaseId]
)
const curatorAddress = ethers.recoverAddress(messageHash, signature)
```
- Recovers signer address from curator's signature
- Proves curator actually signed the approval

### **Pattern 2: Check Curator is Safe Member**
```typescript
const owners = await safe.getOwners()
const isMember = owners
  .map(o => o.toLowerCase())
  .includes(curatorAddress.toLowerCase())
```
- Queries Safe contract for owner list
- Ensures only Safe members can approve

### **Pattern 3: Get Approval Threshold**
```typescript
const threshold = await safe.getThreshold()
const approvalCount = await countApprovalsForRelease(releaseId)
if (approvalCount >= threshold) {
  await publishRelease(releaseId)  // TRIGGER!
}
```
- Gets required approvals from Safe (we set to 1)
- Counts approvals in database
- When threshold met, automatically triggers `publishRelease()`

---

## Request/Response

### Request
```bash
POST /api/approve
Content-Type: application/json

{
  "releaseId": "ENS-TEST-1763657389492",
  "signature": "0x1234567890..."
}
```

### Response (Success)
```json
{
  "success": true,
  "data": {
    "releaseId": "ENS-TEST-1763657389492",
    "curator": "0x1c2f3137e71dec33c6111cfeb7f58b8389f9ff21",
    "approvalCount": 1,
    "threshold": 1,
    "thresholdMet": true,
    "message": "✅ Threshold met! Release will be published."
  }
}
```

---

## 10-Step Flow

1. **Parse request** → Extract releaseId + signature
2. **Verify signature** → Recover curator address (Pattern 1)
3. **Load Safe** → Get Safe address from database
4. **Check membership** → Verify curator is Safe owner (Pattern 2)
5. **Check duplicate** → Ensure curator hasn't already approved
6. **Store approval** → Save to database
7. **Get threshold** → Query Safe contract (Pattern 3)
8. **Count approvals** → Check current approval count (Pattern 3)
9. **Check threshold** → If met, trigger `publishRelease()` job
10. **Return response** → Success with approval status

---

## Test the Endpoint

### Option 1: Direct API Call
```bash
curl -X POST http://localhost:3000/api/approve \
  -H "Content-Type: application/json" \
  -d '{
    "releaseId": "ENS-TEST-1763657389492",
    "signature": "0x..."
  }'
```

### Option 2: Use Test Script
```bash
npm run test:approve
```

The test script will:
1. Find the latest ENS-TEST release in database
2. Create a signature using your curator private key
3. POST to /api/approve
4. Verify the response

---

## Files Created

- ✅ `app/api/approve/route.ts` - Main endpoint (10 steps)
- ✅ `lib/api/test-approve.ts` - Test script

## Files Used

- ✅ `lib/services/safe.ts` - 3 verification functions
- ✅ `lib/db/approvals.ts` - Approval storage
- ✅ `lib/services/jobs.ts` - publishRelease() trigger
- ✅ `lib/db/migrations/001-initial-schema.sql` - Schema

---

## What Happens When Threshold Met

When approval count >= threshold:

1. **Automatic trigger** → `publishRelease()` is called
2. **Full flow executes:**
   - Pin IPFS (media + cover + metadata)
   - Create Splits contract
   - Mint Zora coin
   - Register ENS subname + records
   - Update database
   - Cleanup temp files

3. **Result** → Release status changes to "published"

---

## Key Design Decisions

✅ **Safe threshold = 1** (1-of-1 multisig, just curator)
✅ **EIP-191 signatures** (Standard Ethereum signature format)
✅ **Case-insensitive addresses** (0x... format handled)
✅ **Automatic job trigger** (No manual polling needed)
✅ **Duplicate prevention** (Curator can't approve twice)
✅ **Non-blocking errors** (If publish fails, approval still stored)

---

## Next Steps (Day 12+)

- [ ] Test approve endpoint with real signatures
- [ ] Integrate approve button into curator dashboard
- [ ] Frontend signing flow (curator signs with wallet)
- [ ] Handle multi-curator case (threshold > 1)

---

**Date:** November 20, 2025  
**Status:** ✅ Complete

