# Action Plan: Direct Subname Registration (Bypassing RegistrarController)

## Summary

Since you own `scenius.basetest.eth` directly (not via BaseRegistrar), we need to use direct Registry methods instead of `RegistrarController.register()`. This approach:
- ✅ **FREE** - No payment required (unlike RegistrarController)
- ✅ **Keeps your ownership** - You maintain direct control
- ❌ **Not atomic** - Multiple Safe transactions (not batched in one)
- ❌ **More complex** - More transactions to manage

## Answers to Your Questions

### 1. "Handle payments manually - does that mean creating my own script?"

**No payment needed!** When using `Registry.setSubnodeRecord()` directly, it's **FREE**. The payment is only required when using `RegistrarController.register()`. So you don't need to handle payments at all.

### 2. "Several transactions on Safe, not atomic?"

**Yes, correct.** The flow will be:
1. `Registry.setSubnodeRecord()` - Creates subname + sets owner + resolver (1 transaction)
2. `Resolver.setAddr()` - Sets address record (1 transaction)  
3. `Resolver.setText()` × N - Sets text records (N transactions)

**Total: 1 + 1 + N = 2 + N transactions** (not atomic like RegistrarController's single transaction)

However, Safe can batch these in a single Safe transaction, so from your perspective it's still one Safe transaction with multiple operations.

## Implementation Steps

### Step 1: Create Direct Registration Function ✅
- [x] Created `get-direct-subname-calldata.ts` helper
- Uses `Registry.setSubnodeRecord()` (free, no payment)
- Generates calldata for all operations

### Step 2: Update `getENSCompleteCalldata()` 
- [ ] Modify to detect if BaseRegistrar owns baseNode
- [ ] If yes → use RegistrarController (current flow)
- [ ] If no → use direct Registry methods (new flow)
- [ ] Return appropriate calldata based on ownership

### Step 3: Test Direct Registration Flow
- [ ] Test `Registry.setSubnodeRecord()` call
- [ ] Test record setting (setAddr + setText)
- [ ] Verify subname is created correctly
- [ ] Verify records are set correctly

### Step 4: Update `execute-safe-publish.ts`
- [ ] Use new direct registration flow
- [ ] Test end-to-end with Safe transaction

### Step 5: Document Basenames Issue
- [x] Created `BASENAMES-ARCHITECTURE-ISSUE.md`
- [ ] Create GitHub issue in Basenames repo
- [ ] Link to issue in our documentation

## Next Steps

1. **Update `getENSCompleteCalldata()`** to support both flows
2. **Test the direct registration** approach
3. **Create GitHub issue** for Basenames team
4. **Update documentation** with both approaches

Would you like me to proceed with updating `getENSCompleteCalldata()` to support both flows?

