/**
 * GET /api/preview/audio?releaseId=PDA-001
 * 
 * Returns the MP3 file from temp_files for curator preview
 * 
 * Response:
 * - Content-Type: audio/mpeg
 * - Body: MP3 file buffer
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

    console.log(`🎵 Fetching preview audio for: ${releaseId}`);

    // Fetch file data from temp_files
    const result = await dbQuery(
      `SELECT file_data FROM temp_files WHERE releaseId = $1`,
      [releaseId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Release not found or no file available' },
        { status: 404 }
      );
    }

    const fileData = result.rows[0].file_data;

    if (!fileData) {
      return NextResponse.json(
        { success: false, error: 'No audio data available' },
        { status: 404 }
      );
    }

    // Return as audio stream
    return new NextResponse(fileData, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': fileData.length.toString(),
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Preview audio error:', errorMsg);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

