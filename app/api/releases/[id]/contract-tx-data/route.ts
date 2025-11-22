/**
 * GET /api/releases/[id]/contract-tx-data
 * 
 * Returns transaction data for creating split and Zora coin contracts
 * These transactions will be signed and sent by the curator's connected wallet
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSplitCalldata } from '@/lib/services/splits';
import { getZoraCoinCalldata } from '@/lib/services/zora';
import { query } from '@/lib/db/database';
import { getSafeAddress } from '@/lib/services/safe';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: releaseId } = await params;

    // Load release data
    const releaseResult = await query(
      `SELECT id, title, description, createdby, createdat FROM releases WHERE id = $1`,
      [releaseId]
    );

    if (releaseResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Release not found' },
        { status: 404 }
      );
    }

    const release = releaseResult.rows[0];
    const creatorAddress = release.createdby;

    if (!creatorAddress) {
      return NextResponse.json(
        { success: false, error: 'Release missing creator address' },
        { status: 400 }
      );
    }

    // Get Safe address (needed for split creation)
    const safeAddress = await getSafeAddress(creatorAddress);
    if (!safeAddress) {
      return NextResponse.json(
        { success: false, error: 'Safe address not found' },
        { status: 400 }
      );
    }

    // Get metadata URI (needed for Zora coin)
    // We'll use a placeholder for now - the actual URI will be set after IPFS pinning
    const metadataURI = `ipfs://placeholder-${releaseId}`;

    // Get split calldata
    const splitCalldata = await getSplitCalldata(
      safeAddress as any,
      creatorAddress as any
    );

    // Predict split address (needed for Zora coin)
    const { SplitV2Client } = await import('@0xsplits/splits-sdk');
    const rpcUrl = process.env.BASE_RPC_URL;
    if (!rpcUrl) {
      throw new Error('BASE_RPC_URL not set');
    }

    const { createPublicClient, http } = await import('viem');
    const { baseSepolia } = await import('viem/chains');
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(rpcUrl),
    });

    const splitsClient = new SplitV2Client({
      chainId: 84532,
      publicClient,
    });

    const predictedSplit = await splitsClient.predictDeterministicAddress({
      recipients: [
        { address: safeAddress, percentAllocation: 50.0 },
        { address: creatorAddress, percentAllocation: 50.0 },
      ],
      distributorFeePercent: 1.0,
      totalAllocationPercent: 100.0,
      splitType: 'Push' as any,
      ownerAddress: safeAddress,
      creatorAddress: safeAddress,
    });

    const predictedSplitAddress = typeof predictedSplit === 'string'
      ? predictedSplit
      : (predictedSplit as any)?.address || (predictedSplit as any)?.splitAddress;

    // Get Zora coin calldata (using predicted split address)
    const zoraCalldata = getZoraCoinCalldata(
      releaseId,
      creatorAddress as any,
      predictedSplitAddress as any,
      metadataURI,
      release.title || 'Untitled',
      'metadata.json'
    );

    return NextResponse.json({
      success: true,
      data: {
        releaseId,
        splitTransaction: {
          to: splitCalldata.to,
          data: splitCalldata.data,
          value: splitCalldata.value,
          chainId: 84532, // Base Sepolia
        },
        zoraTransaction: {
          to: zoraCalldata.to,
          data: zoraCalldata.data,
          value: zoraCalldata.value,
          chainId: 84532, // Base Sepolia
        },
        predictedSplitAddress,
      },
    });
  } catch (error) {
    console.error('Failed to get contract transaction data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

