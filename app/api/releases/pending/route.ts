/**
 * GET /api/releases/pending
 * 
 * Fetches pending releases awaiting curator approval
 */

import { NextResponse } from 'next/server';
import { query as dbQuery } from '@/lib/db/database';
import { getApprovalThreshold, getSafeAddress } from '@/lib/services/safe';

export async function GET() {
  try {
    console.log('📋 Fetching pending releases from database...');

    const result = await dbQuery(
      `SELECT 
        r.id, 
        r.title, 
        r.description,
        r.artists, 
        r.createdBy, 
        r.createdAt, 
        r.status
       FROM releases r
       WHERE r.status = 'pending' AND r.rejectionReason IS NULL
       ORDER BY r.createdAt DESC`,
      []
    );

    // Get Safe address and threshold
    let threshold = 1;
    try {
      const safeResult = await dbQuery(`SELECT safe_address FROM curator_settings LIMIT 1`);
      if (safeResult.rows.length > 0) {
        const safeAddress = safeResult.rows[0].safe_address;
        threshold = await getApprovalThreshold(safeAddress);
      }
    } catch (err) {
      console.warn('Could not get threshold, defaulting to 1');
    }

    // Get approval counts for all pending releases
    const releaseIds = result.rows.map((row: any) => row.id);
    const approvalCounts: Record<string, number> = {};
    
    if (releaseIds.length > 0) {
      try {
        const approvalsResult = await dbQuery(
          `SELECT "releaseId", COUNT(*) as count 
           FROM approvals 
           WHERE "releaseId" = ANY($1::text[])
           GROUP BY "releaseId"`,
          [releaseIds]
        );
        
        for (const row of approvalsResult.rows) {
          approvalCounts[row.releaseId || row.releaseid] = parseInt(row.count);
        }
      } catch (err) {
        console.warn('Could not get approval counts:', err);
      }
    }

    const releases = result.rows.map((row: any) => {
      const releaseId = row.id;
      const approvalCount = approvalCounts[releaseId] || 0;
      const thresholdMet = approvalCount >= threshold;
      
      return {
        id: releaseId,
        artist: row.artists || 'Unknown',
        title: row.title,
        description: row.description,
        status: row.status.toUpperCase(),
        createdBy: row.createdby || row.createdBy,
        createdAt: row.createdat || row.createdAt,
        approvalCount,
        threshold,
        thresholdMet,
      };
    });

    console.log(`✅ Found ${releases.length} pending releases`);

    return NextResponse.json({
      success: true,
      count: releases.length,
      releases,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error fetching pending releases:', errorMsg);
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMsg,
        releases: [],
      },
      { status: 500 }
    );
  }
}

