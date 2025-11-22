require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const { Pool } = require('pg');

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔄 Reading migration file...');
    const migrationSQL = fs.readFileSync(
      'lib/db/migrations/001-initial-schema.sql',
      'utf8'
    );

    console.log('🔄 Executing migration...');
    await pool.query(migrationSQL);

    console.log('✅ Migration successful! All tables created.');

    // Verify tables were created
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('\n📋 Tables created:');
    result.rows.forEach((row) => {
      console.log(`   - ${row.table_name}`);
    });

  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

runMigration();

