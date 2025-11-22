### Install Splits React SDK

Source: https://docs.splits.org/react

Install the Splits React SDK package using either yarn or npm.

```bash
yarn add @0xsplits/splits-sdk-react
```

```bash
npm install @0xsplits/splits-sdk-react
```

--------------------------------

### Swapper Integration Example (JavaScript)

Source: https://docs.splits.org/core/swapper

This example demonstrates how to interact with the Swapper contract using JavaScript, likely through a library like ethers.js. It shows how to initiate a flash swap by providing the necessary token, amount, and integrator details.

```JavaScript
const swapperAddress = "0x..."; // Swapper contract address
const swapperAbi = [...]; // Swapper contract ABI
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const swapperContract = new ethers.Contract(swapperAddress, swapperAbi, signer);

async function performFlashSwap() {
  const tokenToSwap = "0x..."; // Address of the token to swap
  const amountToSwap = ethers.utils.parseEther("1"); // Amount to swap
  const integratorAddress = "0x..."; // Address of the integrator
  const userData = "0x"; // Optional user data

  try {
    const tx = await swapperContract.flash(tokenToSwap, amountToSwap, integratorAddress, userData, {
      value: ethers.utils.parseEther("0.001") // Example ETH value if needed
    });
    await tx.wait();
    console.log("Flash swap successful!");
  } catch (error) {
    console.error("Flash swap failed:", error);
  }
}
```

--------------------------------

### SplitV2 SDK Usage Example

Source: https://docs.splits.org/core/split-v2

Provides an example of how to interact with SplitV2 contracts using its SDK. This typically involves creating splits, distributing funds, and managing recipients.

```JavaScript
import { SplitsSDK } from '@0xsplits/splits-sdk';

// Initialize the SDK (replace with your provider and chain ID)
const sdk = new SplitsSDK(window.ethereum, 1); // Example for Ethereum Mainnet

async function createAndDistribute() {
    const recipientAddresses = ['0x...', '0x...'];
    const recipientShares = [50, 50]; // Represents percentages

    // Create a new Split (e.g., PullSplit)
    const createTx = await sdk.createSplit({
        // Specify split type, e.g., 'pull'
        splitType: 'pull',
        // Provide recipient addresses and their shares
        recipients: recipientAddresses,
        shares: recipientShares,
        // Optionally specify a controller or metadata
    });

    console.log('Transaction hash for creating split:', createTx.hash);

    // Wait for the transaction to be mined
    await createTx.wait();

    const splitAddress = await sdk.getSplitAddress(createTx.hash); // Get the address of the created split

    // Distribute funds (e.g., ETH)
    const distributeTx = await sdk.distribute({ 
        splitAddress: splitAddress,
        // Specify token address (address(0) for ETH)
        tokenAddress: '0x0000000000000000000000000000000000000000',
        // Amount to distribute
        amount: '1000000000000000000' // 1 ETH in wei
    });

    console.log('Transaction hash for distributing funds:', distributeTx.hash);
}

createAndDistribute().catch(console.error);

```

--------------------------------

### Vesting SDK Example (JavaScript)

Source: https://docs.splits.org/core/vesting

This example demonstrates how to interact with the Vesting contract using a JavaScript SDK. It would typically involve setting up a contract instance and calling methods to manage vesting streams or release tokens.

```JavaScript
const { ethers } = require("ethers");
const { Vesting } = require("@splits/splits-sdk"); // Assuming SDK path

async function exampleVestingInteraction(signer) {
    const vestingAddress = "0x..."; // Replace with actual Vesting contract address
    const vestingContract = Vesting.attach(vestingAddress, signer);

    // Example: Releasing vested tokens for a specific token
    // const tokenAddress = "0x..."; // Replace with actual token address
    // try {
    //     const tx = await vestingContract.releaseVestedTokens(tokenAddress);
    //     await tx.wait();
    //     console.log("Vested tokens released successfully.");
    // } catch (error) {
    //     console.error("Error releasing vested tokens:", error);
    // }
}

// Usage example:
// const provider = new ethers.providers.JsonRpcProvider("YOUR_RPC_URL");
// const signer = provider.getSigner();
// exampleVestingInteraction(signer);
```

--------------------------------

### Waterfall Example Usage

Source: https://docs.splits.org/core/waterfall

Demonstrates practical examples of how to use the Waterfall contract, likely including deployment and interaction scenarios.

```link
https://github.com/splits/splits-monorepo/tree/main/apps/web/src/components/Waterfall
```

--------------------------------

### Install Splits SDK with Yarn

Source: https://docs.splits.org/sdk

This snippet shows how to install the Splits SDK using the Yarn package manager. It's a common first step for developers integrating the SDK into their projects.

```bash
yarn add @0xsplits/splits-sdk
```

--------------------------------

### Install SplitsKit

Source: https://docs.splits.org/splits-kit

Install the SplitsKit package using either yarn or npm. This command adds the necessary library to your project for using SplitsKit components and hooks.

```bash
yarn add @0xsplits/splits-kit
```

```bash
npm install @0xsplits/splits-kit
```

--------------------------------

### Initialize SplitsKit with Wagmi and SplitsProvider

Source: https://docs.splits.org/splits-kit

This example demonstrates how to set up the SplitsKit environment by wrapping your application with WagmiConfig and SplitsProvider. It includes configuring chains and clients for both wagmi and Splits.

```javascript
import { WagmiConfig, createConfig, configureChains, mainnet } from'wagmi'
import { SplitsProvider } from'@0xsplits/splits-sdk-react'
import { publicProvider } from'wagmi/providers/public'
import { DisplaySplit } from'@0xsplits/splits-kit'
import'@0xsplits/splits-kit/dist/styles.css'

const SPLIT_ADDRESS='0xF8843981e7846945960f53243cA2Fd42a579f719'

const { publicClient,webSocketPublicClient } =configureChains(
  [mainnet],
  [publicProvider()],
)

constsplitsConfig= {
  chainId:1,
  publicClient,
}

constwagmiConfig=createConfig({
  publicClient,
  webSocketPublicClient,
})

exportdefaultfunctionApp() {
  return (
    <WagmiConfigconfig={wagmiConfig}>
      <SplitsProviderconfig={splitsConfig}>
        <YourComponents />
      </SplitsProvider>
    </WagmiConfig>
  )
}

functionYourComponents() {
  return (
    <div>
      <DisplaySplitchainId={1} address={SPLIT_ADDRESS} />
    </div>
  )
}
```

--------------------------------

### Use Start Vest Hook

Source: https://docs.splits.org/react

Initiates the vesting process for allocated tokens. This hook provides a function to start the vesting and includes transaction status and error handling.

```javascript
const { startVest,status,txHash,error } =useStartVest()
```

--------------------------------

### Initialize TemplatesClient with SplitsClient

Source: https://docs.splits.org/sdk/templates

Demonstrates how to import and initialize the TemplatesClient, either directly or by accessing it through an existing SplitsClient instance. This setup is necessary before calling any template functions.

```typescript
import { TemplatesClient } from'@0xsplits/splits-sdk'
consttemplatesClient=newTemplatesClient({
  chainId,
  publicClient,
  walletClient,
})
```

```typescript
import { SplitsClient } from'@0xsplits/splits-sdk'
constsplitsClient=newSplitsClient({
  chainId,
  publicClient,
  walletClient,
  includeEnsNames,
  ensPublicClient,
})
consttemplatesClient=splitsClient.templates
```

--------------------------------

### Create Swapper Contract (JavaScript/TypeScript)

Source: https://docs.splits.org/sdk/swapper

Provides an example of how to use the `createSwapper` function to deploy a new Swapper contract. It details the required arguments, including beneficiary, tokenToBeneficiary, scaling factors, owner, and optional oracle parameters.

```javascript
const args = {
  beneficiary: '0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f',
  tokenToBeneficiary: '0x0000000000000000000000000000000000000000',
  defaultScaledOfferFactorPercent: 1,
  scaledOfferFactorOverrides: [
    {
      baseToken: '0x0000000000000000000000000000000000000000',
      quoteToken: '0x0000000000000000000000000000000000000000',
      scaledOfferFactorPercent: 0.1,
    },
  ],
  owner: '0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f',
  oracleParams: {
    address: '0x8E0E20Ea43A88214A0908F32Cd14395022e823A6',
  },
}
const response = await swapperClient.createSwapper(args)
```

--------------------------------

### Get Swapper Metadata

Source: https://docs.splits.org/sdk/data

Fetches all metadata for a swapper contract address on a given chain. Requires chainId and swapperAddress as input.

```javascript
constargs= {
  chainId:1,
  swapperAddress:'0x693C49a6296d90e8A8936Ad4836a680F551bb97d',
}
constresponse=awaitdataClient.getSwapperMetadata(args)
```

--------------------------------

### Get Controller

Source: https://docs.splits.org/sdk/splits-v1

Retrieves the controller address for a given `splitAddress`.

```javascript
constargs= {
  splitAddress:'0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
}
constresponse=awaitsplitsClient.getController(args)
```

--------------------------------

### Get Split Balance

Source: https://docs.splits.org/sdk/splits-v1

Retrieves the balance for a specified `splitAddress` and an optional `token`. If no token is provided, it returns the ETH balance.

```javascript
constargs= {
  splitAddress:'0x2ed6c4B5dA6378c7897AC67Ba9e43102Feb694EE',
  token:'0x64d91f12ece7362f91a6f8e7940cd55f05060b92',
}
constresponse=awaitsplitsClient.getSplitBalance(args)
```

--------------------------------

### Get New Potential Controller

Source: https://docs.splits.org/sdk/splits-v1

Retrieves the new potential controller address for a given `splitAddress`, which is the address that needs to accept control.

```javascript
constargs= {
  splitAddress:'0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
}
constresponse=awaitsplitsClient.getNewPotentialController(args)
```

--------------------------------

### Get Vesting Metadata

Source: https://docs.splits.org/sdk/data

Fetches all metadata for a vesting module contract address on a given chain. Requires chainId and the vestingModuleAddress.

```javascript
constargs= {
  chainId:1,
  vestingModuleAddress:'0x0aab2E1E7D7bb0CAb1c0A49A59DCEfe241aA2ba1',
}
constresponse=awaitdataClient.getVestingMetadata(args)
```

--------------------------------

### Start Vesting Streams

Source: https://docs.splits.org/sdk/vesting

Initiates vesting streams for specified tokens associated with a vesting module. It takes the vesting module address and an array of token addresses as arguments. The response contains events emitted for each token stream created.

```javascript
constargs= {
  vestingModuleAddress:'0x0aab2E1E7D7bb0CAb1c0A49A59DCEfe241aA2ba1',
  tokens: [
'0x0000000000000000000000000000000000000000',
'0x64d91f12ece7362f91a6f8e7940cd55f05060b92',
  ],
}
constresponse=awaitvestingClient.startVest(args)
```

--------------------------------

### Get Beneficiary

Source: https://docs.splits.org/sdk/vesting

Retrieves the beneficiary address associated with a specific vesting module address. Requires the vesting module address as input.

```javascript
const args = {
  vestingModuleAddress: '0x0aab2E1E7D7bb0CAb1c0A49A59DCEfe241aA2ba1',
};
const response = await vestingClient.getBeneficiary(args);
```

--------------------------------

### UniV3Oracle: Get Quote Amounts

Source: https://docs.splits.org/core/oracle

This snippet demonstrates how to retrieve quote amounts using the UniV3Oracle implementation, which leverages Uniswap v3 TWAP for asset pricing. It outlines the process of consulting the oracle with specific parameters to get price information.

```Solidity
function getQuoteAmounts(address pool, uint256 amountIn, uint256 amountOut) external view returns (uint256 quoteAmountOut, uint256 quoteAmountIn) {
    // Implementation details for consulting UniV3Pools
    // ...
    return (quoteAmountOut, quoteAmountIn);
}
```

--------------------------------

### Get Account Metadata

Source: https://docs.splits.org/sdk/data

Retrieves all metadata for a specified account address on a given chain. Requires chainId and accountAddress as arguments.

```javascript
constargs= {
  chainId:1,
  accountAddress:'0xF8843981e7846945960f53243cA2Fd42a579f719',
}
constresponse=awaitdataClient.getAccountMetadata(args)
```

--------------------------------

### Estimate Gas for Create Vesting Module

Source: https://docs.splits.org/sdk/vesting

Demonstrates how to estimate the gas required for the `createVestingModule` function. By accessing the `estimateGas` property of the vesting client, you can get the gas cost without executing the transaction.

```javascript
constargs= {
  beneficiary:'0x8904D1fBfc9c88792aaaE8f452ac57E1Ba2130fC',
  vestingPeriodSeconds:31536000,
}
constgasEstimate=awaitvestingClient.estimateGas.createVestingModule(args)
```

--------------------------------

### Get Vesting Period

Source: https://docs.splits.org/sdk/vesting

Fetches the vesting period in seconds for a given vesting module address. The input required is the vesting module address.

```javascript
const args = {
  vestingModuleAddress: '0x0aab2E1E7D7bb0CAb1c0A49A59DCEfe241aA2ba1',
};
const response = await vestingClient.getVestingPeriod(args);
```

--------------------------------

### Get Hash

Source: https://docs.splits.org/sdk/splits-v1

Retrieves the current hash for a given `splitAddress`.

```javascript
constargs= {
  splitAddress:'0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
}
constresponse=awaitsplitsClient.getHash(args)
```

--------------------------------

### Distribute Token, Withdraw Funds, and Distribute Liquid Split via Multicall

Source: https://docs.splits.org/sdk/multicall

This example demonstrates how to batch three distinct operations: distributing a token via a split, withdrawing funds, and distributing a token via a liquid split. It first generates the call data for each individual operation using the respective SDK clients and then combines these call data objects into a single multicall transaction.

```javascript
const splitDistributionArgs = {
  splitAddress: "0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9",
  token: "0x64d91f12ece7362f91a6f8e7940cd55f05060b92",
  distributorAddress: "0x2fa128274cfcf47afd4dc03cd3f2a59af09b6a72",
}
const splitDistributionCallData = await splitsClient.callData.distributeToken(splitDistributionArgs)
const withdrawArgs = {
  address: "0xb5Ce41320F3d486671918733BB3226E3981Db62b",
  tokens: ["0x64d91f12ece7362f91a6f8e7940cd55f05060b92"],
}
const withdrawCallData = await splitsClient.callData.withdrawFunds(withdrawArgs)
const liquidSplitDistributionArgs = {
  liquidSplitAddress: "0xb5Ce41320F3d486671918733BB3226E3981Db62b",
  token: "0x64d91f12ece7362f91a6f8e7940cd55f05060b92",
  distributorAddress: "0x2fa128274cfcf47afd4dc03cd3f2a59af09b6a72",
}
const liquidSplitDistributionCallData = await splitsClient.liquidSplits.callData.distributeToken(liquidSplitDistributionArgs)
const response = await splitsClient.multicall({
  calls: [splitDistributionCallData, withdrawCallData, liquidSplitDistributionCallData],
})
```

--------------------------------

### Create Recoup Waterfall Split

Source: https://docs.splits.org/sdk/templates

Provides an example of using the `createRecoup` function to create a new Waterfall contract with multiple tranches, including a tranche with percentage-based allocations. This function simplifies the process of setting up complex distribution waterfalls.

```typescript
constargs= {
  token:"0x0000000000000000000000000000000000000000"
  tranches: [
    {
      recipient:"0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f",
      size:5.2
    },
    {
      recipient:"0xc3313847E2c4A506893999f9d53d07cDa961a675",
      size:3
    },
    {
      recipient: {
        recipients: [
            {
                address:"0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f",
                percentAllocation:50
            },
            {
                address:"0xc3313847E2c4A506893999f9d53d07cDa961a675",
                percentAllocation:30
            },
            {
                address:"0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342",
                percentAllocation:20
            }
        ],
        distributorFeePercent:1
      }
    }
  ]
}
constresponse=awaittemplatesClient.createRecoup(args)
```

--------------------------------

### Create Waterfall Module

Source: https://docs.splits.org/sdk/waterfall

Provides an example of how to create a new Waterfall contract using the `createWaterfallModule` function. It details the required arguments, including the token address and a list of tranches with recipient addresses and sizes, as well as optional non-waterfall recipient.

```javascript
const args = {
  token: "0x0000000000000000000000000000000000000000"
  tranches: [
    {
      recipient: "0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f",
      size: 5.2 // Receives the first 5.2 eth
    },
    {
      recipient: "0xc3313847E2c4A506893999f9d53d07cDa961a675",
      size: 3 // Receives the next 3 eth
    },
    {
      recipient: "0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342",
    }
  ]
}
const response = await waterfallClient.createWaterfallModule(args)
```

--------------------------------

### Get TokenToBeneficiary from Swapper Contract

Source: https://docs.splits.org/sdk/swapper

Retrieves the token to beneficiary mapping for a specified swapper contract address. This is a read operation for Swapper contracts.

```javascript
const args = {
  swapperAddress: '0x693C49a6296d90e8A8936Ad4836a680F551bb97d',
};
const response = await swapperClient.getTokenToBeneficiary(args);
```

--------------------------------

### Get Token

Source: https://docs.splits.org/sdk/waterfall

Returns the token address associated with a given waterfall module address. This helps identify the asset being managed by the waterfall.

```javascript
const args = {
  waterfallModuleAddress: '0x8904D1fBfc9c88792aaaE8f452ac57E1Ba2130fC'
};
const response = await waterfallClient.getToken(args);
```

--------------------------------

### Get Split Metadata

Source: https://docs.splits.org/sdk/data

Fetches all metadata for a given split contract address on a specific chain. The function requires the chainId and the splitAddress.

```javascript
constargs= {
  chainId:1,
  splitAddress:'0xF8843981e7846945960f53243cA2Fd42a579f719',
}
constresponse=awaitdataClient.getSplitMetadata(args)
```

--------------------------------

### Get Pull Balance using waterfallClient

Source: https://docs.splits.org/sdk/waterfall

Demonstrates how to use the `waterfallClient.getPullBalance` method to fetch the withdrawal balance. It requires the `waterfallModuleAddress` and the recipient's `address` as arguments.

```javascript
const args = {
  waterfallModuleAddress: '0x8904D1fBfc9c88792aaaE8f452ac57E1Ba2130fC',
  address: '0x2fa128274cfcf47afd4dc03cd3f2a59af09b6a72'
};
const response = await waterfallClient.getPullBalance(args);
```

--------------------------------

### Get User Earnings

Source: https://docs.splits.org/sdk/data

Returns token balances for a user address, categorized into withdrawn and active balances. This provides a summary of a user's earnings within the protocol.

```javascript
const args = {
  chainId: 1,
  userAddress: '0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342'
};
const response = await dataClient.getUserEarnings(args);
```

--------------------------------

### Get Tranches

Source: https://docs.splits.org/sdk/waterfall

Fetches the list of recipients and their corresponding tranche thresholds for a given waterfall module address. This provides insight into the distribution structure.

```javascript
const args = {
  waterfallModuleAddress: '0x8904D1fBfc9c88792aaaE8f452ac57E1Ba2130fC'
};
const response = await waterfallClient.getTranches(args);
```

--------------------------------

### Get Owner

Source: https://docs.splits.org/sdk/liquid

Retrieves the owner's address for a given Liquid Split contract. This is essential for contract management and ownership verification.

```javascript
const args = {
  liquidSplitAddress: '0xb5Ce41320F3d486671918733BB3226E3981Db62b',
};
const response = await liquidSplitClient.getOwner(args);
```

--------------------------------

### Update Split Contract

Source: https://docs.splits.org/sdk/splits-v2

Provides an example of updating an existing mutable Split contract using the `updateSplit` method. It specifies the arguments needed, including the splitAddress, new recipients, and distributor fee, and describes the response which contains the emitted event.

```javascript
constargs= {
  splitAddress:"0x047ED5b8E8a7eDBd92FAF61f3117cAFE8c529ABb"
  recipients: {
    {
      address:"0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f";
      percentAllocation:50.0000
    },
    {
      address:"0xc3313847E2c4A506893999f9d53d07cDa961a675";
      percentAllocation:50.0000
    },
  }
  distributorFeePercent: 1.0000
  totalAllocationPercent: 100.0000
}
constresponse=awaitsplitsClient.updateSplit(args)
```

--------------------------------

### Get Non-Waterfall Recipient

Source: https://docs.splits.org/sdk/waterfall

Retrieves the address designated as the non-waterfall recipient for a specific waterfall module. If no such recipient was set, it returns the zero address.

```javascript
const args = {
  waterfallModuleAddress: '0x8904D1fBfc9c88792aaaE8f452ac57E1Ba2130fC'
};
const response = await waterfallClient.getNonWaterfallRecipient(args);
```

--------------------------------

### Get Beneficiary from Swapper Contract

Source: https://docs.splits.org/sdk/swapper

Retrieves the beneficiary address associated with a given swapper contract address. This function is part of the Swapper Reads utility.

```javascript
const args = {
  swapperAddress: '0x693C49a6296d90e8A8936Ad4836a680F551bb97d',
};
const response = await swapperClient.getBeneficiary(args);
```

--------------------------------

### Get Split Balance

Source: https://docs.splits.org/sdk/splits-v2

Retrieves the balance for a specific split address and token address, as well as the balance held in the warehouse. It requires both `splitAddress` and `tokenAddress` as arguments.

```javascript
const args = {
  splitAddress: '0x2ed6c4B5dA6378c7897AC67Ba9e43102Feb694EE',
  tokenAddress: '0x64d91f12ece7362f91a6f8e7940cd55f05060b92',
};
const response = await splitsClient.getSplitBalance(args);
```

--------------------------------

### Get Uri

Source: https://docs.splits.org/sdk/liquid

Fetches the Uniform Resource Identifier (URI) for a specified Liquid Split contract address. This can be used to retrieve metadata or related resources.

```javascript
const args = {
  liquidSplitAddress: '0xb5Ce41320F3d486671918733BB3226E3981Db62b',
};
const response = await liquidSplitClient.getUri(args);
```

--------------------------------

### Get Related Splits by Address

Source: https://docs.splits.org/sdk/data

Retrieves all Splits associated with a specific blockchain address. This function requires the chain ID and the address to query.

```javascript
const args = {
  chainId: 1,
  address: '0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342'
};
const response = await dataClient.getRelatedSplits(args);
```

--------------------------------

### Get Funds Pending Withdrawal

Source: https://docs.splits.org/sdk/waterfall

Returns the amount of funds that are pending withdrawal for a given waterfall module address. This is relevant for pull payment mechanisms.

```javascript
const args = {
  waterfallModuleAddress: '0x8904D1fBfc9c88792aaaE8f452ac57E1Ba2130fC'
};
const response = await waterfallClient.getFundsPendingWithdrawal(args);
```

--------------------------------

### Get Split Earnings

Source: https://docs.splits.org/sdk/data

Retrieves token balances for a specific split address. Similar to `getContractEarnings`, it supports fetching active balances and requires an `erc20TokenList` for non-Alchemy/Infura RPCs.

```javascript
const args = {
  chainId: 1,
  splitAddress: '0xF8843981e7846945960f53243cA2Fd42a579f719'
};
const response = await dataClient.getSplitEarnings(args);
```

--------------------------------

### Get Waterfall Metadata

Source: https://docs.splits.org/sdk/data

Retrieves all metadata for a waterfall module contract address on a specified chain. The function takes chainId and waterfallModuleAddress as arguments.

```javascript
constargs= {
  chainId:1,
  waterfallModuleAddress:'0x8904D1fBfc9c88792aaaE8f452ac57E1Ba2130fC',
}
constresponse=awaitdataClient.getWaterfallMetadata(args)
```

--------------------------------

### Initialize SwapperClient (JavaScript/TypeScript)

Source: https://docs.splits.org/sdk/swapper

Demonstrates how to import and initialize the SwapperClient from the Splits SDK. It shows the necessary parameters such as chainId, publicClient, walletClient, and API key configuration for interacting with the Splits GraphQL API.

```javascript
import { SwapperClient } from'@0xsplits/splits-sdk'
const swapperClient = new SwapperClient({
  chainId,
  publicClient, // viem public client (optional, required if using any of the contract functions)
  walletClient, // viem wallet client (optional, required if using any contract write functions. must have an account already attached)
  includeEnsNames, // boolean, defaults to false. If true, will return ens names for any swapper owner or beneficiary (only for mainnet)
  // If you want to return ens names on chains other than mainnet, you can pass in a mainnet public client
  // here. Be aware though that the ens name may not necessarily resolve to the proper address on the
  // other chain for non EOAs (e.g. Gnosis Safe's)
  ensPublicClient, // viem public client (optional)
  apiConfig: {
    apiKey: string // You can create an API key by signing up on our app, and accessing your account settings at app.splits.org/settings.
  }, // Splits GraphQL API key config, this is required for the data client to access the splits graphQL API.
})
```

--------------------------------

### Get Distributor Fee

Source: https://docs.splits.org/sdk/liquid

Retrieves the distributor fee for a specified Liquid Split contract address. This function requires the address of the Liquid Split contract.

```javascript
const args = {
  liquidSplitAddress: '0xb5Ce41320F3d486671918733BB3226E3981Db62b',
};
const response = await liquidSplitClient.getDistributorFee(args);
```

--------------------------------

### Get EIP-712 Domain

Source: https://docs.splits.org/sdk/warehouse

Retrieves the EIP-712 domain information for the warehouse. This function does not require any arguments and returns the chain ID, name, salt, verifying contract address, and version.

```javascript
constresponse=awaitwarehouseClient.eip712Domain()
```

--------------------------------

### Get Oracle Address from Swapper Contract

Source: https://docs.splits.org/sdk/swapper

Fetches the oracle address used by a specific swapper contract. This function is part of the Swapper contract read utilities.

```javascript
const args = {
  swapperAddress: '0x693C49a6296d90e8A8936Ad4836a680F551bb97d',
};
const response = await swapperClient.getOracle(args);
```

--------------------------------

### Initialize Splits V2 Client

Source: https://docs.splits.org/sdk/splits-v2

Demonstrates how to import and initialize the SplitV2Client from the @0xsplits/splits-sdk. It outlines the necessary parameters such as chainId, publicClient, walletClient, includeEnsNames, ensPublicClient, and apiConfig with an API key.

```javascript
import { SplitV2Client } from'@0xsplits/splits-sdk'
constsplitsClient=newSplitV2Client({
  chainId,
  publicClient,// viem public client (optional, required if using any of the contract functions)
  walletClient,// viem wallet client (optional, required if using any contract write functions. must have an account already attached)
  includeEnsNames,// boolean, defaults to false. If true, will return ens names for any split recipient or controller (only for mainnet)
// If you want to return ens names on chains other than mainnet, you can pass in a mainnet public client
// here. Be aware though that the ens name may not necessarily resolve to the proper address on the
// other chain for non EOAs (e.g. Gnosis Safe's)
  ensPublicClient,// viem public client (optional)
  apiConfig: {
    apiKey: string // You can create an API key by signing up on our app, and accessing your account settings at app.splits.org/settings.
  },// Splits GraphQL API key config, this is required for the data client to access the splits graphQL API.
})
```

--------------------------------

### Get User Earnings by Contract

Source: https://docs.splits.org/sdk/data

Retrieves user token balances, broken down by the specific Splits contracts the user has received funds from. Optionally filters results by a list of contract addresses.

```javascript
const args = {
  chainId: 1,
  userAddress: '0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342'
};
const response = await dataClient.getUserEarningsByContract(args);
```

--------------------------------

### Get Liquid Split Metadata

Source: https://docs.splits.org/sdk/data

Retrieves all metadata associated with a liquid split contract address on a specified chain. Input parameters include chainId and liquidSplitAddress.

```javascript
constargs= {
  chainId:1,
  liquidSplitAddress:'0xb5Ce41320F3d486671918733BB3226E3981Db62b',
}
constresponse=awaitdataClient.getLiquidSplitMetadata(args)
```

--------------------------------

### Initialize SplitsClient V1

Source: https://docs.splits.org/sdk/splits-v1

Initializes the Splits V1 client with necessary configurations like chain ID, public/wallet clients, ENS name inclusion, and API key for GraphQL access.

```javascript
import { SplitsClient } from'@0xsplits/splits-sdk'
constsplitsClient=newSplitsClient({
  chainId,
  publicClient,
  walletClient,
  includeEnsNames,
  ensPublicClient,
  apiConfig: {
    apiKey: string
  },
}).splitV1
```

--------------------------------

### Get Distributed Funds

Source: https://docs.splits.org/sdk/waterfall

Retrieves the total amount of distributed funds for a specified waterfall module address. This read function helps in tracking fund allocation.

```javascript
const args = {
  waterfallModuleAddress: '0x8904D1fBfc9c88792aaaE8f452ac57E1Ba2130fC'
};
const response = await waterfallClient.getDistributedFunds(args);
```

--------------------------------

### Get Vested Amount

Source: https://docs.splits.org/sdk/vesting

Calculates and returns the vested amount for a specific vesting module address and stream ID. Requires both the vesting module address and the stream ID.

```javascript
const args = {
  vestingModuleAddress: '0x0aab2E1E7D7bb0CAb1c0A49A59DCEfe241aA2ba1',
  streamId: 0,
};
const response = await vestingClient.getVestedAmount(args);
```

--------------------------------

### Get Contract Earnings

Source: https://docs.splits.org/sdk/data

Fetches token balances for a given contract address. Optionally includes active balances and allows specifying a list of ERC20 tokens to track. If not using Alchemy or Infura, an `erc20TokenList` is required for active balance fetching.

```javascript
const args = {
  chainId: 1,
  contractAddress: '0xF8843981e7846945960f53243cA2Fd42a579f719'
};
const response = await dataClient.getContractEarnings(args);
```

--------------------------------

### Initialize VestingClient Directly

Source: https://docs.splits.org/sdk/vesting

Shows how to initialize the VestingClient directly, providing necessary configuration options such as chainId, publicClient, walletClient, and API key for GraphQL access. This method is useful if you only need to interact with vesting features.

```javascript
import { VestingClient } from'@0xsplits/splits-sdk'
constvestingClient=newVestingClient({
  chainId,
  publicClient,// viem public client (optional, required if using any of the contract functions)
  walletClient,// viem wallet client (optional, required if using any contract write functions. must have an account already attached)
  includeEnsNames,// boolean, defaults to false. If true, will return ens names for any vesting beneficiary (only for mainnet)
// If you want to return ens names on chains other than mainnet, you can pass in a mainnet public client
// here. Be aware though that the ens name may not necessarily resolve to the proper address on the
// other chain for non EOAs (e.g. Gnosis Safe's)
  ensPublicClient,// viem public client (optional)
  apiConfig: {
    apiKey: string // You can create an API key by signing up on our app, and accessing your account settings at app.splits.org/settings.
  },// Splits GraphQL API key config, this is required for the data client to access the splits graphQL API.
})
```

--------------------------------

### Get Balance Of

Source: https://docs.splits.org/sdk/warehouse

Retrieves the balance of a specific token owned by a given address. This function requires both the owner's address and the token address, returning the balance as a bigint.

```javascript
constargs= {
  ownerAddress:'0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
  tokenAddress:'0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
}
constresponse=awaitwarehouseClient.balanceOf(args)
```

--------------------------------

### Get Payout Split

Source: https://docs.splits.org/sdk/liquid

Fetches the payout split ID associated with a given Liquid Split contract address. This helps in identifying specific payout configurations.

```javascript
const args = {
  liquidSplitAddress: '0xb5Ce41320F3d486671918733BB3226E3981Db62b',
};
const response = await liquidSplitClient.getPayoutSplit(args);
```

--------------------------------

### Get Withdraw Configuration

Source: https://docs.splits.org/sdk/warehouse

Retrieves the withdraw configuration set by a specific user address. This function requires the user's address and returns their incentive and paused status.

```javascript
constargs= {
  userAddress:'0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
}
constresponse=awaitwarehouseClient.getWithdrawConfig(args)
```

--------------------------------

### Initialize SplitsProvider and Fetch Split Metadata

Source: https://docs.splits.org/react

Set up the SplitsProvider with a viem public client and chain configuration. Then, use the useSplitMetadata hook to fetch and display a Split's basic metadata, including its address, controller, fee, and recipients.

```javascript
import { createPublicClient, http } from'viem'
import { mainnet } from'viem/chains'
import { SplitsProvider, useSplitMetadata } from'@0xsplits/splits-sdk-react'

const SPLIT_ADDRESS='0xF8843981e7846945960f53243cA2Fd42a579f719'

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
})

const splitsConfig = {
  chainId: 1,
  publicClient,
}

function App() {
  return (
    <SplitsProvider config={splitsConfig}>
      <YourComponents />
    </SplitsProvider>
  )
}

function YourComponents() {
  const { splitMetadata, isLoading } = useSplitMetadata(1, SPLIT_ADDRESS)

  if (isLoading) return <div>Loading Split...</div>
  if (!splitMetadata) return <div>No Split found at address {SPLIT_ADDRESS}</div>

  return (
    <div>
      <div>Split: {splitMetadata.address}</div>
      {splitMetadata.controller ? (
        <div>Controlled by: {splitMetadata.controller.address}</div>
      ) : (
        <div>No controller, Split is immutable</div>
      )}
      <div>Distribution incentive: {splitMetadata.distributorFeePercent}%</div>
      <div>
        <div>Recipients</div>
        {splitMetadata.recipients.map((recipient) => (
          <div key={recipient.recipient.address}>{recipient.recipient.address}: {recipient.percentAllocation}%</div>
        ))}
      </div>
    </div>
  )
}
```

--------------------------------

### Get Token Symbol

Source: https://docs.splits.org/sdk/warehouse

Retrieves the symbol of the token associated with a given token address. This function requires the token address as input and returns the token's symbol.

```javascript
constargs= {
  tokenAddress:'0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
}
constresponse=awaitwarehouseClient.getSymbol(args)
```

--------------------------------

### Get Default Scaled Offer Factor from Swapper Contract

Source: https://docs.splits.org/sdk/swapper

Retrieves the default scaled offer factor for a given swapper contract address. This read operation helps in understanding the contract's offer parameters.

```javascript
const args = {
  swapperAddress: '0x693C49a6296d90e8A8936Ad4836a680F551bb97d',
};
const response = await swapperClient.getDefaultScaledOfferFactor(args);
```

--------------------------------

### Get Token Name

Source: https://docs.splits.org/sdk/warehouse

Retrieves the name of the token associated with a given token address. This function requires the token address as input and returns the token's name.

```javascript
constargs= {
  tokenAddress:'0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
}
constresponse=awaitwarehouseClient.getName(args)
```

--------------------------------

### Initialize SplitsProvider

Source: https://docs.splits.org/react

Wrap your application with the SplitsProvider component to manage context for all splits hooks. Optionally, provide a splitsConfig object to initialize the SplitsClient.

```javascript
import { SplitsProvider } from'@0xsplits/splits-sdk-react'

const splitsConfig = {
  chainId: 1,
}

function App() {
  return (
    <SplitsProvider config={splitsConfig}>
      <YourComponents />
    </SplitsProvider>
  )
}

function YourComponents() {
  return <div>Hello World</div>
}
```

--------------------------------

### Get Token Decimals

Source: https://docs.splits.org/sdk/warehouse

Retrieves the number of decimals for the token associated with a given token address. This function requires the token address as input and returns the token's decimal places.

```javascript
constargs= {
  tokenAddress:'0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
}
constresponse=awaitwarehouseClient.getDecimals(args)
```

--------------------------------

### Get Scaled Percent Balance Of Address

Source: https://docs.splits.org/sdk/liquid

Calculates and returns the current scaled percentage balance of a specific address within a Liquid Split contract. This is useful for tracking proportional ownership.

```javascript
const args = {
  liquidSplitAddress: '0xb5Ce41320F3d486671918733BB3226E3981Db62b',
  address: '0x2fa128274cfcf47afd4dc03cd3f2a59af09b6a72',
};
const response = await liquidSplitClient.getScaledPercentBalanceOf(args);
```

--------------------------------

### Initialize SplitsClient Data Client

Source: https://docs.splits.org/sdk/data

Initializes the SplitsClient data client with configuration options including chainId, Viem clients, ENS name resolution, and API key for GraphQL access.

```javascript
import { SplitsClient } from'@0xsplits/splits-sdk'
constdataClient=newSplitsClient({
  chainId,
  publicClient,
  walletClient,
  includeEnsNames,
  ensPublicClient,
  apiConfig: {
    apiKey: string
  },
}).dataClient
```

```javascript
constdataClient=newDataClient({
  chainId,
  publicClient,
  walletClient,
  includeEnsNames,
  ensPublicClient,
  apiConfig,
})
```

--------------------------------

### Get Allowance

Source: https://docs.splits.org/sdk/warehouse

Returns the allowance granted from an owner address to a spender address for a specific token. This function requires the owner's address, the token address, and the spender's address, returning the allowance as a bigint.

```javascript
constargs= {
  ownerAddress:'0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
  tokenAddress:'0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
  spenderAddress:'0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
}
constresponse=awaitwarehouseClient.allowance(args)
```

--------------------------------

### Get Vested and Unreleased Amount

Source: https://docs.splits.org/sdk/vesting

Retrieves the total vested amount that has not yet been released for a given vesting module address and stream ID. Inputs include the vesting module address and stream ID.

```javascript
const args = {
  vestingModuleAddress: '0x0aab2E1E7D7bb0CAb1c0A49A59DCEfe241aA2ba1',
  streamId: 0,
};
const response = await vestingClient.getVestedAndUnreleasedAmount(args);
```

--------------------------------

### Initialize WaterfallClient with Splits SDK

Source: https://docs.splits.org/sdk/waterfall

Demonstrates how to initialize the WaterfallClient directly or by accessing it through an existing SplitsClient instance. It outlines the necessary parameters like chainId, publicClient, walletClient, and API configuration.

```javascript
import { WaterfallClient } from'@0xsplits/splits-sdk'
const waterfallClient = new WaterfallClient({
  chainId,
  publicClient, // viem public client (optional, required if using any of the contract functions)
  walletClient, // viem wallet client (optional, required if using any contract write functions. must have an account already attached)
  includeEnsNames, // boolean, defaults to false. If true, will return ens names for any waterfall recipient (only for mainnet)
  // If you want to return ens names on chains other than mainnet, you can pass in a mainnet public client
  // here. Be aware though that the ens name may not necessarily resolve to the proper address on the
  // other chain for non EOAs (e.g. Gnosis Safe's)
  ensPublicClient, // viem public client (optional)
  apiConfig: {
    apiKey: string // You can create an API key by signing up on our app, and accessing your account settings at app.splits.org/settings.
  }, // Splits GraphQL API key config, this is required for the data client to access the splits graphQL API.
})
```

```javascript
import { SplitsClient } from'@0xsplits/splits-sdk'
const splitsClient = new SplitsClient({
  chainId,
  publicClient,
  walletClient,
  includeEnsNames,
  ensPublicClient,
})
const waterfallClient = splitsClient.waterfall
```

--------------------------------

### Initialize VestingClient with SplitsClient

Source: https://docs.splits.org/sdk/vesting

Demonstrates how to access the VestingClient through an existing SplitsClient instance. This is a convenient way to manage vesting functionalities if you are already using the SplitsClient for other operations.

```javascript
import { SplitsClient } from'@0xsplits/splits-sdk'
constsplitsClient=newSplitsClient({
  chainId,
  publicClient,
  walletClient,
  includeEnsNames,
  ensPublicClient,
})
constvestingClient=splitsClient.vesting
```

--------------------------------

### Initialize SwapperClient via SplitsClient (JavaScript/TypeScript)

Source: https://docs.splits.org/sdk/swapper

Shows an alternative method to access the SwapperClient by initializing the SplitsClient first and then accessing the swapper property. This is useful if you are already using the SplitsClient in your application.

```javascript
import { SplitsClient } from'@0xsplits/splits-sdk'
const splitsClient = new SplitsClient({
  chainId,
  publicClient,
  walletClient,
  includeEnsNames,
  ensPublicClient,
})
const swapperClient = splitsClient.swapper
```

--------------------------------

### UniV3 Flash Swap Execution (JavaScript/TypeScript)

Source: https://docs.splits.org/sdk/swapper

Demonstrates how to perform a flash swap using the `uniV3FlashSwap` function, which leverages UniswapV3 integration. It includes parameters for the swapper address, input assets with encoded paths and amounts, and optional excess recipient and time limit.

```javascript
const args = {
  swapperAddress: '0x693C49a6296d90e8A8936Ad4836a680F551bb97d',
  inputAssets: [
    {
      encodedPath:
        '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d60001f41f9840a85d5af5bf1d1762f925bdaddc4201f984',
      token: 0x0000000000000000000000000000000000000000,
      amountIn: BigInt('100000000000000000'),
      amountOutMin: BigInt('1000000000'),
    },
  ],
}
const response = await swapperClient.uniV3FlashSwap(args)
```

--------------------------------

### Create Diversifier with Arguments

Source: https://docs.splits.org/sdk/templates

Demonstrates how to call the createDiversifier function with specific arguments, including owner, oracle parameters, and recipient details with optional swapper configurations. The response includes the passThroughWalletAddress and the emitted event.

```javascript
constargs= {
  owner:"0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f",
  oracleParams: {
    address:"0x8E0E20Ea43A88214A0908F32Cd14395022e823A6",
  },
  recipients: [
    {
      address:"0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f",
      percentAllocation:60
    },
    {
      swapperParams: {
        beneficiary:"0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f",
        tokenToBeneficiary:"0x0000000000000000000000000000000000000000",
        defaultScaledOfferFactorPercent:1,
        scaledOfferFactorOverrides: [
          {
            baseToken:"0x0000000000000000000000000000000000000000",
            quoteToken:"0x0000000000000000000000000000000000000000",
            scaledOfferFactorPercent:0.1,
          }
        ],
      },
      percentAllocation:40
    }
  ]
};
constresponse=awaittemplatesClient.createDiversifier(args);
```

--------------------------------

### Swapper Contract Functions (Solidity)

Source: https://docs.splits.org/core/swapper

This snippet outlines the core functions of the Swapper smart contract, including initialization, flash swaps, and retrieving quote amounts. It details the interactions between the Swapper, Beneficiary, Oracle, and Trader during a flash swap.

```Solidity
contract Swapper {
    // ... other state variables and functions

    constructor(address _beneficiary, address _outputToken, address _oracle, uint256 _discount) payable {}

    function flash(address _token, uint256 _amount, address _integrator, bytes calldata _data) external payable returns (bool)

    function flashCallback(address _token, uint256 _amount, uint256 _fee) external

    function getQuoteAmounts(address _token, uint256 _amount) external view returns (uint256 amountOut, uint256 fee)
}
```

--------------------------------

### Generate Call Data for Create Swapper

Source: https://docs.splits.org/sdk/swapper

Generates call data for the create swapper function. This involves defining arguments such as beneficiary, tokenToBeneficiary, offer factors, owner, and oracle parameters.

```javascript
const args = {
  beneficiary: '0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f',
  tokenToBeneficiary: '0x0000000000000000000000000000000000000000',
  defaultScaledOfferFactorPercent: 1,
  scaledOfferFactorOverrides: [
    {
      baseToken: '0x0000000000000000000000000000000000000000',
      quoteToken: '0x0000000000000000000000000000000000000000',
      scaledOfferFactorPercent: 0.1,
    },
  ],
  owner: '0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f',
  oracleParams: {
    address: '0x8E0E20Ea43A88214A0908F32Cd14395022e823A6',
  },
};
const callData = await swapperClient.callData.createSwapper(args);
```

--------------------------------

### Initialize LiquidSplitClient (JavaScript/TypeScript)

Source: https://docs.splits.org/sdk/liquid

Demonstrates how to initialize the LiquidSplitClient, which is used for interacting with Liquid Splits. It can be initialized directly or accessed via an existing SplitsClient instance. Configuration options include chain ID, Viem clients, ENS name inclusion, and API key for the GraphQL API.

```typescript
import { LiquidSplitClient } from'@0xsplits/splits-sdk'

const liquidSplitClient = new LiquidSplitClient({
  chainId,
  publicClient, // viem public client (optional, required if using any of the contract functions)
  walletClient, // viem wallet client (optional, required if using any contract write functions. must have an account already attached)
  includeEnsNames, // boolean, defaults to false. If true, will return ens names for any liquid split holder (only for mainnet)
  // If you want to return ens names on chains other than mainnet, you can pass in a mainnet public client
  // here. Be aware though that the ens name may not necessarily resolve to the proper address on the
  // other chain for non EOAs (e.g. Gnosis Safe's)
  ensPublicClient, // viem public client (optional)
  apiConfig: {
    apiKey: string // You can create an API key by signing up on our app, and accessing your account settings at app.splits.org/settings.
  }, // Splits GraphQL API key config, this is required for the data client to access the splits graphQL API.
});
```

```typescript
import { SplitsClient } from'@0xsplits/splits-sdk'

const splitsClient = new SplitsClient({
  chainId,
  publicClient,
  walletClient,
  includeEnsNames,
  ensPublicClient,
});

const liquidSplitClient = splitsClient.liquidSplits;
```

--------------------------------

### Create Split Contract

Source: https://docs.splits.org/sdk/splits-v2

Shows how to create a new Split contract using the `createSplit` method. It details the required arguments like recipients, distributorFeePercent, and ownerAddress, and explains the optional parameters such as salt and chainId. The response includes the splitAddress and the emitted event.

```javascript
constargs= {
  recipients: [
    {
      address:"0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f",
      percentAllocation:50.0000
    },
    {
      address:"0xc3313847E2c4A506893999f9d53d07cDa961a675",
      percentAllocation:50.0000
    }
  ],
  distributorFeePercent:1.0000,
  totalAllocationPercent:100.0000,
  splitType:SplitV2Type.Push,
  ownerAddress:"0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342",
  creatorAddress:"0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342",
  salt:"0x0000000000000000000000000000000000000000000000000000000000000000",
  chainId:1
}
constresponse=awaitsplitsClient.createSplit(args)
```

--------------------------------

### Use Create Swapper Hook

Source: https://docs.splits.org/react

Provides functionality to create a swapper, likely for facilitating token exchanges. The hook returns a function to initiate the creation and tracks the transaction status.

```javascript
const { createSwapper,status,txHash,error } =useCreateSwapper()
```

--------------------------------

### Estimate Gas for Create Swapper

Source: https://docs.splits.org/sdk/swapper

Estimates the gas required for creating a new swapper. This is done via the `estimateGas` property of the swapper client. It requires parameters like beneficiary, tokenToBeneficiary, defaultScaledOfferFactorPercent, scaledOfferFactorOverrides, owner, and oracle parameters.

```javascript
constargs= {
  beneficiary:'0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f',
  tokenToBeneficiary:'0x0000000000000000000000000000000000000000',
  defaultScaledOfferFactorPercent:1,
  scaledOfferFactorOverrides: [
    {
      baseToken:'0x0000000000000000000000000000000000000000',
      quoteToken:'0x0000000000000000000000000000000000000000',
      scaledOfferFactorPercent:0.1,
    },
  ],
  owner:'0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f',
  oracleParams: {
    address:'0x8E0E20Ea43A88214A0908F32Cd14395022e823A6',
  },
}
constgasEstimate=awaitswapperClient.estimateGas.createSwapper(args)
```

--------------------------------

### useSplitsClient - Initialize Splits Client

Source: https://docs.splits.org/react

Initializes and returns the SplitsClient instance used across all hooks. It requires chainId, publicClient, walletClient, and optionally includeEnsNames and ensPublicClient. The apiConfig with an apiKey is mandatory for the data client.

```javascript
const args = {
  chainId,
  publicClient, // viem public client
  walletClient, // viem wallet client (must have an account already attached)
  includeEnsNames, // boolean, defaults to false. If true, will return ens names for any recipient (only for mainnet)
  // If you want to return ens names on chains other than mainnet, you can pass in a mainnet public client
  // here. Be aware though that the ens name may not necessarily resolve to the proper address on the
  // other chain for non EOAs (e.g. Gnosis Safe's)
  ensPublicClient, // viem public client (optional)
  apiConfig: {
    apiKey: string // You can create an API key by signing up on our app, and accessing your account settings at app.splits.org/settings.
  }, // Splits GraphQL API key config, this is required for the data client to access the splits graphQL API.
};
const splitsClient = useSplitsClient(args);
```

--------------------------------

### Initialize Warehouse Client (JavaScript)

Source: https://docs.splits.org/sdk/warehouse

Initializes the WarehouseClient from the Splits SDK. This client is used to interact with the Splits protocol's warehouse contract. It requires chain ID, optional Viem clients for public and wallet operations, and API configuration for GraphQL access. It also supports ENS name resolution.

```javascript
import { WarehouseClient } from'@0xsplits/splits-sdk'
constwarehouseClient=newWarehouseClient({
  chainId,
  publicClient,// viem public client (optional, required if using any of the contract functions)
  walletClient,// viem wallet client (optional, required if using any contract write functions. must have an account already attached)
  includeEnsNames,// boolean, defaults to false. If true, will return ens names for any split recipient or controller (only for mainnet)
// If you want to return ens names on chains other than mainnet, you can pass in a mainnet public client
// here. Be aware though that the ens name may not necessarily resolve to the proper address on the
// other chain for non EOAs (e.g. Gnosis Safe's)
  ensPublicClient,// viem public client (optional)
  apiConfig: {
    apiKey: string // You can create an API key by signing up on our app, and accessing your account settings at app.splits.org/settings.
  },// Splits GraphQL API key config, this is required for the data client to access the splits graphQL API.
})
```

--------------------------------

### CreateSplit Component Usage

Source: https://docs.splits.org/splits-kit

Demonstrates the usage of the CreateSplit component, including its various props for customization such as default distributor fee, controller address, recipients, and display/theme options. It also includes an onSuccess callback.

```javascript
<CreateSplit
chainId={1}
defaultDistributorFee={0.1} // defaults to 0.1
defaultController="0x0000000000000000000000000000000000000000"// defaults to 0x0000000000000000000000000000000000000000
defaultRecipients={[
    {
      address:'',
      percentAllocation:0,
    },
  ]} // defaults to [[{address: "",percentAllocation: 0,},]]
displayChain={false} // defaults to true
width="sm"// defaults to "md"
theme="dark"// defaults to "system"
onSuccess={() => {}} // called when the split is successfully created
/>
```

--------------------------------

### Execute Calls with Swapper Client

Source: https://docs.splits.org/sdk/swapper

Executes a list of calls using the Swapper client. This function is restricted to the Swapper owner. It requires the swapper's address and an array of calls, each specifying the target address, value, and data.

```javascript
constargs= {
  swapperAddress:'0x693C49a6296d90e8A8936Ad4836a680F551bb97d',
  calls: [
    {
      to:'0x2fa128274cfcf47afd4dc03cd3f2a59af09b6a72',
      value:BigInt(1),
      data:'0x0',
    },
  ],
}
constresponse=awaitswapperClient.execCalls(args)
```

--------------------------------

### Splits SDK Constants

Source: https://docs.splits.org/sdk/utils

Access all constants used within the Splits SDK, including ABI files, from the designated constants directory. This simplifies referencing common values and contract interfaces.

```JavaScript
import { constants } from '@0xsplits/splits-sdk';
// Access constants like:
// constants.SOME_CONSTANT

import { abi } from '@0xsplits/splits-sdk/constants/abi';
// Access ABI files like:
// abi.SOME_ABI_FILE
```

--------------------------------

### Split SDK: Interact with Split Contracts

Source: https://docs.splits.org/core/split

The Splits SDK provides tools to interact with Split contracts, including creating new splits, distributing funds, and withdrawing assets. It simplifies the process of managing equity distributions on the blockchain.

```JavaScript
import { SplitsClient } from "@splits.xyz/splits-sdk";

const splitsClient = new SplitsClient({
  network: 1, // Ethereum mainnet
  connection: { // Optional: specify provider URL or EIP-1193 provider
    url: "YOUR_PROVIDER_URL"
  }
});

async function createSplit() {
  const recipients = ["0x..."];
  const shares = [100]; // Represents 100% ownership

  const tx = await splitsClient.createSplit({ 
    split: {
      wallet: "0x...", // Split wallet address
      recipients: recipients,
      shares: shares
    }
  });
  await tx.wait();
  console.log("Split created successfully!");
}

async function distributeTokens() {
  const splitAddress = "0x...";
  const tokenAddress = "0x..."; // ERC20 token address

  const tx = await splitsClient.distributeTokens({ 
    splitAddress: splitAddress,
    tokenAddress: tokenAddress
  });
  await tx.wait();
  console.log("Tokens distributed successfully!");
}
```

--------------------------------

### Use Create Vesting Module Hook

Source: https://docs.splits.org/react

Facilitates the creation of a vesting module for managing token releases over time. The hook returns a function to set up the vesting schedule and tracks the transaction.

```javascript
const { createVestingModule,status,txHash,error } =useCreateVestingModule()
```

--------------------------------

### Swapper Data Structure

Source: https://docs.splits.org/sdk/data

Defines the structure for a Swapper, including its address, beneficiary, token details, owner, pause status, and scaled offer factor configurations.

```json
{
  type: 'Swapper'
  address: string
  beneficiary: {
    address: string
    ens?: string
  }
  tokenToBeneficiary: {
    address: string
  }
  owner: {
    address: string
    ens?: string
  }
  paused: boolean
  defaultScaledOfferFactorPercent: number
  scaledOfferFactorOverrides: {
    baseToken: {
      address: string
    }
    quoteToken: {
      address: string
    }
    scaledOfferFactorPercent: number
  }[]
}
```

--------------------------------

### DisplaySplit Component Usage

Source: https://docs.splits.org/splits-kit

Shows how to use the DisplaySplit component to view split details and manage balances. It requires a valid chainId and split address, and can be configured with options for displaying balances, chain information, and theme. Includes onSuccess and onError callbacks.

```javascript
<DisplaySplit
chainId={1}
address={SPLIT_ADDRESS}
displayBalances={false} // defaults to true
displayChain={false} // defaults to true
width="sm"// defaults to "md"
theme="dark"// defaults to "system"
onSuccess={() => {}} // called when the split is successfully distributed
onError={() => {}} // called when the split fails to distribute
/>
```

--------------------------------

### Use Swapper Exec Calls Hook

Source: https://docs.splits.org/react

Allows the execution of multiple calls through a swapper contract. The hook provides a function to send the calls and includes transaction status tracking.

```javascript
const { execCalls,status,txHash,error } =useSwapperExecCalls()
```

--------------------------------

### VestingModule Data Structure

Source: https://docs.splits.org/sdk/data

Defines the structure for a VestingModule, including its address, beneficiary, vesting period, and an optional list of vesting streams with their details.

```json
{
  type: 'VestingModule'
  address: string
  beneficiary: {
    address: string
    ens?: string
  }
  vestingPeriod: number
  streams?: {
    streamId: number
    startTime: number
    totalAmount: number
    releasedAmount: number
    token: {
      address: string
      symbol?: string
      decimals?: number
    }
  }[]
}
```

--------------------------------

### Create Vesting Module

Source: https://docs.splits.org/sdk/vesting

This function creates a new Vesting contract. It requires the beneficiary's address and the vesting period in seconds. The response includes the address of the newly created vesting module and the emitted event.

```javascript
constargs= {
  beneficiary:'0x8904D1fBfc9c88792aaaE8f452ac57E1Ba2130fC',
  vestingPeriodSeconds:31536000,
}
constresponse=awaitvestingClient.createVestingModule(args)
```

--------------------------------

### Use Uni V3 Flash Swap Hook

Source: https://docs.splits.org/react

Enables performing flash swaps using Uniswap V3. This hook returns a function for executing the flash swap and provides transaction details.

```javascript
const { uniV3FlashSwap,status,txHash,error } =useUniV3FlashSwap()
```

--------------------------------

### Use Swapper Set Token To Beneficiary Hook

Source: https://docs.splits.org/react

Allows setting a specific token to be directed to a beneficiary via the swapper. The hook provides a function for this configuration and tracks the transaction.

```javascript
const { setTokenToBeneficiary,status,txHash,error } =useSwapperSetTokenToBeneficiary()
```

--------------------------------

### Generate Call Data for Create Vesting Module

Source: https://docs.splits.org/sdk/vesting

Illustrates how to generate the raw call data for the `createVestingModule` function. Using the `callData` property allows you to prepare transaction data that can be sent through other means, such as a multisig wallet.

```javascript
constargs= {
  beneficiary:'0x8904D1fBfc9c88792aaaE8f452ac57E1Ba2130fC',
  vestingPeriodSeconds:31536000,
}
constcallData=awaitvestingClient.callData.createVestingModule(args)
```

--------------------------------

### Create Waterfall Contract

Source: https://docs.splits.org/core/waterfall

Provides a link to create a new Waterfall contract. This is the primary method for initiating a Waterfall distribution.

```link
https://waterfall.new
```

--------------------------------

### Splits Core Contracts: Fund Distribution Logic

Source: https://docs.splits.org/core

Explains the three-step process for moving funds through the Splits protocol: receiving assets, distributing them with a fee, and withdrawing balances. This logic is common across various split contract versions.

```Solidity
/*
  1. Receive : ETH and ERC20 tokens flow into the contract via `send`, `transfer`, or `call` and the contract's balance increases.
  2. Distribute : Once a contract has a positive balance, anyone can call `distribute`, `distributeETH` or `distributeERC20` depending on the version of the split and earn the distributor fee.
  3. Withdraw : Anyone can call `withdraw` at any time for any account, thereby pushing that account's balance out of SplitWarehouse or SplitMain to the account.
*/

// Example function signatures (actual implementation would vary based on contract version)

// function send(address tokenAddress, uint256 amount) external payable;
// function transfer(address tokenAddress, uint256 amount) external payable;
// function call(address tokenAddress, uint256 amount) external payable;

// function distribute(address account) external;
// function distributeETH(address account) external payable;
// function distributeERC20(address tokenAddress, address account) external;

// function withdraw(address account) external;
```

--------------------------------

### useMakeSplitImmutable Hook

Source: https://docs.splits.org/react

Provides a React hook for the `makeSplitImmutable` function. It returns the `makeSplitImmutable` function and transaction status properties such as `status`, `txHash`, and `error`.

```javascript
const { makeSplitImmutable,status,txHash,error } =useMakeSplitImmutable()
```

--------------------------------

### Create Split Contract

Source: https://docs.splits.org/sdk/splits-v1

Creates a new Split contract with specified recipients, percentage allocations, distributor fee, and an optional controller. Returns the address of the created split and the emitted event.

```javascript
constargs= {
  recipients: [
    {
      address:'0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f',
      percentAllocation:50.0,
    },
    {
      address:'0xc3313847E2c4A506893999f9d53d07cDa961a675',
      percentAllocation:50.0,
    },
  ],
  distributorFeePercent:1.0,
  controller:'0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342',
}
constresponse=awaitsplitsClient.createSplit(args)
```

--------------------------------

### Distribute Funds from Split

Source: https://docs.splits.org/sdk/splits-v2

Illustrates how to distribute funds from a Split contract using the `distribute` method. It details the required parameters: splitAddress, tokenAddress, and optionally distributorAddress. The response indicates the emitted SplitDistributed event.

```javascript
constargs= {
  splitAddress:"0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9",
  tokenAddress:"0x64d91f12ece7362f91a6f8e7940cd55f05060b92",
  distributorAddress:"0x2fa128274cfcf47afd4dc03cd3f2a59af09b6a72"
}
constresponse=awaitsplitsClient.distribute(args)
```

--------------------------------

### Waterfall GitHub Repository

Source: https://docs.splits.org/core/waterfall

Links to the official GitHub repository for the Waterfall smart contract, allowing users to view the source code, contribute, or report issues.

```link
https://github.com/splits/splits-monorepo/tree/main/contracts/Waterfall
```

--------------------------------

### Estimate Gas for Split Creation

Source: https://docs.splits.org/sdk/splits-v2

Estimates the gas required for creating a split. This method is accessed via the `estimateGas` property of the client and takes recipient information, distributor fee percentage, and owner address as input.

```javascript
const args = {
  recipients: [
    {
      address: "0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f",
      percentAllocation: 50.0000,
    },
    {
      address: "0xc3313847E2c4A506893999f9d53d07cDa961a675",
      percentAllocation: 50.0000,
    }
  ],
  distributorFeePercent: 1.0000,
  ownerAddress: "0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342"
};
const gasEstimate = await splitsClient.estimateGas.createSplit(args);
```

--------------------------------

### LiquidSplit Data Structure

Source: https://docs.splits.org/sdk/data

Defines the structure for a LiquidSplit, including its address, distributor fee percentage, payout split address, factory generation status, and a list of holders with their allocation percentages.

```json
{
  type: 'LiquidSplit'
  address: string
  distributorFeePercent: number
  payoutSplitAddress: string
  isFactoryGenerated: boolean
  holders: {
    percentAllocation: number
    recipient: {
      address: string
      ens?: string
    }
  }[]
}
```

--------------------------------

### Use Create Waterfall Module Hook

Source: https://docs.splits.org/react

Facilitates the creation of a waterfall module for managing funds distribution over time. The hook returns a function to create the module and monitors transaction progress.

```javascript
const { createWaterfallModule,status,txHash,error } =useCreateWaterfallModule()
```

--------------------------------

### useInitiateControlTransfer Hook

Source: https://docs.splits.org/react

Provides a React hook for the `initiateControlTransfer` function. It returns the `initiateControlTransfer` function and transaction status properties like `status`, `txHash`, and `error`.

```javascript
const { initiateControlTransfer,status,txHash,error } =useInitiateControlTransfer()
```

--------------------------------

### Estimate Gas for Create Split

Source: https://docs.splits.org/sdk/splits-v1

Estimates the gas required for the `createSplit` function. This function takes an arguments object containing recipients, distributor fee percentage, and controller address.

```javascript
constargs= {
  recipients: [
    {
      address:'0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f',
      percentAllocation:50.0,
    },
    {
      address:'0xc3313847E2c4A506893999f9d53d07cDa961a675',
      percentAllocation:50.0,
    },
  ],
  distributorFeePercent:1.0,
  controller:'0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342',
}
constgasEstimate=awaitsplitsClient.estimateGas.createSplit(args)
```

--------------------------------

### Diversifier Contract Structure

Source: https://docs.splits.org/templates/diversifier

Illustrates the hierarchical structure of the Diversifier smart contract, showing how it integrates with Split, Swapper, and Pass-Through Wallet contracts to manage income streams and token diversification.

```Solidity
PassThroughWallet
  Split
    Swapper2
    Swapper3
  Recipient2
  Recipient3
```

--------------------------------

### Generate Call Data for Create Split

Source: https://docs.splits.org/sdk/splits-v1

Generates the call data for the `createSplit` function. This function requires an arguments object specifying recipients, distributor fee percentage, and controller address.

```javascript
constargs= {
  recipients: [
    {
      address:'0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f',
      percentAllocation:50.0,
    },
    {
      address:'0xc3313847E2c4A506893999f9d53d07cDa961a675',
      percentAllocation:50.0,
    },
  ],
  distributorFeePercent:1.0,
  controller:'0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342',
}
constcallData=awaitsplitsClient.callData.createSplit(args)
```

--------------------------------

### Split Contract: Create and Distribute Funds

Source: https://docs.splits.org/core/split

The Split contract allows for the creation of payable smart contracts with multiple recipients, each assigned an ownership percentage. It handles the distribution of ETH and ERC20 tokens sent to it via the `distributeETH` and `distributeERC20` functions. Funds are managed by `SplitWallet` and `SplitMain` for efficient composability.

```Solidity
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SplitWallet.sol";
import "./SplitMain.sol";

contract Split is Ownable {
    SplitWallet public wallet;
    SplitMain public main;

    constructor(address[] memory _recipients, uint256[] memory _shares, address _splitMain) {
        wallet = new SplitWallet(address(this));
        main = SplitMain(_splitMain);
        main.createSplit(wallet, _recipients, _shares);
    }

    receive() external payable {
        // Funds are automatically handled by SplitWallet
    }

    function distributeETH() external {
        main.distributeETH(wallet);
    }

    function distributeERC20(address _token) external {
        main.distributeERC20(wallet, IERC20(_token));
    }

    function withdraw() external {
        main.withdraw(wallet);
    }
}
```

--------------------------------

### useCreateSplitV2 - Create a Split V2 Transaction

Source: https://docs.splits.org/react

Provides a function to create a Split V2 transaction and monitors its progress. Returns the createSplit function, status, txHash, and error.

```javascript
const { createSplit, status, txHash, error } = useCreateSplitV2();

// Response structure:
// {
//   createSplit: function
//     status?: 'pendingApproval' | 'txInProgress' | 'complete' | 'error'
//     txHash?: string
//     error?: any
// }
```

--------------------------------

### Generate Call Data for Split Creation

Source: https://docs.splits.org/sdk/splits-v2

Generates the call data for creating a split. This method is accessed via the `callData` property of the client and requires recipient details, distributor fee percentage, and owner address.

```javascript
const args = {
  recipients: [
    {
      address: "0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f",
      percentAllocation: 50.0000
    },
    {
      address: "0xc3313847E2c4A506893999f9d53d07cDa961a675",
      percentAllocation: 50.0000,
    }
  ],
  distributorFeePercent: 1.0000,
  ownerAddress: "0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342"
};
const callData = await splitsClient.callData.createSplit(args);
```

--------------------------------

### useCreateLiquidSplit Hook

Source: https://docs.splits.org/react

Provides a React hook for the `createLiquidSplit` function. It returns the `createLiquidSplit` function and transaction status properties like `status`, `txHash`, and `error` for monitoring.

```javascript
const { createLiquidSplit,status,txHash,error } =useCreateLiquidSplit()
```

--------------------------------

### Use Distribute Liquid Split Token Hook

Source: https://docs.splits.org/react

Provides a hook to distribute tokens in a liquid split scenario. It returns a function to initiate the distribution and tracks the transaction status, hash, and errors.

```javascript
const { distributeToken,status,txHash,error } =useDistributeLiquidSplitToken()
```

--------------------------------

### Waterfall Contracts & Natspec

Source: https://docs.splits.org/core/waterfall

Offers access to the smart contract code and its associated Natspec documentation, which details the contract's functions, parameters, and return values.

```link
https://github.com/splits/splits-monorepo/tree/main/contracts/Waterfall
```

--------------------------------

### Create Liquid Split (JavaScript/TypeScript)

Source: https://docs.splits.org/sdk/liquid

This function creates a new Liquid Split contract. It requires an array of holders with their respective percent allocations, a distributor fee percentage, and optionally an owner address. The response includes the address of the newly created liquid split and the emitted event.

```typescript
const args = {
  holders: [
    {
      address: '0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f',
      percentAllocation: 50.0,
    },
    {
      address: '0xc3313847E2c4A506893999f9d53d07cDa961a675',
      percentAllocation: 50.0,
    },
  ],
  distributorFeePercent: 1.0,
  owner: '0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f',
};

const response = await liquidSplitClient.createLiquidSplit(args);
```

--------------------------------

### Pass-Through Wallet Contract Interaction (Solidity)

Source: https://docs.splits.org/core/pass-through

Demonstrates how to interact with the Pass-Through Wallet contract, including calling the `passThroughTokens` function to transfer held tokens. It highlights the ability to pause forwarding, update the pass-through address, and execute arbitrary calls.

```Solidity
contract PassThroughWallet {
    // ... contract definition ...

    function passThroughTokens(address token, uint256 amount) external {
        // Logic to transfer tokens
    }

    function pausePassThroughTokens() external onlyOwner {
        // Logic to pause token forwarding
    }

    function updatePassThroughAddress(address newAddress) external onlyOwner {
        // Logic to update the pass-through address
    }

    function executeArbitraryCall(address target, bytes calldata data) external onlyOwner {
        // Logic to execute arbitrary calls
    }
}
```

--------------------------------

### useVestingMetadata - Fetch Vesting Metadata

Source: https://docs.splits.org/react

Fetches metadata for a given vesting module from the subgraph. It requires chainId and vestingModuleAddress.

```javascript
const { data: vestingMetadata, isLoading, status, error } = useVestingMetadata(chainId, vestingModuleAddress);
```

--------------------------------

### Initiate Control Transfer

Source: https://docs.splits.org/sdk/splits-v1

Initiates the transfer of control for a split address to a new controller. This operation can only be performed by the current controller of the split. It requires the split address and the new controller's address.

```javascript
const args = {
  splitAddress: '0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
  newController: '0x2fa128274cfcf47afd4dc03cd3f2a59af09b6a72',
};
const response = await splitsClient.initiateControlTransfer(args);
```

--------------------------------

### Estimate Gas for Create Liquid Split

Source: https://docs.splits.org/sdk/liquid

Estimates the gas required for the `createLiquidSplit` function. This is useful for understanding transaction costs before execution.

```javascript
const args = {
  holders: [
    {
      address: '0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f',
      percentAllocation: 50.0,
    },
    {
      address: '0xc3313847E2c4A506893999f9d53d07cDa961a675',
      percentAllocation: 50.0,
    },
  ],
  distributorFeePercent: 1.0,
  owner: '0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f',
};
const gasEstimate = await liquidSplitClient.estimateGas.createLiquidSplit(args);
```

--------------------------------

### SplitV2 as a Smart Contract Wallet

Source: https://docs.splits.org/core/split-v2

Describes how SplitV2 contracts can function as smart contract wallets, granting owners execution access. This allows owners to pause distributions, make arbitrary transactions, and sign data using ERC1271.

```Solidity
pragma solidity ^0.8.0;

// Interface for ERC1271 (example)
interface IERC1271 {
    function isValidSignature(bytes32 hash, bytes memory signature) external view returns (bool);
}

// Example of a Split contract with wallet functionality
contract SplitWithWallet is IERC1271 {
    address public owner;
    bool public distributionsPaused;

    constructor(address _owner) {
        owner = _owner;
    }

    function pauseDistributions() external {
        require(msg.sender == owner, "Only owner can pause");
        distributionsPaused = true;
    }

    function unpauseDistributions() external {
        require(msg.sender == owner, "Only owner can unpause");
        distributionsPaused = false;
    }

    function executeTransaction(address to, uint256 value, bytes memory data) external {
        require(msg.sender == owner, "Only owner can execute");
        (bool success, ) = to.call{value: value}(data);
        require(success, "Transaction failed");
    }

    function isValidSignature(bytes32 hash, bytes memory signature) external view override returns (bool) {
        // Implementation for ERC1271 signature validation
        // This is a placeholder
        return false;
    }
}
```

--------------------------------

### Generate Call Data for Create Liquid Split

Source: https://docs.splits.org/sdk/liquid

Generates the raw call data for the `createLiquidSplit` function, which can be used in custom transaction constructions.

```javascript
const args = {
  holders: [
    {
      address: '0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f',
      percentAllocation: 50.0,
    },
    {
      address: '0xc3313847E2c4A506893999f9d53d07cDa961a675',
      percentAllocation: 50.0,
    },
  ],
  distributorFeePercent: 1.0,
  owner: '0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f',
};
const callData = await liquidSplitClient.callData.createLiquidSplit(args);
```

--------------------------------

### ChainlinkOracle: Price Computation Path

Source: https://docs.splits.org/core/oracle

This snippet illustrates the structure of a price computation path used by the ChainlinkOracle. It details the components of each step, including the Chainlink Feed, Decimals, StaleAfter threshold, and the Mul flag for price adjustment.

```Solidity
struct PricePathStep {
    address feed;
    uint8 decimals;
    uint32 staleAfter;
    bool mul;
}

struct PricePath {
    PricePathStep[] steps;
}

function computePrice(PricePath memory path) internal view returns (uint256 price) {
    // Logic to iterate through path steps and compute price
    // ...
    return price;
}
```

--------------------------------

### useSwapperSetScaledOfferFactorOverrides Hook

Source: https://docs.splits.org/react

Enables setting scaled offer factor overrides for the swapper. This hook returns the function to execute the override, alongside transaction status, hash, and error details.

```javascript
const { setScaledOfferFactorOverrides,status,txHash,error } =useSwapperSetScaledOfferFactorOverrides()

// Response structure:
// {
// setScaledOfferFactorOverrides: function
//   status?: 'pendingApproval' | 'txInProgress' | 'complete' | 'error'
//   txHash?: string
//   error?: any
// }
```

--------------------------------

### Use Swapper Set Beneficiary Hook

Source: https://docs.splits.org/react

Enables setting or updating the beneficiary for a swapper. This hook returns a function to change the beneficiary and provides transaction status.

```javascript
const { setBeneficiary,status,txHash,error } =useSwapperSetBeneficiary()
```

--------------------------------

### Batch Withdraw Tokens

Source: https://docs.splits.org/sdk/warehouse

Withdraws specified amounts of tokens for an owner address and sends the withdraw incentive to a withdrawer address. Requires owner address, token addresses, amounts, and withdrawer address.

```javascript
constargs= {
  ownerAddress:"0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9"
  tokensAddresses: ["0x64d91f12ece7362f91a6f8e7940cd55f05060b92"]
  amounts: [1 ether]
  withdrawerAddress: "0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9"
}
constresponse=awaitwarehouseClient.batchWithdraw(args)
```

--------------------------------

### Batch Deposit Tokens

Source: https://docs.splits.org/sdk/warehouse

Batch deposits specified amounts of a token to the warehouse for the caller, transferring ownership of receipts to multiple receivers. Requires receiver addresses, token address, and amounts.

```javascript
constargs= {
  receiversAddresses: ["0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9"]
  tokenAddress: "0x64d91f12ece7362f91a6f8e7940cd55f05060b92"
  amounts: [1 ether]
}
constresponse=awaitwarehouseClient.batchDeposit(args)
```

--------------------------------

### useUserEarnings - Fetch User Earnings

Source: https://docs.splits.org/react

Fetches a user's earnings from the subgraph, including withdrawn amounts and active balances. It requires chainId and userAddress.

```javascript
const { data: userEarnings, isLoading, status, error } = useUserEarnings(
  chainId,
  userAddress,
);
```

--------------------------------

### SplitV2 Pull Splitter Functionality

Source: https://docs.splits.org/core/split-v2

Explains the 'Pull' splitter mechanism in SplitV2, where distributed funds are held in a Warehouse. It details how recipients can withdraw their shares and highlights limitations with non-transferable, fee-on-transfer, and rebasing tokens.

```Solidity
pragma solidity ^0.8.0;

// Interface for the Warehouse contract (example)
interface IWarehouse {
    function deposit(address _token, address _from, uint256 _amount) external;
    function withdraw(address _token, address _to, uint256 _amount) external;
}

// Interface for a Split contract (example)
interface ISplit {
    function distribute() external;
    function getBalance(address _token, address _recipient) external view returns (uint256);
    function withdraw(address _token) external;
}

// Example of a PullSplit contract
contract PullSplit {
    address public immutable warehouse;
    address[] public recipients;
    uint256[] public shares;

    constructor(address[] memory _recipients, uint256[] memory _shares, address _warehouse) {
        require(_recipients.length == _shares.length, "Mismatched lengths");
        recipients = _recipients;
        shares = _shares;
        warehouse = _warehouse;
    }

    function distribute() external payable {
        // Logic to distribute ETH or ERC20s to the warehouse
        // This is a simplified example
        if (msg.value > 0) {
            IWarehouse(warehouse).deposit(address(0), address(this), msg.value);
        }
        // ERC20 distribution logic would go here
    }

    function getBalance(address _token, address _recipient) public view returns (uint256) {
        // Logic to get recipient's share from warehouse
        // This is a placeholder
        return 0;
    }

    function withdraw(address _token) external {
        // Logic for recipient to withdraw their share from the warehouse
        // This is a placeholder
    }
}
```

--------------------------------

### useCreateSplit Hook

Source: https://docs.splits.org/react

Provides a React hook for the `createSplit` function. It returns the `createSplit` function itself, along with transaction status properties such as `status`, `txHash`, and `error` for monitoring.

```javascript
const { createSplit,status,txHash,error } =useCreateSplit()
```

--------------------------------

### useBatchWithdrawWarehouse - Perform Batch Warehouse Withdrawal

Source: https://docs.splits.org/react

Provides a function for batch withdrawals from the warehouse and monitors transaction progress. Returns the batchWithdrawWarehouse function, status, txHash, and error.

```javascript
const { batchWithdrawWarehouse, status, txHash, error } = useBatchWithdrawWarehouse();

// Response structure:
// {
//   batchWithdrawWarehouse: function
//     status?: 'pendingApproval' | 'txInProgress' | 'complete' | 'error'
//     txHash?: string
//     error?: any
// }
```

--------------------------------

### Execute Arbitrary Calls for a Split

Source: https://docs.splits.org/sdk/splits-v2

Allows the controller of a split to execute arbitrary calls. This function takes the split's address and an array of call objects, each specifying the target address, value, and data for the call.

```javascript
const args = {
  splitAddress: "0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9",
  calls: [
    {
      to: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      value: 1000000000000000000,
      data: "0xd0e30db0" 
    }
  ]
};
const response = await splitsClient.execCalls(args);
```

--------------------------------

### useSwapperSetDefaultScaledOfferFactor Hook

Source: https://docs.splits.org/react

Provides a hook to set the default scaled offer factor for the swapper. It returns the function to call, along with transaction status, hash, and error information.

```javascript
const { setDefaultScaledOfferFactor,status,txHash,error } =useSwapperSetDefaultScaledOfferFactor()

// Response structure:
// {
// setDefaultScaledOfferFactor: function
//   status?: 'pendingApproval' | 'txInProgress' | 'complete' | 'error'
//   txHash?: string
//   error?: any
// }
```

--------------------------------

### useWithdrawWarehouse - Perform Warehouse Withdrawal

Source: https://docs.splits.org/react

Provides a function to withdraw from the warehouse and monitors transaction progress. Returns the withdrawWarehouse function, status, txHash, and error.

```javascript
const { withdrawWarehouse, status, txHash, error } = useWithdrawWarehouse();

// Response structure:
// {
//   withdrawWarehouse: function
//     status?: 'pendingApproval' | 'txInProgress' | 'complete' | 'error'
//     txHash?: string
//     error?: any
// }
```

--------------------------------

### Use Swapper Set Oracle Hook

Source: https://docs.splits.org/react

Provides functionality to set or update the oracle used by a swapper for price feeds or other data. The hook returns a function for this update and includes transaction monitoring.

```javascript
const { setOracle,status,txHash,error } =useSwapperSetOracle()
```

--------------------------------

### useUserEarningsByContract - Fetch User Earnings by Contract

Source: https://docs.splits.org/react

Fetches a user's earnings from the subgraph, broken down by each Splits contract. It includes withdrawn amounts and active balances. Optionally filters results by contractAddresses.

```javascript
const { data: userEarningsByContract, isLoading, status, error } = useUserEarningsByContract(
  chainId,
  userAddress,
  {
    contractAddresses, // defaults to undefined, returning all contracts the user receives from
  }
);
```

--------------------------------

### useSwapperMetadata - Fetch Swapper Metadata

Source: https://docs.splits.org/react

Fetches metadata for a given swapper from the subgraph. It requires chainId and swapperAddress.

```javascript
const { data: swapperMetadata, isLoading, status, error } = useSwapperMetadata(chainId, swapperAddress);
```

--------------------------------

### Temporary Approve and Call

Source: https://docs.splits.org/sdk/warehouse

Grants temporary approval to a spender for a token and makes a call to a target address with provided data. Requires spender address, token address, amount, target address, and data.

```javascript
constargs= {
  spenderAddress:"0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342",
  operator:false, 
  tokenAddress:"0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342",
  amount: 1 ether,
  targetAddress:"0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342",
  data:"0x0"
}
constresponse=awaitwarehouseClient.temporaryApproveAndCall(args)
```

--------------------------------

### Retrieve EIP-712 Domain

Source: https://docs.splits.org/sdk/splits-v2

Retrieves the EIP-712 domain information for a given Split contract address. This includes chain ID, name, salt, verifying contract address, and version.

```javascript
constargs= {
  splitAddress:'0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
}
constresponse=awaitsplitsClient.eip712Domain(args)
```

--------------------------------

### Vesting Contract - Core Functionality (Solidity)

Source: https://docs.splits.org/core/vesting

This snippet outlines the core functionality of the Vesting contract, which allows for multiple, isolated streams of tokens to vest to an address over a set period. It handles token streams, vesting periods, and releasing vested tokens.

```Solidity
pragma solidity ^0.8.0;

contract Vesting {
    // Contract details and functions would go here
    // For example:
    // address public recipient;
    // uint256 public vestingPeriod;
    // mapping(address => uint256) public streamBalances;

    // function startStream(address token, uint256 amount) external {
    //     // ... implementation ...
    // }

    // function releaseVestedTokens(address token) external {
    //     // ... implementation ...
    // }
}
```

--------------------------------

### Set Default Scaled Offer Factor with Swapper Client

Source: https://docs.splits.org/sdk/swapper

Updates the default scaled offer factor percentage for the Swapper contract. This function is callable only by the Swapper owner and requires the swapper's address and the new percentage value.

```javascript
constargs= {
  swapperAddress:'0x693C49a6296d90e8A8936Ad4836a680F551bb97d',
  defaultScaledOfferFactorPercent:1,
}
constresponse=awaitswapperClient.setDefaultScaledOfferFactor(args)
```

--------------------------------

### Warehouse Contract: Core Functionality

Source: https://docs.splits.org/core/warehouse

Explains the core functionalities of the Warehouse contract, including how it manages token deposits, user claims, and transfers. It highlights the use of unique IDs for tokens and the ability for users to automate withdrawals.

```Solidity
pragma solidity ^0.8.0;

interface IWarehouse {
    // Function to deposit tokens for a user
    function deposit(address token, address user, uint256 amount) external;

    // Function to transfer claims from one user to another
    function transfer(address token, address from, address to, uint256 amount) external;

    // Function to transfer claims on behalf of another user
    function transferFrom(address token, address sender, address from, address to, uint256 amount) external;

    // Function to set withdraw incentive for a user
    function setWithdrawIncentive(address token, address user, uint256 incentive) external;

    // Function to pause withdraws for external parties for a user
    function pauseExternalWithdraws(address token, address user) external;

    // Function to get the unique ID for a token
    function getTokenId(address token) external view returns (uint256);
}
```

--------------------------------

### Predict Deterministic Split Address

Source: https://docs.splits.org/sdk/splits-v2

Calculates the deterministic address where a split will be deployed. This function requires details about recipients, distributor fee percentage, total allocation percentage, and optionally owner address, split type, creator address, and a salt.

```javascript
const args = {
  recipients: [
    {
      address: "0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f",
      percentAllocation: 50.0000
    },
    {
      address: "0xc3313847E2c4A506893999f9d53d07cDa961a675",
      percentAllocation: 50.0000
    }
  ],
  distributorFeePercent: 1.0000,
  totalAllocationPercent: 100.0000,
  splitType: "Pull",
  ownerAddress: "0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342",
  creatorAddress: "0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342",
  salt: "0x0000000000000000000000000000000000000000000000000000000000000000"
};
const response = await splitsClient.predictDeterministicAddress(args);
```

--------------------------------

### Set Token to Beneficiary with Swapper Client

Source: https://docs.splits.org/sdk/swapper

Updates the token associated with the beneficiary in the Swapper contract. Only the Swapper owner can call this function, providing the swapper's address and the token address.

```javascript
constargs= {
  swapperAddress:'0x693C49a6296d90e8A8936Ad4836a680F551bb97d',
  tokenToBeneficiary:'0x0000000000000000000000000000000000000000',
}
constresponse=awaitswapperClient.setTokenToBeneficiary(args)
```

--------------------------------

### Waterfall SDK Integration

Source: https://docs.splits.org/core/waterfall

Provides access to the SDK for interacting with Waterfall contracts programmatically. This is useful for developers who want to integrate Waterfall functionality into their applications.

```link
https://github.com/splits/splits-monorepo/tree/main/apps/web/src/components/Waterfall
```

--------------------------------

### Use Release Vested Funds Hook

Source: https://docs.splits.org/react

Allows for the release of vested funds according to the predefined schedule. The hook returns a function to trigger the release and monitors the transaction.

```javascript
const { releaseVestedFunds,status,txHash,error } =useReleaseVestedFunds()
```

--------------------------------

### useSplitEarnings - Fetch Split Earnings

Source: https://docs.splits.org/react

Fetches a split's earnings from the subgraph, with an option to include active balances. It takes chainId, splitAddress, and an options object for includeActiveBalances and erc20TokenList.

```javascript
const { data: splitEarnings, isLoading, status, error } = useSplitEarnings(
  chainId,
  splitAddress,
  {
    includeActiveBalances, // defaults to true
    erc20TokenList, // defaults to undefined
  }
);
```

--------------------------------

### Distribute Token Funds

Source: https://docs.splits.org/sdk/splits-v1

Distributes the balance of a specified token for a given split address. The distributor fee is sent to the provided distributor address. This function emits a DistributeETH or DistributeERC20 event.

```javascript
constargs= {
  splitAddress:'0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
  token:'0x64d91f12ece7362f91a6f8e7940cd55f05060b92',
  distributorAddress:'0x2fa128274cfcf47afd4dc03cd3f2a59af09b6a72',
}
constresponse=awaitsplitsClient.distributeToken(args)
```

--------------------------------

### Set Beneficiary with Swapper Client

Source: https://docs.splits.org/sdk/swapper

Updates the beneficiary address for the Swapper contract. This operation is restricted to the Swapper owner and requires the swapper's address and the new beneficiary's address.

```javascript
constargs= {
  swapperAddress:'0x693C49a6296d90e8A8936Ad4836a680F551bb97d',
  beneficiary:'0x2fa128274cfcf47afd4dc03cd3f2a59af09b6a72',
}
constresponse=awaitswapperClient.setBeneficiary(args)
```

--------------------------------

### useAcceptControlTransfer Hook

Source: https://docs.splits.org/react

Provides a React hook for the `acceptControlTransfer` function. It returns the `acceptControlTransfer` function and transaction status properties like `status`, `txHash`, and `error`.

```javascript
const { acceptControlTransfer,status,txHash,error } =useAcceptControlTransfer()
```

--------------------------------

### Estimate Gas for Create Waterfall Module

Source: https://docs.splits.org/sdk/waterfall

Estimates the gas required to create a new waterfall module. This feature allows developers to gauge transaction costs before execution.

```javascript
const args = {
  token: "0x0000000000000000000000000000000000000000",
  tranches: [
    {
      recipient: "0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f",
      size: 5.2
    },
    {
      recipient: "0xc3313847E2c4A506893999f9d53d07cDa961a675",
      size: 3
    },
    {
      recipient: "0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342"
    }
  ]
};
const gasEstimate = await waterfallClient.estimateGas.createWaterfallModule(args);
```

--------------------------------

### Deposit Token

Source: https://docs.splits.org/sdk/warehouse

Deposits a specified amount of a token to the warehouse for the caller, transferring ownership of the receipt to a receiver. Requires receiver address, token address, and amount.

```javascript
constargs= {
  receiverAddress:"0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9"
  tokenAddress: "0x64d91f12ece7362f91a6f8e7940cd55f05060b92"
  amount: 1 ether
}
constresponse=awaitwarehouseClient.deposit(args)
```

--------------------------------

### Generate Call Data for Create Waterfall Module

Source: https://docs.splits.org/sdk/waterfall

Generates the necessary call data for creating a waterfall module. This is useful for off-chain transaction preparation or batching.

```javascript
const args = {
  token: "0x0000000000000000000000000000000000000000",
  tranches: [
    {
      recipient: "0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f",
      size: 5.2
    },
    {
      recipient: "0xc3313847E2c4A506893999f9d53d07cDa961a675",
      size: 3
    },
    {
      recipient: "0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342"
    }
  ]
};
const callData = await waterfallClient.callData.createWaterfallModule(args);
```

--------------------------------

### Waterfall Funds Distribution

Source: https://docs.splits.org/sdk/waterfall

Illustrates how to distribute funds through a Waterfall contract using the `waterfallFunds` function. It explains the `waterfallModuleAddress` parameter and the optional `usePull` flag for handling recipient withdrawal issues.

```javascript
const args = {
  waterfallModuleAddress: '0x8904D1fBfc9c88792aaaE8f452ac57E1Ba2130fC',
}
const response = await waterfallClient.waterfallFunds(args)
```

--------------------------------

### Use Swapper Pause Hook

Source: https://docs.splits.org/react

Provides functionality to pause or unpause a swapper. The hook returns a function to set the paused state and monitors the transaction.

```javascript
const { setPaused,status,txHash,error } =useSwapperPause()
```

--------------------------------

### useWithdrawFunds Hook

Source: https://docs.splits.org/react

Provides a React hook for the `withdrawFunds` function. It returns the `withdrawFunds` function and transaction status properties including `status`, `txHash`, and `error` for tracking.

```javascript
const { withdrawFunds,status,txHash,error } =useWithdrawFunds()
```

--------------------------------

### Accept Control Transfer

Source: https://docs.splits.org/sdk/splits-v1

Accepts the transfer of control for a split address. This function must be called by the designated new controller. It requires the split address for which control is being accepted.

```javascript
const args = {
  splitAddress: '0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
};
const response = await splitsClient.acceptControlTransfer(args);
```

--------------------------------

### Batch Transfer Tokens

Source: https://docs.splits.org/sdk/warehouse

Transfers specified amounts of a token from the caller to multiple receiver addresses. Requires receiver addresses, amounts, and token address.

```javascript
constargs= {
  receiversAddresses: ["0x64d91f12ece7362f91a6f8e7940cd55f05060b92"]
  amounts: [1 ether]
  tokenAddress: "0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9"
}
constresponse=awaitwarehouseClient.batchTransfer(args)
```

--------------------------------

### Batch Distribute and Withdraw For All

Source: https://docs.splits.org/sdk/splits-v1

Executes a multicall transaction to distribute multiple tokens on a split and withdraw funds for all associated recipients. This function requires the split address and an array of token addresses.

```javascript
const args = {
  splitAddress: '0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
  tokens: [
    '0x0000000000000000000000000000000000000000',
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  ],
  distributorAddress: '0x2fa128274cfcf47afd4dc03cd3f2a59af09b6a72',
};
const response = await splitsClient.batchDistributeAndWithdrawForAll(args);
```

--------------------------------

### useUpdateSplit Hook

Source: https://docs.splits.org/react

Provides a React hook for the `updateSplit` function. It returns the `updateSplit` function and transaction status properties including `status`, `txHash`, and `error` to track the transaction's lifecycle.

```javascript
const { updateSplit,status,txHash,error } =useUpdateSplit()
```

--------------------------------

### useCreateRecoup Hook

Source: https://docs.splits.org/react

A template transaction hook for creating a recoup transaction. It exposes the createRecoup function and tracks the transaction's status, hash, and any errors.

```javascript
const { createRecoup,status,txHash,error } =useCreateRecoup()

// Response structure:
// {
// createRecoup: function
//   status?: 'pendingApproval' | 'txInProgress' | 'complete' | 'error'
//   txHash?: string
//   error?: any
// }
```

--------------------------------

### Set Withdraw Configuration

Source: https://docs.splits.org/sdk/warehouse

Sets the withdraw configuration on the warehouse for the caller, including incentive percentage and pause status. Requires incentive percent and paused status.

```javascript
constargs= {
  incentivePercent:1 
  paused: false
}
constresponse=awaitwarehouseClient.setWithdrawConfig(args)
```

--------------------------------

### Splits SDK Types

Source: https://docs.splits.org/sdk/utils

Utilize the custom types defined within the Splits SDK to ensure type safety and improve code readability. These types cover various aspects of the SDK's functionality.

```TypeScript
import { Split, User, TransactionData } from '@0xsplits/splits-sdk/types';

interface MySplitData {
  split: Split;
  user: User;
  txData: TransactionData;
}

const data: MySplitData = {
  split: { /* ... split object ... */ },
  user: { /* ... user object ... */ },
  txData: { /* ... transaction data ... */ }
};

```

--------------------------------

### Use Waterfall Funds Hook

Source: https://docs.splits.org/react

Allows for the management and distribution of funds within a waterfall system. It provides a function to interact with waterfall funds and tracks the associated transaction details.

```javascript
const { waterfallFunds,status,txHash,error } =useWaterfallFunds()
```

--------------------------------

### useMulticall Hook

Source: https://docs.splits.org/react

Facilitates multicall transactions, allowing multiple contract calls in a single transaction. The hook provides the multicall function and monitors transaction status, hash, and errors.

```javascript
const { multicall,status,txHash,error } =useMulticall()

// Response structure:
// {
// multicall: function
//   status?: 'pendingApproval' | 'txInProgress' | 'complete' | 'error'
//   txHash?: string
//   error?: any
// }
```

--------------------------------

### Splits SDK Errors

Source: https://docs.splits.org/sdk/utils

All errors generated by the Splits SDK are exported from the errors module. This allows for centralized error handling and management within your application.

```JavaScript
import { SplitsError } from '@0xsplits/splits-sdk/errors';

try {
  // Some SDK operation that might throw an error
} catch (error) {
  if (error instanceof SplitsError) {
    console.error('Splits SDK Error:', error.message);
  } else {
    console.error('An unexpected error occurred:', error);
  }
}
```

--------------------------------

### useLiquidSplitMetadata - Fetch Liquid Split Metadata

Source: https://docs.splits.org/react

Fetches metadata for a given liquid split from the subgraph. It requires chainId and liquidsplitAddress.

```javascript
const { data: liquidSplitMetadata, isLoading, status, error } = useLiquidSplitMetadata(chainId, liquidsplitAddress);
```

--------------------------------

### Transfer Tokens using Warehouse Client (JavaScript)

Source: https://docs.splits.org/sdk/warehouse

Transfers a specified amount of a token from the contract to a receiver address using the Splits SDK's Warehouse client. This function requires the receiver's address, the token address, and the amount to transfer.

```javascript
constargs= {
  receiverAddress:"0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342"
  tokenAddress: "0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342"
  amount: 1 ether
}
constresponse=awaitwarehouseClient.transfer(args)
```

--------------------------------

### Splits SDK Validation Utilities

Source: https://docs.splits.org/sdk/utils

Leverage the validation functions provided by the Splits SDK to ensure data integrity and adherence to expected formats. These utilities are crucial for robust application logic.

```JavaScript
import { isValidAddress } from '@0xsplits/splits-sdk/utils/validation';

const address = '0x123...';
if (isValidAddress(address)) {
  console.log('Valid address');
} else {
  console.log('Invalid address');
}
```

--------------------------------

### Transfer Tokens From using Warehouse Client (JavaScript)

Source: https://docs.splits.org/sdk/warehouse

Transfers a specified amount of a token from a sender address to a receiver address using the Splits SDK's Warehouse client. This function requires the sender's address, the receiver's address, the token address, and the amount.

```javascript
constargs= {
  senderAddress:"0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342",
  receiverAddress:"0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342",
  tokenAddress:"0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342",
  amount:1 ether
}
constresponse=awaitwarehouseClient.transferFrom(args)
```

--------------------------------

### FormattedTokenBalances Data Structure

Source: https://docs.splits.org/sdk/data

Defines the structure for formatted token balances, including symbol, decimals, raw amount, and formatted amount.

```json
{
  symbol: string
  decimals: number
  rawAmount: bigint
  formattedAmount: string
}
```

--------------------------------

### Set Oracle with Swapper Client

Source: https://docs.splits.org/sdk/swapper

Updates the oracle address used by the Swapper contract. This function is exclusive to the Swapper owner and requires the swapper's address and the new oracle's address.

```javascript
constargs= {
  swapperAddress:'0x693C49a6296d90e8A8936Ad4836a680F551bb97d',
  oracle:'0x8E0E20Ea43A88214A0908F32Cd14395022e823A6',
}
constresponse=awaitswapperClient.setOracle(args)
```

--------------------------------

### Predict Vesting Module Address

Source: https://docs.splits.org/sdk/vesting

Predicts the vesting module address and its existence status for a given beneficiary and vesting period. Requires the beneficiary address and vesting period in seconds.

```javascript
const args = {
  beneficiary: '0x8904D1fBfc9c88792aaaE8f452ac57E1Ba2130fC',
  vestingPeriodSeconds: 31536000,
};
const response = await vestingClient.predictVestingModuleAddress(args);
```

--------------------------------

### SplitV2 Push Splitter Functionality

Source: https://docs.splits.org/core/split-v2

Details the 'Push' splitter in SplitV2, which sends funds directly to recipients during distribution. It mentions the hard gas cap on these sends and how failed sends are handled by depositing funds into the Warehouse. It also notes the limitation with non-transferable tokens.

```Solidity
pragma solidity ^0.8.0;

// Interface for the Warehouse contract (example)
interface IWarehouse {
    function deposit(address _token, address _from, uint256 _amount) external;
}

// Interface for ERC20 token (example)
interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
}

// Example of a PushSplit contract
contract PushSplit {
    address public immutable warehouse;
    address[] public recipients;
    uint256[] public shares;
    uint256 public constant GAS_LIMIT_FOR_SEND = 50000; // Example gas limit

    constructor(address[] memory _recipients, uint256[] memory _shares, address _warehouse) {
        require(_recipients.length == _shares.length, "Mismatched lengths");
        recipients = _recipients;
        shares = _shares;
        warehouse = _warehouse;
    }

    function distribute() external {
        // Logic to distribute ETH or ERC20s directly to recipients
        // This is a simplified example
        for (uint i = 0; i < recipients.length; i++) {
            // Example for ETH distribution
            (bool success, ) = payable(recipients[i]).call{value: address(this).balance * shares[i] / 100}("");
            if (!success) {
                // If send fails, deposit into warehouse
                IWarehouse(warehouse).deposit(address(0), address(this), address(this).balance * shares[i] / 100);
            }
            // ERC20 distribution logic would go here, with gas checks
        }
    }
}
```

--------------------------------

### Generate Call Data for Deposit

Source: https://docs.splits.org/sdk/warehouse

Generates the call data for a deposit operation. This is a utility function that can be used with any write function by accessing the `calldata` property.

```javascript
constargs= {
  receiverAddress:"0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9"
  tokenAddress: "0x64d91f12ece7362f91a6f8e7940cd55f05060b92"
  amount: 1 ether
}
constresponse=awaitwarehouseClient.calldata.deposit(args)
```

--------------------------------

### Set Scaled Offer Factor Overrides with Swapper Client

Source: https://docs.splits.org/sdk/swapper

Updates specific scaled offer factor overrides for token pairs within the Swapper contract. To remove an override, set the percentage to 100. This function requires the swapper's address and an array of overrides, each specifying base token, quote token, and the factor percentage.

```javascript
constargs= {
  swapperAddress:'0x693C49a6296d90e8A8936Ad4836a680F551bb97d',
  scaledOfferFactorOverrides: [
    {
      baseToken:'0x0000000000000000000000000000000000000000',
      quoteToken:'0x0000000000000000000000000000000000000000',
      scaledOfferFactorPercent:0.1,
    },
    {
      baseToken:'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      quoteToken:'0x0000000000000000000000000000000000000000',
      scaledOfferFactorPercent:100,
    },
  ],
}
constresponse=awaitswapperClient.setDefaultScaledOfferFactor(args)
```

--------------------------------

### Generate Replay-Safe Hash

Source: https://docs.splits.org/sdk/splits-v2

Generates a replay-safe hash for a given message or structured hash, associated with a specific Split contract address. This function is useful for secure message signing.

```javascript
constargs= {
  splitAddress:'0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
  hash:'0x0',
}
constresponse=awaitsplitsClient.getReplaySafeHash(args)
```

--------------------------------

### Use Transfer Liquid Split Ownership Hook

Source: https://docs.splits.org/react

Enables the transfer of ownership for a liquid split. This hook returns a function to perform the transfer and provides transaction status, hash, and error information.

```javascript
const { transferOwnership,status,txHash,error } =useTransferLiquidSplitOwnership()
```

--------------------------------

### WaterfallModule Data Structure

Source: https://docs.splits.org/sdk/data

Defines the structure for a WaterfallModule, including its address, token information, non-waterfall recipient, and a list of tranches with recipient and amount details.

```json
{
  type: 'WaterfallModule'
  address: string
  token: {
    address: string
    symbol?: string
    decimals?: number
  }
  nonWaterfallRecipient: {
    address: string
    ens?: string
  } | null
  tranches: {
    recipient: {
      address: string
      ens?: string
    }
    startAmount: number
    size?: number
  }[]
}
```

--------------------------------

### useDistributeToken Hook

Source: https://docs.splits.org/react

Provides a React hook for the `distributeToken` function. It returns the `distributeToken` function and transaction status properties like `status`, `txHash`, and `error` for monitoring.

```javascript
const { distributeToken,status,txHash,error } =useDistributeToken()
```

--------------------------------

### Check Split Deployment Status

Source: https://docs.splits.org/sdk/splits-v2

Determines if a Split contract is deployed at a specific address based on recipients and distributor fee percentage. It returns the deterministic address and a boolean indicating deployment status. Requires recipient allocation and fee details.

```javascript
constargs= {
  recipients: [
    {
      address:"0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f",
      percentAllocation:50.0000
    },
    {
      address:"0xc3313847E2c4A506893999f9d53d07cDa961a675",
      percentAllocation:50.0000
    }
  ],
  distributorFeePercent:1.0000,
  totalAllocationPercent:100.0000,
  splitType:SplitV2Type.Push,
  ownerAddress:"0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342",
  creatorAddress:"0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342",
  salt:"0x0000000000000000000000000000000000000000000000000000000000000000"
}
constresponse=awaitsplitsClient.isDeployed(args)
```

--------------------------------

### Estimate Gas for Deposit

Source: https://docs.splits.org/sdk/warehouse

Estimates the gas required for a deposit operation. This is a utility function that can be used with any write function by accessing the `estimateGas` property.

```javascript
constargs= {
  receiverAddress:"0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9"
  tokenAddress: "0x64d91f12ece7362f91a6f8e7940cd55f05060b92"
  amount: 1 ether
}
constresponse=awaitwarehouseClient.estimateGas.deposit(args)
```

--------------------------------

### Predict Immutable Split Address

Source: https://docs.splits.org/sdk/splits-v1

Predicts the deterministic address for an immutable Split using CREATE2, based on recipients and distributor fee percentage. It also indicates if the split already exists.

```javascript
constargs= {
  recipients: [
    {
      address:'0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f',
      percentAllocation:50.0,
    },
    {
      address:'0xc3313847E2c4A506893999f9d53d07cDa961a675',
      percentAllocation:50.0,
    },
  ],
  distributorFeePercent:1.0,
}
constresponse=awaitsplitsClient.predictImmutableSplitAddress(args)
```

--------------------------------

### Release Vested Funds

Source: https://docs.splits.org/sdk/vesting

Releases vested funds to the beneficiary for specified stream IDs within a vesting module. This function requires the vesting module address and an array of stream IDs. The response includes events emitted for each released stream.

```javascript
constargs= {
  vestingModuleAddress:'0x0aab2E1E7D7bb0CAb1c0A49A59DCEfe241aA2ba1',
  streamIds: ['0','1'],
}
constresponse=awaitvestingClient.releaseVestedFunds(args)
```

--------------------------------

### Liquid Split Warning: Allocation Sum

Source: https://docs.splits.org/templates/liquid

This code snippet highlights a critical warning for implementing Liquid Splits. If the sum of percent allocations does not equal 1,000,000 (1e6), the Split will fail to update, and funds will become stuck. This emphasizes the importance of precise allocation management.

```Solidity
if (sum(percentAllocations) != 1e6) {
  // Split will fail to update and funds will be stuck!
}
```

--------------------------------

### Use Recover Non Waterfall Funds Hook

Source: https://docs.splits.org/react

Provides functionality to recover funds that were not part of the standard waterfall distribution. The hook returns a function for recovery and includes transaction status tracking.

```javascript
const { recoverNonWaterfallFunds,status,txHash,error } =useRecoverNonWaterfallFunds()
```

--------------------------------

### useSplitMetadata - Fetch Split Metadata

Source: https://docs.splits.org/react

Fetches metadata for a given split from the subgraph. It requires chainId and splitAddress.

```javascript
const { data: splitMetadata, isLoading, status, error } = useSplitMetadata(chainId, splitAddress);
```

--------------------------------

### Set Operator using Warehouse Client (JavaScript)

Source: https://docs.splits.org/sdk/warehouse

Sets or revokes an operator address for the caller using the Splits SDK's Warehouse client. This allows the operator to perform actions on behalf of the caller. Requires the operator's address and a boolean indicating approval.

```javascript
constargs= {
  operatorAddress:'0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342',
  approved:true,
}
constresponse=awaitwarehouseClient.setOperator(args)
```

--------------------------------

### useWaterfallMetadata - Fetch Waterfall Metadata

Source: https://docs.splits.org/react

Fetches metadata for a given waterfall module from the subgraph. It requires chainId and waterfallModuleAddress.

```javascript
const { data: waterfallMetadata, isLoading, status, error } = useWaterfallMetadata(chainId, waterfallModuleAddress);
```

--------------------------------

### Withdraw Token Balance

Source: https://docs.splits.org/sdk/warehouse

Withdraws the entire balance of an owner address for a given token address, ignoring any withdraw incentive. Requires owner address and token address.

```javascript
constargs= {
  ownerAddress:"0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9"
  tokenAddress: "0x64d91f12ece7362f91a6f8e7940cd55f05060b92"
}
constresponse=awaitwarehouseClient.withdraw(args)
```

--------------------------------

### Update Split and Distribute Token

Source: https://docs.splits.org/sdk/splits-v1

Combines updating a split's configuration and distributing tokens into a single transaction. This function is restricted to the controller of the specified split address. It takes arguments for the split address, token address, recipient allocations, distributor fee, and distributor address.

```javascript
const args = {
  splitAddress: '0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
  token: '0x64d91f12ece7362f91a6f8e7940cd55f05060b92',
  recipients: [
    {
      address: '0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f',
      percentAllocation: 50.0,
    },
    {
      address: '0xc3313847E2c4A506893999f9d53d07cDa961a675',
      percentAllocation: 50.0,
    },
  ],
  distributorFeePercent: 1.0,
  distributorAddress: '0x2fa128274cfcf47afd4dc03cd3f2a59af09b6a72',
};
const response = await splitsClient.updateSplitAndDistributeToken(args);
```

--------------------------------

### Approve Token Spending using Warehouse Client (JavaScript)

Source: https://docs.splits.org/sdk/warehouse

Approves a spender address to withdraw a specified amount of a token from the contract using the Splits SDK's Warehouse client. This is necessary for functions like `transferFrom`. Requires the spender's address, the token address, and the amount.

```javascript
constargs= {
  spenderAddress:"0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342",
  tokenAddress:"0xEc8Bfc8637247cEe680444BA1E25fA5e151Ba342",
  amount:1 ether
}
constresponse=awaitwarehouseClient.approve(args)
```

--------------------------------

### Liquid Split: Update and Distribute Function

Source: https://docs.splits.org/templates/liquid

This snippet refers to the 'updateAndDistribute' function, which is central to the Liquid Split's operation. This function is called to update the Split's allocations based on current NFT holders and immediately distribute the available balance. It's a key part of how funds are managed and transferred.

```Solidity
call("updateAndDistribute")
```

--------------------------------

### Retrieve Split Owner Address

Source: https://docs.splits.org/sdk/splits-v2

Fetches the owner's address for a given Split contract address. This function takes the Split contract address as input and returns the associated owner's address.

```javascript
constargs= {
  splitAddress:'0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
}
constresponse=awaitsplitsClient.owner(args)
```

--------------------------------

### Batch Distribute and Withdraw

Source: https://docs.splits.org/sdk/splits-v1

Performs a multicall transaction to distribute multiple tokens across a split and withdraw funds for specified recipient addresses. This function requires the split address, an array of token addresses, and an array of recipient addresses.

```javascript
const args = {
  splitAddress: '0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
  tokens: [
    '0x0000000000000000000000000000000000000000',
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  ],
  recipientAddresses: [
    '0x39883c6e81e273f381bffe5a8c26c3a866ff57ca',
    '0xeb78334dfde3afbc2b904f06153f59cc80ee07fa',
    '0x6b48ad78a26604b9e158a07ec4abb2981842e168',
    '0xc3313847E2c4A506893999f9d53d07cDa961a675',
  ],
  distributorAddress: '0x2fa128274cfcf47afd4dc03cd3f2a59af09b6a72',
};
const response = await splitsClient.batchDistributeAndWithdraw(args);
```

--------------------------------

### Use Withdraw Waterfall Pull Funds Hook

Source: https://docs.splits.org/react

Enables the withdrawal of funds that are pulled from a waterfall system. This hook offers a function for withdrawal and provides details on the transaction's lifecycle.

```javascript
const { withdrawPullFunds,status,txHash,error } =useWithdrawWaterfallPullFunds()
```

--------------------------------

### Withdraw Funds

Source: https://docs.splits.org/sdk/splits-v1

Withdraws specified tokens for a given address. This function allows users to retrieve their allocated tokens. It requires the address from which to withdraw and an array of token addresses to be withdrawn.

```javascript
const args = {
  address: '0x357138F2690B82f29dF32bf2a3d0e6d4CC4D63C1',
  tokens: [
    '0x64d91f12ece7362f91a6f8e7940cd55f05060b92',
    '0x0000000000000000000000000000000000000000',
  ],
};
const response = await splitsClient.withdrawFunds(args);
```

--------------------------------

### useUpdateSplitAndDistributeToken Hook

Source: https://docs.splits.org/react

Provides a React hook for the `updateSplitAndDistributeToken` function. It returns the `updateSplitAndDistributeToken` function along with transaction status properties such as `status`, `txHash`, and `error`.

```javascript
const { updateSplitAndDistributeToken,status,txHash,error } =useUpdateSplitAndDistributeToken()
```

--------------------------------

### Distribute Token to Liquid Split Holders (JavaScript/TypeScript)

Source: https://docs.splits.org/sdk/liquid

Distributes the current token balance for a given liquid split to its NFT holders. This function requires the liquid split address, the token address, and optionally the distributor's address. The response includes the emitted event from the Liquid Split contract.

```typescript
const args = {
  liquidSplitAddress: '0xb5Ce41320F3d486671918733BB3226E3981Db62b',
  token: '0x64d91f12ece7362f91a6f8e7940cd55f05060b92',
  distributorAddress: '0x2fa128274cfcf47afd4dc03cd3f2a59af09b6a72',
};

const response = await liquidSplitClient.distributeToken(args);
```

--------------------------------

### Pause Split Distribution

Source: https://docs.splits.org/sdk/splits-v2

Pauses the distribution of assets for a split. This operation can only be performed by the split's controller. It requires the split's address and a boolean indicating whether to pause.

```javascript
const args = {
  splitAddress: "0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9",
  paused: true
};
const response = await splitsClient.setPaused(args);
```

--------------------------------

### Transfer Ownership of a Split

Source: https://docs.splits.org/sdk/splits-v2

Transfers control of a split to a new controller. This function can only be called by the current controller of the split. It requires the split's address and the new owner's address as arguments.

```javascript
const args = {
  splitAddress: "0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9",
  newOwner: "0x2fa128274cfcf47afd4dc03cd3f2a59af09b6a72"
};
const response = await splitsClient.initiateControlTransfer(args);
```

--------------------------------

### Set Paused State with Swapper Client

Source: https://docs.splits.org/sdk/swapper

Updates the paused state of the Swapper contract, preventing swaps unless called by the owner. It takes the swapper's address and a boolean indicating the paused state.

```javascript
constargs= {
  swapperAddress:'0x693C49a6296d90e8A8936Ad4836a680F551bb97d',
  paused:true,
}
constresponse=awaitswapperClient.setPaused(args)
```

--------------------------------

### useCancelControlTransfer Hook

Source: https://docs.splits.org/react

Provides a React hook for the `cancelControlTransfer` function. It returns the `cancelControlTransfer` function and transaction status properties such as `status`, `txHash`, and `error`.

```javascript
const { cancelControlTransfer,status,txHash,error } =useCancelControlTransfer()
```

--------------------------------

### Update Split Contract

Source: https://docs.splits.org/sdk/splits-v1

Updates an existing mutable Split contract. This function can only be called by the controller of the specified split address. It takes the split address, new recipients, and distributor fee percentage.

```javascript
constargs= {
  splitAddress:'0x047ED5b8E8a7eDBd92FAF61f3117cAFE8c529ABb',
  recipients: [
    {
      address:'0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f',
      percentAllocation:50.0,
    },
    {
      address:'0xc3313847E2c4A506893999f9d53d07cDa961a675',
      percentAllocation:50.0,
    },
  ],
  distributorFeePercent:1.0,
}
constresponse=awaitsplitsClient.updateSplit(args)
```

--------------------------------

### Validate Nonce

Source: https://docs.splits.org/sdk/warehouse

Checks the validity of a user's nonce for a given user address. This function requires both the user address and the nonce, returning a boolean indicating validity.

```javascript
constargs= {
  userAddress:'0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
  userNonce:0,
}
constresponse=awaitwarehouseClient.isValidNonce(args)
```

--------------------------------

### Withdraw Pull Funds

Source: https://docs.splits.org/sdk/waterfall

Withdraws funds that were set aside for pull withdrawal after a waterfall funds call where 'usePull' was set to true. This function allows recipients to claim their allocated funds.

```javascript
const args = {
  waterfallModuleAddress: "0x8904D1fBfc9c88792aaaE8f452ac57E1Ba2130fC",
  address: "0x2fa128274cfcf47afd4dc03cd3f2a59af09b6a72"
};
const response = await waterfallClient.withdrawPullFunds(args);
```

--------------------------------

### Validate Signature for Split

Source: https://docs.splits.org/sdk/splits-v2

Verifies if a given signature corresponds to a message hash and the provided Split contract address. It returns a boolean indicating if the Split address is the valid signer.

```javascript
constargs= {
  splitAddress:'0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
  hash:'0x0',
  signature:'0x0',
}
constresponse=awaitsplitsClient.isValidSignature(args)
```

--------------------------------

### Transfer Ownership of Liquid Split (JavaScript/TypeScript)

Source: https://docs.splits.org/sdk/liquid

Transfers ownership of a Liquid Split contract to a new address. This function can only be called by the current owner of the contract. It requires the liquid split address and the new owner's address. The response includes the OwnershipTransferred event.

```typescript
const args = {
  liquidSplitAddress: '0xb5Ce41320F3d486671918733BB3226E3981Db62b',
  newOwner: '0x2fa128274cfcf47afd4dc03cd3f2a59af09b6a72',
};

const response = await liquidSplitClient.transferOwnership(args);
```

--------------------------------

### Make Split Immutable

Source: https://docs.splits.org/sdk/splits-v1

Makes a specified split address immutable, preventing further changes. This operation is restricted to the controller of the split address. It requires the split address to be made immutable.

```javascript
const args = {
  splitAddress: '0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
};
const response = await splitsClient.makeSplitImmutable(args);
```

--------------------------------

### Check Operator Status

Source: https://docs.splits.org/sdk/warehouse

Determines if a specified operator address is authorized for a given owner address. This function requires both addresses and returns a boolean indicating operator status.

```javascript
constargs= {
  ownerAddress:'0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
  operatorAddress:'0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
}
constresponse=awaitwarehouseClient.isOperator(args)
```

--------------------------------

### Recover Non-Waterfall Funds

Source: https://docs.splits.org/sdk/waterfall

Recovers the balance of a specified token for a given waterfall module address to a designated recipient. This function is useful for retrieving funds that were not distributed through the waterfall mechanism.

```javascript
const args = {
  waterfallModuleAddress: "0x8904D1fBfc9c88792aaaE8f452ac57E1Ba2130fC",
  token: "0x64d91f12ece7362f91a6f8e7940cd55f05060b92",
  recipient: "0x2fa128274cfcf47afd4dc03cd3f2a59af09b6a72"
};
const response = await waterfallClient.recoverNonWaterfallFunds(args);
```

--------------------------------

### Invalidate Nonce using Warehouse Client (JavaScript)

Source: https://docs.splits.org/sdk/warehouse

Invalidates a specific nonce for the caller using the Splits SDK's Warehouse client. This is used to cancel pending transactions or operations associated with that nonce. Requires the nonce value.

```javascript
constargs= {
  nonce:0,
}
constresponse=awaitwarehouseClient.invalidateNonce(args)
```

--------------------------------

### Check if Split is Paused

Source: https://docs.splits.org/sdk/splits-v2

Checks the paused status of a Split contract. It requires the Split contract address and returns a boolean indicating whether the contract is currently paused.

```javascript
constargs= {
  splitAddress:'0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
}
constresponse=awaitsplitsClient.paused(args)
```

--------------------------------

### Cancel Control Transfer

Source: https://docs.splits.org/sdk/splits-v1

Cancels an ongoing transfer of control for a split address. This action can only be performed by the current controller of the split. It requires the split address whose control transfer needs to be canceled.

```javascript
const args = {
  splitAddress: '0xd9137B84f56D61Bb961082DD9Eb21bE3D7B14cB9',
};
const response = await splitsClient.cancelControlTransfer(args);
```

=== COMPLETE CONTENT === This response contains all available snippets from this library. No additional content exists. Do not make further requests.