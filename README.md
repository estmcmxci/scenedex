# scenedex

A decentralized music catalog platform that enables artists to submit releases for curator approval via Safe multisig, which are then published to IPFS, minted as Zora creator coins on Base, and registered on ENS.

## Overview

scenedex is a Factory Records–style curation protocol where:
1. **Artists submit** releases with audio files and metadata
2. **Curators approve** via Safe multisig (threshold-based governance)
3. **System publishes** to on-chain infrastructure:
   - IPFS (immutable storage for audio, cover art, metadata)
   - Zora Creator Coins (ERC20 on Base Sepolia)
   - 0xSplits (50/50 revenue split: artist/curator)
   - ENS subnames (`ARES001.scenedex.eth`) with full metadata

Each release becomes a permanent, queryable on-chain record with complete provenance.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL
- **Blockchain**: 
  - Base Sepolia (L2) - Zora coins, Splits contracts
  - Ethereum Sepolia (L1) - ENS registration
- **Storage**: IPFS via Storacha CLI
- **Wallet Integration**: Wagmi, RainbowKit
- **Multisig**: Safe Protocol (Gnosis Safe)

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Storacha CLI installed (`npm install -g storacha`)
- WalletConnect Project ID ([get one here](https://cloud.walletconnect.com))

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your configuration
# Required variables:
# - DATABASE_URL
# - BASE_RPC_URL
# - CURATOR_PRIVATE_KEY
# - SAFE_ADDRESS
# - ZORA_COIN_FACTORY_ADDRESS
# - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
# - ENS_DOMAIN and ENS contract addresses

# Run database migrations (if any)
npm run db:migrate

# Start development server
npm run dev
```

### Environment Variables

See `.env.example` for all required and optional environment variables. Key requirements:

- **DATABASE_URL**: PostgreSQL connection string
- **BASE_RPC_URL**: Base Sepolia RPC endpoint
- **CURATOR_PRIVATE_KEY**: Private key for coordinator (must be Safe owner)
- **SAFE_ADDRESS**: Safe multisig address for curator governance
- **ENS_DOMAIN**: Parent ENS domain (e.g., `scenedex.eth`)
- **ZORA_COIN_FACTORY_ADDRESS**: Zora factory contract address

## Project Structure

```
app/
  ├── api/              # Next.js API routes
  │   ├── approve/      # Curator approval endpoint
  │   ├── releases/     # Release management
  │   └── submit/       # Artist submission
  ├── components/       # React components
  ├── curator/          # Curator dashboard
  └── releases/         # Public release pages

lib/
  ├── db/               # Database utilities & migrations
  ├── services/         # Core services
  │   ├── ens.ts        # ENS subname registration
  │   ├── ipfs.ts       # IPFS pinning
  │   ├── jobs.ts       # Background job processing
  │   ├── safe.ts       # Safe multisig verification
  │   ├── splits.ts     # 0xSplits contract deployment
  │   └── zora.ts       # Zora coin creation
  └── validation.ts     # Zod schemas

public/                 # Static assets
```

## Core Flow

1. **Submission**: Artist submits release → stored in database as `pending`
2. **Approval**: Curators sign EIP-191 messages → stored in `approvals` table
3. **Threshold Met**: When approval count ≥ Safe threshold → ready for publishing
4. **Publishing**: Background job creates:
   - IPFS pins (audio, cover, metadata JSON)
   - Split contract (50/50 revenue distribution)
   - Zora creator coin (ERC20)
   - ENS subname with 11 text records
5. **Complete**: Release status → `published`, queryable via ENS

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system architecture, data flows, and component documentation.

## Development

```bash
# Type checking
npm run type-check

# Run tests
npm test

# Lint
npm run lint

# Build for production
npm run build
```

## Future Enhancements

### Zora Contract Interaction
The next iteration should include enhanced Zora contract interaction capabilities:
- **Direct minting interface**: Allow users to mint Zora creator coins directly from the frontend
- **Market data integration**: Display real-time Zora coin prices, trading volume, and market data
- **Token management**: Enable holders to transfer, burn, or interact with their Zora tokens
- **Secondary market features**: Integration with Zora's marketplace for token trading
- **Analytics dashboard**: Track coin performance, holder statistics, and trading activity

## License

[Add your license here]

