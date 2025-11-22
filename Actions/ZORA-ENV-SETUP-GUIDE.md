# 🎨 Zora Environment Setup — Best Practices from @zoralabs/coins-sdk

## Overview

This guide captures **Zora Coins SDK best practices** from @zora-context.md and applies them to our environment configuration.

---

## Key Patterns from Zora Docs

### Pattern 1: Viem Client Setup

**Every Zora SDK example follows this pattern:**

```typescript
import { createPublicClient, createWalletClient, http } from "viem";
import { base } from "viem/chains";  // ← Always import Base chain

// Public client (read-only)
const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL),
});

// Wallet client (for writes)
const walletClient = createWalletClient({
  account: "0x<YOUR_ACCOUNT>",
  chain: base,
  transport: http(process.env.BASE_RPC_URL),
});
```

**Why this matters:**
- `base` chain context ensures correct network configuration
- `http()` transport wraps the RPC URL
- Both clients share the same chain/RPC context

---

### Pattern 2: SDK Initialization

**For production environments:**

```typescript
import { setApiKey } from "@zoralabs/coins-sdk";

// Set BEFORE making SDK calls
setApiKey(process.env.ZORA_API_KEY);
```

From docs: *"This code snippet demonstrates how to set up your API key for the Zora Coins SDK. It's a crucial step for high-usage production environments, ensuring authenticated requests to the API."*

**For MVP:** Optional (public queries work without key)

---

### Pattern 3: Chain Configuration

All examples use:

```typescript
import { base } from "viem/chains";

// Defaults
chainId: base.id,  // 8453 for mainnet, 84532 for sepolia
chain: base,
```

**Base Network IDs:**
- `8453` = Base Mainnet
- `84532` = Base Sepolia Testnet

**Our config:**
```bash
BASE_CHAIN_ID=84532  # For MVP
BASE_RPC_URL=https://sepolia.base.org
```

---

### Pattern 4: Error Handling

From Zora context examples:

```typescript
try {
  const result = await createCoin(coinParams, walletClient, publicClient);
  console.log("Success:", result);
} catch (error) {
  console.error("Error creating coin:", error);
  throw error;
}
```

**Our approach:**
- Use Result<T> pattern (already in codebase)
- Wrap Zora calls with error handling

---

## Environment Variables Summary

### Required for Week 2 (Days 8-9)

| Variable | Purpose | Source | MVP Value |
|----------|---------|--------|-----------|
| `BASE_RPC_URL` | Zora contract calls | Alchemy/public RPC | `https://sepolia.base.org` |
| `BASE_CHAIN_ID` | Network identifier | viem/chains | `84532` |
| `ZORA_CREATOR_ADDRESS` | Factory contract | Zora docs | Public creator address |
| `BASE_CREATOR_ADDRESS` | Payout recipient | Your Safe/wallet | Your Safe address |

### Optional (Production)

| Variable | Purpose | Source |
|----------|---------|--------|
| `ZORA_API_KEY` | Rate limiting | Zora developer dashboard |

---

## Implementation Checklist for Backend (lib/services/zora.ts)

- [ ] Import viem clients and Base chain
- [ ] Configure publicClient with BASE_RPC_URL
- [ ] Configure walletClient with BASE_RPC_URL + account
- [ ] Import Zora SDK functions (@zoralabs/coins-sdk)
- [ ] Set API key if ZORA_API_KEY provided
- [ ] Wrap all Zora calls with error handling
- [ ] Test with Base Sepolia testnet

---

## Zora Coins Creation Flow (from docs)

When we mint NFTs on Base (Day 8-9), we'll follow this pattern:

```typescript
import { createCoin, DeployCurrency } from "@zoralabs/coins-sdk";

const coinParams = {
  name: "Release Title",
  symbol: "RELEASE-ID",
  uri: "ipfs://<metadataIPFSHash>",  // From IPFS service
  payoutRecipient: process.env.BASE_CREATOR_ADDRESS,  // Safe address
  platformReferrer: process.env.BASE_CREATOR_ADDRESS,  // Optional
  chainId: base.id,
  currency: DeployCurrency.ZORA,  // Or ETH
};

const result = await createCoin(coinParams, walletClient, publicClient, {
  gasMultiplier: 120,  // 20% buffer
});

console.log("Coin address:", result.address);
console.log("Token ID:", result.tokenId);
```

---

## Common Zora SDK Functions We'll Use

### Onchain Queries (read-only)

```typescript
import { getOnchainCoinDetails } from "@zoralabs/coins-sdk";

// Fetch coin details (market cap, liquidity, owners)
const details = await getOnchainCoinDetails({
  coin: "0xCoinAddress",
  user: "0xOptionalUserAddress",  // To get balance
  publicClient
});
```

### Coin Creation (write)

```typescript
import { createCoin } from "@zoralabs/coins-sdk";

// Create new coin with metadata
const result = await createCoin(coinParams, walletClient, publicClient);
```

### Coin Trading (write)

```typescript
import { tradeCoin } from "@zoralabs/coins-sdk";

const result = await tradeCoin(tradeParams, walletClient, publicClient);
```

---

## Dependencies Required

Based on Zora docs, we need:

```json
{
  "dependencies": {
    "@zoralabs/coins-sdk": "latest",
    "viem": "latest"
  }
}
```

**Install:**
```bash
npm install @zoralabs/coins-sdk viem
```

---

## Configuration in Application Startup

**Suggested location: `app/api/initialize.ts` or `lib/config/zora.ts`**

```typescript
import { setApiKey } from "@zoralabs/coins-sdk";
import { createPublicClient, createWalletClient, http } from "viem";
import { base } from "viem/chains";

// Initialize Zora SDK
if (process.env.ZORA_API_KEY) {
  setApiKey(process.env.ZORA_API_KEY);
}

// Create clients
export const zoraPublicClient = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL),
});

export const zoraWalletClient = createWalletClient({
  account: process.env.BASE_CREATOR_ADDRESS as `0x${string}`,
  chain: base,
  transport: http(process.env.BASE_RPC_URL),
});
```

---

## Testing Zora Integration

**MVP test checklist:**

- [ ] Verify viem clients initialize without errors
- [ ] Test publicClient connection to Base Sepolia RPC
- [ ] Fetch sample coin details from Base Sepolia
- [ ] Verify wallet client can sign transactions (dry-run)
- [ ] Test setApiKey() if using production API

---

## References

- **Zora Coins SDK Docs:** https://docs.zora.co/coins/sdk
- **Zora Contracts:** https://docs.zora.co/coins/contracts
- **Viem Documentation:** https://viem.sh
- **Base Network:** https://base.org

---

## Next Steps

1. ✅ Populate `.env.local` with Zora values (BASE_RPC_URL, BASE_CREATOR_ADDRESS)
2. ✅ Install Zora SDK: `npm install @zoralabs/coins-sdk`
3. → Build `lib/services/zora.ts` using patterns from this guide
4. → Integrate with publishRelease job (Day 8-9)

---

**Document Version:** 1.0  
**Source:** @zora-context.md + Zora official docs  
**Created:** November 16, 2025

