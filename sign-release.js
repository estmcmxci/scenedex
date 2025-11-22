const ethers = require('ethers');

// Configuration
const PRIVATE_KEY = process.argv[2];
const RELEASE_ID = process.argv[3] || 'TEST-REL-001';

if (!PRIVATE_KEY) {
  console.error('Usage: node sign-release.js <PRIVATE_KEY> [RELEASE_ID]');
  process.exit(1);
}

try {
  // Create wallet from private key
  const wallet = new ethers.Wallet(PRIVATE_KEY);
  
  // Create message hash (same format as endpoint expects)
  const messageHash = ethers.solidityPackedKeccak256(
    ['string', 'string'],
    ['RELEASE_APPROVAL', RELEASE_ID]
  );
  
  // Sign the message
  const signature = wallet.signMessageSync(ethers.getBytes(messageHash));
  
  console.log('✅ Signature generated successfully!');
  console.log('Release ID:', RELEASE_ID);
  console.log('Wallet Address:', wallet.address);
  console.log('Signature:', signature);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
