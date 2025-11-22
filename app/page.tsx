"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { List, Shield, Copy, Check } from "lucide-react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"

export default function SubmitPage() {
  const [loading, setLoading] = useState(false)
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
        alert(`Release submitted successfully! ID: ${result.data.id}`)
        // Reset form
        setFormData({ artist: "", title: "", description: "" })
        setAudioFile(null)
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
    <div className="min-h-screen bg-black text-white font-mono">
      <header className="border-b border-white p-4 flex justify-between items-center sticky top-0 bg-black z-10">
        <div className="flex items-center gap-2">
          <Link href="/" className="w-4 h-4 bg-white" />
          <span className="font-bold text-xl tracking-tighter">scenedex</span>
        </div>
        <nav className="flex gap-3 items-center">
          <Link
            href="/index"
            className="px-4 py-2 border border-white text-white font-bold uppercase text-xs hover:bg-white hover:text-black transition-colors flex items-center gap-2"
          >
            <List className="w-4 h-4" />
            Index
          </Link>
          <Link
            href="/curator/dashboard"
            className="px-4 py-2 border border-white text-white font-bold uppercase text-xs hover:bg-white hover:text-black transition-colors flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Dashboard
          </Link>
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
        </nav>
      </header>

      {/* Manifesto Section */}
      <section className="max-w-3xl mx-auto p-8 md:p-12 pt-4 md:pt-8">
        <h1 className="text-4xl md:text-6xl font-bold uppercase leading-none tracking-tighter mb-6">
          Decentralized
          <br />
          Music
          <br />
          Catalog
        </h1>
        <p className="text-base md:text-lg leading-relaxed text-gray-400">
          scenedex is a permanent archive for audio artifacts. Published onchain using ENS, IPFS, Zora, and Safe
          multisig. Resistant to censorship. Owned by creators.
        </p>
      </section>

      {/* Curator Board Info */}
      {safeAddress && (
        <section className="max-w-3xl mx-auto px-8 md:px-12 pb-8">
          <div className="border border-white p-6 md:p-8 bg-black">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold uppercase mb-2 text-white">Curator Board</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Submissions are reviewed by the Safe multisig curators below. Only Safe owners can approve or reject releases.
                </p>
              </div>
              <Shield className="w-6 h-6 text-white flex-shrink-0 mt-1" />
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs uppercase text-gray-500 font-bold mb-2 block">
                  Safe Address {safeEnsName && <span className="text-white">({safeEnsName})</span>}
                </label>
                <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 p-3">
                  <div className="flex-1">
                    {safeEnsName ? (
                      <div className="space-y-1">
                        <div className="text-sm text-white font-semibold">{safeEnsName}</div>
                        <code className="text-xs text-gray-400 font-mono break-all">
                          {safeAddress}
                        </code>
                      </div>
                    ) : (
                      <code className="text-xs text-white font-mono break-all">
                        {safeAddress}
                      </code>
                    )}
                  </div>
                  <button
                    onClick={() => copyToClipboard(safeAddress)}
                    className="flex-shrink-0 p-2 hover:bg-gray-800 transition-colors"
                    title="Copy address"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-white font-bold uppercase">Who Can Submit:</span>
                    <p className="text-gray-400 mt-1">Anyone with a connected wallet can submit releases to this curator board.</p>
                  </div>
                  <div>
                    <span className="text-white font-bold uppercase">Who Can Approve/Reject:</span>
                    <p className="text-gray-400 mt-1">Only wallets that are owners of the Safe address above can approve or reject submissions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="max-w-3xl mx-auto p-8 md:p-12 pt-0">
        <div className="mb-12">
          <h2 className="text-3xl font-bold uppercase mb-4">Submit Release</h2>
          <p className="text-gray-400">
            Fill out the manifest below to initialize a new release entry. All fields are required for on-chain
            verification.
          </p>
          {safeAddress && (
            <p className="text-xs text-gray-500 mt-2">
              Your submission will be sent to the curator board at{' '}
              {safeEnsName ? (
                <span className="text-gray-400 font-semibold">{safeEnsName}</span>
              ) : (
                <code className="text-gray-400">{safeAddress.substring(0, 10)}...{safeAddress.substring(safeAddress.length - 8)}</code>
              )}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs uppercase text-gray-500 font-bold">Artist Name</label>
              <input
                type="text"
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                className="w-full bg-transparent border border-white p-3 focus:bg-gray-900 focus:outline-none rounded-none"
                placeholder="ENTER_ARTIST"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase text-gray-500 font-bold">Release Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-transparent border border-white p-3 focus:bg-gray-900 focus:outline-none rounded-none"
                placeholder="ENTER_TITLE"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase text-gray-500 font-bold">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-transparent border border-white p-3 focus:bg-gray-900 focus:outline-none rounded-none resize-none"
              placeholder="ENTER_DESCRIPTION_TEXT..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase text-gray-500 font-bold">Audio File (MP3)</label>
            <label className="border border-dashed border-gray-600 p-8 text-center hover:border-white transition-colors cursor-pointer block">
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                className="hidden"
                required
              />
              <div className="text-2xl mb-2">↓</div>
              <div className="text-sm uppercase">
                {audioFile ? audioFile.name : "Drop Audio File"}
              </div>
              {audioFile && (
                <div className="text-xs text-gray-500 mt-2">
                  {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                </div>
              )}
            </label>
            <p className="text-xs text-gray-500">Cover art will be extracted from ID3 tags automatically</p>
          </div>

          <div className="pt-8 border-t border-gray-800">
            <button
              type="submit"
              disabled={!isConnected || loading}
              className="w-full py-4 bg-white text-black font-bold uppercase hover:bg-gray-200 transition-colors disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Initialize Release"}
            </button>
            {!isConnected && (
              <p className="text-xs text-gray-500 text-center mt-3">Connect your wallet to submit a release</p>
            )}
          </div>
        </form>
      </main>

      {/* How It Works */}
      <section className="max-w-3xl mx-auto px-8 md:px-12 pb-12">
        <div className="border border-gray-800 p-6 md:p-8 bg-black hover:border-gray-700 transition-colors">
          <h3 className="text-xl font-bold uppercase mb-6 text-white">How It Works</h3>
          <div className="space-y-6 text-sm md:text-base leading-relaxed text-gray-400">
            <div className="flex gap-4">
              <div className="text-white font-bold text-lg flex-shrink-0">1.</div>
              <div className="text-justify">
                <span className="text-white font-bold">Safe Multisig Approval</span> — Curators collectively approve
                releases using a Safe multisig on Ethereum. Once the signature threshold is met, a backend coordinator
                automatically executes the publishing flow. Curators control what gets published, but don't manually deploy
                transactions.
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-white font-bold text-lg flex-shrink-0">2.</div>
              <div className="text-justify">
                <span className="text-white font-bold">Permanent Storage & Minting</span> — Audio files and cover art are
                pinned to IPFS via Storacha, ensuring censorship-resistant hosting. A{" "}
                <a
                  href="https://docs.zora.co/coins"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline hover:text-gray-300"
                >
                  Zora Creator Coin
                </a>{" "}
                mints on Base L2 with a fixed 1B supply (50% to creator vesting over 5 years, 50% tradeable immediately).
                Revenue from coin trades flows to a 0xSplits contract that automatically distributes 50% to curators, 50% to
                the creator's wallet.
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-white font-bold text-lg flex-shrink-0">3.</div>
              <div className="text-justify">
                <span className="text-white font-bold">ENS Registry & Ownership</span> — Each release receives an ENS
                subname (e.g., soma011.scenedex.eth) storing all metadata onchain: IPFS CIDs, contract addresses, split
                address, and creator ownership claims. All data is queryable, verifiable, and permanent.
              </div>
            </div>
            <p className="text-xs text-gray-500 italic pt-2 text-center">
              Result: Immutable releases with transparent revenue sharing and permanent onchain metadata.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-3xl mx-auto px-8 md:px-12 pb-12">
        <div className="border border-gray-800 p-6 md:p-8 bg-black hover:border-gray-700 transition-colors">
          <h3 className="text-xl font-bold uppercase mb-6 text-white">Tech Stack</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-400">
            <div>
              <h4 className="text-white font-bold uppercase text-xs mb-3">Blockchain</h4>
              <ul className="space-y-2">
                <li>→ Ethereum L1 (ENS, Safe)</li>
                <li>→ Base L2 (Zora, Splits)</li>
                <li>→ viem / ethers.js</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold uppercase text-xs mb-3">Storage</h4>
              <ul className="space-y-2">
                <li>→ IPFS / Storacha</li>
                <li>→ PostgreSQL</li>
                <li>→ ENS Text Records</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold uppercase text-xs mb-3">Protocols</h4>
              <ul className="space-y-2">
                <li>→ Safe Multisig</li>
                <li>→ Zora Creator Coins</li>
                <li>→ 0xSplits Revenue</li>
                <li>→ ENS Subnames</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold uppercase text-xs mb-3">Frontend</h4>
              <ul className="space-y-2">
                <li>→ Next.js 16</li>
                <li>→ React</li>
                <li>→ Tailwind CSS v4</li>
                <li>→ TypeScript</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
