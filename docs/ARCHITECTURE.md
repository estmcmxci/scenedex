# Scenedex Technical Architecture (v1)

## Overview

Scenedex is a decentralized music curation protocol that enables artists to submit releases for curator approval, which are then published to IPFS, minted as Zora creator coins, registered on Basenames (ENS on Base), with revenue split via 0xSplits. All on-chain operations execute through a Safe multisig on **Base Sepolia L2**.

## System Architecture

### Technology Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL (with connection pooling)
- **Blockchain**: Base Sepolia L2 (all operations)
  - Basenames (ENS on Base) - subname registration
  - Zora Coins - ERC20 creator tokens
  - 0xSplits - revenue distribution
- **Storage**: IPFS via Storacha CLI
- **Wallet Integration**: Wagmi, RainbowKit
- **Multisig**: Safe Protocol (Gnosis Safe)

### Core Services

1. **IPFS Service** (`lib/services/ipfs.ts`) - File pinning via Storacha CLI
2. **ENS Service** (`lib/services/ens.ts`) - Basenames registration via direct Registry
3. **Zora Service** (`lib/services/zora.ts`) - ERC20 creator coin deployment
4. **Splits Service** (`lib/services/splits.ts`) - Revenue split contract creation
5. **Safe Service** (`lib/services/safe.ts`) - Curator signature verification
6. **Safe Transactions** (`lib/services/safe-transactions.ts`) - Batched transaction execution

### Standalone Utilities (`scripts/`)

Portable utility library for building independent tools:

```
scripts/
├── ens/           # ENS/Basenames utilities
├── safe/          # Safe transaction utilities
├── ipfs/          # IPFS/Storacha utilities
├── zora/          # Zora creator coin utilities
├── splits/        # 0xSplits utilities
└── index.ts       # Centralized exports
```

## End-to-End Flow

> **Visual Diagram**: See [`architecture-flow.mmd`](./architecture-flow.mmd)

### Phase 1: Submission

```
User → Submit Form → Validate → Generate Release ID → Extract Cover → Store in DB
```

1. User submits release with MP3 file
2. Server validates and generates unique ID (e.g., `ARES-timestamp-random`)
3. Cover art extracted from MP3 ID3 tags
4. Data stored in PostgreSQL:
   - `releases` table (metadata, status: pending)
   - `temp_files` table (audio BLOB, cover BLOB)
   - `temporary_submissions` table (pre-approval staging)

### Phase 2: Curator Approval

```
Curator → Sign Message → Verify Signature → Check Safe Membership → Store Approval → Check Threshold
```

1. Curator signs release ID (EIP-191 signature)
2. Server verifies signature, recovers signer address
3. Checks if signer is Safe multisig member via `getOwners()`
4. Stores approval in `approvals` table
5. When threshold met → returns `thresholdMet: true`
6. **Status remains `pending`** until contracts created

### Phase 3: Client Contract Creation

```
Curator → Click "Create Contracts" → Pin to IPFS → Build Calldata → Send via Wallet
```

1. Curator clicks "Create Contracts" button
2. `POST /api/releases/[id]/prepare-contracts`:
   - Pin audio to IPFS via Storacha
   - Pin cover art to IPFS
   - Pin metadata JSON to IPFS
   - Build Split calldata (50% Safe + 50% Creator)
   - Build Zora coin calldata
   - Return all transaction data
3. Client sends transactions via connected wallet (Safe)
4. `POST /api/releases/[id]/contracts-created`:
   - Extract addresses from transaction receipts
   - Trigger `publishReleaseViaSafe()`

### Phase 4: Safe Batch Execution

All on-chain operations execute through Safe multisig on Base Sepolia:

| # | Operation | Contract | Purpose |
|---|-----------|----------|---------|
| 1 | `Registry.setSubnodeRecord()` | ENS Registry | Creates Basename (FREE) |
| 2 | `createSplit()` | 0xSplits Factory | 50/50 revenue split |
| 3 | `deploy()` | Zora Coin Factory | ERC20 creator coin |
| 4 | `Resolver.setAddr()` + `setText() × 11` | Basenames Resolver | Address + text records |
| 5 | Update `zoraCoinAddress` | Basenames Resolver | Final text record |

### Phase 5: Finalization

1. Extract addresses from transaction logs
2. Create publication proof (pin to IPFS)
3. Update `releases` table with all hashes + addresses
4. Set `status: published`
5. Delete `temp_files` (cleanup BLOBs)

## Component Details

### 1. Frontend Components

#### Submission Flow
- **`app/page.tsx`** - Landing page
- **`app/submit/page.tsx`** - Release submission form
- **`app/components/release-card.tsx`** - Release display cards
- **`app/components/status-badge.tsx`** - Status indicators

#### Curator Dashboard
- **`app/curator/dashboard/page.tsx`** - Curator approval interface
- **`app/components/dashboard-content.tsx`** - Dashboard logic + "Create Contracts" flow
- **`app/components/publishing-modal.tsx`** - Step-by-step publishing UI

#### Release Discovery
- **`app/releases/page.tsx`** - Published releases listing
- **`app/releases/[ensName]/page.tsx`** - Individual release by Basename

### 2. API Routes

#### `/api/submit` (POST)
- Accepts FormData: title, description, artists, mediaFile
- Validates input against Zod schema
- Generates unique release ID
- Extracts cover art from MP3
- Stores in database with `status: 'pending'`

#### `/api/approve` (POST)
- Accepts `releaseId` and `signature` (EIP-191)
- Verifies signature, recovers curator address
- Checks Safe membership via on-chain `getOwners()`
- Stores approval in database
- **Does NOT change status** when threshold met (waits for contract creation)

#### `/api/releases/[id]/prepare-contracts` (POST)
- Loads release and temp files from database
- Pins audio, cover, metadata to IPFS
- Builds Split + Zora calldata
- Returns transaction data for client execution

#### `/api/releases/[id]/contracts-created` (POST)
- Receives transaction hashes/receipts
- Extracts Split and Zora addresses from logs
- Triggers `publishReleaseViaSafe()` for Basename registration

#### `/api/releases/[id]/publish` (POST)
- Final status update to `published`
- Cleanup temp files

### 3. Database Schema

#### `releases`
```sql
id, title, description, artists, status,
mediaIPFSHash, coverImageIPFSHash, metadataIPFSHash,
ensSubname, zoraCoinAddress, zoraCoinSymbol, splitAddress,
createdBy, createdAt, approvedAt, publishedAt, multisigAddress
```

#### `temp_files`
```sql
id, releaseId, fileType, data (BYTEA), createdAt, expiresAt
```

#### `approvals`
```sql
id, releaseId, signerAddress, signature, timestamp
```

#### `curator_settings`
```sql
safeAddress, approvalThreshold
```

### 4. Service Layer

#### IPFS Service (`lib/services/ipfs.ts`)
- `pinToIPFS(filePath)` - Pin file with retry logic
- `pinBufferToIPFS(buffer, filename, releaseId)` - Pin Buffer
- Features: Exponential backoff, transient error detection

#### ENS Service (`lib/services/ens.ts`)
- `getNextEROSNumber()` - Find next available ARES number
- `getENSCompleteCalldata()` - Build all ENS calldata
- `getReverseRecordCalldata()` - Build reverse record calldata
- Uses **direct Registry.setSubnodeRecord()** (FREE, bypasses RegistrarController)

#### Zora Service (`lib/services/zora.ts`)
- `getZoraCoinCalldata()` - Build coin creation calldata
- `extractZoraCoinAddressFromLogs()` - Parse deployment logs
- Factory: `0x777777751622c0d3258f214F9DF38E35BF45baF3`

#### Splits Service (`lib/services/splits.ts`)
- `getSplitCalldata()` - Build split creation calldata
- `extractSplitAddressFromLogs()` - Parse deployment logs
- 50% Safe + 50% Creator, 1% distributor fee, Push type

#### Safe Transactions (`lib/services/safe-transactions.ts`)
- `executeSimpleSafeTransaction()` - Execute batched transactions
- `createSafeTransaction()` - Create transaction object
- Handles gas estimation, signature validation, ExecutionFailure detection

### 5. Basename Text Records

Each release stores 11+ text records:

| Key | Value |
|-----|-------|
| `avatar` | Cover art IPFS URI |
| `description` | Release description |
| `eth.scenedex.releaseId` | ARES number (e.g., ARES001) |
| `eth.scenedex.artists` | Artist names |
| `eth.scenedex.mediaIPFS` | Audio IPFS hash |
| `eth.scenedex.metadataURI` | Metadata JSON IPFS URI |
| `eth.scenedex.zoraCoinAddress` | Zora coin contract |
| `eth.scenedex.zoraCoinSymbol` | Coin symbol (e.g., ARES001) |
| `eth.scenedex.splitAddress` | Split contract address |
| `eth.scenedex.creator` | Creator wallet address |
| `eth.scenedex.publisher` | Safe multisig address |

## Contract Addresses (Base Sepolia)

| Contract | Address |
|----------|---------|
| ENS Registry | `0x1493b2567056c2181630115660963E13A8E32735` |
| Basenames Resolver | `0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA` |
| Reverse Registrar | `0xa0a1AbcDAe1a2a4A2EF8e9113Ff0e02DD81DC0C6` |
| Zora Coin Factory | `0x777777751622c0d3258f214F9DF38E35BF45baF3` |
| 0xSplits Factory | `0x8e8eb0cc6ae34a38b67d5cf91aca38f60bc3ecf4` |

## Security & Validation

### Signature Verification
- EIP-191 standard message signing
- Message: Release ID (unique, prevents replay)
- Recovery: `ethers.verifyMessage()`

### Safe Membership
- On-chain verification via `getOwners()`
- No database trust required
- Curator must be in Safe owner list

### Input Validation
- Zod schemas for all API inputs
- File type validation (audio only)
- File size limits (50MB max)
- Wallet address format validation

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://...

# Blockchain
BASE_RPC_URL=https://sepolia.base.org
CURATOR_PRIVATE_KEY=0x...

# Safe
SAFE_ADDRESS=0x...
CURATOR_SAFE_ADDRESS=0x...
SAFE_API_KEY=...

# ENS/Basenames
ENS_DOMAIN=scenius.basetest.eth
ENS_SUBNAME_PREFIX=ARES
BASENAMES_UPGRADEABLE_RESOLVER_BASE_SEPOLIA=0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA
BASENAMES_REVERSE_REGISTRAR_BASE_SEPOLIA=0xa0a1AbcDAe1a2a4A2EF8e9113Ff0e02DD81DC0C6

# Zora
ZORA_COIN_FACTORY_ADDRESS=0x777777751622c0d3258f214F9DF38E35BF45baF3

# Frontend
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SCENEDEX v1 FLOW                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PHASE 1: SUBMISSION                                                │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐     │
│  │  Artist  │───▶│  Submit  │───▶│ Validate │───▶│   Store  │     │
│  │  Uploads │    │   Form   │    │  + Parse │    │   in DB  │     │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘     │
│                                                                     │
│  PHASE 2: APPROVAL                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐     │
│  │ Curator  │───▶│   Sign   │───▶│  Verify  │───▶│  Store   │     │
│  │ Reviews  │    │ Release  │    │   Safe   │    │ Approval │     │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘     │
│                                                                     │
│  PHASE 3: CONTRACT CREATION (Client-Side)                          │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐     │
│  │  Click   │───▶│  Pin to  │───▶│  Build   │───▶│  Send    │     │
│  │ "Create" │    │   IPFS   │    │ Calldata │    │  via     │     │
│  └──────────┘    └──────────┘    └──────────┘    │  Wallet  │     │
│                                                   └──────────┘     │
│                                                                     │
│  PHASE 4: SAFE BATCH EXECUTION (Base Sepolia)                      │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                     SAFE MULTISIG                            │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │  │
│  │  │ Create  │  │ Create  │  │ Create  │  │ Set Basename    │ │  │
│  │  │Basename │  │  Split  │  │  Coin   │  │ Text Records    │ │  │
│  │  └────┬────┘  └────┬────┘  └────┬────┘  └────────┬────────┘ │  │
│  │       │            │            │                 │          │  │
│  │       ▼            ▼            ▼                 ▼          │  │
│  │   Registry    0xSplits      Zora          Resolver          │  │
│  │                Factory      Factory                         │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  PHASE 5: FINALIZATION                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐     │
│  │ Extract  │───▶│  Update  │───▶│  Status  │───▶│ Cleanup  │     │
│  │Addresses │    │    DB    │    │Published │    │  Temps   │     │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Key Design Decisions

### 1. All Operations on Base Sepolia L2
- Lower gas costs
- Faster confirmations (~2s blocks)
- Basenames (ENS on Base) for subname registration

### 2. Direct Registry Flow (FREE)
- Bypasses RegistrarController (no payment required)
- Uses `Registry.setSubnodeRecord()` directly
- Requires Safe to own/operate the parent domain (`scenius.basetest.eth`)

### 3. Client-Side Contract Creation
- Curator initiates from frontend
- Better UX than background job queue
- Real-time progress feedback via PublishingModal

### 4. Safe Multisig for All On-Chain Operations
- Curator governance via Safe
- 1-of-1 Safe for fast execution (can be changed to N-of-M)
- All transactions batched when possible

### 5. IPFS via Storacha
- CLI-based pinning (reliable)
- Retry logic with exponential backoff
- Sequential uploads to avoid conflicts

## Future Enhancements

1. **Batch ENS Operations**: Combine all text record updates into single multicall
2. **NFT Minting**: Add ERC721 minting alongside Zora coins
3. **Multi-chain**: Deploy to Base mainnet and other L2s
4. **Indexing**: The Graph subgraph for event indexing
5. **Caching**: Redis for ENS query caching
6. **Monitoring**: Sentry for errors, DataDog for metrics

## Testing

```bash
npm run test              # Unit tests
npm run test:validation   # Validation tests
npm run test:safe         # Safe tests
npm run test:approve-e2e  # E2E approval tests
```
