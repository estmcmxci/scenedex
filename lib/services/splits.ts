/**
 * Splits Service
 * 
 * Handles creation of on-chain split contracts for trustless 50/50 revenue distribution
 * between Safe multisig (curator) and submitter (creator) for each Zora coin release.
 * 
 * Uses Splits Protocol: https://splits.org
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  Address,
  Hex,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import { SplitV2Client } from '@0xsplits/splits-sdk';

/**
 * Initialize Splits SDK client for Base Sepolia
 * 
 * Creates a properly configured SplitsClient with:
 * - Derived account from CURATOR_PRIVATE_KEY
 * - Public client for read operations
 * - Wallet client for write operations (signing txs)
 * - Chain ID 84532 (Base Sepolia)
 */
function initializeSplitsClient() {
  const rpcUrl = process.env.BASE_RPC_URL;
  const privateKey = process.env.CURATOR_PRIVATE_KEY;

  if (!rpcUrl) {
    throw new Error('BASE_RPC_URL environment variable not set');
  }

  if (!privateKey) {
    throw new Error('CURATOR_PRIVATE_KEY environment variable not set');
  }

  // Derive account from private key (correct cryptographic flow)
  const account = privateKeyToAccount(privateKey as Hex);

  // Create public client (for read operations)
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(rpcUrl),
  });

  // Create wallet client with derived account (for write operations)
  const walletClient = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(rpcUrl),
  });

  // Initialize SplitV2 client for creating V2 splits
  const splitsClient = new SplitV2Client({
    chainId: 84532, // Base Sepolia
    publicClient,
    walletClient,
  });

  return splitsClient;
}

/**
 * Create a split contract for a release
 * 
 * Deploys a real SplitV2 contract on Base Sepolia using Splits Protocol:
 * - Type: Push (automatically sends funds to recipients on distribution)
 * - Safe address gets 50% of Zora coin trading fees
 * - Submitter address gets 50% of Zora coin trading fees
 * - 1% distributor fee (incentivizes anyone to trigger distributions)
 * - Safe is owner (can pause distributions if malicious release detected)
 * 
 * @param safeAddress - Safe multisig address (50% recipient)
 * @param submitterAddress - Creator/submitter wallet address (50% recipient)
 * @param releaseId - Release ID for logging/tracking
 * @returns Promise<string> - Deployed split contract address on Base Sepolia
 */
export async function createSplitForRelease(
  safeAddress: Address,
  submitterAddress: Address,
  releaseId: string
): Promise<string> {
  console.log(`\n🔄 Creating split contract for release: ${releaseId}`);
  console.log(`   Safe (Curator):  ${safeAddress} (50%)`);
  console.log(`   Submitter:       ${submitterAddress} (50%)\n`);

  try {
    // Initialize Splits SDK client
    const splitsClient = initializeSplitsClient();

    // Step 1: Validate addresses
    console.log(`Step 1️⃣: Validate recipient addresses...`);
    if (!safeAddress.startsWith('0x') || safeAddress.length !== 42) {
      throw new Error(`Invalid safe address: ${safeAddress}`);
    }
    if (!submitterAddress.startsWith('0x') || submitterAddress.length !== 42) {
      throw new Error(`Invalid submitter address: ${submitterAddress}`);
    }
    console.log(`✅ Addresses validated`);

    // Step 2: Create split contract on-chain via Splits Protocol
    console.log(`Step 2️⃣: Create split contract on Base Sepolia...`);
    console.log(`   Recipients: 2 (Safe + Artist)`);
    console.log(`   Allocation: 50% / 50%`);
    console.log(`   Type: Push (direct sends)`);
    console.log(`   Owner: Safe (can pause if needed)\n`);

    const { splitAddress } = await splitsClient.createSplit({
      recipients: [
        {
          address: safeAddress,
          percentAllocation: 50.0,
        },
        {
          address: submitterAddress,
          percentAllocation: 50.0,
        },
      ],
      distributorFeePercent: 1.0,       // 1% fee to anyone who triggers distribution
      totalAllocationPercent: 100.0,
      splitType: 'Push' as any,         // Push = direct sends (no manual withdraw needed)
      ownerAddress: safeAddress,        // Safe can pause distributions if needed
      creatorAddress: safeAddress,      // Curator deploys it
    });

    console.log(`✅ Split contract deployed: ${splitAddress}`);

    console.log(`\n✨ Split ready for Zora coin creation!`);
    console.log(`   Split Address: ${splitAddress}`);
    console.log(`   Will receive: Zora coin trading fees`);
    console.log(`   Distributes: 50% Safe + 50% Submitter`);
    console.log(`   View on BaseScan: https://sepolia.basescan.org/address/${splitAddress}\n`);

    return splitAddress;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`\n❌ Failed to create split for ${releaseId}:`, errorMessage);
    throw error;
  }
}

/**
 * Verify split contract exists on-chain
 * 
 * @param splitAddress - Split contract address to verify
 * @returns Promise<boolean> - True if split exists and is valid
 */
export async function verifySplitContract(splitAddress: Address): Promise<boolean> {
  try {
    console.log(`\n🔍 Verifying split contract: ${splitAddress}`);

    // TODO: Implement actual verification via Splits SDK
    // For now, just check address format
    if (!splitAddress.startsWith('0x') || splitAddress.length !== 42) {
      console.log(`⚠️ Invalid split address format`);
      return false;
    }

    console.log(`✅ Split address format valid (mock verification)`);
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn(`⚠️ Could not verify split:`, errorMessage);
    return false;
  }
}

/**
 * Get split details (recipients and shares)
 * 
 * @param splitAddress - Split contract address
 * @returns Promise with recipient details
 */
export async function getSplitDetails(splitAddress: Address) {
  try {
    // TODO: Implement actual details fetch via Splits SDK
    console.log(`🔍 Fetching split details for: ${splitAddress}`);
    console.log(`(Pending Splits SDK integration)`);

    return {
      address: splitAddress,
      recipients: [],
      shares: [],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Failed to get split details:`, errorMessage);
    throw error;
  }
}

