/**
 * GET /api/releases/[id]/audio
 * 
 * Fetches audio file from temp_files table for preview
 */

import { NextRequest, NextResponse } from 'next/server';
import { query as dbQuery } from '@/lib/db/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: releaseId } = await params;
    console.log(`🎵 Fetching audio for release: ${releaseId}`);

    const result = await dbQuery(
      `SELECT file_data FROM temp_files WHERE releaseId = $1`,
      [releaseId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Audio file not found' },
        { status: 404 }
      );
    }

    const fileData = result.rows[0].file_data;
    
    if (!fileData) {
      return NextResponse.json(
        { success: false, error: 'Audio data is empty' },
        { status: 404 }
      );
    }

    console.log(`✅ Audio found: ${(fileData.length / 1024 / 1024).toFixed(2)} MB`);

    // Return audio as binary response
    return new NextResponse(fileData, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': fileData.length.toString(),
      },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error fetching audio:', errorMsg);
    
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

