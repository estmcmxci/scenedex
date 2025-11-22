# EROS ENS Implementation - Final Decisions & Patterns

## ✅ Decisions Finalized

1. **EROS Numbering:** `EROS001` (zero-padded) ✅
2. **Namespace Pattern:** (Clarifying below) 
3. **Safe TX Strategy:** Batch all 9 records into ONE Safe transaction ✅
4. **Error Handling:** Fail entire job if ENS fails ✅
5. **Database:** Store `ensSubname` in releases table ✅
6. **Mainnet Migration:** Design for it, implement later ✅

---

## 🔍 Clarification on Question 2: ENS Namespace Pattern

### What I Meant
When I asked "Is `eth.scenedex.*` the right namespace, or prefer different naming?", I was asking:

**Option A (Proposed):** Custom service namespace
```
eth.scenedex.releaseId = "EROS001"
eth.scenedex.artists = "m580"
eth.scenedex.mediaIPFS = "bafy..."
```

**Option B (Global keys only):** Use only ENSIP-5/18 standard keys
```
avatar = "ipfs://..."
description = "..."
url = "https://..."
location = "Creator addr"
```

**My Question:** Do you prefer keeping **both** (ENSIP-5 standard + custom `eth.scenedex.*`) OR just use **global keys only**?

### Your Answer Implied
By not objecting, I'll interpret as: **Use both** (standard global keys + custom namespace for extended data)

**This Makes Sense Because:**
- Global keys (avatar, description) are understood by ENS UI tools
- Custom keys (eth.scenedex.zoraCoinAddress, etc.) store release-specific data
- Both together = discoverable + extensible

---

## 📚 Patterns from @ens-context.md

### Key Findings

#### 1. **Service Key Namespace Pattern** (Line 344, 369, 384, 399, 429)
```
com.twitter, com.github, org.telegram, etc.
```
**Pattern:** Reverse domain notation + service name  
**Your Equivalent:** `eth.scenedex.*` (reverse of scenedex.eth)  
**Validation:** ✅ Matches ENS standard

#### 2. **CoinType for Address Storage** (Line 3107, 3110, 3117, 3216, 3221)
```typescript
coinType: 0,       // Bitcoin
coinType: 501,     // Dogecoin
coinType: evmChainIdToCoinType(base.id)  // Base mainnet
```
**For You:** If storing addresses, use `setAddr()` with coinType, NOT `setText()`  
**Your Current:** Using `setText()` for addresses (fine for MVP, could optimize later)

#### 3. **setText() Standard** (Line 2521, 4257, 4261)
```typescript
resolver.setText(node, 'key', 'value')
```
**Your Usage:** ✅ Correct pattern  
**Best Practice:** Arbitrary key-value pairs supported

#### 4. **Batch Operations** (Line 4878, 4890, 4897)
```typescript
// ENS Reverse Registrar supports batch operations:
setNameForAddrWithSignature(name, addr, coinTypes[], expiry, signature)
```
**For You:** This validates batching strategy - ENS supports batch writes!  
**Your Plan:** Batch all 9 setText calls in one Safe TX ✅

#### 5. **Safe Subname Registration Pattern**
```solidity
function setSubnodeOwner(bytes32 node, bytes32 label, address owner)
```
**For You:** Safe can execute `setSubnodeOwner()` to create subname, then batch `setText()` calls  
**Timeline:** Subname creation (1 TX) + records setup (1 TX) = 2 Safe TXs total

---

## 🎯 Final Architecture Decision

### MVP ENS Strategy (Based on Patterns)

**Transaction 1: Create Subname**
```typescript
// Safe executes on Public Resolver
setSubnodeRecord(
  node: namehash("scenedex.eth"),
  label: keccak256("EROS001"),
  owner: SAFE_ADDRESS,  // Safe owns the subname
  resolver: PUBLIC_RESOLVER,
  ttl: 3600
)
```

**Transaction 2: Set All Records** (One Safe TX batching all setText calls)
```typescript
// Safe batches these via multicall
[
  setText(node, "avatar", "ipfs://bafy..."),
  setText(node, "description", "..."),
  setText(node, "eth.scenedex.releaseId", "EROS001"),
  setText(node, "eth.scenedex.artists", "m580"),
  setText(node, "eth.scenedex.mediaIPFS", "bafy..."),
  setText(node, "eth.scenedex.metadataURI", "bafy..."),
  setText(node, "eth.scenedex.zoraCoinAddress", "0x..."),
  setText(node, "eth.scenedex.zoraCoinSymbol", "PDA001"),
  setText(node, "eth.scenedex.splitAddress", "0x..."),
]
```

### Why This Works
✅ Subname creation atomic (one Safe TX)  
✅ All metadata in one Safe TX (efficient)  
✅ Follows ENS batch patterns  
✅ Safe controls everything  
✅ Sepolia → Mainnet migration straightforward  

---

## 🔧 Updated Implementation Plan

### Modified Phase 2.3: Transaction Batching

**New Approach:**
```typescript
export function buildSetTextTransactions(node: bytes32, records: Record<string, string>) {
  // Return array of individual transactions
  // Safe will batch them together in ONE multicall TX
  return Object.entries(records).map(([key, value]) => ({
    to: ENV.ENS_RESOLVER_SEPOLIA,
    value: '0',
    data: encodeAbiParameters(
      ['bytes32', 'string', 'string'],
      [node, key, value]
    ),
  }));
}

export async function registerEROSRelease(release: Release, coinAddress: string) {
  const releaseNumber = release.id.split('-')[1].padStart(3, '0');
  const subnameNode = namehash(`EROS${releaseNumber}.scenedex.eth`);
  
  const records = buildRecordsFromRelease(release, coinAddress);
  const txs = buildSetTextTransactions(subnameNode, records);
  
  return { 
    subnameNode, 
    records,
    transactions: txs,  // 9 transactions to batch
    batchSize: txs.length
  };
}
```

### When Safe Gets Integrated (Phase 2)
```typescript
// In jobs.ts, after coin creation:
const { transactions } = await registerEROSRelease(release, coinAddress);

// Send to Safe API to create multisend TX
const safeTx = await createMultisendTx(transactions);
// → Safe proposes 1 TX containing all 9 setText calls
// → Curators sign once
// → All records set atomically
```

---

## 📋 Updated Checklist Items

### Phase 2.3 (Updated for Batching)
- [ ] Function returns array of 9 independent transactions
- [ ] Each transaction is valid `setText()` call
- [ ] Transactions follow Safe-compatible format
- [ ] Document that Safe will batch these together later

### Phase 3.2 (Updated for Safe-Ready)
- [ ] Code doesn't send transactions yet (just prepares them)
- [ ] Jobs.ts stores transaction array for later Safe processing
- [ ] When Safe integration done, transactions route through Safe API

---

## ✅ Final Validation

**Does This Make Sense?**

- ✅ Uses ENS standard patterns (service keys, batch ops)
- ✅ Follows ENSIP-5/18 conventions
- ✅ Safe-compatible from day 1
- ✅ MVP ready (Phase 1: prepare), Phase 2: execute via Safe
- ✅ Mainnet migration path clear
- ✅ All 9 schema fields covered
- ✅ EROS001 numbering works

**Any Adjustments?**

1. Should we also create the subname in Phase 1, or wait for Safe?
2. Store the transaction array in database until Safe picks it up?
3. Should frontend show ENS as "pending" until Safe TX confirmed?

---

**Status:** Ready to Code Phase 1  
**Next:** Implement `lib/services/ens.ts` with transaction-building approach

