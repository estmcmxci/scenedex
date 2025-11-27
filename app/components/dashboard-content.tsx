"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useAccount, useSignMessage, useSendTransaction, useChainId } from "wagmi"
import { AudioPlayer } from "@/app/components/audio-player"
import { cn } from "@/lib/utils"
import { LiquidGlass } from "@liquidglass/react"
import { X, Check } from "lucide-react"
import { PublishingModal, PublishingStep } from "./publishing-modal"


interface DashboardContentProps {
  className?: string
}

export function DashboardContent({ className }: DashboardContentProps) {
  const [releases, setReleases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [approving, setApproving] = useState<string | null>(null)
  const [rejecting, setRejecting] = useState<string | null>(null)
  const [thresholdMetReleases, setThresholdMetReleases] = useState<Map<string, any>>(new Map())
  const [sendingContracts, setSendingContracts] = useState<string | null>(null)
  
  // Safe linking state
  const [safeAddress, setSafeAddress] = useState<string | null>(null)
  const [safeLoading, setSafeLoading] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkSafeAddress, setLinkSafeAddress] = useState('')
  const [linking, setLinking] = useState(false)
  const [linkError, setLinkError] = useState<string | null>(null)
  
  // ENS resolution state
  const [safeEnsName, setSafeEnsName] = useState<string | null>(null)
  const [creatorEnsNames, setCreatorEnsNames] = useState<Map<string, string | null>>(new Map())
  
  // Rejection modal state
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReleaseId, setRejectReleaseId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [mounted, setMounted] = useState(false)
  
  // Rejection success modal state
  const [showRejectSuccessModal, setShowRejectSuccessModal] = useState(false)
  const [rejectedReleaseId, setRejectedReleaseId] = useState<string | null>(null)
  
  // Threshold met modal state
  const [showThresholdMetModal, setShowThresholdMetModal] = useState(false)
  const [thresholdMetReleaseId, setThresholdMetReleaseId] = useState<string | null>(null)
  
  // Publishing modal state
  const [showPublishingModal, setShowPublishingModal] = useState(false)
  const [publishingStep, setPublishingStep] = useState<PublishingStep>("preparing")
  const [publishingRelease, setPublishingRelease] = useState<{ id: string; title: string; artist: string } | null>(null)
  const [publishingError, setPublishingError] = useState<string | undefined>()
  
  const { address, isConnected, chain } = useAccount()
  const chainId = useChainId()
  const { signMessageAsync } = useSignMessage()
  const { sendTransactionAsync } = useSendTransaction()
  
  const currentChainId = chainId || chain?.id

  useEffect(() => {
    setMounted(true)
  }, [])

  // Listen for chain changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return

    const handleChainChanged = () => {
      console.log('Chain changed detected via window.ethereum')
    }

    window.ethereum.on('chainChanged', handleChainChanged)

    return () => {
      window.ethereum?.removeListener('chainChanged', handleChainChanged)
    }
  }, [])

  // Fetch pending releases
  useEffect(() => {
    async function fetchPendingReleases() {
      try {
        const response = await fetch('/api/releases/pending')
        const data = await response.json()
        
        if (data.success) {
          setReleases(data.releases)
          
          // Initialize thresholdMetReleases based on releases that have met threshold
          const thresholdMetMap = new Map<string, boolean>()
          for (const release of data.releases) {
            if (release.thresholdMet) {
              thresholdMetMap.set(release.id, true)
            }
          }
          setThresholdMetReleases(thresholdMetMap)
        }
      } catch (error) {
        console.error('Failed to fetch pending releases:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPendingReleases()
  }, [])

  // Fetch Safe address when wallet connects
  useEffect(() => {
    async function fetchSafeAddress() {
      if (!isConnected || !address) {
        setSafeAddress(null)
        return
      }

      setSafeLoading(true)
      try {
        const response = await fetch(`/api/user/safe?walletAddress=${address}`)
        const data = await response.json()
        
        if (data.success && data.data.hasSafe) {
          setSafeAddress(data.data.safeAddress)
          setSafeLoading(false)
          return
        }

        console.log('No linked Safe found, attempting dynamic Safe discovery...')
        const autoDetectResponse = await fetch('/api/user/safe/auto-detect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: address }),
        })

        const autoDetectData = await autoDetectResponse.json()
        
        if (autoDetectData.success && autoDetectData.data.safeAddress) {
          console.log(`✅ Safe auto-detected and linked: ${autoDetectData.data.safeAddress}`)
          setSafeAddress(autoDetectData.data.safeAddress)
        } else {
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
      setExpandedRow(null)
      setAudioUrl(null)
      setCoverUrl(null)
    } else {
      setExpandedRow(releaseId)
      
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

    console.log('Sending split creation transaction...')
    const splitTxHash = await sendTransactionAsync({
      to: splitTransaction.to as `0x${string}`,
      data: splitTransaction.data as `0x${string}`,
      value: BigInt(splitTransaction.value || '0'),
    })

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

    console.log('Sending Zora coin creation transaction...')
    const zoraTxHash = await sendTransactionAsync({
      to: zoraTransaction.to as `0x${string}`,
      data: zoraTransaction.data as `0x${string}`,
      value: BigInt(zoraTransaction.value || '0'),
    })

    let zoraReceipt = null
    while (!zoraReceipt) {
      try {
        zoraReceipt = await publicClient.getTransactionReceipt({ hash: zoraTxHash })
      } catch (e) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    const notifyResponse = await fetch(`/api/releases/${releaseId}/contracts-created`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        splitTxHash,
        zoraTxHash,
        predictedSplitAddress,
        curatorAddress: address, // Include connected wallet as curator
      }),
    })

    if (!notifyResponse.ok) {
      const errorData = await notifyResponse.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to notify backend (${notifyResponse.status})`)
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
      const signature = await signMessageAsync({ message: releaseId })

      const response = await fetch('/api/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ releaseId, signature }),
      })

      const result = await response.json()

      if (result.success) {
        if (result.data.thresholdMet) {
          // Mark this release as ready for contract creation
          setThresholdMetReleases(prev => new Map(prev).set(releaseId, true))
          setThresholdMetReleaseId(releaseId)
          setShowThresholdMetModal(true)
        } else {
          alert(result.data.message)
        }

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
      const message = `link-safe:${linkSafeAddress}`
      const signature = await signMessageAsync({ message })

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

  const handleRejectClick = (releaseId: string) => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first')
      return
    }
    setRejectReleaseId(releaseId)
    setRejectReason('')
    setShowRejectModal(true)
  }

  const handleReject = async () => {
    if (!rejectReleaseId || !isConnected || !address) {
      return
    }

    setRejecting(rejectReleaseId)
    setShowRejectModal(false)

    try {
      const signature = await signMessageAsync({ message: rejectReleaseId })

      const response = await fetch('/api/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ releaseId: rejectReleaseId, signature, reason: rejectReason || undefined }),
      })

      const result = await response.json()

      if (result.success) {
        setRejectedReleaseId(rejectReleaseId)
        setShowRejectSuccessModal(true)
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
      setRejectReleaseId(null)
      setRejectReason('')
    }
  }

  return (
    <div className={cn("text-white", className)}>
      {/* Safe Status Section */}
      {isConnected && address && (
        <div className="border border-white/30 rounded-lg p-4 mb-6 bg-black/20 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm uppercase text-white/60 font-bold mb-2">Safe Status</h2>
              {safeLoading ? (
                <div className="text-sm text-white/60">Checking Safe...</div>
              ) : safeAddress ? (
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    <span className="text-green-400">●</span> Linked Safe:{' '}
                    {safeEnsName ? (
                      <span className="font-semibold text-white">{safeEnsName} <span className="font-mono text-xs text-white/60">({safeAddress})</span></span>
                    ) : (
                      <span className="font-mono ml-2">{safeAddress}</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-yellow-400">
                  ⚠️ No Safe linked. You need to link a Safe to approve releases.
                </div>
              )}
            </div>
            {!safeAddress && (
              <button
                onClick={() => setShowLinkModal(true)}
                className="px-4 py-2 border border-white/30 text-white font-bold uppercase text-xs hover:bg-white hover:text-black transition-colors rounded-lg"
              >
                Link Safe
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl font-bold uppercase">Pending Approvals</h2>
          <p className="text-xs text-white/60 mt-1">Submissions are being sent to the ARES curation team</p>
        </div>
        <div className="text-sm text-white/60">QUEUE: {releases.length}</div>
      </div>

      {loading ? (
        <div className="border border-white/30 rounded-lg p-12 text-center text-white/60 uppercase bg-black/20 backdrop-blur-sm">
          Loading pending releases...
        </div>
      ) : (
        <div className="border border-white/30 rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm">
          <div className="grid grid-cols-12 border-b border-white/20 bg-white/10 text-white text-xs uppercase font-bold p-3">
            <div className="col-span-2">ID</div>
            <div className="col-span-3">Artist</div>
            <div className="col-span-4">Title</div>
            <div className="col-span-3 text-right">Action</div>
          </div>

          {releases.map((release) => (
            <div key={release.id}>
              {/* Main Row */}
              <div
                className="grid grid-cols-12 border-b border-white/10 p-4 items-center hover:bg-white/5 cursor-pointer transition-colors"
                onClick={() => toggleExpand(release.id)}
              >
                <div className="col-span-2 font-mono text-white/60 text-xs">{release.id.substring(0, 20)}...</div>
                <div className="col-span-3 font-bold">{release.artist}</div>
                <div className="col-span-4 text-white/80">{release.title}</div>
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
                    className="px-3 py-1 border border-white/30 hover:border-green-400 hover:text-green-400 text-xs uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded"
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
                        
                        // Open publishing modal
                        setPublishingRelease({ 
                          id: release.id, 
                          title: release.title, 
                          artist: release.artist 
                        })
                        setPublishingStep("preparing")
                        setPublishingError(undefined)
                        setShowPublishingModal(true)
                        setSendingContracts(release.id)
                        
                        try {
                          // Step 1: Pinning to IPFS
                          setPublishingStep("pinning_ipfs")
                          console.log('Fetching contract transaction data...')
                          const prepareResponse = await fetch(`/api/releases/${release.id}/prepare-contracts`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                          })
                          const prepareResult = await prepareResponse.json()
                          
                          if (!prepareResult.success) {
                            throw new Error(prepareResult.error || 'Failed to prepare contracts')
                          }
                          
                          const contractTxData = prepareResult.data.contractTxData
                          if (!contractTxData) {
                            throw new Error('No contract transaction data returned')
                          }
                          
                          // Step 2: Creating Split
                          setPublishingStep("creating_split")
                          await new Promise(resolve => setTimeout(resolve, 500)) // Brief pause for UX
                          
                          // Step 3: Deploying Coin
                          setPublishingStep("deploying_coin")
                          
                          // Now send the transactions
                          await sendContractTransactions(release.id, contractTxData)
                          
                          // Step 4: Registering ENS
                          setPublishingStep("registering_ens")
                          await new Promise(resolve => setTimeout(resolve, 500))
                          
                          // Step 5: Finalizing
                          setPublishingStep("finalizing")
                          await new Promise(resolve => setTimeout(resolve, 500))
                          
                          setThresholdMetReleases(prev => {
                            const next = new Map(prev)
                            next.delete(release.id)
                            return next
                          })
                          
                          // Step 6: Complete!
                          setPublishingStep("complete")
                          
                          const refreshResponse = await fetch('/api/releases/pending')
                          const refreshData = await refreshResponse.json()
                          if (refreshData.success) {
                            setReleases(refreshData.releases)
                          }
                        } catch (error) {
                          console.error('Failed to send contract transactions:', error)
                          setPublishingError(error instanceof Error ? error.message : 'Unknown error')
                          setPublishingStep("error")
                        } finally {
                          setSendingContracts(null)
                        }
                      }}
                      disabled={sendingContracts === release.id || currentChainId !== 84532}
                      className="px-3 py-1 border border-yellow-500 hover:border-yellow-400 hover:text-yellow-400 text-xs uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded"
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
                      handleRejectClick(release.id)
                    }}
                    disabled={!isConnected || !safeAddress || rejecting === release.id}
                    className="px-3 py-1 border border-white/30 hover:border-red-400 hover:text-red-400 text-xs uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded"
                    title={!safeAddress ? 'Link a Safe first' : ''}
                  >
                    {rejecting === release.id ? 'Signing...' : 'Reject'}
                  </button>
                </div>
              </div>

              {/* Expanded Preview Row */}
              {expandedRow === release.id && (
                <div className="border-b border-white/10 bg-black/30 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-sm uppercase text-white/60 font-bold mb-2">Details</h3>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-white/60">Artist:</span> {release.artist}</div>
                        <div><span className="text-white/60">Title:</span> {release.title}</div>
                        <div><span className="text-white/60">Description:</span> {release.description}</div>
                        <div><span className="text-white/60">Submitted By:</span> 
                          {release.createdBy && (() => {
                            const creatorAddr = release.createdBy.toLowerCase()
                            const creatorName = creatorEnsNames.get(creatorAddr)
                            // Truncate address to first 4 and last 4 characters
                            const truncatedAddr = release.createdBy.length > 10 
                              ? `${release.createdBy.slice(0, 4)}...${release.createdBy.slice(-4)}`
                              : release.createdBy
                            return creatorName ? (
                              <div className="mt-1">
                                <div className="font-semibold text-white">{creatorName}</div>
                                <span className="font-mono text-xs text-white/60">{truncatedAddr}</span>
                              </div>
                            ) : (
                              <span className="font-mono text-xs ml-1">{truncatedAddr}</span>
                            )
                          })()}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm uppercase text-white/60 font-bold mb-2">Cover Art</h3>
                      {coverUrl ? (
                        <img 
                          src={coverUrl} 
                          alt={release.title}
                          className="w-full aspect-square object-cover border border-white/30 rounded"
                        />
                      ) : (
                        <div className="w-full aspect-square border border-white/20 rounded flex items-center justify-center text-white/60 text-sm">
                          Loading cover...
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm uppercase text-white/60 font-bold mb-2">Audio Preview</h3>
                      {audioUrl ? (
                        <AudioPlayer audioUrl={audioUrl} />
                      ) : (
                        <div className="text-white/60 text-sm">Loading audio...</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {releases.length === 0 && (
            <div className="p-12 text-center text-white/60 uppercase">No pending releases</div>
          )}
        </div>
      )}

      {/* Link Safe Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-black/90 border border-white/30 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold uppercase mb-4">Link Safe</h2>
            
            <div className="mb-4">
              <label className="block text-sm uppercase text-white/60 mb-2">
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
                className="w-full px-3 py-2 bg-black/50 border border-white/30 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-white/50"
              />
              <div className="text-xs text-white/60 mt-1">
                Enter the Safe contract address you want to link to your wallet
              </div>
            </div>

            {linkError && (
              <div className="mb-4 p-3 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {linkError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleLinkSafe}
                disabled={linking || !linkSafeAddress}
                className="flex-1 px-4 py-2 border border-white/30 text-white font-bold uppercase text-xs hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
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
                className="px-4 py-2 border border-white/20 text-white/60 font-bold uppercase text-xs hover:border-white/30 hover:text-white transition-colors disabled:opacity-50 rounded-lg"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 text-xs text-white/60">
              <p>You'll be asked to sign a message to verify wallet ownership.</p>
              <p className="mt-1">The system will verify that your wallet is an owner of this Safe.</p>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {mounted && showRejectModal && createPortal(
        <div 
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9999
          }}
          onClick={() => {
            setShowRejectModal(false)
            setRejectReleaseId(null)
            setRejectReason('')
          }}
        >
          <div
            className="border border-white/40 rounded-2xl flex-shrink-0"
            style={{ 
              width: 'min(600px, 90vw)',
              aspectRatio: '16/9'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <LiquidGlass
              borderRadius={16}
              blur={0.8}
              contrast={1.3}
              brightness={0.92}
              saturation={1.15}
              displacementScale={0.5}
              elasticity={0.7}
              shadowIntensity={0.35}
              className="w-full h-full"
            >
            <div className="bg-black/20 backdrop-blur-sm rounded-[inherit] p-6 md:p-8 flex flex-col overflow-hidden" style={{ width: '100%', height: '100%' }}>
              {/* Fixed Header */}
              <div className="flex items-center justify-between flex-shrink-0 mb-4">
                <h3 className="text-xl font-bold text-white uppercase">
                  Reject Release
                </h3>
                <button
                  onClick={() => {
                    setShowRejectModal(false)
                    setRejectReleaseId(null)
                    setRejectReason('')
                  }}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>
              
              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
                <p className="text-sm text-white/80">
                  Please provide a reason for rejecting this release (optional):
                </p>
                
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter rejection reason..."
                  rows={4}
                  className="w-full border border-white/30 p-3 focus:outline-none focus:border-white/50 rounded-lg bg-black/20 backdrop-blur-sm text-white placeholder:text-white/50 resize-none"
                  autoFocus
                />
              </div>
              
              {/* Fixed Footer Buttons */}
              <div className="flex gap-3 pt-4 flex-shrink-0">
                  <button
                    onClick={() => {
                      setShowRejectModal(false)
                      setRejectReleaseId(null)
                      setRejectReason('')
                    }}
                    className="flex-1 px-4 py-2 border border-white/30 text-white hover:bg-white/10 transition-colors rounded-lg font-bold uppercase text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={rejecting === rejectReleaseId}
                    className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/50 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg font-bold uppercase text-xs text-red-400"
                  >
                    {rejecting === rejectReleaseId ? 'Rejecting...' : 'Reject Release'}
                  </button>
                </div>
            </div>
            </LiquidGlass>
          </div>
        </div>,
        document.body
      )}

      {/* Rejection Success Modal */}
      {mounted && showRejectSuccessModal && createPortal(
        <div 
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9999
          }}
          onClick={() => {
            setShowRejectSuccessModal(false)
            setRejectedReleaseId(null)
          }}
        >
          <div
            className="border border-white/40 rounded-2xl flex-shrink-0"
            style={{ 
              width: 'min(600px, 90vw)',
              aspectRatio: '16/9'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <LiquidGlass
              borderRadius={16}
              blur={0.8}
              contrast={1.3}
              brightness={0.92}
              saturation={1.15}
              displacementScale={0.5}
              elasticity={0.7}
              shadowIntensity={0.35}
              className="w-full h-full"
            >
              <div className="bg-black/20 backdrop-blur-sm rounded-[inherit] p-6 md:p-8 flex flex-col overflow-hidden" style={{ width: '100%', height: '100%' }}>
                {/* Fixed Header */}
                <div className="flex flex-col items-center flex-shrink-0 mb-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50 mb-3">
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white uppercase text-center">
                    Release Rejected
                  </h3>
                </div>
                
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto space-y-3 min-h-0 text-sm text-white/80">
                  <p className="text-center">
                    The release has been rejected and all approvals and files have been cleared.
                  </p>
                  {rejectedReleaseId && (
                    <p className="font-mono text-xs text-white/60 text-center">
                      ID: {rejectedReleaseId}
                    </p>
                  )}
                </div>
                
                {/* Fixed Footer Buttons */}
                <div className="pt-4 flex-shrink-0">
                  <button
                    onClick={() => {
                      setShowRejectSuccessModal(false)
                      setRejectedReleaseId(null)
                    }}
                    className="w-full py-3 bg-white/10 border border-white/30 hover:bg-white/20 transition-colors rounded-lg font-bold uppercase text-xs backdrop-blur-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </LiquidGlass>
          </div>
        </div>,
        document.body
      )}

      {/* Threshold Met Modal */}
      {mounted && showThresholdMetModal && createPortal(
        <div 
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9999
          }}
          onClick={() => {
            setShowThresholdMetModal(false)
            setThresholdMetReleaseId(null)
          }}
        >
          <div
            className="border border-white/40 rounded-2xl flex-shrink-0"
            style={{ 
              width: 'min(600px, 90vw)',
              aspectRatio: '16/9'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <LiquidGlass
              borderRadius={16}
              blur={0.8}
              contrast={1.3}
              brightness={0.92}
              saturation={1.15}
              displacementScale={0.5}
              elasticity={0.7}
              shadowIntensity={0.35}
              className="w-full h-full"
            >
              <div className="bg-black/20 backdrop-blur-sm rounded-[inherit] p-6 md:p-8 flex flex-col overflow-hidden" style={{ width: '100%', height: '100%' }}>
                {/* Fixed Header */}
                <div className="flex flex-col items-center flex-shrink-0 mb-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50 mb-3">
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white uppercase text-center">
                    Threshold Met
                  </h3>
                </div>
                
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto space-y-3 min-h-0 text-sm text-white/80">
                  <p className="text-center">
                    The approval threshold has been met for this release.
                  </p>
                  <p className="text-center">
                    Click "Create Contracts" to proceed with contract creation and publishing.
                  </p>
                  {thresholdMetReleaseId && (
                    <p className="font-mono text-xs text-white/60 text-center">
                      Release ID: {thresholdMetReleaseId}
                    </p>
                  )}
                </div>
                
                {/* Fixed Footer Buttons */}
                <div className="pt-4 flex-shrink-0">
                  <button
                    onClick={() => {
                      setShowThresholdMetModal(false)
                      setThresholdMetReleaseId(null)
                    }}
                    className="w-full py-3 bg-white/10 border border-white/30 hover:bg-white/20 transition-colors rounded-lg font-bold uppercase text-xs backdrop-blur-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </LiquidGlass>
          </div>
        </div>,
        document.body
      )}

      {/* Publishing Modal with Pong Game */}
      <PublishingModal
        isOpen={showPublishingModal}
        currentStep={publishingStep}
        releaseTitle={publishingRelease?.title || ""}
        artistName={publishingRelease?.artist || ""}
        releaseId={publishingRelease?.id || ""}
        error={publishingError}
        onComplete={() => {
          setShowPublishingModal(false)
          setPublishingRelease(null)
          setPublishingStep("preparing")
          setPublishingError(undefined)
        }}
      />
    </div>
  )
}


