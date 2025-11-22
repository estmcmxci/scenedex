/**
 * CRUD Service for Releases
 * Handles all database operations for release records
 * 
 * IMPORTANT: All timestamps in database are Unix seconds
 * Frontend uses milliseconds - conversion happens at boundaries
 * 
 * ERROR HANDLING: All functions return Result<T> = {success, data} or {success, error}
 * This allows callers to handle errors explicitly without try-catch
 */

import { query, getOne, getAll } from './database';
import type { Release, ApprovedRelease, PublishedRelease, Approval } from '../types';
import { ReleaseSchema } from '../validation';

// ============================================================================
// RESULT TYPE - For error handling
// ============================================================================

export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ============================================================================
// VALIDATION HELPER
// ============================================================================

function validateReleaseInput(data: any): Result<any> {
  try {
    const validation = ReleaseSchema.safeParse(data);
    if (!validation.success) {
      const errorMessages = validation.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      return { success: false, error: `Validation failed: ${errorMessages}` };
    }
    return { success: true, data: validation.data };
  } catch (err) {
    return { success: false, error: `Validation error: ${err instanceof Error ? err.message : 'Unknown error'}` };
  }
}

// ============================================================================
// HELPER: Convert timestamps between frontend (ms) and database (seconds)
// ============================================================================

function toDbTimestamp(ms: number): number {
  return Math.floor(ms / 1000);
}

function toFrontendTimestamp(seconds: number): number {
  return seconds * 1000;
}

// ============================================================================
// HELPER: Transform database row (lowercase columns) to TypeScript format (camelCase)
// ============================================================================

function transformDatabaseRow(row: any): Release {
  if (!row) return null as any;

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    artists: row.artists,
    createdBy: row.createdby,
    createdAt: toFrontendTimestamp(row.createdat),
    status: row.status,
    mediaIPFSHash: row.mediaipfshash,
    coverImageIPFSHash: row.coverimageipfshash,
    duration: row.duration,
    metadataURI: row.metadatauri,
    multisigAddress: row.multisigaddress,
    approvalThreshold: row.approvalthreshold,
    approvalRequirementsMet: row.approvalrequirementsmet,
    approvedAt: row.approvedat ? toFrontendTimestamp(row.approvedat) : undefined,
    rejectionReason: row.rejectionreason,
    zoraNFT: row.zoranft,
    tokenId: row.tokenid,
    ensSubname: row.enssubname,
    temp_file_path: row.temp_file_path,
  };
}

// ============================================================================
// CREATE: Insert a new release
// ============================================================================

export async function createRelease(data: {
  id: string;
  title: string;
  description?: string;
  artists?: string;
  createdBy: string;
  createdAt: number; // Frontend ms
  status: 'pending' | 'approved' | 'published';
  mediaIPFSHash?: string;
  duration?: number;
  temp_file_path?: string;
}): Promise<Result<Release>> {
  try {
    // Validate input data
    const validation = validateReleaseInput(data);
    if (!validation.success) {
      console.warn('Create release validation failed:', validation.error);
      return validation;
    }

    console.log(`📝 Creating release: ${data.id}`);
    
    const result = await query(
      `INSERT INTO releases 
        (id, title, description, artists, createdBy, createdAt, status, mediaIPFSHash, duration, temp_file_path)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        data.id,
        data.title,
        data.description || null,
        data.artists || null,
        data.createdBy,
        toDbTimestamp(data.createdAt),
        data.status,
        data.mediaIPFSHash || null,
        data.duration || null,
        data.temp_file_path || null,
      ]
    );

    const release = transformDatabaseRow(result.rows[0]);
    console.log(`✅ Release created: ${data.id}`);
    
    return {
      success: true,
      data: release,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`❌ Failed to create release ${data.id}:`, errorMsg);
    return { success: false, error: `Failed to create release: ${errorMsg}` };
  }
}

// ============================================================================
// READ: Get release by ID
// ============================================================================

export async function getReleaseById(id: string): Promise<Result<Release | null>> {
  try {
    if (!id || typeof id !== 'string') {
      return { success: false, error: 'Invalid release ID' };
    }

    console.log(`🔍 Fetching release: ${id}`);
    
    const result = await getOne(
      'SELECT * FROM releases WHERE id = $1',
      [id]
    );

    if (!result) {
      console.log(`ℹ️  Release not found: ${id}`);
      return { success: true, data: null };
    }

    console.log(`✅ Release found: ${id}`);

    return {
      success: true,
      data: transformDatabaseRow(result),
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`❌ Failed to fetch release ${id}:`, errorMsg);
    return { success: false, error: `Failed to fetch release: ${errorMsg}` };
  }
}

// ============================================================================
// READ: Get all releases with optional filters
// ============================================================================

export async function getAllReleases(filters?: {
  status?: 'pending' | 'approved' | 'published';
  createdBy?: string;
  limit?: number;
  offset?: number;
}): Promise<Result<Release[]>> {
  try {
    console.log(`📚 Fetching releases with filters:`, filters);

    let sql = 'SELECT * FROM releases WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.status) {
      sql += ` AND status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    if (filters?.createdBy) {
      sql += ` AND createdBy = $${paramCount}`;
      params.push(filters.createdBy);
      paramCount++;
    }

    sql += ' ORDER BY createdAt DESC';

    if (filters?.limit) {
      sql += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
      paramCount++;
    }

    if (filters?.offset) {
      sql += ` OFFSET $${paramCount}`;
      params.push(filters.offset);
    }

    const results = await getAll(sql, params);
    console.log(`✅ Found ${results.length} releases`);

    return {
      success: true,
      data: results.map((row) => transformDatabaseRow(row)),
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`❌ Failed to fetch releases:`, errorMsg);
    return { success: false, error: `Failed to fetch releases: ${errorMsg}` };
  }
}

// ============================================================================
// UPDATE: Change release status
// ============================================================================

export async function updateReleaseStatus(
  id: string,
  status: 'pending' | 'approved' | 'published',
  data?: {
    approvalThreshold?: number;
    approvalRequirementsMet?: boolean;
    multisigAddress?: string;
    rejectionReason?: string;
  }
): Promise<Result<Release>> {
  try {
    if (!id || !status) {
      return { success: false, error: 'Release ID and status are required' };
    }

    console.log(`📝 Updating release ${id} status to ${status}`);

    const updates: string[] = ['status = $1'];
    const params: any[] = [status];
    let paramCount = 2;

    if (data?.approvalThreshold !== undefined) {
      updates.push(`approvalThreshold = $${paramCount}`);
      params.push(data.approvalThreshold);
      paramCount++;
    }

    if (data?.approvalRequirementsMet !== undefined) {
      updates.push(`approvalRequirementsMet = $${paramCount}`);
      params.push(data.approvalRequirementsMet);
      paramCount++;
    }

    if (data?.multisigAddress !== undefined) {
      updates.push(`multisigAddress = $${paramCount}`);
      params.push(data.multisigAddress);
      paramCount++;
    }

    if (data?.rejectionReason !== undefined) {
      updates.push(`rejectionReason = $${paramCount}`);
      params.push(data.rejectionReason);
      paramCount++;
    }

    if (status === 'approved') {
      updates.push(`approvedAt = $${paramCount}`);
      params.push(toDbTimestamp(Date.now()));
      paramCount++;
    }

    updates.push(`updatedAt = $${paramCount}`);
    params.push(toDbTimestamp(Date.now()));
    paramCount++;

    params.push(id); // for WHERE clause

    const result = await query(
      `UPDATE releases SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      params
    );

    if (!result.rows[0]) {
      return { success: false, error: `Release ${id} not found` };
    }

    console.log(`✅ Release ${id} status updated to ${status}`);

    return {
      success: true,
      data: transformDatabaseRow(result.rows[0]),
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`❌ Failed to update release ${id}:`, errorMsg);
    return { success: false, error: `Failed to update release: ${errorMsg}` };
  }
}

// ============================================================================
// UPDATE: Add IPFS hashes (after pinning)
// ============================================================================

export async function updateReleaseWithIPFSHashes(
  id: string,
  data: {
    mediaIPFSHash: string;
    coverImageIPFSHash?: string;
    metadataURI: string;
  }
): Promise<Result<Release>> {
  try {
    if (!id || !data.mediaIPFSHash || !data.metadataURI) {
      return { success: false, error: 'Release ID, mediaIPFSHash, and metadataURI are required' };
    }

    console.log(`📌 Pinning IPFS hashes for release ${id}`);

    const result = await query(
      `UPDATE releases 
       SET mediaIPFSHash = $1, coverImageIPFSHash = $2, metadataURI = $3, temp_file_path = NULL, updatedAt = $4
       WHERE id = $5
       RETURNING *`,
      [
        data.mediaIPFSHash,
        data.coverImageIPFSHash || null,
        data.metadataURI,
        toDbTimestamp(Date.now()),
        id,
      ]
    );

    if (!result.rows[0]) {
      return { success: false, error: `Release ${id} not found` };
    }

    console.log(`✅ IPFS hashes added for release ${id}`);

    return {
      success: true,
      data: transformDatabaseRow(result.rows[0]),
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`❌ Failed to add IPFS hashes for release ${id}:`, errorMsg);
    return { success: false, error: `Failed to add IPFS hashes: ${errorMsg}` };
  }
}

// ============================================================================
// UPDATE: Add NFT details (after Zora minting)
// ============================================================================

export async function updateReleaseWithNFT(
  id: string,
  data: {
    zoraNFT: string;
    tokenId: string;
  }
): Promise<Result<Release>> {
  try {
    if (!id || !data.zoraNFT || !data.tokenId) {
      return { success: false, error: 'Release ID, zoraNFT, and tokenId are required' };
    }

    console.log(`🎨 Adding NFT details for release ${id}`);

    const result = await query(
      `UPDATE releases 
       SET zoraNFT = $1, tokenId = $2, updatedAt = $3
       WHERE id = $4
       RETURNING *`,
      [
        data.zoraNFT,
        data.tokenId,
        toDbTimestamp(Date.now()),
        id,
      ]
    );

    if (!result.rows[0]) {
      return { success: false, error: `Release ${id} not found` };
    }

    console.log(`✅ NFT details added for release ${id}`);

    return {
      success: true,
      data: transformDatabaseRow(result.rows[0]),
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`❌ Failed to add NFT details for release ${id}:`, errorMsg);
    return { success: false, error: `Failed to add NFT details: ${errorMsg}` };
  }
}

// ============================================================================
// UPDATE: Add ENS subname
// ============================================================================

export async function updateReleaseWithENS(
  id: string,
  ensSubname: string
): Promise<Result<Release>> {
  try {
    if (!id || !ensSubname) {
      return { success: false, error: 'Release ID and ENS subname are required' };
    }

    console.log(`📛 Adding ENS subname for release ${id}`);

    const result = await query(
      `UPDATE releases 
       SET ensSubname = $1, updatedAt = $2
       WHERE id = $3
       RETURNING *`,
      [
        ensSubname,
        toDbTimestamp(Date.now()),
        id,
      ]
    );

    if (!result.rows[0]) {
      return { success: false, error: `Release ${id} not found` };
    }

    console.log(`✅ ENS subname added for release ${id}`);

    return {
      success: true,
      data: transformDatabaseRow(result.rows[0]),
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`❌ Failed to add ENS subname for release ${id}:`, errorMsg);
    return { success: false, error: `Failed to add ENS subname: ${errorMsg}` };
  }
}

// ============================================================================
// DELETE: Remove a release (for cleanup, not typical use)
// ============================================================================

export async function deleteRelease(id: string): Promise<Result<Release>> {
  try {
    if (!id) {
      return { success: false, error: 'Release ID is required' };
    }

    console.log(`🗑️  Deleting release ${id}`);

    const result = await query(
      'DELETE FROM releases WHERE id = $1 RETURNING *',
      [id]
    );

    if (!result.rows[0]) {
      return { success: false, error: `Release ${id} not found` };
    }

    console.log(`✅ Release ${id} deleted`);

    return {
      success: true,
      data: transformDatabaseRow(result.rows[0]),
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`❌ Failed to delete release ${id}:`, errorMsg);
    return { success: false, error: `Failed to delete release: ${errorMsg}` };
  }
}

