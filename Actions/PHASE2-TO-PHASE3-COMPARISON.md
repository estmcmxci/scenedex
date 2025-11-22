# 📊 PHASE 2 → PHASE 3: What Changes (and What Doesn't)

---

## QUICK COMPARISON TABLE

| Aspect | Phase 2 (NOW) | Phase 3 (Day 1+) | Change? |
|--------|---------------|-----------------|---------|
| Frontend | Next.js React | Same | ✅ No |
| State Management | Zustand (client) | Zustand + Real Backend | ⚠️ Evolves |
| Mock Data | MSW (Mock Service Worker) | Real API Endpoints | 🔄 Complete replacement |
| Storage Location | Browser LocalStorage | PostgreSQL Database | 🔄 Complete replacement |
| File Storage | Simulated | Storacha (IPFS) | 🔄 Complete replacement |
| NFT Minting | Mocked response | Real Zora contract | 🔄 Complete replacement |
| ENS Registration | Simulated | Real ENS contract | 🔄 Complete replacement |
| Multisig Auth | Mocked signatures | Real Safe multisig | 🔄 Complete replacement |

---

## PHASE 2: THE CURRENT STATE

### Architecture Diagram
```
┌─────────────────────────────────────┐
│      Frontend (Next.js React)       │
├─────────────────────────────────────┤
│                                     │
│  ReleaseForm.tsx                    │
│    ↓                                │
│  ReleaseStore (Zustand)             │
│    ↓ writes to localStorage          │
│  Browser LocalStorage               │
│                                     │
│  CuratorDashboard.tsx               │
│    ↓ reads from                     │
│  MSW Mock Handlers                  │
│    ↓ returns mock data              │
│  Mock Release Data                  │
│                                     │
└─────────────────────────────────────┘

No Backend.  No Database.  No IPFS.  No Blockchain.
```

### What You Have Working
```typescript
// ReleaseForm.tsx
const handleSubmit = async (data) => {
  // Frontend validates
  const validation = ReleaseSubmissionSchema.safeParse(data);
  
  // Frontend sends to MSW handler
  const response = await fetch('/api/submit', { ... });
  
  // MSW intercepts, returns mock data
  // MSW handler: lib/mocks/handlers/releases.ts
  
  // Frontend receives:
  {
    success: true,
    release: {
      id: 'PDA-001',
      title: 'My Song',
      status: 'pending',
      // ... all fields mocked
    }
  }
  
  // Frontend stores in Zustand + localStorage
  useReleaseStore.getState().addPublishedRelease(release);
};
```

### MSW Handlers (Current)
```typescript
// lib/mocks/handlers/releases.ts
export const releaseHandlers = [
  http.post('/api/submit', async ({ request }) => {
    // 1. Parse request
    const formData = await request.formData();
    
    // 2. Create mock release
    const mockRelease = {
      id: `PDA-${Math.random()}`,
      title: formData.get('title'),
      status: 'pending',
      mediaIPFSHash: 'QmMockHash123...',
      // ... etc
    };
    
    // 3. Return mock response
    return HttpResponse.json({
      success: true,
      release: mockRelease
    });
  }),
  
  http.post('/api/curator/approve', async ({ request }) => {
    // Mock approval
    return HttpResponse.json({
      success: true,
      release: { ...release, status: 'approved' }
    });
  })
];
```

### Data Flow (Phase 2)
```
User fills form
    ↓
Frontend validates with Zod schema
    ↓
fetch('/api/submit')
    ↓
MSW intercepts in browser
    ↓
MSW handler returns mock data
    ↓
Frontend stores in Zustand
    ↓
Zustand persists to localStorage
    ↓
Page refreshes → reads from localStorage
```

### Limitations
```
❌ Data lost when localStorage cleared
❌ No approval workflow (mocked)
❌ No IPFS pinning (simulated)
❌ No blockchain interaction (mocked)
❌ Can't have multiple users (all in same browser)
❌ No audit trail
❌ Can't scale to real usage
```

---

## PHASE 3: WHAT CHANGES (Day 1 Onwards)

### Architecture Diagram
```
┌──────────────────────────────────────────────────────────────────┐
│                   Frontend (Next.js React)                       │
├──────────────────────────────────────────────────────────────────┤
│  ReleaseForm.tsx → fetch /api/submit (REAL)                     │
│  CuratorDashboard.tsx → fetch /api/curator/pending (REAL)      │
│  ReleaseDisplay.tsx → fetch /api/releases (REAL)               │
└────────────┬─────────────────────────────────────┬──────────────┘
             │                                      │
             ↓                                      ↓
    ┌─────────────────────┐           ┌────────────────────────┐
    │  Backend (Node)     │           │  Wallet (Wagmi)        │
    │                     │           │                        │
    │ POST /api/submit    │           │  signMessage()         │
    │ POST /api/approve   │           │  sendTransaction()     │
    │ GET /api/releases   │           │                        │
    └────────┬────────────┘           └────────────────────────┘
             │
   ┌─────────┴──────────────────────┬────────────────┬─────────┐
   │                                │                │         │
   ↓                                ↓                ↓         ↓
┌──────────────────┐    ┌─────────────────────┐  ┌────────┐  ┌──────┐
│  PostgreSQL DB   │    │ IPFS / Storacha     │  │Ethereum│  │ Base │
│                  │    │                     │  │  L1    │  │  L2  │
│ - Releases       │    │ - Audio files       │  │Factor  │  │ Zora │
│ - Approvals      │    │ - Images            │  │ Contr  │  │NFT   │
│ - Curators       │    │ - Metadata JSON     │  │        │  │      │
│ - Audit Log      │    │                     │  │        │  │      │
└──────────────────┘    └─────────────────────┘  └────────┘  └──────┘
```

### What Changes in Frontend Code

#### ReleaseForm.tsx
```typescript
// BEFORE (Phase 2)
const handleSubmit = async (data) => {
  const response = await fetch('/api/submit', {
    method: 'POST',
    body: formData
  });
  // MSW intercepts, returns mock
  const { release } = await response.json();
  store.addPublishedRelease(release); // ← Wrong! Mocked
};

// AFTER (Phase 3)
const handleSubmit = async (data) => {
  const response = await fetch('/api/submit', {
    method: 'POST',
    body: formData
  });
  // Real backend processes
  const { release } = await response.json();
  
  // Store PENDING release (not published yet)
  // Later, when curator approves → becomes approved
  // Then after IPFS + blockchain → becomes published
  
  toast.success('Release submitted! Awaiting curation.');
  // User checks dashboard to see approval progress
};
```

**Key difference:** 
- Phase 2: Everything is published immediately (mocked)
- Phase 3: Release stays pending until curator approves

#### CuratorDashboard.tsx
```typescript
// BEFORE (Phase 2)
const { data: pending } = useQuery(
  ['pending'],
  () => fetch('/api/curator/pending')
    .then(r => r.json())
);
// MSW returns: hard-coded 1-2 mock releases

// AFTER (Phase 3)
const { data: pending } = useQuery(
  ['pending'],
  () => fetch('/api/curator/pending?address=0x123...')
    .then(r => r.json()),
  { refetchInterval: 5000 } // Poll real DB
);
// Backend returns: Query from PostgreSQL
// SELECT * FROM releases WHERE status='pending'
// Result: Real releases, updated in real-time
```

**Key difference:**
- Phase 2: Hard-coded mock data
- Phase 3: Real data from database, with real approval signatures

---

## STEP-BY-STEP: REPLACING MSW WITH REAL BACKEND

### Example: The `/api/submit` Endpoint

#### PHASE 2 (Current - MSW Handler)
```typescript
// lib/mocks/handlers/releases.ts
http.post('/api/submit', async ({ request }) => {
  const formData = await request.formData();
  
  const mockRelease = {
    id: `PDA-${Math.random()}`,
    title: formData.get('title'),
    description: formData.get('description'),
    status: 'pending',
    mediaIPFSHash: 'QmMockHash123...',
    duration: 180,
    artists: formData.get('artists'),
    createdBy: '0xMockUser123',
    createdAt: Date.now(),
  };
  
  return HttpResponse.json({
    success: true,
    release: mockRelease
  });
});
```

#### PHASE 3 (Real - Backend API Route)
```typescript
// backend/routes/submit.ts (NEW FILE)
import { NextRequest, NextResponse } from 'next/server';
import { ReleaseSubmissionSchema } from '@/lib/validation';
import db from '@/backend/services/database';
import { pinToIPFS } from '@/backend/services/ipfs';

export async function POST(req: NextRequest) {
  try {
    // 1. Parse multipart form data
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file') as File;
    const artists = formData.get('artists') as string;
    const userAddress = req.headers.get('x-user-address');
    
    // 2. Validate
    const validation = ReleaseSubmissionSchema.safeParse({
      title,
      description,
      mediaFile: file,
      artists
    });
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors },
        { status: 400 }
      );
    }
    
    // 3. Extract metadata from MP3
    const duration = await extractDuration(file);
    const coverImage = await extractCoverArt(file);
    
    // 4. Pin to IPFS (temporary - only media, not metadata yet)
    const mediaIPFSHash = await pinToIPFS(file);
    const coverImageHash = await pinToIPFS(coverImage);
    
    // 5. Generate unique ID
    const releaseId = `PDA-${String(Date.now()).slice(-6)}`;
    
    // 6. Store in PostgreSQL
    const release = await db.releases.create({
      id: releaseId,
      title,
      description,
      artists,
      mediaIPFSHash,
      coverImageHash,
      duration,
      createdBy: userAddress,
      createdAt: new Date(),
      status: 'pending', // ← NOT published!
    });
    
    // 7. Add audit log
    await db.auditLog.create({
      eventType: 'submission',
      releaseId,
      actor: userAddress,
      details: { title, artists }
    });
    
    return NextResponse.json({
      success: true,
      release: release
    });
    
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

**Key Changes:**
1. ✅ Real file processing (duration extraction, cover art)
2. ✅ Real IPFS pinning (Storacha client)
3. ✅ Real database storage (PostgreSQL)
4. ✅ Status stays 'pending' (not published)
5. ✅ Real error handling and validation
6. ✅ Audit logging for compliance

---

### Example: The Approval Flow

#### PHASE 2 (Mock)
```typescript
// CuratorDashboard.tsx
const handleApprove = async (releaseId) => {
  // Just sends to MSW handler
  const response = await fetch('/api/curator/approve', {
    method: 'POST',
    body: JSON.stringify({ releaseId })
  });
  
  // MSW returns: { success: true, release: { status: 'approved' } }
  // ❌ No real signature verification
  // ❌ No multisig threshold checking
  // ❌ No blockchain publishing
};
```

#### PHASE 3 (Real)
```typescript
// CuratorDashboard.tsx
const handleApprove = async (releaseId) => {
  // 1. Sign message with curator's wallet
  const messageHash = solidityPackedKeccak256(
    ['string', 'string'],
    ['RELEASE_APPROVAL', releaseId]
  );
  
  const signature = await signer.signMessage(
    getAddress(messageHash)
  );
  
  // 2. Send to real backend
  const response = await fetch('/api/curator/approve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      releaseId,
      curatorAddress: signer.address,
      signature
    })
  });
  
  const { release } = await response.json();
  
  // 3. Check approval progress
  toast(`${release.approvals.length}/${release.approvalThreshold} approvals`);
  
  // 4. Once threshold met, system automatically:
  //    - Pins metadata to IPFS
  //    - Calls Factory.publishRelease
  //    - Mints NFT on Base L2
  //    - Registers ENS subname
};
```

**In the backend:**
```typescript
// backend/routes/curator/approve.ts (NEW)
export async function POST(req: NextRequest) {
  const { releaseId, curatorAddress, signature } = await req.json();
  
  // 1. Verify signature validity
  const messageHash = solidityPackedKeccak256(
    ['string', 'string'],
    ['RELEASE_APPROVAL', releaseId]
  );
  const recovered = recoverAddress(messageHash, signature);
  if (recovered !== curatorAddress) {
    throw new Error('Invalid signature');
  }
  
  // 2. Verify curator is in Safe multisig
  const safe = new ethers.Contract(SAFE_ADDRESS, SAFE_ABI, provider);
  const owners = await safe.getOwners();
  if (!owners.map(o => o.toLowerCase()).includes(curatorAddress.toLowerCase())) {
    throw new Error('Not a curator');
  }
  
  // 3. Store approval in DB
  await db.approvals.create({
    releaseId,
    signer: curatorAddress,
    signature,
    signedAt: new Date()
  });
  
  // 4. Check if threshold met
  const approvals = await db.approvals.findMany({ releaseId });
  const release = await db.releases.findOne({ id: releaseId });
  
  if (approvals.length >= release.approvalThreshold) {
    // 5. Queue publishing job (async)
    await queue.add('publishRelease', { releaseId });
    
    release.status = 'approved'; // temporary, will be 'published' after blockchain
  }
  
  // 6. Add audit log
  await db.auditLog.create({
    eventType: 'approval',
    releaseId,
    actor: curatorAddress,
    details: { approvalCount: approvals.length }
  });
  
  return NextResponse.json({ success: true, release });
}
```

---

## DATA FLOW COMPARISON

### PHASE 2: Complete Flow (All Mocked)
```
User fills form
  ↓
fetch /api/submit
  ↓
[MSW INTERCEPTS IN BROWSER]
  ↓
MSW handler generates mock data
  ↓
Returns { release: { id, title, status: 'published' } }
  ↓
Frontend stores in Zustand
  ↓
Zustand persists to localStorage
  ↓
User sees: "Release published!"
  ↓
❌ It's not really published anywhere
❌ No database
❌ No IPFS
❌ No blockchain
❌ If user refreshes, might lose data
```

### PHASE 3: Real Flow (Step by Step)
```
User fills form + selects audio file
  ↓
Frontend validates with ReleaseSubmissionSchema
  ↓
fetch /api/submit (multipart form data with file)
  ↓
[HITS REAL BACKEND]
  ↓
Backend:
  1. Validates input
  2. Extracts duration + cover art from MP3
  3. Pins audio + cover to Storacha (IPFS)
  4. Generates unique ID (PDA-001)
  5. Stores in PostgreSQL with status='pending'
  ↓
Returns { release: { id: 'PDA-001', status: 'pending' } }
  ↓
Frontend shows: "Submitted! Waiting for curation..."
  ↓
Backend triggers async job: IPFS pinning complete (audit log)
  ↓
────────────────────────────────────────────────────────────
  ↓ CURATOR VIEWS DASHBOARD
  ↓
Backend: fetch /api/curator/pending
  ↓
SQL Query: SELECT * FROM releases WHERE status='pending'
  ↓
Returns: [{ id: 'PDA-001', title: 'User Song', status: 'pending' }]
  ↓
Curator sees release in dashboard
  ↓
────────────────────────────────────────────────────────────
  ↓ CURATOR SIGNS APPROVAL
  ↓
Curator's wallet signs message with privateKey
  ↓
fetch /api/curator/approve
  ↓
Backend:
  1. Verifies signature (recover address from sig)
  2. Verifies curator is in Safe multisig
  3. Stores approval in approvals table
  4. Checks: count >= threshold?
  ↓
If count < threshold:
  Returns { release: { approvals: [1 curator], threshold: 3 } }
  Frontend shows: "1/3 approvals"
  
If count >= threshold:
  Queue job: publishRelease
  ↓
────────────────────────────────────────────────────────────
  ↓ ASYNC JOB: PUBLISH (after all curators signed)
  ↓
Backend:
  1. Load release from DB
  2. Create metadata JSON object
  3. Pin metadata JSON to Storacha
  4. Get metadataURI (IPFS CID)
  5. Call Factory.publishRelease on Ethereum L1
  6. Factory mints NFT on Base L2 via Zora
  7. Event emitter returns tokenId
  8. Update DB: status='published', tokenId, zoraNFT
  9. Call ENS contract: register subname
  10. Update DB: ensSubname
  ↓
Returns: { success: true, tokenId: 1 }
  ↓
────────────────────────────────────────────────────────────
  ↓ USER SEES THEIR NFT
  ↓
Frontend queries /api/releases/PDA-001
  ↓
Backend returns DB record with:
  - zoraNFT: "base:0xZora/1"
  - tokenId: "1"
  - ensSubname: "pda-001.palaupalau.eth"
  - metadataURI: "QmMetadata789..."
  ↓
Frontend displays:
  ✅ Release title, description, artists
  ✅ Audio player (streams from IPFS)
  ✅ "View on OpenSea" (links to Base)
  ✅ "View on ENS" (resolves to IPFS metadata)
  ↓
User visits wallet on Base L2
  ↓
Sees NFT in their collection (owner=0xUser)
```

---

## TESTING IMPACT

### PHASE 2 (Current)
```typescript
// lib/mocks/handlers.test.ts
test('submit release handler returns mock data', () => {
  const response = await fetch('/api/submit', {...});
  expect(response.status).toBe(200);
  expect(response.release.id).toBeDefined();
  // ✅ Test passes (mocked)
});
```

### PHASE 3 (New)
```typescript
// backend/routes/submit.test.ts
test('submit creates release in database', async () => {
  // 1. Setup test database
  const testDb = await setupTestDatabase();
  
  // 2. Call real API
  const response = await fetch('/api/submit', {
    formData: { title: 'Test', file: testFile }
  });
  
  // 3. Verify database
  const release = await testDb.releases.findOne({ id: response.id });
  expect(release).toBeDefined();
  expect(release.status).toBe('pending');
  
  // 4. Verify IPFS (mocked for tests)
  expect(storachaMock.pin).toHaveBeenCalled();
  expect(response.release.mediaIPFSHash).toMatch(/^Qm/);
});

test('curator approval updates database', async () => {
  // 1. Create release
  const release = await testDb.releases.create({...});
  
  // 2. Sign message
  const signature = await signer.signMessage(...);
  
  // 3. Call approval endpoint
  const response = await fetch('/api/curator/approve', {
    body: JSON.stringify({ releaseId, signature, curatorAddress })
  });
  
  // 4. Verify approval stored
  const approvals = await testDb.approvals.find({ releaseId });
  expect(approvals.length).toBe(1);
  expect(approvals[0].signer).toBe(curatorAddress);
});
```

---

## SUMMARY: What You're Replacing

| Component | Phase 2 | Phase 3 |
|-----------|---------|---------|
| API Endpoints | MSW handlers in `/lib/mocks` | Real Node.js routes in `/app/api` |
| Data Storage | Browser localStorage | PostgreSQL database |
| File Storage | Simulated CID strings | Real Storacha pinning |
| Validation | Frontend only (Zod) | Frontend + Backend (Zod) |
| Signatures | Mocked | Real wallet signatures |
| Multisig Threshold | Hard-coded (always met) | Real Safe contract checks |
| NFT Minting | Mocked response | Real Zora contract calls |
| ENS Registration | Simulated | Real ENS contract calls |
| Audit Trail | None | Full audit log table |

---

## NEXT STEPS: Ready to Start Phase 3?

1. **Today (Day 1):**
   - [ ] Choose database (PostgreSQL recommended)
   - [ ] Set up managed database (Railway, Render, Supabase)
   - [ ] Create schema from guide above
   - [ ] Create `/backend/services/database.ts`

2. **Days 2-3:**
   - [ ] Create real `/app/api/submit` route
   - [ ] Create real `/app/api/curator/pending` route
   - [ ] Start migrating from MSW handlers

3. **Days 4-5:**
   - [ ] Create approval workflow with real signatures
   - [ ] Start multisig threshold checking
   - [ ] Add audit logging

4. **Days 6-10:**
   - [ ] Implement IPFS/Storacha integration
   - [ ] Replace simulated IPFS with real pinning
   - [ ] Test end-to-end with real files

5. **Days 11+:**
   - [ ] Deploy Factory contract
   - [ ] Implement NFT minting
   - [ ] Implement ENS registration


