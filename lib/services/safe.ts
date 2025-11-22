import { ethers } from 'ethers'
import { query as dbQuery } from '../db/database'

// Minimal ABI - only what we need
const SAFE_ABI = [
  'function getOwners() external view returns (address[])',
  'function getThreshold() external view returns (uint256)',
]

const provider = new ethers.JsonRpcProvider(
  process.env.SEPOLIA_RPC_URL!
)

interface VerifySignatureResult {
  success: boolean
  address?: string
  error?: string
}

/**
 * PATTERN 1: Verify Signature (EIP-191)
 * Recovers signer address from message + signature
 */
export function verifyCuratorSignature(
  releaseId: string,
  signature: string
): VerifySignatureResult {
  try {
    // Recover signer address from the raw message (same as what was signed)
    // ethers.verifyMessage handles EIP-191 prefixing automatically
    const recovered = ethers.verifyMessage(releaseId, signature)

    return {
      success: true,
      address: recovered,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      success: false,
      error: `Signature verification failed: ${errorMessage}`,
    }
  }
}

/**
 * PATTERN 2: Verify Curator is Safe Member
 * Query Safe contract to check if curator is an owner
 */
export async function isSafeMember(
  curatorAddress: string,
  safeAddress: string
): Promise<boolean> {
  try {
    const safe = new ethers.Contract(
      safeAddress,
      SAFE_ABI,
      provider
    ) as any

    const owners = await safe.getOwners() as string[]

    return owners
      .map((o: string) => o.toLowerCase())
      .includes(curatorAddress.toLowerCase())
  } catch (error) {
    console.error('Error checking Safe member:', error)
    throw error
  }
}

/**
 * PATTERN 3: Get Approval Threshold
 * Query Safe contract for required approval count
 */
export async function getApprovalThreshold(
  safeAddress: string
): Promise<number> {
  try {
    const safe = new ethers.Contract(
      safeAddress,
      SAFE_ABI,
      provider
    ) as any

    return Number(await safe.getThreshold())
  } catch (error) {
    console.error('Error getting Safe threshold:', error)
    throw error
  }
}

/**
 * Get Safe address from database
 * 
 * @param walletAddress - Optional wallet address to get user-specific Safe
 * If provided, returns user's active Safe. Otherwise, falls back to global curator_settings.
 */
export async function getSafeAddress(walletAddress?: string): Promise<string> {
  // If wallet address provided, try to get user-specific Safe first
  if (walletAddress) {
    const { getSafeForWallet } = await import('./user-safes')
    const userSafe = await getSafeForWallet(walletAddress)
    if (userSafe) {
      return userSafe
    }
    // Fall through to global settings if no user Safe found
  }

  // Fallback to global curator_settings (for backward compatibility)
  const settings = await dbQuery(
    'SELECT safe_address FROM curator_settings LIMIT 1'
  )

  if (settings.rows.length === 0) {
    throw new Error('No Safe address found. Please link a Safe to your wallet or configure curator_settings.')
  }

  return settings.rows[0].safe_address
}

