import { query as dbQuery } from '../db/database'
import fs from 'fs'
import { pinBufferToIPFS, extractAndPinCoverArt } from './ipfs'
import { extractDuration, extractAllMetadata } from './musicMetadata'
import { createSplitForRelease, getSplitCalldata, extractSplitAddressFromLogs } from './splits'
import { createCoinForRelease, getZoraCoinCalldata, extractZoraCoinAddressFromLogs } from './zora'
import { registerEROSRelease, createENSSubname, executeENSRecords, getENSCompleteCalldata } from './ens'
import { executeSimpleSafeTransaction, clearProtocolKitCache } from './safe-transactions'
import { getSafeAddress } from './safe'
import { zeroAddress } from 'viem'

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
 * PHASE 7: Publish Release via Safe Transaction
 * 
 * Flow:
 * 1. Load release from database
 * 2. Load temp_files BLOBs (file_data, cover_data)
 * 3. Pin media file to IPFS
 * 4. Pin cover art to IPFS
 * 5. Extract music metadata from loaded file
 * 6. Build metadata JSON (ERC721 + Zora + music metadata)
 * 7. Pin metadata JSON to IPFS
 * 8. Build calldata for Splits, Zora, and ENS
 * 9. Create and execute Safe transaction (batched)
 * 10. Update releases table with IPFS hashes + metadata + safeTxHash
 * 11. Delete temp_files (cleanup after success)
 * 
 * @returns safeTxHash of the executed transaction
 */
export async function publishReleaseViaSafe(releaseId: string, curatorWalletAddress?: string): Promise<string> {
  console.log(`📦 Publishing release via Safe: ${releaseId}`)

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
    const creatorAddress = release.createdBy || release.createdby || 'UNDEFINED'
    console.log(`   createdBy: ${creatorAddress}`)

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

    // Step 3: Extract ARES number from release ID (release ID is now in ARES001 format)
    console.log(`Step 3️⃣: Extracting ARES number from release ID`)
    const { formatEROSNumber } = await import('./ens')
    
    // Extract number from release ID (e.g., "ARES001" -> 1, "ARES042" -> 42)
    let erosNumber: number
    let erosId: string
    
    if (releaseId.match(/^ARES\d{3}$/i)) {
      // New format: ARES001, ARES002, etc.
      erosNumber = parseInt(releaseId.replace(/^ARES/i, ''), 10)
      erosId = releaseId.toUpperCase()
      console.log(`✅ ARES number extracted from release ID: ${erosId} (number: ${erosNumber})`)
    } else {
      // Fallback for old format: get next available number
      console.log(`⚠️ Release ID "${releaseId}" doesn't match ARES format, getting next available number`)
      const { getNextEROSNumber } = await import('./ens')
      erosNumber = await getNextEROSNumber()
      erosId = formatEROSNumber(erosNumber)
      console.log(`✅ ARES number assigned: ${erosId}`)
    }

    // Step 4: Pin media file to IPFS
    console.log(`Step 4️⃣: Pin media file to IPFS`)
    const mediaIPFSHash = await pinBufferToIPFS(mp3Buffer, 'release.mp3', erosId)
    console.log(`✅ Media pinned: ${mediaIPFSHash}`)

    // Step 5: Pin cover art
    console.log(`Step 5️⃣: Pin cover art to IPFS`)
    const tempMp3Path = `/tmp/${releaseId}-extract.mp3`
    fs.writeFileSync(tempMp3Path, mp3Buffer)

    let coverImageIPFSHash: string | null = null
    try {
      if (coverBuffer) {
        const coverCID = await pinBufferToIPFS(coverBuffer, 'cover.jpg', erosId)
        if (coverCID) {
          coverImageIPFSHash = coverCID
          console.log(`✅ Cover art pinned: ${coverImageIPFSHash}`)
        }
      } else {
        coverImageIPFSHash = await extractAndPinCoverArt(tempMp3Path)
        if (coverImageIPFSHash) {
          console.log(`✅ Cover art extracted and pinned: ${coverImageIPFSHash}`)
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

    // Step 7: Get Safe address (needed for metadata)
    console.log(`Step 7️⃣: Get Safe address for metadata`)
    // Use curator's Safe if provided, otherwise use global Safe
    const safeAddress = await getSafeAddress(curatorWalletAddress)
    const safeAddressFormatted = `0x${safeAddress.replace(/^0x/, '')}` as any
    const creatorAddressFormatted = `0x${creatorAddress.replace(/^0x/, '')}` as any
    console.log(`✅ Safe address: ${safeAddressFormatted}`)
    console.log(`✅ Creator address: ${creatorAddressFormatted}`)

    // Step 8: Build metadata JSON (ERC721 + Zora + music metadata + provenance)
    console.log(`Step 8️⃣: Build metadata JSON (ERC721 + Zora + music metadata + provenance)`)
    const submissionTimestamp = release.createdAt ? new Date(release.createdAt).getTime() : Date.now()
    const publicationTimestamp = Date.now()
    
    const metadata = {
      name: allMetadata.title || release.title || 'Untitled',
      description: release.description || `${allMetadata.artist || 'Unknown'} - ${allMetadata.album || 'Album'}`,
      image: coverImageIPFSHash ? `ipfs://${coverImageIPFSHash}` : undefined,
      animation_url: `ipfs://${mediaIPFSHash}`,
      content: {
        mime: 'audio/mpeg',
        uri: `ipfs://${mediaIPFSHash}`,
      },
      properties: {
        // Catalogue identifiers
        catalogueId: erosId,
        databaseId: releaseId,
        
        // PROOF OF CREATOR - Cryptographic proof of who created/submitted this release
        // This proves the creator's wallet submitted this release to the platform
        proofOfCreator: {
          address: creatorAddressFormatted,      // Creator's wallet address (ETH address)
          timestamp: submissionTimestamp,        // When the release was submitted (Unix ms)
          timestampISO: new Date(submissionTimestamp).toISOString(), // Human-readable timestamp
          role: 'creator',                       // Role identifier
          description: 'The wallet address that submitted this release to the Catalogue platform. This address receives 50% of revenue via the Split contract.',
        },
        
        // PROOF OF PUBLISHER - Cryptographic proof of curator/platform publication
        // This proves the curator multisig approved and published this release
        proofOfPublisher: {
          address: safeAddressFormatted,         // Safe/Curator multisig address
          timestamp: publicationTimestamp,       // When the release was published (Unix ms)
          timestampISO: new Date(publicationTimestamp).toISOString(), // Human-readable timestamp
          role: 'publisher',                     // Role identifier
          multisigType: 'Safe',                  // Type of multisig (Gnosis Safe)
          chain: 'Base Sepolia',                 // Chain where Safe is deployed
          chainId: 84532,                        // Chain ID
          description: 'The Gnosis Safe multisig that approved and published this release on-chain. The Safe transaction hash serves as cryptographic proof of publication.',
        },
        
        // Music metadata
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
        
        // Note: On-chain addresses (Split, Zora coin) are set in the ENS basename records
        // The Safe transaction hash is recorded in the publication-proof.json file
      },
    }

    const metadataJSON = JSON.stringify(metadata, null, 2)
    console.log(`✅ Metadata JSON created (${metadataJSON.length} bytes)`)
    console.log(`   Includes provenance: creator=${creatorAddressFormatted}, curator=${safeAddressFormatted}`)

    // Step 9: Pin metadata JSON to IPFS
    console.log(`Step 9️⃣: Pin metadata JSON to IPFS`)
    const metadataBuffer = Buffer.from(metadataJSON, 'utf-8')
    const metadataURI = await pinBufferToIPFS(metadataBuffer, 'metadata.json', erosId)
    console.log(`✅ Metadata JSON pinned: ${metadataURI}`)

    // Step 10: Build calldata for all on-chain operations (Split + Zora + Basename)
    console.log(`Step 1️⃣0️⃣: Build calldata for on-chain operations`)

    // 10a: Get Split calldata and predicted address
    console.log(`   10a: Building Split creation calldata...`)
    const submitterAddr = release.createdBy || release.createdby
    if (!submitterAddr) {
      throw new Error('Submitter address (createdBy) not found in release')
    }
    const splitCalldataResult = await getSplitCalldata(
      safeAddressFormatted,
      `0x${submitterAddr.replace(/^0x/, '')}` as any,
      releaseId // Pass releaseId to make split unique per release
    )
    const predictedSplitAddress = splitCalldataResult.predictedAddress
    console.log(`   ✅ Split calldata ready, predicted address: ${predictedSplitAddress}`)

    // 10b: Get Zora coin calldata (uses predicted split address)
    console.log(`   10b: Building Zora coin creation calldata...`)
    // Generate deterministic salt based on releaseId for address prediction (if needed)
    const { keccak256, encodePacked } = await import('viem')
    const deterministicSalt = keccak256(
      encodePacked(
        ['string', 'string'],
        [releaseId, 'zora-coin-salt']
      )
    )
    const zoraCalldataResult = getZoraCoinCalldata(
      releaseId,
      creatorAddressFormatted,
      predictedSplitAddress as any,
      `ipfs://${metadataURI}`,
      release.title,
      'metadata.json',
      deterministicSalt
    )
    // Extract coin symbol from releaseId (ARES001 → ARES001, or fallback for old format)
    let zoraCoinSymbol: string
    if (releaseId.match(/^ARES\d{3}$/i)) {
      zoraCoinSymbol = releaseId.toUpperCase()
    } else {
      // Fallback for old PDA format
      const pdaNumber = releaseId.split('-')[1] || 'UNKNOWN'
      zoraCoinSymbol = `PDA${pdaNumber}`
    }
    console.log(`   ✅ Zora coin calldata ready, symbol: ${zoraCoinSymbol}`)

    // 10c: Basenames calldata (uses predicted addresses - will verify after execution)
    console.log(`   10c: Building Basenames calldata...`)
    // Note: We use zeroAddress as placeholder for Zora coin address since we can't predict it easily
    // We'll extract it from logs after execution and update the database
    const ensCalldata = await getENSCompleteCalldata(
      {
        id: release.id,
        title: release.title,
        description: release.description,
        mediaIPFSHash: mediaIPFSHash,
        coverImageIPFSHash: coverImageIPFSHash,
        metadataURI: metadataURI,
        artists: release.artists,
        duration: release.duration,
        createdBy: creatorAddress,
        createdAt: release.createdAt,
        status: 'published',
      } as any,
      zeroAddress, // Placeholder - will extract from logs after execution
      zoraCoinSymbol, // We know the symbol from releaseId
      predictedSplitAddress, // Use predicted split address
      creatorAddressFormatted,
      safeAddressFormatted,
      erosNumber
    )
    console.log(`   ✅ Basenames calldata ready (${ensCalldata.length} operations)`)

    // Step 11: Split operations into separate Safe transactions for isolation
    // This allows us to identify exactly which operation fails and why
    console.log(`Step 1️⃣1️⃣: Splitting operations into separate Safe transactions for isolation`)
    console.log(`   ⚠️  Each major operation in separate transaction to isolate failures`)
    
    // Verify ensCalldata has expected operations
    if (ensCalldata.length === 0) {
      throw new Error('ENS calldata is empty - expected at least 1 setSubnodeRecord operation')
    }
    
    // Split basename operations: first is setSubnodeRecord, rest are resolver operations
    const setSubnodeRecordOp = ensCalldata[0]! // First operation is setSubnodeRecord (verified above)
    const resolverOps = ensCalldata.slice(1) // Rest are setAddr + setText operations
    
    // Transaction 1: setSubnodeRecord alone (creates subname)
    const tx1Operations = [setSubnodeRecordOp]
    
    // Transaction 2: Split creation alone
    const tx2Operations = [{
      to: splitCalldataResult.to,
      data: splitCalldataResult.data,
      value: splitCalldataResult.value,
    }]
    
    // Transaction 3: Zora coin creation alone (will be regenerated with actual split address after Transaction 2)
    let tx3Operations = [{
      to: zoraCalldataResult.to,
      data: zoraCalldataResult.data,
      value: zoraCalldataResult.value,
    }]
    
    // Transaction 4: Resolver operations (can batch these since they're all resolver calls)
    const tx4Operations = resolverOps
    
    console.log(`   ✅ Split into 4 Safe transactions:`)
    console.log(`      Transaction 1: setSubnodeRecord (creates subname)`)
    console.log(`      Transaction 2: Split creation`)
    console.log(`      Transaction 3: Zora coin creation`)
    console.log(`      Transaction 4: ${tx4Operations.length} resolver operations (setAddr + setText)\n`)

    // Helper function to wait for transaction and clear cache
    const waitAndClearCache = async (txHash: string, txNumber: number) => {
      console.log(`   ⏳ Waiting for Transaction ${txNumber} to be mined...`)
      try {
        const { createPublicClient, http } = await import('viem')
        const { baseSepolia } = await import('viem/chains')
        const publicClient = createPublicClient({
          chain: baseSepolia,
          transport: http(process.env.BASE_RPC_URL!),
        })
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: txHash as `0x${string}`,
        })
        console.log(`   ✅ Transaction ${txNumber} confirmed in block ${receipt.blockNumber}`)
        
        // Wait for nonce to update
        console.log(`   ⏳ Waiting 2 seconds for Safe nonce to update...`)
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Clear Protocol Kit cache (already imported at top)
        clearProtocolKitCache()
        console.log(`   ✅ Cleared Safe instance cache - ready for next transaction`)
      } catch (error) {
        console.warn(`   ⚠️  Could not wait for Transaction ${txNumber} confirmation:`, error)
        console.log(`   ⏳ Waiting 3 seconds before next transaction (fallback delay)...`)
        await new Promise(resolve => setTimeout(resolve, 3000))
      }
    }

    // Track transaction results
    const txResults: Array<{ number: number; name: string; hash: string | null; success: boolean; error?: string }> = []
    
    // Step 11a: Execute Transaction 1 (setSubnodeRecord)
    console.log(`Step 1️⃣1️⃣a: Execute Transaction 1 (setSubnodeRecord)`)
    let tx1Hash: string | null = null
    try {
      const tx1Result = await executeSimpleSafeTransaction(tx1Operations)
      tx1Hash = tx1Result.hash || (tx1Result as any).safeTxHash || 'UNKNOWN'
      console.log(`✅ Transaction 1 executed: ${tx1Hash}`)
      txResults.push({ number: 1, name: 'setSubnodeRecord', hash: tx1Hash, success: true })
      if (tx1Hash) await waitAndClearCache(tx1Hash, 1)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error(`❌ Transaction 1 failed: ${errorMsg}`)
      txResults.push({ number: 1, name: 'setSubnodeRecord', hash: null, success: false, error: errorMsg })
      console.log(`   ⚠️  Continuing to next transaction...`)
      await new Promise(resolve => setTimeout(resolve, 2000)) // Wait before next
    }

    // Step 11b: Execute Transaction 2 (Split creation)
    console.log(`\nStep 1️⃣1️⃣b: Execute Transaction 2 (Split creation)`)
    let tx2Hash: string | null = null
    try {
      const tx2Result = await executeSimpleSafeTransaction(tx2Operations)
      tx2Hash = tx2Result.hash || (tx2Result as any).safeTxHash || 'UNKNOWN'
      console.log(`✅ Transaction 2 executed: ${tx2Hash}`)
      txResults.push({ number: 2, name: 'Split creation', hash: tx2Hash, success: true })
      if (tx2Hash) await waitAndClearCache(tx2Hash, 2)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error(`❌ Transaction 2 failed: ${errorMsg}`)
      txResults.push({ number: 2, name: 'Split creation', hash: null, success: false, error: errorMsg })
      console.log(`   ⚠️  Continuing to next transaction...`)
      await new Promise(resolve => setTimeout(resolve, 2000)) // Wait before next
    }
    
    // Extract split address from Transaction 2 for use in Transaction 3 (Zora needs split address)
    let actualSplitAddress: string | null = predictedSplitAddress
    if (tx2Hash) {
      try {
        const { createPublicClient, http } = await import('viem')
        const { baseSepolia } = await import('viem/chains')
        const publicClient = createPublicClient({
          chain: baseSepolia,
          transport: http(process.env.BASE_RPC_URL!),
        })
        const receipt = await publicClient.getTransactionReceipt({
          hash: tx2Hash as `0x${string}`,
        })
        const { extractSplitAddressFromLogs } = await import('./splits')
        const extractedSplit = await extractSplitAddressFromLogs(receipt, predictedSplitAddress as any)
        if (extractedSplit) {
          actualSplitAddress = extractedSplit
          console.log(`   ✅ Split address extracted from Transaction 2: ${actualSplitAddress}`)
          
          // Verify split contract has code (is deployed)
          const splitCode = await publicClient.getCode({ address: actualSplitAddress as `0x${string}` })
          if (splitCode && splitCode !== '0x') {
            console.log(`   ✅ Split contract verified (has code)`)
          } else {
            console.warn(`   ⚠️  Split contract has no code - may not be fully deployed yet`)
          }
        } else {
          console.warn(`   ⚠️  Could not extract split address, using predicted: ${predictedSplitAddress}`)
        }
      } catch (error) {
        console.warn(`   ⚠️  Could not extract split address:`, error)
      }
    } else {
      console.warn(`   ⚠️  Transaction 2 failed, using predicted split address: ${predictedSplitAddress}`)
    }

    // Step 11c: Regenerate Zora calldata with actual split address (if different from predicted)
    // This ensures we use the real split address, not just the predicted one
    console.log(`\nStep 1️⃣1️⃣c: Regenerate Zora calldata with actual split address`)
    
    // If actual split address differs from predicted, regenerate Zora calldata
    if (actualSplitAddress && actualSplitAddress.toLowerCase() !== predictedSplitAddress.toLowerCase()) {
      console.log(`   🔄 Actual split address differs from predicted - regenerating Zora calldata...`)
      const { keccak256, encodePacked } = await import('viem')
      const deterministicSalt = keccak256(
        encodePacked(
          ['string', 'string'],
          [releaseId, 'zora-coin-salt']
        )
      )
      const { getZoraCoinCalldata } = await import('./zora')
      const regeneratedZoraCalldata = getZoraCoinCalldata(
        releaseId,
        creatorAddressFormatted,
        actualSplitAddress as any, // Use actual split address
        `ipfs://${metadataURI}`,
        release.title,
        'metadata.json',
        deterministicSalt
      )
      tx3Operations = [{
        to: regeneratedZoraCalldata.to,
        data: regeneratedZoraCalldata.data,
        value: regeneratedZoraCalldata.value,
      }]
      console.log(`   ✅ Zora calldata regenerated with actual split address: ${actualSplitAddress}`)
    } else {
      console.log(`   ✅ Using original Zora calldata (split address matches predicted)`)
    }

    // Step 11c: Execute Transaction 3 (Zora coin creation)
    console.log(`\nStep 1️⃣1️⃣c: Execute Transaction 3 (Zora coin creation)`)
    let tx3Hash: string | null = null
    try {
      const tx3Result = await executeSimpleSafeTransaction(tx3Operations)
      tx3Hash = tx3Result.hash || (tx3Result as any).safeTxHash || 'UNKNOWN'
      console.log(`✅ Transaction 3 executed: ${tx3Hash}`)
      txResults.push({ number: 3, name: 'Zora coin creation', hash: tx3Hash, success: true })
      if (tx3Hash) await waitAndClearCache(tx3Hash, 3)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error(`❌ Transaction 3 failed: ${errorMsg}`)
      txResults.push({ number: 3, name: 'Zora coin creation', hash: null, success: false, error: errorMsg })
      console.log(`   ⚠️  Continuing to next transaction...`)
      await new Promise(resolve => setTimeout(resolve, 2000)) // Wait before next
    }

    // Step 11d: Execute Transaction 4 (Resolver operations)
    console.log(`\nStep 1️⃣1️⃣d: Execute Transaction 4 (Resolver operations)`)
    let tx4Hash: string | null = null
    try {
      const tx4Result = await executeSimpleSafeTransaction(tx4Operations)
      tx4Hash = tx4Result.hash || (tx4Result as any).safeTxHash || 'UNKNOWN'
      console.log(`✅ Transaction 4 executed: ${tx4Hash}`)
      txResults.push({ number: 4, name: 'Resolver operations', hash: tx4Hash, success: true })
      // Wait for Transaction 4 to be mined and clear cache before Transaction 5
      if (tx4Hash) await waitAndClearCache(tx4Hash, 4)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error(`❌ Transaction 4 failed: ${errorMsg}`)
      txResults.push({ number: 4, name: 'Resolver operations', hash: null, success: false, error: errorMsg })
      // Still wait before next transaction even if this one failed
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    // Print summary of all transactions
    console.log(`\n📊 TRANSACTION SUMMARY:`)
    console.log(`================================================`)
    for (const result of txResults) {
      if (result.success) {
        console.log(`   ✅ Transaction ${result.number} (${result.name}): ${result.hash}`)
      } else {
        console.log(`   ❌ Transaction ${result.number} (${result.name}): FAILED`)
        if (result.error) {
          console.log(`      Error: ${result.error.substring(0, 200)}${result.error.length > 200 ? '...' : ''}`)
        }
      }
    }
    console.log(`================================================\n`)
    
    // Use Transaction 3 hash as the main transaction hash (contains Zora, which is the most complex)
    // But we'll extract addresses from all transactions
    // If Transaction 3 failed, use the last successful transaction
    const safeTxHash = tx3Hash || tx2Hash || tx1Hash || tx4Hash || 'UNKNOWN'

    // Variables to store extracted addresses (actualSplitAddress already extracted above)
    let actualZoraCoinAddress: string | null = null
    const actualZoraCoinSymbol = zoraCoinSymbol // Already computed from releaseId
    // Compute ENS subname from erosNumber (deterministic)
    const ensSubnameLabel = formatEROSNumber(erosNumber)
    const parentDomain = process.env.ENS_DOMAIN || 'scenius.basetest.eth'
    const ensSubname = `${ensSubnameLabel}.${parentDomain}`

    // Step 11e: Extract addresses from individual transactions
    console.log(`Step 1️⃣1️⃣e: Extract addresses from individual transactions...`)
    let receipt: any = null // Store receipt for publication proof (use Transaction 3 for Zora)
    
    try {
      const { createPublicClient, http } = await import('viem')
      const { baseSepolia } = await import('viem/chains')
      const rpcUrl = process.env.BASE_RPC_URL!
      
      const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(rpcUrl),
      })
      
      // Extract split address from Transaction 2 (already done above, but verify)
      if (actualSplitAddress && actualSplitAddress !== predictedSplitAddress) {
        console.log(`   ✅ Split address from Transaction 2: ${actualSplitAddress}`)
      } else {
        console.log(`   ✅ Using predicted split address: ${actualSplitAddress}`)
      }
      
      // Extract Zora coin address from Transaction 3 (if it succeeded)
      if (tx3Hash) {
        console.log(`   Extracting Zora coin address from Transaction 3...`)
        try {
          const tx3Receipt = await publicClient.getTransactionReceipt({
            hash: tx3Hash as `0x${string}`,
          })
          receipt = tx3Receipt // Use for publication proof
          
          const factoryAddress = process.env.ZORA_COIN_FACTORY_ADDRESS
          if (factoryAddress) {
            const { extractZoraCoinAddressFromLogs } = await import('./zora')
            const extractedZoraAddress = extractZoraCoinAddressFromLogs(tx3Receipt, factoryAddress as any)
            if (extractedZoraAddress) {
              actualZoraCoinAddress = extractedZoraAddress
              console.log(`   ✅ Zora coin address extracted: ${actualZoraCoinAddress}`)
            } else {
              console.warn(`   ⚠️ Could not extract Zora coin address from Transaction 3 logs`)
            }
          } else {
            console.warn(`   ⚠️ ZORA_COIN_FACTORY_ADDRESS not set, cannot extract coin address`)
          }
          
          console.log(`   ✅ Transaction 3 confirmed at block ${tx3Receipt.blockNumber}`)
          console.log(`   📋 Transaction logs: ${tx3Receipt.logs.length} entries`)
        } catch (error) {
          console.warn(`   ⚠️  Could not extract Zora address from Transaction 3:`, error)
        }
      } else {
        console.warn(`   ⚠️  Transaction 3 failed, cannot extract Zora coin address`)
        // Use Transaction 2 receipt for publication proof if available
        if (tx2Hash) {
          try {
            receipt = await publicClient.getTransactionReceipt({
              hash: tx2Hash as `0x${string}`,
            })
          } catch (e) {
            // Ignore
          }
        }
      }
      
    } catch (error) {
      console.warn(`⚠️  Failed to extract addresses:`, error)
      // Don't throw - continue with what we have
    }

    // Step 11f: Update ENS record with actual Zora coin address (if extracted)
    if (actualZoraCoinAddress && actualZoraCoinAddress !== zeroAddress) {
      console.log(`\nStep 1️⃣1️⃣f: Execute Transaction 5 (Update zoraCoinAddress in ENS)`)
      try {
        const { namehash, encodeFunctionData } = await import('viem')
        
        // Calculate the subname node
        const parentDomain = process.env.ENS_DOMAIN || 'scenius.basetest.eth'
        const fullSubname = `${erosId.toLowerCase()}.${parentDomain}`
        const subnameNode = namehash(fullSubname)
        const RESOLVER_ADDRESS = process.env.ENS_RESOLVER_BASE_SEPOLIA || '0x85C87e548091f204C2d0350b39ce1874f02197c6'
        
        // Build setText calldata for zoraCoinAddress
        const RESOLVER_ABI = [
          {
            name: 'setText',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'node', type: 'bytes32' },
              { name: 'key', type: 'string' },
              { name: 'value', type: 'string' },
            ],
            outputs: [],
          },
        ] as const
        
        const updateZoraOp = {
          to: RESOLVER_ADDRESS,
          data: encodeFunctionData({
            abi: RESOLVER_ABI,
            functionName: 'setText',
            args: [subnameNode as `0x${string}`, 'eth.scenedex.zoraCoinAddress', actualZoraCoinAddress],
          }),
          value: '0',
        }
        
        console.log(`   Updating eth.scenedex.zoraCoinAddress to: ${actualZoraCoinAddress}`)
        
        const tx5Result = await executeSimpleSafeTransaction([updateZoraOp])
        const tx5Hash = tx5Result.hash
        console.log(`✅ Transaction 5 executed: ${tx5Hash}`)
        txResults.push({ number: 5, name: 'Update zoraCoinAddress in ENS', hash: tx5Hash, success: true })
        
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        console.error(`❌ Transaction 5 failed: ${errorMsg}`)
        txResults.push({ number: 5, name: 'Update zoraCoinAddress in ENS', hash: null, success: false, error: errorMsg })
        // Continue - this is non-critical, the coin address is in the publication proof
      }
    } else {
      console.log(`\n⚠️  Skipping Transaction 5 (no Zora coin address to update)`)
    }

    // Step 11g: Create publication proof JSON with transaction hash
    console.log(`Step 1️⃣1️⃣g: Create publication proof JSON with transaction hash...`)
    let publicationProofURI: string | null = null
    try {
      const publicationProof = {
        // Schema version for future compatibility
        version: '1.0.0',
        
        // Reference to the main metadata
        metadata: {
          uri: `ipfs://${metadataURI}`,
          cid: metadataURI,
          gatewayUrl: `https://${metadataURI}.ipfs.w3s.link`,
        },
        
        // PROOF OF CREATOR - Cryptographic proof of who created this release
        proofOfCreator: {
          address: creatorAddressFormatted,
          timestamp: submissionTimestamp,
          timestampISO: new Date(submissionTimestamp).toISOString(),
          role: 'creator',
          revenueShare: '50%',
          description: 'The wallet address that submitted this release. Receives 50% of revenue via the Split contract.',
        },
        
        // PROOF OF PUBLISHER - Cryptographic proof of curator publication
        proofOfPublisher: {
          address: safeAddressFormatted,
          timestamp: publicationTimestamp,
          timestampISO: new Date(publicationTimestamp).toISOString(),
          role: 'publisher',
          multisigType: 'Safe',
          chain: 'Base Sepolia',
          chainId: 84532,
          revenueShare: '50%',
          description: 'The Gnosis Safe multisig that approved and published this release on-chain.',
        },
        
        // On-chain transaction proof
        transactionProof: {
          hash: safeTxHash,
          chain: 'Base Sepolia',
          chainId: 84532,
          blockNumber: receipt?.blockNumber?.toString() || null,
          explorerUrl: `https://sepolia.basescan.org/tx/${safeTxHash}`,
          description: 'The Safe transaction hash serves as cryptographic proof that the curator approved and published this release.',
        },
        
        // Release identifiers
        identifiers: {
          catalogueId: erosId,
          databaseId: releaseId,
          ensSubname: `${erosId.toLowerCase()}.${process.env.ENS_DOMAIN || 'scenius.basetest.eth'}`,
        },
        
        // On-chain deployed contracts
        contracts: {
          splitAddress: actualSplitAddress,
          splitDescription: 'Revenue split contract (0xSplits) - distributes funds 50/50 between creator and publisher',
          zoraCoinAddress: actualZoraCoinAddress,
          zoraCoinSymbol: zoraCoinSymbol,
          zoraCoinDescription: 'Zora creator coin - ERC20 token for this release',
        },
        
        // Verification instructions
        verification: {
          howToVerify: [
            '1. Verify Safe transaction on BaseScan using the transactionProof.explorerUrl',
            '2. Verify creator address owns 50% of Split contract',
            '3. Verify publisher (Safe) address owns 50% of Split contract',
            '4. Verify Zora coin payoutRecipient is the Split contract address',
            '5. Verify ENS basename records match the metadata',
          ],
          note: 'This publication proof creates an immutable link between the creator, publisher, and on-chain assets.',
        },
      }
      
      const proofJSON = JSON.stringify(publicationProof, null, 2)
      const proofBuffer = Buffer.from(proofJSON, 'utf-8')
      publicationProofURI = await pinBufferToIPFS(proofBuffer, 'publication-proof.json', erosId)
      console.log(`   ✅ Publication proof pinned: ${publicationProofURI}`)
      console.log(`   📋 Includes transaction hash: ${safeTxHash}`)
    } catch (error) {
      console.warn(`⚠️  Failed to create publication proof:`, error)
      // Continue - this is supplementary, not critical
    }

    // Step 12: Update releases table with extracted addresses
    console.log(`Step 1️⃣2️⃣: Update releases table with IPFS + addresses`)
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
        actualSplitAddress,
        actualZoraCoinAddress,
        zoraCoinSymbol,
        ensSubname,
        releaseId,
      ]
    )
    console.log(`✅ Releases table updated`)
    if (actualSplitAddress) {
      console.log(`   Split Address: ${actualSplitAddress}`)
    }
    if (actualZoraCoinAddress) {
      console.log(`   Zora Coin: ${actualZoraCoinAddress} (${zoraCoinSymbol})`)
    }
    console.log(`   ENS Subname: ${ensSubname}`)

    // Step 13: Delete temp_files
    console.log(`Step 1️⃣3️⃣: Delete temp_files from database`)
    await dbQuery(`DELETE FROM temp_files WHERE releaseId = $1`, [releaseId])
    console.log(`✅ Temp files purged`)

    // Step 14: Cleanup
    try {
      if (fs.existsSync(tempMp3Path)) {
        fs.unlinkSync(tempMp3Path)
      }
    } catch (error) {
      console.warn(`⚠️ Error deleting temp file:`, error)
    }

    console.log(`✅ Release ${releaseId} published via Safe transaction!`)
    console.log(`   Safe Tx Hash: ${safeTxHash}`)
    console.log(`   Media CID: ${mediaIPFSHash}`)
    console.log(`   Metadata URI: ${metadataURI}`)

    return safeTxHash
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`❌ Failed to publish release via Safe ${releaseId}:`, errorMessage)
    throw error
  }
}

/**
 * PHASE 2C: Publish Release Job (LEGACY - for backward compatibility)
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

    // Step 3: Extract ARES number from release ID (release ID is now in ARES001 format)
    console.log(`Step 3️⃣: Extracting ARES number from release ID`)
    const { formatEROSNumber } = await import('./ens')
    
    // Extract number from release ID (e.g., "ARES001" -> 1, "ARES042" -> 42)
    let erosNumber: number
    let erosId: string
    
    if (releaseId.match(/^ARES\d{3}$/i)) {
      // New format: ARES001, ARES002, etc.
      erosNumber = parseInt(releaseId.replace(/^ARES/i, ''), 10)
      erosId = releaseId.toUpperCase()
      console.log(`✅ ARES number extracted from release ID: ${erosId} (number: ${erosNumber})`)
    } else {
      // Fallback for old format: get next available number
      console.log(`⚠️ Release ID "${releaseId}" doesn't match ARES format, getting next available number`)
      const { getNextEROSNumber } = await import('./ens')
      erosNumber = await getNextEROSNumber()
      erosId = formatEROSNumber(erosNumber)
      console.log(`✅ ARES number assigned: ${erosId}`)
    }
    
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
        console.log(`✅ Basenames registration prepared`)
        const parentDomain = process.env.ENS_DOMAIN || 'scenius.basetest.eth'
        console.log(`   Subname: ${ensResult.subnameLabel}.${parentDomain}`)
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

