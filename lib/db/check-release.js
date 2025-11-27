require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function checkRelease() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const releaseId = process.argv[2] || 'ARES001';
    console.log(`Checking release: ${releaseId}`);
    console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? 'Set' : 'NOT SET'}`);
    
    const result = await pool.query(
      'SELECT id, approvedat, multisigaddress, status FROM releases WHERE id = $1',
      [releaseId]
    );

    if (result.rows.length === 0) {
      console.log('Release not found');
    } else {
      console.log('Release data:');
      console.log(JSON.stringify(result.rows[0], null, 2));
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

checkRelease();

