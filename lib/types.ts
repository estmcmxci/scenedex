/**
 * Complete type definitions for Catalogue Release data model
 * Serves as single source of truth across all layers:
 * - Frontend state management
 * - Form validation
 * - IPFS metadata
 * - Mock data
 * - API responses
 *
 * OWNERSHIP MODEL:
 * 1. User uploads file via form (mediaFile)
 * 2. Backend pins to IPFS (gets mediaIPFSHash), we custody the pin
 * 3. Backend creates Release with unique ID (PDA-XXX), proof: Release.id + Release.createdBy + Release.createdAt
 * 4. Curator approves the release
 * 5. Backend creates IPFS metadata JSON pointing to user's audio file
 * 6. Catalogue mints NFT on Zora (we're the creator/contract owner on Base)
 * 7. User owns the NFT in their wallet (they are the NFT owner)
 * 8. Ownership chain: User's Wallet → owns NFT → references Metadata → references User's Audio
 * 9. We maintain governance/curation; user has full ownership of their release/NFT
 */

// ============================================================================
// SECTION 1: INPUT TYPES - What users provide via form
// ============================================================================

export type ReleaseSubmissionInput = {
  title: string; // Release title
  description: string; // Release description
  mediaFile: File; // MP3 file, max 10MB. Backend extracts cover image from ID3 tags.
  artists?: string; // Optional: Artist name(s), simple string format
  // Note: Backend auto-generates releaseDate (timestamp), extracts duration from file, validates format
};

// ============================================================================
// SECTION 2: CORE RELEASE TYPE - Complete Release at any state
// ============================================================================

export type Release = {
  // OWNERSHIP PROOF (immutable, set at creation)
  id: string; // Unique identifier (PDA-001, PDA-002, etc.) - User's ownership proof
  createdBy: string; // User's wallet address - Proves who owns this release
  createdAt: number; // Timestamp - Immutable proof of claim time

  // From submission + backend processing
  title: string;
  description: string;
  mediaIPFSHash: string; // IPFS hash we pinned on user's behalf. We custody, they own via Release.id + createdBy.
  artists?: string; // From submission
  duration: number; // Auto-extracted from MP3 file (seconds)
  coverImageIPFSHash?: string; // Auto-extracted from MP3 ID3 tags, pinned to IPFS

  // Lifecycle state
  status: 'pending' | 'approved' | 'published';

  // Approval details (optional, set when approved)
  multisigAddress?: string; // Safe contract address on L1
  approvalThreshold?: number; // How many signatures required (1-7)
  approvalRequirementsMet?: boolean; // true if approvals.length >= approvalThreshold
  approvedAt?: number; // Timestamp when approved

  // Note: Full approval details moved to ApprovedRelease/PublishedRelease types
  // (approvals array replaces approvedBy for multisig support)
  rejectionReason?: string;

  // After IPFS metadata creation
  metadataURI?: string;

  // After Zora NFT mint (Base L2)
  // NFT Creator: Catalogue contract (0x...), NFT Owner: User's wallet
  // User owns the NFT; Catalogue maintains governance/curation
  zoraNFT?: string; // Format: "base:0xZoraContractAddress/tokenId"
  tokenId?: string; // Numeric ID from Zora

  // After ENS registration (L1)
  ensSubname?: string;

  // Temporary storage (Phase 2→3 transition)
  temp_file_path?: string; // Path to temporary file during submission (before IPFS pinning)
};

// ============================================================================
// SECTION 2.5: APPROVAL TYPE - Multisig co-signer approvals (indexed on Release)
// ============================================================================

export type Approval = {
  signer: string; // 0x wallet address of co-signer
  signature: string; // EIP-191 signature (0x + 130 hex chars)
  timestamp: number; // Unix timestamp when signed
  safeTxHash?: string; // Safe transaction hash (for on-chain approvals)
};

// ============================================================================
// SECTION 3: STATE-SPECIFIC TYPES (Intersection types for type guards)
// ============================================================================

export type PendingRelease = Release & {
  status: 'pending';
};

export type ApprovedRelease = Release & {
  status: 'approved';
  approvals: Approval[]; // Indexed multisig co-signer approvals (replaces approvedBy)
  multisigAddress: string; // Safe contract address on L1
  approvalThreshold: number; // How many signatures required (1-7, default 3)
  approvalRequirementsMet: boolean; // true if approvals.length >= approvalThreshold
  approvedAt: number; // Timestamp when threshold reached
};

export type PublishedRelease = Release & {
  status: 'published';
  approvals: Approval[]; // Inherited from ApprovedRelease
  multisigAddress: string; // Inherited from ApprovedRelease
  approvalThreshold: number; // Inherited from ApprovedRelease
  approvalRequirementsMet: boolean; // Inherited from ApprovedRelease
  approvedAt: number; // Inherited from ApprovedRelease
  metadataURI: string;
  zoraNFT: string;
  tokenId: string;
};

// ============================================================================
// SECTION 4: IPFS METADATA TYPE (ERC721 compatible + custom fields)
// ============================================================================

export type IPFSMetadata = {
  // ERC721 Standard (required by Zora)
  name: string;
  description: string;
  image: string; // IPFS URI to cover art

  // Zora/Media extensions (audio/video file - user-owned)
  animation_url?: string; // IPFS URI to audio/video file
  content?: {
    mime: string; // e.g., "audio/mpeg", "audio/wav"
    uri: string; // IPFS URI to user-owned audio file
  };

  // Optional ERC721 fields
  external_url?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;

  // Custom catalogue fields
  properties: {
    catalogueId: string; // PDA-001, etc.
    catalogueVersion: number; // 1
    catalogueUrl: string; // https://catalogue.../release/PDA-001

    submittedBy: string; // User's wallet
    submittedAt: number; // Timestamp
    approvals: Approval[]; // Multisig co-signer approvals (replaces approvedBy for indexing)
    approvalThreshold: number; // How many signatures required
    multisigAddress: string; // Safe contract address on L1

    duration: number; // Seconds, auto-extracted from MP3
    artists?: string; // From submission
  };
};

// ============================================================================
// SECTION 5: ACTION & UTILITY TYPES
// ============================================================================

export type CuratorAction = {
  releaseId: string;
  action: 'approve' | 'reject';
  reason?: string;
};

export type ResolutionResult = {
  source: 'catalogue' | 'ens' | 'ipfs' | 'zora';
  release: Release;
  fallbackUsed: boolean;
};

