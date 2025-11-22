/**
 * GET /api/releases/single?ensName=soma012.scenedex.eth
 * 
 * Fetches a single release's metadata from ENS by name
 */

import { NextRequest, NextResponse } from 'next/server';
import { queryScenedexRelease } from '@/lib/services/query-ens';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ensName = searchParams.get('ensName');

  if (!ensName) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'ensName query parameter is required' 
      },
      { status: 400 }
    );
  }

  try {
    console.log(`\n📖 Fetching release metadata for: ${ensName}`);
    
    // Query ENS for this specific release
    const releaseData = await queryScenedexRelease(ensName);
    
    // Check if the release exists and has data
    if (!releaseData.resolver) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Release not found - no ENS resolver configured' 
        },
        { status: 404 }
      );
    }

    if (!releaseData.scenedex.zoraCoinAddress) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Release not published yet - missing Zora coin data' 
        },
        { status: 404 }
      );
    }

    console.log(`   ✅ Found: ${releaseData.scenedex.releaseId || ensName}`);

    return NextResponse.json(
      {
        success: true,
        release: releaseData,
      },
      {
        headers: {
          'Cache-Control': 's-maxage=300, stale-while-revalidate',
        },
      }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`\n❌ Error fetching release ${ensName}:`, errorMsg, '\n');
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMsg 
      },
      { status: 500 }
    );
  }
}

