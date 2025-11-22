### Install Dependencies with pnpm

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-quickstart

Installs the viem and permissionless libraries required for building with ERC-4337 and Safe accounts.

```bash
pnpm install viem permissionless
```

--------------------------------

### Install Safe CLI

Source: https://docs.safe.global/advanced/cli-overview

Instructions for installing the Safe CLI, a command-line utility for Safe Smart Accounts. This section covers the necessary steps to get the CLI set up for use.

```bash
npm install -g @safe-global/safe-cli
```

--------------------------------

### Safe Transaction Service Installation Guide

Source: https://docs.safe.global/resource-hub_page=3

An installation guide for the Safe Transaction Service, providing instructions for setting up and running the service.

```English
Installation guide for the Safe Transaction Service.
```

--------------------------------

### Create Safe Account Client

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-quickstart

Creates the smart account client with the Safe account, entry point, chain, bundler transport, and middleware for gas price and sponsorship.

```javascript
const safeAccountClient = createSmartAccountClient({
  account: safeAccount,
  entryPoint: ENTRYPOINT_ADDRESS_V06,
  chain: chain,
  bundlerTransport: http(`https://api.pimlico.io/v1/${chainName}/rpc?add_balance_override&apikey=${PIMLICO_API_KEY}`),
  middleware: {
    gasPrice: async () => (await bundlerClient.getUserOperationGasPrice()).fast,
    sponsorUserOperation: paymasterClient.sponsorUserOperation
  }
})
```

--------------------------------

### Setup Project for Safe Migration Tutorial

Source: https://docs.safe.global/advanced/smart-account-migration

This snippet outlines the necessary commands to set up a new project for the Safe migration tutorial. It includes creating a directory, initializing an npm project, and installing required packages like @safe-global/protocol-kit, @safe-global/types-kit, and viem.

```bash
mkdir safe-migration-tutorial && cd safe-migration-tutorial  
npm init -y  
npm install @safe-global/protocol-kit @safe-global/types-kit viem  
```

--------------------------------

### Install Dependencies for Web3Auth Signer

Source: https://docs.safe.global/sdk/signers/web3auth

Installs the necessary npm packages for integrating Web3Auth with the Safe{Core} SDK. This includes the modal, base, and ethereum-provider packages from Web3Auth.

```bash
npm install @web3auth/modal @web3auth/base @web3auth/ethereum-provider
```

--------------------------------

### Initialize Pimlico Bundler Client

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-quickstart

Instantiates the bundler client using Pimlico API v1 for Bundler methods. Requires a PIMLICO_API_KEY and specifies the entry point address.

```javascript
const bundlerClient = createPimlicoBundlerClient({
  transport: http(`https://api.pimlico.io/v1/${chainName}/rpc?add_balance_override&apikey=${PIMLICO_API_KEY}`),
  entryPoint: ENTRYPOINT_ADDRESS_V06
})
```

--------------------------------

### Install Safe CLI with Docker

Source: https://docs.safe.global/advanced/cli-installation

This snippet shows how to install and run the Safe CLI using Docker. It includes commands for creating new Safe accounts and for running the CLI with an existing Safe, requiring Docker to be installed.

```Shell
docker run -it safeglobal/safe-cli safe-creator
```

```Shell
docker run -it safeglobal/safe-cli safe-cli <checksummed_safe_address> <ethereum_node_url>
```

--------------------------------

### Initialize Public Client

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-quickstart

Instantiates a standard public client for regular Ethereum RPC calls. Requires defining the RPC URL based on the network.

```javascript
const publicClient = createPublicClient({
  transport: http(`https://rpc.ankr.com/${chainName}`)
})
```

--------------------------------

### Install and Start AASA Server

Source: https://docs.safe.global/advanced/passkeys/tutorials/react-native

Installs project dependencies and starts the Node.js Express server for AASA testing. This server is used to serve the registration files.

```Bash
cd aasa-server
npm install
npm start
```

--------------------------------

### Install Safe Stack Helm Chart

Source: https://docs.safe.global/core-api/safe-infrastructure-deployment

This snippet shows the commands to add the Safe Helm chart repository, update it, and then install the safe-stack chart with a custom values file and optional namespace.

```bash
helm repo add safe https://5afe.github.io/safe-helm-charts/charts/packages
helm repo update
helm install [RELEASE_NAME] safe/safe-stack -f your_values.yaml [-n NAMESPACE]
```

--------------------------------

### Create Safe Account

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-quickstart

Creates a Safe account based on the signer address, entry point address, an optional saltNonce, and the safeVersion. The optional address parameter is for existing Safe accounts.

```javascript
const safeAccount = await signerToSafeSmartAccount(publicClient, {
  entryPoint: ENTRYPOINT_ADDRESS_V06,
  signer: signer,
  saltNonce: 0n, // Optional
  safeVersion: '1.4.1',
  address: '0x...' // Optional. Only for existing Safe accounts.
})
```

--------------------------------

### Install Dependencies - Safe SDK

Source: https://docs.safe.global/sdk/starter-kit/guides/send-user-operations

Installs the necessary dependencies for the Safe SDK starter kit, enabling the use of advanced features like user operations.

```bash
pnpm add @safe-global/sdk-starter-kit
```

--------------------------------

### Install Safe Singleton Factory

Source: https://docs.safe.global/core-api/safe-contracts-deployment

Installs the latest version of the @safe-global/safe-singleton-factory npm package as a development dependency. This ensures you have the necessary factory contract for deployment.

```javascript
npm i --save-dev @safe-global/safe-singleton-factory
```

--------------------------------

### Install Dependencies with pnpm

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-detailed

Installs the viem and permissionless libraries, which are essential for interacting with blockchain networks and implementing ERC-4337 functionality.

```bash
pnpm install viem permissionless
```

--------------------------------

### Install Dependencies - Safe SDK

Source: https://docs.safe.global/sdk/starter-kit/guides/send-transactions

Installs the necessary Safe SDK starter kit package using pnpm. This is a prerequisite for using the SDK's functionalities.

```bash
pnpm add @safe-global/sdk-starter-kit
```

--------------------------------

### Install Safe{Core} SDK Starter Kit

Source: https://docs.safe.global/reference-sdk-starter-kit/overview

This snippet shows how to install the Safe{Core} SDK Starter Kit using different package managers (pnpm, npm, yarn). This is the first step to integrating Safe accounts into your front-end application.

```bash
pnpm add @safe-global/sdk-starter-kit
```

```bash
npm install @safe-global/sdk-starter-kit
```

```bash
yarn add @safe-global/sdk-starter-kit
```

--------------------------------

### Safe Core SDK Introduction and AI Agents Setup

Source: https://docs.safe.global/resource-hub_source=Safe+Team&tag=Tutorial

Get a brief introduction to the Safe Core SDK and learn how to set up a Safe Smart Account for your AI agent. This webinar covers the foundational aspects of using the SDK for AI integrations.

```JavaScript
/*
  This section is a placeholder for JavaScript code examples using Safe Core SDK.
  It would demonstrate basic SDK usage for AI agent setup.
*/
console.log('Safe Core SDK AI Agent Setup Example');
```

--------------------------------

### Solidity Safe Setup Initialization

Source: https://docs.safe.global/reference-smart-account/setup/setup

Demonstrates the usage of the `setup` function to initialize a Safe contract. This function sets the initial owners, threshold, and other critical parameters for the Safe. It can only be called once per proxy.

```Solidity
interface ISafe {
    function setup(
        address[] _owners,
        uint256 _threshold,
        address to,
        bytes data,
        address fallbackHandler,
        address paymentToken,
        uint256 payment,
        address payable paymentReceiver
    ) external;
}

contract Example {
  function example() ... {
      (ISafe safe).setup(
        [0x..., 0x...],
        1,
        0x...,
        "0x...",
        0x...,
        0x...,
        0,
        0x...
      );
  }
}
```

--------------------------------

### Install Dependencies for Safe Deployment

Source: https://docs.safe.global/sdk/protocol-kit/guides/safe-deployment

Installs the necessary packages, @safe-global/protocol-kit and viem, for deploying a Safe using the Protocol Kit.

```bash
pnpm add @safe-global/protocol-kit viem
```

--------------------------------

### Install Safe Protocol Kit

Source: https://docs.safe.global/sdk/protocol-kit/reference

Installs the Safe Protocol Kit using Yarn. This is a necessary step before using the Protocol Kit to interact with Safe Smart Accounts.

```bash
yarn add @safe-global/protocol-kit
```

--------------------------------

### Install Magic SDK Dependency

Source: https://docs.safe.global/sdk/signers/magic

Installs the Magic SDK package using npm, yarn, or pnpm. This is a prerequisite for using Magic authentication with the Safe{Core} SDK.

```bash
npm install magic-sdk
```

--------------------------------

### Configure and Initialize Web3Auth

Source: https://docs.safe.global/sdk/signers/web3auth

Configures the Ethereum provider with chain-specific details (e.g., chain ID, RPC target) and initializes the Web3Auth instance. This setup is necessary before initiating the login process.

```javascript
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0xaa36a7',
  rpcTarget: 'https://ethereum-sepolia-rpc.publicnode.com',
  displayName: 'Ethereum Sepolia Testnet',
  blockExplorerUrl: 'https://sepolia.etherscan.io',
  ticker: 'ETH',
  tickerName: 'Ethereum',
  logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
}

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig }
})

const web3auth = new Web3Auth({
  clientId: WEB3AUTH_CLIENT_ID,
  privateKeyProvider,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET
})

await web3auth.initModal()
```

--------------------------------

### Install Safe Protocol Kit

Source: https://docs.safe.global/home/ai-agent-quickstarts/basic-agent-setup

This snippet shows how to add the Safe Protocol Kit to your project using an import statement. This is the first step in integrating Safe AI.

```javascript
import Safe from '@safe-global/protocol-kit'
```

--------------------------------

### Install Protocol Kit Dependencies

Source: https://docs.safe.global/sdk/protocol-kit/guides/multichain-safe-deployment

Installs the necessary Protocol Kit and Viem packages for Safe deployment. Viem is used for blockchain interaction.

```bash
pnpm add @safe-global/protocol-kit viem
```

--------------------------------

### Initialize Hardhat Project and Install Dependencies

Source: https://docs.safe.global/advanced/smart-account-modules/smart-account-modules-tutorial

This snippet shows how to set up a new project directory, initialize npm, and install necessary development dependencies including Hardhat, Safe Contracts, OpenZeppelin Contracts, and Hardhat Dependency Compiler.

```bash
mkdir safe-module-tutorial && cd safe-module-tutorial
npm init -y
npm add -D hardhat @safe-global/safe-contracts @openzeppelin/contracts hardhat-dependency-compiler
```

--------------------------------

### Install Hardhat and Safe Contracts

Source: https://docs.safe.global/advanced/smart-account-guards/smart-account-guard-tutorial

This bash command installs Hardhat, Safe contracts, and the hardhat-dependency-compiler as development dependencies using npm.

```Bash
npm add -D hardhat @safe-global/safe-contracts hardhat-dependency-compiler  
```

--------------------------------

### Initialize Protocol Kit with Safe Account

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Initializes the Protocol Kit instance and connects to a Safe account using the `init` method. This example demonstrates the basic setup with provider, signer, and safe address.

```typescript
import Safe from '@safe-global/protocol-kit'

const protocolKit = await Safe.init({
  provider,
  signer,
  safeAddress // or predictedSafe
})
```

--------------------------------

### Install Safe React Hooks Dependencies

Source: https://docs.safe.global/sdk/react-hooks/guides/send-transactions

Installs the necessary Safe React Hooks package using pnpm. This is a prerequisite for using the hooks in your project.

```bash
pnpm add @safe-global/safe-react-hooks
```

--------------------------------

### Install Safe{Core} SDK and other dependencies

Source: https://docs.safe.global/home/passkeys-tutorials/safe-passkeys-tutorial

Installs the necessary dependencies for the project, including Safe{Core} SDK's Protocol Kit and Relay Kit, viem for encoding transactions, Material UI for styling, and @svgr/webpack for SVG loading.

```bash
pnpm add @safe-global/protocol-kit@4.1.0 @safe-global/relay-kit@3.1.0 viem @emotion/react @emotion/styled @mui/material @mui/icons-material @svgr/webpack
```

--------------------------------

### Get Safe Operation Confirmations with Offset

Source: https://docs.safe.global/reference-sdk-api-kit/getsafeoperationconfirmations

Illustrates fetching Safe operation confirmations by specifying an `offset` to start retrieving results from a particular index. The `limit` is not set in this example.

```typescript
const confirmationsResponse = await apiKit.getSafeOperationConfirmations(
  '0x...',
  {
    offset: 50
  }
)
```

--------------------------------

### Install Hardhat Dependencies

Source: https://docs.safe.global/advanced/smart-account-fallback-handler/smart-account-fallback-handler-tutorial

Installs Hardhat, Safe Global contracts, and the Hardhat dependency compiler as development dependencies.

```bash
npm add -D hardhat @safe-global/safe-contracts hardhat-dependency-compiler
```

--------------------------------

### Install Safe SDK Dependencies

Source: https://docs.safe.global/sdk/api-kit/guides/propose-and-confirm-transactions

Installs the necessary packages for interacting with the Safe SDK, including API Kit, Protocol Kit, and Types Kit.

```bash
yarn add @safe-global/api-kit \
  @safe-global/protocol-kit \
  @safe-global/types-kit
```

--------------------------------

### Initialize Pimlico Paymaster Client

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-quickstart

Instantiates the paymaster client using Pimlico API v2 for Paymaster methods, enabling interaction with the Verifying Paymaster endpoint for sponsorship. Requires a PIMLICO_API_KEY and specifies the entry point address.

```javascript
const paymasterClient = createPimlicoPaymasterClient({
  transport: http(`https://api.pimlico.io/v2/${chainName}/rpc?add_balance_override&apikey=${PIMLICO_API_KEY}`),
  entryPoint: ENTRYPOINT_ADDRESS_V06
})
```

--------------------------------

### Get Account Init Code

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-detailed

Calculates the initCode for deploying an ERC-4337 smart account. This involves concatenating the SafeProxyFactory contract address with initCodeCallData, which encodes a call to createProxyWithNonce. The initializer is generated using getInitializerCode, which encodes a call to the Safe contract's setup function.

```TypeScript
const initCode = await getAccountInitCode({
  owner: signer.address,
  addModuleLibAddress: ADD_MODULE_LIB_ADDRESS,
  safe4337ModuleAddress: SAFE_4337_MODULE_ADDRESS,
  safeProxyFactoryAddress: SAFE_PROXY_FACTORY_ADDRESS,
  safeSingletonAddress: SAFE_SINGLETON_ADDRESS,
  saltNonce,
  multiSendAddress: SAFE_MULTISEND_ADDRESS,
  erc20TokenAddress: USDC_TOKEN_ADDRESS,
  paymasterAddress: ERC20_PAYMASTER_ADDRESS
})
```

--------------------------------

### Fetch Gas Price

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-quickstart

Fetches the current gas price values from the bundler client, which will be used later when adding them to a transaction.

```javascript
const gasPrices = await bundlerClient.getUserOperationGasPrice()
```

--------------------------------

### Install Safe CLI with Python pip

Source: https://docs.safe.global/advanced/cli-installation

This snippet provides the command to install the Safe CLI using Python's pip package manager. It requires Python version 3.9 or higher to be installed.

```Shell
pip3 install -U safe-cli
```

--------------------------------

### Import Necessary Modules for ERC-4337 Safe Accounts

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-quickstart

Imports essential functions and constants from the permissionless and viem libraries for creating ERC-4337 compatible Safe accounts. This includes clients for bundlers and paymasters, and utilities for signing and encoding.

```typescript
import 'dotenv/config'
import { ENTRYPOINT_ADDRESS_V06, createSmartAccountClient } from 'permissionless'
import { signerToSafeSmartAccount } from 'permissionless/accounts'
import {  
  createPimlicoBundlerClient,  
  createPimlicoPaymasterClient  
} from 'permissionless/clients/pimlico'
import { createPublicClient, http, Hex, encodeFunctionData, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { gnosis } from 'viem/chains'
```

--------------------------------

### Setup Next.js App with pnpm

Source: https://docs.safe.global/advanced/passkeys/tutorials/react

Initializes a new Next.js application using pnpm and configures it with TypeScript, ESLint, and the App router. It prompts the user to select specific configurations during setup.

```bash
pnpm create next-app  

```

--------------------------------

### Safe Singleton Setup

Source: https://docs.safe.global/advanced/erc-7579/7579-safe

Details the process of upgrading and setting the SafeSingleton, including the initial hash and pre-validation setup.

```Solidity
// Inside Launchpad contract
function upgradeSingleton(address _newSingleton) public {
  SafeStorage.singleton = _newSingleton;
}

function preValidationSetup(bytes32 _initHash, address _to, bytes memory _preInit) public {
  // ... setup logic ...
  // Delegatecall to _to with _preInit data
  (_to).delegatecall(_preInit);
}
```

--------------------------------

### Setup Contracts and Variables in Before Hook

Source: https://docs.safe.global/advanced/smart-account-fallback-handler/smart-account-fallback-handler-tutorial

This code snippet sets up the testing environment by deploying and configuring necessary contracts like Safe, ERC1271FallbackHandler, and SafeProxyFactory. It configures a Safe with a single owner (Alice) and a threshold of 1, and deploys an ERC1271FallbackHandler. The setup also includes creating a Safe proxy using the SafeProxyFactory and encoding the setup data for the Safe contract.

```javascript
1
  // Setup signers and deploy contracts before running tests  

2
  beforeEach(async () => {  

3
    [deployer, alice] = await ethers.getSigners();  

4
  

5
    safeFactory = await ethers.getContractFactory("Safe", deployer);  

6
  

7
    // Deploy the ERC1271FallbackHandler contract  

8
    exampleFallbackHandler = await (  

9
      await ethers.getContractFactory("ERC1271FallbackHandler", deployer)  

10
    ).deploy();  

11
  

12
    masterCopy = await safeFactory.deploy();  

13
  

14
    proxyFactory = await (  

15
      await ethers.getContractFactory("SafeProxyFactory", deployer)  

16
    ).deploy();  

17
  

18
    const ownerAddresses = [await alice.getAddress()];  

19
  

20
    const safeData = masterCopy.interface.encodeFunctionData("setup", [  

21
      ownerAddresses,  

22
      threshold,  

23
      ZeroAddress,  

24
      "0x",  

25
      exampleFallbackHandler.target,  

26
      ZeroAddress,  

27
      0,  

28
      ZeroAddress,  

29
    ]);  

30
  

31
    // Read the safe address by executing the static call to createProxyWithNonce function  

32
    const safeAddress = await proxyFactory.createProxyWithNonce.staticCall(  

33
      await masterCopy.getAddress(),  

34
      safeData,  

35
      0n  

36
    );  

37
  

38
    // Create the proxy with nonce  

39
    await proxyFactory.createProxyWithNonce(  

40
      await masterCopy.getAddress(),  

41
      safeData,  

42
      0n  

43
    );  

44
  

45
    if (safeAddress === ZeroAddress) {  

46
      throw new Error("Safe address not found");  

47
    }  

48
  

49
    safe = await ethers.getContractAt("Safe", safeAddress);  

50
  });  
```

--------------------------------

### Get All Transactions Request Example (curl)

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis

This provides a basic curl command structure for requesting all transactions associated with a Safe address. It's a command-line alternative to the TypeScript example.

```curl
curl -X GET "https://safe-transaction-sepolia.safe.global/api/v1/safes/{address}/all-transactions/" -H "accept: application/json"
```

--------------------------------

### Configure Safe Infrastructure Environment

Source: https://docs.safe.global/core-api/safe-infrastructure-deployment

This snippet shows how to copy the sample environment file and configure essential variables for the Safe infrastructure deployment, such as service versions and RPC endpoint.

```bash
cp .env.sample .env
vi .env
REVERSE_PROXY_PORT=8000
CFG_VERSION=latest
CGW_VERSION=latest
TXS_VERSION=latest
UI_VERSION=latest
EVENTS_VERSION=latest
RPC_NODE_URL=<REPLACE BY YOUR RPC ENDPOINT>
```

--------------------------------

### Initialize npm Project

Source: https://docs.safe.global/advanced/smart-account-fallback-handler/smart-account-fallback-handler-tutorial

Initializes a new Node.js project and sets up the package.json file.

```bash
mkdir safe-fallback-handler-tutorial && cd safe-fallback-handler-tutorial
npm init -y
```

--------------------------------

### Deploy and Maintain Safe{Core} Infrastructure

Source: https://docs.safe.global/core-api/safe-installation-overview

Options for deploying and maintaining the Safe{Wallet} and Safe{Core} infrastructure. This includes using Safe's Platform-as-a-Service, third-party integrators, or self-hosting.

```text
You can find detailed instructions under infrastructure deployment.
```

--------------------------------

### Sponsor User Operation with Sponsorship Policy ID

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-quickstart

Replaces the default sponsorUserOperation in the middleware to sponsor transactions using a specific Pimlico sponsorship ID.

```javascript
sponsorUserOperation: ({ userOperation }) => {
  return paymasterClient.sponsorUserOperation({
    userOperation,
    sponsorshipPolicyId: SPONSORSHIP_POLICY_ID
  })
}
```

--------------------------------

### Instantiate viem Provider and Get Signer

Source: https://docs.safe.global/sdk/signers/web3auth

This snippet shows how to import necessary functions from 'viem', define the chain, and create a wallet client using a Web3Auth provider. It then retrieves the user's signer address.

```javascript
import { createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'

const provider = createWalletClient({
  chain: sepolia,
  transport: custom(web3authProvider)
})

const signer = await provider.getAddresses())[0]
```

--------------------------------

### Starter Kit: Interact with Safe Smart Accounts

Source: https://docs.safe.global/sdk/overview

The Starter Kit is the entry point for interacting with Safe Smart Accounts. It abstracts complex logic from other kits, offering a simplified way to deploy new accounts and manage Safe transaction flows, including user operations, multi-signature transactions, and off-chain/on-chain messages.

```javascript
import { SafeSmartContractAccount } from '@safe-global/account-abstraction-kit';

// Example usage (conceptual):
const safeAccount = new SafeSmartContractAccount({
  // ... configuration options
});

// Deploy new account
await safeAccount.deploy();

// Handle transaction flow
// ... (details depend on transaction type)
```

--------------------------------

### Launchpad Module Installation

Source: https://docs.safe.global/advanced/erc-7579/7579-safe

Illustrates how the Launchpad module handles the installation of other modules, such as Safe7579, emitting events upon successful installation.

```Solidity
// Inside Launchpad contract
function enableModule(address _module) external {
  // ... module installation logic ...
  emit ModuleInstalled(address(this), _module);
}
```

--------------------------------

### Define Network and API Key Constants

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-quickstart

Sets up constants for the target blockchain network (Gnosis), its name, a sponsorship policy ID from Pimlico, and retrieves the Pimlico API key and the private key for the Safe account owner from environment variables.

```typescript
// Network  
const chain = gnosis  
const chainName = 'gnosis'  
const SPONSORSHIP_POLICY_ID = '<insert_pimlico_sponsorship_policy_id>'  
  
// Keys  
const PIMLICO_API_KEY = process.env.PIMLICO_API_KEY  
const PRIVATE_KEY = process.env.PRIVATE_KEY as Hex  
```

--------------------------------

### Create Signer Instance from Private Key

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-quickstart

Generates a signer instance using the private key, which will serve as the owner of the Safe account upon deployment. This is a crucial step for authorizing transactions.

```typescript
const signer = privateKeyToAccount(PRIVATE_KEY as Hash)
```

--------------------------------

### Submit Transaction

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-quickstart

Submits a transaction using the safeAccountClient's sendTransaction method, specifying the recipient, value, data, and gas parameters.

```javascript
const txHash = await safeAccountClient.sendTransaction({
  to: safeAccount.address,
  value: parseEther('0'),
  data: encodeFunctionData({
    abi: '',
    functionName: '',
    args: []
  }),
  maxFeePerGas: gasPrices.fast.maxFeePerGas,
  maxPriorityFeePerGas: gasPrices.fast.maxPriorityFeePerGas
})
```

--------------------------------

### Initialize Project with npm

Source: https://docs.safe.global/advanced/smart-account-guards/smart-account-guard-tutorial

This snippet shows the bash commands to create a new project directory and initialize an npm project within it.

```Bash
mkdir safe-guard-tutorial && cd safe-guard-tutorial   
npm init -y  
```

--------------------------------

### Sample Request to Get Multisig Transaction

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis

Demonstrates how to make a GET request to the Safe Transaction API to retrieve multisig transaction details using a specific transaction hash. This example uses the Ethereum Sepolia endpoint.

```curl
curl -X GET https://safe-transaction-sepolia.safe.global/api/api/v1/multisig-transactions/0xa059b4571d8e6cf551eea796f9d86a414083bdc3d5d5be88486589a7b6214be2/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \

```

--------------------------------

### Install Safe SDK Dependencies

Source: https://docs.safe.global/sdk/protocol-kit/guides/execute-transactions

Installs the necessary Safe SDK packages for API, Protocol Kit, and types. These are essential for interacting with Safe accounts and managing transactions.

```bash
pnpm add @safe-global/api-kit \
  @safe-global/protocol-kit \
  @safe-global/types-kit
```

--------------------------------

### Get Messages with Offset Configuration

Source: https://docs.safe.global/reference-sdk-api-kit/getmessages

Fetches messages for a Safe account, starting from a specified offset.

```typescript
const messagesResponse = await apiKit.getMessages(
  '0x...',
  {
    offset: 50
  }
)
```

--------------------------------

### Safe Core SDK Introduction and AI Agents Setup (Webinar)

Source: https://docs.safe.global/resource-hub_page=3

This webinar offers a brief introduction to setting up a Safe Smart Account for AI agents, focusing on the Safe Core SDK and AI integration.

--------------------------------

### Install API Kit using pnpm

Source: https://docs.safe.global/reference-sdk-api-kit/overview

Installs the Safe Transaction Service API Kit using the pnpm package manager. This is the primary method for adding the SDK to your project.

```bash
pnpm add @safe-global/api-kit
```

--------------------------------

### Authenticate GET Request with API Key using JavaScript Fetch

Source: https://docs.safe.global/core-api/how-to-use-api-keys

This example shows how to authenticate a GET request to the Safe API using JavaScript's Fetch API. The API key is passed in the 'Authorization' header with the 'Bearer' scheme.

```JavaScript
const apiUrl = "https://api.safe.global/tx-service/eth/api/v2/safes/0x5298a93734c3d979ef1f23f78ebb871879a21f22/multisig-transactions";
const apiKey = "YOUR_API_KEY";

fetch(apiUrl, {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${apiKey}`
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

--------------------------------

### Get Safe Creation Status (cURL)

Source: https://docs.safe.global/core-api/transaction-service-reference/chiado

An example of how to retrieve Safe creation information using cURL, demonstrating the HTTP request structure.

```curl
curl -X GET "/tx-service/chi/api/v1/safes/{address}/creation/" -H "accept: application/json"
```

--------------------------------

### Safe Core SDK Introduction and AI Agents Setup (Webinar)

Source: https://docs.safe.global/resource-hub_page=2

This webinar offers a brief introduction to setting up a Safe Smart Account for AI agents, focusing on the Safe Core SDK and AI integration.

--------------------------------

### Get User Operation by Hash - cURL Request Example

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis-chain

This cURL command shows how to make a GET request to the API endpoint to retrieve a user operation by its hash. Replace '{user_operation_hash}' with the actual hash of the user operation.

```curl
curl -X GET "/tx-service/gno/api/v1/user-operations/{user_operation_hash}/"
```

--------------------------------

### Sample Response for Get Transfers

Source: https://docs.safe.global/core-api/transaction-service-reference/avalanche

Example JSON response for retrieving transfers associated with a Safe address. It details a single Ether transfer with its properties.

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "type": "ETHER_TRANSFER",
      "executionDate": "2024-07-24T20:54:48Z",
      "blockNumber": 6369595,
      "transactionHash": "0x4c8bc3a9f32eed6b4cb8225d6884e9c7006d6740b0a6896cee7b254aa037920e",
      "to": "0x3A16E3090e32DDeD2250E862B9d5610BEF13e93d",
      "value": "10000000000",
      "tokenId": null,
      "tokenAddress": null,
      "transferId": "i4c8bc3a9f32eed6b4cb8225d6884e9c7006d6740b0a6896cee7b254aa037920e0,0,0",
      "tokenInfo": null,
      "from": "0x5298A93734C3D979eF1f23F78eBB871879A21F22"
    }
  ]
}
```

--------------------------------

### Install relay-kit package

Source: https://docs.safe.global/sdk/relay-kit/reference/safe-4337-pack

Installs the necessary relay-kit package to use the Safe4337Pack in your project.

```bash
yarn add @safe-global/relay-kit
```

--------------------------------

### Import Viem Wallet Client Dependencies

Source: https://docs.safe.global/sdk/signers/magic

Imports necessary functions from the 'viem' library to create a wallet client. This includes 'createWalletClient' and 'custom', along with chain definitions like 'sepolia'.

```javascript
import { createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'
```

--------------------------------

### Run Next.js Development Server

Source: https://docs.safe.global/advanced/passkeys/tutorials/react

Starts the local development server for the Next.js application. This command allows you to view and test the application in your browser at http://localhost:3000.

```bash
pnpm dev  

```

--------------------------------

### Initialize Safe4337Pack and Get User Operation

Source: https://docs.safe.global/core-api/transaction-service-reference/xlayer

Initializes the Safe4337Pack with provider, signer, and bundler URL, then retrieves a user operation by its hash. This example demonstrates setting up the pack and fetching a specific operation's details.

```TypeScript
import { Safe4337Pack } from '@safe-global/relay-kit'

const safe4337Pack = await Safe4337Pack.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  bundlerUrl: `https://api.pimlico.io/v1/sepolia/rpc?add_balance_override&apikey=${PIMLICO_API_KEY}`,
  options: {
    safeAddress: '0x97566B1eCaCd321736F183117C26ACe1b72F4a1b'
  }
})

const userOperationHash =
  '0x7bf502ad622e62823c971d800033e82e5670fcdd1c19437555fb2d8b7eefd644'

const userOperation = await safe4337Pack.getUserOperationByHash(
  userOperationHash
)

console.log(userOperation)
```

--------------------------------

### Sample Safe Balance Response

Source: https://docs.safe.global/core-api/transaction-service-reference/ink

Example JSON response structure for the Get Safe Balances endpoint, illustrating the format for native coin and ERC20 token balances.

```json
[
  {
    "tokenAddress": null,
    "token": null,
    "balance": "9899990000000000"
  },
  {
    "tokenAddress": "0x0D5b70467E61125b242E70831aEd15D7C12E3F0D",
    "token": {
      "name": "SampleToken",
      "symbol": "ST",
      "decimals": 18,
      "logoUri": "https://safe-transaction-assets.safe.global/tokens/logos/0x0D5b70467E61125b242E70831aEd15D7C12E3F0D.png"
    },
    "balance": "10000000000000000000"
  }
]
```

--------------------------------

### Create and Navigate to Components Directory

Source: https://docs.safe.global/advanced/passkeys/tutorials/nuxt

This snippet demonstrates bash commands to create a new directory for components and then navigate into it. This is a common setup step for organizing project files.

```bash
mkdir ../components
```

```bash
cd ../components
```

```bash
touch LoginWithPasskey.vue
```

--------------------------------

### Install Safe Protocol Kit

Source: https://docs.safe.global/sdk/protocol-kit/guides/signatures/transactions

Installs the Safe Protocol Kit using Yarn. This is a necessary dependency for interacting with Safe smart contracts and managing transactions.

```bash
yarn install @safe-global/protocol-kit
```

--------------------------------

### Install API Kit using npm

Source: https://docs.safe.global/reference-sdk-api-kit/overview

Installs the Safe Transaction Service API Kit using the npm package manager. This is an alternative method for adding the SDK to your project.

```bash
npm install @safe-global/api-kit
```

--------------------------------

### Get User Public Address

Source: https://docs.safe.global/sdk/signers/magic

Retrieves user information, including their public address, after a successful login. This address can be used as a Safe owner.

```javascript
const metadata = await magic.user.getInfo()
const signer = metadata.publicAddress
```

--------------------------------

### Install Dependencies for Safe{Core} SDK and safe-eth-py

Source: https://docs.safe.global/core-api/transaction-service-guides/delegates

Installs the necessary libraries for interacting with the Safe{Core} SDK and related utilities using Yarn.

```bash
yarn add ethers @safe-global/api-kit @safe-global/protocol-kit @safe-global/types-kit
```

--------------------------------

### Setup Contracts and Variables in Before Hook (JavaScript)

Source: https://docs.safe.global/advanced/smart-account-modules/smart-account-modules-tutorial

This snippet sets up the testing environment by deploying the Safe, TestToken, and SafeProxyFactory contracts. It initializes signers, retrieves the network chain ID, and encodes transaction data for setting up a new Safe instance. It also includes logic to read and verify the Safe address before executing the proxy creation.

```javascript
let deployer, alice, bob, charlie;
let chainId;
let masterCopy, token, safe;
let safeAddress;
const ZeroAddress = "0x0000000000000000000000000000000000000000";

before(async () => {
  [deployer, alice, bob, charlie] = await ethers.getSigners();

  chainId = (await ethers.provider.getNetwork()).chainId;
  const safeFactory = await ethers.getContractFactory("Safe", deployer);
  masterCopy = await safeFactory.deploy();

  token = await (
    await ethers.getContractFactory("TestToken", deployer)
  ).deploy("test", "T");

  const proxyFactory = await (
    await ethers.getContractFactory("SafeProxyFactory", deployer)
  ).deploy();

  const safeData = masterCopy.interface.encodeFunctionData("setup", [
    [await alice.getAddress()],
    1,
    ZeroAddress,
    "0x",
    ZeroAddress,
    ZeroAddress,
    0,
    ZeroAddress,
    ]);

  safeAddress = await proxyFactory.createProxyWithNonce.staticCall(
    await masterCopy.getAddress(),
    safeData,
    0n
  );
    
  if (safeAddress === ZeroAddress) {
    throw new Error("Safe address not found");
  }

  await proxyFactory.createProxyWithNonce(
    await masterCopy.getAddress(),
    safeData,
    0n
  );

  safe = await ethers.getContractAt("Safe", safeAddress);

  await token
    .connect(deployer)
    .mint(safeAddress, BigInt(10) ** BigInt(18) * BigInt(100000));
});
```

--------------------------------

### Install Dynamic SDK Dependencies

Source: https://docs.safe.global/sdk/signers/dynamic

Installs the necessary packages for the Dynamic SDK, including core functionalities and Ethereum-specific connectors, using npm, yarn, or pnpm.

```bash
npm install @dynamic-labs/sdk-react-core @dynamic-labs/ethereum
```

--------------------------------

### Get Safe Balances Request

Source: https://docs.safe.global/core-api/transaction-service-reference/avalanche

Example cURL request to retrieve paginated balances for a Safe account, including headers for authorization and content type.

```curl
curl -X GET https://api.safe.global/tx-service/avax/api/v2/safes/0xcd2E72aEBe2A203b84f46DEEC948E6465dB51c75/balances/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY"
```

--------------------------------

### Get Safe Operation Confirmations with Limit

Source: https://docs.safe.global/reference-sdk-api-kit/getsafeoperationconfirmations

Shows how to retrieve Safe operation confirmations with a specified `limit` to control the number of results per page. The `offset` is not provided in this example.

```typescript
const confirmationsResponse = await apiKit.getSafeOperationConfirmations(
  '0x...',
  {
    limit: 10
  }
)
```

--------------------------------

### Install API Kit using yarn

Source: https://docs.safe.global/reference-sdk-api-kit/overview

Installs the Safe Transaction Service API Kit using the yarn package manager. This is another alternative method for adding the SDK to your project.

```bash
yarn add @safe-global/api-kit
```

--------------------------------

### Get Safe Creation Info using curl

Source: https://docs.safe.global/core-api/transaction-service-reference/bsc

Provides an example of how to fetch Safe creation information using a curl command. This is useful for testing the API endpoint directly from the command line.

```curl
curl -X GET "/tx-service/bnb/api/v1/safes/{address}/creation/" -H "accept: application/json"
```

--------------------------------

### Sample Response for Get Specific Transfer

Source: https://docs.safe.global/core-api/transaction-service-reference/avalanche

Example JSON response for a specific transfer ID. It mirrors the structure of the general transfer list but for a single entry.

```json
{
  "type": "ETHER_TRANSFER",
  "executionDate": "2024-07-24T20:54:48Z",
  "blockNumber": 6369595,
  "transactionHash": "0x4c8bc3a9f32eed6b4cb8225d6884e9c7006d6740b0a6896cee7b254aa037920e",
  "to": "0x3A16E3090e32DDeD2250E862B9d5610BEF13e93d",
  "value": "10000000000",
  "tokenId": null,
  "tokenAddress": null,
  "transferId": "i4c8bc3a9f32eed6b4cb8225d6884e9c7006d6740b0a6896cee7b254aa037920e0,0,0",
  "tokenInfo": null,
  "from": "0x5298A93734C3D979eF1f23F78eBB871879A21F22"
}
```

--------------------------------

### Install Safe CLI with Ledger Support

Source: https://docs.safe.global/advanced/cli-reference/common-commands

Installs the Safe CLI with optional support for the Ledger hardware wallet. This requires the 'ledger' extra to be installed.

```bash
pip install "safe-cli[ledger]"
```

--------------------------------

### Install Project Dependencies

Source: https://docs.safe.global/advanced/passkeys/tutorials/react

Installs essential dependencies for the project, including Safe{Core} SDK (Protocol Kit and Relay Kit), viem for encoding transactions, and Material UI components for styling. It also includes svgr for loading SVG files.

```bash
pnpm add @safe-global/protocol-kit@4.1.0 @safe-global/relay-kit@3.1.0 viem @emotion/react @emotion/styled @mui/material @mui/icons-material @svgr/webpack  

```

--------------------------------

### Get On-Chain Identifier with Protocol Kit (JavaScript)

Source: https://docs.safe.global/sdk/onchain-tracking

This example shows how to retrieve the current Safe on-chain identifier by calling the `getOnchainIdentifier` method on an initialized instance of the Protocol Kit.

```JavaScript
const onchainIdentifier = protocolKit.getOnchainIdentifier()
```

--------------------------------

### Safe{Core} SDK Introduction and AI Agents Setup

Source: https://docs.safe.global/resource-hub

This webinar offers a brief introduction on how to set up a Safe Smart Account for your AI agent, focusing on the Safe{Core} SDK.

```English
In this Webinar, Safe developers Germán and Daniel provide a brief introduction how to set up a Safe Smart Account for your AI agent.
```

--------------------------------

### Install Protocol Kit Dependency

Source: https://docs.safe.global/sdk/protocol-kit/guides/signatures/messages

Installs the Safe Protocol Kit library using Yarn. This is a prerequisite for using the Protocol Kit functionalities.

```bash
yarn install @safe-global/protocol-kit
```

--------------------------------

### Interact with Safe Smart Accounts using Starter Kit (TypeScript)

Source: https://docs.safe.global/sdk/starter-kit

The Starter Kit provides a TypeScript interface for interacting with Safe smart accounts. It simplifies deploying new accounts and managing transaction flows, including user operations and multi-signature transactions. This kit is built on top of other Safe{Core} SDK kits.

```TypeScript
import { SafeSmartContractAccount } from "@safe-global/account-abstraction";
import { SafeFactory } from "@safe-global/protocol-kit";

// Example usage (conceptual):
async function deploySafe() {
  // Initialize SafeFactory and other necessary components
  const safeFactory = await SafeFactory.create({
    // ... provider and signer configuration
  });

  const safeAccountConfig = {
    owners: ["0x..."],
    threshold: 1,
  };

  const safeAccount = await safeFactory.deploySafeAccount({
    safeAccountConfig
  });

  console.log("Safe deployed at:", safeAccount.getAddress());
}
```

--------------------------------

### Setup Nuxt Application with pnpm

Source: https://docs.safe.global/advanced/passkeys/tutorials/nuxt

Initializes a new Nuxt application using pnpm and the nuxi CLI. It prompts the user to select pnpm as the package manager and to initialize a Git repository.

```bash
pnpm dlx nuxi@latest init safe-passkeys-nuxt -t ui  
```

--------------------------------

### Sample Safe Balances Response

Source: https://docs.safe.global/core-api/transaction-service-reference/arbitrum

Example JSON response structure for the Get Safe Balances API endpoint, illustrating native coin and ERC20 token balance formats.

```json
[
  {
    "tokenAddress": null,
    "token": null,
    "balance": "9899990000000000"
  },
  {
    "tokenAddress": "0x0D5b70467E61125b242E70831aEd15D7C12E3F0D",
    "token": {
      "name": "SampleToken",
      "symbol": "ST",
      "decimals": 18,
      "logoUri": "https://safe-transaction-assets.safe.global/tokens/logos/0x0D5b70467E61125b242E70831aEd15D7C12E3F0D.png"
    },
    "balance": "10000000000000000000"
  }
]
```

--------------------------------

### Clone Safe Infrastructure Repository

Source: https://docs.safe.global/core-api/safe-infrastructure-deployment

This command clones the safe-infrastructure repository from GitHub, which contains the necessary Docker Compose files for deployment.

```bash
git clone git@github.com:safe-global/safe-infrastructure.git
```

--------------------------------

### Run Next.js Development Server

Source: https://docs.safe.global/home/passkeys-tutorials/safe-passkeys-tutorial

Starts the local development server for the Next.js application. The application can then be accessed at http://localhost:3000.

```bash
pnpm dev
```

--------------------------------

### Setup and Test Token Withdraw Module

Source: https://docs.safe.global/advanced/smart-account-modules/smart-account-modules-tutorial

This snippet covers the setup of the testing environment, including deploying Safe, TestToken, and SafeProxyFactory contracts. It also demonstrates how to enable the TokenWithdrawModule for a Safe account and verifies its enablement.

```typescript
import { ethers } from "hardhat";
import { expect } from "chai";
import { Signer, TypedDataDomain, ZeroAddress } from "ethers";
import {
  Safe,
  TestToken,
  TokenWithdrawModule,
} from "../typechain-types";
import { execTransaction } from "./utils/utils";

describe("TokenWithdrawModule Tests", function () {
  let deployer: Signer;
  let alice: Signer;
  let bob: Signer;
  let charlie: Signer;
  let masterCopy: any;
  let token: TestToken;
  let safe: Safe;
  let safeAddress: string;
  let chainId: bigint;

  before(async () => {
    [deployer, alice, bob, charlie] = await ethers.getSigners();

    chainId = (await ethers.provider.getNetwork()).chainId;
    const safeFactory = await ethers.getContractFactory("Safe", deployer);
    masterCopy = await safeFactory.deploy();

    token = await (
      await ethers.getContractFactory("TestToken", deployer)
    ).deploy("test", "T");

    const proxyFactory = await (
      await ethers.getContractFactory("SafeProxyFactory", deployer)
    ).deploy();

    const safeData = masterCopy.interface.encodeFunctionData("setup", [
      [await alice.getAddress()],
      1,
      ZeroAddress,
      "0x",
      ZeroAddress,
      ZeroAddress,
      0,
      ZeroAddress,
    ]);

    safeAddress = await proxyFactory.createProxyWithNonce.staticCall(
      await masterCopy.getAddress(),
      safeData,
      0n
    );

    if (safeAddress === ZeroAddress) {
      throw new Error("Safe address not found");
    }

    await proxyFactory.createProxyWithNonce(
      await masterCopy.getAddress(),
      safeData,
      0n
    );

    safe = await ethers.getContractAt("Safe", safeAddress);

    await token
      .connect(deployer)
      .mint(safeAddress, BigInt(10) ** BigInt(18) * BigInt(100000));
  });

  const enableModule = async (): Promise<{ 
    tokenWithdrawModule: TokenWithdrawModule;
  }> => {
    const tokenWithdrawModule = await (
      await ethers.getContractFactory("TokenWithdrawModule", deployer)
    ).deploy(token.target, safeAddress);

    const enableModuleData = masterCopy.interface.encodeFunctionData(
      "enableModule",
      [tokenWithdrawModule.target]
    );

    await execTransaction([alice], safe, safe.target, 0, enableModuleData, 0);

    expect(await safe.isModuleEnabled.staticCall(tokenWithdrawModule.target)).to
      .be.true;

    return { tokenWithdrawModule };
  };

  it("Should successfully transfer tokens to bob", async function () {
    const { tokenWithdrawModule } = await enableModule();

    const amount = 10000000000000000000n; 
    const deadline = 100000000000000n;  
    const nonce = await tokenWithdrawModule.nonces(await bob.getAddress());

    const domain: TypedDataDomain = {
      name: "TokenWithdrawModule",
      version: "1",
      chainId: chainId,
      verifyingContract: await tokenWithdrawModule.getAddress(),
    };

    const types = {
      TokenWithdrawModule: [
        { name: "amount", type: "uint256" },
        { name: "beneficiary", type: "address" },

```

--------------------------------

### Initialize Safe4337Pack (v2 vs v3)

Source: https://docs.safe.global/sdk/relay-kit/guides/migrate-to-v3

Compares the initialization of Safe4337Pack in v2 using EthersAdapter with the v3 approach using a provider and optional signer. The v3 method simplifies the process by directly accepting an EIP-1193 provider or an RPC URL, and an optional signer address or private key.

```javascript
// old  
const safe4337Pack = await Safe4337Pack.init({
  ethAdapter: new EthersAdapter({ ethers, signerOrProvider }),
  // ...
})
```

```javascript
// new  
const safe4337Pack = await Safe4337Pack.init({
  provider: window.ethereum, // Or any compatible EIP-1193 provider,
  signer: 'signerAddressOrPrivateKey', // Signer address or signer private key
  // ...
})
```

```javascript
const safe4337Pack = await Safe4337Pack.init({
  provider: 'http://rpc.url', // Or websocket
  signer: 'privateKey', // Signer private key
  // ...
})
```

--------------------------------

### Get Safe Balances Request

Source: https://docs.safe.global/core-api/transaction-service-reference/chiado

Example cURL request to retrieve paginated balances for Ether and ERC20 tokens for a Safe account. Requires an API key for authorization.

```curl
curl -X GET https://api.safe.global/tx-service/chi/api/v2/safes/0xcd2E72aEBe2A203b84f46DEEC948E6465dB51c75/balances/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY"
```

--------------------------------

### Install Project Dependencies

Source: https://docs.safe.global/advanced/passkeys/tutorials/nuxt

Installs the Safe{Core} SDK (Protocol Kit and Relay Kit), viem, Pinia for Nuxt.js, and Vite node polyfills using pnpm. These are essential for interacting with Safe, sponsoring transactions, and managing application state.

```bash
pnpm add @safe-global/protocol-kit@4.1.0 @safe-global/relay-kit@3.1.0 viem @pinia/nuxt vite-plugin-node-polyfills
```

--------------------------------

### Fetch User Operation by Hash - cURL Request

Source: https://docs.safe.global/core-api/transaction-service-reference/sonic

Example cURL command to fetch a user operation by its hash. This demonstrates how to make a GET request to the /tx-service/sonic/api/v1/user-operations/{user_operation_hash}/ endpoint.

```curl
curl --location --request GET \
    '/tx-service/sonic/api/v1/user-operations/{user_operation_hash}/' \
    --header 'Content-Type: application/json'
```

--------------------------------

### Install Project Dependencies

Source: https://docs.safe.global/home/passkeys-tutorials/safe-passkeys-nuxt

Installs the Safe{Core} SDK (Protocol Kit and Relay Kit), viem, Pinia for Nuxt.js, and Vite node polyfills using pnpm. These are essential for interacting with Safe, sponsoring transactions, and managing application state.

```bash
pnpm add @safe-global/protocol-kit@4.1.0 @safe-global/relay-kit@3.1.0 viem @pinia/nuxt vite-plugin-node-polyfills
```

--------------------------------

### Initialize Hardhat Project

Source: https://docs.safe.global/advanced/smart-account-guards/smart-account-guard-tutorial

Initializes a new Hardhat project, typically for TypeScript development. This command sets up the basic project structure and necessary dependencies.

```bash
npx hardhat init
```

--------------------------------

### Setup LangChain Project Dependencies (TypeScript)

Source: https://docs.safe.global/home/ai-agent-setup

Installs necessary LangChain and Safe Global Protocol Kit dependencies for a TypeScript project. This includes core LangChain libraries, LangGraph for agent orchestration, Ollama integration, Protocol Kit for Safe interactions, and utility libraries like tsx, viem, and zod.

```shell
pnpm add @langchain/core @langchain/langgraph @langchain/ollama @safe-global/protocol-kit tsx viem zod
```

--------------------------------

### Get Paginated Modules in Solidity

Source: https://docs.safe.global/reference-smart-account/modules/getModulesPaginated

Demonstrates how to use the `getModulesPaginated` function to retrieve a list of modules from a Safe contract. It shows how to specify the starting point and the page size for the query.

```Solidity
interface ISafe {
    function getModulesPaginated(
        address start,
        uint256 pageSize
    ) external view returns (address[] array, address next);
}

contract Example {
    function example() … {
        (ISafe safe).getModulesPaginated(0x..., 1);
    }
}
```

```Solidity
(ISafe safe).getModulesPaginated(
    0x...
);

```

```Solidity
(ISafe safe).getModulesPaginated(
    0x...,
    1
);

```

--------------------------------

### Install Dependencies for Safe{Core} SDK and Python

Source: https://docs.safe.global/core-api/transaction-service-guides/transactions

Installs the necessary packages for interacting with the Safe{Core} SDK in TypeScript and the safe-eth-py library in Python. Ensure Node.js and Python >= 3.9 are installed.

```TypeScript
yarn add @safe-global/api-kit @safe-global/protocol-kit @safe-global/types-kit
```

--------------------------------

### Initialize Protocol Kit for Safe Deployment

Source: https://docs.safe.global/sdk/protocol-kit/guides/safe-deployment

Initializes the Protocol Kit with a signer, network provider, and Safe account configuration to prepare for Safe deployment. Optionally includes on-chain analytics tracking.

```javascript
const safeAccountConfig = {
  owners: ['0x...', '0x...', '0x...'],
  threshold: 2
  // More optional properties
}

const predictedSafe = {
  safeAccountConfig
  // More optional properties
}

const protocolKit = await Safe.init({
  provider: sepolia.rpcUrls.default.http[0],
  signer: SIGNER_PRIVATE_KEY,
  predictedSafe,
  onchainAnalytics // Optional
})
```

--------------------------------

### Enable Safe Module (Solidity)

Source: https://docs.safe.global/reference-smart-account/modules/enableModule

Demonstrates how to enable a new Safe Module in a Safe account using Solidity. It shows the interface for `ISafe` and an example contract `Example` calling the `enableModule` function.

```solidity
interface ISafe {
    function enableModule(address module) external;
}

contract Example {
    function example() ... {
        (ISafe safe).enableModule(0x...);
    }
}
```

--------------------------------

### Install Safe CLI with Trezor Support

Source: https://docs.safe.global/advanced/cli-reference/common-commands

Installs the Safe CLI with optional support for the Trezor hardware wallet. This requires the 'trezor' extra to be installed.

```bash
pip install "safe-cli[trezor]"
```

--------------------------------

### Get Safe Creation Status via API

Source: https://docs.safe.global/core-api/transaction-service-reference/base

Shows how to fetch the creation status of a Safe using a cURL command. This example targets the /tx-service/base/api/v1/safes/{address}/creation/ endpoint and expects a JSON response.

```curl
curl -X GET "/tx-service/base/api/v1/safes/{address}/creation/" -H "accept: application/json"
```

--------------------------------

### Setup Contracts and Variables in beforeEach Hook

Source: https://docs.safe.global/advanced/smart-account-guards/smart-account-guard-tutorial

This snippet sets up the testing environment by deploying the Safe, SafeProxyFactory, and NoDelegatecallGuard contracts. It configures the Safe with an owner (Alice) and a threshold of 1, then sets the NoDelegatecallGuard as the guard for the Safe. The code also includes logic to create a proxy with a nonce and handles potential errors if the Safe address is not found.

```javascript
beforeEach(async () => {
    [deployer, alice] = await ethers.getSigners();

    safeFactory = await ethers.getContractFactory("Safe", deployer);
    masterCopy = await safeFactory.deploy();

    proxyFactory = await (
      await ethers.getContractFactory("SafeProxyFactory", deployer)
    ).deploy();

    const ownerAddresses = [await alice.getAddress()];

    const safeData = masterCopy.interface.encodeFunctionData("setup", [
      ownerAddresses,
      threshold,
      ZeroAddress,
      "0x",
      ZeroAddress,
      ZeroAddress,
      0,
      ZeroAddress,
    ]);

    const safeAddress = await proxyFactory.createProxyWithNonce.staticCall(
      await masterCopy.getAddress(),
      safeData,
      0n
    );

    await proxyFactory.createProxyWithNonce(
      await masterCopy.getAddress(),
      safeData,
      0n
    );

    if (safeAddress === ZeroAddress) {
      throw new Error("Safe address not found");
    }

    exampleGuard = await (
      await ethers.getContractFactory("NoDelegatecallGuard", deployer)
    ).deploy();

    safe = await ethers.getContractAt("Safe", safeAddress);

    const setGuardData = masterCopy.interface.encodeFunctionData(
      "setGuard",
      [exampleGuard.target]
    );

    await execTransaction([alice], safe, safe.target, 0, setGuardData, 0);
  });
```

--------------------------------

### Get Pending Safe Operations (TypeScript)

Source: https://docs.safe.global/reference-sdk-api-kit/getpendingsafeoperations

Retrieves a list of Safe operations pending execution. This example demonstrates how to call the `getPendingSafeOperations` method with a Safe address and optional pagination and ordering parameters.

```typescript
import { GetSafeOperationListProps } from '@safe-global/api-kit'
import { apiKit } from './setup.ts'

const safeAddress = '0x...'
const options: GetSafeOperationListProps = {
  ordering: 'created', 
  limit: '10', 
  offset: '50' 
}

const safeOperationsResponse = await apiKit.getPendingSafeOperations(safeAddress, options)
```

```typescript
const safeOperationsResponse = await apiKit.getPendingSafeOperations({
  safeAddress: '0x...'
})
```

```typescript
const safeOperationsResponse = await apiKit.getPendingSafeOperations(
  {
    safeAddress: '0x...',
    ordering: 'created'
  }
)
```

```typescript
const safeOperationsResponse = await apiKit.getPendingSafeOperations(
  {
    safeAddress: '0x...',
    limit: 10
  }
)
```

```typescript
const safeOperationsResponse = await apiKit.getPendingSafeOperations(
  {
    safeAddress: '0x...',
    offset: 50
  }
)
```

--------------------------------

### Setup Nuxt Application with pnpm

Source: https://docs.safe.global/home/passkeys-tutorials/safe-passkeys-nuxt

Initializes a new Nuxt application using pnpm and the nuxi CLI. It prompts the user to select pnpm as the package manager and to initialize a Git repository.

```bash
pnpm dlx nuxi@latest init safe-passkeys-nuxt -t ui  
```

--------------------------------

### Deploy Safe Canonical Contracts

Source: https://docs.safe.global/core-api/safe-installation-overview

Instructions for deploying Safe's core smart contracts onto an EVM-compatible chain. This process requires gas fees in the chain's native currency and is reviewed bi-weekly.

```text
You can find detailed instructions under contracts deployment.
```

--------------------------------

### Initialize Magic Instance

Source: https://docs.safe.global/sdk/signers/magic

Creates a new instance of the Magic class, passing the API key. This initializes the Magic SDK for use in authentication and other wallet-related operations.

```javascript
const magic = new Magic(MAGIC_API_KEY)
```

--------------------------------

### Install Relay Kit Dependency

Source: https://docs.safe.global/advanced/erc-4337/guides/safe-sdk

Installs the necessary Relay Kit dependency for interacting with Safe accounts and ERC-4337 features using Yarn.

```bash
yarn add @safe-global/relay-kit
```

--------------------------------

### Get Safe Creation Info - cURL

Source: https://docs.safe.global/core-api/transaction-service-reference/worldchain

Provides an example of how to retrieve Safe creation status using a cURL command. This is useful for testing the API endpoint directly or for use in shell scripts.

```curl
curl -X GET "/tx-service/wc/api/v1/safes/{address}/creation/" -H "accept: application/json"
```

--------------------------------

### SafeSetup Event Signature

Source: https://docs.safe.global/reference-smart-account/setup/setup

This snippet shows the event signature for SafeSetup, which is emitted when a Safe is initialized. It includes parameters like the initiator's address, an array of owner addresses, the threshold for execution, the initializer's address, and the fallback handler's address.

```Solidity
event SafeSetup(
  address initiator,
  address[] owners,
  uint256 threshold,
  address initializer,
  address fallbackHandler
);
```

--------------------------------

### Install Protocol Kit Dependency

Source: https://docs.safe.global/sdk/signers/passkeys

Installs the Safe Protocol Kit using npm, yarn, or pnpm. This is a prerequisite for using the Safe{Core} SDK functionalities.

```bash
npm install @safe-global/protocol-kit
```

--------------------------------

### Clone Safe Smart Account Repository

Source: https://docs.safe.global/core-api/safe-contracts-deployment

Clones the safe-smart-account repository with a specific branch for deploying Safe contracts. This is a prerequisite for deploying singleton contracts.

```bash
git clone --branch v1.3.0-libs.0 https://github.com/safe-global/safe-smart-account.git
cd safe-smart-account
```

--------------------------------

### Get Module Transaction using cURL

Source: https://docs.safe.global/core-api/transaction-service-reference/chiado

This example shows how to retrieve a module transaction using a cURL command. It specifies the HTTP method, URL, and necessary headers including the API key for authorization.

```curl
curl -X GET https://api.safe.global/tx-service/chi/api/v1/module-transaction/0x3b3b57b3 \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY" \
```

--------------------------------

### Initialize Safe SDK

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Demonstrates how to initialize the Safe SDK using the Protocol Kit. This is the first step to interacting with Safe accounts.

```JavaScript
import SafeApiKit from '@safe-global/api-kit'
import Safe, { EthersAdapter } from '@safe-global/protocol-kit'

// const provider = ethers.provider // ethers.js provider
// const signer = provider.getSigner() // ethers.js signer

// const ethAdapter = new EthersAdapter({ ethers, signer })
// const safeService = new SafeApiKit({ txServiceUrl: 'https://safe-transaction-mainnet.safe.global', ethAdapter })

// const safeSdk = await Safe.create({ ethAdapter, isL1SafeMasterCopy: true, safeAddress: '0x...' })

```

--------------------------------

### Get Account Nonce

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-detailed

Retrieves the current nonce for an ERC-4337 Safe account. This is achieved by calling the getAccountNonce function, which requires the entryPoint address and the sender address of the Safe account.

```TypeScript
const nonce = await getAccountNonce(publicClient as Client, {
  entryPoint: ENTRYPOINT_ADDRESS_V06,
  sender
})
```

--------------------------------

### Get Safe Transfers Response

Source: https://docs.safe.global/core-api/transaction-service-reference/optimism

Example JSON response for retrieving Safe transfers. It includes a count of transfers, pagination links, and a list of transfer objects, each containing detailed information about the transaction.

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "type": "ETHER_TRANSFER",
      "executionDate": "2024-07-24T20:54:48Z",
      "blockNumber": 6369595,
      "transactionHash": "0x4c8bc3a9f32eed6b4cb8225d6884e9c7006d6740b0a6896cee7b254aa037920e",
      "to": "0x3A16E3090e32DDeD2250E862B9d5610BEF13e93d",
      "value": "10000000000",
      "tokenId": null,
      "tokenAddress": null,
      "transferId": "i4c8bc3a9f32eed6b4cb8225d6884e9c7006d6740b0a6896cee7b254aa037920e0,0,0",
      "tokenInfo": null,
      "from": "0x5298A93734C3D979eF1f23F78eBB871879A21F22"
    }
  ]
}
```

--------------------------------

### Install Relay Kit Dependencies

Source: https://docs.safe.global/sdk/relay-kit/guides/4337-safe-sdk

Installs the necessary Relay Kit package for interacting with Safe{Core} SDK functionalities, specifically for ERC-4337 support.

```bash
yarn add @safe-global/relay-kit
```

--------------------------------

### Run Safe Infrastructure Locally

Source: https://docs.safe.global/core-api/safe-infrastructure-deployment

This script executes the local deployment of the Safe infrastructure, which involves setting up multiple Docker containers and prompts for user credentials for the config-service and transactions-service.

```bash
sh scripts/run_locally.sh
# will ask to set up username/password for config-service and transactions-service
```

--------------------------------

### Install Dependencies for Safe{Core}

Source: https://docs.safe.global/core-api/transaction-service-guides/messages

Installs the necessary packages for interacting with the Safe{Core} SDK, including API Kit, Protocol Kit, and Types Kit. This is a prerequisite for using the SDK in your project.

```bash
yarn add @safe-global/api-kit @safe-global/protocol-kit @safe-global/types-kit
```

--------------------------------

### Block Explorer Transaction Hash Template Example

Source: https://docs.safe.global/config-service-configuration/add-or-edit-chain

An example of a block explorer URI template for transaction hashes, showing how to format links to view specific transactions on a block explorer.

```URL Template
https://etherscan.io/tx/{{txHash}}
```

--------------------------------

### Get Safe Creation Status - TypeScript

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis

Fetches the creation status of a Safe using the Safe API Kit. This example demonstrates initializing the API kit with a chain ID and calling the `getSafeCreationInfo` method with a Safe address.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'
  
const apiKit = new SafeApiKit({
  chainId: 11155111n
})
  
const safeCreationInfo = await apiKit.getSafeCreationInfo(
  '0x5298A93734C3D979eF1f23F78eBB871879A21F22'
)
  
console.log(safeCreationInfo)
```

--------------------------------

### SafeOperations Configuration Example

Source: https://docs.safe.global/reference-sdk-starter-kit/safe-operations

Provides an example of configuring the `safeOperations` function with specific bundler and paymaster options. This includes setting the bundler URL and detailed paymaster configurations such as sponsorship status, paymaster URL, sponsorship policy ID, paymaster address, paymaster token address, and the amount to approve.

```typescript
safeOperations(
  { bundlerUrl: 'https://...' },
  {
    isSponsored: true,
    paymasterUrl: 'https://...',
    sponsorshipPolicyId: 'abc',
    paymasterAddress: '0x...',
    paymasterTokenAddress: '0x...',
    amountToApprove: 123n
  }
)
```

--------------------------------

### Get Safe Owners (Solidity)

Source: https://docs.safe.global/reference-smart-account/owners/getOwners

This snippet demonstrates how to call the getOwners function on a Safe smart contract to retrieve an array of owner addresses. It shows the interface definition and an example of its usage within another contract.

```Solidity
interface ISafe {
    function getOwners() external view returns (address[]);
}

contract Example {
    function example() ... {
        (ISafe safe).getOwners();
    }
}
```

--------------------------------

### Install Dependencies

Source: https://docs.safe.global/advanced/erc-7579/tutorials/7579-tutorial

Installs essential project dependencies including `permissionless` for Safe interactions, `viem` for utility functions, and `truncate-eth-address` for formatting Ethereum addresses. Note that `permissionless.js` currently supports only single-signer Safe accounts.

```shell
pnpm add permissionless@0.2.0 viem@2.21.7 truncate-eth-address@1.0.2
```

--------------------------------

### Integrate Dynamic with Safe App Environment (Guide)

Source: https://docs.safe.global/resource-hub_page=3

This guide explains how to integrate Dynamic into the Safe App environment, focusing on the Signer topic.

--------------------------------

### Create UI Components Folder and Files

Source: https://docs.safe.global/home/passkeys-tutorials/safe-passkeys-tutorial

This snippet outlines the bash commands to create a 'components' directory and initialize the `LoginWithPasskey.tsx` and `SafeAccountDetails.tsx` files within the project.

```bash
cd ..

mkdir components

cd components

touch LoginWithPasskey.tsx
```

```bash
touch SafeAccountDetails.tsx
```

--------------------------------

### Integrate Dynamic with Safe App Environment (Guide)

Source: https://docs.safe.global/resource-hub_page=2

This guide explains how to integrate Dynamic into the Safe App environment, focusing on the Signer topic.

--------------------------------

### Get User Operation by Hash - TypeScript Example

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis-chain

Demonstrates how to initialize the Safe4337Pack and retrieve a UserOperation using its hash. It requires provider URL, signer, bundler URL, and Safe address. The retrieved UserOperation object is then logged to the console.

```typescript
import { Safe4337Pack } from '@safe-global/relay-kit'

const safe4337Pack = await Safe4337Pack.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  bundlerUrl: `https://api.pimlico.io/v1/sepolia/rpc?add_balance_override&apikey=${PIMLICO_API_KEY}`,
  options: {
    safeAddress: '0x97566B1eCaCd321736F183117C26ACe1b72F4a1b'
  }
})

const userOperationHash =
  '0x7bf502ad622e62823c971d800033e82e5670fcdd1c19437555fb2d8b7eefd644'

const userOperation = await safe4337Pack.getUserOperationByHash(
  userOperationHash
)

console.log(userOperation)
```

--------------------------------

### Block Explorer Address Template Example

Source: https://docs.safe.global/config-service-configuration/add-or-edit-chain

An example of a block explorer URI template for addresses, demonstrating how to format links to view specific addresses on a block explorer.

```URL Template
https://etherscan.io/address/{{address}}
```

--------------------------------

### Install Safe CLI with Hardware Wallet Support

Source: https://docs.safe.global/advanced/cli-reference/common-commands

Command to install the Safe CLI with support for both Ledger and Trezor hardware wallets, necessary for signing transactions directly from these devices.

```bash
pip install "safe-cli[ledger, trezor]"
```

--------------------------------

### Get Safe Creation Status

Source: https://docs.safe.global/core-api/transaction-service-reference/zksync

Retrieves detailed information about a Safe's creation transaction, including creator, transaction hash, and setup data. It handles potential inaccuracies with event indexing for multiple Safe deployments in a single transaction.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 324n,
  apiKey: 'YOUR_API_KEY'
})

const safeCreationInfo = await apiKit.getSafeCreationInfo(
  '0x5298A93734C3D979eF1f23F78eBB871879A21F22'
)

console.log(safeCreationInfo)
```

```curl
curl -X GET "/tx-service/zksync/api/v1/safes/{address}/creation/" -H "accept: application/json"
```

--------------------------------

### Get User Operation by Hash - TypeScript

Source: https://docs.safe.global/core-api/transaction-service-reference/zksync

Fetches a user operation by its hash using the Safe4337Pack from the @safe-global/relay-kit library. This example demonstrates initializing the pack with provider, signer, bundler URL, and Safe address, then calling getUserOperationByHash.

```TypeScript
import { Safe4337Pack } from '@safe-global/relay-kit'

const safe4337Pack = await Safe4337Pack.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  bundlerUrl: `https://api.pimlico.io/v1/sepolia/rpc?add_balance_override&apikey=${PIMLICO_API_KEY}`,
  options: {
    safeAddress: '0x97566B1eCaCd321736F183117C26ACe1b72F4a1b'
  }
})

const userOperationHash =
  '0x7bf502ad622e62823c971d800033e82e5670fcdd1c19437555fb2d8b7eefd644'

const userOperation = await safe4337Pack.getUserOperationByHash(
  userOperationHash
)

console.log(userOperation)
```

--------------------------------

### Get Pending Transactions with Options

Source: https://docs.safe.global/reference-sdk-api-kit/getpendingtransactions

Fetches pending multi-signature transactions for a specified Safe address, including optional parameters for filtering and pagination. This example demonstrates how to use the `apiKit.getPendingTransactions` method with `currentNonce`, `hasConfirmations`, `ordering`, `limit`, and `offset` options.

```typescript
import { apiKit } from './setup.ts'

const safeAddress = '0x...'

const options = {
  currentNonce: 0,
  hasConfirmations: true,
  ordering: 'created',
  limit: 10,
  offset: 10
}

const pendingTxs = await apiKit.getPendingTransactions(safeAddress, options)
```

--------------------------------

### SafeProxy Initialization Sequence

Source: https://docs.safe.global/advanced/erc-7579/7579-safe

This snippet details the sequence of operations for initializing the SafeProxy, including delegation to Launchpad and the setup of SafeSingleton and Safe7579.

```Solidity
function setupSafe() internal {
  // Delegatecall to Launchpad for initialization
  launchpad.initSafe7579(executors, fallbacks, hooks, IERC7484Registry);
}
```

--------------------------------

### Get Signer Address with useSafe Hook

Source: https://docs.safe.global/reference-sdk-react-hooks/usesafe/getsigneraddress

This example demonstrates how to use the `useSafe` hook to retrieve the signer's address. It imports the hook, calls `getSignerAddress`, and displays the address or a fallback message.

```javascript
import { useSafe } from '@safe-global/safe-react-hooks'

function SignerAddress() {
  const { getSignerAddress } = useSafe()
  const address = getSignerAddress()

  return (
    <>
      {address ? address : 'No signer address'}
    </>
  )
}

export default SignerAddress
```

--------------------------------

### Get Safe Creation Status using cURL

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis-chain

Provides an example of how to retrieve Safe creation status using a cURL command. This command targets the `/tx-service/gno/api/v1/safes/{address}/creation/` endpoint, specifying the Safe address in the URL.

```curl
curl -X GET "/tx-service/gno/api/v1/safes/{address}/creation/" -H "accept: application/json"
```

--------------------------------

### getStorageAt Parameter Usage Example

Source: https://docs.safe.global/reference-smart-account/utilities/getStorageAt

This example illustrates how to call the `getStorageAt` function with specific parameter values for offset and length, demonstrating the correct syntax for passing these arguments.

```Solidity
(ISafe safe).getStorageAt(
    0,
    1
);
```

--------------------------------

### Encode Call Data

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-detailed

Encodes the call data for the executeUserOp function, representing the actions to be executed from the Safe account. This example demonstrates encoding a simple transaction with no value and no data, which increments the account's nonce.

```TypeScript
const callData: `0x${string}` = encodeCallData({
  to: sender,
  data: '0x',
  value: 0n
})
```

--------------------------------

### Install Module - React JSX

Source: https://docs.safe.global/advanced/erc-7579/tutorials/7579-tutorial

This snippet shows a card for installing a module. It checks if moduleIsInstalled is false. If so, it displays the Safe address, its deployment status, and instructions for installing the module, including a button to initiate the process. MetaMask interaction is expected.

```jsx
if (!moduleIsInstalled) {
    return (
      <div className='card'>
        <div className='title'>Install Module</div>
        <div>
          Your Safe has the address{' '}
          {safeAddress && truncateEthAddress(safeAddress)} and is{' '}
          {safeIsDeployed ? 'deployed' : 'not yet deployed'}.
          {!safeIsDeployed &&
            'It will be deployed with your first transaction, when you install the module.'}
        </div>
        <div>
          You can now install the module. MetaMask will ask you to sign a
          message with the first account after clicking the button.
        </div>
        <div className='actions'>
          <button
            onClick={installModule}
            className={loading ? 'button--loading' : ''}
          >
            Install Module
          </button>
        </div>
      </div>
    )
  }
```

--------------------------------

### Get Safe Address from Deployment Tx (TypeScript)

Source: https://docs.safe.global/reference-sdk-protocol-kit/deployment/getsafeaddressfromdeploymenttx

This example demonstrates how to use `getSafeAddressFromDeploymentTx` to extract the Safe address from a transaction receipt. It involves setting up a viem wallet client, waiting for a transaction receipt, and then calling the function with the receipt and the Safe version.

```TypeScript
import { getSafeAddressFromDeploymentTx } from '@safe-global/protocol-kit'
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
import { waitForTransactionReceipt } from 'viem/actions'
import { protocolKit } from './setup.ts'

const account = privateKeyToAccount('0x...')
const client = createWalletClient({
  account,
  chain: sepolia,
  transport: http('https://rpc.ankr.com/eth_sepolia')
})
const transactionReceipt = await waitForTransactionReceipt(client, {
  hash: '0x...'
})

const safeAddress = getSafeAddressFromDeploymentTx(
  transactionReceipt,
  safeVersion: '1.4.1'
)

```

--------------------------------

### Configure Environment Variables for Deployment

Source: https://docs.safe.global/core-api/safe-contracts-deployment

Sets up the .env file with necessary credentials for deploying Safe contracts. It requires a mnemonic for a funded account and an Infura API key. An additional variable is included for ZKsync chains.

```javascript
MNEMONIC=funded_account_on_this_network
INFURA_KEY=your_Infura_project_API_key
```

```javascript
HARDHAT_ENABLE_ZKSYNC=1
```

--------------------------------

### Import Modules for Safe Deployment

Source: https://docs.safe.global/sdk/protocol-kit/guides/safe-deployment

Imports essential components from the @safe-global/protocol-kit library and chain configurations from viem for Safe deployment.

```javascript
import Safe, {
  PredictedSafeProps,
  SafeAccountConfig,
  SafeDeploymentConfig
} from '@safe-global/protocol-kit'
import { sepolia } from 'viem/chains'
```

--------------------------------

### Install Safe{Core} API Kit

Source: https://docs.safe.global/core-api/transaction-service-guides/data-decoder

Installs the Safe{Core} API Kit using yarn. This is a necessary dependency for interacting with the Safe Transaction Service API.

```bash
yarn add @safe-global/api-kit
```

--------------------------------

### On-chain Identifier Format Example

Source: https://docs.safe.global/sdk/onchain-tracking

This example demonstrates the structure of the 50-byte on-chain identifier used for tracking Safe deployments and transactions. It breaks down the identifier into its constituent parts: prefix hash, version hash, project hash, platform hash, tool hash, and tool version hash.

```text
`5afe` `00` `6363643438383836663461336661366162653539` `646561` `393238` `653366`
```

--------------------------------

### Get Safe Operations by Address with Offset (JavaScript)

Source: https://docs.safe.global/reference-sdk-api-kit/getsafeoperationsbyaddress

Retrieves safe operations for a given address, starting from a specified offset. This method is part of the Safe{Core} API and requires the safeAddress and optionally an offset number.

```JavaScript
const safeOperationsResponse = await apiKit.getSafeOperationsByAddress(
  {
    safeAddress: '0x...',
    offset: 50
  }
)
```

--------------------------------

### Get All Transactions for a Safe

Source: https://docs.safe.global/core-api/transaction-service-reference/sonic

Retrieves all transactions associated with a given Safe address. This function is part of the SafeApiKit and requires chainId and an API key for initialization. The example demonstrates how to instantiate the API kit and call the getAllTransactions method.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 146n,
  apiKey: 'YOUR_API_KEY'
})

const transactions = await apiKit.getAllTransactions(
  '0x5298a93734c3d979ef1f23f78ebb871879a21f22'
)

console.log(transactions)
```

--------------------------------

### Block Explorer API Template Example

Source: https://docs.safe.global/config-service-configuration/add-or-edit-chain

An example of a block explorer API URI template, used for fetching data programmatically from a block explorer's API.

```URL Template
https://api.etherscan.io/api
```

--------------------------------

### Add @safe-global/api-kit Dependency

Source: https://docs.safe.global/sdk/api-kit/guides/migrate-to-v1

Installs the API Kit v1.3.1 using Yarn. This is the first step in migrating from the older safe-service-client.

```bash
yarn add @safe-global/api-kit@1.3.1
```

--------------------------------

### Get User Operation Details - JSON Response

Source: https://docs.safe.global/core-api/transaction-service-reference/sonic

Example JSON response structure for a successful retrieval of a user operation. It includes fields like ethereumTxHash, sender, userOperationHash, nonce, gas limits, paymaster information, and signature.

```JSON
{
  "owner": "0x608Cf2e3412c6BDA14E6D8A0a7D27c4240FeD6F1",
  "signature": "0x000000000000000000000000608cf2e3412c6bda14e6d8a0a7d27c4240fed6f10000000000000000000000000000000000000000000000000000000000000041000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e053c4ce48756bae15e3454ad75ee8d4ba9764ea37ed561b216701c3630c0521774f94a8b7351780daa4a241792f52089af776e0898185318053201a92865b08d0000000000000000000000000000000000000000000000000000000000000002549960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97631d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034226f726967696e223a22687474703a2f2f6c6f63616c686f73743a33303030222c2263726f73734f726967696e223a66616c736500000000000000000000001f",
  "signatureType": "CONTRACT_SIGNATURE"
}
```

--------------------------------

### Sample Request for Confirmations

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis

Example cURL command to fetch confirmations for a specific Safe operation on the Ethereum Sepolia network. It demonstrates how to set the Accept and Content-Type headers.

```Shell
curl -X GET https://safe-transaction-sepolia.safe.global/api/api/v1/safe-operations/0x597ba36c626a32a4fcc9f23a4b25605ee30b46584918d6b6442387161dc3c51b/confirmations/ \
    -H "Accept: application/json" \
    -H "content-type: application/json"
```

--------------------------------

### Get Safe Creation Info

Source: https://docs.safe.global/core-api/transaction-service-reference/sonic

Retrieves detailed information about a Safe's creation transaction. This includes details like the creator, transaction hash, factory address, and setup data. It's important to note potential inaccuracies if multiple Safes are deployed in the same transaction when using event indexing.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 146n,
  apiKey: 'YOUR_API_KEY'
})

const safeCreationInfo = await apiKit.getSafeCreationInfo(
  '0x5298A93734C3D979eF1f23F78eBB871879A21F22'
)

console.log(safeCreationInfo)
```

--------------------------------

### Initialize Hardhat Project

Source: https://docs.safe.global/advanced/smart-account-fallback-handler/smart-account-fallback-handler-tutorial

Initializes a new Hardhat project, typically for TypeScript development. This command sets up the basic project structure and necessary dependencies.

```bash
npx hardhat init
```

--------------------------------

### Initialize Protocol Kit

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Initializes the Protocol Kit with provider, signer, safe address, and contract networks. This is a fundamental step to start interacting with the Safe SDK.

```javascript
const protocolKit = await Safe.init({
  provider,
  signer,
  safeAddress,
  contractNetworks
})
```

--------------------------------

### Beacon Chain Explorer Public Key Template Example

Source: https://docs.safe.global/config-service-configuration/add-or-edit-chain

An example of a beacon chain explorer URI template for public keys, used for generating links to validator information.

```URL Template
https://beaconscan.com/validator/{{publicKey}}
```

--------------------------------

### Setup Safe Smart Account with Agent One - JavaScript

Source: https://docs.safe.global/home/ai-agent-quickstarts/multi-agent-setup

Initializes a Safe Smart Account with multiple owners and a threshold for transaction approval. This code snippet uses the Safe Protocol Kit to define owners and the required threshold.

```javascript
import Safe from '@safe-global/protocol-kit'

const AGENT_1_ADDRESS = // ...
const AGENT_1_PRIVATE_KEY = // ...
const AGENT_2_ADDRESS = // ...
const HUMAN_SIGNER_1_ADDRESS = // ...
const HUMAN_SIGNER_2_ADDRESS = // ...
const RPC_URL = 'https://rpc.ankr.com/eth_sepolia'

const newSafe = await Safe.init({
  provider: RPC_URL,
  signer: AGENT_1_PRIVATE_KEY,
  safeOptions: {
    owners: [AGENT_1_ADDRESS, AGENT_2_ADDRESS, HUMAN_SIGNER_1_ADDRESS, HUMAN_SIGNER_2_ADDRESS],
    threshold: 2
  }
})
```

--------------------------------

### Install Dependencies for Gelato Relay

Source: https://docs.safe.global/sdk/relay-kit/guides/gelato-relay

Installs the necessary packages for integrating with the Gelato relay using the Safe SDK. This includes ethers, @safe-global/relay-kit, @safe-global/protocol-kit, and @safe-global/types-kit.

```bash
yarn add ethers @safe-global/relay-kit @safe-global/protocol-kit @safe-global/types-kit
```

--------------------------------

### Get Specific Transfer by ID Response

Source: https://docs.safe.global/core-api/transaction-service-reference/optimism

Example JSON response for retrieving a specific transfer by its ID. The structure mirrors the individual transfer objects found in the list response, providing comprehensive details for a single transfer.

```json
{
  "type": "ETHER_TRANSFER",
  "executionDate": "2024-07-24T20:54:48Z",
  "blockNumber": 6369595,
  "transactionHash": "0x4c8bc3a9f32eed6b4cb8225d6884e9c7006d6740b0a6896cee7b254aa037920e",
  "to": "0x3A16E3090e32DDeD2250E862B9d5610BEF13e93d",
  "value": "10000000000",
  "tokenId": null,
  "tokenAddress": null,
  "transferId": "i4c8bc3a9f32eed6b4cb8225d6884e9c7006d6740b0a6896cee7b254aa037920e0,0,0",
  "tokenInfo": null,
  "from": "0x5298A93734C3D979eF1f23F78eBB871879A21F22"
}
```

--------------------------------

### Initialize SafeClient with Safe Options - Safe SDK

Source: https://docs.safe.global/sdk/starter-kit/guides/send-user-operations

Initializes the SafeClient, configuring it for a new Safe account with a specified owner and threshold. This setup is crucial for deploying and managing new Safe accounts.

```typescript
const safeClient = await createSafeClient({
  provider: RPC_URL,
  signer: SIGNER_PRIVATE_KEY,
  safeOptions: {
    owners: [SIGNER_ADDRESS],
    threshold: 1
  }
})
```

--------------------------------

### Create UI Components Folder and Files

Source: https://docs.safe.global/advanced/passkeys/tutorials/react

This snippet outlines the bash commands to create a 'components' directory and initialize the `LoginWithPasskey.tsx` and `SafeAccountDetails.tsx` files within the project.

```bash
cd ..

mkdir components

cd components

touch LoginWithPasskey.tsx
```

```bash
touch SafeAccountDetails.tsx
```

--------------------------------

### Run the AI Agent

Source: https://docs.safe.global/home/ai-agent-setup

Command to execute the AI agent using pnpm and a .env file. This command starts the agent, which can then process prompts related to Safe wallet operations.

```bash
pnpm tsx --env-file=.env agent.ts
```

--------------------------------

### Get All Transactions for a Safe

Source: https://docs.safe.global/core-api/transaction-service-reference/arbitrum

Retrieves all transactions associated with a given Safe address. This method utilizes the SafeApiKit to fetch transaction data, requiring a chainId and an API key for authentication. The example demonstrates how to initialize the API kit and call the `getAllTransactions` method.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'  

const apiKit = new SafeApiKit({
  chainId: 42161n,
  apiKey: 'YOUR_API_KEY'
})

const transactions = await apiKit.getAllTransactions(
  '0x5298a93734c3d979ef1f23f78ebb871879a21f22'
)

console.log(transactions)
```

--------------------------------

### Get User Operation by Hash - JSON Response Example

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis-chain

This JSON object represents a successful response (200 OK) when retrieving a user operation. It includes all the details of the operation, such as ethereumTxHash, sender, nonce, callData, gas limits, paymaster information, and the signature.

```json
{
  "owner": "0x608Cf2e3412c6BDA14E6D8A0a7D27c4240FeD6F1",
  "signature": "0x000000000000000000000000608cf2e3412c6bda14e6d8a0a7d27c4240fed6f10000000000000000000000000000000000000000000000000000000000000041000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e053c4ce48756bae15e3454ad75ee8d4ba9764ea37ed561b216701c3630c0521774f94a8b7351780daa4a241792f52089af776e0898185318053201a92865b08d0000000000000000000000000000000000000000000000000000000000000002549960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97631d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034226f726967696e223a22687474703a2f2f6c6f63616c686f73743a33303030222c2263726f73734f726967696e223a66616c736500000000000000000000001f",
  "signatureType": "CONTRACT_SIGNATURE"
}
```

--------------------------------

### Get All Safe Transactions

Source: https://docs.safe.global/core-api/transaction-service-reference/worldchain

Retrieves all transactions associated with a given Safe address. This method utilizes the SafeApiKit to fetch transaction data, requiring a chainId and an API key for initialization. The example demonstrates how to instantiate the kit and call the `getAllTransactions` method with a Safe address.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 480n,
  apiKey: 'YOUR_API_KEY'
})

const transactions = await apiKit.getAllTransactions(
  '0x5298a93734c3d979ef1f23f78ebb871879a21f22'
)

console.log(transactions)
```

--------------------------------

### Get All Transactions for a Safe

Source: https://docs.safe.global/core-api/transaction-service-reference/avalanche

Retrieves all transactions associated with a given Safe address. This method utilizes the SafeApiKit to fetch transaction data, requiring a chain ID and API key for initialization. The example demonstrates how to instantiate the API kit and call the `getAllTransactions` method with a Safe address.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 43114n,
  apiKey: 'YOUR_API_KEY'
})

const transactions = await apiKit.getAllTransactions(
  '0x5298a93734c3d979ef1f23f78ebb871879a21f22'
)

console.log(transactions)
```

--------------------------------

### Get Module Transaction Details using cURL

Source: https://docs.safe.global/core-api/transaction-service-reference/optimism

This example shows how to retrieve details of a module transaction using cURL. It specifies the API endpoint and requires an API key for authorization. The response includes transaction details like creation date, execution date, block number, and transaction hash.

```curl
curl -X GET https://api.safe.global/tx-service/oeth/api/v1/module-transaction/0x3b3b57b3 \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY" \
```

--------------------------------

### Using Passkeys with Safe as Signer

Source: https://docs.safe.global/resource-hub_source=Safe+Team&tag=Tutorial

Learn the simple, three-step process to use a passkey as a signer for your Safe. This tutorial video provides a clear guide on enhancing Safe security with passkey authentication.

```JavaScript
/*
  This section is a placeholder for JavaScript code examples demonstrating passkey signing.
  It would involve integrating passkey management with Safe's signing capabilities.
*/
console.log('Passkey as Safe Signer Example');
```

--------------------------------

### Create tools directory and prices.ts file

Source: https://docs.safe.global/home/ai-agent-setup

This snippet demonstrates the bash commands to create a new directory named 'tools' and a file named 'prices.ts' within it. This setup is for organizing the project's tool-related code.

```bash
mkdir tools

touch tools/prices.ts
```

--------------------------------

### Install Privy React Auth Dependency

Source: https://docs.safe.global/sdk/signers/privy

Installs the necessary @privy-io/react-auth package using npm, yarn, or pnpm. This package is required for integrating Privy authentication into your React application.

```bash
npm install @privy-io/react-auth
```

--------------------------------

### Deploy All Singleton Contracts

Source: https://docs.safe.global/core-api/safe-contracts-deployment

Executes a deployment script to deploy all singleton contracts for the Safe{Core} ecosystem. It requires the chain ID as an argument.

```bash
npm run deploy-all your_chain_id
```

--------------------------------

### Import Core Components - Safe SDK

Source: https://docs.safe.global/sdk/starter-kit/guides/send-user-operations

Imports essential components from the Safe SDK starter kit, including functions for creating a Safe client, handling safe operations, and configuring bundler options.

```typescript
import {
  createSafeClient,
  safeOperations,
  BundlerOptions
} from '@safe-global/sdk-starter-kit'
```

--------------------------------

### Approve Hash Function Call Example (Solidity)

Source: https://docs.safe.global/reference-smart-account/signatures/approveHash

Provides a concrete example of calling the `approveHash` function with a specific hash value, as it would appear in a Solidity contract interaction.

```Solidity
(ISafe safe).approveHash(
    "0x..."
);
```

--------------------------------

### Initialize Protocol Kit for Sepolia

Source: https://docs.safe.global/sdk/protocol-kit/guides/multichain-safe-deployment

Initializes the Protocol Kit for the Sepolia testnet. It requires the network's RPC provider URL, a signer (e.g., from a private key), and the Safe account configuration.

```typescript
const protocolKitSepolia = await Safe.init({
  provider: sepolia.rpcUrls.default.http[0],
  signer: SIGNER_PRIVATE_KEY,
  predictedSafe,
  onchainAnalytics // Optional
  // ...
})
```

--------------------------------

### Initialize Hardhat Project

Source: https://docs.safe.global/advanced/smart-account-modules/smart-account-modules-tutorial

Initializes a new Hardhat project, typically with TypeScript support. This command sets up the basic project structure and necessary configuration files.

```bash
npx hardhat init
```

--------------------------------

### Get Safe Creation Status

Source: https://docs.safe.global/core-api/transaction-service-reference/ink

Retrieves detailed information about a Safe's creation transaction. It returns details like creation date, creator address, transaction hash, factory address, master copy, setup data, and decoded transaction data. Note that accuracy may be affected by event indexing if multiple Safes are deployed in the same transaction.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'
  
const apiKit = new SafeApiKit({
  chainId: 57073n,
  apiKey: 'YOUR_API_KEY'
})
  
const safeCreationInfo = await apiKit.getSafeCreationInfo(
  '0x5298A93734C3D979eF1f23F78eBB871879A21F22'
)
  
console.log(safeCreationInfo)
```

--------------------------------

### Initialize Protocol Kit with RPC URL Provider

Source: https://docs.safe.global/reference-sdk-protocol-kit/initialization/init

Demonstrates initializing the Protocol Kit using an RPC URL as the provider. This is an alternative to using an EIP-1193 compatible provider, requiring the provider URL, a signer, and the Safe address.

```javascript
const protocolKit = await Safe.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer,
  safeAddress: '0x...'
})
```

--------------------------------

### Install Protocol Kit with Yarn

Source: https://docs.safe.global/reference-sdk-protocol-kit/overview

This snippet shows how to add the Safe Protocol Kit to your project using the Yarn package manager. It's a necessary first step before using the kit's functionalities.

```bash
yarn add @safe-global/protocol-kit
```

--------------------------------

### Install Safe React Hooks

Source: https://docs.safe.global/reference-sdk-react-hooks/overview

Installs the Safe React Hooks library using package managers like pnpm, npm, or yarn. This is the initial step to integrate the hooks into your React project.

```bash
pnpm add @safe-global/safe-react-hooks
```

```bash
npm install @safe-global/safe-react-hooks
```

```bash
yarn add @safe-global/safe-react-hooks
```

--------------------------------

### Get Safe Account Address

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-detailed

Calculates the predicted sender address for a counterfactual ERC-4337 Safe account. This function utilizes Viem's getContractAddress, taking into account the SafeProxyFactory address, the Safe Proxy contract's bytecode, and the saltNonce.

```TypeScript
const sender = await getAccountAddress({
  client: publicClient,
  owner: signer.address,
  addModuleLibAddress: ADD_MODULE_LIB_ADDRESS,
  safe4337ModuleAddress: SAFE_4337_MODULE_ADDRESS,
  safeProxyFactoryAddress: SAFE_PROXY_FACTORY_ADDRESS,
  safeSingletonAddress: SAFE_SINGLETON_ADDRESS,
  saltNonce,
  multiSendAddress: SAFE_MULTISEND_ADDRESS,
  erc20TokenAddress: USDC_TOKEN_ADDRESS,
  paymasterAddress: ERC20_PAYMASTER_ADDRESS
})
```

--------------------------------

### Install Stripe Dependencies with npm

Source: https://docs.safe.global/sdk/onramp/stripe

Installs the necessary Stripe client libraries for integrating the fiat-to-crypto onramp service. This command uses npm to add `@stripe/stripe-js` and `@stripe/crypto` to your project's dependencies.

```bash
npm install --save @stripe/stripe-js @stripe/crypto
```

--------------------------------

### Import Web3Auth Modules

Source: https://docs.safe.global/sdk/signers/web3auth

Imports essential components from the Web3Auth SDK for use in the application. This includes chain namespace definitions, network configurations, and the core Web3Auth and Ethereum provider classes.

```javascript
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { Web3Auth } from '@web3auth/modal'
```

--------------------------------

### SafeClient with New Safe Configuration

Source: https://docs.safe.global/reference-sdk-starter-kit/safe-client/constructor

Illustrates configuring a new Safe account by specifying owners, threshold, and an optional saltNonce during SafeClient initialization.

```javascript
const safeClient = await createSafeClient({
  provider,
  signer,
  safeOptions: {
    owners: ['0x...', '0x...', '0x...'],
    threshold: 2,
    saltNonce: '123'
  },
  apiKey: 'YOUR_API_KEY'
})
```

--------------------------------

### Initialize Protocol Kit for Chiado

Source: https://docs.safe.global/sdk/protocol-kit/guides/multichain-safe-deployment

Initializes the Protocol Kit for the Chiado testnet. Similar to Sepolia, it requires the network's RPC provider, a signer, and the Safe account configuration.

```typescript
const protocolKitChiado = await Safe.init({
  provider: gnosisChiado.rpcUrls.default.http[0],
  signer: PRIVATE_KEY,
  predictedSafe,
  onchainAnalytics // Optional
  // ...
})
```

--------------------------------

### Build AI Agents with Safe Capabilities (Tutorial)

Source: https://docs.safe.global/resource-hub_page=2

This tutorial guides users through setting up and deploying an AI agent capable of interacting with a Safe and preparing transactions. It utilizes the Safe Core SDK and is relevant for AI and workshop topics.

--------------------------------

### Build AI Agents with Safe Capabilities (Tutorial)

Source: https://docs.safe.global/resource-hub_page=3

This tutorial guides users through setting up and deploying an AI agent capable of interacting with a Safe and preparing transactions. It utilizes the Safe Core SDK and is relevant for AI and workshop topics.

--------------------------------

### Use Passkeys as Signer for Safe (Tutorial)

Source: https://docs.safe.global/resource-hub_page=2

A tutorial video explaining how to use a passkey as a signer for a Safe in three simple steps. It covers Passkeys, Permissionless, React, and Signer topics, with relevance to 4337.

--------------------------------

### Import Magic SDK

Source: https://docs.safe.global/sdk/signers/magic

Imports the Magic class from the 'magic-sdk' library. This import is necessary to initialize and interact with the Magic authentication service.

```javascript
import { Magic } from 'magic-sdk'
```

--------------------------------

### Use Passkeys as Signer for Safe (Tutorial)

Source: https://docs.safe.global/resource-hub_page=3

A tutorial video explaining how to use a passkey as a signer for a Safe in three simple steps. It covers Passkeys, Permissionless, React, and Signer topics, with relevance to 4337.

--------------------------------

### Add Protocol Kit Dependency (Yarn)

Source: https://docs.safe.global/sdk/protocol-kit/guides/migrate-to-v1

Installs the Protocol Kit v1.3.0 and the types library v2.3.0 using Yarn. This step is crucial for migrating to the new SDK version.

```bash
yarn add @safe-global/protocol-kit@1.3.0
yarn add @safe-global/safe-core-sdk-types@2.3.0
```

--------------------------------

### Get Specific Token Information

Source: https://docs.safe.global/core-api/transaction-service-reference/chiado

Retrieves detailed information for a single, specific token supported by the Safe Transaction Service, identified by its contract address. The response includes the token's type, name, symbol, decimals, logo URI, and trusted status. A TypeScript example using SafeApiKit is provided.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 10200n,
  apiKey: 'YOUR_API_KEY'
})

const token = await apiKit.getToken(
  '0x687e43D0aB3248bDfebFE3E8f9F1AB2B9FcE982d'
)

console.log(token)
```

--------------------------------

### Compile Hardhat Contracts

Source: https://docs.safe.global/advanced/smart-account-guards/smart-account-guard-tutorial

Compiles all the Solidity contracts within the Hardhat project. This step verifies the contract code and generates the necessary ABI and bytecode.

```bash
npx hardhat compile
```

--------------------------------

### SafeClient with Existing Safe

Source: https://docs.safe.global/reference-sdk-starter-kit/safe-client/constructor

Demonstrates creating a SafeClient instance for an existing Safe account by providing the Safe's address.

```javascript
const safeClient = await createSafeClient({
  provider,
  signer,
  safeAddress: '0x...',
  apiKey: 'YOUR_API_KEY'
})
```

--------------------------------

### Install React Native Passkeys Dependencies

Source: https://docs.safe.global/advanced/passkeys/tutorials/react-native

Installs the necessary npm packages for integrating Safe Global protocol kit and passkeys into a React Native application. This includes packages for Safe Core SDK, passkey management, base64 encoding, asynchronous storage, and build properties configuration.

```bash
cd react-native-passkeys
npm install @safe-global/protocol-kit react-native-passkeys react-native-base64 @react-native-async-storage/async-storage react-native-prompt-android expo-build-properties
```

--------------------------------

### isModuleEnabled Function Call Example (Solidity)

Source: https://docs.safe.global/reference-smart-account/modules/isModuleEnabled

Provides a concrete example of calling the `isModuleEnabled` function with a specific module address. This snippet illustrates the practical application of checking module enablement.

```Solidity
(ISafe safe).isModuleEnabled(
    0x...
);
```

--------------------------------

### Create Stores Directory and File

Source: https://docs.safe.global/advanced/passkeys/tutorials/nuxt

This snippet demonstrates the bash commands to create a 'stores' directory and a 'safe.ts' file within it, preparing the project structure for Pinia state management.

```bash
cd ..

mkdir stores

cd stores

touch safe.ts
```

--------------------------------

### Sample GET Request for Safe Operations

Source: https://docs.safe.global/core-api/transaction-service-reference/aurora

This snippet demonstrates how to make a GET request to the Safe Operations API to retrieve details about a specific safe operation. It includes necessary headers for authentication and content type.

```bash
curl -X GET https://api.safe.global/tx-service/aurora/api/v1/safe-operations/0x597ba36c626a32a4fcc9f23a4b25605ee30b46584918d6b6442387161dc3c51b/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY"
```

--------------------------------

### Create Safe Smart Account for AI Agent

Source: https://docs.safe.global/home/ai-agent-quickstarts/basic-agent-setup

This code demonstrates how to initialize the Safe Protocol Kit to create a Safe Smart Account for an AI agent. It configures the account with the AI agent as the sole owner and a threshold of 1. The smart contract is deployed upon the first transaction.

```javascript
import Safe from '@safe-global/protocol-kit'
  
const SIGNER_ADDRESS = // ...  
const SIGNER_PRIVATE_KEY = // ...  
const RPC_URL = 'https://rpc.ankr.com/eth_sepolia'  
  
const safeClient = await Safe.init({
  provider: RPC_URL,
  signer: SIGNER_PRIVATE_KEY,
  predictedSafe: {
    safeAccountConfig: {
      owners: [SIGNER_ADDRESS],
      threshold: 1
    }
  }
})  
```

--------------------------------

### Sample Response: List Multisig Confirmations

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis

Example JSON response for listing multisig confirmations, showing the total count, pagination links, and an array of confirmation results.

```JSON
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "owner": "0xa6d3DEBAAB2B8093e69109f23A75501F864F74e2",
      "submissionDate": "2024-06-26T14:57:15.504003Z",
      "transactionHash": null,
      "signature": "0xec2c1cf656d997f92247ddf59f30ce718de990ec4f8d4670a37d3d3594862f0d49ad2c553daa2ff937c50d45e9ca6a815f826d29603f8c5c818cb698ddc2383a20",
      "signatureType": "ETH_SIGN"
    }
  ]
}
```

--------------------------------

### Enable Safe Guard Transaction with GasPrice Option

Source: https://docs.safe.global/reference-sdk-protocol-kit/safe-guards/createenableguardtx

Provides an example of specifying the `gasPrice` when creating a transaction to enable a Safe Guard.

```typescript
const safeTransaction = await protocolKit.createEnableGuardTx(
  '0x...', 
  options: {
    gasPrice: '123'
  }
)

```

--------------------------------

### Create lib folder and constants.ts

Source: https://docs.safe.global/home/passkeys-tutorials/safe-passkeys-tutorial

This snippet demonstrates the bash commands to create a 'lib' directory, navigate into it, and create a 'constants.ts' file. This file will store common constants used throughout the project.

```bash
mkdir lib
cd lib
touch constants.ts
```

--------------------------------

### Authenticate GET Request with API Key using SafeApiKit

Source: https://docs.safe.global/core-api/how-to-use-api-keys

This code snippet illustrates how to use the SafeApiKit library to make an authenticated GET request to the Safe API. It demonstrates setting the API key for authorization.

```JavaScript
import SafeApiKit from '@safe-global/api-kit';

const safeApiKey = "YOUR_API_KEY";
const safeApiKit = new SafeApiKit(safeApiKey);

safeApiKit.getMultisigTransactions("0x5298a93734c3d979ef1f23f78ebb871879a21f22", {
  network: "eth"
})
.then(transactions => {
  console.log(transactions);
})
.catch(error => {
  console.error("Error fetching transactions:", error);
});
```

--------------------------------

### Example Usage of Safe execTransaction

Source: https://docs.safe.global/reference-smart-account/transactions/execTransaction

This Solidity code demonstrates how to call the `execTransaction` function from a contract. It shows how to populate the parameters such as destination address, value, data, operation type, gas settings, and signatures to initiate a Safe transaction.

```solidity
contract Example {
    function example() ... {
        (ISafe safe).execTransaction(
            0x...,
            0,
            "0x...",
            Enum.Operation.Call,
            0,
            0,
            0,
            0x...,
            0x...,
            "0x..."
        );
    }
}
```

--------------------------------

### Set Safe Transaction Guard (JavaScript Example)

Source: https://docs.safe.global/reference-smart-account/guards/setGuard

Provides a JavaScript example of how to call the `setGuard` function on a Safe smart contract. It illustrates passing the guard's address to the function.

```JavaScript
(ISafe safe).setGuard(
    0x...
);
```

--------------------------------

### Configure Singleton Contract with isL1SafeSingleton

Source: https://docs.safe.global/reference-sdk-protocol-kit/initialization/init

Initializes the Safe SDK, specifying whether to use the `Safe.sol` (L1) or `SafeL2.sol` (L2) singleton contract. `isL1SafeSingleton: true` forces the use of `Safe.sol`, which is typically for Ethereum Mainnet, while `false` (default) uses `SafeL2.sol` for other networks.

```javascript
const protocolKit = await Safe.init({
  provider,
  signer,
  safeAddress,
  isL1SafeSingleton: true
})
```

--------------------------------

### Show Safe Stack Helm Chart Values

Source: https://docs.safe.global/core-api/safe-infrastructure-deployment

This command displays the default configuration values for the safe-stack Helm chart, which can be used to create a custom values.yaml file.

```bash
helm show values safe/safe-stack
```

--------------------------------

### Get Module Transaction

Source: https://docs.safe.global/core-api/transaction-service-reference/ink

Retrieves details of a module transaction using its ID. This involves making a GET request to the /tx-service/ink/api/v1/module-transaction/{module_transaction_id}/ endpoint.

```curl
curl -X GET https://api.safe.global/tx-service/ink/api/v1/module-transaction/0x3b3b57b3 \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY" \
```

--------------------------------

### Initialize Protocol Kit with Signer Address

Source: https://docs.safe.global/reference-sdk-protocol-kit/initialization/init

Shows how to initialize the Protocol Kit when the signer is provided as an address. This method requires the provider, the signer's address, and the Safe address.

```javascript
const protocolKit = await Safe.init({
  provider,
  signer: '0x...',
  safeAddress: '0x...'
})
```

--------------------------------

### Sample GET Request to Safe Global API (Sepolia)

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis

This snippet demonstrates a sample GET request using cURL to the Safe Global API endpoint for multisig transactions by origin on the Ethereum Sepolia network. It includes necessary headers for JSON communication.

```cURL
curl -X GET https://safe-transaction-sepolia.safe.global/api/api/v2/analytics/multisig-transactions/by-origin/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \

```

--------------------------------

### Create Viem Wallet Client with Magic Provider

Source: https://docs.safe.global/sdk/signers/magic

Creates a Viem wallet client using the Magic SDK's RPC provider. This allows Viem to interact with the user's Magic wallet for blockchain operations.

```javascript
const provider = createWalletClient({
  chain: sepolia,
  transport: custom(magic.rpcProvider)
})
```

--------------------------------

### Import Core SDK Components

Source: https://docs.safe.global/sdk/protocol-kit/guides/multichain-safe-deployment

Imports essential types and classes from the Protocol Kit for Safe configuration and deployment, along with Viem actions for transaction handling and chain definitions.

```typescript
import Safe, {
  PredictedSafeProps,
  SafeAccountConfig,
  SafeDeploymentConfig
} from '@safe-global/protocol-kit'
import { waitForTransactionReceipt } from 'viem/actions'
import { gnosisChiado, sepolia } from 'viem/chains'
```

--------------------------------

### List Safe Operations (GET)

Source: https://docs.safe.global/core-api/transaction-service-reference/arbitrum

This snippet shows how to retrieve a list of safe operations for a specific Safe account address using the Safe Global API. It includes authorization headers and demonstrates a GET request.

```bash
curl -X GET https://api.safe.global/tx-service/arb1/api/v1/safes/0xcd2E72aEBe2A203b84f46DEEC948E6465dB51c75/safe-operations/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY"
```

--------------------------------

### Install OwnableExecutor Module

Source: https://docs.safe.global/advanced/erc-7579/tutorials/7579-tutorial

Installs the OwnableExecutor module as an executor for a smart account. It utilizes the Pimlico bundler and paymaster for transaction sponsorship on Sepolia. The function logs the process and waits for the transaction receipt.

```javascript
const installModule = async () => {
  setLoading(true)
  console.log('Installing module...')
  const userOpHash = await smartAccountClient?.installModule({
    type: 'executor',
    address: ownableExecutorModule,
    context: encodePacked(['address'], [executorAddress as `0x${string}`])
  })
  console.log('User operation hash:', userOpHash, '\nwaiting for receipt...')
  const transactionReceipt = await pimlicoClient.waitForUserOperationReceipt({
    hash: userOpHash as `0x${string}`
  })
  console.log('Module installed:', transactionReceipt)
  setModuleIsInstalled(true)
  setSafeIsDeployed((await safeAccount?.isDeployed()) ?? false)
  setLoading(false)
}
```

--------------------------------

### List User Operations - GET Request

Source: https://docs.safe.global/core-api/transaction-service-reference/sonic

This snippet shows how to retrieve a list of UserOperations for a specific Safe account using a GET request. It includes the endpoint, headers, and query parameters for ordering and pagination.

```bash
curl -X GET https://api.safe.global/tx-service/sonic/api/v1/safes/0xcd2E72aEBe2A203b84f46DEEC948E6465dB51c75/user-operations/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY"
```

--------------------------------

### GET Request to List Safe Operations

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis

This snippet shows a sample GET request to list safe operations for a given Safe account on the Ethereum Sepolia network. It includes the necessary headers for JSON acceptance.

```curl
curl -X GET https://safe-transaction-sepolia.safe.global/api/api/v1/safes/0xcd2E72aEBe2A203b84f46DEEC948E6465dB51c75/safe-operations/ \
    -H "Accept: application/json" \
    -H "content-type: application/json"
```

--------------------------------

### Clone AASA Server Repository

Source: https://docs.safe.global/advanced/passkeys/tutorials/react-native

Clones the necessary AASA server repository from GitHub to set up passkey testing. This is the initial step to get the testing server running.

```Bash
git clone https://github.com/5afe/aasa-server.git
```

--------------------------------

### Get Safe Creation Status via API

Source: https://docs.safe.global/core-api/transaction-service-reference/xlayer

Illustrates how to fetch the creation status of a Safe using a cURL command. This involves making a GET request to the specific API endpoint with the Safe's address.

```curl
curl -X GET "/tx-service/okb/api/v1/safes/{address}/creation/" -H "accept: application/json"
```

--------------------------------

### Create Stores Directory and File

Source: https://docs.safe.global/home/passkeys-tutorials/safe-passkeys-nuxt

This snippet demonstrates the bash commands to create a 'stores' directory and a 'safe.ts' file within it, preparing the project structure for Pinia state management.

```bash
cd ..

mkdir stores

cd stores

touch safe.ts
```

--------------------------------

### Safe{Core} API Endpoints

Source: https://docs.safe.global/core-api/api-overview

Examples of API requests and responses for interacting with Safe{Core} services. These include fetching Safe details, creating multisig transactions, and handling event notifications.

```HTTP
GET /v1/chains/1/safes/...
GET /v1/chains/1200 OK /v1/chains/1
GET /api/v1/safes/...
200 /api/v1/safes/...
200 OK /v1/chains/1/safes/...
POST /v1/chains/1/safes/0x000.../multisig-transactions
POST /api/v1/safes/0x000.../multisig-transactions
201 CREATED /api/v1/safes/0x000.../multisig-transactions
201 CREATED /v1/chains/1/safes/0x000.../multisig-transactions
POST /v1/hooks/events
204 NO CONTENT /v1/hooks/events
Event notification
```

--------------------------------

### Import createSafeClient - Safe SDK

Source: https://docs.safe.global/sdk/starter-kit/guides/send-transactions

Imports the `createSafeClient` function from the Safe SDK starter kit, which is essential for initializing the Safe client.

```javascript
import { createSafeClient } from '@safe-global/sdk-starter-kit'
```

--------------------------------

### Get Specific Contract - GET Request

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis

Fetches detailed information for a specific smart contract identified by its address. The response includes the contract's ABI, description, and other relevant metadata.

```curl
curl -X GET https://safe-transaction-sepolia.safe.global/api/api/v1/contracts/0xcd2E72aEBe2A203b84f46DEEC948E6465dB51c75/ \
    -H "Accept: application/json" \
    -H "content-type: application/json"
```

--------------------------------

### Configure Pre-Estimation Gas Setup in Safe{Core} SDK

Source: https://docs.safe.global/reference-sdk-starter-kit/safe-operations/sendsafeoperation

Sets up the User Operation for gas estimation by calling `preEstimateUserOperationGas` before `eth_estimateUserOperationGas`. This function is part of the `feeEstimator` configuration.

```javascript
const safeOperationResult = await safeOperationsClient.sendSafeOperation({
  transactions,
  feeEstimator: {
    preEstimateUserOperationGas
  }
})
```

--------------------------------

### Add Safe Operation with EntryPoint Parameter

Source: https://docs.safe.global/reference-sdk-api-kit/addsafeoperation

Illustrates calling `addSafeOperation` by specifying the `entryPoint` parameter. This example shows the minimal required parameters for the operation, including `entryPoint`, `moduleAddress`, `safeAddress`, and `userOperation`.

```typescript
await apiKit.addSafeOperation({
    entryPoint: '0x...',
    moduleAddress: '0x...',
    safeAddress: '0x...',
    userOperation
  })
```

--------------------------------

### Initialize Safe4337Pack

Source: https://docs.safe.global/sdk/relay-kit/reference/safe-4337-pack

Initializes the Safe4337Pack with provided options, including provider, signer, bundler URL, and paymaster configurations. This setup is crucial for interacting with ERC-4337 user operations.

```javascript
const safe4337Pack = await Safe4337Pack.init({
  provider,
  signer,
  bundlerUrl,
  safeModulesVersion,
  customContracts,
  options,
  paymasterOptions
})
```

--------------------------------

### Initialize Safe Smart Account with Protocol Kit

Source: https://docs.safe.global/home/ai-agent-actions/ai-agent-swaps-with-cow-swap

Initializes an instance of the Safe Smart Account using the Protocol Kit. This requires the provider URL, the agent's private key, and the Safe's address.

```javascript
import Safe from "@safe-global/protocol-kit";

const preExistingSafe = await Safe.init({
  provider: RPC_URL,
  signer: AGENT_PRIVATE_KEY,
  safeAddress: SAFE_ADDRESS,
});
```

--------------------------------

### Approve Transaction Hash (Minimal)

Source: https://docs.safe.global/reference-sdk-protocol-kit/transaction-signatures/approvetransactionhash

A simplified example of approving a Safe transaction hash with only the required `safeTransactionHash` parameter.

```typescript
const transactionResponse = await protocolKit.approveTransactionHash(
  '0x...'
)

```

--------------------------------

### Create Passkey Signer and Initialize Protocol Kit

Source: https://docs.safe.global/reference-sdk-protocol-kit/passkeys/createpasskeysigner

This snippet demonstrates how to create a passkey signer using a WebAuthn credential and then initialize the Safe Protocol Kit with this signer. It outlines the necessary steps for integrating passkey authentication into your Safe application.

```JavaScript
const rpcUrl = "https://..."
const credential = window.navigator.credentials.create({ ... })
const passkeySigner = await Safe.createPasskeySigner(credential)
const protocolKit = await Safe.init({
  provider: rpcURL,
  signer: passkeySigner,
  safeAddress
})
```

--------------------------------

### Initialize Safe4337Pack for New Safe Account

Source: https://docs.safe.global/advanced/erc-4337/guides/safe-sdk

Initializes the Safe4337Pack to deploy a new Safe account. Requires provider, signer, bundlerUrl, and optionally owners, threshold, and onchainAnalytics. The safeModulesVersion can be set to '0.3.0' for Entrypoint v0.7.

```javascript
const safe4337Pack = await Safe4337Pack.init({
  provider: RPC_URL,
  signer: SIGNER_PRIVATE_KEY,
  bundlerUrl: `https://api.pimlico.io/v2/11155111/rpc?add_balance_override&apikey=${PIMLICO_API_KEY}`,
  // safeModulesVersion: '0.3.0', // Defaults to 0.2.0. If you are using the v0.7 of the Entrypoint set the value to '0.3.0'
  options: {
    owners: [SIGNER_ADDRESS],
    threshold: 1
  },
  onchainAnalytics // Optional
  // ...
})
```

--------------------------------

### Sign Safe Message with Protocol Kit

Source: https://docs.safe.global/reference-sdk-protocol-kit/messages/signmessage

Demonstrates how to sign a Safe message using the Protocol Kit. It includes setting up the message, specifying the signing method, and optionally providing the Safe address for preimage calculation. This example uses `SigningMethod.ETH_SIGN_TYPED_DATA_V4`.

```TypeScript
import { SigningMethod } from '@safe-global/protocol-kit'
import { EIP712TypedData } from '@safe-global/types-kit'
import { protocolKit } from './setup.ts'

const rawMessage: string | EIP712TypedData = 'Example message'
const message = protocolKit.createMessage(rawMessage)

const signingMethod = SigningMethod.ETH_SIGN_TYPED_DATA_V4

const preimageSafeAddress = '0x...'

const signedMessage = await protocolKit.signMessage(
  message,
  signingMethod, // Optional
  preimageSafeAddress // Optional
)

```

--------------------------------

### Remove Adapters and Use SafeProvider

Source: https://docs.safe.global/sdk/protocol-kit/guides/migrate-to-v4

The `protocol-kit` has been simplified by removing the concept of adapters. Instead, an internal `SafeProvider` is used for interactions, which can be initialized with an Ethereum provider (EIP-1193 compatible or RPC URL) and an optional signer (address or private key). The `EthAdapter`, `EthersAdapter`, `Web3Adapter`, `EthersAdapterConfig`, and `Web3AdapterConfig` are no longer available.

```javascript
// old
const ethAdapter = new EthersAdapter({ ethers, signerOrProvider })
// const ethAdapter = new Web3Adapter({ web3, signerAddress })
await Safe.create({
   ethAdapter,
   safeAddress: '0xSafeAddress'
   ...
})

// new
await Safe.init({
   provider: window.ethereum, // Or any compatible EIP-1193 provider
   signer: '0xSignerAddressOrPrivateKey', // Signer address or private key
   safeAddress: '0xSafeAddress'
   ...
})

// ...or...
await Safe.init({
   provider: 'http://rpc.url', // Or websocket
   signer: '0xPrivateKey' // Signer private key
   safeAddress: '0xSafeAddress'
   ...
})
```

--------------------------------

### Get Supported Entry Points (JavaScript)

Source: https://docs.safe.global/sdk/relay-kit/reference/safe-4337-pack

Retrieves a list of all entry point addresses supported by the bundler. This is useful for determining the default entry point.

```javascript
getSupportedEntryPoints()
```

--------------------------------

### Get All Transactions for a Safe

Source: https://docs.safe.global/core-api/transaction-service-reference/chiado

Retrieves all transactions associated with a given Safe address using the SafeApiKit. This method is useful for getting a comprehensive list of all on-chain activities for a Safe.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 10200n,
  apiKey: 'YOUR_API_KEY'
})

const transactions = await apiKit.getAllTransactions(
  '0x5298a93734c3d979ef1f23f78ebb871879a21f22'
)

console.log(transactions)
```

--------------------------------

### Build React App with Safe and Passkeys

Source: https://docs.safe.global/resource-hub_source=Safe+Team&tag=Tutorial

Discover how to create a React application that leverages passkeys for secure user authentication with Safe. This guide explains how to manage passkeys (creation, storage, and usage) and their interaction with a Safe.

```React
/*
  This section is a placeholder for React code examples.
  The actual code would involve setting up the Safe SDK and passkey integration.
*/
console.log('React Safe and Passkeys Integration Example');
```

--------------------------------

### Specify New Owner Address for Swap

Source: https://docs.safe.global/reference-sdk-protocol-kit/safe-info/createswapownertx

This example demonstrates how to provide the `newOwnerAddress` parameter, which is optional, when creating a swap owner transaction using `createSwapOwnerTx`.

```typescript
const safeTransaction = await protocolKit.createSwapOwnerTx({
  oldOwnerAddress: '0x...',
  newOwnerAddress: '0x...'
})

```

--------------------------------

### Create a New Safe Demo

Source: https://docs.safe.global/advanced/cli-demos

Demonstrates the process of creating a new Safe smart account. This demo utilizes an EOA private key set in the PRIVATE_KEY environment variable.

```N/A
![Create a new Safe](https://asciinema.org/a/0jdHGLVRrkS9URxPoZ8ZJ7W2C.svg) (opens in a new tab)
```

--------------------------------

### List User Operations - GET Request

Source: https://docs.safe.global/core-api/transaction-service-reference/linea

This snippet shows how to retrieve a list of UserOperations associated with a specific Safe account via a GET request. It includes optional query parameters for ordering, limiting, and offsetting results, and requires an API key for authentication.

```bash
curl -X GET https://api.safe.global/tx-service/linea/api/v1/safes/0xcd2E72aEBe2A203b84f46DEEC948E6465dB51c75/user-operations/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY" \
```

--------------------------------

### Get Safe Message Hash using Protocol Kit

Source: https://docs.safe.global/reference-sdk-protocol-kit/messages/getsafemessagehash

Demonstrates how to import and use the `hashSafeMessage` function from the Protocol Kit to generate a Safe message hash. It then shows how to pass this hash to the `protocolKit.getSafeMessageHash` method to get the final Safe message hash.

```TypeScript
import { hashSafeMessage } from '@safe-global/protocol-kit'
import { EIP712TypedData } from '@safe-global/types-kit'
import { protocolKit } from './setup.ts'

const rawMessage: string | EIP712TypedData = 'Example message'
const messageHash = hashSafeMessage(rawMessage)

const safeMessageHash = await protocolKit.getSafeMessageHash(messageHash)
```

--------------------------------

### Get All Safe Transactions

Source: https://docs.safe.global/core-api/transaction-service-reference/ink

Retrieves all transactions associated with a given Safe address using the SafeApiKit. This function is useful for getting a comprehensive list of a Safe's transaction history.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 57073n,
  apiKey: 'YOUR_API_KEY'
})

const transactions = await apiKit.getAllTransactions(
  '0x5298a93734c3d979ef1f23f78ebb871879a21f22'
)

console.log(transactions)
```

--------------------------------

### Configure package.json Overrides

Source: https://docs.safe.global/advanced/smart-account-fallback-handler/smart-account-fallback-handler-tutorial

Configures package.json overrides to manage peer dependency issues with Safe Global contracts and ethers.

```json
{
  "overrides": {
    "@safe-global/safe-contracts": {
      "ethers": "^6.13.5"
    }
  }
}
```

--------------------------------

### List Safe Operations (GET)

Source: https://docs.safe.global/core-api/transaction-service-reference/chiado

This snippet shows how to retrieve a list of safe operations for a specific safe address using a cURL command. It includes the GET request to the API endpoint and sets the necessary headers for Accept, content-type, and Authorization. Remember to replace YOUR_API_KEY with your valid API key.

```bash
curl -X GET https://api.safe.global/tx-service/chi/api/v1/safes/0xcd2E72aEBe2A203b84f46DEEC948E6465dB51c75/safe-operations/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY"
```

--------------------------------

### Compile Hardhat Contracts

Source: https://docs.safe.global/advanced/smart-account-fallback-handler/smart-account-fallback-handler-tutorial

Compiles the smart contracts within a Hardhat project. This step verifies the contract code and generates the necessary artifacts for deployment.

```bash
npx hardhat compile
```

--------------------------------

### List Safe Operations (GET)

Source: https://docs.safe.global/core-api/transaction-service-reference/aurora

This snippet shows how to retrieve a list of safe operations for a given Safe account using a cURL command. It includes the GET request to the API endpoint and necessary headers for authentication and content type.

```bash
curl -X GET https://api.safe.global/tx-service/aurora/api/v1/safes/0xcd2E72aEBe2A203b84f46DEEC948E6465dB51c75/safe-operations/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY"
```

--------------------------------

### Initialize SafeApiKit with API Key (JavaScript)

Source: https://docs.safe.global/sdk/api-kit/guides/migrate-to-v4

This snippet demonstrates how to initialize the SafeApiKit with an API key, which is now required for accessing Safe default services. It shows the old initialization method without an API key and the new method including the `apiKey` parameter in the constructor.

```javascript
import SafeApiKit from '@safe-global/api-kit'

const chainId: bigint = 1n
const apiKit = new SafeApiKit({
  chainId
})
```

```javascript
import SafeApiKit from '@safe-global/api-kit'

const chainId: bigint = 1n
const apiKit = new SafeApiKit({
  chainId,
  apiKey: 'YOUR_API_KEY'
})
```

--------------------------------

### Get Safe Creation Status via API

Source: https://docs.safe.global/core-api/transaction-service-reference/linea

This section details the API endpoint for retrieving the creation status of a Safe. It outlines the request method (GET), the URL structure, and the possible response codes (200 OK, 404, 422, 503) along with their meanings. The 200 OK response includes fields like 'created', 'creator', 'transactionHash', 'factoryAddress', 'masterCopy', 'setupData', 'dataDecoded', and 'userOperation'.

```cURL
GET
/tx-service/linea/api/v1/safes/{address}/creation/
```

--------------------------------

### Get Safe Operations via cURL

Source: https://docs.safe.global/core-api/transaction-service-reference/optimism

This snippet shows how to use cURL to make a GET request to the Safe Global API's transaction service. It includes headers for accepting JSON, specifying content type, and authorization using an API key.

```bash
curl -X GET https://api.safe.global/tx-service/oeth/api/v1/safe-operations/0x597ba36c626a32a4fcc9f23a4b25605ee30b46584918d6b6442387161dc3c51b/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY"
```

--------------------------------

### Get Safe Operations (cURL)

Source: https://docs.safe.global/core-api/transaction-service-reference/zksync

This snippet shows how to make a GET request to the Safe Global API to retrieve safe operations for a specific safe address on the zksync network. It includes headers for content type, acceptance, and authorization.

```bash
curl -X GET https://api.safe.global/tx-service/zksync/api/v1/safe-operations/0x597ba36c626a32a4fcc9f23a4b25605ee30b46584918d6b6442387161dc3c51b/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY"
```

--------------------------------

### Propose Transaction - Safe Address Parameter

Source: https://docs.safe.global/reference-sdk-api-kit/proposetransaction

Example of calling `proposeTransaction` focusing on the `safeAddress` parameter. This shows the essential fields required for proposing a transaction.

```TypeScript
await apiKit.proposeTransaction({
  safeAddress: '0x...',
  safeTxHash: '0x...',
  safeTransactionData,
  senderAddress: '0x...',
  senderSignature: '0x...'
})
```

--------------------------------

### Initialize Safe Protocol Kit and API Kit

Source: https://docs.safe.global/core-api/transaction-service-reference/chiado

This snippet demonstrates how to initialize the Safe Protocol Kit and Safe API Kit with necessary configurations like provider, signer, chain ID, and API key. It then shows how to create and sign a message, and add it to the Safe API.

```TypeScript
import Safe from '@safe-global/protocol-kit'  
import SafeApiKit from '@safe-global/api-kit'  

const safeAddress = '0x5298a93734c3d979ef1f23f78ebb871879a21f22'  

const protocolKit = await Safe.init({
  provider: 'https://eth-sepolia.public.blastapi.io',  
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  safeAddress
})

const apiKit = new SafeApiKit({
  chainId: 10200n,
  apiKey: 'YOUR_API_KEY'
})

const rawMessage = '1: string message'
const safeMessage = protocolKit.createMessage(rawMessage)
const signedMessage = await protocolKit.signMessage(safeMessage, 'eth_sign')

console.log({
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})

apiKit.addMessage(safeAddress, {
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})
```

--------------------------------

### Build Vue App with Safe and Passkeys

Source: https://docs.safe.global/resource-hub_source=Safe+Team&tag=Tutorial

This tutorial guides you through building a Vue application that utilizes passkeys for secure authentication with Safe. It details the process of using passkeys (creation, storage, and secure usage) and their integration with a Safe.

```Vue
/*
  This section is a placeholder for Vue code examples.
  The actual code would involve setting up the Safe SDK and passkey integration.
*/
console.log('Vue Safe and Passkeys Integration Example');
```

--------------------------------

### Add Safe Operation with VerificationGasLimit

Source: https://docs.safe.global/reference-sdk-api-kit/addsafeoperation

Provides an example of setting the verificationGasLimit for a safe operation, specifying the maximum gas for the signature verification process.

```javascript
await apiKit.addSafeOperation({
  entryPoint: '0x...',
  moduleAddress: '0x...',
  safeAddress: '0x...',
  userOperation: {
    sender: '0x...',
    nonce: '10',
    initCode: '0x...',
    callData: '0x...',
    callGasLimit: 123n,
    verificationGasLimit: 123n,
    preVerificationGas: 123n,
    maxFeePerGas: 123n,
    maxPriorityFeePerGas: 123n,
    paymasterAndData: '0x...',
    signature: '0x...'
  }
})
```

--------------------------------

### Get Pending Transactions with SafeClient

Source: https://docs.safe.global/reference-sdk-starter-kit/safe-client/getpendingtransactions

Demonstrates how to use the `getPendingTransactions` method from the SafeClient to retrieve a list of transactions awaiting confirmation. This requires an initialized `safeClient` instance.

```TypeScript
import { safeClient } from './setup.ts'

const pendingTransactions = await safeClient.getPendingTransactions()
```

--------------------------------

### Specify New Owner Passkey for Swap

Source: https://docs.safe.global/reference-sdk-protocol-kit/safe-info/createswapownertx

This example illustrates how to use the `newOwnerPasskey` parameter, which is of type `PasskeyArgType`, when creating a swap owner transaction.

```typescript
const safeTransaction = await protocolKit.createSwapOwnerTx({
  oldOwnerAddress: '0x...',
  newOwnerPasskey
})

```

--------------------------------

### Authenticate GET Request with API Key using cURL

Source: https://docs.safe.global/core-api/how-to-use-api-keys

This snippet demonstrates how to make a GET request to the Safe API's multisig-transactions endpoint using cURL. It shows how to include the API key in the Authorization header as a Bearer token for authentication.

```cURL
curl -X GET "https://api.safe.global/tx-service/eth/api/v2/safes/0x5298a93734c3d979ef1f23f78ebb871879a21f22/multisig-transactions" \
  -H "Authorization: Bearer $YOUR_API_KEY"
```

--------------------------------

### Magic Wallet Login

Source: https://docs.safe.global/sdk/signers/magic

Initiates the Magic wallet connection process, which typically opens a UI for the user to log in using their email or social accounts. This is an asynchronous operation.

```javascript
await magic.wallet.connectWithUI()
```

--------------------------------

### Approve Transaction Hash with 'gasPrice' option

Source: https://docs.safe.global/reference-sdk-protocol-kit/transaction-signatures/approvetransactionhash

Example of approving a Safe transaction hash while specifying the `gasPrice` in the transaction options.

```typescript
const transactionResponse = await protocolKit.approveTransactionHash(
  '0x...',
  options: {
    gasPrice: '123'
  }
)

```

--------------------------------

### Get Module Transaction

Source: https://docs.safe.global/core-api/transaction-service-reference/worldchain

Retrieves details of a module transaction using its unique ID. This cURL command demonstrates how to make a GET request to the Safe API to fetch transaction information.

```curl
curl -X GET https://api.safe.global/tx-service/wc/api/v1/module-transaction/0x3b3b57b3 \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY" \
```

--------------------------------

### Compile Hardhat Contracts

Source: https://docs.safe.global/advanced/smart-account-modules/smart-account-modules-tutorial

Compiles all the smart contracts in the Hardhat project. This step verifies that the contracts are syntactically correct and ready for deployment or testing.

```bash
npx hardhat compile
```

--------------------------------

### Get Safe Operations via cURL

Source: https://docs.safe.global/core-api/transaction-service-reference/sonic

This snippet shows how to retrieve safe operations from the Safe Global API using a cURL command. It specifies the GET method, the API endpoint, and necessary headers including Accept, content-type, and Authorization.

```bash
curl -X GET https://api.safe.global/tx-service/sonic/api/v1/safe-operations/0x597ba36c626a32a4fcc9f23a4b25605ee30b46584918d6b6442387161dc3c51b/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY"
```

--------------------------------

### Build React App with Safe and Passkeys (Tutorial)

Source: https://docs.safe.global/resource-hub_page=3

This tutorial teaches how to create a React application for using passkeys with Safe. It covers secure passkey management and interaction with a Safe, relevant for React, Passkeys, and Safe Core SDK.

--------------------------------

### Approve Transaction Hash with 'gasLimit' option

Source: https://docs.safe.global/reference-sdk-protocol-kit/transaction-signatures/approvetransactionhash

Example of approving a Safe transaction hash while specifying the `gasLimit` in the transaction options.

```typescript
const transactionResponse = await protocolKit.approveTransactionHash(
  '0x...',
  options: {
    gasLimit: '123'
  }
)

```

--------------------------------

### Build AI Agents with Safe Capabilities

Source: https://docs.safe.global/resource-hub

This tutorial guides you through setting up and deploying an AI agent that can interact with a Safe and prepare transactions. It covers the integration of AI capabilities with Safe Smart Accounts.

```English
In this tutorial, we will learn how to set up and deploy an AI agent that has capabilities to access a Safe and prepare transactions for it 🤖.
```

--------------------------------

### Build React App with Safe and Passkeys (Tutorial)

Source: https://docs.safe.global/resource-hub_page=2

This tutorial teaches how to create a React application for using passkeys with Safe. It covers secure passkey management and interaction with a Safe, relevant for React, Passkeys, and Safe Core SDK.

--------------------------------

### Get Messages without Configuration

Source: https://docs.safe.global/reference-sdk-api-kit/getmessages

Retrieves messages for a Safe account without specifying any configuration options.

```typescript
const messagesResponse = await apiKit.getMessages(
  '0x...'
)
```

--------------------------------

### Get Safe Operations via cURL

Source: https://docs.safe.global/core-api/transaction-service-reference/linea

This snippet shows how to fetch safe operations from the Safe Global API using cURL. It includes the necessary GET request, endpoint URL, and headers for accepting JSON, specifying content type, and providing an authorization token.

```bash
curl -X GET https://api.safe.global/tx-service/linea/api/v1/safe-operations/0x597ba36c626a32a4fcc9f23a4b25605ee30b46584918d6b6442387161dc3c51b/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY"
```

--------------------------------

### Propose and Confirm Transactions with API Kit

Source: https://docs.safe.global/sdk/api-kit

This guide demonstrates how to use the Safe{Core} API Kit to propose and confirm transactions. It involves interacting with the Safe Transaction Service to manage the lifecycle of a transaction, from proposal to execution.

```javascript
import SafeApiKit from "@safe-global/api-kit";

// Initialize the API Kit
const apiKit = new SafeApiKit({
  chainId: 1, // Example: Ethereum Mainnet
});

// Example: Propose a transaction
async function proposeTransaction(safeAddress, to, value, data, nonce) {
  const transaction = {
    to: to,
    value: value,
    data: data,
    operation: 0, // 0 for CALL, 1 for DELEGATECALL
    safeTxGas: 0,
    baseGas: 0,
    gasPrice: "0",
    gasToken: null,
    refundReceiver: null,
    nonce: nonce,
  };

  try {
    const proposal = await apiKit.proposeTransaction({
      safeAddress: safeAddress,
      safeTransactionData: transaction,
      safeTxHash: "0x...", // Hash of the transaction data
    });
    console.log("Transaction proposed:", proposal);
    return proposal;
  } catch (error) {
    console.error("Error proposing transaction:", error);
    throw error;
  }
}

// Example: Confirm a transaction
async function confirmTransaction(safeTxHash, signature) {
  try {
    await apiKit.confirmTransaction({
      safeTxHash: safeTxHash,
      signature: signature,
    });
    console.log("Transaction confirmed.");
  } catch (error) {
    console.error("Error confirming transaction:", error);
    throw error;
  }
}

// Example usage (replace with actual values)
// proposeTransaction("0x...", "0x...", "0", "0x", 1);
// confirmTransaction("0x...", "0x...");
```

--------------------------------

### Initialize Safe Protocol Kit

Source: https://docs.safe.global/sdk/api-kit/guides/propose-and-confirm-transactions

Initializes the Safe Protocol Kit using a provider, signer's private key, and the Safe's address to manage transactions and signatures.

```javascript
const protocolKitOwner1 = await Safe.init({
  provider: RPC_URL,
  signer: OWNER_1_PRIVATE_KEY,
  safeAddress: SAFE_ADDRESS
})
```

--------------------------------

### Initialize Monerium Client and Authenticate Users

Source: https://docs.safe.global/sdk/onramp/monerium

This snippet demonstrates initializing the Monerium client and starting the authentication flow. It requires a clientId, environment, the Safe's address, a redirect URL, and the chain ID.

```javascript
import { MoneriumClient } from '@monerium/sdk'

// Initialize the Monerium Client
const monerium = new MoneriumClient({
  clientId: 'a1b2c3-x7y8y9', // Get your client ID from Monerium
  environment: 'sandbox' // Use the appropriate Monerium environment ('sandbox' | 'production')
})

// Start the Monerium authentication flow and send the users to Monerium
await monerium.authorize({
  address: safeAddress, // The address of the users' Safe
  signature: '0x', // '0x' for Safe authentication lets Monerium look for the signature on-chain
  redirectUrl: 'http://localhost:3000/return', // URL where Monerium will redirect the users after authenticating
  chainId: 11155111 // Chain ID of Sepolia in this example
})
```

--------------------------------

### Initialize Safe Protocol Kit and API Kit

Source: https://docs.safe.global/core-api/transaction-service-reference/unichain

Demonstrates how to initialize the Safe Protocol Kit with provider and signer details, and the Safe API Kit with chain ID and API key. It also shows how to create and sign a message using the protocol kit and add it to the API.

```TypeScript
import Safe from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'

const safeAddress = '0x5298a93734c3d979ef1f23f78ebb871879a21f22'

const protocolKit = await Safe.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  safeAddress
})

const apiKit = new SafeApiKit({
  chainId: 130n,
  apiKey: 'YOUR_API_KEY'
})

const rawMessage = '1: string message'
const safeMessage = protocolKit.createMessage(rawMessage)
const signedMessage = await protocolKit.signMessage(safeMessage, 'eth_sign')

console.log({
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})

apiKit.addMessage(safeAddress, {
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})
```

--------------------------------

### Approve Transaction Hash with 'nonce' option

Source: https://docs.safe.global/reference-sdk-protocol-kit/transaction-signatures/approvetransactionhash

Example of approving a Safe transaction hash while specifying the `nonce` in the transaction options.

```typescript
const transactionResponse = await protocolKit.approveTransactionHash(
  '0x...',
  options: {
    nonce: 123
  }
)

```

--------------------------------

### SafeProxyFactory Creation with create2

Source: https://docs.safe.global/advanced/erc-7579/7579-safe

This snippet illustrates the process of creating a new SafeProxy using the create2 method from SafeProxyFactory, as part of the ERC-7579 compatibility setup. It highlights the role of SenderCreator and the initialization of the SafeProxy with a singleton address pointing to Launchpad.

```Solidity
SenderCreator calls safeProxy creation from SafeProxyFactory using createProxyWithNonce.
SafeProxyFactory creates a new SafeProxy using create2.
SafeProxy is created with a singleton address set to Launchpad.
```

--------------------------------

### Initialize Safe Protocol Kit and API

Source: https://docs.safe.global/core-api/transaction-service-reference/arbitrum

Initializes the Safe protocol kit with provider and signer details, and sets up the Safe API kit with chain ID and API key. It then demonstrates creating and signing a raw message, and adding the signed message to the Safe API.

```TypeScript
import Safe from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'

const safeAddress = '0x5298a93734c3d979ef1f23f78ebb871879a21f22'

const protocolKit = await Safe.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  safeAddress
})

const apiKit = new SafeApiKit({
  chainId: 42161n,
  apiKey: 'YOUR_API_KEY'
})

const rawMessage = '1: string message'
const safeMessage = protocolKit.createMessage(rawMessage)
const signedMessage = await protocolKit.signMessage(safeMessage, 'eth_sign')

console.log({
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})

apiKit.addMessage(safeAddress, {
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})
```

--------------------------------

### Get Messages with Ordering Configuration

Source: https://docs.safe.global/reference-sdk-api-kit/getmessages

Fetches messages for a Safe account, ordering the results by a specified field.

```typescript
const messagesResponse = await apiKit.getMessages(
  '0x...',
  {
    ordering: 'created'
  }
)
```

--------------------------------

### Create LangChain Project Directory

Source: https://docs.safe.global/home/ai-agent-setup

Initializes a new project directory for the Safe AI agent and navigates into it. It also creates a .env file for storing environment-specific configurations.

```shell
mkdir my-safe-agent
cd my-safe-agent
touch .env
```

--------------------------------

### Get Enabled Safe Modules

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Retrieves a list containing the addresses of all Safe Modules that are currently enabled for the Safe.

```javascript
const moduleAddresses = await protocolKit.getModules()
```

--------------------------------

### Approve Transaction Hash with 'from' option

Source: https://docs.safe.global/reference-sdk-protocol-kit/transaction-signatures/approvetransactionhash

Example of approving a Safe transaction hash while specifying the `from` address in the transaction options.

```typescript
const transactionResponse = await protocolKit.approveTransactionHash(
  '0x...',
  options: {
    from: '0x...'
  }
)

```

--------------------------------

### Create utils Directory and constants.ts File

Source: https://docs.safe.global/advanced/passkeys/tutorials/nuxt

Creates a `utils` directory at the project root and then creates an empty `constants.ts` file within it. This sets up the structure for storing project constants.

```bash
mkdir utils
cd utils
touch constants.ts
```

--------------------------------

### Build Vue App with Safe and Passkeys

Source: https://docs.safe.global/resource-hub

This tutorial guides you through creating a Vue application for using passkeys with your Safe. It covers the secure creation, storage, and usage of passkeys and their integration with a Safe.

```English
This tutorial will teach you to create a Vue app for using passkeys in your Safe. You will learn how to use passkeys (create, store, and use them securely) and how they can interact with a Safe.
```

--------------------------------

### Get Safe Creation Info with Safe API Kit

Source: https://docs.safe.global/core-api/transaction-service-reference/arbitrum

Demonstrates how to initialize the Safe API Kit and retrieve the creation information for a specific Safe address. This involves setting up the SDK with the chain ID and an API key, then calling the `getSafeCreationInfo` method.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'
  
const apiKit = new SafeApiKit({
  chainId: 42161n,
  apiKey: 'YOUR_API_KEY'
})
  
const safeCreationInfo = await apiKit.getSafeCreationInfo(
  '0x5298A93734C3D979eF1f23F78eBB871879A21F22'
)
  
console.log(safeCreationInfo)
```

--------------------------------

### Add TypeScript Support to Project

Source: https://docs.safe.global/advanced/smart-account-migration

This snippet shows how to add TypeScript support to the project using npm. It involves installing TypeScript and ts-node as development dependencies and initializing the TypeScript configuration.

```bash
npm install --save-dev typescript ts-node  
npx tsc --init  
```

--------------------------------

### Initialize Magic API Key

Source: https://docs.safe.global/sdk/signers/magic

Defines a constant to hold the Magic API key. This key is obtained from the Magic dashboard and is required for initializing the Magic SDK.

```javascript
const MAGIC_API_KEY = // ...
```

--------------------------------

### Create and Extend SafeClient for Operations

Source: https://docs.safe.global/sdk/starter-kit/guides/send-user-operations

Initializes a new SafeClient with provider, signer, and safe address, then extends it with safeOperations configuration including bundler and paymaster URLs for sponsored operations.

```javascript
const newSafeClient = await createSafeClient({
  provider: RPC_URL,
  signer,
  safeAddress: '0x...'
})

const newSafeClientWithSafeOperation = await newSafeClient.extend(
  safeOperations({
    bundlerUrl: `https://api.pimlico.io/v1/sepolia/rpc?add_balance_override&apikey=${PIMLICO_API_KEY}`
  }, {
    isSponsored: true,
    paymasterUrl: `https://api.pimlico.io/v2/sepolia/rpc?add_balance_override&apikey=${PIMLICO_API_KEY}`
  })
)
```

--------------------------------

### Logout User with Web3Auth

Source: https://docs.safe.global/sdk/signers/web3auth

This code demonstrates how to log out the currently authenticated user using the `logout()` method provided by the Web3Auth instance.

```javascript
await web3auth.logout()
```

--------------------------------

### execTransactionFromModuleReturnData Interface and Usage

Source: https://docs.safe.global/reference-smart-account/modules/execTransactionFromModuleReturnData

Defines the interface for `execTransactionFromModuleReturnData` and provides an example of its usage within a contract. It outlines the parameters required for executing a transaction from a Safe Module and returning its data.

```Solidity
interface ISafe {
    function execTransactionFromModuleReturnData(
        address to,
        uint256 value,
        bytes data,
        enum Enum.Operation operation
    ) external returns (bool success, bytes returnData);
}

contract Example {
    function example() … {
        (ISafe safe).execTransactionFromModuleReturnData(
            0x...,
            0,
            "0x...",
            Enum.Operation.Call
        );
    }
}
```

--------------------------------

### Get Modules

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Retrieves a list of all enabled modules for the Safe account. Modules provide extended functionality beyond the core Safe features.

```JavaScript
// const modules = await safeSdk.getModules()

```

--------------------------------

### Set Base Gas for Swap Transaction

Source: https://docs.safe.global/reference-sdk-protocol-kit/safe-info/createswapownertx

This example demonstrates setting the optional `baseGas` parameter for a swap owner transaction, which covers the gas costs for the data used to trigger the transaction.

```typescript
const safeTransaction = await protocolKit.createSwapOwnerTx(
  {
    oldOwnerAddress: '0x...',
    newOwnerAddress: '0x...'
  },
  {
    baseGas: '123'
  }
)

```

--------------------------------

### Deploy Safe using SafeFactory (v4)

Source: https://docs.safe.global/sdk/protocol-kit/guides/migrate-to-v5

This code snippet demonstrates the old method of deploying Safes using the SafeFactory class in Safe Protocol Kit v4. It initializes SafeFactory, defines Safe account configuration, deploys the Safe, and then logs its properties.

```typescript
import { SafeFactory, SafeAccountConfig } from '@safe-global/protocol-kit'  
  
const safeFactory = await SafeFactory.init({
   provider,
   signer,
   safeVersion // Optional
})
  
const safeAccountConfig: SafeAccountConfig = {
   owners: ['0x...', '0x...', '0x...'],
   threshold: 2
}
  
const protocolKit = await safeFactory.deploySafe({
  safeAccountConfig,
  saltNonce // Optional
})
  
// Confirm the Safe is deployed and fetch properties
console.log('Is Safe deployed:', await protocolKit.isSafeDeployed())
console.log('Safe Address:', await protocolKit.getAddress())
console.log('Safe Owners:', await protocolKit.getOwners())
console.log('Safe Threshold:', await protocolKit.getThreshold())
```

--------------------------------

### Get Safe Owners

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Retrieves a list of all owner addresses associated with the current Safe.

```javascript
const ownerAddresses = await protocolKit.getOwners()
```

--------------------------------

### Create Disable Module Transaction with GasToken Option

Source: https://docs.safe.global/reference-sdk-protocol-kit/safe-modules/createdisablemoduletx

Provides an example of setting the `gasToken` for a disable module transaction.

```TypeScript
const safeTransaction = await protocolKit.createDisableModuleTx(
  '0x...', 
  options: {
    gasToken: '0x...'
  }
)

```

--------------------------------

### Execute Safe Transaction with 'nonce' Option

Source: https://docs.safe.global/reference-sdk-protocol-kit/transactions/executetransaction

This example demonstrates executing a Safe transaction with a specified `nonce`. The nonce is crucial for ordering transactions from the same sender.

```TypeScript
const txResponse = await protocolKit.executeTransaction(
  safeTransaction,
  options: {
    nonce: 123
  }
)

```

--------------------------------

### Run Hardhat Tests

Source: https://docs.safe.global/advanced/smart-account-guards/smart-account-guard-tutorial

This command executes the test suite for the Hardhat project, ensuring the functionality of the Safe Guard contracts, including the NoDelegatecallGuard.

```bash
npx hardhat test

```

--------------------------------

### Sample Safe Balance Response

Source: https://docs.safe.global/core-api/transaction-service-reference/linea

Example JSON response for retrieving Safe balances, illustrating both native coin (e.g., Sepolia ETH) and ERC20 token formats.

```json
[  
  {
    "tokenAddress": null,  
    "token": null,  
    "balance": "9899990000000000"
  },
  {
    "tokenAddress": "0x0D5b70467E61125b242E70831aEd15D7C12E3F0D",  
    "token": {
      "name": "SampleToken",  
      "symbol": "ST",  
      "decimals": 18,  
      "logoUri": "https://safe-transaction-assets.safe.global/tokens/logos/0x0D5b70467E61125b242E70831aEd15D7C12E3F0D.png"
    },
    "balance": "10000000000000000000"
  }
]
```

--------------------------------

### Initialize SafeClient for New Safe - Safe SDK

Source: https://docs.safe.global/sdk/starter-kit/guides/send-transactions

Initializes the `SafeClient` for a new Safe account, configuring it with the provider, signer, and initial owners and threshold.

```javascript
const safeClient = await createSafeClient({
  provider: RPC_URL,
  signer: SIGNER_PRIVATE_KEY,
  safeOptions: {
    owners: [SIGNER_ADDRESS],
    threshold: 1
  }
})
```

--------------------------------

### Get Token List

Source: https://docs.safe.global/core-api/transaction-service-reference/worldchain

Retrieves a paginated list of supported tokens. Supports filtering by limit and offset.

```curl
curl -X GET https://api.safe.global/tx-service/wc/api/v1/tokens/lists/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY" \

```

--------------------------------

### Import Necessary Libraries and Types

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-detailed

Imports essential functions and types from the 'permissionless' and 'viem' libraries, including bundler actions, paymaster actions, and core blockchain interaction utilities.

```javascript
import { bundlerActions, getAccountNonce } from 'permissionless'
import { 
  pimlicoBundlerActions, 
  pimlicoPaymasterActions 
} from 'permissionless/actions/pimlico'
import { 
  Address, 
  Client, 
  Hash, 
  Hex, 
  PrivateKeyAccount, 
  createClient, 
  createPublicClient, 
  encodeFunctionData, 
  http 
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { gnosis } from 'viem/chains'
```

--------------------------------

### Define Signer and RPC URL - Safe SDK

Source: https://docs.safe.global/sdk/starter-kit/guides/send-user-operations

Sets up the necessary variables for creating a Safe client, including the signer's address, private key, and the RPC URL for the Sepolia testnet.

```typescript
const SIGNER_ADDRESS = // ...
const SIGNER_PRIVATE_KEY = // ...
const RPC_URL = 'https://rpc.ankr.com/eth_sepolia'
```

--------------------------------

### Get Safe Contract Version

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Returns the version of the Safe smart contract deployed. Helps in understanding compatibility and features.

```JavaScript
// const contractVersion = await safeSdk.getContractVersion()

```

--------------------------------

### Approve Transaction Hash with 'maxPriorityFeePerGas' option

Source: https://docs.safe.global/reference-sdk-protocol-kit/transaction-signatures/approvetransactionhash

Example of approving a Safe transaction hash while specifying the `maxPriorityFeePerGas` in the transaction options.

```typescript
const transactionResponse = await protocolKit.approveTransactionHash(
  '0x...',
  options: {
    maxPriorityFeePerGas: '123'
  }
)

```

--------------------------------

### Get Messages with Limit Configuration

Source: https://docs.safe.global/reference-sdk-api-kit/getmessages

Retrieves a specific number of messages for a Safe account by setting the limit parameter.

```typescript
const messagesResponse = await apiKit.getMessages(
  '0x...',
  {
    limit: 10
  }
)
```

--------------------------------

### getTransactionHash Function Usage

Source: https://docs.safe.global/reference-sdk-protocol-kit/transactions/gettransactionhash

This example shows the direct usage of the `getTransactionHash` function, taking a `safeTransaction` object as input to return its corresponding hash.

```TypeScript
const safeTransactionHash = await protocolKit.getTransactionHash(
  safeTransaction
)
```

--------------------------------

### Initialize Safe Protocol Kit and API Kit

Source: https://docs.safe.global/core-api/transaction-service-reference/base

This snippet demonstrates how to initialize the Safe Protocol Kit and Safe API Kit with necessary configurations like provider, signer, chain ID, and API key. It also shows how to create and sign a message, and add it to the API.

```TypeScript
import Safe from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'

const safeAddress = '0x5298a93734c3d979ef1f23f78ebb871879a21f22'

const protocolKit = await Safe.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  safeAddress
})

const apiKit = new SafeApiKit({
  chainId: 8453n,
  apiKey: 'YOUR_API_KEY'
})

const rawMessage = '1: string message'
const safeMessage = protocolKit.createMessage(rawMessage)
const signedMessage = await protocolKit.signMessage(safeMessage, 'eth_sign')

console.log({
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})

apiKit.addMessage(safeAddress, {
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})
```

--------------------------------

### Get Module Transaction

Source: https://docs.safe.global/core-api/transaction-service-reference/arbitrum

Retrieves a transaction executed from a module using its associated module transaction ID. This cURL command demonstrates how to make a GET request to the Safe API to fetch module transaction details.

```curl
curl -X GET https://api.safe.global/tx-service/arb1/api/v1/module-transaction/0x3b3b57b3 \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY" \
```

--------------------------------

### Initialize Bundler Client

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-detailed

Initializes the `bundlerClient` for interacting with Pimlico's Bundler methods via their API v1. This requires the Pimlico API key and extends the client with `bundlerActions` and `pimlicoBundlerActions`.

```typescript
const PIMLICO_API_V1 = `https://api.pimlico.io/v1/gnosis/rpc?add_balance_override&apikey=${PIMLICO_API_KEY}`  
const bundlerClient = createClient({
  transport: http(PIMLICO_API_V1),
  chain: gnosis
})
  .extend(bundlerActions(ENTRYPOINT_ADDRESS_V06))
  .extend(pimlicoBundlerActions(ENTRYPOINT_ADDRESS_V06))
```

--------------------------------

### Get Service Info using API Kit

Source: https://docs.safe.global/reference-sdk-api-kit/getserviceinfo

Retrieves the service's information and configuration using the apiKit. This method returns a Promise that resolves to SafeServiceInfoResponse.

```TypeScript
import { apiKit } from './setup.ts'

const serviceInfo = await apiKit.getServiceInfo()
```

--------------------------------

### Initialize Protocol Kit with Existing Safe

Source: https://docs.safe.global/reference-sdk-protocol-kit/initialization/init

Initializes the Protocol Kit with an existing Safe account using its address. This method requires a provider and a signer, and optionally accepts `isL1SafeSingleton` and `contractNetworks` for specific configurations.

```javascript
import Safe from '@safe-global/protocol-kit'

const protocolKit = await Safe.init({
  provider,
  signer,
  safeAddress: '0x...',
  isL1SafeSingleton: true, // Optional
  contractNetworks // Optional
})
```

--------------------------------

### Receive and Sign Transaction with Agent Two - JavaScript

Source: https://docs.safe.global/home/ai-agent-quickstarts/multi-agent-setup

Initializes a Safe instance with a different signer (Agent Two) to interact with an existing Smart Account. It retrieves pending transactions, allows for checks, and executes the transaction if the threshold is met.

```javascript
const SAFE_ADDRESS = '0x...' // The address of the Smart Account from step one

// Initialize the Safe object with the same address, but a different signer
const existingSafe = await Safe.init({
  provider: RPC_URL,
  signer: AGENT_2_PRIVATE_KEY,
  safeAddress: SAFE_ADDRESS
})

// Get pending transactions that need a signature
const pendingTransactions = await apiKit.getPendingTransactions(SAFE_ADDRESS)
// We assume there is only one pending transaction
const transaction = pendingTransactions.results[0]

// Here, your AI agent could check this transaction.

// As only one more signater is required, AI agent two can execute the transaction:
existingSafe.executeTransaction(transaction)
```

--------------------------------

### Approve Transaction Hash with 'maxFeePerGas' option

Source: https://docs.safe.global/reference-sdk-protocol-kit/transaction-signatures/approvetransactionhash

Example of approving a Safe transaction hash while specifying the `maxFeePerGas` in the transaction options.

```typescript
const transactionResponse = await protocolKit.approveTransactionHash(
  '0x...',
  options: {
    maxFeePerGas: '123'
  }
)

```

--------------------------------

### Initialize Viem Provider

Source: https://docs.safe.global/sdk/signers/passkeys

Initializes a wallet client provider using the viem library, configured for the Sepolia testnet and connected to an Ankr RPC endpoint.

```javascript
import { createWalletClient, http } from 'viem'
import { sepolia } from 'viem/chains

const provider = createWalletClient({
  chain: sepolia,
  transport: http('https://rpc.ankr.com/eth_sepolia')
})
const signer = passkey
```

--------------------------------

### Get All Safe Transactions

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis-chain

Retrieves all transactions associated with a given Safe address. This method is useful for getting a comprehensive list of all on-chain activities for a Safe. It requires the Safe's chain ID and an API key for authentication.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 100n,
  apiKey: 'YOUR_API_KEY'
})

const transactions = await apiKit.getAllTransactions(
  '0x5298a93734c3d979ef1f23f78ebb871879a21f22'
)

console.log(transactions)
```

--------------------------------

### Create Next.js App with pnpm

Source: https://docs.safe.global/home/passkeys-tutorials/safe-passkeys-tutorial

Initializes a new Next.js application using pnpm. It prompts the user to select TypeScript, ESLint, and App router, while opting out of other configurations like Tailwind CSS and a 'src' directory.

```bash
pnpm create next-app
```

--------------------------------

### Get All Safe Transactions

Source: https://docs.safe.global/core-api/transaction-service-reference/unichain

Retrieves all transactions associated with a Safe address. This method is useful for getting a comprehensive list of all on-chain activities for a Safe. It requires the Safe's address and optionally accepts an API key for authentication.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 130n,
  apiKey: 'YOUR_API_KEY'
})

const transactions = await apiKit.getAllTransactions(
  '0x5298a93734c3d979ef1f23f78ebb871879a21f22'
)

console.log(transactions)
```

--------------------------------

### Build Validator and Enable on Safe (Tutorial)

Source: https://docs.safe.global/resource-hub_page=2

This tutorial covers the creation of a basic 7579 validator module that can be installed into a Safe Account via the Safe 7579 adapter, enhancing the Safe Account's validation flow. It is relevant for 7579 topics.

--------------------------------

### Get Safe Address

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Retrieves the address of the current SafeProxy contract. This is a fundamental method for interacting with a Safe.

```javascript
const safeAddress = await protocolKit.getAddress()
```

--------------------------------

### Build Validator and Enable on Safe (Tutorial)

Source: https://docs.safe.global/resource-hub_page=3

This tutorial covers the creation of a basic 7579 validator module that can be installed into a Safe Account via the Safe 7579 adapter, enhancing the Safe Account's validation flow. It is relevant for 7579 topics.

--------------------------------

### Create passkeys.ts file

Source: https://docs.safe.global/home/passkeys-tutorials/safe-passkeys-tutorial

This bash command creates the 'passkeys.ts' file within the 'lib' directory. This file will contain the core logic for managing passkeys.

```bash
touch passkeys.ts
```

--------------------------------

### Download Mistral-Nemo Model with Ollama

Source: https://docs.safe.global/home/ai-agent-setup

Downloads the 'mistral-nemo' language model using the Ollama command-line interface. This model is used by the AI agent for processing and generating responses. Ensure Ollama is installed and running.

```shell
ollama pull mistral-nemo
```

--------------------------------

### Get Messages with Pagination and Ordering

Source: https://docs.safe.global/reference-sdk-api-kit/getmessages

Fetches a paginated list of messages for a given Safe address, with options to specify ordering, limit, and offset.

```typescript
import { GetSafeMessageListOptions } from '@safe-global/api-kit'
import { apiKit } from './setup.ts'

const safeAddress = '0x...'

const config: GetSafeMessageListOptions = {
  ordering: 'created', // Optional
  limit: '10', // Optional
  offset: '50' // Optional
}

const messagesResponse = await apiKit.getMessages(safeAddress, config)
```

--------------------------------

### Test NoDelegatecallGuard Contract Setup and Scenarios

Source: https://docs.safe.global/advanced/smart-account-guards/smart-account-guard-tutorial

This JavaScript code, using Hardhat and ethers.js, tests the NoDelegatecallGuard. It sets up Safe and NoDelegatecallGuard contracts, configures the guard, and asserts that delegatecalls are blocked while other calls proceed as expected. It also tests the ability to remove the guard.

```javascript
import { ethers } from "hardhat";
import { expect } from "chai";
import { Signer, ZeroAddress } from "ethers";
import { Safe, Safe__factory, SafeProxyFactory } from "../typechain-types";
import { execTransaction } from "./utils/utils";
import { NoDelegatecallGuard } from "../typechain-types/contracts/NoDelegatecallGuard";

describe("NoDelegatecallGuard", async function () {
  let deployer: Signer;
  let alice: Signer;
  let masterCopy: Safe;
  let proxyFactory: SafeProxyFactory;
  let safeFactory: Safe__factory;
  let safe: Safe;
  let exampleGuard: NoDelegatecallGuard;
  const threshold = 1;

  beforeEach(async () => {
    [deployer, alice] = await ethers.getSigners();

    safeFactory = await ethers.getContractFactory("Safe", deployer);
    masterCopy = await safeFactory.deploy();

    proxyFactory = await (
      await ethers.getContractFactory("SafeProxyFactory", deployer)
    ).deploy();

    const ownerAddresses = [await alice.getAddress()];

    const safeData = masterCopy.interface.encodeFunctionData("setup", [
      ownerAddresses,
      threshold,
      ZeroAddress,
      "0x",
      ZeroAddress,
      ZeroAddress,
      0,
      ZeroAddress,
    ]);

    const safeAddress = await proxyFactory.createProxyWithNonce.staticCall(
      await masterCopy.getAddress(),
      safeData,
      0n
    );

    await proxyFactory.createProxyWithNonce(
      await masterCopy.getAddress(),
      safeData,
      0n
    );

    if (safeAddress === ZeroAddress) {
      throw new Error("Safe address not found");
    }

    exampleGuard = await (
      await ethers.getContractFactory("NoDelegatecallGuard", deployer)
    ).deploy();

    safe = await ethers.getContractAt("Safe", safeAddress);

    const setGuardData = masterCopy.interface.encodeFunctionData("setGuard", [
      exampleGuard.target,
    ]);

    await execTransaction([alice], safe, safe.target, 0, setGuardData, 0);
  });

  it("Should not allow delegatecall", async function () {
    const wallets = [alice];

    await expect(
      execTransaction(wallets, safe, ZeroAddress, 0, "0x", 1)
    ).to.be.revertedWithCustomError(exampleGuard, "DelegatecallNotAllowed");
  });

  it("Should allow call", async function () {
    const wallets = [alice];

    expect(await execTransaction(wallets, safe, ZeroAddress, 0, "0x", 0));
  });

  it("Should allow to replace the guard", async function () {
    const wallets = [alice];

    const setGuardData = masterCopy.interface.encodeFunctionData("setGuard", [
      ZeroAddress,
    ]);
    expect(
      await execTransaction(
        wallets,
        safe,
        await safe.getAddress(),
        0,
        setGuardData,
        0
      )
    );
  });
});

```

--------------------------------

### Initialize React Native Project with Expo

Source: https://docs.safe.global/advanced/passkeys/tutorials/react-native

This snippet shows the command to create a new React Native project using Expo with a TypeScript template. It's the first step in setting up the development environment for the tutorial.

```bash
npx create-expo-app@latest --template blank-typescript
```

--------------------------------

### Initialize Viem Provider and Get Signer

Source: https://docs.safe.global/sdk/signers/privy

This snippet demonstrates how to initialize a Viem wallet client and obtain the user's signer address within a `useEffect` hook. It checks for authentication readiness and connected wallets before proceeding.

```javascript
import { createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'

useEffect(() => {
  const init = async () => {
    if (ready && authenticated && readyWallets && wallets.length > 0 ) {
      const ethereumProvider = await wallets[0].getEthereumProvider()

      const provider = createWalletClient({
        chain: sepolia,
        transport: custom(ethereumProvider)
      })

      const signer = wallets[0].address
    }
  }
  init()
}, [ready, authenticated, readyWallets, wallets])
```

--------------------------------

### Get Transaction Hash

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Calculates the hash of a Safe transaction. This hash is used for signing and verification purposes.

```JavaScript
// const transactionHash = await safeSdk.getTransactionHash(safeTx)

```

--------------------------------

### Initialize Safe Protocol Kit and API Kit, Sign and Add Message

Source: https://docs.safe.global/core-api/transaction-service-reference/bsc

This snippet demonstrates how to initialize the Safe Protocol Kit and Safe API Kit, create a message, sign it using 'eth_sign', and then add the signed message to the API. It includes setting up providers, signers, chain IDs, and API keys.

```TypeScript
import Safe from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'

const safeAddress = '0x5298a93734c3d979ef1f23f78ebb871879a21f22'

const protocolKit = await Safe.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  safeAddress
})

const apiKit = new SafeApiKit({
  chainId: 56n,
  apiKey: 'YOUR_API_KEY'
})

const rawMessage = '1: string message'
const safeMessage = protocolKit.createMessage(rawMessage)
const signedMessage = await protocolKit.signMessage(safeMessage, 'eth_sign')

console.log({
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})

apiKit.addMessage(safeAddress, {
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})
```

--------------------------------

### Set Safe Transaction Gas (TypeScript)

Source: https://docs.safe.global/reference-sdk-protocol-kit/safe-info/createremoveownertx

Provides an example of setting the `safeTxGas` for a transaction that removes an owner using the `createRemoveOwnerTx` function.

```TypeScript
const safeTransaction = await protocolKit.createRemoveOwnerTx(
  {
    ownerAddress: '0x...'
  },
  {
    safeTxGas: '123'
  }
)

```

--------------------------------

### AI Agent Interaction with Safe

Source: https://docs.safe.global/resource-hub_source=Safe+Team&tag=Tutorial

Set up and deploy an AI agent capable of interacting with your Safe and preparing transactions. This tutorial provides a step-by-step guide for integrating AI capabilities with Safe functionalities.

```Python
/*
  This section is a placeholder for Python code examples for AI agent interaction.
  It would involve using the Safe SDK to prepare and send transactions.
*/
console.log('AI Agent Safe Interaction Example');
```

--------------------------------

### Initialize Safe Smart Account and Client

Source: https://docs.safe.global/advanced/erc-7579/tutorials/7579-tutorial

This snippet initializes a Safe smart account using the provided public client and wallet client. It configures the account with owners, version, and specific module addresses. It then creates a smart account client, extending it with ERC7579 actions, and sets up fee estimation using the Pimlico client. Finally, it checks if a specific module is installed on the Safe account.

```typescript
const init = async () => {
  // The safe account is created using the public client:
  const safeAccount = await toSafeSmartAccount< 
    '0.7',
    '0xEBe001b3D534B9B6E2500FB78E67a1A137f561CE'
  >({
    client: publicClient,
    // @ts-expect-error The wallet client is set in the useEffect
    owners: [walletClient!],
    version: '1.4.1',
    // These modules are required for the 7579 functionality:
    safe4337ModuleAddress: '0x3Fdb5BC686e861480ef99A6E3FaAe03c0b9F32e2', // These are not meant to be used in production as of now.
    erc7579LaunchpadAddress: '0xEBe001b3D534B9B6E2500FB78E67a1A137f561CE' // These are not meant to be used in production as of now.
  })

  const isSafeDeployed = await safeAccount.isDeployed()

  setSafeAddress(safeAccount.address)
  setSafeIsDeployed(isSafeDeployed)

  // Finally, we create the smart account client, which provides functionality to interact with the smart account:
  const smartAccountClient = createSmartAccountClient({
    account: safeAccount,
    chain: sepolia,
    bundlerTransport: http(pimlicoUrl),
    paymaster: pimlicoClient,
    userOperation: {
      estimateFeesPerGas: async () => {
        return (await pimlicoClient.getUserOperationGasPrice()).fast
      }
    }
  }).extend(erc7579Actions())

  // Check whether the module has been installed already:
  const isModuleInstalled =
    isSafeDeployed &&
    (await smartAccountClient.isModuleInstalled({
      address: ownableExecutorModule,
      type: 'executor',
      context: '0x'
    }))

  setModuleIsInstalled(isModuleInstalled)

  // We store the clients in the state to use them in the following steps:
  setSafeAccount(safeAccount)
  setSmartAccountClient(smartAccountClient)

  console.log('setup done')
}
```

--------------------------------

### Safe Proxy Factory Creation

Source: https://docs.safe.global/advanced/smart-account-overview

The Safe Proxy Factory contract simplifies the creation of new proxy contracts. It allows for the creation of a proxy pointing to a singleton and the execution of a setup function in the newly deployed proxy within a single transaction.

```Solidity
contract SafeProxyFactory {
    // Logic for creating Safe proxies
}
```

--------------------------------

### Create utils Directory and constants.ts File

Source: https://docs.safe.global/home/passkeys-tutorials/safe-passkeys-nuxt

Creates a `utils` directory at the project root and then creates an empty `constants.ts` file within it. This sets up the structure for storing project constants.

```bash
mkdir utils
cd utils
touch constants.ts
```

--------------------------------

### Sample Safe Creation Status Response

Source: https://docs.safe.global/core-api/transaction-service-reference/optimism

Provides a sample JSON response for a successful Safe creation status query. It includes details like creation timestamp, creator address, transaction hash, factory address, master copy, setup data, decoded data, and user operation.

```JSON
{
  "created": "2024-06-25T11:18:48Z",
  "creator": "0xa6d3DEBAAB2B8093e69109f23A75501F864F74e2",
  "transactionHash": "0x6404e0298423c092cc1ce486f3f72172a1c0f2f28a9b29f69e605ea825360ac5",
  "factoryAddress": "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC",
  "masterCopy": "0xfb1bffC9d739B8D520DaF37dF666da4C687191EA",
  "setupData": "0xb63e800d0000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000017062a1de2fe6b99be3d9d37841fed19f5738040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000a6d3debaab2b8093e69109f23a75501f864f74e20000000000000000000000003a16e3090e32dded2250e862b9d5610bef13e93d0000000000000000000000000000000000000000000000000000000000000000",
  "dataDecoded": {
    "method": "setup",
    "parameters": [
      {
        "name": "_owners",
        "type": "address[]",
        "value": [
          "0xa6d3DEBAAB2B8093e69109f23A75501F864F74e2",
          "0x3A16E3090e32DDeD2250E862B9d5610BEF13e93d"
        ]
      },
      {
        "name": "_threshold",
        "type": "uint256",
        "value": "2"
      },
      {
        "name": "to",
        "type": "address",
        "value": "0x0000000000000000000000000000000000000000"
      },
      {
        "name": "data",
        "type": "bytes",
        "value": "0x"
      },
      {
        "name": "fallbackHandler",
        "type": "address",
        "value": "0x017062a1dE2FE6b99BE3d9d37841FeD19F573804"
      },
      {
        "name": "paymentToken",
        "type": "address",
        "value": "0x0000000000000000000000000000000000000000"
      },
      {
        "name": "payment",
        "type": "uint256",
        "value": "0"
      },
      {
        "name": "paymentReceiver",
        "type": "address",
        "value": "0x0000000000000000000000000000000000000000"
      }
    ]
  },
  "userOperation": null
}
```

--------------------------------

### Execute Safe Transaction with 'gasLimit' Option

Source: https://docs.safe.global/reference-sdk-protocol-kit/transactions/executetransaction

This example demonstrates executing a Safe transaction while specifying the `gasLimit` option. This allows control over the maximum gas the transaction can consume.

```TypeScript
const txResponse = await protocolKit.executeTransaction(
  safeTransaction,
  options: {
    gasLimit: '123'
  }
)

```

--------------------------------

### Get All Transactions for a Safe

Source: https://docs.safe.global/reference-sdk-api-kit/getalltransactions

Fetches all transactions associated with a specific Safe address. You can optionally specify `limit` and `offset` to control pagination.

```typescript
import { AllTransactionsOptions } from '@safe-global/api-kit'
import { apiKit } from './setup.ts'

const safeAddress = '0x...'

const options: AllTransactionsOptions = {
  limit: 10, // Optional: Maximum number of results to return per page
  offset: 0  // Optional: Initial index from which to return the results
}

const allTxs = await apiKit.getAllTransactions(
  safeAddress,
  options // Optional
)

```

```typescript
const allTxs = await apiKit.getAllTransactions('0x...')
```

```typescript
const allTxs = await apiKit.getAllTransactions(safeAddress, {
  limit: 10
})
```

```typescript
const allTxs = await apiKit.getAllTransactions(safeAddress, {
  offset: 20
})
```

--------------------------------

### Get Safe Message Hash

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Calculates the hash of a Safe message. This hash is what owners will sign to approve the message.

```JavaScript
// const messageHash = await safeSdk.getSafeMessageHash(safeMessage)

```

--------------------------------

### Initialize Safe Protocol Kit and API Kit

Source: https://docs.safe.global/core-api/transaction-service-reference/worldchain

Demonstrates how to initialize the Safe Protocol Kit with provider and signer details, and the Safe API Kit with chain ID and API key. It also shows how to create, sign, and add a message to the Safe.

```TypeScript
import Safe from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'

const safeAddress = '0x5298a93734c3d979ef1f23f78ebb871879a21f22'

const protocolKit = await Safe.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  safeAddress
})

const apiKit = new SafeApiKit({
  chainId: 480n,
  apiKey: 'YOUR_API_KEY'
})

const rawMessage = '1: string message'
const safeMessage = protocolKit.createMessage(rawMessage)
const signedMessage = await protocolKit.signMessage(safeMessage, 'eth_sign')

console.log({
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})

apiKit.addMessage(safeAddress, {
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})
```

--------------------------------

### Get Safe Balance

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Fetches the balance of native currency (e.g., ETH) for the Safe account. Requires the Safe API Kit.

```JavaScript
// const safeBalance = await safeSdk.getBalance()

```

--------------------------------

### Get Owners

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Retrieves the list of current owner addresses for the Safe account. This is essential for understanding who can approve transactions.

```JavaScript
// const owners = await safeSdk.getOwners()

```

--------------------------------

### Create Safe Deployment Transaction

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Generates the transaction data required to deploy a new Safe. This includes setting up owners, threshold, and other configurations.

```JavaScript
// const safeDeploymentTx = await safeSdk.createSafeDeploymentTransaction({
//   safeAccountConfig: {
//     owners: [
//       '0x...
//     ],
//     threshold: 1
//   },
//   // chainId: '0x1',
//   // safeVersion: '1.3.0'
// })

```

--------------------------------

### Get Owners Who Approved Transaction

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Fetches a list of owners who have approved a specific Safe transaction, identified by its hash.

```javascript
const transactions = [{
  // ...
}]
const safeTransaction = await protocolKit.createTransaction({ transactions })
const txHash = await protocolKit.getTransactionHash(safeTransaction)
const ownerAddresses = await protocolKit.getOwnersWhoApprovedTx(txHash)
```

--------------------------------

### Initialize Safe Protocol Kit and API Kit (TypeScript)

Source: https://docs.safe.global/core-api/transaction-service-reference/xlayer

Demonstrates how to initialize the Safe Protocol Kit and API Kit in TypeScript. This involves setting up the provider, signer, and Safe address for the protocol kit, and the chain ID and API key for the API kit. It also shows how to create, sign, and add a message.

```TypeScript
import Safe from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'

const safeAddress = '0x5298a93734c3d979ef1f23f78ebb871879a21f22'

const protocolKit = await Safe.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  safeAddress
})

const apiKit = new SafeApiKit({
  chainId: 196n,
  apiKey: 'YOUR_API_KEY'
})

const rawMessage = '1: string message'
const safeMessage = protocolKit.createMessage(rawMessage)
const signedMessage = await protocolKit.signMessage(safeMessage, 'eth_sign')

console.log({
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})

apiKit.addMessage(safeAddress, {
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})
```

--------------------------------

### Specify Old Owner Address for Swap

Source: https://docs.safe.global/reference-sdk-protocol-kit/safe-info/createswapownertx

This example shows how to specify the `oldOwnerAddress` parameter when creating a swap owner transaction. This is a required parameter for the `createSwapOwnerTx` function.

```typescript
const safeTransaction = await protocolKit.createSwapOwnerTx({
  oldOwnerAddress: '0x...',
  newOwnerAddress: '0x...'
})

```

--------------------------------

### Initialize Pimlico Paymaster Client

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-detailed

Initializes the `pimlicoPaymasterClient` for interacting with Pimlico's Verifying Paymaster endpoint via API v2. This client is responsible for requesting sponsorship and requires the Pimlico API key and `pimlicoPaymasterActions`.

```typescript
const PIMLICO_API_V2 = `https://api.pimlico.io/v2/gnosis/rpc?add_balance_override&apikey=${PIMLICO_API_KEY}`  
const pimlicoPaymasterClient = createClient({
  transport: http(PIMLICO_API_V2),
  chain: gnosis
}).extend(pimlicoPaymasterActions(ENTRYPOINT_ADDRESS_V06))
```

--------------------------------

### Get Specific Token Information

Source: https://docs.safe.global/core-api/transaction-service-reference/aurora

Retrieves detailed information for a specific token using its address. This includes the token's type, name, symbol, decimals, logo URI, and trusted status. It's useful for getting precise details about a single token.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 1313161554n,
  apiKey: 'YOUR_API_KEY'
})

const token = await apiKit.getToken(
  '0x687e43D0aB3248bDfebFE3E8f9F1AB2B9FcE982d'
)

console.log(token)
```

--------------------------------

### Get Safe Nonce

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Retrieves the current nonce for the Safe. The nonce is crucial for transaction ordering and preventing replay attacks.

```javascript
const nonce = await protocolKit.getNonce()
```

--------------------------------

### Send Safe Operation with Validity Period

Source: https://docs.safe.global/reference-sdk-starter-kit/safe-operations/sendsafeoperation

Provides an example of setting the validity period for a Safe operation using validAfter and validUntil timestamps.

```typescript
const safeOperationResult = await safeOperationsClient.sendSafeOperation({
  transactions,
  validAfter: Number(timestamp - 60_000n)
})
```

```typescript
const safeOperationResult = await safeOperationsClient.sendSafeOperation({
  transactions,
  validUntil: Number(timestamp + 60_000n)
})
```

--------------------------------

### Create SafeClient Instance

Source: https://docs.safe.global/reference-sdk-starter-kit/safe-client/constructor

Initializes a SafeClient instance to manage Safe accounts and transactions. Requires a provider and signer, with optional parameters for an existing Safe address, API key, and transaction service URL.

```javascript
import { createSafeClient } from '@safe-global/sdk-starter-kit'

const safeClient = await createSafeClient({
  provider,
  signer,
  safeAddress: '0x...',
  apiKey: 'YOUR_API_KEY', // Necessary for Safe API interactions
  txServiceUrl = 'https://...' // Optional. Use it if you run your own service
})
```

--------------------------------

### Create Signer Instance

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-detailed

Creates a signer instance using a private key. This signer will own the Safe account after deployment. It requires a private key and the `privateKeyToAccount` function.

```typescript
const PRIVATE_KEY = '0x...'  
const signer = privateKeyToAccount(PRIVATE_KEY as Hash)
```

--------------------------------

### Get Safe Address

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Retrieves the address of the Safe account. This is a fundamental piece of information needed for many operations.

```JavaScript
// const safeAddress = await safeSdk.getSafeAddress()

```

--------------------------------

### Initialize Safe Protocol Kit

Source: https://docs.safe.global/sdk/protocol-kit/guides/execute-transactions

Initializes the Safe Protocol Kit instance using a provider, signer's private key, and the Safe account address. Optionally enables on-chain analytics.

```javascript
const protocolKitOwner1 = await Safe.init({
  provider: RPC_URL,
  signer: OWNER_1_PRIVATE_KEY,
  safeAddress: SAFE_ADDRESS,
  onchainAnalytics // Optional
})
```

--------------------------------

### Get Safe Operation

Source: https://docs.safe.global/core-api/transaction-service-reference/chiado

Retrieves a SafeOperation based on its unique hash. This endpoint is used to get details about a specific Safe operation, including creation and modification timestamps, validity periods, module address, confirmations, prepared signature, and user operation details.

```cURL
GET /tx-service/chi/api/v1/safe-operations/{safe_operation_hash}/
```

--------------------------------

### Connect Web3Auth Provider

Source: https://docs.safe.global/sdk/signers/web3auth

Initiates the connection process with Web3Auth, allowing users to log in via email or social accounts. This method returns the Web3Auth provider instance upon successful authentication.

```javascript
const web3authProvider = await web3auth.connect()
```

--------------------------------

### Initialize Web3Auth Client ID

Source: https://docs.safe.global/sdk/signers/web3auth

Defines the Web3Auth Client ID, which is obtained from the Web3Auth dashboard. This variable is crucial for authenticating and initializing the Web3Auth service.

```javascript
const WEB3AUTH_CLIENT_ID = // ...
```

--------------------------------

### Instantiate Protocol and Relay Kits

Source: https://docs.safe.global/sdk/relay-kit/guides/gelato-relay

Initializes the Safe Protocol Kit with provider and signer details, and the Gelato Relay Kit for relaying transactions.

```typescript
const protocolKit = await Safe.init({
  provider: RPC_URL,
  signer: OWNER_PRIVATE_KEY,
  safeAddress
})

const relayKit = new GelatoRelayPack({ protocolKit })
```

--------------------------------

### Initialize Safe4337Pack for New Safe Account

Source: https://docs.safe.global/sdk/relay-kit/guides/4337-safe-sdk

Initializes the Safe4337Pack to deploy a new Safe account. Requires provider, signer, bundlerUrl, and optionally owners, threshold, and onchainAnalytics. The safeModulesVersion can be set to '0.3.0' for Entrypoint v0.7.

```javascript
const safe4337Pack = await Safe4337Pack.init({
  provider: RPC_URL,
  signer: SIGNER_PRIVATE_KEY,
  bundlerUrl: `https://api.pimlico.io/v2/11155111/rpc?add_balance_override&apikey=${PIMLICO_API_KEY}`,
  // safeModulesVersion: '0.3.0', // Defaults to 0.2.0. If you are using the v0.7 of the Entrypoint set the value to '0.3.0'
  options: {
    owners: [SIGNER_ADDRESS],
    threshold: 1
  },
  onchainAnalytics // Optional
  // ...
})
```

--------------------------------

### Get Specific Transfer by ID

Source: https://docs.safe.global/core-api/transaction-service-reference/worldchain

Retrieves details for a single transfer using its unique transfer ID. This endpoint is useful for getting specific transaction information, including token details if it was a token transfer. The transfer ID can be calculated based on transaction hash and log index.

```HTTP
GET /tx-service/wc/api/v1/transfer/{transfer_id}/
```

```JSON
{
  "type": "ETHER_TRANSFER",
  "executionDate": "2024-07-24T20:54:48Z",
  "blockNumber": 6369595,
  "transactionHash": "0x4c8bc3a9f32eed6b4cb8225d6884e9c7006d6740b0a6896cee7b254aa037920e",
  "to": "0x3A16E3090e32DDeD2250E862B9d5610BEF13e93d",
  "value": "10000000000",
  "tokenId": null,
  "tokenAddress": null,
  "transferId": "i4c8bc3a9f32eed6b4cb8225d6884e9c7006d6740b0a6896cee7b254aa037920e0,0,0",
  "tokenInfo": null,
  "from": "0x5298A93734C3D979eF1f23F78eBB871879A21F22"
}
```

--------------------------------

### Get Safe Message Hash with Provided Hash

Source: https://docs.safe.global/reference-sdk-protocol-kit/messages/getsafemessagehash

Illustrates the usage of the `protocolKit.getSafeMessageHash` method by providing a pre-computed message hash as a string argument.

```TypeScript
const safeMessageHash = await protocolKit.getSafeMessageHash(
  '0x...'
)
```

--------------------------------

### Get Safe Operation Confirmations without Pagination

Source: https://docs.safe.global/reference-sdk-api-kit/getsafeoperationconfirmations

Demonstrates the basic usage of `getSafeOperationConfirmations` by providing only the required `safeOperationHash`. This will fetch confirmations without any pagination constraints.

```typescript
const confirmationsResponse = await apiKit.getSafeOperationConfirmations(
  '0x...'
)
```

--------------------------------

### Set Gas Token for Swap Transaction

Source: https://docs.safe.global/reference-sdk-protocol-kit/safe-info/createswapownertx

This example illustrates setting the optional `gasToken` parameter for a swap owner transaction, specifying the token address for gas payment or `0x0000000000000000000000000000000000000000` if no payment is made.

```typescript
const safeTransaction = await protocolKit.createSwapOwnerTx(
  {
    oldOwnerAddress: '0x...',
    newOwnerAddress: '0x...'
  },
  {
    gasToken: '0x...'
  }
)

```

--------------------------------

### Protocol Kit: Manage Safe Smart Accounts

Source: https://docs.safe.global/sdk/overview

The Protocol Kit facilitates interaction with Safe Smart Accounts, enabling the creation of new accounts, configuration updates, and transaction signing/execution. It emphasizes modularity, customizability, and battle-tested security for transaction batching.

```javascript
import { ProtocolKit } from '@safe-global/protocol-kit';

// Example usage (conceptual):
const protocolKit = new ProtocolKit({
  // ... configuration options
});

// Create a new Safe account
const safeConfig = {
  owners: ['0x...'],
  threshold: 1,
};
const safeAddress = await protocolKit.createSafe(safeConfig);

// Sign and execute transactions
// ... (details depend on transaction type)
```

--------------------------------

### Create and Use Safe Account with permissionless.js

Source: https://docs.safe.global/resource-hub_page=2

This guide explains how to create and use a Safe account using the permissionless.js library. It is a tutorial for developers looking to integrate Safe accounts into their dApps.

```JavaScript
// Example usage of permissionless.js for Safe account creation
// This is a placeholder and would require actual library integration
// import { SafeSmartContractAccount } from "permissionless/accounts";
// import { signer } from "ethers";

// async function createSafeAccount(signer) {
//   const safeAccount = await SafeSmartContractAccount.fromDefaults({
//     signer: signer,
//     // other configuration options
//   });
//   return safeAccount;
// }
```

--------------------------------

### Get Safe ETH Balance

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Returns the ETH balance of the specified Safe. This is useful for checking the funds held by a Safe.

```javascript
const balance = await protocolKit.getBalance()
```

--------------------------------

### Set Gas Price for Swap Transaction

Source: https://docs.safe.global/reference-sdk-protocol-kit/safe-info/createswapownertx

This example shows how to set the optional `gasPrice` parameter when creating a swap owner transaction, indicating the price the sender is willing to pay per unit of gas.

```typescript
const safeTransaction = await protocolKit.createSwapOwnerTx(
  {
    oldOwnerAddress: '0x...',
    newOwnerAddress: '0x...'
  },
  {
    gasPrice: '123'
  }
)

```

--------------------------------

### Configure Contract Addresses with contractNetworks

Source: https://docs.safe.global/reference-sdk-protocol-kit/initialization/init

Initializes the Safe SDK with custom contract addresses for various Safe components on a specific network. This is required if the Safe contracts are not deployed on the current network. It includes addresses for the singleton, proxy factory, multi-send, and other utilities, along with optional ABIs for web3.js.

```javascript
const protocolKit = await Safe.init({
  provider,
  signer,
  safeAddress,
  contractNetworks: {
    [chainId]: {
      safeSingletonAddress: '<SINGLETON_ADDRESS>',
      safeProxyFactoryAddress: '<PROXY_FACTORY_ADDRESS>',
      multiSendAddress: '<MULTI_SEND_ADDRESS>',
      multiSendCallOnlyAddress: '<MULTI_SEND_CALL_ONLY_ADDRESS>',
      fallbackHandlerAddress: '<FALLBACK_HANDLER_ADDRESS>',
      signMessageLibAddress: '<SIGN_MESSAGE_LIB_ADDRESS>',
      createCallAddress: '<CREATE_CALL_ADDRESS>',
      simulateTxAccessorAddress: '<SIMULATE_TX_ACCESSOR_ADDRESS>',
      safeWebAuthnSignerFactoryAddress:'<SAFE_WEB_AUTHN_SIGNER_FACTORY_ADDRESS>',
      safeSingletonAbi: '<SINGLETON_ABI>',
      safeProxyFactoryAbi: '<PROXY_FACTORY_ABI>',
      multiSendAbi: '<MULTI_SEND_ABI>',
      multiSendCallOnlyAbi: '<MULTI_SEND_CALL_ONLY_ABI>',
      fallbackHandlerAbi: '<FALLBACK_HANDLER_ABI>',
      signMessageLibAbi: '<SIGN_MESSAGE_LIB_ABI>',
      createCallAbi: '<CREATE_CALL_ABI>',
      simulateTxAccessorAbi: '<SIMULATE_TX_ACCESSOR_ABI>'
      safeWebAuthnSignerFactoryAbi: '<SAFE_WEB_AUTHN_SIGNER_FACTORY_ABI>'
    }
  }
})
```

--------------------------------

### Sample Response for Confirmations

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis

Example JSON response when retrieving confirmations for a Safe operation. It includes the total count, null values for next/previous pages, and a list of confirmations, each detailing the owner, signature, and timestamps.

```JSON
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "created": "2024-07-22T10:00:18.898708Z",
      "modified": "2024-07-22T10:00:18.898708Z",
      "owner": "0x608Cf2e3412c6BDA14E6D8A0a7D27c4240FeD6F1",
      "signature": "0x000000000000000000000000608cf2e3412c6bda14e6d8a0a7d27c4240fed6f10000000000000000000000000000000000000000000000000000000000000041000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e053c4ce48756bae15e3454ad75ee8d4ba9764ea37ed561b216701c3630c0521774f94a8b7351780daa4a241792f52089af776e0898185318053201a92865b08d0000000000000000000000000000000000000000000000000000000000000002549960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97631d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034226f726967696e223a22687474703a2f2f6c6f63616c686f73743a33303030222c2263726f73734f726967696e223a66616c736500000000000000000000001f",
      "signatureType": "CONTRACT_SIGNATURE"
    }
  ]
}
```

--------------------------------

### Get Incoming Transactions with Options

Source: https://docs.safe.global/reference-sdk-api-kit/getincomingtransactions

Fetches the history of incoming transactions for a specified Safe address, including optional parameters for filtering by sender and pagination.

```typescript
import { apiKit } from './setup.ts'

const safeAddress = '0x...'

const options = {
  _from: '0x...',
  limit: 10,
  offset: 10
}

const incomingTxs = await apiKit.getIncomingTransactions(safeAddress, options)
```

--------------------------------

### Get Safe Address using SafeClient

Source: https://docs.safe.global/reference-sdk-starter-kit/safe-client/getaddress

This snippet demonstrates how to use the `getAddress` method from the `safeClient` object to retrieve the Safe's address. It assumes `safeClient` has been initialized in a `setup.ts` file.

```TypeScript
import { safeClient } from './setup.ts'

const safeAddress = await safeClient.getAddress()
```

--------------------------------

### Get Specific Token Information

Source: https://docs.safe.global/core-api/transaction-service-reference/avalanche

Retrieves detailed information for a single, specified token using its address. This endpoint is useful for getting specific details about a token's properties. The response includes the token's type, address, name, symbol, decimals, logo URI, and trusted status.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 43114n,
  apiKey: 'YOUR_API_KEY'
})

const token = await apiKit.getToken(
  '0x687e43D0aB3248bDfebFE3E8f9F1AB2B9FcE982d'
)

console.log(token)
```

--------------------------------

### Deploy Safe with SaltNonce (Protocol Kit v1)

Source: https://docs.safe.global/sdk/protocol-kit/guides/migrate-to-v1

Illustrates the updated method for deploying a Safe with a custom saltNonce in Protocol Kit v1. The `safeDeploymentConfig` object has been simplified, and `saltNonce` is now passed directly as a parameter.

```typescript
// old
const safeAccountConfig: SafeAccountConfig = { ... }
const safeDeploymentConfig: SafeDeploymentConfig = { saltNonce }
const safeSdk = await safeFactory.deploySafe({ safeAccountConfig, safeDeploymentConfig })

// new
const safeAccountConfig: SafeAccountConfig = { ... }
const saltNonce = '<YOUR_CUSTOM_VALUE>'
const protocolKit = await safeFactory.deploySafe({ safeAccountConfig, saltNonce })
```

--------------------------------

### Initialize Safe4337Pack and Get User Operation

Source: https://docs.safe.global/core-api/transaction-service-reference/ink

This TypeScript code demonstrates how to initialize the Safe4337Pack with provider, signer, bundler URL, and Safe address. It then retrieves a user operation by its hash and logs the result to the console.

```TypeScript
import { Safe4337Pack } from '@safe-global/relay-kit'  

const safe4337Pack = await Safe4337Pack.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  bundlerUrl: `https://api.pimlico.io/v1/sepolia/rpc?add_balance_override&apikey=${PIMLICO_API_KEY}`,
  options: {
    safeAddress: '0x97566B1eCaCd321736F183117C26ACe1b72F4a1b'
  }
})

const userOperationHash =
  '0x7bf502ad622e62823c971d800033e82e5670fcdd1c19437555fb2d8b7eefd644'

const userOperation = await safe4337Pack.getUserOperationByHash(
  userOperationHash
)

console.log(userOperation)
```

--------------------------------

### Add Safe Operation with UserOperation Nonce

Source: https://docs.safe.global/reference-sdk-api-kit/addsafeoperation

Shows an example of setting the `nonce` property within the `userOperation` object for the `addSafeOperation` method. This is crucial for transaction ordering and preventing replay attacks.

```typescript
await apiKit.addSafeOperation({
  entryPoint: '0x...',
  moduleAddress: '0x...',
  safeAddress: '0x...',
  userOperation: {
    sender: '0x...',
    nonce: '10',
    initCode: '0x...',
    callData: '0x...',
    callGasLimit: 123n,
    verificationGasLimit: 123n,
    preVerificationGas: 123n,
    maxFeePerGas: 123n,
    maxPriorityFeePerGas: 123n,
    paymasterAndData: '0x...',
    signature: '0x...'
  }
})
```

--------------------------------

### Estimate Gas Costs for Multisig Transaction (cURL)

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis

Provides a cURL example for estimating gas costs for a multisig transaction on Ethereum Sepolia.

```curl
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{ "to": "0x5298a93734c3d979ef1f23f78ebb871879a21f22", "value": "0", "data": "0x", "operation": 0 }' \
  https://safe-transaction-sepolia.safe.global/api/v1/safes/0x5298a93734c3d979ef1f23f78ebb871879a21f22/validate-transaction/
```

--------------------------------

### Get Message

Source: https://docs.safe.global/core-api/transaction-service-reference/sonic

Retrieves detailed information about a specific message using its message hash. Requires the Safe API Kit initialization.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 146n,
  apiKey: 'YOUR_API_KEY'
})

const messageHash =
  '0x950cfe6090e742b709ab5f662c10c8b4e06d403a2f8c4654d86af45d93fa3777'

const message = await apiKit.getMessage(messageHash)

console.log(message)
```

--------------------------------

### Solidity: Use checkNSignatures

Source: https://docs.safe.global/reference-smart-account/signatures/checkNSignatures

Demonstrates how to use the `checkNSignatures` function within a Solidity contract. It shows the necessary interface and how to call the function with example parameters.

```Solidity
interface ISafe {
    function checkNSignatures(
        address executor,
        bytes32 dataHash,
        bytes signatures,
        uint256 requiredSignatures
    ) external view;
}

contract Example {
    function example() ... {
        (ISafe safe).checkNSignatures(
            0x...,
            "0x...",
            "0x...",
            1
        );
    }
}
```

--------------------------------

### Initialize Safe Protocol Kit and API Kit

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis-chain

This snippet demonstrates how to initialize the Safe Protocol Kit with provider and signer details, and the Safe API Kit with chain ID and API key. It also shows how to create and sign a message, and then add it to the API.

```TypeScript
import Safe from '@safe-global/protocol-kit'  
import SafeApiKit from '@safe-global/api-kit'  

const safeAddress = '0x5298a93734c3d979ef1f23f78ebb871879a21f22'  

const protocolKit = await Safe.init({  
  provider: 'https://eth-sepolia.public.blastapi.io',  
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',  
  safeAddress  
})  

const apiKit = new SafeApiKit({  
  chainId: 100n,  
  apiKey: 'YOUR_API_KEY'  
})  

const rawMessage = '1: string message'  
const safeMessage = protocolKit.createMessage(rawMessage)  
const signedMessage = await protocolKit.signMessage(safeMessage, 'eth_sign')  

console.log({  
  message: rawMessage,  
  signature: signedMessage.encodedSignatures()  
})  

apiKit.addMessage(safeAddress, {  
  message: rawMessage,  
  signature: signedMessage.encodedSignatures()  
})
```

--------------------------------

### Initialize Safe Protocol Kit and API Kit with TypeScript

Source: https://docs.safe.global/core-api/transaction-service-reference/optimism

This snippet demonstrates how to initialize the Safe Protocol Kit and API Kit in TypeScript. It includes setting up the provider, signer, safe address, chain ID, and API key. It also shows how to create and sign a message, and add it to the API.

```TypeScript
import Safe from '@safe-global/protocol-kit'  
import SafeApiKit from '@safe-global/api-kit'  

const safeAddress = '0x5298a93734c3d979ef1f23f78ebb871879a21f22'  

const protocolKit = await Safe.init({
  provider: 'https://eth-sepolia.public.blastapi.io',  
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  safeAddress
})

const apiKit = new SafeApiKit({
  chainId: 10n,
  apiKey: 'YOUR_API_KEY'
})

const rawMessage = '1: string message'
const safeMessage = protocolKit.createMessage(rawMessage)
const signedMessage = await protocolKit.signMessage(safeMessage, 'eth_sign')

console.log({
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})

apiKit.addMessage(safeAddress, {
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})
```

--------------------------------

### Get Message

Source: https://docs.safe.global/core-api/transaction-service-reference/zksync

Retrieves detailed information about a message using its hash. Requires Safe API Kit, chainId, apiKey, and the messageHash.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 324n,
  apiKey: 'YOUR_API_KEY'
})

const messageHash =
  '0x950cfe6090e742b709ab5f662c10c8b4e06d403a2f8c4654d86af45d93fa3777'

const message = await apiKit.getMessage(messageHash)

console.log(message)
```

--------------------------------

### Get Module Transactions with Options

Source: https://docs.safe.global/reference-sdk-api-kit/getmoduletransactions

Fetches module transactions for a given Safe address, including optional filtering by module and pagination parameters.

```typescript
import { apiKit } from './setup.ts'

const safeAddress = '0x...'
const options = {
  module: '0x...',
  limit: 10,
  offset: 10
}

const moduleTxs = await apiKit.getModuleTransactions(safeAddress, options)
```

--------------------------------

### Initialize SafeServiceClient (Old) vs SafeApiKit (New)

Source: https://docs.safe.global/sdk/api-kit/guides/migrate-to-v1

Demonstrates the change in initialization from SafeServiceClient to SafeApiKit, updating the import and constructor for the API Kit.

```javascript
import SafeServiceClient from '@safe-global/safe-service-client'

const safeService = new SafeServiceClient({
  txServiceUrl: 'https://your-transaction-service-url',
  ethAdapter
})
```

```javascript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  txServiceUrl: 'https://your-transaction-service-url',
  ethAdapter
})
```

--------------------------------

### Get Safe Nonce

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Retrieves the current nonce for the Safe account. The nonce is crucial for transaction ordering and preventing replay attacks.

```JavaScript
// const nonce = await safeSdk.getNonce()

```

--------------------------------

### Remove Owner by Address (TypeScript)

Source: https://docs.safe.global/reference-sdk-protocol-kit/safe-info/createremoveownertx

Shows a basic example of removing an owner from a Safe by specifying the owner's address using the `createRemoveOwnerTx` function.

```TypeScript
const safeTransaction = await protocolKit.createRemoveOwnerTx({
  ownerAddress: '0x...'
})

```

--------------------------------

### Get Safe Threshold

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Retrieves the current owner threshold required for executing Safe transactions.

```javascript
const threshold = await protocolKit.getThreshold()
```

--------------------------------

### GelatoRelayPack Constructor Update

Source: https://docs.safe.global/sdk/relay-kit/guides/migrate-to-v2

The GelatoRelayPack constructor in the Safe SDK's Relay Kit now requires a 'protocolKit' parameter. This parameter is mandatory for any new pack that extends the 'RelayKitBasePack'.

```TypeScript
constructor({ apiKey, protocolKit }: GelatoOptions)
```

--------------------------------

### Get Safe Creation Info

Source: https://docs.safe.global/reference-sdk-api-kit/getsafecreationinfo

Retrieves the creation information for a given Safe address using the API Kit. This function requires the Safe's address as input and returns a Promise that resolves to `SafeCreationInfoResponse`.

```TypeScript
import { apiKit } from './setup.ts'

const safeAddress = '0x...'

const safeCreationInfo = await apiKit.getSafeCreationInfo(
  safeAddress
)
```

```TypeScript
const safeCreationInfo = await apiKit.getSafeCreationInfo(
  '0x...'
)
```

--------------------------------

### Add Message with Signature (Simplified) - TypeScript

Source: https://docs.safe.global/reference-sdk-api-kit/addmessage

A simplified example of calling the `addMessage` function, directly passing the safe address and a configuration object containing the message and its signature.

```TypeScript
await apiKit.addMessage(
  '0x...',
  {
    message: '0x...',
    signature: '0x...'
  }
)
```

--------------------------------

### Set Safe Transaction Gas for Swap

Source: https://docs.safe.global/reference-sdk-protocol-kit/safe-info/createswapownertx

This example shows how to set the optional `safeTxGas` parameter when creating a swap owner transaction, specifying the gas to be used for the Safe transaction.

```typescript
const safeTransaction = await protocolKit.createSwapOwnerTx(
  {
    oldOwnerAddress: '0x...',
    newOwnerAddress: '0x...'
  },
  {
    safeTxGas: '123'
  }
)

```

--------------------------------

### Get Safe Operation Confirmations with Pagination

Source: https://docs.safe.global/reference-sdk-api-kit/getsafeoperationconfirmations

Retrieves a paginated list of confirmations for a specific Safe operation using the `apiKit`. It demonstrates how to pass the `safeOperationHash` and an optional `config` object with `limit` and `offset` parameters.

```typescript
import { ListOptions } from '@safe-global/api-kit'
import { apiKit } from './setup.ts'

const safeOperationHash = '0x...'

const config: ListOptions = {
  limit: '3', // Optional
  offset: '2' // Optional
}

const confirmationsResponse = await apiKit.getSafeOperationConfirmations(
  safeOperationHash,
  config
)
```

--------------------------------

### Build React App with Safe and Passkeys

Source: https://docs.safe.global/resource-hub

This tutorial teaches you how to create a React application for using passkeys with your Safe. It covers creating, storing, and securely using passkeys and their interaction with a Safe.

```English
This tutorial will teach you to create a React app for using passkeys in your Safe. You will learn how to use passkeys (create, store, and use them securely) and how they can interact with a Safe.
```

--------------------------------

### Create Disable Module Transaction with Module Address

Source: https://docs.safe.global/reference-sdk-protocol-kit/safe-modules/createdisablemoduletx

A basic example of creating a disable module transaction using only the required module address.

```TypeScript
const safeTransaction = await protocolKit.createDisableModuleTx(
  '0x...'
)

```

--------------------------------

### Run Safe Migration Script (npm commands)

Source: https://docs.safe.global/advanced/smart-account-migration

These commands demonstrate how to run the Safe migration script for different scenarios, including L1 and L2 migrations, with and without a fallback handler.

```bash
npm run migrate:L1
```

```bash
npm run migrate:L2
```

```bash
npm run migrate:L1:withFH
```

```bash
npm run migrate:L2:withFH
```

--------------------------------

### Propose Transaction - Safe Tx Gas Parameter

Source: https://docs.safe.global/reference-sdk-api-kit/proposetransaction

Example demonstrating the `safeTxGas` parameter, which specifies the gas to be used for the Safe transaction. This is crucial for transaction execution.

```TypeScript
await apiKit.proposeTransaction({
  safeAddress: '0x...',
  safeTxHash: '0x...',
  safeTransactionData: {
    operation: OperationType.Call,
    safeTxGas: '0x...',
    baseGas: '123',
    gasPrice: '123',
    gasToken: '0x...',
    refundReceiver: '0x...',
    nonce: '10'
  },
  senderAddress: '0x...',
  senderSignature: '0x...'
})
```

--------------------------------

### Get SignMessageLib Contract

Source: https://docs.safe.global/sdk/protocol-kit/guides/signatures/messages

Retrieves the SignMessageLib contract instance for a specific Safe version. This is a prerequisite for interacting with on-chain message storage functionalities.

```JavaScript
const signMessageLibContract = await getSignMessageLibContract({
  safeVersion: '1.4.1'
})
```

--------------------------------

### Define Signer and RPC URL

Source: https://docs.safe.global/advanced/erc-4337/guides/safe-sdk

Sets up the necessary variables for a signer, including its address and private key, and defines the RPC URL for connecting to the Sepolia testnet.

```javascript
const SIGNER_ADDRESS = // ...
const SIGNER_PRIVATE_KEY = // ...
const RPC_URL = 'https://rpc.ankr.com/eth_sepolia'
```

--------------------------------

### Validate Signature with Protocol Kit (Simplified)

Source: https://docs.safe.global/reference-sdk-protocol-kit/messages/isvalidsignature

A simplified usage example for `isValidSignature` where the Safe message hash and signature are directly provided as arguments.

```TypeScript
const isValidSignature = await protocolKit.isValidSignature(
  '0x...', 
  '0x...'
)

```

--------------------------------

### Get Safe Creation Info with Safe{Core} SDK

Source: https://docs.safe.global/core-api/transaction-service-reference/xlayer

Demonstrates how to initialize the Safe API Kit and retrieve the creation information for a specific Safe address using the `getSafeCreationInfo` method. This includes setting the chain ID and API key.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 196n,
  apiKey: 'YOUR_API_KEY'
})

const safeCreationInfo = await apiKit.getSafeCreationInfo(
  '0x5298A93734C3D979eF1f23F78eBB871879A21F22'
)

console.log(safeCreationInfo)
```

--------------------------------

### Get Guard

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Retrieves the address of the currently active Safe Guard, if any. Returns null if no guard is set.

```JavaScript
// const guardAddress = await safeSdk.getGuard()

```

--------------------------------

### Get Safe Contract Version

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Returns the version of the Safe singleton contract. Knowing the contract version is important for compatibility and feature checks.

```javascript
const contractVersion = await protocolKit.getContractVersion()
```

--------------------------------

### Get Incoming Transactions without Options

Source: https://docs.safe.global/reference-sdk-api-kit/getincomingtransactions

Retrieves the history of incoming transactions for a Safe account without specifying any additional filtering or pagination options.

```typescript
const incomingTxs = await apiKit.getIncomingTransactions(
  '0x...'
)
```

--------------------------------

### Sample Safe Creation Status Response

Source: https://docs.safe.global/core-api/transaction-service-reference/ink

A sample JSON response detailing the creation status of a Safe. It includes the creation timestamp, the address of the creator, the transaction hash, the factory address used, the master copy contract address, and the setup data including decoded parameters like owners, threshold, fallback handler, and payment details.

```json
{
  "created": "2024-06-25T11:18:48Z",
  "creator": "0xa6d3DEBAAB2B8093e69109f23A75501F864F74e2",
  "transactionHash": "0x6404e0298423c092cc1ce486f3f72172a1c0f2f28a9b29f69e605ea825360ac5",
  "factoryAddress": "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC",
  "masterCopy": "0xfb1bffC9d739B8D520DaF37dF666da4C687191EA",
  "setupData": "0xb63e800d0000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000017062a1de2fe6b99be3d9d37841fed19f57380400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
```

--------------------------------

### Import Safe React Hooks Components

Source: https://docs.safe.global/sdk/react-hooks/guides/send-transactions

Imports essential components and hooks from the '@safe-global/safe-react-hooks' library, along with viem/chains for network configuration. These are required for setting up and interacting with Safe accounts.

```typescript
import {
  SafeProvider,
  createConfig,
  useSafe,
  useSendTransaction,
  SendTransactionVariables,
  useConfirmTransaction,
  ConfirmTransactionVariables
} from '@safe-global/safe-react-hooks'
import { sepolia } from 'viem/chains'
```

--------------------------------

### Get Safe Address (Protocol Kit v1)

Source: https://docs.safe.global/sdk/protocol-kit/guides/migrate-to-v1

Highlights the change in the `getAddress()` method, which now returns a Promise in Protocol Kit v1. This requires using `await` when calling the method.

```typescript
// old
const safeAddress = safeSdk.getAddress()

// new
const safeAddress = await protocolKit.getAddress()
```

--------------------------------

### Initialize Signers with Private Keys - JavaScript

Source: https://docs.safe.global/sdk/protocol-kit/guides/signatures

This snippet demonstrates how to initialize signers using private keys for Safe accounts. It requires a Sepolia RPC URL and private keys for multiple owners. This is a crucial step for signing transactions and messages with the Protocol Kit.

```javascript
const RPC_URL = 'https://eth-sepolia.public.blastapi.io'

// Initialize signers

const OWNER_1_PRIVATE_KEY = // ...
const OWNER_2_PRIVATE_KEY = // ...
const OWNER_3_PRIVATE_KEY = // ...
const OWNER_4_PRIVATE_KEY = // ...
const OWNER_5_PRIVATE_KEY = // ...

```

--------------------------------

### Get Transaction Confirmations

Source: https://docs.safe.global/reference-sdk-api-kit/gettransactionconfirmations

Retrieves the list of confirmations for a specific Safe transaction hash. This function requires the `apiKit` instance and the transaction hash as input.

```typescript
import { apiKit } from './setup.ts'

const safeTxHash = '0x...'

const confirmations = await apiKit.getTransactionConfirmations(safeTxHash)
```

```typescript
const confirmations = await apiKit.getTransactionConfirmations(
  '0x...'
)
```

--------------------------------

### Add Safe Operation with UserOperation Sender

Source: https://docs.safe.global/reference-sdk-api-kit/addsafeoperation

Provides an example of setting the `sender` property within the `userOperation` object for the `addSafeOperation` method. This specifies the address initiating the Safe operation.

```typescript
await apiKit.addSafeOperation({
  entryPoint: '0x...',
  moduleAddress: '0x...',
  safeAddress: '0x...',
  userOperation: {
    sender: '0x...',
    nonce: '10',
    initCode: '0x...',
    callData: '0x...',
    callGasLimit: 123n,
    verificationGasLimit: 123n,
    preVerificationGas: 123n,
    maxFeePerGas: 123n,
    maxPriorityFeePerGas: 123n,
    paymasterAndData: '0x...',
    signature: '0x...'
  }
})
```

--------------------------------

### Sample User Operation Data

Source: https://docs.safe.global/core-api/transaction-service-reference/bsc

Example data structure representing a UserOperation, including various parameters like call data, gas limits, paymaster information, and signature.

```JSON
{
  "callData": "0x7bb3742800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "callGasLimit": 198268,
  "verificationGasLimit": 3867576,
  "preVerificationGas": 110646,
  "maxFeePerGas": 36776375378,
  "maxPriorityFeePerGas": 199436407,
  "paymaster": "0xDFF7FA1077Bce740a6a212b3995990682c0Ba66d",
  "paymasterData": "0x00000000000000000000000000000000000000000000000000000000669e2fe1000000000000000000000000000000000000000000000000000000000000000037a31ba85cc6a4753d5fb73e475ddf22c9ab9a9ce405fdff217c03bff161bc893e7658160bd3cabaefad55b2d5751713484b8b90ef54d85e356916b4fede3dc11b",
  "signature": "0x000000000000000000000000000000000000000000000000608cf2e3412c6bda14e6d8a0a7d27c4240fed6f10000000000000000000000000000000000000000000000000000000000000041000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e053c4ce48756bae15e3454ad75ee8d4ba9764ea37ed561b216701c3630c0521774f94a8b7351780daa4a241792f52089af776e0898185318053201a92865b08d0000000000000000000000000000000000000000000000000000000000000002549960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97631d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034226f726967696e223a22687474703a2f2f6c6f63616c686f73743a33303030222c2263726f73734f726967696e223a66616c736500000000000000000000001f",
  "entryPoint": "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
}
```

--------------------------------

### Get Message

Source: https://docs.safe.global/core-api/transaction-service-reference/xlayer

Retrieves detailed information about a message using its message hash. Requires the Safe API Kit.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 196n,
  apiKey: 'YOUR_API_KEY'
})

const messageHash =
  '0x950cfe6090e742b709ab5f662c10c8b4e06d403a2f8c4654d86af45d93fa3777'

const message = await apiKit.getMessage(messageHash)

console.log(message)
```

--------------------------------

### Import EthersAdapter (Protocol Kit v1)

Source: https://docs.safe.global/sdk/protocol-kit/guides/migrate-to-v1

Demonstrates the updated import path for EthersAdapter in Protocol Kit v1. The adapter is now included within the protocol-kit package, and the separate safe-ethers-lib package is no longer required.

```typescript
// old
import EthersAdapter from '@safe-global/safe-ethers-lib'

// new
import { EthersAdapter } from '@safe-global/protocol-kit'
```

--------------------------------

### Get Module Transactions without Options

Source: https://docs.safe.global/reference-sdk-api-kit/getmoduletransactions

Retrieves module transactions for a Safe address without specifying any optional parameters.

```typescript
const moduleTxs = await apiKit.getModuleTransactions(
  '0x...'
)
```

--------------------------------

### Get Safe Creation Info - TypeScript

Source: https://docs.safe.global/core-api/transaction-service-reference/worldchain

Demonstrates how to use the SafeApiKit to fetch the creation information for a specific Safe address. It initializes the API kit with chain ID and API key, then calls the `getSafeCreationInfo` method.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'
  
const apiKit = new SafeApiKit({
  chainId: 480n,
  apiKey: 'YOUR_API_KEY'
})
  
const safeCreationInfo = await apiKit.getSafeCreationInfo(
  '0x5298A93734C3D979eF1f23F78eBB871879A21F22'
)
  
console.log(safeCreationInfo)
```

--------------------------------

### Sign Safe Transaction Hash

Source: https://docs.safe.global/reference-sdk-protocol-kit/transaction-signatures/signhash

Demonstrates how to sign a Safe transaction hash using the `signHash` function from the Protocol Kit. It first creates a transaction, gets its hash, and then signs the hash.

```TypeScript
import {
  MetaTransactionData,
  OperationType
} from '@safe-global/types-kit'
import { protocolKit } from './setup.ts'

const transactions: MetaTransactionData[] = [{
  to: '0x...',
  value: '123',
  data: '0x',
  operation: OperationType.Call // Optional
}]
const safeTransaction = await protocolKit.createTransaction({
  transactions
})
const safeTransactionHash = await protocolKit.getTransactionHash(
  safeTransaction
)

const signature = await protocolKit.signHash(safeTransactionHash)
```

--------------------------------

### getTransaction with safeTxHash parameter

Source: https://docs.safe.global/reference-sdk-react-hooks/usesafe/gettransaction

Example of calling the `getTransaction` function with the `safeTxHash` parameter to retrieve a specific Safe transaction.

```javascript
const result = getTransaction({
  safeTxHash: '0x...'
})
```

--------------------------------

### Configure npm Dependencies with Overrides

Source: https://docs.safe.global/advanced/smart-account-guards/smart-account-guard-tutorial

This JSON snippet demonstrates how to configure npm dependencies in `package.json` by adding an 'overrides' section to manage specific versions of packages, particularly for `@safe-global/safe-contracts`.

```JSON
{
  // ... existing content ...  
  "overrides": {
    "@safe-global/safe-contracts": {
      "ethers": "^6.13.5"
    }
  }
}
```

--------------------------------

### Wrap App with SafeProvider

Source: https://docs.safe.global/sdk/react-hooks/guides/send-transactions

Wraps the main application component with SafeProvider, passing the created configuration to enable access to Safe-related hooks throughout the application.

```typescript
<SafeProvider config={config}>
  <App />
</SafeProvider>
```

--------------------------------

### Rename create() to init() in SafeFactory and Safe

Source: https://docs.safe.global/sdk/protocol-kit/guides/migrate-to-v4

The `create()` method in `SafeFactory` and `Safe` classes has been renamed to `init()` to more accurately reflect its function of initializing the class rather than creating a new Safe account.

```javascript
const protocolKit = await Safe.create({ ... })
const safeFactory = await SafeFactory.create({ ... })

// new
const protocolKit = await Safe.init({ ... })
const safeFactory = await SafeFactory.init({ ... })
```

--------------------------------

### Initialize Public Client

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-detailed

Initializes a standard `publicClient` for making regular Ethereum RPC calls. This requires defining the RPC URL for the target network and using the `createPublicClient` function with `http` transport and the specified chain.

```typescript
const rpcURL = 'https://rpc.ankr.com/gnosis'  
const publicClient = createPublicClient({
  transport: http(rpcURL),
  chain: gnosis
})
```

--------------------------------

### Configure Pimlico API Key

Source: https://docs.safe.global/home/passkeys-tutorials/safe-passkeys-tutorial

Creates a .env.local file at the project root and adds the Pimlico API key as a NEXT_PUBLIC_PIMLICO_API_KEY environment variable.

```bash
echo "NEXT_PUBLIC_PIMLICO_API_KEY='your_pimlico_api_key_goes_here'" > .env.local
```

--------------------------------

### Get Safe Transaction Details

Source: https://docs.safe.global/reference-sdk-api-kit/gettransaction

Fetches all information for a given Safe transaction hash. This method is asynchronous and returns a Promise that resolves with the transaction details.

```typescript
import { apiKit } from './setup.ts'

const safeTxHash = '0x...'

const tx = await apiKit.getTransaction(safeTxHash)
```

```typescript
const tx = await apiKit.getTransaction(
  '0x...'
)
```

--------------------------------

### Retrieve Pending Transactions

Source: https://docs.safe.global/sdk/api-kit/guides/propose-and-confirm-transactions

This snippet demonstrates how to retrieve pending transactions using the API Kit. It specifically shows the method to get a transaction by its Safe transaction hash.

```javascript
const transaction = await service.getTransaction(safeTxHash)
```

--------------------------------

### Get Safe Info using API Kit

Source: https://docs.safe.global/reference-sdk-api-kit/getsafeinfo

This snippet demonstrates how to use the `getSafeInfo` function from the API Kit to retrieve information about a Safe address. It requires the `apiKit` instance and the Safe's address as input.

```typescript
import { apiKit } from './setup.ts'

const safeAddress = '0x...'

const safeInfo = await apiKit.getSafeInfo(safeAddress)
```

```typescript
const safeInfo = await apiKit.getSafeInfo(
  '0x...'
)
```

--------------------------------

### Sample Response for Safe Creation Status

Source: https://docs.safe.global/core-api/transaction-service-reference/avalanche

Provides a sample JSON response detailing the creation status of a Safe. It includes information such as the creation timestamp, creator address, transaction hash, factory address, master copy, setup data, decoded data, and user operation.

```json
{
  "created": "2024-06-25T11:18:48Z",
  "creator": "0xa6d3DEBAAB2B8093e69109f23A75501F864F74e2",
  "transactionHash": "0x6404e0298423c092cc1ce486f3f72172a1c0f2f28a9b29f69e605ea825360ac5",
  "factoryAddress": "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC",
  "masterCopy": "0xfb1bffC9d739B8D520DaF37dF666da4C687191EA",
  "setupData": "0xb63e800d0000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000017062a1de2fe6b99be3d9d37841fed19f57380400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000a6d3debaab2b8093e69109f23a75501f864f74e20000000000000000000000003a16e3090e32dded2250e862b9d5610bef13e93d0000000000000000000000000000000000000000000000000000000000000000",
  "dataDecoded": {
    "method": "setup",
    "parameters": [
      {
        "name": "_owners",
        "type": "address[]",
        "value": [
          "0xa6d3DEBAAB2B8093e69109f23A75501F864F74e2",
          "0x3A16E3090e32DDeD2250E862B9d5610BEF13e93d"
        ]
      },
      {
        "name": "_threshold",
        "type": "uint256",
        "value": "2"
      },
      {
        "name": "to",
        "type": "address",
        "value": "0x0000000000000000000000000000000000000000"
      },
      {
        "name": "data",
        "type": "bytes",
        "value": "0x"
      },
      {
        "name": "fallbackHandler",
        "type": "address",
        "value": "0x017062a1dE2FE6b99BE3d9d37841FeD19F573804"
      },
      {
        "name": "paymentToken",
        "type": "address",
        "value": "0x0000000000000000000000000000000000000000"
      },
      {
        "name": "payment",
        "type": "uint256",
        "value": "0"
      },
      {
        "name": "paymentReceiver",
        "type": "address",
        "value": "0x0000000000000000000000000000000000000000"
      }
    ]
  },
  "userOperation": null
}
```

--------------------------------

### Define Signer and RPC URL

Source: https://docs.safe.global/sdk/relay-kit/guides/4337-safe-sdk

Sets up the necessary variables for creating a signer, including the signer's address, private key, and the RPC URL for the Sepolia testnet.

```javascript
const SIGNER_ADDRESS = // ...
const SIGNER_PRIVATE_KEY = // ...
const RPC_URL = 'https://rpc.ankr.com/eth_sepolia'
```

--------------------------------

### Create Public Folder with Icons

Source: https://docs.safe.global/home/passkeys-tutorials/safe-passkeys-tutorial

This command sequence creates a 'public' directory and places several SVG and PNG icon files within it. These icons are likely used for the application's user interface and external links.

```bash
mkdir public
cd public
touch safe.svg github.svg external-link.svg
# Assuming safeLogo.png is a file that needs to be copied or created
# For demonstration, we'll just touch it. In a real scenario, you'd copy it.
touch safeLogo.png
```

--------------------------------

### Get Owners Who Approved Transaction

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Fetches the list of owners who have already approved a specific transaction. This helps track the progress of multi-signature approvals.

```JavaScript
// const ownersWhoApproved = await safeSdk.getOwnersWhoApprovedTx(safeTx)

```

--------------------------------

### Deploy Safe Contracts Tutorial

Source: https://docs.safe.global/resource-hub_page=3

This tutorial explains the process of deploying Safe contracts on a blockchain. It is intended for developers looking to integrate Safe functionality into their dApps.

```English
This tutorial explains how to deploy Safe contracts on a blockchain.
```

--------------------------------

### Get Safe Creation Info using Safe API Kit

Source: https://docs.safe.global/core-api/transaction-service-reference/linea

Demonstrates how to use the SafeApiKit to retrieve information about a Safe's creation. This includes initializing the API kit with chain ID and API key, and then calling the getSafeCreationInfo method with the Safe's address.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 59144n,
  apiKey: 'YOUR_API_KEY'
})

const safeCreationInfo = await apiKit.getSafeCreationInfo(
  '0x5298A93734C3D979eF1f23F78eBB871879A21F22'
)

console.log(safeCreationInfo)
```

--------------------------------

### Get Message

Source: https://docs.safe.global/core-api/transaction-service-reference/bsc

Retrieves detailed information about a specific message using its message hash. The response includes message details, creator, and confirmations.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 56n,
  apiKey: 'YOUR_API_KEY'
})

const messageHash =
  '0x950cfe6090e742b709ab5f662c10c8b4e06d403a2f8c4654d86af45d93fa3777'

const message = await apiKit.getMessage(messageHash)

console.log(message)
```

--------------------------------

### Initialize Protocol Kit with Safe Address

Source: https://docs.safe.global/reference-sdk-protocol-kit/initialization/init

Initializes the Protocol Kit for an existing Safe account by providing its address. This is a common scenario for interacting with a deployed Safe, requiring the provider, signer, and the Safe's address.

```javascript
const protocolKit = await Safe.init({
  provider,
  signer,
  safeAddress: '0x...'
})
```

--------------------------------

### Propose Transaction with Agent One - JavaScript

Source: https://docs.safe.global/home/ai-agent-quickstarts/multi-agent-setup

Proposes a transaction to the Safe Transaction Service using the API Kit. This allows other agents or human signers to review, sign, and execute the transaction. It includes creating the transaction, signing it, and sending it via the API Kit.

```javascript
import SafeApiKit from '@safe-global/api-kit'

// How to get an Api key => http://docs.safe.global/core-api/how-to-use-api-keys
const apiKit = new SafeApiKit({
  chainId: 11155111n,
  apiKey: 'YOUR_API_KEY'
})

const tx = await newSafe.createTransaction({
  transactions: [
    {
      to: '0x0000000000000000000000000000000000000000',
      data: '0x',
      value: '0'
    }
  ]
})

// Every transaction has a Safe (Smart Account) Transaction Hash different than the final transaction hash
const safeTxHash = await newSafe.getTransactionHash(tx)
// The AI agent signs this Safe (Smart Account) Transaction Hash
const signature = await newSafe.signHash(safeTxHash)

// Now the transaction with the signature is sent to the Transaction Service with the Api Kit:
await apiKit.proposeTransaction({
  safeAddress: safeAddress,
  safeTransactionData: tx.data,
  safeTxHash,
  senderSignature: signature.data,
  senderAddress: AGENT_ADDRESS
})
```

--------------------------------

### Create Passkey Signer with Credential

Source: https://docs.safe.global/reference-sdk-protocol-kit/passkeys/createpasskeysigner

This example shows the direct usage of the createPasskeySigner function, passing a WebAuthn credential object to generate a passkey signer. This signer can then be used for various cryptographic operations within the Safe ecosystem.

```JavaScript
const passkeySigner = await Safe.createPasskeySigner(
  credential
)
```

--------------------------------

### Initialize Safe SDK and Sign Message

Source: https://docs.safe.global/core-api/transaction-service-reference/zksync

Initializes the Safe SDK with provider, signer, and safe address, then creates and signs a message using the protocol kit. The signed message is then logged and added to the API.

```TypeScript
import Safe from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'

const safeAddress = '0x5298a93734c3d979ef1f23f78ebb871879a21f22'

const protocolKit = await Safe.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  safeAddress
})

const apiKit = new SafeApiKit({
  chainId: 324n,
  apiKey: 'YOUR_API_KEY'
})

const rawMessage = '1: string message'
const safeMessage = protocolKit.createMessage(rawMessage)
const signedMessage = await protocolKit.signMessage(safeMessage, 'eth_sign')

console.log({
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})

apiKit.addMessage(safeAddress, {
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})
```

--------------------------------

### Check Safe Transaction Executability without Options

Source: https://docs.safe.global/reference-sdk-protocol-kit/transactions/isvalidtransaction

Provides a basic example of using `isValidTransaction` with only the `safeTransaction` parameter, omitting optional transaction parameters.

```typescript
const isValidTx = await protocolKit.isValidTransaction(
  safeTransaction
)

```

--------------------------------

### Create Layouts Directory (Shell)

Source: https://docs.safe.global/advanced/passkeys/tutorials/nuxt

Shell commands to create a 'layouts' directory and navigate into it.

```Shell
mkdir ../layouts  
cd ../layouts  
touch default.vue  

```

--------------------------------

### Get User Operation Receipt (JavaScript)

Source: https://docs.safe.global/sdk/relay-kit/reference/safe-4337-pack

Fetches the receipt for a specific user operation once it has been executed. This provides the execution status, gas used, and logs. Returns UserOperationReceipt.

```javascript
getUserOperationReceipt(userOpHash)
```

--------------------------------

### Use Dynamic in a Safe App

Source: https://docs.safe.global/resource-hub

This guide explains how to integrate Dynamic with the Safe App environment, providing insights into dynamic functionalities within Safe applications.

```English
In this guide, you'll learn how to integrate Dynamic with the Safe App environment.
```

--------------------------------

### Get Chain ID (JavaScript)

Source: https://docs.safe.global/sdk/relay-kit/reference/safe-4337-pack

Retrieves the EIP-155 Chain ID for the current network. This is essential for transaction signing and network identification.

```javascript
getChainId()
```

--------------------------------

### Run Tests with Hardhat

Source: https://docs.safe.global/advanced/smart-account-fallback-handler/smart-account-fallback-handler-tutorial

This command executes the test suite for the Safe Global project using the Hardhat development environment. It ensures that all implemented functionalities, particularly those related to the ERC1271FallbackHandler, are working as expected.

```bash
npx hardhat test
```

--------------------------------

### Sign Hash with Safe Protocol Kit

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Signs a hash using the current owner account with the Safe protocol kit. This involves creating a Safe transaction, getting its hash, and then signing the hash.

```javascript
const transactions = [
  // ...
]
const safeTransaction = await protocolKit.createTransaction({ transactions })
const txHash = await protocolKit.getTransactionHash(safeTransaction)
const signature = await protocolKit.signHash(txHash)
```

--------------------------------

### Initialize SafeClient for Confirmation - Safe SDK

Source: https://docs.safe.global/sdk/starter-kit/guides/send-transactions

Initializes a new `SafeClient` instance with a signer's credentials and the Safe's address to confirm pending transactions.

```javascript
const newSafeClient = await createSafeClient({
  provider: RPC_URL,
  signer,
  safeAddress: '0x...'
})
```

--------------------------------

### Get Multisig Transactions by Origin

Source: https://docs.safe.global/core-api/transaction-service-reference/unichain

Retrieves analytics data for multisig transactions, categorized by their origin. This endpoint returns a success status with no response body.

```shell
curl -X GET https://api.safe.global/tx-service/unichain/api/v2/analytics/multisig-transactions/by-origin/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY" \

```

--------------------------------

### Get Message

Source: https://docs.safe.global/core-api/transaction-service-reference/arbitrum

Retrieves detailed information about a message using its message hash. This function requires the Safe API Kit.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 42161n,
  apiKey: 'YOUR_API_KEY'
})

const messageHash =
  '0x950cfe6090e742b709ab5f662c10c8b4e06d403a2f8c4654d86af45d93fa3777'

const message = await apiKit.getMessage(messageHash)

console.log(message)
```

--------------------------------

### Initialize Safe SDK and Sign Message

Source: https://docs.safe.global/core-api/transaction-service-reference/avalanche

Initializes the Safe Protocol Kit and API Kit, creates a message, signs it, and logs the signature. It also demonstrates adding the signed message to the Safe API.

```TypeScript
import Safe from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'

const safeAddress = '0x5298a93734c3d979ef1f23f78ebb871879a21f22'

const protocolKit = await Safe.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  safeAddress
})

const apiKit = new SafeApiKit({
  chainId: 43114n,
  apiKey: 'YOUR_API_KEY'
})

const rawMessage = '1: string message'
const safeMessage = protocolKit.createMessage(rawMessage)
const signedMessage = await protocolKit.signMessage(safeMessage, 'eth_sign')

console.log({
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})

apiKit.addMessage(safeAddress, {
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})
```

--------------------------------

### Run Mistral-Nemo Model with Ollama

Source: https://docs.safe.global/home/ai-agent-setup

Starts an interactive chat session with the 'mistral-nemo' model using Ollama. This allows for testing the model's capabilities before integrating it into the agent. Use '/bye' to exit the chat.

```shell
ollama run mistral-nemo
```

--------------------------------

### Get Safe Creation Info with Safe API Kit

Source: https://docs.safe.global/core-api/transaction-service-reference/optimism

Demonstrates how to use the Safe API Kit to retrieve information about a Safe's creation. It initializes the API kit with chain ID and an API key, then calls the getSafeCreationInfo method with a Safe address.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'
  
const apiKit = new SafeApiKit({
  chainId: 10n,
  apiKey: 'YOUR_API_KEY'
})
  
const safeCreationInfo = await apiKit.getSafeCreationInfo(
  '0x5298A93734C3D979eF1f23F78eBB871879A21F22'
)
  
console.log(safeCreationInfo)
```

--------------------------------

### Create Layouts Directory (Shell)

Source: https://docs.safe.global/home/passkeys-tutorials/safe-passkeys-nuxt

Shell commands to create a 'layouts' directory and navigate into it.

```Shell
mkdir ../layouts  
cd ../layouts  
touch default.vue  

```

--------------------------------

### Get Safe Address from Deployment Transaction

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Extracts the Safe address from a Safe deployment transaction receipt by scanning emitted events for the creation event.

```javascript
const txReceipt = await client.waitForTransactionReceipt({ hash: txHash })
const safeAddress = getSafeAddressFromDeploymentTx(txReceipt, safeVersion)
```

--------------------------------

### Create Safe Client with Custom Transaction Service URL

Source: https://docs.safe.global/reference-sdk-starter-kit/safe-client/constructor

This snippet demonstrates how to initialize a Safe client by providing a custom URL for the Safe Transaction Service. This is useful when running a self-hosted instance of the service.

```javascript
const safeClient = await createSafeClient({
  provider,
  signer,
  safeAddress: '0x...',
  txServiceUrl: 'https://...'
})
```

--------------------------------

### Get Safe Creation Status with SafeApiKit

Source: https://docs.safe.global/core-api/transaction-service-reference/base

Demonstrates how to use the SafeApiKit to retrieve the creation information for a specific Safe address. It initializes the API kit with a chain ID and API key, then calls the getSafeCreationInfo method.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 8453n,
  apiKey: 'YOUR_API_KEY'
})

const safeCreationInfo = await apiKit.getSafeCreationInfo(
  '0x5298A93734C3D979eF1f23F78eBB871879A21F22'
)

console.log(safeCreationInfo)
```

--------------------------------

### Deploy New Safe

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Deploys a new Safe account. This involves preparing a transaction object with Safe configuration and executing it via an Ethereum client.

```javascript
const predictedSafe = {
  safeAccountConfig: {
    owners: ['0x...', '0x...', '0x...'],
    threshold: 2
    // ...
  },
  safeDeploymentConfig: {
    saltNonce,
    safeVersion,
    deploymentType
  }
}

let protocolKit = await Safe.init({
  provider,
  signer,
  predictedSafe
})

const deploymentTransaction = await protocolKit.createSafeDeploymentTransaction()

const txHash = await client.sendTransaction({
  to: deploymentTransaction.to,
  value: BigInt(deploymentTransaction.value),
  data: `0x${deploymentTransaction.data}`
})
```

--------------------------------

### Get Enabled Safe Modules with Safe{Core} SDK

Source: https://docs.safe.global/home/glossary

This snippet demonstrates how to retrieve a list of all enabled Safe Modules for a Safe account using the Safe{Core} SDK. This helps in managing and understanding the extended functionalities.

```javascript
import Safe{Core} from "@safe-global/safe-core-sdk";

async function getEnabledSafeModules(safeSdk: Safe) {
  // Assuming safeSdk is an initialized Safe instance
  const modules = await safeSdk.getModules();
  return modules;
}
```

--------------------------------

### Magic Wallet Logout

Source: https://docs.safe.global/sdk/signers/magic

Logs the user out of the Magic wallet session. This is an asynchronous operation that terminates the current authentication context.

```javascript
await magic.user.logout()
```

--------------------------------

### Update createTransaction() Method Signature

Source: https://docs.safe.global/sdk/protocol-kit/guides/migrate-to-v2

This example shows the modification in the Protocol Kit's createTransaction() method. Previously, it accepted a single transaction object. In v2, it now requires an array of transactions and an options object, including nonce and safeTxGas.

```JavaScript
const safeTransactionData = {
  to: '',
  data: '',
  value: ''
}
const options = {
  nonce: '',
  safeTxGas: ''
}
const safeTransaction = protocolKit.createTransaction({
  transactions: [safeTransactionData],
  options
})
```

--------------------------------

### Get Message

Source: https://docs.safe.global/core-api/transaction-service-reference/optimism

Retrieves detailed information about a message using its message hash. This function requires the Safe API Kit and the message hash as input.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 10n,
  apiKey: 'YOUR_API_KEY'
})

const messageHash =
  '0x950cfe6090e742b709ab5f662c10c8b4e06d403a2f8c4654d86af45d93fa3777'

const message = await apiKit.getMessage(messageHash)

console.log(message)
```

--------------------------------

### Sign Message with Explicit Signing Method

Source: https://docs.safe.global/reference-sdk-protocol-kit/messages/signmessage

Shows how to sign a message with Protocol Kit while explicitly specifying the signing method. This example uses `SigningMethod.ETH_SIGN_TYPED_DATA_V4`, demonstrating how to override the default if necessary.

```TypeScript
const signedMessage = await protocolKit.signMessage(
  '0x...',
  SigningMethod.ETH_SIGN_TYPED_DATA_V4
)

```

--------------------------------

### Get Safe Operations by Address (TypeScript)

Source: https://docs.safe.global/reference-sdk-api-kit/getsafeoperationsbyaddress

Retrieves a list of Safe operations for a given Safe address with optional filtering and ordering. This function is compatible with Entrypoint v0.6.

```typescript
import { GetSafeOperationListProps } from '@safe-global/api-kit'
import { apiKit } from './setup.ts'

const safeAddress = '0x...'
const options: GetSafeOperationListOptions = {
  executed: false, // Optional
  hasConfirmations: true, // Optional
  ordering: 'created', // Optional
  limit: '10', // Optional
  offset: '50' // Optional
}

const safeOperationsResponse = await apiKit.getSafeOperationsByAddress(safeAddress, options)
```

```typescript
const safeOperationsResponse = await apiKit.getSafeOperationsByAddress({
  safeAddress: '0x...'
})
```

```typescript
const safeOperationsResponse = await apiKit.getSafeOperationsByAddress(
  {
    safeAddress: '0x...', 
    executed: true,
    ordering: 'created'
  }
)
```

```typescript
const safeOperationsResponse = await apiKit.getSafeOperationsByAddress(
  {
    safeAddress: '0x...', 
    hasConfirmations: true,
    ordering: 'created'
  }
)
```

```typescript
const safeOperationsResponse = await apiKit.getSafeOperationsByAddress(
  {
    safeAddress: '0x...', 
    ordering: 'created'
  }
)
```

```typescript
const safeOperationsResponse = await apiKit.getSafeOperationsByAddress(
  {
    safeAddress: '0x...', 
    limit: 10
  }
)
```

--------------------------------

### Get Safe Chain ID

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Retrieves the chain ID of the network the Safe is connected to. This helps in identifying the blockchain environment.

```javascript
const chainId = await protocolKit.getChainId()
```

--------------------------------

### Get Safe Owners using Protocol Kit

Source: https://docs.safe.global/reference-sdk-protocol-kit/safe-info/getowners

This snippet demonstrates how to use the `getOwners` function from the Protocol Kit to retrieve an array of owner addresses for a Safe. It assumes the Protocol Kit has been initialized and is available as `protocolKit`.

```TypeScript
import { protocolKit } from './setup.ts'

const ownerAddresses = await protocolKit.getOwners()
```

--------------------------------

### Add Safe Delegate with Safe Address

Source: https://docs.safe.global/reference-sdk-api-kit/addsafedelegate

Provides an example of calling `addSafeDelegate` with the `safeAddress` parameter specified. This is useful when you need to explicitly define the Safe for which the delegate is being added.

```typescript
const config = await apiKit.addSafeDelegate({
  safeAddress: '0x...', 
  delegateAddress: '0x...',
  delegatorAddress: '0x...',
  label: 'abc',
  signer
})
```

--------------------------------

### Get Safe Address from Deployment Transaction

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Calculates the future address of a Safe before it is deployed, based on the deployment transaction details. This is useful for pre-calculating addresses.

```JavaScript
// const predictedSafeAddress = await safeSdk.getSafeAddressFromDeploymentTx(safeDeploymentTx)

```

--------------------------------

### Initialize and Manage Safe Account with Passkeys in React Native

Source: https://docs.safe.global/advanced/passkeys/tutorials/react-native

This snippet demonstrates the initialization of the Safe Protocol Kit for a React Native application. It covers setting up the provider, signer, and predicted Safe account configuration. It also includes logic for checking if the Safe is deployed and connecting to it. The code manages the state for the Safe Protocol Kit instance, passkey signer, Safe address, and deployment status, along with loading states.

```typescript
import { useEffect, useState } from "react";
import prompt from "react-native-prompt-android";
import Safe, { PasskeyArgType } from "@safe-global/protocol-kit";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Platform,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import {
  getStoredPassKey,
  removeStoredPassKey,
  storePassKey,
} from "./lib/storage";
import { createPassKey, getPassKey } from "./lib/passkeys";
import {
  activateAccount,
  addPasskeyOwner,
  sendDummyPasskeyTransaction,
  signPasskeyMessage,
} from "./lib/safe";

const PASSKEY_NAME = "safe-owner";

export default function App() {
  const [protocolKit, setProtocolKit] = useState<Safe | null>(null);
  const [passkeySignerProtocolKit, setPasskeySignerProtocolKit] = useState<Safe | null>(null);
  const [passkeySigner, setPasskeySigner] = useState<PasskeyArgType | null>(null);
  const [safeAddress, setSafeAddress] = useState<string | null>(null);
  const [isDeployed, setIsDeployed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      let protocolKitInstance = await Safe.init({
        provider: process.env.EXPO_PUBLIC_RPC_URL as string,
        signer: process.env.EXPO_PUBLIC_SAFE_SIGNER_PK,
        predictedSafe: {
          safeAccountConfig: {
            owners: JSON.parse(process.env.EXPO_PUBLIC_SAFE_OWNERS as string),
            threshold: 1,
          },
          safeDeploymentConfig: {
            saltNonce: process.env.EXPO_PUBLIC_SAFE_SALT_NONCE,
          },
        },
      });

      const safeAddress = await protocolKitInstance.getAddress();
      const isDeployed = await protocolKitInstance.isSafeDeployed();

      console.log("Safe address", safeAddress);
      console.log("Is deployed", isDeployed);

      setSafeAddress(safeAddress);
      setIsDeployed(isDeployed);

      if (isDeployed) {
        protocolKitInstance = await protocolKitInstance.connect({
          provider: process.env.EXPO_PUBLIC_RPC_URL,
          signer: process.env.EXPO_PUBLIC_SAFE_SIGNER_PK,
          safeAddress: safeAddress,
        });
      }

      setProtocolKit(protocolKitInstance);
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const storedPasskey = await getStoredPassKey(PASSKEY_NAME);
      setPasskeySigner(storedPasskey);
    })();
  }, []);

  useEffect(() => {
    if (!passkeySigner || !safeAddress) return;

    (async () => {
      const passkeySignerProtocolKitInstance = await Safe.init({
        provider: process.env.EXPO_PUBLIC_RPC_URL,
        signer: { ...passkeySigner, getFn: getPassKey } as PasskeyArgType,
        safeAddress,
      });

      setPasskeySignerProtocolKit(passkeySignerProtocolKitInstance);
    })();
  }, [safeAddress, passkeySigner]);

  const handleActivateAccount = async () => {
    if (!protocolKit || !safeAddress) return;

    setIsLoading(true);

    const receipt = await activateAccount(protocolKit);

    if (receipt.transactionHash) {
      setIsDeployed(true);

      const updatedProtocolKitInstance = await protocolKit.connect({
        provider: protocolKit.getSafeProvider().provider,
        signer: protocolKit.getSafeProvider().signer,
        safeAddress: await protocolKit.getAddress(),
      });

      setProtocolKit(updatedProtocolKitInstance);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const handleAddPasskeyOwner = async () => {
    if (!protocolKit) {
      return;
    }

    const passkeyCredential = await createPassKey();

    if (!passkeyCredential) {
      throw Error("Passkey creation failed: No credential was returned.");
    }

    const signer = await Safe.createPasskeySigner(passkeyCredential);

    setIsLoading(true);

    await addPasskeyOwner(protocolKit, signer);

    await storePassKey(signer, PASSKEY_NAME);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Safe Account Management</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Text>Safe Address: {safeAddress}</Text>
            <Text>Deployed: {isDeployed ? "Yes" : "No"}</Text>
            {!isDeployed && (
              <Button title="Activate Account" onPress={handleActivateAccount} />
            )}
            <Button title="Add Passkey Owner" onPress={handleAddPasskeyOwner} />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

```

--------------------------------

### Get User Operation by Hash (JavaScript)

Source: https://docs.safe.global/sdk/relay-kit/reference/safe-4337-pack

Retrieves detailed payload data for a user operation using its hash. This can be used for pending or executed operations. Returns UserOperationWithPayload.

```javascript
getUserOperationByHash(userOpHash)
```

--------------------------------

### Configure Environment Variables for Safe Agent

Source: https://docs.safe.global/home/ai-agent-setup

Sets up environment variables required for the AI agent. This includes the agent's private key and address, along with optional variables for OpenAI API key, LangSmith API key, and LangChain tracing configurations for debugging and monitoring.

```shell
AGENT_PRIVATE_KEY="0x..."
AGENT_ADDRESS="0x..."

# Optional:
OPENAI_API_KEY="sk-..."
LANGCHAIN_API_KEY="lsv2_..."
LANGCHAIN_CALLBACKS_BACKGROUND="true"
LANGCHAIN_TRACING_V2="true"
LANGCHAIN_PROJECT="Safe Agent Tutorial"
```

--------------------------------

### Initialize Safe4337Pack with init()

Source: https://docs.safe.global/sdk/relay-kit/reference/safe-4337-pack

The static method `init()` is used to create an instance of `Safe4337Pack`. This method requires configuration options including a provider, bundler URL, and Safe account details. It supports specifying custom contract addresses and paymaster options for sponsored transactions.

```typescript
import { Safe4337Pack, Safe4337InitOptions } from '@safe-global/safe-ethers-adapters';

async function initializeSafe() {
  const options: Safe4337InitOptions = {
    provider: window.ethereum, // Or your EIP-1193 provider
    signer: "0x123...", // Optional signer
    bundlerUrl: "https://your-bundler.url",
    safeModulesVersion: "0.3.0", // For Entrypoint v0.7
    options: {
      safeAddress: "0xabc...", // For existing Safe
      // OR
      // owners: ["0x123...", "0x456..."],
      // threshold: 2,
      // saltNonce: "0",
    },
    paymasterOptions: {
      paymasterAddress: "0xpaymaster...",
      isSponsored: true,
    }
  };

  const safePack = await Safe4337Pack.init(options);
  console.log('Safe4337Pack initialized:', safePack);
}
```

--------------------------------

### Get User Operation by Hash - TypeScript

Source: https://docs.safe.global/core-api/transaction-service-reference/base

This TypeScript code snippet demonstrates how to initialize the Safe4337Pack and then retrieve a user operation by its hash. It requires provider, signer, bundler URL, and Safe address for initialization.

```TypeScript
import { Safe4337Pack } from '@safe-global/relay-kit'  

const safe4337Pack = await Safe4337Pack.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  bundlerUrl: `https://api.pimlico.io/v1/sepolia/rpc?add_balance_override&apikey=${PIMLICO_API_KEY}`,
  options: {
    safeAddress: '0x97566B1eCaCd321736F183117C26ACe1b72F4a1b'
  }
})

const userOperationHash =
  '0x7bf502ad622e62823c971d800033e82e5670fcdd1c19437555fb2d8b7eefd644'

const userOperation = await safe4337Pack.getUserOperationByHash(
  userOperationHash
)

console.log(userOperation)
```

--------------------------------

### Integrate Gelato Relay with Relay Kit

Source: https://docs.safe.global/sdk/relay-kit

This guide details the process of integrating Gelato Relay with the Safe Global Relay Kit. It outlines the steps required to leverage Gelato's services for transaction relaying.

```javascript
import { RelayKit } from "@safe-global/relay-kit";

// Example usage (replace with actual implementation)
async function integrateGelatoRelay() {
  const relayKit = new RelayKit();
  // ... integration logic ...
  console.log("Gelato Relay integrated with Relay Kit.");
}
```

--------------------------------

### Build Vue App with Safe and Passkeys (Tutorial)

Source: https://docs.safe.global/resource-hub_page=3

Learn to build a Vue application for using passkeys with Safe. This tutorial covers secure passkey management and interaction with a Safe, relevant for Vue, Passkeys, and Safe Core SDK.

--------------------------------

### List Multisig Transactions via cURL

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis

Provides a cURL command to retrieve multisig transactions for a Safe address. This example assumes a base URL for Gnosis and demonstrates a direct API call.

```curl
curl
"/api/v1/safes/{address}/multisig-transactions/"
```

--------------------------------

### Build Vue App with Safe and Passkeys (Tutorial)

Source: https://docs.safe.global/resource-hub_page=2

Learn to build a Vue application for using passkeys with Safe. This tutorial covers secure passkey management and interaction with a Safe, relevant for Vue, Passkeys, and Safe Core SDK.

--------------------------------

### Get Pending Transactions without Options

Source: https://docs.safe.global/reference-sdk-api-kit/getpendingtransactions

Retrieves pending multi-signature transactions for a Safe address without specifying any optional parameters. This is a basic usage of the `apiKit.getPendingTransactions` method.

```typescript
const pendingTxs = await apiKit.getPendingTransactions(
  '0x...'
)
```

--------------------------------

### Get Multisig Transactions by Origin Request

Source: https://docs.safe.global/core-api/transaction-service-reference/ink

This cURL command shows how to fetch analytics data for multisig transactions by their origin. It requires an API key for authorization.

```curl
curl -X GET https://api.safe.global/tx-service/ink/api/v2/analytics/multisig-transactions/by-origin/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY" \

```

--------------------------------

### getTransaction with ethereumTxHash parameter

Source: https://docs.safe.global/reference-sdk-react-hooks/usesafe/gettransaction

Example of calling the `getTransaction` function with the `ethereumTxHash` parameter to retrieve a transaction using its Ethereum transaction hash.

```javascript
const result = getTransaction({
  ethereumTxHash: '0x...'
})
```

--------------------------------

### Create Sponsored UserOperation

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-detailed

Constructs a `sponsoredUserOperation` object, populating it with initial values. It includes fetching the sender's bytecode and setting placeholder values for gas and signature, with `paymasterAndData` set to `ERC20_PAYMASTER_ADDRESS`.

```typescript
const contractCode = await publicClient.getBytecode({ address: sender })
const sponsoredUserOperation: UserOperation = {
  sender,
  nonce,
  initCode: contractCode ? '0x' : initCode,
  callData,
  callGasLimit: 1n, // All gas values will be filled by Estimation Response Data.
  verificationGasLimit: 1n,
  preVerificationGas: 1n,
  maxFeePerGas: 1n,
  maxPriorityFeePerGas: 1n,
  paymasterAndData: ERC20_PAYMASTER_ADDRESS,
  signature: '0x'
}
```

--------------------------------

### Create Add Owner Transaction with Protocol Kit

Source: https://docs.safe.global/reference-sdk-protocol-kit/safe-info/createaddownertx

Demonstrates how to create a Safe transaction to add a new owner and optionally update the threshold using the Protocol Kit. It includes setting owner address, threshold, and various optional transaction parameters like gas settings and nonce.

```TypeScript
import {
  AddOwnerTxParams,
  SafeTransactionOptionalProps
} from '@safe-global/protocol-kit'
import { protocolKit } from './setup.ts'

const params: AddOwnerTxParams = {
  ownerAddress: '0x...'
  threshold: 123 // Optional
}

const options: SafeTransactionOptionalProps = {
  safeTxGas: '123', // Optional
  baseGas: '123', // Optional
  gasPrice: '123', // Optional
  gasToken: '0x...', // Optional
  refundReceiver: '0x...', // Optional
  nonce: 123 // Optional
}

const safeTransaction = await protocolKit.createAddOwnerTx(
  params,
  options // Optional
)

```

--------------------------------

### Execute Safe Transaction with 'maxFeePerGas' Option

Source: https://docs.safe.global/reference-sdk-protocol-kit/transactions/executetransaction

This example demonstrates setting the `maxFeePerGas` option when executing a Safe transaction. This specifies the maximum fee per gas the sender is willing to pay.

```TypeScript
const txResponse = await protocolKit.executeTransaction(
  safeTransaction,
  options: {
    maxFeePerGas: '123'
  }
)

```

--------------------------------

### Get Token List - cURL

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis

A cURL command to fetch the list of tokens supported by the Safe Transaction Service. This command targets the Ethereum Sepolia network.

```curl
curl -X GET https://safe-transaction-sepolia.safe.global/api/api/v1/tokens/lists/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
```

--------------------------------

### Sign Message with Default Signing Method

Source: https://docs.safe.global/reference-sdk-protocol-kit/messages/signmessage

A simplified example of signing a message using Protocol Kit, relying on the default signing method (`ETH_SIGN_TYPED_DATA_V4`). This is useful when the default method is sufficient and explicit specification is not needed.

```TypeScript
const signedMessage = await protocolKit.signMessage(
  '0x...'
)

```

--------------------------------

### Configure getSafeInfo with Custom Config

Source: https://docs.safe.global/reference-sdk-react-hooks/usesafe/getsafeinfo

Shows how to provide a custom configuration object to the `getSafeInfo` function, overriding the default configuration from the `SafeProvider`. This example imports the `config` object from a local file.

```javascript
import { config } from './config.ts'

const result = getSafeInfo({
  config
})
```

--------------------------------

### Execute Safe Account Migration

Source: https://docs.safe.global/advanced/smart-account-migration

This script demonstrates how to migrate a Safe account using different migration methods. It initializes the Safe Protocol Kit, encodes migration data, creates a transaction, and executes it. It also includes logging and transaction receipt waiting.

```javascript
import Safe from "@safe-global/protocol-kit";
import { MetaTransactionData, OperationType } from "@safe-global/types-kit";
import { parseAbi, encodeFunctionData, http, createPublicClient } from "viem";

type MigrationMethod =
  | "migrateSingleton"
  | "migrateWithFallbackHandler"
  | "migrateL2Singleton"
  | "migrateL2WithFallbackHandler";

async function main(migrationMethod: MigrationMethod) {
  const SAFE_ADDRESS = // ...
  const OWNER_PRIVATE_KEY = // ...
  const RPC_URL = // ...
  const SAFE_MIGRATION_CONTRACT_ADDRESS = // ...
  const ABI = parseAbi([
    "function migrateSingleton() public",
    "function migrateWithFallbackHandler() external",
    "function migrateL2Singleton() public",
    "function migrateL2WithFallbackHandler() external",
  ]);

  const calldata = encodeFunctionData({
    abi: ABI,
    functionName: migrationMethod,
  });

  const safeTransactionData: MetaTransactionData = {
    to: SAFE_MIGRATION_CONTRACT_ADDRESS,
    value: "0",
    data: calldata,
    operation: OperationType.DelegateCall,
  };

  const preExistingSafe = await Safe.init({
    provider: RPC_URL,
    signer: OWNER_PRIVATE_KEY,
    safeAddress: SAFE_ADDRESS,
  });

  const safeTransaction = await preExistingSafe.createTransaction({
    transactions: [safeTransactionData],
  });

  console.log(
    `Executing migration method [${migrationMethod}] using Safe [${SAFE_ADDRESS}]`
  );

  const result = await preExistingSafe.executeTransaction(safeTransaction);

  const publicClient = createPublicClient({
    transport: http(RPC_URL),
  });

  console.log(`Transaction hash [${result.hash}]`);
  await publicClient.waitForTransactionReceipt({
    hash: result.hash as `0x${string}`,
  });
}

const migrationMethod = process.argv.slice(2)[0] as MigrationMethod;
main(migrationMethod).catch(console.error);

```

--------------------------------

### Execute Safe Transaction without Options

Source: https://docs.safe.global/reference-sdk-protocol-kit/transactions/executetransaction

This example shows the basic usage of the `executeTransaction` function to execute a Safe transaction without providing any additional options. It assumes the `safeTransaction` object has already been created.

```TypeScript
const txResponse = await protocolKit.executeTransaction(
  safeTransaction
)

```

--------------------------------

### Build App with Safe and ERC-7579 (Tutorial)

Source: https://docs.safe.global/resource-hub_page=3

This tutorial guides users on deploying an ERC-7579-compatible Safe Smart Account and utilizing an ERC-7579-compatible module, such as the Scheduled Transfer from Rhinestone. It is relevant for Permissionless and 7579 topics.

--------------------------------

### Build App with Safe and ERC-7579 (Tutorial)

Source: https://docs.safe.global/resource-hub_page=2

This tutorial guides users on deploying an ERC-7579-compatible Safe Smart Account and utilizing an ERC-7579-compatible module, such as the Scheduled Transfer from Rhinestone. It is relevant for Permissionless and 7579 topics.

--------------------------------

### Instantiate Protocol Kit and Sign Transaction

Source: https://docs.safe.global/sdk/signers/passkeys

Initializes the Safe{Core} SDK's protocol-kit using a provider, signer, and Safe address. It then creates and signs a Safe transaction.

```javascript
const protocolKit = await Safe.init({ provider, signer, safeAddress })
const transaction = { to: '0x1234', value: '0x0', data: '0x' }
const safeTransaction = await protocolKit.createTransaction({ transactions: [transaction] })
const signedSafeTransaction = await protocolKit.signTransaction(safeTransaction)
```

--------------------------------

### Add Safe Delegate (cURL)

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis

This is the cURL equivalent for adding a delegate to a Safe account. It demonstrates the command-line interface for interacting with the API, requiring similar parameters as the TypeScript example.

```curl
curl -X POST \
  /api/v2/delegates/ \
  -H 'Content-Type: application/json' \
  -d '{ \
    "safeAddress": "0x5298a93734c3d979ef1f23f78ebb871879a21f22", \
    "delegateAddress": "0x3A16E3090e32DDeD2250E862B9d5610BEF13e93d", \
    "delegatorAddress": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", \
    "label": "Your label" \
  }'
```

--------------------------------

### Get Module Transaction Details (curl)

Source: https://docs.safe.global/core-api/transaction-service-reference/avalanche

Retrieves the details of a module transaction using its ID via a curl command. This requires an API key for authorization.

```curl
curl -X GET https://api.safe.global/tx-service/avax/api/v1/module-transaction/0x3b3b57b3 \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY" \
```

--------------------------------

### Initialize Safe4337Pack and Get User Operation

Source: https://docs.safe.global/core-api/transaction-service-reference/worldchain

Initializes the Safe4337Pack with provider, signer, bundler URL, and Safe address, then retrieves a user operation using its hash. This snippet demonstrates a common workflow for interacting with Safe's 4337 relay services.

```TypeScript
import { Safe4337Pack } from '@safe-global/relay-kit'

const safe4337Pack = await Safe4337Pack.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  bundlerUrl: `https://api.pimlico.io/v1/sepolia/rpc?add_balance_override&apikey=${PIMLICO_API_KEY}`,
  options: {
    safeAddress: '0x97566B1eCaCd321736F183117C26ACe1b72F4a1b'
  }
})

const userOperationHash =
  '0x7bf502ad6b22e62823c971d800033e82e5670fcdd1c19437555fb2d8b7eefd644'

const userOperation = await safe4337Pack.getUserOperationByHash(
  userOperationHash
)

console.log(userOperation)
```

--------------------------------

### Initialize Safe Protocol Kit and API Kit (TypeScript)

Source: https://docs.safe.global/core-api/transaction-service-reference/sonic

Demonstrates how to initialize the Safe Protocol Kit and Safe API Kit in TypeScript. It includes setting up the provider, signer, safe address, chain ID, and API key, as well as creating and signing a message, and adding it to the API.

```TypeScript
import Safe from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'

const safeAddress = '0x5298a93734c3d979ef1f23f78ebb871879a21f22'

const protocolKit = await Safe.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  safeAddress
})

const apiKit = new SafeApiKit({
  chainId: 146n,
  apiKey: 'YOUR_API_KEY'
})

const rawMessage = '1: string message'
const safeMessage = protocolKit.createMessage(rawMessage)
const signedMessage = await protocolKit.signMessage(safeMessage, 'eth_sign')

console.log({
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})

apiKit.addMessage(safeAddress, {
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})
```

--------------------------------

### Solidity: Check Signatures for Safe Account

Source: https://docs.safe.global/reference-smart-account/signatures/checkSignatures

This snippet demonstrates how to use the `checkSignatures` function from the ISafe interface to verify signatures against a data hash. It includes the interface definition and a contract example showing the function call.

```Solidity
interface ISafe {
    function checkSignatures(
        bytes32 dataHash,
        bytes signatures
    ) external view;
}

contract Example {
    function example() ... {
        (ISafe safe).checkSignatures(
            "0x...",
            "0x..."
        );
    }
}
```

--------------------------------

### Submit and Wait for UserOperation Receipt

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-detailed

Submits a sponsored user operation to the EntryPoint contract using `sendUserOperation` and then waits for its receipt using `waitForUserOperationReceipt`. Retrieves the transaction hash from the receipt.

```typescript
const userOperationHash = await bundlerClient.sendUserOperation({
  userOperation: sponsoredUserOperation,
  entryPoint: ENTRYPOINT_ADDRESS_V06
})

const receipt = await bundlerClient.waitForUserOperationReceipt({
  hash: userOperationHash
})

const transactionHash = receipt.receipt.transactionHash
```

--------------------------------

### Place Monerium Order with SDK

Source: https://docs.safe.global/sdk/onramp/monerium

This snippet demonstrates how to place an order with Monerium using their SDK. It includes specifying the amount, currency, target IBAN, and other transaction details required for the order. The `placeOrderMessage` function is used to format the message for the order.

```javascript
import { placeOrderMessage } from '@monerium/sdk'

const amount = '10' // Specify the amount in Euro
const iban = 'DK4878805291075472' // The target IBAN

// 'Send EUR 10 to DK4878805291075472 at Fri, 17 May 2024 20:55:29Z'
const orderMessage = placeOrderMessage(amount, 'eur', iban)

// Send the order to the Monerium backend
const order = await moneriumClient.placeOrder({
  amount,
  signature: '0x',
  currency: 'eur',
  address: safeAddress, // the Safe address
  counterpart: {
    identifier: {
      standard: 'iban',
      iban
    },
    details: {
      firstName: 'User',
      lastName: 'Userson',
      county: 'AL'
    }
  },
  message: orderMessage,
  memo: 'Powered by Monerium SDK',
  chain: 'ethereum',
  network: 'sepolia'
})
```

--------------------------------

### Initialize SafeProvider with createConfig

Source: https://docs.safe.global/reference-sdk-react-hooks/createconfig

Demonstrates how to use `createConfig` to set up the `SafeProvider` for a React application. This involves importing necessary components and defining the configuration object.

```javascript
import ReactDOM from 'react-dom/client'
import { createConfig, SafeProvider } from '@safe-global/safe-react-hooks'
import App from './App.tsx'

const config = createConfig({
  // ...
})

const root = document.getElementById('root')

ReactDOM.createRoot(root).render(
  <SafeProvider config={config}>
    <App />
  </SafeProvider>
)
```

--------------------------------

### Get Enabled Safe Guard

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Retrieves the address of the currently enabled Safe Guard. Returns the zero address if no guards are active.

```javascript
const guardAddress = await protocolKit.getGuard()
```

--------------------------------

### Get Safes by Module Address

Source: https://docs.safe.global/reference-sdk-api-kit/getsafesbymodule

Retrieves a list of Safe accounts that have a specific module address enabled. This function is useful for identifying all Safes associated with a particular module.

```TypeScript
import { apiKit } from './setup.ts'

const moduleAddress = '0x...'

const safes = await getSafesByModule(moduleAddress)
```

```TypeScript
const safes = await getSafesByModule(
  '0x...'
)
```

--------------------------------

### Sample Request for User Operation Hash

Source: https://docs.safe.global/core-api/transaction-service-reference/ink

This cURL command shows a sample request to the API endpoint for retrieving a user operation by its hash. It specifies the HTTP method GET and the URL path with a placeholder for the user operation hash.

```curl
GET
/tx-service/ink/api/v1/user-operations/{user_operation_hash}/
```

--------------------------------

### Get Safe Nonce with Protocol Kit

Source: https://docs.safe.global/reference-sdk-protocol-kit/safe-info/getnonce

Demonstrates how to use the `getNonce` function from the Protocol Kit to retrieve the Safe nonce. This function returns a Promise that resolves to a number representing the nonce.

```TypeScript
import { protocolKit } from './setup.ts'

const nonce = await protocolKit.getNonce()
```

--------------------------------

### Get Safe Creation Status with Safe API Kit

Source: https://docs.safe.global/core-api/transaction-service-reference/avalanche

Demonstrates how to use the Safe API Kit to retrieve the creation information for a specific Safe address. It initializes the API kit with a chain ID and API key, then calls the `getSafeCreationInfo` method.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'
  
const apiKit = new SafeApiKit({
  chainId: 43114n,
  apiKey: 'YOUR_API_KEY'
})
  
const safeCreationInfo = await apiKit.getSafeCreationInfo(
  '0x5298A93734C3D979eF1f23F78eBB871879A21F22'
)
  
console.log(safeCreationInfo)
```

--------------------------------

### Get Multisig Transactions in TypeScript

Source: https://docs.safe.global/core-api/transaction-service-guides/transactions

Fetches multisig transactions for a given Safe address using the Safe{Core} SDK. It then logs the first transaction from the results if any are found.

```TypeScript
const transactions = await apiKit.getMultisigTransactions(config.SAFE_ADDRESS)

if (transactions.results.length > 0) {
  console.log('Last executed transaction', transactions.results[0])
}
```

--------------------------------

### Get Safe Delegates

Source: https://docs.safe.global/reference-sdk-api-kit/getsafedelegates

Retrieves a list of delegates associated with a specific Safe address. Supports filtering by delegate address, delegator address, label, and pagination with limit and offset.

```TypeScript
import { GetSafeDelegateProps } from '@safe-global/api-kit'
import { apiKit } from './setup.ts'

const config: GetSafeDelegateProps = {
  safeAddress: '0x...', // Optional
  delegateAddress: '0x...', // Optional
  delegatorAddress: '0x...', // Optional
  label: 'abc', // Optional
  limit: '10', // Optional
  offset: '50' // Optional
}

const delegates = await apiKit.getSafeDelegates(config)
```

```TypeScript
const delegates = await apiKit.getSafeDelegates({
  safeAddress: '0x...'
})
```

```TypeScript
const delegates = await apiKit.getSafeDelegates({
  delegateAddress: '0x...'
})
```

```TypeScript
const delegates = await apiKit.getSafeDelegates({
  delegatorAddress: '0x...'
})
```

```TypeScript
const delegates = await apiKit.getSafeDelegates({
  label: 'abc'
})
```

```TypeScript
const delegates = await apiKit.getSafeDelegates({
  limit: '10'
})
```

```TypeScript
const delegates = await apiKit.getSafeDelegates({
  offset: '50'
})
```

--------------------------------

### Get Threshold

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Retrieves the current owner threshold required for approving transactions on the Safe. This value determines how many signatures are needed.

```JavaScript
// const threshold = await safeSdk.getThreshold()

```

--------------------------------

### Sample Safe Creation Status Response

Source: https://docs.safe.global/core-api/transaction-service-reference/aurora

Provides a sample JSON response for the Safe creation status, detailing fields like creation timestamp, creator address, transaction hash, factory address, master copy, setup data, decoded data, and user operation.

```JSON
{
  "created": "2024-06-25T11:18:48Z",
  "creator": "0xa6d3DEBAAB2B8093e69109f23A75501F864F74e2",
  "transactionHash": "0x6404e0298423c092cc1ce486f3f72172a1c0f2f28a9b29f69e605ea825360ac5",
  "factoryAddress": "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC",
  "masterCopy": "0xfb1bffC9d739B8D520DaF37dF666da4C687191EA",
  "setupData": "0xb63e800d0000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000017062a1de2fe6b99be3d9d37841fed19f573804000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a6d3debaab2b8093e69109f23a75501f864f74e20000000000000000000000003a16e3090e32dded2250e862b9d5610bef13e93d0000000000000000000000000000000000000000000000000000000000000000",
  "dataDecoded": {
    "method": "setup",
    "parameters": [
      {
        "name": "_owners",
        "type": "address[]",
        "value": [
          "0xa6d3DEBAAB2B8093e69109f23A75501F864F74e2",
          "0x3A16E3090e32DDeD2250E862B9d5610BEF13e93d"
        ]
      },
      {
        "name": "_threshold",
        "type": "uint256",
        "value": "2"
      },
      {
        "name": "to",
        "type": "address",
        "value": "0x0000000000000000000000000000000000000000"
      },
      {
        "name": "data",
        "type": "bytes",
        "value": "0x"
      },
      {
        "name": "fallbackHandler",
        "type": "address",
        "value": "0x017062a1dE2FE6b99BE3d9d37841FeD19F573804"
      },
      {
        "name": "paymentToken",
        "type": "address",
        "value": "0x0000000000000000000000000000000000000000"
      },
      {
        "name": "payment",
        "type": "uint256",
        "value": "0"
      },
      {
        "name": "paymentReceiver",
        "type": "address",
        "value": "0x0000000000000000000000000000000000000000"
      }
    ]
  },
  "userOperation": null
}
```

--------------------------------

### Create Public Folder with Icons

Source: https://docs.safe.global/advanced/passkeys/tutorials/react

This command sequence creates a 'public' directory and places several SVG and PNG icon files within it. These icons are likely used for the application's user interface and external links.

```bash
mkdir public
cd public
touch safe.svg github.svg external-link.svg
# Assuming safeLogo.png is a file that needs to be copied or created
# For demonstration, we'll just touch it. In a real scenario, you'd copy it.
touch safeLogo.png
```

--------------------------------

### Enable Safe Module Transaction with GasToken Option

Source: https://docs.safe.global/reference-sdk-protocol-kit/safe-modules/createenablemoduletx

Provides an example of enabling a Safe Module transaction with the `gasToken` option. This specifies the token address used for gas payment, or `0x0` for no payment.

```TypeScript
const safeTransaction = await protocolKit.createEnableModuleTx(
  '0x...', 
  options: {
    gasToken: '0x...'
  }
)

```

--------------------------------

### Get Safe Threshold with Safe{Core} SDK

Source: https://docs.safe.global/home/glossary

This snippet shows how to retrieve the current threshold configuration of a Safe account using the Safe{Core} SDK. The threshold determines the number of required confirmations for transactions.

```javascript
import Safe{Core} from "@safe-global/safe-core-sdk";

async function getSafeThreshold(safeSdk: Safe) {
  // Assuming safeSdk is an initialized Safe instance
  const threshold = await safeSdk.getThreshold();
  return threshold;
}
```

--------------------------------

### Sample GET Request for Safe Operation (cURL)

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis

This cURL command demonstrates how to retrieve details for a specific safe operation using its hash. It targets the Ethereum Sepolia network and includes necessary headers for JSON acceptance and content type.

```curl
curl -X GET https://safe-transaction-sepolia.safe.global/api/api/v1/safe-operations/0x597ba36c626a32a4fcc9f23a4b25605ee30b46584918d6b6442387161dc3c51b/ \
    -H "Accept: application/json" \
    -H "content-type: application/json"
```

--------------------------------

### Integrate Magic with Safe Smart Accounts (Blog Post)

Source: https://docs.safe.global/resource-hub_page=2

This blog post provides instructions on how to integrate Magic with Safe Smart Accounts, covering the Signer and Permissionless topics.

--------------------------------

### Get Safe Chain ID

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Retrieves the chain ID of the network the Safe is deployed on. Useful for ensuring correct network interactions.

```JavaScript
// const chainId = await safeSdk.getChainId()

```

--------------------------------

### Deploy Safe using Safe class (v5)

Source: https://docs.safe.global/sdk/protocol-kit/guides/migrate-to-v5

This snippet shows the new method for deploying Safes in Safe Protocol Kit v5. It uses the Safe class, initializes it with predicted Safe properties, creates a deployment transaction, and executes it. Finally, it reconnects to the deployed Safe and logs its properties.

```typescript
import Safe, { PredictedSafeProps } from '@safe-global/protocol-kit'  
  
const predictedSafe: PredictedSafeProps = {
  safeAccountConfig: {
    owners: ['0x...', '0x...', '0x...'],
    threshold: 2
  },
  safeDeploymentConfig: {
    saltNonce, // Optional
    safeVersion // Optional
  }
}
  
let protocolKit = await Safe.init({
  provider,
  signer,
  predictedSafe
})
  
// you can predict the address of your Safe if the Safe version is `v1.3.0` or above
const safeAddress = await protocolKit.getAddress()
  
const deploymentTransaction = await protocolKit.createSafeDeploymentTransaction()
  
// Execute this transaction using the integrated signer or your preferred external Ethereum client
const client = await protocolKit.getSafeProvider().getExternalSigner()
  
const txHash = await client.sendTransaction({
  to: deploymentTransaction.to,
  value: BigInt(deploymentTransaction.value),
  data: deploymentTransaction.data as `0x${string}`,
  chain: sepolia
})
  
const txReceipt = await client.waitForTransactionReceipt({ hash: txHash })
  
// Reconnect to the newly deployed Safe using the protocol-kit
protocolKit = await protocolKit.connect({ safeAddress })
  
// Confirm the Safe is deployed and fetch properties
console.log('Is Safe deployed:', await protocolKit.isSafeDeployed())
console.log('Safe Address:', await protocolKit.getAddress())
console.log('Safe Owners:', await protocolKit.getOwners())
console.log('Safe Threshold:', await protocolKit.getThreshold())
```

--------------------------------

### Integrate Magic with Safe Smart Accounts (Blog Post)

Source: https://docs.safe.global/resource-hub_page=3

This blog post provides instructions on how to integrate Magic with Safe Smart Accounts, covering the Signer and Permissionless topics.

--------------------------------

### Interact with Safe Smart Accounts using Protocol Kit

Source: https://docs.safe.global/sdk/protocol-kit

The Protocol Kit provides a TypeScript interface to interact with Safe Smart Accounts. It supports creating new Safes, updating configurations, and managing transactions.

```TypeScript
import { ProtocolKit } from "@safe-global/protocol-kit";

// Example usage (conceptual):
// const protocolKit = new ProtocolKit(safeAddress, provider);
// await protocolKit.deploySafe(...);
// await protocolKit.executeTransaction(...);
```

--------------------------------

### Get Messages using curl

Source: https://docs.safe.global/core-api/transaction-service-reference/base

This command demonstrates how to retrieve messages for a Safe account using curl. It requires the Safe account address.

```curl
curl -X GET \
  'YOUR_API_URL/tx-service/base/api/v1/safes/{address}/messages/?limit=10&offset=0' \
  -H 'accept: application/json'
```

--------------------------------

### List Contracts - GET Request

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis

Retrieves a list of known smart contracts with their ABIs. It supports pagination and ordering. The response includes contract details like address, name, logo, and ABI.

```curl
curl -X GET https://safe-transaction-sepolia.safe.global/api/api/v1/contracts/ \
    -H "Accept: application/json" \
    -H "content-type: application/json"
```

--------------------------------

### Retrieve User Operation by Hash - TypeScript

Source: https://docs.safe.global/core-api/transaction-service-reference/sonic

Fetches a user operation by its hash using the Safe4337Pack. This example initializes the pack with provider, signer, bundler URL, and Safe address, then calls getUserOperationByHash.

```TypeScript
import { Safe4337Pack } from '@safe-global/relay-kit'

const safe4337Pack = await Safe4337Pack.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  bundlerUrl: `https://api.pimlico.io/v1/sepolia/rpc?add_balance_override&apikey=${PIMLICO_API_KEY}`,
  options: {
    safeAddress: '0x97566B1eCaCd321736F183117C26ACe1b72F4a1b'
  }
})

const userOperationHash =
  '0x7bf502ad622e62823c971d800033e82e5670fcdd1c19437555fb2d8b7eefd644'

const userOperation = await safe4337Pack.getUserOperationByHash(
  userOperationHash
)

console.log(userOperation)
```

--------------------------------

### Get Module Transaction

Source: https://docs.safe.global/core-api/transaction-service-reference/unichain

This cURL command demonstrates how to retrieve details of a module transaction using its ID. It requires an API key for authorization and specifies the endpoint for the request.

```curl
curl -X GET https://api.safe.global/tx-service/unichain/api/v1/module-transaction/0x3b3b57b3 \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY" \
```

--------------------------------

### Send Off-Chain Message with Specific Message Content

Source: https://docs.safe.global/reference-sdk-starter-kit/offchain-messages/sendoffchainmessage

This example illustrates sending an off-chain message with a specific string content using the `sendOffChainMessage` function. It highlights the parameter structure for the message.

```TypeScript
const messageResult = await offchainMessageClient.sendOffChainMessage({
  message: 'abc'
})

```

--------------------------------

### Configure Hardhat for Safe Contracts

Source: https://docs.safe.global/advanced/smart-account-fallback-handler/smart-account-fallback-handler-tutorial

Updates the `hardhat.config.ts` file to support Safe contracts. It enables unlimited contract size, which is required for Safe contracts due to their bytecode size, and configures the dependency compiler to import necessary Safe contracts like `SafeProxyFactory` and `Safe`.

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-dependency-compiler";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true, // Required for Safe contracts
    },
  },
  dependencyCompiler: {
    paths: [
      "@safe-global/safe-contracts/contracts/proxies/SafeProxyFactory.sol",
      "@safe-global/safe-contracts/contracts/Safe.sol",
    ],
  },
};

export default config;
```

--------------------------------

### Get Enabled Safe Guard with Safe{Core} SDK

Source: https://docs.safe.global/home/glossary

This snippet shows how to retrieve the address of the currently enabled Safe Guard for a Safe account using the Safe{Core} SDK. This is useful for checking existing configurations.

```javascript
import Safe{Core} from "@safe-global/safe-core-sdk";

async function getEnabledSafeGuard(safeSdk: Safe) {
  // Assuming safeSdk is an initialized Safe instance
  const guard = await safeSdk.getGuard();
  return guard;
}
```

--------------------------------

### Get Module Transaction

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis-chain

This curl command demonstrates how to retrieve a transaction executed from a module using its associated module transaction ID. It requires an API key for authorization.

```curl
curl -X GET https://api.safe.global/tx-service/gno/api/v1/module-transaction/0x3b3b57b3 \ 
    -H "Accept: application/json" \ 
    -H "content-type: application/json" \ 
    -H "Authorization: Bearer YOUR_API_KEY" \ 
```

--------------------------------

### Get All Transactions for a Safe

Source: https://docs.safe.global/core-api/transaction-service-reference/optimism

Fetches all transactions associated with a specific Safe address. This includes both token transfers and ether transfers. The API key and chain ID are required for initialization.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 10n,
  apiKey: 'YOUR_API_KEY'
})

const transactions = await apiKit.getAllTransactions(
  '0x5298a93734c3d979ef1f23f78ebb871879a21f22'
)

console.log(transactions)
```

--------------------------------

### Get Multisig Transactions by Origin

Source: https://docs.safe.global/core-api/transaction-service-reference/worldchain

Fetches analytics data for multisig transactions, categorized by their origin. This endpoint is part of the v2 analytics service.

```curl
curl -X GET https://api.safe.global/tx-service/wc/api/v2/analytics/multisig-transactions/by-origin/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY" \

```

--------------------------------

### Create lib Folder for Passkey Logic

Source: https://docs.safe.global/advanced/passkeys/tutorials/react-native

Creates a 'lib' directory at the project root, which will be used to store the application's logic for managing and retrieving passkey data.

```bash
mkdir lib
cd lib
```

--------------------------------

### Get Confirmations for Multisig Transaction (cURL)

Source: https://docs.safe.global/core-api/transaction-service-reference/avalanche

Retrieves a list of confirmations for a specific multisig transaction using its hash. Supports pagination with limit and offset query parameters.

```cURL
curl -X GET https://api.safe.global/tx-service/avax/api/v1/safe-operations/0x597ba36c626a32a4fcc9f23a4b25605ee30b46584918d6b6442387161dc3c51b/confirmations/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY"
```

--------------------------------

### Configure Hardhat for Safe Contracts

Source: https://docs.safe.global/advanced/smart-account-guards/smart-account-guard-tutorial

Updates the `hardhat.config.ts` file to enable unlimited contract size and include Safe Global contracts like `SafeProxyFactory` and `Safe`. This configuration is necessary for compiling Safe contracts due to their bytecode size.

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-dependency-compiler";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true, // Required for Safe contracts
    },
  },
  dependencyCompiler: {
    paths: [
      "@safe-global/safe-contracts/contracts/proxies/SafeProxyFactory.sol",
      "@safe-global/safe-contracts/contracts/Safe.sol",
    ],
  },
};

export default config;
```

--------------------------------

### Get Multisig Transactions by Origin

Source: https://docs.safe.global/core-api/transaction-service-reference/avalanche

Retrieves analytics data for multisig transactions, categorized by their origin. This endpoint is part of the v2 analytics service.

```curl
curl -X GET https://api.safe.global/tx-service/avax/api/v2/analytics/multisig-transactions/by-origin/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY" \

```

--------------------------------

### Get Safe Creation Status - curl

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis

A cURL command to retrieve the creation status of a Safe. This command targets the Safe API endpoint with a specific Safe address.

```curl
curl -X GET "/api/v1/safes/{address}/creation/" -H "accept: application/json"
```

--------------------------------

### Initialize Protocol Kit with Deployed Safe

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Initializes the Protocol Kit with a deployed Safe account by providing the `safeAddress` property. This is the standard way to connect to an existing Safe.

```typescript
import Safe from '@safe-global/protocol-kit'

const protocolKit = await Safe.init({
  provider,
  signer,
  safeAddress: '0x...'
})
```

--------------------------------

### Get Message

Source: https://docs.safe.global/core-api/transaction-service-reference/avalanche

Retrieves detailed information about a message using its message hash. Requires Safe API Kit, chainId, apiKey, and the messageHash.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 43114n,
  apiKey: 'YOUR_API_KEY'
})

const messageHash =
  '0x950cfe6090e742b709ab5f662c10c8b4e06d403a2f8c4654d86af45d93fa3777'

const message = await apiKit.getMessage(messageHash)

console.log(message)
```

--------------------------------

### Get Message

Source: https://docs.safe.global/core-api/transaction-service-reference/chiado

Retrieves detailed information about a message using its message hash. Requires the Safe API Kit initialization. The response includes message details, confirmations, and signatures.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 10200n,
  apiKey: 'YOUR_API_KEY'
})

const messageHash =
  '0x950cfe6090e742b709ab5f662c10c8b4e06d403a2f8c4654d86af45d93fa3777'

const message = await apiKit.getMessage(messageHash)

console.log(message)
```

--------------------------------

### Get Safe Nonce using SafeClient

Source: https://docs.safe.global/reference-sdk-starter-kit/safe-client/getnonce

This snippet demonstrates how to use the `getNonce` method from the `safeClient` object to retrieve the nonce of the connected Safe account. It assumes `safeClient` has been properly initialized.

```TypeScript
import { safeClient } from './setup.ts'
  
const nonce = await safeClient.getNonce()
```

--------------------------------

### Get User Operation by Hash with Safe4337Pack

Source: https://docs.safe.global/core-api/transaction-service-reference/unichain

This TypeScript code snippet demonstrates how to initialize the Safe4337Pack and then use the `getUserOperationByHash` method to fetch a user operation by its hash. It requires provider details, a signer, a bundler URL, and the Safe address.

```TypeScript
import { Safe4337Pack } from '@safe-global/relay-kit'

const safe4337Pack = await Safe4337Pack.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  bundlerUrl: `https://api.pimlico.io/v1/sepolia/rpc?add_balance_override&apikey=${PIMLICO_API_KEY}`,
  options: {
    safeAddress: '0x97566B1eCaCd321736F183117C26ACe1b72F4a1b'
  }
})

const userOperationHash =
  '0x7bf502ad622e62823c971d800033e82e5670fcdd1c19437555fb2d8b7eefd644'

const userOperation = await safe4337Pack.getUserOperationByHash(
  userOperationHash
)

console.log(userOperation)
```

--------------------------------

### Get Token Data

Source: https://docs.safe.global/core-api/transaction-service-reference/unichain

Retrieves a sample JSON response for token data, including type, address, name, symbol, decimals, logo URI, and trusted status.

```json
{
  "type": "ERC20",
  "address": "0x687e43D0aB3248bDfebFE3E8f9F1AB2B9FcE982d",
  "name": "0x5555.com",
  "symbol": "0x5555.com",
  "decimals": 18,
  "logoUri": "https://safe-transaction-assets.safe.global/tokens/logos/0x687e43D0aB3248bDfebFE3E8f9F1AB2B9FcE982d.png",
  "trusted": false
}
```

--------------------------------

### Replace SafeFactory.deploySafe with Safe.createSafeDeploymentTransaction

Source: https://docs.safe.global/sdk/protocol-kit/guides/migrate-to-v5

This code snippet demonstrates how to replace the SafeFactory.deploySafe method with the Safe.createSafeDeploymentTransaction method for deploying Safe accounts. You will need an Ethereum client to execute the generated deployment transaction.

```javascript
import Safe from '@safe-global/protocol-kit/Safe';
import { ethers } from 'ethers';

// Assuming you have a provider and signer setup
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Replace SafeFactory.deploySafe
// const safeFactory = await SafeFactory.create(signer);
// const safeSdk = await safeFactory.deploySafe({
//   safeAccountConfig: {
//     owners: [
//       '0x...', 
//     ],
//     threshold: 1,
//   },
// });

// With Safe.createSafeDeploymentTransaction
const safeSdk = await Safe.create(signer, {
  owners: [
    '0x...', 
  ],
  threshold: 1,
});

const safeDeploymentTransaction = await safeSdk.createSafeDeploymentTransaction();

// Execute the deployment transaction using your Ethereum client
// const tx = await signer.sendTransaction(safeDeploymentTransaction);
// await tx.wait();

// After deployment, reconnect the Protocol Kit instance
// const newSafeAddress = await safeSdk.getAddress();
// const connectedSafeSdk = await Safe.create(signer, newSafeAddress);

```

--------------------------------

### Get Service Singletons Info - TypeScript

Source: https://docs.safe.global/reference-sdk-api-kit/getservicesingletonsinfo

Retrieves the list of Safe Singleton contracts. This method is part of the API Kit and returns a Promise that resolves to an array of SafeSingletonResponse objects.

```TypeScript
import { apiKit } from './setup.ts'

const singletons = await apiKit.getServiceSingletonsInfo()
```

--------------------------------

### Get Safe Operation by Hash (TypeScript)

Source: https://docs.safe.global/reference-sdk-api-kit/getsafeoperation

Demonstrates how to use the `getSafeOperation` method from the `apiKit` to retrieve a Safe operation by providing its unique hash. This function is asynchronous and returns a Promise that resolves to the Safe operation details.

```TypeScript
import { apiKit } from './setup.ts'

const safeOperationHash = '0x...'

const safeOperation = await apiKit.getSafeOperation(safeOperationHash)
```

```TypeScript
const safeOperation = await apiKit.getSafeOperation(
  '0x...'
)
```

--------------------------------

### Execute Safe Transaction with Options

Source: https://docs.safe.global/reference-sdk-protocol-kit/transactions/executetransaction

This snippet demonstrates how to execute a Safe transaction using the `executeTransaction` function from the Protocol Kit. It includes setting up the transaction details, defining optional transaction parameters like `from`, `gasLimit`, `gasPrice`, `maxFeePerGas`, `maxPriorityFeePerGas`, and `nonce`, and then calling the function.

```TypeScript
import {
  MetaTransactionData,
  OperationType,
  TransactionOptions
} from '@safe-global/types-kit'
import { protocolKit } from './setup.ts'

const transactions: MetaTransactionData[] = [{
  to: '0x...',
  value: '123',
  data: '0x',
  operation: OperationType.Call // Optional
}]
const safeTransaction = await protocolKit.createTransaction({
  transactions
})

const options: TransactionOptions = {
  from: '0x...', // Optional
  gasLimit: '123', // Optional
  gasPrice: '123', // Optional
  maxFeePerGas: '123', // Optional
  maxPriorityFeePerGas: '123', // Optional
  nonce: 123 // Optional
}

const txResponse = await protocolKit.executeTransaction(
  safeTransaction,
  options // Optional
)

```

--------------------------------

### Get Module Transaction

Source: https://docs.safe.global/core-api/transaction-service-reference/aurora

This cURL command demonstrates how to retrieve a transaction executed from a module using its associated module transaction ID. It requires an API key for authorization.

```curl
curl -X GET https://api.safe.global/tx-service/aurora/api/v1/module-transaction/0x3b3b57b3 \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY" \
```

--------------------------------

### Approve Safe Transaction Hash

Source: https://docs.safe.global/reference-sdk-protocol-kit/transaction-signatures/approvetransactionhash

Approves an on-chain Safe transaction hash using the Protocol Kit. This involves creating a transaction, getting its hash, and then approving it with optional transaction parameters.

```typescript
import {
  MetaTransactionData,
  OperationType,
  TransactionOptions
} from '@safe-global/types-kit'
import { protocolKit } from './setup.ts'

const transactions: MetaTransactionData[] = [{
  to: '0x...',
  value: '123',
  data: '0x',
  operation: OperationType.Call // Optional
}]
const safeTransaction = await protocolKit.createTransaction({
  transactions
})
const safeTransactionHash = await protocolKit.getTransactionHash(
  safeTransaction
)

const options: TransactionOptions = {
  from: '0x...', // Optional
  gasLimit: '123', // Optional
  gasPrice: '123', // Optional
  maxFeePerGas: '123', // Optional
  maxPriorityFeePerGas: '123', // Optional
  nonce: 123 // Optional
}

const txResponse = await protocolKit.approveTransactionHash(
  safeTransactionHash,
  options // Optional
)

```

--------------------------------

### Get Safe Creation Status with Safe API Kit

Source: https://docs.safe.global/core-api/transaction-service-reference/unichain

Demonstrates how to use the Safe API Kit to retrieve the creation information for a specific Safe. It initializes the API kit with a chain ID and API key, then calls the getSafeCreationInfo method with a Safe address.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 130n,
  apiKey: 'YOUR_API_KEY'
})

const safeCreationInfo = await apiKit.getSafeCreationInfo(
  '0x5298A93734C3D979eF1f23F78eBB871879A21F22'
)

console.log(safeCreationInfo)
```

--------------------------------

### Initialize Safe API Kit

Source: https://docs.safe.global/reference-sdk-api-kit/constructor

Instantiates the Safe API Kit with chain ID, API key, and an optional transaction service URL. The API key is mandatory unless a custom transaction service URL is provided.

```javascript
import SafeApiKit from '@safe-global/api-kit';

const chainId = 1n;
const txServiceUrl = 'https://...'; // Optional

// How to get an Api key => http://docs.safe.global/core-api/how-to-use-api-keys
const apiKit = new SafeApiKit({
  chainId,
  txServiceUrl, // Optional
  apiKey: 'YOUR_API_KEY' //  Mandatory if txServiceUrl is not specified
});
```

```javascript
const apiKit = new SafeApiKit({
  chainId: 1n,
  apiKey: 'YOUR_API_KEY'
});
```

```javascript
const apiKit = new SafeApiKit({
  chainId: 1n,
  txServiceUrl: 'https://...'
});
```

--------------------------------

### Execute CoW Swap using Safe Smart Account

Source: https://docs.safe.global/home/ai-agent-actions/ai-agent-swaps-with-cow-swap

Assembles and executes a swap transaction using the CoW Swap SDK and a Safe Smart Account. This involves setting up trader parameters, defining trade parameters, and optionally advanced settings for signing schemes. The process includes getting a pre-sign transaction, creating a Safe transaction, and executing it.

```typescript
import {
  SwapAdvancedSettings,
  TradeParameters,
  TradingSdk,
  SupportedChainId,
  OrderKind,
  SigningScheme,
} from "@cowprotocol/cow-sdk";
import { VoidSigner } from "@ethersproject/abstract-signer";
import { JsonRpcProvider } from "@ethersproject/providers";
import { defineChain, createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { MetaTransactionData, OperationType } from "@safe-global/safe-core-sdk-types";

const RPC_URL = "YOUR_RPC_URL"; // Replace with your RPC URL
const AGENT_PRIVATE_KEY = "YOUR_AGENT_PRIVATE_KEY"; // Replace with your agent's private key
const SAFE_ADDRESS = "YOUR_SAFE_ADDRESS"; // Replace with your Safe address
const WETH_ADDRESS = "YOUR_WETH_ADDRESS"; // Replace with WETH address
const COW_ADDRESS = "YOUR_COW_ADDRESS"; // Replace with COW address
const INPUT_AMOUNT = "YOUR_INPUT_AMOUNT"; // Replace with the amount to swap

const preExistingSafe = await Safe.init({
  provider: RPC_URL,
  signer: AGENT_PRIVATE_KEY,
  safeAddress: SAFE_ADDRESS,
});

const traderParams = {
  chainId: SupportedChainId.SEPOLIA,
  signer: new VoidSigner(
    SAFE_ADDRESS, // Use SAFE_ADDRESS as smartContractWalletAddress
    new JsonRpcProvider("https://sepolia.gateway.tenderly.co")
  ),
  appCode: "awesome-app",
};

const cowSdk = new TradingSdk(traderParams, { logs: false });

const parameters: TradeParameters = {
  kind: OrderKind.SELL,
  sellToken: WETH_ADDRESS,
  sellTokenDecimals: 18,
  buyToken: COW_ADDRESS,
  buyTokenDecimals: 18,
  amount: INPUT_AMOUNT,
};

const advancedParameters: SwapAdvancedSettings = {
  quoteRequest: {
  // Specify the signing scheme
  signingScheme: SigningScheme.PRESIGN,
  },
};

const orderId = await cowSdk.postSwapOrder(parameters, advancedParameters);

console.log(`Order ID: [${orderId}]`);

const preSignTransaction = await cowSdk.getPreSignTransaction({
  orderId,
  account: SAFE_ADDRESS, // Use SAFE_ADDRESS here
});

const customChain = defineChain({
  ...sepolia,
  name: "custom chain",
  transport: http(RPC_URL),
});

const publicClient = createPublicClient({
  chain: customChain,
  transport: http(RPC_URL),
});

const safePreSignTx: MetaTransactionData = {
  to: preSignTransaction.to,
  value: preSignTransaction.value,
  data: preSignTransaction.data,
  operation: OperationType.Call,
};

const safeTx = await preExistingSafe.createTransaction({
  transactions: [safePreSignTx],
  onlyCalls: true,
});

// You might need to collect more signatures here

const txResponse = await preExistingSafe.executeTransaction(safeTx);
console.log(`Sent tx hash: [${txResponse.hash}]`);
console.log("Waiting for the tx to be mined");
await publicClient.waitForTransactionReceipt({
  hash: txResponse.hash as `0x${string}`,
});
```

--------------------------------

### List User Operations

Source: https://docs.safe.global/core-api/transaction-service-reference/aurora

This snippet shows how to retrieve a list of UserOperations associated with a Safe account. It uses a GET request and allows for optional query parameters like ordering, limit, and offset for pagination.

```bash
curl -X GET https://api.safe.global/tx-service/aurora/api/v1/safes/0xcd2E72aEBe2A203b84f46DEEC948E6465dB51c75/user-operations/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY"
```

--------------------------------

### Create Material UI Theme Provider

Source: https://docs.safe.global/home/passkeys-tutorials/safe-passkeys-tutorial

Sets up a Material UI ThemeProvider to make the Safe theme available to library components. This is necessary because library components might not automatically inherit the theme context from a regular ThemeProvider.

```typescript
import { ThemeProvider, useMediaQuery, type Theme } from '@mui/material'
import type { Shadows } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import type { TypographyOptions } from '@mui/material/styles/createTypography'
import { type FC } from 'react'

// This component is necessary to make the theme available in the library components

// Is not enough wrapping the client app with the regular ThemeProvider as the library components

// are not aware of the theme context:

// https://github.com/mui/material-ui/issues/32806
```

--------------------------------

### Configure SafeProvider with Private Key

Source: https://docs.safe.global/sdk/react-hooks/guides/send-transactions

Sets up the configuration for SafeProvider, including the chain (sepolia), RPC URL, and signer's private key. It also defines Safe account options like owners and threshold for new deployments.

```typescript
const SIGNER_ADDRESS = // ...
const SIGNER_PRIVATE_KEY = // ...

const RPC_URL = 'https://rpc.ankr.com/eth_sepolia'

const config = createConfig({
  chain: sepolia,
  provider: RPC_URL,
  signer: SIGNER_PRIVATE_PRIVATE_KEY,
  safeOptions: {
    owners: [SIGNER_ADDRESS],
    threshold: 1
  }
})
```

--------------------------------

### Get User Operation by Hash in TypeScript

Source: https://docs.safe.global/core-api/transaction-service-reference/linea

This TypeScript code snippet demonstrates how to initialize the Safe4337Pack and then use the `getUserOperationByHash` method to fetch a user operation by its hash. It requires provider, signer, bundler URL, and safe address for initialization.

```TypeScript
import { Safe4337Pack } from '@safe-global/relay-kit'  

const safe4337Pack = await Safe4337Pack.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  bundlerUrl: `https://api.pimlico.io/v1/sepolia/rpc?add_balance_override&apikey=${PIMLICO_API_KEY}`,
  options: {
    safeAddress: '0x97566B1eCaCd321736F183117C26ACe1b72F4a1b'
  }
})

const userOperationHash =
  '0x7bf502ad622e62823c971d800033e82e5670fcdd1c19437555fb2d8b7eefd644'

const userOperation = await safe4337Pack.getUserOperationByHash(
  userOperationHash
)

console.log(userOperation)
```

--------------------------------

### Connect to Existing Safe with Protocol Kit

Source: https://docs.safe.global/reference-sdk-protocol-kit/initialization/connect

Initializes a new Protocol Kit instance connected to an existing Safe account using its address. This method allows specifying a signer for transaction authorization.

```javascript
import Safe from '@safe-global/protocol-kit'

const protocolKit = Safe.init({
  // ...
})

const newProtocolKit = await protocolKit.connect({
  signer, // Optional
  safeAddress: '0x...' // Optional
})

```

--------------------------------

### Get Safe Message Hash

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Calculates the Safe message hash for a given message, ensuring compatibility with the CompatibilityFallbackHandler's getMessageHash method.

```javascript
const rawMessage = ... // String or EIP-712 typed data
const messageHash = hashSafeMessage(rawMessage)
const safeMessageHash = await protocolKit.getSafeMessageHash(messageHash)
```

--------------------------------

### Get Safes by Owner Address

Source: https://docs.safe.global/reference-sdk-api-kit/getsafesbyowner

Retrieves a list of Safes where a given address is an owner. This function is part of the Safe{Core} API Kit and requires the owner's address as input.

```TypeScript
import { apiKit } from './setup.ts'

const ownerAddress = '0x...'

const decodedData = await apiKit.getSafesByOwner(ownerAddress)
```

```TypeScript
const decodedData = await apiKit.getSafesByOwner(
  '0x...'
)
```

--------------------------------

### Get Safe Creation Status with Safe API Kit

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis-chain

Demonstrates how to use the Safe API Kit to retrieve the creation information for a specific Safe address. It initializes the API kit with a chain ID and API key, then calls the `getSafeCreationInfo` method with a Safe address.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'
  
const apiKit = new SafeApiKit({
  chainId: 100n,
  apiKey: 'YOUR_API_KEY'
})
  
const safeCreationInfo = await apiKit.getSafeCreationInfo(
  '0x5298A93734C3D979eF1f23F78eBB871879A21F22'
)
  
console.log(safeCreationInfo)
```

--------------------------------

### Initialize Safe API Kit

Source: https://docs.safe.global/sdk/protocol-kit/guides/execute-transactions

Creates an instance of the SafeApiKit to interact with the Safe Transaction Service. Requires chainId and an API key for supported chains.

```javascript
const apiKit = new SafeApiKit({
  chainId: 11155111n,
  apiKey: 'YOUR_API_KEY'
})
```

--------------------------------

### Get Specific Contract

Source: https://docs.safe.global/core-api/safe-decoder-service-reference

Fetches a paginated list of contracts matching a given EIP-55 checksummed address. The response includes contract details similar to the list contracts endpoint.

```curl
curl -X GET https://safe-decoder.safe.global/api/v1/contracts/0x0408EF011960d02349d50286D20531229BCef773 \
    -H "Accept: application/json" \
    -H "content-type: application/json"
```

--------------------------------

### SafeProxy Contract Reference

Source: https://docs.safe.global/reference-smart-account/deployment/SafeProxy

Provides a reference to the SafeProxy.sol smart contract file. This contract is a key part of the Safe{Core} ecosystem, enabling gas-efficient deployment of Smart Accounts by acting as a proxy.

```Solidity
contract SafeProxy {
  // ... implementation details ...
}
```

--------------------------------

### Connect Safe Address to Protocol Kit

Source: https://docs.safe.global/sdk/protocol-kit/guides/safe-deployment

Connects a new Safe address to the Protocol Kit instance. After connecting, you can verify if the Safe is deployed, retrieve its address, owners, and threshold.

```JavaScript
const newProtocolKit = await protocolKit.connect({
  safeAddress
})

const isSafeDeployed = await newProtocolKit.isSafeDeployed() // True
const safeAddress = await newProtocolKit.getAddress()
const safeOwners = await newProtocolKit.getOwners()
const safeThreshold = await newProtocolKit.getThreshold()
```

--------------------------------

### getStorageAt Function Interface and Usage Example

Source: https://docs.safe.global/reference-smart-account/utilities/getStorageAt

This snippet shows the interface definition for the `getStorageAt` function within the `ISafe` interface and demonstrates its usage in a Solidity contract to read storage at offset 0 with a length of 1.

```Solidity
interface ISafe {
    function getStorageAt(uint256 offset, uint256 length) external view returns (bytes);
}

contract Example {
    function example() ... {
        (ISafe safe).getStorageAt(0, 1);
    }
}
```

--------------------------------

### Get Multisig Transactions by Origin

Source: https://docs.safe.global/core-api/transaction-service-reference/base

Retrieves analytics data for multisig transactions, categorized by their origin. This endpoint does not return a response body upon success.

```curl
curl -X GET https://api.safe.global/tx-service/base/api/v2/analytics/multisig-transactions/by-origin/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY" \
```

--------------------------------

### API Kit Constructor Changes (v1 to v2)

Source: https://docs.safe.global/sdk/api-kit/guides/migrate-to-v2

Demonstrates the updated Safe API Kit constructor, showing how to initialize it with a chain ID instead of a transaction service URL in environments where a Transaction Service is available. It also covers specifying a custom Transaction Service URL.

```javascript
import SafeApiKit from '@safe-global/api-kit'

// old:
const apiKit = new SafeApiKit({
  txServiceUrl: 'https://your-transaction-service-url',
  ethAdapter
})

// new:
const chainId: bigint = 1n
const apiKit = new SafeApiKit({
  chainId
})

// or set a custom Transaction Service
const apiKit = new SafeApiKit({
  chainId,
  txServiceUrl: 'https://your-transaction-service-url'
})
```

--------------------------------

### Get Message

Source: https://docs.safe.global/core-api/transaction-service-reference/ink

Retrieves detailed information about a message using its message hash. This function requires the Safe API Kit and the message hash as input.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 57073n,
  apiKey: 'YOUR_API_KEY'
})

const messageHash =
  '0x950cfe6090e742b709ab5f662c10c8b4e06d403a2f8c4654d86af45d93fa3777'

const message = await apiKit.getMessage(messageHash)

console.log(message)
```

--------------------------------

### Deploy New Safe Metadata

Source: https://docs.safe.global/home/ai-agent-setup

Defines the metadata for deploying a new Safe multisig wallet on the Sepolia network. It specifies the schema for the deployment call.

```typescript
export const deployNewSafeMetadata = {
  name: "deployNewSafe",
  description: "Call to deploy a new 1-1 Safe Multisig on Sepolia.",
  schema: z.object({}),
};
```

--------------------------------

### Initialize SafeProvider with createConfig

Source: https://docs.safe.global/reference-sdk-react-hooks/safeprovider

This code snippet demonstrates how to initialize the SafeProvider by creating a configuration object using `createConfig`. It sets up the chain, provider, signer, and Safe options like owners and threshold, then renders the App component within the SafeProvider.

```jsx
import ReactDOM from 'react-dom/client'
import { createConfig, SafeProvider } from '@safe-global/safe-react-hooks'
import { sepolia } from 'viem/chains'
import App from './App.tsx'

const config = createConfig({
  chain: sepolia,
  provider,
  signer,
  safeOptions: {
    owners: ['0x...', '0x...', '0x...'],
    threshold: 2
  }
})

const root = document.getElementById('root')

ReactDOM.createRoot(root).render(
  <SafeProvider config={config}>
    <App />
  </SafeProvider>
)
```

--------------------------------

### List Safe Operations

Source: https://docs.safe.global/core-api/transaction-service-reference/sonic

Retrieves a list of SafeOperations for a specified Safe account. This GET request supports various query parameters for filtering and ordering the results, and requires an API key for authorization.

```bash
curl -X GET https://api.safe.global/tx-service/sonic/api/v1/safes/0xcd2E72aEBe2A203b84f46DEEC948E6465dB51c75/safe-operations/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY"
```

--------------------------------

### Get Safe Contract Version with Protocol Kit

Source: https://docs.safe.global/reference-sdk-protocol-kit/safe-info/getcontractversion

This snippet demonstrates how to use the `getContractVersion` method from the Protocol Kit to retrieve the version of the connected Safe contract. It requires an initialized Protocol Kit instance.

```TypeScript
import { protocolKit } from './setup.ts'  

const contractVersion = protocolKit.getContractVersion()
```

--------------------------------

### Initialize Safe API Kit

Source: https://docs.safe.global/sdk/api-kit/guides/propose-and-confirm-transactions

Initializes the Safe API Kit with a chain ID and an API key for interacting with the Safe Transaction Service. Supports custom service URLs.

```javascript
// How to get an Api key => http://docs.safe.global/core-api/how-to-use-api-keys
const apiKit = new SafeApiKit({
  chainId: 1n,
  apiKey: 'YOUR_API_KEY'
})

// Alternatively, you can use a custom service using the optional `txServiceUrl` property.
const apiKit = new SafeApiKit({
  chainId: 1n, // set the correct chainId
  txServiceUrl: 'https://url-to-your-custom-service'
})
```

--------------------------------

### Deploy Safe Smart Account with AI Agent and Human Signers

Source: https://docs.safe.global/home/ai-agent-quickstarts/human-approval

This code snippet demonstrates how to programmatically initialize and deploy a Safe Smart Account using the Safe Protocol Kit. It configures the account with an AI agent and two human signers, setting a 2-out-of-3 threshold for security. The deployment occurs upon the first transaction execution.

```javascript
import Safe from '@safe-global/protocol-kit'

const AGENT_ADDRESS = // ...
const AGENT_PRIVATE_KEY = // ...
const HUMAN_SIGNER_1_ADDRESS = // ...
const HUMAN_SIGNER_2_ADDRESS = // ...
const RPC_URL = 'https://rpc.ankr.com/eth_sepolia'

const newSafe = await Safe.init({
  provider: RPC_URL,
  signer: AGENT_PRIVATE_KEY,
  safeOptions: {
    owners: [AGENT_ADDRESS, HUMAN_SIGNER_1_ADDRESS, HUMAN_SIGNER_2_ADDRESS],
    threshold: 2
  }
})
```

--------------------------------

### Get Safe Creation Status via API

Source: https://docs.safe.global/core-api/transaction-service-reference/unichain

Illustrates how to fetch the creation status of a Safe using a cURL command. This request targets the /tx-service/unichain/api/v1/safes/{address}/creation/ endpoint, specifying the Safe's address.

```curl
curl -X GET "/tx-service/unichain/api/v1/safes/{address}/creation/" -H "accept: application/json"
```

--------------------------------

### Get Safe Delegates using Safe{Core} SDK

Source: https://docs.safe.global/core-api/transaction-service-guides/delegates

Initializes the Safe API Kit and retrieves a list of delegates associated with a specific Safe account. Requires an API key and chain ID.

```typescript
// Initialize the API Kit
// How to get an Api key => http://docs.safe.global/core-api/how-to-use-api-keys
const apiKit = new SafeApiKit({
  chainId: 11155111n,
  apiKey: 'YOUR_API_KEY'
})

// Get the Safe delegates
const delegates = await apiKit.getSafeDelegates({
  delegatorAddress: config.SAFE_ADDRESS
})
```

--------------------------------

### Deploy Safe Contracts

Source: https://docs.safe.global/resource-hub_page=2

This tutorial provides instructions on how to deploy Safe contracts onto a blockchain. It is intended for developers who need to set up their own Safe instances.

```Solidity
// Example of deploying a Safe contract using a factory pattern
// This is a simplified representation and would require the actual Safe deployment scripts
// import "@safe-global/safe-ethers-lib/dist/src/SafeFactory";

// async function deploySafeContract(signer, safeMasterCopyAddress) {
//   const safeFactory = await SafeFactory.create({
//     // Factory configuration
//   });
//   const safeAccountConfig = {
//     owners: [await signer.getAddress()],
//     threshold: 1,
//     // other configuration
//   };
//   const safeAddress = await safeFactory.deploySafe({ safeAccountConfig });
//   return safeAddress;
// }
```

--------------------------------

### Send Transactions with Safe React Hooks

Source: https://docs.safe.global/sdk/react-hooks

This guide demonstrates how to send transactions using the Safe React Hooks. It is built on top of the Starter Kit and leverages the Safe{Core} SDK to abstract complex logic, allowing for easy integration into React applications.

```javascript
import { useSafeAppsSDK } from '@safe-global/safe-apps-sdk';

function MyComponent() {
  const { safe } = useSafeAppsSDK();

  const sendTx = async () => {
    if (!safe) return;

    const tx = {
      to: '0x...',
      value: '0x0',
      data: '0x',
    };

    await safe.send(tx);
  };

  return (
    <button onClick={sendTx}>Send Transaction</button>
  );
}
```

```typescript
import { useSafeAppsSDK } from '@safe-global/safe-apps-sdk';
import { SafeInfo } from '@safe-global/safe-apps-sdk';

function MyComponent() {
  const { safe } = useSafeAppsSDK();

  const sendTx = async () => {
    if (!safe) return;

    const tx = {
      to: '0x...',
      value: '0x0',
      data: '0x',
    };

    await safe.send(tx);
  };

  return (
    <button onClick={sendTx}>Send Transaction</button>
  );
}
```

--------------------------------

### Get Token List - TypeScript

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis

Retrieves a list of tokens supported by the Safe Transaction Service on Ethereum Sepolia. This function requires the SafeApiKit to be initialized with the correct chain ID.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'  

const apiKit = new SafeApiKit({
  chainId: 11155111n  
})

const tokenList = await apiKit.getTokenList()

console.log(tokenList)
```

--------------------------------

### Initialize Safe Protocol Kit and API Kit

Source: https://docs.safe.global/core-api/transaction-service-reference/ink

Initializes the Safe Protocol Kit with provider and signer details, and the Safe API Kit with chain ID and API key. It then creates a message, signs it, and logs the signature. Finally, it adds the signed message to the API.

```TypeScript
import Safe from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'

const safeAddress = '0x5298a93734c3d979ef1f23f78ebb871879a21f22'

const protocolKit = await Safe.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  safeAddress
})

const apiKit = new SafeApiKit({
  chainId: 57073n,
  apiKey: 'YOUR_API_KEY'
})

const rawMessage = '1: string message'
const safeMessage = protocolKit.createMessage(rawMessage)
const signedMessage = await protocolKit.signMessage(safeMessage, 'eth_sign')

console.log({
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})

apiKit.addMessage(safeAddress, {
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})
```

--------------------------------

### Define Safe Transaction

Source: https://docs.safe.global/sdk/react-hooks/guides/send-transactions

Defines an array of transactions to be executed by the Safe account. Each transaction object includes the recipient address, data payload, and value.

```typescript
const transactions = [{
  to: '0x...',
  data: '0x',
  value: '0'
}]
```

--------------------------------

### Extend SafeClient with SafeOperations

Source: https://docs.safe.global/reference-sdk-starter-kit/safe-operations

Demonstrates how to extend the SafeClient with the `safeOperations` functionality, configuring both bundler and paymaster options for ERC-4337 transactions. This includes setting the bundler URL and various optional paymaster configurations like sponsorship, URL, policy ID, address, token address, and approval amount.

```typescript
import { PaymasterOptions } from '@safe-global/relay-kit'
import { BundlerOptions, safeOperations } from '@safe-global/sdk-starter-kit'
import { safeClient } from './setup.ts'

const bundlerOptions: BundlerOptions = {
  bundlerUrl: 'https://...'
}

const paymasterOptions: PaymasterOptions = {
  isSponsored: true, // Optional
  paymasterUrl: 'https://...', // Optional
  sponsorshipPolicyId: 'abc', // Optional
  paymasterAddress: '0x...', // Optional
  paymasterTokenAddress: '0x...', // Optional
  amountToApprove: 123n // Optional
}

const safeOperationsClient = await safeClient.extend(
  safeOperations(bundlerOptions, paymasterOptions)
)
```

--------------------------------

### Get User Operation by Hash using Safe4337Pack

Source: https://docs.safe.global/core-api/transaction-service-reference/bsc

This TypeScript code snippet demonstrates how to initialize the Safe4337Pack and retrieve a user operation by its hash. It requires provider details, a signer, bundler URL, and Safe address.

```TypeScript
import { Safe4337Pack } from '@safe-global/relay-kit'  

const safe4337Pack = await Safe4337Pack.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  bundlerUrl: `https://api.pimlico.io/v1/sepolia/rpc?add_balance_override&apikey=${PIMLICO_API_KEY}`,
  options: {
    safeAddress: '0x97566B1eCaCd321736F183117C26ACe1b72F4a1b'
  }
})

const userOperationHash =
  '0x7bf502ad622e62823c971d800033e82e5670fcdd1c19437555fb2d8b7eefd644'

const userOperation = await safe4337Pack.getUserOperationByHash(
  userOperationHash
)

console.log(userOperation)
```

--------------------------------

### Use Passkeys with Safe

Source: https://docs.safe.global/resource-hub

This tutorial video explains how to use a passkey as a signer for a Safe in three simple steps, enhancing security and user experience.

```English
In this tutorial video, you will learn how to use a passkey as a signer for a Safe in three simple steps.
```

--------------------------------

### Integrate ERC-4337 Safe Accounts with Relay Kit

Source: https://docs.safe.global/sdk/relay-kit

This guide explains how to integrate ERC-4337 Safe accounts using the Relay Kit. It covers the necessary steps and configurations for enabling this functionality within your project.

```javascript
import { RelayKit } from "@safe-global/relay-kit";

// Example usage (replace with actual implementation)
async function integrateERC4337() {
  const relayKit = new RelayKit();
  // ... integration logic ...
  console.log("ERC-4337 Safe accounts integrated with Relay Kit.");
}
```

--------------------------------

### Add Safe Operation with Safe4337Pack

Source: https://docs.safe.global/reference-sdk-api-kit/addsafeoperation

Demonstrates how to add a Safe operation using the `Safe4337Pack` and the `apiKit`. It includes the necessary imports, defines a `userOperation` object, and configures the `addSafeOperation` call with `entryPoint`, `moduleAddress`, `safeAddress`, and optional `options`.

```typescript
import { AddSafeOperationProps } from '@safe-global/api-kit'
import { apiKit } from './setup.ts'

const userOperation = {
  sender: '0x...',
  nonce: '10',
  initCode: '0x...',
  callData: '0x...',
  callGasLimit: 123n,
  verificationGasLimit: 123n,
  preVerificationGas: 123n,
  maxFeePerGas: 123n,
  maxPriorityFeePerGas: 123n,
  paymasterAndData: '0x...',
  signature: '0x...'
}

const config: AddSafeOperationProps = {
  entryPoint: '0x...',
  moduleAddress: '0x...',
  safeAddress: '0x...',
  userOperation,
  options: { // Optional
    validAfter: currentTimestamp - 60_000, // Optional
    validUntil: currentTimestamp + 60_000 // Optional
  }
}

await apiKit.addSafeOperation(config)
```

--------------------------------

### Get Safe Info with useSafe Hook

Source: https://docs.safe.global/reference-sdk-react-hooks/usesafe/getsafeinfo

Demonstrates how to use the `useSafe` hook to access the `getSafeInfo` function and display the returned data. It imports necessary types and hooks from the `@safe-global/safe-react-hooks` library.

```javascript
import { useSafeInfo } from '@safe-global/safe-react-hooks'

function SafeInfo() {
  const { getSafeInfo } = useSafe()
  const { data } = getSafeInfo()

  return (
    <>
      {data && JSON.stringify(data)}
    </>
  )
}

export default SafeInfo
```

--------------------------------

### Create and Sign Message

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Demonstrates how to create a message object from raw data and then sign it using the Safe{Core} SDK's `signMessage` function. This is the fundamental process for signing messages.

```TypeScript
const rawMessage: string | EIP712TypedData = 'I am the owner of this Safe';
const message = protocolKit.createMessage(rawMessage);
const signedMessage = await protocolKit.signMessage(message);
```

--------------------------------

### Create Math Tool File

Source: https://docs.safe.global/home/ai-agent-setup

Command to create a new TypeScript file for math-related tools within the 'tools' directory.

```bash
touch tools/math.ts
```

--------------------------------

### Create Migration Script File

Source: https://docs.safe.global/advanced/smart-account-migration

This command sequence demonstrates how to create the necessary directory and the `migrate.ts` file for the Safe migration script using standard bash commands.

```bash
mkdir src
touch src/migrate.ts
```

--------------------------------

### Initialize Safe Protocol Kit and API Kit, Create and Sign Message

Source: https://docs.safe.global/core-api/transaction-service-reference/aurora

This TypeScript snippet demonstrates how to initialize the Safe Protocol Kit and Safe API Kit. It then shows how to create a message, sign it using 'eth_sign', and log the message and signature. Finally, it adds the signed message to the Safe API.

```TypeScript
import Safe from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'

const safeAddress = '0x5298a93734c3d979ef1f23f78ebb871879a21f22'

const protocolKit = await Safe.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  safeAddress
})

const apiKit = new SafeApiKit({
  chainId: 1313161554n,
  apiKey: 'YOUR_API_KEY'
})

const rawMessage = '1: string message'
const safeMessage = protocolKit.createMessage(rawMessage)
const signedMessage = await protocolKit.signMessage(safeMessage, 'eth_sign')

console.log({
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})

apiKit.addMessage(safeAddress, {
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})
```

--------------------------------

### Get Safe Operations via cURL

Source: https://docs.safe.global/core-api/transaction-service-reference/ink

This snippet demonstrates how to fetch safe operations using a cURL command. It specifies the API endpoint, required headers like Accept, Content-Type, and Authorization with a placeholder for the API key.

```bash
curl -X GET https://api.safe.global/tx-service/ink/api/v1/safe-operations/0x597ba36c626a32a4fcc9f23a4b25605ee30b46584918d6b6442387161dc3c51b/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY"
```

--------------------------------

### Extend SafeClient with Offchain Messages

Source: https://docs.safe.global/reference-sdk-starter-kit/offchain-messages

This snippet demonstrates how to extend the SafeClient with the offChainMessages functionality from the Safe SDK Starter Kit. It imports the necessary modules and applies the extension to an existing SafeClient instance.

```typescript
import { offChainMessages } from '@safe-global/sdk-starter-kit'
import { safeClient } from './setup.ts'

const offchainMessagesClient = safeClient.extend(offChainMessages())
```

--------------------------------

### Get Safe Account Threshold

Source: https://docs.safe.global/reference-smart-account/owners/getThreshold

Retrieves the current threshold (minimum number of signatures required) for a Safe account. This is a view function that does not modify the blockchain state.

```Solidity
interface ISafe {
    function getThreshold() external view returns (uint256);
}

contract Example {
    function example(ISafe safe) public {
        uint256 threshold = safe.getThreshold();
    }
}
```

--------------------------------

### Get Message

Source: https://docs.safe.global/core-api/transaction-service-reference/base

Retrieves detailed information about a message using its message hash. Requires Safe API Kit and the message hash. The response includes message details, creator, and confirmations.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 8453n,
  apiKey: 'YOUR_API_KEY'
})

const messageHash =
  '0x950cfe6090e742b709ab5f662c10c8b4e06d403a2f8c4654d86af45d93fa3777'

const message = await apiKit.getMessage(messageHash)

console.log(message)
```

--------------------------------

### Add User Group Configuration

Source: https://docs.safe.global/config-service-configuration/add-or-edit-group

This snippet shows the URL endpoint for adding a new user group to the configuration. It's a simple GET request to a local development server.

```HTTP
GET http://localhost:8000/cfg/admin/auth/group/add/
```

--------------------------------

### Get Safe Owners with SafeClient

Source: https://docs.safe.global/reference-sdk-starter-kit/safe-client/getowners

Fetches the list of owners for the connected Safe. This method is part of the SafeClient and returns a Promise that resolves to an array of strings, where each string is an owner's address.

```TypeScript
import { safeClient } from './setup.ts'

const owners = await safeClient.getOwners()
```

--------------------------------

### Sign Transaction with Protocol Kit

Source: https://docs.safe.global/reference-sdk-protocol-kit/transaction-signatures/signtransaction

Demonstrates how to create and sign a Safe transaction using Protocol Kit. It includes setting up transactions, creating the Safe transaction object, and signing it with a specified method and optional preimage safe address.

```typescript
import { SigningMethod } from '@safe-global/protocol-kit'
import { MetaTransactionData, OperationType } from '@safe-global/types-kit'
import { protocolKit } from './setup.ts'

const transactions: MetaTransactionData[] = [{
  to: '0x...',
  value: '123',
  data: '0x',
  operation: OperationType.Call // Optional
}]
const safeTransaction = await protocolKit.createTransaction({
  transactions
})

const signingMethod = SigningMethod.ETH_SIGN_TYPED_DATA_V4

const preimageSafeAddress = '0x...'

const signedSafeTransaction = await protocolKit.signTransaction(
  safeTransaction,
  signingMethod, // Optional
  preimageSafeAddress // Optional
)

```

```typescript
const signedSafeTransaction = await protocolKit.signTransaction(
  safeTransaction
)

```

```typescript
const signedSafeTransaction = await protocolKit.signTransaction(
  safeTransaction,
  SigningMethod.ETH_SIGN_TYPED_DATA_V4
)

```

```typescript
const signedSafeTransaction = await protocolKit.signTransaction(
  safeTransaction,
  SigningMethod.ETH_SIGN_TYPED_DATA_V4,
  '0x...'
)

```

--------------------------------

### Get Safe Operation Confirmations

Source: https://docs.safe.global/core-api/transaction-service-reference/optimism

Retrieves a list of confirmations for a specific Safe operation. Supports pagination with limit and offset parameters. Returns confirmation details including owner, signature, and timestamps.

```HTTP
curl -X GET https://api.safe.global/tx-service/oeth/api/v1/safe-operations/0x597ba36c626a32a4fcc9f23a4b25605ee30b46584918d6b6442387161dc3c51b/confirmations/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY"
```

--------------------------------

### Sign Message with Safe Account using SAFE_SIGNATURE

Source: https://docs.safe.global/sdk/protocol-kit/guides/signatures/messages

This example shows how to sign a message using a Safe account. It connects to a Safe (SAFE_1_1_ADDRESS) via its owner (OWNER_3_ADDRESS), signs the message using `SAFE_SIGNATURE`, and then builds a contract signature. This contract signature is then added to the main `safeMessage` object.

```JavaScript
// Create a new message object  
let messageSafe1_1 = await createMessage(TYPED_MESSAGE)

// Connect OWNER_3_ADDRESS and SAFE_1_1_ADDRESS  
protocolKit = await protocolKit.connect({
  provider: RPC_URL,
  signer: OWNER_3_PRIVATE_KEY,
  safeAddress: SAFE_1_1_ADDRESS
})

// Sign the messageSafe1_1 with OWNER_3_ADDRESS  
// After this, the messageSafe1_1 contains the signature from OWNER_3_ADDRESS  
messageSafe1_1 = await signMessage(
  messageSafe1_1,
  SigningMethod.SAFE_SIGNATURE,
  SAFE_3_4_ADDRESS // Parent Safe address  
)

// Build the contract signature of SAFE_1_1_ADDRESS  
const signatureSafe1_1 = await buildContractSignature(
  Array.from(messageSafe1_1.signatures.values()),
  SAFE_1_1_ADDRESS
)

// Add the signatureSafe1_1 to safeMessage  
// After this, the safeMessage contains the signature from OWNER_1_ADDRESS, OWNER_2_ADDRESS and SAFE_1_1_ADDRESS  
safeMessage.addSignature(signatureSafe1_1)
```

--------------------------------

### Build dApps with Safe 4337 Module (Workshop)

Source: https://docs.safe.global/resource-hub_page=2

This workshop focuses on the Safe 4337 Module, detailing the process of building decentralized applications (dApps) that utilize this module. It covers Safe Smart Account and Safe Core SDK.

--------------------------------

### Get Pending Off-Chain Messages (TypeScript)

Source: https://docs.safe.global/reference-sdk-starter-kit/offchain-messages/getpendingoffchainmessages

Retrieves a list of pending off-chain messages that are awaiting confirmation. This method is part of the offchainMessages client and is used in conjunction with `confirmOffChainMessage`.

```TypeScript
import { offchainMessageClient } from './setup.ts'

const pendingMessages = await offchainMessageClient.getPendingOffChainMessages()
```

--------------------------------

### Sign Typed Data with Protocol Kit

Source: https://docs.safe.global/reference-sdk-protocol-kit/transaction-signatures/signtypeddata

Demonstrates how to sign a transaction using `signTypedData` with the Protocol Kit. It includes setting up transaction data, creating the EIP-712 structure, and optionally specifying the method version.

```typescript
import {
  MetaTransactionData,
  OperationType
} from '@safe-global/types-kit'
import { protocolKit } from './setup.ts'

const transactions: MetaTransactionData[] = [{
  to: '0x...',
  value: '123',
  data: '0x',
  operation: OperationType.Call // Optional
}]
const eip712Data = await protocolKit.createTransaction({
  transactions
})

const methodVersion = 'v4'

const signature = await protocolKit.signTypedData(
  eip712Data,
  methodVersion // Optional
)

```

--------------------------------

### Get ERC-20 Token Information

Source: https://docs.safe.global/reference-sdk-api-kit/gettoken

Retrieves the information for a specified ERC-20 token using its address. This function is part of the Safe{Core} SDK and requires an initialized `apiKit` instance.

```typescript
import { apiKit } from './setup.ts'

const tokenAddress = '0x...'

const token = await apiKit.getToken(tokenAddress)
```

```typescript
const token = await apiKit.getToken(
  '0x...'
)
```

--------------------------------

### Build dApps with Safe 4337 Module (Workshop)

Source: https://docs.safe.global/resource-hub_page=3

This workshop focuses on the Safe 4337 Module, detailing the process of building decentralized applications (dApps) that utilize this module. It covers Safe Smart Account and Safe Core SDK.

--------------------------------

### List Messages for a Safe Account using Safe API Kit

Source: https://docs.safe.global/core-api/transaction-service-reference/zksync

This example shows how to initialize the Safe API Kit and retrieve a list of messages associated with a specific Safe account address. It requires the chain ID and an API key for initialization, and the Safe account address for the query.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 324n,
  apiKey: 'YOUR_API_KEY'
})

const safeAddress = '0x5298a93734c3d979ef1f23f78ebb871879a21f22'

const messages = await apiKit.getMessages(safeAddress)

console.log(messages)
```

--------------------------------

### Get All Transactions for a Safe

Source: https://docs.safe.global/core-api/transaction-service-reference/bsc

Retrieves all transactions associated with a given Safe address. This includes both token transfers and ether transfers. The API key is required for authentication.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 56n,
  apiKey: 'YOUR_API_KEY'
})

const transactions = await apiKit.getAllTransactions(
  '0x5298a93734c3d979ef1f23f78ebb871879a21f22'
)

console.log(transactions)
```

--------------------------------

### Initialize Safe4337Pack with custom safeModulesSetupAddress

Source: https://docs.safe.global/sdk/relay-kit/guides/migrate-to-v4

This code snippet demonstrates how to initialize the `Safe4337Pack` with a custom `safeModulesSetupAddress`. This is relevant for migrating to v4 of the Relay Kit, where the method `addModulesLibAddress` was renamed to `safeModulesSetupAddress`.

```javascript
const safe4337Pack = await Safe4337Pack.init({
  provider: window.ethereum, // Or any compatible EIP-1193 provider,
  signer: 'signerAddressOrPrivateKey',
  bundlerUrl: 'https://...',
  customContracts: {
    safeModulesSetupAddress: '0x1234567890123456789012345678901234567890' // Previously addModulesLibAddress
  }
})
```

--------------------------------

### Get Safe Creation Info using Safe API Kit

Source: https://docs.safe.global/core-api/transaction-service-reference/aurora

Demonstrates how to retrieve the creation information for a Safe using the Safe API Kit in TypeScript. It initializes the API kit with chain ID and API key, then calls the `getSafeCreationInfo` method with a Safe address.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 1313161554n,
  apiKey: 'YOUR_API_KEY'
})

const safeCreationInfo = await apiKit.getSafeCreationInfo(
  '0x5298A93734C3D979eF1f23F78eBB871879A21F22'
)

console.log(safeCreationInfo)
```

--------------------------------

### List Multisig Transactions for a Safe

Source: https://docs.safe.global/core-api/transaction-service-reference/xlayer

Fetches all multisignature transactions for a specific Safe address. The API allows filtering and ordering of results using query parameters. The example demonstrates basic retrieval.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 196n,
  apiKey: 'YOUR_API_KEY'
})

const multisigTransactions = await apiKit.getMultisigTransactions(
  '0x5298a93734c3d979ef1f23f78ebb871879a21f22'
)

console.log(multisigTransactions)
```

--------------------------------

### Get Message

Source: https://docs.safe.global/core-api/transaction-service-reference/aurora

Retrieves detailed information about a specific message using its message hash. This function requires the Safe API Kit and the message hash as input.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 1313161554n,
  apiKey: 'YOUR_API_KEY'
})

const messageHash =
  '0x950cfe6090e742b709ab5f662c10c8b4e06d403a2f8c4654d86af45d93fa3777'

const message = await apiKit.getMessage(messageHash)

console.log(message)
```

--------------------------------

### Set Safe Transaction Guard (Solidity)

Source: https://docs.safe.global/reference-smart-account/guards/setGuard

Demonstrates how to set a transaction guard for a Safe smart contract using Solidity. It shows the interface for the Safe contract and an example contract calling the `setGuard` function.

```Solidity
interface ISafe {
    function setGuard(address guard) external;
}

contract Example {
    function example() ... {
        (ISafe safe).setGuard(0x...);
    }
}
```

--------------------------------

### Get Enabled Safe Modules with Protocol Kit

Source: https://docs.safe.global/reference-sdk-protocol-kit/safe-modules/getmodules

Demonstrates how to use the `getModules` function from the Protocol Kit to retrieve a list of all enabled Safe Module addresses. This function is asynchronous and returns a promise that resolves to an array of strings, where each string is a module address.

```TypeScript
import { protocolKit } from './setup.ts'  

const moduleAddresses = await protocolKit.getModules()
```

--------------------------------

### Get Module Transaction (cURL)

Source: https://docs.safe.global/core-api/transaction-service-reference/xlayer

This cURL command retrieves details of a module transaction using its ID. It requires an API key for authorization and specifies the endpoint for the OKXChain (OKB) network.

```curl
curl -X GET https://api.safe.global/tx-service/okb/api/v1/module-transaction/0x3b3b57b3 \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY" \
```

--------------------------------

### Swap Owner using useUpdateOwners Hook

Source: https://docs.safe.global/reference-sdk-react-hooks/useupdateowners/swap

Demonstrates how to use the `swapOwner` function from the `useUpdateOwners` hook to swap an owner of a connected Safe. It includes setting up the necessary variables and triggering the swap via a button click. The example also shows how to display the transaction data upon successful execution.

```typescript
import { useUpdateOwners, SwapOwnerVariables } from '@safe-global/safe-react-hooks'

function SwapOwner() {
  const { swap } = useUpdateOwners()
  const { 
    swapOwner,
    data,
    // ...
  } = swap

  const swapOwnerParams: SwapOwnerVariables = {
    oldOwnerAddress: '0x...',
    newOwnerAddress: '0x...'
  }

  return (
    <>
      <button onClick={() => swapOwner(swapOwnerParams)}>
        Swap Owner
      </button>
      {data && JSON.stringify(data)}
    </>
  )
}

export default SwapOwner
```

--------------------------------

### Get Specific Token Information

Source: https://docs.safe.global/core-api/transaction-service-reference/linea

Retrieves detailed information for a single token supported by the Safe Transaction Service, identified by its address. Requires an API key.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 59144n,
  apiKey: 'YOUR_API_KEY'
})

const token = await apiKit.getToken(
  '0x687e43D0aB3248bDfebFE3E8f9F1AB2B9FcE982d'
)

console.log(token)
```

--------------------------------

### Custom Service Routing in API Kit (v1 to v2)

Source: https://docs.safe.global/sdk/api-kit/guides/migrate-to-v2

Illustrates the change in how custom services are hosted with the Safe API Kit. Previously, custom services were forced under the '/api' route. The new version allows specifying any preferred route or subdomain, with a specific migration step for services previously running under '/api'.

```javascript
// old:
const txServiceUrl = 'https://your-transaction-service-domain/'
const apiKit = new SafeApiKit({
  txServiceUrl,
  ethAdapter
})

// new:
const chainId: bigint = 1n
const txServiceUrl = 'https://your-transaction-service-domain/api'
const apiKit = new SafeApiKit({
  chainId,
  txServiceUrl
})
```

--------------------------------

### Add Message Signature (TypeScript)

Source: https://docs.safe.global/reference-sdk-api-kit/addmessagesignature

Demonstrates how to add a signature to an existing message using the `addMessageSignature` function from the Safe API Kit. It shows the import statement and the function call with example parameters.

```typescript
import { apiKit } from './setup.ts'

const safeMessageHash = '0x...'

const signature = '0x...'

await apiKit.addMessageSignature(safeMessageHash, signature)
```

--------------------------------

### Initialize Safe Protocol Kit and API Kit

Source: https://docs.safe.global/core-api/transaction-service-reference/linea

Initializes the Safe Protocol Kit with provider and signer details, and the Safe API Kit with chain ID and API key. It then creates and signs a message, and adds the signed message to the API.

```TypeScript
import Safe from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'

const safeAddress = '0x5298a93734c3d979ef1f23f78ebb871879a21f22'

const protocolKit = await Safe.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  safeAddress
})

const apiKit = new SafeApiKit({
  chainId: 59144n,
  apiKey: 'YOUR_API_KEY'
})

const rawMessage = '1: string message'
const safeMessage = protocolKit.createMessage(rawMessage)
const signedMessage = await protocolKit.signMessage(safeMessage, 'eth_sign')

console.log({
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})

apiKit.addMessage(safeAddress, {
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})
```

--------------------------------

### Connect to Safe with Signer

Source: https://docs.safe.global/reference-sdk-protocol-kit/initialization/connect

Establishes a connection to a Safe account using a signer, which can be an owner's address, private key, or a passkey object. A provider and the Safe address are also required.

```javascript
const protocolKit = await Safe.connect({
  provider,
  signer: '0x...',
  safeAddress: '0x...'
})

```

--------------------------------

### Get Transfer Details

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis

Retrieves the details of a specific transfer using its unique transfer ID. This endpoint is useful for inspecting transaction history and token movements.

```curl
curl -X GET https://safe-transaction-sepolia.safe.global/api/api/v1/transfer/3b3b57b3 \
    -H "Accept: application/json" \
    -H "content-type: application/json"
```

--------------------------------

### Get Safe Delegates

Source: https://docs.safe.global/core-api/transaction-service-reference/chiado

Retrieves a list of all delegates associated with a Safe. This function requires the Safe's address and optionally accepts parameters for filtering and pagination.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 10200n,
  apiKey: 'YOUR_API_KEY'
})

const delegates = await apiKit.getSafeDelegates({
  safeAddress: '0xb534a6b6f67847cff94fdb94b90345cb45a2c7301'
})

console.log(delegates)
```

```cURL
curl -X GET "https://api.safe.global/tx-service/chi/api/v2/delegates/" -H "accept: application/json"
```

--------------------------------

### Define Signer and RPC URL - Safe SDK

Source: https://docs.safe.global/sdk/starter-kit/guides/send-transactions

Defines constants for the signer's address, private key, and the RPC URL for the Sepolia network. These are used to initialize the Safe client.

```javascript
const SIGNER_ADDRESS = // ...
const SIGNER_PRIVATE_KEY = // ...
const RPC_URL = 'https://rpc.ankr.com/eth_sepolia'
```

--------------------------------

### Get Message

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis-chain

Retrieves detailed information about a specific message using its message hash. The response includes creation and modification timestamps, Safe address, message content, proposer, and confirmations.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 100n,
  apiKey: 'YOUR_API_KEY'
})

const messageHash =
  '0x950cfe6090e742b709ab5f662c10c8b4e06d403a2f8c4654d86af45d93fa3777'

const message = await apiKit.getMessage(messageHash)

console.log(message)
```

--------------------------------

### Get Specific Token Information - TypeScript

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis

Fetches detailed information for a specific token on the Safe Transaction Service using its address. The SafeApiKit must be initialized with the appropriate chain ID.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'  

const apiKit = new SafeApiKit({
  chainId: 11155111n  
})

const token = await apiKit.getToken(
  '0x687e43D0aB3248bDfebFE3E8f9F1AB2B9FcE982d'
)

console.log(token)
```

--------------------------------

### Get Safe Operations via cURL

Source: https://docs.safe.global/core-api/transaction-service-reference/base

This snippet demonstrates how to retrieve safe operations using a cURL command. It specifies the API endpoint, HTTP method, and required headers for authentication and content negotiation.

```bash
curl -X GET https://api.safe.global/tx-service/base/api/v1/safe-operations/0x597ba36c626a32a4fcc9f23a4b25605ee30b46584918d6b6442387161dc3c51b/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY"
```

--------------------------------

### Add Owner Transaction with GasPrice Option

Source: https://docs.safe.global/reference-sdk-protocol-kit/safe-info/createaddownertx

Demonstrates how to set the `gasPrice` option for an add owner transaction, specifying the price in wei the sender is willing to pay per unit of gas.

```TypeScript
const safeTransaction = await protocolKit.createAddOwnerTx(
  {
    ownerAddress: '0x...'
  },
  {
    gasPrice: '123'
  }
)

```

--------------------------------

### Configure getSignerAddress with config Object

Source: https://docs.safe.global/reference-sdk-react-hooks/usesafe/getsigneraddress

This example illustrates how to provide a custom configuration object to the `getSignerAddress` function. It imports a local config file and passes it as an argument.

```javascript
import { config } from './config.ts'

const result = getSignerAddress({
  config
})
```

--------------------------------

### Propose Transaction with Safe SDK

Source: https://docs.safe.global/sdk/api-kit/guides/propose-and-confirm-transactions

Creates a transaction proposal using the Protocol Kit, signs it, and then proposes it to the Safe Transaction Service via the API Kit.

```javascript
// Create transaction
const safeTransactionData: MetaTransactionData = {
  to: '0x',
  value: '1', // 1 wei
  data: '0x',
  operation: OperationType.Call
}

const safeTransaction = await protocolKitOwner1.createTransaction({
  transactions: [safeTransactionData]
})

const safeTxHash = await protocolKitOwner1.getTransactionHash(safeTransaction)
const signature = await protocolKitOwner1.signHash(safeTxHash)

// Propose transaction to the service
await apiKit.proposeTransaction({
  safeAddress: SAFE_ADDRESS,
  safeTransactionData: safeTransaction.data,
  safeTxHash,
  senderAddress: OWNER_1_ADDRESS,
  senderSignature: signature.data
})
```

--------------------------------

### Initialize Protocol Kit with RPC URL Provider

Source: https://docs.safe.global/sdk/protocol-kit/reference/safe

Initializes the Protocol Kit using an RPC URL as the provider. This is useful when you don't have an EIP-1193 compatible provider readily available.

```typescript
import Safe from '@safe-global/protocol-kit'

const rpcURL = 'https://sepolia.infura.io/v3/...'

const protocolKit = await Safe.init({
  provider: rpcURL,
  signer,
  safeAddress: '0x...'
})
```

--------------------------------

### Connect Chiado Safe Address to Protocol Kit

Source: https://docs.safe.global/sdk/protocol-kit/guides/multichain-safe-deployment

Connects the deployed Safe address on Chiado to the Protocol Kit, verifying deployment and retrieving the address.

```JavaScript
const newProtocolKitChiado = await protocolKitChiado.connect({  
  safeAddress: chiadoPredictedSafeAddress  
})  

const isChiadoSafeDeployed = await newProtocolKitChiado.isSafeDeployed() // True  
const chiadoDeployedSafeAddress = await newProtocolKitChiado.getAddress()
```

--------------------------------

### List Safe Operations

Source: https://docs.safe.global/core-api/transaction-service-reference/linea

This snippet shows how to retrieve a list of safe operations for a specific Safe account using a GET request. It includes authorization headers and specifies the Accept header for JSON response.

```bash
curl -X GET https://api.safe.global/tx-service/linea/api/v1/safes/0xcd2E72aEBe2A203b84f46DEEC948E6465dB51c75/safe-operations/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY"
```

--------------------------------

### Get Native Token Balance with Protocol Kit

Source: https://docs.safe.global/reference-sdk-protocol-kit/safe-info/getbalance

Retrieves the native token balance for the connected Safe smart account using the Protocol Kit. This function is essential for checking the funds available in a Safe.

```TypeScript
import { protocolKit } from './setup.ts'  

const balance = await protocolKit.getBalance()
```

--------------------------------

### Get All Transactions with Safe API Kit (TypeScript)

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis

This snippet demonstrates how to initialize the SafeApiKit and retrieve all transactions for a specific Safe address on the Ethereum Sepolia network. It requires the chainId and the Safe's address as input.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'  

const apiKit = new SafeApiKit({
  chainId: 11155111n 
})

const transactions = await apiKit.getAllTransactions(
  '0x5298a93734c3d979ef1f23f78ebb871879a21f22'
)

console.log(transactions)
```

--------------------------------

### Propose Transaction with Safe API Kit

Source: https://docs.safe.global/reference-sdk-api-kit/proposetransaction

Demonstrates how to propose a new multi-signature transaction using the Safe API Kit. It includes setting up transaction data and configuration, then calling the `proposeTransaction` method.

```TypeScript
import { ProposeTransactionProps } from '@safe-global/api-kit'
import { OperationType, SafeTransactionData } from '@safe-global/types-kit'
import { apiKit } from './setup.ts'

const safeTransactionData: SafeTransactionData = {
  operation: OperationType.Call,
  safeTxGas: '0x...',
  baseGas: '123',
  gasPrice: '123',
  gasToken: '0x...',
  refundReceiver: '0x...',
  nonce: '10'
}

const config: ProposeTransactionProps = {
  safeAddress: '0x...',
  safeTxHash: '0x...',
  safeTransactionData,
  senderAddress: '0x...',
  senderSignature: '0x...',
  origin: 'App name' // Optional
}

await apiKit.proposeTransaction(config)
```

--------------------------------

### Sample Request: Delete Queued Multisig Transaction

Source: https://docs.safe.global/core-api/transaction-service-reference/gnosis

Example cURL command to delete a queued multisig transaction. It targets the specific Safe transaction hash and includes necessary headers.

```Shell
curl -X DELETE https://safe-transaction-sepolia.safe.global/api/api/v1/multisig-transactions/0xa059b4571d8e6cf551eea796f9d86a414083bdc3d5d5be88486589a7b6214be2/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -d '{}'
```

--------------------------------

### Configure Pimlico API Key

Source: https://docs.safe.global/advanced/passkeys/tutorials/react

Creates a .env.local file at the project root and adds the Pimlico API key as a NEXT_PUBLIC_PIMLICO_API_KEY environment variable. This is necessary for authenticating with the Pimlico service.

```bash
echo "NEXT_PUBLIC_PIMLICO_API_KEY='your_pimlico_api_key_goes_here'" > .env.local  

```

--------------------------------

### Create Add Owner Transaction with Owner Address and Threshold - TypeScript

Source: https://docs.safe.global/reference-sdk-starter-kit/safe-client/createaddownertransaction

This example demonstrates creating an add owner transaction where both the `ownerAddress` and a new `threshold` are specified. This allows for setting a new threshold for the Safe when adding the owner.

```typescript
const transaction = await safeClient.createAddOwnerTransaction({
  ownerAddress: '0x...',
  threshold: 2
})
```

--------------------------------

### Create Swap Owner Transaction with Protocol Kit

Source: https://docs.safe.global/reference-sdk-protocol-kit/safe-info/createswapownertx

This snippet demonstrates how to create a Safe transaction to swap an owner using the `createSwapOwnerTx` function from the Protocol Kit. It includes setting up the necessary parameters and optional transaction properties.

```typescript
import {
  SwapOwnerTxParams,
  SafeTransactionOptionalProps
} from '@safe-global/protocol-kit'
import { protocolKit } from './setup.ts'

const params: SwapOwnerTxParams = {
  oldOwnerAddress,
  newOwnerAddress
}

const options: SafeTransactionOptionalProps = {
  safeTxGas: '123', // Optional
  baseGas: '123', // Optional
  gasPrice: '123', // Optional
  gasToken: '0x...', // Optional
  refundReceiver: '0x...', // Optional
  nonce: 123 // Optional
}

const safeTransaction = await protocolKit.createSwapOwnerTx(
  params,
  options // Optional
)

```

--------------------------------

### Define Contract Addresses for Gnosis Chain

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-detailed

Defines the contract addresses for various Safe and ERC-4337 related components on the Gnosis Chain. These addresses are crucial for initializing clients and interacting with smart contracts.

```javascript
const ENTRYPOINT_ADDRESS_V06 = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'

// https://github.com/safe-global/safe-modules-deployments/blob/main/src/assets/safe-4337-module/v0.2.0/add-modules-lib.json#L8
const ADD_MODULE_LIB_ADDRESS = '0x8EcD4ec46D4D2a6B64fE960B3D64e8B94B2234eb'

// https://github.com/safe-global/safe-modules-deployments/blob/main/src/assets/safe-4337-module/v0.2.0/safe-4337-module.json#L8
const SAFE_4337_MODULE_ADDRESS = '0xa581c4A4DB7175302464fF3C06380BC3270b4037'

// https://github.com/safe-global/safe-deployments/blob/main/src/assets/v1.4.1/safe_proxy_factory.json#L13
const SAFE_PROXY_FACTORY_ADDRESS = '0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67'

// https://github.com/safe-global/safe-deployments/blob/main/src/assets/v1.4.1/safe.json#L13
const SAFE_SINGLETON_ADDRESS = '0x41675C099F32341BF84BFc5382aF534df5C7461a'

// https://github.com/safe-global/safe-deployments/blob/main/src/assets/v1.4.1/multi_send.json#L13
const SAFE_MULTISEND_ADDRESS = '0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526'
```

--------------------------------

### List User Operations

Source: https://docs.safe.global/core-api/transaction-service-reference/unichain

This snippet shows how to retrieve a list of UserOperations associated with a specific Safe account. It uses a GET request and supports query parameters for ordering, limiting, and offsetting results. Authorization with an API key is required.

```bash
curl -X GET https://api.safe.global/tx-service/unichain/api/v1/safes/0xcd2E72aEBe2A203b84f46DEEC948E6465dB51c75/user-operations/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY" \
```

--------------------------------

### Define UserOperation Type

Source: https://docs.safe.global/advanced/erc-4337/guides/permissionless-detailed

Defines the TypeScript type for a `UserOperation`, outlining all the necessary properties for a transaction, including sender, nonce, call data, gas limits, and signature.

```typescript
type UserOperation = {
  sender: Address
  nonce: bigint
  initCode: Hex
  callData: Hex
  callGasLimit: bigint
  verificationGasLimit: bigint
  preVerificationGas: bigint
  maxFeePerGas: bigint
  maxPriorityFeePerGas: bigint
  paymasterAndData: Hex
  signature: Hex
}
```

--------------------------------

### Import Web3Adapter (Protocol Kit v1)

Source: https://docs.safe.global/sdk/protocol-kit/guides/migrate-to-v1

Shows the new import statement for Web3Adapter in Protocol Kit v1. Similar to EthersAdapter, Web3Adapter is now part of the protocol-kit package, eliminating the need for the safe-web3-lib package.

```typescript
// old
import Web3Adapter from '@safe-global/safe-web3-lib'

// new
import { Web3Adapter } from '@safe-global/protocol-kit'
```

--------------------------------

### Build React Native App with Safe and Passkeys (Tutorial)

Source: https://docs.safe.global/resource-hub_page=3

Learn to build a React Native application that securely authenticates users with passkeys and integrates with Safe. This tutorial covers passkey management and Safe interaction, relevant for React Native, Passkeys, and 4337 topics.

--------------------------------

### Get Safe Operations via cURL

Source: https://docs.safe.global/core-api/transaction-service-reference/unichain

This snippet shows how to fetch safe operations for a given Safe address using a cURL command. It includes headers for accepting JSON, specifying content type, and authorization with an API key.

```bash
curl -X GET https://api.safe.global/tx-service/unichain/api/v1/safe-operations/0x597ba36c626a32a4fcc9f23a4b25605ee30b46584918d6b6442387161dc3c51b/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY"
```

--------------------------------

### Build React Native App with Safe and Passkeys (Tutorial)

Source: https://docs.safe.global/resource-hub_page=2

Learn to build a React Native application that securely authenticates users with passkeys and integrates with Safe. This tutorial covers passkey management and Safe interaction, relevant for React Native, Passkeys, and 4337 topics.

--------------------------------

### Get Safe Creation Info via cURL

Source: https://docs.safe.global/core-api/transaction-service-reference/arbitrum

Provides a cURL command to fetch the creation status of a Safe. This is useful for testing the API endpoint directly or for use in shell scripts. Replace `{address}` with the actual Safe address.

```cURL
curl -X GET "/tx-service/arb1/api/v1/safes/{address}/creation/" -H "accept: application/json"
```

--------------------------------

### Create Project Constants

Source: https://docs.safe.global/advanced/passkeys/tutorials/nuxt

Creates a `constants.ts` file within a `utils` directory at the project root. This file defines essential constants for the project, including storage keys, RPC URLs, chain names, and contract addresses for Paymaster and NFTs.

```typescript
export const STORAGE_PASSKEY_LIST_KEY = 'safe_passkey_list'
export const RPC_URL = 'https://ethereum-sepolia-rpc.publicnode.com'
export const CHAIN_NAME = 'sepolia'
export const PAYMASTER_ADDRESS = '0x0000000000325602a77416A16136FDafd04b299f' // SEPOLIA
export const BUNDLER_URL = `https://api.pimlico.io/v1/${CHAIN_NAME}/rpc?add_balance_override&apikey=`
export const PAYMASTER_URL = `https://api.pimlico.io/v2/${CHAIN_NAME}/rpc?add_balance_override&apikey=`
export const NFT_ADDRESS = '0xBb9ebb7b8Ee75CDBf64e5cE124731A89c2BC4A07'
```

--------------------------------

### Get Pending Safe Operations (TypeScript)

Source: https://docs.safe.global/reference-sdk-starter-kit/safe-operations/getpendingsafeoperations

Fetches the pending Safe operations for the currently connected Safe account. This function is part of the `safeOperationsClient` and returns a promise that resolves to a `GetSafeOperationListResponse`.

```typescript
import { safeOperationsClient } from './setup.ts'

const pendingSafeOperations = await safeOperationsClient.getPendingSafeOperations()
```

--------------------------------

### Get Safe Operation Confirmations

Source: https://docs.safe.global/core-api/transaction-service-reference/xlayer

Retrieves a list of confirmations for a specific multisig safe operation. It supports pagination with limit and offset parameters. The response includes confirmation details such as owner, signature, and timestamps.

```curl
curl -X GET https://api.safe.global/tx-service/okb/api/v1/safe-operations/0x597ba36c626a32a4fcc9f23a4b25605ee30b46584918d6b6442387161dc3c51b/confirmations/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY"
```

--------------------------------

### Get Safe Threshold using SafeClient

Source: https://docs.safe.global/reference-sdk-starter-kit/safe-client/getthreshold

Retrieves the threshold of the connected Safe using the `getThreshold` method from the SafeClient. This is a core function for understanding Safe transaction requirements.

```TypeScript
import { safeClient } from './setup.ts'

const threshold = await safeClient.getThreshold()
```

--------------------------------

### Get All Transactions for a Safe

Source: https://docs.safe.global/core-api/transaction-service-reference/xlayer

Retrieves all transactions associated with a given Safe address. This function utilizes the SafeApiKit to fetch transaction data. Ensure you have a valid API key and chain ID configured.

```TypeScript
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 196n,
  apiKey: 'YOUR_API_KEY'
})

const transactions = await apiKit.getAllTransactions(
  '0x5298a93734c3d979ef1f23f78ebb871879a21f22'
)

console.log(transactions)
```

--------------------------------

### Get Multisig Transactions by Origin

Source: https://docs.safe.global/core-api/transaction-service-reference/zksync

Retrieves analytics data for multisig transactions, categorized by their origin. This endpoint is used for analyzing transaction patterns within the Safe ecosystem.

```bash
curl -X GET https://api.safe.global/tx-service/zksync/api/v2/analytics/multisig-transactions/by-origin/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY" \

```

--------------------------------

### Fetch ETH Balance and Deploy Safe (TypeScript)

Source: https://docs.safe.global/home/ai-agent-setup

This TypeScript code provides two key functionalities: `getEthBalance` to retrieve the ETH balance of a Safe multisig address and `deployNewSafe` to deploy a new Safe multisig wallet on the Sepolia testnet. The `getEthBalance` function uses the Safe Transaction Service API, while `deployNewSafe` utilizes the Safe Protocol Kit. Both functions include error handling and return descriptive strings upon successful execution. Metadata is provided for `getEthBalance`.

```typescript
import { z } from "zod";
import Safe from "@safe-global/protocol-kit";
import { createPublicClient, formatEther, http } from "viem";
import { sepolia } from "viem/chains";

export const getEthBalance = async ({ address, chainId }) => {
  if (chainId !== "1") throw new Error("Chain ID not supported.");
  if (!address.startsWith("0x") || address.length !== 42) {
    throw new Error("Invalid address.");
  }

  const fetchedEthBalance = await fetch(
    `https://api.safe.global/tx-service/eth/api/v1/safes/${address}/balances/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // How to get an Api key => http://docs.safe.global/core-api/how-to-use-api-keys
        "Authorization": "Bearer YOUR_API_KEY",
      },
    }
  ).catch((error) => {
    throw new Error("Error fetching data from the tx service:" + error);
  });

  const ethBalanceData = await fetchedEthBalance.json();
  const weiBalance = ethBalanceData.find(
    (element) => element?.tokenAddress === null && element?.token === null
  )?.balance;
  const ethBalance = formatEther(weiBalance); // Convert from wei to eth

  return `The current balance of the Safe Multisig at address ${address} is ${ethBalance} ETH.`;
};

export const deployNewSafe = async () => {
  const saltNonce = Math.trunc(Math.random() * 10 ** 10).toString(); // Random 10-digit integer
  const protocolKit = await Safe.init({
    provider: "https://rpc.ankr.com/eth_sepolia",
    signer: process.env.AGENT_PRIVATE_KEY,
    predictedSafe: {
      safeAccountConfig: {
        owners: [process.env.AGENT_ADDRESS as string],
        threshold: 1,
      },
      safeDeploymentConfig: {
        saltNonce,
      },
    },
  });

  const safeAddress = await protocolKit.getAddress();

  const deploymentTransaction =
    await protocolKit.createSafeDeploymentTransaction();

  const safeClient = await protocolKit.getSafeProvider().getExternalSigner();

  const transactionHash = await safeClient?.sendTransaction({
    to: deploymentTransaction.to,
    value: BigInt(deploymentTransaction.value),
    data: deploymentTransaction.data as `0x${string}`,
    chain: sepolia,
  });

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  await publicClient?.waitForTransactionReceipt({
    hash: transactionHash as `0x${string}`,
  });

  return `A new Safe multisig was successfully deployed on Sepolia. You can see it live at https://app.safe.global/home?safe=sep:${safeAddress}. The saltNonce used was ${saltNonce}.`;
};

export const getEthBalanceMetadata = {
  name: "getEthBalance",
  description:
    "Call to get the balance in ETH of a Safe Multisig for a given address and chain ID.",
};
```

--------------------------------

### Get Multisig Transaction Confirmations

Source: https://docs.safe.global/core-api/transaction-service-reference/sonic

Retrieves a list of confirmations for a specific multisig transaction. Supports pagination with limit and offset parameters. Returns transaction details including owner, signature, and creation/modification timestamps.

```curl
curl -X GET https://api.safe.global/tx-service/sonic/api/v1/safe-operations/0x597ba36c626a32a4fcc9f23a4b25605ee30b46584918d6b6442387161dc3c51b/confirmations/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY"
```

--------------------------------

### List Safe Operations

Source: https://docs.safe.global/core-api/transaction-service-reference/optimism

This snippet shows how to retrieve a list of SafeOperations for a given Safe account using a cURL GET request. It includes the API endpoint, Accept header, content-type header, and Authorization header.

```bash
curl -X GET https://api.safe.global/tx-service/oeth/api/v1/safes/0xcd2E72aEBe2A203b84f46DEEC948E6465dB51c75/safe-operations/ \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY"
```

--------------------------------

### Deploy SafeProxy with Nonce

Source: https://docs.safe.global/reference-smart-account/deployment/SafeProxyFactory

Deploys a new SafeProxy contract using a specified singleton address and a unique nonce. This function is crucial for creating new Safe instances with predictable addresses. It emits a ProxyCreation event upon successful deployment.

```Solidity
function createProxyWithNonce(address _singleton, bytes memory initializer, uint256 saltNonce) public returns (SafeProxy proxy);
```

--------------------------------

### Get Module Transaction

Source: https://docs.safe.global/core-api/transaction-service-reference/base

This cURL command demonstrates how to retrieve details of a module transaction using its ID. It requires an API key for authorization and specifies the endpoint for the request.

```curl
curl -X GET https://api.safe.global/tx-service/base/api/v1/module-transaction/0x3b3b57b3 \
    -H "Accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY" \
```

--------------------------------

### Confirm Safe Operation with Signature

Source: https://docs.safe.global/reference-sdk-starter-kit/safe-operations/confirmsafeoperation

Adds a signature to a Safe operation if the threshold has not yet been met. If the threshold is reached, the Safe operation is submitted immediately. This example demonstrates how to use the `confirmSafeOperation` method with a provided `safeOperationHash`.

```TypeScript
import { safeOperationsClient } from './setup.ts'

const safeOperationResult = await safeOperationsClient.confirmSafeOperation({
  safeOperationHash: '0x...'
})

```

--------------------------------

### Solidity: Create TestToken.sol Contract

Source: https://docs.safe.global/advanced/smart-account-modules/smart-account-modules-tutorial

This contract, TestToken.sol, is a sample ERC20 token contract that inherits from OpenZeppelin's ERC20 and Ownable contracts. It includes a mint function that can only be called by the owner, making it suitable for testing purposes.

```Solidity
// SPDX-License-Identifier: LGPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestToken is ERC20, Ownable {
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) Ownable(msg.sender) {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

```

--------------------------------

### Get Multisig Transactions without Options

Source: https://docs.safe.global/reference-sdk-api-kit/getmultisigtransactions

Retrieves the history of multi-signature transactions for a Safe account using only the Safe address. This will return transactions with default filtering and pagination settings.

```typescript
const multisigTxs = await apiKit.getMultisigTransactions(
  '0x...'
)
```

--------------------------------

### Get Token Data Sample Response

Source: https://docs.safe.global/core-api/transaction-service-reference/bsc

This snippet shows a sample JSON response for retrieving token data, including its type, address, name, symbol, decimals, logo URI, and trusted status.

```json
{
  "type": "ERC20",
  "address": "0x687e43D0aB3248bDfebFE3E8f9F1AB2B9FcE982d",
  "name": "0x5555.com",
  "symbol": "0x5555.com",
  "decimals": 18,
  "logoUri": "https://safe-transaction-assets.safe.global/tokens/logos/0x687e43D0aB3248bDfebFE3E8f9F1AB2B9FcE982d.png",
  "trusted": false
}
```