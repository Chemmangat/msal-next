# Changelog

All notable changes to this project will be documented in this file.

## [2.2.0] - 2024-03-05

### 🔒 Security Patch Release

This is a critical security update that addresses multiple vulnerabilities. **All users should upgrade immediately.**

### Security Fixes

- **CRITICAL**: Fixed JSON parsing without validation in `getServerSession` and `createAuthMiddleware` that could lead to type confusion attacks
- **HIGH**: Fixed memory leaks from unreleased blob URLs in `useUserProfile` hook
- **MEDIUM**: Fixed unbounded cache growth in `useRoles` and `useUserProfile` hooks by implementing LRU eviction with 100-entry limit
- **MEDIUM**: Fixed race conditions in token acquisition that could trigger multiple concurrent popup windows
- **MEDIUM**: Added error message sanitization to prevent information disclosure of tokens and secrets
- **MEDIUM**: Added redirect URI validation to prevent open redirect vulnerabilities

### Added

- **New Security Module** (`validation.ts`) with utilities:
  - `safeJsonParse()` - Safe JSON parsing with schema validation
  - `isValidAccountData()` - Account data structure validator
  - `sanitizeError()` - Error message sanitization to remove tokens/secrets
  - `isValidRedirectUri()` - Redirect URI validation against allowlist
  - `isValidScope()` / `validateScopes()` - Scope string validation
- **allowedRedirectUris** configuration option in `MsalAuthConfig` for redirect URI validation
- **Request deduplication** in `useMsalAuth.acquireToken()` to prevent concurrent requests
- **Proper cleanup handlers** in `useUserProfile` and `useRoles` hooks
- **Cache size limits** (100 entries) with LRU eviction strategy

### Changed

- `getServerSession()` now uses validated JSON parsing instead of raw `JSON.parse()`
- `createAuthMiddleware()` now validates session cookie data before use
- All error messages are sanitized before logging or throwing to prevent token leakage
- `useUserProfile` now properly revokes blob URLs on cleanup to prevent memory leaks
- `useRoles` and `useUserProfile` caches now have size limits and cleanup on unmount
- `useMsalAuth.acquireTokenPopup()` now prevents multiple concurrent popup requests
- Enabled minification to reduce package size by 72%

### Deprecated

- `ServerSession.accessToken` - Storing tokens in cookies is not recommended for security reasons

### Migration Guide

No breaking changes. Simply update your package:

```bash
npm install @chemmangat/msal-next@2.1.3
```

**Optional but recommended**: Add redirect URI validation:

```typescript
<MsalAuthProvider
  clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}
  allowedRedirectUris={[
    'https://myapp.com',
    'http://localhost:3000'
  ]}
>
  {children}
</MsalAuthProvider>
```

---

## [2.1.3] - 2024-03-05

### 🔒 Security Patch Release

This is a critical security update that addresses multiple vulnerabilities discovered in v2.1.1. **All users should upgrade immediately.**

### Security Fixes

- **CRITICAL**: Fixed JSON parsing without validation in `getServerSession` and `createAuthMiddleware` that could lead to type confusion attacks
- **HIGH**: Fixed memory leaks from unreleased blob URLs in `useUserProfile` hook
- **MEDIUM**: Fixed unbounded cache growth in `useRoles` and `useUserProfile` hooks by implementing LRU eviction with 100-entry limit
- **MEDIUM**: Fixed race conditions in token acquisition that could trigger multiple concurrent popup windows
- **MEDIUM**: Added error message sanitization to prevent information disclosure of tokens and secrets
- **MEDIUM**: Added redirect URI validation to prevent open redirect vulnerabilities

### Added

- **New Security Module** (`validation.ts`) with utilities:
  - `safeJsonParse()` - Safe JSON parsing with schema validation
  - `isValidAccountData()` - Account data structure validator
  - `sanitizeError()` - Error message sanitization to remove tokens/secrets
  - `isValidRedirectUri()` - Redirect URI validation against allowlist
  - `isValidScope()` / `validateScopes()` - Scope string validation
- **allowedRedirectUris** configuration option in `MsalAuthConfig` for redirect URI validation
- **Request deduplication** in `useMsalAuth.acquireToken()` to prevent concurrent requests
- **Proper cleanup handlers** in `useUserProfile` and `useRoles` hooks
- **Cache size limits** (100 entries) with LRU eviction strategy
- **SECURITY.md** file with security best practices and vulnerability reporting guidelines

### Changed

- `getServerSession()` now uses validated JSON parsing instead of raw `JSON.parse()`
- `createAuthMiddleware()` now validates session cookie data before use
- All error messages are sanitized before logging or throwing to prevent token leakage
- `useUserProfile` now properly revokes blob URLs on cleanup to prevent memory leaks
- `useRoles` and `useUserProfile` caches now have size limits and cleanup on unmount
- `useMsalAuth.acquireTokenPopup()` now prevents multiple concurrent popup requests

### Deprecated

- `ServerSession.accessToken` - Storing tokens in cookies is not recommended for security reasons (see SECURITY.md)

### Migration Guide

No breaking changes. Simply update your package:

```bash
npm install @chemmangat/msal-next@2.1.2
```

**Optional but recommended**: Add redirect URI validation:

```typescript
<MsalAuthProvider
  clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}
  allowedRedirectUris={[
    'https://myapp.com',
    'http://localhost:3000'
  ]}
>
  {children}
</MsalAuthProvider>
```

---

## [2.0.0] - 2024-02-24

### 🎉 Major Release - Production-Grade Features

This release transforms @chemmangat/msal-next into a comprehensive, production-ready authentication library with minimal boilerplate.

### ✨ New Components

- **AuthGuard** - Wrap pages/components that require auth, auto-redirects to login
- **SignOutButton** - Branded sign-out button matching SignInButton style
- **UserAvatar** - Displays user photo from MS Graph with fallback initials
- **AuthStatus** - Shows current auth state (loading/authenticated/unauthenticated)
- **ErrorBoundary** - Comprehensive error boundary for catching authentication errors

### 🪝 New Hooks

- **useGraphApi()** - Pre-configured fetch wrapper for MS Graph with auto token injection
- **useUserProfile()** - Returns user profile data with caching (5-minute cache)
- **useRoles()** - Returns user's Azure AD roles/groups with helper methods

### 🛠️ New Utilities

- **withAuth()** - HOC for protecting pages with authentication
- **getServerSession()** - Server-side session helper for App Router
- **setServerSessionCookie()** - Helper to sync auth state to server cookies
- **retryWithBackoff()** - Exponential backoff retry utility for token acquisition
- **createRetryWrapper()** - Create reusable retry wrappers for functions
- **getDebugLogger()** - Comprehensive debug logger with levels and scoping
- **createScopedLogger()** - Create loggers with custom prefixes

### 🔒 Middleware

- **createAuthMiddleware()** - Edge-compatible middleware for protecting routes
  - Support for protected routes and public-only routes
  - Custom authentication checks
  - Automatic redirects with return URLs
  - Debug mode with detailed logging

### 🎨 Developer Experience

- **Debug Mode** - Clear console logs with troubleshooting hints
- **Better Error Messages** - Descriptive errors with actionable solutions
- **TypeScript Generics** - Support for custom token claims via `CustomTokenClaims` interface
- **JSDoc Comments** - Comprehensive documentation on all exports
- **Example Code** - API route and middleware examples included

### 🏗️ Production Ready

- **Error Boundaries** - Graceful error handling with recovery options
- **Token Refresh Retry** - Exponential backoff with configurable retries
- **Multiple Account Support** - Handle multiple signed-in accounts
- **SSR/Hydration Safe** - Proper 'use client' boundaries and SSR guards
- **Caching** - Built-in caching for user profiles and roles (5-minute TTL)

### 🧪 Testing

- **Unit Tests** - Comprehensive test suite with >80% coverage target
- **Vitest Configuration** - Modern testing setup with coverage reporting
- **Test Utilities** - Mock helpers and test setup included

### 📚 Documentation

- **Comprehensive README** - Complete guide with examples for all features
- **Migration Guide** - Backward compatible with v1.x
- **TypeScript Examples** - Type-safe examples for custom claims
- **Troubleshooting Guide** - Common issues and solutions

### 🔄 Breaking Changes

None! This release is fully backward compatible with v1.x.

### 🐛 Bug Fixes

- Fixed SSR hydration issues with proper client-side guards
- Improved token refresh reliability with retry logic
- Better error handling for MS Graph photo fetch failures

### ⚡ Performance

- Added 5-minute caching for user profiles and roles
- Optimized token acquisition with silent refresh
- Reduced bundle size with tree-shakeable exports

### 📦 Dependencies

- Added `vitest` for testing
- Added `@testing-library/react` for component testing
- Updated peer dependencies to support latest MSAL versions

---

## [1.2.1] - Previous Release

Previous changelog entries...

## [1.2.0] - 2024-02-23

### Added
- **onInitialized callback** - Access MSAL instance after initialization for setting up interceptors
- **getMsalInstance() utility** - Access MSAL instance outside React components (API clients, middleware)
- **clearSession() method** - Clear MSAL cache without triggering Microsoft logout redirect
- **SSR safety guards** - Automatic detection and handling of server-side rendering
- **UseMsalAuthReturn type export** - Type interface for hook return value

### Changed
- **Peer dependencies** - Now supports both v3 and v4 of `@azure/msal-browser` and v2/v3 of `@azure/msal-react`
- **Logging behavior** - Console logs now respect `enableLogging` config (errors always log)
- Enhanced README with advanced usage examples (Axios interceptors, API clients, silent logout)
- Improved TypeScript type exports

## [1.1.0] - 2024-02-18

### Added
- **MicrosoftSignInButton** component with official Microsoft branding
  - Dark and light variants
  - Three size options (small, medium, large)
  - Popup and redirect flow support
  - Custom scopes support
  - Success/error callbacks
  - Fully customizable with className and style props
  - Loading and disabled states

### Changed
- Improved TypeScript type exports
- Enhanced documentation with button component examples

## [1.0.0] - 2024-02-18

### Added
- Initial release of `@chemmangat/msal-next`
- `MsalAuthProvider` component for Next.js App Router
- `useMsalAuth` hook with comprehensive authentication methods
- Support for popup and redirect authentication flows
- Automatic token acquisition with silent refresh
- Multi-tenant and single-tenant authentication support
- Configurable cache location (sessionStorage, localStorage, memoryStorage)
- Custom loading component support
- Debug logging support
- TypeScript support with full type definitions
- Comprehensive documentation and examples
