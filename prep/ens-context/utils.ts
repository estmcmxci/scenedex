import { namehash as viemNamehash, normalize } from 'viem/ens';
import { keccak256, toHex } from 'viem';

/**
 * Generate ENS namehash for a given name
 * CRITICAL: Must normalize the name before hashing!
 * 
 * @param name - The ENS name (e.g., "scenedex.eth" or "eros.scenedex.eth")
 * @returns The 32-byte namehash as a hex string
 */
export function getNamehash(name: string): `0x${string}` {
  // Step 1: Normalize the name to ensure correct encoding
  // This handles unicode normalization, lowercasing, etc.
  const normalizedName = normalize(name);
  
  // Step 2: Generate namehash from the normalized name
  const hash = viemNamehash(normalizedName);
  
  return hash;
}

/**
 * Generate labelhash for a single label
 * Used less frequently with NameWrapper (which takes string labels),
 * but useful for verification
 * 
 * @param label - The label string (e.g., "eros")
 * @returns The keccak256 hash of the label
 */
export function getLabelhash(label: string): `0x${string}` {
  // Normalize the label first
  const normalizedLabel = normalize(label);
  
  // Convert to bytes and hash
  const hash = keccak256(toHex(normalizedLabel));
  
  return hash;
}

/**
 * Calculate expiry timestamp (1 year from now)
 * 
 * @returns Unix timestamp 1 year in the future
 */
export function getExpiryOneYearFromNow(): bigint {
  const oneYearInSeconds = BigInt(365 * 24 * 60 * 60);
  const now = BigInt(Math.floor(Date.now() / 1000));
  return now + oneYearInSeconds;
}

/**
 * Format transaction hash for display with Sepolia Etherscan link
 */
export function formatTxLink(hash: string): string {
  return `https://sepolia.etherscan.io/tx/${hash}`;
}

/**
 * Format address for display with Sepolia Etherscan link
 */
export function formatAddressLink(address: string): string {
  return `https://sepolia.etherscan.io/address/${address}`;
}

/**
 * Wait for a specified number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Truncate a hex string for display
 */
export function truncateHex(hex: string, prefixLength: number = 6, suffixLength: number = 4): string {
  if (hex.length <= prefixLength + suffixLength) {
    return hex;
  }
  return `${hex.slice(0, prefixLength)}...${hex.slice(-suffixLength)}`;
}

