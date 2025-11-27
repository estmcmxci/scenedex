require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function clearRejectionReason() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const releaseId = process.argv[2];
    if (!releaseId) {
      console.log('Usage: node clear-rejection-reason.js <releaseId>');
      console.log('Example: node clear-rejection-reason.js ARES001');
      process.exit(1);
    }

    console.log(`🔄 Clearing rejection reason for release: ${releaseId}`);
    
    const result = await pool.query(
      `UPDATE releases SET rejectionreason = NULL WHERE id = $1 RETURNING id, status, rejectionreason`,
      [releaseId]
    );

    if (result.rowCount === 0) {
      console.log(`⚠️ No release found with ID ${releaseId}`);
    } else {
      console.log(`✅ Cleared rejection reason for release ${releaseId}`);
      console.log(`   Status: ${result.rows[0].status}`);
      console.log(`   Rejection reason: ${result.rows[0].rejectionreason || 'NULL'}`);
    }
  } catch (err) {
    console.error('❌ Failed to clear rejection reason:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

clearRejectionReason();

