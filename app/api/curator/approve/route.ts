/**
 * POST /api/curator/approve
 * 
 * Endpoint for curator approval of a release (multisig signature submission)
 * 
 * Request Body (JSON):
 * {
 *   releaseId: string,
 *   signer: string (curator wallet address),
 *   signature: string (0x + 130 hex chars),
 *   timestamp?: number (optional, defaults to now)
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   data: {
 *     releaseId: "PDA-001",
 *     approval: { ... },
 *     approvalCount: 2,
 *     thresholdMet: false,
 *     release: { ... }
 *   }
 * }
 * 
 * Error:
 * {
 *   success: false,
 *   error: "error message"
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { query as dbQuery } from '@/lib/db/database'
import {
  verifyCuratorSignature,
  isSafeMember,
  getSafeAddress,
  getApprovalThreshold,
} from '@/lib/services/safe'
import { enqueuePublishJob } from '@/lib/services/jobs'

export async function POST(request: NextRequest) {
  try {
    // ──────────────────────────────────────────────────────────────────────────
    // PART A: Setup & Validation
    // ──────────────────────────────────────────────────────────────────────────

    // Parse JSON body
    const body = await request.json()
    const { releaseId, curatorAddress, signature } = body

    // Validate input - all three fields required
    if (!releaseId || !curatorAddress || !signature) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: releaseId, curatorAddress, signature',
        },
        { status: 400 }
      )
    }

    console.log(
      `📝 Approval request for release: ${releaseId} from ${curatorAddress}`
    )

    // ──────────────────────────────────────────────────────────────────────────
    // PART B: Step 1 - Verify Signature
    // ──────────────────────────────────────────────────────────────────────────

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
    // PART C: Step 2 - Verify Safe Membership
    // ──────────────────────────────────────────────────────────────────────────

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
    // PART D: Step 3 - Store Approval
    // ──────────────────────────────────────────────────────────────────────────

    try {
      await dbQuery(
        `INSERT INTO approvals (releaseid, signer, signature, timestamp)
         VALUES ($1, $2, $3, EXTRACT(EPOCH FROM NOW())::INT)`,
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
    // PART E: Step 4 - Check Threshold & Trigger Job
    // ──────────────────────────────────────────────────────────────────────────

    const threshold = await getApprovalThreshold(safeAddress)

    const countResult = await dbQuery(
      'SELECT COUNT(*) FROM approvals WHERE releaseid = $1',
      [releaseId]
    )
    const currentApprovals = parseInt(countResult.rows[0].count, 10)

    console.log(`📊 Approvals: ${currentApprovals}/${threshold}`)

    let jobId = null
    let thresholdMet = false

    if (currentApprovals >= threshold) {
      console.log(`🎉 THRESHOLD MET! Processing approval...`)
      thresholdMet = true

      // ──────────────────────────────────────────────────────────────────────────
      // STEP 1: Copy from temporary_submissions to releases (if not already there)
      // ──────────────────────────────────────────────────────────────────────────
      console.log(`Step 1️⃣: Copy metadata from temporary_submissions to releases`)
      
      try {
        const tempSubmission = await dbQuery(
          `SELECT * FROM temporary_submissions WHERE releaseId = $1`,
          [releaseId]
        )

        if (tempSubmission.rows.length > 0) {
          const submission = tempSubmission.rows[0]
          
          // Releases record already exists from submit endpoint, but ensure it has all metadata
          await dbQuery(
            `UPDATE releases 
             SET title = $1, description = $2, artists = $3, status = 'approved'
             WHERE id = $4`,
            [submission.title, submission.description, submission.artists, releaseId]
          )
          console.log(`✅ Release metadata updated from temporary_submissions`)
        }
      } catch (error) {
        console.error('Error copying metadata:', error)
        throw error
      }

      // ──────────────────────────────────────────────────────────────────────────
      // STEP 2: Delete from temporary_submissions (approved)
      // ──────────────────────────────────────────────────────────────────────────
      console.log(`Step 2️⃣: Delete from temporary_submissions`)
      
      try {
        await dbQuery(
          `DELETE FROM temporary_submissions WHERE releaseId = $1`,
          [releaseId]
        )
        console.log(`✅ Removed from temporary_submissions`)
      } catch (error) {
        console.error('Error deleting from temporary_submissions:', error)
        throw error
      }

      // ──────────────────────────────────────────────────────────────────────────
      // STEP 3: Enqueue publish job (temp_files will be deleted by job after pinning)
      // ──────────────────────────────────────────────────────────────────────────
      console.log(`Step 3️⃣: Enqueue publish job`)

      // Fetch all approvals for this release
      const approvalsResult = await dbQuery(
        `SELECT signer, signature FROM approvals WHERE releaseid = $1`,
        [releaseId]
      )

      // Enqueue the job
      jobId = await enqueuePublishJob(releaseId, approvalsResult.rows)
      console.log(`✅ Publish job enqueued: ${jobId}`)
    }

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
    console.error('❌ Approval endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

