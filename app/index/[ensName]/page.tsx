"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { AudioPlayer } from "@/app/components/audio-player"

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
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-gray-400">Loading release from ENS...</p>
          <p className="text-xs text-gray-600 mt-2">{ensName}</p>
        </div>
      </div>
    )
  }

  if (error || !release) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-center border border-red-500 bg-red-500/10 p-8 max-w-md">
          <p className="text-red-500 font-bold mb-2">Failed to load release</p>
          <p className="text-gray-400 text-sm mb-4">{error || 'Release not found'}</p>
          <Link 
            href="/index"
            className="inline-block px-4 py-2 border border-white hover:bg-white hover:text-black transition-colors text-sm uppercase"
          >
            Back to Index
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <header className="border-b border-white p-4 flex justify-between items-center sticky top-0 bg-black z-10">
        <Link
          href="/index"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-4 h-4 bg-white" />
          <span className="text-sm uppercase">Index</span>
        </Link>
        <div className="text-sm uppercase">{release.releaseId}</div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-65px)]">
        {/* Left: Visual */}
        <div className="border-b md:border-b-0 md:border-r border-white p-8 flex flex-col justify-between">
          <div className="aspect-square w-full border border-white mb-8 relative group bg-gray-900">
            {release.coverImageUrl ? (
              <img
                src={release.coverImageUrl}
                alt={release.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs uppercase">
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
          <div className="p-8 border-b border-white">
            <h1 className="text-4xl md:text-6xl font-bold uppercase mb-2">{release.title}</h1>
            <h2 className="text-2xl text-gray-400 uppercase">{release.artist}</h2>
          </div>

          {/* Metadata Table */}
          <div className="flex-1">
            <dl className="grid grid-cols-1">
              <div className="grid grid-cols-3 border-b border-gray-800 p-4 hover:bg-gray-900">
                <dt className="text-gray-500 uppercase text-sm">Description</dt>
                <dd className="col-span-2">{release.description}</dd>
              </div>
              <div className="grid grid-cols-3 border-b border-gray-800 p-4 hover:bg-gray-900">
                <dt className="text-gray-500 uppercase text-sm">Submitted By</dt>
                <dd className="col-span-2">
                  {release.submittedBy ? (
                    <div>
                      {release.submittedByEnsName ? (
                        <div>
                          <div className="font-semibold text-white">{release.submittedByEnsName}</div>
                          <div className="font-mono text-xs text-gray-400">{release.submittedBy}</div>
                        </div>
                      ) : (
                        <span className="font-mono text-xs">{release.submittedBy}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-500 italic">Unknown</span>
                  )}
                </dd>
              </div>
              <div className="grid grid-cols-3 border-b border-gray-800 p-4 hover:bg-gray-900">
                <dt className="text-gray-500 uppercase text-sm">Date</dt>
                <dd className="col-span-2">{release.date}</dd>
              </div>
              <div className="grid grid-cols-3 border-b border-gray-800 p-4 hover:bg-gray-900">
                <dt className="text-gray-500 uppercase text-sm">Format</dt>
                <dd className="col-span-2">{release.format}</dd>
              </div>
              <div className="grid grid-cols-3 border-b border-gray-800 p-4 hover:bg-gray-900">
                <dt className="text-gray-500 uppercase text-sm">ENS</dt>
                <dd className="col-span-2 font-mono text-sm">{release.ens}</dd>
              </div>
              <div className="grid grid-cols-3 border-b border-gray-800 p-4 hover:bg-gray-900">
                <dt className="text-gray-500 uppercase text-sm">Zora Coin</dt>
                <dd className="col-span-2 font-mono text-xs break-all">{release.zoraCoin}</dd>
              </div>
              <div className="grid grid-cols-3 border-b border-gray-800 p-4 hover:bg-gray-900">
                <dt className="text-gray-500 uppercase text-sm">Split Contract</dt>
                <dd className="col-span-2 font-mono text-xs break-all">{release.splitAddress || 'Not deployed'}</dd>
              </div>
            </dl>
          </div>

          {/* Actions */}
          <div className="p-8 border-t border-white grid grid-cols-2 gap-4">
            <button className="px-6 py-4 border border-white bg-white text-black font-bold uppercase hover:bg-gray-200 transition-colors">
              Collect on Zora
            </button>
            <button className="px-6 py-4 border border-white text-white font-bold uppercase hover:bg-white hover:text-black transition-colors">
              Share
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

