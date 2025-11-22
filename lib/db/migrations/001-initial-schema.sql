-- ============================================================================
-- CATALOGUE DATABASE MIGRATION
-- Version: 001
-- Description: Initial schema setup for Catalogue releases, approvals, and audit
-- Created: 2025-11-15
-- ============================================================================

-- Releases Table
-- Stores all release submissions with their lifecycle state and metadata
CREATE TABLE IF NOT EXISTS releases (
  id VARCHAR(50) PRIMARY KEY,                    -- PDA-001 format
  title VARCHAR(200) NOT NULL,
  description TEXT NULL,
  artists VARCHAR(200) NULL,
  createdBy VARCHAR(42) NOT NULL,                -- 0x address
  createdAt INT NOT NULL,                        -- Unix seconds
  status VARCHAR(20) NOT NULL,                   -- pending, approved, published
  
  -- Media & metadata
  mediaIPFSHash VARCHAR(100) NULL,
  coverImageIPFSHash VARCHAR(100) NULL,
  duration INT NULL,                             -- seconds in audio
  metadataURI VARCHAR(500) NULL,
  
  -- Music metadata (extracted from ID3 tags during IPFS pinning)
  album VARCHAR(200) NULL,
  genre VARCHAR(100) NULL,
  year INT NULL,
  bitrate INT NULL,                              -- in kbps
  sampleRate INT NULL,                           -- in Hz
  channels INT NULL,                             -- mono=1, stereo=2
  codec VARCHAR(100) NULL,                       -- MPEG 1 Layer 3, etc.
  
  -- Approval details
  multisigAddress VARCHAR(42) NULL,              -- Safe contract
  approvalThreshold INT NULL,                    -- 1-7
  approvalRequirementsMet BOOLEAN NULL,
  approvedAt INT NULL,                           -- Unix seconds
  
  -- Rejection details
  rejectionReason VARCHAR(500) NULL,
  
  -- NFT details
  zoraNFT VARCHAR(100) NULL,                     -- base:0xAddr/tokenId
  tokenId VARCHAR(50) NULL,
  
  -- ENS details
  ensSubname VARCHAR(100) NULL,
  
  -- Splits (Revenue distribution)
  split_address VARCHAR(42) NULL,                     -- Splits contract address (50% Safe + 50% Submitter)
  
  -- Zora Coins
  zora_coin_address VARCHAR(42) NULL,                -- Deployed Zora coin contract address
  zora_coin_symbol VARCHAR(100) NULL,                -- Coin symbol (e.g., $PDA-SMOKE-1763497912983)
  
  -- Metadata
  updatedAt INT DEFAULT EXTRACT(EPOCH FROM NOW())::INT
);

-- Create indexes on releases table
CREATE INDEX IF NOT EXISTS idx_releases_status ON releases(status);
CREATE INDEX IF NOT EXISTS idx_releases_createdBy ON releases(createdBy);
CREATE INDEX IF NOT EXISTS idx_releases_createdAt ON releases(createdAt);

-- Approvals Table (Multisig signatures)
-- Stores curator approval signatures for multisig validation
CREATE TABLE IF NOT EXISTS approvals (
  id SERIAL PRIMARY KEY,
  releaseId VARCHAR(50) NOT NULL,
  signer VARCHAR(42) NOT NULL,                   -- 0x curator address
  signature VARCHAR(200) NOT NULL,               -- 0x + 130 hex
  timestamp INT NOT NULL,                        -- Unix seconds
  
  CONSTRAINT fk_approvals_release FOREIGN KEY (releaseId) REFERENCES releases(id) ON DELETE CASCADE
);

-- Create indexes on approvals table
CREATE INDEX IF NOT EXISTS idx_approvals_release_signer ON approvals(releaseId, signer);
CREATE INDEX IF NOT EXISTS idx_approvals_timestamp ON approvals(timestamp);

-- Audit Logs Table
-- Tracks all actions taken on releases for compliance and debugging
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  releaseId VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,                   -- submitted, approved, rejected, published
  actor VARCHAR(42) NOT NULL,                    -- wallet address
  timestamp INT NOT NULL,                        -- Unix seconds
  metadata JSON,                                 -- Additional context
  
  CONSTRAINT fk_audit_logs_release FOREIGN KEY (releaseId) REFERENCES releases(id) ON DELETE CASCADE
);

-- Create indexes on audit_logs table
CREATE INDEX IF NOT EXISTS idx_audit_logs_release_timestamp ON audit_logs(releaseId, timestamp);

-- Curators Table
-- Manages curator board for Phase 3+ curator dashboard
CREATE TABLE IF NOT EXISTS curators (
  address VARCHAR(42) PRIMARY KEY,               -- 0x address
  name VARCHAR(100),
  joinedAt INT NOT NULL,                         -- Unix seconds
  isActive BOOLEAN DEFAULT TRUE
);

-- Create index on curators table
CREATE INDEX IF NOT EXISTS idx_curators_active ON curators(isActive);

-- Curator Settings Table
-- Stores platform-wide curator settings (Safe multisig, thresholds, etc.)
CREATE TABLE IF NOT EXISTS curator_settings (
  id SERIAL PRIMARY KEY,
  safe_address VARCHAR(42) NOT NULL,                  -- Safe multisig contract address
  approval_threshold INT NOT NULL,                    -- Minimum approvals required
  created_at INT NOT NULL,                            -- Unix seconds
  updated_at INT NOT NULL                             -- Unix seconds
);

-- Create index on curator_settings table
CREATE INDEX IF NOT EXISTS idx_curator_settings_safe ON curator_settings(safe_address);

-- Temporary Submissions Table
-- Stores metadata from submission form before curator review/approval
-- Once approved/rejected, records are deleted from this table
CREATE TABLE IF NOT EXISTS temporary_submissions (
  id SERIAL PRIMARY KEY,
  releaseId VARCHAR(50) NOT NULL UNIQUE,         -- PDA-001 format
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  artists VARCHAR(200) NULL,
  createdBy VARCHAR(42) NOT NULL,                -- 0x address
  createdAt INT NOT NULL,                        -- Unix seconds
  status VARCHAR(20) NOT NULL,                   -- pending, approved, rejected
  
  CONSTRAINT fk_temp_submissions_release FOREIGN KEY (releaseId) REFERENCES releases(id) ON DELETE CASCADE
);

-- Create indexes on temporary_submissions table
CREATE INDEX IF NOT EXISTS idx_temp_submissions_status ON temporary_submissions(status);
CREATE INDEX IF NOT EXISTS idx_temp_submissions_createdBy ON temporary_submissions(createdBy);

-- Temporary File Storage Table
-- Stores actual file content (BLOB) during submission/curator review phase
-- Once approved/rejected, entire row deleted (files purged from DB)
-- Supports deferred IPFS pinning workflow
CREATE TABLE IF NOT EXISTS temp_files (
  id SERIAL PRIMARY KEY,
  releaseId VARCHAR(50) NOT NULL,
  file_data BYTEA NOT NULL,                      -- Actual MP3 file bytes
  cover_data BYTEA NULL,                         -- Actual cover image bytes
  file_size INT,
  cover_size INT,
  uploadedAt INT NOT NULL,                       -- Unix seconds
  expiresAt INT NOT NULL,                        -- Unix seconds
  status VARCHAR(50) NOT NULL,                   -- pending, approved, rejected, pinned
  
  CONSTRAINT fk_temp_files_release FOREIGN KEY (releaseId) REFERENCES releases(id) ON DELETE CASCADE
);

-- Create indexes on temp_files table
CREATE INDEX IF NOT EXISTS idx_temp_files_release_status ON temp_files(releaseId, status);
CREATE INDEX IF NOT EXISTS idx_temp_files_expires ON temp_files(expiresAt);

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- Tables Created:
-- 1. releases - Core release data (approved only, no file content)
-- 2. approvals - Multisig curator approvals
-- 3. audit_logs - Complete audit trail of all actions
-- 4. curators - Curator board management
-- 5. temporary_submissions - User-submitted metadata (pre-approval staging)
-- 6. temp_files - Temporary file content (BLOB) for curator review
--
-- Data Flow:
-- Submit → temporary_submissions + temp_files (with BLOB data)
--   ↓
-- Curator review (access files from temp_files BLOB)
--   ↓
-- Auth gate approval/rejection → COPY to releases → DELETE from temp tables
--   ↓
-- Job processes from releases (no files, just metadata)
--
-- Key Features:
-- - Foreign keys for referential integrity
-- - Composite indexes for common queries
-- - BYTEA for binary file storage (temporary only)
-- - Timestamps stored as Unix seconds
-- - Cascading deletes to maintain data consistency
-- ============================================================================

