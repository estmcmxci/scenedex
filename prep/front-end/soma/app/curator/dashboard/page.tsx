"use client"

import { useState } from "react"
import Link from "next/link"

export default function CuratorDashboardPage() {
  const [releases] = useState([
    { id: "SOMA012", artist: "TechnoArtist", title: "Synthetic Waves", status: "PENDING" },
    { id: "SOMA013", artist: "SoundScaper", title: "Ambient Spaces", status: "PENDING" },
  ])

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <header className="border-b border-white p-4 flex justify-between items-center sticky top-0 bg-black z-10">
        <div className="flex items-center gap-2">
          <Link href="/" className="w-4 h-4 bg-white" />
          <span className="font-bold text-xl tracking-tighter">soma.wiki</span>
        </div>
        <div className="text-sm uppercase">Curator Mode</div>
      </header>

      <main className="p-4 md:p-8">
        <div className="flex justify-between items-end mb-8">
          <h1 className="text-2xl font-bold uppercase">Pending Approvals</h1>
          <div className="text-sm text-gray-500">QUEUE: {releases.length}</div>
        </div>

        <div className="border border-white">
          <div className="grid grid-cols-12 border-b border-white bg-white text-black text-xs uppercase font-bold p-3">
            <div className="col-span-2">ID</div>
            <div className="col-span-3">Artist</div>
            <div className="col-span-4">Title</div>
            <div className="col-span-3 text-right">Action</div>
          </div>

          {releases.map((release) => (
            <div
              key={release.id}
              className="grid grid-cols-12 border-b border-gray-800 p-4 items-center hover:bg-gray-900"
            >
              <div className="col-span-2 font-mono text-gray-500">{release.id}</div>
              <div className="col-span-3 font-bold">{release.artist}</div>
              <div className="col-span-4 text-gray-400">{release.title}</div>
              <div className="col-span-3 flex justify-end gap-2">
                <button className="px-3 py-1 border border-gray-600 hover:border-green-500 hover:text-green-500 text-xs uppercase transition-colors">
                  Approve
                </button>
                <button className="px-3 py-1 border border-gray-600 hover:border-red-500 hover:text-red-500 text-xs uppercase transition-colors">
                  Reject
                </button>
              </div>
            </div>
          ))}

          {releases.length === 0 && <div className="p-12 text-center text-gray-500 uppercase">No pending releases</div>}
        </div>
      </main>
    </div>
  )
}
