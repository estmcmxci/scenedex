### Basic Zora Coin Creation with SDK

Source: https://docs.zora.co/coins/sdk/create-coin

This example demonstrates the fundamental process of creating a new coin using the Zora Coins SDK. It illustrates how to set up `viem` wallet and public clients, define the necessary coin parameters, and execute the `createCoin` function, including error handling and logging of transaction details.

```typescript
import { createCoin, DeployCurrency } from "@zoralabs/coins-sdk";
import { Hex, createWalletClient, createPublicClient, http, Address } from "viem";
import { base } from "viem/chains";

// Set up viem clients
const publicClient = createPublicClient({
  chain: base,
  transport: http("<RPC_URL>"),
});

const walletClient = createWalletClient({
  account: "0x<YOUR_ACCOUNT>" as Hex,
  chain: base,
  transport: http("<RPC_URL>"),
});

// Define coin parameters
const coinParams = {
  name: "My Awesome Coin",
  symbol: "MAC",
  uri: "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy",
  payoutRecipient: "0xYourAddress" as Address,
  platformReferrer: "0xOptionalPlatformReferrerAddress" as Address, // Optional
  chainId: base.id, // Optional: defaults to base.id
  currency: DeployCurrency.ZORA, // Optional: ZORA or ETH
};

// Create the coin
async function createMyCoin() {
  try {
    const result = await createCoin(coinParams, walletClient, publicClient, {
      gasMultiplier: 120, // Optional: Add 20% buffer to gas (defaults to 100%)
      // account: customAccount, // Optional: Override the wallet client account
    });

    console.log("Transaction hash:", result.hash);
    console.log("Coin address:", result.address);
    console.log("Deployment details:", result.deployment);

    return result;
  } catch (error) {
    console.error("Error creating coin:", error);
    throw error;
  }
}
```

--------------------------------

### JavaScript Example for Zora API Pagination

Source: https://docs.zora.co/coins/sdk/queries/explore

Illustrates how to implement pagination to fetch all results from a Zora explore query. This asynchronous function uses `@zoralabs/coins-sdk`'s `getCoinsTopGainers` to repeatedly fetch pages until no more `cursor` is available, accumulating all data into a single array.

```javascript
import { getCoinsTopGainers } from "@zoralabs/coins-sdk";

async function fetchAllTopGainers() {
  let allCoins: any[] = [];
  let cursor = undefined;
  const pageSize = 20;

  // Continue fetching until no more pages
  do {
    const response = await getCoinsTopGainers({
      count: pageSize,
      after: cursor,
    });

    // Add coins to our collection
    if (response.data?.exploreList && response.data?.exploreList?.edges?.length || 0 > 0) {
      allCoins = [...allCoins, ...(response.data?.exploreList?.edges?.map((edge: any) => edge.node) || [])];
    }

    // Update cursor for next page
    cursor = response.data?.exploreList?.pageInfo?.endCursor;

    // Break if no more results
    if (!cursor || response.data?.exploreList?.edges?.length === 0) {
      break;
    }

  } while (true);

  console.log(`Fetched ${allCoins.length} total top gaining coins`);
  return allCoins;
}
```

--------------------------------

### Install viem peer dependency via npm

Source: https://docs.zora.co/coins/sdk

This command installs `viem`, a required peer dependency for the Zora Coins SDK. It is essential for enabling on-chain write operations within your application.

```npm
npm install viem
```

--------------------------------

### Install Zora Coins SDK via npm

Source: https://docs.zora.co/coins/sdk

This command installs the main Zora Coins SDK package from NPM, enabling client and server-side JavaScript/TypeScript development for managing Zora coins.

```npm
npm install @zoralabs/coins-sdk
```

--------------------------------

### Fetch Onchain Coin Details using ZORA Coins SDK

Source: https://docs.zora.co/coins/sdk/queries/onchain

This JavaScript example demonstrates how to use the `getOnchainCoinDetails` function from `@zoralabs/coins-sdk` to retrieve detailed information about a coin directly from the blockchain. It sets up a `viem` public client and shows how to call the function with a coin address and an optional user address to get their balance, then logs various details like market cap, liquidity, and owner information.

```JavaScript
import { getOnchainCoinDetails } from "@zoralabs/coins-sdk";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

// Set up viem public client
const publicClient = createPublicClient({
  chain: base,
  transport: http("<RPC_URL>"),
});

async function fetchCoinDetails() {
  const details = await getOnchainCoinDetails({
    coin: "0xCoinContractAddress",
    user: "0xOptionalUserAddress", // Optional: to get user's balance
    publicClient,
  });

  console.log("Coin market cap:", details.marketCap);
  console.log("Coin liquidity:", details.liquidity);
  console.log("Coin pool address:", details.pool);
  console.log("Coin owners:", details.owners);
  console.log("Payout recipient:", details.payoutRecipient);

  if (details.balance) {
    console.log("User balance:", details.balance);
  }

  return details;
}
```

--------------------------------

### Fetch Newly Created Coins using Zora Coins SDK

Source: https://docs.zora.co/coins/sdk/queries/explore

This example illustrates the usage of the `getCoinsNew` function from `@zoralabs/coins-sdk` to fetch recently created coins. It demonstrates how to paginate results using `count` and `after`, and how to format and display details like creation date, creator address, and market cap for each coin.

```typescript
import { getCoinsNew } from "@zoralabs/coins-sdk";

async function fetchNewCoins() {
  const response = await getCoinsNew({
    count: 10,        // Optional: number of coins per page
    after: undefined, // Optional: for pagination
  });

  console.log(`New Coins (${response.data?.exploreList?.edges?.length || 0} coins):`);

  response.data?.exploreList?.edges?.forEach((coin: any, index: number) => {
    // Format the creation date for better readability
    const creationDate = new Date(coin.node.createdAt || "");
    const formattedDate = creationDate.toLocaleString();

    console.log(`${index + 1}. ${coin.node.name} (${coin.node.symbol})`);
    console.log(`   Created: ${formattedDate}`);
    console.log(`   Creator: ${coin.node.creatorAddress}`);
    console.log(`   Market Cap: ${coin.node.marketCap}`);
    console.log('-----------------------------------');
  });

  // For pagination
  if (response.data?.exploreList?.pageInfo?.endCursor) {
    console.log("Next page cursor:", response.data?.exploreList?.pageInfo?.endCursor);
  }

  return response;
}
```

--------------------------------

### Execute Basic Coin Buy with Zora Coins SDK

Source: https://docs.zora.co/coins/sdk/trade-coin

This example demonstrates how to perform a basic coin purchase using the Zora Coins SDK. It sets up Viem public and wallet clients, defines the necessary buy parameters including recipient and order size, and then executes the `tradeCoin` function, logging the transaction hash and trade details.

```typescript
import { tradeCoin } from "@zoralabs/coins-sdk";
import { Address, createWalletClient, createPublicClient, http, parseEther, Hex } from "viem";
import { base } from "viem/chains";

// Set up viem clients
const publicClient = createPublicClient({
  chain: base,
  transport: http("<RPC_URL>"),
});

const walletClient = createWalletClient({
  account: "0x<YOUR_ACCOUNT>" as Hex,
  chain: base,
  transport: http("<RPC_URL>"),
});

// Define buy parameters
const buyParams = {
  direction: "buy" as const,
  target: "0xCoinContractAddress" as Address,
  args: {
    recipient: "0xYourAddress" as Address, // Where to receive the purchased coins
    orderSize: parseEther("0.1"), // Amount of ETH to spend
    minAmountOut: 0n, // Minimum amount of coins to receive (0 = no minimum)
    tradeReferrer: "0xOptionalReferrerAddress" as Address, // Optional
  }
};

// Execute the buy
async function buyCoin() {
  const result = await tradeCoin(buyParams, walletClient, publicClient);

  console.log("Transaction hash:", result.hash);
  console.log("Trade details:", result.trade);

  return result;
}
```

--------------------------------

### Simulate Coin Buy with Zora Coins SDK

Source: https://docs.zora.co/coins/sdk/trade-coin

This example shows how to simulate a coin purchase using the Zora Coins SDK's `simulateBuy` function. It sets up a Viem public client and then calls `simulateBuy` with the target coin address and requested order size, logging the expected order size and amount out before an actual transaction.

```typescript
import { simulateBuy } from "@zoralabs/coins-sdk";
import { Address, parseEther, createPublicClient, http } from "viem";
import { base } from "viem/chains";

// Set up viem clients
const publicClient = createPublicClient({
  chain: base,
  transport: http("<RPC_URL>"),
});

async function simulateCoinBuy() {
  const simulation = await simulateBuy({
    target: "0xCoinContractAddress" as Address,
    requestedOrderSize: parseEther("0.1"),
    publicClient,
  });

  console.log("Order size", simulation.orderSize);
  console.log("Amount out", simulation.amountOut);

  return simulation;
}
```

--------------------------------

### Paginate All Coin Comments using Zora Coins SDK

Source: https://docs.zora.co/coins/sdk/queries/coin

Provides an example of how to fetch all comments for a given coin address by continuously paginating through results using the `getCoinComments` function. It demonstrates a `do-while` loop that fetches pages until no more comments are available, accumulating all comments into a single array.

```TypeScript
import { getCoinComments, GetCoinCommentsResponse } from "@zoralabs/coins-sdk";

export async function fetchAllCoinComments(coinAddress: string) {
  let allComments: NonNullable<
    NonNullable<
      NonNullable<GetCoinCommentsResponse["zora20Token"]>["zoraComments"]
    >["edges"]
  > = [];
  let cursor = undefined;
  const pageSize = 20;

  // Continue fetching until no more pages
  do {
    const response = await getCoinComments({
      address: coinAddress,
      count: pageSize,
      after: cursor,
    });

    // Add comments to our collection
    if (
      response.data?.zora20Token?.zoraComments?.edges &&
      response.data?.zora20Token?.zoraComments?.edges.length > 0
    ) {
      allComments = [
        ...allComments,
        ...response.data?.zora20Token?.zoraComments?.edges,
      ];
    }

    // Update cursor for next page
    cursor = response.data?.zora20Token?.zoraComments?.pageInfo?.endCursor;

    // Break if no more results
    if (
      !cursor ||
      response.data?.zora20Token?.zoraComments?.edges?.length === 0
    ) {
      break;
    }
  } while (true);

  console.log(`Fetched ${allComments.length} total comments`);
  return allComments;
}
```

--------------------------------

### Integrate Zora Coins SDK in Node.js Backend Service

Source: https://docs.zora.co/coins/sdk/queries/onchain

This example illustrates how to use `getOnchainCoinDetails` within a Node.js backend service. It shows a simple asynchronous function to retrieve a coin's market capitalization, suitable for scenarios where direct API key management is undesirable.

```javascript
// In a Node.js backend service
async function getCoinMarketCap(coinAddress) {
  const details = await getOnchainCoinDetails({
    coin: coinAddress,
    publicClient,
  });

  return details.marketCap;
}
```

--------------------------------

### Fetch Top Volume Coins (JavaScript)

Source: https://docs.zora.co/coins/sdk/queries/explore

This asynchronous function illustrates how to utilize the 'getCoinsTopVolume24h' method from the Zora Coins SDK. It fetches and displays coins with the highest trading volume over the past 24 hours, providing details such as volume, market cap, and unique holders. The example also includes basic pagination handling.

```JavaScript
import { getCoinsTopVolume24h } from "@zoralabs/coins-sdk";

async function fetchTopVolumeCoins() {
  const response = await getCoinsTopVolume24h({
    count: 10,        // Optional: number of coins per page
    after: undefined, // Optional: for pagination
  });

  const tokens = response.data?.exploreList?.edges?.map((edge: any) => edge.node);

  console.log(`Top Volume Coins (${tokens?.length || 0} coins):`);

  tokens?.forEach((coin: any, index: number) => {
    console.log(`${index + 1}. ${coin.name} (${coin.symbol})`);
    console.log(`   Volume 24h: ${coin.volume24h}`);
    console.log(`   Market Cap: ${coin.marketCap}`);
    console.log(`   Holders: ${coin.uniqueHolders}`);
    console.log('-----------------------------------');
  });

  // For pagination
  if (response.data?.exploreList?.pageInfo?.endCursor) {
    console.log("Next page cursor:", response.data?.exploreList?.pageInfo?.endCursor);
  }

  return response;
}
```

--------------------------------

### Fetch Top Gaining Coins (JavaScript)

Source: https://docs.zora.co/coins/sdk/queries/explore

This asynchronous function demonstrates how to use the 'getCoinsTopGainers' method from the Zora Coins SDK. It retrieves and logs coins that have shown the most significant market cap increase over the last 24 hours, including details like 24h change, market cap, and volume. The example also illustrates how to handle pagination.

```JavaScript
import { getCoinsTopGainers } from "@zoralabs/coins-sdk";

async function fetchTopGainers() {
  const response = await getCoinsTopGainers({
    count: 10,        // Optional: number of coins per page
    after: undefined, // Optional: for pagination
  });

  const tokens = response.data?.exploreList?.edges?.map((edge: any) => edge.node);

  console.log(`Top Gainers (${tokens?.length || 0} coins):`);

  tokens?.forEach((coin: any, index: number) => {
    const percentChange = coin.marketCapDelta24h
      ? `${parseFloat(coin.marketCapDelta24h).toFixed(2)}%`
      : "N/A";

    console.log(`${index + 1}. ${coin.name} (${coin.symbol})`);
    console.log(`   24h Change: ${percentChange}`);
    console.log(`   Market Cap: ${coin.marketCap}`);
    console.log(`   Volume 24h: ${coin.volume24h}`);
    console.log('-----------------------------------');
  });

  // For pagination
  if (response.data?.exploreList?.pageInfo?.endCursor) {
    console.log("Next page cursor:", response.data?.exploreList?.pageInfo?.endCursor);
  }

  return response;
}
```

--------------------------------

### Fetch Recently Traded Coins using Zora Coins SDK

Source: https://docs.zora.co/coins/sdk/queries/explore

This example shows how to use the `getCoinsLastTraded` function from `@zoralabs/coins-sdk` to retrieve coins that have been traded most recently. It includes pagination parameters (`count`, `after`) and logs essential coin information such as name, symbol, market cap, and 24h volume.

```typescript
import { getCoinsLastTraded } from "@zoralabs/coins-sdk";

async function fetchLastTradedCoins() {
  const response = await getCoinsLastTraded({
    count: 10,        // Optional: number of coins per page
    after: undefined, // Optional: for pagination
  });

  console.log(`Recently Traded Coins (${response.data?.exploreList?.edges?.length || 0} coins):`);

  response.data?.exploreList?.edges?.forEach((coin: any, index: number) => {
    console.log(`${index + 1}. ${coin.node.name} (${coin.node.symbol})`);
    console.log(`   Market Cap: ${coin.node.marketCap}`);
    console.log(`   Volume 24h: ${coin.node.volume24h}`);
    console.log('-----------------------------------');
  });

  // For pagination
  if (response.data?.exploreList?.pageInfo?.endCursor) {
    console.log("Next page cursor:", response.data?.exploreList?.pageInfo?.endCursor);
  }

  return response;
}
```

--------------------------------

### Fetch Most Valuable Coins using Zora Coins SDK

Source: https://docs.zora.co/coins/sdk/queries/explore

This example demonstrates how to use the `getCoinsMostValuable` function from `@zoralabs/coins-sdk` to retrieve a list of the most valuable coins. It shows how to pass optional parameters like `count` for pagination and iterates through the response to log coin details such as name, symbol, market cap, and 24h volume.

```typescript
import { getCoinsMostValuable } from "@zoralabs/coins-sdk";

async function fetchMostValuableCoins() {
  const response = await getCoinsMostValuable({
    count: 10,        // Optional: number of coins per page
    after: undefined, // Optional: for pagination
  });

  console.log(`Most Valuable Coins (${response.data?.exploreList?.edges?.length || 0} coins):`);

  response.data?.exploreList?.edges?.forEach((coin: any, index: number) => {
    console.log(`${index + 1}. ${coin.node.name} (${coin.node.symbol})`);
    console.log(`   Market Cap: ${coin.node.marketCap}`);
    console.log(`   Volume 24h: ${coin.node.volume24h}`);
    console.log(`   Created: ${coin.node.createdAt}`);
    console.log('-----------------------------------');
  });

  // For pagination
  if (response.data?.exploreList?.pageInfo?.endCursor) {
    console.log("Next page cursor:", response.data?.exploreList?.pageInfo?.endCursor);
  }

  return response;
}
```

--------------------------------

### Define Update Coin URI Parameters

Source: https://docs.zora.co/coins/sdk/update-coin

This section defines the structure and types for the arguments required when updating a coin's metadata URI. It specifies the coin's contract address and the new URI, noting that the new URI must start with 'ipfs://'.

```APIDOC
import { Address } from "viem";

type UpdateCoinURIArgs = {
  coin: Address;    // The coin contract address
  newURI: string;   // The new URI for the coin metadata (must start with "ipfs://")
};
```

--------------------------------

### Fetch Recently Traded Coins by Unique Traders using Zora Coins SDK

Source: https://docs.zora.co/coins/sdk/queries/explore

This example demonstrates the `getCoinsLastTradedUnique` function from `@zoralabs/coins-sdk`, which retrieves coins based on recent trades by unique traders. It showcases how to use pagination and displays coin details including name, symbol, market cap, 24h volume, and the number of unique holders.

```typescript
import { getCoinsLastTradedUnique } from "@zoralabs/coins-sdk";

async function fetchLastTradedUniqueCoins() {
  const response = await getCoinsLastTradedUnique({
    count: 10,        // Optional: number of coins per page
    after: undefined, // Optional: for pagination
  });

  console.log(`Recently Traded Coins by Unique Traders (${response.data?.exploreList?.edges?.length || 0} coins):`);

  response.data?.exploreList?.edges?.forEach((coin: any, index: number) => {
    console.log(`${index + 1}. ${coin.node.name} (${coin.node.symbol})`);
    console.log(`   Market Cap: ${coin.node.marketCap}`);
    console.log(`   Volume 24h: ${coin.node.volume24h}`);
    console.log(`   Unique Holders: ${coin.node.uniqueHolders}`);
    console.log('-----------------------------------');
  });

  // For pagination
  if (response.data?.exploreList?.pageInfo?.endCursor) {
    console.log("Next page cursor:", response.data?.exploreList?.pageInfo?.endCursor);
  }

  return response;
}
```

--------------------------------

### Update Coin URI in a WAGMI Frontend Application

Source: https://docs.zora.co/coins/sdk/update-coin

This example illustrates how to integrate the coin URI update functionality into a React component using WAGMI hooks. It leverages `updateCoinURICall` from the ZORA Coins SDK to prepare contract call parameters, then uses `useSimulateContract` and `useContractWrite` for transaction simulation and execution within a frontend context.

```TypeScript
import { updateCoinURICall } from "@zoralabs/coins-sdk";
import { useContractWrite, useSimulateContract } from "wagmi";

// Define update parameters
const updateParams = {
  coin: "0xCoinContractAddress",
  newURI: "ipfs://bafkreihz5knnvvsvmaxlpw3kout23te6yboquyvvs72wzfulgrkwj7r7dm",
};

// Create configuration for wagmi
const contractCallParams = updateCoinURICall(updateParams);

// In your component
function UpdateCoinURIComponent() {
  const { data: config } = useSimulateContract({
    ...contractCallParams,
  });

  const { data, status, writeContract } = useContractWrite(config);

  return (
    <button disabled={!writeContract || status !== 'pending'} onClick={() => writeContract?.()}>
      {status === 'pending' ? 'Updating...' : 'Update Coin URI'}
    </button>
  );
}
```

--------------------------------

### APIDOC: ZoraFactory.sol deploy Method

Source: https://docs.zora.co/coins/contracts/factory

Documents the parameters and return values for the `deploy` function, which creates a new coin contract and its associated Uniswap pool.

```APIDOC
ZoraFactory.sol:
  function deploy(
    address payoutRecipient,
    address[] memory owners,
    string memory uri,
    string memory name,
    string memory symbol,
    bytes memory poolConfig,
    address platformReferrer,
    address postDeployHook,
    bytes calldata postDeployHookData,
    bytes32 coinSalt
  ) external payable returns (address coin, bytes memory postDeployHookDataOut)
    Parameters:
      payoutRecipient: The recipient of creator reward payouts; this can be updated by any owner later on
      owners: An array of addresses that will have permission to manage the coin's payout address and metadata URI
      uri: The coin metadata URI (should be an IPFS URI)
      name: The name of the coin (e.g., "horse galloping")
      symbol: The trading symbol for the coin (e.g., "HORSE")
      poolConfig: Encoded pool configuration that determines V3 vs V4 deployment and pool parameters
      platformReferrer: The address that will receive platform referral rewards from trades
      postDeployHook: Address of a contract implementing the IHasAfterCoinDeploy interface that runs after deployment
      postDeployHookData: Custom data to be passed to the post-deployment hook
      coinSalt: Salt for deterministic deployment, enables predictable coin addresses
    Returns:
      coin: The address of the deployed coin contract
      postDeployHookDataOut: Any data returned from the post-deployment hook
```

--------------------------------

### Sell Coins using Zora SDK with Viem

Source: https://docs.zora.co/coins/sdk/trade-coin

Demonstrates how to sell coins using the `@zoralabs/coins-sdk` with `viem` clients. It sets up public and wallet clients, defines sell parameters including recipient, order size, and minimum amount out, then executes the trade.

```typescript
import { tradeCoin } from "@zoralabs/coins-sdk";
import { Address, parseEther, Hex, createWalletClient, createPublicClient, http } from "viem";
import { base } from "viem/chains";

// Set up viem clients
const publicClient = createPublicClient({
  chain: base,
  transport: http("<RPC_URL>"),
});

const walletClient = createWalletClient({
  account: "0x<YOUR_ACCOUNT>" as Hex,
  chain: base,
  transport: http("<RPC_URL>"),
});

// Define sell parameters
const sellParams = {
  direction: "sell" as const,
  target: "0xCoinContractAddress" as Address,
  args: {
    recipient: "0xYourAddress" as Address, // Where to receive the ETH
    orderSize: parseEther("100"), // Amount of coins to sell
    minAmountOut: parseEther("0.05"), // Minimum ETH to receive
    tradeReferrer: "0xOptionalReferrerAddress" as Address, // Optional
  }
};

// Execute the sell
async function sellCoin() {
  const result = await tradeCoin(sellParams, walletClient, publicClient);

  console.log("Transaction hash:", result.hash);
  console.log("Trade details:", result.trade);

  return result;
}
```

--------------------------------

### Fetch Single Coin Details using getCoin

Source: https://docs.zora.co/coins/sdk/queries/coin

Demonstrates how to use the `getCoin` function from `@zoralabs/coins-sdk` to retrieve and log detailed information about a specific coin, including its name, symbol, description, and market data.

```TypeScript
import { getCoin } from "@zoralabs/coins-sdk";
import { base } from "viem/chains";

export async function fetchSingleCoin() {
  const response = await getCoin({
    address: "0x445e9c0a296068dc4257767b5ed354b77cf513de",
    chain: base.id, // Optional: Base chain set by default
  });

  const coin = response.data?.zora20Token;

  if (coin) {
    console.log("Coin Details:");
    console.log("- Name:", coin.name);
    console.log("- Symbol:", coin.symbol);
    console.log("- Description:", coin.description);
    console.log("- Total Supply:", coin.totalSupply);
    console.log("- Market Cap:", coin.marketCap);
    console.log("- 24h Volume:", coin.volume24h);
    console.log("- Creator:", coin.creatorAddress);
    console.log("- Created At:", coin.createdAt);
    console.log("- Unique Holders:", coin.uniqueHolders);

    // Access media if available
    if (coin.mediaContent?.previewImage) {
      console.log("- Preview Image:", coin.mediaContent.previewImage);
    }
  }

  return response;
}
```

--------------------------------

### Create Zora Coin using Zora Coins SDK (TypeScript)

Source: https://docs.zora.co/coins/contracts/factory

This snippet demonstrates how to create a new Zora Coin using the `@zoralabs/coins-sdk`. It sets up `viem` clients for public and wallet interactions, defines coin parameters such as name, symbol, URI, and payout recipient, and then calls `createCoin` to deploy the coin. It highlights optional parameters like initial purchase amount and forcing a specific version (e.g., V4).

```TypeScript
import { createCoin } from "@zoralabs/coins-sdk";
import { createWalletClient, createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { Address, Hex, parseEther } from "viem";

// Set up viem clients
const publicClient = createPublicClient({
  chain: base,
  transport: http("<RPC_URL>"),
});

const walletClient = createWalletClient({
  account: "0x<YOUR_ACCOUNT>" as Hex,
  chain: base,
  transport: http("<RPC_URL>"),
});

// Define coin parameters
const coinParams = {
  name: "My Awesome Coin",
  symbol: "MAC",
  uri: "ipfs://bafkreihz5knnvvsvmaxlpw3kout23te6yboquyvvs72wzfulgrkwj7r7dm",
  payoutRecipient: "0xYourAddress" as Address,
  platformReferrer: "0xYourPlatformReferrerAddress" as Address, // Optional
  initialPurchaseWei: parseEther("0.1"), // Optional: Initial amount to purchase in Wei
  // The SDK will automatically select V4 for new coins unless specified otherwise
  version: "v4", // Optional: Force specific version
};

// Create the coin
const result = await createCoin(coinParams, walletClient, publicClient);
console.log("Coin address:", result.address);
console.log("Coin version:", result.version);
```

--------------------------------

### Deploy New Coin Contract (Solidity)

Source: https://docs.zora.co/coins/contracts/factory

This is the current recommended function for creating a new coin contract with the specified parameters and its associated Uniswap pool.

```Solidity
function deploy(
    address payoutRecipient,
    address[] memory owners,
    string memory uri,
    string memory name,
    string memory symbol,
    bytes memory poolConfig,
    address platformReferrer,
    address postDeployHook,
    bytes calldata postDeployHookData,
    bytes32 coinSalt
) external payable returns (address coin, bytes memory postDeployHookDataOut);
```

--------------------------------

### Define V3 Coin Buy Function with Referrals

Source: https://docs.zora.co/coins/contracts/rewards

This API documentation describes the `buy` function for V3 coins, allowing a recipient to purchase a specified order size with a minimum output amount, price limit, and an optional trade referrer. It is a payable function, meaning it can receive Ether.

```Solidity
function buy(
    address recipient,
    uint256 orderSize,
    uint256 minAmountOut,
    uint160 sqrtPriceLimitX96,
    address tradeReferrer
) external payable returns (uint256, uint256);
```

--------------------------------

### Coin Factory: deploy Function API

Source: https://docs.zora.co/coins/contracts/rewards

API documentation for the `deploy` function within the Coin Factory contract. This function is used to create new coins on the Zora network, allowing the specification of various coin parameters and crucially, a `platformReferrer` address for create referral reward distribution.

```APIDOC
function deploy(
  payoutRecipient: address, 
  owners: address[] memory, 
  uri: string memory, 
  name: string memory, 
  symbol: string memory, 
  poolConfig: bytes memory, 
  platformReferrer: address, 
  orderSize: uint256, 
  message: string memory, 
  salt: bytes32
) external payable returns (address, uint256)

Parameters:
  payoutRecipient (address): The address designated to receive creator rewards from trading activity.
  owners (address[] memory): An array of addresses that will initially own the new coin.
  uri (string memory): The URI pointing to the coin's metadata.
  name (string memory): The human-readable name of the new coin.
  symbol (string memory): The ticker symbol for the new coin.
  poolConfig (bytes memory): Configuration data specific to the coin's liquidity pool.
  platformReferrer (address): The address of the platform or developer that referred the creator to deploy the coin. This address receives create referral rewards.
  orderSize (uint256): The initial order size for the coin's creation.
  message (string memory): An optional message associated with the coin deployment.
  salt (bytes32): A unique salt value used to ensure deterministic deployment of the coin contract.

Returns:
  (address): The address of the newly deployed coin contract.
  (uint256): The unique ID of the newly deployed coin.
```

--------------------------------

### Fetch Multiple Coins using Zora Coins SDK

Source: https://docs.zora.co/coins/sdk/queries/coin

Demonstrates how to use the `getCoins` function from `@zoralabs/coins-sdk` to retrieve data for multiple specified coin collection addresses on a given chain (e.g., Base). It then processes and logs details for each coin, including its name, symbol, market cap, 24h volume, and unique holders.

```TypeScript
import { getCoins } from "@zoralabs/coins-sdk";
import { base } from "viem/chains";

export async function fetchMultipleCoins() {
  const response = await getCoins({
    coins: [
      {
        chainId: base.id,
        collectionAddress: "0xFirstCoinAddress",
      },
      {
        chainId: base.id,
        collectionAddress: "0xSecondCoinAddress",
      },
      {
        chainId: base.id,
        collectionAddress: "0xThirdCoinAddress",
      },
    ],
  });

  // Process each coin in the response
  response.data?.zora20Tokens?.forEach((coin: any, index: number) => {
    console.log(`Coin ${index + 1}: ${coin.name} (${coin.symbol})`);
    console.log(`- Market Cap: ${coin.marketCap}`);
    console.log(`- 24h Volume: ${coin.volume24h}`);
    console.log(`- Holders: ${coin.uniqueHolders}`);
    console.log("-----------------------------------");
  });

  return response;
}
```

--------------------------------

### CoinV4 Core Contract API Reference

Source: https://docs.zora.co/coins/contracts/coin

Comprehensive documentation for the `CoinV4` Solidity contract, detailing its purpose, implemented interfaces, key features, and the automated hook system for fee collection and reward distribution within the Zora Coins Protocol.

```APIDOC
CoinV4 Contract:
  Description: The core contract for the Zora Coins Protocol. A non-upgradeable ERC20 contract built on Uniswap V4, enabling media coins with advanced hook-based functionality.
  Implemented Interfaces:
    - ICoinV4: Core V4 coin functionality
    - IHasPoolKey: Provides access to the Uniswap V4 pool key
    - IHasSwapPath: Enables complex multi-hop reward distribution
    - IERC165: Standard interface detection
    - IERC7572: Standard for protocol-specific metadata
  Key Features:
    - ERC20 Functionality: Basic token transfers, approvals, and balance tracking.
    - Uniswap V4 Integration: Built-in hooks for advanced pool management and automatic fee processing.
    - Automatic Reward Distribution: Hooks collect LP fees, swap to backing currency, and distribute rewards on every trade.
    - Multi-Hop Fee Conversion: Supports complex swap paths for coins paired with other coins.
    - Advanced Pool Configuration: Support for multiple liquidity positions and sophisticated market curves.
    - Metadata Management: Updatable contract metadata via URI.
    - Multi-Ownership: Support for multiple owners with permission control.
  Hook System (ZoraV4CoinHook):
    Description: Automatically executes on every swap to handle reward distribution. Has permissions for `afterInitialize` and `afterSwap` operations on the Uniswap V4 pool.
    Operations:
      1. Collect LP Fees:
        - Function: `V4Liquidity.collectFees`
        - Purpose: Collects accrued fees from all liquidity positions.
      2. Swap LP Fees to Backing Currency:
        - Function: `UniV4SwapToCurrency.swapToPath`
        - Purpose: Swaps collected fees to the backing currency through optimal swap paths.
        - Example Path: `ContentCoin → BackingCoin → USDC`
      3. Distribute Rewards:
        - Purpose: Distributes the final backing currency to predefined reward recipients.
        - Recipients & BPS:
          - Creator: 50% (CREATOR_REWARD_BPS = 5000)
          - Create Referral: 15% (CREATE_REFERRAL_REWARD_BPS = 1500)
          - Trade Referral: 15% (TRADE_REFERRAL_REWARD_BPS = 1500)
          - Protocol: 20% (remainder)
          - Doppler: 5% (DOPPLER_REWARD_BPS = 500)
    Automation: All operations happen automatically in a single transaction on trade.
```

--------------------------------

### Integrate Zora SDK Trade with Wagmi for Frontend

Source: https://docs.zora.co/coins/sdk/trade-coin

Illustrates how to use the lower-level `tradeCoinCall` function from `@zoralabs/coins-sdk` with Wagmi hooks (`useContractWrite`, `usePrepareContractWrite`) for frontend applications. It prepares a contract write configuration and provides a button to trigger the buy operation.

```typescript
import { tradeCoinCall } from "@zoralabs/coins-sdk";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { Address, parseEther } from "viem";

// Define trade parameters
const tradeParams = {
  direction: "buy" as const,
  target: "0xCoinContractAddress" as Address,
  args: {
    recipient: "0xYourAddress" as Address,
    orderSize: parseEther("0.1"),
    minAmountOut: 0n,
    tradeReferrer: "0x0000000000000000000000000000000000000000" as Address,
  }
};

// Create configuration for wagmi
const contractCallParams = tradeCoinCall(tradeParams);

// In your component
function BuyCoinComponent() {
  const { config } = usePrepareContractWrite({
    ...contractCallParams,
    value: tradeParams.args.orderSize,
  });

  const { writeContract, status, write } = useContractWrite(config);

  return (
    <button disabled={!writeContract || status === 'pending'} onClick={() => writeContract?.()}>
      {status === 'pending' ? 'Buying...' : 'Buy Coin'}
    </button>
  );
}
```

--------------------------------

### Parameters for getCoin Function

Source: https://docs.zora.co/coins/sdk/queries/coin

Defines the input parameters for the `getCoin` function, including the coin contract address and an optional chain ID.

```APIDOC
type GetCoinParams = {
  address: string;   // The coin contract address
  chain?: number;    // Optional: The chain ID (defaults to Base: 8453)
};
```

--------------------------------

### CoinV4 Contract Inheritance Hierarchy

Source: https://docs.zora.co/coins/contracts/coin

Illustrates the inheritance chain for the `CoinV4` Solidity contract, showing its foundational components and the order of inheritance.

```Solidity
CoinV4 → BaseCoin → ERC20PermitUpgradeable → MultiOwnable → ReentrancyGuardUpgradeable → ContractVersionBase
```

--------------------------------

### Set Zora Coins SDK API Key

Source: https://docs.zora.co/coins/sdk/queries

This code snippet demonstrates how to set up your API key for the Zora Coins SDK. It's a crucial step for high-usage production environments, ensuring authenticated requests to the API. Replace 'your-api-key-here' with your actual API key obtained from Zora Developer Settings.

```JavaScript
import { setApiKey } from "@zoralabs/coins-sdk";

// Set up your API key
setApiKey("your-api-key-here");
```

--------------------------------

### Query Coin Information

Source: https://docs.zora.co/coins/contracts/coin

Provides access to key coin information including its metadata URI, the address of the platform referrer earning trade fees, and the address of the backing currency it is paired with.

```Solidity
function tokenURI() external view returns (string memory);
function platformReferrer() external view returns (address);
function currency() external view returns (address);
```

--------------------------------

### Fetch User Coin Balances with ZORA SDK in JavaScript

Source: https://docs.zora.co/coins/sdk/queries/profile

This asynchronous function demonstrates how to use `getProfileBalances` from the `@zoralabs/coins-sdk` to retrieve a list of coin balances for a specified user. It illustrates how to apply optional pagination parameters (`count`, `after`) and iterate through the returned balances, also showing how to retrieve the `endCursor` for subsequent pagination calls.

```JavaScript
import { getProfileBalances } from "@zoralabs/coins-sdk";

async function fetchUserBalances() {
  const response = await getProfileBalances({
    identifier: "0xUserWalletAddress", // Can also be zora user profile handle
    count: 20,        // Optional: number of balances per page
    after: undefined, // Optional: for pagination
  });

  const profile: any = response.data?.profile;

  console.log(`Found ${profile.coinBalances?.length || 0} coin balances`);

  profile.coinBalances?.forEach((balance: any, index: number) => {
    console.log(balance)
  });

  // For pagination
  if (profile.coinBalances?.pageInfo?.endCursor) {
    console.log("Next page cursor:", profile.coinBalances?.pageInfo?.endCursor);
  }

  return response;
}
```

--------------------------------

### Parameters for getCoins Function

Source: https://docs.zora.co/coins/sdk/queries/coin

Defines the input parameters for the `getCoins` function, which accepts an array of objects, each specifying a `collectionAddress` and `chainId`.

```APIDOC
type GetCoinsParams = {
  coins: {
    collectionAddress: string;
    chainId: number;
  }[]
};
```

--------------------------------

### Response Structure for getCoin Function

Source: https://docs.zora.co/coins/sdk/queries/coin

Describes the structure of the `Zora20Token` object returned by the `getCoin` function, detailing properties like ID, name, description, market data, and nested comments.

```APIDOC
import { GetCoinResponse } from "@zoralabs/coins-sdk";

// The Zora20Token type is imported from the SDK's generated types.
// It includes detailed information about a specific coin, such as its metadata, market data, and creator information.
type Zora20Token = {
    id: string;
    name: string;
    description: string;
    address: string;
    symbol: string;
    totalSupply: string;
    totalVolume: string;
    volume24h: string;
    createdAt?: string;
    creatorAddress?: string;
    ... 11 more ...;
    zoraComments: {
        pageInfo: {
            endCursor?: string;
            hasNextPage: boolean;
        };
        count: number;
        edges: Array<{
            node: {
                txHash: string;
                comment: string;
                userAddress: string;
                timestamp: number;
                userProfile?: {
                    id: string;
                    handle: string;
                    avatar?: {
                        previewImage: {
                            blurhash?: string;
                            small: string;
                            medium: string;
                        };
                    };
                };
            };
        }>;
    };
} | undefined

Zora20Token = GetCoinResponse['zora20Token'];
```

--------------------------------

### Create Zora Coin with Wagmi and createCoinCall

Source: https://docs.zora.co/coins/sdk/create-coin

Demonstrates how to create a new Zora coin using the `@zoralabs/coins-sdk`'s `createCoinCall` function in a Wagmi-based React application. It covers defining coin parameters, simulating the contract call, and executing the transaction to deploy the coin.

```typescript
import * as React from "react";
import { createCoinCall, DeployCurrency } from "@zoralabs/coins-sdk";
import { Address } from "viem";
import { useWriteContract, useSimulateContract } from "wagmi";

// Define coin parameters
const coinParams = {
  name: "My Awesome Coin",
  symbol: "MAC",
  uri: "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy",
  payoutRecipient: "0xYourAddress" as Address,
  platformReferrer: "0xOptionalPlatformReferrerAddress" as Address,
  // chainId: base.id, // Optional: defaults to base.id
  // currency: DeployCurrency.ZORA, // Optional: ZORA or ETH
};

// Create configuration for wagmi
const contractCallParams = await createCoinCall(coinParams);

// In your component
function CreateCoinComponent() {
  const { data: writeConfig } = useSimulateContract({
    ...contractCallParams,
  });

  const { writeContract, status } = useWriteContract(writeConfig);

  return (
    <button disabled={!writeContract || status !== 'pending'} onClick={() => writeContract?.()}>
      {status === 'pending' ? 'Creating...' : 'Create Coin'}
    </button>
  );
}
```

--------------------------------

### Retrieve Single User Coin Balance with Zora Coins SDK

Source: https://docs.zora.co/coins/sdk/queries/onchain

This snippet demonstrates how to fetch the balance of a specific coin for a single user. It utilizes `viem` for public client creation and `@zoralabs/coins-sdk`'s `getOnchainCoinDetails` function. The output includes both raw token balance and its ETH equivalent.

```javascript
import { Address, formatEther, createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { getOnchainCoinDetails } from "@zoralabs/coins-sdk";

const publicClient = createPublicClient({
  chain: base,
  transport: http("<RPC_URL>"),
});

const userCoinBalance = await getOnchainCoinDetails({
  coin: "0xCoinAddress" as Address,
  user: "0xUserAddress" as Address,
  publicClient,
});

console.log(`User has ${userCoinBalance.balance} tokens (${formatEther(userCoinBalance.balance)} ETH)`);
```

--------------------------------

### APIDOC: ZoraFactory.sol coinAddress Method

Source: https://docs.zora.co/coins/contracts/factory

Documents the parameters and return values for the `coinAddress` function, which predicts the deployment address of a coin contract.

```APIDOC
ZoraFactory.sol:
  function coinAddress(
    address msgSender,
    string memory name,
    string memory symbol,
    bytes memory poolConfig,
    address platformReferrer,
    bytes32 coinSalt
  ) external view returns (address)
    Parameters:
      msgSender: The address that will call the deploy function
      name: The name of the coin
      symbol: The symbol of the coin
      poolConfig: The pool configuration
      platformReferrer: The platform referrer address
      coinSalt: The salt to be used for deployment
    Returns:
      address: The address where the coin will be deployed
```

--------------------------------

### Fetch User Profile Details with ZORA SDK in JavaScript

Source: https://docs.zora.co/coins/sdk/queries/profile

This asynchronous function demonstrates how to use the `getProfile` function from the `@zoralabs/coins-sdk` to retrieve and display a user's profile information. It shows how to access handle, display name, bio, profile image, and linked wallets, and includes error handling for cases where the profile is not found.

```JavaScript
import { getProfile } from "@zoralabs/coins-sdk";

async function fetchUserProfile() {
  const response = await getProfile({
    identifier: "0xUserWalletAddress",
  });

  // TODO: fix profile graphql types
  const profile: any = response?.data?.profile;

  if (profile) {
    console.log("Profile Details:");
    console.log("- Handle:", profile.handle);
    console.log("- Display Name:", profile.displayName);
    console.log("- Bio:", profile.bio);

    // Access profile image if available
    if (profile.avatar?.medium) {
      console.log("- Profile Image:", profile.avatar.medium);
    }

    // Access social links if available
    if (profile?.linkedWallets && profile?.linkedWallets?.edges?.length || 0 > 0) {
      console.log("Linked Wallets:");
      profile?.linkedWallets?.edges?.forEach((link: any) => {
        console.log(`- ${link?.node?.walletType}: ${link?.node?.walletAddress}`);
      });
    }
  } else {
    console.log("Profile not found or user has not set up a profile");
  }

  return response;
}
```

--------------------------------

### Retrieve Payout Swap Path

Source: https://docs.zora.co/coins/contracts/coin

Returns the swap path configuration required to convert this coin's fees into its final payout currency, enabling multi-hop swaps through intermediate currencies. The `PayoutSwapPath` struct includes the input currency and an array of swap steps.

```Solidity
function getPayoutSwapPath(IDeployedCoinVersionLookup coinVersionLookup) external view returns (PayoutSwapPath memory);
```

--------------------------------

### Fetch All User Coin Balances with Pagination

Source: https://docs.zora.co/coins/sdk/queries/profile

This asynchronous function demonstrates how to retrieve all coin balances for a given user address. It iteratively calls the `getProfileBalances` function from the `@zoralabs/coins-sdk`, using a cursor to paginate through results until all available balances have been fetched. The function collects and returns a complete list of balances.

```TypeScript
import { getProfileBalances } from "@zoralabs/coins-sdk";

async function fetchAllUserBalances(userAddress: string) {
  let allBalances: any[] = [];
  let cursor = undefined;
  const pageSize = 20;

  // Continue fetching until no more pages
  do {
    const response = await getProfileBalances({
      identifier: userAddress, // UserAddress or zora handle
      count: pageSize,
      after: cursor,
    });

    const profile: any = response.data?.profile;

    // Add balances to our collection
    if (profile && profile.coinBalances) {
      allBalances = [...allBalances, ...profile.coinBalances.edges.map((edge: any) => edge.node)];
    }

    // Update cursor for next page
    cursor = profile?.coinBalances?.pageInfo?.endCursor;

    // Break if no more results
    if (!cursor || profile?.coinBalances?.edges?.length === 0) {
      break;
    }

  } while (true);

  console.log(`Fetched ${allBalances.length} total coin balances`);
  return allBalances;
}
```

--------------------------------

### Retrieve Pool Configuration

Source: https://docs.zora.co/coins/contracts/coin

Returns the current pool configuration settings, including fee structure, tick spacing, number of positions, and liquidity curve parameters.

```Solidity
function getPoolConfiguration() external view returns (PoolConfiguration memory);
```

--------------------------------

### Parameters for getOnchainCoinDetails Function

Source: https://docs.zora.co/coins/sdk/queries/onchain

This API documentation describes the required and optional parameters for the `getOnchainCoinDetails` function. It specifies the types and purposes of `coin` (the coin contract address), `user` (an optional user address to fetch balance for), and `publicClient` (a Viem public client for blockchain calls).

```APIDOC
type GetOnchainCoinDetailsParams = {
  coin: Address;              // The coin contract address
  user?: Address;             // Optional: User address to fetch balance for
  publicClient: PublicClient; // Viem public client for blockchain calls
};
```

--------------------------------

### Parallelize Multiple On-chain Coin Detail Queries

Source: https://docs.zora.co/coins/sdk/queries/onchain

This snippet demonstrates how to fetch details for multiple coin addresses concurrently using `Promise.all`. While effective for parallelizing individual `getOnchainCoinDetails` calls, the documentation suggests using the optimized `getCoins` query for fetching information about many coins in a single request.

```javascript
const coinAddresses = ["0xCoin1", "0xCoin2", "0xCoin3"];
const detailsPromises = coinAddresses.map(address =>
  getOnchainCoinDetails({ coin: address, publicClient })
);
const allCoinDetails = await Promise.all(detailsPromises);
```

--------------------------------

### Deprecated Coin Deployment Functions (Solidity)

Source: https://docs.zora.co/coins/contracts/factory

These functions are maintained for backward compatibility but are deprecated. They do not support deterministic deployment, meaning coin addresses cannot be predicted before deployment. The recommended `deploy` function offers deterministic addresses and post-deployment hooks.

```Solidity
function deploy(
    address payoutRecipient,
    address[] memory owners,
    string memory uri,
    string memory name,
    string memory symbol,
    bytes memory poolConfig,
    address platformReferrer,
    uint256 orderSize
) external payable returns (address, uint256);
```

```Solidity
function deployWithHook(
    address payoutRecipient,
    address[] memory owners,
    string memory uri,
    string memory name,
    string memory symbol,
    bytes memory poolConfig,
    address platformReferrer,
    address hook,
    bytes calldata hookData
) external payable returns (address coin, bytes memory hookDataOut);
```

--------------------------------

### Explore Query Options Type Definition

Source: https://docs.zora.co/coins/sdk/queries/explore

Defines the structure for optional parameters used across various Zora Coins SDK explore queries. It includes 'after' for pagination cursors and 'count' to specify the number of results per page.

```APIDOC
type ExploreQueryOptions = {
  after?: string;     // Optional: Pagination cursor for fetching next page
  count?: number;     // Optional: Number of coins to return per page (default: 20)
};
```

--------------------------------

### Define Pool Configuration Struct

Source: https://docs.zora.co/coins/contracts/coin

Defines the `PoolConfiguration` struct, which specifies parameters for custom market curves and multiple liquidity positions, including version, number of positions, fee tier, tick spacing, and discovery position details.

```Solidity
struct PoolConfiguration {
    uint8 version;           // Configuration version
    uint16 numPositions;     // Number of liquidity positions
    uint24 fee;              // Fee tier for the pool
    int24 tickSpacing;       // Tick spacing for the pool
    uint16[] numDiscoveryPositions;  // Number of discovery positions
    int24[] tickLower;       // Lower tick bounds for positions
    int24[] tickUpper;       // Upper tick bounds for positions
    uint256[] maxDiscoverySupplyShare; // Maximum share for discovery supply
}
```

--------------------------------

### Fetch Coin Comments using Zora Coins SDK

Source: https://docs.zora.co/coins/sdk/queries/coin

Illustrates how to use `getCoinComments` to fetch comments associated with a specific coin contract address. It logs the total number of comments found and iterates through them, displaying the author, text, and creation timestamp for each comment, including any replies.

```TypeScript
import { getCoinComments } from "@zoralabs/coins-sdk";
import { Address } from "viem";

export async function fetchCoinComments() {
  const response = await getCoinComments({
    address: "0xCoinContractAddress" as Address,
    chain: 8453, // Optional: Base chain
    after: undefined, // Optional: for pagination
    count: 20, // Optional: number of comments per page
  });

  // Process comments
  console.log(
    `Found ${response.data?.zora20Token?.zoraComments?.edges?.length || 0} comments`,
  );

  response.data?.zora20Token?.zoraComments?.edges?.forEach(
    (edge, index: number) => {
      console.log(`Comment ${index + 1}:`);
      console.log(
        `- Author: ${edge.node?.userProfile?.handle || edge.node?.userAddress}`,
      );
      console.log(`- Text: ${edge.node?.comment}`);
      console.log(`- Created At: ${edge.node?.timestamp}`);

      edge.node?.replies?.edges?.forEach((reply: any) => {
        console.log(`- Reply: ${reply.node.text}`);
      });

      console.log("-----------------------------------");
    },
  );

  // For pagination
  if (response.data?.zora20Token?.zoraComments?.pageInfo?.endCursor) {
    console.log(
      "Next page cursor:",
      response.data?.zora20Token?.zoraComments?.pageInfo?.endCursor,
    );
  }

  return response;
}
```

--------------------------------

### Define Zora Coins SDK Trade Parameters

Source: https://docs.zora.co/coins/sdk/trade-coin

This type definition outlines the structure for parameters used in Zora Coins SDK trading functions. It specifies the trade direction (buy/sell), the target coin contract address, and arguments such as recipient, order size, minimum output amount, price limit, and an optional referrer.

```typescript
import { Address } from "viem";

type TradeParams = {
  direction: "sell" | "buy";  // The trade direction
  target: Address;            // The target coin contract address
  args: {
    recipient: Address;       // The recipient of the trade output
    orderSize: bigint;        // The size of the order
    minAmountOut?: bigint;    // Optional minimum amount to receive
    sqrtPriceLimitX96?: bigint; // Optional price limit for the trade
    tradeReferrer?: Address;  // Optional referrer address for the trade
  };
};
```

--------------------------------

### Handle Errors with Zora Coins SDK Functions

Source: https://docs.zora.co/coins/sdk/queries/coin

Shows a `try-catch` block demonstrating how to handle potential errors when calling Zora Coins SDK functions, such as `getCoin`. It includes conditional error handling to check for common HTTP status codes like 404 (Not Found) and 401 (Unauthorized), providing specific feedback for each case.

```TypeScript
import { Address } from "viem";
import { getCoin } from "@zoralabs/coins-sdk";

try {
  const response = await getCoin({ address: "0xCoinAddress" as Address });
  // Process response...
  console.log(response);
} catch (error: any) {
  if (error.status === 404) {
    console.error("Coin not found");
  } else if (error.status === 401) {
    console.error("API key invalid or missing");
  } else {
    console.error("Unexpected error:", error.message);
  }
}
```

--------------------------------

### Define Parameters for Zora Coin Creation

Source: https://docs.zora.co/coins/sdk/create-coin

This TypeScript type definition outlines the structure for arguments required by the `createCoin` function in the Zora Coins SDK. It includes essential properties like `name`, `symbol`, `uri`, `payoutRecipient`, and optional parameters such as `chainId`, `owners`, `platformReferrer`, and `currency`.

```typescript
import { Address } from "viem";
import { DeployCurrency } from "@zoralabs/coins-sdk";

type CreateCoinArgs = {
  name: string;             // The name of the coin (e.g., "My Awesome Coin")
  symbol: string;           // The trading symbol for the coin (e.g., "MAC")
  uri: string;              // Metadata URI (an IPFS URI is recommended)
  chainId?: number;         // The chain ID (defaults to base mainnet)
  owners?: Address[];       // Optional array of owner addresses, defaults to [payoutRecipient]
  payoutRecipient: Address; // Address that receives creator earnings
  platformReferrer?: Address; // Optional platform referrer address, earns referral fees
  // DeployCurrency.ETH or DeployCurrency.ZORA
  currency?: DeployCurrency; // Optional currency for trading (ETH or ZORA)
}
```

--------------------------------

### APIDOC: getCoinComments Function Parameters

Source: https://docs.zora.co/coins/sdk/queries/coin

Defines the `GetCoinCommentsParams` type, detailing the parameters required for the `getCoinComments` function. This includes the mandatory coin contract `address`, and optional parameters for `chain` ID, `after` (pagination cursor), and `count` (number of comments per page).

```APIDOC
type GetCoinCommentsParams = {
  address: string;    // The coin contract address
  chain?: number;     // Optional: The chain ID (defaults to Base: 8453)
  after?: string;     // Optional: Pagination cursor for fetching next page
  count?: number;     // Optional: Number of comments to return per page
};
```

--------------------------------

### Coin Buy Event

Source: https://docs.zora.co/coins/contracts/coin

Emitted when coins are purchased, tracking the buyer, recipient, trade referrer, quantity of coins purchased, currency used, fees paid, and total amount spent.

```Solidity
event CoinBuy(
    address indexed buyer,
    address indexed recipient,
    address indexed tradeReferrer,
    uint256 coinsPurchased,
    address currency,
    uint256 amountFee,
    uint256 amountSold
);
```

--------------------------------

### Perform Basic Coin URI Update with ZORA Coins SDK

Source: https://docs.zora.co/coins/sdk/update-coin

This code snippet demonstrates a fundamental way to update a coin's metadata URI using the ZORA Coins SDK. It initializes `viem` public and wallet clients, defines the update parameters, and executes the `updateCoinURI` function, logging the transaction hash and update event.

```TypeScript
import { updateCoinURI } from "@zoralabs/coins-sdk";
import { createWalletClient, createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { Address, Hex } from "viem";

// Set up viem clients
const publicClient = createPublicClient({
  chain: base,
  transport: http("<RPC_URL>"),
});

const walletClient = createWalletClient({
  account: "0x<YOUR_ACCOUNT>" as Hex,
  chain: base,
  transport: http("<RPC_URL>"),
});

// Define update parameters
const updateParams = {
  coin: "0xCoinContractAddress" as Address,
  newURI: "ipfs://bafkreihz5knnvvsvmaxlpw3kout23te6yboquyvvs72wzfulgrkwj7r7dm",
};

// Execute the update
async function updateCoinMetadata() {
  const result = await updateCoinURI(updateParams, walletClient, publicClient);

  console.log("Transaction hash:", result.hash);
  console.log("URI updated event:", result.uriUpdated);

  return result;
}
```

--------------------------------

### Response Structure for Onchain Coin Details

Source: https://docs.zora.co/coins/sdk/queries/onchain

This API documentation outlines the structure of the `CoinDetailsOnchain` object returned by the `getOnchainCoinDetails` function. It details properties such as basic coin information (address, decimals, name, symbol, totalSupply), pool information (pool, liquidity, marketCap), governance details (owners, payoutRecipient), and optional user-specific balance information.

```APIDOC
interface CoinDetailsOnchain {
  // Basic Coin Information
  address: Address;            // The coin contract address
  decimals: number;            // Token decimals (usually 18)
  name: string;                // Coin name
  symbol: string;              // Coin symbol
  totalSupply: bigint;         // Total supply of the coin

  // Pool Information
  pool: Address;               // Uniswap V3 pool address
  liquidity: bigint;           // Current pool liquidity
  marketCap: bigint;           // Current market cap in wei

  // Governance
  owners: Address[];           // Array of owner addresses
  payoutRecipient: Address;    // Address receiving creator rewards

  // Optional User-specific Information
  balance?: bigint;            // User's balance (only if user parameter provided)
}
```

--------------------------------

### Define V3 Coin Reward Withdrawal with Signature

Source: https://docs.zora.co/coins/contracts/rewards

This API documentation describes the `withdrawWithSig` function, allowing a user to withdraw rewards from a specified 'from' address to a 'to' address. Authorization is provided via an EIP-712 signature, including a deadline, v, r, and s components for secure, off-chain signed transactions.

```Solidity
function withdrawWithSig(
    address from,
    address to,
    uint256 amount,
    uint256 deadline,
    uint8 v,
    bytes32 r,
    bytes32 s
)
```

--------------------------------

### CoinCreatedV4 Event (V4) and Parameters (Solidity/APIDOC)

Source: https://docs.zora.co/coins/contracts/factory

The `CoinCreatedV4` event is emitted when a new V4 coin is successfully created through the factory contract. It includes specific details relevant to V4 coins, such as the `PoolKey` and its hash.

```Solidity
event CoinCreatedV4(
    address indexed caller,
    address indexed payoutRecipient,
    address indexed platformReferrer,
    address currency,
    string uri,
    string name,
    string symbol,
    address coin,
    PoolKey poolKey,
    bytes32 poolKeyHash,
    string version
);
```

```APIDOC
CoinCreatedV4 Event Parameters:
  caller: The address that called the deploy function
  payoutRecipient: The address of the creator payout recipient
  platformReferrer: The address of the platform referrer
  currency: The address of the trading currency
  uri: The metadata URI of the coin
  name: The name of the coin
  symbol: The symbol of the coin
  coin: The address of the newly created coin contract
  poolKey: The Uniswap V4 pool key struct
  poolKeyHash: Hash of the pool key for efficient indexing
  version: The version string of the coin implementation
```

--------------------------------

### CoinTradeRewards Event Definition

Source: https://docs.zora.co/coins/contracts/coin

Defines the `CoinTradeRewards` event, emitted when trade rewards are distributed. It shows a detailed breakdown of rewards to various recipients including creator, platform referrer, trade referrer, and protocol, along with the currency used for the rewards.

```Solidity
event CoinTradeRewards(
    address indexed payoutRecipient,
    address indexed platformReferrer,
    address indexed tradeReferrer,
    address protocolRewardRecipient,
    uint256 creatorReward,
    uint256 platformReferrerReward,
    uint256 traderReferrerReward,
    uint256 protocolReward,
    address currency
);
```

--------------------------------

### Configure Zora Coins SDK API Key

Source: https://docs.zora.co/coins/sdk

This code snippet demonstrates how to import the `setApiKey` function from the Zora Coins SDK and use it to set your API key. Setting an API key is crucial for preventing rate limiting and unlocking all features of the SDK.

```javascript
import { setApiKey } from "@zoralabs/coins-sdk";

// Set up your API key before making any SDK requests
setApiKey("your-api-key-here");
```

--------------------------------

### Retrieve Hooks Contract

Source: https://docs.zora.co/coins/contracts/coin

Returns the address of the `IHooks` contract (ZoraV4CoinHook) responsible for handling pool lifecycle events like swaps and automatic reward distribution.

```Solidity
function hooks() external view returns (IHooks);
```

--------------------------------

### Define V3 Coin Reward Withdrawal Function

Source: https://docs.zora.co/coins/contracts/rewards

This API documentation describes the `withdraw` function for V3 coins and NFTs. It allows a user to withdraw a specified amount of rewards to a given address from the escrow contract.

```Solidity
function withdraw(address to, uint256 amount) external;
```

--------------------------------

### Swapped Event

Source: https://docs.zora.co/coins/contracts/coin

Emitted by the hook contract when a swap occurs, providing comprehensive details about the transaction, including sender, swap initiator, pool key, swap parameters, amounts of tokens exchanged, swap direction, hook data, and square root price.

```Solidity
event Swapped(
    address indexed sender,
    address indexed swapSender,
    bool isTrustedSwapSenderAddress,
    PoolKey key,
    bytes32 indexed poolKeyHash,
    SwapParams params,
    int128 amount0,
    int128 amount1,
    bool isCoinBuy,
    bytes hookData,
    uint160 sqrtPriceX96
);
```

--------------------------------

### Coin Market Rewards V4 Event

Source: https://docs.zora.co/coins/contracts/coin

Emitted when market rewards are distributed, detailing how much each recipient (coin, currency, payout recipient, platform referrer, trade referrer, protocol reward recipient, doppler recipient) received in the backing currency.

```Solidity
event CoinMarketRewardsV4(
    address indexed coin,
    address indexed currency,
    address indexed payoutRecipient,
    address platformReferrer,
    address tradeReferrer,
    address protocolRewardRecipient,
    address dopplerRecipient,
    MarketRewardsV4 marketRewards
);
```

--------------------------------

### Zora Coin Balances API Response Structure

Source: https://docs.zora.co/coins/sdk/queries/profile

This TypeScript type definition outlines the expected structure of the response object returned by the Zora coin balances API. It includes an array of `balances`, each containing detailed information about the token, its amount, USD value, and timestamp. Additionally, it defines a `pagination` object with a cursor for subsequent requests.

```TypeScript
type Response = {
  balances?: Array<{
    id?: string;              // Unique identifier for this balance
    token?: {                 // Coin information
      id?: string;            // Coin ID
      name?: string;          // Coin name
      symbol?: string;        // Trading symbol
      address?: string;       // Coin contract address
      chainId?: number;       // Chain ID
      totalSupply?: string;   // Total supply of the coin
      marketCap?: string;     // Current market capitalization
      volume24h?: string;     // 24-hour trading volume
      createdAt?: string;     // Creation timestamp
      uniqueHolders?: number; // Number of unique holders
      media?: {               // Media associated with the coin
        previewImage?: string;
        medium?: string;
        blurhash?: string;
      };
    };
    amount?: {                // Balance amount
      amountRaw?: string;     // Raw amount (in base units)
      amountDecimal?: number; // Decimal representation
    };
    valueUsd?: string;        // Estimated USD value
    timestamp?: string;       // Last updated timestamp
  }>;
  pagination?: {
    cursor?: string;          // Cursor for the next page
  };
}
```

--------------------------------

### Zora Explore Query Response Type Definition

Source: https://docs.zora.co/coins/sdk/queries/explore

Defines the TypeScript structure for responses from Zora explore queries. It includes an array of `zora20Tokens` with detailed properties like `id`, `name`, `address`, and `marketCap`, along with a `pagination` object containing a `cursor` for subsequent requests.

```typescript
type Response = {
  zora20Tokens?: Array<{
    // Same structure as the coin object in getCoin response
    id?: string;
    name?: string;
    description?: string;
    address?: string;
    symbol?: string;
    totalSupply?: string;
    totalVolume?: string;
    volume24h?: string;
    createdAt?: string;
    creatorAddress?: string;
    marketCap?: string;
    marketCapDelta24h?: string;
    chainId?: number;
    uniqueHolders?: number;
    // ... other coin properties
  }>;
  pagination?: {
    cursor?: string;  // Cursor for the next page
  };
}
```

--------------------------------

### ZORA Coin Metadata JSON with Animation and Content Properties

Source: https://docs.zora.co/coins/sdk/metadata

Illustrates an extended JSON metadata format for ZORA Coins, incorporating `animation_url` for non-image assets (like audio or video) and the `content` property. The `content` property provides a more consistent way to specify the asset's `mime` type and `uri` for better indexing.

```JSON
{
  "name": "boundless horse",
  "description": "boundless horse",
  "image": "ipfs://bafkreifch6stfh3fn3nqv5tpxnknjpo7zulqav55f2b5pryadx6hldldwe",
  "animation_url": "ipfs://bafybeiatmngyt4wwu6mla27523qk33klxopycomegris3n25y6rcqs27c4",
  "content": {
    "mime": "video/mp4",
    "uri": "ipfs://bafybeiatmngyt4wwu6mla27523qk33klxopycomegris3n25y6rcqs27c4"
  },
  "properties": {
    "category": "social"
  }
}
```

--------------------------------

### Basic ZORA Coin Metadata JSON Format

Source: https://docs.zora.co/coins/contracts/metadata

Illustrates the fundamental JSON structure for ZORA Coin metadata, adhering to EIP-7572, including `name`, `description`, `image`, and an optional `properties` object.

```JSON
{
  "name": "horse",
  "description": "boundless energy",
  "image": "ipfs://bafkreifch6stfh3fn3nqv5tpxnknjpo7zulqav55f2b5pryadx6hldldwe",
  "properties": {
    "category": "social"
  }
}
```

--------------------------------

### CoinCreated Event (V3) and Parameters (Solidity/APIDOC)

Source: https://docs.zora.co/coins/contracts/factory

The `CoinCreated` event is emitted when a new V3 coin is successfully created through the factory contract. It provides comprehensive details about the newly minted coin and its associated entities.

```Solidity
event CoinCreated(
    address indexed caller,
    address indexed payoutRecipient,
    address indexed platformReferrer,
    address currency,
    string uri,
    string name,
    string symbol,
    address coin,
    address pool,
    string version
);
```

```APIDOC
CoinCreated Event Parameters:
  caller: The address that called the deploy function
  payoutRecipient: The address of the creator payout recipient
  platformReferrer: The address of the platform referrer
  currency: The address of the trading currency
  uri: The metadata URI of the coin
  name: The name of the coin
  symbol: The symbol of the coin
  coin: The address of the newly created coin contract
  pool: The address of the associated Uniswap V3 pool
  version: The version string of the coin implementation
```

--------------------------------

### Define V3 Coin Reward Withdrawal for Another Address

Source: https://docs.zora.co/coins/contracts/rewards

This API documentation describes the `withdrawFor` function, enabling a user to withdraw rewards on behalf of another address to a specified recipient. This is useful for managing rewards for multiple accounts.

```Solidity
function withdrawFor(address to, uint256 amount) external;
```

--------------------------------

### Coin Sell Event

Source: https://docs.zora.co/coins/contracts/coin

Emitted when coins are sold, tracking the seller, recipient, trade referrer, quantity of coins sold, currency received, fees paid, and total amount received.

```Solidity
event CoinSell(
    address indexed seller,
    address indexed recipient,
    address indexed tradeReferrer,
    uint256 coinsSold,
    address currency,
    uint256 amountFee,
    uint256 amountPurchased
);
```

--------------------------------

### Define GetProfileBalances Parameters in TypeScript

Source: https://docs.zora.co/coins/sdk/queries/profile

This type definition specifies the parameters for the `getProfileBalances` function. It requires an `address` for the user's wallet and optionally supports `after` for pagination cursor and `count` to limit results per page.

```TypeScript
type GetProfileBalancesParams = {
  address: string;    // The user's wallet address
  after?: string;     // Optional: Pagination cursor for fetching next page
  count?: number;     // Optional: Number of balances to return per page
};
```

--------------------------------

### Define Deploy Currency Enum for Zora Coins

Source: https://docs.zora.co/coins/sdk/create-coin

This TypeScript enum specifies the supported currencies for trading pairs when deploying a new coin on the Zora protocol. It currently includes `ZORA` and `ETH` as options, determining which token will be used for the trading pair.

```typescript
enum DeployCurrency {
  ZORA = 1,
  ETH = 2,
}
```

--------------------------------

### ZORA Coin Metadata JSON with Animation and Content Properties

Source: https://docs.zora.co/coins/contracts/metadata

Demonstrates an extended JSON structure for ZORA Coin metadata, incorporating `animation_url` for non-image assets and the `content` property with `mime` type and `uri` for improved indexing and consistency.

```JSON
{
  "name": "boundless horse",
  "description": "boundless horse",
  "image": "ipfs://bafkreifch6stfh3fn3nqv5tpxnknjpo7zulqav55f2b5pryadx6hldldwe",
  "animation_url": "ipfs://bafybeiatmngyt4wwu6mla27523qk33klxopycomegris3n25y6rcqs27c4",
  "content": {
    "mime": "video/mp4",
    "uri": "ipfs://bafybeiatmngyt4wwu6mla27523qk33klxopycomegris3n25y6rcqs27c4"
  },
  "properties": {
    "category": "social"
  }
}
```

--------------------------------

### Custom Error Handling (APIDOC)

Source: https://docs.zora.co/coins/contracts/factory

The factory contract defines custom errors to provide specific and detailed information about why an operation might have failed, aiding in debugging and user feedback.

```APIDOC
Custom Errors:
  ERC20TransferAmountMismatch: The amount of ERC20 tokens transferred does not match the expected amount
  EthTransferInvalid: ETH is sent with a transaction but the currency is not WETH
```

--------------------------------

### Zora Protocol Common Errors

Source: https://docs.zora.co/coins/contracts/coin

Lists custom error types defined in the Zora protocol contracts for common operational failures. These errors provide specific context for why an operation might fail, aiding in debugging and user feedback.

```APIDOC
Common Errors:
- `AddressZero`: Operation attempted with a zero address
- `InsufficientFunds`: Insufficient funds for the operation
- `InsufficientLiquidity`: Insufficient liquidity for a transaction
- `SlippageBoundsExceeded`: Slippage bounds exceeded during a transaction
- `InitialOrderSizeTooLarge`: Initial order size too large
- `EthAmountMismatch`: ETH value doesn't match the currency amount
- `EthAmountTooSmall`: ETH amount too small for the transaction
- `ERC20TransferAmountMismatch`: Unexpected ERC20 transfer amount
- `EthTransferInvalid`: Invalid ETH transfer
- `EthTransferFailed`: ETH transfer failed
- `OnlyPool`: Operation attempted by an entity other than the pool
- `OnlyWeth`: Operation attempted by an entity other than WETH
- `MarketNotGraduated`: Market is not yet graduated
- `MarketAlreadyGraduated`: Market is already graduated
- `InvalidCurrencyLowerTick`: Lower tick is not less than maximum or not a multiple of 200
- `InvalidWethLowerTick`: Lower tick is not set to the default value
- `LegacyPoolMustHaveOneDiscoveryPosition`: Legacy pool does not have one discovery position
- `DopplerPoolMustHaveMoreThan2DiscoveryPositions`: Doppler pool doesn't have enough discovery positions
- `InvalidPoolVersion`: Invalid pool version specified
```

--------------------------------

### Zora Protocol Hook-Specific Errors

Source: https://docs.zora.co/coins/contracts/coin

Lists custom error types specific to hook-related operations within the Zora protocol. These errors provide precise context for failures related to contract hooks and integrations, facilitating targeted error handling.

```APIDOC
Hook-Specific Errors:
- `NotACoin`: Non-coin contract attempted to use V4 hook
- `NoCoinForHook`: Pool not properly initialized for hook
- `PathMustHaveAtLeastOneStep`: Invalid swap path configuration for multi-hop rewards
- `CoinVersionLookupCannotBeZeroAddress`: Version lookup contract cannot be zero address
```

--------------------------------

### CoinTransfer Event Definition

Source: https://docs.zora.co/coins/contracts/coin

Defines the `CoinTransfer` event, emitted on any token transfer. It provides detailed information including sender, recipient, amount, and updated balances for both parties involved in the transfer.

```Solidity
event CoinTransfer(
    address indexed sender,
    address indexed recipient,
    uint256 amount,
    uint256 senderBalance,
    uint256 recipientBalance
);
```

--------------------------------

### Retrieve Pool Key

Source: https://docs.zora.co/coins/contracts/coin

Returns the Uniswap V4 pool key associated with this coin, providing identification parameters such as currencies, fee tier, tick spacing, and hooks.

```Solidity
function getPoolKey() external view returns (PoolKey memory);
```

--------------------------------

### Define GetProfile Parameters in TypeScript

Source: https://docs.zora.co/coins/sdk/queries/profile

This type definition outlines the parameters required for the `getProfile` function. It specifies the `identifier` property, which can be either a user's wallet address or their Zora handle, as a string.

```TypeScript
type GetProfileParams = {
  identifier: string;   // The user's wallet address or zora handle
};
```

--------------------------------

### Extract Deployed Zora Coin Address from Transaction Receipt

Source: https://docs.zora.co/coins/sdk/create-coin

Shows how to retrieve the deployed coin address from a transaction receipt's logs using the `getCoinCreateFromLogs` function from `@zoralabs/coins-sdk`. This is useful after a coin creation transaction is complete to identify the newly deployed coin's address.

```typescript
import { getCoinCreateFromLogs } from "@zoralabs/coins-sdk";

// Assuming you have a transaction receipt
const coinDeployment = getCoinCreateFromLogs(receipt);
console.log("Deployed coin address:", coinDeployment?.coin);
```

--------------------------------

### Basic ZORA Coin Metadata JSON Format

Source: https://docs.zora.co/coins/sdk/metadata

Defines the fundamental JSON structure for ZORA Coin metadata, including `name`, `description`, `image`, and `properties`. This format is based on EIP-7572, EIP-721, and EIP-1155 standards.

```JSON
{
  "name": "horse",
  "description": "boundless energy",
  "image": "ipfs://bafkreifch6stfh3fn3nqv5tpxnknjpo7zulqav55f2b5pryadx6hldldwe",
  "properties": {
    "category": "social"
  }
}
```

--------------------------------

### CoinPayoutRecipientUpdated Event Definition

Source: https://docs.zora.co/coins/contracts/coin

Defines the `CoinPayoutRecipientUpdated` event, emitted when the payout recipient for a coin is updated. It includes the caller's address, the previous recipient, and the new recipient, tracking changes in reward distribution.

```Solidity
event CoinPayoutRecipientUpdated(
    address indexed caller,
    address indexed prevRecipient,
    address indexed newRecipient
);
```

--------------------------------

### Describe GetProfile Response Structure in TypeScript

Source: https://docs.zora.co/coins/sdk/queries/profile

This type definition details the structure of the `profile` object returned by the `getProfile` function. It includes properties such as `address`, `handle`, `displayName`, `bio`, `joinedAt`, `profileImage` (with different sizes), and `linkedWallets` for connected social accounts.

```TypeScript
type ProfileData = {
  profile?: {
    address?: string;         // User's wallet address
    handle?: string;          // Username/handle
    displayName?: string;     // User's display name
    bio?: string;             // User's biography/description
    joinedAt?: string;        // When the user joined
    profileImage?: {          // Profile image data
      small?: string;         // Small version of profile image
      medium?: string;        // Medium version of profile image
      blurhash?: string;      // Blurhash for image loading
    };
    linkedWallets?: Array<{     // Connected social accounts
      type?: string;
      url?: string;
    }>;
  }
}
```

--------------------------------

### Validate Zora Coin Metadata URI Content

Source: https://docs.zora.co/coins/sdk/create-coin

Illustrates how to validate the content of a metadata URI for Zora coins using the `validateMetadataURIContent` function from `@zoralabs/coins-sdk`. This function ensures the URI points to valid metadata following the expected structure, throwing an error if validation fails.

```typescript
import { validateMetadataURIContent } from "@zoralabs/coins-sdk";

// This will throw an error if the metadata is not valid
await validateMetadataURIContent(uri);
```

--------------------------------

### Predict Coin Contract Address (Solidity)

Source: https://docs.zora.co/coins/contracts/factory

This function allows you to predict the address of a coin contract before it's deployed. Useful for preparing integrations.

```Solidity
function coinAddress(
    address msgSender,
    string memory name,
    string memory symbol,
    bytes memory poolConfig,
    address platformReferrer,
    bytes32 coinSalt
) external view returns (address);
```

--------------------------------

### Extract Trade Events from Transaction Logs

Source: https://docs.zora.co/coins/sdk/trade-coin

Shows how to parse trade event details from a transaction receipt using the `getTradeFromLogs` function from `@zoralabs/coins-sdk`. It assumes a transaction receipt and trade direction are available to extract the relevant event data.

```typescript
const receipt: any = null;

// ---- cut -----
import { getTradeFromLogs } from "@zoralabs/coins-sdk";

// Assuming you have a transaction receipt and know the direction
const tradeEvent = getTradeFromLogs(receipt, "buy"); // or "sell"

if (tradeEvent) {
  console.log(tradeEvent);
  ///         ^?
}
```

--------------------------------

### ContractMetadataUpdated Event Definition

Source: https://docs.zora.co/coins/contracts/coin

Defines the `ContractMetadataUpdated` event, emitted when the contract's metadata URI is changed. It includes the caller's address, the new URI, and the contract's name, providing transparency on metadata updates.

```Solidity
event ContractMetadataUpdated(
    address indexed caller,
    string newURI,
    string name
);
```

--------------------------------

### Update Zora Coin Payout Recipient with Zora SDK

Source: https://docs.zora.co/coins/sdk/update-coin

This TypeScript code snippet demonstrates how to change the payout recipient for a Zora coin using the `@zoralabs/coins-sdk` and `viem` libraries. It sets up `viem` public and wallet clients, then invokes the `updatePayoutRecipient` function. The transaction must be signed by an account that is an owner of the specified coin, otherwise, it will revert with an `OnlyOwner` error.

```TypeScript
import { updatePayoutRecipient } from "@zoralabs/coins-sdk";
import { Address, Hex, createWalletClient, createPublicClient, http } from "viem";
import { base } from "viem/chains";

// Set up viem clients
const publicClient = createPublicClient({
  chain: base,
  transport: http("<RPC_URL>")
});

const walletClient = createWalletClient({
  account: "0x<YOUR_ACCOUNT>" as Hex, // Must be an owner of the coin
  chain: base,
  transport: http("<RPC_URL>")
});

// Update the payout recipient
const result = await updatePayoutRecipient({
  coin: "0xCoinContractAddress" as Address,
  newPayoutRecipient: "0xNewPayoutRecipientAddress" as Address
}, walletClient, publicClient);

console.log("Transaction hash:", result.hash);
console.log("Receipt:", result.receipt);
```

--------------------------------

### Validate ZORA Coin Metadata URI using SDK

Source: https://docs.zora.co/coins/sdk/metadata

Shows how to use the `validateMetadataURIContent` function from the `@zoralabs/coins-sdk` to validate a metadata URI. This function supports various URI schemes like HTTPS and IPFS. It will throw an error if the URI is invalid or its content cannot be validated, and return `true` upon successful validation.

```TypeScript
import { validateMetadataURIContent } from "@zoralabs/coins-sdk";

assertTrue(await validateMetadataURIContent("https://theme.wtf/metadata/metadata.json"));

// This will throw an error
await validateMetadataURIContent("data:foo");

// This will succeed :)
await validateMetadataURIContent("ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy");
```

--------------------------------

### Burn Tokens

Source: https://docs.zora.co/coins/contracts/coin

Allows users to permanently remove a specified amount of their own tokens from circulation, reducing the total supply.

```Solidity
function burn(uint256 amount) external;
```

--------------------------------

### Validate ZORA Coin Metadata URI

Source: https://docs.zora.co/coins/contracts/metadata

Illustrates the usage of `validateMetadataURIContent` from `@zoralabs/coins-sdk` to validate a metadata URI. It supports various URI schemes like HTTPS and IPFS, returning `true` for valid URIs and throwing an error for invalid ones.

```TypeScript
import { validateMetadataURIContent } from "@zoralabs/coins-sdk";

assertTrue(await validateMetadataURIContent("https://theme.wtf/metadata/metadata.json"));

// This will throw an error
await validateMetadataURIContent("data:foo");

// This will succeed :)
await validateMetadataURIContent("ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy");
```

--------------------------------

### Set Contract URI

Source: https://docs.zora.co/coins/contracts/coin

Updates the coin's metadata URI. This function is restricted and can only be called by an owner of the coin.

```Solidity
function setContractURI(string memory newURI) external onlyOwner;
```

--------------------------------

### ContractURIUpdated Event Definition

Source: https://docs.zora.co/coins/contracts/coin

Defines the `ContractURIUpdated` event, emitted when the contract's URI is updated. This event is specifically used for standards compliance with ERC7572, ensuring interoperability and discoverability.

```Solidity
event ContractURIUpdated();
```

--------------------------------

### Validate ZORA Coin Metadata JSON

Source: https://docs.zora.co/coins/contracts/metadata

Shows how to use the `validateMetadataJSON` function from the `@zoralabs/coins-sdk` to verify the structure and content of a ZORA Coin metadata JSON object. This function returns `true` for valid metadata and throws an error for invalid input.

```TypeScript
import { validateMetadataJSON } from "@zoralabs/coins-sdk";

validateMetadataJSON({
    name: "horse",
    description: "boundless energy",
    image: 123,
    foo: "bar"
})
```

--------------------------------

### Set Payout Recipient

Source: https://docs.zora.co/coins/contracts/coin

Updates the address designated to receive creator rewards. This function is restricted and can only be called by an owner of the coin.

```Solidity
function setPayoutRecipient(address newPayoutRecipient) external onlyOwner;
```

--------------------------------

### Validate ZORA Coin Metadata JSON using SDK

Source: https://docs.zora.co/coins/sdk/metadata

Demonstrates how to use the `validateMetadataJSON` function from the `@zoralabs/coins-sdk` to validate a metadata JSON object. This function performs schema validation and will throw an error if the metadata is invalid, returning `true` if it is valid.

```TypeScript
import { validateMetadataJSON } from "@zoralabs/coins-sdk";

validateMetadataJSON({
    name: "horse",
    description: "boundless energy",
    image: 123,
    foo: "bar"
})
```

=== COMPLETE CONTENT === This response contains all available snippets from this library. No additional content exists. Do not make further requests.