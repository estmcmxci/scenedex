"use client"

import { useState } from "react"
import { Globe, Instagram, X, Play } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Enhanced mock data to match the screenshot's data density
const mockReleases = [
  {
    id: "SOMA011",
    artist: "m580",
    location: "Berlin, DE",
    categories: ["Techno", "Dub"],
    title: "Post-Rational",
    ensName: "soma011.eth",
    links: { web: "#", social: "#" },
  },
  {
    id: "SOMA010",
    artist: "Aether",
    location: "London, UK",
    categories: ["Ambient", "Drone"],
    title: "Ethereal Dreams",
    ensName: "soma010.eth",
    links: { web: "#", social: "#" },
  },
  {
    id: "SOMA009",
    artist: "Unit 7",
    location: "Detroit, USA",
    categories: ["Electro", "Acid"],
    title: "Digital Horizons",
    ensName: "soma009.eth",
    links: { web: "#", social: "#" },
  },
  {
    id: "SOMA008",
    artist: "BassMaster",
    location: "Bristol, UK",
    categories: ["Bass", "Garage"],
    title: "Quantum Beats",
    ensName: "soma008.eth",
    links: { web: "#", social: "#" },
  },
  {
    id: "SOMA007",
    artist: "Neon Systems",
    location: "Tokyo, JP",
    categories: ["Synthwave", "Cyber"],
    title: "Neon Nights",
    ensName: "soma007.eth",
    links: { web: "#", social: "#" },
  },
  {
    id: "SOMA006",
    artist: "Void Walker",
    location: "Reykjavik, IS",
    categories: ["Ambient", "Experimental"],
    title: "Cosmic Flow",
    ensName: "soma006.eth",
    links: { web: "#", social: "#" },
  },
  {
    id: "SOMA005",
    artist: "Data Plex",
    location: "Seoul, KR",
    categories: ["Glitch", "IDM"],
    title: "Structure 01",
    ensName: "soma005.eth",
    links: { web: "#", social: "#" },
  },
  {
    id: "SOMA004",
    artist: "Flux State",
    location: "Montreal, CA",
    categories: ["Techno", "Minimal"],
    title: "Redux",
    ensName: "soma004.eth",
    links: { web: "#", social: "#" },
  },
]

const allCategories = Array.from(new Set(mockReleases.flatMap((r) => r.categories))).sort()

export default function BrowsePage() {
  const [showFilters, setShowFilters] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"az" | "newest" | "location">("az")

  const filteredReleases = mockReleases
    .filter((release) => {
      const matchesSearch =
        release.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        release.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory ? release.categories.includes(selectedCategory) : true
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "az") return a.artist.localeCompare(b.artist)
      if (sortBy === "location") return a.location.localeCompare(b.location)
      return b.id.localeCompare(a.id) // Newest based on ID
    })

  return (
    <div className="min-h-screen bg-background text-foreground font-mono text-sm">
      {/* Header Section */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center font-bold text-lg">
              S
            </div>
            <h1 className="text-xl font-bold tracking-tight">soma.wiki</h1>
          </div>

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
              <button
                onClick={() => setSortBy("location")}
                className={cn(
                  "hover:text-foreground transition-colors",
                  sortBy === "location" ? "bg-foreground text-background px-1" : "text-muted-foreground",
                )}
              >
                LOCATION
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

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider sticky top-[header-height]">
        <div className="col-span-4 md:col-span-3">Artist / Release</div>
        <div className="col-span-3 md:col-span-3 hidden md:block">Location</div>
        <div className="col-span-4 md:col-span-4">Categories</div>
        <div className="col-span-4 md:col-span-2 text-right">Links</div>
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
              <div className="text-muted-foreground text-xs mt-0.5">{release.title}</div>
            </div>

            <div className="col-span-3 md:col-span-3 hidden md:block text-muted-foreground">{release.location}</div>

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
              <Link href={`/releases/${release.ensName}`} className="hover:text-foreground transition-colors">
                <Play className="w-4 h-4" />
              </Link>
              <a href="#" className="hover:text-foreground transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}

        {filteredReleases.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">No releases found matching your criteria.</div>
        )}
      </div>
    </div>
  )
}
