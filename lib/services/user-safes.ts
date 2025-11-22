/**
 * User Safe Management Service
 * 
 * Handles dynamic Safe linking for users:
 * - Link existing Safe to wallet
 * - Auto-detect Safe ownership
 * - Get active Safe for a wallet
 * - Create new Safe (future)
 */

// Load environment variables
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { query as dbQuery } from '../db/database'
import { ethers } from 'ethers'
import SafeApiKit from '@safe-global/api-kit'
import { sepolia } from 'viem/chains'

const SAFE_ABI = [
  'function getOwners() external view returns (address[])',
  'function getThreshold() external view returns (uint256)',
]

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL!)

// Initialize Safe API Kit for querying Safe Transaction Service
const apiKit = new SafeApiKit({
  chainId: BigInt(sepolia.id),
  apiKey: process.env.SAFE_API_KEY || '',
})

/**
 * Get active Safe address for a wallet
 */
export async function getSafeForWallet(walletAddress: string): Promise<string | null> {
  const result = await dbQuery(
    `SELECT safe_address FROM user_safes 
     WHERE wallet_address = $1 AND is_active = TRUE 
     LIMIT 1`,
    [walletAddress.toLowerCase()]
  )

  if (result.rows.length === 0) {
    return null
  }

  return result.rows[0].safe_address
}

/**
 * Auto-detect and link Safe if wallet is an owner
 * 
 * Fully dynamic discovery via Safe Transaction Service API only:
 * 1. Discovers all Safes owned by the wallet using Safe Transaction Service API
 * 2. Verifies ownership on-chain
 * 3. Auto-links the first Safe found
 * 
 * No fallbacks - pure API-based discovery
 */
export async function autoDetectAndLinkSafe(walletAddress: string): Promise<{ success: boolean; safeAddress?: string; error?: string; discoveredSafes?: string[] }> {
  try {
    // Check if already linked
    const existing = await getSafeForWallet(walletAddress)
    if (existing) {
      console.log(`✅ Safe already linked: ${existing}`)
      return { success: true, safeAddress: existing }
    }

    console.log(`\n🔍 [PURE API DISCOVERY] Starting dynamic Safe discovery for wallet: ${walletAddress}`)
    console.log(`   No fallbacks - using Safe Transaction Service API only\n`)

    // Discover Safes via Safe Transaction Service API
    const discoveredSafes = await detectSafesForWallet(walletAddress)
    
    if (discoveredSafes.length === 0) {
      console.log(`❌ [PURE API DISCOVERY] No Safes found for wallet ${walletAddress}`)
      return { 
        success: false, 
        error: 'No Safes found for this wallet via Safe Transaction Service API. Please link a Safe manually.',
        discoveredSafes: []
      }
    }

    // Found Safes via API - verify and link the first one
    console.log(`\n✅ [PURE API DISCOVERY] Discovered ${discoveredSafes.length} Safe(s), verifying ownership...`)
    
    for (const safeAddress of discoveredSafes) {
      console.log(`   Checking Safe: ${safeAddress}`)
      
      // Verify ownership on-chain
      const isOwner = await verifySafeOwnership(walletAddress, safeAddress)
      
      if (isOwner) {
        console.log(`   ✅ Ownership verified on-chain`)
        // Ownership verified - auto-link
        const linkResult = await linkSafeToWallet(walletAddress, safeAddress)
        if (linkResult.success) {
          console.log(`\n✅ [PURE API DISCOVERY] Successfully linked Safe: ${safeAddress}`)
          return { success: true, safeAddress, discoveredSafes }
        } else {
          console.warn(`   ⚠️ Failed to link Safe: ${linkResult.error}`)
          // Try next Safe
          continue
        }
      } else {
        console.warn(`   ⚠️ Ownership verification failed for ${safeAddress}`)
        // Try next Safe
        continue
      }
    }

    // None of the discovered Safes could be verified/linked
    console.log(`\n❌ [PURE API DISCOVERY] Could not verify/link any of the discovered Safes`)
    return { 
      success: false, 
      error: 'Discovered Safes but could not verify ownership or link. Please link manually.',
      discoveredSafes 
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`\n❌ [PURE API DISCOVERY] Error:`, errorMessage)
    return { success: false, error: `Auto-detection failed: ${errorMessage}` }
  }
}

/**
 * Link a Safe address to a wallet
 * Deactivates any existing active Safe for this wallet
 */
export async function linkSafeToWallet(
  walletAddress: string,
  safeAddress: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify the wallet is an owner of the Safe
    const isOwner = await verifySafeOwnership(walletAddress, safeAddress)
    if (!isOwner) {
      return {
        success: false,
        error: 'Wallet address is not an owner of this Safe',
      }
    }

    const now = Math.floor(Date.now() / 1000)

    // Deactivate all existing Safes for this wallet
    await dbQuery(
      `UPDATE user_safes SET is_active = FALSE, updated_at = $1 
       WHERE wallet_address = $2`,
      [now, walletAddress.toLowerCase()]
    )

    // Insert or update the Safe link
    await dbQuery(
      `INSERT INTO user_safes (wallet_address, safe_address, is_active, created_at, updated_at)
       VALUES ($1, $2, TRUE, $3, $4)
       ON CONFLICT (wallet_address, safe_address) 
       DO UPDATE SET is_active = TRUE, updated_at = $4`,
      [walletAddress.toLowerCase(), safeAddress.toLowerCase(), now, now]
    )

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      success: false,
      error: `Failed to link Safe: ${errorMessage}`,
    }
  }
}

/**
 * Verify that a wallet address is an owner of a Safe
 */
export async function verifySafeOwnership(
  walletAddress: string,
  safeAddress: string
): Promise<boolean> {
  try {
    const safe = new ethers.Contract(safeAddress, SAFE_ABI, provider) as any
    const owners = (await safe.getOwners()) as string[]

    return owners
      .map((o: string) => o.toLowerCase())
      .includes(walletAddress.toLowerCase())
  } catch (error) {
    console.error('Error verifying Safe ownership:', error)
    return false
  }
}

/**
 * Auto-detect Safes owned by a wallet using Safe Transaction Service API
 * Returns array of Safe addresses the wallet owns
 */
export async function detectSafesForWallet(
  walletAddress: string
): Promise<string[]> {
  try {
    console.log(`\n🔍 [DYNAMIC DISCOVERY] Querying Safe Transaction Service API for wallet: ${walletAddress}`)
    console.log(`   API Kit configured for chain: ${sepolia.id} (Sepolia)`)
    
    // Use SafeApiKit's getSafesByOwner method
    const safesResponse = await apiKit.getSafesByOwner(walletAddress)
    
    console.log(`   API Response:`, JSON.stringify(safesResponse, null, 2))
    
    // The response structure: { safes: string[] }
    const safeAddresses = safesResponse?.safes || []
    
    if (safeAddresses.length > 0) {
      console.log(`✅ [DYNAMIC DISCOVERY] Found ${safeAddresses.length} Safe(s) for wallet ${walletAddress}`)
      safeAddresses.forEach((safe, index) => {
        console.log(`   ${index + 1}. ${safe}`)
      })
    } else {
      console.log(`⚠️ [DYNAMIC DISCOVERY] No Safes found for wallet ${walletAddress}`)
      console.log(`   This could mean:`)
      console.log(`   - Wallet has never created/interacted with a Safe on Sepolia`)
      console.log(`   - Safe Transaction Service hasn't indexed this wallet's Safes yet`)
    }
    
    return safeAddresses
  } catch (error) {
    console.error('❌ [DYNAMIC DISCOVERY] Error detecting Safes:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`   Error details: ${errorMessage}`)
    // Return empty array on error - user can still manually link
    return []
  }
}

/**
 * Get all Safes linked to a wallet (active and inactive)
 */
export async function getAllSafesForWallet(
  walletAddress: string
): Promise<Array<{ safe_address: string; is_active: boolean; created_at: number }>> {
  const result = await dbQuery(
    `SELECT safe_address, is_active, created_at 
     FROM user_safes 
     WHERE wallet_address = $1 
     ORDER BY is_active DESC, created_at DESC`,
    [walletAddress.toLowerCase()]
  )

  return result.rows.map((row) => ({
    safe_address: row.safe_address,
    is_active: row.is_active,
    created_at: row.created_at,
  }))
}

/**
 * Unlink a Safe from a wallet
 */
export async function unlinkSafeFromWallet(
  walletAddress: string,
  safeAddress: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await dbQuery(
      `DELETE FROM user_safes 
       WHERE wallet_address = $1 AND safe_address = $2`,
      [walletAddress.toLowerCase(), safeAddress.toLowerCase()]
    )

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      success: false,
      error: `Failed to unlink Safe: ${errorMessage}`,
    }
  }
}
