/**
 * Complete type definitions for Catalogue Release data model
 * Serves as single source of truth across all layers:
 * - Frontend state management
 * - Form validation
 * - IPFS metadata
 * - Mock data
 * - API responses
 *
 * OWNERSHIP MODEL:
 * 1. User uploads file via form (mediaFile)
 * 2. Backend pins to IPFS (gets mediaIPFSHash), we custody the pin
 * 3. Backend creates Release with unique ID (PDA-XXX), proof: Release.id + Release.createdBy + Release.createdAt
 * 4. Curator approves the release
 * 5. Backend creates IPFS metadata JSON pointing to user's audio file
 * 6. Catalogue mints NFT on Zora (we're the creator/contract owner on Base)
 * 7. User owns the NFT in their wallet (they are the NFT owner)
 * 8. Ownership chain: User's Wallet → owns NFT → references Metadata → references User's Audio
 * 9. We maintain governance/curation; user has full ownership of their release/NFT
 */
export {};
