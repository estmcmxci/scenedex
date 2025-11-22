# 🚀 Week 2 Kickoff: IPFS → Factory → ENS Pipeline (Days 6-10)

## Status

✅ **Week 1 Complete**
- Database setup (PostgreSQL on Railway)
- CRUD services fully tested
- API routes complete + tested with real database

📍 **We are here:** End of Day 5, Starting Week 2

---

## The Complete Flow We're Implementing

```
STEP 1: Release Submitted (Days 1-5 ✅)
│
├─ Audio file → /tmp storage
├─ Metadata → Database
└─ Status: "pending"

STEP 2: Curators Approve via Safe (Authorization Gate) ✅
│
├─ Create Safe TX: "Approve PDA-001"
├─ Curators sign in Safe UI
└─ When threshold met → Trigger backend job

STEP 3: Backend Automatically Executes (Days 6-10 - NEXT)
│
├─ 3A. IPFS Pin audio + metadata → Get CIDs (Days 6-7)
├─ 3B. Call Factory via Safe TX → Mint NFT (Days 8-9)
├─ 3C. Update ENS via Safe TX (Days 8-9)
└─ 3D. Update database (Days 8-9)

FINAL: ENS subname with all metadata + NFT reference
```

---

## Days 6-7: IPFS/Storacha Integration

### What We're Building

Service to pin release audio + metadata to IPFS via Storacha CLI.

```typescript
lib/services/ipfs.ts
├── uploadReleaseToIPFS(releaseId)
│   ├── Create /tmp/release-PDA-xxx/ directory
│   ├── Copy audio + cover + metadata JSON
│   ├── Execute: storacha up /tmp/release-PDA-xxx/
│   └── Extract CIDs from output
│       ├── mediaIPFSHash: QmAudio...
│       ├── coverIPFSHash: QmCover...
│       └── metadataIPFSHash: QmMetadata...
│
└── Helper functions
    ├── getIPFSUrls(cid) → [gateway URLs]
    └── cleanup(tempDir) → Remove /tmp files
```

### Dependencies to Install

```bash
npm install @safe-global/sdk-starter-kit multiformats ox varint
```

### Autark Pattern to Follow

From examining Autark's code:
- Use `execSync('storacha up ...')` to call Storacha CLI
- Extract CID using regex: `/bafy[a-z0-9]+/i`
- Return `{ cid, size, url }`
- Provide multiple gateway URLs for fallback

### Implementation Guide

See: `AUTARK-PATTERNS-ANALYSIS.md` Section 2

### Success Criteria

- [ ] Can upload sample MP3 file to IPFS
- [ ] CID returned and verified
- [ ] Can access via multiple IPFS gateways
- [ ] Storacha pinning confirmed for 12 months

---

## Days 8-9: Safe + Factory + ENS Integration

### What We're Building

Three services to handle blockchain interactions:

```typescript
lib/services/safe.ts
├── getSafeClient() → Initialize Safe SDK
├── sendSafeTransaction(client, tx) → Send + track

lib/services/ens.ts
├── encodeContentHash(cid) → Convert CID to ENS format
├── prepareENSTransactions(releaseId, metadataHash, tokenId)
│   └── Returns three Safe TXs:
│       ├── setContenthash(node, encodedCID)
│       ├── setText(node, 'zoraNFT', 'base:0xZora/tokenId')
│       └── setText(node, 'metadataURI', 'ipfs://...')

lib/services/factory.ts
├── prepareFactoryCall(releaseId, metadataURI)
│   └── Returns Safe TX for Factory.publishRelease()

lib/services/publishRelease.ts
└── publishReleaseEnd2End(releaseId) → Orchestrates all steps
    ├── 3A. Upload to IPFS
    ├─B. Call Factory via Safe
    ├─ 3C. Update ENS via Safe
    └─ 3D. Update database

app/api/internal/publish-release/route.ts
└── POST endpoint (auto-triggered on approval threshold)
    ├── Input: { releaseId }
    ├── Call: publishReleaseEnd2End()
    └── Output: { ensSubname, tokenId, ipfsHashes }
```

### Safe Pattern to Follow

From examining Autark's code:
- Use `@safe-global/sdk-starter-kit` to create client
- Config: `{ provider, signer, safeAddress, apiKey }`
- Send multiple TXs: `client.send({ transactions: [tx1, tx2, tx3] })`
- Returns `safeTxHash` for tracking

### ENS Pattern to Follow

From examining Autark's code:
- Use `multiformats/cid` to parse IPFS CID
- Encode with IPFS_CODEC (0xe3) + varint
- Use Public Resolver contract address
- Three separate `setText` calls via Safe

### Implementation Guide

See: `AUTARK-PATTERNS-ANALYSIS.md` Sections 1, 3, 4

### Success Criteria

- [ ] Safe client initializes with mainnet credentials
- [ ] Three Safe TXs created with correct encoding
- [ ] ENS domain hash computed correctly
- [ ] Factory call encoded correctly
- [ ] All TXs visible in Safe UI when executed
- [ ] No errors in TX execution on testnet

---

## Day 10: Integration Testing

### What We're Verifying

Complete end-to-end release lifecycle:

```
1. POST /api/submit
   ├─ Submit: { title, description, artists, audioFile }
   └─ Response: { releaseId, status: "pending" }

2. POST /api/curator/approve (×3)
   ├─ Curator 1 submits signature
   ├─ Curator 2 submits signature
   ├─ Curator 3 submits signature → Threshold met
   └─ AUTO-TRIGGERED: POST /api/internal/publish-release

3. POST /api/internal/publish-release (Auto)
   ├─ IPFS: Upload files → Get CIDs
   ├─ Factory: Mint NFT on Base → Get tokenId
   ├─ ENS: Set three records via Safe
   └─ DB: Update status to "published"

4. GET /api/releases/[id]
   ├─ Returns: {
   │   id, title, status: "published",
   │   mediaIPFSHash, metadataURI,
   │   zoraNFT, tokenId,
   │   ensSubname,
   │   approvals: [...]
   └─ }

5. Verify Results
   ├─ ENS subname resolves correctly
   ├─ IPFS content accessible
   ├─ NFT minted on Base L2
   └─ Database reflects published state
```

### Success Criteria

- [ ] Submit → Pending works
- [ ] Three approvals → Threshold detection works
- [ ] Auto-publish triggered correctly
- [ ] IPFS pinning succeeds
- [ ] Safe TXs created + queued
- [ ] ENS subname fully configured
- [ ] NFT minted on Base L2
- [ ] All data accessible via GET endpoint

---

## Environment Setup Checklist

Before starting:

- [ ] Verify `storacha` CLI installed: `storacha --version`
- [ ] Set environment variables:
  ```bash
  L1_RPC_URL=https://ethereum-rpc.publicnode.com
  CURATOR_SAFE_ADDRESS=0x...
  CURATOR_SIGNER_KEY=0x...
  SAFE_API_KEY=...
  STORACHA_TOKEN=...
  PALAUPALAU_ENS_DOMAIN=palaupalau.eth
  FACTORY_ADDRESS=0x...
  ZORA_ADDRESS=0x...
  ```
- [ ] Dependencies installed:
  ```bash
  npm install @safe-global/sdk-starter-kit multiformats ox varint
  ```
- [ ] `.env.local` updated with credentials

---

## Documents to Reference

1. **CORRECTED-RELEASE-FLOW.md** - Complete flow with code examples
2. **AUTARK-INTEGRATION-STRATEGY.md** - Updated with correct architecture + implementation roadmap
3. **AUTARK-PATTERNS-ANALYSIS.md** - Exact patterns extracted from Autark source code
4. **AUTARK-STRATEGY-ANALYSIS.md** - Analysis of what to keep/throw out

---

## Key Insights from Autark Source Analysis

1. **Safe SDK is simple** - Just wrap `createSafeClient()` and `client.send()`
2. **Storacha upload is straightforward** - `execSync('storacha up ...')` and extract CID
3. **ENS encoding requires libraries** - Use `multiformats`, `varint`, `ox`
4. **Batch transactions** - Safe can send 3 TXs at once
5. **Error handling** - Use try-catch + Result<T> pattern

---

## Timeline

| Phase | Task | Status |
|-------|------|--------|
| Days 1-5 | Database + API routes | ✅ Complete |
| Days 6-7 | IPFS/Storacha | ⏳ Next (Now) |
| Days 8-9 | Safe + Factory + ENS | ⏳ Next |
| Day 10 | Integration testing | ⏳ Next |

---

## Starting Now: Days 6-7

**First task:** Create `lib/services/ipfs.ts` following Autark's pattern.

See: `AUTARK-PATTERNS-ANALYSIS.md` Section 2 for exact implementation.

**Ready? Let's build!** 🚀

