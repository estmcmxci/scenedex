/**
 * POST /api/init
 * 
 * Initializes the job worker
 * This endpoint starts the background job processing worker
 * 
 * Response:
 * {
 *   success: true,
 *   message: "Job worker initialized"
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { startJobWorker } from '@/lib/services/jobs'

let workerStarted = false

export async function POST(request: NextRequest) {
  try {
    if (workerStarted) {
      return NextResponse.json({
        success: true,
        message: 'Job worker already running',
      })
    }

    console.log('📝 Init endpoint called, starting job worker...')
    
    // Start the job worker
    startJobWorker().catch(err => {
      console.error('❌ Job worker error:', err)
    })
    
    workerStarted = true
    
    return NextResponse.json({
      success: true,
      message: 'Job worker initialized',
    })
  } catch (error) {
    console.error('❌ Init error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to initialize job worker' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return POST(request)
}

