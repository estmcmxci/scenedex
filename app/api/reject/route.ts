/**
 * POST /api/reject
 * 
 * Curator rejection endpoint using Safe multisig
 * 
 * Request Body:
 * {
 *   releaseId: string,
 *   signature: string (EIP-191 signature),
 *   reason?: string (optional rejection reason)
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   data: {
 *     releaseId: string,
 *     curator: string,
 *     message: string
 *   }
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyCuratorSignature, isSafeMember, getSafeAddress } from '@/lib/services/safe';
import { deleteAllApprovalsForRelease } from '@/lib/db/approvals';
import { updateReleaseStatus } from '@/lib/db/releases';
import { query } from '@/lib/db/database';

export async function POST(request: NextRequest) {
  try {
    console.log('\n🚫 REJECT ENDPOINT');
    console.log('================================================\n');

    // Step 1: Parse request body
    console.log('Step 1️⃣: Parse request');
    const body = await request.json();
    const { releaseId, signature, reason } = body;

    if (!releaseId || !signature) {
      return NextResponse.json(
        { success: false, error: 'Missing releaseId or signature' },
        { status: 400 }
      );
    }

    console.log(`   Release ID: ${releaseId}`);
    console.log(`   Signature: ${signature.substring(0, 20)}...`);
    console.log(`   Reason: ${reason || 'No reason provided'}`);

    // Step 2: Verify signature (EIP-191)
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

    // Step 3: Get Safe address from database
    console.log('\nStep 3️⃣: Load Safe address from database');
    let safeAddress: string;
    try {
      safeAddress = await getSafeAddress();
      console.log(`✅ Safe address: ${safeAddress}`);
    } catch (error) {
      console.error(`❌ Failed to get Safe address:`, error);
      return NextResponse.json(
        { success: false, error: 'Safe address not configured' },
        { status: 500 }
      );
    }

    // Step 4: Check if curator is Safe member
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

    // Step 5: Delete all existing approvals for this release
    console.log('\nStep 5️⃣: Delete all existing approvals');
    const deleteResult = await deleteAllApprovalsForRelease(releaseId);
    if (!deleteResult.success) {
      console.error(`❌ Failed to delete approvals: ${deleteResult.error}`);
      return NextResponse.json(
        { success: false, error: deleteResult.error },
        { status: 500 }
      );
    }
    console.log(`✅ Deleted ${deleteResult.data} approval(s)`);

    // Step 6: Update release status to pending with rejection reason
    console.log('\nStep 6️⃣: Update release status');
    const updateResult = await updateReleaseStatus(
      releaseId,
      'pending',
      {
        rejectionReason: reason || `Rejected by curator ${curatorAddress}`,
      }
    );

    if (!updateResult.success) {
      console.error(`❌ Failed to update release: ${updateResult.error}`);
      return NextResponse.json(
        { success: false, error: updateResult.error },
        { status: 500 }
      );
    }

    console.log(`✅ Release ${releaseId} rejected`);

    // Step 7: Delete temp_files (cleanup storage)
    console.log('\nStep 7️⃣: Delete temp_files from database');
    try {
      const deleteFileResult = await query(
        `DELETE FROM temp_files WHERE releaseId = $1`,
        [releaseId]
      );
      console.log(`✅ Deleted temp_files for release ${releaseId}`);
    } catch (error) {
      console.warn(`⚠️  Failed to delete temp_files: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Don't fail the entire rejection if temp_files cleanup fails
    }

    // Step 8: Return success response
    console.log('\nStep 8️⃣: Return success');
    console.log(`✅ ALL STEPS PASSED!\n`);

    return NextResponse.json(
      {
        success: true,
        data: {
          releaseId,
          curator: curatorAddress,
          message: `✅ Release rejected. All approvals and files cleared.`,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Reject error:', errorMsg);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

