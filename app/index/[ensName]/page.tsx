"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function IndexRedirectPage() {
  const params = useParams()
  const router = useRouter()
  const ensName = params.ensName as string

  useEffect(() => {
    if (ensName) {
      router.replace(`/releases/${ensName}`)
    }
  }, [ensName, router])

  return (
    <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
        <p className="text-gray-400">Redirecting...</p>
      </div>
    </div>
  )
}
