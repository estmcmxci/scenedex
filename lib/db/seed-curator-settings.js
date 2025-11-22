require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function seedCuratorSettings() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Try SAFE_ADDRESS first, fallback to CURATOR_SAFE_ADDRESS for compatibility
    const safeAddress = process.env.SAFE_ADDRESS || process.env.CURATOR_SAFE_ADDRESS;
    if (!safeAddress) {
      throw new Error('SAFE_ADDRESS or CURATOR_SAFE_ADDRESS not set in .env.local');
    }

    const threshold = 1; // 1-of-1 multisig (adjust if needed)
    const now = Math.floor(Date.now() / 1000);

    // Check if already exists
    const existing = await pool.query(
      'SELECT * FROM curator_settings LIMIT 1'
    );

    if (existing.rows.length > 0) {
      console.log('⚠️  curator_settings already exists:');
      console.log('   Safe Address:', existing.rows[0].safe_address);
      console.log('   Threshold:', existing.rows[0].approval_threshold);
      console.log('\n💡 To update, delete the existing row first or update it manually.');
      return;
    }

    // Insert new settings
    await pool.query(
      `INSERT INTO curator_settings (safe_address, approval_threshold, created_at, updated_at) 
       VALUES ($1, $2, $3, $4)`,
      [safeAddress, threshold, now, now]
    );

    console.log('✅ Seeded curator_settings:');
    console.log('   Safe Address:', safeAddress);
    console.log('   Approval Threshold:', threshold);
    console.log('   Created At:', new Date(now * 1000).toISOString());
  } catch (error) {
    console.error('❌ Failed to seed curator_settings:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedCuratorSettings();

