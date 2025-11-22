# 🚀 Autark-Aligned Release Publishing Flow

## Executive Summary

**YES, completely aligned!** 

After studying Autark's pattern, here's the recommended flow that borrows Autark's proven architecture while adapting for audio releases:

```
Release Approval Threshold Met
    ↓
1. IPFS Pinning (Days 6-7)
   └─ Upload audio + metadata JSON to IPFS → Get CIDs
    ↓
2. Create Zora NFT (Days 11-12)
   └─ Call Factory contract → Mint on Zora → Capture tokenId
    ↓
3. Create Safe Transactions (Autark Pattern ← HERE)
   ├─ createDeploymentPlan() [ADAPTED]
   │  ├─ Prepare setContenthash transaction
   │  ├─ Prepare setText for zoraNFT + metadataURI
   │  └─ Return bundled transaction data
   │
   └─ Safe executes (threshold-based curator approval)
      └─ ENS subname updated with IPFS CID + metadata
    ↓
4. Final State
   └─ pda-001.palaupalau.eth → contentHash (IPFS metadata)
                             → text record "zoraNFT" = base:0x.../tokenId
                             → text record "metadataURI" = ipfs://QmMetadata...
```

---

## How Autark Does It (Current Pattern)

Autark's deploy flow:

```typescript
// 1. Upload to IPFS
const uploadResult = await uploadToIPFS(directory);
// Returns: { cid: "QmXyz...", size: 1024, url: "ipfs://QmXyz..." }

// 2. Create deployment plan
const plan = await createDeploymentPlan(
  parentDomain: 'palaupalau.eth',
  versionLabel: 'v1-2025',  // or release ID
  cid: uploadResult.cid,
  safeAddress: CURATOR_SAFE,
  chainId: 1,  // Mainnet
  network: 'mainnet'
);
// Returns:
// {
//   createSubdomainTx: { to, value, data },
//   setContenthashTx: { to, value, data },
//   fullDomain: 'v1-2025.palaupalau.eth',
//   contentHash: '0x...'
// }

// 3. Send to Safe
const result = await sendSafeTransaction(client, plan.setContenthashTx);
// Returns: { safeTxHash, txServiceUrl, success }

// 4. Safe UI → Curators approve → Execute when threshold met
```

---

## How We Should Adapt It (For Catalogue Releases)

### Key Insight: Autark Creates TWO Safe Transactions

1. **createSubdomainTx** - Creates the subdomain (one-time per domain)
2. **setContenthashTx** - Sets the content hash (updatable per version)

For releases, we only need **setContenthashTx** since `palaupalau.eth` parent domain already exists.

### Proposed Flow (Autark-Inspired):

```typescript
// ============================================
// Step 1: IPFS Pinning (After Approval)
// ============================================
const releaseId = 'PDA-001';
const release = await db.releases.getReleaseById(releaseId);

// Build metadata JSON (standard ERC721 + custom fields)
const metadata = {
  name: release.title,
  description: release.description,
  image: `ipfs://${release.coverImageIPFSHash}`,
  animation_url: `ipfs://${release.mediaIPFSHash}`,
  properties: {
    catalogueId: releaseId,
    artists: release.artists,
    duration: release.duration,
    submittedBy: release.createdBy,
    approvals: [...], // List of curator signatures
  }
};

// Upload everything to IPFS
const ipfsResult = await uploadReleaseToIPFS(releaseId, {
  audioFile: tempAudioPath,
  coverFile: tempCoverPath,
  metadataJSON: metadata
});
// Returns: { 
//   mediaIPFSHash: 'QmAudio...',
//   coverIPFSHash: 'QmCover...',
//   metadataIPFSHash: 'QmMetadata...'
// }

// ============================================
// Step 2: Mint Zora NFT
// ============================================
const zoraResult = await mintNFTViaFactory(
  releaseId,
  `ipfs://${ipfsResult.metadataIPFSHash}`,
  release.createdBy
);
// Returns: { tokenId, txHash }

// ============================================
// Step 3: CREATE SAFE TRANSACTIONS (Autark Pattern)
// ============================================

// ADAPTED: Instead of createDeploymentPlan(), we create custom transactions
const ensTx = {
  // Transaction 1: Set content hash (Autark's setContenthashTx pattern)
  setContenthashTx: {
    to: PUBLIC_RESOLVER_ADDRESS,  // ENS PublicResolver
    value: '0',
    data: encodeFunctionCall('setContenthash', [
      namehash(`pda-${releaseId}.palaupalau.eth`),
      encodeContentHash(ipfsResult.metadataIPFSHash)
    ])
  },
  
  // Transaction 2: Set text record for zoraNFT
  setTextZoraTx: {
    to: PUBLIC_RESOLVER_ADDRESS,
    value: '0',
    data: encodeFunctionCall('setText', [
      namehash(`pda-${releaseId}.palaupalau.eth`),
      'zoraNFT',
      `base:0xZoraAddress/${zoraResult.tokenId}`
    ])
  },
  
  // Transaction 3: Set text record for metadataURI
  setTextMetadataTx: {
    to: PUBLIC_RESOLVER_ADDRESS,
    value: '0',
    data: encodeFunctionCall('setText', [
      namehash(`pda-${releaseId}.palaupalau.eth`),
      'metadataURI',
      `ipfs://${ipfsResult.metadataIPFSHash}`
    ])
  }
};

// ============================================
// Step 4: SEND TO SAFE (Autark Pattern)
// ============================================

// Initialize Safe client (from Autark)
const safeClient = await initSafeClient({
  safeAddress: CURATOR_SAFE_ADDRESS,
  signerPrivateKey: process.env.OWNER_PRIVATE_KEY, // Parent domain owner
  rpcUrl: process.env.L1_RPC_URL,
  apiKey: process.env.SAFE_API_KEY
});

// Send all three transactions together
const safeTxResults = [];
for (const [name, tx] of Object.entries(ensTx)) {
  const result = await sendSafeTransaction(safeClient, tx);
  safeTxResults.push({
    name,
    safeTxHash: result.safeTxHash,
    txServiceUrl: result.txServiceUrl
  });
  console.log(`✅ ${name} queued to Safe`);
}

// ============================================
// Step 5: Update Database
// ============================================
await db.releases.update(releaseId, {
  status: 'approved',  // Not yet published, but approved for ENS
  mediaIPFSHash: ipfsResult.mediaIPFSHash,
  coverImageIPFSHash: ipfsResult.coverImageIPFSHash,
  metadataURI: `ipfs://${ipfsResult.metadataIPFSHash}`,
  zoraNFT: `base:0xZoraAddress/${zoraResult.tokenId}`,
  tokenId: zoraResult.tokenId,
  safeTxHashes: safeTxResults.map(r => r.safeTxHash),
  approvedAt: Date.now()
});

// ============================================
// Step 6: Safe Execution
// ============================================
// Curators see Safe UI with 3 transactions:
// - Set ENS content hash
// - Set ENS text record "zoraNFT"
// - Set ENS text record "metadataURI"
// When threshold met → All execute together
// Result: pda-001.palaupalau.eth fully configured
```

---

## Final State After Safe Execution

```
pda-001.palaupalau.eth (ENS Subname)
├── Content Hash: QmMetadata... (points to IPFS metadata)
├── Text Record "zoraNFT": base:0xZoraAddress/123
├── Text Record "metadataURI": ipfs://QmMetadata...
└── Address Record: 0xCreatorAddress

Metadata at ipfs://QmMetadata... contains:
├── name: "Release Title"
├── description: "..."
├── image: ipfs://QmCover...
├── animation_url: ipfs://QmAudio...
└── properties: { catalogueId, artists, duration, ... }

Zora NFT on Base L2:
├── Token ID: 123
├── Owner: 0xCreatorAddress
├── Metadata URI: ipfs://QmMetadata...
└── Can be discovered via base:0xZoraAddress/123
```

---

## Implementation Architecture (Autark-Inspired Services)

```typescript
// lib/services/ipfs.ts
export async function uploadReleaseToIPFS(releaseId: string, files: {
  audioFile: string,
  coverFile: string,
  metadataJSON: object
}): Promise<IPFSResult> {
  // Adapted from Autark's uploadToIPFS
  // Returns: { mediaIPFSHash, coverIPFSHash, metadataIPFSHash }
}

// lib/services/safe.ts
export async function initSafeClient(config): Promise<SafeClient> {
  // Direct import from Autark
  return await initSafeClient(config);
}

export async function sendSafeTransaction(
  client: SafeClient,
  tx: SafeTransaction
): Promise<SafeTransactionResult> {
  // Direct import from Autark
  return await sendSafeTransaction(client, tx);
}

// lib/services/ens.ts
export async function prepareENSTransactions(
  releaseId: string,
  metadataIPFSHash: string,
  zoraNFT: string
): Promise<ENSTransactionBatch> {
  // Adapted from Autark's prepareUpdateEnsArgs
  
  const domainName = `pda-${releaseId}.palaupalau.eth`;
  const node = namehash(domainName);
  
  return {
    setContenthashTx: {
      to: PUBLIC_RESOLVER_ADDRESS,
      value: '0',
      data: encodeFunction('setContenthash', [node, encodeContentHash(metadataIPFSHash)])
    },
    setTextZoraTx: {
      to: PUBLIC_RESOLVER_ADDRESS,
      value: '0',
      data: encodeFunction('setText', [node, 'zoraNFT', zoraNFT])
    },
    setTextMetadataTx: {
      to: PUBLIC_RESOLVER_ADDRESS,
      value: '0',
      data: encodeFunction('setText', [node, 'metadataURI', `ipfs://${metadataIPFSHash}`])
    }
  };
}

// lib/services/publishRelease.ts
export async function publishReleaseEnd2End(releaseId: string) {
  // ORCHESTRATION LAYER (New - ties everything together)
  
  // 1. Pin to IPFS
  const ipfsResult = await uploadReleaseToIPFS(...);
  
  // 2. Mint NFT
  const zoraResult = await mintNFTViaFactory(...);
  
  // 3. Prepare ENS transactions
  const ensTxs = await prepareENSTransactions(
    releaseId,
    ipfsResult.metadataIPFSHash,
    `base:0xZora/${zoraResult.tokenId}`
  );
  
  // 4. Send to Safe
  const safeClient = await initSafeClient(safeConfig);
  const safeTxHashes = [];
  for (const tx of Object.values(ensTxs)) {
    const result = await sendSafeTransaction(safeClient, tx);
    safeTxHashes.push(result.safeTxHash);
  }
  
  // 5. Update database
  await db.releases.update(releaseId, {
    mediaIPFSHash: ipfsResult.mediaIPFSHash,
    metadataURI: `ipfs://${ipfsResult.metadataIPFSHash}`,
    zoraNFT: `base:0xZora/${zoraResult.tokenId}`,
    safeTxHashes,
    status: 'awaiting_curator_approval'
  });
  
  return { ipfsResult, zoraResult, safeTxHashes };
}
```

---

## API Route Structure

```typescript
// POST /api/internal/publish-release
// Called when curator approval threshold is met
export async function POST(request: NextRequest) {
  const { releaseId } = await request.json();
  
  try {
    // Execute full flow
    const result = await publishReleaseEnd2End(releaseId);
    
    return NextResponse.json({
      success: true,
      releaseId,
      status: 'awaiting_curator_approval',
      safeTxHashes: result.safeTxHashes,
      ipfsHashes: {
        media: result.ipfsResult.mediaIPFSHash,
        metadata: result.ipfsResult.metadataIPFSHash
      },
      nft: {
        tokenId: result.zoraResult.tokenId,
        network: 'base'
      },
      safeDashboardUrl: `https://app.safe.global/...`
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

## Key Alignment with Original Discussion

| Aspect | Original Plan | Autark Pattern | Our Implementation |
|--------|---------------|----------------|-------------------|
| **IPFS After Approval** | ✅ Pin after curator approval | ✅ Same pattern | ✅ Implemented |
| **Zora NFT Minting** | ✅ Call Factory contract | ⚠️ Not in Autark scope | ✅ After IPFS, before ENS |
| **ENS Update** | ✅ Set content hash + metadata | ✅ setContenthash + setText | ✅ Three Safe TXs |
| **Safe Coordination** | ✅ Multisig with threshold | ✅ Core pattern | ✅ Batch transactions |
| **Final State** | ✅ ENS → IPFS + NFT | ⚠️ Autark only does IPFS | ✅ ENS → IPFS + NFT refs |

---

## Why This Approach?

### ✅ Advantages
1. **Reuses Autark's proven Safe patterns** - No reinventing the wheel
2. **Keeps orchestration in backend** - Cleaner separation of concerns
3. **Batch Safe transactions** - All three ENS updates execute together
4. **Clear async boundaries** - Each step is independent
5. **Database stays in sync** - Update after each stage
6. **Factory stays simple** - Just mints NFTs, doesn't manage ENS

### ⚠️ Considerations
1. **Three Safe transactions** - Adds complexity but ensures atomicity
2. **Requires Safe approval** - Curators must approve ENS changes too
3. **Public resolver must exist** - Parent domain owner controls it

---

## Recommendation

**This Autark-aligned approach is optimal because:**
1. ✅ Borrows battle-tested Safe patterns
2. ✅ Separates concerns (Backend handles orchestration)
3. ✅ Matches original architectural intent
4. ✅ ENS subname truly becomes the release entry point
5. ✅ All data (IPFS CID, NFT, metadata) accessible via single ENS lookup

**Should we proceed with this implementation?**

