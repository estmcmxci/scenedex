/**
 * MSW Handlers - Approvals API
 *
 * Endpoints:
 * - POST /api/curator/approve (add approval, check threshold, publish if met)
 * - GET /api/curator/pending (get pending approvals)
 *
 * MULTISIG FLOW (Strategy #10):
 * Input: { releaseId, curatorAddress, signature }
 *   ↓
 * Create Approval: { signer, signature, timestamp }
 *   ↓
 * Add to release.approvals array
 *   ↓
 * Check: approvals.length >= approvalThreshold?
 *   ↓
 * Yes → Move to published (status: 'published')
 * No  → Stay approved (status: 'approved')
 *   ↓
 * Return updated release
 */

// @ts-ignore - MSW types may not be installed in dev environment
import { http, HttpResponse } from 'msw';
import { useReleaseStore } from '../../store';
import type { Approval, PublishedRelease } from '../../types';

// ============================================================================
// HANDLER 1: POST /api/curator/approve - Add approval and check threshold
// ============================================================================

const approveReleaseHandler = http.post('/api/curator/approve', async (info: any): Promise<any> => {
  try {
    const body = (await info.request.json()) as unknown;

    // Validate input
    if (typeof body !== 'object' || body === null) {
      return HttpResponse.json(
        {
          success: false,
          error: 'Invalid request body',
        },
        { status: 400 }
      );
    }

    const input = body as Record<string, unknown>;

    // Extract fields
    const releaseId = input.releaseId as string | undefined;
    const curatorAddress = input.curatorAddress as string | undefined;
    const signature = input.signature as string | undefined;

    // Validate required fields
    if (!releaseId || !curatorAddress || !signature) {
      const missing = [
        !releaseId && 'releaseId',
        !curatorAddress && 'curatorAddress',
        !signature && 'signature',
      ]
        .filter(Boolean)
        .join(', ');

      return HttpResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missing}`,
        },
        { status: 400 }
      );
    }

    // Validate field types
    if (typeof releaseId !== 'string' || typeof curatorAddress !== 'string' || typeof signature !== 'string') {
      return HttpResponse.json(
        {
          success: false,
          error: 'Invalid field types. Expected all strings.',
        },
        { status: 400 }
      );
    }

    // Validate signature format (0x + hex)
    if (!/^0x[a-fA-F0-9]{128,}$/.test(signature)) {
      return HttpResponse.json(
        {
          success: false,
          error: 'Invalid signature format. Expected 0x + 128+ hex characters.',
        },
        { status: 400 }
      );
    }

    // Get store and find pending release
    const store = useReleaseStore.getState();
    const pending = store.getPendingApprovals();
    const releaseToApprove = pending.find(r => r.id === releaseId);

    if (!releaseToApprove) {
      return HttpResponse.json(
        {
          success: false,
          error: `Release ${releaseId} not found in pending approvals`,
        },
        { status: 404 }
      );
    }

    // Create new approval
    const newApproval: Approval = {
      signer: curatorAddress,
      signature,
      timestamp: Date.now(),
    };

    // Add approval to release
    const updatedRelease = {
      ...releaseToApprove,
      approvals: [...releaseToApprove.approvals, newApproval],
    };

    // Check if threshold is met
    const thresholdMet = updatedRelease.approvals.length >= updatedRelease.approvalThreshold;

    // Update release based on threshold
    const finalRelease = {
      ...updatedRelease,
      approvalRequirementsMet: thresholdMet,
      status: thresholdMet ? ('published' as const) : ('approved' as const),
      approvedAt: thresholdMet ? Date.now() : updatedRelease.approvedAt,
    };

    // If publishing, add to published releases
    if (thresholdMet && finalRelease.metadataURI && finalRelease.zoraNFT && finalRelease.tokenId) {
      const publishedRelease: PublishedRelease = {
        ...finalRelease,
        status: 'published',
        metadataURI: finalRelease.metadataURI,
        zoraNFT: finalRelease.zoraNFT,
        tokenId: finalRelease.tokenId,
      };

      const result = store.addPublishedRelease(publishedRelease);
      if (!result.success) {
        console.error('POST /api/curator/approve: Failed to add published release:', result.error);
        return HttpResponse.json(
          {
            success: false,
            error: 'Failed to publish release after threshold met',
          },
          { status: 500 }
        );
      }
    }

    // Return updated release
    return HttpResponse.json({
      success: true,
      data: finalRelease,
      message: thresholdMet
        ? `Release ${releaseId} published (${updatedRelease.approvals.length}/${updatedRelease.approvalThreshold} approvals)`
        : `Approval added to ${releaseId} (${updatedRelease.approvals.length}/${updatedRelease.approvalThreshold} approvals)`,
      thresholdMet,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('POST /api/curator/approve error:', errorMessage);

    if (errorMessage.includes('JSON.parse')) {
      return HttpResponse.json(
        {
          success: false,
          error: 'Invalid JSON in request body',
        },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      {
        success: false,
        error: 'Failed to process approval',
      },
      { status: 500 }
    );
  }
});

// ============================================================================
// HANDLER 2: GET /api/curator/pending - Get pending approvals
// ============================================================================

const getPendingApprovalsHandler = http.get('/api/curator/pending', (): any => {
  try {
    const store = useReleaseStore.getState();
    const pending = store.getPendingApprovals();

    // If store is empty (first load), seed with fixtures
    if (pending.length === 0) {
      // Import fixtures dynamically to seed
      import('../fixtures').then(({ MOCK_PENDING_APPROVALS }) => {
        MOCK_PENDING_APPROVALS.forEach(approval => {
          store.addPendingApproval(approval);
        });
      });
    }

    return HttpResponse.json({
      success: true,
      data: pending,
      count: pending.length,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('GET /api/curator/pending error:', errorMessage);
    return HttpResponse.json(
      {
        success: false,
        error: 'Failed to fetch pending approvals',
      },
      { status: 500 }
    );
  }
});

// ============================================================================
// ERROR SCENARIOS (Scaffold for Phase 3)
// ============================================================================

/**
 * NOTE: The following are scaffolding comments for Phase 3+ error handling
 *
 * Example: Mock 403 Unauthorized
 * - Check for Authorization header
 * - Verify curator is in multisig signers list
 * - Return 403 if not authorized
 *
 * Example: Mock timeout scenario (Phase 3)
 * - Add latency simulation (200-500ms)
 * - Optionally fail with 408 Request Timeout
 *
 * Example: Mock multisig contract failure
 * - Simulate Safe contract being unavailable
 * - Return 503 Service Unavailable
 */

// ============================================================================
// EXPORT: All approvals handlers
// ============================================================================

export const approvalsHandlers = [
  approveReleaseHandler,
  getPendingApprovalsHandler,
];

