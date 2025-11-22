import { Pool, QueryResult } from 'pg';

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config({ path: '.env.local' });
  } catch (e) {
    // dotenv not available, that's ok in production
  }
}

// Initialize connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Test connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connected successfully');
  }
});

/**
 * Execute a query with optional parameters
 */
export async function query(
  text: string,
  params?: any[]
): Promise<QueryResult<any>> {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (err) {
    console.error('Database query error:', { text, err });
    throw err;
  }
}

/**
 * Get a single row
 */
export async function getOne(
  text: string,
  params?: any[]
): Promise<any | null> {
  const result = await query(text, params);
  return result.rows[0] || null;
}

/**
 * Get multiple rows
 */
export async function getAll(
  text: string,
  params?: any[]
): Promise<any[]> {
  const result = await query(text, params);
  return result.rows;
}

/**
 * Close the pool
 */
export async function closePool(): Promise<void> {
  await pool.end();
  console.log('Database pool closed');
}

export default pool;

