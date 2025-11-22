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
    const metadataGatewayUrl = metadataURI.startsWith('ipfs://')
      ? `https://${metadataURI.replace('ipfs://', '')}.ipfs.w3s.link/${releaseId}-${metadataFilename}`
      : metadataURI;

    console.log(`   Name:     ${title}`);
    console.log(`   Symbol:   ${coinSymbol}`);
    console.log(`   Payout:   ${splitAddress}`);
    console.log(`   Creator:  ${creatorAddress}`);
    console.log(`   Gateway URL: ${metadataGatewayUrl}`);
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
        metadataGatewayUrl,      // uri (HTTP gateway URL)
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

