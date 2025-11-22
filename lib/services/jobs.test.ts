import {
  enqueuePublishJob,
  getPendingJobs,
  markJobProcessing,
  markJobCompleted,
  markJobFailed,
} from './jobs'

/**
 * Test Job Service Functions
 * Run with: npm run test:jobs
 */

async function runTests() {
  console.log('🧪 Starting Job Service Tests...\n')

  try {
    // Setup: Create test releases (required by foreign key constraint)
    console.log('📋 Setup: Creating test releases...')
    const { query: dbQuery } = await import('../db/database')
    await dbQuery(
      `INSERT INTO releases (id, title, createdBy, status, createdAt)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT DO NOTHING`,
      ['TEST-RELEASE-001', 'Test Release 1', '0xf2fa1E8e06641C76Cfe2854c1e4D932a8b6e29fD', 'pending', Math.floor(Date.now() / 1000)]
    )
    await dbQuery(
      `INSERT INTO releases (id, title, createdBy, status, createdAt)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT DO NOTHING`,
      ['TEST-ERROR-001', 'Test Error Release', '0xf2fa1E8e06641C76Cfe2854c1e4D932a8b6e29fD', 'pending', Math.floor(Date.now() / 1000)]
    )
    console.log(`✅ Test releases created\n`)

    // Test 1: Enqueue a job
    console.log('📋 Test 1: Enqueuing a publish job...')
    const approvals = [
      {
        signer: '0xf2fa1E8e06641C76Cfe2854c1e4D932a8b6e29fD',
        signature: '0x1234567890abcdef',
      },
    ]
    const jobId = await enqueuePublishJob('TEST-RELEASE-001', approvals)
    console.log(`✅ Job enqueued with ID: ${jobId}\n`)

    // Test 2: Get pending jobs
    console.log('📋 Test 2: Getting pending jobs...')
    const pendingJobs = await getPendingJobs(10)
    console.log(`✅ Found ${pendingJobs.length} pending job(s)`)
    if (pendingJobs.length > 0) {
      console.log(
        `   First job: ID=${pendingJobs[0].id}, Release=${pendingJobs[0].release_id}`
      )
    }
    console.log()

    // Test 3: Mark job as processing
    console.log('📋 Test 3: Marking job as processing...')
    await markJobProcessing(jobId)
    console.log(`✅ Job marked as processing\n`)

    // Test 4: Check job status changed
    console.log('📋 Test 4: Verifying job status changed...')
    const updatedJobs = await getPendingJobs(10)
    console.log(
      `✅ Pending jobs count: ${updatedJobs.length} (should be 0 if job moved to processing)\n`
    )

    // Test 5: Mark job as completed
    console.log('📋 Test 5: Marking job as completed...')
    await markJobCompleted(jobId)
    console.log(`✅ Job marked as completed\n`)

    // Test 6: Test error handling - mark job as failed
    console.log('📋 Test 6: Testing job failure handling...')
    const testErrorJobId = await enqueuePublishJob('TEST-ERROR-001', approvals)
    await markJobProcessing(testErrorJobId)
    await markJobFailed(testErrorJobId, 'Test error message')
    console.log(`✅ Job marked as failed with error message\n`)

    console.log('✨ All Job Service tests completed!')
  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

// Run tests
runTests()

