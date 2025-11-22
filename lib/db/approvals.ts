/**
 * CRUD Service for Approvals
 * Handles all database operations for multisig approval records
 * 
 * IMPORTANT: All timestamps in database are Unix seconds
 * Frontend uses milliseconds - conversion happens at boundaries
 * 
 * ERROR HANDLING: All functions return Result<T> = {success, data} or {success, error}
 * This allows callers to handle errors explicitly without try-catch
 */

import { query, getOne, getAll } from './database';
import type { Approval } from '../types';
import { ApprovalSchema } from '../validation';

// ============================================================================
// RESULT TYPE - For error handling
// ============================================================================

export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ============================================================================
// VALIDATION HELPER
// ============================================================================

function validateApprovalInput(data: any): Result<any> {
  try {
    const validation = ApprovalSchema.safeParse(data);
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

function transformDatabaseRow(row: any): Approval {
  if (!row) return null as any;

  return {
    signer: row.signer,
    signature: row.signature,
    timestamp: toFrontendTimestamp(row.timestamp),
  };
}

// ============================================================================
// CREATE: Insert a new approval signature
// ============================================================================

export async function createApproval(data: {
  releaseId: string;
  signer: string;
  signature: string;
  timestamp: number; // Frontend ms
}): Promise<Result<Approval>> {
  try {
    // Validate input data
    const validation = validateApprovalInput(data);
    if (!validation.success) {
      console.warn('Create approval validation failed:', validation.error);
      return validation;
    }

    console.log(`✍️  Creating approval for release ${data.releaseId} by ${data.signer}`);

    const result = await query(
      `INSERT INTO approvals (releaseId, signer, signature, timestamp)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        data.releaseId,
        data.signer,
        data.signature,
        toDbTimestamp(data.timestamp),
      ]
    );

    console.log(`✅ Approval created for ${data.releaseId}`);

    return {
      success: true,
      data: transformDatabaseRow(result.rows[0]),
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`❌ Failed to create approval:`, errorMsg);
    return { success: false, error: `Failed to create approval: ${errorMsg}` };
  }
}

// ============================================================================
// READ: Get all approvals for a release
// ============================================================================

export async function getApprovalsByReleaseId(releaseId: string): Promise<Result<Approval[]>> {
  try {
    if (!releaseId || typeof releaseId !== 'string') {
      return { success: false, error: 'Invalid release ID' };
    }

    console.log(`🔍 Fetching approvals for release ${releaseId}`);

    const results = await getAll(
      'SELECT signer, signature, timestamp FROM approvals WHERE releaseId = $1 ORDER BY timestamp ASC',
      [releaseId]
    );

    console.log(`✅ Found ${results.length} approvals for ${releaseId}`);

    return {
      success: true,
      data: results.map((row) => transformDatabaseRow(row)),
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`❌ Failed to fetch approvals for ${releaseId}:`, errorMsg);
    return { success: false, error: `Failed to fetch approvals: ${errorMsg}` };
  }
}

// ============================================================================
// READ: Count approvals for a release (check if threshold met)
// ============================================================================

export async function countApprovalsForRelease(releaseId: string): Promise<Result<number>> {
  try {
    if (!releaseId || typeof releaseId !== 'string') {
      return { success: false, error: 'Invalid release ID' };
    }

    console.log(`📊 Counting approvals for release ${releaseId}`);

    const result = await getOne(
      'SELECT COUNT(*) as count FROM approvals WHERE releaseId = $1',
      [releaseId]
    );

    const count = parseInt(result?.count, 10) || 0;
    console.log(`✅ Release ${releaseId} has ${count} approvals`);

    return { success: true, data: count };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`❌ Failed to count approvals for ${releaseId}:`, errorMsg);
    return { success: false, error: `Failed to count approvals: ${errorMsg}` };
  }
}

// ============================================================================
// READ: Check if specific curator already approved
// ============================================================================

export async function hasApprovalFromSigner(
  releaseId: string,
  signer: string
): Promise<Result<boolean>> {
  try {
    if (!releaseId || !signer) {
      return { success: false, error: 'Release ID and signer are required' };
    }

    console.log(`🔎 Checking if ${signer} approved ${releaseId}`);

    const result = await getOne(
      'SELECT id FROM approvals WHERE releaseId = $1 AND signer = $2 LIMIT 1',
      [releaseId, signer]
    );

    const hasApproval = !!result;
    console.log(`✅ ${signer} ${hasApproval ? 'has' : 'has not'} approved ${releaseId}`);

    return { success: true, data: hasApproval };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`❌ Failed to check approval:`, errorMsg);
    return { success: false, error: `Failed to check approval: ${errorMsg}` };
  }
}

// ============================================================================
// DELETE: Remove an approval (rarely used, but needed for edge cases)
// ============================================================================

export async function deleteApproval(
  releaseId: string,
  signer: string
): Promise<Result<Approval | null>> {
  try {
    if (!releaseId || !signer) {
      return { success: false, error: 'Release ID and signer are required' };
    }

    console.log(`🗑️  Deleting approval from ${signer} for release ${releaseId}`);

    const result = await query(
      'DELETE FROM approvals WHERE releaseId = $1 AND signer = $2 RETURNING *',
      [releaseId, signer]
    );

    const approval = result.rows[0] ? transformDatabaseRow(result.rows[0]) : null;
    console.log(`✅ Approval deleted for ${releaseId}`);

    return { success: true, data: approval };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`❌ Failed to delete approval:`, errorMsg);
    return { success: false, error: `Failed to delete approval: ${errorMsg}` };
  }
}

// ============================================================================
// DELETE: Remove all approvals for a release (cleanup on rejection)
// ============================================================================

export async function deleteAllApprovalsForRelease(releaseId: string): Promise<Result<number>> {
  try {
    if (!releaseId || typeof releaseId !== 'string') {
      return { success: false, error: 'Invalid release ID' };
    }

    console.log(`🗑️  Deleting all approvals for release ${releaseId}`);

    const result = await query(
      'DELETE FROM approvals WHERE releaseId = $1',
      [releaseId]
    );

    const count = result.rowCount || 0;
    console.log(`✅ Deleted ${count} approvals for ${releaseId}`);

    return { success: true, data: count };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`❌ Failed to delete approvals for ${releaseId}:`, errorMsg);
    return { success: false, error: `Failed to delete approvals: ${errorMsg}` };
  }
}

