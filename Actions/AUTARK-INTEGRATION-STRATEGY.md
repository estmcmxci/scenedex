# 🔗 Autark CLI Integration Strategy for Catalogue (Updated)

## Executive Summary

**YES**, we leverage Autark's proven patterns for specific SDKs and utilities:
- ✅ Safe SDK Starter Kit (`@safe-global/sdk-starter-kit`)
- ✅ IPFS pinning via Storacha CLI
- ✅ ENS utilities (encodeContentHash, namehash)

**However**, the flow differs significantly. Autark deploys static frontends synchronously. We deploy audio releases with a **curator approval gate** that triggers automatic backend execution.

Rather than copy Autark's end-to-end flow, we **extract and adapt** its SDKs and modular patterns for our custom release workflow.

**See `CORRECTED-RELEASE-FLOW.md` for the actual flow architecture.**

---

## 1. What Autark Does (Current Architecture)

```
┌─────────────────────────────────────────────────────────────────┐
│                    Autark Deploy Flow                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Upload Directory to IPFS via Storacha CLI                 │
│     └─ Returns: CID + IPFS URL                                │
│                                                                 │
│  2. Create Safe Multisig Transaction                          │
│     └─ Prepare ENS setContentHash() call                      │
│     └─ Returns: SafeTxHash (for UI approval)                  │
│                                                                 │
│  3. Broadcast to Safe Transaction Service                     │
│     └─ Curators approve in Safe UI (threshold-based)          │
│     └─ Service executes transaction when threshold met        │
│                                                                 │
│  4. ENS Subname Updated                                       │
│     └─ domain → IPFS CID (immutable content hash)            │
│     └─ Example: app.palaupalau.eth → QmXyz...               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Key Insight:** Autark treats **static frontends** as the unit of deployment. We need to adapt this for **audio releases** as the unit.

---

## 2. Autark's Modular Architecture (What We Can Reuse)

### A. Safe Multisig Client (`lib/safe/client.ts`)
```typescript
// Autark exposes:
export interface SafeClientConfig {
  safeAddress: Address;          // ← Safe contract address
  signerPrivateKey: Hex;         // ← Signer key (curator/owner)
  rpcUrl: string;                // ← L1 RPC endpoint
  apiKey?: string;               // ← Optional Safe API key
}

export interface SafeTransaction {
  to: Address;                   // ← Target contract (ENS Resolver)
  value: string;                 // ← ETH value (usually "0")
  data: Hex;                     // ← Encoded function call
}

// Usage:
const client = await initSafeClient(config);
const result = await sendSafeTransaction(client, transaction);
// Returns: { safeTxHash, txServiceUrl, success }
```

**For Catalogue:** We can use this to create Safe transactions for ENS subname registration after IPFS pinning.

### B. IPFS/Storacha Upload (`lib/ipfs/upload.ts`)
```typescript
// Autark exposes:
export interface IPFSUploadResult {
  cid: string;    // ← Content ID (e.g., QmXyz...)
  size: number;   // ← Bytes uploaded
  url: string;    // ← IPFS gateway URL
}

export async function uploadToIPFS(
  directory: string, 
  logger: Logger
): Promise<IPFSUploadResult>

// Usage:
const result = await uploadToIPFS('/path/to/files', logger);
// Returns: { cid: "QmXyz...", size: 1024, url: "ipfs://QmXyz..." }
```

**For Catalogue:** We can adapt this to upload individual release metadata JSON files + audio files to IPFS.

### C. ENS Integration (`lib/ens/ens.ts`)
```typescript
// Autark exposes:
export const prepareUpdateEnsArgs = ({ cid, domain }) => ({
  contentHash: string,  // ← Encoded CID for ENS
  node: Hex            // ← ENS node hash (namehash)
});

export const encodeContentHash = (cid: string): Hex => {
  // Converts CID to ENS-compatible content hash
}

// This generates the Safe transaction data
```

**For Catalogue:** We can use these utility functions to prepare ENS transaction data for Safe.

---

## 3. How Catalogue's Flow Differs (Corrected Architecture)

### Current Autark (Synchronous Frontend Deployment)
```
Frontend Directory
    ↓
Upload to IPFS → Get CID
    ↓
Create Safe TX: setContentHash()
    ↓
Send to Safe → Curators approve → Execute
    ↓
ENS subname points to frontend version
```

### Catalogue (Async Release Publishing with Approval Gate)
```
STEP 1: Release Submitted
├─ Audio file → Temporary storage (/tmp)
├─ Metadata → Database
└─ Status: "pending"

STEP 2: Curators Approve via Safe (AUTHORIZATION GATE)
├─ Create Safe TX: "Approve release PDA-001"
├─ Curators sign in Safe UI (threshold-based)
└─ When threshold met → Trigger backend job

STEP 3: Backend Automatically Executes (No more human input)
├─ 3A. IPFS Pin audio + metadata → Get CIDs
├─ 3B. Call Factory via Safe TX → Mint NFT on Base L2
├─ 3C. Call ENS Resolver via Safe TX → Update ENS records
└─ 3D. Update database → Status: "published"

FINAL STATE: ENS subname with all metadata + NFT reference
```

**Key Difference:** Approval is the **authorization gate**, not a downstream step. Everything after approval is automatic.

---

## 4. Specific Elements We Can Borrow

### ✅ REUSABLE COMPONENTS

| Component | Autark Module | Our Usage |
|-----------|---------------|-----------|
| Safe client initialization | `safe/client.ts` | Create Safe TX for ENS updates |
| Safe transaction sending | `safe/client.ts` | Submit curator approvals |
| IPFS upload abstraction | `ipfs/upload.ts` | Pin release metadata to IPFS |
| ENS content hash encoding | `ens/ens.ts` | Prepare ENS transaction data |
| Gateway URL generation | `ipfs/upload.ts` | Return resolvable IPFS URLs |
| Transaction URL builder | `safe/client.ts` | Link users to Safe UI |
| Error handling patterns | `errors.ts` | Consistent error messages |
| Logging infrastructure | `logger.ts` | Debug/audit trail |

### ✅ PATTERNS WE SHOULD FOLLOW

1. **Storacha CLI as the IPFS Pinning Layer**
   - Autark uses `storacha` CLI under the hood
   - We should do the same in `lib/services/ipfs.ts`
   - Benefit: Automatic 12-month pinning, cost-effective

2. **Safe SDK Starter Kit for Multisig**
   - Autark uses `@safe-global/sdk-starter-kit`
   - We should use the same for curator approval flow
   - Benefit: Proven, well-maintained SDK

3. **ENS Resolver ABI from Autark**
   - Autark has the correct `setContenthash()` function ABI
   - We can reuse the exact function signature
   - Benefit: No ABI versioning issues

4. **Transaction URL Construction**
   - Autark provides `getSafeTransactionUrl(safeAddress, chainId)`
   - We can provide the same for curator approval UI

---

## 5. Proposed Implementation Architecture (Corrected)

### New Service Layer Structure
```
lib/services/
├── ipfs.ts                    ← Wraps Storacha CLI for IPFS upload + pinning
├── safe.ts                    ← Wraps Safe SDK for transaction coordination
├── ens.ts                     ← Prepares ENS transaction data (encodes + creates TXs)
├── factory.ts                 ← Prepares Factory contract calls
└── publishRelease.ts          ← Orchestrates 3A-3D (IPFS → Factory → ENS → DB)
```

### Internal API Route (Auto-triggered on Approval Threshold)
```typescript
// POST /api/internal/publish-release
// Called AUTOMATICALLY when curator approval threshold is met
// NOT exposed to frontend - internal backend job
// Orchestrates: IPFS → Factory → ENS → DB

export async function POST(request: NextRequest) {
  const { releaseId } = await request.json();
  
  // 3A. Upload to IPFS
  const { audioIPFSHash, coverIPFSHash, metadataIPFSHash } = await uploadReleaseToIPFS(releaseId);
  
  // 3B. Call Factory via Safe TX (mints NFT)
  const { tokenId } = await callFactoryViaSafe(releaseId, metadataIPFSHash);
  
  // 3C. Update ENS via Safe TXs
  const { ensSafeTxHashes } = await updateENSViaSafe(
    releaseId,
    metadataIPFSHash,
    tokenId
  );
  
  // 3D. Update database
  await db.releases.update(releaseId, {
    status: 'published',
    mediaIPFSHash,
    coverIPFSHash,
    metadataURI: `ipfs://${metadataIPFSHash}`,
    zoraNFT: `base:0xZoraAddress/${tokenId}`,
    tokenId,
    ensSubname: `pda-${releaseId}.palaupalau.eth`,
    publishedAt: Date.now()
  });
  
  // Return for logging/monitoring
  return NextResponse.json({
    success: true,
    releaseId,
    ipfsHashes: { audioIPFSHash, coverIPFSHash, metadataIPFSHash },
    tokenId,
    ensSafeTxHashes
  });
}
```

**Trigger:** When `POST /api/curator/approve` detects threshold met, it calls this endpoint automatically (via job queue or direct call).

---

## 6. Implementation Roadmap (Week 2: Days 6-10)

### Week 1 Status (Complete ✅)
- ✅ Database setup + schema migration
- ✅ CRUD services (releases, approvals)
- ✅ API routes (submit, approve, retrieve)
- ✅ Database testing end-to-end
- ✅ API route testing with real database

### Week 2 Timeline (Current Phase)

**Days 6-7: IPFS/Storacha Integration**
- [ ] Study Autark's IPFS patterns (lib/ipfs/upload.ts)
- [ ] Create `lib/services/ipfs.ts` service
  - [ ] Wrap Storacha CLI integration
  - [ ] Implement metadata JSON building
  - [ ] Test with sample files
- [ ] Create `/tmp` file upload + cleanup handlers
- [ ] Test IPFS pinning with 12-month expiration

**Days 8-9: Safe + Factory Integration**
- [ ] Study Autark's Safe patterns (lib/safe/client.ts)
- [ ] Create `lib/services/safe.ts` service
  - [ ] Wrap Safe SDK initialization
  - [ ] Implement transaction sending
- [ ] Study Autark's ENS patterns (lib/ens/ens.ts)
- [ ] Create `lib/services/ens.ts` service
  - [ ] Implement ENS transaction preparation
  - [ ] Create three Safe TXs (setContenthash + two setText)
- [ ] Create `lib/services/factory.ts` for Factory calls
- [ ] Create `lib/services/publishRelease.ts` orchestration
- [ ] Create `POST /api/internal/publish-release` route
- [ ] Test Safe TX creation (dry-run on testnet)

**Day 10: Integration Testing**
- [ ] End-to-end: Submit → Approve → Auto-publish pipeline
- [ ] Verify ENS subname resolution
- [ ] Verify IPFS accessibility via gateway
- [ ] Verify NFT minted on Base L2
- [ ] Test complete release lifecycle

---

## 7. Code Examples (Borrowing from Autark)

### Example 1: Safe Transaction Creation (Adapted from Autark)
```typescript
// lib/services/safe.ts
import { SafeClient } from '@safe-global/sdk-starter-kit';
import { encodeContentHash } from 'autark/lib/ens';

export async function createENSUpdateTransaction(
  metadataIPFSHash: string,
  ensDomain: string,
  config: SafeConfig
) {
  // 1. Encode content hash (Autark utility)
  const contentHash = encodeContentHash(metadataIPFSHash);
  
  // 2. Get ENS node (namehash of domain)
  const node = namehash(ensDomain);
  
  // 3. Prepare transaction for ENS Resolver
  const safeTx = {
    to: PUBLIC_RESOLVER_ADDRESS,    // ENS Resolver contract
    value: '0',
    data: encodeFunctionCall(
      'setContenthash',
      [node, contentHash]           // ABI from Autark
    )
  };
  
  return safeTx;
}
```

### Example 2: IPFS Upload (Adapted from Autark)
```typescript
// lib/services/ipfs.ts
import { uploadToIPFS as autarkUpload } from 'autark/lib/ipfs';

export async function uploadReleaseToIPFS(releaseId: string) {
  // 1. Build temporary directory with all files
  const tempDir = `/tmp/release-${releaseId}`;
  fs.mkdirSync(tempDir);
  
  // 2. Get files from database
  const tempFilePath = await db.releases.getTempFilePath(releaseId);
  const metadataPath = `${tempDir}/metadata.json`;
  const coverPath = `${tempDir}/cover.jpg`;
  
  // 3. Write metadata JSON
  fs.writeFileSync(metadataPath, JSON.stringify({
    title: release.title,
    description: release.description,
    artists: release.artists,
    duration: release.duration,
    created: release.createdAt,
    // NOTE: IPFS hashes will be added after all files are uploaded
  }));
  
  // 4. Copy files to temp directory
  fs.copyFileSync(tempFilePath, `${tempDir}/audio.mp3`);
  fs.copyFileSync(coverPath, `${tempDir}/cover.jpg`);
  
  // 5. Upload entire directory (Autark pattern)
  const result = await autarkUpload(tempDir, logger);
  
  // 6. Extract individual CIDs from result
  // (Autark returns directory CID; we need to extract file CIDs)
  const mediaIPFSHash = await getFileCID(result.cid, 'audio.mp3');
  const coverIPFSHash = await getFileCID(result.cid, 'cover.jpg');
  
  return {
    mediaIPFSHash,
    coverIPFSHash,
    directoryIPFSHash: result.cid
  };
}
```

---

## 8. Important Differences from Autark (Adapted Patterns)

### ⚠️ Key Architectural Differences

1. **Approval Gate vs. Sync Flow**
   - **Autark:** Sync flow - User initiates → IPFS → Safe approval → ENS in one command
   - **Catalogue:** Async flow - Curator approval is the gate → Then auto-execution
   - **Why:** Releases need governance approval before resources are spent

2. **Directory vs. Individual Files**
   - **Autark:** Uploads directories as one CID (whole frontend = one version)
   - **Catalogue:** Uploads individual files (audio, cover, metadata get separate CIDs for NFT metadata)
   - **Solution:** Extract individual file CIDs from IPFS directory structure

3. **Multiple Safe Transactions**
   - **Autark:** Single Safe TX per deploy (setContentHash for entire frontend)
   - **Catalogue:** Three Safe TXs per release (setContenthash + setText for zoraNFT + setText for metadataURI)
   - **Why:** Need to store both IPFS reference AND NFT reference in ENS

4. **Database Coordination**
   - **Autark:** Stateless - doesn't track deployment state
   - **Catalogue:** Stateful - tracks IPFS hashes, NFT tokenId, ENS subname in DB
   - **Solution:** Update DB after each stage (IPFS, Factory, ENS)

5. **Metadata Structure**
   - **Autark:** Frontend HTML/JS (any structure)
   - **Catalogue:** ERC721 metadata JSON standard (required by NFT)
   - **Solution:** Build structured metadata with animation_url, image, properties fields

---

## 9. Configuration Questions to Clarify

1. **Environment Setup**
   - [ ] Is `palaupalau.eth` already owned on Mainnet?
   - [ ] What is the Safe multisig address on L1 (Mainnet)?
   - [ ] What is the approval threshold (e.g., 2-of-3, 3-of-5)?
   - [ ] What is the Factory contract address on L1?
   - [ ] What is the Zora Creator address on Base L2?

2. **Storacha/IPFS Setup**
   - [ ] Is `storacha` CLI installed and available?
   - [ ] What is the Storacha API key (environment: `STORACHA_TOKEN`)?
   - [ ] Confirm 12-month pinning plan is active?

3. **SDK Imports from Autark**
   - ✅ Use `@safe-global/sdk-starter-kit` (what Autark uses)
   - ✅ Extract `encodeContentHash`, `namehash` from `autark/lib/ens`
   - ✅ Use Storacha CLI via `execSync` (what Autark does)
   - ✅ Study Safe client patterns from `autark/lib/safe/client.ts`

4. **Curator Coordination**
   - [ ] Will curators sign via Safe UI or programmatically?
   - [ ] Is there a Safe Transaction Service URL for monitoring?

---

## 10. Implementation Strategy (Week 2: Days 6-10)

### Days 6-7: IPFS/Storacha Integration

**Focus:** Study Autark's IPFS patterns, then implement our wrapper

1. **Study Autark's Implementation**
   - [ ] Examine `~/.nvm/.../autark/dist/lib/ipfs/upload.d.ts` (types)
   - [ ] Examine `~/.nvm/.../autark/dist/lib/ipfs/upload.js` (implementation)
   - [ ] Understand Storacha CLI integration

2. **Implement `lib/services/ipfs.ts`**
   - [ ] Wrap Storacha CLI (`execSync('storacha upload ...')`)
   - [ ] Implement 12-month pinning
   - [ ] Handle multiple files → individual CIDs
   - [ ] Error handling + logging

3. **Implement Metadata Building**
   - [ ] Create ERC721 standard JSON structure
   - [ ] Include IPFS references + properties

4. **Test**
   - [ ] Upload sample audio file
   - [ ] Verify CID returned
   - [ ] Verify Storacha pin expiration

### Days 8-9: Safe + Factory + ENS Integration

**Focus:** Study Autark's Safe patterns, then build orchestration layer

1. **Study Autark's Implementation**
   - [ ] Examine `~/.nvm/.../autark/dist/lib/safe/client.d.ts` (types)
   - [ ] Examine `~/.nvm/.../autark/dist/lib/safe/client.js` (Safe SDK wrapper)
   - [ ] Understand `initSafeClient()` + `sendSafeTransaction()`

2. **Implement `lib/services/safe.ts`**
   - [ ] Wrap `@safe-global/sdk-starter-kit`
   - [ ] Implement `initSafeClient()` with curator Safe address
   - [ ] Implement `sendSafeTransaction()` for TX batching
   - [ ] Error handling + logging

3. **Implement `lib/services/ens.ts`**
   - [ ] Study Autark's ENS utilities (encodeContentHash, namehash)
   - [ ] Build three Safe TXs: setContenthash + setText(zoraNFT) + setText(metadataURI)
   - [ ] Use correct Public Resolver address

4. **Implement `lib/services/factory.ts`**
   - [ ] Prepare Factory.publishRelease() call
   - [ ] Encode with correct parameters

5. **Implement `lib/services/publishRelease.ts`** (Orchestration)
   - [ ] 3A: Call uploadReleaseToIPFS()
   - [ ] 3B: Call Factory via Safe TX
   - [ ] 3C: Call ENS Resolver via Safe TX (three TXs)
   - [ ] 3D: Update database

6. **Implement `POST /api/internal/publish-release`**
   - [ ] Trigger from approval threshold detection
   - [ ] Call orchestration service
   - [ ] Return results for monitoring

7. **Test**
   - [ ] Dry-run Safe TX creation on testnet
   - [ ] Verify TX encoding is correct
   - [ ] Test threshold detection

### Day 10: Integration Testing

1. **End-to-End Flow**
   - [ ] Submit release → status: pending
   - [ ] Curators approve → threshold met
   - [ ] Auto-publish triggered
   - [ ] IPFS pins successfully
   - [ ] Safe TX created + queued
   - [ ] ENS updated with subname
   - [ ] Database reflects published state

2. **Verification**
   - [ ] ENS subname resolves correctly
   - [ ] IPFS content accessible via gateway
   - [ ] Metadata JSON valid ERC721
   - [ ] Safe TXs visible in Safe UI

---

## Next Step

**→ BEGIN NOW:** Examine Autark's source code in detail to understand the exact Safe API patterns and IPFS implementation we'll adapt.

**Files to study:**
1. `~/.nvm/.../autark/dist/lib/safe/client.d.ts` (Safe SDK patterns)
2. `~/.nvm/.../autark/dist/lib/safe/client.js` (Implementation)
3. `~/.nvm/.../autark/dist/lib/ipfs/upload.d.ts` (IPFS patterns)
4. `~/.nvm/.../autark/dist/lib/ipfs/upload.js` (Implementation)
5. `~/.nvm/.../autark/dist/lib/ens/ens.d.ts` (ENS utilities)

