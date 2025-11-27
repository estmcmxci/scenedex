const path = require('path');

// Path to empty stub module for silencing Web3 dependency warnings
const emptyStub = path.resolve(__dirname, 'lib/stubs/empty.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix workspace root detection
  outputFileTracingRoot: path.join(__dirname, './'),
  // Transpile packages that have issues
  transpilePackages: [
    '@rainbow-me/rainbowkit',
    '@walletconnect/universal-provider',
    '@walletconnect/ethereum-provider',
    '@wagmi/connectors',
  ],
  // Exclude problematic server-only packages from client bundle
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle server-only modules on client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    
    // Stub out problematic Web3 dependencies that cause warnings (both client and server)
    config.resolve.alias = {
      ...config.resolve.alias,
      // MetaMask SDK tries to import React Native packages on web
      '@react-native-async-storage/async-storage': emptyStub,
      // WalletConnect/pino tries to import optional pretty-printer
      'pino-pretty': emptyStub,
    };
    
    return config;
  },
}

module.exports = nextConfig

