import path from 'path'
import { pinToIPFS, extractAndPinCoverArt } from './ipfs'

/**
 * Phase 2A Test: Pin MP3 file to Storacha
 * Tests direct file pinning before integrating with job system
 */
async function runPhase2ATest() {
  const mp3Path = path.join(process.cwd(), '01 Red Alert.mp3')

  console.log('\n🚀 PHASE 2A: IPFS Pinning Test (Storacha CLI Wrapper)')
  console.log('======================================================\n')

  try {
    // Test 1: Pin the main MP3 file
    console.log('Test 1️⃣ : Pin MP3 File to Storacha')
    console.log('----------------------------------')
    const mp3Cid = await pinToIPFS(mp3Path)
    console.log(`✅ MP3 CID: ${mp3Cid}\n`)

    // Test 2: Extract and pin cover art
    console.log('Test 2️⃣ : Extract and Pin Cover Art')
    console.log('-----------------------------------')
    const coverCid = await extractAndPinCoverArt(mp3Path)
    if (coverCid) {
      console.log(`✅ Cover Art CID: ${coverCid}\n`)
    } else {
      console.log(`⚠️  No cover art to pin\n`)
    }

    // Summary
    console.log('📋 Phase 2A Test Summary')
    console.log('------------------------')
    console.log(`✅ MP3 Pinned: ${mp3Cid}`)
    console.log(`   Access at: https://storacha.link/ipfs/${mp3Cid}`)
    if (coverCid) {
      console.log(`✅ Cover Art Pinned: ${coverCid}`)
      console.log(`   Access at: https://storacha.link/ipfs/${coverCid}`)
    }
    console.log('\n✨ Phase 2A Test Passed! Ready for Phase 2B (Buffer Support)\n')
  } catch (error) {
    console.error('❌ Phase 2A Test Failed:', error)
    process.exit(1)
  }
}

runPhase2ATest()

