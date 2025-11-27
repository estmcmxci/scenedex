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
  connectionTimeoutMillis: 10000, // Increased to 10 seconds
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
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
 * Execute a query with optional parameters and retry logic
 */
export async function query(
  text: string,
  params?: any[],
  retries: number = 2
): Promise<QueryResult<any>> {
  const start = Date.now();
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: result.rowCount, attempt: attempt + 1 });
      return result;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const errorMessage = lastError.message.toLowerCase();
      
      // Retry on connection errors
      const isConnectionError = 
        errorMessage.includes('connection') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('terminated') ||
        errorMessage.includes('econnreset');
      
      if (isConnectionError && attempt < retries) {
        console.warn(`Database query failed (attempt ${attempt + 1}/${retries + 1}), retrying...`, { text, error: lastError.message });
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
      
      // Don't retry on other errors or if we've exhausted retries
      console.error('Database query error:', { text, err: lastError, attempt: attempt + 1 });
      throw lastError;
    }
  }
  
  // Should never reach here, but TypeScript needs it
  throw lastError || new Error('Query failed after retries');
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

