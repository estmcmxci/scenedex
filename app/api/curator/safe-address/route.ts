import { NextResponse } from 'next/server'
import dotenv from 'dotenv'

// Load .env.local explicitly
dotenv.config({ path: '.env.local' })

/**
 * GET /api/curator/safe-address
 * 
 * Returns the configured Safe address for this curator board.
 * This is a public endpoint - anyone can see which Safe curates submissions.
 */
export async function GET() {
  try {
    const safeAddress = process.env.SAFE_ADDRESS || process.env.CURATOR_SAFE_ADDRESS

    if (!safeAddress) {
      return NextResponse.json(
        { success: false, error: 'Safe address not configured' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        safeAddress,
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

