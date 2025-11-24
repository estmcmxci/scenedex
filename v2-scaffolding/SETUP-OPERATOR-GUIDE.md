# Setup Operator Guide: Set Safe as Operator for scenius.basetest.eth

## Overview
This one-time setup authorizes the Safe to create subnames under `scenius.basetest.eth` on behalf of the curator.

## Prerequisites
- `CURATOR_PRIVATE_KEY` set in `.env.local`
- `SAFE_ADDRESS` set in `.env.local`
- `BASE_RPC_URL` set in `.env.local`
- Curator wallet has ETH on Base Sepolia for gas

## Quick Setup (Automated)

Simply run:
```bash
npx tsx lib/services/setup-operator.ts
```

The script will:
1. ✅ Check if Safe is already authorized (skip if already done)
2. ✅ Send `setApprovalForAll(Safe, true)` transaction
3. ✅ Wait for confirmation
4. ✅ Verify it worked

## What It Does

- **Function**: `setApprovalForAll(address operator, bool approved)`
- **Effect**: Authorizes Safe to operate on ALL names owned by curator
- **Contract**: Registry at `0x1493b2567056c2181630115660963E13A8E32735` (Base Sepolia)
- **Gas**: ~45,000 gas (estimate)

## Manual Alternative

If you prefer manual setup via BaseScan:
1. Go to: https://sepolia.basescan.org/address/0x1493b2567056c2181630115660963E13A8E32735#writeContract
2. Connect curator wallet
3. Find `setApprovalForAll` function
4. Enter: `operator` = Safe address, `approved` = `true`
5. Click "Write" and confirm

