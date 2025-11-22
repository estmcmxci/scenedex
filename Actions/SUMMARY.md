# Zora Coins Base Sepolia - Complete Investigation Summary

## 🎯 Mission Accomplished

Successfully deployed **2 Zora coins** on Base Sepolia testnet despite SDK API issues.

---

## 📊 Deployment Results

| # | Factory | Coin Address | Transaction | Status |
|---|---------|--------------|-------------|--------|
| 1 | Newer (SDK) | [`0xd64b0ed9...`](https://sepolia.basescan.org/address/0xd64b0ed9d13d4216f70b58e9b7b037f0692de9a7) | [`0x7831a9f8...`](https://sepolia.basescan.org/tx/0x7831a9f8cecc74fe4ca271f4384f679afb865d1e61bb9249e95cc591bf9b5425) | ✅ Success |
| 2 | Older (Docs) | [`0x7cbe31f8...`](https://sepolia.basescan.org/address/0x7cbe31f824f3e387c7ed4f75b37999d86372aeba) | [`0x8ac91527...`](https://sepolia.basescan.org/tx/0x8ac9152745a01e590db6bdc27b3c7dc018c7cbffc2288d5347f8c3d115bb6eb5) | ✅ Success |

**Gas Used:** 2,181,832 per deployment  
**Method:** Direct contract call (bypassing SDK API)

---

## 🔍 Key Findings

### 1. SDK API is Broken
- **Issue:** `createCoinCall()` returns 500 Internal Server Error
- **Root Cause:** Backend API fails when calling `coinAddress` function
- **Impact:** Blocks all coin deployments using standard SDK workflow
- **Status:** ❌ Unresolved (as of Nov 19, 2024)

### 2. Two Factory Contracts Exist

| Factory | Address | Age | Transactions | Source |
|---------|---------|-----|--------------|--------|
| **Older** | `0x777777751622c0d3258f214F9DF38E35BF45baF3` | ~273 days | ~1,931 | [Zora Docs](https://docs.zora.co/) |
| **Newer** | `0xaF88840cb637F2684A9E460316b1678AD6245e4a` | ~167 days | ~124 | `@zoralabs/protocol-deployments` |

**Observation:** 
- Both have identical source code
- Both work with direct contract calls
- SDK points to newer, docs show older
- **Question:** Which is canonical?

### 3. Working Workaround Found
- **Method:** Direct contract calls using Viem
- **Components Used:**
  - `coinFactoryABI` from `@zoralabs/protocol-deployments`
  - `encodeMultiCurvePoolConfig` for pool setup
  - Standard Viem client for transaction handling
- **Success Rate:** 100% (2/2 deployments)

---

## 📁 Deliverables Created

### Documentation
1. **`WORKAROUND.md`** - Complete technical solution
   - Problem description
   - Step-by-step workaround
   - Working code example
   - Verified results

2. **`README.md`** - Project overview
   - Quick start guide
   - Architecture diagram
   - Key components
   - Requirements

3. **`GITHUB_ISSUE.md`** - Bug report for Zora team
   - Detailed bug description
   - Reproduction steps
   - Investigation results
   - Questions for maintainers

4. **`SUMMARY.md`** - This document
   - Executive summary
   - Key findings
   - Next steps

### Code
5. **`index.js`** - Working implementation
   - Metadata upload (SDK)
   - Pool config generation
   - Direct factory contract call
   - Transaction handling

6. **`package.json`** - Dependencies
   - `@zoralabs/coins-sdk@0.3.3`
   - `@zoralabs/protocol-deployments`
   - `viem@2.21.55`
   - `dotenv@16.0.0`

---

## 🛠️ Technical Deep Dive

### What Works ✅
1. **Metadata Creation & Upload**
   - SDK's `createMetadataBuilder()` works perfectly
   - IPFS upload via `createZoraUploaderForCreator()` succeeds
   - Metadata properly formatted and accessible

2. **Pool Configuration**
   - `encodeMultiCurvePoolConfig()` generates correct bytes
   - ETH pair parameters validated on-chain
   - Gas estimates accurate

3. **Direct Contract Calls**
   - `simulateContract()` succeeds with both factories
   - Transaction broadcast successful
   - Receipt parsing and log extraction works

### What's Broken ❌
1. **SDK API Backend**
   - `createCoinCall()` fails with 500 error
   - Backend's `coinAddress` call returns empty data
   - Affects both factory addresses
   - No fallback mechanism

### Architecture Comparison

**Standard SDK Flow (Broken):**
```
User → createCoinCall() → Zora API → coinAddress (❌500) → FAIL
```

**Workaround Flow (Working):**
```
User → viem simulateContract() → Factory Contract → deploy() → ✅ SUCCESS
```

---

## 💾 Repository Structure

```
zora-test/
├── index.js                 # Main implementation
├── package.json            # Dependencies
├── .env.local             # Environment variables (not in repo)
├── README.md              # Project documentation
├── WORKAROUND.md          # Technical solution
├── GITHUB_ISSUE.md        # Bug report template
├── SUMMARY.md             # This file
└── node_modules/          # Dependencies
```

---

## 🚀 Next Steps

### For Developers Using This Code
1. ✅ Use the workaround in `WORKAROUND.md`
2. ✅ Test on Base Sepolia first
3. ⚠️ Be aware of gas costs (~2.18M gas per deployment)
4. 📖 Reference the working examples in `index.js`

### For Zora Team
1. 🐛 Fix the backend API's `coinAddress` call
2. 📚 Clarify which factory is canonical
3. 📝 Update documentation with workaround
4. 🔄 Add SDK fallback to direct calls
5. ✅ Test fix on Base Sepolia

### For Community
1. 📢 Share the workaround with other developers
2. 🤝 Contribute improvements to the code
3. 🐛 Report any additional issues found
4. ⭐ Star the repository if helpful

---

## 📊 Impact Assessment

### Current State
- **SDK Status:** ❌ Broken for Base Sepolia
- **Workaround Availability:** ✅ Available and tested
- **Production Ready:** ⚠️ Workaround only
- **Mainnet Status:** ❓ Unknown (needs testing)

### Risk Analysis
- **Low Risk:** Workaround uses official contracts
- **Medium Risk:** Two factory contracts (unclear which to use)
- **High Risk:** SDK API unreliable for production

### Recommendations
1. **Short-term:** Use the workaround
2. **Medium-term:** Monitor for SDK fixes
3. **Long-term:** Migrate back to SDK when stable

---

## 🔗 Quick Links

### Documentation
- [Zora Coins Docs](https://docs.zora.co/protocol/coins)
- [Viem Documentation](https://viem.sh/)
- [Base Documentation](https://docs.base.org/)

### Explorers
- [Base Sepolia](https://sepolia.basescan.org/)
- [Older Factory](https://sepolia.basescan.org/address/0x777777751622c0d3258f214F9DF38E35BF45baF3)
- [Newer Factory](https://sepolia.basescan.org/address/0xaF88840cb637F2684A9E460316b1678AD6245e4a)

### Our Deployments
- [Coin #1](https://sepolia.basescan.org/address/0xd64b0ed9d13d4216f70b58e9b7b037f0692de9a7)
- [Coin #2](https://sepolia.basescan.org/address/0x7cbe31f824f3e387c7ed4f75b37999d86372aeba)

---

## 📝 Notes for PR/Issue

### Title Suggestions
- "[BUG] Coins SDK createCoinCall() returns 500 on Base Sepolia"
- "[WORKAROUND] Direct contract calls for Base Sepolia coin deployment"
- "[DOCS] Factory address discrepancy between docs and SDK"

### Labels
- `bug` - SDK API issue
- `documentation` - Factory address confusion
- `help wanted` - Community input needed
- `base-sepolia` - Network-specific

### Assignees
- Zora SDK maintainers
- Protocol team
- DevRel team

---

## ✅ Checklist

- [x] Problem identified
- [x] Root cause investigated
- [x] Workaround developed
- [x] Solution tested (2 deployments)
- [x] Documentation created
- [x] Code examples provided
- [x] Gas costs measured
- [x] Both factories tested
- [x] GitHub issue drafted
- [ ] Issue submitted to Zora
- [ ] Community feedback gathered
- [ ] SDK fix confirmed

---

## 🙏 Acknowledgments

- **Zora Team** for the coins protocol
- **Viem** for excellent Web3 tooling
- **Base** for the robust testnet
- **Community** for early testing and feedback

---

**Date:** November 19, 2024  
**Network:** Base Sepolia (Chain ID 84532)  
**Status:** ✅ Working Solution Available  
**Maintainer:** Open for community contributions

