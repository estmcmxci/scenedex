/**
 * MSW Handlers - Releases API
 *
 * Endpoints:
 * - GET /api/releases (list all published)
 * - GET /api/releases/:id (get single release)
 * - POST /api/submit (create new release)
 *
 * DESIGN DECISION (Strategy #7): Handlers control store
 * - Validate input with validation.ts schemas
 * - Update store directly
 * - Return success/error responses
 */

// @ts-ignore - MSW types may not be installed in dev environment
import { http, HttpResponse } from 'msw';
import { useReleaseStore } from '../../store';
import { MOCK_PUBLISHED_RELEASES } from '../fixtures';
import {
  ReleaseSubmissionSchema,
  ReleaseSchema,
} from '../../validation';
import type { PublishedRelease } from '../../types';

// ============================================================================
// HANDLER 1: GET /api/releases - List all published releases
// ============================================================================

const getReleasesHandler = http.get('/api/releases', (): any => {
  try {
    const store = useReleaseStore.getState();
    const releases = store.getAllReleases();

    // If store is empty (first load), seed with fixtures
    if (releases.length === 0) {
      MOCK_PUBLISHED_RELEASES.forEach(release => {
        store.addPublishedRelease(release);
      });
    }

    return HttpResponse.json({
      success: true,
      data: releases,
      count: releases.length,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('GET /api/releases error:', errorMessage);
    return HttpResponse.json(
      {
        success: false,
        error: 'Failed to fetch releases',
      },
      { status: 500 }
    );
  }
});

// ============================================================================
// HANDLER 2: GET /api/releases/:id - Get single release by ID
// ============================================================================

const getReleaseByIdHandler = http.get('/api/releases/:id', ({ params }: any): any => {
  try {
    const { id } = params;
    const store = useReleaseStore.getState();
    const release = store.getReleaseById(String(id));

    if (!release) {
      return HttpResponse.json(
        {
          success: false,
          error: `Release ${id} not found`,
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: release,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('GET /api/releases/:id error:', errorMessage);
    return HttpResponse.json(
      {
        success: false,
        error: 'Failed to fetch release',
      },
      { status: 500 }
    );
  }
});

// ============================================================================
// HANDLER 3: POST /api/submit - Create new release
// ============================================================================

const submitReleaseHandler = http.post('/api/submit', async (info: any): Promise<any> => {
  try {
    const body = (await info.request.json()) as unknown;

    // Validate input with ReleaseSubmissionSchema
    const validation = ReleaseSubmissionSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.errors
        .map(e => `${e.path.join('.')}: ${e.message}`)
        .join('; ');

      console.warn('POST /api/submit validation error:', errors);
      return HttpResponse.json(
        {
          success: false,
          error: errors,
          errors: validation.error.errors,
        },
        { status: 400 }
      );
    }

    // Extract data
    const { title, description, mediaFile, artists } = validation.data;

    // Create Release object
    // In Phase 2, we mock the backend processing:
    // - Generate ID
    // - Extract duration from file (mock)
    // - Extract cover image (mock)
    // - Pin to IPFS (mock)
    const now = Date.now();
    const releaseId = `PDA-${String(Math.floor(Math.random() * 10000)).padStart(3, '0')}`;

    // Create as 'approved' release (1 approval collected, queued for final publication)
    const newRelease = {
      id: releaseId,
      createdBy: '0xMockUser000XXXXXXXXXXXXXXXXXXXXXXXX', // Mock wallet in Phase 2
      createdAt: now,
      title,
      description,
      mediaIPFSHash: `QmMockMedia${String(Math.random() * 10000).padStart(4, '0')}`,
      artists,
      duration: 240, // Mock: extract from file in Phase 3
      coverImageIPFSHash: `QmMockCover${String(Math.random() * 10000).padStart(4, '0')}`,
      status: 'approved' as const, // Queued for curator approval
      metadataURI: `QmMockMetadata${String(Math.random() * 10000).padStart(4, '0')}`,
      zoraNFT: `base:0xZoraMock${String(Math.random() * 10000).padStart(4, '0')}`,
      tokenId: String(Math.floor(Math.random() * 1000)),
      approvals: [
        {
          signer: '0xCurator001XXXXXXXXXXXXXXXXXXXXXXXX',
          signature: `0x${'a'.repeat(130)}`,
          timestamp: now,
        },
      ],
      multisigAddress: '0xMultisigMock0XXXXXXXXXXXXXXXXXX',
      approvalThreshold: 1,
      approvalRequirementsMet: false, // Not yet met - awaiting curator approval
      approvedAt: now, // Set for validation even though not yet published
    } as unknown as PublishedRelease;

    // Validate the created release
    const releaseValidation = ReleaseSchema.safeParse(newRelease);
    if (!releaseValidation.success) {
      const errors = releaseValidation.error.errors
        .map(e => `${e.path.join('.')}: ${e.message}`)
        .join('; ');

      console.error('POST /api/submit: Created release failed validation:', errors);
      return HttpResponse.json(
        {
          success: false,
          error: 'Failed to create valid release',
        },
        { status: 500 }
      );
    }

    // Add to pending approvals (not published yet)
    const store = useReleaseStore.getState();
    const result = store.addPendingApproval(newRelease as any);

    if (!result.success) {
      console.error('POST /api/submit: Store error:', result.error);
      return HttpResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 }
      );
    }

    // Success
    return HttpResponse.json(
      {
        success: true,
        data: newRelease,
        message: `Release ${releaseId} queued for approval`,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('POST /api/submit error:', errorMessage);

    // Handle specific error scenarios
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
        error: 'Failed to create release',
      },
      { status: 500 }
    );
  }
});

// ============================================================================
// ERROR SCENARIO: Mock 403 Unauthorized (scaffold for Phase 3 auth)
// ============================================================================

/**
 * NOTE: Phase 3+ should add proper auth validation here
 * For now, this is scaffolding to test error handling
 *
 * Example error scenario handler:
 * http.post('/api/submit', ({ request }) => {
 *   if (!request.headers.get('Authorization')) {
 *     return HttpResponse.json(
 *       { success: false, error: 'Unauthorized' },
 *       { status: 403 }
 *     );
 *   }
 *   // ... rest of handler
 * });
 */

// ============================================================================
// EXPORT: All releases handlers
// ============================================================================

export const releasesHandlers = [
  getReleasesHandler,
  getReleaseByIdHandler,
  submitReleaseHandler,
];

