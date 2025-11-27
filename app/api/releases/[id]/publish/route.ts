/**
 * POST /api/releases/[id]/publish
 * 
 * Triggers the publish job for a release after threshold is met.
 * This creates the Split, Zora Coin, and Basename.
 * 
 * Request Body:
 * {
 *   signature: string (EIP-191 signature of releaseId)
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   data?: { releaseId, message, ... },
 *   error?: string
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyCuratorSignature, isSafeMember, getApprovalThreshold, getSafeAddress } from '@/lib/services/safe';
import { countApprovalsForRelease } from '@/lib/db/approvals';
import { publishReleaseViaSafe } from '@/lib/services/jobs';
import { getReleaseById } from '@/lib/db/releases';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: releaseId } = await params;
    
    console.log('\n🚀 PUBLISH ENDPOINT');
    console.log('================================================\n');
    console.log(`   Release ID: ${releaseId}`);

    // Step 1: Parse request body
    console.log('Step 1️⃣: Parse request');
    const body = await request.json();
    const { signature } = body;

    if (!signature) {
      return NextResponse.json(
        { success: false, error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Step 2: Verify signature
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
    console.log(`   Curator: ${curatorAddress}`);

    // Step 3: Get Safe address
    console.log('\nStep 3️⃣: Load Safe address');
    let safeAddress: string;
    try {
      safeAddress = await getSafeAddress(curatorAddress);
      console.log(`✅ Safe address: ${safeAddress}`);
    } catch (error) {
      console.error(`❌ Failed to get Safe address:`, error);
      return NextResponse.json(
        { success: false, error: 'Safe address not configured' },
        { status: 500 }
      );
    }

    // Step 4: Verify curator is Safe member
    console.log('\nStep 4️⃣: Verify curator is Safe member');
    const isMember = await isSafeMember(curatorAddress, safeAddress);
    if (!isMember) {
      console.error(`❌ ${curatorAddress} is not a Safe owner`);
      return NextResponse.json(
        { success: false, error: 'Curator is not a Safe member' },
        { status: 403 }
      );
    }
    console.log(`✅ ${curatorAddress} is a Safe owner`);

    // Step 5: Verify threshold is met
    console.log('\nStep 5️⃣: Verify threshold is met');
    const threshold = await getApprovalThreshold(safeAddress);
    const countResult = await countApprovalsForRelease(releaseId);
    
    if (!countResult.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to count approvals' },
        { status: 500 }
      );
    }

    const approvalCount = countResult.data;
    console.log(`   Approvals: ${approvalCount}/${threshold}`);

    if (approvalCount < threshold) {
      console.error(`❌ Threshold not met: ${approvalCount}/${threshold}`);
      return NextResponse.json(
        { success: false, error: `Threshold not met. Need ${threshold - approvalCount} more approval(s).` },
        { status: 400 }
      );
    }
    console.log(`✅ Threshold met!`);

    // Step 6: Check release exists and is pending
    console.log('\nStep 6️⃣: Check release status');
    const releaseResult = await getReleaseById(releaseId);
    if (!releaseResult.success || !releaseResult.data) {
      return NextResponse.json(
        { success: false, error: 'Release not found' },
        { status: 404 }
      );
    }

    const release = releaseResult.data;
    if (release.status === 'published') {
      return NextResponse.json(
        { success: false, error: 'Release is already published' },
        { status: 400 }
      );
    }
    console.log(`✅ Release status: ${release.status}`);

    // Step 7: Trigger publish job
    console.log('\nStep 7️⃣: Trigger publish job');
    console.log(`🚀 Starting publish for release ${releaseId}...`);
    
    // publishReleaseViaSafe returns the safeTxHash string on success, throws on error
    const safeTxHash = await publishReleaseViaSafe(releaseId, safeAddress);

    console.log(`✅ Publish job completed successfully!`);
    console.log(`   Safe Tx Hash: ${safeTxHash}`);
    console.log(`\n✅ ALL STEPS PASSED!\n`);

    return NextResponse.json(
      {
        success: true,
        data: {
          releaseId,
          safeTxHash,
          message: '✅ Release published successfully! Split, Zora Coin, and Basename created.',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Publish error:', errorMsg);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

