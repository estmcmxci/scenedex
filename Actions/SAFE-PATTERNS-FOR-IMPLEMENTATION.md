# 🔐 Safe Patterns for Implementation

## Overview

This document extracts key patterns from `@safe-context.md` (Safe Global documentation) and applies them to our Day 6 implementation.

---

## 1. CORE PATTERN: Protocol Kit for Safe Interaction

### What is Protocol Kit?

**Protocol Kit** = Official Safe SDK for reading Safe contract state and building transactions

From Safe docs:
> "The Protocol Kit is the entry point for interacting with Safe Smart Accounts. It abstracts complex logic from other kits."

### When to Use Protocol Kit

✅ **For Reading** (what we need on Day 6):
- Get Safe owners
- Get Safe threshold
- Verify Safe configuration

❌ **Not needed** (for our use case initially):
- Deploying new Safes
- Signing transactions (curator already has Safe, already signed)

---

## 2. KEY METHOD: getOwners()

### From Safe Contract Interface

```solidity
interface ISafe {
    function getOwners() external view returns (address[]);
}
```

### How It's Used in Safe Docs

```typescript
import Safe from '@safe-global/protocol-kit'

const protocolKit = await Safe.init({
  provider: process.env.SEPOLIA_RPC_URL,
  signer: curators_signer,
  safeAddress: '0xf2fa1E8e06641C76Cfe2854c1e4D932a8b6e29fD'
})

// Get owners
const owners = await protocolKit.getOwners()
console.log('Safe Owners:', owners)
```

### Why This Matters

- ✅ Returns array of all owner addresses
- ✅ Can be called by anyone (view function, no gas)
- ✅ Used to verify curator is a Safe member

---

## 3. KEY METHOD: getThreshold()

### From Safe Contract Interface

```solidity
interface ISafe {
    function getThreshold() external view returns (uint256);
}
```

### How It's Used in Safe Docs

```typescript
// Already initialized protocolKit
const threshold = await protocolKit.getThreshold()
console.log('Safe Threshold:', threshold)
```

### Why This Matters

- ✅ Returns required approval count
- ✅ Can be called by anyone (view function)
- ✅ Used to check: approvals.count >= threshold

---

## 4. SAFE SETUP: Configuration at Deployment

### From Safe Docs Example

```solidity
interface ISafe {
    function setup(
        address[] _owners,
        uint256 _threshold,
        address to,
        bytes calldata data,
        address fallbackHandler,
        address paymentToken,
        uint256 payment,
        address paymentReceiver
    ) external;
}
```

### Real Example from Safe Docs

```javascript
// Safe initialized with 3 owners, threshold of 2
{
  owners: ['0x...curator1', '0x...curator2', '0x...curator3'],
  threshold: 2
}
```

### Why This Matters for Us

- Your Safe is already set up (you did this on app.safe.global)
- We just need to READ this configuration
- Day 6 only needs to verify: 2 curators have approved (threshold = 2)

---

## 5. PATTERN: How to Query Safe

### Option A: Direct RPC Call (What We're Doing - Simpler)

```typescript
// Using ethers.js to call Safe contract directly
const SAFE_ABI = [
  'function getOwners() external view returns (address[])',
  'function getThreshold() external view returns (uint256)',
];

const provider = new ethers.JsonRpcProvider(RPC_URL);
const safe = new ethers.Contract(safeAddress, SAFE_ABI, provider);

const owners = await safe.getOwners();      // Get all owners
const threshold = await safe.getThreshold(); // Get approval count needed
```

**Pros:**
- ✅ Minimal dependencies
- ✅ Direct contract interaction
- ✅ No SDK overhead

**Cons:**
- Need to manage ABI manually

### Option B: Protocol Kit (What Safe Recommends - Heavier)

```typescript
import Safe from '@safe-global/protocol-kit'

const protocolKit = await Safe.init({
  provider: RPC_URL,
  signer: signer,
  safeAddress: safeAddress
})

const owners = await protocolKit.getOwners()
const threshold = await protocolKit.getThreshold()
```

**Pros:**
- ✅ Official Safe SDK
- ✅ Handles edge cases
- ✅ More features

**Cons:**
- ⚠️ Heavier dependency
- ⚠️ Overkill for just reading

---

## 6. SIGNATURE VERIFICATION: Two Approaches

### Approach A: Direct ethers.js (What We're Doing - Day 6)

```typescript
// From safe-context.md patterns
import { ethers } from 'ethers'

function verifyCuratorSignature(releaseId: string, signature: string) {
  // Create message hash (EIP-191 standard)
  const messageHash = ethers.solidityPackedKeccak256(
    ['string', 'string'],
    ['RELEASE_APPROVAL', releaseId]
  )

  // Recover signer address
  const recoveredAddress = ethers.recoverAddress(messageHash, signature)
  
  return recoveredAddress
}
```

**Why This Pattern:**
- ✅ Works for off-chain signatures (before Safe approval)
- ✅ Verifies curator identity
- ✅ Standard EIP-191 format

### Approach B: Safe's isValidSignature() (For Later - When Safe Signs)

From Safe docs:
```solidity
function isValidSignature(
    bytes memory _data,
    bytes memory _signature
) public view returns (bytes4);
```

**When We'd Use This:**
- After Safe approves on-chain (not needed for Day 6)
- Safe contract validates cumulative signatures

---

## 7. SAFE TESTING PATTERN

### From safe-context.md - How Safe is Tested

```typescript
// Deploy Safe with specific configuration
const safeWithMultipleOwners = {
  owners: ['0xAlice', '0xBob', '0xCharlie'],
  threshold: 2  // 2-of-3 multisig
}

// In tests, initialize like:
const protocolKit = await Safe.init({
  provider,
  signer,
  safeAddress: deployedSafeAddress,
})

// Verify configuration
const owners = await protocolKit.getOwners()
const threshold = await protocolKit.getThreshold()

expect(owners).toContain('0xAlice')
expect(threshold).toBe(2)
```

---

## 8. OUR DAY 6 IMPLEMENTATION MAPPING

### What Safe Docs Give Us → How We Use It

| Safe Pattern | Our Usage | Day 6 Task |
|--------------|-----------|-----------|
| `getOwners()` | Verify curator is Safe member | Check `owners.includes(curatorAddress)` |
| `getThreshold()` | Know approval count needed | Compare `approvals.count >= threshold` |
| `setup()` configuration | Already done by curators | Read-only, no deployment needed |
| Direct RPC calls | Query Safe state | Use ethers.js contract instance |
| EIP-191 signatures | Verify approval message | Recover signer address |
| Protocol Kit | (Future upgrades) | Can add later if needed |

---

## 9. SAFE CONTRACT ABI (Minimal for Day 6)

From safe-context.md, the minimal ABI we need:

```javascript
const SAFE_ABI = [
  {
    "inputs": [],
    "name": "getOwners",
    "outputs": [{"type": "address[]"}],
    "type": "function",
    "stateMutability": "view"
  },
  {
    "inputs": [],
    "name": "getThreshold",
    "outputs": [{"type": "uint256"}],
    "type": "function",
    "stateMutability": "view"
  }
]
```

**Why Minimal ABI:**
- ✅ We only read, don't write
- ✅ No need for all Safe methods
- ✅ Reduces code complexity

---

## 10. ERROR HANDLING PATTERN

### From Safe Docs Testing Examples

```typescript
try {
  // Query Safe state
  const owners = await safe.getOwners()
  const threshold = await safe.getThreshold()
  
  if (owners.length === 0) {
    throw new Error('Safe has no owners')
  }
  
  if (threshold === 0) {
    throw new Error('Safe has invalid threshold')
  }
  
} catch (error) {
  console.error('Safe configuration error:', error)
  // Fail gracefully - report to curator
}
```

---

## 11. ENVIRONMENT SETUP (From Safe Docs)

What Safe docs recommend for initialization:

```typescript
// From safe-context.md examples
import Safe from '@safe-global/protocol-kit'
import { ethers } from 'ethers'

// Initialize provider
const provider = new ethers.JsonRpcProvider(
  process.env.SEPOLIA_RPC_URL
)

// Initialize signer (curator's wallet)
const signer = new ethers.Wallet(
  process.env.CURATOR_SIGNER_KEY,
  provider
)

// Initialize Safe client (read-only for Day 6)
const protocolKit = await Safe.init({
  provider,
  signer,
  safeAddress: process.env.SAFE_ADDRESS
})
```

---

## 12. DAY 6 IMPLEMENTATION: Applying These Patterns

### Safe Service Implementation

```typescript
// lib/services/safe.ts - Using patterns from safe-context.md

import { ethers } from 'ethers'

// Pattern 1: Direct contract calls (simpler, recommended for reading)
async function isSafeMember(curator: string, safeAddress: string) {
  const SAFE_ABI = [
    'function getOwners() external view returns (address[])'
  ]
  
  const provider = new ethers.JsonRpcProvider(
    process.env.SEPOLIA_RPC_URL
  )
  
  const safe = new ethers.Contract(safeAddress, SAFE_ABI, provider)
  
  try {
    const owners = await safe.getOwners()
    return owners.map(o => o.toLowerCase()).includes(curator.toLowerCase())
  } catch (error) {
    console.error('Safe query error:', error)
    throw error
  }
}

// Pattern 2: Signature verification (EIP-191 standard from Safe docs)
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

## Summary: Safe Patterns for Day 6

| Pattern | Source | Our Usage |
|---------|--------|-----------|
| `getOwners()` | Safe contract function | Verify curator membership |
| `getThreshold()` | Safe contract function | Check approval count |
| Direct RPC calls | safe-context.md examples | Query Safe state efficiently |
| EIP-191 signatures | Safe signing standard | Verify approval messages |
| Error handling | Safe testing patterns | Graceful failures |
| ethers.js integration | Safe docs examples | Minimal setup |

---

## Next Steps

1. **Today (Before Day 6):** Install ethers.js
   ```bash
   npm install ethers@6
   ```

2. **Day 6:** Implement `lib/services/safe.ts` using these patterns

3. **Day 6 Testing:** Verify with your actual Safe
   ```bash
   # Query your Safe
   npx ts-node -e "
     import { isSafeMember } from './lib/services/safe'
     const result = await isSafeMember(
       '0xYourCuratorAddress',
       '0xf2fa1E8e06641C76Cfe2854c1e4D932a8b6e29fD'
     )
     console.log('Is member:', result)
   "
   ```

---

**Document Version:** 1.0  
**Source:** @safe-context.md patterns + Safe Global official docs  
**Created:** November 16, 2025

