/**
 * Basename Registration Functions
 * Adapted from register-basename.ts for frontend use
 */

import { createPublicClient, createWalletClient, http, encodeFunctionData, type Address, type Hex } from 'viem'
import { baseSepolia } from 'viem/chains'
import { namehash, keccak256, encodePacked, toBytes } from 'viem'
import { normalize } from 'viem/ens'

// Configuration - these should come from environment variables
const REGISTRAR_CONTROLLER = process.env.NEXT_PUBLIC_BASENAMES_REGISTRAR_CONTROLLER_BASE_SEPOLIA as `0x${string}` || '0x49ae3cc2e3aa768b1e5654f5d3c6002144a59581'
const RESOLVER = process.env.NEXT_PUBLIC_BASENAMES_RESOLVER_BASE_SEPOLIA as `0x${string}` || '0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA'
const MIN_DURATION = 365 * 24 * 60 * 60
const PARENT_DOMAIN = 'basetest.eth'
const PARENT_NODE = namehash(PARENT_DOMAIN) as `0x${string}`

const REGISTRAR_CONTROLLER_ABI = [
  {
    name: 'available',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'name', type: 'string' }],
    outputs: [{ type: 'bool' }],
  },
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
] as const

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
] as const

function calculateSubnameNode(label: string, rootNode: `0x${string}`): `0x${string}` {
  const labelHash = keccak256(toBytes(label))
  return keccak256(encodePacked(['bytes32', 'bytes32'], [rootNode, labelHash]))
}

function buildResolverData(
  subnameNode: `0x${string}`,
  addressToSet: Address,
  textRecords?: Record<string, string>
): `0x${string}`[] {
  const data: `0x${string}`[] = []
  data.push(
    encodeFunctionData({
      abi: RESOLVER_ABI,
      functionName: 'setAddr',
      args: [subnameNode, addressToSet],
    })
  )
  if (textRecords) {
    for (const [key, value] of Object.entries(textRecords)) {
      data.push(
        encodeFunctionData({
          abi: RESOLVER_ABI,
          functionName: 'setText',
          args: [subnameNode, key, value],
        })
      )
    }
  }
  return data
}

export async function registerBasenameWithRecords(
  name: string,
  owner: Address,
  addressToSet: Address,
  duration: number = MIN_DURATION,
  textRecords?: Record<string, string>,
  reverseRecord: boolean = false
): Promise<{
  txHash: `0x${string}`
  subnameNode: `0x${string}`
  fullName: string
  price: bigint
}> {
  // Note: This function needs to be called from the client side with a wallet connection
  // The actual transaction signing will be handled by wagmi/rainbowkit
  // For now, we'll return the calldata that needs to be sent
  
  const normalizedName = normalize(name)
  const fullName = `${normalizedName}.${PARENT_DOMAIN}`
  const subnameNode = calculateSubnameNode(normalizedName, PARENT_NODE)
  const resolverData: `0x${string}`[] = []

  // Default Base Sepolia RPC (public endpoint)
  const DEFAULT_BASE_SEPOLIA_RPC = 'https://base-sepolia.g.alchemy.com/v2/lrMqugbPNZcypSuWA_g9C'
  
  // Get price
  const rpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL || DEFAULT_BASE_SEPOLIA_RPC
  
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(rpcUrl),
  })

  const price = await publicClient.readContract({
    address: REGISTRAR_CONTROLLER,
    abi: REGISTRAR_CONTROLLER_ABI,
    functionName: 'registerPrice',
    args: [normalizedName, BigInt(duration)],
  }) as bigint

  const request = {
    name: normalizedName,
    owner: owner,
    duration: BigInt(duration),
    resolver: RESOLVER,
    data: resolverData,
    reverseRecord: reverseRecord,
  }

  // Return the request data - the actual transaction will be handled by the component
  return {
    txHash: '0x' as `0x${string}`, // Will be set by the transaction
    subnameNode,
    fullName,
    price,
  }
}

