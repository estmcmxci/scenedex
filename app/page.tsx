"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { List, Shield, Copy, Check, Send, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import { LiquidGlass } from "@liquidglass/react"
import { ReleasesContent } from "@/app/components/releases-content"
import { DashboardContent } from "@/app/components/dashboard-content"
import { LookupContent } from "@/app/components/lookup-content"

type TabType = 'submit' | 'releases' | 'lookup' | 'dashboard'

export default function SubmitPage() {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('submit')
  const { address, isConnected } = useAccount()
  const [formData, setFormData] = useState({
    artist: "",
    title: "",
    description: "",
  })
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [safeAddress, setSafeAddress] = useState<string | null>(null)
  const [safeAddressLoading, setSafeAddressLoading] = useState(true)
  const [safeEnsName, setSafeEnsName] = useState<string | null>(null)
  const [walletEnsName, setWalletEnsName] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [showCuratorTooltip, setShowCuratorTooltip] = useState(false)
  const [curatorTooltipPosition, setCuratorTooltipPosition] = useState({ top: 0, left: 0 })
  const [showSafeAddressTooltip, setShowSafeAddressTooltip] = useState(false)
  const [safeAddressTooltipPosition, setSafeAddressTooltipPosition] = useState({ top: 0, left: 0 })
  const [mounted, setMounted] = useState(false)

  // Typeform step management
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [submittedReleaseId, setSubmittedReleaseId] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch Safe address on mount
  useEffect(() => {
    async function fetchSafeAddress() {
      try {
        const response = await fetch("/api/curator/safe-address")
        const data = await response.json()
        if (data.success && data.data.safeAddress) {
          setSafeAddress(data.data.safeAddress)
        }
      } catch (error) {
        console.error("Failed to fetch Safe address:", error)
      } finally {
        setSafeAddressLoading(false)
      }
    }
    fetchSafeAddress()
  }, [])

  // Resolve Safe address to ENS name
  useEffect(() => {
    async function resolveSafeENS() {
      if (!safeAddress) return

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  // Step navigation functions
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetForm = () => {
    setFormData({ artist: "", title: "", description: "" })
    setAudioFile(null)
    setCurrentStep(1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected || !address) {
      alert("Please connect your wallet first")
      return
    }

    if (!audioFile) {
      alert("Please upload an audio file")
      return
    }

    setLoading(true)

    try {
      // Create FormData for file upload
      const data = new FormData()
      data.append("title", formData.title)
      data.append("description", formData.description)
      data.append("artists", formData.artist)
      data.append("mediaFile", audioFile)
      data.append("createdBy", address) // Add wallet address

      const response = await fetch("/api/submit", {
        method: "POST",
        body: data,
      })

      const result = await response.json()

      if (result.success) {
        setSubmittedReleaseId(result.data.id)
        setShowSuccessModal(true)
        // Reset form
        resetForm()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error("Submit error:", error)
      alert("Failed to submit release. Check console for details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen text-white">
      <header className="sticky top-0 z-10 pt-4 pb-4">
        <div className="max-w-5xl mx-auto px-8 md:px-12">
          <LiquidGlass
            borderRadius={16}
            blur={0.8}
            contrast={1.3}
            brightness={0.92}
            saturation={1.15}
            displacementScale={0.5}
            elasticity={0.7}
            shadowIntensity={0.35}
            className="border border-white/30 overflow-visible"
          >
            {/* Layered dark background for content contrast */}
            <div className="w-full bg-black/20 backdrop-blur-sm rounded-[inherit] p-4 overflow-visible">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 relative">
                  <Image
                    src="/grid.png"
                    alt="scenedex logo"
                    width={32}
                    height={32}
                    className="rounded"
                  />
                  <span 
                    className="font-bold text-xl tracking-tighter cursor-help"
                    style={{
                      color: 'rgba(255, 255, 255, 1)',
                    }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      setTooltipPosition({
                        top: rect.bottom + window.scrollY + 8,
                        left: rect.left + window.scrollX,
                      })
                      setShowTooltip(true)
                    }}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    scenedex
                  </span>
                </div>
                <nav className="flex gap-3 items-center ml-auto">
          <button
            onClick={() => setActiveTab('submit')}
                    className="px-4 py-2 border font-bold uppercase text-xs transition-colors flex items-center gap-2 rounded-lg backdrop-blur-sm"
                    style={{
                      backgroundColor: activeTab === 'submit' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      borderColor: activeTab === 'submit' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== 'submit') e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== 'submit') e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                    }}
          >
            <Send className="w-4 h-4" />
            Submit
          </button>
          <button
            onClick={() => setActiveTab('releases')}
                    className="px-4 py-2 border font-bold uppercase text-xs transition-colors flex items-center gap-2 rounded-lg backdrop-blur-sm"
                    style={{
                      backgroundColor: activeTab === 'releases' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      borderColor: activeTab === 'releases' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== 'releases') e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== 'releases') e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                    }}
          >
            <List className="w-4 h-4" />
            Releases
          </button>
          <button
            onClick={() => setActiveTab('lookup')}
                    className="px-4 py-2 border font-bold uppercase text-xs transition-colors flex items-center gap-2 rounded-lg backdrop-blur-sm"
                    style={{
                      backgroundColor: activeTab === 'lookup' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      borderColor: activeTab === 'lookup' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== 'lookup') e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== 'lookup') e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                    }}
          >
            <Search className="w-4 h-4" />
            Lookup
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
                    className="px-4 py-2 border font-bold uppercase text-xs transition-colors flex items-center gap-2 rounded-lg backdrop-blur-sm"
                    style={{
                      backgroundColor: activeTab === 'dashboard' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      borderColor: activeTab === 'dashboard' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== 'dashboard') e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== 'dashboard') e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                    }}
          >
            <Shield className="w-4 h-4" />
            Dashboard
          </button>
          {/* Connect Wallet Button */}
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
                                  className="px-4 py-2 border border-white/30 font-bold uppercase text-xs transition-colors rounded-lg backdrop-blur-sm"
                                  style={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                                  }}
                        >
                          Connect
                        </button>
                      )
                    }

                    return (
                      <button
                        onClick={openAccountModal}
                        type="button"
                                className="px-4 py-2 border border-white/30 font-bold uppercase text-xs transition-colors rounded-lg backdrop-blur-sm"
                                style={{
                                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                  color: 'rgba(255, 255, 255, 0.9)',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                                }}
                      >
                        {walletEnsName || account.displayName}
                      </button>
                    )
                  })()}
                </div>
              )
            }}
          </ConnectButton.Custom>
        </nav>
              </div>
            </div>
          </LiquidGlass>
        </div>
      </header>

      {/* Tooltip - rendered via portal to document.body to avoid z-index issues */}
      {mounted && showTooltip && createPortal(
        <div 
          className="fixed p-3 rounded-lg shadow-lg max-w-xs pointer-events-none"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'rgba(255, 255, 255, 0.95)',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
        >
          scenedex is a permanent archive for audio artifacts. Published atomically on Base using Basenames, IPFS, Zora, 0xSplits, and Safe multisig. Resistant to censorship. Owned by creators.
        </div>,
        document.body
      )}

      {/* Curator Board Tooltip */}
      {mounted && showCuratorTooltip && createPortal(
        <div 
          className="fixed p-3 rounded-lg shadow-lg max-w-xs pointer-events-none"
          style={{
            top: `${curatorTooltipPosition.top}px`,
            left: `${curatorTooltipPosition.left}px`,
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'rgba(255, 255, 255, 0.95)',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
        >
          Anyone with a connected wallet can submit releases to this curator board.
        </div>,
        document.body
      )}

      {/* Safe Address Tooltip */}
      {mounted && showSafeAddressTooltip && createPortal(
        <div 
          className="fixed p-3 rounded-lg shadow-lg max-w-xs pointer-events-none"
          style={{
            top: `${safeAddressTooltipPosition.top}px`,
            left: `${safeAddressTooltipPosition.left}px`,
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'rgba(255, 255, 255, 0.95)',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
        >
          Only wallets that are owners of the Safe address above can approve or reject submissions.
        </div>,
        document.body
      )}

      {/* Tab Content */}
      {activeTab === 'submit' && (
        <>
      <main className="max-w-5xl mx-auto px-8 md:px-12 pt-4 pb-4">
        <LiquidGlass
          borderRadius={16}
          blur={0.8}
          contrast={1.3}
          brightness={0.92}
          saturation={1.15}
          displacementScale={0.5}
          elasticity={0.7}
          shadowIntensity={0.35}
          className="border border-white/40"
        >
          {/* Layered dark background for content contrast */}
          <div className="w-full bg-black/20 backdrop-blur-sm rounded-[inherit] p-6 md:p-8 overflow-hidden">
            {/* Header section with title and Safe Address */}
            <div className="mb-6 pb-4 border-b border-white/20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 
                    className="text-xl font-bold uppercase mb-2"
                    style={{
                      color: 'rgba(255, 255, 255, 1)',
                    }}
                  >
                    Submit Release
                  </h2>
                </div>
                <Send className="w-6 h-6 text-white flex-shrink-0 mt-1" style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))' }} />
              </div>
              
              {/* Compact Safe Address display */}
              {safeAddress && (
                <div className="mt-4 flex items-center gap-3">
                  <label 
                    className="text-xs uppercase font-bold cursor-help flex-shrink-0"
                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      setSafeAddressTooltipPosition({
                        top: rect.bottom + window.scrollY + 8,
                        left: rect.left + window.scrollX,
                      })
                      setShowSafeAddressTooltip(true)
                    }}
                    onMouseLeave={() => setShowSafeAddressTooltip(false)}
                  >
                    Curator:
                  </label>
                  <div 
                    className="flex items-center gap-2 border border-white/20 px-3 py-2 rounded-lg flex-1"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <code 
                      className="text-xs font-mono truncate flex-1"
                      style={{ color: 'rgba(255, 255, 255, 0.85)' }}
                    >
                      {safeEnsName || safeAddress}
                    </code>
                    <button
                      onClick={() => copyToClipboard(safeAddress)}
                      className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
                      title="Copy address"
                    >
                      {copied ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-white/60" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step Content */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* Heading, and Input Row - All Parallel */}
                <div className="flex items-center gap-3">
                  {/* Heading and Description */}
                  <div className="flex-shrink-0 min-w-[200px]">
                    <h3 className="text-2xl font-bold text-white">Who's the artist?</h3>
                    <p className="text-white/60 text-sm">Tell us about the creator behind this release</p>
                  </div>
                  
                  {/* Input Row */}
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="text"
                      value={formData.artist}
                      onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && formData.artist.trim()) {
                          e.preventDefault()
                          nextStep()
                        } else if (e.key === 'Delete' && !formData.artist.trim()) {
                          e.preventDefault()
                          prevStep()
                        }
                      }}
                      className="flex-1 border border-white/30 p-3 focus:outline-none focus:border-white/50 rounded-lg bg-black/20 backdrop-blur-sm text-white placeholder:text-white/50"
                      placeholder="Artist Name"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    disabled
                    className="p-3 border border-white/20 text-white/40 rounded-lg opacity-50 cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.artist.trim()}
                    className="p-3 bg-white/10 border border-white/30 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg backdrop-blur-sm"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Heading, and Input Row - All Parallel */}
                <div className="flex items-center gap-3">
                  {/* Heading and Description */}
                  <div className="flex-shrink-0 min-w-[200px]">
                    <h3 className="text-2xl font-bold text-white">What's the release called?</h3>
                    <p className="text-white/60 text-sm">Give your release a memorable title</p>
                  </div>
                  
                  {/* Input Row */}
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && formData.title.trim()) {
                          e.preventDefault()
                          nextStep()
                        } else if (e.key === 'Delete' && !formData.title.trim()) {
                          e.preventDefault()
                          prevStep()
                        }
                      }}
                      className="flex-1 border border-white/30 p-3 focus:outline-none focus:border-white/50 rounded-lg bg-black/20 backdrop-blur-sm text-white placeholder:text-white/50"
                      placeholder="Release Title"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="p-3 border border-white/30 text-white hover:bg-white/10 transition-colors rounded-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.title.trim()}
                    className="p-3 bg-white/10 border border-white/30 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg backdrop-blur-sm"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Heading, and Input Row - All Parallel */}
                <div className="flex items-start gap-3">
                  {/* Heading and Description */}
                  <div className="flex-shrink-0 min-w-[200px]">
                    <h3 className="text-2xl font-bold text-white">Tell us about this release</h3>
                    <p className="text-white/60 text-sm">Describe what makes this release special</p>
                  </div>
                  
                  {/* Input Row */}
                  <div className="flex items-start gap-3 flex-1">
                    <textarea
                      rows={6}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey && formData.description.trim()) {
                          e.preventDefault()
                          nextStep()
                        } else if (e.key === 'Delete' && !formData.description.trim()) {
                          e.preventDefault()
                          prevStep()
                        }
                      }}
                      className="flex-1 border border-white/30 p-3 focus:outline-none focus:border-white/50 rounded-lg bg-black/20 backdrop-blur-sm text-white placeholder:text-white/50 resize-none"
                      placeholder="What's the story behind this release? What inspired it? What makes it unique? (Ctrl+Enter to continue)"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="p-3 border border-white/30 text-white hover:bg-white/10 transition-colors rounded-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.description.trim()}
                    className="p-3 bg-white/10 border border-white/30 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg backdrop-blur-sm"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Heading, and Input Row - All Parallel */}
                <div className="flex items-start gap-3">
                  {/* Heading and Description */}
                  <div className="flex-shrink-0 min-w-[200px]">
                    <h3 className="text-2xl font-bold text-white">Upload your audio file</h3>
                    <p className="text-white/60 text-sm">Drop your track here - we'll extract cover art from the ID3 tags</p>
                  </div>
                  
                  {/* Input Row */}
                  <div className="flex items-start gap-3 flex-1">
                    <label className="flex-1 border border-dashed border-white/30 p-6 hover:border-white/50 transition-colors cursor-pointer block rounded-lg bg-black/20 backdrop-blur-sm">
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <div className="text-center">
                        <div className="text-3xl mb-3 text-white/60">↓</div>
                        <div className="text-base font-bold text-white mb-1">
                          {audioFile ? audioFile.name : "Drop Audio File"}
                        </div>
                        {audioFile && (
                          <div className="text-sm text-white/60">
                            {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="p-3 border border-white/30 text-white hover:bg-white/10 transition-colors rounded-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!audioFile}
                    className="p-3 bg-white/10 border border-white/30 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg backdrop-blur-sm"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Heading */}
                <div className="flex items-center gap-3">
                  {/* Heading and Description */}
                  <div className="flex-shrink-0 min-w-[200px]">
                    <h3 className="text-2xl font-bold text-white">Ready to submit?</h3>
                    <p className="text-white/60 text-sm">Review your release details and submit to the ARES curation team</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-black/20 rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-white/60">Artist:</span>
                      <span className="text-white font-bold">{formData.artist}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-white/60">Title:</span>
                      <span className="text-white font-bold">{formData.title}</span>
                    </div>
                    <div className="py-2">
                      <span className="text-white/60 block mb-2">Description:</span>
                      <p className="text-white text-sm">{formData.description}</p>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-white/60">Audio File:</span>
                      <span className="text-white font-mono text-sm">
                        {`${audioFile?.name} (${((audioFile?.size || 0) / 1024 / 1024).toFixed(2)} MB)`}
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <button
                      type="submit"
                      disabled={!isConnected || loading}
                      className="w-full py-4 font-bold uppercase transition-colors disabled:cursor-not-allowed rounded-xl border border-white/20 disabled:opacity-50 disabled:hover:bg-black/40"
                      style={{
                        backgroundColor: (!isConnected || loading) ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(8px) contrast(1.2) brightness(0.85) saturate(1.1)',
                        color: 'rgba(255, 255, 255, 0.9)',
                      }}
                    >
                      {loading ? "Processing..." : "Submit Release"}
                    </button>
                  </form>

                  {!isConnected && (
                    <p className="text-xs text-center text-white/60">
                      Connect your wallet to submit a release
                    </p>
                  )}
                </div>

                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="p-3 border border-white/30 text-white hover:bg-white/10 transition-colors rounded-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </LiquidGlass>
      </main>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-8 md:px-12 pt-4 pb-4">
        <LiquidGlass
          borderRadius={16}
          blur={0.8}
          contrast={1.3}
          brightness={0.92}
          saturation={1.15}
          displacementScale={0.5}
          elasticity={0.7}
          shadowIntensity={0.35}
          className="border border-white/40"
        >
          {/* Layered dark background for content contrast */}
          <div className="bg-black/20 backdrop-blur-sm rounded-[inherit] p-6 md:p-8">
            <div className="mb-6 pb-4 border-b border-white/20">
              <h3 
                className="text-xl font-bold uppercase mb-2"
                style={{
                  color: 'rgba(255, 255, 255, 1)',
                }}
              >
                How It Works
              </h3>
            </div>
            <div className="space-y-6 text-sm md:text-base leading-relaxed">
            <div className="flex gap-4">
                <div 
                  className="font-bold text-lg flex-shrink-0"
                  style={{
                    color: 'rgba(255, 255, 255, 1)',
                    }}
                  >
                  1.
                </div>
                <div 
                  className="text-justify"
                    style={{
                      color: 'rgba(255, 255, 255, 0.85)',
                    }}
                >
                  <span 
                    className="font-bold"
                    style={{
                      color: 'rgba(255, 255, 255, 1)',
                    }}
                  >
                    Submit
                  </span> — Upload your audio file. Files are
                stored temporarily in our database pending curator review. Metadata and cover art are extracted from ID3 tags
                automatically. Nothing goes onchain or to IPFS until approved.
              </div>
            </div>
            <div className="flex gap-4">
                <div 
                  className="font-bold text-lg flex-shrink-0"
                  style={{
                    color: 'rgba(255, 255, 255, 1)',
                    }}
                  >
                  2.
                </div>
                <div 
                  className="text-justify"
                    style={{
                      color: 'rgba(255, 255, 255, 0.85)',
                    }}
                >
                  <span 
                    className="font-bold"
                    style={{
                      color: 'rgba(255, 255, 255, 1)',
                    }}
                  >
                    Curator Review & IPFS Pinning
                  </span> — Curators collectively review and approve releases
                using a Safe multisig on Base. Upon approval, files are permanently pinned to IPFS via Storacha. Once the signature
                threshold is met, a backend coordinator automatically executes the publishing flow.
              </div>
            </div>
            <div className="flex gap-4">
                <div 
                  className="font-bold text-lg flex-shrink-0"
                  style={{
                    color: 'rgba(255, 255, 255, 1)',
                    }}
                  >
                  3.
                </div>
                <div 
                  className="text-justify"
                    style={{
                      color: 'rgba(255, 255, 255, 0.85)',
                    }}
                >
                  <span 
                    className="font-bold"
                    style={{
                      color: 'rgba(255, 255, 255, 1)',
                    }}
                  >
                    Atomic Onchain Publishing
                  </span> — A single Safe transaction executes
                all operations atomically: creates a{" "}
                <a
                  href="https://docs.splits.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                    className="underline"
                    style={{
                      color: 'rgba(255, 255, 255, 1)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  0xSplits
                </a>{" "}
                revenue contract (50% creator, 50% curators), mints a{" "}
                <a
                  href="https://docs.zora.co/coins"
                  target="_blank"
                  rel="noopener noreferrer"
                    className="underline"
                    style={{
                      color: 'rgba(255, 255, 255, 1)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Zora Creator Coin
                </a>{" "}
                (1B supply, 50% creator vesting), and registers a{" "}
                <a
                  href="https://www.base.org/names"
                  target="_blank"
                  rel="noopener noreferrer"
                    className="underline"
                    style={{
                      color: 'rgba(255, 255, 255, 1)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Basename
                </a>{" "}
                with all metadata stored onchain.
              </div>
            </div>
            <div className="flex gap-4">
                <div 
                  className="font-bold text-lg flex-shrink-0"
                  style={{
                    color: 'rgba(255, 255, 255, 1)',
                    }}
                  >
                  4.
                </div>
                <div 
                  className="text-justify"
                    style={{
                      color: 'rgba(255, 255, 255, 0.85)',
                    }}
                >
                  <span 
                    className="font-bold"
                    style={{
                      color: 'rgba(255, 255, 255, 1)',
                    }}
                  >
                    Permanent Registry
                  </span> — Each release receives a Basename
                (e.g., ares001.scenius.base.eth) storing all metadata onchain: IPFS CIDs, contract addresses, split
                address, and cryptographic proof of creator and publisher. All data is queryable, verifiable, and permanent.
              </div>
            </div>
              <p 
                className="text-xs italic pt-2 text-center"
                    style={{
                      color: 'rgba(255, 255, 255, 0.75)',
                    }}
              >
              Result: Immutable releases with transparent revenue sharing and permanent onchain metadata—all on Base.
            </p>
          </div>
        </div>
        </LiquidGlass>
      </section>

      {/* Tech Stack */}
      <section className="max-w-5xl mx-auto px-8 md:px-12 pt-4 pb-4">
        <LiquidGlass
          borderRadius={16}
          blur={0.8}
          contrast={1.3}
          brightness={0.92}
          saturation={1.15}
          displacementScale={0.5}
          elasticity={0.7}
          shadowIntensity={0.35}
          className="border border-white/40"
        >
          {/* Layered dark background for content contrast */}
          <div className="w-full bg-black/20 backdrop-blur-sm rounded-[inherit] p-6 md:p-8 overflow-hidden">
            <div className="mb-6 pb-4 border-b border-white/20">
              <h3 
                className="text-xl font-bold uppercase mb-2"
                style={{
                  color: 'rgba(255, 255, 255, 1)',
                }}
              >
                Tech Stack
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
                <h4 
                  className="font-bold uppercase text-xs mb-3"
                  style={{
                    color: 'rgba(255, 255, 255, 1)',
                    }}
                  >
                  Blockchain
                </h4>
                <ul 
                  className="space-y-2"
                    style={{
                      color: 'rgba(255, 255, 255, 0.85)',
                    }}
                >
                <li>→ Base (L2)</li>
                <li>→ Atomic Safe Transactions</li>
                <li>→ viem</li>
              </ul>
            </div>
            <div>
                <h4 
                  className="font-bold uppercase text-xs mb-3"
                  style={{
                    color: 'rgba(255, 255, 255, 1)',
                    }}
                  >
                  Storage
                </h4>
                <ul 
                  className="space-y-2"
                    style={{
                      color: 'rgba(255, 255, 255, 0.85)',
                    }}
                >
                <li>→ IPFS / Storacha</li>
                <li>→ PostgreSQL</li>
                <li>→ Basename Text Records</li>
              </ul>
            </div>
            <div>
                <h4 
                  className="font-bold uppercase text-xs mb-3"
                  style={{
                    color: 'rgba(255, 255, 255, 1)',
                    }}
                  >
                  Protocols
                </h4>
                <ul 
                  className="space-y-2"
                    style={{
                      color: 'rgba(255, 255, 255, 0.85)',
                    }}
                >
                <li>→ Safe Multisig</li>
                <li>→ Zora Creator Coins</li>
                <li>→ 0xSplits Revenue</li>
                <li>→ Basenames (ENS on Base)</li>
              </ul>
            </div>
            <div>
                <h4 
                  className="font-bold uppercase text-xs mb-3"
                  style={{
                    color: 'rgba(255, 255, 255, 1)',
                    }}
                  >
                  Frontend
                </h4>
                <ul 
                  className="space-y-2"
                    style={{
                      color: 'rgba(255, 255, 255, 0.85)',
                    }}
                >
                <li>→ Next.js 15</li>
                <li>→ React 19</li>
                <li>→ Tailwind CSS v4</li>
                <li>→ TypeScript</li>
              </ul>
            </div>
          </div>
        </div>
        </LiquidGlass>
      </section>
        </>
      )}

      {/* Releases Tab */}
      {activeTab === 'releases' && (
        <section className="max-w-5xl mx-auto px-8 md:px-12 pt-4 pb-4">
          <LiquidGlass
            borderRadius={16}
            blur={0.8}
            contrast={1.3}
            brightness={0.92}
            saturation={1.15}
            displacementScale={0.5}
            elasticity={0.7}
            shadowIntensity={0.35}
            className="border border-white/30"
          >
            <div className="w-full bg-black/20 backdrop-blur-sm rounded-[inherit] p-6 md:p-8 overflow-hidden">
              <div className="mb-6 pb-4 border-b border-white/20">
                <h2 
                  className="text-xl font-bold uppercase mb-2"
                  style={{ color: 'rgba(255, 255, 255, 1)' }}
                >
                  Published Releases
                </h2>
              </div>
              <ReleasesContent />
            </div>
          </LiquidGlass>
        </section>
      )}

      {/* Lookup Tab */}
      {activeTab === 'lookup' && (
        <section className="max-w-5xl mx-auto px-8 md:px-12 pt-4 pb-4">
          <LiquidGlass
            borderRadius={16}
            blur={0.8}
            contrast={1.3}
            brightness={0.92}
            saturation={1.15}
            displacementScale={0.5}
            elasticity={0.7}
            shadowIntensity={0.35}
            className="border border-white/30"
          >
            <div className="w-full bg-black/20 backdrop-blur-sm rounded-[inherit] p-6 md:p-8 overflow-hidden">
              <div className="mb-6 pb-4 border-b border-white/20">
                <h2
                  className="text-xl font-bold uppercase mb-2"
                  style={{ color: 'rgba(255, 255, 255, 1)' }}
                >
                  ENS Record Lookup
                </h2>
              </div>
              <LookupContent />
            </div>
          </LiquidGlass>
        </section>
      )}

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <section className="max-w-5xl mx-auto px-8 md:px-12 pt-4 pb-4">
          <LiquidGlass
            borderRadius={16}
            blur={0.8}
            contrast={1.3}
            brightness={0.92}
            saturation={1.15}
            displacementScale={0.5}
            elasticity={0.7}
            shadowIntensity={0.35}
            className="border border-white/30"
          >
            <div className="w-full bg-black/20 backdrop-blur-sm rounded-[inherit] p-6 md:p-8 overflow-hidden">
              <div className="mb-6 pb-4 border-b border-white/20">
                <h2
                  className="text-xl font-bold uppercase mb-2"
                  style={{ color: 'rgba(255, 255, 255, 1)' }}
                >
                  Curator Dashboard
                </h2>
              </div>
              <DashboardContent />
            </div>
          </LiquidGlass>
        </section>
      )}

      {/* Success Modal */}
      {mounted && showSuccessModal && createPortal(
        <div 
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9999
          }}
          onClick={() => {
            setShowSuccessModal(false)
            setSubmittedReleaseId(null)
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
                    Release Submitted Successfully
                  </h3>
                </div>
                
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto space-y-3 min-h-0 text-sm text-white/80">
                  <p className="text-center">
                    Your release has been submitted and is now pending curator review.
                  </p>
                  <p className="font-mono text-xs text-white/60 text-center">
                    ID: {submittedReleaseId}
                  </p>
                  <div className="pt-2 border-t border-white/20">
                    <p className="font-semibold text-white mb-2">
                      Next Steps:
                    </p>
                    <ul className="text-left space-y-1 text-white/70">
                      <li>• View your submission under <span className="font-semibold text-white">Pending Releases</span> in the Dashboard</li>
                      <li>• The ARES curation team has been notified</li>
                      <li>• You'll be notified once your release is reviewed</li>
                    </ul>
                  </div>
                </div>
                
                {/* Fixed Footer Buttons */}
                <div className="pt-4 flex-shrink-0 space-y-2">
                  <button
                    onClick={() => {
                      setShowSuccessModal(false)
                      setSubmittedReleaseId(null)
                      setActiveTab('dashboard')
                    }}
                    className="w-full py-3 bg-white/10 border border-white/30 hover:bg-white/20 transition-colors rounded-lg font-bold uppercase text-xs backdrop-blur-sm"
                  >
                    View Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setShowSuccessModal(false)
                      setSubmittedReleaseId(null)
                    }}
                    className="w-full py-2 text-white/60 hover:text-white transition-colors text-xs uppercase"
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
    </div>
  )
}
