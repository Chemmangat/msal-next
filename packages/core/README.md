# @chemmangat/msal-next

Production-grade MSAL authentication library for Next.js App Router with minimal boilerplate.

[![npm version](https://badge.fury.io/js/@chemmangat%2Fmsal-next.svg)](https://www.npmjs.com/package/@chemmangat/msal-next)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

✨ **Minimal Setup** - Just provide your `clientId` to get started  
🔐 **Production Ready** - Comprehensive error handling, retry logic, and SSR support  
🎨 **Beautiful Components** - Pre-styled Microsoft-branded UI components  
🪝 **Powerful Hooks** - Easy-to-use hooks for auth, Graph API, and user data  
🛡️ **Type Safe** - Full TypeScript support with generics for custom claims  
⚡ **Edge Compatible** - Middleware support for protecting routes at the edge  
📦 **Zero Config** - Sensible defaults with full customization options

## Installation

```bash
npm install @chemmangat/msal-next @azure/msal-browser @azure/msal-react
```

## Quick Start

### 1. Wrap your app with MsalAuthProvider

```tsx
// app/layout.tsx
import { MsalAuthProvider } from '@chemmangat/msal-next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MsalAuthProvider clientId="YOUR_CLIENT_ID">
          {children}
        </MsalAuthProvider>
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

## Components

### MsalAuthProvider

The root provider that initializes MSAL.

```tsx
<MsalAuthProvider
  clientId="YOUR_CLIENT_ID"
  tenantId="YOUR_TENANT_ID" // Optional
  scopes={['User.Read', 'Mail.Read']} // Optional
  enableLogging={true} // Optional
>
  {children}
</MsalAuthProvider>
```

### MicrosoftSignInButton

Pre-styled sign-in button with Microsoft branding.

```tsx
<MicrosoftSignInButton
  variant="dark" // or "light"
  size="medium" // "small", "medium", "large"
  useRedirect={false} // Use popup by default
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
  loginPopup,
  loginRedirect,
  logoutPopup,
  logoutRedirect,
  acquireToken,
} = useMsalAuth();

// Login
await loginPopup(['User.Read']);

// Get token
const token = await acquireToken(['User.Read']);

// Logout
await logoutPopup();
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

Fetch and cache user profile from MS Graph.

```tsx
const { profile, loading, error, refetch } = useUserProfile();

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;

return (
  <div>
    <h1>{profile.displayName}</h1>
    <p>{profile.mail}</p>
    <p>{profile.jobTitle}</p>
  </div>
);
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

Comprehensive logging for troubleshooting.

```tsx
import { getDebugLogger } from '@chemmangat/msal-next';

const logger = getDebugLogger({
  enabled: true,
  level: 'debug',
  showTimestamp: true
});

logger.info('User logged in', { username: 'user@example.com' });
logger.error('Authentication failed', { error });
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

## Migration Guide

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

## Acknowledgments

Built with:
- [@azure/msal-browser](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [@azure/msal-react](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Next.js](https://nextjs.org/)
