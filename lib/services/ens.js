import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { namehash, normalize } from 'viem/ens';
import { encodeFunctionData, createPublicClient, createWalletClient, http, zeroAddress } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
// Config
const ENS_DOMAIN = process.env.ENS_DOMAIN || 'scenedex.eth';
const ENS_RESOLVER = process.env.ENS_RESOLVER_SEPOLIA;
const ENS_SERVICE_NAMESPACE = process.env.ENS_SERVICE_NAMESPACE || 'eth.scenedex';
/**
 * Get namehash with REQUIRED normalization
 * Critical: Must normalize ENS names before hashing (ENSIP-15)
 */
function getNamehash(name) {
    const normalizedName = normalize(name);
    return namehash(normalizedName);
}
/**
 * Check if subname already exists on NameWrapper
 * Returns true if subname is owned (not 0x0 address)
 */
export async function checkSubnameExists(subnameNode, nameWrapperAddress = '0x0635513f179D50A207757E05759CbD106d7dFcE8') {
    const rpcUrl = process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/' + process.env.INFURA_KEY;
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(rpcUrl),
    });
    const NAMEWRAPPER_ABI = [
        {
            name: 'ownerOf',
            type: 'function',
            inputs: [{ name: 'id', type: 'uint256' }],
            outputs: [{ name: 'owner', type: 'address' }],
            stateMutability: 'view',
        },
    ];
    try {
        const tokenId = BigInt(subnameNode);
        const owner = (await publicClient.readContract({
            address: nameWrapperAddress,
            abi: NAMEWRAPPER_ABI,
            functionName: 'ownerOf',
            args: [tokenId],
        }));
        // If owner is zero address, subname does NOT exist
        if (owner === '0x0000000000000000000000000000000000000000') {
            return false;
        }
        return true;
    }
    catch (error) {
        // ownerOf reverted = subname doesn't exist
        return false;
    }
}
/**
 * Get next available EROS number by checking resolver
 */
export async function getNextEROSNumber() {
    const rpcUrl = process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/' + process.env.INFURA_KEY;
    const ensResolver = process.env.ENS_RESOLVER_SEPOLIA;
    const ensDomain = process.env.ENS_DOMAIN || 'scenedex.eth';
    const ensServiceNamespace = process.env.ENS_SERVICE_NAMESPACE || 'eth.scenedex';
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(rpcUrl),
    });
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
    while (true) {
        const subnameLabel = `EROS${String(nextNumber).padStart(3, '0')}`;
        const fullSubname = `${subnameLabel}.${ensDomain}`;
        const subnameNode = getNamehash(fullSubname);
        try {
            const addr = await publicClient.readContract({
                address: ensResolver,
                abi: RESOLVER_ABI,
                functionName: 'addr',
                args: [subnameNode],
            });
            if (addr === zeroAddress) {
                return nextNumber;
            }
        }
        catch (error) {
            return nextNumber;
        }
        nextNumber++;
    }
}
/**
 * Format EROS number with padding (e.g., 1 -> "EROS001")
 */
export function formatEROSNumber(number) {
    return `EROS${String(number).padStart(3, '0')}`;
}
/**
 * Build text records from Release schema
 * Maps all release data to ENS text record key-value pairs
 */
export function buildRecordsFromRelease(release, coinAddress, coinSymbol, creatorAddress, erosNumber) {
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
        [`${ENS_SERVICE_NAMESPACE}.splitAddress`]: 'PENDING',
    };
}
/**
 * Build array of setText transactions for Safe batching
 * Each transaction is independent and can be executed in one Safe batch call
 */
export function buildSetTextTransactions(node, records) {
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
        to: ENS_RESOLVER,
        value: '0',
        // Use encodeFunctionData to get complete call data (selector + params)
        data: encodeFunctionData({
            abi: RESOLVER_ABI,
            functionName: 'setText',
            args: [node, key, value],
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
 * @param coinSymbol - Symbol of deployed Zora coin (e.g., 'EROS')
 * @param creatorAddress - Creator's wallet address (for addr record)
 */
export async function registerEROSRelease(release, coinAddress, coinSymbol, creatorAddress) {
    console.log(`\n📍 Preparing ENS Registration...`);
    // Get next available EROS number
    const erosNumber = await getNextEROSNumber();
    const subnameLabel = formatEROSNumber(erosNumber);
    // Load ENS_DOMAIN at function level to ensure .env is loaded
    const ensDomain = process.env.ENS_DOMAIN || 'scenedex.eth';
    const fullSubname = `${subnameLabel}.${ensDomain}`;
    // Calculate subname node (with normalization)
    const subnameNode = getNamehash(fullSubname);
    console.log(`🔍 DEBUG: subnameLabel="${subnameLabel}", ensDomain="${ensDomain}", fullSubname="${fullSubname}"`);
    console.log(`   Subname: ${fullSubname}`);
    console.log(`   Node: ${subnameNode}`);
    // Build text records
    const records = buildRecordsFromRelease(release, coinAddress, coinSymbol, creatorAddress, erosNumber);
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
 */
export async function approveOperatorOnNameWrapper(operatorAddress) {
    console.log(`\n🔐 Approving operator on NameWrapper...`);
    const rpcUrl = process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/' + process.env.INFURA_KEY;
    const privateKey = process.env.CURATOR_PRIVATE_KEY;
    if (!privateKey) {
        throw new Error('CURATOR_PRIVATE_KEY not set in .env.local');
    }
    const NAMEWRAPPER_ADDRESS = (process.env.ENS_NAMEWRAPPER_SEPOLIA || '0x0635513f179D50A207757E05759CbD106d7dFcE8');
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
        chain: sepolia,
        transport: http(rpcUrl),
    });
    const account = privateKeyToAccount(privateKey);
    const walletClient = createWalletClient({
        account,
        chain: sepolia,
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
            args: [operatorAddress, true],
        });
        console.log(`   ✅ Transaction sent: ${txHash}`);
        // Wait for confirmation
        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        console.log(`   ✅ Confirmed (block ${receipt.blockNumber})\n`);
        return txHash;
    }
    catch (error) {
        console.error('❌ Failed to approve operator:', error);
        throw error;
    }
}
/**
 * Create ENS subname via NameWrapper on Sepolia L1
 * Uses single setSubnodeRecord call to create subname with resolver in one transaction
 *
 * Important: Expiry must be a valid future timestamp (not 0), otherwise the resolver
 * will not be properly registered in the ENS Registry.
 *
 * @param subnameLabel - e.g., "EROS001"
 * @param parentNode - Namehash of parent domain (e.g., scenedex.eth)
 * @returns Transaction hash
 */
export async function createENSSubname(subnameLabel, parentNode) {
    console.log(`\n📝 Creating ENS subname via NameWrapper (single setSubnodeRecord call)...`);
    const rpcUrl = process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/' + process.env.INFURA_KEY;
    const privateKey = process.env.CURATOR_PRIVATE_KEY;
    const curatorAddress = process.env.CURATOR_ADDRESS;
    if (!privateKey) {
        throw new Error('CURATOR_PRIVATE_KEY not set in .env.local');
    }
    if (!curatorAddress) {
        throw new Error('CURATOR_ADDRESS not set in .env.local');
    }
    // NameWrapper contract address on Sepolia
    const NAMEWRAPPER_ADDRESS = (process.env.ENS_NAMEWRAPPER_SEPOLIA || '0x0635513f179D50A207757E05759CbD106d7dFcE8');
    // NameWrapper ABI with setSubnodeRecord
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
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(rpcUrl),
    });
    const account = privateKeyToAccount(privateKey);
    const walletClient = createWalletClient({
        account,
        chain: sepolia,
        transport: http(rpcUrl),
    });
    try {
        const resolver = process.env.ENS_RESOLVER_SEPOLIA;
        if (!resolver) {
            throw new Error('ENS_RESOLVER_SEPOLIA not set in .env.local');
        }
        // Calculate expiry: 1 year in the future
        const now = Math.floor(Date.now() / 1000);
        const oneYearInSeconds = 365 * 24 * 60 * 60;
        const expiryTimestamp = BigInt(now + oneYearInSeconds);
        console.log(`   Parent Node: ${parentNode}`);
        console.log(`   Label: ${subnameLabel}`);
        console.log(`   Owner: ${curatorAddress}`);
        console.log(`   Resolver: ${resolver}`);
        console.log(`   TTL: 0`);
        console.log(`   Fuses: 0 (no fuses burned)`);
        console.log(`   Expiry: ${expiryTimestamp} (${new Date(Number(expiryTimestamp) * 1000).toISOString()})`);
        console.log(`   NameWrapper: ${NAMEWRAPPER_ADDRESS}\n`);
        // Single call: setSubnodeRecord (creates subname + sets owner + resolver + expiry)
        console.log(`   📋 Calling setSubnodeRecord (creates subname with resolver in one tx)...`);
        try {
            // Simulate first to catch errors
            await publicClient.simulateContract({
                account,
                address: NAMEWRAPPER_ADDRESS,
                abi: NAMEWRAPPER_ABI,
                functionName: 'setSubnodeRecord',
                args: [
                    parentNode,
                    subnameLabel,
                    curatorAddress,
                    resolver,
                    BigInt(0), // ttl
                    0, // fuses (no fuses burned)
                    expiryTimestamp, // Valid future timestamp
                ],
            });
            console.log(`      📋 Simulation passed\n`);
        }
        catch (simErr) {
            console.error(`      ❌ Simulation failed: ${simErr}\n`);
            throw simErr;
        }
        const txHash = await walletClient.writeContract({
            account,
            address: NAMEWRAPPER_ADDRESS,
            abi: NAMEWRAPPER_ABI,
            functionName: 'setSubnodeRecord',
            args: [
                parentNode,
                subnameLabel,
                curatorAddress,
                resolver,
                BigInt(0), // ttl
                0, // fuses
                expiryTimestamp, // Valid future timestamp
            ],
        });
        console.log(`      ✅ Tx sent: ${txHash}`);
        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        console.log(`      ✅ Confirmed (block ${receipt.blockNumber}, status: ${receipt.status})\n`);
        return txHash;
    }
    catch (error) {
        console.error('❌ Failed to create subname:', error);
        throw error;
    }
}
/**
 * Execute ENS setText transactions on Sepolia L1
 * Broadcasts all transactions and waits for confirmation
 *
 * @param records - Record key-value pairs to set
 * @param subnameNode - The namehash of the subname
 * @param creatorAddress - Creator's address for setAddr resolution
 * @returns Array of transaction hashes
 */
export async function executeENSRecords(records, subnameNode, creatorAddress) {
    console.log(`\n🚀 Executing ENS records on Sepolia L1...`);
    const rpcUrl = process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/' + process.env.INFURA_KEY;
    const privateKey = process.env.CURATOR_PRIVATE_KEY;
    if (!privateKey) {
        throw new Error('CURATOR_PRIVATE_KEY not set in .env.local');
    }
    // Create clients
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(rpcUrl),
    });
    const account = privateKeyToAccount(privateKey);
    const walletClient = createWalletClient({
        account,
        chain: sepolia,
        transport: http(rpcUrl),
    });
    const txHashes = [];
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
            console.log(`      Resolver: ${process.env.ENS_RESOLVER_SEPOLIA}`);
            console.log(`      Node: ${subnameNode}`);
            console.log(`      Address: ${creatorAddress}\n`);
            try {
                // First, simulate the transaction to check for errors
                console.log(`      📋 Simulating setAddr call...`);
                try {
                    const { result } = await publicClient.simulateContract({
                        account: walletClient.account,
                        address: process.env.ENS_RESOLVER_SEPOLIA,
                        abi: RESOLVER_ABI,
                        functionName: 'setAddr',
                        args: [subnameNode, creatorAddress],
                    });
                    console.log(`      ✅ Simulation successful\n`);
                }
                catch (simError) {
                    const simMsg = simError instanceof Error ? simError.message : String(simError);
                    console.error(`      ❌ Simulation failed!`);
                    console.error(`         Error: ${simMsg}\n`);
                    throw simError;
                }
                // If simulation passed, execute the transaction
                console.log(`      🚀 Executing setAddr transaction...`);
                const txHash = await walletClient.writeContract({
                    address: process.env.ENS_RESOLVER_SEPOLIA,
                    abi: RESOLVER_ABI,
                    functionName: 'setAddr',
                    args: [subnameNode, creatorAddress],
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
                }
                else {
                    console.error(`      ❌ Transaction reverted!`);
                    console.error(`         Block: ${receipt.blockNumber}`);
                    console.error(`         Status: ${receipt.status}\n`);
                    throw new Error(`setAddr transaction reverted`);
                }
                // Delay before text records
                await new Promise(resolve => setTimeout(resolve, DELAY));
            }
            catch (addrError) {
                const errorMsg = addrError instanceof Error ? addrError.message : String(addrError);
                const errorData = addrError instanceof Error && 'data' in addrError ? addrError.data : null;
                console.error(`   ❌ FAILED TO SET ADDRESS RECORD`);
                console.error(`      Error Message: ${errorMsg}`);
                if (errorData) {
                    console.error(`      Error Data: ${errorData}`);
                }
                // Check for common error patterns
                if (errorMsg.includes('permission') || errorMsg.includes('Unauthorized')) {
                    console.error(`      💡 Likely cause: Permission denied. Caller may not have authority over this node.`);
                }
                else if (errorMsg.includes('revert')) {
                    console.error(`      💡 Transaction reverted. This could be a permission issue or invalid input.`);
                }
                else if (errorMsg.includes('nonce')) {
                    console.error(`      💡 Nonce mismatch. Another transaction may have been sent.`);
                }
                console.error(`\n      ⚠️ Continuing with other records (non-fatal)\n`);
                // Don't throw - continue with other records
            }
        }
        // Then, set text records
        for (let i = 0; i < recordEntries.length; i++) {
            const entry = recordEntries[i];
            if (!entry)
                continue;
            const [key, value] = entry;
            console.log(`   [${i + 1}/${recordEntries.length}] Setting: ${key}`);
            try {
                // First, simulate the setText transaction
                console.log(`      📋 Simulating setText("${key.substring(0, 40)}${key.length > 40 ? '...' : ''}")`);
                try {
                    await publicClient.simulateContract({
                        account: walletClient.account,
                        address: process.env.ENS_RESOLVER_SEPOLIA,
                        abi: RESOLVER_ABI,
                        functionName: 'setText',
                        args: [subnameNode, key, value],
                    });
                    console.log(`      ✅ Simulation passed`);
                }
                catch (simError) {
                    const simMsg = simError instanceof Error ? simError.message : String(simError);
                    console.warn(`      ⚠️ Simulation failed: ${simMsg.substring(0, 100)}`);
                    console.warn(`         Attempting to execute anyway...\n`);
                }
                // Execute the transaction
                const txHash = await walletClient.writeContract({
                    address: process.env.ENS_RESOLVER_SEPOLIA,
                    abi: RESOLVER_ABI,
                    functionName: 'setText',
                    args: [subnameNode, key, value],
                });
                console.log(`      ✅ Tx sent: ${txHash}`);
                txHashes.push(txHash);
                // Wait for confirmation
                const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
                if (receipt.status === 'success') {
                    console.log(`      ✅ Confirmed (block ${receipt.blockNumber})\n`);
                }
                else {
                    console.warn(`      ⚠️ Transaction reverted (block ${receipt.blockNumber})\n`);
                }
            }
            catch (txError) {
                const msg = txError instanceof Error ? txError.message : String(txError);
                console.warn(`   ⚠️ Failed to set ${key}`);
                console.warn(`      Error: ${msg.substring(0, 150)}`);
                // Diagnostic hints
                if (msg.includes('permission') || msg.includes('Unauthorized')) {
                    console.warn(`      💡 Likely cause: Permission/ownership issue`);
                }
                else if (msg.includes('revert')) {
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
    }
    catch (error) {
        console.error('❌ Failed to execute ENS records:', error);
        throw error;
    }
}
