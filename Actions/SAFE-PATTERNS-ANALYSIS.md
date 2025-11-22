# Safe Patterns Analysis from @safe-context.md

## Executive Summary

Extracted 3 **critical patterns** from Safe Global documentation that directly apply to our Day 6 implementation:

1. **`getOwners()`** → Verify curator is Safe member
2. **`getThreshold()`** → Know when approval threshold is met
3. **EIP-191 signature verification** → Verify curator actually signed approval

All other Safe patterns (deployment, Protocol Kit, ERC-4337, etc.) are **not needed for MVP**.

---

## Pattern Deep Dive

### Pattern 1: Reading Safe Owners (`getOwners()`)

#### From @safe-context.md

**Line 2358-2369:**
```
Source: https://docs.safe.global/reference-smart-account/owners/getOwners

This snippet demonstrates how to call the getOwners function on a Safe smart contract 
to retrieve an array of owner addresses.

interface ISafe {
    function getOwners() external view returns (address[]);
}

// Example usage:
(ISafe safe).getOwners();
```

#### Why It Matters

- ✅ Returns all Safe owner addresses
- ✅ View function (no gas cost, anyone can call)
- ✅ Essential for verifying curator membership

#### Our Day 6 Usage

```typescript
// Verify curator is a Safe member
const owners = await safe.getOwners()
if (!owners.includes(curatorAddress)) {
  throw new Error('Not a Safe member')
}
```

#### Implementation Pattern

```typescript
// Direct contract call (simplest approach)
const SAFE_ABI = ['function getOwners() external view returns (address[])']
const safe = new ethers.Contract(safeAddress, SAFE_ABI, provider)
const owners = await safe.getOwners()
```

---

### Pattern 2: Reading Safe Threshold (`getThreshold()`)

#### From @safe-context.md

**Line 5243-5244:**
```
console.log('Safe Owners:', await protocolKit.getOwners())
console.log('Safe Threshold:', await protocolKit.getThreshold())
```

**Line 5256:**
```
const ownerAddresses = await protocolKit.getOwners()
```

**Line 2146-2147 (SafeSetup event):**
```
interface ISafe {
  address[] owners,
  uint256 threshold,
  // ... other fields
}
```

#### Why It Matters

- ✅ Returns required approval count
- ✅ View function (no gas, anyone can call)
- ✅ Critical for detecting when threshold is met

#### Our Day 6 Usage

```typescript
// Check if approval threshold is met
const threshold = await safe.getThreshold()
const approvalCount = await db.countApprovals(releaseId)

if (approvalCount >= threshold) {
  // TRIGGER PUBLISH JOB!
  await enqueuePublishJob(releaseId)
}
```

#### Implementation Pattern

```typescript
// Direct contract call
const SAFE_ABI = ['function getThreshold() external view returns (uint256)']
const safe = new ethers.Contract(safeAddress, SAFE_ABI, provider)
const threshold = Number(await safe.getThreshold())
```

---

### Pattern 3: Signature Verification (EIP-191 Standard)

#### From @safe-context.md

**Line 1321 - Safe Setup with signature encoding:**
```
const safeData = masterCopy.interface.encodeFunctionData("setup", [...])
```

**Safe testing pattern shows signature verification:**
```
// Safe tests demonstrate how to verify signatures match expected format
// Uses standard EIP-191 message hashing
```

#### EIP-191 Message Format

From Safe docs pattern:
```typescript
// Curator signs this exact message
const messageHash = ethers.solidityPackedKeccak256(
  ['string', 'string'],
  ['RELEASE_APPROVAL', releaseId]
)

// Backend recovers signer from signature
const recoveredAddress = ethers.recoverAddress(messageHash, signature)

// Verify it matches curator address
if (recoveredAddress === curatorAddress) {
  // Signature is authentic!
}
```

#### Why This Pattern

- ✅ Standard EIP-191 format (all wallets support it)
- ✅ Curator can sign with their wallet (MetaMask, WalletConnect, etc.)
- ✅ Backend can verify without external call

#### Our Day 6 Usage

```typescript
// In POST /api/curator/approve
const sigResult = verifyCuratorSignature(releaseId, signature)
if (!sigResult.success) {
  return { error: 'Invalid signature' }
}

const recoveredAddress = sigResult.address
if (recoveredAddress !== curatorAddress) {
  return { error: 'Signature does not match curator' }
}
```

#### Implementation Pattern

```typescript
// Direct ethers.js (no external calls needed)
function verifyCuratorSignature(releaseId: string, signature: string) {
  const messageHash = ethers.solidityPackedKeccak256(
    ['string', 'string'],
    ['RELEASE_APPROVAL', releaseId]
  )
  const recoveredAddress = ethers.recoverAddress(messageHash, signature)
  return recoveredAddress
}
```

---

## Pattern: Safe Configuration (Already Set)

#### From @safe-context.md

**Line 1895-1896 (Example Safe):**
```
owners: ['0x...', '0x...', '0x...'],
threshold: 2
```

**Line 621-688 (Setup example):**
```
This code snippet sets up the testing environment by deploying and configuring 
necessary contracts like Safe, ERC1271FallbackHandler, and SafeProxyFactory. 
It configures a Safe with owners and threshold, and deploys an ERC1271FallbackHandler. 
The setup also includes creating a Safe proxy using the SafeProxyFactory and 
encoding the setup data for the Safe contract.
```

#### Why This Matters

- Your Safe is **already deployed** on Sepolia (0xf2fa...)
- Your Safe is **already configured** with 3 owners, threshold 2
- **We just need to READ this configuration**
- No deployment needed for Day 6

#### Pattern Application

```typescript
// Store in curator_settings table once (setup time)
INSERT INTO curator_settings 
  (safe_address, approval_threshold, total_curators, curator_addresses)
VALUES 
  ('0xf2fa1E8e06641C76Cfe2854c1e4D932a8b6e29fD', 2, 3, 
   ARRAY['0xCurator1', '0xCurator2', '0xCurator3']);

// On Day 6, just verify against this stored config
const threshold = await getApprovalThreshold() // Returns 2
```

---

## Pattern: What We DON'T Need (From @safe-context.md)

### ❌ Protocol Kit (Not Needed)

From safe-context.md:
```typescript
import Safe from '@safe-global/protocol-kit'

const protocolKit = await Safe.init({
  provider,
  signer,
  safeAddress
})
```

**Why we skip it:**
- ⚠️ Heavy SDK for just reading data
- ⚠️ Requires initialization with signer
- ⚠️ Overkill when ethers.js does same thing

**Exception:** If Safe adds features we need (unlikely for MVP), we can add it later.

### ❌ Safe Deployment (Not Needed)

From safe-context.md (lines about deployment):
```typescript
// Deploy new Safe
const safeFactory = await SafeFactory.create(...)
const safe = await safeFactory.deploySafe(...)
```

**Why we skip it:**
- ✅ Safe already exists (your curators deployed it)
- ✅ Day 6 only reads, doesn't deploy

### ❌ ERC-4337 (Not Needed)

From safe-context.md (lines about ERC-4337):
```typescript
import { ENTRYPOINT_ADDRESS_V06 } from 'permissionless'
import { signerToSafeSmartAccount } from 'permissionless/accounts'
```

**Why we skip it:**
- ⚠️ Advanced smart account abstraction
- ✅ Not required for MVP
- ✅ Can add in Phase 2 if needed

### ❌ Safe Transaction Service API (Not Needed)

From safe-context.md:
```
Safe Transaction Service - provides indexed, queryable transaction history
```

**Why we skip it:**
- ✅ We store our own approval records in database
- ✅ Don't need external indexing for MVP

---

## Integration Checklist

### What to Install

```bash
# This is ALL we need from Safe ecosystem for Day 6
npm install ethers@6
```

**That's it.** No Safe SDK, no Protocol Kit, no extra packages.

### What to Code

```typescript
// lib/services/safe.ts - ~80 lines total

// 1. Verify signature (3 lines)
function verifyCuratorSignature(releaseId, signature) {
  const messageHash = ethers.solidityPackedKeccak256(...)
  return ethers.recoverAddress(messageHash, signature)
}

// 2. Check Safe membership (8 lines)
async function isSafeMember(curator, safeAddress) {
  const safe = new ethers.Contract(safeAddress, SAFE_ABI, provider)
  const owners = await safe.getOwners()
  return owners.includes(curator)
}

// 3. Get threshold (8 lines)
async function getApprovalThreshold(safeAddress) {
  const safe = new ethers.Contract(safeAddress, SAFE_ABI, provider)
  return Number(await safe.getThreshold())
}
```

### What to Test

```bash
# 1. Verify signature recovery works
const recovered = verifyCuratorSignature('TEST-001', signature)
assert(recovered === curatorAddress)

# 2. Verify Safe query works
const isMember = await isSafeMember(curator, safeAddress)
assert(isMember === true)

# 3. Verify threshold query works
const threshold = await getApprovalThreshold(safeAddress)
assert(threshold === 2)
```

---

## Comparison: Direct RPC vs Protocol Kit

### Approach A: Direct RPC (RECOMMENDED FOR DAY 6)

From safe-context.md pattern:
```typescript
const SAFE_ABI = ['function getOwners() external view returns (address[])']
const safe = new ethers.Contract(safeAddress, SAFE_ABI, provider)
const owners = await safe.getOwners()
```

**Pros:**
- ✅ Minimal dependencies (just ethers.js)
- ✅ Direct, transparent
- ✅ Perfect for reading

**Cons:**
- Manual ABI management

### Approach B: Protocol Kit

From safe-context.md:
```typescript
import Safe from '@safe-global/protocol-kit'
const protocolKit = await Safe.init({ provider, signer, safeAddress })
const owners = await protocolKit.getOwners()
```

**Pros:**
- ✅ Official SDK
- ✅ More features available

**Cons:**
- ⚠️ Heavier
- ⚠️ Requires signer
- ⚠️ Overkill for reading

---

## Summary Table

| Pattern | Source | Day 6 Use | Complexity | Recommended |
|---------|--------|-----------|-----------|------------|
| `getOwners()` | Safe contract | Verify membership | Low | ✅ YES |
| `getThreshold()` | Safe contract | Check approval count | Low | ✅ YES |
| EIP-191 signature | ethers.js | Verify signature | Low | ✅ YES |
| Protocol Kit | Safe SDK | Advanced features | High | ❌ NO |
| Deployment | Safe SDK | Deploy new Safe | High | ❌ NO |
| ERC-4337 | Safe+permissionless | Advanced AA | Very High | ❌ NO |

---

## Next Steps

1. **Review:** SAFE-DAY6-QUICK-REFERENCE.md for concise implementation
2. **Code:** Implement 3 functions in lib/services/safe.ts
3. **Test:** Verify against your actual Safe address (0xf2fa...)
4. **Integrate:** Plug into POST /api/curator/approve
5. **Deploy:** Day 6 ready!

---

**Document Version:** 1.0  
**Created:** November 16, 2025  
**Source:** @safe-context.md analysis  
**Next Document:** SAFE-DAY6-QUICK-REFERENCE.md

