# @chemmangat/msal-next

Microsoft/Azure AD authentication for Next.js App Router. Minimal setup, full TypeScript support, production-ready.

[![npm version](https://badge.fury.io/js/@chemmangat%2Fmsal-next.svg)](https://www.npmjs.com/package/@chemmangat/msal-next)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Security](https://img.shields.io/badge/Security-A+-green.svg)](./SECURITY.md)

**Current version: 4.2.1**

---

## Install

```bash
npm install @chemmangat/msal-next @azure/msal-browser @azure/msal-react
```

---

## Quick Start

### 1. Add the provider to your layout

```tsx
// app/layout.tsx (Server Component — no 'use client' needed)
import { MSALProvider } from '@chemmangat/msal-next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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

`MSALProvider` is already marked `'use client'` internally.

### 2. Add a sign-in button

```tsx
// app/page.tsx
'use client';

import { MicrosoftSignInButton, SignOutButton, useMsalAuth } from '@chemmangat/msal-next';

export default function HomePage() {
  const { isAuthenticated, account } = useMsalAuth();

  return isAuthenticated ? (
    <div>
      <p>Welcome, {account?.name}</p>
      <SignOutButton />
    </div>
  ) : (
    <MicrosoftSignInButton />
  );
}
```

### 3. Set environment variables

```bash
# .env.local
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=your-client-id
NEXT_PUBLIC_AZURE_AD_TENANT_ID=your-tenant-id
```

### 4. Azure AD setup

1. Go to [Azure Portal](https://portal.azure.com) → Azure Active Directory → App registrations
2. Create a new registration, platform type: **Single-page application (SPA)**
3. Add redirect URI: `http://localhost:3000` (dev) and your production URL
4. Copy the **Application (client) ID** and **Directory (tenant) ID**

---

## API Reference

### Components

#### MSALProvider

```tsx
<MSALProvider
  clientId="..."
  tenantId="..."
  authorityType="common"
  scopes={['User.Read']}
  redirectUri="https://myapp.com"
  cacheLocation="sessionStorage"
  enableLogging={false}
  autoRefreshToken={true}
  refreshBeforeExpiry={300}
  allowedRedirectUris={['https://myapp.com']}
  protection={{ defaultRedirectTo: '/login' }}
>
  {children}
</MSALProvider>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `clientId` | `string` | required | Azure AD Application (client) ID |
| `tenantId` | `string` | — | Directory (tenant) ID, single-tenant only |
| `authorityType` | `'common' \| 'organizations' \| 'consumers' \| 'tenant'` | `'common'` | Authority type |
| `redirectUri` | `string` | `window.location.origin` | Redirect URI after auth |
| `postLogoutRedirectUri` | `string` | `redirectUri` | Redirect URI after logout |
| `scopes` | `string[]` | `['User.Read']` | Default scopes |
| `cacheLocation` | `'sessionStorage' \| 'localStorage' \| 'memoryStorage'` | `'sessionStorage'` | Token cache location |
| `enableLogging` | `boolean` | `false` | Debug logging |
| `autoRefreshToken` | `boolean` | `false` | Auto-refresh tokens before expiry |
| `refreshBeforeExpiry` | `number` | `300` | Seconds before expiry to refresh |
| `allowedRedirectUris` | `string[]` | — | Whitelist of allowed redirect URIs |
| `protection` | `AuthProtectionConfig` | — | Zero-config route protection config |

#### MicrosoftSignInButton

```tsx
<MicrosoftSignInButton
  variant="dark"        // 'dark' | 'light'
  size="medium"         // 'small' | 'medium' | 'large'
  text="Sign in with Microsoft"
  scopes={['User.Read']}
  onSuccess={() => {}}
  onError={(error) => {}}
/>
```

#### SignOutButton

```tsx
<SignOutButton
  variant="light"
  size="medium"
  onSuccess={() => {}}
  onError={(error) => {}}
/>
```

#### AuthGuard

Protects content and redirects unauthenticated users to login.

```tsx
<AuthGuard
  loadingComponent={<div>Loading...</div>}
  fallbackComponent={<div>Redirecting...</div>}
  scopes={['User.Read']}
  onAuthRequired={() => {}}
>
  <ProtectedContent />
</AuthGuard>
```

#### UserAvatar

```tsx
<UserAvatar size={48} showTooltip fallbackImage="/avatar.png" />
```

#### AccountSwitcher

```tsx
<AccountSwitcher
  variant="default"     // 'default' | 'compact' | 'minimal'
  maxAccounts={5}
  showAvatars
  showAddButton
  showRemoveButton
  onSwitch={(account) => {}}
  onAdd={() => {}}
  onRemove={(account) => {}}
/>
```

#### AccountList

```tsx
<AccountList
  showAvatars
  showDetails
  showActiveIndicator
  clickToSwitch
  orientation="vertical"  // 'vertical' | 'horizontal'
  onAccountClick={(account) => {}}
/>
```

---

### Hooks

#### useMsalAuth()

```tsx
const {
  account,              // AccountInfo | null
  accounts,             // AccountInfo[]
  isAuthenticated,      // boolean
  inProgress,           // boolean
  loginRedirect,        // (scopes?: string[]) => Promise<void>
  logoutRedirect,       // () => Promise<void>
  acquireToken,         // (scopes: string[]) => Promise<string>  — silent with redirect fallback
  acquireTokenSilent,   // (scopes: string[]) => Promise<string>  — silent only
  acquireTokenRedirect, // (scopes: string[]) => Promise<void>
  clearSession,         // () => Promise<void>  — clears cache without Microsoft logout
} = useMsalAuth();
```

#### useUserProfile()

Fetches user profile from Microsoft Graph `/me` (30+ fields).

```tsx
const {
  profile,    // UserProfile | null
  loading,    // boolean
  error,      // Error | null
  refetch,    // () => Promise<void>
  clearCache, // () => void
} = useUserProfile();

// With custom fields
interface MyProfile extends UserProfile { customField: string }
const { profile } = useUserProfile<MyProfile>();
```

#### useGraphApi()

```tsx
const graph = useGraphApi();

const user   = await graph.get('/me');
const result = await graph.post('/me/messages', body);
await graph.put('/me/photo/$value', blob);
await graph.patch('/me', { displayName: 'New Name' });
await graph.delete('/me/messages/{id}');
const data   = await graph.request('/me', { version: 'beta' });
```

#### useRoles()

```tsx
const {
  roles,       // string[]
  groups,      // string[]
  loading,     // boolean
  error,       // Error | null
  hasRole,     // (role: string) => boolean
  hasGroup,    // (groupId: string) => boolean
  hasAnyRole,  // (roles: string[]) => boolean
  hasAllRoles, // (roles: string[]) => boolean
  refetch,     // () => Promise<void>
} = useRoles();
```

#### useTokenRefresh()

```tsx
const {
  expiresIn,      // number | null  — seconds until expiry
  isExpiringSoon, // boolean
  refresh,        // () => Promise<void>
  lastRefresh,    // Date | null
} = useTokenRefresh({
  refreshBeforeExpiry: 300,
  scopes: ['User.Read'],
  onRefresh: (expiresIn) => {},
  onError: (error) => {},
});
```

#### useMultiAccount()

```tsx
const {
  accounts,
  activeAccount,
  hasMultipleAccounts,
  accountCount,
  inProgress,
  switchAccount,        // (account: AccountInfo) => void
  addAccount,           // (scopes?: string[]) => Promise<void>
  removeAccount,        // (account: AccountInfo) => Promise<void>
  signOutAccount,       // (account: AccountInfo) => Promise<void>
  signOutAll,           // () => Promise<void>
  getAccountByUsername, // (username: string) => AccountInfo | undefined
  getAccountById,       // (homeAccountId: string) => AccountInfo | undefined
  isActiveAccount,      // (account: AccountInfo) => boolean
} = useMultiAccount();
```

---

### Higher-Order Components

#### withAuth

```tsx
const ProtectedPage = withAuth(MyPage, {
  loadingComponent: <Spinner />,
  scopes: ['User.Read'],
});
```

#### withPageAuth

```tsx
const ProtectedDashboard = withPageAuth(Dashboard, {
  required: true,
  roles: ['Admin'],
  redirectTo: '/login',
});
export default ProtectedDashboard;
```

---

### Server Utilities

#### getServerSession

```tsx
// app/profile/page.tsx (Server Component)
import { getServerSession } from '@chemmangat/msal-next/server';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session.isAuthenticated) redirect('/login');
  return <div>Welcome, {session.username}</div>;
}
```

#### createAuthMiddleware

```tsx
// middleware.ts
import { createAuthMiddleware } from '@chemmangat/msal-next';

export const middleware = createAuthMiddleware({
  protectedRoutes: ['/dashboard', '/profile'],
  publicOnlyRoutes: ['/login'],
  loginPath: '/login',
  debug: false,
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

---

## Common Patterns

### Protect a page with AuthGuard

```tsx
'use client';

import { AuthGuard, useUserProfile } from '@chemmangat/msal-next';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const { profile, loading } = useUserProfile();
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <p>{profile?.displayName}</p>
      <p>{profile?.mail}</p>
      <p>{profile?.department}</p>
    </div>
  );
}
```

### Acquire a token for API calls

```tsx
'use client';

import { useMsalAuth } from '@chemmangat/msal-next';

export default function DataComponent() {
  const { acquireToken, isAuthenticated } = useMsalAuth();

  const fetchData = async () => {
    if (!isAuthenticated) return;
    const token = await acquireToken(['User.Read']);
    const res = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  };
}
```

### Error handling

```tsx
import { useMsalAuth, wrapMsalError } from '@chemmangat/msal-next';

const { loginRedirect } = useMsalAuth();

const handleLogin = async () => {
  try {
    await loginRedirect();
  } catch (error) {
    const msalError = wrapMsalError(error);
    if (msalError.isUserCancellation()) return;
    console.error(msalError.toConsoleString());
  }
};
```

### Automatic token refresh

```tsx
<MSALProvider
  clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
  autoRefreshToken={true}
  refreshBeforeExpiry={300}
>
  {children}
</MSALProvider>
```

---

## Troubleshooting

- **"createContext only works in Client Components"** — use `MSALProvider` (not `MsalAuthProvider`) in layout.tsx
- **"AADSTS50011: Redirect URI mismatch"** — add your URL to Azure Portal → Authentication → Redirect URIs
- **"No active account"** — user must sign in before calling `acquireToken()`
- **Environment variables undefined** — restart the dev server after creating `.env.local`

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more.

---

## Additional Resources

- [SECURITY.md](./SECURITY.md) — security policy and best practices
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) — common issues
- [CHANGELOG.md](./CHANGELOG.md) — version history
- [MIGRATION_GUIDE_v3.md](./MIGRATION_GUIDE_v3.md) — migrating from v2.x
- [npm package](https://www.npmjs.com/package/@chemmangat/msal-next)
- [GitHub](https://github.com/chemmangat/msal-next)
- [Report issues](https://github.com/chemmangat/msal-next/issues)

---

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md).

## License

MIT © [Chemmangat](https://github.com/chemmangat)
