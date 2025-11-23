# V1 to V2 Architecture Refactoring Analysis

## Executive Summary

This document analyzes the components of the Catalogue v1 architecture that require refactoring for v2, focusing on the migration from a multi-chain (Sepolia L1 + Base Sepolia L2) architecture to a unified Base Sepolia (L2) architecture. The primary goal is to enable atomic transaction batching through Safe multisig, eliminating client-side transaction signing and simplifying the approval flow.

---

## Architecture Comparison Table

| Component | V1 Architecture | V2 Architecture | Refactoring Required | Impact Level |
|-----------|----------------|------------------|---------------------|--------------|
| **Safe Multisig** | Deployed on Sepolia (L1, chain ID 11155111) | Deployed on Base Sepolia (L2, chain ID 84532) | **High** - Complete redeployment + code migration | Critical |
| **ENS Registration** | Ethereum Sepolia (L1) via ENS NameWrapper | Base Sepolia (L2) via Basenames protocol | **High** - Service rewrite, contract address changes | Critical |
| **Split Contracts** | Base Sepolia (L2) - Already correct | Base Sepolia (L2) - No change | **None** - Already on target chain | None |
| **Zora Coins** | Base Sepolia (L2) - Already correct | Base Sepolia (L2) - No change | **None** - Already on target chain | None |
| **Transaction Flow** | Cross-chain: Split/Zora on Base, ENS on Sepolia | Single-chain: All operations on Base Sepolia | **High** - Complete flow redesign | Critical |
| **Client-Side Transactions** | User signs Split + Zora transactions directly | All transactions via Safe batch | **High** - Remove client signing logic | High |
| **Job Worker** | Publishes to multiple chains | Publishes to single chain | **Medium** - Simplify chain logic | Medium |
| **Approval Flow** | Approve → Client creates contracts → Safe creates ENS | Approve → Safe batches all operations | **High** - Simplify to single step | High |
| **Chain Configuration** | Mixed: Sepolia for Safe/ENS, Base Sepolia for Split/Zora | Unified: Base Sepolia for all | **Medium** - Update all chain references | Medium |
| **RPC Endpoints** | `SEPOLIA_RPC_URL` + `BASE_RPC_URL` | `BASE_RPC_URL` only (for on-chain ops) | **Low** - Environment variable cleanup | Low |
| **Database Schema** | Stores Safe address (Sepolia) | Stores Safe address (Base Sepolia) | **Low** - Data migration script needed | Low |
| **UI/UX** | Network switching prompts, "Create Contracts" button | Single approval button, no network switching | **Medium** - Simplify dashboard | Medium |
| **Creator Proofs** | Basic timestamps only (`createdAt` in DB) | Cryptographic proofs + timestamps in DB + ENS | **Medium** - Add signature generation, storage | Medium |
| **Publisher Proofs** | IPFS proof only (not in DB or ENS) | Proofs in DB + ENS + IPFS | **Medium** - Add database fields, ENS records | Medium |

---

## Detailed Component Analysis

### 1. Safe Multisig Service

#### V1 Implementation
- **Location**: `lib/services/safe.ts`, `lib/services/safe-transactions.ts`, `lib/services/user-safes.ts`
- **Chain**: Ethereum Sepolia (L1, chain ID 11155111)
- **RPC**: `SEPOLIA_RPC_URL`
- **Functionality**: 
  - Signature verification (EIP-191)
  - Safe membership checks via `getOwners()`
  - Threshold verification via `getThreshold()`
  - Safe transaction creation via Safe Transaction Service API

#### V2 Requirements
- **Chain**: Base Sepolia (L2, chain ID 84532)
- **RPC**: `BASE_RPC_URL`
- **Changes Needed**:
  1. Update all `sepolia` imports → `baseSepolia`
  2. Change chain ID references: `11155111` → `84532`
  3. Update RPC URL references: `SEPOLIA_RPC_URL` → `BASE_RPC_URL`
  4. Verify Safe Transaction Service supports Base Sepolia
  5. Redeploy Safe on Base Sepolia with same owners/threshold
  6. Update database `curator_settings.safe_address`

#### Refactoring Approach
```typescript
// V1
import { sepolia } from 'viem/chains';
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL!);

// V2
import { baseSepolia } from 'viem/chains';
const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL!);
```

**Files to Modify**:
- `lib/services/safe.ts` - Update chain references
- `lib/services/safe-transactions.ts` - Update Safe API chain ID
- `lib/services/user-safes.ts` - Update chain configuration

**Risk Level**: High - Core security component, requires thorough testing

---

### 2. ENS Service → Basenames Service

#### V1 Implementation
- **Location**: `lib/services/ens.ts`, `lib/services/query-ens.ts`
- **Chain**: Ethereum Sepolia (L1)
- **Protocol**: ENS (Ethereum Name Service)
- **Contracts**: 
  - NameWrapper: `0x0635513f179D50A207757E05759CbD106d7dFcE8`
  - Resolver: `ENS_RESOLVER_SEPOLIA` env var
- **Functionality**:
  - `getNextEROSNumber()` - Finds next available subname
  - `createENSSubname()` - Creates subname via NameWrapper
  - `executeENSRecords()` - Sets 11 text records via resolver
  - `registerEROSRelease()` - Complete ENS registration flow

#### V2 Requirements
- **Chain**: Base Sepolia (L2)
- **Protocol**: Basenames (ENS-compatible on Base)
- **Contracts**: TBD - Need to research Basenames contract addresses
- **Changes Needed**:
  1. Replace `sepolia` → `baseSepolia` in all imports
  2. Update RPC: `SEPOLIA_RPC_URL` → `BASE_RPC_URL`
  3. Research and update contract addresses for Basenames
  4. Verify Basenames ABI compatibility with ENS
  5. Update environment variables:
     - `ENS_RESOLVER_SEPOLIA` → `ENS_RESOLVER_BASE_SEPOLIA`
     - `ENS_NAMEWRAPPER_SEPOLIA` → `ENS_NAMEWRAPPER_BASE_SEPOLIA`
  6. Test Basenames resolution and registration

#### Refactoring Approach
```typescript
// V1
import { sepolia } from 'viem/chains';
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.SEPOLIA_RPC_URL!),
});

// V2
import { baseSepolia } from 'viem/chains';
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.BASE_RPC_URL!),
});
```

**Files to Modify**:
- `lib/services/ens.ts` - Complete rewrite for Basenames
- `lib/services/query-ens.ts` - Update chain and contract addresses

**Risk Level**: High - Unknown Basenames compatibility, requires research phase

**Research Needed**:
- Basenames contract addresses on Base Sepolia
- Basenames ABI differences from ENS
- Basenames SDK/documentation
- NameWrapper equivalent in Basenames

---

### 3. Jobs Service (Publication Flow)

#### V1 Implementation
- **Location**: `lib/services/jobs.ts`
- **Current Flow**:
  1. Load release from database
  2. Pin files to IPFS
  3. Create Split contract on Base Sepolia (client-side)
  4. Create Zora coin on Base Sepolia (client-side)
  5. Register ENS subname on Sepolia (via Safe)
  6. Set ENS text records on Sepolia (via Safe)

#### V2 Requirements
- **New Flow**:
  1. Load release from database
  2. Pin files to IPFS
  3. Build calldata for: Split + Zora + Basename operations
  4. Create single Safe transaction on Base Sepolia (batches all)
  5. Execute Safe transaction atomically

#### Refactoring Approach
```typescript
// V1 - Direct execution
const splitAddress = await createSplitForRelease(...);
const coinResult = await createCoinForRelease(...);
const ensResult = await registerEROSRelease(...);

// V2 - Calldata generation for batching
const splitCalldata = getSplitCalldata(...);
const zoraCalldata = getZoraCoinCalldata(...);
const basenameCalldata = getBasenameCalldata(...);
const safeTx = await createSafeTransaction({
  to: [splitContract, zoraFactory, basenameContract],
  data: [splitCalldata, zoraCalldata, basenameCalldata],
  value: ['0', '0', '0'],
});
```

**Files to Modify**:
- `lib/services/jobs.ts` - Rewrite `publishRelease()` to use calldata batching
- `lib/services/splits.ts` - Add `getSplitCalldata()` function
- `lib/services/zora.ts` - Add `getZoraCoinCalldata()` function
- `lib/services/ens.ts` - Add `getBasenameCalldata()` function

**Risk Level**: High - Core business logic, requires extensive testing

---

### 4. Approval Flow (API Routes)

#### V1 Implementation
- **Location**: `app/api/approve/route.ts`, `app/curator/dashboard/page.tsx`
- **Current Flow**:
  1. Curator signs approval message
  2. Store approval in database
  3. Check if threshold met
  4. If met, return contract transaction data to client
  5. Client creates Split + Zora contracts on Base Sepolia
  6. Client creates Safe transaction for ENS on Sepolia
  7. Safe executes ENS registration

#### V2 Requirements
- **New Flow**:
  1. Curator signs approval message
  2. Store approval in database
  3. Check if threshold met
  4. If met, directly call `publishReleaseViaSafe()` (server-side)
  5. Server builds batched Safe transaction
  6. Safe executes all operations atomically

#### Refactoring Approach
```typescript
// V1 - Client-side transactions
if (thresholdMet) {
  return NextResponse.json({
    contractTxData: {
      split: { to, data, value },
      zora: { to, data, value },
    },
  });
}

// V2 - Server-side batching
if (thresholdMet) {
  await publishReleaseViaSafe(releaseId);
  return NextResponse.json({
    success: true,
    message: 'Publication initiated via Safe transaction',
  });
}
```

**Files to Modify**:
- `app/api/approve/route.ts` - Remove client transaction data, add direct publish call
- `app/curator/dashboard/page.tsx` - Remove "Create Contracts" button, simplify UI
- `app/api/releases/[id]/contract-tx-data/route.ts` - **DELETE** (no longer needed)
- `app/api/releases/[id]/contracts-created/route.ts` - **DELETE** (no longer needed)

**Risk Level**: High - User-facing flow, requires UX testing

---

### 5. Splits Service

#### V1 Implementation
- **Location**: `lib/services/splits.ts`
- **Chain**: Base Sepolia (L2) - Already correct
- **Functionality**: `createSplitForRelease()` - Deploys SplitV2 contract

#### V2 Requirements
- **Chain**: Base Sepolia (L2) - No change
- **New Functionality**: Add `getSplitCalldata()` - Returns calldata for Safe batching

#### Refactoring Approach
```typescript
// V1 - Direct execution
export async function createSplitForRelease(...): Promise<string> {
  const { splitAddress } = await splitsClient.createSplit({...});
  return splitAddress;
}

// V2 - Add calldata generation
export function getSplitCalldata(...): string {
  return encodeFunctionData({
    abi: SPLITS_ABI,
    functionName: 'createSplit',
    args: [...],
  });
}
```

**Files to Modify**:
- `lib/services/splits.ts` - Add calldata generation function (keep existing for backward compatibility if needed)

**Risk Level**: Low - Additive change, existing functionality preserved

---

### 6. Zora Service

#### V1 Implementation
- **Location**: `lib/services/zora.ts`
- **Chain**: Base Sepolia (L2) - Already correct
- **Functionality**: `createCoinForRelease()` - Deploys ERC20 coin via factory

#### V2 Requirements
- **Chain**: Base Sepolia (L2) - No change
- **New Functionality**: Add `getZoraCoinCalldata()` - Returns calldata for Safe batching

#### Refactoring Approach
```typescript
// V1 - Direct execution
export async function createCoinForRelease(...): Promise<{coinAddress, symbol}> {
  const hash = await walletClient.writeContract({...});
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  return { coinAddress: receipt.logs[0].address, symbol };
}

// V2 - Add calldata generation
export function getZoraCoinCalldata(...): string {
  return encodeFunctionData({
    abi: COIN_FACTORY_ABI,
    functionName: 'deploy',
    args: [...],
  });
}
```

**Files to Modify**:
- `lib/services/zora.ts` - Add calldata generation function

**Risk Level**: Low - Additive change

---

### 7. Chain Configuration

#### V1 Implementation
- **Mixed Chains**:
  - Sepolia (L1): Safe, ENS
  - Base Sepolia (L2): Split, Zora
- **RPC URLs**: `SEPOLIA_RPC_URL`, `BASE_RPC_URL`
- **Wagmi Config**: Both chains in `chains` array

#### V2 Requirements
- **Unified Chain**: Base Sepolia (L2) for all operations
- **RPC URLs**: `BASE_RPC_URL` only (for on-chain operations)
- **Wagmi Config**: Base Sepolia as primary chain

#### Refactoring Approach
```typescript
// V1 - app/providers.tsx
chains: [mainnet, sepolia, base, baseSepolia]

// V2 - app/providers.tsx
chains: [mainnet, base, baseSepolia] // Remove sepolia, prioritize baseSepolia
```

**Files to Modify**:
- `app/providers.tsx` - Update chain configuration
- All service files - Remove Sepolia references
- Environment variables - Update/remove `SEPOLIA_RPC_URL` usage

**Risk Level**: Medium - Widespread changes, but straightforward

---

### 8. Database Schema

#### V1 Implementation
- **`curator_settings` table**: Stores Sepolia Safe address
- **`user_safes` table**: Links users to Sepolia Safe addresses

#### V2 Requirements
- **Migration Needed**: Update all Safe addresses to Base Sepolia addresses
- **Schema Changes**: None (same structure, different addresses)

#### Refactoring Approach
```sql
-- Migration script
UPDATE curator_settings 
SET safe_address = '<new-base-sepolia-safe-address>'
WHERE safe_address = '<old-sepolia-safe-address>';

UPDATE user_safes 
SET safe_address = '<new-base-sepolia-safe-address>'
WHERE safe_address = '<old-sepolia-safe-address>';
```

**Files to Create**:
- `lib/db/migrations/002-migrate-safe-to-base-sepolia.sql`

**Risk Level**: Low - Simple data migration, can be tested on staging

---

### 9. UI/UX Components

#### V1 Implementation
- **Location**: `app/curator/dashboard/page.tsx`
- **Features**:
  - Network switching prompts (Sepolia ↔ Base Sepolia)
  - "Create Contracts" button (client-side transactions)
  - Separate approval and contract creation steps
  - Transaction status tracking for multiple chains

#### V2 Requirements
- **Simplified Flow**:
  - Single "Approve" button
  - No network switching (all on Base Sepolia)
  - Automatic publication when threshold met
  - Single transaction status (Safe transaction)

#### Refactoring Approach
```typescript
// V1 - Complex UI
<Button onClick={handleCreateContracts}>
  Create Split & Zora Contracts
</Button>
<Button onClick={handleCreateSafeTx}>
  Create ENS Transaction
</Button>

// V2 - Simplified UI
<Button onClick={handleApprove}>
  Approve Release
</Button>
{thresholdMet && <Status>Publication in progress...</Status>}
```

**Files to Modify**:
- `app/curator/dashboard/page.tsx` - Simplify approval flow, remove contract creation UI

**Risk Level**: Medium - UX improvement, requires user testing

---

## Refactoring Priority Matrix

| Priority | Component | Reason | Estimated Effort |
|----------|-----------|--------|------------------|
| **P0 - Critical** | Safe Service Migration | Foundation for all operations | 1-2 days |
| **P0 - Critical** | Basenames Service | Required for ENS replacement | 2-3 days (includes research) |
| **P0 - Critical** | Jobs Service (Batching) | Core publication flow | 2-3 days |
| **P1 - High** | Approval Flow Refactor | User-facing, simplifies UX | 1 day |
| **P1 - High** | Splits/Zora Calldata | Required for batching | 1 day |
| **P2 - Medium** | Chain Configuration | Widespread but straightforward | 0.5 day |
| **P2 - Medium** | UI Simplification | UX improvement | 1 day |
| **P3 - Low** | Database Migration | Simple script, low risk | 0.5 day |
| **P3 - Low** | Environment Variables | Cleanup and documentation | 0.5 day |

**Total Estimated Effort**: 9-12 days

---

## Migration Strategy

### Phase 1: Research & Preparation (2-3 days)
1. Research Basenames contracts on Base Sepolia
2. Verify Safe Transaction Service supports Base Sepolia
3. Document all contract addresses and ABIs
4. Create migration branch

### Phase 2: Safe Migration (1-2 days)
1. Deploy Safe on Base Sepolia
2. Update Safe service code
3. Test Safe operations
4. Update database Safe addresses

### Phase 3: Basenames Migration (2-3 days)
1. Update ENS service to Basenames
2. Test Basename operations
3. Verify resolution works
4. Update environment variables

### Phase 4: Flow Integration (2-3 days)
1. Add calldata generation to Splits/Zora services
2. Rewrite Jobs service for batching
3. Update approval flow
4. Remove client-side transaction logic

### Phase 5: UI & Cleanup (1-2 days)
1. Simplify curator dashboard
2. Update chain configuration
3. Remove unused API routes
4. Update documentation

### Phase 6: Testing & Validation (2-3 days)
1. End-to-end testing
2. Database migration on staging
3. Production readiness review
4. Rollback plan documentation

---

## Risk Assessment

### High Risk Areas
1. **Basenames Compatibility**: Unknown if Basenames is 100% ENS-compatible
   - **Mitigation**: Research phase, fallback to ENS if needed
2. **Safe API Support**: Need to verify Base Sepolia support
   - **Mitigation**: Contact Safe team, test early
3. **Transaction Batching**: Complex logic, potential for errors
   - **Mitigation**: Extensive testing, staged rollout

### Medium Risk Areas
1. **Data Migration**: Existing Safe links need updating
   - **Mitigation**: Migration script, backup before migration
2. **Backward Compatibility**: Existing releases on Sepolia
   - **Mitigation**: Keep Sepolia code as reference, document migration path

### Low Risk Areas
1. **Chain Configuration**: Straightforward find/replace
2. **Environment Variables**: Simple cleanup
3. **UI Simplification**: UX improvement, low technical risk

---

## Success Criteria

- [ ] Safe deployed and operational on Base Sepolia
- [ ] Basenames operations working correctly
- [ ] Single Safe transaction batches: Split + Zora + Basename
- [ ] No client-side transaction signing required
- [ ] Approval flow simplified to single button
- [ ] All tests passing
- [ ] End-to-end flow working on Base Sepolia
- [ ] Database migration completed
- [ ] Documentation updated
- [ ] Production deployment successful

---

## Considerations for V2 Architecture

### 1. Atomicity Benefits
- **V1**: Split/Zora creation and ENS registration are separate transactions
- **V2**: All operations batched in single Safe transaction
- **Benefit**: Either all succeed or all fail (atomicity)

### 2. Gas Cost Optimization
- **V1**: Multiple transactions across two chains
- **V2**: Single batched transaction on one chain
- **Benefit**: Lower total gas costs, faster execution

### 3. User Experience
- **V1**: Users must switch networks, sign multiple transactions
- **V2**: Single approval, automatic execution
- **Benefit**: Simplified UX, fewer user errors

### 4. Error Handling
- **V1**: Partial failures possible (Split succeeds, ENS fails)
- **V2**: All-or-nothing execution
- **Benefit**: Cleaner error states, easier recovery

### 5. Testing Complexity
- **V1**: Test multiple chains, cross-chain interactions
- **V2**: Test single chain, simpler test environment
- **Benefit**: Easier testing, faster development

### 6. Monitoring & Observability
- **V1**: Track transactions across two chains
- **V2**: Track single transaction on one chain
- **Benefit**: Simpler monitoring, clearer status

---

## Creator & Publisher Proofs with Timestamps

### Current V1 Implementation

#### Creator Proofs
- **Database**: Stores `createdAt` (Unix seconds) in `releases` table
- **Database**: Stores `createdBy` (wallet address) in `releases` table
- **ENS Records**: Stores `address` record (creator wallet) but no proof signature
- **Missing**: No cryptographic signature proving creator ownership at submission time
- **Missing**: No creator proof stored in ENS text records

#### Publisher Proofs
- **IPFS**: Publication proof JSON is created and pinned to IPFS (`publication-proof.json`)
  - Contains: `submittedBy`, `submittedAt`, `publishedBy`, `publishedAt`, `transactionHash`
  - Contains: `transactionChain`, `transactionBlockNumber`, contract addresses
- **Database**: **NOT stored** - Only IPFS URI exists, no database fields for proof data
- **ENS Records**: **NOT stored** - Publication proof not included in ENS text records
- **Missing**: No `publishedAt` timestamp in database `releases` table
- **Missing**: No `publicationProofURI` field in database
- **Missing**: No `publicationTxHash` field in database

### V2 Requirements

#### Creator Proofs
1. **At Submission Time**:
   - Require creator to sign release data (EIP-191 signature)
   - Message: `keccak256(abi.encodePacked(releaseId, title, description, mediaFileHash, timestamp))`
   - Store signature in database: `releases.creator_signature`
   - Store signature timestamp: `releases.creator_signature_timestamp`

2. **In Database**:
   - Add `creator_signature VARCHAR(200)` to `releases` table
   - Add `creator_signature_timestamp INT` to `releases` table
   - Add `creator_proof_uri VARCHAR(500)` (optional IPFS URI for full proof JSON)

3. **In ENS/Basenames Records**:
   - Add `eth.scenedex.creatorSignature` text record
   - Add `eth.scenedex.creatorSignatureTimestamp` text record
   - Add `eth.scenedex.creatorProofURI` text record (if IPFS proof created)

#### Publisher Proofs
1. **At Publication Time**:
   - Capture Safe transaction hash as cryptographic proof
   - Capture block number and timestamp from transaction receipt
   - **Include publisher proof in metadata JSON** (stored in `properties.publisherProof`)
   - Create updated metadata JSON with both creator and publisher proofs
   - Pin complete metadata JSON to IPFS (replaces initial metadata)
   - Optionally create separate publication proof JSON for additional verification

2. **In Database**:
   - Add `publishedAt INT` to `releases` table (Unix seconds)
   - Add `publication_tx_hash VARCHAR(66)` to `releases` table (Safe transaction hash)
   - Add `publication_block_number BIGINT` to `releases` table
   - Add `publication_proof_uri VARCHAR(500)` to `releases` table (IPFS URI)
   - Add `publisher_address VARCHAR(42)` to `releases` table (Safe address)

3. **In ENS/Basenames Records**:
   - Add `eth.scenedex.publishedAt` text record
   - Add `eth.scenedex.publicationTxHash` text record
   - Add `eth.scenedex.publicationBlockNumber` text record
   - Add `eth.scenedex.publicationProofURI` text record
   - Add `eth.scenedex.publisherAddress` text record (Safe address)

### Refactoring Approach

#### Database Migration
```sql
-- Migration: 003-add-creator-publisher-proofs.sql
ALTER TABLE releases ADD COLUMN IF NOT EXISTS creator_signature VARCHAR(200);
ALTER TABLE releases ADD COLUMN IF NOT EXISTS creator_signature_timestamp INT;
ALTER TABLE releases ADD COLUMN IF NOT EXISTS creator_proof_uri VARCHAR(500);
ALTER TABLE releases ADD COLUMN IF NOT EXISTS publishedAt INT;
ALTER TABLE releases ADD COLUMN IF NOT EXISTS publication_tx_hash VARCHAR(66);
ALTER TABLE releases ADD COLUMN IF NOT EXISTS publication_block_number BIGINT;
ALTER TABLE releases ADD COLUMN IF NOT EXISTS publication_proof_uri VARCHAR(500);
ALTER TABLE releases ADD COLUMN IF NOT EXISTS publisher_address VARCHAR(42);

CREATE INDEX IF NOT EXISTS idx_releases_creator_signature ON releases(creator_signature);
CREATE INDEX IF NOT EXISTS idx_releases_publication_tx_hash ON releases(publication_tx_hash);
CREATE INDEX IF NOT EXISTS idx_releases_published_at ON releases(publishedAt);
```

#### Submission Flow Changes
```typescript
// V1 - app/api/submit/route.ts
// No signature required

// V2 - app/api/submit/route.ts
export async function POST(request: NextRequest) {
  const { releaseId, title, description, mediaFileHash, creatorSignature, creatorSignatureTimestamp } = await request.json();
  
  // Verify creator signature
  const message = keccak256(encodePacked(
    ['string', 'string', 'string', 'string', 'uint256'],
    [releaseId, title, description, mediaFileHash, BigInt(creatorSignatureTimestamp)]
  ));
  const recoveredAddress = recoverAddress(message, creatorSignature);
  
  if (recoveredAddress.toLowerCase() !== createdBy.toLowerCase()) {
    return NextResponse.json({ error: 'Invalid creator signature' }, { status: 401 });
  }
  
  // Store in database
  await dbQuery(
    `INSERT INTO releases (..., creator_signature, creator_signature_timestamp) 
     VALUES (..., $1, $2)`,
    [creatorSignature, creatorSignatureTimestamp]
  );
}
```

#### ENS/Basenames Service Changes
```typescript
// V1 - lib/services/ens.ts
export function buildRecordsFromRelease(...): Record<string, string> {
  return {
    [`${ENS_SERVICE_NAMESPACE}.releaseId`]: eros,
    [`${ENS_SERVICE_NAMESPACE}.artists`]: release.artists || 'Unknown',
    // ... other records
  };
}

// V2 - lib/services/ens.ts
export function buildRecordsFromRelease(
  release: Release,
  coinAddress: string,
  coinSymbol: string,
  splitAddress: string,
  creatorAddress: string,
  erosNumber: number,
  publicationProof?: {
    txHash: string;
    blockNumber: string;
    proofURI: string;
    publishedAt: number;
    publisherAddress: string;
  }
): Record<string, string> {
  const records: Record<string, string> = {
    // ... existing records
    
    // Creator proofs
    [`${ENS_SERVICE_NAMESPACE}.creatorSignature`]: release.creator_signature || '',
    [`${ENS_SERVICE_NAMESPACE}.creatorSignatureTimestamp`]: release.creator_signature_timestamp?.toString() || '',
    [`${ENS_SERVICE_NAMESPACE}.creatorProofURI`]: release.creator_proof_uri || '',
    
    // Publisher proofs
    [`${ENS_SERVICE_NAMESPACE}.publishedAt`]: publicationProof?.publishedAt.toString() || '',
    [`${ENS_SERVICE_NAMESPACE}.publicationTxHash`]: publicationProof?.txHash || '',
    [`${ENS_SERVICE_NAMESPACE}.publicationBlockNumber`]: publicationProof?.blockNumber || '',
    [`${ENS_SERVICE_NAMESPACE}.publicationProofURI`]: publicationProof?.proofURI || '',
    [`${ENS_SERVICE_NAMESPACE}.publisherAddress`]: publicationProof?.publisherAddress || '',
  };
  
  return records;
}
```

#### Jobs Service Changes - Metadata JSON with Proofs
```typescript
// V1 - lib/services/jobs.ts
// Metadata JSON includes basic provenance but no cryptographic proofs
const metadata = {
  properties: {
    submittedBy: creatorAddress,
    submittedAt: submissionTimestamp,
    publishedBy: safeAddress,
    publishedAt: publicationTimestamp,
    // No creator signature or publication transaction hash
  }
};

// V2 - lib/services/jobs.ts
// Step 1: Build initial metadata JSON with creator proof (before Safe transaction)
const initialMetadata = {
  name: allMetadata.title || release.title || 'Untitled',
  description: release.description || `${allMetadata.artist || 'Unknown'} - ${allMetadata.album || 'Album'}`,
  image: coverImageIPFSHash ? `ipfs://${coverImageIPFSHash}` : undefined,
  animation_url: `ipfs://${mediaIPFSHash}`,
  content: {
    mime: 'audio/mpeg',
    uri: `ipfs://${mediaIPFSHash}`,
  },
  properties: {
    // Catalogue identifiers
    catalogueId: erosId,
    databaseId: releaseId,
    
    // Creator Proof (cryptographic signature)
    creatorProof: {
      signature: release.creator_signature, // EIP-191 signature from submission
      signatureTimestamp: release.creator_signature_timestamp, // Unix seconds
      creatorAddress: creatorAddress,
      message: keccak256(encodePacked(
        ['string', 'string', 'string', 'string', 'uint256'],
        [releaseId, release.title, release.description, mediaIPFSHash, BigInt(release.creator_signature_timestamp)]
      )), // Message that was signed (for verification)
    },
    
    // Publisher Proof (will be added after Safe transaction)
    publisherProof: {
      // Placeholder - will be updated after transaction
      transactionHash: null,
      blockNumber: null,
      publishedAt: null,
      publisherAddress: null,
      chain: 'base-sepolia',
    },
    
    // Music metadata
    duration: Math.round(duration),
    artist: allMetadata.artist || 'Unknown',
    album: allMetadata.album || 'Album',
    year: allMetadata.year,
    bitrate: allMetadata.bitrate,
    format: {
      codec: allMetadata.codec,
      sampleRate: allMetadata.sampleRate,
      channels: allMetadata.numberOfChannels,
    },
  },
};

// Pin initial metadata (with creator proof only)
const initialMetadataURI = await pinBufferToIPFS(
  Buffer.from(JSON.stringify(initialMetadata, null, 2)),
  'metadata-initial.json',
  erosId
);

// ... execute Safe transaction ...

// Step 2: After Safe transaction confirmation, create complete metadata with both proofs
const receipt = await publicClient.waitForTransactionReceipt({ hash: safeTxHash });

const completeMetadata = {
  ...initialMetadata,
  properties: {
    ...initialMetadata.properties,
    // Update publisher proof with actual transaction data
    publisherProof: {
      transactionHash: safeTxHash,
      blockNumber: receipt.blockNumber.toString(),
      publishedAt: Math.floor(Date.now() / 1000), // Unix seconds
      publisherAddress: safeAddress,
      chain: 'base-sepolia',
      transactionIndex: receipt.transactionIndex?.toString() || null,
      gasUsed: receipt.gasUsed?.toString() || null,
    },
  },
};

// Pin complete metadata JSON (with both creator and publisher proofs)
const completeMetadataURI = await pinBufferToIPFS(
  Buffer.from(JSON.stringify(completeMetadata, null, 2)),
  'metadata.json', // Final metadata file
  erosId
);

// Store in database
await dbQuery(
  `UPDATE releases 
   SET metadataURI = $1, -- Use complete metadata URI
       publishedAt = $2,
       publication_tx_hash = $3,
       publication_block_number = $4,
       publication_proof_uri = $5, -- Can also store separate proof URI if needed
       publisher_address = $6
   WHERE id = $7`,
  [
    completeMetadataURI, // Final metadata URI with both proofs
    Math.floor(Date.now() / 1000),
    safeTxHash,
    receipt.blockNumber.toString(),
    completeMetadataURI, // Or separate proof URI
    safeAddress,
    releaseId
  ]
);

// Include in ENS records
const ensRecords = buildRecordsFromRelease(
  release,
  coinAddress,
  coinSymbol,
  splitAddress,
  creatorAddress,
  erosNumber,
  {
    txHash: safeTxHash,
    blockNumber: receipt.blockNumber.toString(),
    proofURI: completeMetadataURI, // Metadata URI contains both proofs
    publishedAt: Math.floor(Date.now() / 1000),
    publisherAddress: safeAddress,
  }
);
```

**Note**: The metadata JSON structure includes both proofs in the `properties` object:
- `properties.creatorProof` - Cryptographic proof of creation (signature, timestamp, message)
- `properties.publisherProof` - Cryptographic proof of publication (transaction hash, block number, timestamp)

#### Complete Metadata JSON Structure (V2)
```json
{
  "name": "Release Title",
  "description": "Release description",
  "image": "ipfs://QmCoverArt...",
  "animation_url": "ipfs://QmMediaFile...",
  "content": {
    "mime": "audio/mpeg",
    "uri": "ipfs://QmMediaFile..."
  },
  "properties": {
    "catalogueId": "SOMA001",
    "databaseId": "PDA-001",
    
    "creatorProof": {
      "signature": "0x1234...",
      "signatureTimestamp": 1700000000,
      "creatorAddress": "0xCreator...",
      "message": "0x5678..." // keccak256 hash of signed message
    },
    
    "publisherProof": {
      "transactionHash": "0x9abc...",
      "blockNumber": "12345678",
      "publishedAt": 1700001000,
      "publisherAddress": "0xSafe...",
      "chain": "base-sepolia",
      "transactionIndex": "0",
      "gasUsed": "500000"
    },
    
    "duration": 180,
    "artist": "Artist Name",
    "album": "Album Name",
    "year": 2024,
    "bitrate": 320,
    "format": {
      "codec": "MPEG 1 Layer 3",
      "sampleRate": 44100,
      "channels": 2
    }
  }
}
```

This metadata JSON is pinned to IPFS and serves as the **primary immutable record** containing all proofs, making it self-contained and verifiable without requiring database or on-chain lookups.

### Benefits of Enhanced Proof System

1. **Provenance**: Cryptographic proof of who created and published each release
2. **Timestamp Verification**: On-chain timestamps provide immutable proof of timing
3. **Audit Trail**: Complete history stored in database, ENS/Basenames, and IPFS metadata JSON
4. **Legal Protection**: Proofs can be used for copyright/ownership claims
5. **Transparency**: All proofs publicly verifiable via ENS/Basenames records and IPFS metadata
6. **Quadruple Redundancy**: Proofs stored in:
   - **Database** - Fast query access
   - **ENS/Basenames text records** - On-chain verification
   - **IPFS metadata JSON** - Immutable content-addressed storage (primary source)
   - **Separate publication proof JSON** (optional) - Additional verification document
7. **Self-Contained Metadata**: IPFS metadata JSON includes all proofs, making it a complete standalone record
8. **ERC721 Compliance**: Proofs stored in `properties` object, maintaining ERC721 standard compatibility

### Implementation Priority

- **Priority**: P1 (High) - Important for provenance and legal protection
- **Effort**: Medium (1-2 days)
- **Risk**: Low - Additive changes, doesn't break existing functionality
- **Dependencies**: None - Can be implemented independently

### Files to Modify

1. **Database**:
   - `lib/db/migrations/003-add-creator-publisher-proofs.sql` (NEW)

2. **Submission**:
   - `app/api/submit/route.ts` - Add creator signature verification
   - `lib/types.ts` - Add proof fields to Release type

3. **ENS/Basenames**:
   - `lib/services/ens.ts` - Add proof records to `buildRecordsFromRelease()`

4. **Jobs**:
   - `lib/services/jobs.ts` - Store publication proof in database
   - `lib/services/jobs.ts` - Include proofs in ENS records

5. **Database Service**:
   - `lib/db/releases.ts` - Add methods to update proof fields

---

## Open Questions

1. **Basenames Research**:
   - What are the Basenames contract addresses on Base Sepolia?
   - Does Basenames use the same ABI as ENS or different?
   - Is there a Basenames SDK or documentation?

2. **Safe Integration**:
   - Does Safe Transaction Service support Base Sepolia?
   - Will existing Safe API key work for Base Sepolia?
   - Are Safe contract addresses the same on Base Sepolia?

3. **Migration Strategy**:
   - Do we need to migrate existing releases or start fresh?
   - How do we handle releases already published on Sepolia?
   - Should we maintain backward compatibility?

4. **Gas Costs**:
   - What's the gas cost difference between Sepolia and Base Sepolia?
   - How much cheaper is batching vs. separate transactions?
   - What's the cost of a batched Safe transaction?

---

## Conclusion

The migration from v1 to v2 represents a significant architectural improvement, moving from a complex multi-chain setup to a unified, atomic transaction flow. While the refactoring effort is substantial (9-12 days), the benefits in terms of user experience, gas costs, and system reliability justify the investment.

Additionally, the v2 architecture introduces a comprehensive creator and publisher proof system with timestamps, providing:
- Cryptographic proof of ownership at submission time
- Immutable publication proofs stored in database, ENS/Basenames, and IPFS
- Complete audit trail for legal protection and provenance
- Triple redundancy (database + on-chain + IPFS) for proof storage

The key success factors are:
1. Thorough research on Basenames compatibility
2. Careful testing of Safe operations on Base Sepolia
3. Implementation of creator/publisher proof system for provenance
4. Incremental migration with rollback capability
5. Comprehensive end-to-end testing

This document should serve as the primary reference for the v2 refactoring effort, with each component's refactoring approach clearly defined and prioritized.

