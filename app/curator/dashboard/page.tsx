"use client"

import Link from "next/link"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import { useState, useEffect } from "react"
import { DashboardContent } from "@/app/components/dashboard-content"

export default function CuratorDashboardPage() {
  const { address, isConnected } = useAccount()
  const [walletEnsName, setWalletEnsName] = useState<string | null>(null)

  // Resolve connected wallet address to ENS name
  useEffect(() => {
    async function resolveWalletENS() {
      if (!isConnected || !address) {
        setWalletEnsName(null)
        return
      }

      try {
        const response = await fetch(`/api/ens/resolve?address=${address}`)
        const data = await response.json()
        if (data.success && data.data.name) {
          setWalletEnsName(data.data.name)
        }
      } catch (error) {
        console.error("Failed to resolve wallet ENS name:", error)
      }
    }
    resolveWalletENS()
  }, [isConnected, address])

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <header className="border-b border-white p-4 flex justify-between items-center sticky top-0 bg-black z-10">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-4 h-4 bg-white" />
          <span className="font-bold text-xl tracking-tighter">scenedex</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-sm uppercase">Curator Mode</div>
          <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
              const ready = mounted
              const connected = ready && account && chain

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          type="button"
                          className="px-4 py-2 border border-white text-white font-bold uppercase text-xs hover:bg-white hover:text-black transition-colors"
                        >
                          Connect
                        </button>
                      )
                    }

                    return (
                      <button
                        onClick={openAccountModal}
                        type="button"
                        className="px-4 py-2 border border-white text-white font-bold uppercase text-xs hover:bg-white hover:text-black transition-colors"
                      >
                        {walletEnsName || account.displayName}
                      </button>
                    )
                  })()}
                </div>
              )
            }}
          </ConnectButton.Custom>
        </div>
      </header>

      <main className="p-4 md:p-8">
        <DashboardContent />
      </main>
    </div>
  )
}
