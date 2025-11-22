# 🚀 Corrected Release Publishing Flow (Curator Approval First)

## Executive Summary

The release publishing flow is **gated by curator approval via Safe multisig**. Once approval threshold is met, everything else happens automatically on the backend with no additional human intervention.

```
User Submits Release (Temp Storage)
    ↓
Curators Approve via Safe (Authorization Gate)
    ↓
Backend Job Triggered Automatically:
├─ IPFS Pin audio + metadata
├─ Call Factory → Mint NFT on Base L2
├─ Update ENS subname with content hash
└─ Update database → Status: published

Final State: ENS subname discoverable with all metadata + NFT reference
```

---

## Phase Flow (Week 2, Days 6-10)

### **Day 1-5 (Completed) ✅**
- Backend infrastructure running
- Database schema + CRUD operations tested
- API routes created for submit + approve + retrieve

### **Days 6-7: IPFS/Storacha Integration**
- Implement `lib/services/ipfs.ts` (wraps Storacha CLI)
- Build metadata JSON structure
- Test IPFS upload with mock files

### **Days 8-9: Safe + Factory Integration**
- Implement `lib/services/safe.ts` (wraps Safe SDK)
- Implement `lib/services/ens.ts` (ENS transaction prep)
- Create orchestration service
- Test Safe TX creation (dry-run on testnet)

### **Day 10: Integration Testing**
- End-to-end: Submit → Approve → Auto-execute pipeline
- Verify ENS resolution works
- Verify IPFS accessibility

---

## Detailed Flow Explanation

### **STEP 1: Release Submission (Days 1-5, Already Complete)**

```typescript
// POST /api/submit
// User submits: title, description, artists, MP3 file

// Backend:
1. Parse FormData from request
2. Validate fields + file type
3. Generate release ID: PDA-1763227416871-8506
4. Store audio file temporarily: /tmp/PDA-1763227416871-8506.mp3
5. Create release record in database
   {
     id: "PDA-1763227416871-8506",
     title: "Release Title",
     status: "pending",
     temp_file_path: "/tmp/...",
     createdBy: "0x1111...",
     createdAt: 1763227416
   }
6. Return: { releaseId, status: "pending" }

// Database State: Release is PENDING (waiting for approval)
// Frontend shows: "Awaiting curator approval..."
```

**Key Point:** Audio file is in TEMPORARY storage, NOT IPFS yet. This is fast and free.

---

### **STEP 2: Curator Approval (Multisig Gate) ✅**

```typescript
// POST /api/curator/approve
// Curators submit: releaseId, signature

// Backend:
1. Validate curator signature
2. Create approval record in database
3. Count approvals for this release
4. Check if threshold met (e.g., 3/3 curators)

IF approvals.length >= APPROVAL_THRESHOLD:
  └─ Trigger async job: publishRelease(releaseId)

// Database State: Release is now APPROVED
// Next: Backend job runs automatically
```

**This is the Authorization Gate.** No further curator interaction needed.

---

### **STEP 3: Backend Publishes Release (Automatic After Approval)**

The backend job orchestrates everything automatically:

```typescript
// lib/services/publishRelease.ts
export async function publishReleaseEnd2End(releaseId: string) {
  
  // ========================================
  // 3A. IPFS PINNING (Days 6-7)
  // ========================================
  console.log('📌 STEP 3A: Pinning to IPFS...');
  
  const release = await db.releases.get(releaseId);
  const tempFilePath = release.temp_file_path; // /tmp/PDA-xxx.mp3
  
  // Build metadata JSON (ERC721 standard)
  const metadata = {
    name: release.title,
    description: release.description,
    image: `ipfs://QmCoverHash`,  // To be set when cover extracted
    animation_url: `ipfs://QmAudioHash`, // To be set
    properties: {
      catalogueId: releaseId,
      artists: release.artists,
      duration: release.duration,
      submittedBy: release.createdBy,
      approvalCount: 3,
      approvedAt: Date.now()
    }
  };
  
  // Pin audio file to IPFS via Storacha
  const audioBuffer = fs.readFileSync(tempFilePath);
  const audioIPFSHash = await uploadToIPFS(audioBuffer);
  // Returns: QmAudio123...
  
  // Extract cover art from ID3 tags
  const coverBuffer = await extractCoverFromMP3(tempFilePath);
  const coverIPFSHash = await uploadToIPFS(coverBuffer);
  // Returns: QmCover456...
  
  // Update metadata with actual IPFS hashes
  metadata.animation_url = `ipfs://${audioIPFSHash}`;
  metadata.image = `ipfs://${coverIPFSHash}`;
  
  // Pin metadata JSON to IPFS
  const metadataJSON = JSON.stringify(metadata);
  const metadataIPFSHash = await uploadToIPFS(metadataJSON);
  // Returns: QmMetadata789...
  
  console.log('✅ IPFS pinning complete');
  console.log(`   Audio: ${audioIPFSHash}`);
  console.log(`   Cover: ${coverIPFSHash}`);
  console.log(`   Metadata: ${metadataIPFSHash}`);
  
  // ========================================
  // 3B. ZORA NFT MINTING (Days 8-9)
  // ========================================
  console.log('🎨 STEP 3B: Minting NFT on Base L2...');
  
  // Create Safe transaction to call Factory.publishRelease()
  const factoryTx = {
    to: FACTORY_ADDRESS,
    value: '0',
    data: encodeFunction('publishRelease', [
      releaseId,
      `ipfs://${metadataIPFSHash}`,
      release.createdBy
    ])
  };
  
  // Send to Safe
  const safeClient = await initSafeClient({
    safeAddress: CURATOR_SAFE_ADDRESS,
    signerPrivateKey: process.env.FACTORY_SIGNER_KEY,
    rpcUrl: process.env.L1_RPC_URL
  });
  
  const factoryTxResult = await sendSafeTransaction(safeClient, factoryTx);
  // Returns: { safeTxHash, txServiceUrl, success }
  
  // Wait for Safe execution (curators approve)
  const txReceipt = await waitForSafeExecution(factoryTxResult.safeTxHash);
  
  // Parse event to get tokenId
  const releaseAddedEvent = parseEvent(txReceipt, 'ReleaseAdded');
  const tokenId = releaseAddedEvent.args.tokenId;
  
  console.log('✅ NFT minted on Base L2');
  console.log(`   Token ID: ${tokenId}`);
  console.log(`   Owner: ${release.createdBy}`);
  
  // ========================================
  // 3C. ENS SUBNAME REGISTRATION (Days 8-9)
  // ========================================
  console.log('📝 STEP 3C: Registering ENS subname...');
  
  const ensDomain = `pda-${releaseId.split('-')[1]}.palaupalau.eth`;
  const ensNode = namehash(ensDomain);
  
  // Create three Safe transactions for ENS
  const ensTxs = [
    {
      name: 'setContenthash',
      tx: {
        to: PUBLIC_RESOLVER_ADDRESS,
        value: '0',
        data: encodeFunction('setContenthash', [
          ensNode,
          encodeContentHash(metadataIPFSHash)
        ])
      }
    },
    {
      name: 'setText_zoraNFT',
      tx: {
        to: PUBLIC_RESOLVER_ADDRESS,
        value: '0',
        data: encodeFunction('setText', [
          ensNode,
          'zoraNFT',
          `base:0xZoraAddress/${tokenId}`
        ])
      }
    },
    {
      name: 'setText_metadataURI',
      tx: {
        to: PUBLIC_RESOLVER_ADDRESS,
        value: '0',
        data: encodeFunction('setText', [
          ensNode,
          'metadataURI',
          `ipfs://${metadataIPFSHash}`
        ])
      }
    }
  ];
  
  // Send all three to Safe
  const ensSafeTxHashes = [];
  for (const { name, tx } of ensTxs) {
    const result = await sendSafeTransaction(safeClient, tx);
    ensSafeTxHashes.push(result.safeTxHash);
    console.log(`✅ ${name} queued to Safe`);
  }
  
  // Wait for Safe execution
  for (const safeTxHash of ensSafeTxHashes) {
    await waitForSafeExecution(safeTxHash);
  }
  
  console.log(`✅ ENS updated: ${ensDomain}`);
  
  // ========================================
  // 3D. UPDATE DATABASE (Final Step)
  // ========================================
  console.log('💾 STEP 3D: Updating database...');
  
  await db.releases.update(releaseId, {
    status: 'published',
    mediaIPFSHash: audioIPFSHash,
    coverImageIPFSHash: coverIPFSHash,
    metadataURI: `ipfs://${metadataIPFSHash}`,
    zoraNFT: `base:0xZoraAddress/${tokenId}`,
    tokenId: tokenId.toString(),
    ensSubname: ensDomain,
    publishedAt: Date.now()
  });
  
  // Clean up temp file
  fs.unlinkSync(tempFilePath);
  
  console.log('✅ Release published!');
  
  return {
    releaseId,
    ensSubname: ensDomain,
    tokenId,
    ipfsHashes: {
      audio: audioIPFSHash,
      cover: coverIPFSHash,
      metadata: metadataIPFSHash
    }
  };
}
```

**Key Points:**
1. All Safe transactions use the **same Safe client** (curator multisig)
2. Safe coordinates ALL updates (Factory + ENS)
3. Backend waits for Safe execution before moving to next step
4. Temp file cleaned up at the end

---

### **STEP 4: Final State**

After all steps complete, the release is fully published:

```
ENS Subname: pda-001.palaupalau.eth
├─ Content Hash: Encoded(QmMetadata789...)
│  └─ Points to IPFS metadata JSON
│
├─ Text Record "zoraNFT": base:0xZoraAddress/123
│  └─ References NFT on Base L2
│
├─ Text Record "metadataURI": ipfs://QmMetadata789...
│  └─ Direct link to metadata on IPFS
│
└─ Address Record: 0xCreatorAddress
   └─ Creator's wallet address

IPFS Content (Immutable):
├─ QmMetadata789... (JSON with references)
├─ QmAudio123... (MP3 file)
└─ QmCover456... (Cover image)

Base L2 NFT:
├─ Token ID: 123
├─ Owner: 0xCreatorAddress
├─ Metadata URI: ipfs://QmMetadata789...
└─ Discoverable via base:0xZoraAddress/123

Database Record:
├─ Status: published
├─ All IPFS hashes stored
├─ ENS subname stored
├─ Token ID stored
└─ Temp file deleted
```

**User can now:**
1. Visit `pda-001.palaupalau.eth` → See metadata via ENS
2. View NFT on Base L2 via OpenSea/Zora
3. Access audio/cover via IPFS gateway
4. Everything is immutable and permanent

---

## Service Layer Implementation

```typescript
// lib/services/ipfs.ts
import { execSync } from 'child_process';

export async function uploadToIPFS(data: Buffer | string): Promise<string> {
  // Use Storacha CLI
  const cid = execSync(`storacha upload`, { 
    input: data 
  }).toString().trim();
  
  // Pin for 12 months
  execSync(`storacha pin ${cid} --expiration 12-months`);
  
  return cid;
}

// lib/services/safe.ts
import { initSafeClient, sendSafeTransaction } from '@safe-global/sdk-starter-kit';

export async function getSafeClient() {
  return await initSafeClient({
    safeAddress: process.env.CURATOR_SAFE_ADDRESS,
    signerPrivateKey: process.env.FACTORY_SIGNER_KEY,
    rpcUrl: process.env.L1_RPC_URL,
    apiKey: process.env.SAFE_API_KEY
  });
}

export async function sendSafeTx(tx: SafeTransaction) {
  const client = await getSafeClient();
  return await sendSafeTransaction(client, tx);
}

// lib/services/ens.ts
import { encodeContentHash, namehash } from 'autark/lib/ens';

export function prepareENSTransactions(releaseId, metadataIPFSHash, tokenId) {
  const ensDomain = `pda-${releaseId}.palaupalau.eth`;
  const ensNode = namehash(ensDomain);
  
  return [
    {
      to: PUBLIC_RESOLVER_ADDRESS,
      value: '0',
      data: encodeFunction('setContenthash', [
        ensNode,
        encodeContentHash(metadataIPFSHash)
      ])
    },
    // ... more ENS transactions
  ];
}

// lib/services/publishRelease.ts
export async function publishReleaseEnd2End(releaseId: string) {
  // Orchestrates all three steps above
}
```

---

## API Routes

### **POST /api/submit** (Days 1-5, Complete ✅)
- User submits release form
- Backend stores temp file + creates DB record
- Returns: `{ releaseId, status: "pending" }`

### **POST /api/curator/approve** (Days 1-5, Complete ✅)
- Curator submits signature
- Backend validates + counts approvals
- **If threshold met → Triggers `/api/internal/publish-release`**
- Returns: `{ releaseId, approvalCount, thresholdMet }`

### **GET /api/releases/[id]** (Days 1-5, Complete ✅)
- Frontend retrieves release + approvals
- Returns: `{ release, approvals }`

### **POST /api/internal/publish-release** (NEW - Days 6-10)
- **Triggered automatically when approval threshold met**
- **Not exposed to frontend - internal backend job**
- Orchestrates: IPFS → Factory → ENS
- Returns: `{ ensSubname, tokenId, ipfsHashes }`

---

## Timeline

| Phase | Task | Status |
|-------|------|--------|
| Days 1-5 | Database + API routes | ✅ Complete |
| Days 6-7 | IPFS/Storacha integration | ⏳ Next |
| Days 8-9 | Safe + Factory + ENS | ⏳ Next |
| Day 10 | End-to-end testing | ⏳ Next |

---

## Key Differences from Original Implementation Guide

| Aspect | Guide Said | We're Doing | Reason |
|--------|-----------|-----------|--------|
| **IPFS Timing** | After approval ✅ | After approval ✅ | Correct |
| **Factory Call** | Backend direct call | Via Safe TX | Governance |
| **ENS Update** | After NFT mint | Via Safe TX | Governance |
| **Safe Role** | Final gate | Authorization gate + orchestrator | More accurate |
| **Backend Async** | Single job | Job waits for Safe execution | More robust |

---

## Autark Patterns We're Using

✅ **Safe SDK Starter Kit** - `initSafeClient()`, `sendSafeTransaction()`  
✅ **Storacha CLI** - IPFS upload + pinning  
✅ **ENS utilities** - `encodeContentHash()`, `namehash()`  
✅ **Error handling patterns** - Result<T> pattern  
✅ **Service layer architecture** - Modular, testable services  

❌ **NOT using** - Autark's frontend deployment logic (not applicable)

---

## Ready for Implementation

This flow is ready to implement. Should we begin with **Days 6-7 (IPFS/Storacha integration)**?

