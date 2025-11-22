# `.env.local` Template (Copy to .env.local and fill in values)

```bash
# ═════════════════════════════════════════════════════════════════════════════
# CATALOGUE MVP — ENVIRONMENT CONFIGURATION
# ═════════════════════════════════════════════════════════════════════════════
# 
# IMPORTANT: Copy this template to `.env.local` and fill in actual values
# DO NOT commit `.env.local` to version control
#
# See ENV-SETUP-GUIDE.md for detailed instructions on obtaining each value
# ═════════════════════════════════════════════════════════════════════════════

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 1: ETHEREUM L1 RPC
# ─────────────────────────────────────────────────────────────────────────────
# For MVP, use Sepolia testnet. Upgrade to Mainnet (chain 1) after audit.

L1_RPC_URL=https://sepolia-rpc.publicnode.com
L1_CHAIN_ID=11155111

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 2: SAFE MULTISIG (CRITICAL - Deploy first)
# ─────────────────────────────────────────────────────────────────────────────
# 1. Deploy Safe at https://app.safe.global (Sepolia, 2-of-3 threshold)
# 2. Get API key from Safe developer dashboard
# 3. Use one Safe owner's private key as CURATOR_SIGNER_KEY

CURATOR_SAFE_ADDRESS=0x
CURATOR_SIGNER_KEY=0x
SAFE_API_KEY=
SAFE_API_URL=https://safe-transaction-sepolia.safe.global
APPROVAL_THRESHOLD=2

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 3: ENS (Domain & Resolver)
# ─────────────────────────────────────────────────────────────────────────────
# 1. Register or own ENS domain
# 2. Compute namehash: ethers.namehash('yourdomain.eth')

PRIMARY_ENS_DOMAIN=palaupalau.eth
PRIMARY_ENS_NODE=0x
ENS_RESOLVER_ADDRESS=0x8FADE66B79cC9f707aB26799354482EB93a5B7dD
ENS_REGISTRY_ADDRESS=0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 4: IPFS / STORACHA
# ─────────────────────────────────────────────────────────────────────────────
# 1. Sign up at https://storacha.com
# 2. Create API token from dashboard

STORACHA_TOKEN=
DID_KEY=
IPFS_GATEWAY_PRIMARY=https://w3s.link/ipfs/
IPFS_GATEWAY_FALLBACK=https://ipfs.io/ipfs/

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 5: ZORA (Base L2 NFT Minting)
# ─────────────────────────────────────────────────────────────────────────────
# For MVP, use Base Sepolia testnet
# Key patterns from @zoralabs/coins-sdk:
# 1. Use viem clients: createPublicClient + createWalletClient
# 2. Set up chain context: import { base } from "viem/chains"
# 3. Use RPC transport: http(BASE_RPC_URL)
# 4. Optional: Set API key for production rate limits

# Base L2 RPC endpoint
# Mainnet: https://mainnet.base.org
# Testnet (Sepolia): https://sepolia.base.org
BASE_RPC_URL=https://sepolia.base.org

# Base Chain ID (8453 = mainnet, 84532 = sepolia testnet)
BASE_CHAIN_ID=84532

# Zora Creator address (factory/deployment contract on Base)
# This is where coins are created
# Leave empty for MVP; fill in after Zora contract exploration
ZORA_CREATOR_ADDRESS=0x

# Base Creator address (receives royalties/payouts)
# Can be EOA or Safe address
# This is your payout recipient for sales
BASE_CREATOR_ADDRESS=0x

# Optional: Zora Coins SDK API Key
# For high-usage production environments
# Get from: https://docs.zora.co/coins/sdk/queries
# Set programmatically: import { setApiKey } from "@zoralabs/coins-sdk"; setApiKey("...")
ZORA_API_KEY=

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 6: FACTORY CONTRACT
# ─────────────────────────────────────────────────────────────────────────────
# Fill in after deployment (Week 2, Day 8-9)

FACTORY_ADDRESS=0x
FACTORY_DEPLOYER_KEY=0x

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 7: REDIS (Job Queue)
# ─────────────────────────────────────────────────────────────────────────────
# Start locally: docker run -d -p 6379:6379 redis

REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 8: DATABASE (PostgreSQL)
# ─────────────────────────────────────────────────────────────────────────────
# Start locally: docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/catalogue
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=catalogue
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 9: THE GRAPH (Skip for MVP)
# ─────────────────────────────────────────────────────────────────────────────

SUBGRAPH_ENDPOINT=
LOCAL_INDEXER_ENDPOINT=

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 10: APPLICATION
# ─────────────────────────────────────────────────────────────────────────────

NODE_ENV=development
APP_HOST=localhost
APP_PORT=3000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=dev-secret-change-in-production

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 11: LOGGING
# ─────────────────────────────────────────────────────────────────────────────

LOG_LEVEL=debug
VERBOSE_LOGGING=true

# ═════════════════════════════════════════════════════════════════════════════
# HOW TO USE THIS FILE
# ═════════════════════════════════════════════════════════════════════════════
#
# 1. Copy to your actual env file:
#    cp Actions/ENV-EXAMPLE.md ../.env.local
#
# 2. Fill in ALL required values:
#    - Use actual Safe address, signer key, API keys
#    - Do NOT use placeholder values
#
# 3. Verify locally:
#    npm test -- lib/config.test.ts
#
# 4. Never commit:
#    .env.local is in .gitignore (do not modify)
#
# ═════════════════════════════════════════════════════════════════════════════
```

---

## Key Values to Obtain (Priority Order)

### 🔴 CRITICAL (Must have before Day 6)

1. **Safe Contract** (CURATOR_SAFE_ADDRESS)
   - Deploy at: https://app.safe.global
   - Network: Sepolia testnet
   - Config: 2-of-3 multisig
   
2. **Safe Signer Key** (CURATOR_SIGNER_KEY)
   - Private key of one Safe owner
   - Use test wallet, not production

3. **Safe API Key** (SAFE_API_KEY)
   - Get from: Safe developer dashboard

4. **Storacha Token** (STORACHA_TOKEN)
   - Sign up: https://storacha.com
   - Generate API token

5. **L1 RPC URL** (L1_RPC_URL)
   - Use public endpoint or Alchemy/Infura

### 🟡 IMPORTANT (Must have before Day 6)

6. **ENS Domain** (PRIMARY_ENS_DOMAIN)
   - Register at: https://app.ens.domains
   - Own or control domain

7. **ENS Namehash** (PRIMARY_ENS_NODE)
   - Compute: `ethers.namehash('yourdomain.eth')`

8. **Base RPC URL** (BASE_RPC_URL)
   - For Base Sepolia or Base Mainnet

### 🟢 SETUP (Can configure locally)

9. **Redis** (REDIS_URL)
   - Start: `docker run -d -p 6379:6379 redis`

10. **PostgreSQL** (DATABASE_URL)
    - Start: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres`

### ⚪ LATER (Fill in after Day 8-9)

11. **Factory Contract** (FACTORY_ADDRESS)
    - After deployment

---

## Verification Commands

```bash
# 1. Copy template
cp Actions/ENV-EXAMPLE.md .env.local

# 2. Edit .env.local (use your editor)
# vim .env.local
# or
# code .env.local

# 3. Fill in all values from checklist above

# 4. Verify all services are reachable
npm test -- lib/config.test.ts

# 5. Run existing tests to confirm setup
npm test

# 6. Ready for Week 2 Day 6!
```

---

## What Each Variable Does

| Variable | Purpose | Source |
|----------|---------|--------|
| `CURATOR_SAFE_ADDRESS` | Where curator approvals happen | Safe deploy |
| `CURATOR_SIGNER_KEY` | Backend signing authority | Safe owner private key |
| `SAFE_API_KEY` | Access Safe contract data | Safe dashboard |
| `PRIMARY_ENS_DOMAIN` | Release naming namespace | ENS registry |
| `PRIMARY_ENS_NODE` | ENS node hash (internal) | ethers.namehash() |
| `STORACHA_TOKEN` | IPFS pinning service | Storacha account |
| `L1_RPC_URL` | Ethereum L1 connection | Alchemy/Infura/public |
| `BASE_RPC_URL` | Base L2 connection | Alchemy/Infura/public |
| `REDIS_URL` | Job queue backend | Docker/local |
| `DATABASE_URL` | PostgreSQL connection | Docker/local |

---

**For detailed instructions, see `Actions/ENV-SETUP-GUIDE.md`**

