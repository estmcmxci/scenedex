/**
 * Zora Coins Service
 *
 * Handles creation of ERC20 creator coins for each release using Zora Coins SDK.
 * Each release gets a unique coin with revenue split between Safe and submitter.
 *
 * Uses Zora Coins SDK: https://docs.zora.co/coins/sdk
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  Address,
  Hex,
  zeroAddress,
  parseUnits,
  keccak256,
  encodePacked,
  encodeFunctionData,
  decodeEventLog,
  decodeAbiParameters,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base, baseSepolia } from 'viem/chains';
import { 
  encodeMultiCurvePoolConfig, 
  coinFactoryABI,
} from '@zoralabs/protocol-deployments';

/**
 * Initialize viem clients for Base mainnet
 */
function initializeClients() {
  const rpcUrl = process.env.BASE_RPC_URL;
  const privateKey = process.env.CURATOR_PRIVATE_KEY;

  if (!rpcUrl) {
    throw new Error('BASE_RPC_URL environment variable not set');
  }

  if (!privateKey) {
    throw new Error('CURATOR_PRIVATE_KEY environment variable not set');
  }

  // Create public client (for read operations)
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(rpcUrl),
  });

  // Create wallet client (for write operations)
  // Convert private key to account for signing
  const account = privateKeyToAccount(privateKey as Hex);
  const walletClient = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(rpcUrl),
  });

  return { publicClient, walletClient };
}

/**
 * Create a Zora coin for a release
 *
 * Deploys an ERC20 token on Base chain that represents the release.
 * OWNERSHIP: Creator (artist)
 * REVENUE: Goes to split contract (50% Safe + 50% Creator)
 * 
 * Uses DIRECT FACTORY CONTRACT CALL (bypasses broken SDK API)
 * Factory: 0x777777751622c0d3258f214F9DF38E35BF45baF3 (Zora docs - oldest/most established)
 *
 * @param releaseId - Release ID (e.g., "PDA-001")
 * @param creatorAddress - Creator's wallet address (becomes coin owner)
 * @param splitAddress - Split contract address (50% Safe + 50% Creator) - payoutRecipient
 * @param metadataURI - IPFS URI pointing to coin metadata JSON
 * @param title - Release title (used as coin name)
 * @param description - Release description (optional, for metadata)
 * @returns Promise with coin address and symbol
 */
export async function createCoinForRelease(
  releaseId: string,
  creatorAddress: Address,
  splitAddress: Address,
  metadataURI: string,
  title: string,
  description?: string,
  metadataFilename: string = 'metadata.json'
): Promise<{ coinAddress: Address; symbol: string; transactionHash: string }> {
  console.log(`\n🪙 Creating Zora coin for release: ${releaseId}`);
  console.log(`   Payout Recipient: ${splitAddress}`);
  console.log(`   Metadata URI:     ${metadataURI}\n`);

  try {
    // Initialize viem clients
    const { publicClient, walletClient } = initializeClients();
    
    // Get factory address from env
    const factoryAddress = process.env.ZORA_COIN_FACTORY_ADDRESS as Address;
    if (!factoryAddress) {
      throw new Error('ZORA_COIN_FACTORY_ADDRESS environment variable not set');
    }

    // Debug: Log chain info
    console.log(`   Debug - PublicClient chain ID: ${publicClient.chain?.id}`);
    console.log(`   Debug - WalletClient chain ID: ${walletClient.chain?.id}`);
    console.log(`   Debug - baseSepolia ID: ${baseSepolia.id}`);
    console.log(`   Debug - Factory Address: ${factoryAddress}`);

    // Step 1: Validate inputs
    console.log(`\nStep 1️⃣: Validate coin parameters...`);
    if (!splitAddress.startsWith('0x') || splitAddress.length !== 42) {
      throw new Error(`Invalid split address: ${splitAddress}`);
    }
    if (!metadataURI.startsWith('ipfs://')) {
      throw new Error(
        `Invalid metadata URI. Must start with 'ipfs://': ${metadataURI}`
      );
    }
    if (!title || title.length === 0) {
      throw new Error('Release title required for coin name');
    }
    console.log(`✅ All parameters validated`);

    // Step 2: Define coin parameters
    console.log(`\nStep 2️⃣: Define coin parameters...`);
    // Extract PDA number from release ID (PDA-001-xyz → PDA001)
    const pdaNumber = releaseId.split('-')[1] || 'UNKNOWN';
    const coinSymbol = `PDA${pdaNumber}`;
    
    // Get creator address
    const creatorAddress = walletClient.account?.address;
    if (!creatorAddress) {
      throw new Error('Could not get creator address from wallet');
    }

    // Convert IPFS URI to w3s.link gateway URL
    // Format: https://{cid}.ipfs.w3s.link/{releaseId}-{filename}
    // Note: The successful transaction used gateway URLs, so we'll keep this format
    const finalMetadataURI = metadataURI.startsWith('ipfs://')
      ? `https://${metadataURI.replace('ipfs://', '')}.ipfs.w3s.link/${releaseId}-${metadataFilename}`
      : metadataURI;

    console.log(`   Name:     ${title}`);
    console.log(`   Symbol:   ${coinSymbol}`);
    console.log(`   Payout:   ${splitAddress}`);
    console.log(`   Creator:  ${creatorAddress}`);
    console.log(`   Metadata URI: ${finalMetadataURI}`);
    console.log(`✅ Coin parameters ready`);

    // Step 3: Generate pool config for ETH pair
    console.log(`\nStep 3️⃣: Generate pool configuration...`);
    const poolConfig = encodeMultiCurvePoolConfig({
      currency: zeroAddress, // ETH (address(0))
      tickLower: [-250000],
      tickUpper: [-195000],
      numDiscoveryPositions: [11],
      maxDiscoverySupplyShare: [parseUnits('0.05', 18)], // 5% max supply share
    });
    console.log(`✅ Pool config generated`);

    // Step 4: Generate unique salt
    console.log(`\nStep 4️⃣: Generate unique salt...`);
    const coinSalt = keccak256(
      encodePacked(
        ['string', 'uint256'],
        [releaseId, BigInt(Date.now())]
      )
    );
    console.log(`   Salt: ${coinSalt}`);
    console.log(`✅ Salt generated`);

    // Step 5: Simulate contract call (dry run)
    console.log(`\nStep 5️⃣: Simulate factory call (dry run)...`);
    const { request } = await publicClient.simulateContract({
      address: factoryAddress,
      abi: coinFactoryABI,
      functionName: 'deploy',
      args: [
        splitAddress,            // payoutRecipient (split contract)
        [creatorAddress],        // owners (array)
        finalMetadataURI,        // uri (IPFS URI - preferred format per docs)
        title,                   // name
        coinSymbol,              // symbol
        poolConfig,              // poolConfig (encoded bytes)
        creatorAddress,          // platformReferrer
        zeroAddress,             // postDeployHook
        '0x',                    // postDeployHookData
        coinSalt,                // coinSalt
      ],
      account: walletClient.account,
    });
    console.log(`✅ Simulation successful`);

    // Step 6: Send transaction
    console.log(`\nStep 6️⃣: Send transaction to Base Sepolia...`);
    const hash = await walletClient.writeContract(request);
    console.log(`   Transaction Hash: ${hash}`);
    console.log(`✅ Transaction sent, waiting for confirmation...`);

    // Step 7: Wait for confirmation
    console.log(`\nStep 7️⃣: Wait for transaction confirmation...`);
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log(`   Block Number: ${receipt.blockNumber}`);
    console.log(`   Gas Used: ${receipt.gasUsed}`);
    console.log(`✅ Transaction confirmed`);

    // Step 8: Extract coin address from logs
    console.log(`\nStep 8️⃣: Extract coin address from logs...`);
    // The coin address is the first address in the transaction logs
    // (it's the newly deployed coin contract)
    const coinAddress = receipt.logs[0]?.address as Address;
    if (!coinAddress || coinAddress === zeroAddress) {
      throw new Error('Could not extract coin address from transaction logs');
    }
    console.log(`   Coin Address: ${coinAddress}`);
    console.log(`✅ Coin address extracted`);

    // Step 9: Verify coin address
    console.log(`\nStep 9️⃣: Verify coin address...`);
    if (!coinAddress || coinAddress === zeroAddress) {
      throw new Error(`Invalid coin address: ${coinAddress}`);
    }
    console.log(`✅ Coin address verified: ${coinAddress}`);

    console.log(`\n✨ Zora coin deployed and ready for trading!`);
    console.log(`   Symbol:  ${coinSymbol}`);
    console.log(`   Address: ${coinAddress}`);
    console.log(`   Revenue → Split → 50% Safe + 50% Submitter`);
    console.log(`   Explorer: https://sepolia.basescan.org/address/${coinAddress}\n`);

    return {
      coinAddress,
      symbol: coinSymbol,
      transactionHash: hash,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`\n❌ Failed to create coin for ${releaseId}:`, errorMessage);
    throw error;
  }
}

/**
 * Verify coin exists on-chain
 *
 * @param coinAddress - Coin contract address to verify
 * @returns Promise<boolean> - True if coin exists and has code
 */
export async function verifyCoinContract(
  coinAddress: Address
): Promise<boolean> {
  try {
    console.log(`\n🔍 Verifying coin contract: ${coinAddress}`);

    const { publicClient } = initializeClients();

    // Check if address has code (is a contract)
    const code = await publicClient.getCode({ address: coinAddress });
    if (!code || code === '0x') {
      console.log(`⚠️ No contract code at address`);
      return false;
    }

    console.log(`✅ Coin contract verified on-chain`);
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn(`⚠️ Could not verify coin:`, errorMessage);
    return false;
  }
}

/**
 * Get coin symbol from address
 *
 * @param coinAddress - Coin contract address
 * @returns Promise<string | null> - Coin symbol or null if not found
 */
export async function getCoinSymbol(
  coinAddress: Address
): Promise<string | null> {
  try {
    const { publicClient } = initializeClients();

    console.log(`🔍 Fetching symbol for coin: ${coinAddress}`);

    // TODO: Call ERC20 symbol() function
    // For now, return null (will implement once Zora SDK updated)
    return null;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Failed to get coin symbol:`, errorMessage);
    return null;
  }
}

// ============================================================================
// SAFE TRANSACTION CALLDATA FUNCTIONS
// These functions return calldata for Safe to execute (instead of executing directly)
// ============================================================================

/**
 * Get calldata for creating a Zora coin
 * Returns calldata that Safe can execute
 * 
 * @param releaseId - Release ID (e.g., "PDA-001")
 * @param creatorAddress - Creator's wallet address (becomes coin owner)
 * @param splitAddress - Split contract address (50% Safe + 50% Creator) - payoutRecipient
 * @param metadataURI - IPFS URI pointing to coin metadata JSON
 * @param title - Release title (used as coin name)
 * @param metadataFilename - Metadata filename (default: 'metadata.json')
 * @returns Calldata for deploy call on Zora coin factory
 */
export function getZoraCoinCalldata(
  releaseId: string,
  creatorAddress: Address,
  splitAddress: Address,
  metadataURI: string,
  title: string,
  metadataFilename: string = 'metadata.json',
  coinSalt?: Hex
): { to: string; data: string; value: string; salt: Hex } {
  console.log(`\n📝 Preparing Zora coin creation calldata...`);
  console.log(`   Release ID: ${releaseId}`);
  console.log(`   Payout Recipient: ${splitAddress}`);
  console.log(`   Metadata URI: ${metadataURI}\n`);

  // Validate inputs
  if (!splitAddress.startsWith('0x') || splitAddress.length !== 42) {
    throw new Error(`Invalid split address: ${splitAddress}`);
  }
  // Accept both ipfs:// URIs and https:// gateway URLs
  // The successful transaction used gateway URLs, so we support both
  if (!metadataURI.startsWith('ipfs://') && !metadataURI.startsWith('https://')) {
    throw new Error(
      `Invalid metadata URI. Must start with 'ipfs://' or 'https://': ${metadataURI}`
    );
  }
  if (!title || title.length === 0) {
    throw new Error('Release title required for coin name');
  }

  // Get factory address from env
  const factoryAddress = process.env.ZORA_COIN_FACTORY_ADDRESS as Address;
  if (!factoryAddress) {
    throw new Error('ZORA_COIN_FACTORY_ADDRESS environment variable not set');
  }

  // Extract PDA number from release ID (PDA-001-xyz → PDA001)
  const pdaNumber = releaseId.split('-')[1] || 'UNKNOWN';
  const coinSymbol = `PDA${pdaNumber}`;

  // Convert IPFS URI to w3s.link gateway URL if needed
  // Format: https://{cid}.ipfs.w3s.link/{releaseId}-{filename}
  // Note: The successful transaction used gateway URLs, so we convert ipfs:// to gateway URLs
  // If already a gateway URL, use it as-is
  const finalMetadataURI = metadataURI.startsWith('ipfs://')
    ? `https://${metadataURI.replace('ipfs://', '')}.ipfs.w3s.link/${releaseId}-${metadataFilename}`
    : metadataURI; // Already a gateway URL or other format

  // Generate pool config for ETH pair
  const poolConfig = encodeMultiCurvePoolConfig({
    currency: zeroAddress, // ETH (address(0))
    tickLower: [-250000],
    tickUpper: [-195000],
    numDiscoveryPositions: [11],
    maxDiscoverySupplyShare: [parseUnits('0.05', 18)], // 5% max supply share
  });

  // Generate unique salt (or use provided one)
  const finalCoinSalt = coinSalt || keccak256(
    encodePacked(
      ['string', 'uint256'],
      [releaseId, BigInt(Date.now())]
    )
  );

  // Encode function call
  const calldata = encodeFunctionData({
    abi: coinFactoryABI,
    functionName: 'deploy',
    args: [
      splitAddress,            // payoutRecipient (split contract)
      [creatorAddress],        // owners (array)
      finalMetadataURI,        // uri (IPFS URI - preferred format per docs)
      title,                   // name
      coinSymbol,              // symbol
      poolConfig,              // poolConfig (encoded bytes)
      creatorAddress,          // platformReferrer
      zeroAddress,             // postDeployHook
      '0x',                    // postDeployHookData
      finalCoinSalt,                // coinSalt
    ],
  });

  console.log(`   ✅ Calldata prepared for deploy`);
  console.log(`      To: ${factoryAddress}`);
  console.log(`      Symbol: ${coinSymbol}`);
  console.log(`      Data length: ${calldata.length} bytes`);

  return {
    to: factoryAddress,
    data: calldata,
    value: '0',
    salt: finalCoinSalt,
  };
}

/**
 * Extract Zora coin address from transaction receipt logs
 * 
 * Looks for CoinCreatedV4 event from the Zora coin factory contract.
 * Event signature: 0x2de436107c2096e039c98bbcc3c5a2560583738ce15c234557eecb4d3221aa81
 * 
 * CoinCreatedV4 structure:
 * - Topic 0: event signature
 * - Topic 1: caller (indexed)
 * - Topic 2: payoutRecipient (indexed)  
 * - Topic 3: platformReferrer (indexed)
 * - Data: currency, uri, name, symbol, coin, poolConfig
 * 
 * @param receipt - Transaction receipt with logs
 * @param factoryAddress - Zora coin factory contract address
 * @returns Coin address if found, null otherwise
 */
export function extractZoraCoinAddressFromLogs(
  receipt: { logs?: Array<{ address?: string; topics?: string[]; data?: string }> },
  factoryAddress: Address
): Address | null {
  if (!receipt.logs || receipt.logs.length === 0) {
    console.log('   📋 No logs in receipt');
    return null;
  }

  // CoinCreatedV4 event signature
  const COIN_CREATED_V4_TOPIC = '0x2de436107c2096e039c98bbcc3c5a2560583738ce15c234557eecb4d3221aa81';

  try {
    for (const log of receipt.logs) {
      // Check if this log is from the factory
      if (log.address?.toLowerCase() !== factoryAddress.toLowerCase()) {
        continue;
      }

      // Check if this is a CoinCreatedV4 event
      if (!log.topics || log.topics[0]?.toLowerCase() !== COIN_CREATED_V4_TOPIC.toLowerCase()) {
        continue;
      }

      console.log('   📋 Found CoinCreatedV4 event from factory');

      // Try to decode using SDK ABI first
      try {
        // Cast topics to expected tuple type (we know topics[0] exists from check above)
        const topics = (log.topics || []) as unknown as [`0x${string}`, ...`0x${string}`[]];
        const decoded = decodeEventLog({
          abi: coinFactoryABI,
          data: (log.data || '0x') as `0x${string}`,
          topics: topics.length > 0 ? topics : ([] as []),
        });
        
        // The decoded event should have a 'coin' field
        if ((decoded as any).args?.coin) {
          console.log('   ✅ Decoded coin address via SDK ABI');
          return (decoded as any).args.coin as Address;
        }
        if ((decoded as any).coin) {
          console.log('   ✅ Decoded coin address via SDK ABI (direct)');
          return (decoded as any).coin as Address;
        }
      } catch (sdkDecodeError) {
        console.log('   📋 SDK ABI decode failed, trying manual decode...');
      }

      // Manual decode: CoinCreatedV4 data layout
      // The data contains: currency, uri, name, symbol, coin, poolConfig
      // Since uri, name, symbol are dynamic (strings), they use offset pointers
      // We need to find the coin address which is a static address type
      // 
      // ABI: (address currency, string uri, string name, string symbol, address coin, tuple poolConfig)
      // The coin address is at a specific offset in the decoded data
      try {
        // Decode the data portion
        const decodedData = decodeAbiParameters(
          [
            { type: 'address', name: 'currency' },
            { type: 'string', name: 'uri' },
            { type: 'string', name: 'name' },
            { type: 'string', name: 'symbol' },
            { type: 'address', name: 'coin' },
            { type: 'tuple', name: 'poolConfig', components: [
              { type: 'int32', name: 'minTick' },
              { type: 'int32', name: 'maxTick' },
              { type: 'int32', name: 'tickSpacing' },
            ]},
          ],
          log.data as `0x${string}`
        );

        const coinAddress = decodedData[4] as Address;
        if (coinAddress && coinAddress !== zeroAddress) {
          console.log(`   ✅ Manually decoded coin address: ${coinAddress}`);
          return coinAddress;
        }
      } catch (manualDecodeError) {
        console.log(`   ⚠️ Manual decode failed: ${manualDecodeError}`);
      }

      // Fallback: Look for any address that's not a known contract
      // In the logs, the coin contract often emits events too
      // Find Transfer event from 0x0 (mint) - the contract emitting this is the coin
      console.log('   📋 Trying fallback: looking for Transfer mint event...');
    }

    // Fallback approach: Find Transfer event from zero address (mint)
    // The contract that emits this Transfer is the coin itself
    const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
    
    for (const log of receipt.logs) {
      if (!log.topics || log.topics[0]?.toLowerCase() !== TRANSFER_TOPIC.toLowerCase()) {
        continue;
      }
      
      // Check if 'from' (topic 1) is zero address (this is a mint)
      if (log.topics[1]?.toLowerCase() === '0x0000000000000000000000000000000000000000000000000000000000000000') {
        // This contract is minting tokens - it's likely the coin contract
        const potentialCoin = log.address as Address;
        
        // Verify it's not the factory or other known contracts
        if (potentialCoin.toLowerCase() !== factoryAddress.toLowerCase()) {
          console.log(`   ✅ Found coin via Transfer mint event: ${potentialCoin}`);
          return potentialCoin;
        }
      }
    }
  } catch (error) {
    console.warn('Error extracting Zora coin address from logs:', error);
  }

  console.log('   ⚠️ Could not extract coin address from any method');
  return null;
}

