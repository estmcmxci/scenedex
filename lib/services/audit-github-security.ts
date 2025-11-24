/**
 * GitHub Security Audit Script
 * 
 * Checks for signs of Shai-Hulud 2.0 compromise:
 * - Suspicious repositories
 * - Unauthorized workflows
 * - Malicious GitHub Actions
 * - Suspicious commits
 * 
 * Usage:
 *   npx tsx lib/services/audit-github-security.ts
 * 
 * Note: This script provides manual checks - you'll need to verify on GitHub
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

console.log('\n🔍 GITHUB SECURITY AUDIT - Shai-Hulud 2.0');
console.log('================================================\n');

console.log('📋 MANUAL CHECKS TO PERFORM:\n');

console.log('1️⃣  CHECK FOR SUSPICIOUS REPOSITORIES');
console.log('   Go to: https://github.com/settings/repositories');
console.log('   Look for:');
console.log('   - Repositories with "Shai-Hulud" or "SHA1HULUD" in description');
console.log('   - Repositories you didn\'t create');
console.log('   - Repositories created between Nov 21-23, 2025');
console.log('   - Repositories with suspicious names\n');

console.log('2️⃣  CHECK GITHUB ACTIONS WORKFLOWS');
console.log('   In each repository, check: .github/workflows/');
console.log('   Look for:');
console.log('   - discussion.yaml (malicious workflow)');
console.log('   - formatter_*.yml (exfiltration workflow)');
console.log('   - Any workflow with "SHA1HULUD" or "Shai-Hulud" references');
console.log('   - Workflows that run on "self-hosted" runners\n');

console.log('3️⃣  CHECK FOR SELF-HOSTED RUNNERS');
console.log('   Go to: https://github.com/settings/actions/runners');
console.log('   Look for:');
console.log('   - Runner named "SHA1HULUD"');
console.log('   - Unauthorized self-hosted runners');
console.log('   - Runners you didn\'t create\n');

console.log('4️⃣  CHECK RECENT COMMITS');
console.log('   In each repository:');
console.log('   - Review commits from Nov 21-23, 2025');
console.log('   - Look for commits adding workflows');
console.log('   - Check for commits modifying package.json/package-lock.json');
console.log('   - Verify all commits are from authorized users\n');

console.log('5️⃣  CHECK GITHUB SECRETS');
console.log('   Go to: https://github.com/settings/secrets/actions');
console.log('   Review:');
console.log('   - All secrets are legitimate');
console.log('   - No unauthorized access');
console.log('   - Consider rotating all secrets as precaution\n');

console.log('6️⃣  CHECK ARTIFACTS');
console.log('   In each repository:');
console.log('   - Go to Actions → Artifacts');
console.log('   - Look for suspicious artifact uploads/downloads');
console.log('   - Check for artifacts named "formatting" or similar\n');

console.log('7️⃣  CHECK DISCUSSIONS (if enabled)');
console.log('   In repositories:');
console.log('   - Check for suspicious discussions');
console.log('   - Look for discussions that might trigger workflows\n');

console.log('================================================\n');
console.log('📝 AUTOMATED CHECKS (if you have GitHub token):\n');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;

if (!GITHUB_TOKEN) {
  console.log('   ⚠️  No GitHub token found in environment');
  console.log('   To enable automated checks, set GITHUB_TOKEN or GITHUB_PAT in .env.local');
  console.log('   Then run this script again for automated repository scanning\n');
} else {
  console.log('   ✅ GitHub token found - would enable automated scanning');
  console.log('   (Automated scanning not implemented yet - use manual checks above)\n');
}

console.log('================================================\n');
console.log('✅ RECOMMENDED ACTIONS:\n');
console.log('1. Perform all manual checks above');
console.log('2. If you find suspicious repos: Delete them immediately');
console.log('3. If you find malicious workflows: Remove them and review commits');
console.log('4. Rotate all GitHub secrets as precaution');
console.log('5. Review npm install history: Did you run npm install Nov 21-23?');
console.log('6. If yes: Rotate CURATOR_PRIVATE_KEY and other credentials\n');

console.log('📚 Reference:');
console.log('   https://www.wiz.io/blog/shai-hulud-2-0-ongoing-supply-chain-attack\n');

