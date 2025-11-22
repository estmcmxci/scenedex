/**
 * Validation schemas for Catalogue Release data model
 *
 * IMPORTANT: types.ts is the source of truth for data shapes
 * These schemas validate that data conforms to the types
 * DO NOT infer types from these schemas - always import types from types.ts
 *
 * Strictness Level: MODERATE
 * - Flexible enough for quick iteration
 * - Useful constraints without being annoying
 * - Error messages are user-friendly defaults
 */

import { z } from 'zod';
import type { ReleaseSubmissionInput, Release, IPFSMetadata } from './types';

// ============================================================================
// SCHEMA 1: ReleaseSubmissionSchema (Form Input Validation)
// ============================================================================

export const ReleaseSubmissionSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),

  description: z
    .string()
    .max(2000, 'Description must be 2000 characters or less'),

  mediaFile: z
    .string()
    .min(1, 'File is required')
    .refine(
      (data) => data.startsWith('data:'),
      'File must be base64 encoded'
    ),

  artists: z
    .string()
    .max(200, 'Artists must be 200 characters or less')
    .optional(),
});

// Export type for use in components
// Note: Type definition lives in types.ts, this is just validation
// DO NOT use: export type ReleaseSubmissionInput = z.infer<typeof ReleaseSubmissionSchema>;

// ============================================================================
// SCHEMA 1.5: ApprovalSchema (Multisig co-signer approvals)
// ============================================================================

export const ApprovalSchema = z.object({
  signer: z
    .string()
    .min(1, 'Signer address required')
    // TODO: Add Ethereum address validation (0x + 40 hex chars) in Phase 3 backend
    ,

  signature: z
    .string()
    .regex(/^0x[a-fA-F0-9]{130}$/, 'Invalid EIP-191 signature (must be 0x + 130 hex chars)'),
    // Standard Ethereum signature format: 65 bytes = 130 hex characters

  timestamp: z
    .number()
    .int('Timestamp must be integer')
    .positive('Timestamp must be positive'),
});

// ============================================================================
// SCHEMA 2: ReleaseSchema (Stored Release Validation)
// ============================================================================

export const ReleaseSchema = z.object({
  // Ownership proof (immutable)
  id: z
    .string()
    .min(1, 'Release ID is required')
    // TODO: Add format validation for PDA-XXX in Phase 3 backend
    // Pattern: PDA-\d{3,} (PDA followed by 3+ digits)
    ,

  createdBy: z
    .string()
    .min(1, 'Creator address required')
    // TODO: Add Ethereum address validation (0x + 40 hex chars) in Phase 3 backend
    // Use: regex /^0x[a-fA-F0-9]{40}$/ for basic check, checksum validation on backend
    ,

  createdAt: z
    .number()
    .int('Timestamp must be an integer')
    .positive('Timestamp must be positive'),

  // From submission
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),

  description: z
    .string()
    .max(2000, 'Description must be 2000 characters or less')
    .optional(),

  mediaIPFSHash: z
    .string()
    .min(1, 'Media IPFS hash required')
    // Note: Format validation deferred to backend (supports ipfs://, ar://, walrus:// etc)
    ,

  artists: z
    .string()
    .max(200, 'Artists must be 200 characters or less')
    .optional(),

  duration: z
    .number()
    .positive('Duration must be positive')
    .int('Duration must be in whole seconds'),

  coverImageIPFSHash: z
    .string()
    .optional(),
    // Note: Format validation deferred to backend

  // Lifecycle state
  status: z
    .enum(['pending', 'approved', 'published'])
    .default('pending'),

  // Note: Approval details moved to ApprovedReleaseSchema
  // (approvals array replaces approvedBy for multisig support)
  rejectionReason: z
    .string()
    .optional(),

  // After IPFS metadata creation
  metadataURI: z
    .string()
    .optional()
    // Note: Supports ipfs://, ar://, walrus:// and other decentralized storage
    // Format validation deferred to backend
    ,

  // After Zora NFT mint (Base L2)
  zoraNFT: z
    .string()
    .optional()
    // Format: base:0xContractAddress/tokenId
    ,

  tokenId: z
    .string()
    .optional(),

  // After ENS registration (L1)
  ensSubname: z
    .string()
    .optional(),
});

// ============================================================================
// SCHEMA 2.5: ApprovedReleaseSchema (Approved Release with Multisig)
// ============================================================================

export const ApprovedReleaseSchema = ReleaseSchema.extend({
  status: z.literal('approved'),
  
  approvals: z
    .array(ApprovalSchema)
    .min(1, 'At least one approval required'),
  
  multisigAddress: z
    .string()
    .min(1, 'Multisig address required')
    // TODO: Add Safe contract address validation in Phase 3 backend
    ,
  
  approvalThreshold: z
    .number()
    .int('Threshold must be integer')
    .min(1, 'Threshold must be at least 1')
    .max(7, 'Threshold cannot exceed 7'),
  
  approvalRequirementsMet: z
    .boolean()
    // true if approvals.length >= approvalThreshold
    ,
  
  approvedAt: z
    .number()
    .int('Timestamp must be integer')
    .positive('Timestamp must be positive'),
});

// ============================================================================
// SCHEMA 3: IPFSMetadataSchema (IPFS Upload Validation)
// ============================================================================

export const IPFSMetadataSchema = z.object({
  // ERC721 Standard (required by Zora)
  name: z
    .string()
    .min(1, 'Name is required'),

  description: z
    .string()
    .min(1, 'Description is required'),

  image: z
    .string()
    .min(1, 'Image URI is required')
    // Supports: ipfs://..., https://... (fallback for broken gateways)
    // Format validation deferred to backend
    ,

  // Zora extensions (optional)
  animation_url: z
    .string()
    .optional()
    // Supports: ipfs://..., ar://..., walrus://... (other decentralized storage)
    // Format validation deferred to backend
    ,

  content: z
    .object({
      mime: z
        .string()
        .min(1, 'MIME type required'),
        // Examples: audio/mpeg, audio/wav, audio/flac, video/mp4
        // Format validation deferred to backend

      uri: z
        .string()
        .min(1, 'Content URI required'),
        // Supports: ipfs://..., ar://..., walrus://... (other decentralized storage)
        // Format validation deferred to backend
    })
    .optional(),

  external_url: z
    .string()
    .optional(),

  attributes: z
    .array(
      z.object({
        trait_type: z.string(),
        value: z.union([z.string(), z.number()]),
      })
    )
    .optional(),

  // Custom catalogue fields (not extensible beyond these)
  properties: z
    .object({
      catalogueId: z
        .string()
        .min(1, 'Catalogue ID required'),

      catalogueVersion: z
        .number()
        .int('Version must be integer')
        .positive(),

      catalogueUrl: z
        .string()
        .url('Invalid catalogue URL'),

      submittedBy: z
        .string()
        .min(1, 'Submitted by address required')
        // TODO: Add Ethereum address validation in Phase 3 backend
        ,

      submittedAt: z
        .number()
        .int('Timestamp must be integer')
        .positive(),

      approvals: z
        .array(ApprovalSchema)
        .min(1, 'At least one approval required'),

      approvalThreshold: z
        .number()
        .int('Threshold must be integer')
        .min(1)
        .max(7),

      multisigAddress: z
        .string()
        .min(1, 'Multisig address required'),

      duration: z
        .number()
        .positive('Duration must be positive')
        .int('Duration must be in whole seconds'),

      artists: z
        .string()
        .optional(),
    })
    // Do NOT allow additional fields beyond what's defined above
    .strict('Only documented properties are allowed'),
});

// ============================================================================
// UTILITY: Type Guard Functions (Optional, for runtime type checking)
// ============================================================================

/**
 * Type guard to check if a Release is in 'pending' state
 * Safe to access: id, title, description, media, status
 * NOT safe to access: approvedBy, approvedAt, zoraNFT, metadataURI
 */
export function isPendingRelease(
  release: Release
): release is Release & { status: 'pending' } {
  return release.status === 'pending';
}

/**
 * Type guard to check if a Release is in 'approved' state
 * Safe to access: all pending fields + approvals, multisigAddress, approvalThreshold, approvedAt
 * NOT safe to access: metadataURI, zoraNFT, tokenId
 */
export function isApprovedRelease(release: unknown): release is import('./types').ApprovedRelease {
  const r = release as any;
  return (
    r.status === 'approved' &&
    Array.isArray(r.approvals) &&
    r.approvals.length > 0 &&
    typeof r.multisigAddress === 'string' &&
    typeof r.approvalThreshold === 'number' &&
    typeof r.approvedAt === 'number'
  );
}

/**
 * Type guard to check if a Release is in 'published' state
 * Safe to access: all fields (guaranteed to exist)
 */
export function isPublishedRelease(release: unknown): release is import('./types').PublishedRelease {
  const r = release as any;
  return (
    r.status === 'published' &&
    !!r.metadataURI &&
    !!r.zoraNFT &&
    !!r.tokenId &&
    Array.isArray(r.approvals) &&
    r.approvals.length > 0 &&
    typeof r.multisigAddress === 'string' &&
    typeof r.approvalThreshold === 'number' &&
    typeof r.approvedAt === 'number'
  );
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate ReleaseSubmissionInput (form data)
 * Returns: { success: true, data } or { success: false, error }
 */
export function validateReleaseSubmission(input: unknown) {
  return ReleaseSubmissionSchema.safeParse(input);
}

/**
 * Validate Release object (stored data)
 * Returns: { success: true, data } or { success: false, error }
 */
export function validateRelease(input: unknown) {
  return ReleaseSchema.safeParse(input);
}

/**
 * Validate IPFSMetadata (before uploading to IPFS)
 * Returns: { success: true, data } or { success: false, error }
 */
export function validateIPFSMetadata(input: unknown) {
  return IPFSMetadataSchema.safeParse(input);
}

