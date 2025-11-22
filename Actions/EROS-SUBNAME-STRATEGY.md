# EROS Subname Strategy for Scenedex.eth

## 🎯 Configuration

**Primary Domain:** `scenedex.eth`  
**Namehash:** `0x9fd5ee92bf30ec0519137a2bf368f60dc7be258f18dcc98a37a064f4dbef6294`  
**Network:** Sepolia  
**Subname Format:** `EROSXXX.scenedex.eth` (e.g., `EROS001.scenedex.eth`, `EROS002.scenedex.eth`)  

---

## 📊 Text Records Analysis: Release Schema vs ENSIPs

### Release Schema Fields
From your releases table:
- `id` (releaseId)
- `title`
- `description`
- `artists`
- `createdBy` (creator address)
- `createdAt`
- `mediaIPFSHash`
- `coverImageIPFSHash`
- `metadataURI`
- `duration`
- `album`, `genre`, `year`
- `bitrate`, `sampleRate`, `channels`, `codec`
- `split_address`
- `zora_coin_address`
- `zora_coin_symbol`

---

## 🏗️ MVP Text Records (Phase 1)

### ENSIP-5 Global Keys (Standard)
| Field | ENSIP Record | Release Schema | MVP Included |
|-------|--------------|-----------------|--------------|
| Cover image | `avatar` | `coverImageIPFSHash` | ✅ Yes |
| Description | `description` | `description` | ✅ Yes |
| Release title | (custom: `title`) | `title` | ✅ Yes |
| Location/Curator | `location` | `createdBy` (curator addr) | ⏳ Phase 2 |
| Website | `url` | (N/A yet) | ❌ No |

### ENSIP-18 Profile Keys
| Field | ENSIP Record | Release Schema | MVP Included |
|-------|--------------|-----------------|--------------|
| Alias/Display | `alias` | `title` | ⏳ Phase 2 |
| Email | `email` | (N/A) | ❌ No |
| Primary contact | `primary-contact` | `createdBy` | ❌ No |

### Custom Catalogue Keys (Service Namespace)
Using reverse dot notation: `eth.scenedex.*`

| Key | Value | Source | MVP Included |
|-----|-------|--------|--------------|
| `eth.scenedex.releaseId` | EROS001 | `id` | ✅ Yes |
| `eth.scenedex.artists` | Artist name(s) | `artists` | ✅ Yes |
| `eth.scenedex.mediaIPFS` | `bafy...` | `mediaIPFSHash` | ✅ Yes |
| `eth.scenedex.metadataURI` | `bafy...` | `metadataURI` | ✅ Yes |
| `eth.scenedex.zoraCoinAddress` | `0x...` | `zora_coin_address` | ✅ Yes |
| `eth.scenedex.zoraCoinSymbol` | `PDA001` | `zora_coin_symbol` | ✅ Yes |
| `eth.scenedex.splitAddress` | `0x...` | `split_address` | ✅ Yes |
| `eth.scenedex.duration` | `253` | `duration` | ⏳ Phase 2 |
| `eth.scenedex.codec` | `audio/mpeg` | `codec` | ⏳ Phase 2 |
| `eth.scenedex.createdBy` | Creator addr | `createdBy` | ⏳ Phase 2 |
| `eth.scenedex.createdAt` | Unix timestamp | `createdAt` | ⏳ Phase 2 |

---

## ✅ MVP Implementation (Initial Deploy)

### Text Records to Set (Phase 1)
```typescript
{
  // ENSIP-5 Standard Global Keys
  "avatar": "ipfs://bafybeidbxkyox...",           // Cover image
  "description": "Release description...",         // Release description
  
  // Custom Catalogue Keys
  "eth.scenedex.releaseId": "EROS001",
  "eth.scenedex.artists": "m580",
  "eth.scenedex.mediaIPFS": "bafybeigyelay5...",
  "eth.scenedex.metadataURI": "bafybeiefr4aizx...",
  "eth.scenedex.zoraCoinAddress": "0x96a958ef...",
  "eth.scenedex.zoraCoinSymbol": "PDA1763518904325",
  "eth.scenedex.splitAddress": "0xbed6b29a...",
}
```

### Frontend Resolution (MVP)
```typescript
export async function resolveEROSRelease(releaseNumber: string) {
  const subnameNode = namehash(`EROS${releaseNumber}.scenedex.eth`);
  
  const releaseData = {
    // ENSIP-5 standard
    avatar: await resolver.text(subnameNode, 'avatar'),
    description: await resolver.text(subnameNode, 'description'),
    
    // Custom catalogue keys
    releaseId: await resolver.text(subnameNode, 'eth.scenedex.releaseId'),
    artists: await resolver.text(subnameNode, 'eth.scenedex.artists'),
    mediaIPFS: await resolver.text(subnameNode, 'eth.scenedex.mediaIPFS'),
    metadataURI: await resolver.text(subnameNode, 'eth.scenedex.metadataURI'),
    zoraCoinAddress: await resolver.text(subnameNode, 'eth.scenedex.zoraCoinAddress'),
    zoraCoinSymbol: await resolver.text(subnameNode, 'eth.scenedex.zoraCoinSymbol'),
    splitAddress: await resolver.text(subnameNode, 'eth.scenedex.splitAddress'),
  };
  
  return releaseData;
}
```

---

## 🚀 Phase 2 Expansion

### Additional Records to Add
- `location` → Curator location (via Safe)
- `eth.scenedex.duration` → Track duration in seconds
- `eth.scenedex.codec` → Audio codec (audio/mpeg, etc)
- `eth.scenedex.createdBy` → Creator address (already in coin)
- `eth.scenedex.createdAt` → Unix timestamp

### New Queries
- Audio metadata (bitrate, sample rate, channels)
- Genre, album, year
- Curator information via Safe integration

---

## 🔮 Full Vision Architecture (Future ENSIP)

### Why Custom Resolver Needed
Current ENS text records (ENSIP-5/18) support arbitrary key-value pairs, but:
1. **Scalability** - Too many individual `.setText()` calls for complex metadata
2. **Atomicity** - Can't guarantee all records update together
3. **Versioning** - No built-in version control for release updates
4. **Structured Data** - Text records are strings; we need nested objects

### Proposed "ENSIP-X: Release Metadata Records"

```solidity
interface ICatalogueReleaseResolver {
  
  struct ReleaseMetadata {
    string releaseId;
    string title;
    string description;
    string[] artists;
    string mediaIPFS;
    string coverIPFS;
    string metadataURI;
    
    // Music metadata
    uint256 duration;
    string codec;
    uint256 bitrate;
    uint256 sampleRate;
    uint8 channels;
    
    // Release context
    string genre;
    string album;
    uint16 year;
    
    // On-chain references
    address zoraCoinAddress;
    string zoraCoinSymbol;
    address splitAddress;
    
    // Creator/curator
    address createdBy;
    uint256 createdAt;
    
    // Versioning
    uint256 version;
    uint256 lastUpdated;
  }
  
  function releaseMetadata(bytes32 node) 
    external view 
    returns (ReleaseMetadata memory);
  
  function updateReleaseMetadata(
    bytes32 node, 
    ReleaseMetadata memory metadata
  ) external;
}
```

### Benefits
✅ Single atomic transaction for all metadata  
✅ Type-safe structured data (not strings)  
✅ Built-in versioning  
✅ Efficient storage (vs. 15+ individual setText calls)  
✅ Frontend can fetch entire release in one call  

### Implementation Timeline
- **MVP (Now):** Use standard ENSIP-5 + custom `eth.scenedex.*` keys
- **Phase 2:** Monitor record count; if > 10 records per release, propose ENSIP
- **Phase 3+:** Deploy custom resolver contract for full vision

---

## 🔧 Implementation Code Structure

### `lib/services/ens.ts` (Updated)
```typescript
import { namehash } from 'viem/ens';

const SCENEDEX_DOMAIN = 'scenedex.eth';
const SCENEDEX_PARENT_NODE = '0x9fd5ee92bf30ec0519137a2bf368f60dc7be258f18dcc98a37a064f4dbef6294';

export async function registerEROSRelease(release: Release, coinAddress: string) {
  const releaseNumber = release.id.split('-')[1].padStart(3, '0');
  const subdomainLabel = `EROS${releaseNumber}`;
  const subnameNode = namehash(`${subdomainLabel}.${SCENEDEX_DOMAIN}`);
  
  // Build MVP text records
  const records = {
    // ENSIP-5 Standard
    'avatar': `ipfs://${release.coverImageIPFSHash}`,
    'description': release.description || 'Release on Scenedex',
    
    // Custom Catalogue (eth.scenedex.*)
    'eth.scenedex.releaseId': `EROS${releaseNumber}`,
    'eth.scenedex.artists': release.artists || 'Unknown',
    'eth.scenedex.mediaIPFS': release.mediaIPFSHash,
    'eth.scenedex.metadataURI': release.metadataURI,
    'eth.scenedex.zoraCoinAddress': coinAddress,
    'eth.scenedex.zoraCoinSymbol': release.zora_coin_symbol,
    'eth.scenedex.splitAddress': release.split_address,
  };
  
  return { subnameNode, records };
}
```

---

## 📋 Checklist

**MVP (This Sprint)**
- [ ] Set up Sepolia ENS resolver address (`0x8FADE66B...`)
- [ ] Implement `registerEROSRelease()` in `lib/services/ens.ts`
- [ ] Add ENS registration to `publishRelease()` job after coin creation
- [ ] Test record setting on Sepolia
- [ ] Test record resolution with custom keys
- [ ] Frontend query implementation

**Phase 2 (Next Sprint)**
- [ ] Add extended metadata records (duration, codec, etc)
- [ ] Safe integration for curator info
- [ ] Frontend profile page showing EROS release

**Phase 3+ (Future)**
- [ ] Draft ENSIP-X proposal for custom resolver
- [ ] Implement custom resolver contract
- [ ] Deploy resolver on mainnet
- [ ] Migrate records to new resolver

---

## 🎓 Key Design Decisions

1. **Why `eth.scenedex.*` naming?** - Follows ENSIP-5 service key convention; allows other services to coexist
2. **Why EROS numbering?** - Clean, memorable, aligns with curation series branding
3. **Why dual ENSIP-5 + custom?** - MVP simplicity with future-proof extensibility
4. **Why text records vs. custom resolver now?** - Faster to market; standard tooling exists

---

**Date:** November 19, 2024  
**Status:** Ready for MVP Implementation  
**Next Step:** Implement in `lib/services/ens.ts`

