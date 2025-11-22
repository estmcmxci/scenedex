"use client"

import { useState, useEffect } from "react"
import { X, Play } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Release {
  id: string
  artist: string
  description: string
  categories: string[]
  title: string
  ensName: string
  coverImageUrl?: string
}

export default function BrowsePage() {
  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
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

        // Transform API data to UI format
        const transformedReleases: Release[] = data.releases.map((release: any) => {
          const releaseId = release.releaseId || release.ensName.split('.')[0].toUpperCase()
          const coverCID = release.coverImageIPFSHash?.trim()
          
          const coverImageUrl = coverCID 
            ? `https://${coverCID}.ipfs.w3s.link/${releaseId}-cover.jpg`
            : undefined

          return {
            id: releaseId,
            artist: release.artists || 'Unknown Artist',
            description: release.description || 'No description',
            categories: ["Experimental"], // Default category for now
            title: releaseId,
            ensName: release.ensName,
            coverImageUrl,
          }
        })

        setReleases(transformedReleases)
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

  const allCategories = Array.from(new Set(releases.flatMap((r) => r.categories))).sort()

  const filteredReleases = releases
    .filter((release) => {
      const matchesSearch =
        release.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        release.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory ? release.categories.includes(selectedCategory) : true
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "az") return a.artist.localeCompare(b.artist)
      return b.id.localeCompare(a.id) // Newest based on ID
    })

  return (
    <div className="min-h-screen bg-background text-foreground font-mono text-sm">
      {/* Header Section */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center font-bold text-lg">
              S
            </div>
            <h1 className="text-xl font-bold tracking-tight">scenedex</h1>
          </Link>

          <div className="flex flex-col md:flex-row gap-4 md:items-center w-full md:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 hover:text-muted-foreground transition-colors uppercase text-xs font-bold"
            >
              {showFilters ? <X className="w-3 h-3" /> : null}
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            <div className="relative group flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border border-border px-3 py-2 focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex items-center gap-3 text-xs font-bold whitespace-nowrap">
              <span className="text-muted-foreground">SORT:</span>
              <button
                onClick={() => setSortBy("az")}
                className={cn(
                  "hover:text-foreground transition-colors",
                  sortBy === "az" ? "bg-foreground text-background px-1" : "text-muted-foreground",
                )}
              >
                A-Z
              </button>
              <button
                onClick={() => setSortBy("newest")}
                className={cn(
                  "hover:text-foreground transition-colors",
                  sortBy === "newest" ? "bg-foreground text-background px-1" : "text-muted-foreground",
                )}
              >
                NEWEST
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="border-t border-border p-4 animate-in slide-in-from-top-2 duration-200">
            <div className="mb-4">
              <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "px-3 py-1 border rounded-full text-xs transition-all",
                    selectedCategory === null
                      ? "bg-foreground text-background border-foreground"
                      : "border-border hover:border-foreground",
                  )}
                >
                  All
                </button>
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                    className={cn(
                      "px-3 py-1 border rounded-full text-xs transition-all",
                      selectedCategory === category
                        ? "bg-foreground text-background border-foreground"
                        : "border-border hover:border-foreground",
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>

            </div>

          </div>
        )}
      </header>

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
          <p className="mt-4 text-muted-foreground">Loading releases from ENS...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-12 text-center border border-red-500 bg-red-500/10 mx-4">
          <p className="text-red-500 font-bold mb-2">Failed to load releases</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      )}

      {/* Table Header */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider sticky top-[header-height]">
            <div className="col-span-4 md:col-span-3">Artist</div>
            <div className="col-span-3 md:col-span-3 hidden md:block">Description</div>
            <div className="col-span-4 md:col-span-4">Categories</div>
            <div className="col-span-4 md:col-span-2 text-right">Play</div>
          </div>

          {/* List View */}
          <div className="divide-y divide-border">
            {filteredReleases.map((release) => (
          <div
            key={release.id}
            className="group grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-secondary/50 transition-colors"
          >
            <div className="col-span-4 md:col-span-3">
              <div className="font-bold text-base">{release.artist}</div>
            </div>

            <div className="col-span-3 md:col-span-3 hidden md:block text-muted-foreground text-sm">{release.description}</div>

            <div className="col-span-4 md:col-span-4 flex flex-wrap gap-1.5">
              {release.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-2 py-0.5 border border-border rounded-full text-[10px] uppercase tracking-wide"
                >
                  {cat}
                </span>
              ))}
            </div>

            <div className="col-span-4 md:col-span-2 flex justify-end gap-3 text-muted-foreground">
              <Link href={`/index/${release.ensName}`} className="hover:text-foreground transition-colors">
                <Play className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}

            {filteredReleases.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">No releases found matching your criteria.</div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

