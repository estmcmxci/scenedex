/**
 * POST /api/user/safe
 * 
 * Link a Safe address to the current user's wallet
 * 
 * Request Body:
 * {
 *   walletAddress: string,
 *   safeAddress: string,
 *   signature: string (EIP-191 signature proving wallet ownership)
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { linkSafeToWallet, verifySafeOwnership, getSafeForWallet } from '@/lib/services/user-safes'
import { verifyCuratorSignature } from '@/lib/services/safe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress, safeAddress, signature } = body

    if (!walletAddress || !safeAddress || !signature) {
      return NextResponse.json(
        { success: false, error: 'Missing walletAddress, safeAddress, or signature' },
        { status: 400 }
      )
    }

    // Verify signature proves wallet ownership
    const signatureResult = verifyCuratorSignature(
      `link-safe:${safeAddress}`,
      signature
    )

    if (!signatureResult.success || signatureResult.address?.toLowerCase() !== walletAddress.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Link Safe to wallet
    const linkResult = await linkSafeToWallet(walletAddress, safeAddress)

    if (!linkResult.success) {
      return NextResponse.json(
        { success: false, error: linkResult.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        walletAddress,
        safeAddress,
        message: 'Safe linked successfully',
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

/**
 * GET /api/user/safe?walletAddress=0x...
 * 
 * Get active Safe for a wallet
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing walletAddress parameter' },
        { status: 400 }
      )
    }

    const safeAddress = await getSafeForWallet(walletAddress)

    return NextResponse.json({
      success: true,
      data: {
        walletAddress,
        safeAddress,
        hasSafe: safeAddress !== null,
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

