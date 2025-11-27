/**
 * GET /api/releases
 * 
 * Dynamically discovers published releases by querying ENS
 * Starts from ARES001 and increments until no more releases found
 * 
 * Features:
 * - ENS as source of truth (no database dependency)
 * - Auto-discovery of new releases
 * - Response caching (5 minute revalidation)
 * - Safety limits (max 50 releases, stops after 3 consecutive failures)
 */

import { NextResponse } from 'next/server';

// Prevent static generation - this route requires runtime ENS queries
export const dynamic = 'force-dynamic';
import { queryScenedexRelease } from '@/lib/services/query-ens';
import { query as dbQuery } from '@/lib/db/database';

// Configuration
// Start from ARES001 - this is where our published releases begin
// In production, you might want to start from 1 or use a database to track the range
const START_NUMBER = parseInt(process.env.ENS_START_NUMBER || '1', 10);
const MAX_RELEASES = 50; // Safety limit
const MAX_CONSECUTIVE_FAILURES = 5; // Stop after 5 missing names in a row (increased for gaps)
const ENS_PREFIX = process.env.ENS_SUBNAME_PREFIX || 'ARES';
const ENS_PARENT = process.env.ENS_DOMAIN || 'scenius.basetest.eth';

// Next.js route segment config - enable caching
export const revalidate = 300; // Revalidate every 5 minutes (300 seconds)

export async function GET() {
  const startTime = Date.now();
  
  try {
    console.log(`\n📖 Discovering releases from ENS (starting at ${ENS_PREFIX}${String(START_NUMBER).padStart(3, '0')}.${ENS_PARENT})`);
    console.log(`   Max releases: ${MAX_RELEASES}`);
    console.log(`   Stop threshold: ${MAX_CONSECUTIVE_FAILURES} consecutive failures\n`);

    const releases = [];
    let consecutiveFailures = 0;
    let queriesCount = 0;

    // Start from ARES001 and increment
    for (let i = START_NUMBER; i < START_NUMBER + MAX_RELEASES; i++) {
      const paddedNumber = String(i).padStart(3, '0'); // 011, 012, 013...
      const ensName = `${ENS_PREFIX}${paddedNumber}.${ENS_PARENT}`.toLowerCase();

      try {
        queriesCount++;
        console.log(`🔍 [${queriesCount}] Querying ${ensName}...`);
        
        // Query ENS for this release
        const releaseData = await queryScenedexRelease(ensName);
        
        // Check if resolver exists - if not, name doesn't exist
        if (!releaseData.resolver) {
          consecutiveFailures++;
          console.log(`   ⏭️  No resolver - Failure ${consecutiveFailures}/${MAX_CONSECUTIVE_FAILURES}`);
          
          // Stop if we hit too many consecutive failures
          if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
            console.log(`\n🛑 Stopping: ${MAX_CONSECUTIVE_FAILURES} consecutive names not found`);
            break;
          }
          continue; // Skip to next iteration
        }
        
        // Check if release has actual data (zoraCoinAddress is required and must not be zero address)
        const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
        const zoraCoinAddress = releaseData.scenedex.zoraCoinAddress;
        if (!zoraCoinAddress || zoraCoinAddress === ZERO_ADDRESS) {
          consecutiveFailures++;
          console.log(`   ⏭️  No Zora coin (not published) - Failure ${consecutiveFailures}/${MAX_CONSECUTIVE_FAILURES}`);
          
          // Stop if we hit too many consecutive failures
          if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
            console.log(`\n🛑 Stopping: ${MAX_CONSECUTIVE_FAILURES} consecutive unpublished names`);
            break;
          }
          continue; // Skip to next iteration
        }
        
        // Name exists AND has data, extract it
        const releaseId = releaseData.scenedex.releaseId || `${ENS_PREFIX}${paddedNumber}`;
        
        // Try to get additional data from database (approvedAt, publisher)
        let approvedAt: number | null = null;
        let publisherAddress: string | null = null;
        try {
          const dbResult = await dbQuery(
            `SELECT approvedat, multisigaddress FROM releases WHERE id = $1`,
            [releaseId]
          );
          if (dbResult.rows.length > 0) {
            const dbRelease = dbResult.rows[0];
            // approvedAt is stored as Unix seconds, convert to milliseconds
            approvedAt = dbRelease.approvedat ? dbRelease.approvedat * 1000 : null;
            publisherAddress = dbRelease.multisigaddress || null;
          }
        } catch (dbError) {
          console.log(`   Could not fetch DB data for ${releaseId}:`, dbError);
        }
        
        const release = {
          ensName: releaseData.ensName,
          releaseId,
          title: releaseData.scenedex.releaseId || ensName,
          artists: releaseData.scenedex.artists,
          description: releaseData.standard.description,
          coverImageIPFSHash: releaseData.standard.avatar?.replace('ipfs://', ''),
          mediaIPFSHash: releaseData.scenedex.mediaIPFS,
          metadataURI: releaseData.scenedex.metadataURI,
          zoraCoinAddress: releaseData.scenedex.zoraCoinAddress,
          zoraCoinSymbol: releaseData.scenedex.zoraCoinSymbol,
          splitAddress: releaseData.scenedex.splitAddress,
          creatorAddress: releaseData.primaryAddress, // Creator/submitter from ENS address record
          approvedAt, // From database (for older releases without metadata)
          publisherAddress, // From database (Safe address)
        };
        
        releases.push(release);
        consecutiveFailures = 0; // Reset failure counter on success
        
        console.log(`   ✅ Found: ${release.releaseId} by ${release.artists || 'Unknown'}`);
        
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        
        // If error indicates name doesn't exist
        if (errorMsg.includes('No resolver') || errorMsg.includes('not be registered')) {
          consecutiveFailures++;
          console.log(`   ⏭️  Not found (${consecutiveFailures}/${MAX_CONSECUTIVE_FAILURES})`);
          
          // Stop if we hit too many consecutive failures
          if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
            console.log(`\n🛑 Stopping: ${MAX_CONSECUTIVE_FAILURES} consecutive names not found`);
            break;
          }
        } else {
          // Other errors (rate limits, network issues)
          console.error(`   ⚠️  Error: ${errorMsg.substring(0, 100)}`);
          // Don't break on network errors, just log and continue
        }
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✅ Discovery complete:`);
    console.log(`   Releases found: ${releases.length}`);
    console.log(`   Queries made: ${queriesCount}`);
    console.log(`   Duration: ${duration}s`);
    console.log(`   Cache: Will revalidate in ${revalidate}s\n`);

    return NextResponse.json(
      {
        success: true,
        count: releases.length,
        releases,
        meta: {
          queriesCount,
          duration: `${duration}s`,
          cacheRevalidation: `${revalidate}s`,
        },
      },
      {
        headers: {
          'Cache-Control': `s-maxage=${revalidate}, stale-while-revalidate`,
        },
      }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('\n❌ Error discovering releases:', errorMsg, '\n');
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMsg,
        releases: [], // Return empty array to prevent frontend errors
      },
      { status: 500 }
    );
  }
}

