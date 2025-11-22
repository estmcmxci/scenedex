import { NextRequest, NextResponse } from 'next/server'
import { resolveAddressToENS } from '@/lib/services/ens'

/**
 * GET /api/ens/resolve?address=0x...
 * 
 * Resolves an Ethereum address to its primary ENS name (reverse resolution).
 * Returns the ENS name if found and verified, or null if not found.
 * 
 * @param address - The Ethereum address to resolve (query parameter)
 * @returns JSON with success status and the ENS name (or null)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Missing address parameter' },
        { status: 400 }
      )
    }

    // Validate address format (basic check)
    if (!address.startsWith('0x') || address.length !== 42) {
      return NextResponse.json(
        { success: false, error: 'Invalid address format' },
        { status: 400 }
      )
    }

    // Resolve address to ENS name
    const ensName = await resolveAddressToENS(address)

    return NextResponse.json({
      success: true,
      data: {
        address: address.toLowerCase(),
        name: ensName,
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ ENS resolution error:', errorMessage)
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

