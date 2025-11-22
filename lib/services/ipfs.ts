import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

// Retry configuration
const RETRY_CONFIG = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
}

/**
 * Helper: Exponential backoff delay
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Helper: Check if error is transient (retryable)
 */
function isTransientError(error: any): boolean {
  const errorMessage = error instanceof Error ? error.message : String(error)
  
  // Transient errors that might succeed on retry
  const transientPatterns = [
    'TransactionConflict',
    'ECONNRESET',
    'ETIMEDOUT',
    'timeout',
    'temporarily unavailable',
    'service unavailable',
  ]
  
  return transientPatterns.some(pattern => 
    errorMessage.toLowerCase().includes(pattern.toLowerCase())
  )
}

/**
 * Pin a file to IPFS via Storacha CLI with retry logic
 * Takes a file path, uploads to Storacha, returns CID
 * 
 * Features:
 * - Automatic retries on transient errors
 * - Exponential backoff between attempts
 * - Detailed error logging
 * 
 * @param filePath - Path to the file to pin (e.g., "/path/to/file.mp3")
 * @param attempt - Current attempt number (for internal use)
 * @returns Promise<string> - The IPFS CID (e.g., "bafy2giqxp...")
 * @throws Error if file not found, upload fails, or max retries exceeded
 */
export async function pinToIPFS(filePath: string, attempt: number = 1): Promise<string> {
  try {
    // Verify file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`)
    }

    const fileSize = fs.statSync(filePath).size
    const attemptStr = attempt > 1 ? ` (attempt ${attempt}/${RETRY_CONFIG.maxAttempts})` : ''
    console.log(`📤 Uploading to Storacha: ${filePath} (${(fileSize / 1024 / 1024).toFixed(2)} MB)${attemptStr}`)

    // Execute storacha CLI command with timeout
    const output = execSync(`storacha up "${filePath}"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 60000, // 60 second timeout
    })

    console.log('📡 Storacha response:', output.trim())

    // Extract CID from URL
    // Expected output: 🐔 https://storacha.link/ipfs/bafy2giqxp...
    const cidMatch = output.match(/ipfs\/(bafy[a-z0-9]+)/i)

    if (!cidMatch || !cidMatch[1]) {
      throw new Error(
        `Failed to extract CID from Storacha output. Got: ${output.substring(0, 200)}`
      )
    }

    const cid = cidMatch[1]
    const gatewayUrl = `https://storacha.link/ipfs/${cid}`

    console.log(`✅ Successfully pinned to IPFS:`)
    console.log(`   CID: ${cid}`)
    console.log(`   Gateway URL: ${gatewayUrl}`)

    return cid
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const isTransient = isTransientError(error)
    
    console.error(`❌ Upload failed (attempt ${attempt}/${RETRY_CONFIG.maxAttempts}):`, errorMessage)
    
    // If transient error and not max attempts, retry with exponential backoff
    if (isTransient && attempt < RETRY_CONFIG.maxAttempts) {
      const delay = Math.min(
        RETRY_CONFIG.initialDelayMs * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt - 1),
        RETRY_CONFIG.maxDelayMs
      )
      
      console.log(`⏳ Transient error detected. Retrying in ${delay}ms...`)
      await sleep(delay)
      
      // Add additional delay between attempts to avoid rate limiting
      if (attempt > 1) {
        const additionalDelay = 2000 // Extra 2 seconds between retries
        console.log(`⏳ Additional backoff delay: ${additionalDelay}ms`)
        await sleep(additionalDelay)
      }
      
      return pinToIPFS(filePath, attempt + 1)
    }
    
    // Permanent error or max retries exceeded
    console.error(`❌ Failed to pin to IPFS (permanent error or max retries exceeded)`)
    throw error
  }
}

/**
 * Pin a Buffer to IPFS via Storacha CLI
 * Writes buffer to temp file, uploads to Storacha, cleans up, returns CID
 * 
 * Features:
 * - Automatic retries on transient errors
 * - Sequential uploads to avoid Storacha conflicts
 * 
 * Used for form uploads where file is received as Buffer in memory
 * 
 * @param buffer - The file data as Buffer
 * @param filename - Original filename (e.g., "song.mp3")
 * @param releaseId - Release ID for organizing temp files (e.g., "PDA-001")
 * @returns Promise<string> - The IPFS CID
 * @throws Error if write fails, upload fails, or CID extraction fails
 */
export async function pinBufferToIPFS(
  buffer: Buffer,
  filename: string,
  releaseId: string
): Promise<string> {
  // Ensure uploads directory exists
  const uploadsDir = '/tmp/uploads'
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }

  // Create temp file path
  const tempFilePath = path.join(uploadsDir, `${releaseId}-${filename}`)

  try {
    // Write buffer to temp file
    console.log(
      `💾 Writing buffer to temp file: ${tempFilePath} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`
    )
    fs.writeFileSync(tempFilePath, buffer)

    // Pin to IPFS using existing function (with retry logic built-in)
    console.log(`📤 Pinning buffer to IPFS...`)
    const cid = await pinToIPFS(tempFilePath)

    console.log(`✅ Buffer pinned successfully: ${cid}`)
    
    // Add delay after successful upload to reduce Storacha conflicts
    console.log(`⏳ Waiting before next upload...`)
    await sleep(1500)
    
    return cid
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`❌ Failed to pin buffer to IPFS:`, errorMessage)
    throw error
  } finally {
    // Always cleanup temp file
    try {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath)
        console.log(`🗑️  Cleaned up temp file: ${tempFilePath}`)
      }
    } catch (cleanupError) {
      console.error(`⚠️  Failed to cleanup temp file:`, cleanupError)
    }
  }
}

/**
 * Pin cover art to IPFS
 * Extracts cover art from MP3, pins to Storacha, returns CID
 * 
 * @param mp3FilePath - Path to the MP3 file
 * @returns Promise<string | null> - The IPFS CID or null if no cover art found
 */
export async function extractAndPinCoverArt(mp3FilePath: string): Promise<string | null> {
  try {
    // Import music metadata service
    const { extractCoverArt } = await import('./musicMetadata')

    console.log(`🎨 Extracting cover art from: ${mp3FilePath}`)
    const coverArt = await extractCoverArt(mp3FilePath)

    if (!coverArt) {
      console.log('⚠️  No cover art found, using fallback')
      // TODO: Use default cover image fallback
      return null
    }

    // Write cover art to temp file
    const tempCoverPath = `/tmp/cover-${Date.now()}.jpg`
    fs.writeFileSync(tempCoverPath, coverArt.data)
    console.log(`💾 Saved cover art to temp: ${tempCoverPath}`)

    try {
      // Pin cover art to IPFS
      const coverCid = await pinToIPFS(tempCoverPath)
      console.log(`✅ Cover art pinned: ${coverCid}`)
      return coverCid
    } finally {
      // Cleanup temp file
      fs.unlinkSync(tempCoverPath)
      console.log(`🗑️  Cleaned up temp cover file`)
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`❌ Failed to extract and pin cover art:`, errorMessage)
    throw error
  }
}

