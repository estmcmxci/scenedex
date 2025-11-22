# EROS ENS Architecture - Safe-Gated Flow

## 🔄 Corrected Architecture

### **The Flow (Safe-Gated)**

```
User Submits Release
    ↓
    • Extract metadata (jobs.ts)
    • Pin files to IPFS (jobs.ts)
    • Create temporary storage
    • Store in DB: status='pending'
    ↓
Curators Review Release
    ↓
Safe Multisig Approval
    ↓ Threshold Met
    ↓
Safe Executes Approval Transaction
    ↓
**THEN** publishRelease() Job Runs (AFTER Safe approval)
    • Pin metadata to IPFS
    • Create Split contract
    • Deploy Zora coin
    • Register ENS subname ← EROS001.scenedex.eth
    • Set all 9 text records
    • Update DB: status='published'
    ↓
✅ Complete - Everything Atomic
```

### **Why This Architecture is Better**

1. **No Wasted IPFS Storage** - Only approved releases consume IPFS
2. **Safe is the Gate** - No coin/ENS created without curator approval
3. **Atomic Execution** - IPFS + Split + Coin + ENS all succeed or all fail together
4. **Clean State** - No partially-published releases
5. **Future-Proof** - Easy to add more Safe-gated operations later

---

## 🎯 What This Means for ENS Implementation

### Phase 1 Prerequisites: Same, but with Context

**Phase 1 (Now):** Prepare ENS infrastructure locally
- Verify Sepolia ENS works
- Install dependencies
- Set up env vars

**Phase 2 (Next):** Build ENS transaction builder
- Happens as part of `publishRelease()` job
- Called AFTER Safe executes
- Creates transaction array for Safe batch

**Phase 3 (Later):** Safe integration
- Safe approval → triggers publishRelease()
- publishRelease() prepares ENS transactions
- All 9 setText calls batched in ONE Safe TX

---

## ✅ Status

**Safe is upstream of everything else.**  
**ENS lives inside publishRelease(), which is Safe-gated.**

---

**Date:** November 19, 2024  
**Ready for:** Phase 1 Prerequisites

