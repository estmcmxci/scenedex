/**
 * Mock Fixture Data for Testing
 *
 * DESIGN:
 * - 5 PublishedReleases with various multisig scenarios
 * - 3 ApprovedReleases ready to transition to published
 * - All data matches types.ts exactly
 * - Minimal but sufficient for comprehensive testing
 * - Unique IPFS hashes per release (realistic)
 * - Placeholder artist names (Artist 1, Artist 2, etc.)
 *
 * MULTISIG SCENARIOS COVERED:
 * - Single curator (1-of-1)
 * - Two-of-three multisig (2-of-3)
 * - Three-of-three multisig (3-of-3)
 * - Various pending states (1-of-3, 2-of-3, ready)
 */

import type { PublishedRelease, ApprovedRelease, Approval } from '../types';

// ============================================================================
// HELPER: Generate realistic timestamps (variations of "days ago")
// ============================================================================

const now = Date.now();
const oneDay = 24 * 60 * 60 * 1000;
const daysAgo = (days: number) => now - days * oneDay;

// ============================================================================
// HELPER: Generate mock IPFS hashes
// ============================================================================

const mockMediaHash = (id: number) => `QmMedia${String(id).padStart(4, '0')}XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`;
const mockCoverHash = (id: number) => `QmCover${String(id).padStart(4, '0')}XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`;
const mockMetadataHash = (id: number) => `QmMetad${String(id).padStart(4, '0')}XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`;

// ============================================================================
// HELPER: Create Approval objects for multisig
// ============================================================================

const createApproval = (index: number, releaseCreatedAt: number): Approval => ({
  signer: `0xCurator${String(index).padStart(3, '0')}${'X'.repeat(25)}`,
  signature: `0x${'a'.repeat(index % 3 === 0 ? 130 : index % 3 === 1 ? 131 : 132).substring(0, 130)}`,
  timestamp: releaseCreatedAt + index * 3600000, // Stagger by 1 hour each
});

// ============================================================================
// SECTION 1: PUBLISHED RELEASES (5 total)
// ============================================================================

/**
 * Release 1: Single curator (1-of-1)
 * - Simplest multisig scenario
 * - One approval, threshold of 1
 */
const publishedRelease1: PublishedRelease = {
  id: 'PDA-001',
  createdBy: '0xUser001XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  createdAt: daysAgo(30),
  title: 'Debut Single',
  description: 'My first release on the catalogue platform',
  mediaIPFSHash: mockMediaHash(1),
  artists: 'Artist 1',
  duration: 240,
  coverImageIPFSHash: mockCoverHash(1),
  status: 'published',
  metadataURI: mockMetadataHash(1),
  zoraNFT: 'base:0xZoraContract0001/1',
  tokenId: '1',
  approvals: [createApproval(1, daysAgo(30))],
  multisigAddress: '0xMultisig001XXXXXXXXXXXXXXXXXXXXXXXXXXX',
  approvalThreshold: 1,
  approvalRequirementsMet: true,
  approvedAt: daysAgo(29),
};

/**
 * Release 2: Two-of-three multisig (2-of-3)
 * - Two approvals, threshold of 3
 * - Shows partial multisig approval
 */
const publishedRelease2: PublishedRelease = {
  id: 'PDA-002',
  createdBy: '0xUser002XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  createdAt: daysAgo(25),
  title: 'Ambient Vibes',
  description: 'Relaxing electronic soundscape for deep focus',
  mediaIPFSHash: mockMediaHash(2),
  artists: 'Artist 2',
  duration: 420,
  coverImageIPFSHash: mockCoverHash(2),
  status: 'published',
  metadataURI: mockMetadataHash(2),
  zoraNFT: 'base:0xZoraContract0002/2',
  tokenId: '2',
  approvals: [createApproval(1, daysAgo(25)), createApproval(2, daysAgo(25))],
  multisigAddress: '0xMultisig002XXXXXXXXXXXXXXXXXXXXXXXXXXX',
  approvalThreshold: 3,
  approvalRequirementsMet: false, // 2 of 3, not all met yet but still published
  approvedAt: daysAgo(24),
};

/**
 * Release 3: Three-of-three multisig (3-of-3)
 * - All three approvals present
 * - Full multisig requirement met
 */
const publishedRelease3: PublishedRelease = {
  id: 'PDA-003',
  createdBy: '0xUser003XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  createdAt: daysAgo(20),
  title: 'Hip Hop Cipher',
  description: 'Collaborative hip hop track with friends',
  mediaIPFSHash: mockMediaHash(3),
  artists: 'Artist 3',
  duration: 180,
  coverImageIPFSHash: mockCoverHash(3),
  status: 'published',
  metadataURI: mockMetadataHash(3),
  zoraNFT: 'base:0xZoraContract0003/3',
  tokenId: '3',
  approvals: [
    createApproval(1, daysAgo(20)),
    createApproval(2, daysAgo(20)),
    createApproval(3, daysAgo(20)),
  ],
  multisigAddress: '0xMultisig003XXXXXXXXXXXXXXXXXXXXXXXXXXX',
  approvalThreshold: 3,
  approvalRequirementsMet: true,
  approvedAt: daysAgo(19),
};

/**
 * Release 4: Another single curator release
 * - Different creator than Release 1
 * - Tests filtering by creator
 */
const publishedRelease4: PublishedRelease = {
  id: 'PDA-004',
  createdBy: '0xUser004XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  createdAt: daysAgo(15),
  title: 'Lo-Fi Study Beats',
  description: 'Chill beats perfect for studying or working',
  mediaIPFSHash: mockMediaHash(4),
  artists: 'Artist 4',
  duration: 600,
  coverImageIPFSHash: mockCoverHash(4),
  status: 'published',
  metadataURI: mockMetadataHash(4),
  zoraNFT: 'base:0xZoraContract0004/4',
  tokenId: '4',
  approvals: [createApproval(1, daysAgo(15))],
  multisigAddress: '0xMultisig004XXXXXXXXXXXXXXXXXXXXXXXXXXX',
  approvalThreshold: 1,
  approvalRequirementsMet: true,
  approvedAt: daysAgo(14),
};

/**
 * Release 5: Two-of-two multisig (2-of-2)
 * - Shows different threshold count (2 instead of 3)
 * - Tests flexibility in multisig thresholds
 */
const publishedRelease5: PublishedRelease = {
  id: 'PDA-005',
  createdBy: '0xUser005XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  createdAt: daysAgo(10),
  title: 'Jazz Improvisation',
  description: 'Live jazz session improvisation recorded in studio',
  mediaIPFSHash: mockMediaHash(5),
  artists: 'Artist 5',
  duration: 480,
  coverImageIPFSHash: mockCoverHash(5),
  status: 'published',
  metadataURI: mockMetadataHash(5),
  zoraNFT: 'base:0xZoraContract0005/5',
  tokenId: '5',
  approvals: [createApproval(1, daysAgo(10)), createApproval(2, daysAgo(10))],
  multisigAddress: '0xMultisig005XXXXXXXXXXXXXXXXXXXXXXXXXXX',
  approvalThreshold: 2,
  approvalRequirementsMet: true,
  approvedAt: daysAgo(9),
};

// ============================================================================
// SECTION 2: APPROVED RELEASES - PENDING PUBLICATION (3 total)
// ============================================================================

/**
 * Pending Release 1: Missing one approval (1 of 3)
 * - One approval received
 * - Two more needed before publishing
 * - Ready to be approved further
 */
const pendingRelease1: ApprovedRelease = {
  id: 'PDA-006',
  createdBy: '0xUser006XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  createdAt: daysAgo(5),
  title: 'Techno Exploration',
  description: 'Deep techno exploration with experimental sounds',
  mediaIPFSHash: mockMediaHash(6),
  artists: 'Artist 6',
  duration: 540,
  coverImageIPFSHash: mockCoverHash(6),
  status: 'approved',
  metadataURI: mockMetadataHash(6),
  zoraNFT: 'base:0xZoraContract0006/6',
  tokenId: '6',
  approvals: [createApproval(1, daysAgo(5))],
  multisigAddress: '0xMultisig006XXXXXXXXXXXXXXXXXXXXXXXXXXX',
  approvalThreshold: 3,
  approvalRequirementsMet: false,
  approvedAt: daysAgo(5),
};

/**
 * Pending Release 2: Missing final approval (2 of 3)
 * - Two approvals received
 * - One more needed before publishing
 * - Almost ready to publish
 */
const pendingRelease2: ApprovedRelease = {
  id: 'PDA-007',
  createdBy: '0xUser007XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  createdAt: daysAgo(3),
  title: 'Synthwave Dreams',
  description: 'Synthwave inspired track with retro aesthetic',
  mediaIPFSHash: mockMediaHash(7),
  artists: 'Artist 7',
  duration: 320,
  coverImageIPFSHash: mockCoverHash(7),
  status: 'approved',
  metadataURI: mockMetadataHash(7),
  zoraNFT: 'base:0xZoraContract0007/7',
  tokenId: '7',
  approvals: [createApproval(1, daysAgo(3)), createApproval(2, daysAgo(3))],
  multisigAddress: '0xMultisig007XXXXXXXXXXXXXXXXXXXXXXXXXXX',
  approvalThreshold: 3,
  approvalRequirementsMet: false,
  approvedAt: daysAgo(3),
};

/**
 * Pending Release 3: All approvals received (3 of 3)
 * - All three approvals received
 * - Ready to be published immediately
 * - Ideal test case for threshold reached scenario
 */
const pendingRelease3: ApprovedRelease = {
  id: 'PDA-008',
  createdBy: '0xUser008XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  createdAt: daysAgo(1),
  title: 'Indie Folk Stories',
  description: 'Indie folk with storytelling lyrics and acoustic guitar',
  mediaIPFSHash: mockMediaHash(8),
  artists: 'Artist 8',
  duration: 280,
  coverImageIPFSHash: mockCoverHash(8),
  status: 'approved',
  metadataURI: mockMetadataHash(8),
  zoraNFT: 'base:0xZoraContract0008/8',
  tokenId: '8',
  approvals: [
    createApproval(1, daysAgo(1)),
    createApproval(2, daysAgo(1)),
    createApproval(3, daysAgo(1)),
  ],
  multisigAddress: '0xMultisig008XXXXXXXXXXXXXXXXXXXXXXXXXXX',
  approvalThreshold: 3,
  approvalRequirementsMet: true,
  approvedAt: daysAgo(1),
};

// ============================================================================
// EXPORTS: Use as module exports
// ============================================================================

/**
 * Published releases ready for display
 * Test scenarios:
 * - Single curator approval
 * - Multiple multisig scenarios (1-of-1, 2-of-3, 3-of-3, 2-of-2)
 * - Different creators (for filtering tests)
 * - Varied durations and timestamps
 */
export const MOCK_PUBLISHED_RELEASES: PublishedRelease[] = [
  publishedRelease1,
  publishedRelease2,
  publishedRelease3,
  publishedRelease4,
  publishedRelease5,
];

/**
 * Approved releases awaiting publication
 * Test scenarios:
 * - Various approval progress (1-of-3, 2-of-3, 3-of-3)
 * - Different multisig addresses
 * - Ready for curator approval flow testing
 */
export const MOCK_PENDING_APPROVALS: ApprovedRelease[] = [
  pendingRelease1,
  pendingRelease2,
  pendingRelease3,
];

/**
 * Combined fixtures for comprehensive testing
 * Useful for testing both published and pending flows
 */
export const MOCK_ALL_RELEASES = [
  ...MOCK_PUBLISHED_RELEASES,
  ...MOCK_PENDING_APPROVALS,
];

// ============================================================================
// NOTES FOR FUTURE EXPANSION
// ============================================================================

/**
 * When adding more fixtures:
 * 1. Keep PDA IDs sequential (PDA-001, PDA-002, etc.)
 * 2. Use unique creator addresses for filtering tests
 * 3. Vary IPFS hashes (use mockMediaHash/mockCoverHash helpers)
 * 4. Include different multisig thresholds for realism
 * 5. Stagger timestamps for realistic data
 * 6. Always include all required fields from types.ts
 * 7. Use placeholder artist names (Artist 1, Artist 2, etc.)
 *
 * Phase 3+ Expansion:
 * - Add fixtures for error scenarios
 * - Add fixtures for edge cases (min/max duration, etc.)
 * - Consider factory functions for dynamic fixture generation
 */

