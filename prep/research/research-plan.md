# Tech Stack Research & Evaluation Plan

## Overview
A comprehensive framework to evaluate each component of the onchain catalog system through targeted questions focused on **effectiveness, speed, and cost**.

---

## Core Evaluation Framework

Use this structure for each tech component. Create a spreadsheet with these columns for systematic comparison.

### Phase 1: Contributor Onboarding & Authentication

**Component:** Frontend + Wallet Connection + Access Control

| Category | Question | Priority | Notes |
|----------|----------|----------|-------|
| **User Experience** | How many wallet types can we support? (MetaMask, Rainbow, Coinbase, WalletConnect, etc.) | High | Affects adoption rate |
| **User Experience** | What is the avg onboarding time from visit to "request submitted"? | High | Target: <2 min |
| **Speed** | Does wallet connection + signature verification happen <1 second? | High | User perception metric |
| **Cost** | Are there any gas/chain costs for signature verification during onboarding? | Medium | Should be free until approval |
| **Security** | How do we prevent sybil attacks during contributor request stage? | High | Critical gate before board review |
| **Scalability** | Can we handle 1000 concurrent onboarding flows? | Medium | Depends on frontend infra |
| **Reliability** | What happens if wallet connection fails mid-flow? | Medium | Fallback/retry strategy needed |

---

### Phase 2: Board Decision & Permissioning

**Component:** Board Dashboard + Approval Logic + Soulbound NFT Minting

| Category | Question | Priority | Notes |
|----------|----------|----------|-------|
| **Performance** | What is acceptable approval turnaround time (hours/days)? | High | SLA for contributors |
| **Cost** | How much does it cost to mint 1 soulbound NFT to contributor? | High | Affects scalability |
| **Cost** | Which chain is optimal for soulbound NFT? (Ethereum, Optimism, Base, Polygon) | High | Gas fees vary drastically |
| **Security** | How do we prevent board members from being compromised/griefed? | High | Multi-sig? Threshold voting? |
| **Technical** | Can we use a standard ERC-1155/721 for soulbound, or need custom contract? | Medium | Custom = higher complexity + cost |
| **Technical** | How do we enforce non-transferability (truly soulbound)? | High | Contract-level or social-level? |
| **Storage** | Where is board decision metadata stored? (onchain / IPFS / centralized DB) | Medium | Audit trail requirement |
| **Speed** | After board approval, how long until soulbound NFT reaches contributor wallet? | High | Should be <5 min for UX |

---

### Phase 3: Media & Metadata Submission

**Component:** Frontend Upload Form + Data Validation + Packaging

| Category | Question | Priority | Notes |
|----------|----------|----------|-------|
| **Performance** | What file size limits do we enforce? (MB for audio/video/image) | High | Affects upload UX |
| **Performance** | What is max allowed metadata size? | Medium | Affects IPFS pinning costs |
| **Technical** | Do we validate metadata format client-side, server-side, or both? | High | Security vs. UX tradeoff |
| **Technical** | What metadata fields are required vs. optional? (title, desc, tags, etc.) | Medium | Define data schema early |
| **User Experience** | Do we allow bulk upload or only single-release-at-a-time? | Medium | Affects contributor workflow |
| **Cost** | Are uploads hosted temporarily on our backend, or directly to IPFS? | High | Storage cost + latency tradeoff |
| **Reliability** | What happens if upload is interrupted? Can it resume? | Medium | Better UX = higher complexity |

---

### Phase 4: IPFS Storage & Persistence

**Component:** Autark CLI vs. Storacha vs. Traditional IPFS Nodes

| Category | Question | Priority | Notes |
|----------|----------|----------|-------|
| **Cost** | Monthly cost per GB for Autark CLI vs. Storacha vs. self-hosted IPFS? | High | Major operating cost |
| **Performance** | What is typical retrieval time for IPFS content (ms)? | High | Affects frontend rendering speed |
| **Reliability** | How long are files pinned for? (permanent / X years / pay-per-use) | High | What's the SLA? |
| **Reliability** | What happens if pinned content is unpinned mid-catalog lifecycle? | High | Requires contingency strategy |
| **Reliability** | Does our choice support redundancy (multiple pinners)? | Medium | Protects against single-point failure |
| **Technical** | Can Autark CLI or Storacha integrate with our factory contract? (webhook/event hooks) | High | Automates pinning workflow |
| **Technical** | Do we use IPFS CIDv0 or CIDv1? | Medium | Affects ENS resolver compatibility |
| **Cost** | What is the cost difference between storing 1 MB vs. 100 MB? | Medium | Understand scaling costs |
| **Speed** | Can we pre-generate IPFS hash before minting (for UX certainty)? | Medium | Reduces post-mint surprise |

---

### Phase 5: Base L2 - NFT Minting via Zora

**Component:** Zora Creator Contract + Token ID Capture + Metadata URI

| Category | Question | Priority | Notes |
|----------|----------|----------|-------|
| **Cost** | What is the gas cost to mint 1 NFT on Base via Zora? | High | Affects contributor economics |
| **Cost** | Does Zora charge creation fees in addition to gas? | High | Hidden costs? |
| **Cost** | Is there a daily/weekly mint limit from Zora Creator contracts? | Medium | Could bottleneck production |
| **Performance** | What is avg time from mint tx submit to NFT confirmation? | High | Target: <30 sec |
| **Technical** | Does Zora provide token metadata auto-storage, or do we pass URI? | High | Affects IPFS integration |
| **Technical** | Can we batch mint multiple NFTs in 1 tx to save gas? | Medium | Optimization opportunity |
| **Security** | Who controls the minting rights? (contributor, factory contract, bot?) | High | Affects permission model |
| **Reliability** | What happens if Zora contract is upgraded or deprecated? | Medium | Upgrade path needed |
| **Integration** | Does Zora provide an SDK/API, or do we interact directly with contract? | Medium | Affects development speed |
| **Data** | Can we retrieve full NFT metadata from Zora after mint? | Medium | Need for indexing layer |

---

### Phase 6: Ethereum L1 - ENS Subname Minting

**Component:** Factory Contract + ENS Registry + ENS Resolver

| Category | Question | Priority | Notes |
|----------|----------|----------|-------|
| **Cost** | What is the gas cost to mint 1 ENS subname on Ethereum L1? | High | Expensive component; consider L2 alternative |
| **Cost** | Is there an annual renewal cost for subnames? | High | Recurring cost for lifecycle |
| **Cost** | Can we batch-register multiple subnames in 1 tx? | Medium | Reduces per-subname cost |
| **Performance** | What is avg time from subname registration tx to on-chain confirmation? | High | Affects time-to-catalog |
| **Technical** | Do we use standard ENS records or custom resolver? | High | Custom resolver = more flexibility but complexity |
| **Technical** | How do we link ENS subname to Base NFT metadata? (contenthash / resolver function) | High | Critical architectural decision |
| **Technical** | Can ENS resolver point directly to IPFS hash or to external API? | High | Affects query performance |
| **Security** | Who owns the parent `palaupalau.eth` domain? How are subname perms governed? | High | Affects decentralization |
| **Reliability** | What happens if parent domain expires? Are subnames orphaned? | Medium | Risk management needed |
| **Scalability** | Are there limits on how many subnames can exist under one parent? | Medium | Unknown bottleneck |
| **Alternative** | Is L2 ENS (Optimism, Arbitrum) viable instead of L1? | Medium | Could cut costs dramatically |

---

### Phase 7: Event Indexing & Data Layer

**Component:** The Graph vs. Reservoir vs. Custom Indexer

| Category | Question | Priority | Notes |
|----------|----------|----------|-------|
| **Performance** | What is query latency for "get all releases from contributor X"? | High | Affects catalog performance |
| **Performance** | Can we achieve sub-second queries for 1000+ catalog entries? | High | Depends on indexer choice |
| **Cost** | Monthly cost to index ENS (L1) + Base NFTs + IPFS metadata? | High | Operating cost |
| **Technical** | Does The Graph support subgraph indexing for custom factory contracts? | High | Might need custom subgraph |
| **Technical** | Can we query across multiple chains (L1 + Base) in single query? | High | Architectural simplicity |
| **Reliability** | What is SLA for indexing lag? (how stale can data be?) | High | Affects real-time UX |
| **Reliability** | What happens if indexer goes down? Fallback strategy? | Medium | Need redundancy |
| **Cost** | Is The Graph more cost-effective than running self-hosted indexer? | Medium | DIY vs. managed tradeoff |
| **Integration** | Can indexer automatically detect new releases as factory emits events? | High | Automates catalog updates |
| **Data** | Can indexer aggregate metadata from IPFS + ENS + Base NFT in single query result? | High | Reduces frontend complexity |

---

### Phase 8: Frontend & Display

**Component:** Next.js + ENS Resolution + IPFS Fetching + Caching

| Category | Question | Priority | Notes |
|----------|----------|----------|-------|
| **Performance** | What is page load time for catalog homepage? | High | Target: <2 sec |
| **Performance** | What is time-to-interactive for individual release page? | High | Depends on IPFS retrieval |
| **Performance** | Can we cache IPFS content locally? Or must we fetch every time? | High | Major performance lever |
| **Performance** | How long can we cache ENS-to-NFT mappings? | Medium | Tradeoff between freshness + speed |
| **Cost** | Do we need a CDN for frontend assets? (Next.js static export + CDN) | Medium | Essential for global reach |
| **Technical** | How do we handle ENS subname resolution in browser? (ENS.js SDK?) | Medium | Client-side vs. server-side |
| **Technical** | Can we pre-render static catalog pages (SSG) or must it be dynamic? | High | Affects scalability + cost |
| **User Experience** | How do we display "loading" state while IPFS content fetches? | Medium | UX polish |
| **User Experience** | What happens if IPFS content fails to load? Fallback UI? | High | Graceful degradation needed |
| **SEO** | Can we generate metadata for social sharing (OG tags)? | Medium | Metadata must be server-rendered |
| **Accessibility** | Is the catalog navigable without JavaScript? (progressive enhancement) | Low | Ideological but not critical |

---

### Phase 9: Cross-Layer Coordination

**Component:** Factory Contract Orchestration + Event Emission + Atomicity

| Category | Question | Priority | Notes |
|----------|----------|----------|-------|
| **Technical** | What events does factory contract emit? (ReleaseAdded, ContributorApproved, etc.) | High | Defines indexing schema |
| **Technical** | Can factory coordinate Base NFT mint + L1 ENS subname mint atomically? | High | Or do they happen sequentially? |
| **Technical** | What if Base NFT mint succeeds but ENS subname mint fails? Rollback? | High | Error handling critical |
| **Cost** | Does factory contract deployment + interaction cost more on L1 or L2? | High | Could shift architecture |
| **Security** | How do we prevent unauthorized NFT minting or subname creation? | High | Access control model |
| **Scalability** | Can factory handle 100 simultaneous release submissions without queuing? | Medium | Depends on chain congestion |

---

### Phase 10: Overall System Metrics

**Measure across all phases:**

| Metric | Target | Notes |
|--------|--------|-------|
| **Time-to-Catalog** | Contributor submits → Release live on catalog: < 5 min | End-to-end UX metric |
| **Cost-per-Release** | Total cost (IPFS + gas + infra) per release minted | Unit economics critical |
| **Contributor Cost** | Should be $0 or subsidized? | Affects adoption |
| **Catalog Query Time** | "Get all releases": < 500ms | Performance requirement |
| **Availability** | 99.9% catalog uptime | Reliability target |
| **Scalability Ceiling** | How many concurrent releases can system handle? | Capacity planning |

---

## How to Use This Plan

1. **Create a spreadsheet** with columns: `Component | Question | Priority | Answer | Data Source | Alternative Options | Decision`

2. **Assign research owner** for each phase (e.g., "You research IPFS storage, I research ENS")

3. **Fill in answers** through:
   - Docs reading (Zora, The Graph, ENS, Storacha)
   - Test transactions (deploy factory on testnet, mint test NFTs)
   - Cost calculators (L1/L2 gas tools, IPFS pricing)
   - Community calls (Zora forum, ENS docs, The Graph Discord)

4. **Score trade-offs** (Cost vs. Speed vs. Simplicity)

5. **Document assumptions** and dependencies

6. **Use findings to build technical spec** (architecture decision records)

---

## Next Steps

Would you like me to:
- Create a starter spreadsheet template you can populate?
- Deep-dive into 1-2 specific phases with concrete research?
- Draft technical decision records based on early assumptions?

