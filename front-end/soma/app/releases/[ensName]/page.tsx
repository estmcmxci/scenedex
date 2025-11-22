"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { AudioPlayer } from "@/components/audio-player"

// Mock data
const mockReleaseData: Record<string, any> = {
  "soma011.eth": {
    releaseId: "SOMA011",
    title: "Post-Rational",
    artist: "m580",
    description: "An exploration of post-rational thought through experimental electronic soundscapes.",
    coverImageUrl: "/abstract-electronic-music-album-cover-purple.jpg",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    location: "Berlin, DE",
    date: "2024-03-20",
    format: "Digital, IPFS",
    genre: "Experimental",
    zoraCoin: "0x1234...5678",
    ens: "soma011.eth",
  },
}

export default function ReleaseDetailPage() {
  const params = useParams()
  const ensName = params.ensName as string
  const [release, setRelease] = useState<any>(null)

  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      setRelease(mockReleaseData[ensName] || mockReleaseData["soma011.eth"])
    }, 500)
  }, [ensName])

  if (!release) return <div className="p-8 font-mono">LOADING_DATA...</div>

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <header className="border-b border-white p-4 flex justify-between items-center sticky top-0 bg-black z-10">
        <Link
          href="/browse"
          className="hover:bg-white hover:text-black px-2 py-1 border border-transparent hover:border-white transition-colors"
        >
          ← BACK_TO_INDEX
        </Link>
        <div className="text-sm uppercase">{release.releaseId}</div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-65px)]">
        {/* Left: Visual */}
        <div className="border-b md:border-b-0 md:border-r border-white p-8 flex flex-col justify-between">
          <div className="aspect-square w-full border border-white mb-8 relative group">
            <img
              src={release.coverImageUrl || "/placeholder.svg"}
              alt={release.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
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
                <dt className="text-gray-500 uppercase text-sm">Location</dt>
                <dd className="col-span-2">{release.location}</dd>
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
                <dt className="text-gray-500 uppercase text-sm">Contract</dt>
                <dd className="col-span-2 font-mono text-xs break-all">{release.zoraCoin}</dd>
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
