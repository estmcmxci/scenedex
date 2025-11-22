import {
  verifyCuratorSignature,
  isSafeMember,
  getApprovalThreshold,
  getSafeAddress,
} from './safe'

/**
 * Test Safe Service Functions
 * Run with: npm test lib/services/safe.test.ts
 * Or: npx ts-node lib/services/safe.test.ts
 */

async function runTests() {
  console.log('🧪 Starting Safe Service Tests...\n')

  try {
    // Test 1: Get Safe address from database
    console.log('📋 Test 1: Getting Safe address from database...')
    const safeAddress = await getSafeAddress()
    console.log(`✅ Safe Address: ${safeAddress}\n`)

    // Test 2: Get threshold
    console.log('📋 Test 2: Getting approval threshold...')
    const threshold = await getApprovalThreshold(safeAddress)
    console.log(`✅ Threshold: ${threshold} (required approvals)\n`)

    // Test 3: Check Safe membership
    console.log('📋 Test 3: Checking Safe membership...')
    const curatorAddress = '0xf2fa1E8e06641C76Cfe2854c1e4D932a8b6e29fD'
    const isMember = await isSafeMember(curatorAddress, safeAddress)
    console.log(`✅ Is ${curatorAddress} a Safe member? ${isMember}\n`)

    // Test 4: Verify signature
    console.log('📋 Test 4: Testing signature verification...')
    const releaseId = 'TEST-001'
    const testSignature = '0x1234567890abcdef'

    const sigResult = verifyCuratorSignature(releaseId, testSignature)
    console.log(
      `✅ Signature test result: success=${sigResult.success}, error=${sigResult.error}\n`
    )

    console.log('✨ All tests completed!')
  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

// Run tests
runTests()

