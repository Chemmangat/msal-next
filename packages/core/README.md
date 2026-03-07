# @chemmangat/msal-next

Production-grade MSAL authentication library for Next.js App Router with minimal boilerplate.

[![npm version](https://badge.fury.io/js/@chemmangat%2Fmsal-next.svg)](https://www.npmjs.com/package/@chemmangat/msal-next)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **📦 Current Version: 4.0.2** - Enhanced Developer Experience with Complete Types & Better Errors!

> **🚀 What's New in v4.0.2:** Complete TypeScript types for user profiles, actionable error messages with fix instructions, and automatic configuration validation in development mode!

## 🎉 What's New in v4.0.2

### Complete TypeScript Types
```tsx
const { profile } = useUserProfile();

// Now available with full type safety!
console.log(profile?.department);
console.log(profile?.preferredLanguage);
console.log(profile?.employeeId);
console.log(profile?.companyName);
console.log(profile?.country);
// ... and 20+ more fields!
```

### Actionable Error Messages
```tsx
// Before: Cryptic error
Error: AADSTS50011

// After: Helpful guidance
🚨 MSAL Authentication Error

Error: Redirect URI mismatch

💡 How to fix:
Your redirect URI doesn't match what's configured in Azure AD.

Fix:
1. Go to Azure Portal → Azure Active Directory → App registrations
2. Select your app → Authentication
3. Under "Single-page application", add your redirect URI:
   • http://localhost:3000 (for development)
   • https://yourdomain.com (for production)
4. Click "Save"

📚 Documentation: https://learn.microsoft.com/...
```

### Automatic Configuration Validation
```tsx
// Development mode automatically checks for:
⚠️  Warnings (should fix)

clientId:
  Client ID appears to be a placeholder

  Fix:
  Replace the placeholder with your actual Application (client) ID from Azure Portal.
  
  Current value: your-client-id-here
  Expected format: 12345678-1234-1234-1234-123456789012 (GUID)
```

---

## Common Mistakes (and How to Avoid Them)

### ❌ Mistake #1: 'use client' in the wrong place

```tsx
// WRONG - 'use client' must be FIRST
import { useMsalAuth } from '@chemmangat/msal-next';

'use client';  // Too late!

export default function MyComponent() {
  const { isAuthenticated } = useMsalAuth();
  // ...
}
```

```tsx
// CORRECT - 'use client' comes FIRST
'use client';

import { useMsalAuth } from '@chemmangat/msal-next';

export default function MyComponent() {
  const { isAuthenticated } = useMsalAuth();
  // ...
}
```

### ❌ Mistake #2: Using MsalAuthProvider in layout.tsx

```tsx
// WRONG - Will cause "createContext only works in Client Components" error
import { MsalAuthProvider } from '@chemmangat/msal-next';

export default function RootLayout({ children }) {
  return <MsalAuthProvider>{children}</MsalAuthProvider>;
}
```

```tsx
// CORRECT - Use MSALProvider instead
import { MSALProvider } from '@chemmangat/msal-next';

export default function RootLayout({ children }) {
  return <MSALProvider clientId="...">{children}</MSALProvider>;
}
```

### ❌ Mistake #3: Placeholder values in production

```tsx
// WRONG - Placeholder values
<MSALProvider
  clientId="your-client-id-here"
  tenantId="your-tenant-id-here"
>
```

```tsx
// CORRECT - Actual GUIDs from Azure Portal
<MSALProvider
  clientId="12345678-1234-1234-1234-123456789012"
  tenantId="87654321-4321-4321-4321-210987654321"
>
```

### ❌ Mistake #4: Missing environment variables

```tsx
// WRONG - Hardcoded values
<MSALProvider clientId="12345678-1234-1234-1234-123456789012">
```

```tsx
// CORRECT - Use environment variables
<MSALProvider
  clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
  tenantId={process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID!}
>
```

```bash
# .env.local
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=12345678-1234-1234-1234-123456789012
NEXT_PUBLIC_AZURE_AD_TENANT_ID=87654321-4321-4321-4321-210987654321
```

### ❌ Mistake #5: HTTP in production

```tsx
// WRONG - HTTP in production
redirectUri: "http://myapp.com"

// CORRECT - HTTPS in production, HTTP only for localhost
redirectUri: process.env.NODE_ENV === 'production' 
  ? "https://myapp.com" 
  : "http://localhost:3000"
```

---

## 🚀 What's New in v4.0.1

### Zero-Config Protected Routes - THE Killer Feature

Protect any route with **one line of code**. No middleware setup, no boilerplate, just export an auth config:

```tsx
// app/dashboard/page.tsx
export const auth = { required: true };

export default function Dashboard() {
  return <div>Protected content - that's it!</div>;
}
```

**Why This Changes Everything:**

| Before (v3.x) | After (v4.0) |
|---------------|--------------|
| 50+ lines of middleware | 1 line |
| Manual redirect logic | Automatic |
| Boilerplate in every page | Zero boilerplate |
| 30 min setup | 30 sec setup |

### More Examples

**Role-Based Access:**
```tsx
export const auth = {
  required: true,
  roles: ['admin', 'editor']
};
```

**Custom Validation:**
```tsx
export const auth = {
  required: true,
  validate: (account) => account.username.endsWith('@company.com')
};
```

**Custom UI:**
```tsx
export const auth = {
  required: true,
  loading: <Spinner />,
  unauthorized: <AccessDenied />
};
```

---

## Features (v4.0.1)

✨ **Zero-Config Protection** - One line to protect any route  
🎯 **Role-Based Access** - Built-in Azure AD role checking  
🔐 **Custom Validation** - Add your own auth logic  
⚡ **Automatic Redirects** - Smart return URL handling  
🎨 **Custom UI** - Override loading/unauthorized states  
📦 **TypeScript First** - Full type safety  
🚀 **Next.js 14+** - Built for App Router

---

## What's New in v3.0

### 🚀 CLI Tool (NEW)
```bash
# One command setup - that's it!
npx @chemmangat/msal-next init
```

The new CLI tool automatically:
- Detects your Next.js structure (App Router/Pages Router)
- Installs dependencies
- Creates configuration files
- Generates example pages
- Sets up middleware

**Reduces setup time from 30+ minutes to under 2 minutes!**

### 🔍 Enhanced Debug Logger (NEW)
```tsx
import { getDebugLogger } from '@chemmangat/msal-next';

const logger = getDebugLogger({
  enabled: true,
  enablePerformance: true,    // Track operation timing
  enableNetworkLogs: true,    // Log all requests/responses
});

// Performance tracking
logger.startTiming('token-acquisition');
await acquireToken(['User.Read']);
logger.endTiming('token-acquisition'); // Logs: "⏱️ Completed: token-acquisition (45ms)"

// Export logs for debugging
logger.downloadLogs('debug-logs.json');
```

### 📚 New Examples
- **Role-Based Routing** - Complete RBAC implementation
- **Multi-Tenant SaaS** - Full multi-tenant architecture

### 🔄 Breaking Changes
- Requires Node.js 18+ (was 16+)
- Requires Next.js 14.1+ (was 14.0+)
- Requires @azure/msal-browser v4+ (was v3+)
- Removed `ServerSession.accessToken` (use client-side `acquireToken()`)

[See Migration Guide](./MIGRATION_GUIDE_v3.md) for details.

## Installation

### Option 1: CLI Setup (Recommended)
```bash
# Create Next.js app
npx create-next-app@latest my-app
cd my-app

# Initialize MSAL
npx @chemmangat/msal-next init
```

### Option 2: Manual Installation
```bash
npm install @chemmangat/msal-next@latest @azure/msal-browser@^4.0.0 @azure/msal-react@^3.0.0
```

## Quick Start

> **Important:** Use `MSALProvider` (not `MsalAuthProvider`) in your layout.tsx to avoid the "createContext only works in Client Components" error.

### 1. Wrap your app with MSALProvider

```tsx
// app/layout.tsx
import { MSALProvider } from '@chemmangat/msal-next';

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
  );
}
```

### 2. Add sign-in button

```tsx
// app/page.tsx
'use client';

import { MicrosoftSignInButton, useMsalAuth } from '@chemmangat/msal-next';

export default function Home() {
  const { isAuthenticated } = useMsalAuth();

  if (isAuthenticated) {
    return <div>Welcome! You're signed in.</div>;
  }

  return <MicrosoftSignInButton />;
}
```

That's it! 🎉

The button uses redirect flow (full page redirect to Microsoft login, then back to your app). Simple and clean.

## Components

### MSALProvider (Recommended for App Router)

Pre-configured wrapper component that's already marked as `'use client'`. Use this in your server-side layout.tsx.

```tsx
// app/layout.tsx (Server Component)
import { MSALProvider } from '@chemmangat/msal-next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MSALProvider
          clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
          tenantId={process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID!}
          scopes={['User.Read', 'Mail.Read']} // Optional
          enableLogging={true} // Optional
        >
          {children}
        </MSALProvider>
      </body>
    </html>
  );
}
```

### MsalAuthProvider (Advanced Usage)

The underlying provider component. Only use this if you're creating your own client component wrapper.

```tsx
// app/providers.tsx
'use client'

import { MsalAuthProvider } from '@chemmangat/msal-next';

export function MyProviders({ children }) {
  return (
    <MsalAuthProvider
      clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
      tenantId={process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID!}
    >
      {children}
    </MsalAuthProvider>
  );
}
```

### MicrosoftSignInButton

Pre-styled sign-in button with Microsoft branding. Uses redirect flow (full page redirect to Microsoft login).

```tsx
<MicrosoftSignInButton
  variant="dark" // or "light"
  size="medium" // "small", "medium", "large"
  onSuccess={() => console.log('Signed in!')}
/>
```

### SignOutButton

Pre-styled sign-out button matching the sign-in button style.

```tsx
<SignOutButton
  variant="light"
  size="medium"
  onSuccess={() => console.log('Signed out!')}
/>
```

### AuthGuard

Protect pages/components that require authentication.

```tsx
<AuthGuard
  loadingComponent={<div>Loading...</div>}
  fallbackComponent={<div>Redirecting to login...</div>}
>
  <ProtectedContent />
</AuthGuard>
```

### UserAvatar

Display user photo from MS Graph with fallback initials.

```tsx
<UserAvatar
  size={48}
  showTooltip={true}
  fallbackImage="/default-avatar.png"
/>
```

### AuthStatus

Show current authentication state.

```tsx
<AuthStatus
  showDetails={true}
  renderAuthenticated={(username) => (
    <div>Logged in as {username}</div>
  )}
/>
```

### ErrorBoundary

Catch and handle authentication errors gracefully.

```tsx
<ErrorBoundary
  fallback={(error, reset) => (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={reset}>Try Again</button>
    </div>
  )}
>
  <App />
</ErrorBoundary>
```

## Hooks

### useMsalAuth

Main authentication hook with all auth operations.

```tsx
const {
  account,
  isAuthenticated,
  inProgress,
  loginRedirect,
  logoutRedirect,
  acquireToken,
} = useMsalAuth();

// Login (redirects to Microsoft)
await loginRedirect(['User.Read']);

// Get token
const token = await acquireToken(['User.Read']);

// Logout (redirects to Microsoft)
await logoutRedirect();
```

### useGraphApi

Pre-configured fetch wrapper for MS Graph API.

```tsx
const graph = useGraphApi();

// GET request
const user = await graph.get('/me');

// POST request
const message = await graph.post('/me/messages', {
  subject: 'Hello',
  body: { content: 'World' }
});

// Custom request
const data = await graph.request('/me/drive', {
  scopes: ['Files.Read'],
  version: 'beta'
});
```

### useUserProfile

Fetch and cache user profile from MS Graph with complete TypeScript types.

```tsx
const { profile, loading, error, refetch } = useUserProfile();

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;

return (
  <div>
    <h1>{profile.displayName}</h1>
    <p>{profile.mail}</p>
    <p>{profile.jobTitle}</p>
    <p>{profile.department}</p>
    <p>{profile.preferredLanguage}</p>
    <p>{profile.employeeId}</p>
    <p>{profile.companyName}</p>
    <p>{profile.officeLocation}</p>
  </div>
);
```

**New in v4.0.2:** Complete TypeScript types with 30+ fields from Microsoft Graph:
- `department`, `preferredLanguage`, `employeeId`, `companyName`
- `country`, `city`, `state`, `streetAddress`, `postalCode`
- `manager`, `aboutMe`, `birthday`, `interests`, `skills`
- And many more!

**Generic type support:**
```tsx
interface MyProfile extends UserProfile {
  customField: string;
}

const { profile } = useUserProfile<MyProfile>();
console.log(profile?.customField); // Type-safe!
```

### useRoles

Access user's Azure AD roles and groups.

```tsx
const { roles, groups, hasRole, hasAnyRole } = useRoles();

if (hasRole('Admin')) {
  return <AdminPanel />;
}

if (hasAnyRole(['Editor', 'Contributor'])) {
  return <EditorPanel />;
}

return <ViewerPanel />;
```

## Utilities

### withAuth

Higher-order component for protecting pages.

```tsx
const ProtectedPage = withAuth(MyPage, {
  useRedirect: true,
  scopes: ['User.Read']
});

export default ProtectedPage;
```

### getServerSession

Server-side session helper for App Router.

**Important:** Import from `@chemmangat/msal-next/server` in Server Components only.

```tsx
// app/dashboard/page.tsx
import { getServerSession } from '@chemmangat/msal-next/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session.isAuthenticated) {
    redirect('/login');
  }

  return <div>Welcome {session.username}</div>;
}
```

### createAuthMiddleware

Protect routes at the edge with middleware.

```tsx
// middleware.ts
import { createAuthMiddleware } from '@chemmangat/msal-next';

export const middleware = createAuthMiddleware({
  protectedRoutes: ['/dashboard', '/profile', '/api/protected'],
  publicOnlyRoutes: ['/login'],
  loginPath: '/login',
  debug: true,
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### Retry Logic

Built-in exponential backoff for token acquisition.

```tsx
import { retryWithBackoff, createRetryWrapper } from '@chemmangat/msal-next';

// Wrap any async function with retry logic
const token = await retryWithBackoff(
  () => acquireToken(['User.Read']),
  {
    maxRetries: 3,
    initialDelay: 1000,
    backoffMultiplier: 2,
    debug: true
  }
);

// Create a reusable retry wrapper
const acquireTokenWithRetry = createRetryWrapper(acquireToken, {
  maxRetries: 3
});
```

### Debug Logger

Comprehensive logging for troubleshooting with enhanced v3.0 features.

```tsx
import { getDebugLogger } from '@chemmangat/msal-next';

const logger = getDebugLogger({
  enabled: true,
  level: 'debug',
  showTimestamp: true,
  enablePerformance: true,    // NEW in v3.0
  enableNetworkLogs: true,    // NEW in v3.0
  maxHistorySize: 100,        // NEW in v3.0
});

// Basic logging
logger.info('User logged in', { username: 'user@example.com' });
logger.error('Authentication failed', { error });

// NEW: Performance tracking
logger.startTiming('token-acquisition');
const token = await acquireToken(['User.Read']);
logger.endTiming('token-acquisition'); // Logs duration

// NEW: Network logging
logger.logRequest('GET', '/me');
logger.logResponse('GET', '/me', 200, userData);

// NEW: Export logs
const logs = logger.exportLogs();
logger.downloadLogs('debug-logs.json'); // Download as file
```

## TypeScript Support

### Custom Token Claims

Extend the `CustomTokenClaims` interface for type-safe custom claims.

```tsx
import { CustomTokenClaims } from '@chemmangat/msal-next';

interface MyCustomClaims extends CustomTokenClaims {
  roles: string[];
  department: string;
  employeeId: string;
}

const { account } = useMsalAuth();
const claims = account?.idTokenClaims as MyCustomClaims;

console.log(claims.roles); // Type-safe!
console.log(claims.department); // Type-safe!
```

## Advanced Examples

### Multi-Tenant Support

```tsx
<MsalAuthProvider
  clientId="YOUR_CLIENT_ID"
  authorityType="common" // Supports any Azure AD tenant
>
  {children}
</MsalAuthProvider>
```

### Custom Scopes

```tsx
<MsalAuthProvider
  clientId="YOUR_CLIENT_ID"
  scopes={[
    'User.Read',
    'Mail.Read',
    'Calendars.Read',
    'Files.Read.All'
  ]}
>
  {children}
</MsalAuthProvider>
```

### Multiple Account Selection

```tsx
const { accounts, loginPopup } = useMsalAuth();

// Show account picker
await loginPopup(scopes, {
  prompt: 'select_account'
});

// List all accounts
accounts.map(account => (
  <div key={account.homeAccountId}>
    {account.username}
  </div>
));
```

### Server-Side Rendering

```tsx
// app/profile/page.tsx
import { getServerSession } from '@chemmangat/msal-next';

export default async function ProfilePage() {
  const session = await getServerSession();

  return (
    <div>
      <h1>Profile</h1>
      {session.isAuthenticated ? (
        <p>Welcome {session.username}</p>
      ) : (
        <p>Please sign in</p>
      )}
    </div>
  );
}
```

### Role-Based Access Control

```tsx
'use client';

import { useRoles, AuthGuard } from '@chemmangat/msal-next';

function AdminPanel() {
  const { hasRole, hasAnyRole, hasAllRoles } = useRoles();

  if (!hasRole('Admin')) {
    return <div>Access denied</div>;
  }

  return <div>Admin content</div>;
}

export default function AdminPage() {
  return (
    <AuthGuard>
      <AdminPanel />
    </AuthGuard>
  );
}
```

## Configuration Options

### MsalAuthConfig

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `clientId` | `string` | **Required** | Azure AD Application (client) ID |
| `tenantId` | `string` | `undefined` | Azure AD Directory (tenant) ID |
| `authorityType` | `'common' \| 'organizations' \| 'consumers' \| 'tenant'` | `'common'` | Authority type |
| `redirectUri` | `string` | `window.location.origin` | Redirect URI after auth |
| `scopes` | `string[]` | `['User.Read']` | Default scopes |
| `cacheLocation` | `'sessionStorage' \| 'localStorage' \| 'memoryStorage'` | `'sessionStorage'` | Token cache location |
| `enableLogging` | `boolean` | `false` | Enable debug logging |

## Troubleshooting

### Common Issues

**Issue**: "No active account" error  
**Solution**: Ensure user is logged in before calling `acquireToken`

**Issue**: Token acquisition fails  
**Solution**: Check that required scopes are granted in Azure AD

**Issue**: SSR hydration mismatch  
**Solution**: Use `'use client'` directive for components using auth hooks

**Issue**: Middleware not protecting routes  
**Solution**: Ensure session cookies are being set after login

**Issue**: "createContext only works in Client Components"  
**Solution**: Use `MSALProvider` (not `MsalAuthProvider`) in layout.tsx

**Issue**: Redirect URI mismatch (AADSTS50011)  
**Solution**: Add your redirect URI to Azure Portal → App registrations → Authentication

**Issue**: Missing environment variables  
**Solution**: Create `.env.local` with `NEXT_PUBLIC_AZURE_AD_CLIENT_ID` and `NEXT_PUBLIC_AZURE_AD_TENANT_ID`

For more detailed troubleshooting, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Debug Mode

Enable debug logging to troubleshoot issues:

```tsx
<MsalAuthProvider
  clientId="YOUR_CLIENT_ID"
  enableLogging={true}
>
  {children}
</MsalAuthProvider>
```

### Enhanced Error Handling (v4.0.2)

Use the new MsalError class for better error messages:

```tsx
import { wrapMsalError } from '@chemmangat/msal-next';

try {
  await loginRedirect();
} catch (error) {
  const msalError = wrapMsalError(error);
  
  // Check if user just cancelled (not a real error)
  if (msalError.isUserCancellation()) {
    return;
  }
  
  // Get actionable error message with fix instructions
  console.error(msalError.toConsoleString());
  
  // Access error details
  console.log('Error code:', msalError.code);
  console.log('Fix instructions:', msalError.fix);
  console.log('Documentation:', msalError.docs);
}
```

## Migration to v4.0.1

### From v3.x to v4.0.1

**Good news:** v4.0.0 is **100% backward compatible**! All v3.x code works without changes.

**New feature:** Zero-Config Protected Routes (optional, but recommended)

**Before (v3.x - still works):**
```tsx
// middleware.ts
export async function middleware(request) {
  const session = await getServerSession();
  if (!session) return redirect('/login');
}

// app/dashboard/page.tsx
export default async function Dashboard() {
  const session = await getServerSession();
  if (!session) redirect('/login');
  return <div>Protected</div>;
}
```

**After (v4.0 - recommended):**
```tsx
// app/dashboard/page.tsx
export const auth = { required: true };

export default function Dashboard() {
  return <div>Protected</div>;
}
```

**That's it!** No breaking changes, just a better way to protect routes.

---

## Migration Guide

### From v2.x to v3.0

v3.0 includes breaking changes. See [MIGRATION_GUIDE_v3.md](./MIGRATION_GUIDE_v3.md) for complete details.

**Quick migration:**

```bash
# 1. Update dependencies
npm install @chemmangat/msal-next@3.0.0
npm install @azure/msal-browser@^4.0.0
npm install @azure/msal-react@^3.0.0
npm install next@^14.1.0

# 2. Update Node.js to 18+
node --version  # Should be v18.0.0+

# 3. Remove deprecated ServerSession.accessToken usage
# Before:
const session = await getServerSession();
const token = session.accessToken; // ❌ Removed

# After:
'use client';
const { acquireToken } = useMsalAuth();
const token = await acquireToken(['User.Read']); // ✅
```

### From v1.x to v2.x

v2.0 is backward compatible with v1.x. New features are additive:

```tsx
// v1.x - Still works!
import { MsalAuthProvider, useMsalAuth } from '@chemmangat/msal-next';

// v2.x - New features
import {
  AuthGuard,
  SignOutButton,
  UserAvatar,
  useGraphApi,
  useUserProfile,
  useRoles,
  withAuth,
  createAuthMiddleware,
} from '@chemmangat/msal-next';
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

MIT © [Chemmangat](https://github.com/chemmangat)

## Support

- 📖 [Documentation](https://github.com/chemmangat/msal-next#readme)
- 🐛 [Issue Tracker](https://github.com/chemmangat/msal-next/issues)
- 💬 [Discussions](https://github.com/chemmangat/msal-next/discussions)
- 🚀 [CLI Tool](https://www.npmjs.com/package/@chemmangat/msal-next-cli)
- 📋 [Migration Guide](./MIGRATION_GUIDE_v3.md)
- 🧪 [Testing Guide](./TESTING_GUIDE.md)

## What's Coming in v3.1

- 🧪 80%+ test coverage
- 📚 6+ additional examples
- ⚡ Performance optimizations
- 🔒 Security audit
- 🆕 New hooks and components

[See Roadmap](./V3_ROADMAP.md) for details.

## Acknowledgments

Built with:
- [@azure/msal-browser](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [@azure/msal-react](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Next.js](https://nextjs.org/)
