# ENS NameWrapper Patterns - Quick Reference Card

## 🔴 **CRITICAL GOTCHAS** (From AI_GUIDE.md)

### Gotcha #1: Missing Normalization
```
❌ CURRENT (WRONG):
const subnameNode = namehash(fullSubname);  // "EROS001.Scenedex.eth"

✅ CORRECT:
const normalizedName = normalize(fullSubname); // "eros001.scenedex.eth"
const subnameNode = namehash(normalizedName);
```

**Why:** ENS names must follow ENSIP-15 normalization before hashing. Uppercase letters will produce wrong namehashes.

---

### Gotcha #2: Subname Already Exists
```
❌ CURRENT (WRONG):
// No check - just tries to create
await createENSSubname(...);

✅ CORRECT:
// Check first!
const owner = await nameWrapper.read.ownerOf([tokenId]);
if (owner !== '0x0000...') {
  throw new Error('Subname already exists!');
}
```

**Why:** Creating duplicate subnames causes `OperationProhibited` error. Zero address means "does not exist", not "exists".

---

### Gotcha #3: Wrong Fuse Configuration
```
❌ WRONG:
fuses: 65536  // PARENT_CANNOT_CONTROL only → OperationProhibited

✅ CORRECT:
fuses: 0      // Parent retains control (default)
fuses: 65537  // CANNOT_UNWRAP + PARENT_CANNOT_CONTROL (emancipated)

⚠️ NEVER USE: 65536 alone!
```

**Why:** Fuses must be burned together. To emancipate, need both (1 + 65536 = 65537).

---

### Gotcha #4: Label Must Be String
```
❌ WRONG:
label: keccak256(toHex("EROS001"))  // Hash

✅ CORRECT:
label: "EROS001"  // Plain string
```

**Why:** NameWrapper's setSubnodeRecord expects plain string label, not hash.

---

### Gotcha #5: Text Record Encoding
```
❌ CURRENT (WRONG):
data: encodeAbiParameters(
  [{ type: 'bytes32' }, { type: 'string' }, { type: 'string' }],
  [node, key, value]
)  // Missing function selector!

✅ CORRECT:
data: encodeFunctionData({
  abi: RESOLVER_ABI,
  functionName: 'setText',
  args: [node, key, value],
})
```

**Why:** Need full function call data (selector + encoded params), not just params alone.

---

## ✅ **CORRECT IMPLEMENTATIONS** (Keep These!)

### Correct #1: Fuses = 0 (Current Code)
```typescript
// ✅ Line 320 - Already correct!
console.log(`   Fuses: 0 (no fuses burned)`);
```

### Correct #2: Label as String (Current Code)
```typescript
// ✅ Line 281 - Already correct!
{ name: 'label', type: 'string' }
```

### Correct #3: Wait for Confirmation (Current Code)
```typescript
// ✅ Line 367-368 - Already correct!
const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
```

### Correct #4: Simulate Before Execute (Current Code)
```typescript
// ✅ Line 329-343 - Already correct!
await publicClient.simulateContract({ ... });
```

### Correct #5: Expiry Calculation (Current Code)
```typescript
// ✅ Line 310-313 - Already correct!
const now = Math.floor(Date.now() / 1000);
const expiryTimestamp = BigInt(now + oneYearInSeconds);
```

---

## 📋 **3-Transaction Flow** (Current Code Does #2+#3, Missing #1)

```
STEP 1: Create Subname (setSubnodeRecord)
  ❌ MISSING: Pre-flight check - is subname available?
  ✅ DONE: Create via NameWrapper.setSubnodeRecord()
  ✅ DONE: Wait for confirmation

STEP 2: Set Address Record (setAddr)  
  ✅ DONE: Set creator address via PublicResolver.setAddr()
  ✅ DONE: Wait for confirmation

STEP 3: Set Text Records (setText)
  ✅ DONE: Set custom records via PublicResolver.setText()
  ✅ DONE: Wait for confirmation
```

**Missing:** Pre-flight subname existence check before step 1.

---

## 🔧 **Code Locations in ens.ts**

| Function | Line | Issue | Fix |
|----------|------|-------|-----|
| `getNextEROSNumber()` | 44 | ❌ No normalization | Add `normalize()` |
| `registerEROSRelease()` | 152 | ❌ No normalization | Add `normalize()` |
| `buildSetTextTransactions()` | 112-116 | ❌ Wrong encoding | Use `encodeFunctionData()` |
| `createENSSubname()` | 252-375 | ❌ No existence check | Add pre-flight check |
| `executeENSRecords()` | 456 | ⚠️ Account context | Use explicit `account` |

---

## 🚀 **Fix Checklist**

- [ ] Add `import { normalize } from 'viem/ens'` to ens.ts
- [ ] Create `getNamehash()` wrapper function (copy from ens-context/utils.ts)
- [ ] Replace all `namehash(fullSubname)` with `namehash(normalize(fullSubname))`
- [ ] Create `checkSubnameExists()` function (copy pattern from check-subname.ts)
- [ ] Call `checkSubnameExists()` before creating subname
- [ ] Fix `buildSetTextTransactions()` to use `encodeFunctionData()`
- [ ] Test with mixed-case names (EROS001.Scenedex.eth)
- [ ] Verify no duplicate subname errors

---

## 📚 **Files to Reference**

| File | Purpose | Key Lines |
|------|---------|-----------|
| `ens-context/AI_GUIDE.md` | Full pattern guide | Section 1-3 |
| `ens-context/utils.ts` | Normalization pattern | Lines 11-20 |
| `ens-context/check-subname.ts` | Existence check | Lines 52-63 |
| `ens-context/contracts.ts` | ABIs & addresses | All |

---

## 🔗 **Pattern Summary from AI_GUIDE.md Section 4**

### The Correct 3-Transaction Pattern:

**TX1: setSubnodeRecord**
```typescript
NameWrapper.setSubnodeRecord(
  parentNode,      // bytes32: namehash("parent.eth")
  "EROS001",       // string: Label (NOT hashed!)
  ownerAddress,    // address: Owner
  resolverAddress, // address: Resolver
  0n,              // uint64: TTL
  0,               // uint32: Fuses (0 = parent controls)
  expiryTimestamp  // uint64: Unix timestamp (1 year out)
)
```

**TX2: setAddr**
```typescript
PublicResolver.setAddr(
  subnameNode,  // bytes32: namehash("EROS001.parent.eth")
  ethAddress    // address: Address to resolve to
)
```

**TX3+: setText (for each record)**
```typescript
PublicResolver.setText(
  subnameNode,  // bytes32: Full subname node
  "email",      // string: Record key
  "user@example.com" // string: Record value
)
```

---

## 💡 **Key Insight: The Normalization Bug**

If `ENS_DOMAIN` is "Scenedex.eth" (mixed case):

```
Current (WRONG):
  namehash("EROS001.Scenedex.eth") 
  → 0x... (WRONG HASH)

Correct (RIGHT):
  normalize("EROS001.Scenedex.eth")
  → "eros001.scenedex.eth"
  → namehash("eros001.scenedex.eth")
  → 0x... (CORRECT HASH)
```

This is **why subname operations fail** - they target wrong node!

---

**Reference:** ENS NameWrapper implementation review v1.0 | 2024-11-20


