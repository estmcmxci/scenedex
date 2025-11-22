/**
 * POST /api/releases/[id]/contracts-created
 * 
 * Notifies backend that split and Zora contracts have been created
 * Backend will then proceed with Safe transaction for ENS operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { publishReleaseViaSafe } from '@/lib/services/jobs';
import { query } from '@/lib/db/database';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: releaseId } = await params;
    const body = await request.json();
    const { splitTxHash, zoraTxHash, predictedSplitAddress } = body;

    if (!splitTxHash || !zoraTxHash) {
      return NextResponse.json(
        { success: false, error: 'Missing transaction hashes' },
        { status: 400 }
      );
    }

    console.log(`\n📦 Contracts created for release: ${releaseId}`);
    console.log(`   Split TX: ${splitTxHash}`);
    console.log(`   Zora TX: ${zoraTxHash}`);
    console.log(`   Predicted Split Address: ${predictedSplitAddress}`);

    // Get the curator address from the latest approval
    const approvalResult = await query(
      `SELECT signer FROM approvals WHERE "releaseId" = $1 ORDER BY timestamp DESC LIMIT 1`,
      [releaseId]
    );

    if (approvalResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No approvals found for this release' },
        { status: 400 }
      );
    }

    const curatorAddress = approvalResult.rows[0].signer;

    // Extract Zora coin address from transaction receipt
    const { createPublicClient, http } = await import('viem');
    const { baseSepolia } = await import('viem/chains');
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(process.env.BASE_RPC_URL!),
    });

    const zoraReceipt = await publicClient.getTransactionReceipt({ hash: zoraTxHash as `0x${string}` });
    const zoraCoinAddress = zoraReceipt.logs[0]?.address || null;

    if (!zoraCoinAddress) {
      return NextResponse.json(
        { success: false, error: 'Could not extract Zora coin address from transaction' },
        { status: 400 }
      );
    }

    // Store contract addresses in database
    const pdaNumber = releaseId.split('-')[1] || 'UNKNOWN';
    const zoraCoinSymbol = `PDA${pdaNumber}`;

    await query(
      `UPDATE releases SET split_address = $1, zora_coin_address = $2, zora_coin_symbol = $3 WHERE id = $4`,
      [predictedSplitAddress, zoraCoinAddress, zoraCoinSymbol, releaseId]
    );

    console.log(`   ✅ Stored contract addresses:`);
    console.log(`      Split: ${predictedSplitAddress}`);
    console.log(`      Zora Coin: ${zoraCoinAddress}`);
    console.log(`      Symbol: ${zoraCoinSymbol}`);

    // Now proceed with Safe transaction (ENS operations)
    // The publishReleaseViaSafe function will use the stored split address
    // and extract Zora coin address from the transaction
    console.log(`\n🚀 Proceeding with Safe transaction for ENS operations...`);
    const safeTxHash = await publishReleaseViaSafe(releaseId, curatorAddress);

    // Update approvals with safeTxHash
    await query(
      `UPDATE approvals SET safeTxHash = $1 WHERE "releaseId" = $2`,
      [safeTxHash, releaseId]
    );

    return NextResponse.json({
      success: true,
      data: {
        releaseId,
        splitTxHash,
        zoraTxHash,
        safeTxHash,
        message: '✅ Contracts created and publication completed!',
      },
    });
  } catch (error) {
    console.error('Failed to process contracts created:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

