/**
 * Basenames Query Functions
 * Adapted from query-basenames.ts for frontend use
 */

import { createPublicClient, http, type Address } from 'viem'
import { baseSepolia } from 'viem/chains'
import { normalize, namehash } from 'viem/ens'
import { keccak256, encodePacked, toBytes } from 'viem'

const REGISTRY = process.env.NEXT_PUBLIC_BASENAMES_REGISTRY_BASE_SEPOLIA as `0x${string}` || '0x1493b2567056c2181630115660963E13A8E32735'
const RESOLVER = process.env.NEXT_PUBLIC_BASENAMES_RESOLVER_BASE_SEPOLIA as `0x${string}` || '0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA'
const REVERSE_REGISTRAR = process.env.NEXT_PUBLIC_BASENAMES_REVERSE_REGISTRAR_BASE_SEPOLIA as `0x${string}` || '0x876eF94ce0773052a2f81921E70FF25a5e76841f'
const PARENT_DOMAIN = 'basetest.eth'
const PARENT_NODE = namehash(PARENT_DOMAIN) as `0x${string}`

const REGISTRY_ABI = [
  {
    name: 'resolver',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'node', type: 'bytes32' }],
    outputs: [{ type: 'address' }],
  },
  {
    name: 'owner',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'node', type: 'bytes32' }],
    outputs: [{ type: 'address' }],
  },
] as const

const RESOLVER_ABI = [
  {
    name: 'addr',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'node', type: 'bytes32' }],
    outputs: [{ type: 'address' }],
  },
  {
    name: 'text',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'node', type: 'bytes32' },
      { name: 'key', type: 'string' },
    ],
    outputs: [{ type: 'string' }],
  },
  {
    name: 'name',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'node', type: 'bytes32' }],
    outputs: [{ type: 'string' }],
  },
] as const

const REVERSE_REGISTRAR_ABI = [
  {
    name: 'node',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'addr', type: 'address' }],
    outputs: [{ type: 'bytes32' }],
  },
] as const

function calculateSubnameNode(label: string, rootNode: `0x${string}`): `0x${string}` {
  const labelHash = keccak256(toBytes(label))
  return keccak256(encodePacked(['bytes32', 'bytes32'], [rootNode, labelHash]))
}

function extractLabel(fullName: string): string {
  const parts = fullName.split('.')
  if (parts.length === 0) return fullName
  return parts[0]
}

// Default Base Sepolia RPC (public endpoint)
const DEFAULT_BASE_SEPOLIA_RPC = 'https://base-sepolia.g.alchemy.com/v2/lrMqugbPNZcypSuWA_g9C'

export async function queryBasename(basename: string) {
  const rpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL || DEFAULT_BASE_SEPOLIA_RPC
  
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(rpcUrl),
  })

  const normalizedName = normalize(basename)
  const label = extractLabel(normalizedName)
  const node = calculateSubnameNode(label, PARENT_NODE)

  // Get resolver
  const resolver = await publicClient.readContract({
    address: REGISTRY,
    abi: REGISTRY_ABI,
    functionName: 'resolver',
    args: [node],
  }) as Address

  if (!resolver || resolver === '0x0000000000000000000000000000000000000000') {
    return {
      basename: normalizedName,
      node,
      resolver: null,
      owner: null,
      addressRecord: null,
      primaryName: null,
      records: {},
    }
  }

  // Get owner
  const owner = await publicClient.readContract({
    address: REGISTRY,
    abi: REGISTRY_ABI,
    functionName: 'owner',
    args: [node],
  }) as Address

  // Get address record
  let addressRecord: Address | null = null
  try {
    addressRecord = await publicClient.readContract({
      address: resolver,
      abi: RESOLVER_ABI,
      functionName: 'addr',
      args: [node],
    }) as Address
    if (addressRecord === '0x0000000000000000000000000000000000000000') {
      addressRecord = null
    }
  } catch (error) {
    // Address record not set
  }

  // Get text records
  const records: Record<string, string | null> = {}
  const textKeys = ['avatar', 'description', 'address']
  for (const key of textKeys) {
    try {
      const value = await publicClient.readContract({
        address: resolver,
        abi: RESOLVER_ABI,
        functionName: 'text',
        args: [node, key],
      }) as string
      records[key] = value || null
    } catch (error) {
      records[key] = null
    }
  }

  // Get reverse resolution (primary name)
  let primaryName: string | null = null
  if (addressRecord) {
    try {
      const reverseNode = await publicClient.readContract({
        address: REVERSE_REGISTRAR,
        abi: REVERSE_REGISTRAR_ABI,
        functionName: 'node',
        args: [addressRecord],
      }) as `0x${string}`

      if (reverseNode !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
        try {
          primaryName = await publicClient.readContract({
            address: RESOLVER,
            abi: RESOLVER_ABI,
            functionName: 'name',
            args: [reverseNode],
          }) as string
        } catch (error) {
          // Primary name not set
        }
      }
    } catch (error) {
      // Reverse resolution not set
    }
  }

  return {
    basename: normalizedName,
    node,
    resolver,
    owner,
    addressRecord,
    primaryName,
    records,
  }
}

