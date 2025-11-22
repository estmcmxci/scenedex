# 🚀 WEEK 2 — DAY 6: SAFE AUTHORIZATION GATE IMPLEMENTATION

## Overview

**Goal:** Build the upstream Safe approval gate that detects when curator threshold is met and triggers downstream jobs.

**Deliverable:** When 2+ curators approve → job is enqueued → ready for Days 7-9 (IPFS → Zora → ENS)

---

## 🎯 Architecture Recap

```
UPSTREAM: Safe Authorization Gate (DAY 6)
├─ Curator 1: POST /api/curator/approve
├─ Curator 2: POST /api/curator/approve ← Threshold met!
└─ → Enqueue publishRelease job → Ready for Day 7
```

---

## 📋 STEP 1: Database Schema Changes

### New Tables Needed

#### Table 1: `curator_settings` (stores Safe config)

```sql
CREATE TABLE curator_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  safe_address VARCHAR(42) NOT NULL UNIQUE,
  approval_threshold INT NOT NULL,              -- e.g., 2 (for 2-of-3)
  total_curators INT NOT NULL,                  -- e.g., 3
  curator_addresses TEXT[] NOT NULL,            -- Array: ['0x...', '0x...', '0x...']
  safe_chain_id INT DEFAULT 11155111,           -- Sepolia
  status VARCHAR(50) DEFAULT 'active',          -- active, inactive
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example insert:
INSERT INTO curator_settings 
  (safe_address, approval_threshold, total_curators, curator_addresses)
VALUES 
  ('0xf2fa1E8e06641C76Cfe2854c1e4D932a8b6e29fD', 2, 3, 
   ARRAY['0x...curator1', '0x...curator2', '0x...curator3']);
```

#### Table 2: `jobs` (track async tasks)

```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id VARCHAR NOT NULL,
  job_type VARCHAR(50) NOT NULL,                -- 'publish_release'
  status VARCHAR(50) DEFAULT 'pending',         -- pending, processing, completed, failed
  data JSONB,                                   -- Job payload
  error_message TEXT,
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 3,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  INDEX idx_status_type (status, job_type),
  INDEX idx_release_id (release_id)
);
```

#### Table 3: Modify `approvals` table (add constraint)

```sql
-- Ensure no duplicate approvals per release/signer
ALTER TABLE approvals 
ADD CONSTRAINT unique_approval_per_release_signer 
UNIQUE(release_id, signer);
```

### Migration File

Create: `lib/db/migrations/002-safe-gate.sql`

```sql
-- Safe settings
CREATE TABLE curator_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  safe_address VARCHAR(42) NOT NULL UNIQUE,
  approval_threshold INT NOT NULL,
  total_curators INT NOT NULL,
  curator_addresses TEXT[] NOT NULL,
  safe_chain_id INT DEFAULT 11155111,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job queue (database-backed, no Redis)
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id VARCHAR NOT NULL,
  job_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  data JSONB,
  error_message TEXT,
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 3,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX idx_jobs_status_type ON jobs(status, job_type);
CREATE INDEX idx_jobs_release_id ON jobs(release_id);

-- Seed with your Safe config
INSERT INTO curator_settings 
  (safe_address, approval_threshold, total_curators, curator_addresses)
VALUES 
  ('0xf2fa1E8e06641C76Cfe2854c1e4D932a8b6e29fD', 2, 3, 
   ARRAY['0xCurator1', '0xCurator2', '0xCurator3']);
```

---

## 🔐 STEP 2: Safe Service (`lib/services/safe.ts`)

Create: `lib/services/safe.ts`

```typescript
import { ethers } from 'ethers';
import { db } from '../db/database';

const SAFE_ABI = [
  'function getOwners() external view returns (address[])',
  'function getThreshold() external view returns (uint256)',
];

interface VerifySignatureResult {
  success: boolean;
  address?: string;
  error?: string;
}

/**
 * Verify that a curator signature is valid
 * Recovers signer address from message + signature
 */
export function verifyCuratorSignature(
  releaseId: string,
  signature: string
): VerifySignatureResult {
  try {
    // Message hash (EIP-191 standard)
    const messageHash = ethers.solidityPackedKeccak256(
      ['string', 'string'],
      ['RELEASE_APPROVAL', releaseId]
    );

    // Recover signer address from signature
    const recovered = ethers.recoverAddress(messageHash, signature);

    return {
      success: true,
      address: recovered,
    };
  } catch (error) {
    return {
      success: false,
      error: `Signature verification failed: ${error.message}`,
    };
  }
}

/**
 * Check if an address is a Safe member
 * Query Safe contract to get owners list
 */
export async function isSafeMember(
  curatorAddress: string,
  safeAddress: string
): Promise<boolean> {
  try {
    const provider = new ethers.JsonRpcProvider(
      process.env.SEPOLIA_RPC_URL
    );
    
    const safe = new ethers.Contract(
      safeAddress,
      SAFE_ABI,
      provider
    );

    const owners = await safe.getOwners();
    
    return owners
      .map((o: string) => o.toLowerCase())
      .includes(curatorAddress.toLowerCase());
  } catch (error) {
    console.error('Error checking Safe member:', error);
    throw error;
  }
}

/**
 * Get approval threshold from database
 */
export async function getApprovalThreshold(): Promise<number> {
  const settings = await db.query(
    'SELECT approval_threshold FROM curator_settings WHERE status = $1 LIMIT 1',
    ['active']
  );

  if (settings.rows.length === 0) {
    throw new Error('No active curator settings found');
  }

  return settings.rows[0].approval_threshold;
}

/**
 * Get Safe address from database
 */
export async function getSafeAddress(): Promise<string> {
  const settings = await db.query(
    'SELECT safe_address FROM curator_settings WHERE status = $1 LIMIT 1',
    ['active']
  );

  if (settings.rows.length === 0) {
    throw new Error('No active curator settings found');
  }

  return settings.rows[0].safe_address;
}

/**
 * Count approvals for a release
 */
export async function countApprovals(releaseId: string): Promise<number> {
  const result = await db.query(
    'SELECT COUNT(*) FROM approvals WHERE release_id = $1',
    [releaseId]
  );

  return parseInt(result.rows[0].count, 10);
}
```

---

## 📋 STEP 3: Job Queue Service (`lib/services/jobs.ts`)

Create: `lib/services/jobs.ts` (Database-backed, no Redis)

```typescript
import { db } from '../db/database';

export interface PublishReleaseJob {
  releaseId: string;
  approvals: Array<{ signer: string; signature: string }>;
}

/**
 * Enqueue a publish-release job
 * Called when approval threshold is met
 */
export async function enqueuePublishJob(
  releaseId: string,
  approvals: Array<{ signer: string; signature: string }>
): Promise<string> {
  const result = await db.query(
    `INSERT INTO jobs 
     (release_id, job_type, status, data, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING id`,
    [
      releaseId,
      'publish_release',
      'pending',
      JSON.stringify({ approvals }),
    ]
  );

  const jobId = result.rows[0].id;
  console.log(`✅ Enqueued publish job: ${jobId} for release: ${releaseId}`);
  
  return jobId;
}

/**
 * Get pending jobs to process
 * Called by background worker (or cron job)
 */
export async function getPendingJobs(limit: number = 10) {
  const result = await db.query(
    `SELECT id, release_id, data FROM jobs 
     WHERE status = 'pending' AND attempts < max_attempts
     ORDER BY created_at ASC
     LIMIT $1`,
    [limit]
  );

  return result.rows;
}

/**
 * Mark job as processing
 */
export async function markJobProcessing(jobId: string): Promise<void> {
  await db.query(
    `UPDATE jobs 
     SET status = 'processing', started_at = NOW(), attempts = attempts + 1
     WHERE id = $1`,
    [jobId]
  );
}

/**
 * Mark job as completed
 */
export async function markJobCompleted(jobId: string): Promise<void> {
  await db.query(
    `UPDATE jobs 
     SET status = 'completed', completed_at = NOW()
     WHERE id = $1`,
    [jobId]
  );
}

/**
 * Mark job as failed with error message
 */
export async function markJobFailed(
  jobId: string,
  errorMessage: string
): Promise<void> {
  await db.query(
    `UPDATE jobs 
     SET status = 'failed', error_message = $1
     WHERE id = $2`,
    [errorMessage, jobId]
  );
}

/**
 * Background worker: Poll for pending jobs
 * This should be called periodically (every 5-10 seconds)
 * Or integrated into your application startup
 */
export async function startJobWorker(): Promise<void> {
  console.log('🚀 Starting job worker...');

  setInterval(async () => {
    try {
      const jobs = await getPendingJobs(5);

      for (const job of jobs) {
        await markJobProcessing(job.id);

        try {
          // Call the actual publish function here (Day 7-9)
          // For now, just log
          console.log(`Processing job ${job.id}: ${job.release_id}`);
          
          // TODO: Call publishRelease(job.release_id, job.data.approvals)
          // Once IPFS service is built (Day 7)
          
          await markJobCompleted(job.id);
        } catch (error) {
          console.error(`Job ${job.id} failed:`, error);
          await markJobFailed(job.id, error.message);
        }
      }
    } catch (error) {
      console.error('Job worker error:', error);
    }
  }, 5000); // Poll every 5 seconds
}
```

---

## 🔌 STEP 4: Modified Approve API (`app/api/curator/approve/route.ts`)

**Update the existing route:**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/database';
import {
  verifyCuratorSignature,
  isSafeMember,
  getApprovalThreshold,
  getSafeAddress,
  countApprovals,
} from '@/lib/services/safe';
import {
  enqueuePublishJob,
} from '@/lib/services/jobs';

export async function POST(request: NextRequest) {
  try {
    const { releaseId, curatorAddress, signature } = await request.json();

    // Validate input
    if (!releaseId || !curatorAddress || !signature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log(`📝 Approval request for release: ${releaseId} from ${curatorAddress}`);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 1: Verify signature is valid
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const sigResult = verifyCuratorSignature(releaseId, signature);
    if (!sigResult.success) {
      return NextResponse.json(
        { error: sigResult.error },
        { status: 400 }
      );
    }

    console.log(`✅ Signature verified for: ${sigResult.address}`);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 2: Verify curator is a Safe member
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const safeAddress = await getSafeAddress();
    const isMember = await isSafeMember(curatorAddress, safeAddress);

    if (!isMember) {
      return NextResponse.json(
        { error: 'Curator is not a Safe member' },
        { status: 403 }
      );
    }

    console.log(`✅ Curator verified as Safe member`);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 3: Store approval in database
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    try {
      await db.query(
        `INSERT INTO approvals (release_id, signer, signature, timestamp)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (release_id, signer) DO NOTHING`,
        [releaseId, curatorAddress, signature]
      );
      console.log(`✅ Approval stored in database`);
    } catch (error) {
      console.error('Database error storing approval:', error);
      return NextResponse.json(
        { error: 'Failed to store approval' },
        { status: 500 }
      );
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 4: Check if threshold is met → TRIGGER JOB
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const threshold = await getApprovalThreshold();
    const currentApprovals = await countApprovals(releaseId);

    console.log(
      `📊 Approvals: ${currentApprovals}/${threshold}`
    );

    let jobId = null;

    if (currentApprovals >= threshold) {
      console.log(`🎉 THRESHOLD MET! Triggering publish job...`);

      // Fetch all approvals for this release
      const approvalsResult = await db.query(
        `SELECT signer, signature FROM approvals WHERE release_id = $1`,
        [releaseId]
      );

      // Enqueue the job
      jobId = await enqueuePublishJob(
        releaseId,
        approvalsResult.rows
      );

      // Update release status
      await db.query(
        `UPDATE releases SET status = 'approval_threshold_met' WHERE id = $1`,
        [releaseId]
      );
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // RESPONSE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    return NextResponse.json({
      success: true,
      approval: {
        releaseId,
        curator: curatorAddress,
        timestamp: new Date(),
      },
      approvalStatus: {
        current: currentApprovals,
        required: threshold,
        thresholdMet: currentApprovals >= threshold,
      },
      publishJobId: jobId,
      message:
        currentApprovals >= threshold
          ? 'Threshold met! Publishing job enqueued.'
          : `Approval recorded. ${threshold - currentApprovals} more needed.`,
    });
  } catch (error) {
    console.error('Approval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## ✅ STEP 5: Application Startup (`app/layout.tsx` or separate init file)

Start the job worker when the app starts:

```typescript
// app/layout.tsx (or create lib/init.ts)
import { startJobWorker } from '@/lib/services/jobs';

// Start job worker on app initialization
if (typeof window === 'undefined') {
  // Only run on server
  startJobWorker().catch(console.error);
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

---

## 🧪 TESTING DAY 6 IMPLEMENTATION

### Test Checklist

- [ ] Run migration: `node lib/db/run-migration.js`
- [ ] Verify tables created: `SELECT * FROM curator_settings;`
- [ ] Seed Safe config: Insert your Safe address + threshold
- [ ] Test signature verification: `verifyCuratorSignature()`
- [ ] Test Safe member check: `isSafeMember()`
- [ ] Test approval endpoint: POST /api/curator/approve
- [ ] Verify job enqueued: SELECT * FROM jobs WHERE status='pending';
- [ ] Verify job worker runs: Check console logs every 5 seconds

### Manual Test Flow

```bash
# 1. Seed your Safe config
psql postgresql://postgres:password@localhost/catalogue

INSERT INTO curator_settings 
  (safe_address, approval_threshold, total_curators, curator_addresses)
VALUES 
  ('0xf2fa1E8e06641C76Cfe2854c1e4D932a8b6e29fD', 2, 3, 
   ARRAY['0xCurator1', '0xCurator2', '0xCurator3']);

# 2. Create a test release
INSERT INTO releases (id, title, created_by, status)
VALUES ('TEST-001', 'Test Release', '0xCurator1', 'pending');

# 3. Call approve endpoint (from curator frontend)
curl -X POST http://localhost:3000/api/curator/approve \
  -H "Content-Type: application/json" \
  -d '{
    "releaseId": "TEST-001",
    "curatorAddress": "0xCurator1",
    "signature": "0x..."
  }'

# 4. Check jobs table
SELECT * FROM jobs WHERE release_id='TEST-001';

# Should show: status='pending' → status='processing' (every 5 sec)
```

---

## 📊 Expected Behavior (End of Day 6)

### When Curator 1 approves:
```
✅ Signature verified
✅ Curator is Safe member
✅ Approval stored in DB
📊 Approvals: 1/2
Response: "1 more approval needed"
```

### When Curator 2 approves:
```
✅ Signature verified
✅ Curator is Safe member
✅ Approval stored in DB
📊 Approvals: 2/2
🎉 THRESHOLD MET!
📋 Job enqueued: publish_release
→ Job status: pending (ready for Day 7)
```

### Job Worker (every 5 seconds):
```
🔍 Polling for pending jobs...
📋 Found 1 pending job
⚙️ Processing job: TEST-001
✅ Job completed (ready for Days 7-9)
```

---

## 🎯 Next (Days 7-9)

In `lib/services/jobs.ts`, replace the TODO with actual publish logic:

```typescript
// TODO: Call publishRelease(job.release_id, job.data.approvals)

// This will be built in Days 7-9:
// - IPFS pinning
// - Zora minting
// - ENS subname creation
```

---

## 📝 Summary: What You're Building

| Component | File | Purpose |
|-----------|------|---------|
| Database schema | `lib/db/migrations/002-safe-gate.sql` | Store settings + jobs |
| Safe service | `lib/services/safe.ts` | Verify signatures + Safe members |
| Job queue | `lib/services/jobs.ts` | Database-backed job management |
| API endpoint | `app/api/curator/approve/route.ts` | Receive approvals, trigger jobs |
| Job worker | Init on app startup | Poll and process pending jobs |

**Total effort:** ~200 lines of code across 4 files

**Result:** Safe authorization gate ready for downstream execution

---

**Document Version:** 1.0  
**Timeline:** Week 2, Day 6  
**Next:** Days 7-9 (IPFS → Zora → ENS)

