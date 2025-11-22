require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function resetAllApprovals() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const releaseId = process.argv[2]; // Optional release ID argument
    const confirmAll = process.argv[3] === '--confirm-all'; // Safety flag for deleting all

    if (releaseId) {
      // Reset approvals for a specific release
      console.log(`🔄 Resetting approvals for release: ${releaseId}`);
      
      const result = await pool.query(
        `DELETE FROM approvals WHERE releaseId = $1 RETURNING *`,
        [releaseId]
      );

      if (result.rowCount === 0) {
        console.log(`⚠️ No approvals found for release ${releaseId}`);
      } else {
        console.log(`✅ Deleted ${result.rowCount} approval(s) for release ${releaseId}`);
        console.log(`   Deleted approvals:`, result.rows.map(r => ({
          id: r.id,
          signer: r.signer,
          timestamp: new Date(r.timestamp * 1000).toISOString(),
          safeTxHash: r.safetxhash || r.safeTxHash || 'None'
        })));
      }
    } else {
      // Reset ALL approvals (requires confirmation)
      if (!confirmAll) {
        console.log(`⚠️  WARNING: This will delete ALL approvals from the database!`);
        console.log(`   To proceed, run: node reset-all-approvals.js --all --confirm-all`);
        console.log(`   Or specify a release ID: node reset-all-approvals.js PDA-xxx`);
        process.exit(1);
      }

      console.log(`🔄 Resetting ALL approvals...`);
      
      // First, show what will be deleted
      const preview = await pool.query(
        `SELECT releaseId, COUNT(*) as count FROM approvals GROUP BY releaseId ORDER BY releaseId`
      );
      
      if (preview.rowCount === 0) {
        console.log(`⚠️ No approvals found in database`);
      } else {
        console.log(`📋 Will delete approvals for ${preview.rowCount} release(s):`);
        preview.rows.forEach(row => {
          console.log(`   - ${row.releaseid}: ${row.count} approval(s)`);
        });
      }

      // Delete all approvals
      const result = await pool.query(`DELETE FROM approvals RETURNING *`);
      
      console.log(`✅ Deleted ${result.rowCount} total approval(s)`);
      
      if (result.rowCount > 0) {
        // Group by release for summary
        const summary = {};
        result.rows.forEach(r => {
          const rid = r.releaseid;
          if (!summary[rid]) summary[rid] = [];
          summary[rid].push({
            signer: r.signer,
            timestamp: new Date(r.timestamp * 1000).toISOString()
          });
        });
        
        console.log(`\n📊 Summary by release:`);
        Object.keys(summary).forEach(rid => {
          console.log(`   ${rid}: ${summary[rid].length} approval(s)`);
        });
      }
    }
  } catch (err) {
    console.error('❌ Failed to reset approvals:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

resetAllApprovals();

