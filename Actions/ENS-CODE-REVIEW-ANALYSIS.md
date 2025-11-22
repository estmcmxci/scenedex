# ENS Implementation Code Review: lib/services/ens.ts

## 📋 Comparison Against AI_GUIDE.md Patterns

---

## ✅ **CORRECT IMPLEMENTATIONS**

### 1. **Proper Fuse Configuration**
**Status:** ✅ CORRECT

```
Location: lib/services/ens.ts line 320
```

```typescript
console.log(`   Fuses: 0 (no fuses burned)`);
// ...
args: [
  parentNode as `0x${string}`,
  subnameLabel,
  curatorAddress,
  resolver,
  BigInt(0), // ttl
  0, // fuses ← CORRECT: Using 0, not 65536
  expiryTimestamp,
]
```

**Why it's correct:** Uses `fuses = 0` (parent retains control), avoiding the `OperationProhibited` error from using only `65536`.

---

### 2. **Label as String (Not Hash)**
**Status:** ✅ CORRECT

```
Location: lib/services/ens.ts lines 281, 336
```

```typescript
{ name: 'label', type: 'string' }, // ✅ Declared as string in ABI
// ...
subnameLabel,  // ✅ Passed as string, not keccak256 hash
```

**Why it's correct:** ENS NameWrapper expects label as a plain string, not a hashed value. Viem handles normalization internally.

---

### 3. **Transaction Confirmation Pattern**
**Status:** ✅ CORRECT

```
Location: lib/services/ens.ts lines 367-368, 484, 561
```

```typescript
const txHash = await walletClient.writeContract({ ... });
console.log(`      ✅ Tx sent: ${txHash}`);
const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
// Check status and log block number
```

**Why it's correct:** Follows the 3-step pattern: send → wait → verify status.

---

### 4. **Proper Contract Addresses & ABIs**
**Status:** ✅ MOSTLY CORRECT

```
Location: lib/services/ens.ts lines 191, 271-290, 416-437
```

Uses correct Sepolia addresses:
- NameWrapper: `0x0635513f179D50A207757E05759CbD106d7dFcE8` ✅
- PublicResolver: From `ENS_RESOLVER_SEPOLIA` env var ✅
- Complete setSubnodeRecord ABI ✅
- Complete setText/setAddr ABIs ✅

---

### 5. **Simulation Before Execution**
**Status:** ✅ CORRECT

```
Location: lib/services/ens.ts lines 329-348
```

```typescript
try {
  await publicClient.simulateContract({
    account,
    address: NAMEWRAPPER_ADDRESS,
    abi: NAMEWRAPPER_ABI,
    functionName: 'setSubnodeRecord',
    args: [...],
  });
  console.log(`      📋 Simulation passed\n`);
} catch (simErr) {
  console.error(`      ❌ Simulation failed: ${simErr}\n`);
  throw simErr;
}
```

**Why it's correct:** Pre-flight validation catches errors before gas is spent.

---

### 6. **One-Year Expiry Calculation**
**Status:** ✅ CORRECT

```
Location: lib/services/ens.ts lines 310-313
```

```typescript
const now = Math.floor(Date.now() / 1000);
const oneYearInSeconds = 365 * 24 * 60 * 60;
const expiryTimestamp = BigInt(now + oneYearInSeconds);
```

**Why it's correct:** Converts to Unix timestamp, adds 365 days, stored as BigInt (required for uint64).

---

---

## ⚠️ **CRITICAL ISSUES FOUND**

### ❌ **ISSUE #1: Missing Name Normalization**
**Severity:** 🔴 CRITICAL  
**Location:** lib/services/ens.ts lines 44, 152

```typescript
// WRONG - Current code:
const subnameNode = namehash(fullSubname);  // Line 44, 152

// CORRECT - Should be:
import { normalize } from 'viem/ens';
const normalizedName = normalize(fullSubname);
const subnameNode = namehash(normalizedName);
```

**Impact:** 
- If a subname contains uppercase letters (e.g., "EROS001.Scenedex.eth"), the namehash will be INCORRECT
- This will cause transactions to target the WRONG node
- Records will be set on wrong subnames or fail entirely

**Reference:** AI_GUIDE.md Section 1 - Name Normalization is MANDATORY

**Affected Functions:**
1. `getNextEROSNumber()` - Line 44
2. `registerEROSRelease()` - Line 152

---

### ❌ **ISSUE #2: No Subname Existence Check**
**Severity:** 🔴 CRITICAL  
**Location:** lib/services/ens.ts (MISSING)

**Current behavior:** Code doesn't check if subname already exists before creating.

**Should add:**
```typescript
async function checkSubnameExists(subnameNode: string, nameWrapperAddress: string): Promise<boolean> {
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(rpcUrl),
  });

  const NAMEWRAPPER_ABI = [
    {
      name: 'ownerOf',
      type: 'function',
      inputs: [{ name: 'id', type: 'uint256' }],
      outputs: [{ name: 'owner', type: 'address' }],
      stateMutability: 'view',
    },
  ];

  const tokenId = BigInt(subnameNode);
  const owner = await publicClient.readContract({
    address: nameWrapperAddress,
    abi: NAMEWRAPPER_ABI,
    functionName: 'ownerOf',
    args: [tokenId],
  });

  // KEY PATTERN: Return true if owner is NOT zero address (subname exists)
  return owner !== '0x0000000000000000000000000000000000000000';
}
```

**Why this matters:**
- Prevents `OperationProhibited` errors from trying to create duplicate subnames
- Matches the 3-transaction flow from AI_GUIDE.md (pre-flight validation step)
- Follows pattern from `ens-context/check-subname.ts`

**Reference:** AI_GUIDE.md Section 3 - Subname Existence Check Logic

---

### ❌ **ISSUE #3: Incorrect Text Record Encoding**
**Severity:** 🔴 CRITICAL  
**Location:** lib/services/ens.ts lines 112-116

```typescript
// WRONG - Current code:
data: encodeAbiParameters(
  [{ type: 'bytes32' }, { type: 'string' }, { type: 'string' }],
  [node as `0x${string}`, key, value]
) as string,
```

**Problem:** 
1. Uses `encodeAbiParameters()` which is for function parameters ONLY
2. Missing function selector for `setText()` function
3. This creates malformed transaction data

**Correct approach:**
```typescript
// CORRECT - Use encodeAbiParameters() with function selector
import { toFunctionSelector } from 'viem';

// Get the setText function selector
const setTextSelector = '0x10f13a8c'; // setText(bytes32 node, string key, string value)

// Encode parameters WITHOUT the selector
const encodedParams = encodeAbiParameters(
  [{ type: 'bytes32' }, { type: 'string' }, { type: 'string' }],
  [node as `0x${string}`, key, value]
);

// Combine selector + parameters
data: (setTextSelector + encodedParams.slice(2)) as string,
```

**But even better:** Use viem's direct contract encoding:
```typescript
const data = encodeFunctionData({
  abi: RESOLVER_ABI,
  functionName: 'setText',
  args: [node as `0x${string}`, key, value],
});
```

**Reference:** Viem documentation - encodeAbiParameters is for raw parameter encoding, not full transaction data

---

### ⚠️ **ISSUE #4: Incomplete Error Context**
**Severity:** 🟡 MEDIUM  
**Location:** lib/services/ens.ts lines 346, 465

```typescript
// Current - Limited error info:
console.error(`      ❌ Simulation failed: ${simErr}\n`);

// Better - Extract error details:
if (simErr instanceof Error) {
  console.error(`      ❌ Simulation failed: ${simErr.message}`);
  if ('data' in simErr && simErr.data) {
    console.error(`      📊 Error data: ${simErr.data}`);
  }
} else {
  console.error(`      ❌ Simulation failed: ${String(simErr)}`);
}
```

**Impact:** Makes debugging transaction failures difficult. Matches error handling from AI_GUIDE.md better.

---

### ⚠️ **ISSUE #5: Potential Account Context Issues**
**Severity:** 🟡 MEDIUM  
**Location:** lib/services/ens.ts line 456

```typescript
// Current - May fail in some viem versions:
account: walletClient.account,

// Better - Be explicit:
account: account,  // Use the account created earlier
```

**Impact:** In newer viem versions, `walletClient.account` might not be available if account wasn't set during client creation.

---

---

## 📊 **SUMMARY TABLE**

| Issue | Severity | Type | Location | Status |
|-------|----------|------|----------|--------|
| Missing Name Normalization | 🔴 CRITICAL | Logic Bug | Lines 44, 152 | ❌ FAIL |
| No Subname Existence Check | 🔴 CRITICAL | Missing Validation | Entire flow | ❌ FAIL |
| Incorrect Text Record Encoding | 🔴 CRITICAL | Data Bug | Lines 112-116 | ❌ FAIL |
| Limited Error Context | 🟡 MEDIUM | UX/Debug | Lines 346, 465 | ⚠️ FLAG |
| Account Context Issues | 🟡 MEDIUM | Compatibility | Line 456 | ⚠️ FLAG |

---

## 🎯 **Recommended Fix Priority**

1. **FIX FIRST:** Add name normalization to `getNextEROSNumber()` and `registerEROSRelease()`
2. **FIX SECOND:** Add subname existence check before creating
3. **FIX THIRD:** Fix text record encoding in `buildSetTextTransactions()`
4. **FIX OPTIONAL:** Improve error context and account handling

---

## 🔍 **Key Patterns from AI_GUIDE.md to Apply**

### Pattern 1: Normalization Wrapper
```typescript
// From ens-context/utils.ts lines 11-20
export function getNamehash(name: string): `0x${string}` {
  const normalizedName = normalize(name);
  const hash = viemNamehash(normalizedName);
  return hash;
}
```

### Pattern 2: Existence Check
```typescript
// From ens-context/check-subname.ts lines 52-63
const owner = await nameWrapper.read.ownerOf([tokenId]) as `0x${string}`;

if (owner === '0x0000000000000000000000000000000000000000') {
  console.log('✅ Owner is ZERO ADDRESS - subname DOES NOT EXIST');
} else {
  console.log('⚠️ Subname already exists');
}
```

### Pattern 3: Proper Error Handling
```typescript
// From ens-context/check-subname.ts lines 61-63
} catch (error) {
  console.log('✅ ownerOf() reverted - subname does not exist (available)');
}
```

---

## 📚 **Reference Files**

- **AI_GUIDE.md:** Section 1 (Normalization), Section 3 (Existence Checks)
- **check-subname.ts:** Full diagnostic pattern (lines 12-103)
- **utils.ts:** Normalization function (lines 11-20)
- **contracts.ts:** ABI definitions and fuse constants

---

## 🚀 **Next Steps**

1. [ ] Add `normalize()` import and wrapper function
2. [ ] Add subname existence checking before creation
3. [ ] Fix text record encoding in `buildSetTextTransactions()`
4. [ ] Improve error messages with full error details
5. [ ] Test with uppercase/mixed-case ENS names
6. [ ] Verify existing EROS subnames work correctly

---

**Last Updated:** 2024-11-20  
**Analysis Based On:** AI_GUIDE.md v1.0.0 + Implementation Review


