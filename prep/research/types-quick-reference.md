# Types.ts Quick Reference Guide

---

## **One-Page Overview**

### **What is types.ts?**

A single TypeScript file that defines the **complete shape** of your Release object across all stages (pending → approved → published) and all systems (Catalogue → IPFS → Zora → ENS).

### **Why does it matter?**

Every other file imports from it:
- Form validators know what shape to accept
- Store knows what to save
- Components know what props they receive
- IPFS conversion knows what fields to map
- Mocks know what to return
- API routes know what contracts to honor

**One definition. Everywhere it's needed. Impossible to drift.**

---

## **The Five Sections of types.ts**

```typescript
// SECTION 1: INPUT TYPES
export type ReleaseSubmissionInput = {
  title: string;           // What user provides
  description: string;
  media: string;           // IPFS CID
  artists?: string;
};

// SECTION 2: CORE RELEASE TYPE (All states)
export type Release = {
  id: string;              // PDA-001
  title: string;
  description: string;
  media: string;
  createdBy: string;       // 0xWallet
  createdAt: number;
  status: 'pending' | 'approved' | 'published';
  
  approvedBy?: string;     // Set after approval
  approvedAt?: number;
  
  metadataURI?: string;    // Set after IPFS upload
  zoraNFT?: string;        // Set after mint
  tokenId?: string;
  ensSubname?: string;     // Set after ENS registration
};

// SECTION 3: STATE-SPECIFIC TYPES (Type guards)
export type PendingRelease = Release & {
  status: 'pending';
};

export type ApprovedRelease = Release & {
  status: 'approved';
  approvedBy: string;      // Required once approved
  approvedAt: number;
};

export type PublishedRelease = Release & {
  status: 'published';
  metadataURI: string;     // Required once published
  zoraNFT: string;
  tokenId: string;
  approvedBy: string;
  approvedAt: number;
};

// SECTION 4: IPFS METADATA TYPE
export type IPFSMetadata = {
  name: string;                    // ERC721 required
  description: string;
  image: string;
  animation_url?: string;          // For audio/video
  content?: {
    mime: string;
    uri: string;
  };
  properties: {
    catalogueId: string;           // Back-ref to Release.id
    catalogueUrl: string;
    submittedBy: string;           // From Release.createdBy
    submittedAt: number;           // From Release.createdAt
    approvedBy: string;            // From Release.approvedBy
    approvedAt: number;            // From Release.approvedAt
    category?: string;
    duration?: number;
    format?: string;
    artists?: string;
  };
};

// SECTION 5: ACTION TYPES
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

---

## **The Three Golden Rules**

### **Rule 1: types.ts Imports Nothing**
```typescript
// ✅ GOOD: No dependencies
export type Release = { ... };

// ❌ BAD: Would create circular dependency
import { validate } from '@/lib/validation';  // Don't do this!
```

### **Rule 2: Everything Else Imports from types.ts**
```typescript
// ✅ GOOD: validation.ts
import { Release, ReleaseSubmissionInput } from '@/lib/types';
export const ReleaseSchema = z.object({ ... });

// ✅ GOOD: store.ts
import { Release, ReleaseSubmissionInput } from '@/lib/types';
interface CatalogueStore { ... }

// ✅ GOOD: components
import { PublishedRelease } from '@/lib/types';
function ReleaseCard({ release }: { release: PublishedRelease }) { ... }
```

### **Rule 3: State Is Enforced by Type Definitions**
```typescript
// ❌ You CAN'T do this:
function displayNFT(release: Release) {
  return <div>{release.zoraNFT}</div>;
  // Error: zoraNFT might not exist (optional field)
}

// ✅ But you CAN do this:
function displayNFT(release: PublishedRelease) {
  return <div>{release.zoraNFT}</div>;
  // Safe: zoraNFT is required on PublishedRelease
}

// ✅ Or you can do this:
function displayNFT(release: Release) {
  if (release.status === 'published') {
    // Inside here, TypeScript knows it's PublishedRelease
    return <div>{release.zoraNFT}</div>;
  }
}
```

---

## **How It's Used (By Layer)**

### **Layer 1: Form Input**
```typescript
// components/MetadataForm.tsx
import { ReleaseSubmissionInput } from '@/lib/types';
import { ReleaseSubmissionSchema } from '@/lib/validation';

const { register } = useForm<ReleaseSubmissionInput>({
  resolver: zodResolver(ReleaseSubmissionSchema)
});

// Form validates input matches ReleaseSubmissionInput type
```

### **Layer 2: State Management**
```typescript
// lib/store.ts
import { Release, ReleaseSubmissionInput } from '@/lib/types';

submitRelease: (input: ReleaseSubmissionInput) => Promise<Release>;

// Store accepts ReleaseSubmissionInput, returns Release
```

### **Layer 3: Mock API**
```typescript
// lib/mocks/handlers.ts
import { Release, ReleaseSubmissionInput } from '@/lib/types';

http.post('/api/submit', async ({ request }) => {
  const input = (await request.json()) as ReleaseSubmissionInput;
  const created: Release = { ... };
  return HttpResponse.json(created);
});

// Mock returns Release (same type as real API will)
```

### **Layer 4: Components**
```typescript
// components/ReleaseCard.tsx
import { PublishedRelease } from '@/lib/types';

export function ReleaseCard({ release }: { release: PublishedRelease }) {
  return (
    <div>
      <h3>{release.title}</h3>
      <p>NFT: {release.zoraNFT}</p>  // Safe: field guaranteed to exist
    </div>
  );
}
```

### **Layer 5: IPFS Conversion**
```typescript
// lib/utils/ipfs.ts
import { Release, IPFSMetadata } from '@/lib/types';

export function releaseToIPFSMetadata(release: Release): IPFSMetadata {
  return {
    name: release.title,
    description: release.description,
    image: release.media,              // Wait, media is audio!
    animation_url: release.media,      // Use here
    properties: {
      catalogueId: release.id,
      submittedBy: release.createdBy,
      approvedBy: release.approvedBy,  // Must be defined!
      approvedAt: release.approvedAt
    }
  };
}
```

**TypeScript catches field mismatches ✅**

---

## **State Transitions Explained**

### **Pending → Approved**
```typescript
// PendingRelease doesn't have approval fields
const pending: PendingRelease = {
  id: 'PDA-001',
  title: 'Title',
  status: 'pending'
  // (no approvedBy, approvedAt, no NFT fields)
};

// After curator approves, becomes ApprovedRelease
const approved: ApprovedRelease = {
  ...pending,
  status: 'approved',
  approvedBy: '0xCurator...',    // NOW required
  approvedAt: Date.now()          // NOW required
};

// Component can enforce state
function CuratorReview({ release }: { release: PendingRelease }) {
  // This component ONLY receives PendingRelease
  // Curator hasn't acted yet
}

function ApprovalDetails({ release }: { release: ApprovedRelease }) {
  // This component ONLY receives ApprovedRelease
  // Can safely access release.approvedBy
  return <p>Approved by: {release.approvedBy}</p>;
}
```

### **Approved → Published**
```typescript
// After IPFS upload + Zora mint
const published: PublishedRelease = {
  ...approved,
  status: 'published',
  metadataURI: 'ipfs://Qm...',    // NOW required
  zoraNFT: 'base:0xZora/1',       // NOW required
  tokenId: '1'                     // NOW required
};

// Components that need NFT data require PublishedRelease
function NFTDisplay({ release }: { release: PublishedRelease }) {
  return <p>Zora NFT: {release.zoraNFT}</p>;  // Safe
}
```

---

## **Where Each Type Is Used**

| Type | Used In | Why |
|------|---------|-----|
| **ReleaseSubmissionInput** | MetadataForm, validation | What users provide |
| **Release** | Store, API, Mocks | General container |
| **PendingRelease** | Curator board | State-specific UI |
| **ApprovedRelease** | Approval logic | State guard |
| **PublishedRelease** | Catalog display | NFT fields guaranteed |
| **IPFSMetadata** | IPFS conversion | Upload format |
| **CuratorAction** | Store methods | Curator operations |
| **ResolutionResult** | Fallback logic | Resolution outcome |

---

## **TypeScript Compiler as Your Copilot**

### **Example 1: You Forget a Field in Mock**
```typescript
// lib/mocks/fixtures.ts
const release: PublishedRelease = {
  id: 'PDA-001',
  title: 'Title',
  // Missing: status, zoraNFT, metadataURI, etc.
};

// ❌ TypeScript Error: Property 'status' is missing
// You fix it immediately, know exactly what's required
```

### **Example 2: Component Misuses State**
```typescript
function NftLink({ release }: { release: Release }) {
  return <a href={release.zoraNFT}>Link</a>;  // Might be undefined
}

// ⚠️ TypeScript Warning: Property might not exist
// You fix it: require PublishedRelease instead
function NftLink({ release }: { release: PublishedRelease }) {
  return <a href={release.zoraNFT}>Link</a>;  // Safe
}
```

### **Example 3: API Response Mismatch**
```typescript
// Backend returns Release without required field
const data = await fetch('/api/submit');
const release: PublishedRelease = await data.json();
// ❌ TypeScript error: if fields are missing

// You know immediately: API contract broken or data incomplete
```

---

## **Benefits Checklist**

### **Phase 1 (Right Now)**
- ✅ Know exact Release structure
- ✅ Stop guessing what fields exist
- ✅ IDE autocomplete works everywhere
- ✅ Compiler catches typos

### **Phase 2 (Building Components)**
- ✅ Form validates correct types
- ✅ Store methods have clear contracts
- ✅ Components safe from undefined fields
- ✅ Mocks reliable for testing

### **Phase 3 (Backend Integration)**
- ✅ API contracts enforced by types
- ✅ Frontend-backend agreement encoded
- ✅ IPFS conversion type-safe
- ✅ Fallback resolution well-typed

### **Maintenance (Ongoing)**
- ✅ Refactoring guided by compiler
- ✅ New fields easy to add (type then fix errors)
- ✅ State changes enforced
- ✅ No mysterious runtime errors

---

## **The Bottom Line**

**types.ts is not boilerplate.** 

It's the blueprint that:
- ✅ Explains your data model to everyone
- ✅ Prevents entire classes of bugs at compile-time
- ✅ Makes refactoring safe
- ✅ Serves as documentation
- ✅ Enables full-stack type safety

**2-3 hours of work upfront saves 5+ hours of debugging later.**

---

## **Quick Start: What I'm Creating**

```
lib/types.ts (150 lines)
  ├─ ReleaseSubmissionInput
  ├─ Release (base)
  ├─ PendingRelease
  ├─ ApprovedRelease
  ├─ PublishedRelease
  ├─ IPFSMetadata
  └─ CuratorAction, ResolutionResult

lib/validation.ts (100 lines)
  ├─ ReleaseSubmissionSchema
  ├─ ReleaseSchema
  └─ IPFSMetadataSchema

lib/mocks/fixtures.ts (50 lines)
  ├─ MOCK_RELEASES: PublishedRelease[]
  └─ MOCK_PENDING_REQUESTS: PendingRelease[]

lib/mocks/handlers.ts (100 lines)
  ├─ POST /api/submit
  ├─ GET /api/curator/requests
  ├─ POST /api/curator/approve/:id
  └─ GET /api/releases
```

**Ready to start?**

