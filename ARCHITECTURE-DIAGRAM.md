# 🏗️ THREE-LAYER ARCHITECTURE DIAGRAM

Mermaid flowchart visualization of the complete system architecture showing Frontend, Backend, and Infrastructure layers.

```mermaid
flowchart TD
    subgraph Frontend ["🖥️ FRONTEND (Next.js React)"]
        Form["📝 ReleaseForm.tsx<br/>(submit)"]
        Dashboard["👨‍⚖️ CuratorDashboard.tsx<br/>(approve)"]
        Display["🎵 ReleaseDisplay.tsx<br/>(view)"]
    end
    
    subgraph Backend ["⚙️ BACKEND (Node.js)"]
        SubmitAPI["POST /api/submit"]
        ApproveAPI["POST /api/approve"]
        QueryAPI["GET /api/releases"]
    end
    
    subgraph Wallet ["👛 WALLET (Wagmi)"]
        SignMsg["signMessage()"]
        SendTx["sendTransaction()"]
    end
    
    subgraph Database ["💾 POSTGRESQL<br/>(Transactional & Queryable)"]
        Releases["🎵 releases table"]
        Approvals["✅ approvals table"]
        Curators["👨‍⚖️ curators table"]
        AuditLog["📋 audit_log table"]
    end
    
    subgraph IPFS ["🌐 IPFS / STORACHA<br/>(Immutable & Distributed)"]
        AudioFile["🎧 Audio files"]
        Images["🖼️ Images"]
        Metadata["📄 Metadata JSON<br/>(CIDs only)"]
    end
    
    subgraph Ethereum ["⛓️ ETHEREUM L1<br/>(Governance & Trustless)"]
        Factory["🏭 Factory Contract<br/>(Multisig)"]
    end
    
    subgraph BaseL2 ["⛓️ BASE L2<br/>(Ownership & NFT)"]
        Zora["🎨 Zora NFT<br/>Minting Service"]
    end
    
    Form -->|POST| SubmitAPI
    Dashboard -->|POST| ApproveAPI
    Display -->|GET| QueryAPI
    
    Dashboard -->|signMessage| SignMsg
    ApproveAPI -->|verify| SignMsg
    Dashboard -->|sendTx| SendTx
    
    SubmitAPI -->|read/write| Releases
    SubmitAPI -->|read/write| AuditLog
    ApproveAPI -->|read/write| Approvals
    ApproveAPI -->|read| Curators
    QueryAPI -->|read| Releases
    QueryAPI -->|read| Approvals
    
    SubmitAPI -->|pin| AudioFile
    SubmitAPI -->|pin| Images
    ApproveAPI -->|pin| Metadata
    
    ApproveAPI -->|call| Factory
    Factory -->|mint| Zora
    
    QueryAPI -->|read| AudioFile
    QueryAPI -->|read| Metadata
    Display -->|stream| AudioFile
    Display -->|link to| Zora
    
    style Frontend fill:#E0F0FF,stroke:#3b82f6,color:#000
    style Backend fill:#F0E0FF,stroke:#a855f7,color:#000
    style Wallet fill:#FFF0E0,stroke:#f59e0b,color:#000
    style Database fill:#E0FFE0,stroke:#10b981,color:#000
    style IPFS fill:#FFFFE0,stroke:#f59e0b,color:#000
    style Ethereum fill:#FFE0E0,stroke:#a855f7,color:#000
    style BaseL2 fill:#E0FFE0,stroke:#10b981,color:#000
```

---

## Architecture Overview

### 🖥️ FRONTEND (Next.js React)
**Three main components:**
- **ReleaseForm.tsx** - User submits audio files
- **CuratorDashboard.tsx** - Curators review and approve
- **ReleaseDisplay.tsx** - Users view published releases

### ⚙️ BACKEND (Node.js)
**Three main API endpoints:**
- **POST /api/submit** - Handle release submissions
- **POST /api/approve** - Handle curator approvals
- **GET /api/releases** - Query releases

### 👛 WALLET (Wagmi)
**Wallet integration:**
- **signMessage()** - Curator signs approvals
- **sendTransaction()** - Send blockchain transactions

### 💾 POSTGRESQL DATABASE
**Transactional & Queryable Layer:**
- **releases table** - Release submissions & metadata
- **approvals table** - Curator signatures & timestamps
- **curators table** - Curator board members
- **audit_log table** - Compliance records

### 🌐 IPFS / STORACHA
**Immutable & Distributed Layer:**
- **Audio files** - User-submitted MP3s (QmAudio123...)
- **Images** - Cover art & metadata images (QmCover456...)
- **Metadata JSON** - ERC721 metadata (QmMetadata789...)

### ⛓️ ETHEREUM L1
**Governance & Trustless Layer:**
- **Factory Contract** - Orchestrates multisig approvals
- **Multisig** - Safe contract for curator governance

### ⛓️ BASE L2
**Ownership & NFT Layer:**
- **Zora NFT Minting Service** - Creates NFTs for releases
- **Ownership** - Users own NFTs in their wallets

---

## Data Flow Summary

1. **User Submits** → Frontend form → Backend `/api/submit`
2. **Temporary Storage** → Database (releases table) + temp file storage
3. **Curator Reviews** → Dashboard queries Database for pending releases
4. **Curator Signs** → Wallet signs approval message
5. **Approval Recorded** → Backend stores in approvals table
6. **Threshold Check** → If 3/3 signatures, trigger async job
7. **IPFS Publishing** → Pin audio, cover art, and metadata to IPFS
8. **Blockchain Minting** → Factory contract calls Zora on Base L2
9. **NFT Created** → Ownership recorded on blockchain
10. **User Views** → Frontend queries Database + IPFS + Blockchain

---

## Layer Characteristics

| Layer | Technology | Characteristics | Purpose |
|-------|-----------|-----------------|---------|
| **Database** | PostgreSQL | Transactional, Queryable | State management & audit trail |
| **Content** | IPFS/Storacha | Immutable, Distributed | Permanent content storage |
| **Governance** | Ethereum L1 | Trustless, Multisig | Curation authority |
| **Ownership** | Base L2 (Zora) | NFT, Cost-efficient | User ownership & trading |

