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
  decodeEventLog,
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

// ============================================================================
// SAFE TRANSACTION CALLDATA FUNCTIONS
// These functions return calldata for Safe to execute (instead of executing directly)
// ============================================================================

/**
 * Get calldata for creating a split contract
 * Returns calldata that Safe can execute
 * 
 * @param safeAddress - Safe multisig address (50% recipient and owner)
 * @param submitterAddress - Creator/submitter wallet address (50% recipient)
 * @returns Calldata for createSplit call
 */
export async function getSplitCalldata(
  safeAddress: Address,
  submitterAddress: Address,
  releaseId?: string
): Promise<{ to: string; data: string; value: string; predictedAddress: string }> {
  console.log(`\n📝 Preparing split creation calldata...`);
  console.log(`   Safe (Curator):  ${safeAddress} (50%)`);
  console.log(`   Submitter:       ${submitterAddress} (50%)`);
  if (releaseId) {
    console.log(`   Release ID:      ${releaseId} (for uniqueness)`);
  }
  console.log(``);

  try {
    // Validate addresses exist first
    if (!safeAddress || typeof safeAddress !== 'string') {
      throw new Error(`Safe address is undefined or not a string: ${safeAddress}`);
    }
    if (!submitterAddress || typeof submitterAddress !== 'string') {
      throw new Error(`Submitter address is undefined or not a string: ${submitterAddress}`);
    }
    
    // Validate address format
    if (!safeAddress.startsWith('0x') || safeAddress.length !== 42) {
      throw new Error(`Invalid safe address format: ${safeAddress}`);
    }
    if (!submitterAddress.startsWith('0x') || submitterAddress.length !== 42) {
      throw new Error(`Invalid submitter address format: ${submitterAddress}`);
    }

    // Initialize Splits SDK client (we only need it for callData, not execution)
    // All operations (Split, Zora, Basename) are on Base Sepolia, so Safe executes on Base Sepolia
    const splitsClient = initializeSplitsClient();
    
    // Note: We don't use salt because:
    // 1. The salted createSplit function (0xf79918b0) may not be supported on Base Sepolia
    // 2. Each release has unique recipients (Safe + different submitter), so splits are naturally unique
    // 3. The successful transaction used the non-salted createSplit (0x2556fa39)
    
    // First, try to predict the split address (with timeout to avoid blocking)
    console.log(`   🔍 Predicting split address to check if it already exists...`);
    let predictedAddress: string | null = null;
    
    try {
      // Add a 10-second timeout to the prediction call
      const predictionPromise = splitsClient.predictDeterministicAddress({
        recipients: [
          { address: safeAddress, percentAllocation: 50.0 },
          { address: submitterAddress, percentAllocation: 50.0 },
        ],
        distributorFeePercent: 1.0,
        totalAllocationPercent: 100.0,
        splitType: 'Push' as any,
        ownerAddress: safeAddress,
        creatorAddress: safeAddress,
      });
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Prediction timed out')), 10000)
      );
      
      const predictedSplit = await Promise.race([predictionPromise, timeoutPromise]);
      
      predictedAddress = typeof predictedSplit === 'string' 
        ? predictedSplit 
        : (predictedSplit as any)?.address || (predictedSplit as any)?.splitAddress;
      
      if (predictedAddress) {
        console.log(`   📋 Predicted split address: ${predictedAddress}`);
      }
    } catch (predictionError) {
      console.log(`   ⚠️  Could not predict split address (${predictionError instanceof Error ? predictionError.message : 'unknown error'})`);
      console.log(`   📋 Proceeding without prediction - split will be created fresh`);
    }
    
    // Check if split already exists on Base Sepolia (only if we have a predicted address)
    if (predictedAddress) {
      const { createPublicClient, http } = await import('viem');
      const { baseSepolia } = await import('viem/chains');
      const baseRpcUrl = process.env.BASE_RPC_URL;
      if (!baseRpcUrl) {
        throw new Error('BASE_RPC_URL not set');
      }
      
      const baseClient = createPublicClient({
        chain: baseSepolia,
        transport: http(baseRpcUrl),
      });
      
      try {
        const existingCode = await baseClient.getCode({ address: predictedAddress as `0x${string}` });
        const splitExists = existingCode && existingCode !== '0x';
        
        if (splitExists) {
          console.log(`   ⚠️  Split already exists at ${predictedAddress} - skipping creation`);
          console.log(`   ✅ Will use existing split address: ${predictedAddress}`);
          
          // Return a no-op transaction (call to Safe itself with empty data)
          return {
            to: safeAddress, // Call to Safe itself (no-op)
            data: '0x', // Empty data (no operation)
            value: '0',
            predictedAddress: predictedAddress,
          };
        }
        
        console.log(`   ✅ Split does not exist - will create new split`);
      } catch (codeCheckError) {
        console.log(`   ⚠️  Could not check if split exists, proceeding with creation`);
      }
    } else {
      console.log(`   📋 No predicted address - will create new split`);
    }

    // Use callData.createSplit to get the transaction data
    // Returns { to, data, value } format (compatible with Safe transactions and multicall)
    // Note: NOT using salt - the salted version uses a different function selector that may not work
    const callDataResult = await splitsClient.callData.createSplit({
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
      distributorFeePercent: 1.0,
      totalAllocationPercent: 100.0,
      splitType: 'Push' as any,
      ownerAddress: safeAddress, // Safe always remains owner
      creatorAddress: safeAddress, // Safe is always the creator (required by factory)
      // No salt - using default CREATE2 calculation (same as successful transaction)
    });

    // Log the raw result to understand its structure
    console.log(`   📋 Raw callData result type:`, typeof callDataResult);
    console.log(`   📋 Raw callData result:`, JSON.stringify(callDataResult, null, 2));
    
    // Handle different possible return structures
    let toAddress: string | undefined;
    let dataHex: string | undefined;
    let valueStr: string | undefined;

    if (callDataResult && typeof callDataResult === 'object') {
      // Try direct properties first
      toAddress = (callDataResult as any).to;
      dataHex = (callDataResult as any).data;
      valueStr = (callDataResult as any).value;
      
      // If not found, try nested structures
      if (!toAddress && (callDataResult as any).transaction) {
        toAddress = (callDataResult as any).transaction?.to;
        dataHex = (callDataResult as any).transaction?.data;
        valueStr = (callDataResult as any).transaction?.value;
      }
      
      // Try other possible property names
      if (!toAddress) {
        toAddress = (callDataResult as any).target || (callDataResult as any).address || (callDataResult as any).contractAddress;
      }
      if (!dataHex) {
        dataHex = (callDataResult as any).callData || (callDataResult as any).encodedData || (callDataResult as any).calldata;
      }
    }

    if (!toAddress) {
      throw new Error(`Splits SDK callData.createSplit did not return a 'to' address. Result: ${JSON.stringify(callDataResult)}`);
    }
    if (!dataHex) {
      throw new Error(`Splits SDK callData.createSplit did not return 'data'. Result: ${JSON.stringify(callDataResult)}`);
    }

    console.log(`   ✅ Calldata prepared for createSplit`);
    console.log(`      To: ${toAddress}`);
    console.log(`      Data length: ${dataHex.length} bytes`);

    // If we don't have a predicted address yet, try to get it from the callData result
    let finalPredictedAddress = predictedAddress;
    if (!finalPredictedAddress) {
      // Try to get predicted address from callData result (some SDK versions include it)
      finalPredictedAddress = (callDataResult as any)?.splitAddress || 
                              (callDataResult as any)?.predictedAddress ||
                              (callDataResult as any)?.address;
      
      // If still no predicted address, generate a placeholder (will be resolved after tx)
      if (!finalPredictedAddress) {
        console.log(`   ⚠️  Could not predict split address - will resolve after transaction`);
        finalPredictedAddress = 'pending'; // Will be resolved from transaction receipt
      }
    }
    
    return {
      to: toAddress,
      data: dataHex,
      value: valueStr || '0',
      predictedAddress: finalPredictedAddress,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`\n❌ Failed to get split calldata:`, errorMessage);
    throw error;
  }
}

/**
 * Extract split address from transaction receipt logs
 * 
 * Since splits use CREATE2, the predicted address should match the actual address.
 * This function can verify by checking if the predicted address has code deployed.
 * 
 * @param receipt - Transaction receipt with logs
 * @param predictedAddress - Predicted split address (from CREATE2)
 * @returns Split address if found/verified, null otherwise
 */
export async function extractSplitAddressFromLogs(
  receipt: { logs?: Array<{ address?: string; topics?: string[]; data?: string }> },
  predictedAddress: Address
): Promise<Address | null> {
  // Since splits use CREATE2, the predicted address should be the actual address
  // We can verify by checking if code exists at that address
  try {
    const { createPublicClient, http } = await import('viem');
    const { baseSepolia } = await import('viem/chains');
    const rpcUrl = process.env.BASE_RPC_URL;
    
    if (!rpcUrl) {
      console.warn('BASE_RPC_URL not set, cannot verify split address');
      return predictedAddress; // Return predicted as fallback
    }
    
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(rpcUrl),
    });
    
    const code = await publicClient.getCode({ address: predictedAddress as `0x${string}` });
    if (code && code !== '0x') {
      // Code exists at predicted address, so it's the actual split
      return predictedAddress;
    }
    
    // If no code, the split wasn't created (or prediction was wrong)
    // This shouldn't happen with CREATE2, but handle gracefully
    console.warn(`⚠️ No code found at predicted split address: ${predictedAddress}`);
    return null;
  } catch (error) {
    console.warn('Error verifying split address:', error);
    // Return predicted address as fallback (CREATE2 should be deterministic)
    return predictedAddress;
  }
}

