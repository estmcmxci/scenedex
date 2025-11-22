/**
 * GET /api/releases/[id]/cover
 * 
 * Fetches cover art from temp_files table for preview
 */

import { NextRequest, NextResponse } from 'next/server';
import { query as dbQuery } from '@/lib/db/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: releaseId } = await params;
    console.log(`🖼️ Fetching cover for release: ${releaseId}`);

    const result = await dbQuery(
      `SELECT cover_data FROM temp_files WHERE releaseId = $1`,
      [releaseId]
    );

    if (result.rows.length === 0 || !result.rows[0].cover_data) {
      return NextResponse.json(
        { success: false, error: 'Cover art not found' },
        { status: 404 }
      );
    }

    const coverData = result.rows[0].cover_data;
    
    console.log(`✅ Cover found: ${(coverData.length / 1024).toFixed(2)} KB`);

    // Return image as binary response
    return new NextResponse(coverData, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': coverData.length.toString(),
      },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error fetching cover:', errorMsg);
    
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
