# RegistrarController Incompatible with Direct Registry Ownership

## Problem Statement

When a domain is registered directly via `Registry.setSubnodeRecord()` (user owns the baseNode at Registry level), the `RegistrarController.register()` function cannot be used because it requires `BaseRegistrar` contract to own the baseNode, as enforced by the `live()` modifier.

This creates a **developer experience issue**: Developers who choose direct Registry ownership for full control cannot use the convenient `RegistrarController.register()` method with its atomic batching and payment handling.

## Current Behavior

### Standard Flow (BaseRegistrar Owns BaseNode)
1. `BaseRegistrar` contract owns the baseNode (e.g., `scenius.basetest.eth`)
2. `RegistrarController` is authorized as a controller
3. Users can call `RegistrarController.register()` which:
   - Handles payment automatically
   - Batches record setting atomically
   - Sets expiry automatically

### Direct Registration Flow (User Owns BaseNode)
1. User registers domain directly via `Registry.setSubnodeRecord()`
2. User owns the baseNode directly at Registry level
3. **Cannot use `RegistrarController.register()`** - reverts with `RegistrarNotLive` error
4. Must use manual approach:
   - `Registry.setSubnodeRecord()` (free, but separate transaction)
   - Individual resolver operations (`setAddr`, `setText`) in separate transactions
   - No atomic batching at contract level

## Code Reference

The issue is in `RegistrarController.sol`:

```solidity
modifier live() {
    if (registry.owner(baseNode) != address(this)) revert RegistrarNotLive();
    _;
}
```

This modifier prevents `register()` from working when the baseNode is owned directly by a user instead of `BaseRegistrar`.

**Related Contracts:**
- `BaseRegistrar.sol` - `live()` modifier (line 151-154)
- `RegistrarController.sol` - `register()` function (line 438)
- `Registry.sol` - `setSubnodeOwner()` and `setSubnodeRecord()` (lines 113-124, 85-92)

## Trade-offs of Direct Registry Ownership

**Advantages:**
- ✅ **FREE** - No payment required (`setSubnodeRecord()` is nonpayable)
- ✅ **Full Control** - User maintains direct ownership at Registry level
- ✅ **No Expiry** - Subnames do NOT expire (permanent ownership)

**Disadvantages:**
- ❌ **No Tokenization** - Subnames are NOT ERC721 tokens (no NFT minting)
- ❌ **No Expiry Mechanism** - Subnames never expire (may be pro or con)
- ❌ **No Atomic Batching** - Cannot batch record setting in single contract call (must use multiple operations)

## Real-World Impact

### Our Use Case: Catalogue Platform

We (Catalogue Platform) registered `scenius.basetest.eth` directly to maintain full control. We need to:
- Create subnames programmatically (e.g., `eros001.scenius.basetest.eth`)
- Set multiple ENS records atomically (address + 10 text records)
- Execute via Safe multisig transactions

**Current Workaround:**
We've implemented a workaround that executes 2 Safe transactions:
1. **Transaction 1**: `Registry.setSubnodeRecord()` - Creates subname
2. **Transaction 2**: Batched resolver operations - `setAddr` + 10 `setText` calls

This works, but requires:
- Multiple Safe transactions (2 instead of 1)
- Manual gas estimation (we had to fix GS025 errors by removing `safeTxGas: '1'`)
- No atomic guarantee at contract level (Safe batches, but not contract-level atomicity)

**Verification:**
We've successfully registered and verified multiple subnames:
- `eros006.scenius.basetest.eth` ✅
- `eros007.scenius.basetest.eth` ✅
- All 10 text records set correctly ✅

## Proposed Solutions

### Option 1: Extend RegistrarController to Support Direct Owners
Modify `RegistrarController` to support both:
- BaseRegistrar-owned baseNodes (current behavior)
- Direct owner baseNodes (new capability)

**Implementation approach:**
- Check if caller is authorized (owner or operator) for the baseNode
- Bypass the `live()` check when caller is directly authorized
- Maintain backward compatibility with existing BaseRegistrar flow

**Pros:**
- Single controller for both use cases
- Maintains existing API
- Backward compatible

**Cons:**
- Requires contract modification
- More complex authorization logic

### Option 2: Create Alternative Controller Contract
Create a new controller contract (e.g., `DirectOwnerController`) that:
- Works with direct owners (no BaseRegistrar requirement)
- Provides same batching and payment features as `RegistrarController`
- Can be used alongside existing `RegistrarController`

**Pros:**
- No changes to existing contracts
- Clear separation of concerns
- Can be deployed independently

**Cons:**
- Code duplication
- Two controllers to maintain
- Developer confusion about which to use

### Option 3: Documentation & Helper Contracts
- Document the two registration paths clearly
- Provide helper contracts/libraries for direct owners
- Create examples for both approaches
- Add tooling to simplify direct owner workflows

**Pros:**
- No contract changes required
- Can be implemented immediately
- Improves developer experience

**Cons:**
- Doesn't solve the atomic batching limitation
- Still requires multiple transactions
- Less convenient than Option 1 or 2

## Questions for Basenames Team

1. **Architecture Intent**: Is this architecture intentional (security/design decision)? Are there specific reasons why `RegistrarController` requires `BaseRegistrar` ownership?

2. **Future Plans**: Are there plans to support direct owners in `RegistrarController` or provide an alternative controller?

3. **Controller Contract**: Would a new controller contract for direct owners be acceptable? Would the Basenames team be open to reviewing/accepting such a contract?

4. **Recommended Approach**: What is the recommended approach for developers who want direct Registry ownership but also need atomic batching?

5. **Feature Trade-offs**: Is there a way to get tokenization/expiry features while maintaining direct Registry ownership? Or are these features fundamentally incompatible with direct ownership?

6. **Documentation**: Should we document these trade-offs more clearly in the Basenames documentation? We're happy to contribute documentation if helpful.

## Environment Details

**Network:** Base Sepolia Testnet

**Contract Addresses:**
- Registry: `0x1493b2567056c2181630115660963E13A8E32735`
- BaseRegistrar: `0xa0c70ec36c010b55e3c434d6c6ebeec50c705794`
- RegistrarController: `0x82c858CDF64b3D893Fe54962680edFDDC37e94C8`
- Resolver: `0x85C87e548091f204C2d0350b39ce1874f02197c6`

**Test Subnames:**
- `eros006.scenius.basetest.eth` - Successfully registered with all records
- `eros007.scenius.basetest.eth` - Successfully registered with all records

## Additional Context

We've built a working implementation that:
- ✅ Successfully creates subnames via `Registry.setSubnodeRecord()`
- ✅ Sets all ENS records (address + 10 text records) via batched Safe transactions
- ✅ Verifies all records are set correctly
- ✅ Handles gas estimation properly (fixed GS025 errors)

However, we believe the developer experience could be significantly improved if direct owners could use a controller-like interface for atomic batching.

## Labels

- `enhancement`
- `developer-experience`
- `architecture`
- `question`

---

**Would love to discuss this with the team and contribute to a solution!** 🚀

