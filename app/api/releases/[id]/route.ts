/**
 * GET /api/releases/[id]
 * 
 * Endpoint for retrieving a release by ID
 * 
 * Query Params:
 * - id: string (path parameter, e.g., "PDA-001")
 * 
 * Response:
 * {
 *   success: true,
 *   data: {
 *     id: "PDA-001",
 *     title: "Release Title",
 *     description: "...",
 *     status: "pending|approved|published",
 *     approvals: [
 *       {
 *         signer: "0xCurator1",
 *         signature: "0x...",
 *         timestamp: 1234567890
 *       },
 *       ...
 *     ],
 *     mediaIPFSHash: "QmAudio...",
 *     metadataURI: "ipfs://QmMetadata...",
 *     zoraNFT: "base:0xZora/1",
 *     tokenId: "1",
 *     ensSubname: "pda-001.palaupalau.eth",
 *     ...
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
import { getReleaseById } from '@/lib/db/releases';
import { getApprovalsByReleaseId } from '@/lib/db/approvals';
import { queryScenedexRelease } from '@/lib/services/query-ens';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const id = params.id;

    console.log(`📖 Fetching release: ${id}`);

    // Check if this is an ENS name (.eth) or a PDA ID
    const isENSName = id.toLowerCase().endsWith('.eth');

    if (isENSName) {
      // ===== Handle ENS Name Query =====
      console.log(`🔍 Detected ENS name: ${id}`);
      
      const releaseData = await queryScenedexRelease(id);
      
      if (!releaseData.resolver) {
        return NextResponse.json(
          { success: false, error: `ENS name ${id} not found or not registered` },
          { status: 404 }
        );
      }

      // Transform ENS data to match frontend expectations
      const coverImageIPFSHash = releaseData.standard.avatar?.replace('ipfs://', '');
      const mediaIPFSHash = releaseData.scenedex.mediaIPFS;
      const metadataIPFSHash = releaseData.scenedex.metadataURI?.replace('ipfs://', '');

      const transformedData = {
        ensName: releaseData.ensName,
        primaryAddress: releaseData.primaryAddress,
        resolver: releaseData.resolver,
        releaseId: releaseData.scenedex.releaseId || id.split('.')[0].toUpperCase(),
        artists: releaseData.scenedex.artists,
        description: releaseData.standard.description,
        // Convert IPFS hashes to gateway URLs
        coverImageUrl: coverImageIPFSHash ? `https://${coverImageIPFSHash}.ipfs.w3s.link` : null,
        audioUrl: mediaIPFSHash ? `https://${mediaIPFSHash}.ipfs.w3s.link` : null,
        metadataUrl: metadataIPFSHash ? `https://${metadataIPFSHash}.ipfs.w3s.link` : null,
        // Contract addresses
        zoraCoinAddress: releaseData.scenedex.zoraCoinAddress,
        zoraCoinSymbol: releaseData.scenedex.zoraCoinSymbol,
        splitAddress: releaseData.scenedex.splitAddress,
        // Block explorer URLs (Base Sepolia)
        zoraCoinExplorer: releaseData.scenedex.zoraCoinAddress
          ? `https://sepolia.basescan.org/address/${releaseData.scenedex.zoraCoinAddress}`
          : null,
        splitExplorer: releaseData.scenedex.splitAddress
          ? `https://sepolia.basescan.org/address/${releaseData.scenedex.splitAddress}`
          : null,
        ensExplorer: `https://sepolia.app.ens.domains/${releaseData.ensName}`,
      };

      console.log(`✅ ENS Release found: ${transformedData.releaseId} by ${transformedData.artists}`);

      return NextResponse.json(transformedData, { status: 200 });
    } else {
      // ===== Handle PDA ID Query (Database) =====
      console.log(`🗄️  Detected PDA ID: ${id}`);
      
      // Get release by ID
      const releaseResult = await getReleaseById(id);
      if (!releaseResult.success || !releaseResult.data) {
        return NextResponse.json(
          { success: false, error: `Release ${id} not found` },
          { status: 404 }
        );
      }

      const release = releaseResult.data;
      console.log(`✅ Release found: ${release.title}`);

      // Get all approvals for this release
      const approvalsResult = await getApprovalsByReleaseId(id);
      if (!approvalsResult.success) {
        console.warn(`⚠️  Failed to fetch approvals for ${id}:`, approvalsResult.error);
        // Continue with empty approvals array
      }

      const approvals = approvalsResult.success ? approvalsResult.data : [];
      console.log(`📋 Approvals count: ${approvals.length}`);

      // Reconstruct release with approvals
      const releaseWithApprovals = {
        ...release,
        approvals,
      };

      return NextResponse.json(
        {
          success: true,
          data: releaseWithApprovals,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Get release error:', errorMsg);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

