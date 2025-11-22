# Zora Direct Factory Call - Implementation Checklist

## ✅ Code Implementation Status

- [x] Updated `lib/services/zora.ts`
- [x] Replaced `createCoin()` with direct factory call
- [x] Added all necessary viem imports
- [x] Added @zoralabs/protocol-deployments imports
- [x] Implemented pool config generation
- [x] Implemented salt generation
- [x] Implemented simulate + write + verify flow
- [x] Added 9-step logging
- [x] No linting errors

---

## 🔧 Configuration Setup (You need to do this)

### Step 1: Update `.env.local`

Add this line:
```bash
ZORA_COIN_FACTORY_ADDRESS=0x777777751622c0d3258f214F9DF38E35BF45baF3
```

Your `.env.local` should have:
```bash
# Base RPC
BASE_RPC_URL=https://sepolia.base.org

# Curator wallet  
CURATOR_ADDRESS=0x...
CURATOR_PRIVATE_KEY=0x...

# Zora Coin Factory (REQUIRED - NEW)
ZORA_COIN_FACTORY_ADDRESS=0x777777751622c0d3258f214F9DF38E35BF45baF3

# Optional
ZORA_API_KEY=... (can be removed, no longer used)
```

---

## 📦 Dependencies

Verify installed packages:

```bash
npm list @zoralabs/protocol-deployments
npm list viem
npm list @zoralabs/coins-sdk
```

Should show:
- `@zoralabs/protocol-deployments` - ✅ (for coinFactoryABI, encodeMultiCurvePoolConfig)
- `viem@2.39.0` - ✅ (for clients, utilities)
- `@zoralabs/coins-sdk@0.3.3` - ✅ (metadata functions - still used in jobs.ts)

If missing:
```bash
npm install @zoralabs/protocol-deployments
```

---

## 🧪 Testing Plan

### Phase 1: Basic Function Test
```bash
npx tsx lib/services/test-zora-e2e-smoke.ts
```

### Phase 2: Integration Test
1. Create a test release via `/api/submit`
2. Verify metadata JSON created and pinned
3. Trigger coin creation job
4. Check logs for 9-step output
5. Verify coin address returned

### Phase 3: On-Chain Verification
1. Visit BaseScan: `https://sepolia.basescan.org/tx/{transactionHash}`
2. Verify transaction succeeded
3. Check coin contract: `https://sepolia.basescan.org/address/{coinAddress}`
4. Verify coin symbol matches (e.g., PDA001)

### Phase 4: Full Workflow Test
1. Release submission
2. Safe multisig approval
3. Splits creation
4. Coin creation
5. Coin trading

---

## 🔍 Key Verification Points

### Factory Address
```
Expected: 0x777777751622c0d3258f214F9DF38E35BF45baF3
Source: Zora docs (oldest/most established)
Age: ~273 days
Transactions: ~1,931
```

### Metadata Gateway URL Format
```
Expected: https://{CID}.ipfs.w3s.link/{releaseId}-metadata.json
Source: Your jobs.ts (pinBufferToIPFS returns IPFS CID)
Conversion: Handled in zora.ts line 134-136
```

### Coin Symbol Generation
```
Example: PDA-001-xyz → PDA001
Source: releaseId.split('-')[1]
Used as: coin symbol in contract
```

### Pool Configuration
```
Currency: zeroAddress (ETH)
Tick Lower: -250000
Tick Upper: -195000
Discovery Positions: 11
Max Supply Share: 5% (parseUnits("0.05", 18))
```

---

## 📊 Expected Output (from Logs)

```
🪙 Creating Zora coin for release: PDA-001-xyz
   Payout Recipient: 0x...
   Metadata URI: ipfs://bafy...

   Debug - PublicClient chain ID: 84532
   Debug - WalletClient chain ID: 84532
   Debug - baseSepolia ID: 84532
   Debug - Factory Address: 0x777777751622c0d3258f214F9DF38E35BF45baF3

Step 1️⃣: Validate coin parameters...
✅ All parameters validated

Step 2️⃣: Define coin parameters...
   Name: My Release Title
   Symbol: PDA001
   Payout: 0x... (split address)
   Creator: 0x... (curator address)
   Gateway URL: https://bafy.ipfs.w3s.link/PDA-001-xyz-metadata.json
✅ Coin parameters ready

Step 3️⃣: Generate pool configuration...
✅ Pool config generated

Step 4️⃣: Generate unique salt...
   Salt: 0x...
✅ Salt generated

Step 5️⃣: Simulate factory call (dry run)...
✅ Simulation successful

Step 6️⃣: Send transaction to Base Sepolia...
   Transaction Hash: 0x...
✅ Transaction sent, waiting for confirmation...

Step 7️⃣: Wait for transaction confirmation...
   Block Number: 12345
   Gas Used: 2181832
✅ Transaction confirmed

Step 8️⃣: Extract coin address from logs...
   Coin Address: 0x...
✅ Coin address extracted

Step 9️⃣: Verify coin on-chain...
✅ Coin verified on-chain

✨ Zora coin deployed and ready for trading!
   Symbol: PDA001
   Address: 0x...
   Revenue → Split → 50% Safe + 50% Submitter
   Explorer: https://sepolia.basescan.org/address/0x...
```

---

## 🚨 Troubleshooting

### Error: "ZORA_COIN_FACTORY_ADDRESS environment variable not set"
**Fix:** Add to `.env.local`:
```bash
ZORA_COIN_FACTORY_ADDRESS=0x777777751622c0d3258f214F9DF38E35BF45baF3
```

### Error: "Simulation failed" or "Invalid pool config"
**Check:**
- Pool config parameters are correct
- Gateway URL is accessible
- Metadata JSON is valid at URL
- Split address is valid

### Error: "Could not extract coin address from transaction logs"
**Check:**
- Transaction succeeded (check BaseScan)
- Logs contain expected events
- First log should be the coin contract address

### Error: "BASE_RPC_URL environment variable not set"
**Fix:** Add to `.env.local`:
```bash
BASE_RPC_URL=https://sepolia.base.org
```

---

## 📝 Implementation Notes

1. **No breaking changes** - Function signature identical to before
2. **Metadata flow untouched** - Storacha pinning still works
3. **Return format same** - coinAddress, symbol, transactionHash
4. **Gas consistent** - ~2.18M per deployment
5. **Fully typed** - No TypeScript errors

---

## ✅ Deployment Readiness Checklist

- [ ] `.env.local` updated with ZORA_COIN_FACTORY_ADDRESS
- [ ] `npm install` run (if needed)
- [ ] Code reviewed in zora.ts
- [ ] Basic function test passed
- [ ] Integration test passed
- [ ] On-chain verification successful
- [ ] Full workflow tested with Safe + Splits
- [ ] Documentation reviewed

---

## 🎯 Success Criteria

- ✅ Coin deploys without 500 errors
- ✅ Coin address extracted correctly
- ✅ Coin verified on-chain
- ✅ Metadata accessible via gateway URL
- ✅ Coin symbol matches (e.g., PDA001)
- ✅ Revenue split works (Safe + Submitter)
- ✅ Transaction hash returned
- ✅ Logging shows 9 steps clearly

---

## 📅 Next Actions

1. Add ZORA_COIN_FACTORY_ADDRESS to `.env.local`
2. Run basic tests
3. Monitor logs during first coin creation
4. Verify on BaseScan
5. Integrate into full Safe + Splits workflow

---

**Status:** Ready for Configuration and Testing
**Estimated Setup Time:** 5 minutes
**Estimated Test Time:** 10-15 minutes

