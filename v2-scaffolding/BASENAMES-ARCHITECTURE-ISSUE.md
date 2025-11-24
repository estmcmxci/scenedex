# Basenames Architecture Issue: Direct Domain Ownership vs RegistrarController

## Problem Statement

When a user registers a domain directly via `Registry.setSubnodeOwner()` (or similar direct methods), they own the domain at the Registry level. However, the `RegistrarController.register()` function requires that `BaseRegistrar` contract owns the baseNode, as enforced by the `live()` modifier:

```solidity
modifier live() {
    if (registry.owner(baseNode) != address(this)) revert RegistrarNotLive();
    _;
}
```

This creates a **developer experience issue**: Users who register domains directly cannot use the convenient `RegistrarController.register()` method with its atomic batching and payment handling.

## Current Architecture

### Standard Flow (BaseRegistrar Owns BaseNode)
1. BaseRegistrar contract owns the baseNode (e.g., `scenius.basetest.eth`)
2. RegistrarController is authorized as a controller
3. Users can call `RegistrarController.register()` which:
   - Handles payment automatically
   - Batches record setting atomically
   - Sets expiry automatically

### Direct Registration Flow (User Owns BaseNode)
1. User registers domain directly via Registry
2. User owns the baseNode directly
3. **Cannot use RegistrarController.register()** (reverts with `RegistrarNotLive`)
4. Must use manual approach:
   - `Registry.setSubnodeRecord()` (free, but separate transactions)
   - Manual payment handling (if needed)
   - Separate transactions for each record

**Important Trade-offs of Direct Registry Calls:**
- ✅ **FREE** - No payment required (`setSubnodeRecord()` is nonpayable)
- ✅ **Full Control** - User maintains direct ownership at Registry level
- ❌ **No Tokenization** - Subnames are NOT ERC721 tokens (no NFT minting)
- ❌ **No Expiry** - Subnames do NOT expire (no expiration mechanism)
- ❌ **No Batching** - Cannot batch record setting in single contract call (must use multiple operations)

## Impact

- **Bad Developer Experience**: Developers who want full control over their domain must use a more complex, multi-transaction approach
- **Inconsistent API**: The same Basenames system has two different registration paths with different capabilities
- **No Atomic Batching**: Direct registration cannot batch record setting like RegistrarController can
- **Feature Loss**: Direct Registry calls lose tokenization (ERC721) and expiry features, even though they're free
- **Trade-off Confusion**: Developers may not understand the implications of choosing direct ownership vs BaseRegistrar ownership

## Proposed Solutions

### Option 1: Allow RegistrarController to Work with Direct Owners
Modify `RegistrarController` to support both:
- BaseRegistrar-owned baseNodes (current)
- Direct owner baseNodes (new)

This could be done by:
- Checking if caller is authorized (owner or operator) for the baseNode
- Bypassing the `live()` check when caller is directly authorized

### Option 2: Provide Alternative Controller
Create a new controller contract that:
- Works with direct owners (no BaseRegistrar requirement)
- Provides same batching and payment features
- Can be used alongside existing RegistrarController

### Option 3: Documentation & Tooling
- Document the two registration paths clearly
- Provide helper contracts/libraries for direct owners
- Create examples for both approaches

## Example Use Case

**Catalogue Platform** registers `scenius.basetest.eth` directly to maintain full control. They want to:
- Create subnames programmatically
- Batch record setting atomically
- Handle payments automatically

**Current Limitation**: Must use manual `Registry.setSubnodeRecord()` + separate record transactions (not atomic, more complex).

**Trade-offs Accepted**:
- ✅ FREE subname creation (no payment)
- ✅ Full Registry-level control
- ❌ No ERC721 tokenization (subnames are not NFTs)
- ❌ No expiry mechanism (subnames never expire)
- ❌ Multiple operations required (Safe can batch, but not atomic at contract level)

## Questions for Basenames Team

1. Is this architecture intentional (security/design decision)?
2. Are there plans to support direct owners in RegistrarController?
3. Would a new controller contract for direct owners be acceptable?
4. What is the recommended approach for developers who want direct ownership?
5. Is there a way to get tokenization/expiry features while maintaining direct Registry ownership?
6. Should we document these trade-offs more clearly in the Basenames documentation?

## Related Code

- `BaseRegistrar.sol` - `live()` modifier (line 151-154)
- `RegistrarController.sol` - `register()` function (line 438)
- `Registry.sol` - `setSubnodeOwner()` and `setSubnodeRecord()` (lines 113-124, 85-92)

## Environment

- Network: Base Sepolia
- Contracts:
  - Registry: `0x1493b2567056c2181630115660963E13A8E32735`
  - BaseRegistrar: `0xa0c70ec36c010b55e3c434d6c6ebeec50c705794`
  - RegistrarController: `0x82c858CDF64b3D893Fe54962680edFDDC37e94C8`

