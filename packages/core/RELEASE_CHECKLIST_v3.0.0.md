# Release Checklist v3.0.0

## Pre-Release Tasks

### Code Quality
- [ ] All tests passing (`npm run test`)
- [ ] Test coverage ≥80% (`npm run test:coverage`)
- [ ] No TypeScript errors (`tsc --noEmit`)
- [ ] No linting errors (`npm run lint`)
- [ ] Bundle size check (should be <50KB gzipped)

### Documentation
- [ ] README.md updated with v3.0.0 features
- [ ] CHANGELOG.md completed with all changes
- [ ] Migration guide written and tested
- [ ] All new examples documented
- [ ] API documentation updated
- [ ] Security.md reviewed and updated

### CLI Package
- [ ] CLI package built and tested
- [ ] CLI works on Windows, macOS, Linux
- [ ] Interactive prompts work correctly
- [ ] File generation works for all scenarios
- [ ] Dependency installation works
- [ ] Error handling is robust

### Examples
- [ ] Role-based routing example tested
- [ ] Multi-tenant SaaS example tested
- [ ] All code examples in docs are working
- [ ] Example projects run without errors

### Testing
- [ ] Unit tests for all new features
- [ ] Integration tests pass
- [ ] Manual testing on sample projects
- [ ] Test on Next.js 14.1, 14.2, 15.0
- [ ] Test with MSAL v4.0, v4.1
- [ ] Test on Node 18, 20, 22

### Breaking Changes
- [ ] All breaking changes documented
- [ ] Migration guide covers all breaking changes
- [ ] Deprecated APIs removed
- [ ] Peer dependencies updated

## Release Process

### 1. Version Bump
- [ ] Update version in `packages/core/package.json` to `3.0.0`
- [ ] Update version in `packages/cli/package.json` to `3.0.0`
- [ ] Update version in CLI source code
- [ ] Commit version bump: `git commit -m "chore: bump version to 3.0.0"`

### 2. Build
- [ ] Clean build directories: `rm -rf dist`
- [ ] Build core package: `cd packages/core && npm run build`
- [ ] Build CLI package: `cd packages/cli && npm run build`
- [ ] Verify build outputs exist
- [ ] Test built packages locally

### 3. Git Tag
- [ ] Create git tag: `git tag v3.0.0`
- [ ] Push tag: `git push origin v3.0.0`
- [ ] Push commits: `git push origin main`

### 4. NPM Publish
- [ ] Login to npm: `npm login`
- [ ] Publish core: `cd packages/core && npm publish --access public`
- [ ] Publish CLI: `cd packages/cli && npm publish --access public`
- [ ] Verify packages on npmjs.com
- [ ] Test installation: `npm install @chemmangat/msal-next@3.0.0`

### 5. GitHub Release
- [ ] Create GitHub release for v3.0.0
- [ ] Copy CHANGELOG content to release notes
- [ ] Add migration guide link
- [ ] Attach any release assets
- [ ] Mark as "Latest Release"

## Post-Release Tasks

### Communication
- [ ] Announce on GitHub Discussions
- [ ] Tweet about release (if applicable)
- [ ] Update project website (if applicable)
- [ ] Post in relevant communities (Reddit, Discord, etc.)
- [ ] Email notification to subscribers (if applicable)

### Documentation Sites
- [ ] Update documentation website
- [ ] Update code examples
- [ ] Update version selectors
- [ ] Verify all links work

### Monitoring
- [ ] Monitor npm download stats
- [ ] Watch for GitHub issues
- [ ] Monitor error tracking (if set up)
- [ ] Check for security vulnerabilities

### Follow-up
- [ ] Create v3.0.1 milestone for bug fixes
- [ ] Create v3.1.0 milestone for next features
- [ ] Update roadmap
- [ ] Thank contributors

## Rollback Plan

If critical issues are discovered:

1. **Immediate Actions**
   - [ ] Deprecate v3.0.0 on npm: `npm deprecate @chemmangat/msal-next@3.0.0 "Critical bug, use v2.3.0"`
   - [ ] Create GitHub issue documenting the problem
   - [ ] Pin v2.3.0 as recommended version in README

2. **Fix and Re-release**
   - [ ] Create hotfix branch from v3.0.0 tag
   - [ ] Fix critical issues
   - [ ] Release v3.0.1 with fixes
   - [ ] Update deprecation message

## Success Criteria

- ✅ No critical bugs reported within 48 hours
- ✅ Positive community feedback
- ✅ Download count increasing
- ✅ No security vulnerabilities
- ✅ Documentation is clear and helpful
- ✅ Migration path is smooth

## Timeline

- **Week 1-2**: Code completion and testing
- **Week 3**: Documentation and examples
- **Week 4**: Beta testing with community
- **Week 5**: Final testing and polish
- **Week 6**: Release preparation
- **Week 7**: Release and monitoring

## Notes

- This is a major version release with breaking changes
- Extra care needed for migration guide
- CLI tool is new and needs thorough testing
- Monitor closely for first 2 weeks after release

---

**Release Manager**: @chemmangat  
**Target Date**: April 2026  
**Status**: Planning Phase
