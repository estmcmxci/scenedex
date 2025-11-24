'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { normalize } from 'viem/ens'
import { namehash, keccak256, encodePacked, toBytes, encodeFunctionData } from 'viem'

const REGISTRAR_CONTROLLER = '0x49ae3cc2e3aa768b1e5654f5d3c6002144a59581' as `0x${string}`
const RESOLVER = '0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA' as `0x${string}`
const PARENT_DOMAIN = 'basetest.eth'
const PARENT_NODE = namehash(PARENT_DOMAIN) as `0x${string}`

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
  {
    name: 'multicall',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'data', type: 'bytes[]' }],
    outputs: [{ name: 'results', type: 'bytes[]' }],
  },
] as const

function calculateSubnameNode(label: string, rootNode: `0x${string}`): `0x${string}` {
  const labelHash = keccak256(toBytes(label))
  return keccak256(encodePacked(['bytes32', 'bytes32'], [rootNode, labelHash]))
}

export function RegisterBasename() {
  const { address, isConnected } = useAccount()
  const [name, setName] = useState('')
  const [addressToSet, setAddressToSet] = useState('')
  const [description, setDescription] = useState('')
  const [step, setStep] = useState<'register' | 'setRecords' | 'done'>('register')
  const [registerTxHash, setRegisterTxHash] = useState<`0x${string}` | null>(null)

  const normalizedName = name ? normalize(name) : ''
  const fullName = normalizedName ? `${normalizedName}.${PARENT_DOMAIN}` : ''
  const duration = BigInt(365 * 24 * 60 * 60) // 1 year

  // Get registration price
  const { data: price } = useReadContract({
    address: REGISTRAR_CONTROLLER,
    abi: REGISTRAR_CONTROLLER_ABI,
    functionName: 'registerPrice',
    args: normalizedName ? [normalizedName, duration] : undefined,
    query: { enabled: !!normalizedName },
  })

  // Register transaction
  const { writeContract: registerWrite, isPending: isRegistering, data: registerHash } = useWriteContract()
  const { isLoading: isWaitingRegister, isSuccess: isRegisterSuccess } = useWaitForTransactionReceipt({
    hash: registerHash || registerTxHash || undefined,
  })

  // Set resolver records transaction
  const { writeContract: setRecordsWrite, isPending: isSettingRecords } = useWriteContract()

  const handleRegister = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet')
      return
    }

    if (!name || !addressToSet) {
      alert('Please fill in name and address to set')
      return
    }

    try {
      const request = {
        name: normalizedName,
        owner: address,
        duration: duration,
        resolver: RESOLVER,
        data: [],
        reverseRecord: false,
      }

      registerWrite({
        address: REGISTRAR_CONTROLLER,
        abi: REGISTRAR_CONTROLLER_ABI,
        functionName: 'register',
        args: [request],
        value: price || BigInt(0),
      })
    } catch (err: any) {
      alert(err.message || 'Registration failed')
    }
  }

  // After registration succeeds, set resolver records
  if (isRegisterSuccess && step === 'register' && (registerHash || registerTxHash)) {
    const hash = registerHash || registerTxHash
    if (hash && !registerTxHash) {
      setRegisterTxHash(hash)
    }
    setStep('setRecords')
    const subnameNode = calculateSubnameNode(normalizedName, PARENT_NODE)
    const resolverData: `0x${string}`[] = []

    resolverData.push(
      encodeFunctionData({
        abi: RESOLVER_ABI,
        functionName: 'setAddr',
        args: [subnameNode, addressToSet as `0x${string}`],
      })
    )

    if (description) {
      resolverData.push(
        encodeFunctionData({
          abi: RESOLVER_ABI,
          functionName: 'setText',
          args: [subnameNode, 'description', description],
        })
      )
    }

    setRecordsWrite({
      address: RESOLVER,
      abi: RESOLVER_ABI,
      functionName: 'multicall',
      args: [resolverData],
    })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Register Basename</h2>
      
      {!isConnected && (
        <div className="mb-4">
          <ConnectButton />
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Basename (label only, e.g., "mysubname")
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="mysubname"
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            disabled={isRegistering || isSettingRecords}
          />
          <p className="text-sm text-gray-500 mt-1">
            Will be registered as: {fullName || 'name.basetest.eth'}
          </p>
          {price && (
            <p className="text-sm text-gray-500 mt-1">
              Price: {(Number(price) / 1e18).toFixed(6)} ETH
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Address to Set (forward resolution)
          </label>
          <input
            type="text"
            value={addressToSet}
            onChange={(e) => setAddressToSet(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            disabled={isRegistering || isSettingRecords}
          />
          <p className="text-sm text-gray-500 mt-1">
            The address this basename will resolve to
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Description (optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="My basename description"
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            disabled={isRegistering || isSettingRecords}
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={isRegistering || isSettingRecords || !isConnected || !name || !addressToSet}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRegistering || isWaitingRegister
            ? 'Registering...'
            : isSettingRecords
            ? 'Setting records...'
            : 'Register Basename'}
        </button>

        {registerTxHash && (
          <div className="bg-blue-100 dark:bg-blue-900 border border-blue-400 text-blue-700 dark:text-blue-300 px-4 py-3 rounded">
            Registration TX: {registerTxHash}
          </div>
        )}

        {isRegisterSuccess && step === 'setRecords' && (
          <div className="bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-300 px-4 py-3 rounded">
            ✅ Registration complete! Setting resolver records...
          </div>
        )}
      </div>
    </div>
  )
}
