/**
 * GET /api/preview/cover?releaseId=PDA-001
 * 
 * Returns the cover art from temp_files for curator preview
 * 
 * Response:
 * - Content-Type: image/jpeg or image/png
 * - Body: Cover art image buffer
 */

import { NextRequest, NextResponse } from 'next/server';
import { query as dbQuery } from '@/lib/db/database';

export async function GET(request: NextRequest) {
  try {
    const releaseId = request.nextUrl.searchParams.get('releaseId');

    if (!releaseId) {
      return NextResponse.json(
        { success: false, error: 'Missing releaseId query parameter' },
        { status: 400 }
      );
    }

    console.log(`🖼️ Fetching preview cover for: ${releaseId}`);

    // Fetch cover data from temp_files
    const result = await dbQuery(
      `SELECT cover_data FROM temp_files WHERE releaseId = $1`,
      [releaseId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Release not found' },
        { status: 404 }
      );
    }

    const coverData = result.rows[0].cover_data;

    if (!coverData) {
      return NextResponse.json(
        { success: false, error: 'No cover art available' },
        { status: 404 }
      );
    }

    // Return as image (assume JPEG, adjust as needed)
    return new NextResponse(coverData, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': coverData.length.toString(),
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Preview cover error:', errorMsg);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

