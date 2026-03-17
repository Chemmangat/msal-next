# @chemmangat/msal-next

Microsoft/Azure AD authentication for Next.js App Router. Minimal setup, full TypeScript support, production-ready.

[![npm version](https://badge.fury.io/js/@chemmangat%2Fmsal-next.svg)](https://www.npmjs.com/package/@chemmangat/msal-next)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Security](https://img.shields.io/badge/Security-A+-green.svg)](./SECURITY.md)

**Current version: 5.1.0**

---

## Install

```bash
npm install @chemmangat/msal-next @azure/msal-browser @azure/msal-react
```

Or scaffold everything automatically with the CLI (Node.js 18+ required):

```bash
npx @chemmangat/msal-next-cli init
```

The `init` command interactively asks for your client ID, tenant ID, authority type, and cache location, then creates `.env.local`, updates `app/layout.tsx` with `MSALProvider`, and generates a starter `app/auth/page.tsx`.

To migrate an existing project from popup-based auth to redirect:

```bash
npx @chemmangat/msal-next-cli migrate
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
  // v5.0.0 — custom account row rendering
  renderAccount={(account, isActive) => (
    <div style={{ fontWeight: isActive ? 'bold' : 'normal' }}>
      {account.name} ({account.username})
    </div>
  )}
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
  // v5.0.0 — custom account row rendering
  renderAccount={(account, isActive) => (
    <div style={{ color: isActive ? 'blue' : 'black' }}>
      {account.name} — {account.username}
    </div>
  )}
/>
```

---

## Multi-Tenant Support (v5.1.0)

### Provider Configuration

```tsx
<MSALProvider
  clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
  multiTenant={{
    type: 'multi',
    allowList: ['contoso.com', 'fabrikam.com'],
    blockList: ['competitor.com'],
    requireType: 'Member',
    requireMFA: true,
  }}
  onTenantDenied={(reason) => router.push(`/denied?reason=${encodeURIComponent(reason)}`)}
>
```

### `useTenant()` Hook

```tsx
import { useTenant } from '@chemmangat/msal-next';

const { tenantId, tenantDomain, isGuestUser, homeTenantId, resourceTenantId, claims } = useTenant();
```

### Per-Page Tenant Restrictions

```tsx
export const auth = {
  required: true,
  tenant: { allowList: ['contoso.com'], requireMFA: true },
};
```

### Middleware Tenant Validation

```ts
export const middleware = createAuthMiddleware({
  protectedRoutes: ['/dashboard'],
  tenantConfig: { allowList: ['contoso.com'] },
  tenantDeniedPath: '/unauthorized',
});
```

### Cross-Tenant Token Acquisition

```tsx
const { acquireTokenForTenant } = useMsalAuth();
const token = await acquireTokenForTenant('target-tenant-id', ['User.Read']);
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
  acquireTokenForTenant,// (tenantId: string, scopes: string[]) => Promise<string>  — cross-tenant (v5.1.0)
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

Monitors token expiry and optionally refreshes tokens automatically in the background. Use this when you want to show a session-expiry warning or trigger a manual refresh without relying solely on `MSALProvider`'s `autoRefreshToken` prop.

```tsx
useTokenRefresh(options?: UseTokenRefreshOptions): UseTokenRefreshReturn
```

Options (`UseTokenRefreshOptions`):

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable automatic background refresh |
| `refreshBeforeExpiry` | `number` | `300` | Seconds before expiry to trigger refresh |
| `scopes` | `string[]` | `['User.Read']` | Scopes to refresh |
| `onRefresh` | `(expiresIn: number) => void` | — | Called after a successful refresh |
| `onError` | `(error: Error) => void` | — | Called when refresh fails |

Return values (`UseTokenRefreshReturn`):

| Value | Type | Description |
|-------|------|-------------|
| `expiresIn` | `number \| null` | Seconds until the current token expires |
| `isExpiringSoon` | `boolean` | `true` when within `refreshBeforeExpiry` window |
| `refresh` | `() => Promise<void>` | Manually trigger a token refresh |
| `lastRefresh` | `Date \| null` | Timestamp of the last successful refresh |

```tsx
'use client';

import { useTokenRefresh } from '@chemmangat/msal-next';

export default function SessionBanner() {
  const { expiresIn, isExpiringSoon, refresh, lastRefresh } = useTokenRefresh({
    enabled: true,
    refreshBeforeExpiry: 300,       // warn/refresh 5 min before expiry
    scopes: ['User.Read'],
    onRefresh: (expiresIn) => console.log(`Refreshed — expires in ${expiresIn}s`),
    onError: (error) => console.error('Refresh failed', error),
  });

  if (isExpiringSoon) {
    return (
      <div className="session-warning">
        Session expires in {Math.floor((expiresIn ?? 0) / 60)} minutes.{' '}
        <button onClick={refresh}>Stay signed in</button>
        {lastRefresh && <span> Last refreshed: {lastRefresh.toLocaleTimeString()}</span>}
      </div>
    );
  }

  return null;
}
```

#### useMultiAccount()

Manages multiple simultaneously signed-in Microsoft accounts. Use this when your app needs to support users who work across multiple tenants or have both personal and work accounts. Accepts an optional `defaultScopes` argument used when adding a new account.

```tsx
useMultiAccount(defaultScopes?: string[]): UseMultiAccountReturn
```

Return values (`UseMultiAccountReturn`):

| Value | Type | Description |
|-------|------|-------------|
| `accounts` | `AccountInfo[]` | All accounts currently in the MSAL cache |
| `activeAccount` | `AccountInfo \| null` | The currently active account |
| `hasMultipleAccounts` | `boolean` | `true` when more than one account is cached |
| `accountCount` | `number` | Total number of cached accounts |
| `inProgress` | `boolean` | `true` while an MSAL interaction is running |
| `switchAccount` | `(account: AccountInfo) => void` | Set a different account as active |
| `addAccount` | `(scopes?: string[]) => Promise<void>` | Sign in with an additional account |
| `removeAccount` | `(account: AccountInfo) => Promise<void>` | Remove an account from the cache |
| `signOutAccount` | `(account: AccountInfo) => Promise<void>` | Sign out a specific account |
| `signOutAll` | `() => Promise<void>` | Sign out all accounts |
| `getAccountByUsername` | `(username: string) => AccountInfo \| undefined` | Look up an account by username |
| `getAccountById` | `(homeAccountId: string) => AccountInfo \| undefined` | Look up an account by home account ID |
| `isActiveAccount` | `(account: AccountInfo) => boolean` | Check whether a given account is active |

```tsx
'use client';

import { useMultiAccount } from '@chemmangat/msal-next';

export default function AccountManager() {
  const {
    accounts,
    activeAccount,
    hasMultipleAccounts,
    accountCount,
    inProgress,
    switchAccount,
    addAccount,
    signOutAccount,
    signOutAll,
    isActiveAccount,
  } = useMultiAccount(['User.Read']);

  return (
    <div>
      <p>Signed in as: {activeAccount?.name} ({activeAccount?.username})</p>
      <p>{accountCount} account{accountCount !== 1 ? 's' : ''} cached</p>

      {hasMultipleAccounts && (
        <ul>
          {accounts.map((account) => (
            <li key={account.homeAccountId}>
              {account.name}
              {isActiveAccount(account) && ' (active)'}
              <button onClick={() => switchAccount(account)} disabled={isActiveAccount(account)}>
                Switch
              </button>
              <button onClick={() => signOutAccount(account)}>Sign out</button>
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => addAccount()} disabled={inProgress}>
        Add another account
      </button>
      <button onClick={() => signOutAll()} disabled={inProgress}>
        Sign out all
      </button>
    </div>
  );
}
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

Wraps a page component with authentication and optional role-based access control. Returns a new component that checks auth before rendering. Takes a `PageAuthConfig` as the second argument and an optional `AuthProtectionConfig` as the third for global defaults.

```tsx
withPageAuth<P>(
  Component: ComponentType<P>,
  authConfig: PageAuthConfig,
  globalConfig?: AuthProtectionConfig
): ComponentType<P>
```

`PageAuthConfig` options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `required` | `boolean` | `false` | Whether authentication is required |
| `roles` | `string[]` | — | User must have at least one of these roles (from `idTokenClaims.roles`) |
| `redirectTo` | `string` | `'/login'` | Where to redirect unauthenticated users |
| `loading` | `ReactNode` | — | Component shown while auth state is resolving |
| `unauthorized` | `ReactNode` | — | Component shown instead of redirecting when access is denied |
| `validate` | `(account: any) => boolean \| Promise<boolean>` | — | Custom access check; return `true` to allow, `false` to deny |

`AuthProtectionConfig` options (global defaults, third argument):

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `defaultRedirectTo` | `string` | `'/login'` | Fallback redirect for unauthenticated users |
| `defaultLoading` | `ReactNode` | — | Fallback loading component |
| `defaultUnauthorized` | `ReactNode` | — | Fallback unauthorized component |
| `debug` | `boolean` | `false` | Log auth decisions to the console |

```tsx
// app/dashboard/page.tsx
'use client';

import { withPageAuth } from '@chemmangat/msal-next';

function Dashboard() {
  return <div>Dashboard — only admins and editors can see this</div>;
}

export default withPageAuth(
  Dashboard,
  {
    required: true,
    roles: ['Admin', 'Editor'],
    redirectTo: '/login',
    loading: <div>Checking access...</div>,
    unauthorized: <div>You do not have permission to view this page.</div>,
  },
  {
    debug: process.env.NODE_ENV === 'development',
  }
);
```

Custom `validate` — restrict by email domain:

```tsx
export default withPageAuth(Dashboard, {
  required: true,
  validate: (account) => account.username.endsWith('@company.com'),
  unauthorized: <div>Only company accounts are allowed.</div>,
});
```

#### ProtectedPage

The underlying component that `withPageAuth` uses internally. Use it directly when you need to protect arbitrary JSX rather than a whole page component — for example inside a layout or a slot.

```tsx
<ProtectedPage
  config={PageAuthConfig}
  defaultRedirectTo="/login"
  defaultLoading={<Spinner />}
  defaultUnauthorized={<div>Access denied</div>}
  debug={false}
>
  {children}
</ProtectedPage>
```

Props (`ProtectedPageProps`):

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Content to render when access is granted |
| `config` | `PageAuthConfig` | required | Per-page auth rules (same shape as `withPageAuth` second arg) |
| `defaultRedirectTo` | `string` | `'/login'` | Redirect path when unauthenticated |
| `defaultLoading` | `ReactNode` | — | Loading component while auth resolves |
| `defaultUnauthorized` | `ReactNode` | — | Component shown when access is denied |
| `debug` | `boolean` | `false` | Log auth decisions to the console |

```tsx
// app/settings/layout.tsx
'use client';

import { ProtectedPage } from '@chemmangat/msal-next';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedPage
      config={{
        required: true,
        roles: ['Admin'],
        redirectTo: '/login',
      }}
      defaultLoading={<div>Loading...</div>}
      defaultUnauthorized={<div>Admins only.</div>}
    >
      {children}
    </ProtectedPage>
  );
}
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

---

### Middleware

#### createAuthMiddleware

Creates a Next.js Edge middleware function that enforces authentication at the routing level — before any page or API route renders. Use this to protect entire route groups without adding `AuthGuard` or `withPageAuth` to every page.

The middleware reads a session cookie (`msal.account` by default) to determine auth state. Because MSAL runs in the browser, the cookie must be set client-side after login (e.g. via `setServerSessionCookie` from `@chemmangat/msal-next/server`). You can also supply a custom `isAuthenticated` function to integrate your own session store.

```tsx
createAuthMiddleware(config?: AuthMiddlewareConfig): (request: NextRequest) => Promise<NextResponse>
```

`AuthMiddlewareConfig` options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `protectedRoutes` | `string[]` | — | Paths that require authentication. Unauthenticated requests redirect to `loginPath` |
| `publicOnlyRoutes` | `string[]` | — | Paths only accessible when NOT authenticated (e.g. `/login`). Authenticated users are redirected to `redirectAfterLogin` |
| `loginPath` | `string` | `'/login'` | Where to redirect unauthenticated users |
| `redirectAfterLogin` | `string` | `'/'` | Where to redirect authenticated users away from `publicOnlyRoutes` |
| `sessionCookie` | `string` | `'msal.account'` | Cookie name used to detect an active session |
| `isAuthenticated` | `(request: NextRequest) => boolean \| Promise<boolean>` | — | Custom auth check; overrides the default cookie check |
| `debug` | `boolean` | `false` | Log routing decisions to the console |

```tsx
// middleware.ts
import { createAuthMiddleware } from '@chemmangat/msal-next';

export const middleware = createAuthMiddleware({
  protectedRoutes: ['/dashboard', '/profile', '/settings', '/api/protected'],
  publicOnlyRoutes: ['/login', '/signup'],
  loginPath: '/login',
  redirectAfterLogin: '/dashboard',
  sessionCookie: 'msal.account',
  debug: process.env.NODE_ENV === 'development',
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

Custom `isAuthenticated` — use your own session store:

```tsx
// middleware.ts
import { createAuthMiddleware } from '@chemmangat/msal-next';
import { verifySession } from './lib/session';

export const middleware = createAuthMiddleware({
  protectedRoutes: ['/dashboard'],
  loginPath: '/login',
  isAuthenticated: async (request) => {
    const token = request.cookies.get('session-token')?.value;
    if (!token) return false;
    return verifySession(token);
  },
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
