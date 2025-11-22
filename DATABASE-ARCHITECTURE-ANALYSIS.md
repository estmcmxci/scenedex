# 📊 DATABASE & STORAGE ARCHITECTURE ANALYSIS
## Phase 3 Day 1: Choosing & Setting Up Your Database

---

## 🎯 EXECUTIVE SUMMARY

Your architecture needs **THREE distinct storage layers**, each serving different purposes:

| Layer | Technology | Purpose | Why? |
|-------|-----------|---------|------|
| **Transactional** | PostgreSQL/MongoDB | Workflow state, approvals, user records | Query complex data, enforce consistency |
| **Content** | IPFS/Storacha | Audio files, metadata, images | Immutable, decentralized, censorship-resistant |
| **Truth** | Blockchain (Ethereum/Base) | Ownership, NFTs, governance | Decentralization, trustlessness, transparency |

---

## 🗄️ PART 1: DATABASE OPTIONS FOR TRANSACTIONAL DATA

### Current State
You're running **Next.js frontend only** with:
- Zustand for client state (ephemeral)
- MSW for mock API handlers
- No backend server yet

### Phase 3 Requirement
You need a **real backend** to handle:
- Persistent storage of submissions
- Curator approval tracking
- Release lifecycle management
- Transaction/signature records

---

## 🔍 DATABASE OPTION ANALYSIS

### **Option 1: PostgreSQL (RECOMMENDED) ✅**

**Overview:** Traditional relational database with excellent performance and reliability.

**Pros:**
- ✅ **ACID Compliance**: Guarantees data integrity (critical for approval records)
- ✅ **Complex Queries**: Native support for JOINs, transactions, constraints
- ✅ **Full-text Search**: Built-in text search for release discovery
- ✅ **Audit Logging**: Easy to track who approved what and when
- ✅ **Battle-tested**: Used by Stripe, Uber, Twitter at scale
- ✅ **Cost**: ~$15-50/month for hobby tier (e.g., Railway, Render)
- ✅ **Backups**: Native replication and backup strategies

**Cons:**
- ❌ Requires infrastructure (managed options available)
- ❌ Not serverless (though managed options feel serverless)
- ❌ Scaling: Vertical first, then horizontal via sharding

**Best For:** Production systems with complex workflows

**Example Schema:**
```sql
-- Releases: The core entity
CREATE TABLE releases (
  id VARCHAR(20) PRIMARY KEY,           -- PDA-001
  title VARCHAR(255) NOT NULL,
  description TEXT,
  artists VARCHAR(255),
  created_by VARCHAR(42) NOT NULL,      -- 0x wallet
  created_at TIMESTAMP DEFAULT NOW(),
  status ENUM('pending', 'approved', 'published'),
  media_ipfs_hash VARCHAR(59),          -- QmXxxx...
  metadata_uri VARCHAR(59),             -- QmYyyy...
  cover_image_hash VARCHAR(59),         -- Cover art
  zora_nft VARCHAR(100),                -- base:0xAddress/tokenId
  token_id BIGINT,
  ens_subname VARCHAR(255),             -- pda-001.palaupalau.eth
  rejection_reason TEXT,
  INDEX (created_by, created_at),
  INDEX (status)
);

-- Approvals: Multisig tracking
CREATE TABLE approvals (
  id BIGSERIAL PRIMARY KEY,
  release_id VARCHAR(20) NOT NULL,
  signer VARCHAR(42) NOT NULL,          -- 0x curator
  signature VARCHAR(132) NOT NULL,      -- 0x + 130 hex
  signed_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (release_id) REFERENCES releases(id),
  UNIQUE(release_id, signer),           -- One sig per curator per release
  INDEX (release_id)
);

-- Curators: Board members
CREATE TABLE curators (
  address VARCHAR(42) PRIMARY KEY,      -- 0x wallet
  name VARCHAR(255),
  joined_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  multisig_address VARCHAR(42)          -- Safe contract
);

-- Audit Log: Compliance tracking
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(50),               -- submission, approval, rejection, published
  release_id VARCHAR(20),
  actor VARCHAR(42),
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX (release_id, created_at)
);
```

---

### **Option 2: MongoDB**

**Overview:** NoSQL document database, schema-flexible.

**Pros:**
- ✅ **Flexible Schema**: Easy to evolve data model
- ✅ **Developer-friendly**: Works naturally with JSON/JavaScript
- ✅ **Good for Fast Iteration**: No migrations needed
- ✅ **Horizontal Scaling**: Built-in sharding
- ✅ **Serverless Options**: MongoDB Atlas has serverless tier

**Cons:**
- ❌ **No ACID across documents** (unless transactions, which are slower)
- ❌ **No constraints** (must enforce in application code)
- ❌ **Query complexity**: JOINs require aggregation pipeline (slower)
- ❌ **Size**: Documents stored redundantly (more storage = more cost)
- ❌ **Harder auditing**: No built-in referential integrity

**Best For:** Rapid prototyping, loosely-structured data

**Example Collections:**
```typescript
// releases collection
{
  _id: ObjectId("..."),
  catalogueId: "PDA-001",
  title: "My Release",
  description: "...",
  createdBy: "0x123...",
  createdAt: ISODate("2025-11-14T..."),
  status: "approved",
  mediaIPFSHash: "QmXxxx...",
  approvals: [
    { signer: "0x456...", signature: "0x...", timestamp: 1731607200 }
  ],
  multisigAddress: "0xSafe...",
  approvalThreshold: 2,
  approvalRequirementsMet: true
}

// No separate approvals collection needed
// (vs PostgreSQL where normalization is better)
```

---

### **Option 3: SQLite (Local Development Only)**

**Overview:** Embedded SQL database, perfect for testing.

**Pros:**
- ✅ **Zero setup**: Single file, works locally
- ✅ **Good for testing**: Fast unit tests
- ✅ **Full SQL support**: Same queries as PostgreSQL
- ✅ **Free**: Open source

**Cons:**
- ❌ **Single writer**: Locks during writes (not production-safe)
- ❌ **No network access**: Can't share across servers
- ❌ **No replication**: Backups are manual
- ❌ **Scaling**: Not suitable beyond single machine

**Best For:** Local development, testing, prototyping only

---

### **Option 4: Firebase Firestore**

**Overview:** Managed NoSQL from Google, serverless.

**Pros:**
- ✅ **Fully Serverless**: Pay per request, scales automatically
- ✅ **Real-time Subscriptions**: Built-in websockets for live updates
- ✅ **Easy Authentication**: Integrates with Firebase Auth
- ✅ **Global Distribution**: Automatic replication
- ✅ **Cost**: Free tier generous (~25k reads/day)

**Cons:**
- ❌ **Document-size limits**: Max 1MB per document
- ❌ **Expensive at scale**: Cost grows with reads/writes
- ❌ **Vendor lock-in**: Google ecosystem
- ❌ **Complex queries**: Limited WHERE clauses
- ❌ **No ACID transactions**: Within documents only

**Best For:** Lightweight, real-time consumer apps (not ideal here)

---

### **Option 5: Supabase (PostgreSQL + BaaS)**

**Overview:** Open-source Firebase alternative, built on PostgreSQL.

**Pros:**
- ✅ **PostgreSQL power**: Full relational database
- ✅ **Serverless API**: Auto-generated REST/GraphQL
- ✅ **Real-time**: WebSocket subscriptions included
- ✅ **Open source**: Can self-host
- ✅ **Low cost**: $25/month starter, simple pricing
- ✅ **Row-level security**: Built-in auth policies

**Cons:**
- ❌ Smaller ecosystem than Firebase
- ❌ Startup (but growing fast)

**Best For:** Production, especially if you want PostgreSQL + managed infrastructure

---

## 📋 COMPARISON TABLE

| Feature | PostgreSQL | MongoDB | SQLite | Firebase | Supabase |
|---------|-----------|---------|--------|----------|----------|
| **ACID Compliance** | ✅ Full | ⚠️ Limited | ✅ Full | ❌ No | ✅ Full |
| **Complex Queries** | ✅ Excellent | ⚠️ Aggregation | ✅ Excellent | ❌ Limited | ✅ Excellent |
| **Scalability** | ✅ Good | ✅ Great | ❌ Poor | ✅ Great | ✅ Good |
| **Cost** | $ | $$ | Free | $$$ | $$ |
| **Setup Complexity** | Medium | Low | Minimal | Minimal | Low |
| **Audit Logging** | ✅ Native | ⚠️ Manual | ✅ Native | ⚠️ Manual | ✅ Native |
| **Production Ready** | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |

---

## ✅ RECOMMENDATION: PostgreSQL + Managed Hosting

**For Catalogue's Phase 3, choose PostgreSQL because:**

1. **Approval Tracking**: Your multisig workflow needs ACID transactions
   - Scenario: 2 curators sign, system updates approval count. If system crashes between signature verification and DB write, PostgreSQL rolls back automatically.

2. **Complex Queries**: Your curator dashboard needs
   - "Show me all releases pending approval by me"
   - "Show releases I approved > 30 days ago"
   - "Show all approvals for release X with timestamps"
   - These are JOIN operations, much faster in PostgreSQL

3. **Audit Compliance**: You need immutable approval records
   - PostgreSQL with audit triggers is industry-standard

4. **Cost**: Managed PostgreSQL ~$25/month on Railway/Render/Vercel (equivalent to Firebase)

5. **Migration Path**: If you outgrow it, scale to Supabase or Render (no rewrite)

---

## 🌐 PART 2: STORAGE ARCHITECTURE (Server vs On-Chain vs IPFS)

Now, the key insight: **Why do you need a server database if you're using blockchain & IPFS?**

### The Trilemma: Speed vs. Decentralization vs. Cost

```
                    DECENTRALIZED ⛓️
                         /\
                        /  \
                       /    \
                      /      \
                 SLOW / CHEAP  \ EXPENSIVE
                    /          \
                   /____  _____\
            ON-CHAIN    QUERYABLE
```

### What Goes WHERE and WHY

---

## 🗂️ LAYER 1: SERVER DATABASE (PostgreSQL)
### What: Transactional state + workflow tracking
### Where: Your backend server (Vercel, Railway, Render, etc.)

**Stores:**
- Release submissions (pending approval)
- Approval signatures & timestamps
- Curator board member info
- Audit logs
- Release status & lifecycle

**Why NOT on blockchain?**
```
❌ Block time (15 seconds on Ethereum)
   - User submits release
   - Wait 15 seconds
   - Transaction confirmed
   - Release appears
   
❌ Gas costs ($50-500 per submission in peak hours)
   - You'd pass costs to users
   - Against UX goals

❌ Storage is expensive on-chain
   - 32kb storage = $1000s in gas annually
   - Release metadata is large (description, artists, etc.)

❌ Not all data needs consensus
   - "Is this release pending?" - only curator cares
   - Only final published state matters on-chain
```

**Why DATABASE instead of direct IPFS?**
```
IPFS is immutable (can't update)
   ❌ Release submission pending → need to query "is it approved yet?"
   ❌ Update curator board → need to remove inactive curators
   ❌ User rejects release → need to mark as rejected
   
Database = queryable, updatable state
   ✅ "Give me all releases created by 0x123"
   ✅ "Show pending approvals for curator 0x456"
   ✅ "Update release status to 'approved'"
```

**Data Flow:**
```
User submits audio
    ↓
Frontend sends to /api/submit
    ↓
Backend validates with ReleaseSubmissionSchema
    ↓
Backend creates Release record in DB (status: 'pending')
    ↓
Frontend polls /api/releases for curator dashboard
    ↓
Curator sees pending releases (from DB query)
    ↓
Curator signs approval
    ↓
Backend verifies signature, adds to DB approvals table
    ↓
If threshold met → trigger IPFS pinning (async)
    ↓
Only then → pin to IPFS & call blockchain
```

---

## 📎 LAYER 2: IPFS/STORACHA (Content)
### What: Immutable audio files, cover art, metadata
### Where: Distributed IPFS network (pinned via Storacha)

**Stores:**
- Audio file (MP3) → QmAudio123...
- Cover image (JPG from ID3) → QmCover456...
- Metadata JSON → QmMetadata789...

**Why IPFS?**
```
✅ Content-addressed (CID based on content hash)
   - Same file = same CID always
   - Impossible to modify without changing CID
   - Proof of integrity

✅ Distributed storage
   - Pinned to 3+ nodes via Storacha
   - If one node fails, others serve content
   - Censorship-resistant

✅ Permanent (with pinning)
   - Storacha pinning for 12+ months
   - File never disappears

✅ Referenced from blockchain
   - NFT metadata points to IPFS CID
   - Metadata immutable forever
```

**Why NOT store on server?**
```
❌ Centralized risk
   - Server goes down → content inaccessible
   - No backup = content lost

❌ Expensive bandwidth
   - Streaming 10MB audio files = $$ in egress costs

❌ Against decentralization goals
   - User should own their content
   - Can move it to other IPFS nodes if needed

❌ Not required for queries
   - Audio file doesn't need to be in database
   - Only CID (59 characters) stored
```

**Data Flow:**
```
User uploads audio file (MP3)
    ↓
/api/upload/media receives file
    ↓
Backend extracts:
  - Duration (ID3 tags)
  - Cover image (embedded art)
    ↓
Backend pins to Storacha
  mediaIPFSHash = await pinToIPFS(audioFile)
  coverImageHash = await pinToIPFS(coverImage)
    ↓
Backend stores CIDs in DB (not the file itself)
  releases table:
    media_ipfs_hash: "QmAudio123..."
    cover_image_hash: "QmCover456..."
    ↓
Later: Curator approves
    ↓
Backend creates metadata JSON:
  {
    name: "Release Title",
    description: "...",
    image: "ipfs://QmCover456...",
    animation_url: "ipfs://QmAudio123...",
    properties: { ... }
  }
    ↓
Backend pins metadata JSON
  metadataURI = await pinToIPFS(metadataJSON)
    ↓
Frontend displays: "ipfs://QmMetadata789..."
```

---

## ⛓️ LAYER 3: BLOCKCHAIN (Truth)
### What: Ownership records, NFTs, governance
### Where: Ethereum L1 (Factory contract) + Base L2 (Zora NFTs)

**Stores:**
- Release approval authorization (multisig signatures)
- NFT ownership (in Zora contract)
- ENS subname registration
- Event logs (for indexing)

**Why BLOCKCHAIN?**
```
✅ Trustless ownership
   - "This NFT belongs to user 0xABC" proven by contract state
   - No central authority needed

✅ Governance (multisig)
   - Multiple curators must sign (2-of-3, etc.)
   - Cannot be overridden by single person
   - Immutable on-chain

✅ Permanence
   - Once NFT minted, it exists forever
   - Even if Catalogue shuts down

✅ Interoperability
   - NFT can be traded on OpenSea, etc.
   - Other dApps can reference it
```

**Why NOT store all data?**
```
❌ Gas costs
   - Storing title, description, artists = $$$ per update

❌ Performance
   - 12 seconds per Ethereum block
   - IPFS can deliver metadata in <1 second

❌ Querying
   - "Give me all releases by curator 0xXYZ"
   - Would need to scan entire blockchain (slow)
   - Database query: <100ms

❌ Immutability is sometimes bad
   - "Please delete my release" (GDPR)
   - Can't do on blockchain (permanent)
   - Can do in database (data ownership)
```

**Data Flow:**
```
Curator collects 2/3 signatures (via Safe multisig)
    ↓
Backend verifies all signatures in DB
    ↓
Backend calls Factory.publishRelease(releaseId, metadataURI)
    ↓
Factory.sol (Ethereum L1):
  1. Verify msg.sender is Safe contract
  2. Verify signatures collected in DB
  3. Call Zora Creator on Base L2
    ↓
Zora Creator (Base L2):
  1. Mint NFT with metadata URI
  2. Owner = creator address
  3. Emit "ZoraMinted" event
    ↓
Backend:
  1. Parses tokenId from event
  2. Updates DB: status='published', tokenId, zoraNFT
    ↓
Frontend displays: "NFT minted! tokenId=123"
    ↓
User can see NFT in wallet on Base L2
```

---

## 📊 THE THREE-LAYER ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                          │
│  - ReleaseForm.tsx (submit)                                     │
│  - CuratorDashboard.tsx (approve)                               │
│  - ReleaseDisplay.tsx (view)                                    │
└────────────┬──────────────────────────────────────────┬─────────┘
             │                                          │
             ↓                                          ↓
    ┌────────────────────┐              ┌──────────────────────┐
    │   BACKEND (Node)   │              │  WALLET (Wagmi)      │
    │                    │              │                      │
    │ POST /api/submit   │              │  signMessage()       │
    │ POST /api/approve  │              │  sendTransaction()   │
    │ GET /api/releases  │              │                      │
    └────────┬───────────┘              └──────────────────────┘
             │
   ┌─────────┴─────────────────────┬──────────────────┬─────────┐
   │                               │                  │         │
   ↓                               ↓                  ↓         ↓
┌──────────────┐         ┌──────────────────┐   ┌──────────┐  ┌──────────┐
│  PostgreSQL  │         │ IPFS / Storacha  │   │Ethereum  │  │  Base L2 │
│   DATABASE   │         │   (Content)      │   │  (L1)    │  │ (Zora)   │
│              │         │                  │   │          │  │          │
│ - Releases   │         │ - Audio files    │   │ Factory  │  │ NFT      │
│ - Approvals  │         │ - Images         │   │ Contract │  │ Minting  │
│ - Curators   │         │ - Metadata JSON  │   │ (Multisig)  │ Service │
│ - Audit Log  │         │ (CIDs only)      │   │          │  │          │
└──────────────┘         └──────────────────┘   └──────────┘  └──────────┘
   (Transactional)          (Immutable)         (Governance)   (Ownership)
   (Queryable)              (Distributed)       (Trustless)    (NFT)
```

---

## 🔄 COMPLETE DATA FLOW EXAMPLE: One Release Submission to Publishing

### Step 1: User Submits (Frontend → Database)
```typescript
// ReleaseForm.tsx
const handleSubmit = async (data: ReleaseSubmissionInput) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('file', data.mediaFile);
  
  const response = await fetch('/api/submit', {
    method: 'POST',
    body: formData
  });
  
  const { release } = await response.json();
  console.log(release.id); // PDA-001
};
```

**Backend** (`/api/submit`):
```typescript
// 1. Validate file
// 2. Extract metadata from MP3 (duration, cover art)
// 3. Pin to Storacha
//    mediaIPFSHash = "QmAudio123..."
//    coverImageHash = "QmCover456..."
// 4. Store in PostgreSQL:
INSERT INTO releases 
  (id, title, description, created_by, status, media_ipfs_hash, cover_image_hash)
VALUES 
  ('PDA-001', 'My Song', '...', '0x123...', 'pending', 'QmAudio123...', 'QmCover456...');

// 5. Return to frontend
return { success: true, release: {...} };
```

**Database State:**
```sql
releases table:
  id: "PDA-001"
  status: "pending"
  media_ipfs_hash: "QmAudio123..."
  cover_image_hash: "QmCover456..."
  created_by: "0x123..."
  created_at: 2025-11-14 10:00:00
```

---

### Step 2: Curator Views Pending (Frontend queries Database)
```typescript
// CuratorDashboard.tsx
const { data: pending } = useQuery(
  ['pendingReleases'],
  () => fetch('/api/curator/pending').then(r => r.json())
);
// Returns releases with status='pending'
```

**Backend** (`/api/curator/pending`):
```sql
SELECT * FROM releases 
WHERE status = 'pending' 
AND id NOT IN (
  SELECT DISTINCT release_id FROM approvals 
  WHERE signer = ?
)
ORDER BY created_at DESC;

-- Returns: [{ id: 'PDA-001', title: 'My Song', ... }]
```

---

### Step 3: Curator Signs (Wallet → Database)
```typescript
// CuratorDashboard.tsx
const handleApprove = async (releaseId: string) => {
  // 1. Sign message with wallet
  const messageHash = solidityPackedKeccak256(
    ['string', 'string'],
    ['RELEASE_APPROVAL', releaseId]
  );
  
  const signature = await signer.signMessage(
    getAddress(messageHash)
  );
  
  // 2. Send to backend
  const response = await fetch('/api/curator/approve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      releaseId,
      curatorAddress: signer.address,
      signature
    })
  });
};
```

**Backend** (`/api/curator/approve`):
```typescript
// 1. Verify signature
const recovered = recoverAddress(messageHash, signature);
assert(recovered === curatorAddress, 'Invalid signature');

// 2. Store approval in DB
INSERT INTO approvals (release_id, signer, signature, signed_at)
VALUES ('PDA-001', '0x456...', '0xabc...', NOW());

// 3. Check if threshold met
SELECT COUNT(*) FROM approvals WHERE release_id='PDA-001';
// Returns: 2 (out of 3 needed)

// 4. If threshold not met, return waiting
// 5. If threshold met, trigger async job
if (approvalCount >= 3) {
  queue.add('publishRelease', { releaseId });
}
```

**Database State:**
```sql
releases table:
  status: "approved"  -- (updated)

approvals table:
  id: 1
  release_id: "PDA-001"
  signer: "0x456..."
  signature: "0xabc..."
  signed_at: 2025-11-14 10:30:00
```

---

### Step 4: Threshold Met → IPFS Pinning (Database → IPFS)
```typescript
// backend/jobs/publishRelease.ts
export async function publishRelease(releaseId: string) {
  // 1. Load release from DB
  const release = await db.releases.findOne({ id: releaseId });
  
  // 2. Create metadata JSON
  const metadata = {
    name: release.title,
    description: release.description,
    image: `ipfs://${release.coverImageHash}`,
    animation_url: `ipfs://${release.mediaIPFSHash}`,
    properties: {
      catalogueId: release.id,
      submittedBy: release.createdBy,
      duration: release.duration,
      approvals: approvalArray,
      multisigAddress: SAFE_ADDRESS
    }
  };
  
  // 3. Pin metadata to IPFS
  const metadataJSON = JSON.stringify(metadata);
  const metadataBlob = new Blob([metadataJSON]);
  const metadataURI = await storacha.pin(metadataBlob);
  // metadataURI = "QmMetadata789..."
  
  // 4. Update DB with metadata URI
  await db.releases.update(
    { id: releaseId },
    { metadataURI, status: 'ready_for_publishing' }
  );
}
```

**IPFS State:**
```
- QmAudio123... → audio file (already pinned in step 1)
- QmCover456... → cover image (already pinned in step 1)
- QmMetadata789... → metadata JSON (NEW)
  {
    name: "My Song",
    animation_url: "ipfs://QmAudio123...",
    image: "ipfs://QmCover456...",
    ...
  }
```

**Database State:**
```sql
releases table:
  metadataURI: "QmMetadata789..."
  status: "ready_for_publishing"
```

---

### Step 5: Publish to Blockchain (Database → Blockchain → NFT)
```typescript
// backend/services/contract.ts
export async function publishRelease(
  releaseId: string,
  metadataURI: string,
  contributorAddress: string
) {
  // 1. Call Factory contract
  const tx = await factory.publishRelease(
    releaseId,
    metadataURI,
    contributorAddress
  );
  
  // 2. Wait for confirmation
  const receipt = await tx.wait(1);
  
  // 3. Parse ReleaseAdded event
  const event = receipt.events.find(e => e.event === 'ReleaseAdded');
  const tokenId = event.args.tokenId;
  
  // 4. Update DB
  await db.releases.update(
    { id: releaseId },
    {
      status: 'published',
      tokenId: tokenId.toString(),
      zoraNFT: `base:0xZoraAddress/${tokenId}`,
      approvedAt: Date.now()
    }
  );
}
```

**Blockchain State:**
```solidity
// Ethereum L1 - Factory.sol
event ReleaseAdded(
  string indexed releaseId,      // PDA-001
  address indexed contributor,   // 0x123...
  string metadataURI,            // QmMetadata789...
  uint256 tokenId                // 1
);

// Base L2 - Zora NFT
NFT minted:
  owner: 0x123... (creator)
  metadata: https://gateway.pinata.cloud/ipfs/QmMetadata789...
  tokenId: 1
```

**Database State:**
```sql
releases table:
  id: "PDA-001"
  status: "published"
  tokenId: "1"
  zoraNFT: "base:0xZoraAddress/1"
  metadataURI: "QmMetadata789..."
  created_by: "0x123..."
  created_at: 2025-11-14 10:00:00
  approved_at: 2025-11-14 10:35:00

approvals table:
  (same as before, immutable record)
```

---

### Step 6: User Sees Published Release
```typescript
// ReleaseDisplay.tsx or Public Gallery
const { data: release } = useQuery(
  ['release', 'PDA-001'],
  () => fetch('/api/releases/PDA-001').then(r => r.json())
);

// Returns:
{
  id: "PDA-001",
  title: "My Song",
  status: "published",
  zoraNFT: "base:0xZoraAddress/1",
  tokenId: "1",
  mediaIPFSHash: "QmAudio123...",
  metadataURI: "QmMetadata789...",
  createdBy: "0x123..."
}
```

**Frontend** fetches NFT from Zora on Base L2:
```typescript
const zora = new ethers.Contract(
  '0xZoraAddress',
  ZORA_ABI,
  baseProvider
);

const owner = await zora.ownerOf(1); // 0x123...
const metadata = await fetch(
  `https://gateway.pinata.cloud/ipfs/QmMetadata789...`
);
```

---

## 🎯 SUMMARY: Why Three Layers?

| Layer | Reason |
|-------|--------|
| **PostgreSQL DB** | For queryable, updatable state during approval workflow |
| **IPFS/Storacha** | For permanent, decentralized content storage |
| **Blockchain** | For trustless ownership & governance (multisig) |

**If you tried to do everything on-chain:**
- Gas costs: $500-5000 per release (prohibitive)
- Speed: 12+ second block times (poor UX)
- Storage: $$$$ per KB (unsustainable)

**If you tried to do everything in database:**
- No decentralization (users can't verify ownership)
- No composability (other dApps can't use it)
- Censorship risk (host could be taken down)
- No proof of curation (multisig wouldn't matter)

---

## 🚀 IMPLEMENTATION CHECKLIST FOR DAY 1

### Database Setup
- [ ] Choose PostgreSQL (recommended) or MongoDB
- [ ] Set up managed hosting:
  - **PostgreSQL**: Railway.app, Render.com, or Supabase.io
  - **MongoDB**: MongoDB Atlas (serverless option)
- [ ] Create tables/collections from schema above
- [ ] Set up environment variables (DATABASE_URL)

### Backend Infrastructure
- [ ] Create `backend/routes/submit.ts` endpoint
- [ ] Create `backend/routes/curator/approve.ts` endpoint
- [ ] Create `backend/services/database.ts` helper
- [ ] Create `backend/middleware/auth.ts` for curator verification

### Validation & Security
- [ ] Validate submissions with ReleaseSubmissionSchema
- [ ] Add rate limiting to /api/submit (prevent spam)
- [ ] Add signature verification middleware
- [ ] Add audit logging for all approvals

### Testing
- [ ] Unit tests for database operations
- [ ] Integration tests for submit → approve flow
- [ ] Mock IPFS service (real integration later)

---

## 📚 NEXT DOCUMENTS TO READ

1. **After choosing database**: See `PHASE3_IMPLEMENTATION_GUIDE.md` Section 1 (Real Backend Integration)
2. **For IPFS setup**: Section 2 (IPFS Pinning)
3. **For blockchain**: Sections 3-4 (Zora NFT + ENS)
4. **For multisig**: Section 5 (Multisig Authentication)

---

**Questions to Discuss:**

1. Do you want to start with PostgreSQL or MongoDB?
2. Which managed hosting platform do you prefer? (Railway, Render, Supabase, etc.)
3. Should we start Day 1 with database schema + migrations, or mock it out first?
4. Do you need real-time updates (curators seeing approvals live)? This affects architecture choices.


