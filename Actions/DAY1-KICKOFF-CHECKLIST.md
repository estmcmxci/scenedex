# 🚀 DAY 1 KICKOFF CHECKLIST
## Phase 3 Database Setup - Your Starting Point

---

## 📋 WHAT YOU'RE DECIDING TODAY

By end of Day 1, you should have:

- [ ] **Database choice made** (PostgreSQL vs MongoDB)
- [ ] **Managed hosting selected** (Railway, Render, Supabase, etc.)
- [ ] **Database deployed** (live connection string)
- [ ] **Schema created** (tables with proper indices)
- [ ] **First backend route scaffolding** (ready for Day 2-3)

---

## 🎯 DECISION 1: Choose Your Database

### You Should Pick **PostgreSQL** If:
```
✅ You want production-grade reliability
✅ You need ACID transactions (approval workflow)
✅ You want complex queries (curator dashboard)
✅ You plan to scale to 10K+ releases
✅ You need audit logging with constraints
✅ Cost is important (~$25-50/month)
```

### You Should Pick **MongoDB** If:
```
✅ You want fast development (flexible schema)
✅ You're okay with application-level consistency
✅ You prefer document-based data modeling
✅ You want to iterate quickly
❌ NOTE: Will need to migrate to PostgreSQL later for scale
```

### Recommendation
**Go with PostgreSQL.** Your approval workflow needs transaction guarantees.

---

## 🌐 DECISION 2: Choose Your Hosting

### Option A: **Railway.app** (RECOMMENDED for simplicity)
```
✅ One-click PostgreSQL deployment
✅ Simple environment variables
✅ Good free tier for testing
✅ Easy vertical scaling
✅ Clear pricing ($5-50/month)

Steps:
1. Go to railway.app
2. Sign up with GitHub
3. Create new project
4. Add PostgreSQL template
5. Get DATABASE_URL connection string
6. Add to .env.local
```

**Pro:** Super easy. 15 minutes setup.
**Con:** Not the cheapest at high scale.

### Option B: **Render.com** (Good alternative)
```
✅ PostgreSQL starter: $15/month
✅ Good performance
✅ Easy to setup
✅ Generous free tier for testing

Steps:
1. Go to render.com
2. Sign up
3. Create PostgreSQL database
4. Get connection string
5. Add to .env.local
```

**Pro:** Competitive pricing, reliable.
**Con:** Slightly more setup than Railway.

### Option C: **Supabase.io** (Best for PostgreSQL + features)
```
✅ PostgreSQL + auto-generated REST API
✅ Real-time subscriptions included
✅ Row-level security policies
✅ Free tier: 500MB storage, unlimited queries
✅ Perfect if you want serverless backend included

Steps:
1. Go to supabase.com
2. Sign up with GitHub
3. Create new project
4. Get connection string
5. Optional: Use auto-generated REST API
```

**Pro:** Lots of built-in features, PostgreSQL.
**Con:** Learning curve if using full Supabase features.

### Option D: **Local Development** (PostgreSQL locally)
```
✅ Free, runs on your machine
✅ Great for Phase 3 development
❌ Can't share with team easily
❌ Must deploy to production later

Setup:
1. Install: brew install postgresql@15
2. Start: brew services start postgresql@15
3. Create DB: createdb catalogue
4. Connection: postgresql://localhost/catalogue
```

**Pro:** Perfect for local development.
**Con:** Not for production.

### **Recommendation**
Start with **Railway.app** today (easy + free tier). You can migrate to Render/Supabase later if needed.

---

## 🗂️ STEP-BY-STEP: Set Up Your Database (Railway Example)

### Step 1: Deploy PostgreSQL on Railway (5 minutes)
```bash
# 1. Go to railway.app and sign up with GitHub

# 2. Create new project
#    Click "Create New Project"
#    Click "Provision PostgreSQL"

# 3. Wait for deployment (usually <2 minutes)

# 4. Find your connection string:
#    In Railway dashboard:
#    Database tab → DATABASE_URL (copy this)

# Example:
# postgresql://user:password@container-1.railway.app:5432/railway
```

### Step 2: Create `.env.local` in project root
```bash
# /Users/oakgroup/Desktop/catalogue/.env.local
DATABASE_URL="postgresql://user:password@container-1.railway.app:5432/railway"
```

### Step 3: Create Database Schema
```bash
# Create file: backend/db/schema.sql

-- Releases table
CREATE TABLE releases (
  id VARCHAR(20) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  artists VARCHAR(255),
  created_by VARCHAR(42) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending',
  media_ipfs_hash VARCHAR(59),
  cover_image_hash VARCHAR(59),
  metadata_uri VARCHAR(59),
  zora_nft VARCHAR(100),
  token_id BIGINT,
  ens_subname VARCHAR(255),
  rejection_reason TEXT,
  
  -- Indexes for queries
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'published')),
  INDEX idx_created_by (created_by),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at DESC)
);

-- Approvals table (multisig tracking)
CREATE TABLE approvals (
  id BIGSERIAL PRIMARY KEY,
  release_id VARCHAR(20) NOT NULL,
  signer VARCHAR(42) NOT NULL,
  signature VARCHAR(132) NOT NULL,
  signed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (release_id) REFERENCES releases(id),
  CONSTRAINT unique_approval UNIQUE(release_id, signer),
  INDEX idx_release_id (release_id)
);

-- Curators table
CREATE TABLE curators (
  address VARCHAR(42) PRIMARY KEY,
  name VARCHAR(255),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  multisig_address VARCHAR(42)
);

-- Audit log
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(50),
  release_id VARCHAR(20),
  actor VARCHAR(42),
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_release_id (release_id),
  INDEX idx_actor (actor),
  INDEX idx_created_at (created_at DESC)
);
```

### Step 4: Apply Schema to Your Database
```bash
# Option A: Using psql CLI
psql "$DATABASE_URL" < backend/db/schema.sql

# Option B: Using a migration tool (better for production)
# We'll set this up on Day 2-3
```

### Step 5: Create Database Service File
```typescript
// backend/services/database.ts

import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = {
  // Releases
  async getReleaseById(id: string) {
    const res = await pool.query(
      'SELECT * FROM releases WHERE id = $1',
      [id]
    );
    return res.rows[0] || null;
  },

  async getPendingReleases() {
    const res = await pool.query(
      'SELECT * FROM releases WHERE status = $1 ORDER BY created_at DESC',
      ['pending']
    );
    return res.rows;
  },

  async createRelease(data: {
    id: string;
    title: string;
    description: string;
    artists?: string;
    created_by: string;
    temp_file_path: string; // ← Temporary storage path
  }) {
    const res = await pool.query(
      `INSERT INTO releases 
        (id, title, description, artists, created_by, status, temp_file_path)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.id,
        data.title,
        data.description,
        data.artists,
        data.created_by,
        'pending',
        data.temp_file_path,
      ]
    );
    return res.rows[0];
  },

  // ✅ NEW: Update release with permanent IPFS hashes (after approval)
  async updateReleaseWithIPFSHashes(
    releaseId: string,
    mediaIPFSHash: string,
    coverImageHash: string,
    metadataURI: string
  ) {
    const res = await pool.query(
      `UPDATE releases SET
        media_ipfs_hash = $1,
        cover_image_hash = $2,
        metadata_uri = $3,
        temp_file_path = NULL
       WHERE id = $4
       RETURNING *`,
      [mediaIPFSHash, coverImageHash, metadataURI, releaseId]
    );
    return res.rows[0];
  },

  // Approvals
  async addApproval(releaseId: string, signer: string, signature: string) {
    const res = await pool.query(
      `INSERT INTO approvals (release_id, signer, signature)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [releaseId, signer, signature]
    );
    return res.rows[0];
  },

  async getApprovals(releaseId: string) {
    const res = await pool.query(
      'SELECT * FROM approvals WHERE release_id = $1',
      [releaseId]
    );
    return res.rows;
  },

  // ✅ NEW: Check if threshold met
  async isApprovalThresholdMet(releaseId: string, threshold: number) {
    const res = await pool.query(
      'SELECT COUNT(*) as count FROM approvals WHERE release_id = $1',
      [releaseId]
    );
    return parseInt(res.rows[0].count) >= threshold;
  },

  // Audit log
  async logEvent(
    eventType: string,
    releaseId: string,
    actor: string,
    details?: object
  ) {
    await pool.query(
      `INSERT INTO audit_log (event_type, release_id, actor, details)
       VALUES ($1, $2, $3, $4)`,
      [eventType, releaseId, actor, JSON.stringify(details)]
    );
  },
};

export default db;
```

**Key Change:** 
- Submissions store `temp_file_path` (NOT `media_ipfs_hash`)
- After approval, call `updateReleaseWithIPFSHashes()` to store permanent CIDs

### Step 6: Test Connection (Day 1 Bonus)
```typescript
// backend/test-db.ts
import db from './services/database';

async function testConnection() {
  try {
    const releases = await db.getPendingReleases();
    console.log('✅ Database connected!');
    console.log(`Found ${releases.length} pending releases`);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testConnection();
```

Run it:
```bash
npx tsx backend/test-db.ts
```

---

## 📝 Your Database is Ready When:

- [ ] Connection string in `.env.local`
- [ ] Schema applied (4 tables created)
- [ ] Can connect with test script
- [ ] Indices created for query performance
- [ ] Audit table ready for compliance

---

## 🚦 WHAT HAPPENS NEXT (Day 2-3)

With your database ready, you'll:

1. **Create `/app/api/submit` endpoint** (real backend route)
2. **Replace MSW handler** with real database writes
3. **Test end-to-end:** Form → Database → Query

The data flow becomes:
```
Frontend form
    ↓
POST /app/api/submit
    ↓
Backend validates + extracts metadata
    ↓
Stores in PostgreSQL (status='pending')
    ↓
Returns release data to frontend
    ↓
Frontend shows: "Submitted! Waiting for curation..."
    ↓
Curator queries /app/api/curator/pending
    ↓
Gets real data from database
    ↓
Signs approval
    ↓
Backend stores approval in database
    ↓
Checks threshold
```

---

## 🎯 DECISION SUMMARY TEMPLATE

**Fill this out to confirm your choices:**

```
Today's Decisions (Day 1):

Database Choice: [ ] PostgreSQL [X]  [ ] MongoDB  [ ] Other: ___

Hosting Platform: [ ] Railway  [ ] Render  [ ] Supabase  [ ] Local Only  [ ] Other: ___

Production Ready by: Day ___  (estimate)

Team Size: ___ people

Expected Release Volume: ___ per month (Phase 1)

Scaling Plan: (describe)

Questions/Concerns: (list)
```

---

## 🔗 RELATED DOCUMENTS

After Day 1 is complete, read in order:

1. ✅ **TODAY:** `DATABASE-ARCHITECTURE-ANALYSIS.md` (why this architecture)
2. ✅ **TODAY:** `STORAGE-DECISIONS-QUICK-REFERENCE.md` (server vs blockchain vs IPFS)
3. **DAY 2:** `PHASE3_IMPLEMENTATION_GUIDE.md` Section 1 (Real Backend Integration)
4. **DAY 3:** Build first real API route (replace MSW)
5. **DAY 4:** Add signature verification
6. **DAY 5:** Implement curator approval workflow

---

## 🆘 TROUBLESHOOTING

### Issue: "Can't connect to database"
```bash
# Test your connection string
DATABASE_URL="your_connection_string" psql

# If that works, issue is in your Node.js code
# Check: Are you closing the pool?
```

### Issue: "Schema.sql won't apply"
```bash
# Check PostgreSQL version compatibility
psql "$DATABASE_URL" -c "SELECT version();"

# Some syntax might need adjustment for your PG version
```

### Issue: "Performance is slow"
```bash
# Add indices after schema creation
CREATE INDEX idx_releases_status ON releases(status);
CREATE INDEX idx_releases_created_at ON releases(created_at DESC);

# Analyze query performance
EXPLAIN ANALYZE SELECT * FROM releases WHERE status = 'pending';
```

---

## ✨ TIPS FOR SUCCESS

### 1. Keep `.env.local` Secret
```bash
# Add to .gitignore
echo ".env.local" >> .gitignore
```

### 2. Backup Your Database
```bash
# On Railway: automatic backups (free)
# On Render: available in dashboard
# On Supabase: automatic daily backups

# Manual backup:
pg_dump "$DATABASE_URL" > backup.sql
```

### 3. Use Connection Pooling
```typescript
// Don't create new connections per request!
// Use pool with maxClients = 20 (or fewer)

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // ← Important!
});
```

### 4. Add Environment Variables to Deployment
```bash
# When you deploy to Vercel/Render:
# Add DATABASE_URL to secrets
# Don't commit to GitHub!
```

### 5. Monitor Database Usage
```bash
# Check connections
SELECT count(*) FROM pg_stat_activity;

# Check table sizes
SELECT schemaname, tablename, 
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables;
```

---

## 🎉 YOU'RE READY FOR DAY 2!

Once you can run this successfully:

```bash
npm run dev
# ✅ App starts
# ✅ Can access database
# ✅ Schema applied
# ✅ Test script passes
```

You're set to begin building real API endpoints.

---

**Questions?** Check the docs:
- `DATABASE-ARCHITECTURE-ANALYSIS.md` - Detailed explanation
- `STORAGE-DECISIONS-QUICK-REFERENCE.md` - Quick reference
- `PHASE3_IMPLEMENTATION_GUIDE.md` Section 1 - Implementation details

**Ready to start?** →  Pick your database host, deploy, apply schema, and report back! 🚀


