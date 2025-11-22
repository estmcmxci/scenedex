/**
 * Zustand State Management Store for Catalogue Releases
 *
 * DESIGN PRINCIPLES:
 * 1. Store ONLY published releases (immutable, blockchain-backed)
 * 2. State is synchronous (no async side effects inside store)
 * 3. Side effects (IPFS pinning, blockchain calls) happen OUTSIDE store
 * 4. Error handling: Return Result objects { success: true, data } or { success: false, error }
 * 5. Types from types.ts are the source of truth
 * 6. Validation from validation.ts guards inputs
 *
 * FLOW:
 * 1. User submits release → Frontend validates with ReleaseSubmissionSchema
 * 2. Frontend sends to backend → Backend pins IPFS (triggered by curator approval)
 * 3. Curator approves with multisig → Actions trigger side effects (MSW handler, IPFS pinning)
 * 4. Backend creates Release object → Store receives published Release
 * 5. Store adds to allReleases (immutable array, using Zustand best practices)
 *
 * NOTE: Store methods are fully synchronous in Phase 2
 * Phase 3+ backend will handle IPFS pinning, blockchain calls, etc.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Release, PublishedRelease, PendingRelease, ApprovedRelease } from './types';
import { ReleaseSchema, ApprovedReleaseSchema } from './validation';

// ============================================================================
// RESULT TYPE - For error handling
// ============================================================================

export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ============================================================================
// STORE STATE & METHODS
// ============================================================================

export interface ReleaseStore {
  // STATE
  /** Published releases only (blockchain-backed, immutable) */
  allReleases: PublishedRelease[];

  /** Pending approvals waiting for curator (ephemeral, not stored long-term) */
  pendingApprovals: ApprovedRelease[];

  // METHODS

  /**
   * Add a published release to the store
   * Validates against PublishedReleaseSchema before adding
   * Returns error if validation fails
   */
  addPublishedRelease: (release: PublishedRelease) => Result<PublishedRelease>;

  /**
   * Get a released by ID
   * Returns null if not found
   */
  getReleaseById: (id: string) => PublishedRelease | null;

  /**
   * Get all published releases
   */
  getAllReleases: () => PublishedRelease[];

  /**
   * Search releases by title (case-insensitive)
   * Useful for UI search functionality
   */
  searchReleasesByTitle: (query: string) => PublishedRelease[];

  /**
   * Get releases by creator wallet address
   */
  getReleasesByCreator: (creatorAddress: string) => PublishedRelease[];

  /**
   * Add an approved release to pending queue
   * This is ephemeral - just for UI state during approval process
   * Validates against ApprovedReleaseSchema
   */
  addPendingApproval: (release: ApprovedRelease) => Result<ApprovedRelease>;

  /**
   * Get pending approvals (for curator dashboard)
   */
  getPendingApprovals: () => ApprovedRelease[];

  /**
   * Clear all data (for testing or reset scenarios)
   * Phase 3+: Consider persistence layer (localStorage, IndexedDB, etc.)
   */
  clear: () => void;
}

// ============================================================================
// ZUSTAND STORE CREATION
// ============================================================================

export const useReleaseStore = create<ReleaseStore>()(
  persist(
    (set, get) => ({
      // INITIAL STATE
      allReleases: [],
      pendingApprovals: [],

      // METHODS

      addPublishedRelease: (release) => {
    // Validate release against schema
    const validation = ReleaseSchema.safeParse(release);
    if (!validation.success) {
      const errorMessages = validation.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      return { success: false, error: errorMessages };
    }

    // Check it's actually published
    if (release.status !== 'published') {
      return { success: false, error: 'Release must have status "published"' };
    }

    // Add to store (immutable update)
    set((state) => ({
      allReleases: [...state.allReleases, release],
    }));

    return { success: true, data: release };
  },

  getReleaseById: (id) => {
    return get().allReleases.find((r) => r.id === id) ?? null;
  },

  getAllReleases: () => {
    return get().allReleases;
  },

  searchReleasesByTitle: (query) => {
    const lowerQuery = query.toLowerCase();
    return get().allReleases.filter((r) =>
      r.title.toLowerCase().includes(lowerQuery)
    );
  },

  getReleasesByCreator: (creatorAddress) => {
    return get().allReleases.filter(
      (r) => r.createdBy.toLowerCase() === creatorAddress.toLowerCase()
    );
  },

  addPendingApproval: (release) => {
    // Validate against ApprovedReleaseSchema
    const validation = ApprovedReleaseSchema.safeParse(release);
    if (!validation.success) {
      const errorMessages = validation.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      return { success: false, error: errorMessages };
    }

    // Check it's actually approved
    if (release.status !== 'approved') {
      return { success: false, error: 'Release must have status "approved"' };
    }

    // Add to pending queue (immutable update)
    set((state) => ({
      pendingApprovals: [...state.pendingApprovals, release],
    }));

    return { success: true, data: release };
  },

  getPendingApprovals: () => {
    return get().pendingApprovals;
  },

  clear: () => {
    set({
      allReleases: [],
      pendingApprovals: [],
    });
  },
    }),
    {
      name: 'release-store',
      version: 1,
    }
  )
);

// ============================================================================
// HELPER EXPORTS (for use in components & handlers)
// ============================================================================

/**
 * Hook to use the entire store
 * Usage: const store = useReleaseStore()
 */
export function useReleasesData() {
  return useReleaseStore((state) => state.allReleases);
}

/**
 * Hook to get store methods only
 * Usage: const { addPublishedRelease } = useReleaseMethods()
 */
export function useReleaseMethods() {
  return useReleaseStore((state) => ({
    addPublishedRelease: state.addPublishedRelease,
    getReleaseById: state.getReleaseById,
    getAllReleases: state.getAllReleases,
    searchReleasesByTitle: state.searchReleasesByTitle,
    getReleasesByCreator: state.getReleasesByCreator,
    addPendingApproval: state.addPendingApproval,
    getPendingApprovals: state.getPendingApprovals,
    clear: state.clear,
  }));
}

// ============================================================================
// NOTES FOR PHASE 3+ DEVELOPMENT
// ============================================================================

/**
 * PERSISTENCE LAYER (Phase 3+)
 * Consider adding:
 * - localStorage adapter for offline browsing
 * - IndexedDB for large datasets
 * - Sync with backend/blockchain on reconnect
 *
 * SUBSCRIPTIONS (Phase 3+)
 * Consider adding:
 * - Store listener for UI updates
 * - Optimistic updates during IPFS pinning
 * - Rollback on error
 *
 * SIDE EFFECTS (handled in MSW handlers or backend)
 * - IPFS pinning (triggered by curator approval action)
 * - Zora NFT minting (after IPFS metadata creation)
 * - ENS subname registration (after NFT minting)
 * - Multisig approval collection (external Safe contract)
 *
 * QUERY PATTERNS (Phase 3+)
 * Consider adding computed selectors:
 * - getPendingCountByCreator(address)
 * - getTotalReleases()
 * - getRecentReleases(limit)
 * - etc.
 */

