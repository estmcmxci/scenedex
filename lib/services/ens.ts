import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { namehash, normalize } from 'viem/ens';
import { encodeAbiParameters, encodeFunctionData, createPublicClient, createWalletClient, http, Hex, keccak256, zeroAddress, toBytes, encodePacked, Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import type { Release } from '../types';

// Config
const PARENT_DOMAIN = process.env.ENS_DOMAIN || 'scenius.basetest.eth';
const PARENT_NODE = (process.env.ENS_PARENT_NODE as `0x${string}`) || namehash(PARENT_DOMAIN);
const RESOLVER = process.env.BASENAMES_UPGRADEABLE_RESOLVER_BASE_SEPOLIA!;
const REGISTRAR_CONTROLLER = process.env.BASENAMES_UPGRADEABLE_CONTROLLER_BASE_SEPOLIA!;
const REVERSE_REGISTRAR = process.env.BASENAMES_REVERSE_REGISTRAR_BASE_SEPOLIA!;
const ENS_SERVICE_NAMESPACE = process.env.ENS_SERVICE_NAMESPACE || 'eth.scenedex';
const ENS_SUBNAME_PREFIX = process.env.ENS_SUBNAME_PREFIX || 'EROS'; // Configurable prefix (e.g., SOMA, EROS)

// DEBUG: Log what prefix is actually being used
console.log(`🔍 ENS DEBUG: ENS_SUBNAME_PREFIX loaded as "${ENS_SUBNAME_PREFIX}" from env: "${process.env.ENS_SUBNAME_PREFIX}"`)

/**
 * Get namehash with REQUIRED normalization
 * Critical: Must normalize ENS names before hashing (ENSIP-15)
 */
function getNamehash(name: string): `0x${string}` {
  const normalizedName = normalize(name);
  return namehash(normalizedName);
}

/**
 * Check if basename is available on Basenames
 * Returns true if basename is available (not registered)
 */
export async function checkSubnameExists(
  label: string
): Promise<boolean> {
  const rpcUrl = process.env.BASE_RPC_URL!;

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(rpcUrl),
  });

  const REGISTRAR_CONTROLLER_ABI = [
    {
      name: 'available',
      type: 'function',
      inputs: [{ name: 'name', type: 'string' }],
      outputs: [{ type: 'bool' }],
      stateMutability: 'view',
    },
  ] as const;

  try {
    const normalizedLabel = normalize(label);
    console.log(`      🔍 Checking Basenames availability for "${normalizedLabel}"...`);
    
    const isAvailable = await publicClient.readContract({
      address: REGISTRAR_CONTROLLER,
      abi: REGISTRAR_CONTROLLER_ABI,
      functionName: 'available',
      args: [normalizedLabel],
    });

    console.log(`      📊 Basenames available: ${isAvailable}`);

    // If available, subname does NOT exist (inverse logic for compatibility)
    return !isAvailable;
  } catch (error) {
    // available() reverted = assume name doesn't exist (available)
    console.log(`      ⚠️  available() reverted - assuming subname does NOT exist`);
    console.log(`      Error: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

/**
 * Get next available EROS number by checking Basenames availability
 */
export async function getNextEROSNumber(): Promise<number> {
  const rpcUrl = process.env.BASE_RPC_URL!;

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(rpcUrl),
  });
  
  console.log(`   Domain: ${PARENT_DOMAIN}`);
  console.log(`   Resolver: ${RESOLVER}`);

  // Resolver ABI for reading addr records
  const RESOLVER_ABI = [
    {
      name: 'addr',
      type: 'function',
      inputs: [{ name: 'node', type: 'bytes32' }],
      outputs: [{ type: 'address' }],
      stateMutability: 'view',
    },
  ];

  let nextNumber = 1;
  const maxAttempts = 100; // Safety limit
  
  console.log(`\n🔍 Checking for next available ${ENS_SUBNAME_PREFIX} number...`);
  
  const REGISTRY_ADDRESS = '0x1493b2567056c2181630115660963E13A8E32735' as `0x${string}`;
  
  while (nextNumber <= maxAttempts) {
    const subnameLabel = `${ENS_SUBNAME_PREFIX}${String(nextNumber).padStart(3, '0')}`;
    const normalizedLabel = normalize(subnameLabel);
    const fullSubname = `${normalizedLabel}.${PARENT_DOMAIN}`;
    const subnameNode = namehash(fullSubname);

    try {
      // Check Registry directly first (catches both RegistrarController and direct registrations)
      console.log(`   Checking ${subnameLabel} availability...`);
      
      const REGISTRY_ABI = [
        {
          name: 'owner',
          type: 'function',
          stateMutability: 'view',
          inputs: [{ name: 'node', type: 'bytes32' }],
          outputs: [{ type: 'address' }],
        },
      ] as const;
      
      const owner = await publicClient.readContract({
        address: REGISTRY_ADDRESS,
        abi: REGISTRY_ABI,
        functionName: 'owner',
        args: [subnameNode],
      });

      // If owner is zero address, subname doesn't exist (available)
      if (owner === '0x0000000000000000000000000000000000000000') {
        console.log(`      Available: true (not in Registry)`);
        console.log(`   ✅ ${subnameLabel} is available!\n`);
        return nextNumber;
      } else {
        console.log(`      Available: false (owner: ${owner})`);
        console.log(`   ⚠️  ${subnameLabel} is already registered - skipping`);
        nextNumber++;
        continue;
      }
    } catch (error) {
      // If Registry check fails, fall back to RegistrarController check
      console.log(`   ⚠️  Registry check failed, trying RegistrarController...`);
      console.log(`      Error: ${error instanceof Error ? error.message : String(error)}`);
      
      try {
        const REGISTRAR_CONTROLLER_ABI = [
          {
            name: 'available',
            type: 'function',
            inputs: [{ name: 'name', type: 'string' }],
            outputs: [{ type: 'bool' }],
            stateMutability: 'view',
          },
        ] as const;
        
        const isAvailable = await publicClient.readContract({
          address: REGISTRAR_CONTROLLER,
          abi: REGISTRAR_CONTROLLER_ABI,
          functionName: 'available',
          args: [normalizedLabel],
        });

        console.log(`      RegistrarController available: ${isAvailable}`);
          
        if (isAvailable) {
          console.log(`   ✅ ${subnameLabel} is available!\n`);
          return nextNumber;
        } else {
          console.log(`   ⚠️  ${subnameLabel} is already registered - skipping`);
          nextNumber++;
          continue;
        }
      } catch (fallbackError) {
        // If both checks fail, assume name is available (conservative approach)
        console.log(`   ⚠️  Both checks failed for ${subnameLabel}, assuming available`);
        console.log(`      Fallback error: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`);
        console.log(`   ✅ ${subnameLabel} is available!\n`);
        return nextNumber;
      }
    }
  }
  
  throw new Error(`Could not find available ${ENS_SUBNAME_PREFIX} number after ${maxAttempts} attempts`);
}

/**
 * Format subname number with prefix and padding (e.g., 1 -> "SOMA001", 1 -> "EROS001")
 */
export function formatEROSNumber(number: number): string {
  return `${ENS_SUBNAME_PREFIX}${String(number).padStart(3, '0')}`;
}

/**
 * Build text records from Release schema
 * Maps all release data to ENS text record key-value pairs
 */
export function buildRecordsFromRelease(
  release: Release,
  coinAddress: string,
  coinSymbol: string,
  splitAddress: string,
  creatorAddress: string,
  erosNumber: number
): Record<string, string> {
  const eros = formatEROSNumber(erosNumber);

  return {
    // ENSIP-5 Standard Global Keys
    avatar: `ipfs://${release.coverImageIPFSHash}`,
    description: release.description || 'Release on Scenedex',
    address: creatorAddress, // Standard addr record - makes name resolve to creator

    // Custom Catalogue Service Keys (eth.scenedex.*)
    [`${ENS_SERVICE_NAMESPACE}.releaseId`]: eros,
    [`${ENS_SERVICE_NAMESPACE}.artists`]: release.artists || 'Unknown',
    [`${ENS_SERVICE_NAMESPACE}.mediaIPFS`]: release.mediaIPFSHash,
    [`${ENS_SERVICE_NAMESPACE}.metadataURI`]: release.metadataURI || 'PENDING',
    [`${ENS_SERVICE_NAMESPACE}.zoraCoinAddress`]: coinAddress,
    [`${ENS_SERVICE_NAMESPACE}.zoraCoinSymbol`]: coinSymbol,
    [`${ENS_SERVICE_NAMESPACE}.splitAddress`]: splitAddress,
  };
}

/**
 * Build array of setText transactions for Safe batching
 * Each transaction is independent and can be executed in one Safe batch call
 */
export function buildSetTextTransactions(
  node: string,
  records: Record<string, string>
): Array<{ to: string; value: string; data: string }> {
  // Resolver ABI for setText function
  const RESOLVER_ABI = [
    {
      name: 'setText',
      type: 'function',
      inputs: [
        { name: 'node', type: 'bytes32' },
        { name: 'key', type: 'string' },
        { name: 'value', type: 'string' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
  ];

  return Object.entries(records).map(([key, value]) => ({
    to: RESOLVER,
    value: '0',
    // Use encodeFunctionData to get complete call data (selector + params)
    data: encodeFunctionData({
      abi: RESOLVER_ABI,
      functionName: 'setText',
      args: [node as `0x${string}`, key, value],
    }),
  }));
}

/**
 * Main ENS registration function
 * Called after Zora coin is deployed
 * Prepares ENS subname and transaction array for Safe execution
 *
 * @param release - The release object with metadata
 * @param coinAddress - Address of deployed Zora coin
 * @param coinSymbol - Symbol of deployed Zora coin (e.g., 'SOMA001', 'EROS001')
 * @param splitAddress - Address of deployed split contract (for revenue distribution)
 * @param creatorAddress - Creator's wallet address (for addr record)
 * @param erosNumber - Optional: EROS number to use (if already allocated). If not provided, will get next available.
 */
export async function registerEROSRelease(
  release: Release,
  coinAddress: string,
  coinSymbol: string,
  splitAddress: string,
  creatorAddress: string,
  erosNumber?: number
): Promise<{
  subnameLabel: string;
  subnameNode: string;
  records: Record<string, string>;
  transactions: Array<{ to: string; value: string; data: string }>;
  batchSize: number;
}> {
  console.log(`\n📍 Preparing ENS Registration...`);
  console.log(`🔍 ENS_SUBNAME_PREFIX at registerEROSRelease call time: "${ENS_SUBNAME_PREFIX}"`);
  console.log(`🔍 process.env.ENS_SUBNAME_PREFIX: "${process.env.ENS_SUBNAME_PREFIX}"`);

  // Get next available EROS number (or use provided one)
  const finalErosNumber = erosNumber !== undefined ? erosNumber : await getNextEROSNumber();
  const subnameLabel = formatEROSNumber(finalErosNumber);
  console.log(`🔍 Generated subnameLabel: "${subnameLabel}" (from erosNumber=${finalErosNumber}${erosNumber !== undefined ? ' [pre-allocated]' : ' [newly allocated]'})`);
  
  const fullSubname = `${subnameLabel}.${PARENT_DOMAIN}`;

  // Calculate subname node (with normalization)
  const subnameNode = getNamehash(fullSubname);
  console.log(`🔍 DEBUG: subnameLabel="${subnameLabel}", parentDomain="${PARENT_DOMAIN}", fullSubname="${fullSubname}"`);
  console.log(`   Subname: ${fullSubname}`);
  console.log(`   Node: ${subnameNode}`);

  // Build text records
  const records = buildRecordsFromRelease(release, coinAddress, coinSymbol, splitAddress, creatorAddress, finalErosNumber);
  console.log(`   Records: ${Object.keys(records).length} text records`);

  // Build transactions
  const transactions = buildSetTextTransactions(subnameNode, records);
  console.log(`   Transactions: ${transactions.length} setText calls`);

  console.log(`✅ ENS registration prepared\n`);

  return {
    subnameLabel,
    subnameNode,
    records,
    transactions,
    batchSize: transactions.length,
  };
}

/**
 * Approve operator on NameWrapper for future subname management
 * @deprecated This function is for ENS NameWrapper which doesn't exist in Basenames.
 * Basenames uses BaseRegistrar (ERC721) which uses standard ERC721 approval methods.
 * This function is kept for backward compatibility but may not work with Basenames.
 */
export async function approveOperatorOnNameWrapper(
  operatorAddress: string
): Promise<string> {
  console.log(`\n🔐 Approving operator on NameWrapper...`);
  console.log(`   ⚠️  WARNING: This function is for ENS NameWrapper, not Basenames`);

  const rpcUrl = process.env.BASE_RPC_URL!;
  const privateKey = process.env.CURATOR_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error('CURATOR_PRIVATE_KEY not set in .env.local');
  }

  // Note: Basenames doesn't have NameWrapper, uses BaseRegistrar instead
  // This address is kept for compatibility but may not work
  const NAMEWRAPPER_ADDRESS = (process.env.ENS_NAMEWRAPPER_SEPOLIA || '0x0635513f179D50A207757E05759CbD106d7dFcE8') as `0x${string}`;

  const APPROVAL_ABI = [
    {
      name: 'setApprovalForAll',
      type: 'function',
      inputs: [
        { name: 'operator', type: 'address' },
        { name: 'approved', type: 'bool' },
      ],
    },
  ];

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(rpcUrl),
  });

  const account = privateKeyToAccount(privateKey as Hex);
  const walletClient = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(rpcUrl),
  });

  try {
    console.log(`   Operator: ${operatorAddress}`);
    console.log(`   NameWrapper: ${NAMEWRAPPER_ADDRESS}\n`);

    const txHash = await walletClient.writeContract({
      account,
      address: NAMEWRAPPER_ADDRESS,
      abi: APPROVAL_ABI,
      functionName: 'setApprovalForAll',
      args: [operatorAddress as `0x${string}`, true],
    });

    console.log(`   ✅ Transaction sent: ${txHash}`);

    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
    console.log(`   ✅ Confirmed (block ${receipt.blockNumber})\n`);

    return txHash;
  } catch (error) {
    console.error('❌ Failed to approve operator:', error);
    throw error;
  }
}

/**
 * Create Basename via RegistrarController on Base Sepolia
 * Uses RegistrarController.register() to create basename with resolver in one transaction
 *
 * @param subnameLabel - e.g., "EROS001" (from ENS_SUBNAME_PREFIX env var)
 * @param parentNode - Namehash of parent domain (e.g., scenius.basetest.eth) - unused but kept for compatibility
 * @returns Transaction hash
 */
export async function createENSSubname(
  subnameLabel: string,
  parentNode: string
): Promise<string> {
  console.log(`\n📝 Creating Basename via RegistrarController on Base Sepolia...`);

  const rpcUrl = process.env.BASE_RPC_URL!;
  const privateKey = process.env.CURATOR_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error('CURATOR_PRIVATE_KEY not set in .env.local');
  }

  // CRITICAL: Normalize label using viem/ens normalize() (ENSIP-15)
  const normalizedLabel = normalize(subnameLabel);
  console.log(`   🔤 Normalizing label: "${subnameLabel}" → "${normalizedLabel}"`);

  // Minimum registration duration (1 year)
  const MIN_DURATION = 365 * 24 * 60 * 60;

  // RegistrarController ABI
  const REGISTRAR_CONTROLLER_ABI = [
    {
      name: 'registerPrice',
      type: 'function',
      stateMutability: 'view',
      inputs: [
        { name: 'name', type: 'string' },
        { name: 'duration', type: 'uint256' },
      ],
      outputs: [{ type: 'uint256' }],
    },
    {
      name: 'register',
      type: 'function',
      stateMutability: 'payable',
      inputs: [
        {
          name: 'request',
          type: 'tuple',
          components: [
            { name: 'name', type: 'string' },
        { name: 'owner', type: 'address' },
            { name: 'duration', type: 'uint256' },
        { name: 'resolver', type: 'address' },
            { name: 'data', type: 'bytes[]' },
            { name: 'reverseRecord', type: 'bool' },
          ],
        },
      ],
      outputs: [],
    },
  ] as const;

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(rpcUrl),
  });

  const account = privateKeyToAccount(privateKey as Hex);
  const walletClient = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(rpcUrl),
  });

  // Use the derived address from the private key
  const ownerAddress = account.address;

  try {
    // Step 1: Get registration price
    console.log(`\n💰 Getting registration price...`);
    const price = await publicClient.readContract({
      address: REGISTRAR_CONTROLLER,
      abi: REGISTRAR_CONTROLLER_ABI,
      functionName: 'registerPrice',
      args: [normalizedLabel, BigInt(MIN_DURATION)],
    });
    console.log(`   Price: ${price.toString()} wei (${(Number(price) / 1e18).toFixed(6)} ETH)`);

    // Step 2: Build RegisterRequest (empty data array - records set separately)
    const request = {
      name: normalizedLabel,
      owner: ownerAddress,
      duration: BigInt(MIN_DURATION),
      resolver: RESOLVER,
      data: [] as `0x${string}`[], // Empty - records set separately via executeENSRecords
      reverseRecord: false,
    };

    console.log(`   Label: ${normalizedLabel} (normalized)`);
    console.log(`   Owner: ${ownerAddress}`);
    console.log(`   Resolver: ${RESOLVER}`);
    console.log(`   Duration: ${MIN_DURATION} seconds (1 year)`);
    console.log(`   Controller: ${REGISTRAR_CONTROLLER}\n`);

    // Step 3: Simulate transaction
    console.log(`   📋 Simulating registration...`);
    try {
      await publicClient.simulateContract({
        account,
        address: REGISTRAR_CONTROLLER,
        abi: REGISTRAR_CONTROLLER_ABI,
        functionName: 'register',
        args: [request],
        value: price,
      });
      console.log(`      📋 Simulation passed\n`);
    } catch (simErr) {
      console.error(`      ❌ Simulation failed: ${simErr}\n`);
      throw simErr;
    }

    // Step 4: Execute transaction
    const txHash = await walletClient.writeContract({
      address: REGISTRAR_CONTROLLER,
      abi: REGISTRAR_CONTROLLER_ABI,
      functionName: 'register',
      args: [request],
      value: price,
    });

    console.log(`      ✅ Tx sent: ${txHash}`);
    const receipt = await publicClient.waitForTransactionReceipt({ 
      hash: txHash,
      confirmations: 2
    });
    console.log(`      ✅ Confirmed (block ${receipt.blockNumber}, status: ${receipt.status})\n`);
    
    // Additional delay to ensure state propagates
    console.log(`      ⏳ Waiting 3 seconds for state to propagate...`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(`      ✅ Ready to set records\n`);

    return txHash;
  } catch (error) {
    console.error('❌ Failed to create basename:', error);
    throw error;
  }
}

/**
 * Execute Basenames setText transactions on Base Sepolia
 * Broadcasts all transactions and waits for confirmation
 * Note: With Basenames, records can be batched in registration, but this function
 * is kept for legacy flow support and updating existing names.
 *
 * @param records - Record key-value pairs to set
 * @param subnameNode - The namehash of the subname
 * @param creatorAddress - Creator's address for setAddr resolution
 * @returns Array of transaction hashes
 */
export async function executeENSRecords(
  records: Record<string, string>,
  subnameNode: string,
  creatorAddress?: string
): Promise<string[]> {
  console.log(`\n🚀 Executing Basenames records on Base Sepolia...`);

  const rpcUrl = process.env.BASE_RPC_URL!;
  const privateKey = process.env.CURATOR_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error('CURATOR_PRIVATE_KEY not set in .env.local');
  }

  // Create clients
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(rpcUrl),
  });

  const account = privateKeyToAccount(privateKey as Hex);
  const walletClient = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(rpcUrl),
  });

  const txHashes: string[] = [];

  // Resolver ABI for setText and setAddr
  const RESOLVER_ABI = [
    {
      name: 'setText',
      type: 'function',
      inputs: [
        { name: 'node', type: 'bytes32' },
        { name: 'key', type: 'string' },
        { name: 'value', type: 'string' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      name: 'setAddr',
      type: 'function',
      inputs: [
        { name: 'node', type: 'bytes32' },
        { name: 'addr', type: 'address' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
  ];

  const DELAY = 1000; // 1 second between transactions
  const recordEntries = Object.entries(records);

  try {
    // First, set the address record using setAddr() for proper resolution
    if (creatorAddress) {
      console.log(`\n   [0/11] Setting primary address record (setAddr)...`);
        console.log(`      Resolver: ${RESOLVER}`);
      console.log(`      Node: ${subnameNode}`);
      console.log(`      Address: ${creatorAddress}\n`);

      try {
        // First, simulate the transaction to check for errors
        console.log(`      📋 Simulating setAddr call...`);
        try {
          // DEBUG: Log exact parameters being used
          console.log(`      🔍 DEBUG setAddr parameters:`);
            console.log(`         Resolver: ${RESOLVER}`);
          console.log(`         Node: ${subnameNode}`);
          console.log(`         Address to set: ${creatorAddress}`);
          console.log(`         Account signing: ${walletClient.account?.address}`);
          console.log(`         Account from privateKey: ${account.address}`);
          
          const { result } = await publicClient.simulateContract({
            account: walletClient.account,
              address: RESOLVER,
            abi: RESOLVER_ABI,
            functionName: 'setAddr',
            args: [subnameNode as `0x${string}`, creatorAddress as `0x${string}`],
          });
          console.log(`      ✅ Simulation successful\n`);
        } catch (simError) {
          const simMsg = simError instanceof Error ? simError.message : String(simError);
          const simData = (simError as any)?.data || (simError as any)?.error?.data;
          console.error(`      ❌ Simulation failed!`);
          console.error(`         Error: ${simMsg}`);
          if (simData) {
            console.error(`         Error data: ${JSON.stringify(simData)}`);
          }
          console.error(``);
          throw simError;
        }

        // If simulation passed, execute the transaction
        console.log(`      🚀 Executing setAddr transaction...`);
        const txHash = await walletClient.writeContract({
            address: RESOLVER,
          abi: RESOLVER_ABI,
          functionName: 'setAddr',
          args: [subnameNode as `0x${string}`, creatorAddress as `0x${string}`],
        });

        console.log(`      ✅ Tx sent: ${txHash}`);
        txHashes.push(txHash);

        // Wait for confirmation with detailed logging
        console.log(`      ⏳ Waiting for confirmation...`);
        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

        if (receipt.status === 'success') {
          console.log(`      ✅ Confirmed (block ${receipt.blockNumber})`);
          console.log(`      📊 Gas used: ${receipt.gasUsed}`);
          console.log(`      📝 Logs: ${receipt.logs.length} events\n`);
        } else {
          console.error(`      ❌ Transaction reverted!`);
          console.error(`         Block: ${receipt.blockNumber}`);
          console.error(`         Status: ${receipt.status}\n`);
          throw new Error(`setAddr transaction reverted`);
        }

        // Delay before text records
        await new Promise(resolve => setTimeout(resolve, DELAY));
      } catch (addrError) {
        const errorMsg = addrError instanceof Error ? addrError.message : String(addrError);
        const errorData = addrError instanceof Error && 'data' in addrError ? (addrError as any).data : null;

        console.error(`   ❌ FAILED TO SET ADDRESS RECORD`);
        console.error(`      Error Message: ${errorMsg}`);
        if (errorData) {
          console.error(`      Error Data: ${errorData}`);
        }

        // Check for common error patterns
        if (errorMsg.includes('permission') || errorMsg.includes('Unauthorized')) {
          console.error(`      💡 Likely cause: Permission denied. Caller may not have authority over this node.`);
        } else if (errorMsg.includes('revert')) {
          console.error(`      💡 Transaction reverted. This could be a permission issue or invalid input.`);
        } else if (errorMsg.includes('nonce')) {
          console.error(`      💡 Nonce mismatch. Another transaction may have been sent.`);
        }

        console.error(`\n      ⚠️ Continuing with other records (non-fatal)\n`);
        // Don't throw - continue with other records
      }
    }

    // Then, set text records
    for (let i = 0; i < recordEntries.length; i++) {
      const entry = recordEntries[i];
      if (!entry) continue;
      const [key, value] = entry;

      console.log(`   [${i + 1}/${recordEntries.length}] Setting: ${key}`);

      try {
        // First, simulate the setText transaction
        console.log(`      📋 Simulating setText("${key.substring(0, 40)}${key.length > 40 ? '...' : ''}")`);
        try {
          await publicClient.simulateContract({
            account: walletClient.account,
            address: RESOLVER,
            abi: RESOLVER_ABI,
            functionName: 'setText',
            args: [subnameNode as `0x${string}`, key, value],
          });
          console.log(`      ✅ Simulation passed`);
        } catch (simError) {
          const simMsg = simError instanceof Error ? simError.message : String(simError);
          console.warn(`      ⚠️ Simulation failed: ${simMsg.substring(0, 100)}`);
          console.warn(`         Attempting to execute anyway...\n`);
        }

        // Execute the transaction
        const txHash = await walletClient.writeContract({
          address: RESOLVER,
          abi: RESOLVER_ABI,
          functionName: 'setText',
          args: [subnameNode as `0x${string}`, key, value],
        });

        console.log(`      ✅ Tx sent: ${txHash}`);
        txHashes.push(txHash);

        // Wait for confirmation
        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

        if (receipt.status === 'success') {
          console.log(`      ✅ Confirmed (block ${receipt.blockNumber})\n`);
        } else {
          console.warn(`      ⚠️ Transaction reverted (block ${receipt.blockNumber})\n`);
        }
      } catch (txError) {
        const msg = txError instanceof Error ? txError.message : String(txError);
        console.warn(`   ⚠️ Failed to set ${key}`);
        console.warn(`      Error: ${msg.substring(0, 150)}`);

        // Diagnostic hints
        if (msg.includes('permission') || msg.includes('Unauthorized')) {
          console.warn(`      💡 Likely cause: Permission/ownership issue`);
        } else if (msg.includes('revert')) {
          console.warn(`      💡 Transaction reverted - check permissions and node validity`);
        }
        console.warn(`\n`);
        // Continue to next record
      }

      // Delay before next transaction
      if (i < recordEntries.length - 1) {
        await new Promise(resolve => setTimeout(resolve, DELAY));
      }
    }

    console.log(`✅ All ${txHashes.length} ENS records executed successfully!\n`);
    return txHashes;
  } catch (error) {
    console.error('❌ Failed to execute ENS records:', error);
    throw error;
  }
}

// ============================================================================
// SAFE TRANSACTION CALLDATA FUNCTIONS
// These functions return calldata for Safe to execute (instead of executing directly)
// ============================================================================

/**
 * Get calldata for creating ENS subname via NameWrapper
 * @deprecated This function is for ENS NameWrapper which doesn't exist in Basenames.
 * Use getENSCompleteCalldata() instead, which batches everything into RegistrarController.register().
 * This function is kept for backward compatibility but may not work with Basenames.
 * 
 * @param subnameLabel - e.g., "EROS001"
 * @param parentNode - Namehash of parent domain (e.g., scenius.basetest.eth)
 * @param ownerAddress - Address that will own the subname (should be Safe address)
 * @returns Calldata for setSubnodeRecord call
 */
export function getENSSubnameCalldata(
  subnameLabel: string,
  parentNode: string,
  ownerAddress: string
): { to: string; data: string; value: string } {
  console.log(`\n📝 Preparing ENS subname calldata...`);

  const NAMEWRAPPER_ADDRESS = (process.env.ENS_NAMEWRAPPER_SEPOLIA || '0x0635513f179D50A207757E05759CbD106d7dFcE8') as `0x${string}`;
  const resolver = process.env.ENS_RESOLVER_SEPOLIA as `0x${string}`;
  
  if (!resolver) {
    throw new Error('ENS_RESOLVER_SEPOLIA not set in .env.local');
  }

  // Normalize label
  const normalizedLabel = normalize(subnameLabel);
  console.log(`   Label: "${subnameLabel}" → "${normalizedLabel}" (normalized)`);

  // Calculate expiry: 1 year in the future
  const now = Math.floor(Date.now() / 1000);
  const oneYearInSeconds = 365 * 24 * 60 * 60;
  const expiryTimestamp = BigInt(now + oneYearInSeconds);

  // NameWrapper ABI for setSubnodeRecord
  const NAMEWRAPPER_ABI = [
    {
      name: 'setSubnodeRecord',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'parentNode', type: 'bytes32' },
        { name: 'label', type: 'string' },
        { name: 'owner', type: 'address' },
        { name: 'resolver', type: 'address' },
        { name: 'ttl', type: 'uint64' },
        { name: 'fuses', type: 'uint32' },
        { name: 'expiry', type: 'uint64' },
      ],
      outputs: [],
    },
  ];

  const calldata = encodeFunctionData({
    abi: NAMEWRAPPER_ABI,
    functionName: 'setSubnodeRecord',
    args: [
      parentNode as `0x${string}`,
      normalizedLabel,
      ownerAddress as `0x${string}`,
      resolver,
      BigInt(0), // ttl
      0, // fuses (no fuses burned)
      expiryTimestamp,
    ],
  });

  console.log(`   ✅ Calldata prepared for setSubnodeRecord`);
  console.log(`      To: ${NAMEWRAPPER_ADDRESS}`);
  console.log(`      Owner: ${ownerAddress}`);
  console.log(`      Resolver: ${resolver}`);

  return {
    to: NAMEWRAPPER_ADDRESS,
    data: calldata,
    value: '0',
  };
}

/**
 * Get calldata for setting ENS address record (setAddr)
 * Returns calldata that Safe can execute
 * 
 * @param subnameNode - Namehash of the subname
 * @param creatorAddress - Address to set as the primary address
 * @returns Calldata for setAddr call
 */
export function getENSAddressRecordCalldata(
  subnameNode: string,
  creatorAddress: string
): { to: string; data: string; value: string } {
  console.log(`\n📝 Preparing Basenames address record calldata...`);

  // Resolver ABI for setAddr
  const RESOLVER_ABI = [
    {
      name: 'setAddr',
      type: 'function',
      inputs: [
        { name: 'node', type: 'bytes32' },
        { name: 'addr', type: 'address' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
  ];

  const calldata = encodeFunctionData({
    abi: RESOLVER_ABI,
    functionName: 'setAddr',
    args: [subnameNode as `0x${string}`, creatorAddress as `0x${string}`],
  });

  console.log(`   ✅ Calldata prepared for setAddr`);
  console.log(`      To: ${RESOLVER}`);
  console.log(`      Node: ${subnameNode}`);
  console.log(`      Address: ${creatorAddress}`);

  return {
    to: RESOLVER,
    data: calldata,
    value: '0',
  };
}

/**
 * Get complete Basenames calldata for all operations
 * Returns SINGLE operation that batches everything:
 * - Creates basename via RegistrarController.register()
 * - Sets address record (setAddr) via data[] parameter
 * - Sets all text records (setText × 11) via data[] parameter
 * 
 * @param release - Release data
 * @param coinAddress - Zora coin address
 * @param coinSymbol - Zora coin symbol
 * @param splitAddress - Splits contract address
 * @param creatorAddress - Creator's address
 * @param safeAddress - Safe address (will own the basename)
 * @param erosNumber - Optional EROS number (if not provided, will get next available)
 * @returns Array with SINGLE calldata operation for Safe to execute (1 tx instead of 13)
 */
export async function getENSCompleteCalldata(
  release: Release,
  coinAddress: string,
  coinSymbol: string,
  splitAddress: string,
  creatorAddress: string,
  safeAddress: string,
  erosNumber?: number
): Promise<Array<{ to: string; data: string; value: string }>> {
  console.log(`\n📦 Preparing complete Basenames calldata for Safe transaction...`);

  const rpcUrl = process.env.BASE_RPC_URL!;
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(rpcUrl),
  });

  // Get subname details (reuse registerEROSRelease logic)
  const finalErosNumber = erosNumber !== undefined ? erosNumber : await getNextEROSNumber();
  const subnameLabel = formatEROSNumber(finalErosNumber);
  const normalizedLabel = normalize(subnameLabel);
  const fullSubname = `${normalizedLabel}.${PARENT_DOMAIN}`;
  const subnameNode = getNamehash(fullSubname);

  console.log(`   Subname: ${fullSubname}`);
  console.log(`   Label: ${normalizedLabel} (normalized)`);
  console.log(`   Node: ${subnameNode}`);
  console.log(`   Owner: ${safeAddress}`);

  // Step 0: Check who owns the baseNode to determine which flow to use
  console.log(`\n🔍 Checking baseNode ownership to determine registration method...`);
  const REGISTRY_ADDRESS = '0x1493b2567056c2181630115660963E13A8E32735' as `0x${string}`;
  const BASE_REGISTRAR = process.env.BASENAMES_BASE_REGISTRAR_BASE_SEPOLIA as `0x${string}`;
  
  let baseNodeOwner: string;
  try {
    baseNodeOwner = await publicClient.readContract({
      address: REGISTRY_ADDRESS,
      abi: [{
        name: 'owner',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'node', type: 'bytes32' }],
        outputs: [{ type: 'address' }],
      }],
      functionName: 'owner',
      args: [PARENT_NODE],
    });
    console.log(`   BaseNode owner: ${baseNodeOwner}`);
    console.log(`   BaseRegistrar: ${BASE_REGISTRAR}`);
  } catch (error) {
    console.warn(`   ⚠️  Could not check ownership, defaulting to RegistrarController flow`);
    baseNodeOwner = BASE_REGISTRAR || '';
  }

  const useRegistrarController = baseNodeOwner.toLowerCase() === BASE_REGISTRAR?.toLowerCase();
  
  if (useRegistrarController) {
    console.log(`   ✅ Using RegistrarController flow (BaseRegistrar owns baseNode)`);
    console.log(`   💰 Payment required: ~0.001 ETH`);
    return await getRegistrarControllerCalldata(
      release,
      coinAddress,
      coinSymbol,
      splitAddress,
      creatorAddress,
      safeAddress,
      finalErosNumber,
      normalizedLabel,
      fullSubname,
      subnameNode,
      publicClient
    );
  } else {
    console.log(`   ✅ Using Direct Registry flow (User owns baseNode)`);
    console.log(`   🆓 FREE - No payment required`);
    return getDirectRegistryCalldata(
      release,
      coinAddress,
      coinSymbol,
      splitAddress,
      creatorAddress,
      safeAddress,
      finalErosNumber,
      normalizedLabel,
      fullSubname,
      subnameNode
    );
  }
}

/**
 * Get calldata using RegistrarController.register() (requires BaseRegistrar to own baseNode)
 */
async function getRegistrarControllerCalldata(
  release: Release,
  coinAddress: string,
  coinSymbol: string,
  splitAddress: string,
  creatorAddress: string,
  safeAddress: string,
  erosNumber: number,
  normalizedLabel: string,
  fullSubname: string,
  subnameNode: `0x${string}`,
  publicClient: any
): Promise<Array<{ to: string; data: string; value: string }>> {
  // Minimum registration duration (1 year)
  const MIN_DURATION = 365 * 24 * 60 * 60;

  // Step 1: Get registration price
  console.log(`\n💰 Getting registration price...`);
  const REGISTRAR_CONTROLLER_ABI = [
    {
      name: 'registerPrice',
      type: 'function',
      stateMutability: 'view',
      inputs: [
        { name: 'name', type: 'string' },
        { name: 'duration', type: 'uint256' },
      ],
      outputs: [{ type: 'uint256' }],
    },
    {
      name: 'register',
      type: 'function',
      stateMutability: 'payable',
      inputs: [
        {
          name: 'request',
          type: 'tuple',
          components: [
            { name: 'name', type: 'string' },
            { name: 'owner', type: 'address' },
            { name: 'duration', type: 'uint256' },
            { name: 'resolver', type: 'address' },
            { name: 'data', type: 'bytes[]' },
            { name: 'reverseRecord', type: 'bool' },
          ],
        },
      ],
      outputs: [],
    },
  ] as const;

  const price = await publicClient.readContract({
    address: REGISTRAR_CONTROLLER,
    abi: REGISTRAR_CONTROLLER_ABI,
    functionName: 'registerPrice',
    args: [normalizedLabel, BigInt(MIN_DURATION)],
  });
  console.log(`   Price: ${price.toString()} wei (${(Number(price) / 1e18).toFixed(6)} ETH)`);

  // Step 2: Build records
  const records = buildRecordsFromRelease(release, coinAddress, coinSymbol, splitAddress, creatorAddress, finalErosNumber);
  console.log(`\n📝 Building batched records data...`);
  console.log(`   Records: ${Object.keys(records).length} text records`);

  // Step 3: Build batched resolver data (setAddr + all setText calls)
  const recordsData: `0x${string}`[] = [];
  
  // Resolver ABI for encoding
  const RESOLVER_ABI_FOR_ENCODING = [
    {
      name: 'setAddr',
      type: 'function',
      inputs: [
        { name: 'node', type: 'bytes32' },
        { name: 'addr', type: 'address' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      name: 'setText',
      type: 'function',
      inputs: [
        { name: 'node', type: 'bytes32' },
        { name: 'key', type: 'string' },
        { name: 'value', type: 'string' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
  ] as const;

  // Add setAddr to batch
  recordsData.push(
    encodeFunctionData({
      abi: RESOLVER_ABI_FOR_ENCODING,
      functionName: 'setAddr',
      args: [subnameNode, creatorAddress as `0x${string}`],
    })
  );
  console.log(`   ✅ Added setAddr to batch`);

  // Add all setText calls to batch
  for (const [key, value] of Object.entries(records)) {
    recordsData.push(
      encodeFunctionData({
        abi: RESOLVER_ABI_FOR_ENCODING,
        functionName: 'setText',
        args: [subnameNode, key, value],
      })
    );
  }
  console.log(`   ✅ Added ${Object.keys(records).length} setText calls to batch`);

  // Step 4: Build RegisterRequest with batched data
  // Note: reverseRecord: false - we set reverse record separately for parent domain
  const request = {
    name: normalizedLabel,
    owner: safeAddress as `0x${string}`,
    duration: BigInt(MIN_DURATION),
    resolver: RESOLVER,
    data: recordsData, // ALL records batched (setAddr + 11 setText calls)
    reverseRecord: false, // Reverse record set separately for Safe → parent domain
  };

  // Step 5: Encode register() call
  const calldata = encodeFunctionData({
    abi: REGISTRAR_CONTROLLER_ABI,
    functionName: 'register',
    args: [request],
  });

  console.log(`\n✅ Complete Basenames calldata prepared: 1 operation (batched)`);
  console.log(`   Total records batched: ${recordsData.length} (1 setAddr + ${Object.keys(records).length} setText)`);
  console.log(`   Payment: ${price.toString()} wei\n`);

  // Return SINGLE operation (1 tx instead of 13)
  return [{
    to: REGISTRAR_CONTROLLER,
    data: calldata,
    value: price.toString(), // ETH payment required
  }];
}

/**
 * Get calldata using direct Registry methods (FREE, no payment, no BaseRegistrar required)
 */
function getDirectRegistryCalldata(
  release: Release,
  coinAddress: string,
  coinSymbol: string,
  splitAddress: string,
  creatorAddress: string,
  safeAddress: string,
  erosNumber: number,
  normalizedLabel: string,
  fullSubname: string,
  subnameNode: `0x${string}`
): Array<{ to: string; data: string; value: string }> {
  console.log(`\n📝 Building direct Registry calldata (FREE, no payment)...`);
  
  const operations: Array<{ to: string; data: string; value: string }> = [];
  const REGISTRY_ADDRESS = '0x1493b2567056c2181630115660963E13A8E32735' as `0x${string}`;
  
  // Build records
  const records = buildRecordsFromRelease(release, coinAddress, coinSymbol, splitAddress, creatorAddress, erosNumber);
  console.log(`   Records: ${Object.keys(records).length} text records`);
  
  // Label hash is keccak256 of the label bytes
  const labelHash = keccak256(toBytes(normalizedLabel));
  
  // Operation 1: Registry.setSubnodeRecord() - Creates subname + sets owner + resolver (FREE)
  const REGISTRY_ABI = [
    {
      name: 'setSubnodeRecord',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'node', type: 'bytes32' },
        { name: 'label', type: 'bytes32' },
        { name: 'owner', type: 'address' },
        { name: 'resolver', type: 'address' },
        { name: 'ttl', type: 'uint64' },
      ],
      outputs: [],
    },
  ] as const;
  
  operations.push({
    to: REGISTRY_ADDRESS,
    data: encodeFunctionData({
      abi: REGISTRY_ABI,
      functionName: 'setSubnodeRecord',
      args: [
        PARENT_NODE,
        labelHash,
        safeAddress as `0x${string}`,
        RESOLVER,
        0n, // TTL = 0 (default)
      ],
    }),
    value: '0', // FREE - no payment required
  });
  console.log(`   ✅ Added Registry.setSubnodeRecord() (creates subname, FREE)`);
  
  // Operation 2-N: Individual resolver operations (setAddr + setText × N)
  // WORKAROUND: resolver.multicall() fails when called from Safe, but individual operations work
  // So we create individual operations that Safe can batch in multi-send
  const RESOLVER_ABI = [
    {
      name: 'setAddr',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'node', type: 'bytes32' },
        { name: 'addr', type: 'address' },
      ],
      outputs: [],
    },
    {
      name: 'setText',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'node', type: 'bytes32' },
        { name: 'key', type: 'string' },
        { name: 'value', type: 'string' },
      ],
      outputs: [],
    },
  ] as const;
  
  // Add setAddr as individual operation
  operations.push({
    to: RESOLVER,
    data: encodeFunctionData({
      abi: RESOLVER_ABI,
      functionName: 'setAddr',
      args: [subnameNode, creatorAddress as `0x${string}`],
    }),
    value: '0',
  });
  console.log(`   ✅ Added Resolver.setAddr()`);
  
  // Add all setText calls as individual operations
  for (const [key, value] of Object.entries(records)) {
    operations.push({
      to: RESOLVER,
      data: encodeFunctionData({
        abi: RESOLVER_ABI,
        functionName: 'setText',
        args: [subnameNode, key, value],
      }),
      value: '0',
    });
  }
  console.log(`   ✅ Added ${Object.keys(records).length} Resolver.setText() calls`);
  
  console.log(`\n✅ Direct Registry calldata prepared: ${operations.length} operations`);
  console.log(`   Total operations: ${operations.length} (1 setSubnodeRecord + 1 setAddr + ${Object.keys(records).length} setText)`);
  console.log(`   Payment: 0 wei (FREE)\n`);
  
  return operations;
}

/**
 * Get calldata for setting Safe's reverse record (primary name) to parent domain
 * Returns calldata that Safe can execute to set: Safe address → scenius.basetest.eth
 * 
 * This should be included in the Safe transaction batch along with registration.
 * The Safe is authorized to set its own reverse record since it's executing the transaction.
 * 
 * @param safeAddress - The Safe address that will own the reverse record
 * @returns Calldata for ReverseRegistrar.setNameForAddr() call
 */
export function getReverseRecordCalldata(
  safeAddress: string
): { to: string; data: string; value: string } {
  console.log(`\n🔄 Preparing reverse record calldata...`);
  console.log(`   Setting Safe address → ${PARENT_DOMAIN}`);
  console.log(`   This sets the primary name for the Safe address\n`);

  // ReverseRegistrar ABI for setNameForAddr
  const REVERSE_REGISTRAR_ABI = [
    {
      name: 'setNameForAddr',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'addr', type: 'address' },
        { name: 'owner', type: 'address' },
        { name: 'resolver', type: 'address' },
        { name: 'name', type: 'string' },
      ],
      outputs: [{ name: '', type: 'bytes32' }],
    },
  ] as const;

  // Encode setNameForAddr call
  // Parameters:
  // - addr: Safe address (the address that will resolve to the name)
  // - owner: Safe address (the owner of the reverse record - Safe owns itself)
  // - resolver: RESOLVER (the resolver contract)
  // - name: PARENT_DOMAIN (scenius.basetest.eth)
  const calldata = encodeFunctionData({
    abi: REVERSE_REGISTRAR_ABI,
    functionName: 'setNameForAddr',
    args: [
      safeAddress as `0x${string}`,
      safeAddress as `0x${string}`, // Safe owns its own reverse record
      RESOLVER,
      PARENT_DOMAIN,
    ],
  });

  console.log(`   ✅ Reverse record calldata prepared`);
  console.log(`      To: ${REVERSE_REGISTRAR}`);
  console.log(`      Address: ${safeAddress}`);
  console.log(`      Name: ${PARENT_DOMAIN}\n`);

  return {
    to: REVERSE_REGISTRAR,
    data: calldata,
    value: '0', // No payment required
  };
}

// ============================================================================
// ENS REVERSE RESOLUTION (Address → Name)
// ============================================================================

/**
 * Resolve an Ethereum address to its primary Basename/ENS name (reverse resolution)
 * 
 * IMPORTANT: Always verifies the forward resolution to prevent spoofing.
 * If the resolved name doesn't point back to the original address, returns null.
 * 
 * @param address - The Ethereum address to resolve (0x...)
 * @param chainId - Optional chain ID (defaults to Base Sepolia for testnet)
 * @returns The Basename/ENS name (e.g., "eros001.scenius.basetest.eth") or null if not found or verification fails
 * 
 * @example
 * const name = await resolveAddressToENS('0xf2fa1E8e06641C76Cfe2854c1e4D932a8b6e29fD');
 * // Returns: "eros001.scenius.basetest.eth" (if registered and verified)
 */
export async function resolveAddressToENS(
  address: Address | string,
  chainId: number = baseSepolia.id
): Promise<string | null> {
  try {
    const rpcUrl = process.env.BASE_RPC_URL!;
    
    // Create public client for Base Sepolia (Basenames resolution on L2)
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(rpcUrl),
    });

    // Normalize address to ensure proper format
    const normalizedAddress = address.toLowerCase() as Address;

    console.log(`\n🔍 Resolving address to Basename/ENS name...`);
    console.log(`   Address: ${normalizedAddress}`);
    console.log(`   Chain: Base Sepolia (${baseSepolia.id})`);

    // Step 1: Reverse resolution (address → name)
    const ensName = await publicClient.getEnsName({
      address: normalizedAddress,
    });

    if (!ensName) {
      console.log(`   ❌ No Basename/ENS name found for address`);
      return null;
    }

    console.log(`   ✅ Found Basename/ENS name: ${ensName}`);

    // Step 2: Verify forward resolution (name → address) to prevent spoofing
    // This is CRITICAL - always verify the reverse record points back to the original address
    const resolvedAddress = await publicClient.getEnsAddress({
      name: normalize(ensName),
    });

    if (!resolvedAddress) {
      console.log(`   ⚠️ Forward resolution failed - name doesn't resolve to an address`);
      return null;
    }

    const resolvedAddressLower = resolvedAddress.toLowerCase();
    const originalAddressLower = normalizedAddress.toLowerCase();

    if (resolvedAddressLower !== originalAddressLower) {
      console.log(`   ⚠️ Verification failed - name resolves to different address`);
      console.log(`      Expected: ${originalAddressLower}`);
      console.log(`      Got: ${resolvedAddressLower}`);
      return null;
    }

    console.log(`   ✅ Verification passed - name correctly points to address`);
    console.log(`   ✅ Final result: ${ensName}\n`);

    return ensName;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Failed to resolve address to Basename/ENS name: ${errorMessage}`);
    return null;
  }
}

/**
 * Resolve multiple addresses to their Basename/ENS names
 * 
 * @param addresses - Array of Ethereum addresses to resolve
 * @param chainId - Optional chain ID (defaults to Base Sepolia for testnet)
 * @returns Map of address → Basename/ENS name (or null if not found)
 */
export async function resolveAddressesToENS(
  addresses: (Address | string)[],
  chainId: number = baseSepolia.id
): Promise<Map<string, string | null>> {
  const results = new Map<string, string | null>();
  
  // Resolve all addresses in parallel
  const promises = addresses.map(async (address) => {
    const normalizedAddress = address.toLowerCase();
    const name = await resolveAddressToENS(address, chainId);
    return { address: normalizedAddress, name };
  });

  const resolved = await Promise.all(promises);
  
  resolved.forEach(({ address, name }) => {
    results.set(address, name);
  });

  return results;
}

