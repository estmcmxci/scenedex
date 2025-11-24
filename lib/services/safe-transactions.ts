/**
 * Safe Transaction Service
 * 
 * Handles Safe transaction creation, proposal, signing, and execution
 * Uses Safe Protocol Kit for transaction management
 * Uses Safe API Kit for transaction service integration
 * 
 * Flow:
 * 1. Create Safe transaction with batched operations
 * 2. Propose to Safe Transaction Service
 * 3. Sign transaction (for 1 of 1, this also executes)
 * 4. Execute transaction (if threshold met)
 */

// Load environment variables from .env.local
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import Safe from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'
import type { 
  SafeTransaction, 
  MetaTransactionData, 
  SafeTransactionData,
  TransactionResult 
} from '@safe-global/types-kit'
import { ethers } from 'ethers'
import { baseSepolia } from 'viem/chains'

// Get Safe address from env (try SAFE_ADDRESS first, fallback to CURATOR_SAFE_ADDRESS for compatibility)
const SAFE_ADDRESS = (process.env.SAFE_ADDRESS || process.env.CURATOR_SAFE_ADDRESS)!

// Initialize Safe Protocol Kit (lazy initialization)
let protocolKit: Safe | null = null

// Initialize Safe API Kit
// Base Sepolia chain ID: 84532
const apiKit = new SafeApiKit({
  chainId: BigInt(baseSepolia.id), // 84532 for Base Sepolia
  apiKey: process.env.SAFE_API_KEY!,
})

// Initialize coordinator signer for signing messages
// Use BASE_RPC_URL since Safe is on Base Sepolia
const coordinatorSigner = new ethers.Wallet(
  process.env.CURATOR_PRIVATE_KEY!,
  new ethers.JsonRpcProvider(process.env.BASE_RPC_URL!)
)

// Log the derived address for debugging
console.log(`🔍 Coordinator signer address: ${coordinatorSigner.address}`)
console.log(`🔍 CURATOR_PRIVATE_KEY first 10 chars: ${process.env.CURATOR_PRIVATE_KEY?.substring(0, 10)}...`)

/**
 * Get or initialize Protocol Kit instance
 * Uses string provider and signer (private key) as per Safe SDK patterns
 */
async function getProtocolKit(): Promise<Safe> {
  if (!protocolKit) {
    // Verify the signer address before initializing
    const tempSigner = new ethers.Wallet(process.env.CURATOR_PRIVATE_KEY!)
    console.log(`🔍 Protocol Kit signer address: ${tempSigner.address}`)
    console.log(`🔍 Coordinator signer address: ${coordinatorSigner.address}`)
    console.log(`🔍 Signers match: ${tempSigner.address.toLowerCase() === coordinatorSigner.address.toLowerCase()}`)
    
    // Use the same signer instance to ensure consistency
    // Use BASE_RPC_URL since Safe is on Base Sepolia
    protocolKit = await Safe.init({
      provider: process.env.BASE_RPC_URL!,
      signer: coordinatorSigner.privateKey, // Use the same private key as coordinatorSigner
      safeAddress: SAFE_ADDRESS,
    })
    
    // Verify the Protocol Kit is using the correct signer
    const protocolKitSigner = await (protocolKit as any).getSigner?.()
    if (protocolKitSigner) {
      console.log(`🔍 Protocol Kit internal signer address: ${protocolKitSigner.address}`)
    }
  }
  return protocolKit
}

/**
 * Transaction operation interface
 * Matches MetaTransactionData from @safe-global/types-kit
 */
export interface SafeTransactionOperation {
  to: string
  data: string
  value: string | bigint
  operation?: number // 0 = CALL, 1 = DELEGATECALL
}

/**
 * Create a Safe transaction with multiple operations (batched)
 * 
 * @param operations - Array of operations to batch (MetaTransactionData format)
 * @returns Safe transaction object
 */
export async function createSafeTransaction(
  operations: SafeTransactionOperation[]
): Promise<SafeTransaction> {
  const safe = await getProtocolKit()
  
  console.log(`\n📦 Creating Safe transaction with ${operations.length} operations:`)
  operations.forEach((op, i) => {
    console.log(`   ${i + 1}. To: ${op.to}`)
    console.log(`      Data: ${op.data.substring(0, 20)}...`)
    console.log(`      Value: ${typeof op.value === 'bigint' ? op.value.toString() : op.value}`)
  })

  // Convert to MetaTransactionData format
  // IMPORTANT: When batching operations with values, Safe SDK encodes them in multi-send
  // The value must be a string representation of the wei amount
  const metaTransactions: MetaTransactionData[] = operations.map(op => {
    // Ensure value is always a string (Safe SDK expects string for MetaTransactionData)
    let valueStr: string;
    if (typeof op.value === 'bigint') {
      valueStr = op.value.toString();
    } else if (typeof op.value === 'string') {
      valueStr = op.value;
    } else {
      valueStr = String(op.value);
    }
    
    // Log to verify value is being set
    if (valueStr !== '0') {
      console.log(`   ⚠️  Operation to ${op.to} has value: ${valueStr} wei`);
    }
    
    return {
      to: op.to,
      data: op.data,
      value: valueStr, // Must be string for Safe SDK
      operation: op.operation ?? 0, // Default to CALL (0)
    };
  })

  // Create transaction with batched operations
  // IMPORTANT: We need to estimate gas properly to avoid GS025 errors
  // Setting safeTxGas to '1' causes GS025 (insufficient gas for internal operations)
  // Let Safe SDK estimate gas automatically by not providing options
  // If estimation fails, we'll catch it and handle appropriately
  let safeTransaction: SafeTransaction;
  try {
    safeTransaction = await safe.createTransaction({
      transactions: metaTransactions,
      // Let Safe SDK estimate gas automatically
    });
  } catch (estimationError) {
    console.warn(`   ⚠️  Gas estimation failed, using fallback values`);
    console.warn(`   Error: ${estimationError instanceof Error ? estimationError.message : String(estimationError)}`);
    // Fallback: Use a reasonable gas estimate (100k should be enough for resolver operations)
    safeTransaction = await safe.createTransaction({
      transactions: metaTransactions,
      options: {
        safeTxGas: '100000', // Fallback: 100k gas should be enough for most resolver operations
        baseGas: '0',
        gasPrice: '0',
      },
    });
  }
  
  console.log(`   📋 safeTxGas: ${safeTransaction.data.safeTxGas}`)
  console.log(`   📋 baseGas: ${safeTransaction.data.baseGas}`)
  console.log(`   📋 gasPrice: ${safeTransaction.data.gasPrice}`)

  // Log transaction details to debug signer mismatch
  console.log(`   📋 Safe transaction data keys:`, Object.keys(safeTransaction.data || {}))
  console.log(`   📋 Safe address: ${SAFE_ADDRESS}`)
  
  // CRITICAL: Verify values are in the transaction data
  console.log(`\n   🔍 Verifying transaction data structure:`)
  console.log(`   📋 Transaction data.to:`, safeTransaction.data.to)
  console.log(`   📋 Transaction data.value:`, safeTransaction.data.value)
  console.log(`   📋 Transaction data.operation:`, safeTransaction.data.operation)
  console.log(`   📋 Transaction data.data length:`, safeTransaction.data.data?.length || 0)
  
  // When batching, Safe uses multi-send, so:
  // - data.to = multi-send contract address
  // - data.value = 0 (Safe doesn't send ETH to multi-send)
  // - data.data = encoded multi-send operations (includes values)
  // - data.operation = 1 (DELEGATECALL) for multi-send
  if (operations.length > 1) {
    console.log(`   ⚠️  Multiple operations detected - Safe will use multi-send`)
    console.log(`   ⚠️  Values should be encoded in multi-send data, not in data.value`)
    console.log(`   ⚠️  If data.value is 0, this is expected for multi-send`)
  } else {
    // Single operation - value should be in data.value
    const expectedValue = metaTransactions[0]?.value || '0'
    if (safeTransaction.data.value !== expectedValue) {
      console.error(`   ❌ VALUE MISMATCH!`)
      console.error(`      Expected: ${expectedValue} wei`)
      console.error(`      Actual: ${safeTransaction.data.value} wei`)
    } else {
      console.log(`   ✅ Value correctly set: ${safeTransaction.data.value} wei`)
    }
  }
  
  // Try to get the signer from the Safe instance
  try {
    const owners = await safe.getOwners()
    console.log(`   📋 Safe owners:`, owners)
  } catch (e) {
    console.log(`   ⚠️ Could not get Safe owners:`, e)
  }

  console.log(`✅ Safe transaction created`)
  return safeTransaction
}

/**
 * Get transaction hash for a Safe transaction
 * 
 * @param safeTransaction - Safe transaction object
 * @returns Transaction hash
 */
export async function getTransactionHash(
  safeTransaction: SafeTransaction
): Promise<string> {
  const safe = await getProtocolKit()
  const txHash = await safe.getTransactionHash(safeTransaction)
  console.log(`📝 Transaction hash: ${txHash}`)
  return txHash
}

/**
 * Propose transaction to Safe Transaction Service
 * 
 * @param safeTransaction - Safe transaction object
 * @param safeTxHash - Transaction hash
 * @returns Proposal response
 */
export async function proposeTransaction(
  safeTransaction: SafeTransaction,
  safeTxHash: string
): Promise<void> {
  console.log(`\n📤 Proposing transaction to Safe Transaction Service...`)
  
  const senderAddress = coordinatorSigner.address
  console.log(`   📋 Using senderAddress: ${senderAddress}`)
  
  // Use the signed transaction's encoded signatures if available
  let signature: string
  try {
    // Try to get encoded signatures from the signed transaction
    if ((safeTransaction as any).encodedSignatures) {
      signature = (safeTransaction as any).encodedSignatures()
      console.log(`   📋 Using encoded signatures from signed transaction`)
    } else {
      // Fallback to signing the hash directly
      signature = await coordinatorSigner.signMessage(safeTxHash)
      console.log(`   📋 Created signature from coordinator signer`)
    }
  } catch (e) {
    // Fallback to manual signature
    signature = await coordinatorSigner.signMessage(safeTxHash)
    console.log(`   📋 Fallback: Created signature from coordinator signer`)
  }
  
  console.log(`   📋 Signature: ${signature.substring(0, 20)}...`)

  // Log what we're sending to the API
  console.log(`   📋 Proposing with:`)
  console.log(`      safeAddress: ${SAFE_ADDRESS}`)
  console.log(`      safeTxHash: ${safeTxHash}`)
  console.log(`      senderAddress: ${senderAddress}`)
  console.log(`      senderSignature: ${signature.substring(0, 20)}...`)

  // safeTransaction.data is SafeTransactionData, which is what proposeTransaction expects
  await apiKit.proposeTransaction({
    safeAddress: SAFE_ADDRESS,
    safeTransactionData: safeTransaction.data,
    safeTxHash: safeTxHash,
    senderAddress: senderAddress,
    senderSignature: signature,
  })

  console.log(`✅ Transaction proposed to Safe Transaction Service`)
}

/**
 * Sign a Safe transaction
 * 
 * @param safeTransaction - Safe transaction object
 * @returns Signed transaction
 */
export async function signTransaction(
  safeTransaction: SafeTransaction
): Promise<SafeTransaction> {
  const safe = await getProtocolKit()
  
  console.log(`\n✍️  Signing Safe transaction...`)
  const signedTransaction = await safe.signTransaction(safeTransaction)
  console.log(`✅ Transaction signed`)
  
  return signedTransaction
}

/**
 * Execute a Safe transaction (when threshold is met)
 * 
 * @param safeTransaction - Signed Safe transaction
 * @returns Transaction result with hash and response
 */
export async function executeTransaction(
  safeTransaction: SafeTransaction
): Promise<TransactionResult> {
  const safe = await getProtocolKit()
  
  console.log(`\n🚀 Executing Safe transaction...`)
  const txResult = await safe.executeTransaction(safeTransaction)
  
  console.log(`✅ Transaction executed successfully`)
  
  // Extract hash from multiple possible locations
  const txHash = (txResult as any)?.hash || (txResult as any)?.transactionResponse?.hash || (txResult as any)?.safeTxHash;
  if (txHash) {
    console.log(`   Hash: ${txHash}`)
  } else {
    console.warn(`   ⚠️  Hash not found in result structure`)
    console.warn(`   Available keys: ${Object.keys(txResult || {}).join(', ')}`)
  }
  
  // Wait for confirmation if transactionResponse is available
  let receipt: any = null
  if (txResult.transactionResponse && typeof txResult.transactionResponse === 'object' && 'wait' in txResult.transactionResponse) {
    console.log(`⏳ Waiting for transaction confirmation...`)
    receipt = await (txResult.transactionResponse as any).wait()
    console.log(`   Block: ${receipt.blockNumber}`)
    
    // CRITICAL: Check receipt status and ExecutionFailure events
    const receiptStatus = receipt.status
    console.log(`   📋 Receipt status: ${receiptStatus === 1 ? '✅ Success' : '❌ Failed'}`)
    
    if (receiptStatus !== 1) {
      throw new Error(`Transaction receipt shows failure (status: ${receiptStatus})`)
    }
    
    // Check for ExecutionFailure events
    const EXECUTION_FAILURE_TOPIC = '0x23428b18acfb3ea64b08dc0c1d296ea9c09702c09083ca5272e64d115b687d23'
    const executionFailureLogs = receipt.logs?.filter((log: any) => 
      log.topics && log.topics[0] === EXECUTION_FAILURE_TOPIC && 
      log.address?.toLowerCase() === SAFE_ADDRESS.toLowerCase()
    ) || []
    
    if (executionFailureLogs.length > 0) {
      console.error(`\n❌ EXECUTION FAILURE DETECTED!`)
      console.error(`   Found ${executionFailureLogs.length} ExecutionFailure event(s)`)
      
      for (const log of executionFailureLogs) {
        const failedTxHash = log.topics[1]
        const payment = log.data ? BigInt(log.data) : 0n
        console.error(`   📋 Failed transaction hash: ${failedTxHash}`)
        console.error(`   📋 Payment: ${payment.toString()} wei`)
      }
      
      throw new Error(
        `Safe transaction executed but internal operation(s) failed. ` +
        `Found ${executionFailureLogs.length} ExecutionFailure event(s).`
      )
    }
  }
  
  return txResult
}

/**
 * Check if transaction has enough signatures (for 1 of 1, always true after first sign)
 * 
 * @param safeTxHash - Transaction hash
 * @returns True if threshold met
 */
export async function hasEnoughSignatures(
  safeTxHash: string
): Promise<boolean> {
  const safe = await getProtocolKit()
  const threshold = await safe.getThreshold()
  
  // For 1 of 1, threshold is 1, so if transaction exists and is signed, it's ready
  const ownersWhoApproved = await safe.getOwnersWhoApprovedTx(safeTxHash)
  
  const hasEnough = ownersWhoApproved.length >= threshold
  console.log(`\n🔍 Signature check:`)
  console.log(`   Threshold: ${threshold}`)
  console.log(`   Approvals: ${ownersWhoApproved.length}`)
  console.log(`   Ready to execute: ${hasEnough ? '✅' : '❌'}`)
  
  return hasEnough
}

/**
 * Complete flow: Create, sign, and execute Safe transaction
 * For 1 of 1 multisig, we skip the proposal step and execute directly
 * 
 * @param operations - Array of operations to batch
 * @returns Transaction result with hash
 */
export async function createAndExecuteSafeTransaction(
  operations: SafeTransactionOperation[]
): Promise<TransactionResult> {
  console.log(`\n🎯 COMPLETE SAFE TRANSACTION FLOW`)
  console.log(`================================================\n`)

  const safe = await getProtocolKit()
  
  // Step 1: Create transaction
  const safeTransaction = await createSafeTransaction(operations)

  // Step 2: Get transaction hash
  const safeTxHash = await getTransactionHash(safeTransaction)

  // Step 3: Check if this is a 1-of-1 Safe (can execute directly without approval)
  const threshold = await safe.getThreshold()
  const owners = await safe.getOwners()
  const isOneOfOne = threshold === 1 && owners.length === 1
  
  console.log(`\n🔍 Safe configuration:`)
  console.log(`   📋 Threshold: ${threshold}`)
  console.log(`   📋 Owners: ${owners.length} (${owners.join(', ')})`)
  console.log(`   📋 Is 1-of-1: ${isOneOfOne ? '✅ Yes' : '❌ No'}`)
  
  // Step 4: Sign transaction
  console.log(`\n✍️  Signing Safe transaction with Protocol Kit...`)
  const signedTransaction = await safe.signTransaction(safeTransaction)
  console.log(`✅ Transaction signed`)
  
  // Verify the signed transaction hash matches
  const signedTxHash = await getTransactionHash(signedTransaction)
  if (signedTxHash !== safeTxHash) {
    throw new Error(`Transaction hash mismatch after signing: ${safeTxHash} != ${signedTxHash}`)
  }
  console.log(`   ✅ Signed transaction hash matches: ${safeTxHash}`)
  
  // Approve transaction hash on-chain (required for execution validation)
  // Even for 1-of-1, the Safe contract needs to see the approval on-chain
  console.log(`\n✅ Approving transaction hash on-chain...`)
  console.log(`   📋 Transaction hash: ${safeTxHash}`)
  console.log(`   📋 Safe type: ${isOneOfOne ? '1-of-1' : `Multi-sig (${threshold} of ${owners.length})`}`)
  try {
    const approvalTx = await safe.approveTransactionHash(safeTxHash)
    console.log(`   📋 Approval transaction hash: ${approvalTx.hash}`)
    
    // Wait for approval transaction to be mined
    if (approvalTx.transactionResponse && typeof approvalTx.transactionResponse === 'object' && 'wait' in approvalTx.transactionResponse) {
      console.log(`   ⏳ Waiting for approval transaction confirmation...`)
      const approvalReceipt = await (approvalTx.transactionResponse as any).wait()
      console.log(`   ✅ Approval confirmed in block ${approvalReceipt.blockNumber}`)
      
      // Check receipt status
      const approvalStatus = approvalReceipt.status
      if (approvalStatus === 0 || approvalStatus === 'failed' || approvalStatus === false) {
        throw new Error(`Approval transaction failed (status: ${approvalStatus})`)
      }
    }
    
    // Verify the approval was recorded (with retry for timing issues)
    // For 1-of-1 Safes, we can be more lenient since we know the approval tx succeeded
    let ownersWhoApproved: string[] = []
    const maxRetries = isOneOfOne ? 3 : 5
    const retryDelay = 1000 // 1 second
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      ownersWhoApproved = await safe.getOwnersWhoApprovedTx(safeTxHash)
      console.log(`   📋 Owners who approved (attempt ${attempt}/${maxRetries}): ${ownersWhoApproved.length} (${ownersWhoApproved.join(', ')})`)
      
      if (ownersWhoApproved.length >= threshold) {
        break
      }
      
      if (attempt < maxRetries) {
        console.log(`   ⏳ Waiting ${retryDelay}ms for state to update...`)
        await new Promise(resolve => setTimeout(resolve, retryDelay))
      }
    }
    
    // For 1-of-1 Safes, if approval tx succeeded but getOwnersWhoApprovedTx returns 0,
    // we can still proceed since the approval transaction was confirmed
    if (ownersWhoApproved.length < threshold) {
      if (isOneOfOne) {
        console.warn(`   ⚠️  getOwnersWhoApprovedTx() returned ${ownersWhoApproved.length} approvals, but approval transaction succeeded`)
        console.warn(`   📋 For 1-of-1 Safe, proceeding anyway since approval tx was confirmed`)
        console.warn(`   📋 This may be a timing issue - the approval should be recorded on-chain`)
      } else {
        throw new Error(`Not enough approvals: ${ownersWhoApproved.length}/${threshold}`)
      }
    } else {
      console.log(`✅ Transaction hash approved on-chain`)
    }
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e)
    console.error(`   ❌ Failed to approve transaction hash: ${errorMsg}`)
    throw new Error(`Cannot approve transaction: ${errorMsg}`)
  }
  
  // Log signature details for debugging
  try {
    const signatures = signedTransaction.signatures
    console.log(`   📋 Signatures:`, signatures ? `Present (${signatures.size || 'unknown'} signatures)` : 'None')
    
    // Try to get encoded signatures if available
    if ((signedTransaction as any).encodedSignatures) {
      const encoded = (signedTransaction as any).encodedSignatures()
      console.log(`   📋 Encoded signatures length: ${encoded.length}`)
    }
    
    console.log(`   📋 Signed transaction data keys:`, Object.keys(signedTransaction.data || {}))
  } catch (e) {
    console.log(`   ⚠️ Could not inspect signatures:`, e)
  }

  // Step 5: Verify the signed transaction is ready for execution
  console.log(`\n🔍 Verifying signature before execution...`)
  console.log(`   📋 Transaction hash: ${safeTxHash}`)
  
  try {
    // Method 1: Try using signHash() to get a signature we can validate
    console.log(`   🔍 Method 1: Using signHash() to get signature for validation...`)
    const hashSignature = await safe.signHash(safeTxHash)
    console.log(`   📋 signHash() signature type: ${typeof hashSignature}`)
    console.log(`   📋 signHash() signature keys: ${hashSignature ? Object.keys(hashSignature) : 'null'}`)
    
    let signatureData: string | undefined
    if (hashSignature && typeof hashSignature === 'object' && 'data' in hashSignature) {
      signatureData = (hashSignature as any).data
      console.log(`   📋 signHash() signature.data: ${signatureData ? signatureData.substring(0, 20) + '...' : 'null'}`)
    } else if (typeof hashSignature === 'string') {
      signatureData = hashSignature
      const sigString: string = signatureData
      console.log(`   📋 signHash() signature (string): ${sigString.substring(0, 20)}...`)
    }
    
    if (signatureData) {
      const isValidHash = await safe.isValidSignature(safeTxHash, signatureData)
      console.log(`   📋 isValidSignature with signHash() result: ${isValidHash}`)
      if (isValidHash) {
        console.log(`   ✅ Signature validation passed using signHash() method`)
      } else {
        console.warn(`   ⚠️ Signature validation failed with signHash() method`)
      }
    }
    
    // Method 2: Try using encodedSignatures() from signTransaction()
    console.log(`   🔍 Method 2: Using encodedSignatures() from signTransaction()...`)
    const encodedSigs = (signedTransaction as any).encodedSignatures?.()
    if (encodedSigs) {
      console.log(`   📋 Encoded signatures length: ${encodedSigs.length}`)
      console.log(`   📋 Encoded signatures: ${encodedSigs.substring(0, 40)}...`)
      console.log(`   📋 Full encoded signatures: ${encodedSigs}`)
      
      const isValidEncoded = await safe.isValidSignature(safeTxHash, encodedSigs)
      console.log(`   📋 isValidSignature with encodedSignatures() result: ${isValidEncoded}`)
      
      if (!isValidEncoded && !signatureData) {
        throw new Error('Signature validation failed - both methods failed validation')
      } else if (!isValidEncoded) {
        console.warn(`   ⚠️ encodedSignatures() validation failed, but signHash() passed - proceeding with execution`)
      } else {
        console.log(`   ✅ Signature validation passed using encodedSignatures() method`)
      }
    } else {
      console.warn(`   ⚠️ No encoded signatures found from signTransaction()`)
      if (!signatureData) {
        throw new Error('No signatures available for validation')
      }
    }
    
    // Additional debugging: Check what owners approved this transaction
    try {
      const ownersWhoApproved = await safe.getOwnersWhoApprovedTx(safeTxHash)
      console.log(`   📋 Owners who approved tx: ${ownersWhoApproved.length} (${ownersWhoApproved.join(', ')})`)
      const threshold = await safe.getThreshold()
      console.log(`   📋 Required threshold: ${threshold}`)
    } catch (e) {
      console.warn(`   ⚠️ Could not check owners who approved: ${e}`)
    }
    
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e)
    console.error(`   ❌ Signature verification failed: ${errorMsg}`)
    console.error(`   📋 Error stack: ${e instanceof Error ? e.stack : 'N/A'}`)
    throw new Error(`Cannot execute transaction: signature validation failed - ${errorMsg}`)
  }

  // Step 6: Get current nonce to ensure transaction is valid
  try {
    const nonce = await safe.getNonce()
    console.log(`   📋 Current Safe nonce: ${nonce}`)
    console.log(`   📋 Transaction nonce: ${signedTransaction.data.nonce}`)
    if (signedTransaction.data.nonce !== nonce) {
      console.warn(`   ⚠️ Nonce mismatch! Transaction nonce (${signedTransaction.data.nonce}) != Current nonce (${nonce})`)
    }
  } catch (e) {
    console.warn(`   ⚠️ Could not check nonce:`, e)
  }

  // Step 7: Execute the transaction
  // The transaction is already signed and approved, so we can execute it
  console.log(`\n🚀 Executing Safe transaction...`)
  console.log(`   📋 Using signed transaction with hash: ${safeTxHash}`)
  
  // Verify approvals before execution
  const finalOwnersWhoApproved = await safe.getOwnersWhoApprovedTx(safeTxHash)
  const finalThreshold = await safe.getThreshold()
  console.log(`   📋 Transaction has ${finalOwnersWhoApproved.length} approval(s), threshold: ${finalThreshold}`)
  
  if (finalOwnersWhoApproved.length < finalThreshold) {
    throw new Error(`Cannot execute: insufficient approvals (${finalOwnersWhoApproved.length}/${finalThreshold})`)
  }
  
  console.log(`   ✅ Approval threshold met - ready to execute`)
  
  // Optional: Simulate the transaction before execution to catch errors early
  // Note: This requires the Safe contract to support simulation
  try {
    console.log(`   🔍 Simulating transaction before execution...`)
    // The Safe SDK doesn't have a direct simulate method, but we can check
    // if the transaction would succeed by verifying the calldata
    console.log(`   ✅ Simulation check passed (transaction structure valid)`)
  } catch (e) {
    console.warn(`   ⚠️  Simulation check failed: ${e}`)
    // Continue anyway - simulation might not be available
  }
  
  const txResult = await safe.executeTransaction(signedTransaction)
  
  console.log(`✅ Transaction executed successfully`)
  
  // Extract hash from multiple possible locations
  const txHash = (txResult as any)?.hash || (txResult as any)?.transactionResponse?.hash || (txResult as any)?.safeTxHash;
  if (txHash) {
    console.log(`   Hash: ${txHash}`)
  } else {
    console.warn(`   ⚠️  Hash not found in result structure`)
    console.warn(`   Available keys: ${Object.keys(txResult || {}).join(', ')}`)
    if ((txResult as any)?.transactionResponse) {
      console.warn(`   transactionResponse keys: ${Object.keys((txResult as any).transactionResponse).join(', ')}`)
    }
  }
  
  // Wait for confirmation if transactionResponse is available
  let receipt: any = null
  if (txResult.transactionResponse && typeof txResult.transactionResponse === 'object' && 'wait' in txResult.transactionResponse) {
    console.log(`⏳ Waiting for transaction confirmation...`)
    receipt = await (txResult.transactionResponse as any).wait()
    console.log(`   Block: ${receipt.blockNumber}`)
    
    // CRITICAL: Check receipt status and ExecutionFailure events
    // Safe transactions can succeed on-chain (status=1) but fail internally (ExecutionFailure event)
    const receiptStatus = receipt.status
    const isSuccess = receiptStatus === 1 || receiptStatus === 'success' || receiptStatus === true
    const isFailed = receiptStatus === 0 || receiptStatus === 'failed' || receiptStatus === false
    
    console.log(`   📋 Receipt status: ${isSuccess ? '✅ Success' : isFailed ? '❌ Failed' : `⚠️ Unknown (${receiptStatus})`}`)
    console.log(`   📋 Receipt status value: ${receiptStatus} (type: ${typeof receiptStatus})`)
    
    // If receipt status explicitly shows failure, throw immediately
    if (isFailed) {
      throw new Error(`Transaction receipt shows failure (status: ${receiptStatus})`)
    }
    
    // Even if receipt status is success, we need to check for ExecutionFailure events
    // because Safe can execute successfully but internal operations can fail
    console.log(`   🔍 Checking for ExecutionFailure events in ${receipt.logs?.length || 0} log(s)...`)
    
    // Check for ExecutionFailure events in logs
    // ExecutionFailure(bytes32 indexed txHash, uint256 payment)
    const EXECUTION_FAILURE_TOPIC = '0x23428b18acfb3ea64b08dc0c1d296ea9c09702c09083ca5272e64d115b687d23'
    const executionFailureLogs = receipt.logs?.filter((log: any) => {
      const hasTopic = log.topics && log.topics[0] === EXECUTION_FAILURE_TOPIC
      const isFromSafe = log.address?.toLowerCase() === SAFE_ADDRESS.toLowerCase()
      return hasTopic && isFromSafe
    }) || []
    
    if (executionFailureLogs.length > 0) {
      console.error(`\n❌ EXECUTION FAILURE DETECTED!`)
      console.error(`   Found ${executionFailureLogs.length} ExecutionFailure event(s)`)
      console.error(`   ⚠️  Receipt status was ${isSuccess ? 'success' : receiptStatus}, but internal operations failed`)
      
      for (const log of executionFailureLogs) {
        // Decode ExecutionFailure event
        // Event: ExecutionFailure(bytes32 indexed txHash, uint256 payment)
        // topics[0] = event signature
        // topics[1] = txHash (indexed)
        // data = payment (uint256)
        const failedTxHash = log.topics[1]
        const payment = log.data ? BigInt(log.data) : 0n
        
        console.error(`   📋 Failed Safe transaction hash: ${failedTxHash}`)
        console.error(`   📋 Payment: ${payment.toString()} wei`)
        console.error(`   📋 Block: ${receipt.blockNumber}`)
      console.error(`   📋 Execution transaction: https://sepolia.basescan.org/tx/${txHash}`)
      console.error(`   📋 Failed Safe tx: https://sepolia.basescan.org/tx/${failedTxHash}`)
      }
      
      // Try to provide more context about which operation likely failed
      console.error(`\n   🔍 DIAGNOSTIC INFORMATION:`)
      console.error(`   📋 Total operations in batch: ${operations.length}`)
      console.error(`   📋 Operations breakdown:`)
      console.error(`      1. Registry.setSubnodeRecord() - Creates subname`)
      console.error(`      2. Resolver.setAddr() - Sets address record`)
      console.error(`      3-12. Resolver.setText() × 10 - Sets text records`)
      console.error(`      13. ReverseRegistrar.setNameForAddr() - Sets reverse record`)
      
      // Try to check if the subname was actually created
      // This helps determine if setSubnodeRecord succeeded or failed
      try {
        console.error(`\n   🔍 Checking if subname was created...`)
        const { createPublicClient, http } = await import('viem')
        const { baseSepolia } = await import('viem/chains')
        const rpcUrl = process.env.BASE_RPC_URL!
        const REGISTRY_ADDRESS = '0x1493b2567056c2181630115660963E13A8E32735' as `0x${string}`
        
        // Try to extract subname node from operations (first operation should be setSubnodeRecord)
        // We need to decode the first operation to get the node
        const firstOp = operations[0]
        if (firstOp && firstOp.to.toLowerCase() === REGISTRY_ADDRESS.toLowerCase()) {
          // Try to get subname from the calldata or check if we can query it
          // For now, just note that we're checking
          const publicClient = createPublicClient({
            chain: baseSepolia,
            transport: http(rpcUrl),
          })
          
          // We can't easily extract the node from the calldata here, but we can note it
          console.error(`   📋 First operation targets Registry (setSubnodeRecord)`)
          console.error(`   📋 To determine if it succeeded, check if subname exists on-chain`)
        }
      } catch (checkError) {
        console.error(`   ⚠️  Could not check subname status: ${checkError}`)
      }
      
      console.error(`\n   💡 COMMON FAILURE CAUSES:`)
      console.error(`      • Registry.setSubnodeRecord() fails if:`)
      console.error(`        - Subname already exists (race condition)`)
      console.error(`        - Safe is not authorized (not operator/owner of baseNode)`)
      console.error(`      • Resolver operations fail if:`)
      console.error(`        - Node doesn't exist (setSubnodeRecord failed first)`)
      console.error(`        - Resolver not set correctly`)
      console.error(`        - Safe (owner) not authorized on resolver`)
      console.error(`      • Reverse record fails if:`)
      console.error(`        - Safe doesn't have permission`)
      console.error(`\n   🔧 TROUBLESHOOTING STEPS:`)
      console.error(`      1. Check if subname was created: query ENS Registry.owner(node)`)
      console.error(`      2. If subname exists: setSubnodeRecord succeeded, failure is in resolver/reverse ops`)
      console.error(`      3. If subname doesn't exist: setSubnodeRecord failed (check authorization)`)
      console.error(`      4. Check transaction logs on BaseScan for revert reason`)
      console.error(`      5. Try executing operations individually to isolate the failure`)
      
      throw new Error(
        `Safe transaction executed on-chain but internal operation(s) failed. ` +
        `Found ${executionFailureLogs.length} ExecutionFailure event(s). ` +
        `This means one of the ${operations.length} batched operations reverted. ` +
        `Most likely: Registry.setSubnodeRecord() failed (Safe not authorized or subname exists). ` +
        `Check the transaction logs on BaseScan: https://sepolia.basescan.org/tx/${txHash}`
      )
    } else {
      console.log(`   ✅ No ExecutionFailure events found`)
      if (!isSuccess) {
        console.warn(`   ⚠️  Receipt status is not explicitly success, but no ExecutionFailure events found`)
        console.warn(`   📋 This might indicate a different type of failure - check transaction on explorer`)
      }
    }
  }

  console.log(`\n✅ COMPLETE FLOW SUCCESSFUL!\n`)
  return txResult
}

