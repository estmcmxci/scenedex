/**
 * Basename Availability Check
 * Adapted from check-basename-available.ts for frontend use
 */

import { createPublicClient, http } from 'viem'
import { baseSepolia } from 'viem/chains'
import { normalize } from 'viem/ens'

const REGISTRAR_CONTROLLER = process.env.NEXT_PUBLIC_BASENAMES_REGISTRAR_CONTROLLER_BASE_SEPOLIA as `0x${string}` || '0x49ae3cc2e3aa768b1e5654f5d3c6002144a59581'

const REGISTRAR_CONTROLLER_ABI = [
  {
    name: 'available',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'name', type: 'string' }],
    outputs: [{ type: 'bool' }],
  },
] as const

// Default Base Sepolia RPC (public endpoint)
const DEFAULT_BASE_SEPOLIA_RPC = 'https://base-sepolia.g.alchemy.com/v2/lrMqugbPNZcypSuWA_g9C'

export async function checkBasenameAvailable(name: string): Promise<boolean> {
  const rpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL || DEFAULT_BASE_SEPOLIA_RPC
  
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(rpcUrl),
  })

  const normalizedName = normalize(name)

  const isAvailable = await publicClient.readContract({
    address: REGISTRAR_CONTROLLER,
    abi: REGISTRAR_CONTROLLER_ABI,
    functionName: 'available',
    args: [normalizedName],
  })

  return isAvailable as boolean
}

