"use client"

import { useState, useEffect } from "react"
import { Play } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Release {
  id: string
  artist: string
  description: string
  title: string
  ensName: string
  coverImageUrl?: string
  creatorAddress?: string | null
  publisherAddress?: string | null
  creatorEnsName?: string | null
  publisherEnsName?: string | null
  publishedAt?: number | null
}

interface ReleasesContentProps {
  className?: string
}

export function ReleasesContent({ className }: ReleasesContentProps) {
  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"az" | "newest">("az")

  // Fetch releases from ENS via API
  useEffect(() => {
    async function fetchReleases() {
      try {
        setLoading(true)
        const response = await fetch('/api/releases')
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch releases')
        }

        // Transform API data to UI format and fetch metadata for publisher info
        const transformedReleases: Release[] = await Promise.all(
          data.releases.map(async (release: any) => {
            const releaseId = release.releaseId || release.ensName.split('.')[0].toUpperCase()
            const coverCID = release.coverImageIPFSHash?.trim()
            
            const coverImageUrl = coverCID 
              ? `https://${coverCID}.ipfs.w3s.link/${releaseId}-cover.jpg`
              : undefined

            // Fetch publisher, publication date, and title from metadata JSON if available
            let publisherAddress: string | null = release.publisherAddress || null // Fallback from DB
            let publishedAt: number | null = release.approvedAt || null // Fallback from DB
            let trackTitle: string | null = null
            if (release.metadataURI) {
              try {
                const metadataUrl = `https://${release.metadataURI}.ipfs.w3s.link/${releaseId}-metadata.json`
                const metadataRes = await fetch(metadataUrl)
                if (metadataRes.ok) {
                  const metadata = await metadataRes.json()
                  // Prefer metadata values over DB fallbacks
                  publisherAddress = metadata.properties?.publishedBy || publisherAddress
                  publishedAt = metadata.properties?.publishedAt || publishedAt
                  trackTitle = metadata.name || null
                }
              } catch (err) {
                // Metadata fetch failed, use DB fallback values
                console.log(`Could not fetch metadata for ${releaseId}:`, err)
              }
            }

            return {
              id: releaseId,
              artist: release.artists || 'Unknown Artist',
              description: release.description || 'No description',
              title: trackTitle || releaseId,
              ensName: release.ensName,
              coverImageUrl,
              creatorAddress: release.creatorAddress || null,
              publisherAddress,
              publishedAt,
            }
          })
        )

        setReleases(transformedReleases)
        
        // Resolve ENS names for all addresses in parallel
        const allAddresses = new Set<string>()
        transformedReleases.forEach((release) => {
          if (release.creatorAddress) allAddresses.add(release.creatorAddress.toLowerCase())
          if (release.publisherAddress) allAddresses.add(release.publisherAddress.toLowerCase())
        })

        // Batch resolve all addresses
        const ensResolutions = await Promise.all(
          Array.from(allAddresses).map(async (address) => {
            try {
              const response = await fetch(`/api/ens/resolve?address=${address}`)
              const data = await response.json()
              return {
                address: address.toLowerCase(),
                name: data.success && data.data.name ? data.data.name : null,
              }
            } catch (error) {
              return { address: address.toLowerCase(), name: null }
            }
          })
        )

        // Create a map of address -> ENS name
        const ensMap = new Map<string, string | null>()
        ensResolutions.forEach(({ address, name }) => {
          ensMap.set(address, name)
        })

        // Update releases with ENS names
        setReleases((prevReleases) =>
          prevReleases.map((release) => ({
            ...release,
            creatorEnsName: release.creatorAddress
              ? ensMap.get(release.creatorAddress.toLowerCase()) || null
              : null,
            publisherEnsName: release.publisherAddress
              ? ensMap.get(release.publisherAddress.toLowerCase()) || null
              : null,
          }))
        )
        setError(null)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load releases'
        console.error('Error fetching releases:', errorMsg)
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    fetchReleases()
  }, [])

  const filteredReleases = releases
    .filter((release) => {
      const matchesSearch =
        release.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        release.title.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === "az") return a.artist.localeCompare(b.artist)
      return b.id.localeCompare(a.id) // Newest based on ID
    })

  return (
    <div className={cn("text-white", className)}>
      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center w-full mb-6">
        <div className="relative group flex-1">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/30 px-3 py-2 rounded-lg focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/50 backdrop-blur-sm"
          />
        </div>

        <div className="flex items-center gap-3 text-xs font-bold whitespace-nowrap">
          <span className="text-white/60">SORT:</span>
          <button
            onClick={() => setSortBy("az")}
            className={cn(
              "px-2 py-1 rounded transition-colors",
              sortBy === "az" 
                ? "bg-white text-black" 
                : "text-white/60 hover:text-white"
            )}
          >
            A-Z
          </button>
          <button
            onClick={() => setSortBy("newest")}
            className={cn(
              "px-2 py-1 rounded transition-colors",
              sortBy === "newest" 
                ? "bg-white text-black" 
                : "text-white/60 hover:text-white"
            )}
          >
            NEWEST
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-4 text-white/60">Loading releases from ENS...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-12 text-center border border-red-500/50 bg-red-500/10 rounded-lg">
          <p className="text-red-400 font-bold mb-2">Failed to load releases</p>
          <p className="text-white/60 text-sm">{error}</p>
        </div>
      )}

      {/* Table Header */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-white/20 text-xs font-bold text-white/60 uppercase tracking-wider">
            <div className="col-span-3 md:col-span-1">Artist</div>
            <div className="col-span-2 md:col-span-2">Title</div>
            <div className="col-span-2 md:col-span-1">ID</div>
            <div className="col-span-0 md:col-span-2 hidden md:block">Description</div>
            <div className="col-span-0 md:col-span-1 hidden md:block">Date</div>
            <div className="col-span-0 md:col-span-2 hidden md:block">Creator</div>
            <div className="col-span-0 md:col-span-2 hidden md:block">Publisher</div>
            <div className="col-span-5 md:col-span-1 text-right">Play</div>
          </div>

          {/* List View */}
          <div className="divide-y divide-white/10">
            {filteredReleases.map((release) => (
              <Link
                key={release.id}
                href={`/releases/${release.ensName}`}
                className="group grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="col-span-3 md:col-span-1">
                  <div className="font-bold text-base">{release.artist}</div>
                </div>

                <div className="col-span-2 md:col-span-2">
                  <div className="text-sm">{release.title}</div>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <div className="font-mono text-xs text-white/60">{release.id}</div>
                </div>

                <div className="col-span-0 md:col-span-2 hidden md:block text-white/60 text-sm">{release.description}</div>

                <div className="col-span-0 md:col-span-1 hidden md:block text-xs text-white/60">
                  {release.publishedAt ? (
                    <div>{new Date(release.publishedAt).toLocaleDateString()}</div>
                  ) : (
                    <span className="italic">N/A</span>
                  )}
                </div>

                <div className="col-span-0 md:col-span-2 hidden md:block text-xs">
                  {release.creatorAddress ? (
                    <div>
                      {release.creatorEnsName ? (
                        <div className="font-semibold">{release.creatorEnsName}</div>
                      ) : (
                        <div className="font-mono text-[10px] text-white/60">
                          {release.creatorAddress.substring(0, 6)}...{release.creatorAddress.substring(release.creatorAddress.length - 4)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-white/60">Unknown</span>
                  )}
                </div>

                <div className="col-span-0 md:col-span-2 hidden md:block text-xs">
                  {release.publisherAddress ? (
                    <div>
                      {release.publisherEnsName ? (
                        <div className="font-semibold">{release.publisherEnsName}</div>
                      ) : (
                        <div className="font-mono text-[10px] text-white/60">
                          {release.publisherAddress.substring(0, 6)}...{release.publisherAddress.substring(release.publisherAddress.length - 4)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-white/60 italic">N/A</span>
                  )}
                </div>

                <div className="col-span-5 md:col-span-1 flex justify-end items-center">
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    {release.coverImageUrl ? (
                      <div className="relative w-12 h-12">
                        <img
                          src={release.coverImageUrl}
                          alt={release.title}
                          className="w-12 h-12 object-cover border border-white/30 rounded"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center rounded">
                          <Play className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-12 h-12 border border-white/30 bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors rounded">
                        <Play className="w-5 h-5 text-white/60" />
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}

            {filteredReleases.length === 0 && (
              <div className="p-12 text-center text-white/60">No releases found matching your criteria.</div>
            )}
          </div>
        </>
      )}
    </div>
  )
}


