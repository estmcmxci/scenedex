/**
 * POST /api/user/safe/auto-detect
 * 
 * Auto-detect and link Safe if wallet is an owner of the configured Safe
 * 
 * Request Body:
 * {
 *   walletAddress: string
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { autoDetectAndLinkSafe } from '@/lib/services/user-safes'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress } = body

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing walletAddress' },
        { status: 400 }
      )
    }

    const result = await autoDetectAndLinkSafe(walletAddress)

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error,
          discoveredSafes: result.discoveredSafes || []
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        walletAddress,
        safeAddress: result.safeAddress,
        discoveredSafes: result.discoveredSafes || [],
        message: result.discoveredSafes && result.discoveredSafes.length > 0
          ? `Discovered ${result.discoveredSafes.length} Safe(s), linked: ${result.safeAddress}`
          : 'Safe auto-detected and linked successfully',
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

