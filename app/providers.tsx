"use client"

import "@rainbow-me/rainbowkit/styles.css"
import { getDefaultConfig, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { mainnet, sepolia, base, baseSepolia } from "wagmi/chains"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

const config = getDefaultConfig({
  appName: "scenedex",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [mainnet, sepolia, base, baseSepolia],
  ssr: true,
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#ffffff",
            accentColorForeground: "#000000",
            borderRadius: "none",
            fontStack: "system",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

