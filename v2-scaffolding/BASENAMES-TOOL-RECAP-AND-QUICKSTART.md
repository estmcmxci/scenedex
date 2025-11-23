# Basenames Tool - Today's Recap & Quick Start Guide

## Today's Accomplishments

### Built Basenames Testing Tool
Created a fully functional basenames registration and query tool deployed at **https://v11.oakgroup.eth.limo/** to test basenames functionality before migrating the main Catalogue app from ENS to Basenames.

### What Was Built

1. **Basenames UI Application** (`basenames-sepolia-1/`)
   - ✅ Register basenames with address and text records
   - ✅ Query existing basenames (owner, resolver, address records, text records, reverse resolution)
   - ✅ Check availability before registering
   - ✅ Fully client-side, IPFS-compatible
   - ✅ Deployed to IPFS and accessible via ENS (v11.oakgroup.eth.limo)

2. **Key Technical Decisions**
   - **RPC Endpoint**: Using Base official public RPC (`https://sepolia.base.org`) for browser compatibility
   - **Environment Variables**: Loads from parent `.env.local` (sources `BASE_RPC_URL` and `BASENAMES_*` contract addresses)
   - **Wallet Integration**: Direct `window.ethereum` integration (no heavy dependencies)
   - **Viem Configuration**: Explicit CORS fetch options for browser compatibility

3. **Contract Addresses Used** (Base Sepolia)
   - Registry: `0x1493b2567056c2181630115660963E13A8E32735`
   - BaseRegistrar: `0xa0c70ec36c010b55e3c434d6c6ebeec50c705794`
   - RegistrarController: `0x49ae3cc2e3aa768b1e5654f5d3c6002144a59581`
   - Resolver: `0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA`
   - ReverseRegistrar: `0x876eF94ce0773052a2f81921E70FF25a5e76841f`

4. **Files Created/Modified**
   - `basenames-sepolia-1/` - Complete Next.js app
   - `basenames-sepolia-1/lib/check-basename-available.ts` - Availability checking
   - `basenames-sepolia-1/lib/query-basenames.ts` - Query functionality
   - `basenames-sepolia-1/lib/useWallet.ts` - Wallet connection hook
   - `basenames-sepolia-1/components/RegisterBasename.tsx` - Registration UI
   - `basenames-sepolia-1/components/QueryBasename.tsx` - Query UI
   - `basenames-sepolia-1/components/CheckAvailability.tsx` - Availability UI
   - `basenames-sepolia-1/next.config.js` - Environment variable loading from parent `.env.local`

### Issues Resolved

1. ✅ Removed hardcoded Alchemy RPC URLs - now uses env vars from parent `.env.local`
2. ✅ Fixed RPC endpoint browser compatibility - switched to Base official endpoint
3. ✅ Added CORS fetch options for viem http transport
4. ✅ Fixed duplicate Connect Wallet button
5. ✅ Improved error handling with detailed console logging

---

## Quick Start for Tomorrow: ENS → Basenames Migration

### Reference Document
See **[ENS-TO-BASENAMES-REFACTORING.md](./ENS-TO-BASENAMES-REFACTORING.md)** for complete technical analysis and migration patterns.

### Key Migration Points

#### 1. **Registration Flow Change**
- **V1 (ENS)**: `NameWrapper.setSubnodeRecord()` - free, but requires separate transactions for records
- **V2 (Basenames)**: `RegistrarController.register()` - paid, but fully atomic (registration + all records in one TX)

**Pattern from refactoring doc:**
```typescript
// V2: Single atomic transaction with batched records
const recordsData: `0x${string}`[] = [];

// Add setAddr
recordsData.push(
  encodeFunctionData({
    abi: RESOLVER_ABI,
    functionName: 'setAddr',
    args: [subnameNode, creatorAddress],
  })
);

// Add all setText calls
for (const [key, value] of Object.entries(records)) {
  recordsData.push(
    encodeFunctionData({
      abi: RESOLVER_ABI,
      functionName: 'setText',
      args: [subnameNode, key, value],
    })
  );
}

// Single transaction registers name + sets all records
await registrarController.register({
  name: normalizedLabel,
  owner: creatorAddress,
  duration: BigInt(365 * 24 * 60 * 60), // 1 year
  resolver: RESOLVER_ADDRESS,
  data: recordsData, // Batched records!
  reverseRecord: false,
}, { value: price });
```

#### 2. **Chain Migration**
- **V1**: Ethereum Sepolia (L1, chain ID 11155111)
- **V2**: Base Sepolia (L2, chain ID 84532)
- All operations move to Base Sepolia for consistency with Splits/Zora

#### 3. **Payment Integration**
- Basenames requires payment (varies by name length)
- Use `RegistrarController.registerPrice(name, duration)` to get price
- Payment is sent as `value` in the register transaction

#### 4. **Testing Tool Available**
- Use **https://v11.oakgroup.eth.limo/** to test basenames operations
- Can register, query, and check availability
- Useful for validating patterns before implementing in main app

### Files to Update in Main App

Based on the refactoring doc, these files need updates:

1. **`lib/services/ens.ts`** → Create `lib/services/basenames.ts`
   - Replace `NameWrapper.setSubnodeRecord()` with `RegistrarController.register()`
   - Add payment handling
   - Batch records via `data[]` parameter

2. **`lib/services/query-ens.ts`** → Update to `lib/services/query-basenames.ts`
   - Change chain from Sepolia to Base Sepolia
   - Update contract addresses
   - Interface remains the same (ENS-compatible)

3. **Environment Variables**
   - Already set in `.env.local`:
     - `BASE_RPC_URL`
     - `BASENAMES_REGISTRY_BASE_SEPOLIA`
     - `BASENAMES_REGISTRAR_CONTROLLER_BASE_SEPOLIA`
     - `BASENAMES_RESOLVER_BASE_SEPOLIA`
     - `BASENAMES_REVERSE_REGISTRAR_BASE_SEPOLIA`

4. **Safe Integration**
   - Basenames operations can be batched in Safe transactions
   - All on Base Sepolia, so can batch with Splits + Zora operations

### Next Steps

1. **Review the refactoring doc** - Understand the full migration patterns
2. **Test with the tool** - Use https://v11.oakgroup.eth.limo/ to validate operations
3. **Implement in main app** - Start with `lib/services/basenames.ts` following the patterns
4. **Update job flow** - Integrate basenames registration into the release publishing flow

### Key Differences Summary

| Aspect | ENS (V1) | Basenames (V2) |
|--------|----------|----------------|
| **Chain** | Sepolia L1 | Base Sepolia L2 |
| **Registration** | NameWrapper.setSubnodeRecord() | RegistrarController.register() |
| **Payment** | Free | Paid (varies by name) |
| **Records** | Separate transactions | Batched in registration TX |
| **Tokenization** | Optional ERC1155 | Automatic ERC721 |
| **Atomicity** | Partial (name only) | Full (name + all records) |

---

## Testing Tool Details

**URL**: https://v11.oakgroup.eth.limo/

**Features**:
- Register basenames with address and text records
- Query existing basenames (all records, reverse resolution)
- Check availability before registering

**Use Cases for Migration**:
- Test registration flow before implementing in main app
- Validate contract addresses and RPC endpoints
- Verify record-setting patterns
- Test payment flow

---

## Environment Setup

The tool automatically loads from parent `.env.local`:
- `BASE_RPC_URL` → `NEXT_PUBLIC_BASE_RPC_URL`
- `BASENAMES_REGISTRY_BASE_SEPOLIA` → `NEXT_PUBLIC_BASENAMES_REGISTRY_BASE_SEPOLIA`
- `BASENAMES_REGISTRAR_CONTROLLER_BASE_SEPOLIA` → `NEXT_PUBLIC_BASENAMES_REGISTRAR_CONTROLLER_BASE_SEPOLIA`
- `BASENAMES_RESOLVER_BASE_SEPOLIA` → `NEXT_PUBLIC_BASENAMES_RESOLVER_BASE_SEPOLIA`
- `BASENAMES_REVERSE_REGISTRAR_BASE_SEPOLIA` → `NEXT_PUBLIC_BASENAMES_REVERSE_REGISTRAR_BASE_SEPOLIA`

All variables are already set and working.

