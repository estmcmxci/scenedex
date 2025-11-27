"use client"

// Prevent static generation - this page fetches data at runtime
export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AudioPlayer } from "@/app/components/audio-player"
import { LiquidGlass } from "@liquidglass/react"

interface ReleaseData {
  releaseId: string
  title: string
  artist: string
  description: string
  coverImageUrl: string
  audioUrl: string
  date: string
  format: string
  genre: string
  zoraCoin: string
  splitAddress: string
  ens: string
  submittedBy?: string | null
  submittedByEnsName?: string | null
}

export default function ReleaseDetailPage() {
  const params = useParams()
  const ensName = params.ensName as string
  const [release, setRelease] = useState<ReleaseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showComingSoon, setShowComingSoon] = useState(false)

  useEffect(() => {
    async function fetchRelease() {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch ENS data
        const response = await fetch(`/api/releases/single?ensName=${encodeURIComponent(ensName)}`)
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch release data')
        }

        const ensData = data.release
        
        // Step 2: Fetch metadata JSON to get catalogueId, track title, and submitter info
        let catalogueId = ensData.scenedex?.releaseId || ensName.split('.')[0]?.toUpperCase() || 'UNKNOWN'
        let trackTitle = catalogueId // Default to catalogueId if metadata fetch fails
        let submittedBy: string | null = null
        
        // Get creator/submitter from ENS address record (always available)
        submittedBy = ensData.primaryAddress || null
        
        if (ensData.scenedex?.metadataURI) {
          try {
            // Use same gateway format as audio/cover: {CID}.ipfs.w3s.link/{catalogueId}-metadata.json
            const metadataUrl = `https://${ensData.scenedex.metadataURI}.ipfs.w3s.link/${catalogueId}-metadata.json`
            console.log('🔍 Fetching metadata from:', metadataUrl)
            const metadataRes = await fetch(metadataUrl)
            const metadata = await metadataRes.json()
            
            console.log('📦 Metadata JSON:', metadata)
            
            // Extract catalogueId from metadata (should be SOMA012, SOMA013, etc.)
            if (metadata.properties?.catalogueId) {
              catalogueId = metadata.properties.catalogueId
              console.log('📦 Extracted catalogueId from metadata:', catalogueId)
            }
            
            // Extract track title from metadata.name (this is the track title)
            if (metadata.name) {
              trackTitle = metadata.name
              console.log('🎵 Extracted track title from metadata.name:', trackTitle)
            } else {
              console.warn('⚠️  No metadata.name found, using catalogueId as title')
            }
            
            // Prefer submittedBy from metadata if available (more accurate)
            if (metadata.properties?.submittedBy) {
              submittedBy = metadata.properties.submittedBy
            }
          } catch (metaErr) {
            console.error('⚠️  Could not fetch metadata JSON:', metaErr)
            console.warn('   Using catalogueId as title fallback')
          }
        }

        // Step 3: Construct gateway URLs with catalogueId
        // Format: https://{CID}.ipfs.w3s.link/{catalogueId}-{filename}
        const coverCID = ensData.standard?.avatar?.replace('ipfs://', '')
        const mediaCID = ensData.scenedex?.mediaIPFS
        
        const coverImageUrl = coverCID 
          ? `https://${coverCID}.ipfs.w3s.link/${catalogueId}-cover.jpg`
          : ''
        
        const audioUrl = mediaCID 
          ? `https://${mediaCID}.ipfs.w3s.link/${catalogueId}-release.mp3`
          : ''

        console.log('🎵 Constructed URLs:')
        console.log('   CatalogueId:', catalogueId)
        console.log('   Cover:', coverImageUrl)
        console.log('   Audio:', audioUrl)

        const transformedRelease: ReleaseData = {
          releaseId: ensData.scenedex?.releaseId || ensName.split('.')[0]?.toUpperCase() || 'UNKNOWN',
          title: trackTitle, // Use track title from metadata
          artist: ensData.scenedex?.artists || 'Unknown Artist',
          description: ensData.standard?.description || 'No description available',
          coverImageUrl,
          audioUrl,
          date: 'Published',
          format: 'Digital, IPFS',
          genre: 'Experimental',
          zoraCoin: ensData.scenedex?.zoraCoinAddress || 'Not deployed',
          splitAddress: ensData.scenedex?.splitAddress || 'Not deployed',
          ens: ensData.ensName,
          submittedBy,
        }

        // Resolve ENS name for submitter
        if (submittedBy) {
          try {
            const ensRes = await fetch(`/api/ens/resolve?address=${submittedBy}`)
            const ensData = await ensRes.json()
            if (ensData.success && ensData.data.name) {
              transformedRelease.submittedByEnsName = ensData.data.name
            }
          } catch (err) {
            console.log('Could not resolve ENS name for submitter:', err)
          }
        }

        setRelease(transformedRelease)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load release'
        console.error('Error fetching release:', errorMsg)
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    if (ensName) {
      fetchRelease()
    }
  }, [ensName])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
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
          <div className="w-full bg-black/20 backdrop-blur-sm rounded-[inherit] p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white/70 mb-4"></div>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Loading release from ENS...</p>
            <p className="text-xs mt-2" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>{ensName}</p>
        </div>
        </LiquidGlass>
      </div>
    )
  }

  if (error || !release) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <LiquidGlass
          borderRadius={16}
          blur={0.8}
          contrast={1.3}
          brightness={0.92}
          saturation={1.15}
          displacementScale={0.5}
          elasticity={0.7}
          shadowIntensity={0.35}
          className="border border-red-500/50"
        >
          <div className="w-full bg-black/20 backdrop-blur-sm rounded-[inherit] p-8 text-center max-w-md">
            <p className="font-bold mb-2" style={{ color: 'rgba(239, 68, 68, 1)' }}>Failed to load release</p>
            <p className="text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{error || 'Release not found'}</p>
          <Link 
              href="/"
              className="inline-block px-4 py-2 border border-white/30 hover:bg-white/10 transition-colors text-sm uppercase rounded-lg"
              style={{ color: 'rgba(255, 255, 255, 0.9)' }}
          >
              Back
          </Link>
        </div>
        </LiquidGlass>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 pt-4 pb-4">
        <div className="px-4 md:px-8">
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
            <div className="w-full bg-black/20 backdrop-blur-sm rounded-[inherit] p-4 overflow-visible">
              <div className="flex items-center justify-between">
        <Link
                  href="/"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity px-3 py-2 rounded-lg border border-white/30"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
        >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm uppercase font-bold">Back</span>
        </Link>
                <div 
                  className="text-sm uppercase font-bold px-3 py-2 rounded-lg border border-white/30"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  {release.releaseId}
                </div>
              </div>
            </div>
          </LiquidGlass>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 md:px-8 pt-4 pb-8">
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
          <div className="w-full bg-black/20 backdrop-blur-sm rounded-[inherit] overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left: Visual */}
              <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-white/20 flex flex-col justify-between">
                <div className="aspect-square w-full border border-white/30 mb-6 relative group bg-black/20 rounded-xl overflow-hidden">
            {release.coverImageUrl ? (
              <img
                src={release.coverImageUrl}
                alt={release.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs uppercase" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                No Cover Art
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
              {/* Overlay content if needed */}
            </div>
          </div>

          <div className="space-y-4">
            <AudioPlayer audioUrl={release.audioUrl} />
          </div>
        </div>

        {/* Right: Data */}
        <div className="flex flex-col">
          {/* Title Block */}
                <div className="p-6 md:p-8 border-b border-white/20">
                  <h1 
                    className="text-3xl md:text-5xl font-bold uppercase mb-2"
                    style={{ color: 'rgba(255, 255, 255, 1)' }}
                  >
                    {release.title}
                  </h1>
                  <h2 
                    className="text-xl uppercase"
                    style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                  >
                    {release.artist}
                  </h2>
          </div>

          {/* Metadata Table */}
          <div className="flex-1">
            <dl className="grid grid-cols-1">
                    <div className="grid grid-cols-3 border-b border-white/10 p-4 hover:bg-white/5 transition-colors">
                      <dt className="uppercase text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Description</dt>
                      <dd className="col-span-2" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{release.description}</dd>
              </div>
                    <div className="grid grid-cols-3 border-b border-white/10 p-4 hover:bg-white/5 transition-colors">
                      <dt className="uppercase text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Submitted By</dt>
                <dd className="col-span-2">
                  {release.submittedBy ? (
                    <div>
                      {release.submittedByEnsName ? (
                        <div>
                                <div className="font-semibold" style={{ color: 'rgba(255, 255, 255, 1)' }}>{release.submittedByEnsName}</div>
                                <div className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{release.submittedBy}</div>
                        </div>
                      ) : (
                              <span className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{release.submittedBy}</span>
                      )}
                    </div>
                  ) : (
                          <span className="italic" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>Unknown</span>
                  )}
                </dd>
              </div>
                    <div className="grid grid-cols-3 border-b border-white/10 p-4 hover:bg-white/5 transition-colors">
                      <dt className="uppercase text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Date</dt>
                      <dd className="col-span-2" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{release.date}</dd>
              </div>
                    <div className="grid grid-cols-3 border-b border-white/10 p-4 hover:bg-white/5 transition-colors">
                      <dt className="uppercase text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Format</dt>
                      <dd className="col-span-2" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{release.format}</dd>
              </div>
                    <div className="grid grid-cols-3 border-b border-white/10 p-4 hover:bg-white/5 transition-colors">
                      <dt className="uppercase text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>ENS</dt>
                      <dd className="col-span-2 font-mono text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{release.ens}</dd>
              </div>
                    <div className="grid grid-cols-3 border-b border-white/10 p-4 hover:bg-white/5 transition-colors">
                      <dt className="uppercase text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Zora Coin</dt>
                      <dd className="col-span-2 font-mono text-xs break-all" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{release.zoraCoin}</dd>
              </div>
                    <div className="grid grid-cols-3 border-b border-white/10 p-4 hover:bg-white/5 transition-colors">
                      <dt className="uppercase text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Split Contract</dt>
                      <dd className="col-span-2 font-mono text-xs break-all" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{release.splitAddress || 'Not deployed'}</dd>
              </div>
            </dl>
          </div>

          {/* Actions */}
                <div className="p-6 md:p-8 border-t border-white/20 grid grid-cols-2 gap-4">
            <button 
                    onClick={() => {
                      setShowComingSoon(true)
                      setTimeout(() => setShowComingSoon(false), 2000)
                    }}
                    className="px-6 py-4 border border-white/30 font-bold uppercase transition-colors rounded-lg"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: 'rgba(0, 0, 0, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
                    }}
            >
                    {showComingSoon ? 'Coming soon!' : 'Collect on Zora'}
            </button>
            <button 
              onClick={async () => {
                      const url = window.location.href
                  try {
                        await navigator.clipboard.writeText(url)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                  } catch (err) {
                        console.error('Failed to copy:', err)
                      }
                    }}
                    className="px-6 py-4 border border-white/30 font-bold uppercase transition-colors rounded-lg"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {copied ? 'Copied!' : 'Share'}
            </button>
          </div>
        </div>
            </div>
          </div>
        </LiquidGlass>
      </main>
    </div>
  )
}
