/**
 * ENS Query Tool - Read Scenedex Release Metadata from ENS
 * 
 * This script demonstrates how to query custom ENS text records that were set
 * during the release publishing flow. It retrieves all on-chain metadata for a
 * given Scenedex release (identified by its ENS subname like soma007.scenedex.eth).
 * 
 * Usage:
 *   npx tsx lib/services/query-ens.ts soma007.scenedex.eth
 *   npx tsx lib/services/query-ens.ts soma010.scenedex.eth
 * 
 * What it does:
 * 1. Connects to Sepolia ENS registry via RPC
 * 2. Resolves the ENS name to find its resolver contract
 * 3. Queries all custom text records (eth.scenedex.*)
 * 4. Displays the complete release metadata
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { normalize } from 'viem/ens';

// ============================================================================
// PART 1: Initialize Viem Public Client
// ============================================================================
// Creates a read-only client to query Sepolia blockchain
// - No private key needed (read-only operations)
// - Uses SEPOLIA_RPC_URL from .env.local (Infura/Alchemy endpoint)
// - Connects to Sepolia testnet where our ENS names are registered
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.SEPOLIA_RPC_URL),
});

// ============================================================================
// PART 2: Define Custom Text Record Keys
// ============================================================================
// These are the custom ENS text records we set during publishing
// Format: eth.scenedex.* (our custom namespace)
// Each key maps to a piece of release metadata stored on-chain
const SCENEDEX_RECORD_KEYS = {
  // Zora coin contract address on Base Sepolia
  // Used to: Purchase/trade the coin, check price, view holders
  zoraCoinAddress: 'eth.scenedex.zoraCoinAddress',
  
  // Zora coin symbol (e.g., "PDAE2E", "SOMA007")
  // Used to: Display in UI, identify the coin
  zoraCoinSymbol: 'eth.scenedex.zoraCoinSymbol',
  
  // Split contract address on Base Sepolia
  // Used to: View revenue distribution (50% Safe + 50% Artist)
  splitAddress: 'eth.scenedex.splitAddress',
  
  // IPFS CID of the media file (audio)
  // Used to: Stream/download the music file
  // Format: bafybei... (CIDv1)
  mediaIPFS: 'eth.scenedex.mediaIPFS',
  
  // IPFS CID of the metadata JSON (ERC721 format)
  // Used to: Display full NFT-style metadata
  metadataURI: 'eth.scenedex.metadataURI',
  
  // Artist name(s)
  // Used to: Display artist credits
  artists: 'eth.scenedex.artists',
  
  // Release ID in our format (e.g., "SOMA007")
  // Used to: Identify the release in our system
  releaseId: 'eth.scenedex.releaseId',
};

// ============================================================================
// PART 3: Standard ENS Keys (ENSIP-5)
// ============================================================================
// These are standard ENS keys that work across all ENS-compatible apps
const STANDARD_ENS_KEYS = {
  // Avatar image (cover art)
  // Format: ipfs://bafybei...
  // Displayed by: ENS app, wallets, block explorers
  avatar: 'avatar',
  
  // Human-readable description
  // Displayed by: ENS app UI
  description: 'description',
  
  // Ethereum address this name resolves to
  // Used by: Wallets to send ETH to this name
  // Note: This is also available via getEnsAddress()
  address: 'address',
};

// ============================================================================
// PART 4: Query Function - Get All Records for an ENS Name
// ============================================================================
/**
 * Queries all Scenedex metadata from ENS for a given release name
 * 
 * How it works:
 * 1. Normalizes the ENS name (lowercase, proper encoding)
 * 2. Queries each text record key individually
 * 3. Returns structured object with all metadata
 * 
 * @param ensName - Full ENS name (e.g., "soma007.scenedex.eth")
 * @returns Object containing all on-chain metadata
 */
async function queryScenedexRelease(ensName: string) {
  console.log(`\n🔍 Querying ENS Records for: ${ensName}`);
  console.log(`================================================\n`);
  
  // Normalize the ENS name (required for proper namehash calculation)
  // - Converts to lowercase
  // - Handles special characters (emojis, unicode)
  // - Throws error if name contains invalid characters
  const normalizedName = normalize(ensName);
  console.log(`✅ Normalized name: ${normalizedName}\n`);
  
  try {
    // ========================================================================
    // Step 1: Get the resolver address
    // ========================================================================
    // ENS names point to a "resolver" contract that stores the actual data
    // Without a resolver, the name exists but has no records
    console.log(`📋 Step 1: Fetching resolver contract...`);
    const resolver = await publicClient.getEnsResolver({
      name: normalizedName,
    });
    
    if (!resolver) {
      console.log(`   No resolver (name not registered)\n`);
      // Return early with minimal data - name doesn't exist
      return {
        ensName: normalizedName,
        resolver: null,
        primaryAddress: null,
        standard: {
          avatar: null,
          description: null,
          address: null,
        },
        scenedex: {
          zoraCoinAddress: null,
          zoraCoinSymbol: null,
          splitAddress: null,
          mediaIPFS: null,
          metadataURI: null,
          artists: null,
          releaseId: null,
        },
      };
    }
    console.log(`   Resolver: ${resolver}\n`);
    
    // ========================================================================
    // Step 2: Query primary address record
    // ========================================================================
    // The "addr" record is the main Ethereum address this name resolves to
    // This is what wallets use when you send ETH to an ENS name
    console.log(`📋 Step 2: Querying primary address (addr record)...`);
    const primaryAddress = await publicClient.getEnsAddress({
      name: normalizedName,
    });
    console.log(`   Primary Address: ${primaryAddress || 'Not set'}\n`);
    
    // ========================================================================
    // Step 3: Query standard ENS text records
    // ========================================================================
    console.log(`📋 Step 3: Querying standard ENS text records...`);
    const standardRecords: Record<string, string | null> = {};
    
    for (const [key, recordKey] of Object.entries(STANDARD_ENS_KEYS)) {
      const value = await publicClient.getEnsText({
        name: normalizedName,
        key: recordKey,
      });
      standardRecords[key] = value;
      console.log(`   ${recordKey}: ${value || 'Not set'}`);
    }
    console.log();
    
    // ========================================================================
    // Step 4: Query custom Scenedex text records
    // ========================================================================
    console.log(`📋 Step 4: Querying custom Scenedex records (eth.scenedex.*)...`);
    const scenedexRecords: Record<string, string | null> = {};
    
    for (const [key, recordKey] of Object.entries(SCENEDEX_RECORD_KEYS)) {
      const value = await publicClient.getEnsText({
        name: normalizedName,
        key: recordKey,
      });
      scenedexRecords[key] = value;
      console.log(`   ${recordKey}: ${value || 'Not set'}`);
    }
    console.log();
    
    // ========================================================================
    // Step 5: Return structured data
    // ========================================================================
    return {
      ensName: normalizedName,
      resolver,
      primaryAddress,
      standard: standardRecords,
      scenedex: scenedexRecords,
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`\n❌ Error querying ENS:`, errorMessage);
    throw error;
  }
}

// ============================================================================
// PART 5: Display Helper - Pretty Print Results
// ============================================================================
/**
 * Formats and displays query results in a readable way
 * Highlights important data like Zora coin address and split address
 */
function displayResults(data: Awaited<ReturnType<typeof queryScenedexRelease>>) {
  console.log(`\n================================================`);
  console.log(`✅ QUERY COMPLETE`);
  console.log(`================================================\n`);
  
  console.log(`📍 ENS Name: ${data.ensName}`);
  console.log(`📍 Resolver: ${data.resolver}`);
  console.log(`📍 Primary Address: ${data.primaryAddress || 'Not set'}\n`);
  
  // Highlight critical contract addresses
  console.log(`🪙 ZORA COIN (Base Sepolia):`);
  console.log(`   Address: ${data.scenedex.zoraCoinAddress || 'Not deployed'}`);
  console.log(`   Symbol:  ${data.scenedex.zoraCoinSymbol || 'Unknown'}`);
  if (data.scenedex.zoraCoinAddress) {
    console.log(`   View on BaseScan: https://sepolia.basescan.org/address/${data.scenedex.zoraCoinAddress}`);
  }
  console.log();
  
  console.log(`💰 SPLIT CONTRACT (Base Sepolia):`);
  console.log(`   Address: ${data.scenedex.splitAddress || 'Not deployed'}`);
  if (data.scenedex.splitAddress) {
    console.log(`   Revenue: 50% Safe + 50% Artist`);
    console.log(`   View on BaseScan: https://sepolia.basescan.org/address/${data.scenedex.splitAddress}`);
  }
  console.log();
  
  console.log(`📁 MEDIA FILES (IPFS):`);
  console.log(`   Audio:    ${data.scenedex.mediaIPFS || 'Not pinned'}`);
  if (data.scenedex.mediaIPFS) {
    console.log(`   Listen:   https://w3s.link/ipfs/${data.scenedex.mediaIPFS}`);
  }
  console.log(`   Cover:    ${data.standard.avatar || 'Not set'}`);
  if (data.standard.avatar) {
    const avatarCID = data.standard.avatar.replace('ipfs://', '');
    console.log(`   View:     https://w3s.link/ipfs/${avatarCID}`);
  }
  console.log(`   Metadata: ${data.scenedex.metadataURI || 'Not pinned'}`);
  if (data.scenedex.metadataURI) {
    console.log(`   View:     https://w3s.link/ipfs/${data.scenedex.metadataURI}`);
  }
  console.log();
  
  console.log(`🎵 RELEASE INFO:`);
  console.log(`   ID:          ${data.scenedex.releaseId || 'Unknown'}`);
  console.log(`   Artists:     ${data.scenedex.artists || 'Unknown'}`);
  console.log(`   Description: ${data.standard.description || 'No description'}`);
  console.log();
  
  console.log(`🌐 VIEW ON ENS APP:`);
  console.log(`   https://sepolia.app.ens.domains/${data.ensName}\n`);
}

// ============================================================================
// PART 6: CLI Entry Point
// ============================================================================
/**
 * Main execution function
 * Parses command-line arguments and runs the query
 */
async function main() {
  // Get ENS name from command line argument
  // Example: npx tsx lib/services/query-ens.ts soma007.scenedex.eth
  const ensName = process.argv[2];
  
  if (!ensName) {
    console.error(`\n❌ Usage: npx tsx lib/services/query-ens.ts <ens-name>`);
    console.error(`   Example: npx tsx lib/services/query-ens.ts soma007.scenedex.eth\n`);
    process.exit(1);
  }
  
  try {
    // Run the query
    const data = await queryScenedexRelease(ensName);
    
    // Display results
    displayResults(data);
    
    // Exit successfully
    process.exit(0);
    
  } catch (error) {
    console.error(`\n❌ Failed to query ENS name\n`);
    process.exit(1);
  }
}

// Run if executed directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

// Export for use in other modules
export { queryScenedexRelease, SCENEDEX_RECORD_KEYS, STANDARD_ENS_KEYS };

