# 🔑 Environment Configuration Setup Guide

## Overview

Before starting Week 2 implementation, you need to populate your `.env.local` file with all required values. This guide walks you through obtaining each one.

---

## Quick Start

```bash
# 1. Copy template to actual env file
cp .env.example .env.local

# 2. Follow this guide to fill in values
# 3. Verify with: npm test -- lib/config.test.ts
```

---

## Complete Environment Variables Reference

### SECTION 1: ETHEREUM L1 (Mainnet or Sepolia Testnet)

**For MVP, use Sepolia testnet. Upgrade to Mainnet after security audit.**

```bash
# Public RPC endpoint (free, rate-limited)
L1_RPC_URL=https://sepolia-rpc.publicnode.com

# Or use Alchemy/Infura for higher rate limits:
# https://www.alchemy.com/dapps/ethereum-rpc
# https://infura.io

# Chain ID: 11155111 = Sepolia testnet
L1_CHAIN_ID=11155111
```

**Action:** Choose one RPC provider, update L1_RPC_URL.

---

### SECTION 2: SAFE MULTISIG (CRITICAL - Do This First)

**This is the upstream gate. Safe must be set up before anything else works.**

#### Step 2.1: Deploy Safe on Sepolia

1. Go to: https://app.safe.global
2. Click "Create Account"
3. Connect wallet (MetaMask, etc.)
4. Select network: **Ethereum Sepolia**
5. Set up Safe:
   - Name: "Catalogue Curators" (or similar)
   - Add owners: 3 test addresses
     - You can use test wallets or Ethereum addresses
   - Set threshold: **2** (2-of-3 multisig)
6. Deploy Safe (costs ~0.5 Sepolia ETH)
7. Copy Safe address

```bash
# Example output from Safe creation:
CURATOR_SAFE_ADDRESS=0x1234567890123456789012345678901234567890
```

**Action:** Deploy Safe, copy address to CURATOR_SAFE_ADDRESS.

---

#### Step 2.2: Get Safe Signer Key

The backend needs a private key authorized to sign on behalf of the Safe.

```bash
# One of the Safe owners' private keys
# MUST be one of the addresses added in Step 2.1
# This address will use its private key to sign ENS transactions

# Example: If you added 0xAlice, 0xBob, 0xCharlie as owners,
# use Alice's private key here

CURATOR_SIGNER_KEY=0x<64-hex-characters>
```

**⚠️ SECURITY WARNING:**
- Never use your main wallet's private key
- Use a dedicated signer address for backend operations
- Keep this key safe; it can sign on behalf of the Safe

**Action:** Get private key of one Safe owner, update CURATOR_SIGNER_KEY.

---

#### Step 2.3: Get Safe API Key

Safe SDK requires an API key to query Safe data.

1. Go to: https://safe.global
2. Click account → Developers
3. Create new API key
4. Copy the key

```bash
SAFE_API_KEY=<your-api-key>
SAFE_API_URL=https://safe-transaction-sepolia.safe.global
```

**Action:** Get API key from Safe dashboard, update both values.

---

#### Step 2.4: Set Approval Threshold

This should match the Safe threshold you set in Step 2.1.

```bash
# If Safe is 2-of-3:
APPROVAL_THRESHOLD=2

# If Safe is 3-of-5:
APPROVAL_THRESHOLD=3
```

**Action:** Update to match your Safe configuration.

---

### SECTION 3: ENS (Ethereum Name Service)

**ENS domain must be owned by the Protocol DAO (represented by Safe).**

#### Step 3.1: Own/Register ENS Domain

Option A: **Register new domain**
1. Go to: https://app.ens.domains
2. Search for desired name (e.g., `catalogue.eth`)
3. Register for 1+ years
4. Set primary name

Option B: **Use existing domain**
- You own: `palaupalau.eth` or similar
- Transfer to Safe control (optional for MVP)

```bash
PRIMARY_ENS_DOMAIN=palaupalau.eth
```

**Action:** Update PRIMARY_ENS_DOMAIN to your domain.

---

#### Step 3.2: Compute ENS Namehash

Every ENS domain has a namehash (node) used internally.

**Option A: Online tool**
- Go to: https://app.ens.domains
- Search domain
- Look for "Node hash" in resolver details

**Option B: Compute locally**
```bash
# In Node.js or Ethers:
const ethers = require('ethers');
const node = ethers.namehash('palaupalau.eth');
console.log(node);
// Output: 0x...
```

```bash
PRIMARY_ENS_NODE=0x<64-hex-characters>
```

**Action:** Compute namehash, update PRIMARY_ENS_NODE.

---

#### Step 3.3: Set Resolver Addresses

These are standard ENS resolver contracts (same for all users).

```bash
# Mainnet resolver:
ENS_RESOLVER_ADDRESS=0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63

# Sepolia resolver:
ENS_RESOLVER_ADDRESS=0x8FADE66B79cC9f707aB26799354482EB93a5B7dD

# Both use same registry:
ENS_REGISTRY_ADDRESS=0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e
```

**Action:** Choose resolver for your network (Sepolia for testnet).

---

### SECTION 4: IPFS / STORACHA (Content Storage)

**Storacha provides IPFS pinning with 12-month guarantees.**

#### Step 4.1: Sign Up for Storacha

1. Go to: https://storacha.com (formerly web3.storage)
2. Sign up with email or GitHub
3. Verify email
4. Go to account dashboard
5. Click "API Tokens" → "Create Token"
6. Name it: `catalogue-mvp`
7. Copy token

```bash
STORACHA_TOKEN=<your-api-token>
```

**Action:** Sign up for Storacha, create API token, update STORACHA_TOKEN.

---

#### Step 4.2: Gateway URLs

```bash
# Storacha gateway (fast, primary):
IPFS_GATEWAY_PRIMARY=https://w3s.link/ipfs/

# IPFS.io gateway (fallback, public):
IPFS_GATEWAY_FALLBACK=https://ipfs.io/ipfs/
```

**Action:** Keep defaults (no action needed).

---

### SECTION 5: ZORA (NFT Minting on Base L2)

**For MVP, we use Base testnet. Upgrade after security review.**

#### Step 5.1: Base L2 RPC Setup

**Best Practice:** Per Zora Coins SDK (@zoralabs/coins-sdk) docs:

1. Use viem clients: `createPublicClient` + `createWalletClient`
2. Import chain context: `import { base } from "viem/chains"`
3. Configure RPC transport: `http(BASE_RPC_URL)`

```typescript
// Pattern from Zora docs (lib/services/zora.ts):
import { createPublicClient, createWalletClient, http } from "viem";
import { base } from "viem/chains";  // ← Import Base chain context

const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL),
});

const walletClient = createWalletClient({
  account: "0x<YOUR_ACCOUNT>",
  chain: base,
  transport: http(process.env.BASE_RPC_URL),
});
```

**Environment values:**

```bash
# Base Sepolia testnet (for MVP):
BASE_RPC_URL=https://sepolia.base.org
BASE_CHAIN_ID=84532

# Or Alchemy/Infura for higher limits:
# https://www.alchemy.com/dapps/base-rpc
```

**Action:** Choose RPC provider (public or Alchemy), update BASE_RPC_URL.

---

#### Step 5.2: Zora Creator Configuration

**Two approaches for MVP:**

**Option A: Public Creator (Recommended - Simpler)**
```bash
# Use Zora's shared public creator factory
# Get current address from: https://docs.zora.co/coins/contracts/factory
ZORA_CREATOR_ADDRESS=0x<zora-factory-address>

# Your payout recipient (receives artist royalties):
# Can be: wallet (0x...) or Safe address
BASE_CREATOR_ADDRESS=0x<your-safe-or-wallet>
```

**Option B: Deploy Your Own (Advanced - More control)**
- Deploy Factory.sol to Base Sepolia first
- Use deployed contract address as ZORA_CREATOR_ADDRESS
- Set BASE_CREATOR_ADDRESS to your Safe

**Optional - SDK API Key (Production only):**

```typescript
// From @zoralabs/coins-sdk for rate limiting:
import { setApiKey } from "@zoralabs/coins-sdk";
setApiKey(process.env.ZORA_API_KEY);
```

```bash
# Get from: https://docs.zora.co/coins/sdk/queries
# Leave empty for MVP (works without key)
ZORA_API_KEY=
```

**Action:** For MVP, use Option A (public creator). Update BASE_CREATOR_ADDRESS to your Safe.

---

### SECTION 6: FACTORY CONTRACT

**This is deployed in Week 2 Days 8-9. Leave empty for now.**

```bash
# After deployment (Day 8-9):
FACTORY_ADDRESS=0x

# Deployer key (only for initial deployment):
FACTORY_DEPLOYER_KEY=0x
```

**Action:** Leave empty. Update after contract deployment.

---

### SECTION 7: REDIS (Job Queue)

**Redis is required for async job processing.**

#### Step 7.1: Start Redis Locally

```bash
# Option A: Docker (recommended)
docker run -d -p 6379:6379 redis

# Option B: Install locally
brew install redis
redis-server
```

```bash
# Connection string:
REDIS_URL=redis://localhost:6379

# Or individual settings:
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

**Action:** Start Redis, verify connection.

---

### SECTION 8: DATABASE (PostgreSQL)

**PostgreSQL is required for state management.**

#### Step 8.1: Start PostgreSQL Locally

```bash
# Option A: Docker (recommended)
docker run -d -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  postgres

# Option B: Install locally
brew install postgresql
brew services start postgresql
```

```bash
# Connection string:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/catalogue

# Or individual settings:
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=catalogue
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
```

**Action:** Start PostgreSQL, verify connection.

---

### SECTION 9: THE GRAPH (Optional)

**Skip for MVP. Add after Week 5.**

```bash
SUBGRAPH_ENDPOINT=
LOCAL_INDEXER_ENDPOINT=
```

**Action:** Leave empty for now.

---

### SECTION 10: APPLICATION SETTINGS

```bash
NODE_ENV=development
APP_HOST=localhost
APP_PORT=3000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=dev-secret-change-in-production
```

**Action:** Keep defaults.

---

### SECTION 11: LOGGING

```bash
LOG_LEVEL=debug
VERBOSE_LOGGING=true
```

**Action:** Keep defaults.

---

## Checklist: Pre-Week 2 Setup

- [ ] **Safe deployed on Sepolia**
  - [ ] Safe address copied → CURATOR_SAFE_ADDRESS
  - [ ] Signer key obtained → CURATOR_SIGNER_KEY
  - [ ] Safe API key → SAFE_API_KEY
  - [ ] Threshold configured → APPROVAL_THRESHOLD

- [ ] **ENS domain ready**
  - [ ] Domain registered → PRIMARY_ENS_DOMAIN
  - [ ] Namehash computed → PRIMARY_ENS_NODE
  - [ ] Resolver set → ENS_RESOLVER_ADDRESS

- [ ] **IPFS configured**
  - [ ] Storacha account created → STORACHA_TOKEN

- [ ] **Local services running**
  - [ ] Redis: `docker run -d -p 6379:6379 redis`
  - [ ] PostgreSQL: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres`

- [ ] **RPC endpoints configured**
  - [ ] L1_RPC_URL set
  - [ ] BASE_RPC_URL set

---

## Verification

Once you've filled in `.env.local`, verify everything works:

```bash
# Create test file to verify env vars are loaded correctly
npm run test -- env.config.test.ts

# Expected output:
# ✅ All environment variables loaded
# ✅ Safe contract reachable
# ✅ Redis connected
# ✅ PostgreSQL connected
```

---

## Troubleshooting

### Safe connection fails
- Check: L1_RPC_URL is reachable
- Verify: CURATOR_SAFE_ADDRESS is valid Sepolia address
- Confirm: Safe API key is correct

### IPFS upload fails
- Verify: STORACHA_TOKEN is valid and not expired
- Check: Storacha account has remaining upload quota

### Database connection fails
- Verify: PostgreSQL is running (`docker ps`)
- Check: DATABASE_HOST and DATABASE_PORT are correct
- Confirm: DATABASE_PASSWORD matches

### Redis connection fails
- Verify: Redis is running (`docker ps`)
- Check: REDIS_URL is correct

---

## Security Notes

1. **Never commit `.env.local`** (already in .gitignore)
2. **Use test wallets** for CURATOR_SIGNER_KEY (not main funds)
3. **Rotate API tokens** regularly
4. **Use dedicated Safe signer** (not production wallet)
5. **Backup private keys** securely

---

## What's Next?

Once `.env.local` is complete and verified:

1. ✅ Environment configured
2. ✅ Safe deployed and accessible
3. ✅ Local services running (Redis, PostgreSQL)
4. → **Ready for Week 2, Day 6: Safe Authorization Gate Setup**

---

**Document Version:** 1.0  
**Created:** November 16, 2025

