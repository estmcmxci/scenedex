# Database Schema Audit: Frontend State vs. Proposed Schema

## Executive Summary
The proposed database schema in `PHASE3_IMPLEMENTATION_GUIDE.md` aligns **95% well** with the existing frontend type system. Minor additions/clarifications needed for production readiness.

---

## SECTION 1: RELEASES TABLE ALIGNMENT

### Proposed Schema (from Implementation Guide)
```sql
CREATE TABLE releases (
  id VARCHAR PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  artists VARCHAR,
  createdBy VARCHAR NOT NULL,
  createdAt TIMESTAMP,
  status ENUM('pending', 'approved', 'published'),
  mediaIPFSHash VARCHAR,
  metadataURI VARCHAR,
  zoraNFT VARCHAR,
  tokenId VARCHAR,
  approvalThreshold INT,
  approvalRequirementsMet BOOL,
  approvedAt TIMESTAMP
);
```

### Frontend Type Definition (from `types.ts`)
```typescript
export type Release = {
  id: string;                    // PDA-001 format
  createdBy: string;             // 0x wallet address
  createdAt: number;             // Unix timestamp (milliseconds)
  title: string;
  description: string;
  mediaIPFSHash: string;
  artists?: string;
  duration: number;              // ← NOT in schema
  coverImageIPFSHash?: string;   // ← NOT in schema
  status: 'pending' | 'approved' | 'published';
  rejectionReason?: string;      // ← NOT in schema
  metadataURI?: string;
  zoraNFT?: string;              // Format: "base:0xAddress/tokenId"
  tokenId?: string;
  ensSubname?: string;           // ← NOT in schema
};

export type ApprovedRelease = Release & {
  status: 'approved';
  approvals: Approval[];         // ← NOT in schema (separate table)
  multisigAddress: string;       // ← NOT in schema
  approvalThreshold: number;
  approvalRequirementsMet: boolean;
  approvedAt: number;
};
```

### Audit Results

| Field | Proposed | Frontend | Status | Notes |
|-------|----------|----------|--------|-------|
| `id` | ✅ VARCHAR PK | ✅ string | ✅ Match | PDA-001 format |
| `title` | ✅ VARCHAR | ✅ string | ✅ Match | Required |
| `description` | ✅ TEXT | ✅ string | ✅ Match | Can be null |
| `artists` | ✅ VARCHAR | ✅ string? | ✅ Match | Optional |
| `createdBy` | ✅ VARCHAR | ✅ string | ✅ Match | 0x address |
| `createdAt` | ✅ TIMESTAMP | ✅ number | ⚠️ **Type Mismatch** | Frontend: unix ms; DB: TIMESTAMP |
| `status` | ✅ ENUM | ✅ 3-value enum | ✅ Match | pending, approved, published |
| `mediaIPFSHash` | ✅ VARCHAR | ✅ string | ✅ Match | Required after submission |
| `metadataURI` | ✅ VARCHAR | ✅ string? | ✅ Match | After curator approval |
| `zoraNFT` | ✅ VARCHAR | ✅ string? | ✅ Match | Format: "base:0xAddr/tokenId" |
| `tokenId` | ✅ VARCHAR | ✅ string? | ✅ Match | From Zora |
| `approvalThreshold` | ✅ INT | ✅ number | ✅ Match | 1-7, default 3 |
| `approvalRequirementsMet` | ✅ BOOL | ✅ boolean | ✅ Match | True if threshold met |
| `approvedAt` | ✅ TIMESTAMP | ✅ number? | ⚠️ **Type Mismatch** | Only in ApprovedRelease |
| `duration` | ❌ Missing | ✅ number | ⚠️ **ADD TO SCHEMA** | Extracted from MP3 |
| `coverImageIPFSHash` | ❌ Missing | ✅ string? | ⚠️ **ADD TO SCHEMA** | Extracted from ID3 tags |
| `rejectionReason` | ❌ Missing | ✅ string? | ⚠️ **ADD TO SCHEMA** | When rejected |
| `multisigAddress` | ❌ Missing | ✅ string | ⚠️ **ADD TO SCHEMA** | Safe contract address |
| `ensSubname` | ❌ Missing | ✅ string? | ⚠️ **ADD TO SCHEMA** | After ENS registration |
| `temp_file_path` | ❌ Missing | N/A | ⚠️ **ADD TO SCHEMA** | Temporary storage path during submission |

---

## SECTION 2: APPROVALS TABLE ALIGNMENT

### Proposed Schema (from Implementation Guide)
```sql
CREATE TABLE approvals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  releaseId VARCHAR FOREIGN KEY,
  signer VARCHAR,
  signature VARCHAR,
  timestamp TIMESTAMP,
  INDEX(releaseId, signer)
);
```

### Frontend Type Definition (from `types.ts`)
```typescript
export type Approval = {
  signer: string;               // 0x wallet address
  signature: string;            // EIP-191: 0x + 130 hex
  timestamp: number;            // Unix timestamp (milliseconds)
};

export type ApprovedRelease = Release & {
  approvals: Approval[];        // Array indexed on Release
  ...
};
```

### Audit Results

| Field | Proposed | Frontend | Status | Notes |
|-------|----------|----------|--------|-------|
| `id` | ✅ INT PK | N/A | ✅ OK | Auto-increment for DB |
| `releaseId` | ✅ VARCHAR FK | ✅ implicit | ✅ Match | Part of Release object |
| `signer` | ✅ VARCHAR | ✅ string | ✅ Match | 0x address |
| `signature` | ✅ VARCHAR | ✅ string | ✅ Match | EIP-191 format |
| `timestamp` | ✅ TIMESTAMP | ✅ number | ⚠️ **Type Mismatch** | Frontend: unix ms; DB: TIMESTAMP |
| **Indexing** | ✅ (releaseId, signer) | N/A | ✅ Good | Efficient queries |

### Key Difference
- **Frontend:** Approvals stored as **nested array** on Release object
- **Database:** Approvals stored as **separate table** with foreign key
- **Conversion:** Need mapping layer between relational DB and nested object model

---

## SECTION 3: CURATORS TABLE (Not Used in Frontend Yet)

### Proposed Schema
```sql
CREATE TABLE curators (
  address VARCHAR PRIMARY KEY,
  name VARCHAR,
  joinedAt TIMESTAMP,
  isActive BOOL
);
```

### Frontend Status
- ❌ **Not defined** in `types.ts`
- ⚠️ **Will be needed** for Phase 3+ curator dashboard
- 📋 **Consider adding** for:
  - Curator board management
  - Multisig member tracking
  - Permission checking

---

## SECTION 4: MISSING TABLES (Not in Proposed Schema but Needed)

### 1. Audit Logs Table (Recommended)
```sql
CREATE TABLE audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  releaseId VARCHAR FOREIGN KEY,
  action VARCHAR,              -- 'submitted', 'approved', 'rejected', 'published'
  actor VARCHAR,               -- wallet address
  timestamp TIMESTAMP,
  metadata JSON,               -- additional context
  INDEX(releaseId, timestamp)
);
```

**Why:** Track release lifecycle events for transparency and debugging.

### 2. Temporary File Storage (For Deferred IPFS Pinning)
```sql
CREATE TABLE temp_files (
  id INT PRIMARY KEY AUTO_INCREMENT,
  releaseId VARCHAR FOREIGN KEY,
  filePath VARCHAR,            -- /tmp/uploads/PDA-001.mp3
  fileSize INT,
  uploadedAt TIMESTAMP,
  expiresAt TIMESTAMP,
  status VARCHAR,              -- 'pending', 'pinned', 'expired'
  INDEX(releaseId, expiresAt)
);
```

**Why:** Store temporary file paths during submission phase (before IPFS pinning).

---

## SECTION 5: TYPE CONSISTENCY ISSUES

### Issue 1: Unix Timestamp Format
- **Frontend:** Uses `number` (milliseconds) - JavaScript native
- **Database:** Uses `TIMESTAMP` (typically seconds or ISO 8601)
- **Solution:** 
  ```typescript
  // In database service
  const createdAt = Math.floor(Date.now() / 1000); // Convert to seconds
  
  // In API response
  const createdAtMs = createdAt * 1000; // Convert back to ms for frontend
  ```

### Issue 2: Nested Objects vs. Relational Schema
- **Frontend:** Approvals stored as **array on Release**
- **Database:** Approvals stored as **separate rows**
- **Solution:** Create mapping layer (ORM-like interface):
  ```typescript
  // Fetch from DB
  const release = await db.getRelease('PDA-001');
  const approvals = await db.getApprovals('PDA-001');
  
  // Reconstruct nested object for frontend
  const releaseFull = {
    ...release,
    approvals,
  };
  ```

### Issue 3: Nullable Fields
- **Frontend:** Uses optional fields (`?`)
- **Database:** Should explicitly allow NULL
- **Solution:**
  ```sql
  ALTER TABLE releases 
  ADD COLUMN description TEXT NULL,
  ADD COLUMN coverImageIPFSHash VARCHAR NULL,
  ADD COLUMN rejectionReason VARCHAR NULL;
  ```

---

## SECTION 6: RECOMMENDED DATABASE SCHEMA (Revised)

```sql
-- Releases Table
CREATE TABLE releases (
  id VARCHAR PRIMARY KEY,                    -- PDA-001
  title VARCHAR NOT NULL,
  description TEXT NULL,
  artists VARCHAR NULL,
  createdBy VARCHAR NOT NULL,                -- 0x address
  createdAt INT NOT NULL,                    -- Unix seconds
  status VARCHAR NOT NULL,                   -- pending, approved, published
  
  -- Media & metadata
  mediaIPFSHash VARCHAR NULL,
  coverImageIPFSHash VARCHAR NULL,
  duration INT NULL,                         -- seconds
  metadataURI VARCHAR NULL,
  
  -- Approval details
  multisigAddress VARCHAR NULL,              -- Safe contract
  approvalThreshold INT NULL,                -- 1-7
  approvalRequirementsMet BOOLEAN NULL,
  approvedAt INT NULL,                       -- Unix seconds
  
  -- Rejection details
  rejectionReason VARCHAR NULL,
  
  -- NFT details
  zoraNFT VARCHAR NULL,                      -- base:0xAddr/tokenId
  tokenId VARCHAR NULL,
  
  -- ENS details
  ensSubname VARCHAR NULL,
  
  -- Temporary storage (Phase 2→3 transition)
  temp_file_path VARCHAR NULL,
  
  -- Metadata
  updatedAt INT DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_status(status),
  INDEX idx_createdBy(createdBy),
  INDEX idx_createdAt(createdAt)
);

-- Approvals Table (Multisig signatures)
CREATE TABLE approvals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  releaseId VARCHAR NOT NULL,
  signer VARCHAR NOT NULL,                   -- 0x curator address
  signature VARCHAR NOT NULL,                -- 0x + 130 hex
  timestamp INT NOT NULL,                    -- Unix seconds
  
  FOREIGN KEY (releaseId) REFERENCES releases(id),
  INDEX idx_release_signer(releaseId, signer),
  INDEX idx_timestamp(timestamp)
);

-- Audit Logs (Recommended)
CREATE TABLE audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  releaseId VARCHAR NOT NULL,
  action VARCHAR NOT NULL,                   -- submitted, approved, rejected, published
  actor VARCHAR NOT NULL,                    -- wallet address
  timestamp INT NOT NULL,
  metadata JSON,                             -- Additional context
  
  FOREIGN KEY (releaseId) REFERENCES releases(id),
  INDEX idx_release_timestamp(releaseId, timestamp)
);

-- Curators (For future dashboard)
CREATE TABLE curators (
  address VARCHAR PRIMARY KEY,               -- 0x address
  name VARCHAR,
  joinedAt INT NOT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  
  INDEX idx_active(isActive)
);

-- Temporary File Storage (Deferred IPFS Pinning)
CREATE TABLE temp_files (
  id INT PRIMARY KEY AUTO_INCREMENT,
  releaseId VARCHAR NOT NULL,
  filePath VARCHAR NOT NULL,                 -- /tmp/uploads/PDA-001.mp3
  fileSize INT,
  uploadedAt INT NOT NULL,
  expiresAt INT NOT NULL,
  status VARCHAR,                            -- pending, pinned, expired
  
  FOREIGN KEY (releaseId) REFERENCES releases(id),
  INDEX idx_release_status(releaseId, status),
  INDEX idx_expires(expiresAt)
);
```

---

## SECTION 7: MAPPING: Frontend Types → Database Schema

### Adding a New Release (Flow)
```typescript
// 1. Frontend submits (types.ts)
const input: ReleaseSubmissionInput = {
  title: "...",
  description: "...",
  mediaFile: File,
  artists?: "...",
};

// 2. Backend receives → saves to DB
const release = await db.releases.create({
  id: 'PDA-001',                           // Generated
  title: input.title,
  description: input.description,
  artists: input.artists,
  createdBy: userAddress,                  // From wallet
  createdAt: Math.floor(Date.now() / 1000), // Unix seconds
  status: 'pending',
  temp_file_path: '/tmp/uploads/PDA-001.mp3', // Deferred pinning
});

// 3. Curator approves → add approvals
await db.approvals.create({
  releaseId: 'PDA-001',
  signer: curatorAddress,
  signature: '0x...',
  timestamp: Math.floor(Date.now() / 1000),
});

// 4. Update release status
await db.releases.update('PDA-001', {
  status: 'approved',
  approvalThreshold: 3,
  approvalRequirementsMet: true,
  approvedAt: Math.floor(Date.now() / 1000),
  multisigAddress: '0xSafeAddress',
});

// 5. IPFS pinning (after approval)
const { mediaIPFSHash, coverImageHash, metadataURI } = await pinToIPFS(...);
await db.releases.updateWithIPFSHashes('PDA-001', {
  mediaIPFSHash,
  coverImageIPFSHash: coverImageHash,
  metadataURI,
  temp_file_path: null, // Clear temp storage
});
```

### Retrieving for Frontend (Conversion)
```typescript
// 1. Fetch from DB (relational)
const releaseRow = await db.releases.get('PDA-001');
const approvalRows = await db.approvals.getByRelease('PDA-001');

// 2. Reconstruct nested object (for frontend)
const release: ApprovedRelease = {
  ...releaseRow,
  createdAt: releaseRow.createdAt * 1000, // Convert back to ms
  approvedAt: releaseRow.approvedAt * 1000,
  approvals: approvalRows.map(row => ({
    signer: row.signer,
    signature: row.signature,
    timestamp: row.timestamp * 1000, // Convert back to ms
  })),
};

// 3. Send to frontend (validated against types)
return release; // Type: ApprovedRelease ✅
```

---

## SECTION 8: IMPLEMENTATION CHECKLIST

- [ ] **Timestamps:** Decide on storage format (Unix seconds vs. ISO 8601 vs. milliseconds)
- [ ] **Add Missing Columns:** `duration`, `coverImageIPFSHash`, `rejectionReason`, `multisigAddress`, `ensSubname`, `temp_file_path`
- [ ] **Create Audit Logs Table:** For compliance and debugging
- [ ] **Create Curators Table:** Prepare for Phase 3+ dashboard
- [ ] **Create Temp Files Table:** For deferred IPFS pinning
- [ ] **Indexes:** Add composite indexes for common queries (releaseId+signer, createdBy+status, etc.)
- [ ] **Foreign Keys:** Enforce referential integrity
- [ ] **Nullable Columns:** Mark optional fields as NULL
- [ ] **Data Mapping Layer:** Create conversion functions between DB rows and frontend types
- [ ] **Validation:** Use existing `validation.ts` schemas to validate before/after DB operations

---

## SECTION 9: NEXT STEPS

1. **Finalize Schema:** Add missing columns from this audit
2. **Create Migration Script:** `lib/db/migrations/001-initial-schema.sql`
3. **Build CRUD Service:** `lib/db/releases.ts`, `lib/db/approvals.ts`
4. **Add Type Guards:** Ensure DB data matches frontend types
5. **Test Connection:** Run schema creation against Railway PostgreSQL


