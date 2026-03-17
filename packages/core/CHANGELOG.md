# Changelog

All notable changes to this project will be documented in this file.

## [5.1.0] - 2026-03-17

### ✨ New Features

#### 1. Multi-Tenant Support — `multiTenant` config

Pass a `multiTenant` object to `MSALProvider` to control which tenants can access your app:

```tsx
<MSALProvider
  clientId="..."
  multiTenant={{
    type: 'multi',           // 'single' | 'multi' | 'organizations' | 'consumers' | 'common'
    allowList: ['contoso.com', 'fabrikam.com'],
    blockList: ['competitor.com'],
    requireType: 'Member',   // block B2B guests
    requireMFA: true,
  }}
  onTenantDenied={(reason) => router.push(`/denied?reason=${reason}`)}
>
```

- `type` maps to the MSAL authority (`single` → tenant, `multi`/`common` → common, etc.)
- `allowList` / `blockList` accept tenant IDs or domain names
- `requireType: 'Member'` blocks B2B guests; `'Guest'` allows only guests
- `requireMFA` checks the `amr` claim for MFA evidence
- Tenant validation runs automatically after redirect authentication

#### 2. `useTenant()` Hook

```tsx
import { useTenant } from '@chemmangat/msal-next';

const { tenantId, tenantDomain, isGuestUser, homeTenantId, resourceTenantId, claims } = useTenant();
```

Returns tenant context for the current user including B2B guest detection.

#### 3. Per-Page Tenant Restrictions

```tsx
// app/admin/page.tsx
export const auth = {
  required: true,
  tenant: {
    allowList: ['contoso.com'],
    requireMFA: true,
  },
};
```

#### 4. Middleware Tenant Validation

```ts
// middleware.ts
export const middleware = createAuthMiddleware({
  protectedRoutes: ['/dashboard'],
  tenantConfig: { allowList: ['contoso.com'] },
  tenantDeniedPath: '/unauthorized',
});
```

#### 5. Cross-Tenant Token Acquisition

```tsx
const { acquireTokenForTenant } = useMsalAuth();
const token = await acquireTokenForTenant('target-tenant-id', ['User.Read']);
```

#### 6. `useTenantConfig()` Hook

Access the `multiTenant` config from anywhere in the component tree:

```tsx
import { useTenantConfig } from '@chemmangat/msal-next';
const config = useTenantConfig();
```

### 🔧 Internal

- `createMsalConfig` now maps `multiTenant.type` to the correct MSAL authority (takes precedence over legacy `authorityType`)
- `validateTenantAccess` utility exported for advanced use cases
- `TenantAuthConfig` type exported for per-page tenant config

---

## [5.0.0] - 2026-03-16

### ⚠️ Breaking Changes

- **Node.js 18+ required** — The CLI and codemod tools require Node.js 18 or higher.
- **CLI package renamed** — `@chemmangat/msal-next-cli` is now the canonical CLI package, invokable via `npx @chemmangat/msal-next init`.
- **Codemod is a breaking addition** — Running `npx @chemmangat/msal-next migrate` will rewrite popup API calls in your project. Review changes with `git diff` before committing.

### ✨ New Features

#### 1. Interactive CLI — `npx @chemmangat/msal-next init`
The `init` command now interactively collects all required configuration:
- Azure AD **Client ID** and **Tenant ID**
- **Authority type** (`common`, `organizations`, `consumers`, `tenant`)
- **Cache location** (`sessionStorage`, `localStorage`, `memoryStorage`)

After collecting answers it automatically:
- Creates `.env.local` with all environment variables
- Updates (or creates) `app/layout.tsx` with `MSALProvider` wired up
- Creates a starter `app/auth/page.tsx` using `useMsalAuth` and `MicrosoftSignInButton`

```bash
npx @chemmangat/msal-next init
```

#### 2. UI Component Slots — `renderAccount` prop
Both `AccountSwitcher` and `AccountList` now accept a `renderAccount` render prop that lets consumers fully customize how each account row is displayed.

```tsx
<AccountSwitcher
  renderAccount={(account, isActive) => (
    <div style={{ fontWeight: isActive ? 'bold' : 'normal' }}>
      {account.name} — {account.username}
    </div>
  )}
/>

<AccountList
  renderAccount={(account, isActive) => (
    <span>{account.name} {isActive ? '✓' : ''}</span>
  )}
/>
```

#### 3. Comprehensive Test Coverage (80%+)
Full Vitest + `@testing-library/react` test suite covering:
- All hooks: `useMsalAuth`, `useUserProfile`, `useRoles`, `useTokenRefresh`, `useMultiAccount`, `useGraphApi`
- All components: `MicrosoftSignInButton`, `SignOutButton`, `UserAvatar`, `AuthStatus`, `AuthGuard`, `AccountSwitcher`, `AccountList`

Run tests:
```bash
npm test                    # single run
npm run test:coverage       # with coverage report
```

#### 4. Codemod — `npx @chemmangat/msal-next migrate`
Scans your project and replaces deprecated popup API calls with their redirect equivalents:

| Before | After |
|--------|-------|
| `loginPopup()` | `loginRedirect()` |
| `logoutPopup()` | `logoutRedirect()` |
| `acquireTokenPopup()` | `acquireTokenRedirect()` |
| `useRedirect={false}` | *(removed)* |

Prints a summary of all files modified and occurrences replaced.

```bash
npx @chemmangat/msal-next migrate
```

### 🔄 Migration from v4.x

```bash
npm install @chemmangat/msal-next@5.0.0
```

If you have any popup API usage, run the codemod:
```bash
npx @chemmangat/msal-next migrate
git diff  # review changes
```

---

## [4.2.0] - 2026-03-08

### 🎉 Major Feature Release - Multi-Account Management

This release introduces the most requested feature: Multi-Account Management. Users can now sign in with multiple Microsoft accounts simultaneously and switch between them seamlessly.

### ✨ New Features

#### 1. Multi-Account Management 🔥
Sign in with multiple Microsoft accounts and switch between them without signing out.

**New Hook: `useMultiAccount`**
```tsx
const {
  accounts,              // All signed-in accounts
  activeAccount,         // Current active account
  hasMultipleAccounts,   // Boolean: more than one account
  switchAccount,         // Switch to different account
  addAccount,            // Sign in with another account
  removeAccount,         // Remove account from cache
  signOutAccount,        // Sign out specific account
  signOutAll,            // Sign out all accounts
} = useMultiAccount();
```

**New Component: `AccountSwitcher`**
Pre-built dropdown UI for switching accounts with three variants (default, compact, minimal).

```tsx
<AccountSwitcher
  showAvatars={true}
  maxAccounts={5}
  variant="default"
  onSwitch={(account) => console.log('Switched to', account.name)}
/>
```

**New Component: `AccountList`**
Display all accounts in a list format with vertical or horizontal layouts.

```tsx
<AccountList
  showAvatars={true}
  showDetails={true}
  clickToSwitch={true}
  orientation="vertical"
/>
```

**Use Cases:**
- Work + personal accounts
- Multiple work accounts (IT admins, consultants)
- Multi-tenant SaaS applications
- Testing different roles/permissions

**Complete Examples:**
- 5 real-world examples in `examples/multi-account-example.tsx`
- Header with account switcher
- Account management page
- Programmatic account switching

### 🐛 Bug Fixes

- Fixed type error in `clearCache` API call
- Removed unused variable in `AccountList` component
- Improved error handling for account operations

### 📚 Documentation

- Added multi-account section to README
- Created comprehensive examples file with 5 scenarios
- Updated API reference with new exports
- Added TypeScript type exports for all new components

### 🔄 Migration

No breaking changes! Simply update to v4.2.0:
```bash
npm install @chemmangat/msal-next@4.2.0
```

All existing code continues to work. Multi-account features are opt-in.

---

## [4.1.0] - 2026-03-07

### 🎉 Major Release - Documentation Overhaul + Production Features

This release combines a complete documentation restructure with two highly-requested production features.

### ✨ New Features

#### 1. Fixed 'use client' Directive in Built Files 🔧
Resolved the issue where importing MSALProvider in layout.tsx required adding 'use client' to the layout file.

**What Changed:**
- Added 'use client' directive to the top of all built dist files
- Updated tsup build configuration to preserve React directives
- Users can now import MSALProvider without needing to add 'use client' to their layout

**Before:**
```tsx
// layout.tsx - Had to add 'use client' here
'use client';

import { MSALProvider } from '@chemmangat/msal-next';
```

**After:**
```tsx
// layout.tsx - No 'use client' needed!
import { MSALProvider } from '@chemmangat/msal-next';
```

#### 2. Automatic Silent Token Refresh ⭐
Prevents unexpected logouts by automatically refreshing tokens before they expire.

```tsx
<MSALProvider
  clientId="..."
  autoRefreshToken={true}  // Enable automatic refresh
  refreshBeforeExpiry={300} // Refresh 5 min before expiry
>
  {children}
</MSALProvider>
```

**Benefits:**
- No more unexpected logouts during active sessions
- Tokens refresh silently in the background
- Configurable refresh timing
- Opt-in feature (disabled by default)
- Zero performance impact when disabled

#### 3. New useTokenRefresh Hook
Monitor token expiry and show warnings to users.

```tsx
const { expiresIn, isExpiringSoon, refresh } = useTokenRefresh({
  refreshBeforeExpiry: 300,
  scopes: ['User.Read'],
});

if (isExpiringSoon) {
  return <div>⚠️ Your session will expire soon</div>;
}
```

**Use Cases:**
- Show session expiry warnings
- Manual token refresh
- Monitor token status
- Custom refresh logic

#### 4. Fixed "Interaction in Progress" Issue 🐛
Improved sign-in button state management to prevent the common "interaction already in progress" error.

**What was fixed:**
- Button now properly tracks MSAL interaction state
- Prevents multiple simultaneous login attempts
- Automatically resets state when user is authenticated
- Better cleanup on component unmount
- Safety timeout for edge cases

**Before:**
```
User clicks "Sign In" → Redirects → Returns → Clicks again → "Interaction in progress" error
```

**After:**
```
User clicks "Sign In" → Redirects → Returns → Button automatically disabled/enabled correctly
```

### 📚 Documentation Overhaul

#### Restructured README.md
- **Setup-First Approach** - Quick Start guide now appears at the top
- **Complete Setup Guide for AI Assistants** - Step-by-step instructions from A to Z
- **Clear Project Structure** - Shows exactly where files should be placed
- **Common Patterns** - Ready-to-use code examples for typical scenarios
- **Troubleshooting Checklist** - Quick diagnostic steps
- **Configuration Reference** - Complete table of all options
- **FAQ Section** - Answers to common questions

#### Better for AI Assistants
When an AI assistant is asked to "implement MSAL authentication", the README now provides:
1. Clear installation command
2. Azure AD setup steps
3. Environment variable configuration
4. Exact file structure
5. Complete code for each file
6. Common patterns
7. Troubleshooting steps

### 🔧 Improvements

- **MicrosoftSignInButton**: Better state management, prevents duplicate clicks
- **MSALProvider**: New props for automatic token refresh
- **Type Safety**: New types exported for token refresh functionality
- **Error Handling**: Better handling of interaction state

### 📦 New Exports

```typescript
// Hook
export { useTokenRefresh } from '@chemmangat/msal-next';

// Types
export type { UseTokenRefreshOptions, UseTokenRefreshReturn } from '@chemmangat/msal-next';

// MSALProvider new props
interface MsalAuthConfig {
  autoRefreshToken?: boolean;
  refreshBeforeExpiry?: number;
}
```

### 📚 New Documentation

#### SECURITY.md
Comprehensive security documentation covering:
- Security architecture and token handling
- Best practices for production deployment
- Common security mistakes to avoid
- Compliance information (GDPR, SOC 2, HIPAA)
- Security checklist for deployment
- Monitoring and incident response

#### Updated README.md
- Top features table at the beginning
- Prominent security highlights
- Clear note about 'use client' not needed in layout.tsx
- Security policy links throughout
- Enhanced setup instructions

### 🔄 Breaking Changes

**None!** This release is 100% backward compatible with v4.0.2.

### 📝 Migration from v4.0.2

No code changes required! Simply update:

```bash
npm install @chemmangat/msal-next@4.1.0
```

**Optional: Enable automatic token refresh**

```tsx
<MSALProvider
  clientId="..."
  autoRefreshToken={true}  // NEW - prevents unexpected logouts
>
  {children}
</MSALProvider>
```

### 🎯 Use Cases

**Automatic Token Refresh:**
- Long-running applications
- Apps where users stay logged in for hours
- Prevent interruptions during active work
- Background data synchronization

**Token Expiry Monitoring:**
- Show session timeout warnings
- Implement custom refresh logic
- Track authentication state
- User experience improvements

### 📊 Impact

- **Reduced Support Tickets**: Automatic refresh prevents "why was I logged out?" questions
- **Better UX**: Users stay logged in during active sessions
- **Easier Setup**: AI assistants can now implement MSAL correctly first try
- **Faster Onboarding**: Developers can set up in 5 minutes with new README

---

## [4.0.2] - 2026-03-07

### 🎉 Developer Experience Release - Better Types, Errors & Validation

This release focuses on making the package easier to use and debug with complete TypeScript types, actionable error messages, and automatic configuration validation.

### ✨ New Features

#### Complete TypeScript Types
- **Extended UserProfile interface** with ALL Microsoft Graph /me endpoint fields
  - Added: `department`, `preferredLanguage`, `employeeId`, `companyName`, `country`, `city`, `state`, `streetAddress`, `postalCode`, `usageLocation`, `manager`, `aboutMe`, `birthday`, `interests`, `skills`, `schools`, `pastProjects`, `responsibilities`, `mySite`, `faxNumber`, `accountEnabled`, `ageGroup`, `userType`, `employeeHireDate`, `employeeType`
  - Full JSDoc comments for each field
  - Generic type support: `useUserProfile<T extends UserProfile>()`
  - Extensible for custom organization fields

#### Enhanced Error Handling
- **New MsalError class** that wraps MSAL errors with actionable messages
- **Automatic error detection** for common Azure AD errors:
  - `AADSTS50011` (Redirect URI mismatch) → Step-by-step fix instructions
  - `AADSTS65001` (Consent required) → How to grant admin consent
  - `AADSTS700016` (Invalid client) → How to verify client ID
  - `AADSTS90002` (Invalid tenant) → How to fix tenant configuration
  - `user_cancelled` → Graceful handling (not a real error)
  - `no_token_request_cache_error` → Explanation and fix
  - `interaction_required` / `consent_required` → User-friendly messages
- **Colored console output** in development mode with emojis
- **Error helper methods**: `isUserCancellation()`, `requiresInteraction()`
- **Documentation links** included in error messages

#### Development Mode Configuration Validator
- **Automatic validation** of MSAL configuration in development mode
- **Detects common mistakes**:
  - Placeholder values (e.g., "your-client-id-here")
  - Missing environment variables
  - Invalid GUID format for client/tenant IDs
  - HTTP in production (should be HTTPS)
  - Invalid scope formats
- **Helpful warnings** with fix instructions and emojis (⚠️, ✓, ✗)
- **Runs once on mount** and caches results for performance
- **Zero performance impact** in production (only runs in development)

### 📚 Documentation

#### New TROUBLESHOOTING.md
- **Common Mistakes** section with before/after examples
- **Top 5 Errors** with detailed solutions:
  1. AADSTS50011 - Redirect URI mismatch
  2. AADSTS65001 - Admin consent required
  3. Missing environment variables
  4. AADSTS700016 - Invalid client
  5. AADSTS90002 - Invalid tenant
- **Configuration Issues** troubleshooting
- **Authentication Flow Issues** solutions
- **Development Tips** for debugging
- **Quick Reference** for Azure Portal tasks

#### Updated README.md
- **All code examples** now show `'use client'` FIRST
- **"What's New in v4.0.2"** section highlighting new features
- **Common Mistakes** section added
- **TypeScript examples** updated to show complete types
- **Error handling examples** with new MsalError class
- **Configuration validation** examples

### 🔧 Improvements

- **Better error messages** throughout the package
- **Improved logging** in development mode
- **Type safety** for all user profile fields
- **Automatic validation** prevents common configuration mistakes
- **Clearer documentation** with more examples

### 🐛 Bug Fixes

- Fixed missing TypeScript types for user profile fields
- Improved error handling in all authentication flows
- Better detection of user cancellation vs real errors

### 📦 Exports

New exports added:
```typescript
// Types
export type { UserProfile, UseUserProfileReturn } from '@chemmangat/msal-next';
export type { ValidationResult, ValidationWarning, ValidationError } from '@chemmangat/msal-next';

// Error handling
export { MsalError, wrapMsalError, createMissingEnvVarError } from '@chemmangat/msal-next';

// Configuration validation
export { validateConfig, displayValidationResults } from '@chemmangat/msal-next';
```

### 🔄 Breaking Changes

**None!** This release is 100% backward compatible with v4.0.1.

### 📝 Migration from v4.0.1

No code changes required! Simply update:

```bash
npm install @chemmangat/msal-next@4.0.2
```

**Optional improvements you can make:**

1. **Use complete types:**
```typescript
const { profile } = useUserProfile();
// Now has access to: department, preferredLanguage, employeeId, etc.
console.log(profile?.department);
console.log(profile?.preferredLanguage);
```

2. **Better error handling:**
```typescript
import { wrapMsalError } from '@chemmangat/msal-next';

try {
  await loginRedirect();
} catch (error) {
  const msalError = wrapMsalError(error);
  if (msalError.isUserCancellation()) {
    return; // User cancelled, ignore
  }
  console.error(msalError.toConsoleString()); // Actionable error message
}
```

3. **Manual validation (optional):**
```typescript
import { validateConfig, displayValidationResults } from '@chemmangat/msal-next';

const result = validateConfig({
  clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!,
  tenantId: process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID,
});

displayValidationResults(result);
```

### 🎯 What's Next

v4.1.0 will focus on:
- Additional Graph API helpers
- More authentication examples
- Performance optimizations
- Enhanced testing coverage

---

## [3.1.7] - 2026-03-05

### 🔄 Breaking Change - Redirect-Only Flow

**Removed all popup authentication support** - Package now only supports redirect flow for cleaner, simpler authentication.

**Why this change?**
- Popup flow had persistent issues (full app loading in popup, logout popups, etc.)
- Redirect flow is simpler, more reliable, and works out of the box
- No need for blank.html or special Azure AD configuration
- Better user experience with full-page redirects

**What was removed:**
- `loginPopup()` method
- `logoutPopup()` method  
- `acquireTokenPopup()` method
- `useRedirect` prop from MicrosoftSignInButton
- `useRedirect` prop from SignOutButton
- `popupRedirectUri` configuration option
- `getPopupRedirectUri()` utility
- All popup-related code and configuration

**Migration:**

```tsx
// Before (v3.1.4 and earlier)
const { loginPopup, logoutPopup } = useMsalAuth();
await loginPopup();
await logoutPopup();

<MicrosoftSignInButton useRedirect={false} />
<SignOutButton useRedirect={false} />

// After (v3.1.5) - redirect only
const { loginRedirect, logoutRedirect } = useMsalAuth();
await loginRedirect();
await logoutRedirect();

<MicrosoftSignInButton />
<SignOutButton />
```

**Benefits:**
- Simpler API - no popup vs redirect decisions
- No popup-related bugs or issues
- Works perfectly out of the box
- Cleaner codebase and smaller bundle size
- Better user experience

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
**This release fixes a critical bug introduced in v3.0.6 that broke popup authentication for 2,200+ users.**

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
