# Zora SDK Debugging Session - Day 9

## Session Goal
Integrate Zora Coins SDK to create ERC20 coins for each music release on Base Sepolia testnet.

## What We Learned Today

### Understanding Calldata
**Calldata** = ABI-encoded transaction data sent to smart contracts
- Not raw parameters - must be encoded using ABI encoding
- Deterministic & verifiable format
- Part of blockchain transaction history
- **SDK docs claim they accept plain IPFS URIs, but they actually DON'T**

### Key Discoveries About Zora SDK

#### ✅ What Works
1. **Account Setup** - Using `privateKeyToAccount(privateKey)` from `viem/accounts` creates valid signers
2. **Gateway URLs** - SDK requires HTTP gateway URLs in format: `https://{cid}.ipfs.w3s.link/{releaseId}-{filename}`
3. **Parameter Structure** - All coin parameters are correctly formatted:
   ```typescript
   {
     creator: Address,
     name: string,
     symbol: string,
     metadata: {
       type: 'RAW_URI',
       uri: string // Must be HTTP gateway URL, not ipfs://
     },
     currency: 'ETH',
     chainId: 84532, // Base Sepolia
     payoutRecipientOverride: Address,
     startingMarketCap: 'LOW'
   }
   ```

#### ❌ Current Blocker
**Error**: `Failed to create content calldata`
- Happens at: `createCoinCall()` line 103 in `@zoralabs/coins-sdk/src/actions/createCoin.ts`
- SDK trying to encode transaction but failing
- NOT a parameter validation issue (those were fixed)
- **Likely SDK bug or missing configuration**

### Exact Error Stack
```
Error: Failed to create content calldata
    at createCoinCall (/Users/oakgroup/Desktop/catalogue/node_modules/@zoralabs/coins-sdk/src/actions/createCoin.ts:103:56)
    at createCoin (/Users/oakgroup/Desktop/catalogue/node_modules/@zoralabs/coins-sdk/src/actions/createCoin.ts:149:44)
```

## All Fixes Applied Today

1. ✅ **Fixed wallet client signing**
   - Import: `import { privateKeyToAccount } from 'viem/accounts'`
   - Create account before passing to walletClient
   - Old: `account: curatorAddress as Hex` ❌
   - New: `account: privateKeyToAccount(privateKey as Hex)` ✅

2. ✅ **Fixed function call signature**
   - Old: `createCoin(coinParams, walletClient, publicClient, options)` ❌
   - New: `createCoin({ call: coinParams, walletClient, publicClient, options })` ✅

3. ✅ **Added metadata structure**
   - Must include `type: 'RAW_URI'` and `uri` fields
   - URI must be HTTP gateway URL, not plain `ipfs://`

4. ✅ **Used proper gateway URL format**
   - Format: `https://{cid}.ipfs.w3s.link/{releaseId}-{filename}`
   - Example: `https://bafybeicwoujaovlzjtrftgiqtz2xazpybun4berjnukzs5fvx5qzjaaham.ipfs.w3s.link/BETA-1763509047994-metadata.json`

5. ✅ **Added explicit chainId**
   - `chainId: baseSepolia.id` (84532)
   - Helps SDK know what network to target

6. ✅ **Reinstalled SDK**
   - `rm -rf node_modules/@zoralabs && npm install @zoralabs/coins-sdk@latest`
   - Current version: 0.3.3 (no newer version available)

## Files Modified
- `/Users/oakgroup/Desktop/catalogue/lib/services/zora.ts` - Main coin creation service
- All linting issues resolved ✅

## Test File Reference
- `/Users/oakgroup/Desktop/catalogue/lib/services/test-zora-e2e-smoke.ts`
- Full e2e flow: IPFS → Metadata → Database → Splits → Zora Coins

## Tomorrow's Plan: Standalone SDK Testing

### Objective
Test Zora SDK **in isolation** without the project context to:
1. Verify the SDK itself works properly
2. Try different parameter combinations
3. Check for environment/configuration issues

### Steps

**1. Create a new standalone test directory**
```bash
mkdir /tmp/zora-sdk-test
cd /tmp/zora-sdk-test
npm init -y
npm install viem @zoralabs/coins-sdk dotenv
```

**2. Test minimal coin creation**
```typescript
// minimal-test.ts
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import { createCoin, CreateConstants } from '@zoralabs/coins-sdk';
import dotenv from 'dotenv';

dotenv.config({ path: '/Users/oakgroup/Desktop/catalogue/.env.local' });

async function test() {
  const account = privateKeyToAccount(process.env.CURATOR_PRIVATE_KEY as `0x${string}`);
  
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.BASE_RPC_URL),
  });

  const walletClient = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(process.env.BASE_RPC_URL),
  });

  const result = await createCoin({
    call: {
      creator: account.address,
      name: 'Test Coin',
      symbol: 'TEST',
      metadata: {
        type: 'RAW_URI',
        uri: 'https://example.com/metadata.json', // Start simple
      },
      currency: CreateConstants.ContentCoinCurrencies.ETH,
      chainId: baseSepolia.id,
      payoutRecipientOverride: account.address,
      startingMarketCap: CreateConstants.StartingMarketCaps.LOW,
    },
    walletClient,
    publicClient,
    options: { gasMultiplier: 120 },
  });

  console.log('Success:', result);
}

test().catch(console.error);
```

**3. Progressive testing**
- Test 1: Simple HTTP metadata URL
- Test 2: IPFS gateway URL with proper format
- Test 3: Add payoutRecipientOverride
- Test 4: Try different currency types
- Test 5: Try without skipMetadataValidation flag
- Test 6: Check SDK version and dependencies

**4. Things to investigate**
- [ ] Check if there are SDK environment variables needed
- [ ] Look at SDK source code for line 103 of createCoin.ts to understand failure point
- [ ] Check Zora Labs GitHub issues for similar reports
- [ ] Try `@zoralabs/coins-sdk@next` prerelease if available
- [ ] Check if viem version compatibility issue
- [ ] Verify gas estimation works properly

## Useful Commands for Tomorrow

```bash
# Run standalone test
cd /tmp/zora-sdk-test && npx tsx minimal-test.ts

# Check SDK version and info
npm info @zoralabs/coins-sdk

# Look for prerelease versions
npm view @zoralabs/coins-sdk versions

# Check SDK source at error point
cat node_modules/@zoralabs/coins-sdk/src/actions/createCoin.ts | grep -A 20 -B 5 "Failed to create content calldata"

# Monitor our implementation
cd /Users/oakgroup/Desktop/catalogue && npx tsx lib/services/test-zora-e2e-smoke.ts

# View current zora.ts
cat /Users/oakgroup/Desktop/catalogue/lib/services/zora.ts
```

## Current zora.ts Implementation Status

**Location**: `/Users/oakgroup/Desktop/catalogue/lib/services/zora.ts`

**Function**: `createCoinForRelease(releaseId, splitAddress, metadataURI, title, description?, metadataFilename?)`

**Key sections**:
- Lines 44-49: Wallet client setup with privateKeyToAccount ✅
- Lines 121-126: Gateway URL conversion ✅
- Lines 128-141: Coin parameters structure ✅
- Lines 157-165: SDK call format ✅

**Blocking point**: Line 157-165 SDK call throws "Failed to create content calldata"

## Metadata Format Being Sent

Example metadata JSON on IPFS:
```json
{
  "name": "Post-Rational Anthem",
  "description": "m580 - Album",
  "image": "ipfs://...",
  "animation_url": "ipfs://...",
  "content": {
    "mime": "audio/mpeg",
    "uri": "ipfs://..."
  },
  "properties": {
    "catalogueId": "BETA-1763509047994",
    "duration": 253,
    "artist": "m580",
    "codec": "MPEG 1 Layer 3"
  }
}
```

Gateway URL format: `https://bafybeicwoujaovlzjtrftgiqtz2xazpybun4berjnukzs5fvx5qzjaaham.ipfs.w3s.link/BETA-1763509047994-metadata.json`

## Session Notes
- Started: Day 9
- Focus: Understanding & debugging Zora SDK integration
- Result: Identified SDK-level issue, not our implementation
- Decision: Test SDK in isolation tomorrow before continuing integration
- Repository: `/Users/oakgroup/Desktop/catalogue`

