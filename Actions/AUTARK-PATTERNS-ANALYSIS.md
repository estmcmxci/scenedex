# 🔍 Autark Source Code Analysis & Patterns

## Overview

After examining Autark's source code, here are the exact patterns we should follow for our implementation.

---

## 1. Safe Client Pattern (`lib/safe/client.js`)

### Key Implementation Details

```typescript
// What Autark does:
import { createSafeClient } from '@safe-global/sdk-starter-kit';

export async function initSafeClient(config) {
  const client = await createSafeClient({
    provider: config.rpcUrl,
    signer: config.signerPrivateKey,
    safeAddress: config.safeAddress,
    apiKey: config.apiKey,  // ← REQUIRED for mainnet
  });
  return client;
}
```

### What We Need for Catalogue

```typescript
// lib/services/safe.ts
import { createSafeClient } from '@safe-global/sdk-starter-kit';

const safeConfig = {
  provider: process.env.L1_RPC_URL,           // Mainnet RPC
  signer: process.env.CURATOR_SIGNER_KEY,     // Private key authorized to sign
  safeAddress: process.env.CURATOR_SAFE_ADDRESS,
  apiKey: process.env.SAFE_API_KEY            // From safe.global developer dashboard
};

export async function getSafeClient() {
  return await createSafeClient(safeConfig);
}
```

### Transaction Sending Pattern

```typescript
// Autark's pattern
export async function sendSafeTransaction(client, transaction) {
  const result = await client.send({
    transactions: [transaction],  // ← Array of transactions
  });
  
  return {
    safeTxHash: result?.transactions?.safeTxHash || result?.safeTxHash,
    success: true,
  };
}
```

**Key Points:**
- `client.send()` handles both immediate execution (threshold=1) and proposals (threshold>1)
- Returns `safeTxHash` for tracking in Safe UI
- We can batch multiple transactions in the array

### For Our Use Case

```typescript
// Send three ENS transactions together
const ensTxs = [
  { to: RESOLVER, value: '0', data: encodedSetContenthash },
  { to: RESOLVER, value: '0', data: encodedSetTextZora },
  { to: RESOLVER, value: '0', data: encodedSetTextMetadata }
];

const result = await client.send({ transactions: ensTxs });
```

---

## 2. IPFS Upload Pattern (`lib/ipfs/upload.js`)

### Key Implementation Details

```typescript
// Autark uses execSync to call Storacha CLI
import { execSync } from 'child_process';

export async function uploadToIPFS(directory) {
  // 1. Check if storacha CLI is installed
  execSync('which storacha', { stdio: 'pipe' });
  
  // 2. Execute upload command
  const output = execSync(`storacha up "${directory}"`, {
    encoding: 'utf-8',
    stdio: 'pipe',
  });
  
  // 3. Extract CID from output
  const match = output.match(/bafy[a-z0-9]+/i);
  const cid = match[0];  // e.g., "bafy2giqxp..."
  
  // 4. Return result
  return {
    cid,
    size: calculateSize(directory),
    url: `https://w3s.link/ipfs/${cid}`
  };
}
```

### Gateway URLs Pattern

```typescript
// Autark provides multiple gateways in priority order
export function getIPFSUrls(cid, ensDomain) {
  return [
    `https://w3s.link/ipfs/${cid}`,        // Storacha (fastest)
    `https://${ensDomain}.limo`,            // ENS gateway
    `https://${ensDomain}.link`,            // ENS gateway
    `https://ipfs.io/ipfs/${cid}`           // Public IPFS
  ];
}
```

### For Our Use Case

```typescript
// lib/services/ipfs.ts
import { execSync } from 'child_process';

export async function uploadReleaseToIPFS(releaseId) {
  const tempDir = `/tmp/release-${releaseId}`;
  
  // Storacha upload entire directory
  const output = execSync(`storacha up "${tempDir}"`, {
    encoding: 'utf-8',
    stdio: 'pipe',
  });
  
  const directoryHash = output.match(/bafy[a-z0-9]+/i)[0];
  
  // Extract individual file CIDs from directory
  // IPFS allows accessing files in a directory: hash/filename
  return {
    mediaIPFSHash: `${directoryHash}/audio.mp3`,
    coverIPFSHash: `${directoryHash}/cover.jpg`,
    metadataIPFSHash: `${directoryHash}/metadata.json`,
    directoryHash
  };
}
```

**Key Differences:**
- Autark uploads directories and returns one CID
- We need individual CIDs → use IPFS directory structure
- `bafy2...` CIDs are CIDv1 (content-addressed)

---

## 3. ENS Utilities Pattern (`lib/ens/ens.js`)

### Content Hash Encoding

```typescript
// Autark's approach:
import { CID } from 'multiformats/cid';
import { toHex } from 'ox/Bytes';
import * as varint from 'varint';

const IPFS_CODEC = 0xe3;  // Codec for IPFS

export function encodeContentHash(cid) {
  // 1. Parse CID to V1 format
  const bytes = CID.parse(cid).toV1().bytes;
  
  // 2. Add codec prefix
  const codeBytes = Uint8Array.from(varint.encode(IPFS_CODEC));
  
  // 3. Concatenate and encode to hex
  return toHex(concatUint8Arrays(codeBytes, bytes));
}
```

### setContenthash ABI

```typescript
export const setContentHash = {
  name: 'setContenthash',
  type: 'function',
  stateMutability: 'nonpayable',
  inputs: [
    { type: 'bytes32', name: 'node' },      // namehash of domain
    { type: 'bytes', name: 'contenthash' }  // encoded CID
  ],
  outputs: []
};
```

### Public Resolver Addresses

```typescript
export const PUBLIC_RESOLVER_ADDRESS = {
  mainnet: '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63',
  sepolia: '0x8FADE66B79cC9f707aB26799354482EB93a5B7dD',
  goerli: '0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750',
};
```

### For Our Use Case

```typescript
// lib/services/ens.ts
import { CID } from 'multiformats/cid';
import { toHex, namehash } from 'ox';
import * as varint from 'varint';

export function prepareENSTransactions(releaseId, metadataIPFSHash, tokenId) {
  const ensDomain = `pda-${releaseId}.palaupalau.eth`;
  const ensNode = namehash(ensDomain);
  const IPFS_CODEC = 0xe3;
  
  // 1. setContenthash transaction
  const contentHashEncoded = encodeContentHash(metadataIPFSHash);
  const setContenthashTx = {
    to: PUBLIC_RESOLVER_ADDRESS.mainnet,
    value: '0',
    data: encodeFunctionCall('setContenthash', [ensNode, contentHashEncoded])
  };
  
  // 2. setText('zoraNFT') transaction
  const setZoraTx = {
    to: PUBLIC_RESOLVER_ADDRESS.mainnet,
    value: '0',
    data: encodeFunctionCall('setText', [
      ensNode,
      'zoraNFT',
      `base:0xZoraAddress/${tokenId}`
    ])
  };
  
  // 3. setText('metadataURI') transaction
  const setMetadataTx = {
    to: PUBLIC_RESOLVER_ADDRESS.mainnet,
    value: '0',
    data: encodeFunctionCall('setText', [
      ensNode,
      'metadataURI',
      `ipfs://${metadataIPFSHash}`
    ])
  };
  
  return [setContenthashTx, setZoraTx, setMetadataTx];
}
```

---

## 4. Error Handling Pattern

### Autark's Approach

```typescript
// Custom error classes
class SafeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SafeError';
  }
}

// Usage with try-catch
try {
  await operation();
} catch (error) {
  if (error instanceof SafeError) {
    throw error;  // Re-throw custom error
  }
  throw new SafeError(`Operation failed: ${error.message}`);
}
```

### For Our Use Case

We already have `Result<T>` pattern. Extend it:

```typescript
// lib/services/safe.ts
export async function sendSafeTransaction(client, tx) {
  try {
    const result = await client.send({ transactions: [tx] });
    return {
      success: true,
      data: {
        safeTxHash: result.safeTxHash,
        txServiceUrl: getSafeTransactionUrl(...)
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Safe TX failed: ${error.message}`
    };
  }
}
```

---

## 5. Logging Pattern

### Autark Uses Spinner Logger

```typescript
const spinner = logger.spinner('Uploading to IPFS...');
spinner.start();
try {
  // ... operation ...
  spinner.succeed('Success message');
} catch (error) {
  spinner.fail();
  throw error;
}
```

### For Our Use Case

Use console logging for now:

```typescript
export async function uploadReleaseToIPFS(releaseId) {
  console.log(`📌 Uploading ${releaseId} to IPFS...`);
  
  try {
    const result = await executeUpload(...);
    console.log(`✅ Uploaded: ${result.cid}`);
    return result;
  } catch (error) {
    console.error(`❌ Upload failed: ${error.message}`);
    throw error;
  }
}
```

---

## 6. Dependencies We Need

Based on Autark's implementation:

```json
{
  "dependencies": {
    "@safe-global/sdk-starter-kit": "latest",
    "multiformats": "^12.0.0",
    "ox": "^0.1.0",
    "varint": "^6.0.0"
  }
}
```

Install these:
```bash
npm install @safe-global/sdk-starter-kit multiformats ox varint
```

---

## 7. Environment Variables Required

```bash
# Safe/Ethereum
L1_RPC_URL=https://ethereum-rpc.publicnode.com
CURATOR_SAFE_ADDRESS=0x...  # Deployed Safe on mainnet
CURATOR_SIGNER_KEY=0x...    # Private key with signer role on Safe
SAFE_API_KEY=...            # From safe.global developer dashboard

# IPFS/Storacha
STORACHA_TOKEN=...          # API token from storacha.com

# ENS
PALAUPALAU_ENS_DOMAIN=palaupalau.eth

# Factory Contract
FACTORY_ADDRESS=0x...       # Deployed Factory contract on L1
ZORA_ADDRESS=0x...          # Zora Creator on Base L2
```

---

## 8. Implementation Checklist for Days 6-9

### Days 6-7: IPFS Integration
- [ ] Install dependencies: `npm install @safe-global/sdk-starter-kit multiformats ox varint`
- [ ] Create `lib/services/ipfs.ts` following Autark pattern
- [ ] Implement `uploadToIPFS()` using `execSync('storacha up ...')`
- [ ] Test with sample files
- [ ] Verify CID extraction regex works

### Days 8-9: Safe + ENS Integration
- [ ] Create `lib/services/safe.ts` wrapping `createSafeClient()`
- [ ] Create `lib/services/ens.ts` with `encodeContentHash()` and transaction builders
- [ ] Create `lib/services/factory.ts` for Factory calls
- [ ] Create `lib/services/publishRelease.ts` orchestration
- [ ] Create `POST /api/internal/publish-release` route
- [ ] Test Safe TX creation on testnet

---

## Key Takeaways

1. **Safe SDK is straightforward** - Just wrap `createSafeClient()` and `client.send()`
2. **Storacha CLI is reliable** - Use `execSync()` to call it, extract CID from output
3. **ENS encoding is complex** - Use Autark's exact pattern with varint + CIDv1 conversion
4. **Error handling matters** - Custom error classes help debugging
5. **Batch transactions** - Safe can send multiple TXs at once

We can directly use most of Autark's implementation with minimal adaptation for our release workflow.

---

## Next Action

**Ready to start implementation!** Begin with Days 6-7 IPFS integration using these exact patterns.

