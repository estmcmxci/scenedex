/**
 * GET /api/releases/pending
 * 
 * Fetches pending releases awaiting curator approval
 */

import { NextResponse } from 'next/server';
import { query as dbQuery } from '@/lib/db/database';

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

    const releases = result.rows.map((row: any) => ({
      id: row.id,
      artist: row.artists || 'Unknown',
      title: row.title,
      description: row.description,
      status: row.status.toUpperCase(),
      createdBy: row.createdby || row.createdBy,
      createdAt: row.createdat || row.createdAt,
    }));

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

