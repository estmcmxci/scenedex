require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function fixReleaseMetadata() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const releaseId = process.argv[2] || 'ARES001';
    
    // Get Safe address from user_safes (fallback to curator_settings)
    let safeAddress = null;
    const userSafeResult = await pool.query('SELECT safe_address FROM user_safes WHERE is_active = true LIMIT 1');
    if (userSafeResult.rows.length > 0) {
      safeAddress = userSafeResult.rows[0].safe_address;
    } else {
      const safeResult = await pool.query('SELECT safe_address FROM curator_settings LIMIT 1');
      safeAddress = safeResult.rows.length > 0 ? safeResult.rows[0].safe_address : null;
    }
    
    if (!safeAddress) {
      console.log('No Safe address found in curator_settings');
      return;
    }
    
    console.log(`Fixing release: ${releaseId}`);
    console.log(`Safe address: ${safeAddress}`);
    
    // Set approvedat to a reasonable timestamp (let's use current time minus 1 hour as approximation)
    const approvedAt = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
    
    const result = await pool.query(
      `UPDATE releases 
       SET approvedat = $1, multisigaddress = $2 
       WHERE id = $3 AND (approvedat IS NULL OR multisigaddress IS NULL)
       RETURNING id, approvedat, multisigaddress, status`,
      [approvedAt, safeAddress, releaseId]
    );

    if (result.rows.length === 0) {
      console.log('Release not found or already has metadata');
    } else {
      console.log('Updated release:');
      console.log(JSON.stringify(result.rows[0], null, 2));
      console.log(`Approved at: ${new Date(approvedAt * 1000).toISOString()}`);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

fixReleaseMetadata();

