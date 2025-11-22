/**
 * POST /api/approve
 * 
 * Curator approval endpoint using Safe multisig
 * 
 * Request Body:
 * {
 *   releaseId: string,
 *   signature: string (EIP-191 signature)
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   data: {
 *     releaseId: string,
 *     curator: string,
 *     approvalCount: number,
 *     threshold: number,
 *     thresholdMet: boolean,
 *     message: string
 *   }
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyCuratorSignature, isSafeMember, getApprovalThreshold, getSafeAddress } from '@/lib/services/safe';
import { createApproval, countApprovalsForRelease, hasApprovalFromSigner, getSafeTxHashForRelease } from '@/lib/db/approvals';
import { publishReleaseViaSafe } from '@/lib/services/jobs';

export async function POST(request: NextRequest) {
  try {
    console.log('\n🔐 APPROVE ENDPOINT');
    console.log('================================================\n');

    // Step 1: Parse request body
    console.log('Step 1️⃣: Parse request');
    const body = await request.json();
    const { releaseId, signature } = body;

    if (!releaseId || !signature) {
      return NextResponse.json(
        { success: false, error: 'Missing releaseId or signature' },
        { status: 400 }
      );
    }

    console.log(`   Release ID: ${releaseId}`);
    console.log(`   Signature: ${signature.substring(0, 20)}...`);

    // Step 2: Verify signature (Pattern 1)
    console.log('\nStep 2️⃣: Verify signature (EIP-191)');
    const signatureResult = verifyCuratorSignature(releaseId, signature);

    if (!signatureResult.success) {
      console.error(`❌ Signature verification failed: ${signatureResult.error}`);
      return NextResponse.json(
        { success: false, error: signatureResult.error },
        { status: 401 }
      );
    }

    const curatorAddress = signatureResult.address!;
    console.log(`✅ Signature verified`);
    console.log(`   Recovered curator: ${curatorAddress}`);

    // Step 3: Get Safe address from database (user-specific or global)
    console.log('\nStep 3️⃣: Load Safe address from database');
    let safeAddress: string;
    try {
      // Try to get user-specific Safe first, fallback to global settings
      safeAddress = await getSafeAddress(curatorAddress);
      console.log(`✅ Safe address: ${safeAddress}`);
    } catch (error) {
      console.error(`❌ Failed to get Safe address:`, error);
      return NextResponse.json(
        { success: false, error: 'Safe address not configured. Please link a Safe to your wallet.' },
        { status: 500 }
      );
    }

    // Step 4: Check if curator is Safe member (Pattern 2)
    console.log('\nStep 4️⃣: Verify curator is Safe member');
    let isMember: boolean;
    try {
      isMember = await isSafeMember(curatorAddress, safeAddress);
      if (!isMember) {
        console.error(`❌ ${curatorAddress} is not a Safe owner`);
        return NextResponse.json(
          { success: false, error: 'Curator is not a Safe member' },
          { status: 403 }
        );
      }
      console.log(`✅ ${curatorAddress} is a Safe owner`);
    } catch (error) {
      console.error(`❌ Failed to check Safe membership:`, error);
      return NextResponse.json(
        { success: false, error: 'Failed to verify Safe membership' },
        { status: 500 }
      );
    }

    // Step 5: Check if curator already approved
    console.log('\nStep 5️⃣: Check if curator already approved');
    const hasApprovedResult = await hasApprovalFromSigner(releaseId, curatorAddress);
    if (hasApprovedResult.success && hasApprovedResult.data) {
      console.warn(`⚠️ ${curatorAddress} has already approved ${releaseId}`);
      return NextResponse.json(
        { success: false, error: 'Curator has already approved this release' },
        { status: 409 }
      );
    }

    // Step 6: Check if this is the first approval (will create Safe transaction)
    console.log('\nStep 6️⃣: Check if first approval');
    const countBeforeResult = await countApprovalsForRelease(releaseId);
    const isFirstApproval = !countBeforeResult.success || countBeforeResult.data === 0;
    console.log(`   Is first approval: ${isFirstApproval}`);

    // Step 7: Store approval in database (without safeTxHash initially)
    console.log('\nStep 7️⃣: Store approval in database');
    const approvalResult = await createApproval({
      releaseId,
      signer: curatorAddress,
      signature,
      timestamp: Date.now(), // Frontend ms
    });

    if (!approvalResult.success) {
      console.error(`❌ Failed to store approval: ${approvalResult.error}`);
      return NextResponse.json(
        { success: false, error: approvalResult.error },
        { status: 500 }
      );
    }

    console.log(`✅ Approval stored`);

    // Step 8: Get approval threshold (Pattern 3)
    console.log('\nStep 8️⃣: Get approval threshold from Safe');
    let threshold: number;
    try {
      threshold = await getApprovalThreshold(safeAddress);
      console.log(`✅ Threshold: ${threshold}`);
    } catch (error) {
      console.error(`❌ Failed to get threshold:`, error);
      return NextResponse.json(
        { success: false, error: 'Failed to get approval threshold' },
        { status: 500 }
      );
    }

    // Step 9: Count current approvals (Pattern 3)
    console.log('\nStep 9️⃣: Count approvals for release');
    const countResult = await countApprovalsForRelease(releaseId);
    if (!countResult.success) {
      console.error(`❌ Failed to count approvals: ${countResult.error}`);
      return NextResponse.json(
        { success: false, error: countResult.error },
        { status: 500 }
      );
    }

    const approvalCount = countResult.data;
    console.log(`✅ Current approvals: ${approvalCount}/${threshold}`);

    // Step 10: Check if threshold is met
    console.log('\nStep 1️⃣0️⃣: Check if threshold met');
    const thresholdMet = approvalCount >= threshold;

    let safeTxHash: string | null = null;
    let contractTxData: any = null;
    
    if (thresholdMet) {
      console.log(`✅ THRESHOLD MET! (${approvalCount}/${threshold})`);
      console.log(`\n🚀 Threshold met - returning transaction data for client-side execution`);
      
      // Get transaction data for split and Zora coin creation
      // These will be signed and sent by the curator's connected wallet
      try {
        const txDataResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/releases/${releaseId}/contract-tx-data`
        );
        const txDataResult = await txDataResponse.json();
        
        if (txDataResult.success) {
          contractTxData = txDataResult.data;
          console.log(`✅ Contract transaction data prepared`);
        } else {
          console.warn(`⚠️ Failed to get contract transaction data: ${txDataResult.error}`);
        }
      } catch (error) {
        console.warn(`⚠️ Error fetching contract transaction data:`, error);
        // Continue - client can retry
      }
    } else {
      console.log(`⏳ Threshold not met yet: ${approvalCount}/${threshold}`);
    }

    // Step 11: Return success response
    console.log('\nStep 1️⃣1️⃣: Return success');
    console.log(`✅ ALL STEPS PASSED!\n`);

    return NextResponse.json(
      {
        success: true,
        data: {
          releaseId,
          curator: curatorAddress,
          approvalCount,
          threshold,
          thresholdMet,
          contractTxData: contractTxData || undefined, // Transaction data for split/Zora creation
          message: thresholdMet
            ? `✅ Threshold met! Please sign the contract creation transactions.`
            : `⏳ Approval stored. ${threshold - approvalCount} more approval(s) needed.`,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Approve error:', errorMsg);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

