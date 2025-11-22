"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useSignMessage } from "wagmi"
import { AudioPlayer } from "@/components/audio-player"

export default function CuratorDashboardPage() {
  const [releases, setReleases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [approving, setApproving] = useState<string | null>(null)
  const [rejecting, setRejecting] = useState<string | null>(null)
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()

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
        alert(result.data.message)
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
                        {account.displayName}
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
                        handleApprove(release.id)
                      }}
                      disabled={!isConnected || approving === release.id}
                      className="px-3 py-1 border border-gray-600 hover:border-green-500 hover:text-green-500 text-xs uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {approving === release.id ? 'Signing...' : 'Approve'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleReject(release.id)
                      }}
                      disabled={!isConnected || rejecting === release.id}
                      className="px-3 py-1 border border-gray-600 hover:border-red-500 hover:text-red-500 text-xs uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                          <div><span className="text-gray-500">Submitted By:</span> <span className="font-mono text-xs">{release.createdBy}</span></div>
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
    </div>
  )
}

