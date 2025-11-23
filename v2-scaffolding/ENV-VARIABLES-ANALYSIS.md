# Environment Variables Analysis & Organization

## Current Status

### ✅ Variables Currently Set

| Variable | Status | Purpose |
|----------|--------|---------|
| `BASE_RPC_URL` | ✅ Set | Base Sepolia RPC endpoint |
| `BASE_CHAIN_ID` | ✅ Set | Base Sepolia chain ID (84532) |
| `SPLITS_CHAIN_ID` | ✅ Set | Splits protocol chain ID |
| `ZORA_COIN_FACTORY_ADDRESS` | ✅ Set | Zora coin factory contract |
| `ZORA_API_KEY` | ✅ Set | Zora API key |
| `SAFE_ADDRESS` | ✅ Set | Safe multisig address |
| `SAFE_API_KEY` | ✅ Set | Safe API key |
| `CURATOR_ADDRESS` | ✅ Set | Curator wallet address |
| `CURATOR_PRIVATE_KEY` | ✅ Set | Curator private key |
| `TEST_ARTIST_ADDRESS` | ✅ Set | Test artist address |
| `DATABASE_URL` | ✅ Set | PostgreSQL connection string |
| `ENS_DOMAIN` | ✅ Set | ENS domain (scenedex.eth) |
| `ENS_PARENT_NODE` | ✅ Set | ENS parent node hash |
| `ENS_SUBNAME_PREFIX` | ✅ Set | Subname prefix (SOMA) |
| `ENS_SERVICE_NAMESPACE` | ✅ Set | Service namespace (eth.scenedex) |
| `BASENAMES_REGISTRY_BASE_SEPOLIA` | ✅ Set | Basenames Registry |
| `BASENAMES_BASE_REGISTRAR_BASE_SEPOLIA` | ✅ Set | Basenames BaseRegistrar |
| `BASENAMES_REGISTRAR_CONTROLLER_BASE_SEPOLIA` | ✅ Set | Basenames RegistrarController |
| `BASENAMES_RESOLVER_BASE_SEPOLIA` | ✅ Set | Basenames L2Resolver |
| `BASENAMES_REVERSE_REGISTRAR_BASE_SEPOLIA` | ✅ Set | Basenames ReverseRegistrar |
| `BASENAMES_PRICE_ORACLE_BASE_SEPOLIA` | ✅ Set | Basenames Price Oracle |
| `DID_KEY` | ✅ Set | Storacha DID key |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | ✅ Set | WalletConnect project ID |

### ❌ Missing Required Variables

**NONE - All required variables for v2 (Base Sepolia) are set!**

**Note:** Sepolia L1 variables (`SEPOLIA_RPC_URL`, `ENS_RESOLVER_SEPOLIA`) are **NOT needed** for v2 refactoring since we're migrating everything to Base Sepolia.

### ⚠️ Variables with Defaults (Not Critical)

| Variable | Default Value | Used In |
|----------|---------------|---------|
| `ENS_NAMEWRAPPER_SEPOLIA` | `0x0635513f179D50A207757E05759CbD106d7dFcE8` | `ens.ts` |
| `ENS_SEPOLIA_REGISTRY` | Set but not used directly | N/A |

---

## Recommended .env.local Organization

```bash
# ==============================================================================
# NETWORK CONFIGURATION
# ==============================================================================

# Base Sepolia (L2) - Primary chain for v2 operations
BASE_RPC_URL=https://base-sepolia.g.alchemy.com/v2/lrMqugbPNZcypSuWA_g9C
BASE_CHAIN_ID=84532

# Ethereum Sepolia (L1) - Required for ENS operations (v1) and Safe
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
# OR use Alchemy: https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
INFURA_KEY=YOUR_INFURA_PROJECT_KEY  # Optional fallback

# ==============================================================================
# SPLITS PROTOCOL
# ==============================================================================

SPLITS_CHAIN_ID=84532

# ==============================================================================
# ZORA COINS
# ==============================================================================

ZORA_COIN_FACTORY_ADDRESS=0x777777751622c0d3258f214F9DF38E35BF45baF3
ZORA_API_KEY=zora_api_4299ce0092fbb61cd22cd2fb2957b15b21f9e38b89a95abd09f8ff00536c6a70

# ==============================================================================
# SAFE MULTISIG
# ==============================================================================

SAFE_ADDRESS=0xf2fa1E8e06641C76Cfe2854c1e4D932a8b6e29fD
SAFE_API_KEY=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzYWZlLWF1dGgtc2VydmljZSIsInN1YiI6Ijc3ZTFmNDU4YTkyMjRhNDM4YTI2M2FjZDlmZjQ1ZmZkX2YyZGU2YjI2YzMwOTQ5Mzc4NjEyMDllNzZiZjNiZmRkIiwia2V5IjoiNzdlMWY0NThhOTIyNGE0MzhhMjYzYWNkOWZmNDVmZmRfZjJkZTZiMjZjMzA5NDkzNzg2MTIwOWU3NmJmM2JmZGQiLCJhdWQiOlsic2FmZS1hdXRoLXNlcnZpY2UiXSwiZXhwIjoxOTIxMDczODU1LCJkYXRhIjp7fX0.618PEgcpGXWIQgcae0YILVKmW9Rx_0DZxqdsbqZ4UC_O-M5Ekvh27ToK62leTmOGnE--RLoWK5zIS7L2AeGbEA

# ==============================================================================
# CURATOR/CREATOR VARIABLES
# ==============================================================================

CURATOR_ADDRESS=0x1c2f3137e71dec33c6111cfeb7f58b8389f9ff21
CURATOR_PRIVATE_KEY=0x5bac2a365ad5db99a387f07c3f352032d13063fdc5277cf7fe3385a02f14ae3a
TEST_ARTIST_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

# ==============================================================================
# DATABASE
# ==============================================================================

DATABASE_URL=postgresql://postgres:KCLILuVQKUViUAxVJuQyOetWZFIjBhPd@yamanote.proxy.rlwy.net:20228/railway

# ==============================================================================
# ENS (Ethereum Name Service) - V1 Implementation (DEPRECATED FOR V2)
# ==============================================================================
# These are kept for reference but NOT needed for v2 Basenames migration
# Will be removed after v2 migration is complete

# ENS_DOMAIN=scenedex.eth  # Not needed - Basenames uses base.eth
# ENS_PARENT_NODE=...      # Not needed - Basenames uses base.eth node
# ENS_RESOLVER_SEPOLIA=... # Not needed - Use BASENAMES_RESOLVER_BASE_SEPOLIA
# ENS_NAMEWRAPPER_SEPOLIA=... # Not needed - Basenames uses BaseRegistrar
# ENS_SEPOLIA_REGISTRY=... # Not needed - Use BASENAMES_REGISTRY_BASE_SEPOLIA

# These may still be useful for naming conventions:
ENS_SUBNAME_PREFIX=SOMA
ENS_SERVICE_NAMESPACE=eth.scenedex

# ==============================================================================
# BASENAMES - V2 Implementation (Base Sepolia)
# ==============================================================================
# Contract addresses for Basenames protocol on Base Sepolia
# These will replace ENS variables when migrating to v2

BASENAMES_REGISTRY_BASE_SEPOLIA=0x1493b2567056c2181630115660963E13A8E32735
BASENAMES_BASE_REGISTRAR_BASE_SEPOLIA=0xa0c70ec36c010b55e3c434d6c6ebeec50c705794
BASENAMES_REGISTRAR_CONTROLLER_BASE_SEPOLIA=0x49ae3cc2e3aa768b1e5654f5d3c6002144a59581
BASENAMES_RESOLVER_BASE_SEPOLIA=0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA
BASENAMES_REVERSE_REGISTRAR_BASE_SEPOLIA=0x876eF94ce0773052a2f81921E70FF25a5e76841f
BASENAMES_PRICE_ORACLE_BASE_SEPOLIA=0x2b73408052825e17e0fe464f92de85e8c7723231

# ==============================================================================
# IPFS / STORACHA
# ==============================================================================

DID_KEY=z6MktmGQtnPp7vwpwNdWm713U8kMUxuqBj59XBYgCGUPakF9

# ==============================================================================
# WALLET CONNECT
# ==============================================================================

NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=477d336ead207752e6ffab321072b0a8
```

---

## Action Items

### ✅ All Required Variables for V2 Are Set!

**No action needed** - All Base Sepolia variables required for the v2 Basenames migration are already configured.

**Note:** Sepolia L1 variables are **NOT needed** for v2 refactoring since everything migrates to Base Sepolia.

---

## Variable Usage by Service

### ENS Service (`lib/services/ens.ts`)
- ✅ `ENS_DOMAIN`
- ✅ `ENS_SUBNAME_PREFIX`
- ✅ `ENS_SERVICE_NAMESPACE`
- ✅ `ENS_PARENT_NODE`
- ✅ `ENS_NAMEWRAPPER_SEPOLIA` (has default)
- ❌ `ENS_RESOLVER_SEPOLIA` - **MISSING**
- ❌ `SEPOLIA_RPC_URL` - **MISSING**
- ⚠️ `INFURA_KEY` - Optional fallback

### Safe Service (`lib/services/safe.ts`, `safe-transactions.ts`)
- ✅ `SAFE_ADDRESS`
- ✅ `SAFE_API_KEY`
- ✅ `CURATOR_PRIVATE_KEY`
- ❌ `SEPOLIA_RPC_URL` - **MISSING**

### Zora Service (`lib/services/zora.ts`)
- ✅ `BASE_RPC_URL`
- ✅ `ZORA_COIN_FACTORY_ADDRESS`
- ✅ `ZORA_API_KEY`
- ✅ `CURATOR_PRIVATE_KEY`

### Splits Service (`lib/services/splits.ts`)
- ✅ `BASE_RPC_URL`
- ✅ `SPLITS_CHAIN_ID`
- ✅ `CURATOR_PRIVATE_KEY`
- ❌ `SEPOLIA_RPC_URL` - **MISSING** (used for cross-chain operations)

### Query ENS (`lib/services/query-ens.ts`)
- ❌ `SEPOLIA_RPC_URL` - **MISSING**

### Jobs (`lib/services/jobs.ts`)
- ❌ `SEPOLIA_RPC_URL` - **MISSING**
- ⚠️ `INFURA_KEY` - Optional fallback

---

## Migration Notes

### V1 → V2 Migration

When migrating from ENS (V1) to Basenames (V2):

**Variables to Keep:**
- `BASE_RPC_URL` - Still needed for Base Sepolia
- `BASENAMES_*` variables - Already set, ready for v2

**Variables to Remove (after migration):**
- `ENS_RESOLVER_SEPOLIA` - Replaced by `BASENAMES_RESOLVER_BASE_SEPOLIA`
- `ENS_NAMEWRAPPER_SEPOLIA` - Not needed (Basenames uses BaseRegistrar)
- `SEPOLIA_RPC_URL` - May still be needed for Safe operations on Sepolia

**Variables to Add (for v2):**
- All Basenames variables are already set ✅

---

## Quick Fix Commands

```bash
# Add missing SEPOLIA_RPC_URL (replace YOUR_KEY with actual key)
echo "SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY" >> .env.local

# Add missing ENS_RESOLVER_SEPOLIA
echo "ENS_RESOLVER_SEPOLIA=0xE99638b40E4Fff0129D56f03b55b6bbC4BBE49b5" >> .env.local

# Optional: Add INFURA_KEY
echo "INFURA_KEY=YOUR_INFURA_PROJECT_KEY" >> .env.local
```

---

## Verification

After adding missing variables, verify they're loaded:

```bash
# Check if variables are set
grep -E "^(SEPOLIA_RPC_URL|ENS_RESOLVER_SEPOLIA)=" .env.local

# Test in Node.js
node -e "require('dotenv').config({ path: '.env.local' }); console.log('SEPOLIA_RPC_URL:', process.env.SEPOLIA_RPC_URL ? '✅ Set' : '❌ Missing');"
```

