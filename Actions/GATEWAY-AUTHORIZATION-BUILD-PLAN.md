# 🛠️ Gateway Authorization — Step-by-Step Build Plan

## Overview

You're building the **Safe Authorization Gate** that detects when curator approval threshold is met and triggers downstream jobs.

**Core Logic:**
1. Verify curator signature is authentic
2. Verify curator is Safe member
3. Store approval in database
4. Check if approval count >= threshold
5. If threshold met → Enqueue publish job

---

## 🎯 Complete Build Plan (4 Hours Total)

### Phase 1: Foundation Setup (30 min)

#### Step 1.1: Install Dependencies
```bash
npm install ethers@6
```

**Why:** Needed for cryptographic operations (signature verification, Safe contract calls)

**Check:**
```bash
npm list ethers
# Should show: ethers@6.x.x
```

---

#### Step 1.2: Create Database Tables

**File:** `lib/db/migrations/002-safe-gate.sql`

**What to create:**

```sql
-- Table 1: Store Safe configuration
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

-- Table 2: Track async publish jobs
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

-- Seed your Safe configuration (UPDATE WITH YOUR VALUES)
INSERT INTO curator_settings 
  (safe_address, approval_threshold, total_curators, curator_addresses)
VALUES 
  ('0xf2fa1E8e06641C76Cfe2854c1e4D932a8b6e29fD', 2, 3, 
   ARRAY['0xCurator1', '0xCurator2', '0xCurator3']);
```

**Run migration:**
```bash
psql $DATABASE_URL -f lib/db/migrations/002-safe-gate.sql
```

**Verify:**
```bash
psql $DATABASE_URL -c "SELECT * FROM curator_settings;"
# Should show your Safe config
```

---

### Phase 2: Build Safe Service (30 min)

#### Step 2.1: Create Safe Service File

**File:** `lib/services/safe.ts`

**Build in 3 parts:**

##### Part A: Setup & Constants (10 lines)

```typescript
import { ethers } from 'ethers'

// Minimal ABI - only what we need
const SAFE_ABI = [
  'function getOwners() external view returns (address[])',
  'function getThreshold() external view returns (uint256)',
]

const provider = new ethers.JsonRpcProvider(
  process.env.SEPOLIA_RPC_URL!
)
```

**Checklist:**
- [ ] Import ethers
- [ ] Define SAFE_ABI (2 functions only)
- [ ] Create provider with SEPOLIA_RPC_URL

---

##### Part B: Pattern 1 - Verify Signature (15 lines)

```typescript
interface VerifySignatureResult {
  success: boolean
  address?: string
  error?: string
}

/**
 * PATTERN 1: Verify Signature (EIP-191)
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
    )

    // Recover signer address
    const recovered = ethers.recoverAddress(messageHash, signature)

    return {
      success: true,
      address: recovered,
    }
  } catch (error) {
    return {
      success: false,
      error: `Signature verification failed: ${error.message}`,
    }
  }
}
```

**Checklist:**
- [ ] Function signature: `(releaseId, signature) → VerifySignatureResult`
- [ ] Message format: `['RELEASE_APPROVAL', releaseId]`
- [ ] Use `ethers.recoverAddress()` to get signer
- [ ] Return object with success flag & address

---

##### Part C: Pattern 2 - Verify Membership (15 lines)

```typescript
/**
 * PATTERN 2: Verify Curator is Safe Member
 * Query Safe contract to check if curator is an owner
 */
export async function isSafeMember(
  curatorAddress: string,
  safeAddress: string
): Promise<boolean> {
  try {
    const safe = new ethers.Contract(
      safeAddress,
      SAFE_ABI,
      provider
    )

    const owners = await safe.getOwners()

    return owners
      .map((o: string) => o.toLowerCase())
      .includes(curatorAddress.toLowerCase())
  } catch (error) {
    console.error('Error checking Safe member:', error)
    throw error
  }
}
```

**Checklist:**
- [ ] Create contract instance with SAFE_ABI
- [ ] Call `safe.getOwners()`
- [ ] Compare addresses (case-insensitive)
- [ ] Return boolean

---

##### Part D: Pattern 3 - Get Threshold (12 lines)

```typescript
/**
 * PATTERN 3: Get Approval Threshold
 * Query Safe contract for required approval count
 */
export async function getApprovalThreshold(
  safeAddress: string
): Promise<number> {
  try {
    const safe = new ethers.Contract(
      safeAddress,
      SAFE_ABI,
      provider
    )

    return Number(await safe.getThreshold())
  } catch (error) {
    console.error('Error getting Safe threshold:', error)
    throw error
  }
}
```

**Checklist:**
- [ ] Create contract instance
- [ ] Call `safe.getThreshold()`
- [ ] Convert to Number
- [ ] Return integer

---

##### Part E: Database Helpers (15 lines)

```typescript
import { db } from '../db/database'

/**
 * Get Safe address from database
 */
export async function getSafeAddress(): Promise<string> {
  const settings = await db.query(
    'SELECT safe_address FROM curator_settings WHERE status = $1 LIMIT 1',
    ['active']
  )

  if (settings.rows.length === 0) {
    throw new Error('No active curator settings found')
  }

  return settings.rows[0].safe_address
}
```

**Checklist:**
- [ ] Query curator_settings from database
- [ ] Return Safe address
- [ ] Throw error if not found

---

#### Step 2.2: Test Safe Service

```bash
# Create a test file: lib/services/safe.test.ts (optional)

import { 
  verifyCuratorSignature, 
  isSafeMember, 
  getApprovalThreshold 
} from './safe'

// Test 1: Verify membership works
const isMember = await isSafeMember(
  '0xYourCuratorAddress',
  '0xf2fa1E8e06641C76Cfe2854c1e4D932a8b6e29fD'
)
console.log('Is member:', isMember) // Should be true

// Test 2: Get threshold
const threshold = await getApprovalThreshold(
  '0xf2fa1E8e06641C76Cfe2854c1e4D932a8b6e29fD'
)
console.log('Threshold:', threshold) // Should be 2
```

**Checklist:**
- [ ] Safe service creates without errors
- [ ] Can query Safe owners
- [ ] Can query Safe threshold
- [ ] Signature verification doesn't crash

---

### Phase 3: Build Job Queue Service (45 min)

#### Step 3.1: Create Job Service File

**File:** `lib/services/jobs.ts`

**Build in 4 parts:**

##### Part A: Enqueue Job (15 lines)

```typescript
import { db } from '../db/database'

export interface PublishReleaseJob {
  releaseId: string
  approvals: Array<{ signer: string; signature: string }>
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
  )

  const jobId = result.rows[0].id
  console.log(`✅ Enqueued publish job: ${jobId} for release: ${releaseId}`)

  return jobId
}
```

**Checklist:**
- [ ] Accept releaseId + approvals array
- [ ] Insert into jobs table
- [ ] Set status='pending'
- [ ] Return jobId

---

##### Part B: Get Pending Jobs (12 lines)

```typescript
/**
 * Get pending jobs to process
 * Called by background worker
 */
export async function getPendingJobs(limit: number = 10) {
  const result = await db.query(
    `SELECT id, release_id, data FROM jobs 
     WHERE status = 'pending' AND attempts < max_attempts
     ORDER BY created_at ASC
     LIMIT $1`,
    [limit]
  )

  return result.rows
}
```

**Checklist:**
- [ ] Query jobs table
- [ ] Filter: status='pending'
- [ ] Filter: attempts < max_attempts
- [ ] Order by oldest first
- [ ] Return rows

---

##### Part C: Job Status Updates (20 lines)

```typescript
/**
 * Mark job as processing
 */
export async function markJobProcessing(jobId: string): Promise<void> {
  await db.query(
    `UPDATE jobs 
     SET status = 'processing', started_at = NOW(), attempts = attempts + 1
     WHERE id = $1`,
    [jobId]
  )
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
  )
}

/**
 * Mark job as failed
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
  )
}
```

**Checklist:**
- [ ] Mark processing: status + started_at + increment attempts
- [ ] Mark completed: status + completed_at
- [ ] Mark failed: status + error_message

---

##### Part D: Job Worker (20 lines)

```typescript
/**
 * Background worker: Poll for pending jobs
 * This runs every 5 seconds to process jobs
 */
export async function startJobWorker(): Promise<void> {
  console.log('🚀 Starting job worker...')

  setInterval(async () => {
    try {
      const jobs = await getPendingJobs(5)

      for (const job of jobs) {
        await markJobProcessing(job.id)

        try {
          // TODO: Replace with actual publish logic (Days 7-9)
          console.log(`Processing job ${job.id}: ${job.release_id}`)
          
          // For now, just complete it
          await markJobCompleted(job.id)
        } catch (error) {
          console.error(`Job ${job.id} failed:`, error)
          await markJobFailed(job.id, error.message)
        }
      }
    } catch (error) {
      console.error('Job worker error:', error)
    }
  }, 5000) // Poll every 5 seconds
}
```

**Checklist:**
- [ ] Start job worker on interval (5 sec)
- [ ] Get pending jobs
- [ ] For each job: mark processing
- [ ] Execute job (or log TODO)
- [ ] On success: mark completed
- [ ] On error: mark failed

---

### Phase 4: Update API Endpoint (45 min)

#### Step 4.1: Modify Approve Endpoint

**File:** `app/api/curator/approve/route.ts`

**Structure: 4 verification steps**

##### Part A: Setup & Validation (15 lines)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/database'
import {
  verifyCuratorSignature,
  isSafeMember,
  getSafeAddress,
  getApprovalThreshold,
} from '@/lib/services/safe'
import { enqueuePublishJob } from '@/lib/services/jobs'

export async function POST(request: NextRequest) {
  try {
    const { releaseId, curatorAddress, signature } = await request.json()

    // Validate input
    if (!releaseId || !curatorAddress || !signature) {
      return NextResponse.json(
        { error: 'Missing required fields: releaseId, curatorAddress, signature' },
        { status: 400 }
      )
    }

    console.log(`📝 Approval request for release: ${releaseId} from ${curatorAddress}`)

    // ──────────────────────────────────────────────────────────────────────────
    // STEP 1: Verify Signature
    // ──────────────────────────────────────────────────────────────────────────
```

**Checklist:**
- [ ] Import all services
- [ ] Extract releaseId, curatorAddress, signature from request
- [ ] Validate all fields present
- [ ] Log request

---

##### Part B: Step 1 - Verify Signature (15 lines)

```typescript
    const sigResult = verifyCuratorSignature(releaseId, signature)
    if (!sigResult.success) {
      console.error(`❌ Signature verification failed: ${sigResult.error}`)
      return NextResponse.json(
        { error: sigResult.error },
        { status: 400 }
      )
    }

    console.log(`✅ Signature verified for: ${sigResult.address}`)

    // ──────────────────────────────────────────────────────────────────────────
    // STEP 2: Verify Safe Membership
    // ──────────────────────────────────────────────────────────────────────────
```

**Checklist:**
- [ ] Call verifyCuratorSignature()
- [ ] If fails: return 400 error
- [ ] If success: continue
- [ ] Log success

---

##### Part C: Step 2 - Verify Membership (15 lines)

```typescript
    const safeAddress = await getSafeAddress()
    const isMember = await isSafeMember(curatorAddress, safeAddress)

    if (!isMember) {
      console.error(`❌ Curator ${curatorAddress} is not a Safe member`)
      return NextResponse.json(
        { error: 'Curator is not a Safe member' },
        { status: 403 }
      )
    }

    console.log(`✅ Curator verified as Safe member`)

    // ──────────────────────────────────────────────────────────────────────────
    // STEP 3: Store Approval
    // ──────────────────────────────────────────────────────────────────────────
```

**Checklist:**
- [ ] Get Safe address from database
- [ ] Check if curator is Safe member
- [ ] If not: return 403 error
- [ ] If yes: continue
- [ ] Log success

---

##### Part D: Step 3 - Store Approval (15 lines)

```typescript
    try {
      await db.query(
        `INSERT INTO approvals (release_id, signer, signature, timestamp)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (release_id, signer) DO NOTHING`,
        [releaseId, curatorAddress, signature]
      )
      console.log(`✅ Approval stored in database`)
    } catch (error) {
      console.error('Database error storing approval:', error)
      return NextResponse.json(
        { error: 'Failed to store approval' },
        { status: 500 }
      )
    }

    // ──────────────────────────────────────────────────────────────────────────
    // STEP 4: Check Threshold & Enqueue Job
    // ──────────────────────────────────────────────────────────────────────────
```

**Checklist:**
- [ ] Insert approval into database
- [ ] Use ON CONFLICT to prevent duplicates
- [ ] Handle database errors
- [ ] Log success

---

##### Part E: Step 4 - Check Threshold & Trigger (20 lines)

```typescript
    const threshold = await getApprovalThreshold(safeAddress)
    
    const countResult = await db.query(
      'SELECT COUNT(*) FROM approvals WHERE release_id = $1',
      [releaseId]
    )
    const currentApprovals = parseInt(countResult.rows[0].count, 10)

    console.log(`📊 Approvals: ${currentApprovals}/${threshold}`)

    let jobId = null
    let thresholdMet = false

    if (currentApprovals >= threshold) {
      console.log(`🎉 THRESHOLD MET! Triggering publish job...`)
      thresholdMet = true

      // Fetch all approvals for this release
      const approvalsResult = await db.query(
        `SELECT signer, signature FROM approvals WHERE release_id = $1`,
        [releaseId]
      )

      // Enqueue the job
      jobId = await enqueuePublishJob(releaseId, approvalsResult.rows)

      // Update release status
      await db.query(
        `UPDATE releases SET status = 'approval_threshold_met' WHERE id = $1`,
        [releaseId]
      )
    }

    // ──────────────────────────────────────────────────────────────────────────
    // RESPONSE
    // ──────────────────────────────────────────────────────────────────────────

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
        thresholdMet,
      },
      publishJobId: jobId,
      message: thresholdMet
        ? '🎉 Threshold met! Publishing job enqueued.'
        : `Approval recorded. ${threshold - currentApprovals} more needed.`,
    })
  } catch (error) {
    console.error('Approval endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Checklist:**
- [ ] Get threshold from Safe
- [ ] Count current approvals
- [ ] Log approval count
- [ ] If threshold met:
  - [ ] Fetch all approvals
  - [ ] Enqueue job
  - [ ] Update release status
- [ ] Return response with job info

---

### Phase 5: Initialize Job Worker (10 min)

#### Step 5.1: Start Job Worker on App Launch

**File:** `app/layout.tsx` (or create `lib/init.ts`)

**Add to top level:**

```typescript
import { startJobWorker } from '@/lib/services/jobs'

// Start job worker on app initialization (server-side only)
if (typeof window === 'undefined') {
  // Only run on server
  startJobWorker().catch(console.error)
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

**Checklist:**
- [ ] Import startJobWorker
- [ ] Check typeof window (server-side only)
- [ ] Call startJobWorker on app start
- [ ] Catch errors

---

### Phase 6: Manual Testing (1 hour)

#### Step 6.1: Test Setup

```bash
# 1. Verify database tables exist
psql $DATABASE_URL -c "SELECT * FROM curator_settings;"
psql $DATABASE_URL -c "SELECT * FROM jobs LIMIT 1;"

# 2. Verify Safe config seeded
psql $DATABASE_URL -c "SELECT * FROM curator_settings WHERE status='active';"

# 3. Start dev server
npm run dev

# 4. In another terminal, watch job logs
tail -f logs/app.log | grep "job"
```

---

#### Step 6.2: Test Flow (Curator 1 Approves)

```bash
# Create test release
psql $DATABASE_URL << EOF
INSERT INTO releases (id, title, created_by, status)
VALUES ('TEST-REL-001', 'Test Release', '0xCurator1', 'pending');
EOF

# Simulate curator 1 signing (in your wallet app or CLI)
# Message: solidityPackedKeccak256(['string', 'string'], ['RELEASE_APPROVAL', 'TEST-REL-001'])
# Get signature from wallet

# Call API
curl -X POST http://localhost:3000/api/curator/approve \
  -H "Content-Type: application/json" \
  -d '{
    "releaseId": "TEST-REL-001",
    "curatorAddress": "0xCurator1",
    "signature": "0x<your-signature>"
  }'

# Expected response:
# {
#   "success": true,
#   "approvalStatus": {
#     "current": 1,
#     "required": 2,
#     "thresholdMet": false
#   },
#   "message": "Approval recorded. 1 more needed."
# }

# Verify in database
psql $DATABASE_URL -c "SELECT * FROM approvals WHERE release_id='TEST-REL-001';"
# Should show 1 approval
```

**Checklist:**
- [ ] Release created
- [ ] Signature generated
- [ ] API call succeeds
- [ ] Response shows 1/2 approvals
- [ ] Approval stored in database
- [ ] Job NOT enqueued yet (1 < 2)

---

#### Step 6.3: Test Threshold Trigger (Curator 2 Approves)

```bash
# Repeat with curator 2
# Message: same format with same releaseId
# Get signature from curator 2

curl -X POST http://localhost:3000/api/curator/approve \
  -H "Content-Type: application/json" \
  -d '{
    "releaseId": "TEST-REL-001",
    "curatorAddress": "0xCurator2",
    "signature": "0x<curator2-signature>"
  }'

# Expected response:
# {
#   "success": true,
#   "approvalStatus": {
#     "current": 2,
#     "required": 2,
#     "thresholdMet": true
#   },
#   "publishJobId": "uuid-123",
#   "message": "🎉 Threshold met! Publishing job enqueued."
# }

# Verify in database
psql $DATABASE_URL -c "SELECT COUNT(*) FROM approvals WHERE release_id='TEST-REL-001';"
# Should show 2

psql $DATABASE_URL -c "SELECT * FROM jobs WHERE release_id='TEST-REL-001';"
# Should show job with status='pending'

psql $DATABASE_URL -c "SELECT status FROM releases WHERE id='TEST-REL-001';"
# Should show 'approval_threshold_met'
```

**Checklist:**
- [ ] Second signature generated
- [ ] API call succeeds
- [ ] Response shows 2/2 approvals
- [ ] Response shows thresholdMet=true
- [ ] Job ID returned
- [ ] Job created in database
- [ ] Release status updated
- [ ] Both approvals stored

---

#### Step 6.4: Test Job Worker

```bash
# Watch job worker in app logs
# Should see:
# 🚀 Starting job worker...
# [Every 5 seconds:]
# 🔍 Polling for pending jobs...
# 📋 Found 1 pending job
# ⚙️ Processing job TEST-REL-001
# ✅ Job completed

# Verify job status updated
psql $DATABASE_URL << EOF
SELECT id, status, started_at, completed_at FROM jobs 
WHERE release_id='TEST-REL-001' 
ORDER BY created_at DESC;
EOF

# Should show status progression:
# pending → processing → completed
```

**Checklist:**
- [ ] Job worker started on app launch
- [ ] Worker polling visible in logs
- [ ] Job picked up from database
- [ ] Status transitions: pending → processing → completed
- [ ] Job worker runs continuously every 5 seconds

---

#### Step 6.5: Test Error Cases

```bash
# Test 1: Invalid signature
curl -X POST http://localhost:3000/api/curator/approve \
  -H "Content-Type: application/json" \
  -d '{
    "releaseId": "TEST-REL-001",
    "curatorAddress": "0xCurator1",
    "signature": "0x0000"
  }'
# Expected: 400 error "Signature verification failed"

# Test 2: Non-member curator
curl -X POST http://localhost:3000/api/curator/approve \
  -H "Content-Type: application/json" \
  -d '{
    "releaseId": "TEST-REL-001",
    "curatorAddress": "0xNonMember",
    "signature": "0x<valid-signature>"
  }'
# Expected: 403 error "Not a Safe member"

# Test 3: Duplicate approval (same curator twice)
# Make first approval call (should succeed)
# Repeat same call with same signature
# Expected: Success but duplicate ignored (ON CONFLICT DO NOTHING)
```

**Checklist:**
- [ ] Invalid signature rejected
- [ ] Non-member rejected
- [ ] Duplicate approvals handled gracefully

---

## 📋 Complete Checklist

### Phase 1: Setup
- [ ] Install ethers.js
- [ ] Create migration file
- [ ] Run migration
- [ ] Verify tables created
- [ ] Seed Safe config

### Phase 2: Safe Service
- [ ] Create lib/services/safe.ts
- [ ] Implement verifyCuratorSignature()
- [ ] Implement isSafeMember()
- [ ] Implement getApprovalThreshold()
- [ ] Implement getSafeAddress()
- [ ] Test Safe queries work

### Phase 3: Job Service
- [ ] Create lib/services/jobs.ts
- [ ] Implement enqueuePublishJob()
- [ ] Implement getPendingJobs()
- [ ] Implement markJobProcessing()
- [ ] Implement markJobCompleted()
- [ ] Implement markJobFailed()
- [ ] Implement startJobWorker()

### Phase 4: API Endpoint
- [ ] Update POST /api/curator/approve
- [ ] Step 1: Verify signature
- [ ] Step 2: Verify membership
- [ ] Step 3: Store approval
- [ ] Step 4: Check threshold
- [ ] Step 5: Enqueue job if threshold met
- [ ] Return response with status

### Phase 5: Initialization
- [ ] Start job worker on app launch
- [ ] Verify worker runs every 5 seconds

### Phase 6: Testing
- [ ] Test single approval
- [ ] Test threshold trigger with 2 approvals
- [ ] Verify job created and processed
- [ ] Test job worker polling
- [ ] Test error cases

---

## ⏱️ Timeline Breakdown

| Phase | Task | Time |
|-------|------|------|
| 1 | Setup & Database | 30 min |
| 2 | Safe Service | 30 min |
| 3 | Job Service | 45 min |
| 4 | API Endpoint | 45 min |
| 5 | Initialization | 10 min |
| 6 | Testing | 60 min |
| **TOTAL** | **Day 6 Build** | **~4 hours** |

---

## 🎯 Success Criteria (End of Day 6)

When you're done:

✅ **Technical**
- [ ] Database tables created (curator_settings, jobs)
- [ ] Safe service: 3 functions working
- [ ] Job service: 6 functions working + worker running
- [ ] API endpoint: 4 verification steps working
- [ ] Job worker: Polling every 5 seconds

✅ **Functional**
- [ ] POST /api/curator/approve works
- [ ] Signatures verified correctly
- [ ] Curator membership checked
- [ ] Approvals stored in DB
- [ ] Threshold detected correctly
- [ ] Jobs enqueued when threshold met
- [ ] Jobs processed by worker

✅ **Integration**
- [ ] Release status updated to 'approval_threshold_met'
- [ ] Jobs visible in database
- [ ] Multiple approvals working
- [ ] Job worker automatically processing

---

## 🚀 Next Phase (Days 7-9)

Once Day 6 complete, job is ready for downstream execution:

**Day 7:** IPFS pinning (when job status='processing')
**Day 8:** Zora minting (after IPFS succeeds)
**Day 9:** ENS subname (after Zora succeeds)

The job queue will pass the release data through this pipeline automatically!

---

**Build Plan Version:** 1.0  
**Created:** November 16, 2025  
**Ready to implement:** YES ✅

