# Types.ts Dependency Map: Visual Reference

---

## **The Dependency Tree**

```
                           ┌─────────────────────┐
                           │   lib/types.ts      │
                           │ (No dependencies)   │
                           └─────────────────────┘
                                      △
                ┌─────────────────────┼─────────────────────┐
                │                     │                     │
                ▼                     ▼                     ▼
        ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
        │ lib/validation.ts│  │  lib/store.ts    │  │ lib/utils/       │
        │                  │  │                  │  │ (future)         │
        │ Zod schemas      │  │ State mgmt       │  │ ipfs.ts          │
        │ Type inference   │  │ Methods/actions  │  │ ens.ts           │
        └──────────────────┘  └──────────────────┘  └──────────────────┘
                △                     △                     △
                │ imports             │ imports             │ imports
                │ types.ts            │ types.ts +          │ types.ts
                │                     │ validation.ts       │
                ▼                     ▼                     ▼
        ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
        │ components/      │  │ lib/mocks/       │  │ app/api/         │
        │ MetadataForm.tsx │  │ fixtures.ts      │  │ submit/route.ts  │
        │ ReleaseCard.tsx  │  │ handlers.ts      │  │ approve/[id]/    │
        │ ...              │  │                  │  │ route.ts         │
        └──────────────────┘  └──────────────────┘  └──────────────────┘
                △                     △                     △
                │ uses                │ returns             │ returns
                │ types +             │ types               │ types
                │ schemas             │                     │
                │                     │                     │
                └─────────────────────┴─────────────────────┘
                                △
                                │
                        ┌───────────────┐
                        │ All use same  │
                        │ Release type  │
                        └───────────────┘
```

---

## **File Import Graph**

```
lib/types.ts
  └─ NO IMPORTS (pure type definitions)

lib/validation.ts
  ├─ import { ReleaseSubmissionInput } from '@/lib/types'
  ├─ import { Release } from '@/lib/types'
  └─ import { IPFSMetadata } from '@/lib/types'

lib/store.ts
  ├─ import { Release, PublishedRelease, ReleaseSubmissionInput } from '@/lib/types'
  ├─ import { ReleaseSubmissionSchema } from '@/lib/validation'
  └─ import { useCatalogueStore } from '@/lib/store'

lib/mocks/fixtures.ts
  ├─ import { Release, PublishedRelease } from '@/lib/types'
  └─ export const MOCK_RELEASES: PublishedRelease[]

lib/mocks/handlers.ts
  ├─ import { Release, ReleaseSubmissionInput } from '@/lib/types'
  ├─ import { ReleaseSubmissionSchema } from '@/lib/validation'
  └─ import { MOCK_RELEASES } from './fixtures'

components/MetadataForm.tsx
  ├─ import { ReleaseSubmissionInput } from '@/lib/types'
  ├─ import { ReleaseSubmissionSchema } from '@/lib/validation'
  └─ import { useCatalogueStore } from '@/lib/store'

components/ReleaseCard.tsx
  ├─ import { PublishedRelease } from '@/lib/types'
  └─ import { useCatalogueStore } from '@/lib/store'

app/api/submit/route.ts [Phase 3]
  ├─ import { Release, ReleaseSubmissionInput } from '@/lib/types'
  ├─ import { ReleaseSubmissionSchema } from '@/lib/validation'
  └─ export async function POST(req: Request)

lib/utils/ipfs.ts [Phase 2+]
  ├─ import { Release, IPFSMetadata } from '@/lib/types'
  └─ export function releaseToIPFSMetadata(release: Release): IPFSMetadata
```

---

## **Type Flow Through a User Action**

### **Scenario: User submits a release**

```
┌─ USER SUBMITS FORM ──────────────────────────────────────────────────────┐
│                                                                          │
│ components/MetadataForm.tsx                                             │
│   ├─ useForm<ReleaseSubmissionInput>()                                  │
│   │  └─ Type from: lib/types.ts::ReleaseSubmissionInput                 │
│   │                                                                      │
│   ├─ zodResolver(ReleaseSubmissionSchema)                               │
│   │  └─ Schema from: lib/validation.ts::ReleaseSubmissionSchema         │
│   │     Which validates: ReleaseSubmissionInput                         │
│   │                                                                      │
│   └─ onSubmit(data: ReleaseSubmissionInput)                             │
│      └─ data type guaranteed by validation schema                       │
│                                                                          │
│ ✅ Input is type-safe, validated, ready to send                         │
└──────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─ SUBMIT TO STORE ────────────────────────────────────────────────────────┐
│                                                                          │
│ lib/store.ts::submitRelease()                                           │
│   ├─ Input: ReleaseSubmissionInput                                      │
│   │   └─ From: lib/types.ts::ReleaseSubmissionInput                     │
│   │                                                                      │
│   ├─ Creates: Release = {                                              │
│   │     ...input,                    // Type-safe spread              │
│   │     id: generateId(),            // string                         │
│   │     createdBy: wallet,           // 0x string                      │
│   │     status: 'pending',           // literal 'pending'              │
│   │     createdAt: Date.now()        // number                         │
│   │   }                                                                 │
│   │   └─ Result type: Release                                           │
│   │      From: lib/types.ts::Release                                    │
│   │                                                                      │
│   └─ fetch('/api/submit', { body: JSON.stringify(input) })              │
│      └─ MSW intercepts and handles                                       │
│                                                                          │
│ ✅ Store creates typed Release, sends to API                             │
└──────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─ MOCK API (MSW) ─────────────────────────────────────────────────────────┐
│                                                                          │
│ lib/mocks/handlers.ts                                                   │
│   ├─ http.post('/api/submit', async ({ request }) => {                  │
│   │   ├─ const input: ReleaseSubmissionInput                            │
│   │   │   = await request.json()                                        │
│   │   │   └─ Type from: lib/types.ts                                    │
│   │   │                                                                  │
│   │   ├─ Validate: ReleaseSubmissionSchema.parse(input)                 │
│   │   │   └─ Schema from: lib/validation.ts                             │
│   │   │                                                                  │
│   │   ├─ Create: Release = { id, ...input, status: 'pending' }          │
│   │   │   └─ Type: Release                                              │
│   │   │      From: lib/types.ts::Release                                │
│   │   │                                                                  │
│   │   └─ return HttpResponse.json(newRelease)                           │
│   │       └─ Returns: { ...Release object }                             │
│   │          Type: Release                                              │
│   │                                                                      │
│ ✅ MSW returns typed Release, same shape as real API would              │
└──────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─ STORE UPDATES STATE ────────────────────────────────────────────────────┐
│                                                                          │
│ lib/store.ts                                                            │
│   └─ set({ submissions: [...state.submissions, created] })              │
│      ├─ created type: Release                                           │
│      └─ submissions type: Release[]                                     │
│         └─ From: lib/types.ts::Release                                  │
│                                                                          │
│ ✅ State is type-safe Release[]                                          │
└──────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─ COMPONENT RE-RENDERS ───────────────────────────────────────────────────┐
│                                                                          │
│ MetadataForm.tsx                                                        │
│   └─ Shows: "Submission PDA-001 created, awaiting approval"             │
│      ├─ release.id from: Release type                                   │
│      └─ release.status from: Release type                               │
│         └─ From: lib/types.ts::Release                                  │
│                                                                          │
│ ✅ Component accesses typed Release, IDE autocomplete works              │
└──────────────────────────────────────────────────────────────────────────┘
```

**Every step is type-safe because all types flow from lib/types.ts**

---

## **Type Alignment Across Systems**

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    FRONTEND STATE (lib/store.ts)                        │
│                                                                         │
│  submissions: Release[]  (type from lib/types.ts)                      │
│  {                                                                      │
│    id: 'PDA-001'                                                       │
│    title: 'Release Title'                                              │
│    status: 'pending'                                                   │
│    createdBy: '0x...'                                                  │
│    createdAt: 1699564800                                               │
│  }                                                                      │
│                                                                         │
│  Type definition ensures: all components agree on these fields          │
└──────────────────────────────────────────────────────────────────────────┘
                                    ↓
                            (curator approves)
                                    ↓
┌──────────────────────────────────────────────────────────────────────────┐
│                        IPFS METADATA (to upload)                         │
│                                                                         │
│  {                                                                      │
│    name: 'Release Title'          ← from Release.title                  │
│    description: '...'             ← from Release.description            │
│    image: 'ipfs://QmXXX'          ← from Release.media                  │
│    animation_url: 'ipfs://QmXXX'  ← from Release.media                  │
│    properties: {                                                        │
│      catalogueId: 'PDA-001',      ← from Release.id                     │
│      approvedBy: '0x...',         ← from Release.approvedBy             │
│      approvedAt: 1699651200       ← from Release.approvedAt             │
│    }                                                                    │
│  }                                                                      │
│                                                                         │
│  Type definition ensures: mapping from Release to IPFSMetadata is safe  │
└──────────────────────────────────────────────────────────────────────────┘
                                    ↓
                    (upload to IPFS, mint NFT)
                                    ↓
┌──────────────────────────────────────────────────────────────────────────┐
│                   ZORA NFT (on Base L2)                                  │
│                                                                         │
│  token = {                                                              │
│    tokenId: '1'                   ← stored in Release.tokenId           │
│    tokenURI: 'ipfs://QmMetadata'  ← stored in Release.metadataURI      │
│    owner: '0xCreator'             ← stored in Release.createdBy         │
│  }                                                                      │
│                                                                         │
│  Zora returns typed Release, same fields as frontend Release            │
└──────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌──────────────────────────────────────────────────────────────────────────┐
│                   ENS SUBNAME (on L1)                                    │
│                                                                         │
│  Text records for: first-release.palaupalau.eth                        │
│  {                                                                      │
│    "catalogue-id": "PDA-001"                                            │
│    "metadata": "ipfs://QmMetadata"                                      │
│    "nft": "base:0xZora/1"                                               │
│  }                                                                      │
│                                                                         │
│  All values derived from Release object fields                          │
└──────────────────────────────────────────────────────────────────────────┘

All four storage layers represent the SAME Release
All use types defined in lib/types.ts
All are type-safe and synchronized
```

---

## **State Transition Type Safety**

```
┌─ PendingRelease ────────────────────────┐
│                                         │
│ {                                       │
│   id, title, description, media,        │
│   createdBy, createdAt                  │
│   status: 'pending'                     │
│   (NO approval fields yet)               │
│ }                                       │
│                                         │
│ Type guarantees: curator hasn't acted   │
└─────────────────────────────────────────┘
              ↓ (curator approves)
┌─ ApprovedRelease ───────────────────────┐
│                                         │
│ {                                       │
│   ... (all PendingRelease fields)       │
│   status: 'approved'                    │
│   approvedBy: string (required)         │
│   approvedAt: number (required)         │
│ }                                       │
│                                         │
│ Type guarantees: approval is complete   │
└─────────────────────────────────────────┘
              ↓ (upload IPFS, mint NFT)
┌─ PublishedRelease ──────────────────────┐
│                                         │
│ {                                       │
│   ... (all fields from approved)        │
│   status: 'published'                   │
│   metadataURI: string (required)        │
│   zoraNFT: string (required)            │
│   tokenId: string (required)            │
│ }                                       │
│                                         │
│ Type guarantees: released on-chain      │
└─────────────────────────────────────────┘

TypeScript compiler ensures:
  ✅ Cannot skip to 'published' without going through 'approved'
  ✅ Cannot access zoraNFT on a PendingRelease (type error)
  ✅ Component requiring PublishedRelease won't accept PendingRelease
```

---

## **Why This Matters at Scale**

### **Scenario 1: Adding a New Field**

```
Current Release type:
{
  id, title, description, ...
  status: 'pending' | 'approved' | 'published'
}

Requirement: Track submission deadline

1. Update lib/types.ts
   ├─ Add: submissionDeadline?: number
   │
2. TypeScript breaks all consumers
   ├─ components/...tsx        ← add field handling
   ├─ lib/validation.ts        ← add schema
   ├─ lib/mocks/fixtures.ts    ← add to mocks
   ├─ lib/mocks/handlers.ts    ← add to responses
   └─ lib/store.ts             ← add to store logic
   │
3. Done: Field is everywhere it needs to be
   ├─ Components handle it
   ├─ Validation checks it
   ├─ Mocks reflect it
   ├─ Store stores it
   └─ API returns it

Result: No forgotten places. No "where should this go?" questions.
```

### **Scenario 2: Changing a Field Type**

```
Current: 
  status: 'pending' | 'approved' | 'published'

New requirement: Add 'rejected' status

1. Update lib/types.ts
   ├─ status: 'pending' | 'approved' | 'published' | 'rejected'
   │
2. TypeScript breaks:
   ├─ All switch statements on status ← must handle 'rejected'
   ├─ All type guards ← must handle new state
   ├─ Mocks ← must include rejected release
   └─ MSW handlers ← must handle rejection
   │
3. Done: All code paths updated

Result: Impossible to forget a case. Compiler guides all changes.
```

---

## **Testing the Type System**

```typescript
// When lib/types.ts is defined, you can test type safety:

// ✅ This compiles (all required fields present)
const validRelease: PublishedRelease = {
  id: 'PDA-001',
  title: 'Title',
  // ... all required fields
  zoraNFT: 'base:0x.../1',     // required for published
  status: 'published'
};

// ❌ This does NOT compile (missing required field)
const invalidRelease: PublishedRelease = {
  id: 'PDA-001',
  title: 'Title',
  // ... other fields
  // zoraNFT missing! ← TypeScript error
  status: 'published'
};

// ❌ This does NOT compile (wrong status)
const wrongStatus: PublishedRelease = {
  // ...all fields...
  status: 'pending'  // ← Should be 'published'
};

// ✅ This is safe (type guard works)
function displayNFT(release: Release) {
  if (release.status === 'published') {
    // Inside this block, TypeScript knows it's PublishedRelease
    return <div>{release.zoraNFT}</div>;  // Safe: field exists
  }
}
```

---

## **Summary: The Type Hub Architecture**

```
                    ┌─────────────────┐
                    │ lib/types.ts    │
                    │ (Single Source  │
                    │  of Truth)      │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
    ┌────────────┐      ┌─────────┐        ┌──────────┐
    │ Validation │      │  Store  │        │ Mocks    │
    │ Schemas    │      │  State  │        │ Data     │
    └────────────┘      └─────────┘        └──────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
           ┌─────────┐            ┌──────────────┐
           │Components│            │ API Routes   │
           │Receive   │            │(Phase 3)     │
           │Typed     │            │Return        │
           │Props     │            │Typed Data    │
           └─────────┘            └──────────────┘

Result: Consistency, safety, and clarity across the entire architecture
```

