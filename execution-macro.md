

**🎯 Frontend + Mock Curator Backend** is your entry point.

**Why:**
- ✅ No blockchain dependencies yet (can mock contract calls)
- ✅ Uses existing libraries (Next.js, wagmi, RainbowKit, ethers.js)
- ✅ Validates UX immediately (get user feedback on form/flow)
- ✅ Enables parallel work (frontend team ≠ contract team)
- ✅ Demo-able in 1-2 weeks with mock data
- ✅ Curator board backend is just: database + auth + approval API

**Then:** Smart contracts, then indexing

---

## Smart Contracts Needed

**Surprisingly few: 1 main contract**

1. **Factory Contract** (Main orchestrator)
   - Registers releases
   - Mints ENS subnames
   - Sets ENS text records (`zoraNFT` reference)
   - Emits `ReleaseAdded` event
   - Manages allowlist

2. **Zora Creator** - Already deployed by Zora (reuse their contracts)
3. **ENS Resolver** - Use ENS's existing PublicResolver (supports text records)

**That's it.** ~1 custom contract to audit + deploy.

---

## File Tree Structure

```
catalogue/
├── contracts/
│   ├── src/
│   │   ├── Factory.sol          # Main coordinator
│   │   └── interfaces/
│   │       ├── IENS.sol         # ENS interface
│   │       └── IZora.sol        # Zora interface
│   ├── test/
│   │   └── Factory.test.sol
│   ├── hardhat.config.js
│   └── .env.example
│
├── subgraph/
│   ├── src/
│   │   ├── schema.graphql       # Release, Contributor entities
│   │   └── mappings.ts          # Event handlers
│   └── abis/
│       └── Factory.json
│
├── frontend/
│   ├── app/                     # Next.js app router
│   │   ├── page.tsx             # Homepage
│   │   ├── submit/
│   │   │   └── page.tsx         # Submission form
│   │   ├── release/
│   │   │   └── [subname]/page.tsx
│   │   └── admin/
│   │       └── approve/page.tsx # Curator dashboard
│   ├── components/
│   │   ├── MetadataForm.tsx
│   │   ├── WalletConnect.tsx
│   │   ├── ReleaseCard.tsx
│   │   └── CuratorDashboard.tsx
│   ├── lib/
│   │   ├── graphql.ts           # GraphQL queries
│   │   ├── ens-resolver.ts      # ENS helpers
│   │   ├── zora-api.ts          # Zora integration
│   │   ├── ipfs.ts              # Storacha upload
│   │   └── contracts.ts         # ABI + wagmi config
│   ├── hooks/
│   │   ├── useRelease.ts
│   │   ├── useContributor.ts
│   │   └── useCurator.ts
│   └── styles/
│
├── backend/
│   ├── routes/
│   │   ├── approve.ts           # POST approval
│   │   ├── requests.ts          # GET pending
│   │   └── contributors.ts      # GET/POST
│   ├── db/
│   │   ├── schema.sql
│   │   └── migrations/
│   ├── middleware/
│   │   └── auth.ts              # Board member verification
│   └── server.ts                # Express or similar
│
├── diagrams/                    # Already have this
│   ├── user-journey/
│   ├── technical-architecture/
│   └── board-decision/
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── CONTRACTS.md
│   ├── DEPLOYMENT.md
│   └── CURATOR_WORKFLOW.md
│
├── research-plan.md             # Already have this
├── concept.md                   # Already have this
├── context.md                   # Already have this
│
└── Root config
    ├── package.json             # Monorepo (workspaces or turborepo)
    ├── turbo.json               # If using turborepo
    ├── .env.example
    └── README.md
```

---

## Recommended Phased Rollout

**Phase 0 (Days 1-3): Setup**
- [ ] Initialize monorepo
- [ ] Spec Factory contract (on paper, no code)
- [ ] Create Next.js project structure

**Phase 1 (Days 4-10): Frontend Foundation** ⭐ START HERE
- [ ] Build all pages + components (with mock data)
- [ ] Implement metadata form + validation
- [ ] Mock wallet connect flow
- [ ] Create curator board dashboard UI
- [ ] Wire up mock contract calls (no real chain)
- **Deliverable:** Working UI demo, ready for user feedback

**Phase 2 (Days 10-15): Smart Contract**
- [ ] Implement Factory contract
- [ ] Deploy to testnet (Base Sepolia + Sepolia)
- [ ] Wire frontend to real contract
- [ ] Add error handling

**Phase 3 (Days 15-20): Backend Infrastructure**
- [ ] Curator board API (database + auth)
- [ ] IPFS/Storacha integration
- [ ] Zora integration testing
- [ ] ENS subname deployment setup

**Phase 4 (Days 20-25): Indexing**
- [ ] Deploy Graph subgraph
- [ ] Build GraphQL queries
- [ ] Implement fallback logic
- [ ] End-to-end testing

**Phase 5 (Days 25+): Polish & Deploy**
- [ ] Mainnet deployment
- [ ] Security audit (if needed)
- [ ] Performance optimization

---

## Why Frontend First?

1. **Fastest to momentum** - Something showable in 1 week
2. **Validates product** - Do people actually want this?
3. **Unblocks decisions** - What fields needed? What workflows?
4. **Parallel work** - While frontend ships, contract dev starts
5. **Less risk** - UI changes ≠ contract redeploys

**Start tomorrow with the Frontend. You'll have a working UI mock in days.** 🚀