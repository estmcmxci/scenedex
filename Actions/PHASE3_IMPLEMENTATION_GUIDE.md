# 🚀 PHASE 3 IMPLEMENTATION GUIDE
## Breaking Down the 5 Focus Points

**Reference Documents:**
- `technical-architecture.svg` - Complete system flow
- `execution-macro.md` - Phased rollout timeline
- `PRODUCT_READINESS_ANALYSIS.md` - Current readiness state

---

## 🎯 THE 5 PHASE 3 FOCUS POINTS BREAKDOWN

### **1️⃣ REAL BACKEND INTEGRATION**

**What This Means:**
Replace MSW mock handlers with actual API endpoints that connect to real databases, services, and blockchain infrastructure.

**Current State (Phase 2):**
```typescript
// Mock handler - lives in lib/mocks/handlers/releases.ts
POST /api/submit → Creates mock release → Stores in Zustand
POST /api/curator/approve → Updates mock state → Returns success
```

**Phase 3 Reality:**
```typescript
// Real backend - new services to build
POST /api/submit → 
  1. Validate input against ReleaseSubmissionSchema
  2. Store in real database (PostgreSQL/MongoDB)
  3. Create IPFS upload job (async)
  4. Return releaseId + status='pending'
  
POST /api/curator/approve →
  1. Verify curator credentials
  2. Check multisig threshold met
  3. Call Factory.sol contract
  4. Update DB with approval metadata
  5. Emit events for indexing
```

**Architecture Path (from SVG):**
```
Web Interface (Frontend)
    ↓
Access Control (Wallet Connect)
    ↓
Content Storage (IPFS/Storacha)
    ↓ Upload + get CID
Ethereum L1 (Factory Contract)
    ↓ Approve + emit
Base L2 (Zora NFT Mint)
    ↓ Get tokenId
Event Indexing (The Graph)
    ↓
API & Display (GraphQL endpoint)
```

**Files to Create/Modify:**
```
backend/
├── routes/
│   ├── submit.ts                    ← NEW: Real submission logic
│   ├── approve.ts                   ← NEW: Real approval workflow
│   ├── releases.ts                  ← NEW: Release queries
│   └── curator/
│       ├── pending.ts               ← NEW: Get pending approvals
│       └── validate.ts              ← NEW: Signature verification
├── services/
│   ├── ipfs.ts                      ← NEW: Storacha integration
│   ├── zora.ts                      ← NEW: Zora API calls
│   ├── contract.ts                  ← NEW: Factory contract calls
│   └── database.ts                  ← NEW: DB operations
├── db/
│   ├── schema.sql                   ← NEW: Table definitions
│   └── migrations/
│       ├── 001_init.sql             ← NEW: Initial schema
│       └── 002_indexes.sql          ← NEW: Performance optimization
└── middleware/
    ├── auth.ts                      ← NEW: Curator verification
    └── validation.ts                ← MODIFIED: Enhanced validation
```

**Database Schema Needed:**
```sql
-- Releases table
CREATE TABLE releases (
  id VARCHAR PRIMARY KEY,                 -- PDA-001
  title VARCHAR NOT NULL,
  description TEXT,
  artists VARCHAR,
  createdBy VARCHAR NOT NULL,             -- 0xAddress
  createdAt TIMESTAMP,
  status ENUM('pending', 'approved', 'published'),
  mediaIPFSHash VARCHAR,
  metadataURI VARCHAR,
  zoraNFT VARCHAR,                        -- base:0xContract/tokenId
  tokenId VARCHAR,
  approvalThreshold INT,
  approvalRequirementsMet BOOL,
  approvedAt TIMESTAMP
);

-- Approvals table
CREATE TABLE approvals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  releaseId VARCHAR FOREIGN KEY,
  signer VARCHAR,                         -- 0xCurator
  signature VARCHAR,                      -- 0x + 130 hex
  timestamp TIMESTAMP,
  INDEX(releaseId, signer)
);

-- Curator board table
CREATE TABLE curators (
  address VARCHAR PRIMARY KEY,            -- 0xAddress
  name VARCHAR,
  joinedAt TIMESTAMP,
  isActive BOOL
);
```

**Key Decisions:**
- ✅ Use **Storacha** (Filecoin storage) instead of raw IPFS
- ✅ Use **Factory contract** for orchestration (not direct Zora mints)
- ✅ Store **approval metadata** in DB (events + approvals array)
- ✅ Implement **rate limiting** on submission endpoint
- ✅ Add **audit logging** for all approvals

**Timeline:** 5-7 days (after contract is deployed)

---

### **2️⃣ IPFS PINNING**

**What This Means:**
After curator approval, upload audio files and metadata to IPFS permanently. Get content hashes (CIDs) and guarantee they persist.

**Current State (Phase 2):**
```typescript
// Mock file handling
const createMockJsonFile = () => {
  const mockData = { metadata: {...} };
  const blob = new Blob([JSON.stringify(mockData)]);
  return new File([blob], 'release-data.json', { type: 'application/json' });
};
// No real IPFS pinning - just simulates the flow
```

**Phase 3 Reality - Updated Architecture (Pinning AFTER Approval):**

**Step 1: User submits audio file (NO IPFS YET)**
```typescript
// Frontend
const file = e.target.files[0];  // User selects MP3
const formData = new FormData();
formData.append('file', file);
const response = await fetch('/api/submit', {
  method: 'POST',
  body: formData
});
const { release } = await response.json();
// ✅ Fast response - no IPFS delays
// release.status = 'pending'
// Temporary file stored on server (/tmp/uploads/...)
```

**Step 2: Curator approves, threshold met → THEN pin to IPFS**
```typescript
// backend/jobs/publishRelease.ts
// Triggered when approval threshold is reached

export async function publishRelease(releaseId: string) {
  // 1. Load release with temp file from database
  const release = await db.getReleaseById(releaseId);
  const tempFilePath = release.temp_file_path;  // e.g., /tmp/uploads/PDA-001.mp3
  
  // 2. PIN AUDIO FILE TO STORACHA (First time IPFS called)
  const mediaIPFSHash = await pinToIPFS(fs.readFileSync(tempFilePath));
  // mediaIPFSHash = 'QmAudio123...'
  
  // 3. EXTRACT & PIN COVER ART
  const coverImageIPFSHash = await extractAndPinCoverArt(tempFilePath);
  // coverImageIPFSHash = 'QmCover456...'
  
  // 4. CREATE METADATA JSON
  const metadata = {
    // ERC721 Standard (required by Zora)
    name: release.title,
    description: release.description,
    image: `ipfs://${coverImageIPFSHash}`,
    
    // Zora extensions
    animation_url: `ipfs://${mediaIPFSHash}`,
    content: {
      mime: 'audio/mpeg',
      uri: `ipfs://${mediaIPFSHash}`
    },
    
    // Catalogue custom fields
    properties: {
      catalogueId: release.id,
      submittedBy: release.createdBy,
      duration: extractDurationFromID3(tempFilePath),
      artists: release.artists,
      approvals: releaseApprovals,
      multisigAddress: CURATOR_MULTISIG,
    }
  };
  
  // 5. PIN METADATA JSON TO STORACHA
  const metadataJSON = JSON.stringify(metadata);
  const metadataBlob = new Blob([metadataJSON], { type: 'application/json' });
  const metadataIPFSHash = await pinToIPFS(metadataBlob);
  // metadataIPFSHash = 'QmMetadata789...'
  
  // 6. UPDATE DATABASE WITH PERMANENT IPFS HASHES
  await db.updateReleaseWithIPFSHashes(
    releaseId,
    mediaIPFSHash,
    coverImageIPFSHash,
    metadataIPFSHash
  );
  
  // 7. CLEAN UP TEMPORARY FILE
  fs.unlinkSync(tempFilePath);
  
  // 8. NOW ready for blockchain publishing (next step)
  return { mediaIPFSHash, metadataIPFSHash };
}
```

**IPFS Service:**
```typescript
// backend/services/ipfs.ts
import { STORACHClient } from '@storacha/w3-cli';
import fs from 'fs';

const client = new STORACHClient({
  token: process.env.STORACHA_TOKEN,  // API token
  didKey: process.env.DID_KEY,        // Service DID
});

export async function pinToIPFS(data: Buffer | string): Promise<string> {
  try {
    // Upload to Storacha
    const cid = await client.uploadFile(data);
    // cid = 'QmXxxx...' (base32 CID v1)
    
    // Guarantee 12+ month pinning
    await client.pin(cid, {
      expiration: 12 * 30 * 24 * 60 * 60  // 12 months in seconds
    });
    
    console.log(`✅ Pinned to IPFS: ${cid}`);
    return cid;
  } catch (error) {
    console.error(`❌ Failed to pin to IPFS:`, error);
    throw error;
  }
}

export async function extractAndPinCoverArt(mp3FilePath: string): Promise<string> {
  // Use music-metadata library
  const metadata = await parseMusicMetadata(fs.createReadStream(mp3FilePath));
  
  if (metadata.common.picture && metadata.common.picture.length > 0) {
    const coverBuffer = metadata.common.picture[0].data;
    return await pinToIPFS(coverBuffer);
  }
  
  // Fallback: return default cover
  return await pinToIPFS(DEFAULT_COVER_IMAGE);
}

export function extractDurationFromID3(mp3FilePath: string): number {
  const metadata = await parseMusicMetadata(fs.createReadStream(mp3FilePath));
  return metadata.format.duration || 0; // seconds
}
```

**Architecture Path (CORRECTED):**
```
Submit Release Form
    ↓
Temporary Storage (Server or Temp IPFS)
    ├── Store MP3 temporarily
    └── Store cover art temporarily
    ↓
Curator approves (threshold met)
    ↓
PERMANENT IPFS Pinning (Storacha)
    ├── Pin audio → QmAudio123 (permanent, 12+ months)
    ├── Pin cover → QmCover456 (permanent, 12+ months)
    ├── Create metadata JSON
    └── Pin metadata → QmMetadata789 (permanent, 12+ months)
    ↓
Store permanent CIDs in Database
    ↓
Clean up temporary files
```

**Files to Create/Modify:**
```
backend/services/
├── ipfs.ts                          ← NEW: Storacha client
├── mediaProcessor.ts                ← NEW: ID3 tag extraction
├── metadataBuilder.ts               ← NEW: Metadata JSON creation
└── storage.ts                       ← NEW: Temp file management

backend/jobs/
└── publishRelease.ts                ← NEW: Triggered on approval threshold
```

**Integration Points:**
```typescript
// In submit handler (Days 2-3)
const tempFilePath = `/tmp/uploads/${releaseId}.mp3`;
fs.writeFileSync(tempFilePath, fileBuffer);

await db.releases.create({
  ...releaseData,
  temp_file_path: tempFilePath,  // ← NOT permanent CIDs yet
  status: 'pending'
});
// ✅ No IPFS cost, fast submission

// In approve handler (Days 4-5)
if (approvalThresholdMet) {
  // Trigger async job
  await queue.add('publishRelease', { releaseId });
}

// In publishRelease job (Days 6-7)
const { mediaIPFSHash, metadataIPFSHash } = await publishRelease(releaseId);
// ✅ Only calls IPFS for approved releases
// ✅ No cost wasted on rejected submissions
```

**Benefits of Deferring IPFS Pinning:**
- ✅ **Fast submissions:** No IPFS delays during upload
- ✅ **Cost savings:** Only approved releases consume IPFS storage
- ✅ **Efficiency:** Rejected submissions don't waste pinning resources
- ✅ **Incentive alignment:** Approval → Permanence
- ✅ **Better UX:** Curator approval drives permanence, not submission

**Key Technologies:**
- **Storacha API** - IPFS persistence (permanent pinning)
- **music-metadata** npm package - ID3 tag extraction
- **Zora metadata standard** - ERC721 + extensions
- **12-month pinning** - Guaranteed retention
- **Fallback storage** - Server temp files during approval wait

**Timeline:** 3-4 days (parallel with backend)

---

### **2️⃣.5️⃣ SPLITS PAYMENT ROUTING** 

**What This Means:**
Create on-chain split contracts per release to auto-distribute Zora coin trading fees 50/50 between Safe multisig (curator) and submitter.

**Architecture Flow:**
```
Release Approved
    ↓
Create Split Contract (Safe 50% + Submitter 50%)
    ↓
Store split_address in releases table
    ↓
Zora Coin Creation (platformReferrer = split_address)
    ↓
Trading Fees → Split Contract → Auto-distributes
    ├── 50% → Safe multisig
    └── 50% → Submitter wallet
```

**Implementation:**
```typescript
// lib/services/splits.ts
import { SplitsSDK } from '@0xsplits/splits-sdk';

export async function createSplitForRelease(
  safeAddress: string,
  submitterAddress: string,
  releaseId: string
): Promise<string> {
  const sdk = new SplitsSDK(provider, chainId);
  
  const splitTx = await sdk.createSplit({
    splitType: 'pull',
    recipients: [safeAddress, submitterAddress],
    shares: [50, 50],
  });
  
  const splitAddress = await sdk.getSplitAddress(splitTx.hash);
  return splitAddress;
}
```

**Database Schema Update:**
```sql
ALTER TABLE releases ADD COLUMN split_address VARCHAR(42) NULL;
```

**Job Flow Update:**
```typescript
// publishRelease() job sequence
1. Load release from database
2. Load temp_files BLOBs (MP3 + cover art)
3. Pin media to IPFS → mediaIPFSHash
4. Extract & pin cover art → coverImageIPFSHash
5. Extract music metadata
6. Pin metadata JSON → metadataURI
7. ✨ CREATE SPLIT (Safe 50% + Submitter 50%) → split_address
8. Create Zora coin (platformReferrer = split_address)
9. Update releases with all CIDs + split_address + coin_address
10. Delete temp_files (cleanup)
```

**Benefits:**
- ✅ Trustless on-chain revenue split
- ✅ Automatic distribution (no manual payouts)
- ✅ Transparent 50/50 split per release
- ✅ Works with Zora's platformReferrer mechanism

**Timeline:** 1-2 days (must complete before Zora coin creation)

---

### **3️⃣ ZORA CREATOR COINS**

**What This Means:**
After IPFS pinning and Splits creation, automatically create a tradeable ERC20 token (Zora coin) on Base L2 representing the release, with revenue routing through the split contract.

**Current State (Phase 2):**
```typescript
// Mock coin reference
zoraCoin: 'base:0xZoraMock0xCoinAddress'
coinAddress: '0x...'
// Stored in DB but never actually created
```

**Phase 3 Reality:**

**Architecture Path:**
```
Splits Created (Safe 50% + Submitter 50%)
    ↓
Zora Coins SDK
    ├── Create ERC20 token on Base L2
    ├── Set metadata URI (from IPFS)
    ├── Set platformReferrer = split_address
    └── Return coin_address
    ↓
Update Releases with coin_address + split_address
    ↓
Users can trade coin (fees → split → auto-distribute)
```

**Step 1: Create Split Contract (Already Covered in 2.5)**
```
(See section 2.5 for split creation)
```

**Step 2: Create Coin via Zora SDK**
```typescript
// lib/services/zoraCoins.ts

import { createCoin, DeployCurrency } from "@zoralabs/coins-sdk";
import { createPublicClient, createWalletClient, http, Address } from "viem";
import { base } from "viem/chains";

export async function createCoinForRelease(
  releaseId: string,
  releaseTitle: string,
  metadataURI: string,
  submitterAddress: Address,
  splitAddress: Address,
  platformReferrerAddress: Address
): Promise<string> {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(process.env.BASE_RPC_URL),
  });

  const walletClient = createWalletClient({
    account: process.env.CURATOR_PRIVATE_KEY as Hex,
    chain: base,
    transport: http(process.env.BASE_RPC_URL),
  });

  const coinParams = {
    name: releaseTitle,
    symbol: releaseId.substring(0, 6).toUpperCase(),
    uri: metadataURI,
    payoutRecipient: splitAddress, // Revenue goes to split contract
    platformReferrer: platformReferrerAddress, // Catalogue earns fees
    chainId: base.id,
    currency: DeployCurrency.ETH,
  };

  const result = await createCoin(coinParams, walletClient, publicClient);
  return result.address;
}
```

**Step 3: Call from publishRelease Job After Splits Created**
```typescript
// backend/services/contract.ts

import { ethers } from 'ethers';
import FACTORY_ABI from '../abis/Factory.json';

const provider = new ethers.JsonRpcProvider(process.env.L1_RPC_URL);
const signer = new ethers.Wallet(process.env.CURATOR_PRIVATE_KEY, provider);
const factory = new ethers.Contract(
  process.env.FACTORY_ADDRESS,
  FACTORY_ABI,
  signer
);

export async function publishRelease(
  releaseId: string,
  metadataURI: string,
  contributorAddress: string
): Promise<{ txHash: string; tokenId: string }> {
  
  // Call contract
  const tx = await factory.publishRelease(
    releaseId,
    metadataURI,
    contributorAddress
  );
  
  // Wait for confirmation
  const receipt = await tx.wait(1);  // 1 block confirmation
  
  // Parse event to get tokenId
  const event = receipt.events.find(e => e.event === 'ReleaseAdded');
  const tokenId = event.args.tokenId;
  
  // Update DB
  await db.releases.update(
    { id: releaseId },
    {
      zoraNFT: `base:${ZORA_CREATOR_ADDRESS}/${tokenId}`,
      tokenId: tokenId.toString(),
      status: 'published'
    }
  );
  
  return { 
    txHash: receipt.transactionHash, 
    tokenId: tokenId.toString() 
  };
}
```

**Step 3: Listen for Zora Events**
```typescript
// backend/services/eventListener.ts

const zoraCreator = new ethers.Contract(
  process.env.ZORA_CREATOR_ADDRESS,
  ZORA_CREATOR_ABI,
  provider
);

// Listen for ZoraMinted events
zoraCreator.on('ZoraMinted', async (to, tokenId, amount) => {
  console.log(`NFT minted: ${tokenId} to ${to}`);
  
  // Emit to GraphQL subscription
  await emitSubscriptionUpdate('nftMinted', {
    tokenId,
    owner: to,
    timestamp: Date.now()
  });
});
```

**Integration with Curator Approval Flow:**
```typescript
// In approve.ts endpoint

async function handleApproval(req) {
  const { releaseId, curatorAddress, signature } = req.body;
  
  // 1. Verify signature
  const verified = verifyCuratorSignature(releaseId, signature);
  require(verified, 'Invalid signature');
  
  // 2. Load release
  const release = await db.releases.findOne({ id: releaseId });
  require(release.status === 'approved', 'Not ready');
  
  // 3. Add approval to DB
  await db.approvals.create({
    releaseId,
    signer: curatorAddress,
    signature,
    timestamp: Date.now()
  });
  
  // 4. Check if threshold met
  const approvals = await db.approvals.find({ releaseId });
  if (approvals.length >= APPROVAL_THRESHOLD) {
    
    // 5. Publish to blockchain
    const { txHash, tokenId } = await publishRelease(
      release.id,
      release.metadataURI,
      release.createdBy
    );
    
    // 6. Update release
    release.status = 'published';
    release.zoraNFT = `base:${ZORA_ADDRESS}/${tokenId}`;
    release.tokenId = tokenId;
    await db.releases.save(release);
  }
  
  return { success: true, release };
}
```

**Key Technologies:**
- **Zora Creator** - Already deployed on Base
- **Factory Contract** - Custom orchestrator
- **ethers.js** - Blockchain interaction
- **Event listeners** - Real-time updates

**Timeline:** 5-6 days (includes contract testing)

---

### **4️⃣ ENS SUBNAME REGISTRATION**

**What This Means:**
After NFT is minted, automatically register an ENS subname (`pda-123.palaupalau.eth`) pointing to the release, and set a text record linking to the Zora NFT.

**Current State (Phase 2):**
```typescript
ensSubname: undefined  // Not set
// Just stored in data model, never registered
```

**Phase 3 Reality:**

**Architecture Path (from SVG):**
```
Capture Token ID
    ↓
Factory Contract (L1)
    ├── Mint ENS Subname
    │   (pda-XXX.palaupalau.eth)
    └── Set ENS Resolver
        text record: zoraNFT
    ↓
Set ENS Text Record
    (ensResolver.setText)
    ↓
Emit ReleaseAdded
    (for indexing)
```

**Step 1: ENS Subname Registration**
```typescript
// backend/services/ens.ts

import { ethers } from 'ethers';
import ENS_REGISTRY_ABI from '../abis/ENSRegistry.json';
import PUBLIC_RESOLVER_ABI from '../abis/PublicResolver.json';

const ensRegistry = new ethers.Contract(
  '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',  // ENS Registry (L1)
  ENS_REGISTRY_ABI,
  signer
);

const publicResolver = new ethers.Contract(
  ENS_RESOLVER_ADDRESS,
  PUBLIC_RESOLVER_ABI,
  signer
);

export async function registerENSSubname(
  releaseId: string,    // PDA-001
  zoraNFT: string,      // base:0x.../tokenId
  creatorAddress: string
): Promise<string> {
  
  // 1. Register subname pda-001.palaupalau.eth
  const subnameLabel = `pda-${releaseId.split('-')[1]}`;
  const subnameNode = ethers.namehash(`${subnameLabel}.palaupalau.eth`);
  
  // 2. Set resolver to PublicResolver
  const tx1 = await ensRegistry.setResolver(subnameNode, ENS_RESOLVER_ADDRESS);
  await tx1.wait(1);
  
  // 3. Set text records with resolver
  const tx2 = await publicResolver.setText(
    subnameNode,
    'zoraNFT',              // Record name
    zoraNFT                 // Value: base:0x.../123
  );
  await tx2.wait(1);
  
  // 4. Set address record (points to creator)
  const tx3 = await publicResolver.setAddr(
    subnameNode,
    60,                     // Ethereum coin type
    creatorAddress
  );
  await tx3.wait(1);
  
  return `${subnameLabel}.palaupalau.eth`;
}
```

**Step 2: Update Release with ENS Data**
```typescript
// In approve.ts, after NFT minted

const ensSubname = await registerENSSubname(
  release.id,
  release.zoraNFT,
  release.createdBy
);

await db.releases.update(
  { id: release.id },
  { ensSubname }
);

// Example: pda-001.palaupalau.eth
// Text record "zoraNFT" = base:0xZoraAddress/1
```

**Step 3: Make it Discoverable**
```typescript
// When frontend resolves ENS name:

// User visits: pda-001.palaupalau.eth
// Frontend resolves via ENS
// Gets text record: "zoraNFT" = base:0xZora.../1
// Fetches NFT metadata from IPFS
// Shows release details

export async function resolveENSToRelease(subname: string) {
  const node = ethers.namehash(subname);
  
  // Get text records
  const zoraNFT = await resolver.text(node, 'zoraNFT');
  const metadataURI = await resolver.text(node, 'metadataURI');
  
  // Fetch from IPFS
  const metadata = await fetch(`https://gateway.pinata.cloud/ipfs/${metadataURI}`);
  return metadata.json();  // Returns full release data
}
```

**Integration with Publishing Flow:**
```typescript
// In contracts/src/Factory.sol

import '@ens-labs/ens-contracts/contracts/registry/ENS.sol';

function publishRelease(...) external {
  // ... mint NFT ...
  
  // Register ENS subname
  bytes32 subnameNode = keccak256(abi.encodePacked(
    parentNode,
    keccak256(abi.encodePacked(subnameLabel))
  ));
  
  ens.setResolver(subnameNode, resolverAddress);
  resolver.setText(subnameNode, 'zoraNFT', zoraNFT);
  
  emit ReleaseAdded(releaseId, contributor, metadataURI, tokenId);
}
```

**Key Technologies:**
- **ENS Registry** - L1 contract
- **PublicResolver** - Text records
- **ENS.js library** - Resolution
- **Text records** - Custom metadata

**Timeline:** 2-3 days (relatively straightforward)

---

### **5️⃣ MULTISIG AUTHENTICATION**

**What This Means:**
Require multiple curator signatures (via Safe contract) before releases are published. Implements governance.

**Current State (Phase 2):**
```typescript
// Mock multisig
approvalThreshold: 1,
approvals: [
  { signer: '0xMockCurator', signature: '0x000...', timestamp }
],
approvalRequirementsMet: true
// Just simulated - no real signatures verified
```

**Phase 3 Reality:**

**Architecture Path (from SVG):**
```
Curator Board Approval
    ↓
Collect signatures from 3+ curators
    (via Safe multisig)
    ↓
Ethereum L1 (Factory Contract)
    ├── Verify signature threshold
    └── Execute publishRelease
    ↓
Release published
    (once N/M signatures collected)
```

**Step 1: Setup Safe Multisig (Off-chain)**
```
Manual setup (one-time):
1. Go to app.safe.global
2. Create Safe on Mainnet
3. Add 3+ curator addresses
4. Set threshold: 2-of-3
5. Save Safe address: 0xMultisigAddress
```

**Step 2: Curator Signature Collection**
```typescript
// frontend/components/CuratorApprovalForm.tsx

import { SigningCosmosClient } from '@cosmjs/signing-stargate';
import { ethers } from 'ethers';

async function handleCuratorApproval(releaseId: string) {
  // 1. Create message hash
  const messageHash = ethers.solidityPackedKeccak256(
    ['string', 'string'],
    ['RELEASE_APPROVAL', releaseId]
  );
  
  // 2. Sign with wallet
  const signature = await signer.signMessage(
    ethers.getAddress(messageHash)
  );
  
  // 3. Send to backend
  const response = await fetch('/api/curator/approve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      releaseId,
      curatorAddress: signer.address,
      signature
    })
  });
  
  const { approvals } = await response.json();
  console.log(`Collected ${approvals.length}/${THRESHOLD} signatures`);
}
```

**Step 3: Signature Verification on Backend**
```typescript
// backend/services/multisig.ts

import { verifyMessage } from 'ethers';

export function verifyCuratorSignature(
  releaseId: string,
  signature: string,
  signer: string
): boolean {
  
  const messageHash = ethers.solidityPackedKeccak256(
    ['string', 'string'],
    ['RELEASE_APPROVAL', releaseId]
  );
  
  // Recover address from signature
  const recovered = ethers.recoverAddress(messageHash, signature);
  
  // Verify it matches curator
  return recovered.toLowerCase() === signer.toLowerCase();
}

export function verifyMultisigThreshold(
  approvals: Approval[],
  threshold: number,
  validCurators: string[]
): boolean {
  
  // Verify all signatures are valid
  const validSignatures = approvals.filter(approval => {
    const isValid = verifyCuratorSignature(
      approval.releaseId,
      approval.signature,
      approval.signer
    );
    const isCurator = validCurators.includes(approval.signer);
    return isValid && isCurator;
  });
  
  // Check threshold met
  return validSignatures.length >= threshold;
}
```

**Step 4: Contract Enforcement**
```solidity
// contracts/src/Factory.sol

import '@safe-global/safe-contracts/contracts/Safe.sol';

contract Factory {
    Safe public curatorSafe;
    uint256 public approvalThreshold = 2;  // 2-of-3
    
    function publishRelease(
        string memory releaseId,
        string memory metadataURI,
        address contributor
    ) external onlyCuratorApproved {
        
        // Verify caller is Safe
        require(msg.sender == address(curatorSafe), 'Not curator');
        
        // Verify signatures collected in DB
        Release release = getReleaseFromDB(releaseId);
        require(
            release.approvalRequirementsMet == true,
            'Not enough approvals'
        );
        
        // Mint NFT
        mintToZora(...);
        
        emit ReleaseAdded(releaseId, contributor, metadataURI, tokenId);
    }
}
```

**Step 5: Approval Flow in Backend**
```typescript
// backend/routes/curator/approve.ts

async function handleApprovalRequest(req) {
  const { releaseId, curatorAddress, signature } = req.body;
  
  // 1. Verify curator is in Safe
  const safe = new ethers.Contract(SAFE_ADDRESS, SAFE_ABI, provider);
  const owners = await safe.getOwners();
  require(
    owners.map(o => o.toLowerCase()).includes(curatorAddress.toLowerCase()),
    'Not a curator'
  );
  
  // 2. Verify signature
  const isValid = verifyCuratorSignature(releaseId, signature, curatorAddress);
  require(isValid, 'Invalid signature');
  
  // 3. Add to approvals DB
  await db.approvals.create({
    releaseId,
    signer: curatorAddress,
    signature,
    timestamp: Date.now()
  });
  
  // 4. Check if threshold met
  const approvals = await db.approvals.find({ releaseId });
  const release = await db.releases.findOne({ id: releaseId });
  
  if (approvals.length >= APPROVAL_THRESHOLD) {
    
    // 5. Mark as ready for publishing
    release.approvalRequirementsMet = true;
    release.approvals = approvals;
    
    // 6. Publish via Safe (manual or automated)
    if (PUBLISH_AUTOMATICALLY) {
      await publishThroughSafe(release);
    } else {
      // Wait for manual execution via Safe UI
      release.status = 'ready_for_execution';
    }
    
    await db.releases.save(release);
  }
  
  return { success: true, release };
}
```

**Key Technologies:**
- **Safe (formerly Gnosis)** - Multisig wallet
- **EIP-191** - Message signing standard
- **ethers.js** - Signature verification
- **Safe transaction SDK** - Batch operations

**Timeline:** 4-5 days (includes Safe integration testing)

---

## 📊 IMPLEMENTATION ROADMAP

### Phase 3 Timeline (Based on execution-macro.md)

```
Week 1: Days 1-5
├── Day 1-2: Setup monorepo + database
├── Day 3-5: Real backend integration
│   └── Create API routes
│   └── Database schema
│   └── Basic CRUD operations

Week 2: Days 6-10
├── Day 6: ✅ COMPLETE - Gateway Authorization System
│   └── See: Actions/DAY6-COMPLETION-SUMMARY.md
├── Day 7: IPFS/Storacha integration
├── Day 8-9: Factory contract development
└── Day 10: Contract testing on testnet

Week 3: Days 11-15
├── Day 11-12: Zora NFT minting flow
├── Day 13-14: ENS subname registration
└── Day 15: End-to-end testing

Week 4: Days 16-20
├── Day 16-17: Multisig authentication
├── Day 18: Safe integration
└── Day 19-20: Security audit + hardening

Week 5: Days 21-25
├── Day 21-22: The Graph subgraph deployment
├── Day 23-24: Indexing + fallback logic
└── Day 25: Performance optimization

Week 6+: Days 26+
├── Mainnet deployment
├── Final security review
└── Go-live preparation
```

---

## 🔗 DEPENDENCY CHAIN

```
1. Real Backend Integration
   ├── Requires: Database schema
   ├── Depends on: Frontend type system (✅ ready)
   └── Blocks: Everything else

2. IPFS Pinning
   ├── Requires: Storacha API key
   ├── Depends on: Backend integration
   └── Blocks: NFT minting

3. Zora NFT Minting
   ├── Requires: Factory contract
   ├── Depends on: IPFS + Backend
   └── Blocks: ENS registration

4. ENS Subname Registration
   ├── Requires: ENS subname purchased (palaupalau.eth)
   ├── Depends on: NFT minting
   └── Blocks: Discovery

5. Multisig Authentication
   ├── Requires: Safe setup + curator addresses
   ├── Depends on: Backend integration
   └── Parallel with: All other work
```

---

## ✅ SUCCESS CRITERIA FOR EACH POINT

### Real Backend Integration ✅
- [ ] API endpoints return 200 OK
- [ ] Data persists in database
- [ ] Validation errors return 400
- [ ] Authentication required for curator endpoints

### IPFS Pinning ✅
- [ ] Files uploaded to Storacha
- [ ] CIDs returned and stored
- [ ] 12-month pinning guaranteed
- [ ] Gateway accessible via `ipfs.io`

### Zora NFT Minting ✅
- [ ] NFTs minted on Base testnet
- [ ] tokenId returned and stored
- [ ] Metadata resolves correctly
- [ ] Owner is creator address

### ENS Subname Registration ✅
- [ ] Subnames registered on Mainnet
- [ ] Text records set correctly
- [ ] Resolvable via ENS.js
- [ ] Fallback resolution works

### Multisig Authentication ✅
- [ ] Signatures collected from N curators
- [ ] Threshold enforcement works
- [ ] Publishing blocked if < N signatures
- [ ] Safe integration functional

---

## 🚀 IMMEDIATE NEXT STEPS

1. **Setup Database** (Day 1)
   - Choose: PostgreSQL (recommended) or MongoDB
   - Create schema (use template above)
   - Set up migrations

2. **Deploy Factory Contract** (Day 3-5)
   - Finalize contract code
   - Test on Base Sepolia
   - Get test ETH

3. **Implement Backend Routes** (Day 1-10)
   - POST /api/submit
   - POST /api/curator/approve
   - GET /api/releases

4. **Integrate IPFS** (Day 6-7)
   - Get Storacha account
   - Implement file upload service
   - Test with sample files

5. **Connect Frontend to Backend** (Day 15+)
   - Replace MSW handlers with real API
   - Update components for real data
   - Test end-to-end workflow

---

**Document Version:** 1.0  
**Created:** November 14, 2025  
**Ready for:** Development kickoff



