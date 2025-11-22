# 🚀 Safe Day 6 Quick Reference

## What Safe Patterns Matter for Day 6?

From `@safe-context.md`, here are the **only 3 patterns you need**:

---

## Pattern 1: Verify Curator is Safe Member

**Safe Doc Reference:**
> From safe-context.md: `interface ISafe { function getOwners() external view returns (address[]); }`

**What to Do:**
```typescript
// Query Safe contract to get all owners
const owners = await safe.getOwners()

// Check if curator address is in the list
const isMember = owners.includes(curatorAddress)
```

**Why:** Ensure only authorized curators can approve releases

**Day 6 Implementation:**
```typescript
// lib/services/safe.ts
async function isSafeMember(curatorAddress: string, safeAddress: string) {
  const safe = new ethers.Contract(safeAddress, SAFE_ABI, provider)
  const owners = await safe.getOwners()
  return owners.map(o => o.toLowerCase()).includes(curatorAddress.toLowerCase())
}
```

---

## Pattern 2: Check Approval Threshold

**Safe Doc Reference:**
> From safe-context.md: `interface ISafe { function getThreshold() external view returns (uint256); }`

**What to Do:**
```typescript
// Query Safe contract to get required approval count
const threshold = await safe.getThreshold()

// Compare against approvals in database
if (approvals.count >= threshold) {
  // TRIGGER PUBLISH JOB!
}
```

**Why:** Know when enough curators have approved

**Day 6 Implementation:**
```typescript
// lib/services/safe.ts
async function getApprovalThreshold(safeAddress: string) {
  const safe = new ethers.Contract(safeAddress, SAFE_ABI, provider)
  return await safe.getThreshold()
}
```

---

## Pattern 3: Verify Signature

**Safe Doc Reference:**
> From safe-context.md: EIP-191 standard signature verification using ethers.js

**What to Do:**
```typescript
// Curator signs: ethers.solidityPackedKeccak256(['string', 'string'], ['RELEASE_APPROVAL', releaseId])
// Backend verifies by recovering signer address

const messageHash = ethers.solidityPackedKeccak256(
  ['string', 'string'],
  ['RELEASE_APPROVAL', releaseId]
)
const recoveredAddress = ethers.recoverAddress(messageHash, signature)

// Check if recovered address matches curator address
if (recoveredAddress.toLowerCase() === curatorAddress.toLowerCase()) {
  // Signature is valid!
}
```

**Why:** Prove curator actually signed the approval

**Day 6 Implementation:**
```typescript
// lib/services/safe.ts
function verifyCuratorSignature(releaseId: string, signature: string) {
  const messageHash = ethers.solidityPackedKeccak256(
    ['string', 'string'],
    ['RELEASE_APPROVAL', releaseId]
  )
  return ethers.recoverAddress(messageHash, signature)
}
```

---

## That's It!

**What You DON'T Need (from @safe-context.md):**
- ❌ Protocol Kit (overkill for reading)
- ❌ Deploying new Safes
- ❌ Safe Transaction Service
- ❌ ERC-4337 (that's advanced)
- ❌ Multiple signers/threshold logic (Safe handles this)

**What You DO Need:**
- ✅ ethers.js (to call Safe contract)
- ✅ 3 functions: `getOwners()`, `getThreshold()`, `recoverAddress()`
- ✅ SAFE_ABI with 2 methods

---

## Implementation Checklist

- [ ] Install: `npm install ethers@6`
- [ ] Create `lib/services/safe.ts` with 3 functions above
- [ ] Create minimal SAFE_ABI (2 view functions)
- [ ] Test each function with your actual Safe address
- [ ] Integrate into POST /api/curator/approve
- [ ] Done! Move to IPFS (Day 7)

---

## Code Template (Copy-Paste Ready)

```typescript
// lib/services/safe.ts
import { ethers } from 'ethers'

// Minimal ABI - only what we need to read
const SAFE_ABI = [
  'function getOwners() external view returns (address[])',
  'function getThreshold() external view returns (uint256)',
]

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL)

// 1. Verify signature
export function verifyCuratorSignature(
  releaseId: string,
  signature: string
): { success: boolean; address?: string; error?: string } {
  try {
    const messageHash = ethers.solidityPackedKeccak256(
      ['string', 'string'],
      ['RELEASE_APPROVAL', releaseId]
    )
    const recovered = ethers.recoverAddress(messageHash, signature)
    return { success: true, address: recovered }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// 2. Check if curator is Safe member
export async function isSafeMember(
  curatorAddress: string,
  safeAddress: string
): Promise<boolean> {
  try {
    const safe = new ethers.Contract(safeAddress, SAFE_ABI, provider)
    const owners = await safe.getOwners()
    return owners.map(o => o.toLowerCase()).includes(curatorAddress.toLowerCase())
  } catch (error) {
    console.error('Error checking Safe member:', error)
    throw error
  }
}

// 3. Get approval threshold
export async function getApprovalThreshold(safeAddress: string): Promise<number> {
  try {
    const safe = new ethers.Contract(safeAddress, SAFE_ABI, provider)
    return Number(await safe.getThreshold())
  } catch (error) {
    console.error('Error getting Safe threshold:', error)
    throw error
  }
}
```

**That's literally all the Safe code you need for Day 6.**

---

**Document Version:** 1.0  
**Created:** November 16, 2025

