# ENS to Basenames Refactoring Analysis

## Executive Summary

This document provides a detailed comparative analysis between the current ENS implementation and the Basenames protocol for migrating Catalogue's name registration system from Ethereum Sepolia (L1) to Base Sepolia (L2). Basenames is an ENS-compatible protocol specifically designed for Base, enabling native subdomain registration on Base while maintaining compatibility with ENS standards.

---

## Architecture Comparison Table

| Component | Current ENS Implementation | Basenames Implementation | Compatibility | Refactoring Required |
|-----------|---------------------------|---------------------------|---------------|---------------------|
| **Protocol Standard** | ENS (Ethereum Name Service) | Basenames (ENS-compatible) | ✅ **High** - Same interfaces | **Low** - Interface compatible |
| **Chain** | Ethereum Sepolia (L1, 11155111) | Base Sepolia (L2, 84532) | ❌ Different chains | **High** - Chain migration |
| **Registry Contract** | ENS Registry (on Sepolia) | Registry.sol (on Base Sepolia) | ✅ Same interface | **Medium** - Address change |
| **NameWrapper** | NameWrapper (setSubnodeRecord) | BaseRegistrar (registerWithRecord) | ⚠️ Different pattern | **High** - Registration flow change |
| **Resolver** | PublicResolver / Custom Resolver | L2Resolver (ENS-compatible) | ✅ Same interface | **Low** - Address change only |
| **Text Records** | setText(bytes32 node, string key, string value) | setText(bytes32 node, string key, string value) | ✅ **Identical** | **None** - Same function |
| **Address Records** | setAddr(bytes32 node, address addr) | setAddr(bytes32 node, address addr) | ✅ **Identical** | **None** - Same function |
| **Namehash Algorithm** | keccak256(node, label) | keccak256(node, label) | ✅ **Identical** | **None** - Same algorithm |
| **Normalization** | ENSIP-15 (normalize) | ENSIP-15 (normalize) | ✅ **Identical** | **None** - Same standard |
| **Registration Method** | NameWrapper.setSubnodeRecord() | RegistrarController.register() | ⚠️ Different API | **High** - Complete rewrite |
| **Payment Required** | No (free subname creation) | Yes (via RegistrarController) | ❌ Different model | **High** - Payment integration |
| **Expiry Management** | NameWrapper expiry (uint64) | BaseRegistrar nameExpires (uint256) | ⚠️ Different storage | **Medium** - Expiry handling |
| **Tokenization** | NameWrapper (ERC1155) - Optional wrapping | BaseRegistrar (ERC721) - **Automatic tokenization** | ⚠️ Different standard | **Low** - Automatic, no wrapping step needed |

---

## Atomic Transaction Pattern Comparison

### V1: NameWrapper.setSubnodeRecord() - Partial Atomicity

The current V1 implementation uses `NameWrapper.setSubnodeRecord()`, which is a **single atomic transaction** that:

1. ✅ Creates the subname in the Registry
2. ✅ Sets the owner of the subname
3. ✅ Sets the resolver for the subname
4. ✅ Sets the TTL (time-to-live)
5. ✅ Sets fuses (permissions/restrictions)
6. ✅ Sets the expiry timestamp

**However**, this atomic transaction **does NOT** set records (address or text records). Those require **separate transactions**:

```typescript
// V1 Flow - 13 Transactions Total

// Transaction 1: NameWrapper.setSubnodeRecord()
// ✅ Creates subname + sets owner + sets resolver + sets expiry
// ❌ Does NOT set records
await createENSSubname(subnameLabel, parentNode);

// Transaction 2: Resolver.setAddr()
// Sets address record separately
await resolver.setAddr(subnameNode, creatorAddress);

// Transactions 3-13: Resolver.setText() × 11
// Sets text records separately (one per record)
for (const [key, value] of Object.entries(records)) {
  await resolver.setText(subnameNode, key, value);
}
```

**V1 Atomicity**: Partial - Creation is atomic, but record-setting is not.

### V2: RegistrarController.register() - Full Atomicity

Basenames uses `RegistrarController.register()`, which is a **single atomic transaction** that:

1. ✅ Creates the subname in the Registry (via BaseRegistrar)
2. ✅ Sets the owner of the subname
3. ✅ Sets the resolver for the subname
4. ✅ Sets the expiry (calculated as `block.timestamp + duration`)
5. ✅ **Can batch ALL record-setting operations via `data[]` parameter**

The key difference is the `data[]` parameter, which allows batching **all resolver calls** (setAddr + setText) into the same transaction:

```typescript
// V2 Flow - 1 Transaction Total

// Build batched records data
const recordsData: `0x${string}`[] = [];

// Add setAddr to batch
recordsData.push(
  encodeFunctionData({
    abi: RESOLVER_ABI,
    functionName: 'setAddr',
    args: [subnameNode, creatorAddress],
  })
);

// Add all setText calls to batch
for (const [key, value] of Object.entries(records)) {
  recordsData.push(
    encodeFunctionData({
      abi: RESOLVER_ABI,
      functionName: 'setText',
      args: [subnameNode, key, value],
    })
  );
}

// Single atomic transaction: creates subname + sets ALL records
const request = {
  name: subnameLabel,
  owner: ownerAddress,
  duration: MIN_REGISTRATION_DURATION,
  resolver: resolverAddress,
  data: recordsData, // ALL records batched here
  reverseRecord: false,
};

await registrarController.register(request, { value: price });
```

**V2 Atomicity**: Full - Creation AND all record-setting in one atomic transaction.

### Comparison Table

| Aspect | V1 NameWrapper.setSubnodeRecord() | V2 RegistrarController.register() |
|--------|-----------------------------------|-----------------------------------|
| **Creates Subname** | ✅ Atomic (in same tx) | ✅ Atomic (in same tx) |
| **Sets Owner** | ✅ Atomic (in same tx) | ✅ Atomic (in same tx) |
| **Sets Resolver** | ✅ Atomic (in same tx) | ✅ Atomic (in same tx) |
| **Sets Expiry** | ✅ Atomic (in same tx) | ✅ Atomic (in same tx) |
| **Sets Address Record** | ❌ Separate transaction | ✅ **Batched in data[]** |
| **Sets Text Records** | ❌ 11 separate transactions | ✅ **Batched in data[]** |
| **Total Transactions** | **13 transactions** | **1 transaction** |
| **Atomicity Level** | Partial (creation only) | **Full (creation + all records)** |
| **Payment** | Free | Requires ETH payment |

### Key Insight

**Basenames is MORE atomic than the current V1 implementation** because:

1. V1: `NameWrapper.setSubnodeRecord()` creates the subname atomically, but records must be set in separate transactions (13 total)
2. V2: `RegistrarController.register()` creates the subname AND sets all records atomically (1 total)

The `data[]` parameter in Basenames enables batching all resolver calls (setAddr + setText) into the registration transaction, achieving **true atomicity** for the entire operation.

---

## Wrapping/Tokenization Comparison

### V1: ENS NameWrapper (Optional ERC1155 Wrapping)

In ENS, names can exist in multiple states:

1. **Registry Only**: Basic ownership in Registry (not tokenized)
2. **BaseRegistrar**: ERC721 tokenization (for .eth names)
3. **NameWrapper**: Optional ERC1155 wrapping (adds fuses, expiry management)

**NameWrapper is optional** - you can use names without wrapping them. Wrapping provides:
- ERC1155 token standard (vs ERC721)
- Fuses (permissions/restrictions)
- Better expiry management
- Subdomain management features

**Current V1 Implementation**: Uses `NameWrapper.setSubnodeRecord()` which creates wrapped names directly.

### V2: Basenames BaseRegistrar (Automatic ERC721 Tokenization)

**Basenames names are ALREADY tokenized** - there's no separate wrapping step.

When you register a Basename via `RegistrarController.register()`:
1. ✅ Creates the subname in Registry
2. ✅ **Automatically mints an ERC721 token** (via BaseRegistrar)
3. ✅ Sets owner, resolver, expiry

**Key Difference**: 
- **ENS**: Registry → BaseRegistrar (ERC721) → NameWrapper (ERC1155, optional)
- **Basenames**: Registry → BaseRegistrar (ERC721) - **No separate wrapping needed**

**From the Basenames README:**
> "ERC721 subdomain tokens" - Names are automatically tokenized as ERC721 NFTs when registered.

**From BaseRegistrar.sol:**
```solidity
/// @notice The base-level tokenization contract for an ens domain. 
/// The Base Registrar implements ERC721 and, as the owner of a 2LD, 
/// can mint and assign ownership rights to its subdomains.
contract BaseRegistrar is ERC721, Ownable {
    // ...
    function _localRegister(uint256 id, address owner, uint256 duration) internal returns (uint256 expiry) {
        expiry = block.timestamp + duration;
        nameExpires[id] = expiry;
        if (_exists(id)) {
            _burn(id);
        }
        _mint(owner, id); // Automatically mints ERC721 token
    }
}
```

### Comparison

| Aspect | ENS NameWrapper | Basenames BaseRegistrar |
|--------|----------------|-------------------------|
| **Token Standard** | ERC1155 (if wrapped) | ERC721 (automatic) |
| **Wrapping Required** | Optional (can use unwrapped) | **Automatic** (no wrapping step) |
| **Registration Flow** | Registry → NameWrapper (optional) | Registry → BaseRegistrar (automatic) |
| **Token Minting** | Manual wrapping step | **Automatic on registration** |
| **Fuses Support** | Yes (via NameWrapper) | No (uses ERC721 permissions) |
| **OpenSea Listing** | Yes (if wrapped) | Yes (automatic - [Opensea collection](https://opensea.io/collection/basenames)) |

### Answer to Your Question

**Q: Do Basenames have to be wrapped or have the ability to be wrapped?**

**A: Basenames are automatically tokenized as ERC721 NFTs when registered. There's no separate wrapping step needed or available. The BaseRegistrar contract IS the tokenization mechanism - registration automatically mints an ERC721 token.**

**Implications for Migration:**
- ✅ **Simpler**: No wrapping step needed
- ✅ **Automatic**: Tokenization happens on registration
- ⚠️ **Different Standard**: ERC721 (Basenames) vs ERC1155 (ENS NameWrapper)
- ⚠️ **No Fuses**: Basenames doesn't support fuses (uses ERC721 permissions instead)

---

## Detailed Component Analysis

### 1. Registry Contract

#### Current ENS Implementation
- **Location**: `lib/services/ens.ts`
- **Contract**: ENS Registry on Sepolia
- **Usage**: Indirect (via NameWrapper)
- **Functions Used**: None directly (NameWrapper handles Registry)

#### Basenames Implementation
- **Contract**: `Registry.sol` on Base Sepolia
- **Address (Base Sepolia)**: `0x1493b2567056c2181630115660963E13A8E32735`
- **Interface**: Same as ENS Registry (implements `ENS` interface)
- **Functions**: `setSubnodeRecord()`, `setSubnodeOwner()`, `setResolver()`, `owner()`, `resolver()`

#### Compatibility
✅ **High Compatibility** - Basenames Registry implements the same `ENS` interface from `ens-contracts`

#### Refactoring Required
```typescript
// V1 - Not used directly (NameWrapper handles it)
// No direct Registry calls

// V2 - Can use Registry directly if needed
import { Registry } from '@basenames/contracts'; // Hypothetical import
const registry = new ethers.Contract(
  '0x1493b2567056c2181630115660963E13A8E32735', // Base Sepolia Registry
  REGISTRY_ABI,
  provider
);
```

**Impact**: Low - Registry interface is identical, but we don't use it directly in current implementation.

---

### 2. Name Registration (NameWrapper → BaseRegistrar)

#### Current ENS Implementation (V1)
- **Location**: `lib/services/ens.ts` - `createENSSubname()`
- **Method**: `NameWrapper.setSubnodeRecord()` - **Single Atomic Transaction**
- **Contract**: `0x0635513f179D50A207757E05759CbD106d7dFcE8` (Sepolia)
- **Function Signature**:
```solidity
setSubnodeRecord(
  bytes32 parentNode,
  string label,
  address owner,
  address resolver,
  uint64 ttl,
  uint32 fuses,
  uint64 expiry
)
```

**What `setSubnodeRecord()` Does Atomically:**
1. ✅ Creates the subname in the Registry
2. ✅ Sets the owner of the subname
3. ✅ Sets the resolver for the subname
4. ✅ Sets the TTL (time-to-live)
5. ✅ Sets fuses (permissions/restrictions)
6. ✅ Sets the expiry timestamp

**All in a single, atomic transaction - no payment required.**

**Current V1 Flow:**
```
Step 1: NameWrapper.setSubnodeRecord() 
  → Creates subname + sets owner + sets resolver + sets expiry
  → 1 transaction, FREE

Step 2: Resolver.setAddr()
  → Sets address record
  → 1 transaction

Step 3: Resolver.setText() × 11
  → Sets text records (one per record)
  → 11 transactions

Total: 13 transactions (1 for creation, 1 for addr, 11 for text records)
```

- **Payment**: None (free subname creation)
- **Expiry**: Set via `expiry` parameter (uint64)
- **Records Setup**: Separate transactions after subname creation

#### Basenames Implementation (V2)
- **Method**: `RegistrarController.register()` - **Single Atomic Transaction with Batching**
- **Contract (Base Sepolia)**:
  - `RegistrarController`: `0x49ae3cc2e3aa768b1e5654f5d3c6002144a59581`
  - `BaseRegistrar`: `0xa0c70ec36c010b55e3c434d6c6ebeec50c705794`
- **Function Signature**:
```solidity
// Via RegistrarController
register(RegisterRequest calldata request) payable

struct RegisterRequest {
  string name;           // Label (e.g., "SOMA001")
  address owner;         // Owner address
  uint256 duration;      // Registration duration (seconds, min 1 year)
  address resolver;      // Resolver address
  bytes[] data;          // Multicall data for setting records (CAN BATCH!)
  bool reverseRecord;    // Set reverse record
}
```

**What `register()` Does Atomically:**
1. ✅ Creates the subname in the Registry (via BaseRegistrar)
2. ✅ Sets the owner of the subname
3. ✅ Sets the resolver for the subname
4. ✅ Sets the expiry (calculated as `block.timestamp + duration`)
5. ✅ **Can batch set records via `data[]` parameter** (setAddr + setText calls)

**All in a single, atomic transaction - but requires payment.**

**New V2 Flow (Optimized):**
```
Step 1: RegistrarController.register() with batched data[]
  → Creates subname + sets owner + sets resolver + sets expiry
  → Executes all record-setting calls (setAddr + setText × 11) via multicall
  → 1 transaction, REQUIRES PAYMENT

Total: 1 transaction (everything in one atomic operation!)
```

**Key Advantage**: Basenames can batch ALL operations (creation + all records) into a single transaction, making it MORE atomic than the current V1 approach.

- **Payment**: Required (ETH payment via `msg.value`)
- **Expiry**: Calculated as `block.timestamp + duration` (stored in `nameExpires` mapping)
- **Records Setup**: Can be batched in the same transaction via `data[]` parameter

#### Key Differences

| Aspect | ENS NameWrapper (V1) | Basenames RegistrarController (V2) |
|--------|---------------------|-----------------------------------|
| **Atomic Operations** | Creates subname + sets resolver (1 tx) | Creates subname + sets resolver + **can batch records** (1 tx) |
| **Transaction Count** | 13 transactions total (1 creation + 1 addr + 11 text) | **1 transaction total** (everything batched) |
| **Payment** | Free | Requires ETH payment |
| **Duration** | Fixed expiry timestamp (uint64) | Duration in seconds (uint256, min 1 year) |
| **Records Setup** | **Separate transactions** after creation | **Can batch via `data[]` parameter** in same tx |
| **Reverse Record** | Manual setup (separate tx) | Optional via `reverseRecord` flag (in same tx) |
| **Controller Pattern** | Direct contract call | Controller manages registration + payment |
| **Fuses** | Supports fuses (uint32) | No fuses (uses ERC721 tokenization instead) |
| **TTL** | Sets TTL (uint64) | TTL not used (modern ENS pattern) |

**Critical Insight**: Basenames is **MORE atomic** than the current V1 implementation because it can batch record-setting operations into the registration transaction, whereas V1 requires separate transactions for each record.

#### Refactoring Approach

```typescript
// V1 - ENS NameWrapper (Current Implementation)
// Step 1: Create subname (atomic - sets owner, resolver, expiry)
export async function createENSSubname(
  subnameLabel: string,
  parentNode: string
): Promise<string> {
  const normalizedLabel = normalize(subnameLabel);
  const expiryTimestamp = BigInt(now + oneYearInSeconds);
  
  // Single atomic transaction: creates subname + sets owner + resolver + expiry
  const txHash = await walletClient.writeContract({
    address: NAMEWRAPPER_ADDRESS,
    abi: NAMEWRAPPER_ABI,
    functionName: 'setSubnodeRecord',
    args: [
      parentNode,
      normalizedLabel,
      ownerAddress,
      resolver,
      BigInt(0), // ttl
      0, // fuses
      expiryTimestamp,
    ],
  });
  return txHash;
}

// Step 2: Set address record (separate transaction)
await resolver.setAddr(subnameNode, creatorAddress);

// Step 3: Set text records (11 separate transactions)
for (const [key, value] of Object.entries(records)) {
  await resolver.setText(subnameNode, key, value);
}
// Total: 13 transactions
```

// V2 - Basenames RegistrarController (New Implementation)
// Single atomic transaction: creates subname + sets owner + resolver + expiry + ALL records
export async function createBasename(
  subnameLabel: string,
  ownerAddress: string,
  resolverAddress: string,
  records: Record<string, string>,
  creatorAddress: string
): Promise<string> {
  // Calculate subname node
  const parentNode = namehash('base.eth');
  const labelHash = keccak256(toBytes(subnameLabel));
  const subnameNode = keccak256(encodePacked(['bytes32', 'bytes32'], [parentNode, labelHash]));
  
  // Build batched records data (setAddr + all setText calls)
  const recordsData: `0x${string}`[] = [];
  
  // Add setAddr to batch
  recordsData.push(
    encodeFunctionData({
      abi: RESOLVER_ABI,
      functionName: 'setAddr',
      args: [subnameNode, creatorAddress],
    })
  );
  
  // Add all setText calls to batch
  for (const [key, value] of Object.entries(records)) {
    recordsData.push(
      encodeFunctionData({
        abi: RESOLVER_ABI,
        functionName: 'setText',
        args: [subnameNode, key, value],
      })
    );
  }
  
  // Calculate price
  const price = await registrarController.registerPrice(
    subnameLabel,
    MIN_REGISTRATION_DURATION // 365 days
  );
  
  // Build RegisterRequest with batched data
  const request = {
    name: subnameLabel,
    owner: ownerAddress,
    duration: MIN_REGISTRATION_DURATION,
    resolver: resolverAddress,
    data: recordsData, // ALL records batched here (setAddr + 11 setText calls)
    reverseRecord: false, // Optional
  };
  
  // Single atomic transaction: creates subname + sets ALL records
  const txHash = await walletClient.writeContract({
    address: REGISTRAR_CONTROLLER_ADDRESS,
    abi: REGISTRAR_CONTROLLER_ABI,
    functionName: 'register',
    args: [request],
    value: price, // ETH payment required
  });
  
  return txHash;
}
// Total: 1 transaction (everything batched atomically!)
```

**Impact**: High - Complete rewrite of registration flow, requires payment integration, but results in MORE atomic operation (1 tx vs 13 tx).

---

### 3. Resolver Contract

#### Current ENS Implementation
- **Location**: `lib/services/ens.ts` - `executeENSRecords()`, `buildSetTextTransactions()`
- **Contract**: Custom resolver or PublicResolver on Sepolia
- **Address**: `ENS_RESOLVER_SEPOLIA` env var
- **Functions Used**:
  - `setText(bytes32 node, string key, string value)`
  - `setAddr(bytes32 node, address addr)`

#### Basenames Implementation
- **Contract**: `L2Resolver.sol` on Base Sepolia
- **Address (Base Sepolia)**: `0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA`
- **Interface**: Same as ENS PublicResolver
- **Functions**: Identical to ENS
  - `setText(bytes32 node, string key, string value)` ✅
  - `setAddr(bytes32 node, address addr)` ✅
  - `text(bytes32 node, string key)` ✅
  - `addr(bytes32 node)` ✅

#### Compatibility
✅ **100% Compatible** - L2Resolver implements the same ENS resolver interfaces:
- `ITextResolver`
- `IAddrResolver`
- `IAddressResolver`
- `Multicallable` (for batching)

#### Refactoring Required
```typescript
// V1
const ENS_RESOLVER = process.env.ENS_RESOLVER_SEPOLIA!;

// V2
const BASENAMES_RESOLVER = '0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA'; // Base Sepolia

// Function calls remain IDENTICAL
await resolver.setText(node, key, value); // Same
await resolver.setAddr(node, address);    // Same
```

**Impact**: Low - Only address change, function signatures identical.

---

### 4. Text Records (setText)

#### Current ENS Implementation
- **Location**: `lib/services/ens.ts` - `buildSetTextTransactions()`, `executeENSRecords()`
- **Function**: `setText(bytes32 node, string key, string value)`
- **Usage**: Sequential transactions (11 separate setText calls)

#### Basenames Implementation
- **Function**: `setText(bytes32 node, string key, string value)` - **IDENTICAL**
- **Interface**: `ITextResolver` from `ens-contracts` - **IDENTICAL**
- **Batching**: Supports `multicallWithNodeCheck()` for batching

#### Compatibility
✅ **100% Compatible** - Same function signature, same interface

#### Refactoring Required
```typescript
// V1 - Sequential setText calls
for (const [key, value] of Object.entries(records)) {
  await walletClient.writeContract({
    address: ENS_RESOLVER,
    abi: RESOLVER_ABI,
    functionName: 'setText',
    args: [subnameNode, key, value],
  });
}

// V2 - Can use multicall for batching (OPTIMIZATION)
const multicallData = Object.entries(records).map(([key, value]) =>
  encodeFunctionData({
    abi: RESOLVER_ABI,
    functionName: 'setText',
    args: [subnameNode, key, value],
  })
);

await resolver.multicallWithNodeCheck(subnameNode, multicallData);
```

**Impact**: None for basic functionality, but multicall is an optimization opportunity.

---

### 5. Address Records (setAddr)

#### Current ENS Implementation
- **Location**: `lib/services/ens.ts` - `executeENSRecords()`
- **Function**: `setAddr(bytes32 node, address addr)`
- **Usage**: Single transaction before text records

#### Basenames Implementation
- **Function**: `setAddr(bytes32 node, address addr)` - **IDENTICAL**
- **Interface**: `IAddrResolver` from `ens-contracts` - **IDENTICAL**

#### Compatibility
✅ **100% Compatible** - Same function signature

#### Refactoring Required
```typescript
// V1 and V2 - IDENTICAL
await resolver.setAddr(subnameNode, creatorAddress);
```

**Impact**: None - Function is identical.

---

### 6. Namehash & Normalization

#### Current ENS Implementation
- **Location**: `lib/services/ens.ts` - `getNamehash()`, `normalize()`
- **Algorithm**: `namehash(normalize(name))` via `viem/ens`
- **Standard**: ENSIP-15 normalization

#### Basenames Implementation
- **Algorithm**: Same `namehash()` and `normalize()` functions
- **Standard**: ENSIP-15 normalization (same)
- **Usage**: `keccak256(abi.encodePacked(node, label))` for subnodes

#### Compatibility
✅ **100% Compatible** - Same namehash algorithm, same normalization

#### Refactoring Required
```typescript
// V1 and V2 - IDENTICAL
import { namehash, normalize } from 'viem/ens';

function getNamehash(name: string): `0x${string}` {
  const normalizedName = normalize(name);
  return namehash(normalizedName);
}

// Subnode calculation (same for both)
const subnode = keccak256(encodePacked(['bytes32', 'bytes32'], [parentNode, keccak256(toBytes(label))]));
```

**Impact**: None - Algorithm is identical.

---

### 7. Query/Resolution

#### Current ENS Implementation
- **Location**: `lib/services/query-ens.ts`
- **Methods**: 
  - `publicClient.getEnsText()` - Query text records
  - `publicClient.getEnsAddress()` - Query address records
  - `publicClient.getEnsResolver()` - Get resolver address

#### Basenames Implementation
- **Methods**: Same viem/ens methods work
  - `publicClient.getEnsText()` - ✅ Works (same interface)
  - `publicClient.getEnsAddress()` - ✅ Works (same interface)
  - `publicClient.getEnsResolver()` - ✅ Works (same interface)

#### Compatibility
✅ **High Compatibility** - viem's ENS resolution methods work with Basenames

#### Refactoring Required
```typescript
// V1 - Sepolia
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.SEPOLIA_RPC_URL!),
});

// V2 - Base Sepolia
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.BASE_RPC_URL!),
});

// Query methods remain IDENTICAL
const textValue = await publicClient.getEnsText({
  name: normalizedName,
  key: 'eth.scenedex.releaseId',
});
```

**Impact**: Low - Only chain change, query methods identical.

---

## Contract Addresses

### Base Sepolia (Testnet)

| Contract | Address | Purpose |
|----------|---------|---------|
| **Registry** | `0x1493b2567056c2181630115660963E13A8E32735` | Core registry (replaces ENS Registry) |
| **BaseRegistrar** | `0xa0c70ec36c010b55e3c434d6c6ebeec50c705794` | ERC721 tokenization (replaces NameWrapper) |
| **RegistrarController** | `0x49ae3cc2e3aa768b1e5654f5d3c6002144a59581` | Registration & payment (new component) |
| **L2Resolver** | `0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA` | Resolver (replaces PublicResolver) |
| **ReverseRegistrar** | `0x876eF94ce0773052a2f81921E70FF25a5e76841f` | Reverse resolution |
| **Price Oracle** | `0x2b73408052825e17e0fe464f92de85e8c7723231` | Pricing for registrations |

### Base Mainnet (Production)

| Contract | Address | Purpose |
|----------|---------|---------|
| **Registry** | `0xb94704422c2a1e396835a571837aa5ae53285a95` | Core registry |
| **BaseRegistrar** | `0x03c4738ee98ae44591e1a4a4f3cab6641d95dd9a` | ERC721 tokenization |
| **RegistrarController** | `0x4cCb0BB02FCABA27e82a56646E81d8c5bC4119a5` | Registration & payment |
| **L2Resolver** | `0xC6d566A56A1aFf6508b41f6c90ff131615583BCD` | Resolver |
| **ReverseRegistrar** | `0x79ea96012eea67a83431f1701b3dff7e37f9e282` | Reverse resolution |
| **Price Oracle** | `0x508CFE43aa84b8048cB6d39037cE0dc96d8aDc75` | Pricing |

---

## Function-by-Function Comparison

### Registration Functions

| Function | ENS (V1) | Basenames (V2) | Compatibility |
|----------|----------|----------------|---------------|
| **Create Subname** | `NameWrapper.setSubnodeRecord()` | `RegistrarController.register()` | ⚠️ Different API |
| **Set Resolver** | Via `setSubnodeRecord()` | Via `register()` or `Registry.setResolver()` | ✅ Same result |
| **Set Owner** | Via `setSubnodeRecord()` | Via `register()` | ✅ Same result |
| **Set Records** | Separate `setText()` calls | Can batch via `data[]` in `register()` | ✅ Same, better batching |

### Resolver Functions

| Function | ENS (V1) | Basenames (V2) | Compatibility |
|----------|----------|----------------|---------------|
| **setText** | `setText(node, key, value)` | `setText(node, key, value)` | ✅ **Identical** |
| **text** | `text(node, key)` | `text(node, key)` | ✅ **Identical** |
| **setAddr** | `setAddr(node, addr)` | `setAddr(node, addr)` | ✅ **Identical** |
| **addr** | `addr(node)` | `addr(node)` | ✅ **Identical** |
| **multicall** | `multicall(data[])` | `multicallWithNodeCheck(node, data[])` | ⚠️ Slightly different |

### Query Functions

| Function | ENS (V1) | Basenames (V2) | Compatibility |
|----------|----------|----------------|---------------|
| **getEnsText** | `publicClient.getEnsText()` | `publicClient.getEnsText()` | ✅ **Identical** |
| **getEnsAddress** | `publicClient.getEnsAddress()` | `publicClient.getEnsAddress()` | ✅ **Identical** |
| **getEnsResolver** | `publicClient.getEnsResolver()` | `publicClient.getEnsResolver()` | ✅ **Identical** |

---

## Refactoring Implementation Plan

### Phase 1: Environment & Configuration

#### Update Environment Variables
```bash
# Remove/Update
ENS_RESOLVER_SEPOLIA=<old-sepolia-resolver>
ENS_NAMEWRAPPER_SEPOLIA=<old-sepolia-namewrapper>

# Add/Update
BASENAMES_REGISTRY_BASE_SEPOLIA=0x1493b2567056c2181630115660963E13A8E32735
BASENAMES_BASE_REGISTRAR_BASE_SEPOLIA=0xa0c70ec36c010b55e3c434d6c6ebeec50c705794
BASENAMES_REGISTRAR_CONTROLLER_BASE_SEPOLIA=0x49ae3cc2e3aa768b1e5654f5d3c6002144a59581
BASENAMES_RESOLVER_BASE_SEPOLIA=0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA
BASENAMES_REVERSE_REGISTRAR_BASE_SEPOLIA=0x876eF94ce0773052a2f81921E70FF25a5e76841f
BASENAMES_PRICE_ORACLE_BASE_SEPOLIA=0x2b73408052825e17e0fe464f92de85e8c7723231
```

#### Update Chain Configuration
```typescript
// V1 - lib/services/ens.ts
import { sepolia } from 'viem/chains';
const rpcUrl = process.env.SEPOLIA_RPC_URL;

// V2 - lib/services/basenames.ts (new file)
import { baseSepolia } from 'viem/chains';
const rpcUrl = process.env.BASE_RPC_URL;
```

---

### Phase 2: Registration Flow Refactor

#### Current Flow (V1) - 13 Transactions
```typescript
// Step 1: Create subname via NameWrapper (atomic: creates + sets owner + resolver + expiry)
const subnameTx = await createENSSubname(subnameLabel, parentNode);
// Transaction 1: NameWrapper.setSubnodeRecord()

// Step 2: Set address record (separate transaction)
await resolver.setAddr(subnameNode, creatorAddress);
// Transaction 2: Resolver.setAddr()

// Step 3: Set text records (11 separate transactions)
for (const [key, value] of Object.entries(records)) {
  await resolver.setText(subnameNode, key, value);
}
// Transactions 3-13: Resolver.setText() × 11

// Total: 13 transactions
// - 1 for subname creation
// - 1 for address record
// - 11 for text records
```

#### New Flow (V2) - 1 Transaction (Fully Atomic)
```typescript
// Build batched records data (setAddr + all setText calls)
const recordsData: `0x${string}`[] = [];

// Add setAddr to batch
recordsData.push(
  encodeFunctionData({
    abi: RESOLVER_ABI,
    functionName: 'setAddr',
    args: [subnameNode, creatorAddress],
  })
);

// Add all setText calls to batch
for (const [key, value] of Object.entries(records)) {
  recordsData.push(
    encodeFunctionData({
      abi: RESOLVER_ABI,
      functionName: 'setText',
      args: [subnameNode, key, value],
    })
  );
}

// Build RegisterRequest with batched data
const request = {
  name: subnameLabel,
  owner: safeAddress, // Safe will own the subname
  duration: 365 * 24 * 60 * 60, // 1 year minimum
  resolver: BASENAMES_RESOLVER,
  data: recordsData, // ALL records batched (setAddr + 11 setText calls)
  reverseRecord: false,
};

// Get price
const price = await registrarController.registerPrice(
  subnameLabel,
  365 * 24 * 60 * 60
);

// Single atomic transaction: creates subname + sets ALL records
const txHash = await walletClient.writeContract({
  address: BASENAMES_REGISTRAR_CONTROLLER,
  abi: REGISTRAR_CONTROLLER_ABI,
  functionName: 'register',
  args: [request],
  value: price, // ETH payment required
});

// Total: 1 transaction
// - Creates subname
// - Sets owner
// - Sets resolver
// - Sets expiry
// - Sets address record (via data[])
// - Sets all 11 text records (via data[])
```

**Benefits**:
- ✅ **Single transaction** (vs 13 transactions in V1)
- ✅ **Fully atomic** (all operations succeed or fail together)
- ✅ **Lower total gas costs** (batching reduces overhead)
- ✅ **Simpler error handling** (one transaction to monitor)
- ✅ **Faster execution** (no waiting for 13 confirmations)
- ✅ **Better UX** (single transaction status)

---

### Phase 3: Resolver Functions (Minimal Changes)

#### Text Records
```typescript
// V1 and V2 - IDENTICAL
export function buildSetTextTransactions(
  node: string,
  records: Record<string, string>
): Array<{ to: string; value: string; data: string }> {
  const RESOLVER_ABI = [
    {
      name: 'setText',
      type: 'function',
      inputs: [
        { name: 'node', type: 'bytes32' },
        { name: 'key', type: 'string' },
        { name: 'value', type: 'string' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
  ];

  return Object.entries(records).map(([key, value]) => ({
    to: BASENAMES_RESOLVER, // Only address changes
    value: '0',
    data: encodeFunctionData({
      abi: RESOLVER_ABI,
      functionName: 'setText',
      args: [node as `0x${string}`, key, value],
    }),
  }));
}
```

#### Address Records
```typescript
// V1 and V2 - IDENTICAL
export function getBasenameAddressRecordCalldata(
  subnameNode: string,
  creatorAddress: string
): { to: string; data: string; value: string } {
  const RESOLVER_ABI = [
    {
      name: 'setAddr',
      type: 'function',
      inputs: [
        { name: 'node', type: 'bytes32' },
        { name: 'addr', type: 'address' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
  ];

  return {
    to: BASENAMES_RESOLVER, // Only address changes
    data: encodeFunctionData({
      abi: RESOLVER_ABI,
      functionName: 'setAddr',
      args: [subnameNode as `0x${string}`, creatorAddress as `0x${string}`],
    }),
    value: '0',
  };
}
```

---

### Phase 4: Query Functions (Minimal Changes)

#### Current Implementation
```typescript
// lib/services/query-ens.ts
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.SEPOLIA_RPC_URL),
});

const textValue = await publicClient.getEnsText({
  name: normalizedName,
  key: 'eth.scenedex.releaseId',
});
```

#### Updated Implementation
```typescript
// lib/services/query-basenames.ts (rename or update)
const publicClient = createPublicClient({
  chain: baseSepolia, // Only chain changes
  transport: http(process.env.BASE_RPC_URL),
});

// Query methods remain IDENTICAL
const textValue = await publicClient.getEnsText({
  name: normalizedName,
  key: 'eth.scenedex.releaseId',
});
```

**Impact**: Low - Only chain configuration change.

---

## Payment Integration

### Current State (V1)
- **Payment**: None required (free subname creation via NameWrapper)
- **Gas**: User pays for transactions

### Basenames Requirements (V2)
- **Payment**: ETH payment required via `RegistrarController.register()`
- **Pricing**: Determined by `PriceOracle` (based on name length, duration)
- **Minimum Duration**: 1 year (365 days)
- **Payment Flow**: `msg.value` must equal or exceed `registerPrice()`

### Implementation
```typescript
// Get registration price
export async function getBasenameRegistrationPrice(
  name: string,
  duration: number = 365 * 24 * 60 * 60 // 1 year
): Promise<bigint> {
  const priceOracle = new ethers.Contract(
    BASENAMES_PRICE_ORACLE,
    PRICE_ORACLE_ABI,
    publicClient
  );
  
  const price = await priceOracle.price(name, 0, duration); // 0 = not registered before
  return price.base + price.premium; // base + premium
}

// Include in Safe transaction
const price = await getBasenameRegistrationPrice(subnameLabel);
const operations = [
  {
    to: BASENAMES_REGISTRAR_CONTROLLER,
    data: registerCalldata,
    value: price.toString(), // ETH payment
  },
  // ... other operations (Split, Zora)
];
```

**Impact**: High - Requires payment calculation and inclusion in Safe transaction.

---

## Complete Refactored Service

### New File: `lib/services/basenames.ts`

```typescript
import { baseSepolia } from 'viem/chains';
import { createPublicClient, createWalletClient, http, encodeFunctionData } from 'viem';
import { namehash, normalize } from 'viem/ens';
import { keccak256, encodePacked, toBytes } from 'viem';

// Contract addresses (Base Sepolia)
const BASENAMES_REGISTRY = '0x1493b2567056c2181630115660963E13A8E32735';
const BASENAMES_BASE_REGISTRAR = '0xa0c70ec36c010b55e3c434d6c6ebeec50c705794';
const BASENAMES_REGISTRAR_CONTROLLER = '0x49ae3cc2e3aa768b1e5654f5d3c6002144a59581';
const BASENAMES_RESOLVER = '0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA';
const BASENAMES_PRICE_ORACLE = '0x2b73408052825e17e0fe464f92de85e8c7723231';

// Minimum registration duration (1 year)
const MIN_REGISTRATION_DURATION = 365 * 24 * 60 * 60;

// ABI definitions
const REGISTRAR_CONTROLLER_ABI = [
  {
    name: 'register',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      {
        name: 'request',
        type: 'tuple',
        components: [
          { name: 'name', type: 'string' },
          { name: 'owner', type: 'address' },
          { name: 'duration', type: 'uint256' },
          { name: 'resolver', type: 'address' },
          { name: 'data', type: 'bytes[]' },
          { name: 'reverseRecord', type: 'bool' },
        ],
      },
    ],
    outputs: [],
  },
  {
    name: 'registerPrice',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'duration', type: 'uint256' },
    ],
    outputs: [{ type: 'uint256' }],
  },
];

const RESOLVER_ABI = [
  {
    name: 'setText',
    type: 'function',
    inputs: [
      { name: 'node', type: 'bytes32' },
      { name: 'key', type: 'string' },
      { name: 'value', type: 'string' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'setAddr',
    type: 'function',
    inputs: [
      { name: 'node', type: 'bytes32' },
      { name: 'addr', type: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
];

/**
 * Get registration price for a Basename
 */
export async function getBasenamePrice(
  name: string,
  duration: number = MIN_REGISTRATION_DURATION
): Promise<bigint> {
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.BASE_RPC_URL!),
  });

  const price = await publicClient.readContract({
    address: BASENAMES_REGISTRAR_CONTROLLER as `0x${string}`,
    abi: REGISTRAR_CONTROLLER_ABI,
    functionName: 'registerPrice',
    args: [name, BigInt(duration)],
  });

  return price as bigint;
}

/**
 * Build calldata for Basename registration with batched records
 */
export async function getBasenameRegistrationCalldata(
  subnameLabel: string,
  ownerAddress: string,
  resolverAddress: string,
  records: Record<string, string>,
  creatorAddress: string
): Promise<{ to: string; data: string; value: string }> {
  // Calculate subname node
  const parentNode = namehash('base.eth'); // Basenames uses base.eth
  const labelHash = keccak256(toBytes(subnameLabel));
  const subnameNode = keccak256(encodePacked(['bytes32', 'bytes32'], [parentNode, labelHash]));

  // Build batched records data
  const recordsData: `0x${string}`[] = [];

  // Add setAddr
  recordsData.push(
    encodeFunctionData({
      abi: RESOLVER_ABI,
      functionName: 'setAddr',
      args: [subnameNode, creatorAddress as `0x${string}`],
    })
  );

  // Add setText for each record
  for (const [key, value] of Object.entries(records)) {
    recordsData.push(
      encodeFunctionData({
        abi: RESOLVER_ABI,
        functionName: 'setText',
        args: [subnameNode, key, value],
      })
    );
  }

  // Get price
  const price = await getBasenamePrice(subnameLabel, MIN_REGISTRATION_DURATION);

  // Encode RegisterRequest
  const request = {
    name: subnameLabel,
    owner: ownerAddress,
    duration: BigInt(MIN_REGISTRATION_DURATION),
    resolver: resolverAddress,
    data: recordsData,
    reverseRecord: false,
  };

  // Encode register() call
  const calldata = encodeFunctionData({
    abi: REGISTRAR_CONTROLLER_ABI,
    functionName: 'register',
    args: [request],
  });

  return {
    to: BASENAMES_REGISTRAR_CONTROLLER,
    data: calldata,
    value: price.toString(),
  };
}

/**
 * Check if Basename is available
 */
export async function isBasenameAvailable(name: string): Promise<boolean> {
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.BASE_RPC_URL!),
  });

  const baseRegistrar = new ethers.Contract(
    BASENAMES_BASE_REGISTRAR,
    ['function isAvailable(uint256 id) view returns (bool)'],
    publicClient
  );

  const labelHash = keccak256(toBytes(name));
  const tokenId = BigInt(labelHash);
  
  return await baseRegistrar.isAvailable(tokenId);
}
```

---

## Integration with Safe Transaction Batching

### Current V1 Flow (Cross-Chain)
```typescript
// Split + Zora on Base Sepolia (client-side)
const splitAddress = await createSplitForRelease(...);
const coinResult = await createCoinForRelease(...);

// ENS on Sepolia (Safe transaction)
const ensCalldata = await getENSCompleteCalldata(...);
const safeTx = await createSafeTransaction(ensCalldata);
```

### New V2 Flow (All on Base Sepolia)
```typescript
// All operations on Base Sepolia - can batch in single Safe transaction
const operations = [];

// 1. Split creation calldata
const splitCalldata = getSplitCalldata(...);
operations.push({ to: SPLITS_CONTRACT, data: splitCalldata, value: '0' });

// 2. Zora coin creation calldata
const zoraCalldata = getZoraCoinCalldata(...);
operations.push({ to: ZORA_FACTORY, data: zoraCalldata, value: '0' });

// 3. Basename registration calldata (with payment)
const basenameCalldata = await getBasenameRegistrationCalldata(...);
operations.push(basenameCalldata); // Includes value (payment)

// 4. Execute all in single Safe transaction
const safeTx = await createSafeTransaction(operations);
```

**Benefits**:
- ✅ All operations in single transaction
- ✅ Atomic execution
- ✅ Lower total gas costs
- ✅ Simpler error handling

---

## Migration Checklist

### High Priority

- [ ] **Research Basenames Pricing**
  - [ ] Understand price oracle mechanism
  - [ ] Calculate typical registration costs
  - [ ] Determine if payment can be covered by Safe or requires user payment

- [ ] **Update Registration Flow**
  - [ ] Replace `createENSSubname()` with `getBasenameRegistrationCalldata()`
  - [ ] Integrate payment calculation
  - [ ] Update to use `RegistrarController.register()` instead of `NameWrapper.setSubnodeRecord()`

- [ ] **Update Chain Configuration**
  - [ ] Change all `sepolia` → `baseSepolia` imports
  - [ ] Update RPC URLs: `SEPOLIA_RPC_URL` → `BASE_RPC_URL`
  - [ ] Update contract addresses

### Medium Priority

- [ ] **Update Resolver Addresses**
  - [ ] Replace `ENS_RESOLVER_SEPOLIA` with `BASENAMES_RESOLVER_BASE_SEPOLIA`
  - [ ] Verify resolver functions work identically

- [ ] **Update Query Service**
  - [ ] Update `query-ens.ts` → `query-basenames.ts` (or rename)
  - [ ] Change chain configuration
  - [ ] Verify query methods work with Basenames

- [ ] **Update Domain Configuration**
  - [ ] Change parent domain from `scenedex.eth` to `base.eth` (or establish namespace)
  - [ ] Update `ENS_DOMAIN` env var if needed

### Low Priority

- [ ] **Optimize with Multicall**
  - [ ] Use `multicallWithNodeCheck()` for batching text records
  - [ ] Reduce transaction count

- [ ] **Update Documentation**
  - [ ] Update architecture docs
  - [ ] Update API documentation
  - [ ] Update environment variable docs

---

## Key Differences Summary

| Aspect | ENS (V1) | Basenames (V2) | Impact |
|--------|----------|----------------|--------|
| **Chain** | Sepolia L1 | Base Sepolia L2 | High - All operations move to L2 |
| **Registration** | NameWrapper (free) | RegistrarController (paid) | High - Payment required |
| **Transaction Count** | **13 transactions** (1 creation + 1 addr + 11 text) | **1 transaction** (everything batched) | **High - Major improvement** |
| **Atomicity** | Partial (creation atomic, records separate) | **Fully atomic** (creation + all records in one tx) | **High - Better atomicity** |
| **Resolver** | Custom/PublicResolver | L2Resolver | Low - Same interface |
| **Text Records** | setText() (11 separate txs) | setText() (batched in data[]) | **High - Batching improvement** |
| **Address Records** | setAddr() (1 separate tx) | setAddr() (batched in data[]) | **High - Batching improvement** |
| **Namehash** | keccak256 | keccak256 | None - Identical |
| **Normalization** | ENSIP-15 | ENSIP-15 | None - Identical |
| **Batching** | Sequential (no batching) | **Multicall via data[]** | **High - Major optimization** |
| **Expiry** | NameWrapper expiry (uint64) | BaseRegistrar nameExpires (uint256) | Medium - Different storage |
| **Fuses** | Supports fuses (uint32) | No fuses (ERC721 tokenization) | Low - Different permission model |
| **TTL** | Sets TTL (uint64) | TTL not used | Low - Modern pattern |

---

## Compatibility Assessment

### ✅ Fully Compatible (No Changes Needed)
1. **Text Records** - `setText()` function identical
2. **Address Records** - `setAddr()` function identical
3. **Namehash Algorithm** - Same keccak256 calculation
4. **Normalization** - Same ENSIP-15 standard
5. **Query Methods** - viem `getEnsText()`, `getEnsAddress()` work identically
6. **Resolver Interface** - Same `ITextResolver`, `IAddrResolver` interfaces

### ⚠️ Partially Compatible (Requires Changes)
1. **Registration Method** - Different API (`NameWrapper` → `RegistrarController`)
2. **Payment** - Basenames requires payment, ENS was free
3. **Batching** - Basenames supports better batching via `data[]` parameter
4. **Expiry Management** - Different storage mechanism

### ❌ Incompatible (Major Changes)
1. **Chain** - Must migrate from Sepolia to Base Sepolia
2. **Contract Addresses** - All addresses change
3. **Parent Domain** - May need to use `base.eth` or establish namespace

---

## Refactoring Effort Estimate

| Component | Complexity | Estimated Time | Risk Level |
|-----------|-----------|----------------|------------|
| **Registration Flow** | High | 2-3 days | High - New API, payment integration |
| **Chain Configuration** | Low | 0.5 day | Low - Find/replace |
| **Resolver Functions** | Low | 0.5 day | Low - Address change only |
| **Query Functions** | Low | 0.5 day | Low - Chain change only |
| **Payment Integration** | Medium | 1 day | Medium - Price calculation |
| **Testing** | High | 2-3 days | High - End-to-end validation |
| **Documentation** | Low | 0.5 day | Low - Update docs |

**Total Estimated Effort**: 7-9 days

---

## Risks & Mitigations

### High Risk Areas

1. **Payment Integration**
   - **Risk**: Registration requires ETH payment, may fail if insufficient funds
   - **Mitigation**: Calculate price before transaction, include in Safe transaction value

2. **Registration API Differences**
   - **Risk**: `RegistrarController.register()` has different parameters than `NameWrapper.setSubnodeRecord()`
   - **Mitigation**: Thorough testing, use type-safe encoding

3. **Price Oracle Dependencies**
   - **Risk**: Price calculation may fail or return unexpected values
   - **Mitigation**: Add error handling, validate prices before transactions

### Medium Risk Areas

1. **Domain Namespace**
   - **Risk**: May need to use `base.eth` instead of `scenedex.eth`
   - **Mitigation**: Research namespace establishment, or use `base.eth` subdomains

2. **Expiry Management**
   - **Risk**: Different expiry storage may affect renewal logic
   - **Mitigation**: Test expiry queries, update renewal flow if needed

### Low Risk Areas

1. **Resolver Functions** - Identical interfaces, low risk
2. **Query Functions** - Same viem methods, low risk
3. **Namehash/Normalization** - Identical algorithms, low risk

---

## Testing Strategy

### Unit Tests
- [ ] Test namehash calculation (should match ENS)
- [ ] Test normalization (should match ENS)
- [ ] Test price calculation
- [ ] Test calldata encoding

### Integration Tests
- [ ] Test registration flow end-to-end
- [ ] Test record setting (text + address)
- [ ] Test query/resolution
- [ ] Test payment handling

### E2E Tests
- [ ] Test complete publication flow with Basenames
- [ ] Test Safe transaction batching
- [ ] Test query from frontend
- [ ] Test error scenarios (insufficient payment, name taken, etc.)

---

## Success Criteria

- [ ] Basename registration working on Base Sepolia
- [ ] All text records setting correctly
- [ ] Address records setting correctly
- [ ] Query/resolution working correctly
- [ ] Payment integration working
- [ ] Safe transaction batching working
- [ ] All tests passing
- [ ] Documentation updated

---

## Conclusion

Basenames is **highly compatible** with ENS at the resolver level (text records, address records, namehash, normalization), but requires **significant refactoring** at the registration level due to:

1. **Different registration API** - `RegistrarController.register()` vs `NameWrapper.setSubnodeRecord()`
2. **Payment requirement** - Basenames requires ETH payment for registration
3. **Chain migration** - Moving from Sepolia L1 to Base Sepolia L2

### Key Advantages of Basenames Migration

**Major Improvement: Transaction Atomicity**
- **V1**: 13 transactions (1 creation + 1 addr + 11 text records)
- **V2**: **1 transaction** (everything batched atomically)
- **Benefit**: Better atomicity, lower gas costs, simpler error handling, faster execution

**The good news is that resolver functions are 100% compatible**, meaning:
- ✅ Text record setting (`setText`) - No changes needed (just batching)
- ✅ Address record setting (`setAddr`) - No changes needed (just batching)
- ✅ Query methods (`getEnsText`, `getEnsAddress`) - Only chain change needed
- ✅ Namehash calculation - No changes needed

### The Main Refactoring Challenge

The main refactoring effort is in the **registration flow**, which needs to be completely rewritten to:
1. Use `RegistrarController.register()` instead of `NameWrapper.setSubnodeRecord()`
2. Integrate payment calculation (new requirement)
3. Batch all record-setting operations via `data[]` parameter (major improvement)

**However, this refactoring results in a MORE atomic and efficient system** - reducing from 13 transactions to 1 transaction, while maintaining full compatibility with ENS resolver standards.

**Estimated Effort**: 7-9 days for complete migration
**Risk Level**: Medium-High (due to payment integration and API differences)
**Compatibility**: High (at resolver level), Medium (at registration level)
**Improvement**: **High** - Better atomicity, fewer transactions, lower gas costs

