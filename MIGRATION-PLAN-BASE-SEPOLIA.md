# Migration Plan: Sepolia → Base Sepolia

## Overview
Migrate all on-chain operations from Sepolia (L1) to Base Sepolia (L2) to enable batching all transactions (Split, Zora, Basenames) in a single Safe transaction.

**Goal**: Everything on Base Sepolia (chain ID 84532) so all operations can be batched in one Safe transaction.

---

## Current State

### Current Architecture
- **Safe**: Deployed on Sepolia (11155111)
- **ENS**: Using Sepolia (11155111) 
- **Split Contracts**: Base Sepolia (84532)
- **Zora Coins**: Base Sepolia (84532)

### Problem
- Split and Zora are on Base Sepolia
- Safe and ENS are on Sepolia
- Cannot batch cross-chain transactions
- Currently requires client-side transaction signing for split/Zora

---

## Target State

### Target Architecture
- **Safe**: Deployed on Base Sepolia (84532)
- **Basenames (ENS on Base)**: Base Sepolia (84532)
- **Split Contracts**: Base Sepolia (84532)
- **Zora Coins**: Base Sepolia (84532)

### Benefits
- All operations on same chain
- Single Safe transaction batches: Split creation + Zora creation + Basename operations
- No client-side transaction signing needed
- Simpler UX: One approval → everything happens atomically

---

## Migration Checklist

### Phase 1: Safe Migration to Base Sepolia

#### 1.1 Deploy New Safe on Base Sepolia
- [ ] Go to https://app.safe.global
- [ ] Select network: **Base Sepolia** (chain ID 84532)
- [ ] Deploy Safe with same owners/threshold as current Sepolia Safe
- [ ] Copy new Safe address
- [ ] Update `.env.local`: `SAFE_ADDRESS=<new-base-sepolia-address>`

#### 1.2 Update Safe Service Code
**Files to modify:**
- [ ] `lib/services/safe-transactions.ts`
  - [ ] Change `sepolia` → `baseSepolia` import
  - [ ] Update `apiKit` chainId: `sepolia.id` → `baseSepolia.id` (11155111 → 84532)
  - [ ] Update RPC: `SEPOLIA_RPC_URL` → `BASE_RPC_URL`
  - [ ] Update provider initialization

- [ ] `lib/services/user-safes.ts`
  - [ ] Change `sepolia` → `baseSepolia` import
  - [ ] Update `apiKit` chainId
  - [ ] Update provider: `SEPOLIA_RPC_URL` → `BASE_RPC_URL`

- [ ] `lib/services/safe.ts`
  - [ ] Check for any Sepolia-specific code
  - [ ] Update chain references

#### 1.3 Update Database
- [ ] Update all `user_safes` table entries to new Base Sepolia Safe address
- [ ] Or create migration script to re-link Safes

---

### Phase 2: ENS → Basenames Migration

#### 2.1 Research Basenames on Base Sepolia
- [ ] Verify Basenames contract addresses on Base Sepolia
- [ ] Check if Basenames uses same ENS contracts or different ones
- [ ] Document Basenames ABI/interface differences from ENS
- [ ] Find Basenames SDK/documentation

#### 2.2 Update ENS Service Code
**Files to modify:**
- [ ] `lib/services/ens.ts`
  - [ ] Change `sepolia` → `baseSepolia` import
  - [ ] Update all RPC URLs: `SEPOLIA_RPC_URL` → `BASE_RPC_URL`
  - [ ] Update contract addresses (if Basenames uses different contracts)
  - [ ] Update resolver addresses
  - [ ] Update NameWrapper addresses (if applicable)
  - [ ] Test Basenames contract interactions

- [ ] `lib/services/query-ens.ts`
  - [ ] Update chain: `sepolia` → `baseSepolia`
  - [ ] Update RPC URLs
  - [ ] Verify Basenames resolution works

- [ ] `app/api/ens/route.ts` (if exists)
  - [ ] Update chain references

#### 2.3 Update Environment Variables
- [ ] Update `.env.local`:
  - [ ] `ENS_RESOLVER_SEPOLIA` → `ENS_RESOLVER_BASE_SEPOLIA` (or Basenames equivalent)
  - [ ] `ENS_NAMEWRAPPER_SEPOLIA` → `ENS_NAMEWRAPPER_BASE_SEPOLIA` (or Basenames equivalent)
  - [ ] Verify contract addresses are correct for Base Sepolia

---

### Phase 3: Update Job/Publication Flow

#### 3.1 Update `publishReleaseViaSafe`
**File: `lib/services/jobs.ts`**

Current flow (cross-chain):
1. Create split on Base Sepolia (client-side)
2. Create Zora coin on Base Sepolia (client-side)
3. Create Safe transaction on Sepolia (ENS only)

New flow (all on Base Sepolia):
1. Build calldata for: Split + Zora + Basename operations
2. Create single Safe transaction on Base Sepolia
3. Execute Safe transaction (batches all operations)

**Changes needed:**
- [ ] Remove client-side transaction creation logic
- [ ] Update `getSplitCalldata()` to return calldata (not execute)
- [ ] Update `getZoraCoinCalldata()` to return calldata (not execute)
- [ ] Update `getENSCompleteCalldata()` → `getBasenameCompleteCalldata()`
- [ ] Combine all calldata into single Safe transaction
- [ ] Update transaction waiting logic (Base Sepolia instead of Sepolia)

#### 3.2 Remove Client-Side Transaction Sending
**Files to modify:**
- [ ] `app/curator/dashboard/page.tsx`
  - [ ] Remove `sendContractTransactions()` function
  - [ ] Remove `thresholdMetReleases` state
  - [ ] Remove "Create Contracts" button
  - [ ] Simplify approval flow: Just approve → Safe handles everything
  - [ ] Remove Base Sepolia network switching logic

- [ ] `app/api/approve/route.ts`
  - [ ] Remove contract transaction data preparation
  - [ ] When threshold met, directly call `publishReleaseViaSafe()`
  - [ ] Remove `/api/releases/[id]/contract-tx-data` endpoint usage

- [ ] `app/api/releases/[id]/contract-tx-data/route.ts`
  - [ ] **DELETE** - No longer needed (everything in Safe transaction)

- [ ] `app/api/releases/[id]/contracts-created/route.ts`
  - [ ] **DELETE** - No longer needed (everything in Safe transaction)

---

### Phase 4: Update Chain Configurations

#### 4.1 Update All Chain References
**Search and replace across codebase:**
- [ ] `sepolia` → `baseSepolia` (in imports)
- [ ] `11155111` → `84532` (chain IDs)
- [ ] `SEPOLIA_RPC_URL` → `BASE_RPC_URL` (where Safe/ENS operations happen)
- [ ] Keep `BASE_RPC_URL` for Zora/Splits (already correct)

**Files to check:**
- [ ] `lib/services/safe-transactions.ts`
- [ ] `lib/services/safe.ts`
- [ ] `lib/services/user-safes.ts`
- [ ] `lib/services/ens.ts`
- [ ] `lib/services/query-ens.ts`
- [ ] `lib/services/jobs.ts`
- [ ] `lib/services/splits.ts` (already on Base Sepolia - verify)
- [ ] `lib/services/zora.ts` (already on Base Sepolia - verify)

#### 4.2 Update Wagmi/RainbowKit Config
**File: `app/providers.tsx`**
- [ ] Verify `baseSepolia` is in chains array (already there)
- [ ] Ensure Base Sepolia is default or easily accessible

---

### Phase 5: Update UI/UX

#### 5.1 Simplify Approval Flow
**File: `app/curator/dashboard/page.tsx`**
- [ ] Remove network switching prompts
- [ ] Remove "Create Contracts" button
- [ ] Simplify to: "Approve" button only
- [ ] When threshold met, show: "Publication in progress..." (Safe transaction executing)

#### 5.2 Update Network Requirements
- [ ] Update UI to show Base Sepolia as required network (not Sepolia)
- [ ] Update any network validation messages
- [ ] Update chain ID checks: `84532` instead of `11155111`

---

### Phase 6: Testing & Validation

#### 6.1 Pre-Migration Testing
- [ ] Test Safe deployment on Base Sepolia
- [ ] Test Basenames contract interactions
- [ ] Verify contract addresses are correct
- [ ] Test RPC connectivity to Base Sepolia

#### 6.2 Post-Migration Testing
- [ ] Test Safe transaction creation on Base Sepolia
- [ ] Test batched transaction (Split + Zora + Basename)
- [ ] Test approval flow end-to-end
- [ ] Verify all contracts deploy correctly
- [ ] Verify Basenames resolve correctly
- [ ] Test transaction confirmation waiting

#### 6.3 Database Migration
- [ ] Create migration script to update Safe addresses
- [ ] Backup existing data
- [ ] Test migration on staging database

---

## Code Files Requiring Changes

### High Priority (Core Services)
1. `lib/services/safe-transactions.ts` - Safe operations
2. `lib/services/safe.ts` - Safe utilities
3. `lib/services/user-safes.ts` - Safe linking
4. `lib/services/ens.ts` - ENS/Basenames operations
5. `lib/services/jobs.ts` - Publication flow
6. `lib/services/query-ens.ts` - ENS/Basenames queries

### Medium Priority (API Routes)
7. `app/api/approve/route.ts` - Approval endpoint
8. `app/api/releases/[id]/contract-tx-data/route.ts` - **DELETE**
9. `app/api/releases/[id]/contracts-created/route.ts` - **DELETE**

### Low Priority (UI)
10. `app/curator/dashboard/page.tsx` - Dashboard UI
11. `app/providers.tsx` - Wagmi config (verify)

---

## Environment Variables to Update

```bash
# Safe Configuration
SAFE_ADDRESS=<new-base-sepolia-safe-address>
# Keep CURATOR_PRIVATE_KEY (same wallet, different chain)

# RPC URLs
# Keep BASE_RPC_URL (already correct)
# Remove/update SEPOLIA_RPC_URL usage (only for Safe/ENS operations)

# ENS/Basenames Configuration
ENS_RESOLVER_BASE_SEPOLIA=<basenames-resolver-address>
ENS_NAMEWRAPPER_BASE_SEPOLIA=<basenames-namewrapper-address>
# Or verify if Basenames uses different contract names

# Safe API
SAFE_API_KEY=<same-key-should-work-for-base-sepolia>
```

---

## Research Needed

### Basenames on Base Sepolia
- [ ] Find Basenames contract addresses on Base Sepolia
- [ ] Verify Basenames uses ENS-compatible interface or different
- [ ] Check if Basenames has NameWrapper equivalent
- [ ] Document Basenames ABI differences from ENS
- [ ] Find Basenames SDK or documentation

### Safe on Base Sepolia
- [ ] Verify Safe Transaction Service supports Base Sepolia
- [ ] Check if Safe API key works for Base Sepolia
- [ ] Verify Safe contract addresses are same on Base Sepolia

---

## Migration Order

1. **Research Phase** (Before coding)
   - Research Basenames contracts/ABIs
   - Verify Safe on Base Sepolia
   - Document all contract addresses

2. **Safe Migration** (Phase 1)
   - Deploy Safe on Base Sepolia
   - Update Safe service code
   - Test Safe operations

3. **Basenames Migration** (Phase 2)
   - Update ENS service to Basenames
   - Test Basename operations
   - Verify resolution works

4. **Flow Integration** (Phase 3)
   - Update publication flow
   - Batch all operations
   - Remove client-side transactions

5. **UI Cleanup** (Phase 4)
   - Simplify approval flow
   - Remove network switching
   - Update chain requirements

6. **Testing** (Phase 5)
   - End-to-end testing
   - Database migration
   - Production readiness

---

## Risks & Considerations

### Risks
1. **Basenames Compatibility**: Basenames might not be 100% ENS-compatible
2. **Safe API Support**: Need to verify Safe Transaction Service supports Base Sepolia
3. **Contract Addresses**: Need correct addresses for Base Sepolia
4. **Gas Costs**: Base Sepolia gas might be different
5. **Data Migration**: Existing Safe links in database need updating

### Considerations
1. **Backward Compatibility**: Existing releases on Sepolia might break
2. **Testing Environment**: Need Base Sepolia testnet funds
3. **Documentation**: Update all docs to reflect Base Sepolia
4. **Rollback Plan**: Keep Sepolia code as backup

---

## Success Criteria

- [ ] Safe deployed and working on Base Sepolia
- [ ] Basenames operations working on Base Sepolia
- [ ] Single Safe transaction batches: Split + Zora + Basename
- [ ] No client-side transaction signing required
- [ ] Approval flow simplified to one button
- [ ] All tests passing
- [ ] End-to-end flow working

---

## Notes

- This is a **major refactor** - estimate 2-3 days of focused work
- Test thoroughly on Base Sepolia testnet before production
- Keep Sepolia code as reference/backup
- Document all contract addresses and ABIs
- Consider creating a migration branch for this work

---

## Questions to Answer Before Starting

1. What are the Basenames contract addresses on Base Sepolia?
2. Does Basenames use the same ABI as ENS or different?
3. Does Safe Transaction Service support Base Sepolia?
4. What's the gas cost difference between Sepolia and Base Sepolia?
5. Do we need to migrate existing data or start fresh?

---

**Last Updated**: 2025-01-22
**Status**: Planning Phase - Ready to execute when resumed

