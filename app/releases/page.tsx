"use client"

// Prevent static generation - this page fetches data at runtime
export const dynamic = 'force-dynamic'

import Link from "next/link"
import { ReleasesContent } from "@/app/components/releases-content"

export default function BrowsePage() {
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
        </div>
      </header>

      {/* Releases Content */}
      <div className="p-4">
        <ReleasesContent />
          </div>
    </div>
  )
}
