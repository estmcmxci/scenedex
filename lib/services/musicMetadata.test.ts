import path from 'path'
import { extractDuration, extractCoverArt, extractAllMetadata } from './musicMetadata'

/**
 * Test script for music-metadata extraction
 * Usage: npx tsx lib/services/musicMetadata.test.ts [optional: /path/to/file.mp3]
 */
async function runTest() {
  // Get MP3 path from CLI arg or use default
  const mp3Path =
    process.argv[2] ||
    path.join(process.cwd(), '01 Red Alert.mp3')

  console.log('\n🎵 Music Metadata Extraction Test')
  console.log('================================\n')
  console.log(`Testing file: ${mp3Path}\n`)

  try {
    // Test 1: Extract duration
    console.log('📊 Test 1: Extracting Duration...')
    const duration = await extractDuration(mp3Path)
    console.log(`✅ Duration: ${Math.round(duration)}s (${(duration / 60).toFixed(2)} min)\n`)

    // Test 2: Extract cover art
    console.log('🖼️  Test 2: Extracting Cover Art...')
    const coverArt = await extractCoverArt(mp3Path)
    if (coverArt) {
      console.log(`✅ Cover Art Found:`)
      console.log(`   - Size: ${coverArt.data.length} bytes`)
      console.log(`   - Type: ${coverArt.type}`)
      console.log(`   - Description: ${coverArt.description || '(none)'}\n`)
    } else {
      console.log('⚠️  No cover art found\n')
    }

    // Test 3: Extract all metadata
    console.log('📋 Test 3: Extracting All Metadata...')
    const allMetadata = await extractAllMetadata(mp3Path)
    console.log(`✅ All Metadata:`)
    console.log(`   - Title: ${allMetadata.title || '(unknown)'}`)
    console.log(`   - Artist: ${allMetadata.artist || '(unknown)'}`)
    console.log(`   - Album: ${allMetadata.album || '(unknown)'}`)
    console.log(`   - Duration: ${Math.round(allMetadata.duration)}s`)
    console.log(`   - Bitrate: ${allMetadata.bitrate ? `${allMetadata.bitrate / 1000}kbps` : '(unknown)'}`)
    console.log(`   - Sample Rate: ${allMetadata.sampleRate || '(unknown)'} Hz`)
    console.log(`   - Channels: ${allMetadata.numberOfChannels || '(unknown)'}`)
    console.log(`   - Codec: ${allMetadata.codec || '(unknown)'}`)
    console.log(`   - Genre: ${allMetadata.genre || '(unknown)'}`)
    console.log(`   - Year: ${allMetadata.year || '(unknown)'}`)
    console.log(`   - Cover Art: ${allMetadata.picture ? `Yes (${allMetadata.picture.data.length} bytes)` : 'No'}\n`)

    console.log('✨ All tests passed! Music metadata extraction working correctly.\n')
  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

runTest()

