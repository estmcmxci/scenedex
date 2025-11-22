import { parseFile, IPicture } from 'music-metadata'
import fs from 'fs'

export interface CoverArtResult {
  data: Uint8Array
  type: string
  description?: string
}

/**
 * Extract duration in seconds from MP3 file
 * Returns 0 if unable to extract
 */
export async function extractDuration(mp3FilePath: string): Promise<number> {
  try {
    if (!fs.existsSync(mp3FilePath)) {
      console.warn(`File not found: ${mp3FilePath}`)
      return 0
    }

    const metadata = await parseFile(mp3FilePath)

    if (metadata.format.duration) {
      console.log(
        `✅ Extracted duration: ${Math.round(metadata.format.duration)}s from ${mp3FilePath}`
      )
      return metadata.format.duration
    }

    console.warn(`⚠️  No duration found in ${mp3FilePath}`)
    return 0
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`❌ Failed to extract duration from ${mp3FilePath}:`, errorMessage)
    return 0
  }
}

/**
 * Extract cover art from MP3 file
 * Returns first picture found, or null if none exist
 */
export async function extractCoverArt(
  mp3FilePath: string
): Promise<CoverArtResult | null> {
  try {
    if (!fs.existsSync(mp3FilePath)) {
      console.warn(`File not found: ${mp3FilePath}`)
      return null
    }

    const metadata = await parseFile(mp3FilePath)

    // Check if pictures exist
    if (!metadata.common.picture || metadata.common.picture.length === 0) {
      console.warn(`⚠️  No cover art found in ${mp3FilePath}`)
      return null
    }

    // Extract first picture
    const picture = metadata.common.picture[0] as IPicture
    console.log(
      `✅ Extracted cover art from ${mp3FilePath} (${picture.data.length} bytes, type: ${picture.type})`
    )

    return {
      data: picture.data,
      type: picture.type || 'image/jpeg',
      description: picture.description,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`❌ Failed to extract cover art from ${mp3FilePath}:`, errorMessage)
    return null
  }
}

/**
 * Extract all metadata from MP3 file
 * Returns complete metadata object
 */
export async function extractAllMetadata(mp3FilePath: string) {
  try {
    if (!fs.existsSync(mp3FilePath)) {
      throw new Error(`File not found: ${mp3FilePath}`)
    }

    const metadata = await parseFile(mp3FilePath)
    const picture = metadata.common.picture?.[0] as IPicture | undefined

    return {
      duration: metadata.format.duration || 0,
      bitrate: metadata.format.bitrate || 0,
      sampleRate: metadata.format.sampleRate || 0,
      numberOfChannels: metadata.format.numberOfChannels || 0,
      codec: metadata.format.codec,
      title: metadata.common.title,
      artist: metadata.common.artist,
      album: metadata.common.album,
      year: metadata.common.year,
      genre: metadata.common.genre,
      picture: picture
        ? {
            data: picture.data,
            type: picture.type || 'image/jpeg',
            description: picture.description,
          }
        : null,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`❌ Failed to extract metadata from ${mp3FilePath}:`, errorMessage)
    throw error
  }
}

