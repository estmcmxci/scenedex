'use client'

import { WagmiProvider, createConfig, http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { baseSepolia } from 'wagmi/chains'
import { injected, metaMask } from 'wagmi/connectors'
import { walletConnect } from '@wagmi/connectors'
import '@rainbow-me/rainbowkit/styles.css'

// Get WalletConnect project ID from environment or use a fallback
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

// Create connectors - prioritize injected (MetaMask) which works better on IPFS
const connectors: any[] = [
  injected(),
  metaMask(),
]

// Only add WalletConnect if we have a valid project ID
if (walletConnectProjectId && walletConnectProjectId !== 'demo') {
  connectors.push(
    walletConnect({
      projectId: walletConnectProjectId,
      showQrModal: true,
    })
  )
}

// Default Base Sepolia RPC (public endpoint)
const DEFAULT_BASE_SEPOLIA_RPC = 'https://base-sepolia.g.alchemy.com/v2/lrMqugbPNZcypSuWA_g9C'

// Create wagmi config
const config = createConfig({
  chains: [baseSepolia],
  connectors,
  transports: {
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || DEFAULT_BASE_SEPOLIA_RPC),
  },
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

