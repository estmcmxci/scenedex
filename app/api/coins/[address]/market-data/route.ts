/**
 * GET /api/coins/[address]/market-data
 *
 * Fetch live market data for a Zora coin from the blockchain
 *
 * Query Parameters:
 * - address: string (path parameter, e.g., "0x...")
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     address: "0x...",
 *     name: "Post-Rational Anthem",
 *     symbol: "$BETA001",
 *     marketCap: "123456789",
 *     liquidity: "987654321",
 *     volume24h: "456789123",
 *     marketCapDelta24h: "12.5",
 *     uniqueHolders: 42,
 *     totalSupply: "1000000000000000000000000",
 *     payoutRecipient: "0x...",
 *     owners: ["0x..."],
 *   }
 * }
 *
 * Error:
 * {
 *   success: false,
 *   error: "error message"
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCoin } from '@zoralabs/coins-sdk';
import { base } from 'viem/chains';

interface RouteParams {
  params: {
    address: string;
  };
}

// Validate Ethereum address format
function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { address } = params;

    console.log(`📊 Fetching market data for coin: ${address}`);

    // Validate address format
    if (!isValidAddress(address)) {
      return NextResponse.json(
        { success: false, error: `Invalid coin address format: ${address}` },
        { status: 400 }
      );
    }

    // Fetch coin details from Zora SDK
    console.log(`🔍 Querying Zora API for coin details...`);
    const response = await getCoin({
      address: address,
      chain: base.id,
    });

    if (!response.data?.zora20Token) {
      return NextResponse.json(
        { success: false, error: `Coin not found: ${address}` },
        { status: 404 }
      );
    }

    const coin = response.data.zora20Token;

    console.log(`✅ Market data retrieved for: ${coin.name}`);

    // Extract and structure market data
    const marketData = {
      address: coin.address,
      name: coin.name,
      symbol: coin.symbol,
      description: coin.description,
      marketCap: coin.marketCap,
      liquidity: coin.liquidity,
      volume24h: coin.volume24h,
      marketCapDelta24h: coin.marketCapDelta24h,
      uniqueHolders: coin.uniqueHolders,
      totalSupply: coin.totalSupply,
      payoutRecipient: coin.payoutRecipient,
      owners: coin.owners,
      creatorAddress: coin.creatorAddress,
      createdAt: coin.createdAt,
      poolAddress: coin.pool,
    };

    return NextResponse.json(
      {
        success: true,
        data: marketData,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Market data fetch error:', errorMsg);

    // Check for specific Zora SDK errors
    if (errorMsg.includes('404') || errorMsg.includes('not found')) {
      return NextResponse.json(
        { success: false, error: 'Coin not found on chain' },
        { status: 404 }
      );
    }

    if (errorMsg.includes('rate limit') || errorMsg.includes('429')) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded, please try again later' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}
