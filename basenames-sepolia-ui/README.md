# Basenames on Base Sepolia UI

A simple frontend for registering and querying basenames (basetest.eth subdomains) on Base Sepolia.

## Features

- ✅ **Register Basenames** - Register new basenames with address and text records
- ✅ **Query Basenames** - Query existing basenames to see their records
- ✅ **Check Availability** - Check if a basename is available before registering

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file (copy from `.env.local.example`):
```bash
cp .env.local.example .env.local
```

3. Fill in your environment variables:
- `NEXT_PUBLIC_BASE_RPC_URL` - Base Sepolia RPC endpoint
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - WalletConnect project ID (optional)
- Contract addresses (already set with defaults)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Connect Wallet** - Click the "Connect Wallet" button and connect to Base Sepolia
2. **Register** - Enter a basename, address to set, and optional description
3. **Query** - Enter a full basename (e.g., "mysubname.basetest.eth") to see its records
4. **Check Availability** - Enter a basename label to check if it's available

## Contract Addresses (Base Sepolia)

- Registry: `0x1493b2567056c2181630115660963E13A8E32735`
- BaseRegistrar: `0xa0c70ec36c010b55e3c434d6c6ebeec50c705794`
- RegistrarController: `0x49ae3cc2e3aa768b1e5654f5d3c6002144a59581`
- Resolver: `0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA`
- ReverseRegistrar: `0x876eF94ce0773052a2f81921E70FF25a5e76841f`

## Notes

- Registration requires payment (varies by name length)
- Reverse records (Primary Name) require authorization and may fail if the caller is not authorized for the target address
- All operations are on Base Sepolia testnet

