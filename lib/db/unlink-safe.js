require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function unlinkSafe() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const walletAddress = process.argv[2];
    if (!walletAddress) {
      console.error('Usage: node lib/db/unlink-safe.js <walletAddress>');
      process.exit(1);
    }

    console.log(`🔓 Unlinking Safe for wallet: ${walletAddress}`);

    const result = await pool.query(
      'DELETE FROM user_safes WHERE wallet_address = $1',
      [walletAddress.toLowerCase()]
    );

    console.log(`✅ Unlinked ${result.rowCount} Safe(s) for wallet ${walletAddress}`);
  } catch (error) {
    console.error('❌ Failed to unlink Safe:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

unlinkSafe();

