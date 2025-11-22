# AI Guide: ENS NameWrapper Subname Creation Patterns

> A comprehensive guide for AI assistants implementing ENS NameWrapper subname creation

## 🎯 Purpose

This guide documents the **critical patterns, gotchas, and implementation details** for programmatically creating ENS subnames using the NameWrapper contract. Use this when helping developers build similar tools.

## 📚 Key Files to Reference

### **Must-Read Files (in order):**

1. **`src/contracts.ts`** - Contract addresses, ABIs, and fuse constants
2. **`src/utils.ts`** - Name normalization and namehash generation
3. **`src/create-subname.ts`** - Main transaction flow (3 steps)
4. **`src/config.ts`** - Environment variable handling
5. **`src/test-setup.ts`** - Pre-flight validation patterns

### **Supporting Files:**

- **`ens-context.md`** - Full ENS documentation reference
- **`README.md`** - User-facing documentation
- **`GITHUB_SETUP.md`** - Repository setup instructions

---

## 🔑 Critical Patterns & Lessons Learned

### 1. **Name Normalization is MANDATORY**

❌ **WRONG:**
```typescript
const node = namehash('MyName.eth'); // Will generate incorrect hash!
```

✅ **CORRECT:**
```typescript
import { namehash, normalize } from 'viem/ens';

const normalizedName = normalize('MyName.eth'); // → 'myname.eth'
const node = namehash(normalizedName);          // → correct hash
```

**Why:** ENS names must follow ENSIP-15 normalization (Unicode normalization, lowercasing, etc.) before hashing. Viem's `normalize()` handles this.

**Location:** `src/utils.ts` lines 13-23

---

### 2. **Fuses Must Be Configured Correctly**

#### **The Gotcha We Encountered:**

Initially set fuses to `65536` (PARENT_CANNOT_CONTROL only), which caused `OperationProhibited` error.

#### **The Fix:**

To emancipate a subname, you **MUST burn both fuses together**:

```typescript
// ❌ WRONG: Only PARENT_CANNOT_CONTROL
const fuses = 65536; // Error: OperationProhibited(bytes32)

// ✅ CORRECT: Both fuses burned
const fuses = 65537; // (1 << 0) | (1 << 16)
// = CANNOT_UNWRAP (1) + PARENT_CANNOT_CONTROL (65536)
```

#### **Why:**

From ENS NameWrapper docs:
> "To burn CANNOT_UNWRAP, PARENT_CANNOT_CONTROL must be burned."

They're interdependent and must be burned together for emancipation.

#### **Default Recommendation:**

Use `fuses = 0` (no fuses) unless specifically needing emancipation:
- `0` = Parent retains control (can modify/delete)
- `65537` = Emancipated (permanent, parent loses control)

**Location:** `src/contracts.ts` lines 64-68, `src/create-subname.ts` lines 71-73

---

### 3. **Subname Existence Check Logic**

#### **The Bug:**

Initial test checked if subname existed by calling `NameWrapper.ownerOf(tokenId)` and treating `0x0` return as "already exists".

#### **The Reality:**

NameWrapper **returns `0x0` for non-existent tokens** instead of reverting!

❌ **WRONG:**
```typescript
try {
  const owner = await nameWrapper.read.ownerOf([tokenId]);
  // If we get here, subname exists
} catch {
  // Subname doesn't exist
}
```

✅ **CORRECT:**
```typescript
const owner = await nameWrapper.read.ownerOf([tokenId]);

if (owner === '0x0000000000000000000000000000000000000000') {
  // Subname DOES NOT EXIST (available)
} else {
  // Subname exists and is owned by 'owner'
}
```

**Location:** `src/test-setup.ts` lines 270-288

---

### 4. **The Three-Transaction Flow**

Creating a subname with records requires **exactly 3 transactions**:

#### **Transaction 1: Create Wrapped Subname**

```typescript
NameWrapper.setSubnodeRecord(
  parentNode,      // bytes32: namehash("parent.eth")
  "subname",       // string: Label (NOT hashed!)
  ownerAddress,    // address: Owner of new subname
  resolverAddress, // address: Resolver contract
  0,               // uint64: TTL (typically 0)
  0,               // uint32: Fuses to burn (0 or 65537)
  expiryTimestamp  // uint64: Unix timestamp
)
```

**Key Points:**
- Label is passed as **string**, not `keccak256` hash
- Creates subname AND sets resolver atomically
- Must wait for confirmation before proceeding

#### **Transaction 2: Set ETH Address**

```typescript
PublicResolver.setAddr(
  subnameNode,  // bytes32: namehash("subname.parent.eth")
  ethAddress    // address: Address to resolve to
)
```

**Key Points:**
- Use the **full subname node**, not parent node
- Sets the default ETH address (coin type 60)

#### **Transaction 3: Set Text Records**

```typescript
PublicResolver.setText(
  subnameNode,  // bytes32: namehash("subname.parent.eth")
  "email",      // string: Record key
  "user@example.com" // string: Record value
)
```

**Key Points:**
- Can be called multiple times for different keys
- Common keys: `email`, `url`, `avatar`, `description`, `com.twitter`, etc.

**Location:** `src/create-subname.ts` lines 95-180

---

### 5. **Contract Addresses by Network**

#### **Sepolia Testnet:**
```typescript
{
  NameWrapper: '0x0635513f179D50A207757E05759CbD106d7dFcE8',
  PublicResolver: '0xE99638b40E4Fff0129D56f03b55b6bbC4BBE49b5',
  Registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
}
```

#### **Mainnet:**
```typescript
{
  NameWrapper: '0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401',
  PublicResolver: '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63',
  Registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' // Same on all networks
}
```

**Location:** `src/contracts.ts` lines 7-15

---

## 🏗️ Architecture Patterns

### **Configuration Management**

```typescript
// Load .env.local explicitly (not default .env)
import { config as dotenvConfig } from 'dotenv';
import { dirname, join } from 'path';

const envPath = join(__dirname, '..', '.env.local');
dotenvConfig({ path: envPath });
```

**Why:** Users often have `.env.local` instead of `.env`. Explicit path loading prevents "variable not found" errors.

**Location:** `src/config.ts` lines 1-13

---

### **Error Handling Pattern**

```typescript
try {
  const txHash = await walletClient.writeContract({ ... });
  console.log(`✅ Transaction sent: ${txHash}`);
  
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
    confirmations: 2, // Wait for 2 confirmations
  });
  
  if (receipt.status === 'success') {
    console.log('✅ Transaction confirmed');
  } else {
    throw new Error('Transaction reverted');
  }
} catch (error) {
  console.error('❌ Failed:', error);
  throw error; // Re-throw to stop execution
}
```

**Pattern:**
1. Send transaction
2. Wait for receipt with confirmations
3. Check status
4. Handle errors with context

**Location:** `src/create-subname.ts` throughout

---

### **Pre-Flight Validation**

Always validate before executing:

```typescript
// 1. Check wallet balance
const balance = await publicClient.getBalance({ address });
if (balance === 0n) throw new Error('No ETH for gas');

// 2. Check parent ownership
const owner = await nameWrapper.read.ownerOf([parentTokenId]);
if (owner !== walletAddress) throw new Error('Not parent owner');

// 3. Check subname doesn't exist
const subnameOwner = await nameWrapper.read.ownerOf([subnameTokenId]);
if (subnameOwner !== '0x0000...') throw new Error('Subname exists');

// 4. Estimate gas
const gasPrice = await publicClient.getGasPrice();
console.log(`Estimated cost: ~${estimatedGas * gasPrice} wei`);
```

**Location:** `src/test-setup.ts` lines 50-300

---

## 🐛 Common Errors & Solutions

### **Error: `OperationProhibited(bytes32)`**

**Signature:** `0xa2a72013`

**Causes:**
1. Subname already exists (even if owned by `0x0`)
2. Wrong fuses (need both CANNOT_UNWRAP + PARENT_CANNOT_CONTROL for emancipation)
3. Parent has CANNOT_CREATE_SUBDOMAIN burned

**Solutions:**
- Check subname availability first
- Use fuses = 0 or fuses = 65537 (not 65536)
- Verify parent fuses with diagnostic script

**Reference:** We encountered this in testing. See commit history for full debugging process.

---

### **Error: "Missing required environment variable"**

**Cause:** Using `.env` instead of `.env.local`, or dotenv not loading correct file.

**Solution:**
```typescript
// Explicitly load .env.local
dotenvConfig({ path: join(__dirname, '..', '.env.local') });
```

**Location:** `src/config.ts` lines 8-10

---

### **Error: Wrong namehash / "Name doesn't exist"**

**Cause:** Not normalizing names before hashing.

**Solution:**
```typescript
// ALWAYS normalize before namehash
const node = namehash(normalize('Name.eth'));
```

**Location:** `src/utils.ts` lines 13-23

---

## 🎓 Implementation Checklist

When implementing ENS subname creation, ensure:

- [ ] Names are normalized before hashing
- [ ] Label passed as **string** to `setSubnodeRecord`, not hash
- [ ] Fuses set correctly (0 or 65537, not 65536)
- [ ] Pre-flight validation checks all prerequisites
- [ ] Transactions executed in order with confirmations
- [ ] `.env.local` loaded explicitly if needed
- [ ] Error handling with context for debugging
- [ ] Subname existence checked with `0x0` logic
- [ ] Full subname node used for resolver calls

---

## 📖 Code Flow Diagram

```
┌─────────────────────────────────────────────┐
│  1. Load Config & Initialize Clients       │
│     - Load .env.local                       │
│     - Create publicClient & walletClient    │
│     - Verify wallet balance                 │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│  2. Calculate Namehashes                    │
│     - normalize(parentName)                 │
│     - namehash(normalized)                  │
│     - Calculate parent & subname nodes      │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│  3. TX1: Create Subname                     │
│     NameWrapper.setSubnodeRecord()          │
│     - parentNode, label (string!), owner    │
│     - resolver, ttl, fuses, expiry          │
│     - Wait for confirmation                 │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│  4. TX2: Set ETH Address                    │
│     PublicResolver.setAddr()                │
│     - subnameNode (full!), ethAddress       │
│     - Wait for confirmation                 │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│  5. TX3: Set Text Record                    │
│     PublicResolver.setText()                │
│     - subnameNode, "email", value           │
│     - Wait for confirmation                 │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│  6. Verify & Report                         │
│     - Read back records                     │
│     - Verify matches expected values        │
│     - Display summary with links            │
└─────────────────────────────────────────────┘
```

---

## 🔗 External Resources

1. **ENS NameWrapper Docs**: https://docs.ens.domains/wrapper/contracts
2. **Viem ENS Guide**: https://viem.sh/docs/ens/introduction
3. **ENSIP-15 Normalization**: https://docs.ens.domains/ens-improvement-proposals/ensip-15-normalization-standard
4. **NameWrapper Fuses**: https://docs.ens.domains/wrapper/fuses
5. **Public Resolver**: https://docs.ens.domains/resolvers/public

---

## 🎯 Quick Reference Card

```typescript
// ============================================
// QUICK REFERENCE: ENS Subname Creation
// ============================================

// 1. NORMALIZE before hashing
import { namehash, normalize } from 'viem/ens';
const node = namehash(normalize('name.eth'));

// 2. FUSES configuration
const NO_FUSES = 0;           // Parent retains control
const EMANCIPATED = 65537;    // CANNOT_UNWRAP + PARENT_CANNOT_CONTROL

// 3. CREATE subname (label as STRING!)
await NameWrapper.setSubnodeRecord(
  parentNode, "label", owner, resolver, 0, NO_FUSES, expiry
);

// 4. SET records (use FULL subname node)
await PublicResolver.setAddr(subnameNode, address);
await PublicResolver.setText(subnameNode, "email", "user@example.com");

// 5. CHECK existence (0x0 = available)
const owner = await NameWrapper.ownerOf(tokenId);
if (owner === '0x0000...') { /* available */ }

// 6. CONTRACT addresses (Sepolia)
NameWrapper:    0x0635513f179D50A207757E05759CbD106d7dFcE8
PublicResolver: 0xE99638b40E4Fff0129D56f03b55b6bbC4BBE49b5
```

---

## 🤖 AI Assistant Instructions

When helping developers with ENS NameWrapper subname creation:

1. **Always ask about normalization** - Most bugs stem from this
2. **Clarify fuse requirements** - Default to 0 unless they need emancipation
3. **Point to this guide** - Reference specific sections
4. **Use working code** - Copy patterns from `src/create-subname.ts`
5. **Test on Sepolia first** - Never go straight to mainnet
6. **Validate before executing** - Use pre-flight checks from `src/test-setup.ts`

---

## 📝 Version History

- **v1.0.0** (2024-11-20): Initial guide with patterns from implementation
  - Normalization patterns
  - Fuse configuration lessons
  - Three-transaction flow
  - Common errors and solutions

---

**This guide represents real implementation experience and debugging sessions. All patterns are battle-tested.**

