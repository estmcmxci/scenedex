import path from 'path'
import fs from 'fs'
import { pinBufferToIPFS, pinToIPFS, extractAndPinCoverArt } from './ipfs'
import { extractDuration, extractAllMetadata } from './musicMetadata'

/**
 * Phase 2B Test: Complete Publishing Workflow
 * Tests Buffer support + metadata extraction + cover art + metadata JSON pinning
 * 
 * Simulates: User uploads MP3 → Backend extracts metadata → Pins everything → Returns CIDs
 */
async function runPhase2BTest() {
  const mp3Path = path.join(process.cwd(), '01 Red Alert.mp3')
  const releaseId = 'PDA-001'
  const filename = '01 Red Alert.mp3'

  console.log('\n🚀 PHASE 2B: Complete Publishing Workflow Test')
  console.log('=============================================\n')

  try {
    // Step 1: Read MP3 file as Buffer (simulating form upload)
    console.log('Step 1️⃣ : Read MP3 File as Buffer')
    console.log('----------------------------------')
    if (!fs.existsSync(mp3Path)) {
      throw new Error(`MP3 file not found: ${mp3Path}`)
    }

    const buffer = fs.readFileSync(mp3Path)
    console.log(`✅ Read buffer: ${(buffer.length / 1024 / 1024).toFixed(2)} MB\n`)

    // Step 2: Pin MP3 buffer to IPFS
    console.log('Step 2️⃣ : Pin MP3 Buffer to Storacha')
    console.log('-------------------------------------')
    const mediaIPFSHash = await pinBufferToIPFS(buffer, filename, releaseId)
    console.log(`✅ Media CID: ${mediaIPFSHash}\n`)

    // Step 3: Extract and pin cover art
    console.log('Step 3️⃣ : Extract and Pin Cover Art')
    console.log('-----------------------------------')
    const coverImageIPFSHash = await extractAndPinCoverArt(mp3Path)
    if (coverImageIPFSHash) {
      console.log(`✅ Cover Art CID: ${coverImageIPFSHash}\n`)
    } else {
      console.log(`⚠️  No cover art found\n`)
    }

    // Step 4: Extract music metadata
    console.log('Step 4️⃣ : Extract Music Metadata')
    console.log('--------------------------------')
    const duration = await extractDuration(mp3Path)
    const allMetadata = await extractAllMetadata(mp3Path)
    console.log(`✅ Extracted music metadata:`)
    console.log(`   - Title: ${allMetadata.title}`)
    console.log(`   - Artist: ${allMetadata.artist}`)
    console.log(`   - Album: ${allMetadata.album}`)
    console.log(`   - Duration: ${Math.round(duration)}s`)
    console.log(`   - Bitrate: ${allMetadata.bitrate}kbps`)
    console.log(`   - Year: ${allMetadata.year}`)
    console.log(`   - Genre: ${allMetadata.genre || 'N/A'}\n`)

    // Step 5: Verify cleanup
    console.log('Step 5️⃣ : Verify Cleanup')
    console.log('------------------------')
    const tempDir = '/tmp/uploads'
    const tempFiles = fs.existsSync(tempDir) ? fs.readdirSync(tempDir) : []
    const ourTempFiles = tempFiles.filter(f => f.includes(releaseId))

    if (ourTempFiles.length === 0) {
      console.log(`✅ All temp files cleaned up\n`)
    } else {
      console.log(`❌ ERROR: ${ourTempFiles.length} temp file(s) still exist\n`)
      throw new Error('Cleanup failed')
    }

    // Summary
    console.log('📋 Phase 2B Test Summary')
    console.log('------------------------')
    console.log(`✅ Release ID: ${releaseId}`)
    console.log(`✅ Media CID: ${mediaIPFSHash}`)
    console.log(`   Access: https://storacha.link/ipfs/${mediaIPFSHash}`)
    if (coverImageIPFSHash) {
      console.log(`✅ Cover Art CID: ${coverImageIPFSHash}`)
      console.log(`   Access: https://storacha.link/ipfs/${coverImageIPFSHash}`)
    }
    console.log(`✅ All temp files cleaned up`)
    console.log('\n✨ Phase 2B Test Passed! Ready for Phase 2C (Job Integration)\n')

    // Show what would be stored in database
    console.log('📊 Database Values to Store (for releases table):')
    console.log('--------------------------------------------------')
    console.log(`mediaIPFSHash: "${mediaIPFSHash}"`)
    if (coverImageIPFSHash) {
      console.log(`coverImageIPFSHash: "${coverImageIPFSHash}"`)
    }
    console.log(`duration: ${Math.round(duration)}`)
    console.log(`title: "${allMetadata.title}"`)
    console.log(`artists: "${allMetadata.artist}"`)
    console.log(`album: "${allMetadata.album}"`)
    console.log(`year: ${allMetadata.year || 'null'}`)
    console.log(`\nNote: Metadata JSON creation/pinning happens in Phase 2C (job integration)`)
  } catch (error) {
    console.error('❌ Phase 2B Test Failed:', error)
    process.exit(1)
  }
}

runPhase2BTest()

