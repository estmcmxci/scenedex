# Security Alert: Shai-Hulud 2.0 Supply Chain Attack

## Impact Assessment

### Affected Package in Our Codebase
- **Package**: `@ensdomains/ensjs@4.0.2`
- **Status**: ⚠️ **POTENTIALLY AFFECTED** - Listed in compromised packages
- **Usage**: ✅ **NOT USED** - Not imported anywhere in codebase
- **Risk Level**: **LOW-MEDIUM** - Dependency present but unused

### ENS Team Response (Updated)
- ✅ ENS has updated all latest tags on npm
- ✅ ENS is proceeding with key rotations
- ✅ ENS is unpublishing impacted versions
- ✅ ENS Labs-operated websites show no signs of impact
- ⚠️ **Still recommend removal** - Package not needed (migrating to Basenames)

### Attack Details
According to [Wiz Research](https://www.wiz.io/blog/shai-hulud-2-0-ongoing-supply-chain-attack):
- **Timeline**: Packages uploaded Nov 21-23, 2025
- **Execution**: Malicious code runs during `preinstall` phase
- **Targets**: Developer secrets, CI/CD credentials, cloud credentials
- **Exfiltration**: Secrets sent to GitHub repositories

### Our Risk Exposure

**High Risk:**
1. **CURATOR_PRIVATE_KEY** in `.env.local` - Could be exfiltrated
2. **SAFE_API_KEY** - GitHub secrets could be stolen
3. **Database credentials** - DATABASE_URL contains sensitive info
4. **Cloud credentials** - If any AWS/Azure/GCP keys are in env

**Medium Risk:**
1. Package installed but not used - Still executes lifecycle scripts
2. CI/CD environments - If running `npm install` in pipelines
3. Development machines - Anyone who ran `npm install` recently

**Low Risk:**
1. Package not imported - No runtime exposure
2. Basenames migration - We're moving away from ENS anyway

## Immediate Actions Required

### 1. Remove Compromised Package (Recommended)
Since we're migrating to Basenames and not using `@ensdomains/ensjs`:
```bash
npm uninstall @ensdomains/ensjs
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Note**: ENS has updated npm tags, but since we're not using this package anyway (migrating to Basenames), removal is still recommended.

### 2. Rotate All Credentials (Precautionary)
**LOW PRIORITY - Test credentials only:**
- [ ] Rotate `CURATOR_PRIVATE_KEY` (generate new wallet) - **LOW PRIORITY** (test credentials, no assets)
- [ ] Rotate `SAFE_API_KEY` (regenerate in Safe dashboard) - **LOW PRIORITY**
- [ ] Rotate database credentials (change DATABASE_URL password) - **LOW PRIORITY** (test database)
- [ ] Check for any cloud provider keys and rotate them
- [ ] Rotate GitHub Personal Access Tokens (if any)

**Rationale**: Since these are test credentials with no assets (only ENS name), the risk is minimal. Rotate when convenient, not urgent. Main concern is the ENS name (`scenius.basetest.eth`) - ensure it's still under your control.

### 3. Audit GitHub Repositories
- [ ] Search for repositories with "Shai-Hulud" in description
- [ ] Check for unauthorized workflows (`.github/workflows/`)
- [ ] Review recent commits for suspicious activity
- [ ] Check for `discussion.yaml` or `formatter_*.yml` workflows

### 4. Audit CI/CD Pipelines
- [ ] Review GitHub Actions workflows
- [ ] Check for unauthorized self-hosted runners named "SHA1HULUD"
- [ ] Review artifact uploads/downloads
- [ ] Check for suspicious environment variable access

### 5. Harden Development Environment
- [ ] Clear npm cache: `npm cache clean --force`
- [ ] Review `package-lock.json` for suspicious packages
- [ ] Check for lifecycle scripts in installed packages
- [ ] Consider disabling lifecycle scripts in CI/CD

## Long-Term Recommendations

1. **Remove Unused Dependencies**: Clean up `package.json` regularly
2. **Pin Dependencies**: Use exact versions instead of `^` ranges
3. **Audit Regularly**: Run `npm audit` and review dependencies
4. **Lifecycle Script Restrictions**: Disable `preinstall`/`postinstall` in CI/CD
5. **Secret Management**: Use proper secret management (not `.env.local` in production)

## Verification Steps

After cleanup, verify:
```bash
# Check if package is still installed
npm list @ensdomains/ensjs

# Should return: (empty) if removed successfully
```

## Status
- [x] Package removed (removed @ensdomains/ensjs, reinstalled safe version 4.2.0)
- [ ] Credentials rotated (LOW PRIORITY - test credentials only, no assets)
- [x] GitHub audited (local repo clean, no malicious workflows found)
- [ ] CI/CD audited (check GitHub directly for repos/runners)
- [x] Development environment cleaned (npm cache cleared)

## Updates
- **2025-01-22**: ENS team has updated npm tags and is unpublishing impacted versions. ENS Labs sites show no impact. Still recommend removal and credential rotation as precaution.

**Last Updated**: 2025-01-22

