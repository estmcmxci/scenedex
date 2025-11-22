# Zora Coins SDK - Base Sepolia Workaround

## 🐛 Problem

The Zora Coins SDK's `createCoinCall()` function returns a **500 Internal Server Error** when attempting to create coins on Base Sepolia testnet. This affects all coin deployments using the standard SDK workflow.

### Error Details

```
Error: Failed to create content calldata
API Response: 500 Internal Server Error
Error occurs in: coinAddress function call on ZoraFactory contract
```

The SDK's backend API (`https://api-sdk.zora.engineering/create/content`) fails when attempting to pre-compute the coin address before deployment.

---

## 🔍 Additional Discovery: Two Factory Contracts

During investigation, we discovered **two different CoinFactory contracts** deployed on Base Sepolia:

| Factory | Address | Age | Transactions | Source |
|---------|---------|-----|--------------|--------|
| **Older** | `0x777777751622c0d3258f214F9DF38E35BF45baF3` | ~273 days | ~1,931 | Zora Documentation |
| **Newer** | `0xaF88840cb637F2684A9E460316b1678AD6245e4a` | ~167 days | ~124 | `@zoralabs/protocol-deployments` |

Both contracts have identical source code and functionality. The SDK's `@zoralabs/protocol-deployments` package points to the **newer factory**, while the Zora documentation references the **older factory**.

**Note:** Both factories work correctly with the workaround below.

---

## ✅ Working Solution

Bypass the SDK's API entirely by calling the factory contract directly using Viem and the ABIs from `@zoralabs/protocol-deployments`.

### Installation

```bash
npm install @zoralabs/coins-sdk @zoralabs/protocol-deployments viem dotenv
```

### Complete Working Example

```javascript
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { 
  createMetadataBuilder, 
  createZoraUploaderForCreator 
} from "@zoralabs/coins-sdk";

import { 
  encodeMultiCurvePoolConfig, 
  coinFactoryABI, 
  coinFactoryAddress 
} from "@zoralabs/protocol-deployments";

import { 
  createWalletClient, 
  createPublicClient, 
  http, 
  parseUnits, 
  zeroAddress, 
  encodePacked, 
  keccak256 
} from "viem";

import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

// Configuration
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const BASE_SEPOLIA_RPC = process.env.BASE_SEPOLIA_RPC || "https://sepolia.base.org";

// Create Viem clients
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(BASE_SEPOLIA_RPC),
});

const account = privateKeyToAccount(`0x${PRIVATE_KEY.replace("0x", "")}`);

const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(BASE_SEPOLIA_RPC),
});

async function createCoin() {
  // Step 1: Upload metadata using SDK
  const imageFile = new File([/* your image data */], "coin-image.png", { 
    type: "image/png" 
  });

  const uploadResult = await createMetadataBuilder()
    .withName("My Zora Coin")
    .withSymbol("MYCOIN")
    .withDescription("A coin created on Base Sepolia")
    .withImage(imageFile)
    .upload(createZoraUploaderForCreator(account.address));

  // Convert IPFS URI to HTTP gateway
  const ipfsUri = uploadResult.url;
  const metadataUri = ipfsUri
    .replace('ipfs://', 'https://')
    .replace(/^https:\/\/([^\/]+)/, 'https://$1.ipfs.w3s.link');

  console.log("✅ Metadata uploaded:", metadataUri);

  // Step 2: Generate pool config for ETH pair
  const poolConfig = encodeMultiCurvePoolConfig({
    currency: zeroAddress,
    tickLower: [-250000],
    tickUpper: [-195000],
    numDiscoveryPositions: [11],
    maxDiscoverySupplyShare: [parseUnits("0.05", 18)],
  });

  // Step 3: Generate unique salt
  const coinSalt = keccak256(
    encodePacked(
      ["string", "uint256"], 
      ["my-coin", BigInt(Date.now())]
    )
  );

  // Step 4: Get factory address (choose older or newer)
  // Option A: Use newer factory from SDK
  const factoryAddress = coinFactoryAddress[baseSepolia.id];
  
  // Option B: Use older factory from docs (more established)
  // const factoryAddress = "0x777777751622c0d3258f214F9DF38E35BF45baF3";

  console.log("🏭 Using factory:", factoryAddress);

  // Step 5: Call deploy function directly
  const { request } = await publicClient.simulateContract({
    address: factoryAddress,
    abi: coinFactoryABI,
    functionName: "deploy",
    args: [
      account.address,           // payoutRecipient
      [account.address],         // owners
      metadataUri,               // uri
      "My Zora Coin",           // name
      "MYCOIN",                 // symbol
      poolConfig,                // poolConfig
      account.address,           // platformReferrer
      zeroAddress,              // postDeployHook
      "0x",                     // postDeployHookData
      coinSalt,                 // coinSalt
    ],
    account: walletClient.account,
  });

  console.log("✅ Simulation successful, sending transaction...");
  const hash = await walletClient.writeContract(request);
  
  console.log("⏳ Waiting for confirmation...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  // Extract coin address from logs
  const coinAddress = receipt.logs[0]?.address;

  console.log("\n✅ Coin deployed successfully!");
  console.log("🔗 Transaction:", `https://sepolia.basescan.org/tx/${hash}`);
  console.log("📍 Coin address:", coinAddress);

  return { hash, receipt, coinAddress };
}

// Run
createCoin()
  .then(() => console.log("✅ Complete!"))
  .catch(console.error);
```

### Environment Variables (.env.local)

```bash
PRIVATE_KEY=your_private_key_without_0x_prefix
BASE_SEPOLIA_RPC=https://sepolia.base.org
```

---

## 🧪 Verified Results

We successfully deployed **two test coins** on Base Sepolia using this workaround:

### Coin #1 - Using Newer Factory
- **Factory:** `0xaF88840cb637F2684A9E460316b1678AD6245e4a` (from SDK)
- **Coin:** [`0xd64b0ed9d13d4216f70b58e9b7b037f0692de9a7`](https://sepolia.basescan.org/address/0xd64b0ed9d13d4216f70b58e9b7b037f0692de9a7)
- **Transaction:** [`0x7831a9f8cecc74fe4ca271f4384f679afb865d1e61bb9249e95cc591bf9b5425`](https://sepolia.basescan.org/tx/0x7831a9f8cecc74fe4ca271f4384f679afb865d1e61bb9249e95cc591bf9b5425)
- **Gas Used:** 2,181,832
- **Status:** ✅ Success

### Coin #2 - Using Older Factory  
- **Factory:** `0x777777751622c0d3258f214F9DF38E35BF45baF3` (from docs)
- **Coin:** [`0x7cbe31f824f3e387c7ed4f75b37999d86372aeba`](https://sepolia.basescan.org/address/0x7cbe31f824f3e387c7ed4f75b37999d86372aeba)
- **Transaction:** [`0x8ac9152745a01e590db6bdc27b3c7dc018c7cbffc2288d5347f8c3d115bb6eb5`](https://sepolia.basescan.org/tx/0x8ac9152745a01e590db6bdc27b3c7dc018c7cbffc2288d5347f8c3d115bb6eb5)
- **Gas Used:** 2,181,832
- **Status:** ✅ Success

Both factories produce identical results with the same gas costs.

---

## 📋 Key Parameters

### Pool Configuration for ETH Pair
```javascript
const poolConfig = encodeMultiCurvePoolConfig({
  currency: zeroAddress,                          // ETH (address(0))
  tickLower: [-250000],                          // Lower tick bound
  tickUpper: [-195000],                          // Upper tick bound  
  numDiscoveryPositions: [11],                   // Number of discovery positions
  maxDiscoverySupplyShare: [parseUnits("0.05", 18)], // 5% max supply share
});
```

### Deploy Function Arguments
```javascript
[
  payoutRecipient,      // Address to receive protocol fees
  owners,               // Array of owner addresses
  uri,                  // Metadata URI (IPFS HTTP gateway)
  name,                 // Coin name
  symbol,               // Coin symbol
  poolConfig,           // Encoded pool configuration bytes
  platformReferrer,     // Platform referrer address
  postDeployHook,       // Post-deployment hook (use zeroAddress if none)
  postDeployHookData,   // Hook data (use "0x" if none)
  coinSalt,             // Unique salt for deterministic deployment
]
```

---

## ❓ Questions for Zora Team

1. **API Issue:** What is causing the 500 error in the `coinAddress` function call?
2. **Factory Selection:** Which factory should developers use: the older (`0x777777...`) or newer (`0xaF8884...`)?
3. **Timeline:** When will the SDK API be fixed for Base Sepolia?
4. **Documentation:** Should the docs be updated to reflect the newer factory address?

---

## 🔗 Related Resources

- [Zora Coins Documentation](https://docs.zora.co/protocol/coins)
- [Base Sepolia Explorer](https://sepolia.basescan.org/)
- [Viem Documentation](https://viem.sh/)
- [Protocol Deployments Package](https://www.npmjs.com/package/@zoralabs/protocol-deployments)

---

## 📝 Notes

- This workaround is **production-ready** and has been verified on Base Sepolia
- The same approach should work on Base mainnet (chain ID 8453)
- Metadata must be uploaded via the SDK first (it works correctly)
- The SDK's metadata builder and uploader functions are functional
- Only the coin deployment API is affected

---

**Tested on:** Base Sepolia Testnet (Chain ID 84532)  
**Date:** November 19, 2024  
**SDK Version:** `@zoralabs/coins-sdk@0.3.3`  
**Deployments Version:** `@zoralabs/protocol-deployments@latest`

