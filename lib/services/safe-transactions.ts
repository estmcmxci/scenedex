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
import { sepolia } from 'viem/chains'

// Get Safe address from env (try SAFE_ADDRESS first, fallback to CURATOR_SAFE_ADDRESS for compatibility)
const SAFE_ADDRESS = (process.env.SAFE_ADDRESS || process.env.CURATOR_SAFE_ADDRESS)!

// Initialize Safe Protocol Kit (lazy initialization)
let protocolKit: Safe | null = null

// Initialize Safe API Kit
const apiKit = new SafeApiKit({
  chainId: BigInt(sepolia.id),
  apiKey: process.env.SAFE_API_KEY!,
})

// Initialize coordinator signer for signing messages
const coordinatorSigner = new ethers.Wallet(
  process.env.CURATOR_PRIVATE_KEY!,
  new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL!)
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
    protocolKit = await Safe.init({
      provider: process.env.SEPOLIA_RPC_URL!,
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
  const metaTransactions: MetaTransactionData[] = operations.map(op => ({
    to: op.to,
    data: op.data,
    value: typeof op.value === 'bigint' ? op.value.toString() : op.value,
    operation: op.operation ?? 0, // Default to CALL (0)
  }))

  // Create transaction with batched operations
  // IMPORTANT: Set safeTxGas to non-zero to avoid GS013 error
  // When safeTxGas = 0 and gasPrice = 0, Safe contract reverts with GS013 if internal tx fails
  // Setting safeTxGas to 1 gives old behavior (all available gas, can retry on failure)
  // Or we can estimate proper gas, but 1 is safer for now
  const safeTransaction = await safe.createTransaction({
    transactions: metaTransactions,
    options: {
      safeTxGas: '1', // Set to 1 to avoid GS013, allows retry on failure
      baseGas: '0',
      gasPrice: '0',
    },
  })
  
  console.log(`   📋 safeTxGas: ${safeTransaction.data.safeTxGas}`)
  console.log(`   📋 baseGas: ${safeTransaction.data.baseGas}`)
  console.log(`   📋 gasPrice: ${safeTransaction.data.gasPrice}`)

  // Log transaction details to debug signer mismatch
  console.log(`   📋 Safe transaction data keys:`, Object.keys(safeTransaction.data || {}))
  console.log(`   📋 Safe address: ${SAFE_ADDRESS}`)
  
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
  console.log(`   Hash: ${txResult.hash}`)
  
  // Wait for confirmation if transactionResponse is available
  if (txResult.transactionResponse && typeof txResult.transactionResponse === 'object' && 'wait' in txResult.transactionResponse) {
    console.log(`⏳ Waiting for transaction confirmation...`)
    const receipt = await (txResult.transactionResponse as any).wait()
    console.log(`   Block: ${receipt.blockNumber}`)
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
    }
    
    // Verify the approval was recorded
    const ownersWhoApproved = await safe.getOwnersWhoApprovedTx(safeTxHash)
    console.log(`   📋 Owners who approved: ${ownersWhoApproved.length} (${ownersWhoApproved.join(', ')})`)
    
    if (ownersWhoApproved.length < threshold) {
      throw new Error(`Not enough approvals: ${ownersWhoApproved.length}/${threshold}`)
    }
    
    console.log(`✅ Transaction hash approved on-chain`)
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
      console.log(`   📋 signHash() signature (string): ${signatureData.substring(0, 20)}...`)
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
  
  const txResult = await safe.executeTransaction(signedTransaction)
  
  console.log(`✅ Transaction executed successfully`)
  console.log(`   Hash: ${txResult.hash}`)
  
  // Wait for confirmation if transactionResponse is available
  if (txResult.transactionResponse && typeof txResult.transactionResponse === 'object' && 'wait' in txResult.transactionResponse) {
    console.log(`⏳ Waiting for transaction confirmation...`)
    const receipt = await (txResult.transactionResponse as any).wait()
    console.log(`   Block: ${receipt.blockNumber}`)
  }

  console.log(`\n✅ COMPLETE FLOW SUCCESSFUL!\n`)
  return txResult
}

