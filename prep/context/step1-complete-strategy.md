# Step 1 Complete Strategy: From Research to Types.ts

---

## **What We've Accomplished So Far**

### ✅ Research Phase (Complete)
- [x] Studied ENS subname metadata storage (ENSIP-5, text records)
- [x] Studied Zora metadata format (ERC721 + extensions)
- [x] Studied ERC7572 (contract-level metadata)
- [x] Created compatibility matrix showing how all systems interact

### 📋 Compatibility Matrix Findings

| Layer | Storage | What We Store | Size | Extensible |
|-------|---------|---------------|------|-----------|
| **ENS (L1)** | On-chain text records | Pointers to IPFS + catalogue ID | ~few hundred bytes | ✅ Custom keys |
| **Zora (Base L2)** | Off-chain IPFS via tokenURI | Complete ERC721 metadata | Unlimited | ✅ Custom properties |
| **IPFS** | Content-addressed blobs | Immutable JSON metadata | Unlimited | ✅ Any structure |
| **Catalogue** | Internal DB | Full Release lifecycle | Unlimited | ✅ Custom fields |

---

## **What types.ts Must Do**

### **Problem to Solve**
You have **4 storage layers** and **1 frontend app** all needing to agree on what a "Release" looks like:

```
Frontend
  ↓
Store (TypeScript state)
  ↓
Validation (Zod schema)
  ↓
Mock API (MSW responses)
  ↓
Real API (Phase 3)
  ↓
IPFS (IPFSMetadata JSON)
  ↓
Zora (tokenURI)
  ↓
ENS (text record pointer)
```

**Without types.ts**: Each layer defines Release differently. Field names don't match. Components break at runtime.

**With types.ts**: Single definition. Everything flows from it. All layers consistent.

---

## **What types.ts Will Contain (Exact Breakdown)**

### **Section 1: Input Types**
```typescript
// What users provide via form
export type ReleaseSubmissionInput = {
  title: string;
  description: string;
  media: string;              // IPFS CID user already uploaded
  artists?: string;           // Optional metadata
  duration?: number;
  format?: string;
  category?: string;
};
```

**Why**: Form validation outputs this. Store receives this. Type-safe submission pipeline.

---

### **Section 2: Core Release Type**
```typescript
// Complete Release object at ANY stage of lifecycle
export type Release = {
  // Immutable (set once)
  id: string;                 // PDA-XXX
  createdBy: string;          // 0xCreatorWallet
  createdAt: number;          // timestamp
  
  // From submission
  title: string;
  description: string;
  media: string;              // IPFS URI
  
  // Lifecycle
  status: 'pending' | 'approved' | 'published';
  
  // After curator approves
  approvedBy?: string;        // 0xCuratorWallet
  approvedAt?: number;
  rejectionReason?: string;
  
  // After metadata created
  metadataURI?: string;       // ipfs://QmXXX
  
  // After NFT minted
  zoraNFT?: string;           // base:0xZoraAddress/tokenId
  tokenId?: string;
  
  // After ENS registered
  ensSubname?: string;        // first-release.palaupalau.eth
};
```

**Why**: Single type that represents Release at every state. Optional fields (`?`) reflect lifecycle.

---

### **Section 3: State-Specific Types (Type Guards)**
```typescript
// Type-safe specific states
export type PendingRelease = Release & {
  status: 'pending';
  // (approval fields not required yet)
};

export type ApprovedRelease = Release & {
  status: 'approved';
  approvedBy: string;        // Required if approved
  approvedAt: number;
};

export type PublishedRelease = Release & {
  status: 'published';
  metadataURI: string;       // Required if published
  zoraNFT: string;
  tokenId: string;
  approvedBy: string;
  approvedAt: number;
};
```

**Why**: Allows `function displayNFT(release: PublishedRelease)` knowing zoraNFT exists. Type compiler enforces state transitions.

---

### **Section 4: IPFS Metadata Type**
```typescript
// What gets uploaded to IPFS (ERC721 compatible)
export type IPFSMetadata = {
  // ERC721 Standard (required by Zora)
  name: string;                           // Release title
  description: string;
  image: string;                          // IPFS URI to cover art
  
  // Zora/Media extensions
  animation_url?: string;                 // IPFS URI to audio/video
  content?: {
    mime: string;                         // "audio/mpeg", etc
    uri: string;                          // IPFS URI
  };
  
  // Optional ERC721
  external_url?: string;                  // Link back to catalogue
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  
  // Custom catalogue fields
  properties: {
    catalogueId: string;                  // PDA-001
    catalogueVersion: number;             // 1
    catalogueUrl: string;                 // https://...
    
    submittedBy: string;                  // Creator wallet
    submittedAt: number;
    approvedBy: string;                   // Curator wallet
    approvedAt: number;
    
    category?: string;                    // "music"
    format?: string;                      // "mp3"
    duration?: number;                    // seconds
    artists?: string;
    genre?: string;
  };
};
```

**Why**: Explicit structure that Zora expects + room for custom metadata. Mapping from Release → IPFSMetadata is type-safe.

---

### **Section 5: Action Types**
```typescript
export type CuratorAction = {
  releaseId: string;
  action: 'approve' | 'reject';
  reason?: string;
};

export type ResolutionResult = {
  source: 'catalogue' | 'ens' | 'ipfs' | 'zora';
  release: Release;
  fallbackUsed: boolean;
};
```

**Why**: Store methods accept CuratorAction. Resolution logic returns ResolutionResult. Clear contracts.

---

## **How types.ts Becomes the Hub**

### **Example 1: MetadataForm → Store → API**

```typescript
// 1. Component validates input
import { ReleaseSubmissionInput } from '@/lib/types';
const form = useForm<ReleaseSubmissionInput>({ ... });

// 2. Component submits to store
const release = await submitRelease(form.getValues());
                                    ↓
// 3. Store expects this type
submitRelease: (input: ReleaseSubmissionInput) => Promise<Release>;

// 4. Store calls API
fetch('/api/submit', {
  body: JSON.stringify(input)  // Type: ReleaseSubmissionInput
})

// 5. API receives typed data and returns Release
return Response.json(created as Release);

// 6. Store updates state
set({ submissions: [...state.submissions, created] });
                                        ↑
                                   Type: Release
```

**Result**: Input → Store → API → Response all type-safe, single source of truth.

---

### **Example 2: Release → IPFS Metadata**

```typescript
// 1. Start with typed Release
const release: PublishedRelease = { ... };

// 2. Transform to IPFSMetadata
function releaseToIPFSMetadata(release: Release): IPFSMetadata {
  return {
    name: release.title,                    // string → string ✅
    description: release.description,
    image: release.media,                   // WAIT: media is audio!
    animation_url: release.media,           // Use here instead
    content: {
      mime: 'audio/mpeg',                   // From format
      uri: release.media
    },
    properties: {
      catalogueId: release.id,
      submittedBy: release.createdBy,
      submittedAt: release.createdAt,
      approvedBy: release.approvedBy,       // Must be defined!
      approvedAt: release.approvedAt        // TypeScript enforces
    }
  };
}

// 3. TypeScript catches the mapping errors
// ✅ Media is audio, goes to animation_url
// ✅ approvedBy is only defined after approval
// ✅ Function signature documents the transformation
```

**Result**: Impossible to accidentally mismap fields. Type compiler guides the transformation.

---

### **Example 3: Mocks Conform to Types**

```typescript
// 1. Define mock releases
import { PublishedRelease } from '@/lib/types';

export const MOCK_RELEASES: PublishedRelease[] = [
  {
    id: 'PDA-001',
    title: 'First Release',
    status: 'published',
    // ... all required fields ...
    zoraNFT: 'base:0x.../1',  // TypeScript requires this
    metadataURI: 'ipfs://Qm...',
  }
];

// 2. If you forget a field:
// ❌ Type Error: Property 'zoraNFT' is missing in type

// 3. MSW handlers use same type:
export const handlers = [
  http.get('/api/releases', () => {
    return HttpResponse.json({ releases: MOCK_RELEASES });
                                              ↑
                                   All properly typed
  })
];

// 4. Components receive mock data with exact same type as real data
const { allReleases } = useCatalogueStore();  // Type: Release[]
// Works whether data comes from mock or real API
```

**Result**: Mocks are reliable test data. No surprises when switching to real API.

---

## **Execution Timeline: How to Build types.ts**

### **Step 1: Create lib/types.ts (30 minutes)**

Create file with 5 sections:
1. ReleaseSubmissionInput
2. Release (base)
3. PendingRelease, ApprovedRelease, PublishedRelease (state guards)
4. IPFSMetadata
5. CuratorAction, ResolutionResult

**Checkpoint**: 
- ✅ File has no runtime (just types)
- ✅ No compilation errors
- ✅ All types defined and exported

---

### **Step 2: Create lib/validation.ts (45 minutes)**

For each type in types.ts, create Zod schema:

```typescript
import { z } from 'zod';
import { ReleaseSubmissionInput, Release, IPFSMetadata } from '@/lib/types';

// Validation schema for form input
export const ReleaseSubmissionSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(2000),
  media: z.string().regex(/^ipfs:\/\//),
  artists: z.string().optional(),
  duration: z.number().positive().optional(),
  format: z.string().optional(),
  category: z.string().optional(),
});

// Full Release validation (for storage)
export const ReleaseSchema = z.object({
  id: z.string(),
  createdBy: z.string().regex(/^0x/),
  createdAt: z.number(),
  title: z.string(),
  description: z.string(),
  media: z.string(),
  status: z.enum(['pending', 'approved', 'published']),
  approvedBy: z.string().optional(),
  approvedAt: z.number().optional(),
  metadataURI: z.string().optional(),
  zoraNFT: z.string().optional(),
  tokenId: z.string().optional(),
  ensSubname: z.string().optional(),
});

// IPFS metadata validation
export const IPFSMetadataSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string(),
  animation_url: z.string().optional(),
  content: z.object({
    mime: z.string(),
    uri: z.string(),
  }).optional(),
  properties: z.object({
    catalogueId: z.string(),
    // ... all properties fields
  }),
});
```

**Checkpoint**:
- ✅ All Zod schemas compile
- ✅ ReleaseSubmissionSchema matches ReleaseSubmissionInput
- ✅ ReleaseSchema matches Release type

---

### **Step 3: Create lib/mocks/fixtures.ts (30 minutes)**

Create mock data that conforms to types:

```typescript
import { PublishedRelease, PendingRelease } from '@/lib/types';

export const MOCK_RELEASES: PublishedRelease[] = [
  {
    id: 'PDA-001',
    title: 'First Release',
    description: 'A foundational release',
    media: 'ipfs://QmMedia1',
    createdBy: '0x742d35Cc6634C0532925a3b844Bc9e7595f42e8',
    createdAt: Date.now() - 86400000,
    status: 'published',
    approvedBy: '0x...',
    approvedAt: Date.now() - 86400000,
    metadataURI: 'ipfs://QmMetadata1',
    zoraNFT: 'base:0xZora/1',
    tokenId: '1',
    ensSubname: 'first-release.palaupalau.eth',
  },
];

export const MOCK_PENDING_REQUESTS: PendingRelease[] = [
  {
    id: 'PDA-002',
    title: 'Awaiting Approval',
    description: 'Pending release',
    media: 'ipfs://QmMedia2',
    createdBy: '0x123...',
    createdAt: Date.now(),
    status: 'pending',
  },
];
```

**Checkpoint**:
- ✅ MOCK_RELEASES typed as PublishedRelease[]
- ✅ All published releases have all required fields
- ✅ MOCK_PENDING_REQUESTS typed as PendingRelease[]
- ✅ Pending releases don't have approval/NFT fields

---

### **Step 4: Create lib/mocks/handlers.ts (45 minutes)**

MSW handlers that return typed data:

```typescript
import { http, HttpResponse } from 'msw';
import { Release, ReleaseSubmissionInput } from '@/lib/types';
import { ReleaseSubmissionSchema } from '@/lib/validation';
import { MOCK_RELEASES, MOCK_PENDING_REQUESTS } from './fixtures';

let submissions: Release[] = [];
let pending: Release[] = [...MOCK_PENDING_REQUESTS];

export const handlers = [
  http.post('/api/submit', async ({ request }) => {
    // Parse and validate input
    const input = (await request.json()) as ReleaseSubmissionInput;
    
    // Create new release
    const newRelease: Release = {
      id: `PDA-${String(submissions.length + 1).padStart(3, '0')}`,
      ...input,
      createdBy: '0x...',
      status: 'pending',
      createdAt: Date.now(),
    };
    
    submissions.push(newRelease);
    pending.push(newRelease);
    
    // Return typed response
    return HttpResponse.json(newRelease, { status: 201 });
  }),

  http.post('/api/curator/approve/:id', ({ params }) => {
    const release = pending.find(r => r.id === params.id);
    if (release) {
      release.status = 'approved';
      release.approvedBy = '0x...';
      release.approvedAt = Date.now();
      pending = pending.filter(r => r.id !== params.id);
      
      // Return typed PublishedRelease (will become after mint)
      return HttpResponse.json(release);
    }
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),

  // ... more handlers
];
```

**Checkpoint**:
- ✅ All handlers return typed Release objects
- ✅ Validation schemas used to parse input
- ✅ Mocks ready for component testing

---

## **How This Enables Everything Else**

Once types.ts exists:

### **Components are Type-Safe**
```typescript
interface ReleaseCardProps {
  release: PublishedRelease;  // Compiler knows what fields exist
}

export function ReleaseCard({ release }: ReleaseCardProps) {
  return (
    <div>
      <h3>{release.title}</h3>
      <p>NFT: {release.zoraNFT}</p>  // Safe: field exists on PublishedRelease
      <p>Curator: {release.approvedBy}</p>  // Safe: field exists
    </div>
  );
}
```

### **Store is Type-Safe**
```typescript
interface CatalogueStore {
  submissions: Release[];
  submitRelease: (input: ReleaseSubmissionInput) => Promise<Release>;
  approveRelease: (id: string) => Promise<PublishedRelease>;
}

// Components know exact signatures
const release = await submitRelease(input);  // Type: Release
const approved = await approveRelease(id);   // Type: PublishedRelease
```

### **Validation is Aligned**
```typescript
// Form validates against schema that matches type
useForm<ReleaseSubmissionInput>({
  resolver: zodResolver(ReleaseSubmissionSchema)
});

// Guaranteed: validated data matches what store expects
```

### **IPFS Transformation is Type-Safe**
```typescript
export function releaseToIPFSMetadata(release: Release): IPFSMetadata {
  // TypeScript ensures Release fields map to IPFSMetadata fields
  // Compiler catches missing fields or wrong types
}
```

### **API Contracts are Clear**
```typescript
// Phase 3: Backend knows exactly what to return
export async function POST(req: Request) {
  const release: Release = await db.create(input);
  return Response.json(release);  // Type contract enforced
}
```

---

## **The Payoff**

After spending 2-3 hours on types.ts:

### ✅ Immediate Benefits
- Compile-time type checking across entire app
- IDE autocomplete in components
- Self-documenting data model
- Clear state transitions (pending → approved → published)

### ✅ Later Benefits (as project grows)
- Easy to refactor (update type, compiler guides all changes)
- New team members understand data structure immediately
- Mocks are reliable because they match types
- Phase 3 backend integrates smoothly

### ✅ Safety Benefits
- No "undefined field" runtime errors
- No field name typos
- No accidental state transitions
- No data shape mismatches between layers

---

## **Ready to Build?**

The strategy is:

1. **I create lib/types.ts** (30 min) - Single comprehensive file
2. **I create lib/validation.ts** (45 min) - Zod schemas matching types
3. **I create lib/mocks/fixtures.ts** (30 min) - Mock data conforming to types
4. **I create lib/mocks/handlers.ts** (45 min) - MSW handlers returning typed data
5. **You review** - Verify structure matches your vision
6. **Start Step 2** - Building components with types in place

**Total: ~2-3 hours for the foundation that supports the rest of the architecture**

Should I proceed with creating these files?

