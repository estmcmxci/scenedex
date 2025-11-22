"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useSignMessage, useSendTransaction, useWaitForTransactionReceipt, useChainId } from "wagmi"
import { AudioPlayer } from "@/app/components/audio-player"

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: {
      on: (event: string, handler: (...args: any[]) => void) => void
      removeListener: (event: string, handler: (...args: any[]) => void) => void
      request: (args: { method: string; params?: any[] }) => Promise<any>
    }
  }
}

export default function CuratorDashboardPage() {
  const [releases, setReleases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [approving, setApproving] = useState<string | null>(null)
  const [rejecting, setRejecting] = useState<string | null>(null)
  const [thresholdMetReleases, setThresholdMetReleases] = useState<Map<string, any>>(new Map()) // Release ID -> contractTxData
  const [sendingContracts, setSendingContracts] = useState<string | null>(null)
  
  // Safe linking state
  const [safeAddress, setSafeAddress] = useState<string | null>(null)
  const [safeLoading, setSafeLoading] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkSafeAddress, setLinkSafeAddress] = useState('')
  const [linking, setLinking] = useState(false)
  const [linkError, setLinkError] = useState<string | null>(null)
  
  // ENS resolution state
  const [walletEnsName, setWalletEnsName] = useState<string | null>(null)
  const [safeEnsName, setSafeEnsName] = useState<string | null>(null)
  const [creatorEnsNames, setCreatorEnsNames] = useState<Map<string, string | null>>(new Map())
  
  const { address, isConnected, chain } = useAccount()
  const chainId = useChainId()
  const { signMessageAsync } = useSignMessage()
  const { sendTransaction } = useSendTransaction()
  
  // Use chainId from hook as it's more reliable than chain?.id
  const currentChainId = chainId || chain?.id

  // Listen for chain changes via window.ethereum to update UI
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return

    const handleChainChanged = () => {
      // Just log - don't reload, let wagmi update naturally
      console.log('Chain changed detected via window.ethereum')
    }

    window.ethereum.on('chainChanged', handleChainChanged)

    return () => {
      window.ethereum?.removeListener('chainChanged', handleChainChanged)
    }
  }, [])

  // Remove auto-send logic - user will click "Create Contracts" button manually

  // Fetch pending releases
  useEffect(() => {
    async function fetchPendingReleases() {
      try {
        const response = await fetch('/api/releases/pending')
        const data = await response.json()
        
        if (data.success) {
          setReleases(data.releases)
        }
      } catch (error) {
        console.error('Failed to fetch pending releases:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPendingReleases()
  }, [])

  // Fetch Safe address when wallet connects (with auto-detection)
  useEffect(() => {
    async function fetchSafeAddress() {
      if (!isConnected || !address) {
        setSafeAddress(null)
        return
      }

      setSafeLoading(true)
      try {
        // First, check if Safe is already linked
        const response = await fetch(`/api/user/safe?walletAddress=${address}`)
        const data = await response.json()
        
        if (data.success && data.data.hasSafe) {
          setSafeAddress(data.data.safeAddress)
          setSafeLoading(false)
          return
        }

        // If not linked, try auto-detection
        console.log('No linked Safe found, attempting dynamic Safe discovery...')
        const autoDetectResponse = await fetch('/api/user/safe/auto-detect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: address }),
        })

        const autoDetectData = await autoDetectResponse.json()
        
        if (autoDetectData.success && autoDetectData.data.safeAddress) {
          const discoveredCount = autoDetectData.data.discoveredSafes?.length || 0
          console.log(`✅ Safe auto-detected and linked: ${autoDetectData.data.safeAddress}`)
          if (discoveredCount > 0) {
            console.log(`   Discovered ${discoveredCount} Safe(s) total`)
          }
          setSafeAddress(autoDetectData.data.safeAddress)
        } else {
          // Auto-detection failed, user needs to manually link
          const discoveredCount = autoDetectData.discoveredSafes?.length || 0
          if (discoveredCount > 0) {
            console.log(`⚠️ Discovered ${discoveredCount} Safe(s) but failed to link:`, autoDetectData.error)
          } else {
            console.log('Auto-detection failed:', autoDetectData.error)
          }
          setSafeAddress(null)
        }
      } catch (error) {
        console.error('Failed to fetch Safe address:', error)
        setSafeAddress(null)
      } finally {
        setSafeLoading(false)
      }
    }

    fetchSafeAddress()
  }, [isConnected, address])

  // Resolve connected wallet address to ENS name
  useEffect(() => {
    async function resolveWalletENS() {
      if (!isConnected || !address) {
        setWalletEnsName(null)
        return
      }

      try {
        const response = await fetch(`/api/ens/resolve?address=${address}`)
        const data = await response.json()
        if (data.success && data.data.name) {
          setWalletEnsName(data.data.name)
        }
      } catch (error) {
        console.error("Failed to resolve wallet ENS name:", error)
      }
    }
    resolveWalletENS()
  }, [isConnected, address])

  // Resolve Safe address to ENS name
  useEffect(() => {
    async function resolveSafeENS() {
      if (!safeAddress) {
        setSafeEnsName(null)
        return
      }

      try {
        const response = await fetch(`/api/ens/resolve?address=${safeAddress}`)
        const data = await response.json()
        if (data.success && data.data.name) {
          setSafeEnsName(data.data.name)
        }
      } catch (error) {
        console.error("Failed to resolve Safe ENS name:", error)
      }
    }
    resolveSafeENS()
  }, [safeAddress])

  // Resolve creator addresses to ENS names
  useEffect(() => {
    async function resolveCreatorENS() {
      if (releases.length === 0) return

      const uniqueAddresses = new Set<string>()
      releases.forEach((release) => {
        if (release.createdBy) {
          uniqueAddresses.add(release.createdBy.toLowerCase())
        }
      })

      // Resolve all unique addresses in parallel
      const promises = Array.from(uniqueAddresses).map(async (addr) => {
        try {
          const response = await fetch(`/api/ens/resolve?address=${addr}`)
          const data = await response.json()
          return {
            address: addr,
            name: data.success && data.data.name ? data.data.name : null,
          }
        } catch (error) {
          console.error(`Failed to resolve ENS for ${addr}:`, error)
          return { address: addr, name: null }
        }
      })

      const results = await Promise.all(promises)
      const newMap = new Map<string, string | null>()
      results.forEach(({ address, name }) => {
        newMap.set(address, name)
      })
      setCreatorEnsNames(newMap)
    }

    resolveCreatorENS()
  }, [releases])

  const toggleExpand = async (releaseId: string) => {
    if (expandedRow === releaseId) {
      // Collapse
      setExpandedRow(null)
      setAudioUrl(null)
      setCoverUrl(null)
    } else {
      // Expand and fetch audio + cover
      setExpandedRow(releaseId)
      
      // Fetch audio
      try {
        const response = await fetch(`/api/releases/${releaseId}/audio`)
        if (response.ok) {
          const blob = await response.blob()
          const url = URL.createObjectURL(blob)
          setAudioUrl(url)
        }
      } catch (error) {
        console.error('Failed to fetch audio:', error)
      }

      // Fetch cover
      try {
        const response = await fetch(`/api/releases/${releaseId}/cover`)
        if (response.ok) {
          const blob = await response.blob()
          const url = URL.createObjectURL(blob)
          setCoverUrl(url)
        }
      } catch (error) {
        console.error('Failed to fetch cover:', error)
      }
    }
  }

  const sendContractTransactions = async (releaseId: string, contractTxData: any) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected')
    }

    if (currentChainId !== 84532) {
      throw new Error('Please switch to Base Sepolia network (Chain ID: 84532)')
    }

    const { splitTransaction, zoraTransaction, predictedSplitAddress } = contractTxData

    // Send split creation transaction
    console.log('Sending split creation transaction...')
    const splitTxResult = sendTransaction({
      to: splitTransaction.to as `0x${string}`,
      data: splitTransaction.data as `0x${string}`,
      value: BigInt(splitTransaction.value || '0'),
    })
    
    const splitTxHash = (await splitTxResult).hash
    console.log('Split transaction sent:', splitTxHash)

    // Wait for split transaction confirmation
    const { createPublicClient, http } = await import('viem')
    const { baseSepolia } = await import('viem/chains')
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://sepolia.base.org'),
    })
    
    let splitReceipt = null
    while (!splitReceipt) {
      try {
        splitReceipt = await publicClient.getTransactionReceipt({ hash: splitTxHash })
      } catch (e) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }
    console.log('Split transaction confirmed:', splitReceipt.blockNumber)

    // Send Zora coin creation transaction
    console.log('Sending Zora coin creation transaction...')
    const zoraTxResult = sendTransaction({
      to: zoraTransaction.to as `0x${string}`,
      data: zoraTransaction.data as `0x${string}`,
      value: BigInt(zoraTransaction.value || '0'),
    })
    
    const zoraTxHash = (await zoraTxResult).hash
    console.log('Zora transaction sent:', zoraTxHash)

    // Wait for Zora transaction confirmation
    let zoraReceipt = null
    while (!zoraReceipt) {
      try {
        zoraReceipt = await publicClient.getTransactionReceipt({ hash: zoraTxHash })
      } catch (e) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }
    console.log('Zora transaction confirmed:', zoraReceipt.blockNumber)

    // Notify backend that contracts are created
    const notifyResponse = await fetch(`/api/releases/${releaseId}/contracts-created`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        splitTxHash,
        zoraTxHash,
        predictedSplitAddress,
      }),
    })

    if (!notifyResponse.ok) {
      throw new Error('Failed to notify backend')
    }

    const notifyResult = await notifyResponse.json()
    if (!notifyResult.success) {
      throw new Error(notifyResult.error || 'Backend error')
    }

    return { splitTxHash, zoraTxHash }
  }

  const handleApprove = async (releaseId: string) => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first')
      return
    }

    setApproving(releaseId)

    try {
      // Sign the releaseId message (EIP-191)
      console.log(`Signing approval for release: ${releaseId}`)
      const signature = await signMessageAsync({ message: releaseId })
      console.log(`Signature: ${signature}`)

      // Send approval to backend
      const response = await fetch('/api/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ releaseId, signature }),
      })

      const result = await response.json()

      if (result.success) {
        // If threshold is met, store transaction data for manual "Create Contracts" button
        if (result.data.thresholdMet && result.data.contractTxData) {
          console.log('Threshold met - storing contract transaction data for manual trigger')
          setThresholdMetReleases(prev => new Map(prev).set(releaseId, result.data.contractTxData))
          alert('✅ Threshold met! Click "Create Contracts" to proceed with contract creation.')
        } else {
          alert(result.data.message)
        }

        // Refresh the pending releases list
        const refreshResponse = await fetch('/api/releases/pending')
        const refreshData = await refreshResponse.json()
        if (refreshData.success) {
          setReleases(refreshData.releases)
        }
      } else {
        alert(`Approval failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Approval error:', error)
      alert(`Failed to approve: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setApproving(null)
    }
  }

  const handleLinkSafe = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first')
      return
    }

    if (!linkSafeAddress || !linkSafeAddress.startsWith('0x') || linkSafeAddress.length !== 42) {
      setLinkError('Invalid Safe address. Must be a valid Ethereum address (0x...)')
      return
    }

    setLinking(true)
    setLinkError(null)

    try {
      // Sign message to prove wallet ownership
      const message = `link-safe:${linkSafeAddress}`
      const signature = await signMessageAsync({ message })

      // Link Safe to wallet
      const response = await fetch('/api/user/safe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          safeAddress: linkSafeAddress,
          signature,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSafeAddress(linkSafeAddress)
        setShowLinkModal(false)
        setLinkSafeAddress('')
        alert('Safe linked successfully!')
      } else {
        setLinkError(result.error || 'Failed to link Safe')
      }
    } catch (error) {
      console.error('Link Safe error:', error)
      setLinkError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLinking(false)
    }
  }

  const handleReject = async (releaseId: string) => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first')
      return
    }

    // Ask for optional rejection reason
    const reason = prompt('Enter rejection reason (optional):')
    
    // User cancelled the prompt
    if (reason === null) {
      return
    }

    setRejecting(releaseId)

    try {
      // Sign the releaseId message (EIP-191)
      console.log(`Signing rejection for release: ${releaseId}`)
      const signature = await signMessageAsync({ message: releaseId })
      console.log(`Signature: ${signature}`)

      // Send rejection to backend
      const response = await fetch('/api/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ releaseId, signature, reason: reason || undefined }),
      })

      const result = await response.json()

      if (result.success) {
        alert(result.data.message)
        // Refresh the pending releases list
        const refreshResponse = await fetch('/api/releases/pending')
        const refreshData = await refreshResponse.json()
        if (refreshData.success) {
          setReleases(refreshData.releases)
        }
      } else {
        alert(`Rejection failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Rejection error:', error)
      alert(`Failed to reject: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setRejecting(null)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <header className="border-b border-white p-4 flex justify-between items-center sticky top-0 bg-black z-10">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-4 h-4 bg-white" />
          <span className="font-bold text-xl tracking-tighter">scenedex</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-sm uppercase">Curator Mode</div>
          <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
              const ready = mounted
              const connected = ready && account && chain

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          type="button"
                          className="px-4 py-2 border border-white text-white font-bold uppercase text-xs hover:bg-white hover:text-black transition-colors"
                        >
                          Connect
                        </button>
                      )
                    }

                    return (
                      <button
                        onClick={openAccountModal}
                        type="button"
                        className="px-4 py-2 border border-white text-white font-bold uppercase text-xs hover:bg-white hover:text-black transition-colors"
                      >
                        {walletEnsName || account.displayName}
                      </button>
                    )
                  })()}
                </div>
              )
            }}
          </ConnectButton.Custom>
        </div>
      </header>

      <main className="p-4 md:p-8">
        {/* Safe Status Section */}
        {isConnected && address && (
          <div className="border border-white p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm uppercase text-gray-500 font-bold mb-2">Safe Status</h2>
                {safeLoading ? (
                  <div className="text-sm text-gray-500">Checking Safe...</div>
                ) : safeAddress ? (
                  <div className="flex items-center gap-3">
                    <div className="text-sm">
                      <span className="text-green-500">●</span> Linked Safe:{' '}
                      {safeEnsName ? (
                        <span className="font-semibold text-white">{safeEnsName} <span className="font-mono text-xs text-gray-400">({safeAddress})</span></span>
                      ) : (
                        <span className="font-mono ml-2">{safeAddress}</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-yellow-500">
                    ⚠️ No Safe linked. You need to link a Safe to approve releases.
                  </div>
                )}
              </div>
              {!safeAddress && (
                <button
                  onClick={() => setShowLinkModal(true)}
                  className="px-4 py-2 border border-white text-white font-bold uppercase text-xs hover:bg-white hover:text-black transition-colors"
                >
                  Link Safe
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-end mb-8">
          <h1 className="text-2xl font-bold uppercase">Pending Approvals</h1>
          <div className="text-sm text-gray-500">QUEUE: {releases.length}</div>
        </div>


        {loading ? (
          <div className="border border-white p-12 text-center text-gray-500 uppercase">
            Loading pending releases...
          </div>
        ) : (
          <div className="border border-white">
            <div className="grid grid-cols-12 border-b border-white bg-white text-black text-xs uppercase font-bold p-3">
              <div className="col-span-2">ID</div>
              <div className="col-span-3">Artist</div>
              <div className="col-span-4">Title</div>
              <div className="col-span-3 text-right">Action</div>
            </div>

            {releases.map((release) => (
              <div key={release.id}>
                {/* Main Row */}
                <div
                  className="grid grid-cols-12 border-b border-gray-800 p-4 items-center hover:bg-gray-900 cursor-pointer"
                  onClick={() => toggleExpand(release.id)}
                >
                  <div className="col-span-2 font-mono text-gray-500 text-xs">{release.id.substring(0, 20)}...</div>
                  <div className="col-span-3 font-bold">{release.artist}</div>
                  <div className="col-span-4 text-gray-400">{release.title}</div>
                  <div className="col-span-3 flex justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!safeAddress) {
                          alert('Please link a Safe first to approve releases')
                          setShowLinkModal(true)
                          return
                        }
                        handleApprove(release.id)
                      }}
                      disabled={!isConnected || !safeAddress || approving === release.id}
                      className="px-3 py-1 border border-gray-600 hover:border-green-500 hover:text-green-500 text-xs uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={!safeAddress ? 'Link a Safe first' : ''}
                    >
                      {approving === release.id ? 'Signing...' : 'Approve'}
                    </button>
                    {thresholdMetReleases.has(release.id) && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation()
                          if (!isConnected || !address) {
                            alert('Please connect your wallet first')
                            return
                          }
                          if (currentChainId !== 84532) {
                            alert('Please switch to Base Sepolia network (Chain ID: 84532)')
                            return
                          }
                          
                          const contractTxData = thresholdMetReleases.get(release.id)
                          if (!contractTxData) return
                          
                          setSendingContracts(release.id)
                          try {
                            await sendContractTransactions(release.id, contractTxData)
                            setThresholdMetReleases(prev => {
                              const next = new Map(prev)
                              next.delete(release.id)
                              return next
                            })
                            alert('✅ Contracts created! Publication in progress...')
                            const refreshResponse = await fetch('/api/releases/pending')
                            const refreshData = await refreshResponse.json()
                            if (refreshData.success) {
                              setReleases(refreshData.releases)
                            }
                          } catch (error) {
                            console.error('Failed to send contract transactions:', error)
                            alert(`⚠️ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
                          } finally {
                            setSendingContracts(null)
                          }
                        }}
                        disabled={sendingContracts === release.id || currentChainId !== 84532}
                        className="px-3 py-1 border border-yellow-500 hover:border-yellow-400 hover:text-yellow-400 text-xs uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={currentChainId !== 84532 ? 'Switch to Base Sepolia first' : 'Create split and Zora contracts'}
                      >
                        {sendingContracts === release.id ? 'Creating...' : 'Create Contracts'}
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!safeAddress) {
                          alert('Please link a Safe first to reject releases')
                          setShowLinkModal(true)
                          return
                        }
                        handleReject(release.id)
                      }}
                      disabled={!isConnected || !safeAddress || rejecting === release.id}
                      className="px-3 py-1 border border-gray-600 hover:border-red-500 hover:text-red-500 text-xs uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={!safeAddress ? 'Link a Safe first' : ''}
                    >
                      {rejecting === release.id ? 'Signing...' : 'Reject'}
                    </button>
                  </div>
                </div>

                {/* Expanded Preview Row */}
                {expandedRow === release.id && (
                  <div className="border-b border-gray-800 bg-black p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-sm uppercase text-gray-500 font-bold mb-2">Details</h3>
                        <div className="space-y-2 text-sm">
                          <div><span className="text-gray-500">Artist:</span> {release.artist}</div>
                          <div><span className="text-gray-500">Title:</span> {release.title}</div>
                          <div><span className="text-gray-500">Description:</span> {release.description}</div>
                          <div><span className="text-gray-500">Submitted By:</span> 
                            {release.createdBy && (() => {
                              const creatorAddr = release.createdBy.toLowerCase()
                              const creatorName = creatorEnsNames.get(creatorAddr)
                              return creatorName ? (
                                <div className="mt-1">
                                  <div className="font-semibold text-white">{creatorName}</div>
                                  <span className="font-mono text-xs text-gray-400">{release.createdBy}</span>
                                </div>
                              ) : (
                                <span className="font-mono text-xs ml-1">{release.createdBy}</span>
                              )
                            })()}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm uppercase text-gray-500 font-bold mb-2">Cover Art</h3>
                        {coverUrl ? (
                          <img 
                            src={coverUrl} 
                            alt={release.title}
                            className="w-full aspect-square object-cover border border-white"
                          />
                        ) : (
                          <div className="w-full aspect-square border border-gray-800 flex items-center justify-center text-gray-500 text-sm">
                            Loading cover...
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm uppercase text-gray-500 font-bold mb-2">Audio Preview</h3>
                        {audioUrl ? (
                          <AudioPlayer audioUrl={audioUrl} />
                        ) : (
                          <div className="text-gray-500 text-sm">Loading audio...</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {releases.length === 0 && <div className="p-12 text-center text-gray-500 uppercase">No pending releases</div>}
          </div>
        )}
      </main>

      {/* Link Safe Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-black border border-white p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold uppercase mb-4">Link Safe</h2>
            
            <div className="mb-4">
              <label className="block text-sm uppercase text-gray-500 mb-2">
                Safe Address
              </label>
              <input
                type="text"
                value={linkSafeAddress}
                onChange={(e) => {
                  setLinkSafeAddress(e.target.value)
                  setLinkError(null)
                }}
                placeholder="0x..."
                className="w-full px-3 py-2 bg-black border border-white text-white font-mono text-sm focus:outline-none focus:border-green-500"
              />
              <div className="text-xs text-gray-500 mt-1">
                Enter the Safe contract address you want to link to your wallet
              </div>
            </div>

            {linkError && (
              <div className="mb-4 p-3 border border-red-500 text-red-500 text-sm">
                {linkError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleLinkSafe}
                disabled={linking || !linkSafeAddress}
                className="flex-1 px-4 py-2 border border-white text-white font-bold uppercase text-xs hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {linking ? 'Linking...' : 'Verify & Link'}
              </button>
              <button
                onClick={() => {
                  setShowLinkModal(false)
                  setLinkSafeAddress('')
                  setLinkError(null)
                }}
                disabled={linking}
                className="px-4 py-2 border border-gray-600 text-gray-400 font-bold uppercase text-xs hover:border-white hover:text-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              <p>You'll be asked to sign a message to verify wallet ownership.</p>
              <p className="mt-1">The system will verify that your wallet is an owner of this Safe.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

