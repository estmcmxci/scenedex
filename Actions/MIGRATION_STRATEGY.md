# V0 UI Migration Strategy

## Current Status
- ✅ V0 prototype running successfully in `/front-end/soma`
- ✅ Backend APIs working in main app
- 🎯 Goal: Migrate V0 UI to main app directory

---

## Phase 1: Preparation & Configuration

### 1.1 Backup Current State
```bash
# Commit current state
git add .
git commit -m "Pre-migration backup: working backend + v0 prototype"
```

### 1.2 Install Missing Dependencies
Compare and install new dependencies from `/front-end/soma/package.json`:

```bash
cd /Users/oakgroup/Desktop/catalogue
npm install clsx tailwind-merge
# Install any other missing dependencies found during comparison
```

### 1.3 Update Build Configuration

**Copy Tailwind Configuration:**
```bash
# Copy PostCSS config
cp front-end/soma/postcss.config.mjs ./

# Verify Tailwind v4 is installed
npm list tailwindcss
```

**Update Global Styles:**
```bash
# Backup current globals.css
cp app/globals.css app/globals.css.backup

# Copy new globals.css with theme variables
cp front-end/soma/app/globals.css app/
```

**Test that build works:**
```bash
npm run dev
# Visit http://localhost:3000 - should still work (might look broken, that's OK for now)
```

---

## Phase 2: Component Migration

### 2.1 Copy Utility Functions
```bash
# Copy utils.ts
cp front-end/soma/lib/utils.ts lib/
```

### 2.2 Copy Shared Components
```bash
# Copy all components
cp front-end/soma/components/audio-player.tsx components/
cp front-end/soma/components/empty-state.tsx components/
cp front-end/soma/components/loading-spinner.tsx components/
cp front-end/soma/components/release-card.tsx components/
cp front-end/soma/components/status-badge.tsx components/
```

### 2.3 Verify Components
- Open each component file
- Check for import errors
- Fix any path issues (e.g., `@/` imports)

---

## Phase 3: Page Migration (One at a Time)

### Strategy: Start Simple → Complex
1. Homepage (static content)
2. Browse page (list view)
3. Release detail (dynamic route)
4. Submit page (form)
5. Curator dashboard (complex)

### 3.1 Homepage Migration

**Step 1: Backup**
```bash
cp app/page.tsx app/page.tsx.backup
```

**Step 2: Copy V0 Version**
```bash
cp front-end/soma/app/page.tsx app/
```

**Step 3: Test**
```bash
# Visit http://localhost:3000
# Should see "Music is Dead" page
```

**Step 4: Fix Issues**
- Check browser console for errors
- Fix any import path issues
- Verify all links work

**Step 5: Commit**
```bash
git add app/page.tsx
git commit -m "Migrate homepage to v0 UI"
```

### 3.2 Browse Page Migration

**Step 1: Backup**
```bash
cp app/browse/page.tsx app/browse/page.tsx.backup
```

**Step 2: Copy V0 Version**
```bash
cp front-end/soma/app/browse/page.tsx app/browse/
```

**Step 3: Wire Up API**
- Verify `/api/releases` endpoint still works
- Test that data fetches correctly
- Check that ENS names display properly

**Step 4: Test & Commit**
```bash
# Visit http://localhost:3000/browse
git add app/browse/page.tsx
git commit -m "Migrate browse page to v0 UI"
```

### 3.3 Release Detail Page Migration

**Step 1: Backup**
```bash
cp app/releases/[ensName]/page.tsx app/releases/[ensName]/page.tsx.backup
```

**Step 2: Copy V0 Version**
```bash
cp front-end/soma/app/releases/[ensName]/page.tsx app/releases/[ensName]/
```

**Step 3: Wire Up API**
- Test with existing release (e.g., soma011.scenedex.eth)
- Verify audio player works
- Check all metadata displays correctly

**Step 4: Test & Commit**
```bash
# Visit http://localhost:3000/releases/soma011.scenedex.eth
git add app/releases/[ensName]/page.tsx
git commit -m "Migrate release detail page to v0 UI"
```

### 3.4 Submit Page Migration

**Step 1: Backup & Copy**
```bash
cp app/submit/page.tsx app/submit/page.tsx.backup
cp front-end/soma/app/submit/page.tsx app/submit/
```

**Step 2: Wire Up API**
- Test form submission to `/api/submit`
- Verify file uploads work
- Check validation

**Step 3: Test & Commit**

### 3.5 Curator Dashboard Migration

**Step 1: Backup & Copy**
```bash
cp app/curator/dashboard/page.tsx app/curator/dashboard/page.tsx.backup
cp front-end/soma/app/curator/dashboard/page.tsx app/curator/dashboard/
```

**Step 2: Wire Up API**
- Connect to curator APIs
- Test Safe multisig integration
- Verify release approval flow

**Step 3: Test & Commit**

---

## Phase 4: Layout & Root Files

### 4.1 Update Root Layout

**Step 1: Backup**
```bash
cp app/layout.tsx app/layout.tsx.backup
```

**Step 2: Copy V0 Version**
```bash
cp front-end/soma/app/layout.tsx app/
```

**Step 3: Verify**
- Check font loading (JetBrains Mono)
- Verify dark theme applies globally
- Test navigation across all pages

### 4.2 Final Style Check
```bash
# Visit each page and verify:
# - Dark brutalist theme
# - Proper spacing/borders
# - Responsive design
# - Font rendering
```

---

## Phase 5: Integration Testing

### 5.1 Complete User Flows

**Test Flow 1: Browse → View Release**
1. Go to /browse
2. Click on a release
3. Verify detail page loads
4. Test audio player

**Test Flow 2: Submit Release**
1. Go to /submit
2. Fill form with test data
3. Submit
4. Verify backend processes correctly

**Test Flow 3: Curator Workflow**
1. Go to /curator/dashboard
2. View pending releases
3. Test approval/rejection
4. Verify Safe integration

### 5.2 Check All API Endpoints
- `/api/releases` - List releases
- `/api/releases/[id]` - Get release details
- `/api/submit` - Submit new release
- Any curator-specific endpoints

---

## Phase 6: Cleanup

### 6.1 Remove Prototype
```bash
# Only after EVERYTHING works!
rm -rf front-end/soma
```

### 6.2 Clean Dependencies
```bash
# Remove unused dependencies from package.json
npm prune
```

### 6.3 Final Commit
```bash
git add .
git commit -m "Complete V0 UI migration - remove prototype"
```

---

## Rollback Plan

If something breaks:

```bash
# Restore specific file
cp app/page.tsx.backup app/page.tsx

# Or restore entire app
git reset --hard HEAD~1

# Keep prototype running
cd front-end/soma && npm run dev
```

---

## Quick Commands Reference

```bash
# Start development server
npm run dev

# Check running on port 3000
curl http://localhost:3000

# View git status
git status

# Compare files
diff app/page.tsx front-end/soma/app/page.tsx
```

---

## Success Criteria

- [ ] All pages render with v0 UI
- [ ] Dark brutalist theme applied consistently
- [ ] All API integrations working
- [ ] No console errors
- [ ] Navigation works between all pages
- [ ] Forms submit correctly
- [ ] Audio player functional
- [ ] ENS integration working
- [ ] Responsive design works
- [ ] Prototype directory removed

---

## Notes

- **Don't rush**: Test after each phase
- **Commit often**: Makes rollback easier
- **Keep prototype**: Until everything works
- **Test in browser**: After every file copy
- **Check console**: For any JavaScript errors

---

## Tomorrow's First Steps

1. Open this file: `MIGRATION_STRATEGY.md`
2. Start Phase 1: Install dependencies
3. Work through phases sequentially
4. Test everything before moving to next phase

Good luck! 🚀

