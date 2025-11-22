require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function resetApproval() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const releaseId = process.argv[2]; // Expect release ID as argument
    if (!releaseId) {
      throw new Error('Please provide a release ID. Usage: node reset-approval.js PDA-xxx');
    }

    console.log(`🔄 Resetting approval for release: ${releaseId}`);
    
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
        timestamp: new Date(r.timestamp * 1000).toISOString()
      })));
    }
  } catch (err) {
    console.error('❌ Failed to reset approval:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

resetApproval();

