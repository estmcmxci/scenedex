# Direct Subname Registration: Summary & Answers

## Your Questions Answered

### 1. "Handle payments manually - does that mean creating my own script?"

**Answer: No payment needed!** 

When using `Registry.setSubnodeRecord()` directly (bypassing RegistrarController), it's **completely FREE**. The payment is only required when using `RegistrarController.register()`, which we can't use because BaseRegistrar doesn't own your domain.

**No payment script needed** - just use `Registry.setSubnodeRecord()` with `value: 0`.

### 2. "Several transactions on Safe, not atomic?"

**Answer: Yes, but Safe can batch them!**

The flow will be:
- **Operation 1**: `Registry.setSubnodeRecord()` - Creates subname + sets owner + resolver (FREE)
- **Operation 2**: `Resolver.setAddr()` - Sets address record
- **Operation 3-N**: `Resolver.setText()` × N - Sets text records

**From Safe's perspective**: These are multiple operations in a **single Safe transaction** (batched). So it's still one Safe transaction, just with multiple internal operations.

**Not atomic like RegistrarController**: RegistrarController.register() does everything in one contract call. Our approach uses multiple contract calls, but Safe batches them so they all succeed or fail together.

## Implementation Approach

### Current Status
- ✅ Created `get-direct-subname-calldata.ts` helper function
- ✅ Created `BASENAMES-ARCHITECTURE-ISSUE.md` documentation
- ✅ Created `ACTION-PLAN-DIRECT-REGISTRATION.md` action plan
- ⏳ Need to update `getENSCompleteCalldata()` to use direct registration
- ⏳ Need to test the flow

### Next Steps

1. **Update `getENSCompleteCalldata()`** to:
   - Check if BaseRegistrar owns baseNode
   - If yes → use RegistrarController (current flow)
   - If no → use direct Registry methods (new flow)

2. **Test Direct Registration**:
   - Test `Registry.setSubnodeRecord()` 
   - Test record setting
   - Verify it works end-to-end

3. **Create GitHub Issue** for Basenames team:
   - Document the architecture limitation
   - Propose solutions
   - Get feedback from Basenames team

## Key Differences

| Feature | RegistrarController | Direct Registry |
|---------|-------------------|-----------------|
| **Payment** | Required (~0.001 ETH) | FREE |
| **Atomic** | Yes (1 contract call) | No (multiple calls, but Safe batches) |
| **Batching** | Built-in (data[] parameter) | Manual (multiple operations) |
| **Requirement** | BaseRegistrar must own baseNode | User must own baseNode |
| **Control** | BaseRegistrar owner controls | User controls directly |

## Recommendation

Since you want to keep ownership, we should:
1. ✅ Use direct Registry approach (no payment, you keep control)
2. ✅ Batch operations in Safe transaction (still one Safe tx)
3. ✅ Document the limitation and create GitHub issue
4. ✅ Update code to support both flows (detect ownership)

Would you like me to proceed with updating `getENSCompleteCalldata()` to automatically detect ownership and use the appropriate flow?

