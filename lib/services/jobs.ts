import { query as dbQuery } from '../db/database'
import fs from 'fs'
import { pinBufferToIPFS, extractAndPinCoverArt } from './ipfs'
import { extractDuration, extractAllMetadata } from './musicMetadata'
import { createSplitForRelease } from './splits'
import { createCoinForRelease } from './zora'
import { registerEROSRelease, createENSSubname, executeENSRecords } from './ens'

export interface PublishReleaseJob {
  releaseId: string
  approvals: Array<{ signer: string; signature: string }>
}

/**
 * Enqueue a publish-release job
 * Called when approval threshold is met
 */
export async function enqueuePublishJob(
  releaseId: string,
  approvals: Array<{ signer: string; signature: string }>
): Promise<string> {
  const result = await dbQuery(
    `INSERT INTO jobs 
     (release_id, job_type, status, data, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING id`,
    [
      releaseId,
      'publish_release',
      'pending',
      JSON.stringify({ approvals }),
    ]
  )

  const jobId = result.rows[0].id
  console.log(`✅ Enqueued publish job: ${jobId} for release: ${releaseId}`)

  return jobId
}

/**
 * Get pending jobs to process
 * Called by background worker
 */
export async function getPendingJobs(limit: number = 10) {
  const result = await dbQuery(
    `SELECT id, release_id, data FROM jobs 
     WHERE status = 'pending' AND attempts < max_attempts
     ORDER BY created_at ASC
     LIMIT $1`,
    [limit]
  )

  return result.rows
}

/**
 * Mark job as processing
 */
export async function markJobProcessing(jobId: string): Promise<void> {
  await dbQuery(
    `UPDATE jobs 
     SET status = 'processing', started_at = NOW(), attempts = attempts + 1
     WHERE id = $1`,
    [jobId]
  )
}

/**
 * Mark job as completed
 */
export async function markJobCompleted(jobId: string): Promise<void> {
  await dbQuery(
    `UPDATE jobs 
     SET status = 'completed', completed_at = NOW()
     WHERE id = $1`,
    [jobId]
  )
}

/**
 * Mark job as failed
 */
export async function markJobFailed(
  jobId: string,
  errorMessage: string
): Promise<void> {
  await dbQuery(
    `UPDATE jobs 
     SET status = 'failed', error_message = $1
     WHERE id = $2`,
    [errorMessage, jobId]
  )
}

/**
 * PHASE 2C: Publish Release Job
 * 
 * Flow:
 * 1. Load release from database
 * 2. Load temp_files BLOBs (file_data, cover_data)
 * 3. Pin media file to IPFS
 * 4. Pin cover art to IPFS
 * 5. Extract music metadata from loaded file
 * 6. Build metadata JSON (ERC721 + Zora + music metadata)
 * 7. Pin metadata JSON to IPFS
 * 8. Update releases table with IPFS hashes + metadata
 * 9. Delete temp_files (cleanup after success)
 */
export async function publishRelease(releaseId: string): Promise<void> {
  console.log(`📦 Publishing release: ${releaseId}`)

  try {
    // Step 1: Load release from database
    console.log(`Step 1️⃣: Load release from database`)
    const releaseResult = await dbQuery(
      `SELECT id, title, description, artists, createdBy, createdAt, status, mediaIPFSHash, coverImageIPFSHash, duration, metadataURI, album, genre, year, bitrate, sampleRate, channels, codec, split_address, zora_coin_address FROM releases WHERE id = $1`,
      [releaseId]
    )

    if (releaseResult.rows.length === 0) {
      throw new Error(`Release not found: ${releaseId}`)
    }

    const release = releaseResult.rows[0]
    console.log(`✅ Release loaded: ${release.title}`)
    console.log(`   createdBy: ${release.createdby || release.createdBy || 'UNDEFINED'}`)

    // Step 2: Load temp_files BLOBs from database
    console.log(`Step 2️⃣: Load temp_files BLOBs from database`)
    const tempFilesResult = await dbQuery(
      `SELECT file_data, cover_data, file_size, cover_size FROM temp_files WHERE releaseId = $1`,
      [releaseId]
    )

    if (tempFilesResult.rows.length === 0) {
      throw new Error(`No temp files found for release: ${releaseId}`)
    }

    const tempFile = tempFilesResult.rows[0]
    if (!tempFile.file_data) {
      throw new Error(`No file data in temp storage for release: ${releaseId}`)
    }

    const mp3Buffer = tempFile.file_data
    const coverBuffer = tempFile.cover_data
    console.log(`✅ Loaded BLOBs: MP3=${(mp3Buffer.length / 1024 / 1024).toFixed(2)}MB${coverBuffer ? `, Cover=${(coverBuffer.length / 1024 / 1024).toFixed(2)}MB` : ''}`)

    // Step 3: Get next EROS/SOMA number (needed for IPFS filenames)
    console.log(`Step 3️⃣: Get next available EROS/SOMA number`)
    const { getNextEROSNumber, formatEROSNumber } = await import('./ens')
    const erosNumber = await getNextEROSNumber()
    const erosId = formatEROSNumber(erosNumber)
    console.log(`✅ EROS number assigned: ${erosId}`)
    console.log(`   Database ID: ${releaseId}`)
    console.log(`   IPFS filename ID: ${erosId}`)

    // Step 4: Pin media file to IPFS (using EROS ID for filename)
    console.log(`Step 4️⃣: Pin media file to IPFS`)
    const mediaIPFSHash = await pinBufferToIPFS(mp3Buffer, 'release.mp3', erosId)
    console.log(`✅ Media pinned: ${mediaIPFSHash}`)
    console.log(`   Gateway URL: https://${mediaIPFSHash}.ipfs.w3s.link/${erosId}-release.mp3`)

    // Step 5: Pin cover art (use pre-extracted cover_data if available, otherwise extract from MP3)
    console.log(`Step 5️⃣: Pin cover art to IPFS`)
    const tempMp3Path = `/tmp/${releaseId}-extract.mp3`
    fs.writeFileSync(tempMp3Path, mp3Buffer)
    console.log(`✅ Wrote MP3 to temp location: ${tempMp3Path}`)

    let coverImageIPFSHash: string | null = null
    try {
      if (coverBuffer) {
        // Cover was pre-extracted at submission time - pin it directly
        console.log(`   Using pre-extracted cover (${(coverBuffer.length / 1024).toFixed(2)} KB)`)
        const coverCID = await pinBufferToIPFS(coverBuffer, 'cover.jpg', erosId)
        if (coverCID) {
          coverImageIPFSHash = coverCID
          console.log(`✅ Cover art pinned: ${coverImageIPFSHash}`)
          console.log(`   Gateway URL: https://${coverImageIPFSHash}.ipfs.w3s.link/${erosId}-cover.jpg`)
        }
      } else {
        // No pre-extracted cover - try to extract from MP3 and pin
        console.log(`   No pre-extracted cover found, attempting extraction from MP3...`)
        coverImageIPFSHash = await extractAndPinCoverArt(tempMp3Path)
        if (coverImageIPFSHash) {
          console.log(`✅ Cover art extracted and pinned: ${coverImageIPFSHash}`)
          console.log(`   Gateway URL: https://${coverImageIPFSHash}.ipfs.w3s.link/${erosId}-cover.jpg`)
        } else {
          console.log(`⚠️ No cover art found in MP3 file`)
        }
      }
    } catch (error) {
      console.warn(`⚠️ Failed to pin cover art:`, error)
    }

    // Step 6: Extract music metadata
    console.log(`Step 6️⃣: Extract music metadata`)
    
    const duration = await extractDuration(tempMp3Path)
    const allMetadata = await extractAllMetadata(tempMp3Path)
    console.log(`✅ Metadata extracted: ${allMetadata.title} by ${allMetadata.artist} (${Math.round(duration)}s)`)

    // Step 7: Build metadata JSON
    console.log(`Step 7️⃣: Build metadata JSON (ERC721 + Zora + music metadata)`)
    const metadata = {
      // ERC721 Standard (required by Zora)
      name: allMetadata.title || release.title || 'Untitled',
      description: release.description || `${allMetadata.artist || 'Unknown'} - ${allMetadata.album || 'Album'}`,
      image: coverImageIPFSHash ? `ipfs://${coverImageIPFSHash}` : undefined,

      // Zora extensions
      animation_url: `ipfs://${mediaIPFSHash}`,
      content: {
        mime: 'audio/mpeg',
        uri: `ipfs://${mediaIPFSHash}`,
      },

      // Catalogue custom fields (from extracted music metadata)
      properties: {
        catalogueId: erosId,  // Use EROS ID (SOMA012) for consistency with IPFS filenames
        databaseId: releaseId, // Keep database ID for internal reference
        duration: Math.round(duration),
        artist: allMetadata.artist || 'Unknown',
        album: allMetadata.album || 'Album',
        year: allMetadata.year,
        bitrate: allMetadata.bitrate,
        format: {
          codec: allMetadata.codec,
          sampleRate: allMetadata.sampleRate,
          channels: allMetadata.numberOfChannels,
        },
      },
    }

    const metadataJSON = JSON.stringify(metadata, null, 2)
    console.log(`✅ Metadata JSON created (${metadataJSON.length} bytes)`)

    // Step 8: Pin metadata JSON to IPFS
    console.log(`Step 8️⃣: Pin metadata JSON to IPFS`)
    const metadataBuffer = Buffer.from(metadataJSON, 'utf-8')
    const metadataURI = await pinBufferToIPFS(metadataBuffer, 'metadata.json', erosId)
    console.log(`✅ Metadata JSON pinned: ${metadataURI}`)

    // Step 9: Create split contract (Safe 50% + Submitter 50%)
    console.log(`Step 9️⃣: Create split contract for revenue distribution`)
    let splitAddress: string | null = null
    try {
      // Check if submitter address exists (handle case sensitivity)
      const submitterAddr = release.createdBy || release.createdby;
      if (!submitterAddr) {
        console.warn(`⚠️ No submitter address (createdBy) - skipping split creation`)
        console.warn(`   Release data keys:`, Object.keys(release))
      } else {
        // Get Safe address from curator_settings
        const safeResult = await dbQuery(
          `SELECT safe_address FROM curator_settings LIMIT 1`
        )

        if (safeResult.rows.length === 0) {
          console.warn(`⚠️ No Safe address found in curator_settings (skipping split creation)`)
        } else {
          const safeAddress = safeResult.rows[0].safe_address as string

          console.log(`   Safe (Curator): ${safeAddress} (50%)`)
          console.log(`   Submitter: ${submitterAddr} (50%)`)

          splitAddress = await createSplitForRelease(
            `0x${safeAddress.replace(/^0x/, '')}` as any,
            `0x${submitterAddr.replace(/^0x/, '')}` as any,
            releaseId
          )
          console.log(`✅ Split created: ${splitAddress}`)
        }
      }
    } catch (error) {
      console.warn(`⚠️ Failed to create split:`, error instanceof Error ? error.message : String(error))
    }

    // Step 10: Create Zora coin (uses split_address as payoutRecipient)
    console.log(`Step 1️⃣0️⃣: Create Zora coin for revenue distribution`)
    let zoraCoinAddress: string | null = null
    let zoraCoinSymbol: string | null = null
    try {
      if (!splitAddress) {
        console.warn(`⚠️ No split address available - skipping Zora coin creation`)
      } else {
        const creatorAddr = release.createdby || release.createdBy || release.createdBy
        if (!creatorAddr) {
          throw new Error('Creator address (createdBy) not found in release')
        }
        const coinResult = await createCoinForRelease(
          releaseId,
          `0x${creatorAddr.replace(/^0x/, '')}` as any,
          `0x${splitAddress.replace(/^0x/, '')}` as any,
          `ipfs://${metadataURI}`,
          release.title,
          release.description
        )
        zoraCoinAddress = coinResult.coinAddress
        zoraCoinSymbol = coinResult.symbol
        console.log(`✅ Zora coin created: ${zoraCoinAddress}`)
        console.log(`   Creator: ${creatorAddr}`)
        console.log(`   Symbol: ${zoraCoinSymbol}`)
      }
    } catch (error) {
      console.warn(`⚠️ Failed to create Zora coin:`, error instanceof Error ? error.message : String(error))
    }

    // Step 11: Register ENS subname + text records + execute
    console.log(`Step 1️⃣1️⃣: Register ENS subname and text records`)
    let ensSubname: string | null = null
    let ensTxHashes: string[] = []
    try {
      if (!zoraCoinAddress) {
        console.warn(`⚠️ No Zora coin address available - skipping ENS registration`)
      } else {
        const creatorAddr = release.createdby || release.createdBy
        const ensResult = await registerEROSRelease(
          {
            id: release.id,
            title: release.title,
            description: release.description,
            mediaIPFSHash: mediaIPFSHash,
            coverImageIPFSHash: coverImageIPFSHash,
            metadataURI: metadataURI,
            artists: release.artists,
            duration: release.duration,
            createdBy: creatorAddr,
            createdAt: release.createdAt,
            status: 'published',
          } as any,
          zoraCoinAddress,
          zoraCoinSymbol || 'UNKNOWN',
          splitAddress || 'PENDING',  // Split address for revenue distribution
          creatorAddr,
          erosNumber  // Pass the erosNumber we already got in Step 3
        )
        
        ensSubname = ensResult.subnameLabel
        console.log(`✅ ENS registration prepared`)
        console.log(`   Subname: ${ensResult.subnameLabel}.scenedex.eth`)
        console.log(`   Node: ${ensResult.subnameNode}`)
        console.log(`   Records: ${ensResult.batchSize} setText calls\n`)

        // Step 11a: Create subname via NameWrapper
        console.log(`Step 1️⃣1️⃣a: Create subname via NameWrapper...`)
        const createSubnameTx = await createENSSubname(
          ensResult.subnameLabel,
          process.env.ENS_PARENT_NODE || ensResult.subnameNode
        )
        ensTxHashes.push(createSubnameTx)
        console.log(`✅ Subname created\n`)

        // Step 11b: Execute setText transactions
        console.log(`Step 1️⃣1️⃣b: Execute setText records on Sepolia L1...`)
        const setTextHashes = await executeENSRecords(ensResult.records, ensResult.subnameNode, release.createdby || release.createdBy)
        ensTxHashes.push(...setTextHashes)
        console.log(`✅ ENS records executed: ${setTextHashes.length} transactions confirmed\n`)
      }
    } catch (error) {
      console.warn(`⚠️ Failed to register ENS:`, error instanceof Error ? error.message : String(error))
    }

    // Step 12: Update releases table with all hashes + metadata + split + coin + ENS
    console.log(`Step 1️⃣2️⃣: Update releases table with IPFS hashes + metadata + split + coin + ENS`)
    await dbQuery(
      `UPDATE releases 
       SET mediaIPFSHash = $1, 
           coverImageIPFSHash = $2,
           metadataURI = $3,
           duration = $4,
           album = $5,
           genre = $6,
           year = $7,
           bitrate = $8,
           sampleRate = $9,
           channels = $10,
           codec = $11,
           split_address = $12,
           zora_coin_address = $13,
           zora_coin_symbol = $14,
           ensSubname = $15,
           status = 'published'
       WHERE id = $16`,
      [
        mediaIPFSHash,
        coverImageIPFSHash || null,
        metadataURI,
        Math.round(duration),
        allMetadata.album || null,
        allMetadata.genre || null,
        allMetadata.year || null,
        allMetadata.bitrate ? Math.round(allMetadata.bitrate) : null,
        allMetadata.sampleRate || null,
        allMetadata.numberOfChannels || null,
        allMetadata.codec || null,
        splitAddress || null,
        zoraCoinAddress || null,
        zoraCoinSymbol || null,
        ensSubname || null,
        releaseId,
      ]
    )
    console.log(`✅ Releases table updated with split_address + zora_coin_address + ensSubname`)

    // Step 13: Delete temp_files from database (cleanup)
    console.log(`Step 1️⃣3️⃣: Delete temp_files from database`)
    await dbQuery(
      `DELETE FROM temp_files WHERE releaseId = $1`,
      [releaseId]
    )
    console.log(`✅ Temp files purged from database`)

    // Step 14: Cleanup temp extraction file
    console.log(`Step 1️⃣4️⃣: Cleanup temporary extraction files`)
    try {
      if (fs.existsSync(tempMp3Path)) {
        fs.unlinkSync(tempMp3Path)
        console.log(`✅ Deleted temp extraction file`)
      }
    } catch (error) {
      console.warn(`⚠️ Error deleting temp extraction file:`, error)
    }

    console.log(`✅ Release ${releaseId} published successfully!`)
    console.log(`   Media CID: ${mediaIPFSHash}`)
    console.log(`   Cover CID: ${coverImageIPFSHash}`)
    console.log(`   Metadata URI: ${metadataURI}`)
    console.log(`   Split Address: ${splitAddress}`)
    console.log(`   Zora Coin: ${zoraCoinSymbol} (${zoraCoinAddress})`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`❌ Failed to publish release ${releaseId}:`, errorMessage)
    throw error
  }
}

/**
 * Background worker: Poll for pending jobs
 * This runs every 5 seconds to process jobs
 */
export async function startJobWorker(): Promise<void> {
  console.log('🚀 Starting job worker...')

  setInterval(async () => {
    try {
      const jobs = await getPendingJobs(5)

      for (const job of jobs) {
        await markJobProcessing(job.id)

        try {
          // Execute publish release job
          console.log(`🔄 Processing job ${job.id}: ${job.release_id}`)
          await publishRelease(job.release_id)
          
          // Mark job completed
          await markJobCompleted(job.id)
          console.log(`✅ Job ${job.id} completed`)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          console.error(`❌ Job ${job.id} failed:`, error)
          await markJobFailed(job.id, errorMessage)
        }
      }
    } catch (error) {
      console.error('Job worker error:', error)
    }
  }, 5000) // Poll every 5 seconds
}

