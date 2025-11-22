import pool from './database.js';

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connection successful:', result.rows[0]);
  } catch (err) {
    console.error('❌ Connection failed:', err);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

testConnection();

