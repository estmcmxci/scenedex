# 🌟 FULL VISION ARCHITECTURE
## Catalogue Protocol v1.0 — Multi-Tenant ENS Registrar with Zora Integration

**Document Status:** Blueprint (Post-MVP Expansion)  
**Created:** November 16, 2025  
**Scope:** Complete system vision and implementation roadmap  

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Current State: MVP/Beta](#current-state-mvpbeta)
3. [Full Vision Overview](#full-vision-overview)
4. [Architecture Layers](#architecture-layers)
5. [Data Model & Type System](#data-model--type-system)
6. [End-to-End Flows](#end-to-end-flows)
7. [Implementation Roadmap](#implementation-roadmap)
8. [Contracts Architecture](#contracts-architecture)
9. [Frontend Structure](#frontend-structure)
10. [Backwards Compatibility](#backwards-compatibility)

---

## EXECUTIVE SUMMARY

### The Vision in One Sentence

**Catalogue is a decentralized, multi-tenant ENS registrar protocol:** The protocol provisions curator boards as hierarchical ENS subnames under a primary ENS (e.g., `app.eth`), boards approve releases that mint as Zora NFTs on Base L2, and each release is indexed as a nested ENS subname with immutable IPFS content.

### MVP vs. Full Vision

| Aspect | MVP/Beta | Full Vision |
|--------|----------|-------------|
| **Tenancy** | Single platform (Catalogue) | Multi-tenant (N curator boards) |
| **ENS Hierarchy** | `pda-001.palaupalau.eth` | `pda-001.boardA.app.eth` |
| **Governance** | One shared Safe | Per-board Safe + Protocol DAO |
| **Revenue** | Splits: Safe 50% + Submitter 50% (MVP) | Board registration fees + protocol bps |
| **Protocol Fees** | Optional platformReferrer (future) | platformReferrer earns Zora trading fees |
| **Curator Onboarding** | Manual Safe setup (MVP) | Custom Safe deployment UI in Catalogue |
| **Scaling** | Monolithic | Registrar-driven, composable |
| **Use Cases** | Music releases | Music, art, media, any on-chain content |

---

## CURRENT STATE: MVP/BETA

### What We're Building Now (Weeks 1-5)

```
┌─────────────────────────────────────────────────────────────────────┐
│                      CATALOGUE MVP (Single Platform)                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Protocol Layer (Implicit)                                         │
│  ├─ One DAO Treasury Safe (Ethereum L1)                           │
│  ├─ Primary ENS: palaupalau.eth (owned by Treasury)               │
│  └─ (No Registrar contract yet)                                    │
│                                                                     │
│  Board Layer (Hardcoded)                                           │
│  ├─ One Curator Safe (Ethereum L1)                                │
│  ├─ Board Config stored in database                               │
│  └─ No multi-board support                                         │
│                                                                     │
│  Release Publishing Pipeline                                       │
│  ├─ User submits audio → temp storage                             │
│  ├─ Curators approve via Safe → auto-execute                      │
│  ├─ Backend: IPFS pin (Storacha) → Zora mint (Base) → ENS subname│
│  └─ Release: pda-001.palaupalau.eth → IPFS/Zora                  │
│                                                                     │
│  Frontend                                                           │
│  ├─ ReleaseForm (submit)                                           │
│  ├─ CuratorDashboard (approve)                                     │
│  ├─ ReleaseDisplay (view)                                          │
│  └─ Explorer (discover)                                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### MVP Database Schema

```sql
-- Current tables (no board scoping)
CREATE TABLE releases (
  id VARCHAR PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  artists VARCHAR,
  createdBy VARCHAR NOT NULL,
  status VARCHAR(50),  -- pending, approved, published
  mediaIPFSHash VARCHAR,
  metadataURI VARCHAR,
  zoraNFT VARCHAR,
  tokenId VARCHAR,
  ensSubname VARCHAR,
  approvalThreshold INT,
  approvalRequirementsMet BOOL,
  approvedAt TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE approvals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  releaseId VARCHAR FOREIGN KEY,
  signer VARCHAR,
  signature VARCHAR,
  timestamp TIMESTAMP
);

CREATE TABLE curators (
  address VARCHAR PRIMARY KEY,
  name VARCHAR,
  joinedAt TIMESTAMP,
  isActive BOOL
);
```

**Missing for Multi-Tenancy:**
- ❌ No `boards` table
- ❌ No `board_configs` table
- ❌ No `registrar_config` table
- ❌ No board-scoped foreign keys

### MVP Roadmap (Weeks 1-5)

```
Week 1: Backend setup + database
Week 2: IPFS/Storacha + Factory contract
Week 3: Zora minting + ENS subnames
Week 4: Multisig Safe integration
Week 5: Indexing + End-to-end testing
```

**Result:** Fully functional single-platform release publishing system.

---

## FULL VISION OVERVIEW

### What We're Building Post-MVP

```
┌─────────────────────────────────────────────────────────────────────────────┐
│               CATALOGUE PROTOCOL (Multi-Tenant Registrar)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  TIER 1: Protocol / Treasury Layer (L1)                                      │
│  ├─ DAO Treasury Safe (governance + fee sink)                              │
│  ├─ Primary ENS: app.eth (owned by Treasury Safe)                           │
│  └─ Registrar Contract (board registration, fees, config storage)          │
│                                                                               │
│  TIER 2: Board / Tenant Layer (L1 config + L2 pointer)                      │
│  ├─ Board A                                                                  │
│  │  ├─ Board Subname: boardA.app.eth                                       │
│  │  ├─ Board Safe (2-of-3 curator signatures)                              │
│  │  ├─ Board Config: {safe, feeBps, baseCreator}                           │
│  │  └─ Releases: pda-001.boardA.app.eth, pda-002.boardA.app.eth          │
│  │                                                                           │
│  ├─ Board B                                                                  │
│  │  ├─ Board Subname: boardB.app.eth                                       │
│  │  ├─ Board Safe (3-of-5 curator signatures)                              │
│  │  ├─ Board Config: {...}                                                 │
│  │  └─ Releases: pda-001.boardB.app.eth, ...                             │
│  │                                                                           │
│  └─ ... (N boards)                                                           │
│                                                                               │
│  TIER 3: Release / Content Layer (L1 naming + L2 NFTs)                      │
│  ├─ Each board release:                                                      │
│  │  ├─ ENS Subname: pda-XXX.boardX.app.eth (L1)                           │
│  │  ├─ Zora NFT: Base L2 minted with board's baseCreator                   │
│  │  ├─ IPFS Content: audio + cover + metadata (Storacha)                  │
│  │  └─ Splits: board Safe + protocol Treasury                               │
│  │                                                                           │
│  └─ Hierarchy: app.eth → boardA.app.eth → pda-001.boardA.app.eth          │
│                                                                               │
│  TIER 4: State & Indexing Layer (PostgreSQL + The Graph)                   │
│  ├─ Database: boards, board_configs, releases, approvals, accounts        │
│  ├─ Indexer: Listens to Registrar + Zora events on L1 + Base             │
│  └─ Purpose: Fast queries, audit, replay; onchain is canonical            │
│                                                                               │
│  TIER 5: Frontend Layer (Next.js Multi-Tenant Portal)                       │
│  ├─ Registrar Portal: Apply for board → pay fee → mint subname            │
│  ├─ Board Workspace (per board): Manage curators, approve releases        │
│  ├─ Release Form (per board): Submit media for approval                    │
│  ├─ Multi-Board Explorer: Discover across all boards                       │
│  └─ ENS Resolution: pda-001.boardA.app.eth → IPFS + Zora                 │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Naming Hierarchy (Full Vision)

```
app.eth                           ← Protocol (DAO/Treasury)
├── boardA.app.eth                ← Board (Curator Safe A)
│   ├── pda-001.boardA.app.eth     ← Release 1 (NFT + IPFS)
│   ├── pda-002.boardA.app.eth     ← Release 2
│   └── ...
│
├── boardB.app.eth                ← Board (Curator Safe B)
│   ├── pda-001.boardB.app.eth     ← Release 1 (Different board)
│   ├── pda-002.boardB.app.eth     ← Release 2
│   └── ...
│
├── boardC.app.eth                ← Board (Curator Safe C)
│   └── ... (releases)
│
└── ... (N boards)
```

---

## ARCHITECTURE LAYERS

### A) PROTOCOL / GATEWAY LAYER (Ethereum L1)

**Purpose:** Govern board creation, fee routing, and protocol-level configuration.

#### Components

**1. DAO Treasury Safe**
- Multi-sig wallet owned by DAO members
- Receives board registration fees
- Receives protocol bps (basis points) from Zora sales
- Governance decisions: protocol fee rates, treasury management

**2. Primary ENS (app.eth)**
- Owned by Treasury Safe
- Points to protocol metadata/homepage
- Acts as parent namespace for all boards

**3. Registrar Contract** (NEW)
- Deployed on Ethereum L1 (Mainnet)
- Core responsibilities:
  - Accept board applications (curator addresses + fee)
  - Mint board subnames (e.g., `boardA.app.eth`)
  - Store board configuration (Safe, feeBps, baseCreator)
  - Route fees to Treasury Safe
  - Emit events for indexing

#### Registrar Contract Interface

```solidity
pragma solidity ^0.8.20;

interface IRegistrar {
    // Events
    event BoardRegistered(
        bytes32 indexed boardNode,
        address indexed boardSafe,
        uint256 feeBps,
        address baseCreator,
        address owner
    );

    event BoardConfigUpdated(
        bytes32 indexed boardNode,
        address indexed boardSafe,
        uint256 feeBps,
        address baseCreator
    );

    // Core functions
    function registerBoard(
        string memory boardLabel,         // e.g., "boardA"
        address boardSafe,                // Curator Safe address
        uint256 feeBps,                   // Protocol take (e.g., 500 = 5%)
        address baseCreator               // Zora creator on Base L2
    ) external payable returns (bytes32 boardNode);

    function getBoardConfig(bytes32 boardNode) 
        external view returns (
            address boardSafe,
            uint256 feeBps,
            address baseCreator,
            address owner,
            uint256 registeredAt
        );

    function updateBoardConfig(
        bytes32 boardNode,
        address newSafe,
        uint256 newFeeBps,
        address newBaseCreator
    ) external;

    // Fee management
    function registrationFee() external view returns (uint256);
    function withdrawFees() external;
}
```

#### Registrar Workflow

```
1. Curator(s) call registerBoard()
   ├─ Provide: boardLabel, Safe address, feeBps, baseCreator
   ├─ Pay: registrationFee (e.g., 0.5 ETH)
   └─ Fee routes to Treasury Safe

2. Registrar mints ENS subname
   ├─ Creates: boardA.app.eth
   ├─ Owner: Registrar (initially)
   └─ Stores config in contract

3. Emit BoardRegistered event
   └─ Indexer captures → DB stores

4. Resolver records set
   ├─ text("boardSafe") = 0xBoardSafeAddress
   ├─ text("baseCreator") = 0xBaseCreatorOnBase
   └─ (Optional) contenthash for board homepage
```

---

### B) BOARD / TENANT LAYER (L1 Config + L2 Pointer)

**Purpose:** Each board operates independently with its own governance Safe and creator configuration.

#### Components Per Board

**1. Board Safe (L1)**
- Multi-sig wallet controlled by curator(s)
- Threshold signer set (e.g., 2-of-3, 3-of-5)
- Authorizes release approvals for that board
- Executes ENS/metadata updates for board releases

**2. Board ENS Records (L1)**
- Board Subname: `boardA.app.eth` (points to resolver)
- Text records:
  - `"boardSafe"` → `0xBoardSafeAddress`
  - `"baseCreator"` → `base:0xZoraCreatorOnBase`
  - `"boardName"` → "Board A Description"
  - (Optional) `"contenthash"` → IPFS manifest of board

**3. Board Config (Database)**
- Stored in PostgreSQL `board_configs` table
- Contains: Safe address, feeBps, baseCreator, owner, status
- Synced with onchain Registrar contract

#### Board Management Flow

```
STEP 1: Board Onboarding (One-Time)
├─ Curators register via POST /api/registrar/apply-board
├─ Payment: boardRegistrationFee
├─ Registrar mints: boardA.app.eth
└─ Database stores: board_configs entry

STEP 2: Board Members Added
├─ Board Safe already has members (set external)
├─ Backend verifies via Safe contract: getOwners()
└─ Database syncs curator list

STEP 3: Release Submissions Begin
├─ Contributors submit to POST /api/board/{boardId}/releases
├─ Releases scoped to that board
└─ Approval threshold from board_configs
```

---

### C) EXECUTION / PUBLISHING LAYER (Base + IPFS)

**Purpose:** Orchestrate content storage and NFT minting.

#### Zora Integration (Base L2)

**Board's Zora Creator Address (baseCreator)**
- Per-board, stored in Registrar + board_configs
- Could be:
  - A Zora Creator contract on Base
  - An EOA (if using Zora's minting service)
  - A split contract for revenue distribution
- **Revenue Split:** Board Safe + Protocol Treasury (feeBps)

#### IPFS / Storacha Integration

**Flow per Release:**

```
1. Curator approves release
   ├─ Approval threshold met
   └─ Trigger backend publish job

2. Backend uploads to IPFS (Storacha)
   ├─ Pin media (audio/video/art)
   ├─ Pin cover image
   └─ Build ERC-721 metadata JSON with IPFS references

3. Storacha pins with 12+ month guarantee
   ├─ Returns CIDs
   ├─ mediaIPFSHash
   ├─ coverIPFSHash
   └─ metadataIPFSHash

4. Store CIDs in database
   └─ releases table: mediaIPFSHash, metadataURI, etc.
```

#### Release Publishing Pipeline

```
STEP 3A: IPFS Pinning
├─ Input: releaseId, mediaBuffer, coverImage, metadata
├─ Output: mediaIPFSHash, coverIPFSHash, metadataIPFSHash
└─ Storacha pins with 12-month expiration

STEP 3B: Zora Mint (Base L2)
├─ Input: metadataIPFSHash, boardId (→ baseCreator)
├─ Call Zora via board's baseCreator
├─ Mint NFT with metadata URI
├─ Configure splits: Board Safe + Protocol Treasury
└─ Output: tokenId

STEP 3C: Nested Subname Creation (L1)
├─ Create: pda-XXX.boardX.app.eth
├─ Set contenthash → ipfs://metadataIPFSHash
├─ Set text records:
│  ├─ "zoraNFT" → "base:0xZoraCreator/tokenId"
│  └─ "metadataURI" → "ipfs://metadataIPFSHash"
└─ Safe multisig executes these as batch TX

STEP 3D: Database Update
├─ Update release: status = 'published'
├─ Store: tokenId, zoraNFT, ensSubname, IPFS hashes
└─ Emit: ReleaseAdded event (for indexer)
```

---

### D) STATE & INDEXING LAYER

**Purpose:** Fast queries, audit logs, and on-chain event synchronization.

#### PostgreSQL Schema (Enhanced for Multi-Tenancy)

```sql
-- NEW: Boards table
CREATE TABLE boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_label VARCHAR(50) NOT NULL,  -- "boardA"
  board_node VARCHAR(66) NOT NULL,   -- Namehash of boardX.app.eth
  board_subname VARCHAR(255) NOT NULL,  -- "boardA.app.eth"
  board_safe VARCHAR(42) NOT NULL,   -- 0x...
  base_creator VARCHAR(42) NOT NULL, -- 0x... on Base
  protocol_fee_bps INT NOT NULL,     -- e.g., 500 (5%)
  owner_address VARCHAR(42) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',  -- active, inactive, dispute
  registered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(board_label),
  INDEX(board_node)
);

-- NEW: Board configs table (for additional settings)
CREATE TABLE board_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES boards(id),
  curator_threshold INT NOT NULL,  -- 2 (for 2-of-3)
  curator_count INT NOT NULL,      -- 3
  revenue_split_percent INT,       -- Optional: board's share of sales
  metadata JSONB,                  -- Additional board metadata
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- MODIFIED: Releases table (now board-scoped)
CREATE TABLE releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES boards(id),  -- ← NEW: Board foreign key
  release_label VARCHAR(50) NOT NULL,  -- "pda-001"
  full_name VARCHAR(255) NOT NULL,  -- "pda-001.boardA.app.eth"
  title VARCHAR NOT NULL,
  description TEXT,
  artists TEXT[],
  created_by VARCHAR(42) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',  -- pending, approved, published
  media_ipfs_hash VARCHAR(255),
  cover_ipfs_hash VARCHAR(255),
  metadata_uri VARCHAR(255),
  zora_nft VARCHAR(255),  -- "base:0x.../tokenId"
  token_id VARCHAR(255),
  ens_subname VARCHAR(255),
  ens_node VARCHAR(66),   -- Namehash of full subname
  approval_threshold INT,
  approval_requirements_met BOOL DEFAULT FALSE,
  approved_at TIMESTAMP,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  INDEX(board_id),
  INDEX(status),
  INDEX(created_by),
  UNIQUE(board_id, release_label)
);

-- MODIFIED: Approvals table (now board-scoped)
CREATE TABLE approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id UUID NOT NULL REFERENCES releases(id),
  board_id UUID NOT NULL REFERENCES boards(id),  -- ← NEW: Board foreign key
  signer VARCHAR(42) NOT NULL,
  signature VARCHAR(255),
  timestamp TIMESTAMP,
  INDEX(release_id),
  INDEX(board_id),
  UNIQUE(release_id, signer)
);

-- NEW: Curators table (many-to-many: boards + curators)
CREATE TABLE board_curators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES boards(id),
  curator_address VARCHAR(42) NOT NULL,
  curator_name VARCHAR(255),
  joined_at TIMESTAMP,
  is_active BOOL DEFAULT TRUE,
  INDEX(board_id),
  INDEX(curator_address),
  UNIQUE(board_id, curator_address)
);

-- NEW: Events audit log
CREATE TABLE events_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100),  -- "BoardRegistered", "ReleaseAdded", etc.
  event_data JSONB,
  emitted_at TIMESTAMP,
  block_number BIGINT,
  tx_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(event_type),
  INDEX(emitted_at)
);
```

#### The Graph / Indexer

**Purpose:** Listen to on-chain events and sync to database.

**Events to Index:**

| Event | Source | Data |
|-------|--------|------|
| `BoardRegistered` | L1 Registrar | boardNode, safe, feeBps, creator |
| `ReleaseAdded` | L1 Registrar Helper / Factory | boardNode, releaseNode, tokenId, metadataURI |
| `ZoraMinted` | Base L2 Zora | to, tokenId, amount, metadata |
| `ApprovalThresholdMet` | L1 Factory | releaseId, approvals |

**Indexer Flow:**

```
On-Chain Event (L1/Base)
    ↓
The Graph Subgraph
    ├─ Listens to event
    ├─ Indexes into GraphQL
    └─ Emits webhook or triggers job
    ↓
Backend Job Queue
    ├─ Receives event data
    ├─ Syncs to PostgreSQL
    └─ Updates denormalized tables
    ↓
API / Frontend
    ├─ Queries PostgreSQL (fast)
    ├─ Fallback: ENS/Zora direct resolution
    └─ Renders multi-board catalog
```

---

### E) FRONTEND LAYER (Next.js Multi-Tenant Portal)

**Purpose:** Multi-board UX for board registration, content submission, and discovery.

#### New Pages / Components

**1. Registrar Portal** (`/registrar` or root)
- Board application form
- Payment integration (accept registration fee)
- Safe address capture (paste or Safe UI link)
- Fee calculator + confirmation
- Success: Board created, receive subname + Safe link

**2. Board Workspace** (`/board/[boardId]`)
- Board details & settings (curator list, fee split, baseCreator)
- Curator management (invite, remove, threshold settings)
- Release approval dashboard (Safe-gated)
- Analytics: total releases, revenue, etc.

**3. Release Submission Form** (`/board/[boardId]/submit`)
- Scoped to board
- Submit: title, artists, media file, cover, description
- Auto-detect board Safe from board_configs
- Displays fee split breakdown

**4. Multi-Board Explorer** (`/explore` or `/catalog`)
- Browse all boards on protocol
- Filter by curator, release date, etc.
- Search: release name, artist, board name
- ENS resolution integration

**5. Release Detail** (`/release/[boardId]/[releaseLabel]`)
- Show: IPFS audio, cover, metadata
- Link to Zora NFT on Base
- Link to ENS subname
- Share / embed

#### API Routes (Multi-Tenant)

```typescript
// Registrar
POST /api/registrar/apply-board          // Create board
GET /api/registrar/config                // Protocol fees, settings

// Board-scoped
GET /api/board/{boardId}                 // Get board details
GET /api/board/{boardId}/releases        // List releases for board
POST /api/board/{boardId}/releases       // Submit release to board
POST /api/board/{boardId}/approve        // Curator approval (Safe-gated)
GET /api/board/{boardId}/curators        // List board curators

// Multi-board
GET /api/boards                          // List all boards
GET /api/releases                        // Cross-board releases
GET /api/explorer                        // Browse all content

// Resolution
GET /api/resolve/{ensName}               // Resolve subname → release
GET /api/release/{releaseId}             // Get release by ID
```

---

## DATA MODEL & TYPE SYSTEM

### TypeScript Types (Enhanced for Multi-Tenancy)

```typescript
// Board types
interface Board {
  id: string;  // UUID
  boardLabel: string;  // "boardA"
  boardSubname: string;  // "boardA.app.eth"
  boardSafe: Address;
  baseCreator: Address;  // Zora creator on Base
  protocolFeeBps: number;  // e.g., 500
  owner: Address;
  status: 'active' | 'inactive' | 'dispute';
  registeredAt: number;  // Timestamp
  curatorThreshold: number;
  curatorCount: number;
}

interface BoardConfig {
  boardId: string;
  curatorThreshold: number;
  curatorCount: number;
  revenueSplitPercent?: number;
  metadata?: Record<string, any>;
}

// Release types (board-scoped)
interface Release {
  id: string;
  boardId: string;  // ← NEW: Links to board
  releaseLabel: string;  // "pda-001"
  fullName: string;  // "pda-001.boardA.app.eth"
  title: string;
  description: string;
  artists: string[];
  createdBy: Address;
  status: 'pending' | 'approved' | 'published';
  
  // IPFS references
  mediaIPFSHash: string;
  coverIPFSHash: string;
  metadataURI: string;
  
  // Zora reference
  zoraNFT: string;  // "base:0xCreator/tokenId"
  tokenId: string;
  
  // ENS reference
  ensSubname: string;  // "pda-001.boardA.app.eth"
  ensNode: string;  // Namehash
  
  // Approval tracking
  approvalThreshold: number;
  approalRequirementsMet: boolean;
  approvals: Approval[];
  approvedAt?: number;
  publishedAt?: number;
}

interface Approval {
  id: string;
  releaseId: string;
  boardId: string;  // ← NEW: Scoped to board
  signer: Address;
  signature: Hex;
  timestamp: number;
}

// ENS metadata structure
interface ReleaseENSMetadata {
  image: string;  // IPFS image CID
  animation_url: string;  // IPFS audio CID
  content: {
    mime: string;
    uri: string;  // IPFS media CID
  };
  properties: {
    catalogueId: string;
    boardId: string;  // ← NEW
    boardName: string;  // ← NEW
    submittedBy: Address;
    duration: number;
    artists: string[];
    approvals: string[];  // Curator signer list
  };
}
```

---

## END-TO-END FLOWS

### Flow 1: Protocol Bootstrap (One-Time)

```
Day 0: Protocol Admin
├─ Deploy DAO Treasury Safe (L1 Mainnet)
├─ Acquire primary ENS: app.eth (via ENS registrar)
├─ Transfer ENS ownership to Treasury Safe
├─ Deploy Registrar contract (L1)
├─ Set Registrar as authorized subname creator
├─ Configure protocol settings (fee, gateway URL, etc.)
└─ (Registrar now ready to mint board subnames)
```

### Flow 2: Board Onboarding

```
Day N: Curators want to create "Music Board A"
│
├─ (External) Deploy Safe multisig
│  ├─ Add 3 curator addresses
│  ├─ Set threshold: 2-of-3
│  └─ Save Safe address: 0xBoardASafe
│
├─ (Frontend) Curators visit /registrar
│  ├─ Enter: boardLabel ("musicBoardA")
│  ├─ Paste Safe address (0xBoardASafe)
│  ├─ Enter: feeBps (500 = 5% protocol take)
│  ├─ Specify baseCreator (Zora creator on Base)
│  ├─ Review fee amount
│  └─ Submit application
│
├─ (Backend) POST /api/registrar/apply-board
│  ├─ Validate inputs
│  ├─ Accept payment (registrationFee)
│  ├─ Call Registrar.registerBoard() on L1
│  ├─ Registrar mints: musicBoardA.app.eth
│  └─ Emit BoardRegistered event
│
├─ (Indexer) Captures event
│  ├─ Syncs to PostgreSQL: boards table
│  └─ Updates board_configs, board_curators
│
└─ (Frontend) Success page
   ├─ Display: musicBoardA.app.eth
   ├─ Board workspace link
   └─ Invite curators link
```

### Flow 3: Release Publishing (Per Board)

```
Day M: Contributor submits to "Music Board A"
│
├─ STEP 1: Submission
│  ├─ Visit: /board/musicBoardA/submit
│  ├─ Upload: audio file, cover image, metadata
│  ├─ System: Stores temp files, creates pending release
│  └─ Status: "pending" (awaiting approval)
│
├─ STEP 2: Curator Approval (Board Safe)
│  ├─ Curator 1 visits: /board/musicBoardA/approve
│  ├─ Sees pending release (pda-001)
│  ├─ Connects wallet (MetaMask)
│  ├─ Signs approval message via Safe UI
│  ├─ Signature submitted to POST /api/board/musicBoardA/approve
│  └─ Backend records approval in DB
│
│  ├─ Curator 2 repeats
│  ├─ Backend checks: approvals >= threshold (2)
│  └─ Threshold met! → Trigger auto-publish job
│
├─ STEP 3A: IPFS Pinning (Auto)
│  ├─ Backend job loads temp files
│  ├─ Storacha pins: audio → mediaIPFSHash
│  ├─ Storacha pins: cover → coverIPFSHash
│  ├─ Builds ERC-721 metadata JSON
│  ├─ Storacha pins: metadata → metadataIPFSHash
│  └─ Store CIDs in DB
│
├─ STEP 3B: Zora Mint (Base L2)
│  ├─ Backend calls Zora via board's baseCreator
│  ├─ Zora mints NFT: 1/1, metadata = metadataIPFSHash
│  ├─ Returns: tokenId
│  └─ Store tokenId in DB: release.zoraNFT = "base:0xCreator/123"
│
├─ STEP 3C: ENS Subname + Metadata (L1)
│  ├─ Create: pda-001.musicBoardA.app.eth
│  ├─ Set: contenthash = ipfs://metadataIPFSHash
│  ├─ Set: text("zoraNFT") = "base:0xCreator/123"
│  ├─ Batch as Safe TX (sent to board Safe for signing)
│  └─ Once safe threshold met → TX executes on L1
│
├─ STEP 3D: Database + Events
│  ├─ Update: release.status = "published"
│  ├─ Update: ensSubname, tokenId, IPFS hashes
│  ├─ Emit: ReleaseAdded event
│  └─ Indexer captures → cross-checks Zora + ENS
│
└─ (Frontend) Release Live
   ├─ Discoverable at: /release/musicBoardA/pda-001
   ├─ ENS resolves: pda-001.musicBoardA.app.eth
   ├─ Zora link: Base L2 NFT
   ├─ IPFS playback: audio + cover
   └─ Shared across all boards
```

### Flow 4: Multi-Board Discovery

```
User visits: /explore
│
├─ (Frontend) Renders catalog
│  ├─ Fetches: GET /api/boards → All boards
│  ├─ Fetches: GET /api/releases → Cross-board releases
│  ├─ Displays: Board cards + release cards
│  └─ Search/filter by: board, artist, date, etc.
│
├─ User clicks: "Music Board A"
│  └─ Routes to: /board/musicBoardA
│
├─ User clicks: release card
│  └─ Routes to: /release/musicBoardA/pda-001
│
└─ (Frontend) Renders release detail
   ├─ Fetches: GET /api/release/pda-001
   ├─ Resolves ENS: pda-001.musicBoardA.app.eth
   ├─ Displays: IPFS audio + cover
   ├─ Links: Zora NFT on Base
   └─ Shows: Curator signatures, board info
```

---

## IMPLEMENTATION ROADMAP

### Phase 1: MVP / Beta (Weeks 1-5) — CURRENT

**Deliverable:** Single-platform release publishing system.

```
Week 1: Backend + Database
├─ PostgreSQL schema (current, no multi-board)
├─ CRUD operations
└─ Database migrations

Week 2: IPFS + Factory
├─ Storacha integration
├─ Factory contract (L1)
└─ Backend services

Week 3: Zora + ENS
├─ Zora minting (Base)
├─ ENS subname registration
└─ Event emission

Week 4: Multisig + Safe
├─ Safe SDK integration
├─ Signature verification
└─ Approval flow

Week 5: Indexing + E2E
├─ Graph subgraph (or listener)
├─ End-to-end testing
└─ Production readiness
```

**Result:** `palaupalau.eth → pda-001.palaupalau.eth` (one board, works end-to-end)

---

### Phase 2: Registrar + Multi-Tenancy (Weeks 6-10) — POST-MVP

**Dependencies:** Completed MVP.

#### Week 6: Registrar Contract + Board Schema

```
Day 1-2: Design Registrar contract
├─ Functions: registerBoard(), getBoardConfig(), updateBoardConfig()
├─ Events: BoardRegistered, BoardConfigUpdated
└─ Deploy to testnet

Day 3-5: Database migration
├─ Add: boards, board_configs, board_curators tables
├─ Alter: releases, approvals (add board_id FK)
├─ Data migration: existing releases → default board
└─ Create migration script
```

**Tasks:**
- [ ] Write `Registrar.sol`
- [ ] Deploy to testnet + verify
- [ ] Write migration script (schema)
- [ ] Create db/migrations/003-multi-tenancy.sql
- [ ] Test queries with board_id filters

**Blockers:** None (can parallel with MVP)

#### Week 7: API Refactor → Board-Scoped Routes

```
Day 1-3: Refactor existing endpoints
├─ GET /api/releases → GET /api/board/{boardId}/releases
├─ POST /api/submit → POST /api/board/{boardId}/releases
├─ POST /api/approve → POST /api/board/{boardId}/approve
└─ Add board auth middleware

Day 4-5: New endpoints
├─ POST /api/registrar/apply-board
├─ GET /api/boards
├─ GET /api/explorer (cross-board)
└─ Test all routes
```

**Tasks:**
- [ ] Create board auth middleware
- [ ] Refactor POST /api/submit → POST /api/board/[id]/releases
- [ ] Refactor POST /api/approve → POST /api/board/[id]/approve
- [ ] Add GET /api/boards
- [ ] Add POST /api/registrar/apply-board
- [ ] Tests for each route

**Blockers:** None (backward compatible if needed)

#### Week 8: Frontend — Registrar Portal + Board Workspace

```
Day 1-2: Registrar portal UI
├─ Page: /registrar
├─ Form: Board label, Safe address, feeBps, baseCreator
├─ Payment: Show fee amount
└─ Success: Display new board subname

Day 3-5: Board workspace
├─ Page: /board/[boardId]
├─ Show: Board details, curator list, releases
├─ Curator management: Invite, threshold settings
├─ Release approval dashboard (Safe-gated)
└─ Analytics
```

**Tasks:**
- [ ] Create /registrar page + form
- [ ] Create /board/[boardId] page
- [ ] Update /board/[boardId]/submit (scoped form)
- [ ] Hook registrar API call (POST /api/registrar/apply-board)
- [ ] Hook approve API call (updated routes)

**Blockers:** None (designs ready)

#### Week 9: Multi-Board Explorer + ENS Resolution

```
Day 1-3: Explorer page
├─ Page: /explore or /catalog
├─ Display: All boards + releases
├─ Search/filter by board, artist, date
├─ ENS resolution: Click release → pda-XXX.boardX.app.eth
└─ Tests

Day 4-5: ENS fallback + Graph
├─ If Graph slow: Fallback to ENS direct resolution
├─ Graph subgraph: Index all boards + releases
└─ Deploy subgraph
```

**Tasks:**
- [ ] Create /explore page
- [ ] Implement search/filter logic
- [ ] Add ENS resolution integration (ens.js)
- [ ] Create Graph subgraph (if not done in MVP)
- [ ] Update frontend to use Graph vs direct resolution

**Blockers:** None (parallel with others)

#### Week 10: Integration + Testing

```
Day 1-3: E2E tests
├─ Test: Board registration → Release submission → Approval → Publish
├─ Test: Cross-board discovery
├─ Test: ENS resolution
└─ Test: Safe multisig approval

Day 4-5: Docs + deployment prep
├─ Update architecture docs
├─ Create runbook: Deploying registrar
├─ Testnet deployment
└─ Go-live checklist
```

**Tasks:**
- [ ] E2E tests (board registration → publish)
- [ ] Cross-board query tests
- [ ] Safe integration tests
- [ ] Deployment scripts for Registrar
- [ ] Runbook: Multi-board deployment

**Blockers:** None (follow MVP)

---

### Phase 3: Advanced Features (Post-MVP, Optional)

**Scope:** Defer until Phase 2 stable.

#### Per-Board DAOs
- Each board can form sub-DAO
- Custom governance beyond Safe
- Treasury per board

#### Custom Splits
- Per-release revenue splits
- Artist-specific agreements
- Board-specific fee tiers

#### Cross-Chain
- Resolve board subnames across L1/L2
- Unified ENS resolver
- Multi-chain indexing

#### Marketplace
- Board-specific storefronts
- Auction support
- Editions (1/1, 1/N, unlimited)

#### Creator Signature Verification
**Problem:** In MVP, coordinator wallet owns all Zora coins and there's no cryptographic proof that the creator authorized the release. Metadata just has `"artist": "m580"` as a string.

**Solution:** Add creator signature flow to metadata:
```typescript
// Enhanced metadata with creator authorization
{
  "artist": "m580",
  "creatorAddress": "0x123...",
  "creatorSignature": "0xabc...",  // Creator signs: keccak256(releaseId + mediaCID + timestamp)
  "authorizedAt": 1234567890,
  "signatureMessage": "I authorize release of [CID] as [releaseId]"
}
```

**Implementation:**
1. At submission: Creator signs authorization message with their wallet
2. Backend verifies signature matches createdBy address
3. Signature stored in metadata + database
4. Anyone can verify: `ecrecover(messageHash, signature) === creatorAddress`

**Benefits:**
- Cryptographic proof of creator authorization
- Prevents coordinator from faking releases
- Creator can prove "I made this" onchain
- Enables future creator-owned coins (transfer from coordinator → creator)

**Database Changes:**
```sql
ALTER TABLE releases ADD COLUMN creator_signature VARCHAR(132);
ALTER TABLE releases ADD COLUMN signature_message TEXT;
ALTER TABLE releases ADD COLUMN signature_timestamp BIGINT;
```

**Note:** MVP assumes curator = creator (self-publishing). This becomes critical when accepting external submissions.

---

## CONTRACTS ARCHITECTURE

### Registrar.sol (L1 Ethereum)

**Purpose:** Board registration, fee routing, config storage.

```solidity
pragma solidity ^0.8.20;

import "@ens-labs/ens-contracts/contracts/registry/ENS.sol";
import "@ens-labs/ens-contracts/contracts/registry/ReverseRegistrar.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Registrar is Ownable {
    // Constants
    ENS public ens;
    address public resolverAddress;
    bytes32 public parentNode;  // Namehash of app.eth
    address public treasurySafe;  // Fee recipient
    
    // Configurable
    uint256 public registrationFee = 0.5 ether;
    uint256 public protocolFeeBps = 500;  // 5%
    
    // Storage
    mapping(bytes32 => BoardConfig) public boardConfigs;
    bytes32[] public registeredBoards;
    
    // Events
    event BoardRegistered(
        bytes32 indexed boardNode,
        string indexed boardLabel,
        address indexed boardSafe,
        uint256 feeBps,
        address baseCreator
    );
    
    event BoardConfigUpdated(
        bytes32 indexed boardNode,
        address indexed boardSafe,
        uint256 feeBps,
        address baseCreator
    );
    
    // Structs
    struct BoardConfig {
        address boardSafe;
        uint256 feeBps;
        address baseCreator;
        address owner;
        uint256 registeredAt;
        bool active;
    }
    
    // Constructor
    constructor(
        address _ens,
        address _resolver,
        bytes32 _parentNode,
        address _treasurySafe
    ) {
        ens = ENS(_ens);
        resolverAddress = _resolver;
        parentNode = _parentNode;
        treasurySafe = _treasurySafe;
    }
    
    // Functions
    function registerBoard(
        string memory boardLabel,
        address boardSafe,
        uint256 feeBps,
        address baseCreator
    ) public payable returns (bytes32 boardNode) {
        require(msg.value >= registrationFee, "Insufficient fee");
        require(boardSafe != address(0), "Invalid Safe");
        require(feeBps <= 10000, "Fee too high");  // Max 100%
        
        // Create subname node
        boardNode = keccak256(abi.encodePacked(
            parentNode,
            keccak256(abi.encodePacked(boardLabel))
        ));
        
        // Ensure not already registered
        require(!boardConfigs[boardNode].active, "Board exists");
        
        // Store config
        boardConfigs[boardNode] = BoardConfig({
            boardSafe: boardSafe,
            feeBps: feeBps,
            baseCreator: baseCreator,
            owner: msg.sender,
            registeredAt: block.timestamp,
            active: true
        });
        
        // Register ENS subname (via ENS registry)
        ens.setSubnodeRecord(
            parentNode,
            keccak256(abi.encodePacked(boardLabel)),
            msg.sender,  // Initially owned by caller
            resolverAddress,
            0  // TTL
        );
        
        // Transfer ownership to board Safe (or DAO)
        ens.setOwner(boardNode, boardSafe);
        
        // Track registration
        registeredBoards.push(boardNode);
        
        // Route fees to treasury
        (bool success, ) = treasurySafe.call{value: msg.value}("");
        require(success, "Fee transfer failed");
        
        emit BoardRegistered(
            boardNode,
            boardLabel,
            boardSafe,
            feeBps,
            baseCreator
        );
        
        return boardNode;
    }
    
    function getBoardConfig(bytes32 boardNode)
        public view
        returns (BoardConfig memory)
    {
        require(boardConfigs[boardNode].active, "Board not found");
        return boardConfigs[boardNode];
    }
    
    function updateBoardConfig(
        bytes32 boardNode,
        address newSafe,
        uint256 newFeeBps,
        address newBaseCreator
    ) public {
        BoardConfig storage config = boardConfigs[boardNode];
        require(config.active, "Board not found");
        require(msg.sender == config.owner, "Not authorized");
        
        config.boardSafe = newSafe;
        config.feeBps = newFeeBps;
        config.baseCreator = newBaseCreator;
        
        emit BoardConfigUpdated(boardNode, newSafe, newFeeBps, newBaseCreator);
    }
    
    function withdrawFees() public onlyOwner {
        (bool success, ) = treasurySafe.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
    
    function setRegistrationFee(uint256 newFee) public onlyOwner {
        registrationFee = newFee;
    }
}
```

### Factory.sol (L1 Ethereum)

**Purpose:** Orchestrate release publishing, Safe multisig coordination.

*See PHASE3_IMPLEMENTATION_GUIDE.md for core logic; enhance with board scoping:*

```solidity
function publishRelease(
    bytes32 boardNode,           // ← NEW: Which board
    string memory releaseId,
    string memory metadataURI,
    address contributor
) external onlyBoardSafe(boardNode) returns (uint256) {
    
    // Verify contributor is approved for this board
    require(isApprovedForBoard[boardNode][contributor], "Not approved");
    
    // Get board config
    IRegistrar.BoardConfig memory board = registrar.getBoardConfig(boardNode);
    
    // Fetch base creator for this board
    address baseCreator = board.baseCreator;
    
    // Mint NFT on Zora (via board's creator)
    uint256 tokenId = IZoraCreator(baseCreator).mint(
        releaseId,
        contributor,
        1,  // quantity
        abi.encode(metadataURI)
    );
    
    // Register ENS subname: pda-XXX.boardX.app.eth
    bytes32 releaseNode = keccak256(abi.encodePacked(
        boardNode,
        keccak256(abi.encodePacked(releaseLabel))
    ));
    
    // Set resolver + text records
    ens.setResolver(releaseNode, resolverAddress);
    IPublicResolver(resolverAddress).setText(
        releaseNode,
        "zoraNFT",
        string(abi.encodePacked("base:", toHexString(baseCreator), "/", tokenId))
    );
    
    emit ReleaseAdded(boardNode, releaseId, contributor, metadataURI, tokenId);
    return tokenId;
}
```

---

## FRONTEND STRUCTURE

### Pages (Enhanced)

```
app/
├── page.tsx                              ← Home
├── layout.tsx                            ← Root layout
├── globals.css
│
├── (public)/
│  ├── explore/page.tsx                  ← Cross-board explorer (NEW)
│  ├── board/[boardId]/page.tsx          ← Board detail (NEW)
│  ├── release/[boardId]/[releaseId]/    ← Release detail (NEW)
│  └── page.tsx                          ← Public releases
│
├── (admin)/
│  ├── registrar/page.tsx                ← Board registration (NEW)
│  ├── board/[boardId]/page.tsx          ← Board workspace (NEW)
│  ├── board/[boardId]/settings/         ← Board settings (NEW)
│  ├── board/[boardId]/curators/         ← Curator management (NEW)
│  └── board/[boardId]/submit/           ← Release submission (MODIFIED)
│
├── api/
│  ├── registrar/
│  │  └── apply-board/route.ts           ← POST register board (NEW)
│  │
│  ├── board/
│  │  ├── [boardId]/
│  │  │  ├── route.ts                    ← GET board detail (NEW)
│  │  │  ├── releases/route.ts           ← GET/POST releases (MODIFIED)
│  │  │  ├── approve/route.ts            ← POST approval (MODIFIED)
│  │  │  └── curators/route.ts           ← GET curators (NEW)
│  │  └── ...
│  │
│  ├── boards/route.ts                   ← GET all boards (NEW)
│  ├── explorer/route.ts                 ← GET all releases (NEW)
│  └── ...
│
└── components/
   ├── RegistrarForm.tsx                 ← Board registration (NEW)
   ├── BoardWorkspace.tsx                ← Board dashboard (NEW)
   ├── ReleaseForm.tsx                   ← Updated for board scoping
   ├── CuratorDashboard.tsx              ← Updated for multiple boards
   ├── ReleaseDisplay.tsx                ← Multi-board compatible
   ├── Explorer.tsx                      ← Cross-board browsing (NEW)
   └── ...
```

### Component Hierarchy

```
RootLayout
├── Navigation (updated: show current board)
├── Routes
│  ├── Public routes
│  │  ├── /explore → Explorer (all boards)
│  │  ├── /board/[id] → BoardDetail
│  │  └── /release/[boardId]/[id] → ReleaseDetail
│  │
│  └── Authenticated routes
│     ├── /registrar → RegistrarForm (NEW)
│     ├── /board/[id] → BoardWorkspace (NEW)
│     ├── /board/[id]/submit → ReleaseForm (scoped)
│     └── /board/[id]/approve → CuratorDashboard (scoped)
│
└── Footer
```

---

## BACKWARDS COMPATIBILITY

### MVP → Full Vision Transition

**Goal:** Existing MVP releases continue to work post-migration.

#### Data Migration Strategy

```sql
-- Step 1: Create default board for MVP releases
INSERT INTO boards (board_label, board_subname, board_safe, base_creator, protocol_fee_bps, owner_address)
VALUES ('default', 'palaupalau.eth', 'MVP_SAFE_ADDRESS', 'MVP_CREATOR', 0, 'PROTOCOL_DAO');

-- Step 2: Link existing releases to default board
UPDATE releases
SET board_id = (SELECT id FROM boards WHERE board_label = 'default')
WHERE board_id IS NULL;

-- Step 3: Link existing approvals to default board
UPDATE approvals
SET board_id = (SELECT id FROM boards WHERE board_label = 'default')
WHERE board_id IS NULL;

-- Step 4: Verify all foreign keys resolve
SELECT COUNT(*) FROM releases WHERE board_id IS NULL;  -- Should be 0
```

#### API Compatibility Layer

```typescript
// Old endpoint (MVP): GET /api/releases
// Maps to: GET /api/board/{defaultBoardId}/releases

// For backward compatibility, keep both:
app.get('/api/releases', async (req, res) => {
  const defaultBoard = await db.boards.findOne({ label: 'default' });
  req.params.boardId = defaultBoard.id;
  
  // Delegate to scoped handler
  return handleGetReleases(req, res);
});

// Same for POST /api/submit, POST /api/approve, etc.
```

#### Frontend Compatibility

```typescript
// Existing ReleaseDisplay component
// No changes needed—still renders same data

// CuratorDashboard component
// Updated to show board context
// But defaults to MVP board for existing users

// Optional: Add board selector for multi-board curators
```

---

## MIGRATION CHECKLIST

### Pre-Migration (MVP Complete)

- [ ] MVP fully tested end-to-end
- [ ] All 5 focus points complete (backend, IPFS, Zora, ENS, multisig)
- [ ] Database backups secured
- [ ] Team familiar with MVP architecture

### Migration Phase (Weeks 6-10)

#### Week 6
- [ ] Registrar contract designed, reviewed, deployed to testnet
- [ ] Database migration script created, tested on backup DB
- [ ] Test: Old data loads with new schema

#### Week 7
- [ ] All API routes refactored to board-scoped
- [ ] Backward compatibility layer active
- [ ] Test: Old clients still work

#### Week 8
- [ ] New frontend pages built (registrar, board workspace)
- [ ] Test: Board registration flow e2e

#### Week 9
- [ ] Explorer page fully functional
- [ ] Cross-board queries working
- [ ] Test: Discovery of releases across boards

#### Week 10
- [ ] Full e2e tests pass (board creation → release publish)
- [ ] Staging deployment successful
- [ ] Documentation updated
- [ ] Go-live checklist signed off

### Mainnet Deployment

- [ ] Registrar contract final audit
- [ ] Mainnet deployment (Registrar, treasury setup)
- [ ] DNS cutover (old routes to new, with compatibility)
- [ ] Monitor: Zero breaking changes for existing users
- [ ] Announce: New boards now available

---

## SUMMARY

### MVP (Weeks 1-5)
**Goal:** Single-platform release publishing works end-to-end.  
**Deliverable:** `pda-001.palaupalau.eth` minted, published, discoverable.

### Full Vision (Weeks 6-10+)
**Goal:** Multi-tenant protocol scales to N boards.  
**Deliverable:** `pda-001.boardA.app.eth`, `pda-001.boardB.app.eth`, etc. all discoverable on one protocol.

### Key Differentiators
1. **Registrar contract** gates board creation + fees
2. **Hierarchical ENS** enables namespace scoping
3. **Per-board Safe** decentralizes governance
4. **Protocol DAO** unifies revenue + treasury
5. **Multi-board explorer** aggregates all content

### Success Metrics (Post-MVP)
- ✅ 3+ boards registered on mainnet
- ✅ 50+ releases across boards published
- ✅ <100ms avg query time (cross-board)
- ✅ 100% backward compatible (MVP users unaffected)
- ✅ <$10k total contract deployment costs

---

## NEXT IMMEDIATE STEPS (Week 2, Days 6-10)

**Stay focused on MVP roadmap:**

1. ✅ **Day 6-7:** IPFS/Storacha integration (as planned)
2. ✅ **Day 8-9:** Factory contract development (as planned)
3. ✅ **Day 10:** Contract testing on testnet (as planned)

**This document is reference only.** After MVP completes, return here to begin Phase 2 (Registrar + Multi-Tenancy).

---

**Document Version:** 1.0  
**Status:** Blueprint (ready for Phase 2 execution)  
**Created:** November 16, 2025

