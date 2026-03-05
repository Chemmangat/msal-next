# Pre-Publish Checklist for v3.0.8

## Build Verification
- [x] `npm run build` completes successfully
- [x] dist/index.js has "use client" directive
- [x] dist/index.mjs has "use client" directive
- [x] dist/server.js does NOT have "use client"
- [x] dist/server.mjs does NOT have "use client"
- [x] File sizes are reasonable (50-55KB for index)

## Code Review
- [x] `handleRedirectPromise()` called in all windows
- [x] URL cleanup only in main window
- [x] Popup detection logic correct
- [x] Error handling comprehensive
- [x] Button state management robust
- [x] No console errors in code

## Documentation
- [x] CHANGELOG.md updated
- [x] Version bumped to 3.0.8
- [x] RELEASE_NOTES_v3.0.8.md created
- [x] CRITICAL_FIXES_v3.0.8.md created
- [x] TEST_SCENARIOS.md created
- [x] README.md still accurate

## Testing (Manual)
Before publishing, test these scenarios:

### Popup Flow
- [ ] Click sign-in button
- [ ] Popup opens
- [ ] Sign in with Microsoft account
- [ ] Popup closes automatically
- [ ] Main window shows logged in state
- [ ] URL is clean (no #code=...)
- [ ] Button is enabled

### Redirect Flow
- [ ] Click sign-in with redirect
- [ ] Redirect to Microsoft
- [ ] Sign in
- [ ] Redirect back to app
- [ ] URL is cleaned
- [ ] User is logged in

### Error Cases
- [ ] Close popup without signing in → button re-enables
- [ ] Refresh page during auth → no errors
- [ ] Open in new tab → auth state syncs

### Edge Cases
- [ ] Multiple rapid clicks → only one popup
- [ ] Popup blocked → proper error
- [ ] Network error → proper error

## Pre-Publish Commands
```bash
# Clean build
rm -rf dist
npm run build

# Verify build output
ls -lh dist/
head -n 1 dist/index.js  # Should show "use client";
head -n 1 dist/server.js # Should NOT show "use client";

# Test locally
npm pack
# Install in test project and verify
```

## Publish Commands
```bash
# Publish to npm
npm publish

# Tag release on GitHub
git tag v3.0.8
git push origin v3.0.8

# Create GitHub release with RELEASE_NOTES_v3.0.8.md
```

## Post-Publish
- [ ] Verify package on npmjs.com
- [ ] Test installation in fresh project
- [ ] Monitor for error reports
- [ ] Update documentation site if applicable
- [ ] Announce on relevant channels

## Rollback Plan
If critical issues are found:
```bash
# Deprecate broken version
npm deprecate @chemmangat/msal-next@3.0.8 "Critical bug, use 3.0.9 or 2.x"

# Publish hotfix as 3.0.9
```
