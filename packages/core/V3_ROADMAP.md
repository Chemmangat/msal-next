# v3.0.0 Release Plan

## Release Date Target
Q2 2026 (March-April) - ACCELERATED

## Philosophy
Ship valuable features fast, improve quality incrementally. v3.0.0 focuses on developer experience improvements, v3.1.0 will focus on quality and testing.

## Major Features

### 1. Enhanced Debug Mode ✅ COMPLETE
- **Status**: DONE
- **Delivered**:
  - ✅ Performance timing logs
  - ✅ Network request/response logging
  - ✅ Log history tracking
  - ✅ Debug export functionality (download logs)
  - ✅ Configurable history size
  
### 2. CLI Tool for Setup 🆕 IN PROGRESS
- **Package**: `@chemmangat/msal-next-cli`
- **Status**: 80% complete
- **Features**:
  - ✅ `npx @chemmangat/msal-next init` - Interactive setup wizard
  - ✅ Auto-detect Next.js version and structure
  - ✅ Generate boilerplate files (layout, middleware, env)
  - ✅ Configure Azure AD app registration
  - ⏳ Template files (need to add)
  - ⏳ Cross-platform testing

### 3. Expanded Documentation 📚 COMPLETE
- **New Examples**:
  - ✅ Role-based routing example
  - ✅ Multi-tenant SaaS example
  - ⏳ API route protection patterns (v3.1.0)
  - ⏳ Graph API integration patterns (v3.1.0)
  - ⏳ Custom claims and token validation (v3.1.0)
- **New Guides**:
  - ✅ Migration guide (MIGRATION_GUIDE_v3.md)
  - ✅ Testing guide (TESTING_GUIDE.md)
  - ✅ Release checklist
  - ✅ Complete roadmap
  - ⏳ Production deployment checklist (v3.1.0)
  - ⏳ Performance optimization guide (v3.1.0)

### 4. Test Coverage → MOVED TO v3.1.0 🔄
- **Decision**: Move comprehensive testing to v3.1.0
- **Rationale**: Ship valuable features faster, improve quality incrementally
- **v3.0.0**: Basic smoke tests only
- **v3.1.0**: Full 80%+ coverage

## Breaking Changes

### Potential Breaking Changes for v3.0.0:
1. **Node.js version requirement**: Drop Node 16, require Node 18+
2. **Next.js version requirement**: Require Next.js 14.1+ (for latest App Router features)
3. **MSAL version requirement**: Require @azure/msal-browser v4+ (drop v3 support)
4. **Deprecated API removal**:
   - Remove `ServerSession.accessToken` (deprecated in v2.1.3)

### Migration Path:
- ✅ Comprehensive migration guide (MIGRATION_GUIDE_v3.md)
- ✅ CLI tool can help with setup
- ⏳ Automated migration tool (v3.1.0)

## New Features (Non-Breaking)

### 1. Enhanced Hooks (v3.1.0+)
- `useAuthState()` - Simplified state management hook
- `useTokenRefresh()` - Manual token refresh control
- `useMsalEvents()` - Subscribe to MSAL events
- `usePermissions()` - Check API permissions

### 2. New Components (v3.1.0+)
- `<ProtectedRoute>` - Route-level protection component
- `<RoleGate>` - Conditional rendering based on roles (✅ Example exists)
- `<DebugPanel>` - Visual debug information panel
- `<TokenStatus>` - Display token expiry and refresh status

### 3. Performance Optimizations (v3.1.0+)
- Lazy load MS Graph photo fetching
- Optimize bundle size (tree-shaking improvements)
- Add request batching for Graph API
- Implement smarter caching strategies

### 4. Developer Experience (v3.0.0)
- ✅ Better TypeScript inference
- ✅ Improved error messages
- ✅ Enhanced debug logger
- ✅ CLI tool for setup

## Implementation Phases

### Phase 1: Complete v3.0.0 (Week 1-2) - CURRENT
- [x] Enhanced debug logger
- [x] CLI package structure
- [x] Core CLI commands
- [x] Documentation
- [ ] CLI templates
- [ ] CLI cross-platform testing
- [ ] Basic smoke tests

### Phase 2: Release v3.0.0 (Week 3)
- [ ] Final CLI testing
- [ ] Build packages
- [ ] Publish to npm
- [ ] Create GitHub release
- [ ] Announcement

### Phase 3: v3.1.0 Planning (Week 4)
- [ ] Plan test coverage strategy
- [ ] Plan additional examples
- [ ] Plan performance optimizations
- [ ] Community feedback from v3.0.0

### Phase 4: v3.1.0 Development (Week 5-8)
- [ ] Achieve 80%+ test coverage
- [ ] Add 6 more examples
- [ ] Performance optimizations
- [ ] Additional components

### Phase 5: v3.1.0 Release (Week 9)
- [ ] Final testing
- [ ] Publish v3.1.0
- [ ] Update documentation

## Post-v3.0.0 (v3.1.0 - Quality & Testing Release)

### v3.1.0 Focus: Quality, Testing, and Polish
**Target**: May-June 2026 (1-2 months after v3.0.0)

#### Test Coverage (Primary Goal)
- **Target**: 80%+ coverage
- **Scope**:
  - All hooks (useMsalAuth, useGraphApi, useUserProfile, useRoles)
  - All components (AuthGuard, UserAvatar, SignOutButton, etc.)
  - Middleware (createAuthMiddleware)
  - Server utilities (getServerSession)
  - Error scenarios and edge cases
  - Integration tests

#### Additional Examples
- API route protection patterns
- Graph API integration patterns
- Custom claims and token validation
- Offline/PWA support
- Mobile app integration
- B2C authentication

#### Performance & Optimization
- Bundle size optimization
- Performance benchmarking
- Lazy loading improvements
- Caching strategy improvements

#### Additional Features
- `useAuthState()` hook
- `useTokenRefresh()` hook
- `<DebugPanel>` component
- `<TokenStatus>` component
- Automated migration tool

### v3.2.0+ (Future Considerations)
- **Storybook Integration**: Separate package for component showcase
- **E2E Test Suite**: Playwright-based integration tests
- **Performance Monitoring**: Built-in analytics and monitoring
- **Advanced Features**:
  - Conditional Access support
  - Certificate-based authentication
  - B2C support improvements
  - Custom identity providers

## Success Metrics

### v3.0.0 Success Criteria
- ✅ Enhanced debug logger shipped
- ✅ CLI tool functional
- ⬆️ 2+ comprehensive examples
- 📚 Complete documentation
- 📦 <50KB bundle size (gzipped)
- ⚡ <100ms initialization time
- 🎯 <5 open critical bugs
- ⭐ Positive community feedback

### v3.1.0 Success Criteria
- ⬆️ 80%+ test coverage
- 📚 10+ comprehensive examples
- ⚡ Performance improvements documented
- 🔒 Security audit completed
- 🎯 All v3.0.0 bugs resolved

## Resources Needed

### v3.0.0 (Weeks 1-3)
- Development time: ~3 weeks
- Focus: CLI completion and release

### v3.1.0 (Weeks 4-9)
- Development time: ~6 weeks
- Beta testers: 5-10 developers
- Focus: Quality, testing, examples

---

**Status**: v3.0.0 Active Development  
**Last Updated**: March 5, 2026  
**Owner**: @chemmangat

## Version Strategy

### v3.0.0 - "Developer Experience" (March-April 2026)
**Theme**: Ship fast, improve DX
- Enhanced debugging
- CLI tool
- Better documentation
- Basic stability

### v3.1.0 - "Quality & Testing" (May-June 2026)
**Theme**: Production hardening
- Comprehensive test coverage
- More examples
- Performance optimization
- Security audit

### v3.2.0+ - "Advanced Features" (Q3 2026+)
**Theme**: Enterprise features
- Storybook
- E2E tests
- Advanced auth patterns
- Monitoring
