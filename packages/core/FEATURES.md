# @chemmangat/msal-next v2.0 - Feature Overview

## 🎯 Core Philosophy

**Minimal Setup, Maximum Power** - Just provide your `clientId` to get started, with full customization available when needed.

## 📦 What's Included

### Components (6)

1. **MsalAuthProvider** - Root provider for MSAL initialization
   - SSR-safe with proper hydration handling
   - Automatic redirect handling
   - Event callbacks for auth lifecycle
   - Debug mode with detailed logging

2. **MicrosoftSignInButton** - Pre-styled sign-in button
   - Microsoft branding (dark/light variants)
   - Three sizes (small/medium/large)
   - Popup or redirect flow
   - Success/error callbacks

3. **SignOutButton** - Matching sign-out button
   - Same styling as sign-in button
   - Popup or redirect flow
   - Success/error callbacks

4. **AuthGuard** - Protect pages/components
   - Auto-redirect to login
   - Custom loading/fallback components
   - Configurable scopes
   - Auth required callback

5. **UserAvatar** - Display user photo
   - Fetches from MS Graph
   - Fallback to initials
   - Customizable size
   - Tooltip with username

6. **AuthStatus** - Show auth state
   - Visual indicators (loading/authenticated/unauthenticated)
   - Optional username display
   - Custom render functions

7. **ErrorBoundary** - Catch auth errors
   - Graceful error handling
   - Custom fallback UI
   - Error callbacks
   - Reset functionality

### Hooks (4)

1. **useMsalAuth()** - Main authentication hook
   - Login (popup/redirect)
   - Logout (popup/redirect)
   - Token acquisition (silent/popup/redirect)
   - Account management
   - Progress tracking

2. **useGraphApi()** - MS Graph API wrapper
   - Pre-configured fetch with auto token injection
   - REST methods (GET/POST/PUT/PATCH/DELETE)
   - Custom request builder
   - Automatic error handling
   - Configurable scopes per request

3. **useUserProfile()** - User profile data
   - Fetches from MS Graph
   - 5-minute caching
   - Includes photo URL
   - Refetch capability
   - Cache clearing

4. **useRoles()** - Azure AD roles/groups
   - Extracts roles from token claims
   - Fetches groups from MS Graph
   - Helper methods (hasRole, hasAnyRole, hasAllRoles)
   - 5-minute caching
   - Refetch capability

### Utilities (7)

1. **createMsalConfig()** - Config builder
   - Minimal input required
   - Sensible defaults
   - Full customization support
   - Authority URL builder

2. **withAuth()** - HOC for protection
   - Wrap any component
   - Configurable options
   - Type-safe
   - Display name preservation

3. **getServerSession()** - Server-side helper
   - Read session from cookies
   - Works in Server Components
   - Works in Route Handlers
   - Type-safe session object

4. **setServerSessionCookie()** - Session sync
   - Sync auth state to server
   - Called from client after login
   - Enables server-side auth checks

5. **retryWithBackoff()** - Retry utility
   - Exponential backoff
   - Configurable retries
   - Smart error detection
   - Debug logging

6. **createRetryWrapper()** - Retry wrapper factory
   - Create reusable retry functions
   - Preserves function signature
   - Configurable options

7. **getDebugLogger()** - Debug logger
   - Multiple log levels
   - Scoped loggers
   - Timestamp support
   - Conditional logging

### Middleware (1)

1. **createAuthMiddleware()** - Edge middleware
   - Protect routes at the edge
   - Public-only routes
   - Custom auth checks
   - Automatic redirects
   - Return URL support
   - Debug mode

## 🎨 Developer Experience

### TypeScript Support
- Full type safety
- Generic support for custom claims
- Exported types for all APIs
- IntelliSense everywhere

### Debug Mode
- Detailed console logs
- Troubleshooting hints
- Request/response logging
- Error context

### Error Handling
- Descriptive error messages
- Actionable solutions
- Error boundaries
- Retry logic

### Documentation
- JSDoc comments on all exports
- Comprehensive README
- Quick start guide
- Example code
- Migration guide

## 🏗️ Production Features

### Reliability
- Token refresh retry with exponential backoff
- Comprehensive error boundaries
- Graceful degradation
- SSR/hydration safe

### Performance
- 5-minute caching for profiles/roles
- Tree-shakeable exports
- Code splitting support
- Minimal bundle size

### Security
- HttpOnly cookies for sessions
- Secure cookie flags in production
- SameSite cookie protection
- Token expiration handling

### Scalability
- Multiple account support
- Multi-tenant support
- Edge-compatible middleware
- Server-side session support

## 📊 Test Coverage

- Unit tests for all utilities
- >80% code coverage target
- Vitest test runner
- Coverage reporting

## 🔄 Backward Compatibility

v2.0 is fully backward compatible with v1.x:
- All v1.x APIs still work
- No breaking changes
- Additive features only
- Smooth migration path

## 🚀 Getting Started

```tsx
// Minimal setup - just clientId!
<MsalAuthProvider clientId="YOUR_CLIENT_ID">
  <App />
</MsalAuthProvider>
```

## 📈 What's Next?

Future enhancements being considered:
- React Server Components integration
- Streaming SSR support
- Advanced caching strategies
- Token encryption
- Session persistence
- Multi-factor auth flows
- Conditional access policies
- B2C support

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## 📄 License

MIT - See [LICENSE](../../LICENSE) for details.
