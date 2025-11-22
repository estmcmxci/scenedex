# Compatibility Matrix: ENS + Zora + IPFS Metadata

Based on research of:
- `ens-metadata.md` (ENS text records, ENSIP-5, ERC634)
- `zora-metadata.md` (Zora metadata JSON format)
- `erc-7572.md` (Contract-level metadata standard)

---

## **Executive Summary**

| System | Storage | Format | Size Limit | Extensible | Interop |
|--------|---------|--------|-----------|-----------|---------|
| **ENS (L1)** | On-chain text records | UTF-8 key-value pairs | ~few hundred bytes (gas-limited) | ✅ Custom keys allowed | Can point to IPFS URI |
| **Zora (Base L2)** | Off-chain IPFS via `tokenURI` | ERC721-compliant JSON | Unlimited (IPFS) | ✅ Custom `properties` object | References IPFS URIs |
| **IPFS** | Off-chain blob storage | JSON file | Unlimited | ✅ Custom fields allowed | Immutable hash-based addressing |

**Key Insight:** Each system is designed to work independently. Our job is to **wire them together** using minimal on-chain data + off-chain references.

---

## **Detailed Compatibility Analysis**

### **1. ENS Text Records (L1 On-Chain)**

#### Storage Mechanism
```solidity
// ENSIP-5 / ERC634 Standard
interface IERC634 {
  function text(bytes32 node, string key) view returns (string text);
  function setText(bytes32 node, string key, string value) external;
}
```

#### What We Can Store
- **Arbitrary UTF-8 strings** with custom key names
- **Format**: Global keys (lowercase, numbers, hyphens) or service notation (com.example)
- **Examples**:
  ```
  key: "description"     → value: "First release on palaupalau.eth"
  key: "url"             → value: "https://catalogue.palaupalau.eth/PDA-001"
  key: "avatar"          → value: "ipfs://Qm..."
  key: "catalogue-id"    → value: "PDA-001"
  key: "metadata"        → value: "ipfs://QmXXX..." (custom pattern)
  ```

#### Size Constraints
- **Hard Limit**: None enforced by contract
- **Practical Limit**: ~few hundred bytes per key (gas cost)
- **Recommendation**: Keep individual text records ≤ 256 bytes

#### Gas Implications
- Setting a text record costs gas (scales with string length)
- Reading a text record is **view** (free)
- Multiple reads are cheap; writes are expensive

#### Our Pattern
✅ Store **catalogue reference** in ENS  
✅ Store **link to IPFS metadata** in ENS  
✅ Catalog app reads ENS → fetches IPFS → displays data

---

### **2. Zora NFT Metadata (Base L2 Off-Chain via IPFS)**

#### Storage Mechanism (ERC721 Standard)
```solidity
// Token returns a URI that points to JSON metadata
interface IERC721Metadata {
  function tokenURI(uint256 tokenId) external view returns (string);
}

// Zora contract returns IPFS URI:
// "ipfs://QmXXX" → resolves to JSON metadata
```

#### Metadata Format (ERC721 + Zora Extensions)

**Core Fields** (ERC721 Standard):
```json
{
  "name": "Release Title",           // Required
  "description": "Release desc",     // Required
  "image": "ipfs://QmImage...",     // Required (cover art)
  "external_url": "https://..."      // Optional (back-link)
}
```

**Extended Fields** (Zora Supports):
```json
{
  // Animation for non-image media (audio, video, etc.)
  "animation_url": "ipfs://QmAudio...",
  
  // Structured content metadata
  "content": {
    "mime": "audio/mpeg",
    "uri": "ipfs://QmAudio..."
  },
  
  // Custom properties (extensible)
  "properties": {
    "category": "music",
    "duration_seconds": 240,
    "artists": "Artist Name",
    "format": "mp3"
  },
  
  // Traits (for indexers)
  "attributes": [
    { "trait_type": "Genre", "value": "Electronic" },
    { "trait_type": "Year", "value": "2024" }
  ]
}
```

#### Size Constraints
- **Hard Limit**: None (IPFS handles any size)
- **Practical Limit**: Depends on IPFS gateway availability
- **Recommendation**: Keep JSON files ≤ 10MB (1MB typical for music metadata)

#### Extensibility
✅ Custom `properties` object is supported  
✅ Can add extra fields beyond ERC721 standard  
✅ `content` field is Zora-native and well-documented

#### Our Pattern
✅ Create complete metadata JSON on IPFS  
✅ Upload to IPFS → get hash (e.g., `QmXXX`)  
✅ Set tokenURI to `ipfs://QmXXX`  
✅ Mint NFT on Zora Creator contract  
✅ ENS text record points to this IPFS URI

---

### **3. IPFS Metadata JSON (Immutable Off-Chain)**

#### Storage Format
```
IPFS CID (content hash) + JSON file
Example: ipfs://QmabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
```

#### Addressability
- **Immutable**: Once uploaded, cannot be changed (new CID = new file)
- **Hash-based**: Content is identified by its SHA256 hash
- **Gateway access**: `https://ipfs.io/ipfs/QmXXX` or `https://gateway.pinata.cloud/ipfs/QmXXX`

#### Extensibility
✅ Can have **any** structure (not enforced)  
✅ Combine ERC721 standard + custom fields  
✅ Can reference other IPFS files  

#### Our Pattern
```json
{
  // ERC721 Standard (required by Zora)
  "name": "Release Title",
  "description": "Full description",
  "image": "ipfs://QmCoverArt...",
  
  // Audio/Media specific
  "animation_url": "ipfs://QmAudioFile...",
  "content": {
    "mime": "audio/mpeg",
    "uri": "ipfs://QmAudioFile..."
  },
  
  // Custom Catalogue fields (extensible)
  "properties": {
    "catalogueId": "PDA-001",
    "catalogueVersion": 1,
    "submittedAt": 1699564800,
    "approvedBy": "0xCuratorAddress",
    "approvedAt": 1699651200,
    
    // Music-specific
    "category": "music",
    "duration_seconds": 240,
    "format": "mp3",
    "artists": "Artist Name",
    "genre": "Electronic"
  },
  
  // Back-reference for fallback resolution
  "external_url": "https://catalogue.palaupalau.eth/release/PDA-001"
}
```

---

## **Data Flow & Integration**

### **Scenario: User submits a release**

```
┌──────────────────────────────────────────────────────────┐
│ Step 1: User submits via Catalogue UI                    │
├──────────────────────────────────────────────────────────┤
│ Input: title, description, media (IPFS CID)              │
│ Storage: Internal database                                │
│ Status: "pending"                                         │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│ Step 2: Curator approves                                 │
├──────────────────────────────────────────────────────────┤
│ Action: Approval on Catalogue                             │
│ Status: "approved"                                        │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│ Step 3: Create IPFS Metadata JSON                        │
├──────────────────────────────────────────────────────────┤
│ Create JSON with:                                         │
│ - ERC721 fields (name, description, image)               │
│ - Media file reference (animation_url)                    │
│ - Catalogue reference (catalogueId, catalogueUrl)        │
│ - Zora-compatible structure                              │
│                                                          │
│ Upload to IPFS → QmXXX                                    │
│ metadataURI = "ipfs://QmXXX"                              │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│ Step 4: Mint NFT on Zora Creator (Base L2)              │
├──────────────────────────────────────────────────────────┤
│ Contract: Zora Creator on Base                            │
│ tokenURI: "ipfs://QmXXX"                                  │
│ Result: TokenID, zoraNFT = "base:0xZora/TokenID"         │
│ Status: "published"                                       │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│ Step 5: Register ENS Subname (L1)                        │
├──────────────────────────────────────────────────────────┤
│ Subname: "first-release.palaupalau.eth"                  │
│ Set text records:                                         │
│   - "catalogue-id" → "PDA-001"                            │
│   - "metadata" → "ipfs://QmXXX"                           │
│   - "nft" → "base:0xZora/TokenID"                         │
│ Result: ENS resolution points to release                 │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│ Step 6: User can resolve via multiple paths              │
├──────────────────────────────────────────────────────────┤
│ Path A: Catalogue direct lookup (fastest)                │
│   → Get PDA-001 → display metadata                       │
│                                                          │
│ Path B: ENS resolution (canonical)                       │
│   → Resolve first-release.palaupalau.eth                 │
│   → Read text record "metadata"                          │
│   → Fetch IPFS → display                                 │
│                                                          │
│ Path C: Zora NFT lookup (blockchain truth)               │
│   → Query tokenURI on Zora                               │
│   → Fetch IPFS → display                                 │
│                                                          │
│ All paths lead to same IPFS metadata                     │
└──────────────────────────────────────────────────────────┘
```

---

## **Field Mapping**

### **Catalogue Release Model → IPFS Metadata**

```
┌────────────────────────────┬──────────────────────┬────────────────────────┐
│ Catalogue Release          │ IPFS Metadata Field  │ Notes                  │
├────────────────────────────┼──────────────────────┼────────────────────────┤
│ id (PDA-001)               │ properties.          │ Back-reference to DB   │
│                            │ catalogueId          │                        │
├────────────────────────────┼──────────────────────┼────────────────────────┤
│ title                      │ name                 │ ERC721 standard        │
├────────────────────────────┼──────────────────────┼────────────────────────┤
│ description                │ description          │ ERC721 standard        │
├────────────────────────────┼──────────────────────┼────────────────────────┤
│ media (IPFS CID)           │ animation_url +      │ Zora-supported fields  │
│                            │ content.uri + image  │                        │
├────────────────────────────┼──────────────────────┼────────────────────────┤
│ createdBy (wallet)         │ properties.          │ Creator address        │
│                            │ catalogueCreator     │                        │
├────────────────────────────┼──────────────────────┼────────────────────────┤
│ createdAt (timestamp)      │ properties.          │ Submission time        │
│                            │ submittedAt          │                        │
├────────────────────────────┼──────────────────────┼────────────────────────┤
│ approvedBy (wallet)        │ properties.          │ Curator address        │
│                            │ approvedBy           │                        │
├────────────────────────────┼──────────────────────┼────────────────────────┤
│ approvedAt (timestamp)     │ properties.          │ Approval time          │
│                            │ approvedAt           │                        │
├────────────────────────────┼──────────────────────┼────────────────────────┤
│ metadataURI (ipfs://...)   │ (this file's CID)    │ Zora tokenURI points   │
│                            │                      │ to this                │
├────────────────────────────┼──────────────────────┼────────────────────────┤
│ zoraNFT (base:0xZ/ID)      │ external_url         │ Back-link to Zora NFT  │
│                            │ (optional)           │                        │
└────────────────────────────┴──────────────────────┴────────────────────────┘
```

---

## **ENS Text Records We'll Use**

```
For: first-release.palaupalau.eth

Record 1: catalogue-id
  Key: "catalogue-id"
  Value: "PDA-001"
  Size: ~8 bytes ✅
  Purpose: Direct lookup in catalogue

Record 2: metadata
  Key: "metadata"
  Value: "ipfs://QmabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  Size: ~80 bytes ✅
  Purpose: Points to IPFS metadata JSON

Record 3: nft
  Key: "nft"
  Value: "base:0x0000000000000000000000000000000000000000/123"
  Size: ~50 bytes ✅
  Purpose: Links to Zora NFT on Base

Record 4: description
  Key: "description"
  Value: "A full release description (optional, display-friendly)"
  Size: ≤ 256 bytes
  Purpose: User-readable summary

Total storage: < 500 bytes of ENS text records
Gas cost: Moderate (4 records × gas per set)
```

---

## **Constraints & Trade-offs**

### **ENS (L1) - GOOD FOR:**
✅ Canonical identity (palaupalau.eth)  
✅ User-friendly names  
✅ Cheap reads (view functions)  
✅ Back-links and references  

### **ENS (L1) - NOT GOOD FOR:**
❌ Large metadata (gas expensive)  
❌ Frequently updated data  
❌ Complex nested structures  

### **Zora (Base L2) - GOOD FOR:**
✅ NFT ownership & transfer  
✅ Royalties & sales  
✅ Complete metadata (no size limit)  
✅ Media-first design  

### **Zora (Base L2) - NOT GOOD FOR:**
❌ Direct name resolution  
❌ L1 interactions (cross-chain calls needed)  

### **IPFS - GOOD FOR:**
✅ Immutable content addressing  
✅ Unlimited metadata size  
✅ Decentralized storage  
✅ Content addressing (hash = proof)  

### **IPFS - NOT GOOD FOR:**
❌ Real-time updates (new CID each time)  
❌ Private data  

---

## **Resolution Strategy (Fallback Chain)**

When a user requests a release, try in this order:

```
1. Direct Catalogue Lookup
   → Query DB for PDA-001
   → If found, return (FASTEST)
   ↓ (if not found)

2. ENS Text Record Lookup (L1)
   → Resolve first-release.palaupalau.eth
   → Read "catalogue-id" text record
   → Query catalogue DB
   ↓ (if not found)

3. IPFS Direct Lookup
   → Fetch ipfs://QmXXX
   → Parse metadata
   → Display (slower, but reliable)
   ↓ (if not found)

4. Zora Token Lookup (Base L2)
   → Query Zora Creator contract
   → Get tokenURI
   → Fetch IPFS
   → Display

Result: Multiple paths to same data = resilience
```

---

## **Summary Table: What Each System Provides**

| Need | Solution | Storage | Indexer Friendly |
|------|----------|---------|------------------|
| **User-friendly name** | ENS subname | L1 on-chain | Yes (ENS indexers) |
| **Complete metadata** | IPFS JSON | Off-chain | Via content hash |
| **NFT ownership** | Zora token | Base L2 | Yes (block explorers) |
| **Catalogue reference** | ENS text record + IPFS | Hybrid | Via catalogue API |
| **Fallback resolution** | All three combined | Distributed | Via app logic |

---

## **Next Steps for Data Model Definition**

Based on this compatibility matrix, the Release type should:

1. **Always store**:
   - `id` (PDA-XXX)
   - `title`, `description`
   - `media` (IPFS CID)
   - `createdBy`, `createdAt`
   - `status` (pending/approved/published)

2. **Store after approval**:
   - `approvedBy`, `approvedAt`
   - `metadataURI` (ipfs://...)

3. **Store after minting**:
   - `zoraNFT` (base:0x.../tokenId)
   - `tokenId` (from Zora)

4. **Store after ENS registration**:
   - `ensSubname` (e.g., "first-release.palaupalau.eth")

All systems work together; data flows one direction (approval → IPFS → Zora → ENS).

