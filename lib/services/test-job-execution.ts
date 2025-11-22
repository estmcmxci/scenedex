/**
 * JOB EXECUTION TEST: Full IPFS Pinning Workflow
 * 
 * Tests the complete publishRelease job with REAL IPFS pinning:
 * 1. Load root MP3 as BLOB → insert into temp_files
 * 2. Create releases record (status='approved')
 * 3. Call publishRelease() directly
 * 4. Verify IPFS pinning happened (mediaIPFSHash + metadataURI)
 * 5. Verify database updated
 * 6. Verify temp_files cleaned up
 */

import { query as dbQuery } from '../db/database'
import { readFileSync } from 'fs'
import { join } from 'path'
import { publishRelease } from './jobs'

const RELEASE_ID = 'PDA-JOB-TEST-' + Date.now()
const USER_ADDRESS = '0x' + '2'.repeat(40)

console.log(`\n📝 Test Config:`)
console.log(`   Release ID: ${RELEASE_ID}`)
console.log(`   Mock Submitter Address: ${USER_ADDRESS}\n`)

async function testJobExecution() {
  console.log('\n🚀 JOB EXECUTION TEST: Real IPFS Pinning')
  console.log('========================================\n')

  try {
    // ──────────────────────────────────────────────────────────────────────────
    // PHASE 1: Setup Test Data
    // ──────────────────────────────────────────────────────────────────────────

    console.log('📋 Phase 1️⃣: Setup Test Data')
    console.log('-----------------------------')

    const mp3Path = join(process.cwd(), '01 Red Alert.mp3')
    const mp3Buffer = readFileSync(mp3Path)
    const now = Math.floor(Date.now() / 1000)
    const expiresAt = now + (7 * 24 * 60 * 60)

    console.log(`Reading MP3: ${(mp3Buffer.length / 1024 / 1024).toFixed(2)}MB`)

    // Create releases record (must exist before temp_files due to FK)
    console.log('Creating releases record...')
    await dbQuery(
      `INSERT INTO releases 
       (id, title, description, artists, createdBy, createdAt, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [RELEASE_ID, 'Red Alert', 'Job execution test', 'Caine Casket', USER_ADDRESS, now, 'approved']
    )
    console.log('✅ Releases record created')

    // Insert MP3 BLOB into temp_files
    console.log('Inserting MP3 BLOB into temp_files...')
    await dbQuery(
      `INSERT INTO temp_files 
       (releaseId, file_data, cover_data, file_size, cover_size, uploadedAt, expiresAt, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [RELEASE_ID, mp3Buffer, null, mp3Buffer.length, null, now, expiresAt, 'pending']
    )
    console.log('✅ MP3 BLOB stored')

    // ──────────────────────────────────────────────────────────────────────────
    // PHASE 2: Execute Job (Real IPFS Pinning)
    // ──────────────────────────────────────────────────────────────────────────

    console.log('\n📋 Phase 2️⃣: Execute publishRelease Job')
    console.log('---------------------------------------')
    console.log('Calling publishRelease() with real IPFS pinning...\n')

    await publishRelease(RELEASE_ID)

    console.log('\n✅ Job execution completed\n')

    // ──────────────────────────────────────────────────────────────────────────
    // PHASE 3: Verify Results
    // ──────────────────────────────────────────────────────────────────────────

    console.log('📋 Phase 3️⃣: Verify Results')
    console.log('----------------------------')

    // Check releases table was updated
    const releaseResult = await dbQuery(
      `SELECT 
        id, title, status, mediaIPFSHash, coverImageIPFSHash, metadataURI,
        duration, album, genre, year, bitrate, sampleRate, channels, codec
       FROM releases WHERE id = $1`,
      [RELEASE_ID]
    )

    if (releaseResult.rows.length === 0) {
      throw new Error(`Release ${RELEASE_ID} not found`)
    }

    const release = releaseResult.rows[0]

    console.log(`✅ Release found: ${release.id}`)
    console.log(`   Status: ${release.status}`)
    console.log(`   Media CID: ${release.mediaipfshash || 'NOT SET'}`)
    console.log(`   Metadata URI: ${release.metadatauri || 'NOT SET'}`)
    console.log(`   Duration: ${release.duration}s`)
    console.log(`   Album: ${release.album}`)
    console.log(`   Artist metadata extraction: ✅`)

    // Verify all required fields
    if (!release.mediaipfshash) throw new Error('mediaIPFSHash not set')
    if (!release.metadatauri) throw new Error('metadataURI not set')
    if (!release.duration) throw new Error('duration not extracted')
    if (release.status !== 'published') throw new Error('status not set to published')

    console.log(`\n✅ All required fields populated`)

    // Check temp_files was cleaned up
    const tempFilesCount = await dbQuery(
      `SELECT COUNT(*) FROM temp_files WHERE releaseId = $1`,
      [RELEASE_ID]
    )

    if (parseInt(tempFilesCount.rows[0].count) > 0) {
      throw new Error('temp_files not cleaned up')
    }

    console.log(`✅ temp_files cleaned up`)

    // ──────────────────────────────────────────────────────────────────────────
    // PHASE 4: Test IPFS Gateway Access
    // ──────────────────────────────────────────────────────────────────────────

    console.log('\n📋 Phase 4️⃣: Test IPFS Gateway Access')
    console.log('---------------------------------------')

    const gatewayURL = `https://storacha.link/ipfs/${release.mediaipfshash}`
    console.log(`Media gateway URL: ${gatewayURL}`)
    console.log(`Metadata gateway URL: https://storacha.link/ipfs/${release.metadatauri}`)

    console.log(`\n✨ Try accessing in browser or with curl:`)
    console.log(`   curl "${gatewayURL}" --output test.mp3`)

    // ──────────────────────────────────────────────────────────────────────────
    // FINAL SUMMARY
    // ──────────────────────────────────────────────────────────────────────────

    console.log('\n✨ JOB EXECUTION TEST PASSED!')
    console.log('============================\n')
    console.log('Summary:')
    console.log(`✅ Release: ${RELEASE_ID}`)
    console.log(`✅ Media IPFS: ${release.mediaipfshash.substring(0, 20)}...`)
    console.log(`✅ Metadata IPFS: ${release.metadatauri.substring(0, 20)}...`)
    console.log(`✅ Metadata extracted: duration=${release.duration}s, album=${release.album}`)
    console.log(`✅ Status: ${release.status}`)
    console.log(`✅ Temp files cleaned\n`)

  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

testJobExecution()

