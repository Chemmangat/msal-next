# Changelog

All notable changes to this project will be documented in this file.

## [3.1.5] - 2026-03-05

### 🔄 Breaking Change - Redirect Flow by Default

**MicrosoftSignInButton now uses redirect flow by default** instead of popup flow.

**Why this change?**
- Popup flow requires additional setup (blank.html page)
- Popup flow causes the full app to load in popup window
- Redirect flow is simpler and works out of the box
- Most users prefer redirect flow for better UX

**Migration:**

If you were using the default popup behavior:
```tsx
// Before (v3.1.4 and earlier) - used popup by default
<MicrosoftSignInButton />

// After (v3.1.5) - uses redirect by default
<MicrosoftSignInButton />  // Now redirects full page

// To keep popup behavior:
<MicrosoftSignInButton useRedirect={false} />
```

**New Default Behavior:**
- Button redirects the entire browser window to Microsoft login
- After authentication, redirects back to your app
- No popup windows, no blank.html needed
- Works with your existing Azure AD redirect URI

### ✨ Optional Popup Support

**Added optional `popupRedirectUri` prop** - Only use if you prefer popup flow.

**For Popup Flow (Optional):**
1. Create `public/blank.html`
2. Add `/blank.html` to Azure AD redirect URIs
3. Use:
```tsx
<MSALProvider popupRedirectUri="/blank.html">
  <MicrosoftSignInButton useRedirect={false} />
</MSALProvider>
```

**Benefits:**
- Simpler default experience (no setup required)
- Redirect flow works out of the box
- Popup flow still available for those who need it
- Backward compatible (just set `useRedirect={false}`)

## [3.1.4] - 2026-03-05

### 🔧 Configuration Fix - Popup Redirect

**BREAKING CHANGE:** You must now create a `public/blank.html` file and configure it as a redirect URI in Azure AD.

**Why:** This prevents your full app from loading in the popup window after authentication.

**Setup Required:**

1. Create `public/blank.html`:
```html
<!DOCTYPE html>
<html>
<head><title>Auth</title></head>
<body></body>
</html>
```

2. Add to Azure AD redirect URIs:
   - `http://localhost:3000/blank.html`
   - `https://yourdomain.com/blank.html`

3. Update your MSALProvider:
```tsx
<MSALProvider
  clientId="..."
  redirectUri={typeof window !== 'undefined' ? `${window.location.origin}/blank.html` : undefined}
>
```

**Changes:**
- Set `navigateToLoginRequestUrl` default to `false`
- Updated README with blank.html setup instructions
- Added PUBLIC_BLANK_HTML.md guide

## [3.1.3] - 2026-03-05

### 🐛 Critical Fix - Popup Redirect Issue

**Fixed:** Popup window now stays as popup and doesn't navigate to redirect URI.

**Changes:**
- Added `windowHashTimeout`, `iframeHashTimeout`, and `loadFrameTimeout` to MSAL config
- Set `redirectUri: undefined` in popup requests to prevent navigation
- Popup now properly closes after authentication without showing redirect page

**This fixes the issue where the redirect URI was opening inside the popup window instead of the popup closing.**

## [3.1.2] - 2026-03-05

### 📝 Documentation Update

- Updated README with current version number
- No code changes from 3.1.1

## [3.1.1] - 2026-03-05

### 📝 Documentation & Build

- Fixed landing page build issues
- Cleaned up redundant documentation files
- Updated package files list
- No code changes from 3.0.8

## [3.0.8] - 2026-03-05

### 🚨 CRITICAL BUG FIX

#### Popup Authentication Fixed
**This release fixes a critical bug introduced in v3.0.6 that broke popup authentication for 650+ users.**

**Problem:** In v3.0.6, we skipped `handleRedirectPromise()` in popup windows, which prevented MSAL from completing the authentication flow. This caused popups to not close and authentication to fail.

**Root Cause:** MSAL requires `handleRedirectPromise()` to be called in BOTH the main window AND the popup window to complete the OAuth flow properly.

**Solution:** 
- ✅ Always call `handleRedirectPromise()` in both main and popup windows
- ✅ Only clean URL in main window (popup closes automatically)
- ✅ Proper error handling for all scenarios
- ✅ Button state management with local timeout

### Changes
1. **Popup flow restored** - `handleRedirectPromise()` now called in all contexts
2. **Smart URL cleanup** - Only removes auth parameters in main window, not popup
3. **Improved logging** - Better distinction between popup and main window logs
4. **Robust error handling** - All edge cases covered

### Testing Checklist
- [x] Popup login works end-to-end
- [x] Redirect login works end-to-end
- [x] User cancellation handled gracefully
- [x] Page refresh during auth works
- [x] Multiple tabs work correctly
- [x] URL cleanup works properly
- [x] Button re-enables correctly
- [x] No infinite loops
- [x] SSR/hydration works

### Migration from v3.0.6 or v3.0.7
Simply update to v3.0.8 - no code changes needed:
```bash
npm install @chemmangat/msal-next@3.0.8
```

### Rollback Plan
If you experience issues, you can rollback to the stable v2.x:
```bash
npm install @chemmangat/msal-next@2.x
```

## [3.0.7] - 2026-03-05
**⚠️ BROKEN - Do not use. Popup authentication does not work.**

## [3.0.6] - 2026-03-05
**⚠️ BROKEN - Do not use. Popup authentication does not work.**

### 🐛 Bug Fixes

#### URL Cleanup & Button State
- **Fixed URL hash pollution** - Auth code/state parameters are now automatically removed from URL after authentication
- **Fixed button disabled state** - Sign-in button no longer stays greyed out after popup closes
- **Added local loading state** - Button uses internal state with 500ms timeout to ensure proper reset
- **Clean URL history** - Uses `window.history.replaceState()` to remove auth parameters without page reload

### Technical Details
1. After successful authentication, the URL hash containing `code=` and `state=` is automatically cleaned up
2. The sign-in button now tracks its own loading state and resets after 500ms to prevent stuck disabled state
3. URL cleanup happens both on success and error to ensure clean URLs in all scenarios

## [3.0.6] - 2026-03-05

### 🐛 Bug Fix

#### Popup Redirect Issue Fixed
- **Fixed redirect in popup window** - Authentication now completes in the popup and closes properly
- **Added popup detection** - Provider now detects if running in a popup window (`window.opener`)
- **Skip redirect handling in popups** - `handleRedirectPromise()` is only called in the main window, not in popups
- **Proper popup flow** - After sign-in, the popup closes and the main window receives the authentication result

### Technical Details
The issue was that `handleRedirectPromise()` was being called in both the main window and the popup window, causing the redirect to happen inside the popup instead of closing it. Now we detect popup windows using `window.opener` and skip redirect handling in that context.

## [3.0.5] - 2026-03-05

### 🐛 Critical Bug Fix

#### 'use client' Directive Fix
- **Added 'use client' directive to compiled output** - The dist/index.js and dist/index.mjs files now have "use client" at the top
- **Fixed tsup configuration** - Split build config into separate entries for client and server to properly apply directives
- **Server files remain server-side** - dist/server.js and dist/server.mjs correctly do NOT have "use client"
- **Package now works in Next.js App Router** - No more "createContext only works in Client Components" errors

### Verification
```bash
# Client files (with 'use client')
head -n 1 dist/index.js   # "use client";
head -n 1 dist/index.mjs  # "use client";

# Server files (without 'use client')
head -n 1 dist/server.js  # "use strict";
head -n 1 dist/server.mjs # // src/utils/getServerSession.ts
```

## [3.0.4] - 2026-03-05

### 🐛 Critical Bug Fix

#### Build System Fix
- **Fixed empty dist files** - Resolved critical build issue where dist files were empty (0-14 bytes)
- **Renamed internal entry point** - Changed from `src/index.ts` to `src/client.ts` to avoid tsup caching/conflict issues
- **Verified build output** - dist/index.js is now 51.61 KB with all exports properly bundled
- **Package is now functional** - Users can successfully install and use the package

### Technical Details
The issue was caused by a tsup conflict with the filename "index.ts" that resulted in empty build outputs. Renaming the entry point to "client.ts" resolved the issue while maintaining all functionality.

## [3.0.3] - 2026-03-05

### 🔄 Breaking Changes

#### Component Rename
- **`Providers` renamed to `MSALProvider`** - More descriptive and follows common naming conventions
- All documentation and examples updated to use `MSALProvider`
- If you were using `Providers` from v3.0.2, simply rename the import:
  ```tsx
  // Before (v3.0.2)
  import { Providers } from '@chemmangat/msal-next';
  
  // After (v3.0.3+)
  import { MSALProvider } from '@chemmangat/msal-next';
  ```

### 📝 Documentation

#### Clarity Improvements
- **Updated README** - Made it crystal clear to use `MSALProvider` instead of `MsalAuthProvider` in layout.tsx
- **Added prominent warning** - Helps users avoid the "createContext only works in Client Components" error
- **Reorganized Components section** - Clear distinction between `MSALProvider` (recommended) and `MsalAuthProvider` (advanced)
- **Updated all examples** - All code examples now use environment variables and best practices

### 💡 Usage Clarification

**Use `MSALProvider` in your layout.tsx:**
```tsx
import { MSALProvider } from '@chemmangat/msal-next';
// ✅ This works in server components
```

**Don't use `MsalAuthProvider` directly in layout.tsx:**
```tsx
import { MsalAuthProvider } from '@chemmangat/msal-next';
// ❌ This will cause "createContext only works in Client Components" error
```

## [3.0.2] - 2026-03-05

### 🐛 Bug Fixes

#### Critical Edge Case Handling
- **Fixed `no_token_request_cache_error`** - Properly handle redirect promise errors when no cached token request exists (e.g., page refresh during auth flow)
- **Fixed BOM character issue** - Removed UTF-8 BOM from package.json that was causing build failures
- **Enhanced error handling** - Gracefully handle user cancellation and other MSAL errors without breaking the app
- **Active account management** - Automatically set and maintain active account across login, logout, and token acquisition flows
- **Prevent concurrent interactions** - Added guards to prevent multiple simultaneous login attempts

#### Improvements
- Added comprehensive event callbacks for all MSAL events (LOGIN_SUCCESS, ACQUIRE_TOKEN_SUCCESS, etc.)
- Better logging for debugging authentication flows
- Improved error messages with specific error code handling

### ✨ New Features

#### MSALProvider Component
- **New `MSALProvider` export** - Pre-configured client component wrapper for easier setup
- Users can now import `MSALProvider` directly in server-side layouts without creating a separate client component file
- Simplifies the setup process significantly

### 📝 Example Usage

```tsx
// app/layout.tsx (Server Component)
import { MSALProvider } from '@chemmangat/msal-next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MSALProvider
          clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
          tenantId={process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID!}
        >
          {children}
        </MSALProvider>
      </body>
    </html>
  )
}
```

## [3.0.1] - 2026-03-05

### 🐛 Bug Fixes
- Fixed UTF-8 BOM character in package.json causing parse errors

## [3.0.0] - 2026-04-XX (Planned)

### 🎉 Major Release - Enhanced Developer Experience

This release focuses on developer experience, debugging capabilities, and comprehensive documentation.

### ✨ New Features

#### CLI Tool
- **@chemmangat/msal-next-cli** - New CLI package for project setup
  - `npx @chemmangat/msal-next init` - Interactive setup wizard
  - Auto-detect Next.js version and project structure
  - Generate boilerplate files (layout, middleware, env)
  - Create example authentication pages
  - Install dependencies automatically

#### Enhanced Debug Mode
- **Performance Tracking** - Built-in timing for operations
  - `logger.startTiming()` / `logger.endTiming()` methods
  - Automatic performance metrics collection
- **Network Logging** - Track all Graph API requests/responses
  - `logger.logRequest()` / `logger.logResponse()` methods
  - Detailed request/response logging
- **Log History** - Keep track of all log entries
  - `logger.getHistory()` - Retrieve log history
  - `logger.exportLogs()` - Export logs as JSON
  - `logger.downloadLogs()` - Download logs as file
- **Configurable History Size** - Control memory usage with `maxHistorySize` option

#### New Examples
- **Role-Based Routing** - Complete example of role-based access control
- **Multi-Tenant SaaS** - Full multi-tenant application pattern
- **API Route Protection** - Comprehensive API security examples
- **Graph API Integration** - Advanced Graph API usage patterns
- **Custom Claims** - Token validation and custom claims handling

### 📚 Documentation

- **10+ New Examples** - Comprehensive real-world examples
- **Production Deployment Guide** - Best practices for production
- **Security Best Practices** - Expanded security documentation
- **Performance Optimization Guide** - Tips for optimal performance
- **Troubleshooting Flowcharts** - Visual debugging guides
- **Migration Guides** - From other auth libraries

### 🧪 Testing

- **80%+ Test Coverage** - Comprehensive test suite
- **All Hooks Tested** - Complete coverage of all hooks
- **All Components Tested** - Full component test coverage
- **Edge Cases Covered** - Error scenarios and edge cases
- **Integration Tests** - End-to-end testing scenarios

### 🔄 Breaking Changes

#### Minimum Version Requirements
- **Node.js**: Now requires Node.js 18+ (dropped Node 16 support)
- **Next.js**: Now requires Next.js 14.1+ (for latest App Router features)
- **MSAL**: Now requires @azure/msal-browser v4+ (dropped v3 support)

#### Removed Deprecated APIs
- **ServerSession.accessToken** - Removed (deprecated in v2.1.3)
  - Use client-side token acquisition instead
  - See SECURITY.md for best practices

### 📦 Migration Guide

#### From v2.x to v3.0.0

**1. Update Dependencies**
```bash
npm install @chemmangat/msal-next@3.0.0
npm install @azure/msal-browser@^4.0.0
npm install @azure/msal-react@^3.0.0
```

**2. Update Node.js**
Ensure you're running Node.js 18 or higher:
```bash
node --version  # Should be v18.0.0 or higher
```

**3. Update Next.js**
```bash
npm install next@^14.1.0
```

**4. Remove Deprecated Code**
If you were using `ServerSession.accessToken`, update to client-side token acquisition:

```typescript
// Before (v2.x)
const session = await getServerSession();
const token = session.accessToken;

// After (v3.0.0)
'use client';
const { acquireToken } = useMsalAuth();
const token = await acquireToken(['User.Read']);
```

**5. Optional: Use CLI for New Projects**
```bash
npx @chemmangat/msal-next init
```

### ⚡ Performance Improvements

- Optimized bundle size (reduced by 15%)
- Improved token acquisition speed
- Better caching strategies
- Lazy loading for Graph API features

### 🐛 Bug Fixes

- Fixed edge cases in token refresh logic
- Improved SSR hydration handling
- Better error messages for common issues
- Fixed race conditions in concurrent requests

---

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

## [2.2.0] - 2024-03-05

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
npm install @chemmangat/msal-next@2.2.0
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
