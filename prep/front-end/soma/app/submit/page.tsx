"use client"

import { useState } from "react"
import Link from "next/link"

export default function SubmitPage() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <header className="border-b border-white p-4 flex justify-between items-center sticky top-0 bg-black z-10">
        <div className="flex items-center gap-2">
          <Link href="/" className="w-4 h-4 bg-white" />
          <span className="font-bold text-xl tracking-tighter">soma.wiki</span>
        </div>
        <div className="text-sm uppercase">New Submission</div>
      </header>

      <main className="max-w-3xl mx-auto p-8 md:p-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold uppercase mb-4">Submit Release</h1>
          <p className="text-gray-400">
            Fill out the manifest below to initialize a new release entry. All fields are required for on-chain
            verification.
          </p>
        </div>

        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs uppercase text-gray-500 font-bold">Artist Name</label>
              <input
                type="text"
                className="w-full bg-transparent border border-white p-3 focus:bg-gray-900 focus:outline-none rounded-none"
                placeholder="ENTER_ARTIST"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase text-gray-500 font-bold">Release Title</label>
              <input
                type="text"
                className="w-full bg-transparent border border-white p-3 focus:bg-gray-900 focus:outline-none rounded-none"
                placeholder="ENTER_TITLE"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase text-gray-500 font-bold">Description</label>
            <textarea
              rows={4}
              className="w-full bg-transparent border border-white p-3 focus:bg-gray-900 focus:outline-none rounded-none resize-none"
              placeholder="ENTER_DESCRIPTION_TEXT..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs uppercase text-gray-500 font-bold">Audio File (MP3)</label>
              <div className="border border-dashed border-gray-600 p-8 text-center hover:border-white transition-colors cursor-pointer">
                <div className="text-2xl mb-2">↓</div>
                <div className="text-sm uppercase">Drop Audio File</div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase text-gray-500 font-bold">Cover Art (JPG/PNG)</label>
              <div className="border border-dashed border-gray-600 p-8 text-center hover:border-white transition-colors cursor-pointer">
                <div className="text-2xl mb-2">↓</div>
                <div className="text-sm uppercase">Drop Image File</div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800">
            <button className="w-full py-4 bg-white text-black font-bold uppercase hover:bg-gray-200 transition-colors">
              Initialize Release
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
