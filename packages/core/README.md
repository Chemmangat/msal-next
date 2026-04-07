# @chemmangat/msal-next

Production-ready Microsoft / Azure AD (Entra ID) authentication for **Next.js App Router**.  
Zero-config setup · TypeScript-first · Multi-account · Auto token refresh · Edge middleware

[![npm version](https://img.shields.io/npm/v/@chemmangat/msal-next)](https://www.npmjs.com/package/@chemmangat/msal-next)
[![license](https://img.shields.io/npm/l/@chemmangat/msal-next)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14%2B-black)](https://nextjs.org)

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Azure AD Setup](#azure-ad-setup)
3. [Route Protection Strategies](#route-protection-strategies)
4. [Multi-Tenant Configuration](#multi-tenant-configuration)
5. [API Reference](#api-reference)
6. [Role-Based Access Control](#role-based-access-control)
7. [Server-Side Protection](#server-side-protection)
8. [Multi-Account Management](#multi-account-management)
9. [Microsoft Graph API](#microsoft-graph-api)
10. [Migration Guides](#migration-guides)
11. [Troubleshooting](#troubleshooting)
12. [Examples](#examples)
13. [Deployment Checklist](#deployment-checklist)

---

## Quick Start

### 1. Install

```bash
npm install @chemmangat/msal-next @azure/msal-browser @azure/msal-react
```

### 2. Environment variables

Create `.env.local`:

```bash
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=your-application-client-id
NEXT_PUBLIC_AZURE_AD_TENANT_ID=your-directory-tenant-id
```

### 3. Add the provider to your layout

```tsx
// app/layout.tsx  (Server Component — no 'use client' needed here)
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

### 4. Add a sign-in button

```tsx
// app/page.tsx
'use client';
import { MicrosoftSignInButton, useMsalAuth } from '@chemmangat/msal-next';

export default function Home() {
  const { isAuthenticated, account } = useMsalAuth();

  if (isAuthenticated) {
    return <p>Welcome, {account?.name}!</p>;
  }

  return <MicrosoftSignInButton />;
}
```

That's it. Your app now has Microsoft authentication.

---

## Azure AD Setup

### Step 1 — Create an App Registration

1. Go to [portal.azure.com](https://portal.azure.com) → **Azure Active Directory** → **App registrations** → **New registration**
2. Fill in:
   - **Name**: Your app name (e.g. "My Next.js App")
   - **Supported account types**: Choose based on your use case (see table below)
   - **Redirect URI**: Select **Single-page application (SPA)** and enter `http://localhost:3000`

| Account type option | Use case |
|---|---|
| Accounts in this organizational directory only | Single-tenant enterprise app |
| Accounts in any organizational directory | Multi-tenant B2B SaaS |
| Accounts in any organizational directory + personal Microsoft accounts | Consumer-facing app |
| Personal Microsoft accounts only | Consumer app (Xbox, Outlook.com) |

### Step 2 — Copy your credentials

After registration, copy from the **Overview** page:
- **Application (client) ID** → `NEXT_PUBLIC_AZURE_AD_CLIENT_ID`
- **Directory (tenant) ID** → `NEXT_PUBLIC_AZURE_AD_TENANT_ID`

### Step 3 — Add redirect URIs

Go to **Authentication** → **Single-page application** → **Add URI**:

| Environment | URI |
|---|---|
| Development | `http://localhost:3000` |
| Production | `https://yourdomain.com` |

> Important: The redirect URI must match **exactly** — including trailing slashes. A mismatch causes `AADSTS50011`.

### Step 4 — (Optional) Configure API permissions

For Microsoft Graph access, go to **API permissions** → **Add a permission** → **Microsoft Graph** → **Delegated permissions**:

| Permission | Purpose |
|---|---|
| `User.Read` | Basic profile (required) |
| `User.ReadBasic.All` | Read other users' profiles |
| `Mail.Read` | Read user's email |
| `Calendars.Read` | Read user's calendar |
| `GroupMember.Read.All` | Read group memberships |

### Step 5 — (Optional) Configure app roles

For RBAC, go to **App roles** → **Create app role**:

```
Display name: Admin
Value: Admin
Description: Full administrative access
Allowed member types: Users/Groups
```

Assign roles to users via **Enterprise applications** → your app → **Users and groups**.

---

## Route Protection Strategies

There are three ways to protect routes. You can mix and match them in the same app.

---

### Strategy 1: Middleware (Edge — Recommended for most apps)

Runs at the edge before any page renders. Best for blanket protection of entire route groups.

```ts
// middleware.ts  (project root)
import { createAuthMiddleware } from '@chemmangat/msal-next';

export const middleware = createAuthMiddleware({
  // Routes that require a signed-in user
  protectedRoutes: ['/dashboard', '/profile', '/settings', '/api/protected'],

  // Routes only accessible when NOT signed in (redirect away if already authed)
  publicOnlyRoutes: ['/login', '/signup'],

  // Where to send unauthenticated users
  loginPath: '/login',

  // Where to send authenticated users who hit a publicOnlyRoute
  redirectAfterLogin: '/dashboard',

  // Enable debug logs in development
  debug: process.env.NODE_ENV === 'development',
});

// Apply middleware to all routes except Next.js internals and static files
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
```

The middleware reads the `msal.account` cookie set after login. To populate that cookie, call `setServerSessionCookie` after successful authentication:

```tsx
// app/login/page.tsx
'use client';
import { useMsalAuth } from '@chemmangat/msal-next';
import { setServerSessionCookie } from '@chemmangat/msal-next/server';

export default function LoginPage() {
  const { loginRedirect } = useMsalAuth();

  const handleLogin = async () => {
    await loginRedirect(['User.Read']);
    // setServerSessionCookie is called automatically by MsalAuthProvider
    // after a successful redirect login
  };

  return <button onClick={handleLogin}>Sign in with Microsoft</button>;
}
```

---

### Strategy 2: Per-Page Auth Export (Zero-Config)

Export an `auth` constant from any page file. The library wraps the page automatically — no HOC boilerplate needed.

```tsx
// app/dashboard/page.tsx
'use client';

// Export this to enable protection — that's all you need
export const auth = { required: true };

export default function Dashboard() {
  return <h1>Protected Dashboard</h1>;
}
```

With roles:

```tsx
// app/admin/page.tsx
'use client';

export const auth = {
  required: true,
  roles: ['Admin', 'SuperAdmin'],       // user must have at least one
  redirectTo: '/unauthorized',          // custom redirect on failure
};

export default function AdminPage() {
  return <h1>Admin Only</h1>;
}
```

With a custom validation function:

```tsx
// app/internal/page.tsx
'use client';
import type { AccountInfo } from '@azure/msal-browser';

export const auth = {
  required: true,
  validate: (account: AccountInfo) =>
    account.username.endsWith('@contoso.com'),
  unauthorized: <div>Only Contoso employees can access this page.</div>,
};

export default function InternalPage() {
  return <h1>Internal Tools</h1>;
}
```

To enable the per-page system, pass a `protection` config to `MSALProvider`:

```tsx
// app/layout.tsx
import { MSALProvider } from '@chemmangat/msal-next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MSALProvider
          clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
          tenantId={process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID!}
          protection={{
            defaultRedirectTo: '/login',
            defaultLoading: <div>Checking authentication…</div>,
            debug: process.env.NODE_ENV === 'development',
          }}
        >
          {children}
        </MSALProvider>
      </body>
    </html>
  );
}
```

---

### Strategy 3: Hybrid (Middleware + Per-Page)

Use middleware for coarse-grained protection (entire `/dashboard` subtree) and per-page exports for fine-grained role/tenant checks within those routes.

```ts
// middleware.ts — protect the whole /dashboard tree
export const middleware = createAuthMiddleware({
  protectedRoutes: ['/dashboard'],
  loginPath: '/login',
});
```

```tsx
// app/dashboard/admin/page.tsx — additionally require Admin role
'use client';

export const auth = {
  required: true,
  roles: ['Admin'],
  redirectTo: '/dashboard',  // redirect non-admins to regular dashboard
};

export default function AdminDashboard() {
  return <h1>Admin Dashboard</h1>;
}
```

This is the most robust approach: middleware handles the redirect loop prevention and per-page handles authorization.

---

### Strategy 4: AuthGuard Component

Wrap any component tree to require authentication inline:

```tsx
'use client';
import { AuthGuard } from '@chemmangat/msal-next';

export default function SensitiveSection() {
  return (
    <AuthGuard
      loadingComponent={<div>Checking auth…</div>}
      fallbackComponent={<div>Redirecting to login…</div>}
      scopes={['User.Read']}
      onAuthRequired={() => console.log('Auth required')}
    >
      <div>This content is only visible when signed in.</div>
    </AuthGuard>
  );
}
```

---

## Multi-Tenant Configuration

### tenantId / authorityType options

| Value | Authority URL | Who can sign in |
|---|---|---|
| `common` (default) | `login.microsoftonline.com/common` | Any Azure AD tenant + personal Microsoft accounts |
| `organizations` | `login.microsoftonline.com/organizations` | Any Azure AD tenant (no personal accounts) |
| `consumers` | `login.microsoftonline.com/consumers` | Personal Microsoft accounts only |
| `<your-tenant-id>` | `login.microsoftonline.com/<tenantId>` | Your tenant only (single-tenant) |

### Single-tenant (enterprise app)

```tsx
<MSALProvider
  clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
  tenantId={process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID!}
  multiTenant={{ type: 'single' }}
>
```

### Multi-tenant SaaS with allow-list

```tsx
<MSALProvider
  clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
  multiTenant={{
    type: 'multi',
    // Accept only these tenants (by domain or tenant ID)
    allowList: ['contoso.com', 'fabrikam.com', '72f988bf-86f1-41af-91ab-2d7cd011db47'],
    // Require MFA for all users
    requireMFA: true,
    // Block guest accounts
    requireType: 'Member',
  }}
  onTenantDenied={(reason) => {
    console.warn('Tenant denied:', reason);
    // redirect or show error
  }}
>
```

### Block specific tenants

```tsx
<MSALProvider
  clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
  multiTenant={{
    type: 'multi',
    blockList: ['competitor.com'],
  }}
>
```

### Organizations only (no personal accounts)

```tsx
<MSALProvider
  clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
  multiTenant={{ type: 'organizations' }}
>
```

### Per-page tenant restrictions (v5.1.0)

```tsx
// app/enterprise/page.tsx
'use client';

export const auth = {
  required: true,
  tenant: {
    allowList: ['contoso.com'],
    requireMFA: true,
    requireType: 'Member',  // no guests
  },
};

export default function EnterprisePage() {
  return <h1>Contoso employees only</h1>;
}
```

### Middleware tenant validation (v5.1.0)

```ts
// middleware.ts
import { createAuthMiddleware } from '@chemmangat/msal-next';

export const middleware = createAuthMiddleware({
  protectedRoutes: ['/dashboard'],
  loginPath: '/login',
  tenantConfig: {
    type: 'multi',
    allowList: ['contoso.com', 'fabrikam.com'],
  },
  tenantDeniedPath: '/unauthorized',
});
```

### Reading tenant info in components

```tsx
'use client';
import { useTenant } from '@chemmangat/msal-next';

export default function TenantBadge() {
  const { tenantDomain, isGuestUser, tenantId, homeTenantId } = useTenant();

  return (
    <div>
      <span>Tenant: {tenantDomain}</span>
      {isGuestUser && (
        <span className="badge">
          Guest (home: {homeTenantId})
        </span>
      )}
    </div>
  );
}
```

### Acquiring tokens for a different tenant (cross-tenant)

```tsx
'use client';
import { useMsalAuth } from '@chemmangat/msal-next';

export default function CrossTenantExample() {
  const { acquireTokenForTenant } = useMsalAuth();

  const fetchCrossTenantData = async () => {
    // Get a token scoped to a specific tenant
    const token = await acquireTokenForTenant(
      'target-tenant-id',
      ['https://graph.microsoft.com/.default']
    );
    // Use token with target tenant's API
  };

  return <button onClick={fetchCrossTenantData}>Fetch Cross-Tenant Data</button>;
}
```

---

## API Reference

### MSALProvider props

`MSALProvider` is the top-level provider. It is already marked `'use client'` internally, so you can import it in Server Component layouts.

| Prop | Type | Default | Description |
|---|---|---|---|
| `clientId` | `string` | **required** | Azure AD Application (client) ID |
| `tenantId` | `string` | — | Azure AD Directory (tenant) ID. Required for single-tenant apps. |
| `authorityType` | `'common' \| 'organizations' \| 'consumers' \| 'tenant'` | `'common'` | Legacy authority selector. Prefer `multiTenant.type`. |
| `redirectUri` | `string` | `window.location.origin` | Redirect URI after authentication. Must match Azure AD registration. |
| `postLogoutRedirectUri` | `string` | `redirectUri` | Where to redirect after logout. |
| `scopes` | `string[]` | `['User.Read']` | Default OAuth scopes. |
| `cacheLocation` | `'sessionStorage' \| 'localStorage' \| 'memoryStorage'` | `'sessionStorage'` | Where to store tokens. |
| `storeAuthStateInCookie` | `boolean` | `false` | Enable for IE11/Edge legacy support. |
| `navigateToLoginRequestUrl` | `boolean` | `true` | Redirect back to the originating page after login. |
| `enableLogging` | `boolean` | `false` | Log MSAL events to the console. |
| `loggerCallback` | `(level, message, containsPii) => void` | — | Custom MSAL log handler. |
| `allowedRedirectUris` | `string[]` | — | Whitelist of allowed redirect URIs (security). |
| `loadingComponent` | `ReactNode` | — | Shown while MSAL initializes. |
| `onInitialized` | `(instance) => void` | — | Called after MSAL is ready. |
| `autoRefreshToken` | `boolean` | `false` | Silently refresh tokens before expiry. |
| `refreshBeforeExpiry` | `number` | `300` | Seconds before expiry to trigger refresh. |
| `multiTenant` | `MultiTenantConfig` | — | Multi-tenant configuration (v5.1.0). |
| `protection` | `AuthProtectionConfig` | — | Global config for per-page auth exports. |
| `onTenantDenied` | `(reason: string) => void` | — | Called when a user's tenant is denied (v5.1.0). |
| `msalConfig` | `Configuration` | — | Advanced: full MSAL config object (overrides all other props). |

---

### useMsalAuth hook

```tsx
const {
  account,              // AccountInfo | null — current active account
  accounts,             // AccountInfo[]    — all cached accounts
  isAuthenticated,      // boolean
  inProgress,           // boolean — true while MSAL is doing something
  loginRedirect,        // (scopes?: string[]) => Promise<void>
  logoutRedirect,       // () => Promise<void>
  acquireToken,         // (scopes: string[]) => Promise<string>  — silent with redirect fallback
  acquireTokenSilent,   // (scopes: string[]) => Promise<string>  — silent only
  acquireTokenRedirect, // (scopes: string[]) => Promise<void>    — redirect flow
  acquireTokenForTenant,// (tenantId: string, scopes: string[]) => Promise<string>  — cross-tenant
  clearSession,         // () => Promise<void> — clear local session without MS logout
} = useMsalAuth(defaultScopes?: string[]);
```

Example — login and get a token:

```tsx
'use client';
import { useMsalAuth } from '@chemmangat/msal-next';

export default function MyComponent() {
  const { isAuthenticated, account, loginRedirect, acquireToken } = useMsalAuth();

  const handleCallApi = async () => {
    const token = await acquireToken(['User.Read', 'Mail.Read']);
    const res = await fetch('https://graph.microsoft.com/v1.0/me/messages', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    console.log(data);
  };

  if (!isAuthenticated) {
    return <button onClick={() => loginRedirect()}>Sign in</button>;
  }

  return (
    <div>
      <p>Hello, {account?.name}</p>
      <button onClick={handleCallApi}>Read my email</button>
    </div>
  );
}
```

---

### PageAuthConfig (per-page export)

Export `auth` from any `'use client'` page:

| Field | Type | Description |
|---|---|---|
| `required` | `boolean` | Whether auth is required. |
| `roles` | `string[]` | User must have at least one of these Azure AD app roles. |
| `redirectTo` | `string` | Custom redirect path on auth failure. |
| `loading` | `ReactNode` | Custom loading UI while checking auth. |
| `unauthorized` | `ReactNode` | Shown instead of redirecting when access is denied. |
| `validate` | `(account: AccountInfo) => boolean \| Promise<boolean>` | Custom validation function. |
| `tenant` | `TenantAuthConfig` | Per-page tenant restrictions (v5.1.0). |

---

### AuthProtectionConfig (global protection config)

Passed to `MSALProvider`'s `protection` prop:

| Field | Type | Description |
|---|---|---|
| `defaultRedirectTo` | `string` | Default redirect for unauthenticated users. Default: `'/login'` |
| `defaultLoading` | `ReactNode` | Default loading component. |
| `defaultUnauthorized` | `ReactNode` | Default unauthorized component. |
| `debug` | `boolean` | Enable debug logging for protection checks. |

---

### AuthMiddlewareConfig

Passed to `createAuthMiddleware()`:

| Field | Type | Default | Description |
|---|---|---|---|
| `protectedRoutes` | `string[]` | `[]` | Routes requiring authentication. |
| `publicOnlyRoutes` | `string[]` | `[]` | Routes only for unauthenticated users. |
| `loginPath` | `string` | `'/login'` | Login page path. |
| `redirectAfterLogin` | `string` | `'/'` | Where to send users after login. |
| `sessionCookie` | `string` | `'msal.account'` | Cookie name for session data. |
| `isAuthenticated` | `(req) => boolean \| Promise<boolean>` | — | Custom auth check function. |
| `tenantConfig` | `MultiTenantConfig` | — | Tenant validation at the edge (v5.1.0). |
| `tenantDeniedPath` | `string` | `'/unauthorized'` | Redirect when tenant is denied. |
| `debug` | `boolean` | `false` | Log middleware decisions. |

---

### MultiTenantConfig

| Field | Type | Description |
|---|---|---|
| `type` | `'single' \| 'multi' \| 'organizations' \| 'consumers' \| 'common'` | Tenant mode. |
| `allowList` | `string[]` | Tenant IDs or domains that are allowed. |
| `blockList` | `string[]` | Tenant IDs or domains that are blocked (takes precedence over allowList). |
| `requireType` | `'Member' \| 'Guest'` | Require a specific account type. |
| `requireMFA` | `boolean` | Require MFA claim in the token. |

---

### TenantAuthConfig (per-page tenant config)

| Field | Type | Description |
|---|---|---|
| `allowList` | `string[]` | Only users from these tenant IDs or domains are permitted. |
| `blockList` | `string[]` | Users from these tenants are denied (takes precedence). |
| `requireType` | `'Member' \| 'Guest'` | Require a specific account type. |
| `requireMFA` | `boolean` | Require MFA claim (`amr` must contain `'mfa'`). |

---

## Role-Based Access Control

### Using the `useRoles` hook

```tsx
'use client';
import { useRoles } from '@chemmangat/msal-next';

export default function AdminPanel() {
  const { roles, groups, hasRole, hasAnyRole, hasAllRoles, loading } = useRoles();

  if (loading) return <div>Loading permissions…</div>;

  return (
    <div>
      {/* Single role check */}
      {hasRole('Admin') && <button>Delete User</button>}

      {/* Any of these roles */}
      {hasAnyRole(['Admin', 'Editor']) && <button>Edit Content</button>}

      {/* All roles required */}
      {hasAllRoles(['Admin', 'Billing']) && <button>Manage Billing</button>}

      {/* Group membership */}
      {groups.includes('00000000-0000-0000-0000-000000000000') && (
        <div>You are in the Finance group</div>
      )}

      <pre>Your roles: {roles.join(', ')}</pre>
    </div>
  );
}
```

`useRoles` return values:

| Field | Type | Description |
|---|---|---|
| `roles` | `string[]` | Azure AD app roles from `idTokenClaims.roles`. |
| `groups` | `string[]` | Azure AD group IDs from Graph API. |
| `loading` | `boolean` | True while fetching groups. |
| `error` | `Error \| null` | Error if fetch failed. |
| `hasRole` | `(role: string) => boolean` | Check single role. |
| `hasGroup` | `(groupId: string) => boolean` | Check group membership. |
| `hasAnyRole` | `(roles: string[]) => boolean` | Check if user has at least one role. |
| `hasAllRoles` | `(roles: string[]) => boolean` | Check if user has all roles. |
| `refetch` | `() => Promise<void>` | Re-fetch roles and groups. |

---

### Role arrays in per-page auth

```tsx
// app/reports/page.tsx
'use client';

export const auth = {
  required: true,
  // User needs at least one of these roles
  roles: ['Admin', 'ReportViewer', 'Manager'],
  redirectTo: '/access-denied',
};

export default function ReportsPage() {
  return <h1>Reports</h1>;
}
```

---

### Custom validation function

```tsx
// app/premium/page.tsx
'use client';
import type { AccountInfo } from '@azure/msal-browser';

export const auth = {
  required: true,
  validate: async (account: AccountInfo): Promise<boolean> => {
    // Check custom claim from token
    const claims = account.idTokenClaims as any;

    // Must be a premium subscriber AND from an allowed domain
    return (
      claims?.subscription === 'premium' &&
      account.username.endsWith('@contoso.com')
    );
  },
  unauthorized: (
    <div>
      <h2>Premium Required</h2>
      <p>Upgrade your subscription to access this page.</p>
    </div>
  ),
};

export default function PremiumPage() {
  return <h1>Premium Content</h1>;
}
```

---

### withPageAuth HOC (manual usage)

```tsx
// app/settings/page.tsx
'use client';
import { withPageAuth } from '@chemmangat/msal-next';

function SettingsPage() {
  return <h1>Settings</h1>;
}

// Wrap manually instead of using the auth export
export default withPageAuth(SettingsPage, {
  required: true,
  roles: ['Admin'],
  redirectTo: '/login',
});
```

---

## Server-Side Protection

### getServerSession in Server Components

```tsx
// app/dashboard/page.tsx  (Server Component)
import { getServerSession } from '@chemmangat/msal-next/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session.isAuthenticated) {
    redirect('/login');
  }

  return (
    <div>
      <h1>Welcome, {session.username}</h1>
    </div>
  );
}
```

`ServerSession` fields:

| Field | Type | Description |
|---|---|---|
| `isAuthenticated` | `boolean` | Whether a valid session cookie exists. |
| `accountId` | `string \| undefined` | MSAL home account ID. |
| `username` | `string \| undefined` | User's email / UPN. |

> Note: `getServerSession` reads from the `msal.account` cookie. This cookie is set by `setServerSessionCookie` after a successful login. For production apps, consider a proper server-side session store (Redis, database) for more robust session management.

---

### Protecting API Route Handlers

```ts
// app/api/data/route.ts
import { getServerSession } from '@chemmangat/msal-next/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession();

  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Proceed with authenticated request
  const data = await fetchSomeData(session.username!);
  return NextResponse.json(data);
}
```

---

### Setting the session cookie after login

The `MsalAuthProvider` handles this automatically after a redirect login. For manual control:

```tsx
'use client';
import { useMsalAuth } from '@chemmangat/msal-next';
import { setServerSessionCookie } from '@chemmangat/msal-next/server';

export default function LoginPage() {
  const { loginRedirect, account } = useMsalAuth();

  const handleLogin = async () => {
    await loginRedirect(['User.Read']);
    // After redirect completes, set the cookie
    if (account) {
      await setServerSessionCookie(account);
    }
  };

  return <button onClick={handleLogin}>Sign in</button>;
}
```

---

### Middleware-based API protection

```ts
// middleware.ts
import { createAuthMiddleware } from '@chemmangat/msal-next';

export const middleware = createAuthMiddleware({
  protectedRoutes: [
    '/dashboard',
    '/api/protected',   // protect entire API namespace
    '/api/admin',
  ],
  publicOnlyRoutes: ['/login'],
  loginPath: '/login',
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

---

## Multi-Account Management

### useMultiAccount hook

```tsx
'use client';
import { useMultiAccount } from '@chemmangat/msal-next';

export default function AccountManager() {
  const {
    accounts,             // All signed-in accounts
    activeAccount,        // Currently active account
    hasMultipleAccounts,  // boolean
    accountCount,         // number
    switchAccount,        // (account: AccountInfo) => void
    addAccount,           // (scopes?: string[]) => Promise<void>
    removeAccount,        // (account: AccountInfo) => Promise<void>
    signOutAccount,       // (account: AccountInfo) => Promise<void>
    signOutAll,           // () => Promise<void>
    getAccountByUsername, // (username: string) => AccountInfo | undefined
    isActiveAccount,      // (account: AccountInfo) => boolean
  } = useMultiAccount();

  return (
    <div>
      <p>Active: {activeAccount?.name}</p>
      <p>Total accounts: {accountCount}</p>

      {accounts.map((account) => (
        <div key={account.homeAccountId}>
          <span>{account.name} ({account.username})</span>
          {!isActiveAccount(account) && (
            <button onClick={() => switchAccount(account)}>Switch</button>
          )}
          <button onClick={() => removeAccount(account)}>Remove</button>
        </div>
      ))}

      <button onClick={() => addAccount(['User.Read'])}>
        Add Another Account
      </button>

      {hasMultipleAccounts && (
        <button onClick={signOutAll}>Sign Out All</button>
      )}
    </div>
  );
}
```

---

### AccountSwitcher component

Drop-in dropdown for headers and nav bars:

```tsx
'use client';
import { AccountSwitcher } from '@chemmangat/msal-next';

export default function AppHeader() {
  return (
    <header>
      <h1>My App</h1>
      <AccountSwitcher
        showAvatars={true}
        maxAccounts={5}
        variant="default"          // 'default' | 'compact' | 'minimal'
        showAddButton={true}
        showRemoveButton={true}
        onSwitch={(account) => console.log('Switched to', account.name)}
        onAdd={() => console.log('Adding account')}
        onRemove={(account) => console.log('Removed', account.name)}
      />
    </header>
  );
}
```

`AccountSwitcher` props:

| Prop | Type | Default | Description |
|---|---|---|---|
| `showAvatars` | `boolean` | `true` | Show MS Graph profile photos. |
| `maxAccounts` | `number` | `5` | Maximum accounts allowed. |
| `variant` | `'default' \| 'compact' \| 'minimal'` | `'default'` | Visual style. |
| `showAddButton` | `boolean` | `true` | Show "Add Account" button. |
| `showRemoveButton` | `boolean` | `true` | Show remove button per account. |
| `onSwitch` | `(account: AccountInfo) => void` | — | Called when account is switched. |
| `onAdd` | `() => void` | — | Called when add is clicked. |
| `onRemove` | `(account: AccountInfo) => void` | — | Called when account is removed. |
| `renderAccount` | `(account, isActive) => ReactNode` | — | Custom account row renderer. |

---

### AccountList component

```tsx
'use client';
import { AccountList } from '@chemmangat/msal-next';

export default function AccountsPage() {
  return (
    <AccountList
      showAvatars={true}
      showDetails={true}
      showActiveIndicator={true}
      clickToSwitch={true}
      orientation="vertical"   // 'vertical' | 'horizontal'
      onAccountClick={(account) => console.log('Clicked', account.name)}
    />
  );
}
```

---

## Microsoft Graph API

### useGraphApi hook

```tsx
'use client';
import { useGraphApi } from '@chemmangat/msal-next';

export default function GraphExample() {
  const graph = useGraphApi();

  const fetchProfile = async () => {
    // GET /me
    const me = await graph.get('/me');
    console.log(me.displayName);

    // GET with custom scopes
    const messages = await graph.get('/me/messages', {
      scopes: ['Mail.Read'],
      version: 'v1.0',
    });

    // POST
    const event = await graph.post('/me/events', {
      subject: 'Team Meeting',
      start: { dateTime: '2026-04-01T10:00:00', timeZone: 'UTC' },
      end: { dateTime: '2026-04-01T11:00:00', timeZone: 'UTC' },
    }, { scopes: ['Calendars.ReadWrite'] });

    // PATCH
    await graph.patch('/me', { displayName: 'New Name' });

    // DELETE
    await graph.delete(`/me/messages/${messages.value[0].id}`, {
      scopes: ['Mail.ReadWrite'],
    });
  };

  return <button onClick={fetchProfile}>Fetch from Graph</button>;
}
```

`useGraphApi` methods all accept `GraphApiOptions`:

| Option | Type | Default | Description |
|---|---|---|---|
| `scopes` | `string[]` | `['User.Read']` | Scopes for this request. |
| `version` | `'v1.0' \| 'beta'` | `'v1.0'` | Graph API version. |
| `debug` | `boolean` | `false` | Log request/response. |

---

### useUserProfile hook

```tsx
'use client';
import { useUserProfile } from '@chemmangat/msal-next';

export default function ProfileCard() {
  const { profile, loading, error, refetch } = useUserProfile();

  if (loading) return <div>Loading profile…</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!profile) return null;

  return (
    <div>
      {profile.photo && <img src={profile.photo} alt={profile.displayName} />}
      <h2>{profile.displayName}</h2>
      <p>{profile.jobTitle} · {profile.department}</p>
      <p>{profile.mail}</p>
      <p>{profile.officeLocation}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

With custom profile fields:

```tsx
interface MyProfile extends UserProfile {
  extension_customAttribute: string;
}

const { profile } = useUserProfile<MyProfile>();
console.log(profile?.extension_customAttribute);
```

`UserProfile` includes 40+ fields: `id`, `displayName`, `givenName`, `surname`, `userPrincipalName`, `mail`, `jobTitle`, `department`, `companyName`, `officeLocation`, `mobilePhone`, `businessPhones`, `preferredLanguage`, `employeeId`, `employeeHireDate`, `employeeType`, `country`, `city`, `state`, `streetAddress`, `postalCode`, `usageLocation`, `manager`, `aboutMe`, `birthday`, `interests`, `skills`, `schools`, `pastProjects`, `responsibilities`, `mySite`, `faxNumber`, `accountEnabled`, `ageGroup`, `userType`, `photo` (blob URL).

---

### UserAvatar component

```tsx
'use client';
import { UserAvatar } from '@chemmangat/msal-next';

export default function Nav() {
  return (
    <UserAvatar
      size={40}              // pixels, default 40
      showTooltip={true}     // hover tooltip with name
      fallbackImage="/default-avatar.png"
    />
  );
}
```

---

## Token Refresh

### Automatic refresh via MSALProvider

```tsx
<MSALProvider
  clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
  tenantId={process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID!}
  autoRefreshToken={true}
  refreshBeforeExpiry={300}   // refresh 5 minutes before expiry
  scopes={['User.Read']}
>
  {children}
</MSALProvider>
```

### useTokenRefresh hook

```tsx
'use client';
import { useTokenRefresh } from '@chemmangat/msal-next';

export default function SessionWarning() {
  const { expiresIn, isExpiringSoon, refresh, lastRefresh } = useTokenRefresh({
    enabled: true,
    refreshBeforeExpiry: 300,
    scopes: ['User.Read'],
    onRefresh: (expiresIn) => console.log(`Token refreshed, expires in ${expiresIn}s`),
    onError: (error) => console.error('Refresh failed:', error),
  });

  if (isExpiringSoon) {
    return (
      <div className="warning-banner">
        Session expires in {Math.floor((expiresIn ?? 0) / 60)} minutes.
        <button onClick={refresh}>Extend Session</button>
      </div>
    );
  }

  return null;
}
```

`useTokenRefresh` return values:

| Field | Type | Description |
|---|---|---|
| `expiresIn` | `number \| null` | Seconds until token expires. |
| `isExpiringSoon` | `boolean` | True when within `refreshBeforeExpiry` seconds. |
| `refresh` | `() => Promise<void>` | Manually trigger a refresh. |
| `lastRefresh` | `Date \| null` | Timestamp of last successful refresh. |

---

## UI Components Reference

### MicrosoftSignInButton

```tsx
<MicrosoftSignInButton
  text="Sign in with Microsoft"
  variant="dark"          // 'dark' | 'light'
  size="medium"           // 'small' | 'medium' | 'large'
  scopes={['User.Read']}
  onSuccess={() => router.push('/dashboard')}
  onError={(error) => console.error(error)}
/>
```

### SignOutButton

```tsx
<SignOutButton
  text="Sign out"
  variant="light"
  size="medium"
  onSuccess={() => router.push('/')}
  onError={(error) => console.error(error)}
/>
```

### AuthStatus

```tsx
<AuthStatus
  showDetails={true}
  renderLoading={() => <span>Checking…</span>}
  renderAuthenticated={(username) => <span>Signed in as {username}</span>}
  renderUnauthenticated={() => <span>Not signed in</span>}
/>
```

### ErrorBoundary

```tsx
<ErrorBoundary
  fallback={(error, reset) => (
    <div>
      <p>Authentication error: {error.message}</p>
      <button onClick={reset}>Try Again</button>
    </div>
  )}
  onError={(error, info) => logToSentry(error, info)}
  debug={process.env.NODE_ENV === 'development'}
>
  <MSALProvider clientId="...">
    <App />
  </MSALProvider>
</ErrorBoundary>
```

---

## Migration Guides

### Migrating from v4.x to v5.1.x

v5.1.0 is fully backward-compatible with v4.x. No breaking changes.

**New features you can opt into:**

```bash
npm install @chemmangat/msal-next@^5.1.0
```

1. Replace `authorityType` with `multiTenant.type`:

```tsx
// Before (v4)
<MSALProvider authorityType="common" />

// After (v5.1) — preferred
<MSALProvider multiTenant={{ type: 'multi' }} />
```

2. Add tenant allow/block lists:

```tsx
<MSALProvider
  multiTenant={{
    type: 'multi',
    allowList: ['contoso.com'],
    requireMFA: true,
  }}
  onTenantDenied={(reason) => router.push('/unauthorized')}
/>
```

3. Use `useTenant()` for tenant context:

```tsx
const { tenantDomain, isGuestUser } = useTenant();
```

4. Add per-page tenant restrictions:

```tsx
export const auth = {
  required: true,
  tenant: { allowList: ['contoso.com'] },
};
```

---

### Migrating from v3.x to v4.x

v4.0 introduced Zero-Config Protected Routes. No breaking changes from v3.

```bash
npm install @chemmangat/msal-next@^4.0.0
```

New in v4:
- `export const auth = { required: true }` per-page protection
- `protection` prop on `MSALProvider`
- `withPageAuth` HOC

---

### Migrating from v2.x to v3.x

v3.0 had breaking changes:

1. **Node.js 18+ required**
2. **`ServerSession.accessToken` removed** — use client-side `acquireToken()` instead:

```tsx
// Before (v2)
const session = await getServerSession();
const token = session.accessToken; // ❌ removed

// After (v3+)
'use client';
const { acquireToken } = useMsalAuth();
const token = await acquireToken(['User.Read']); // ✅
```

3. **MSAL packages updated**:

```bash
npm install @azure/msal-browser@^4.0.0 @azure/msal-react@^3.0.0
```

---

## Troubleshooting

### Redirect loop on protected pages

**Symptom**: Browser keeps redirecting between `/login` and `/dashboard`.

**Cause**: The middleware is protecting `/login` itself, or the session cookie isn't being set.

**Fix**:
1. Make sure `/login` is in `publicOnlyRoutes`, not `protectedRoutes`.
2. Ensure the `msal.account` cookie is set after login (the provider does this automatically on redirect completion).
3. Check your `matcher` pattern excludes `_next/static` and `_next/image`.

```ts
// middleware.ts — correct setup
export const middleware = createAuthMiddleware({
  protectedRoutes: ['/dashboard'],
  publicOnlyRoutes: ['/login'],  // ← must be here
  loginPath: '/login',
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

---

### AADSTS50011 — Redirect URI mismatch

**Symptom**: `AADSTS50011: The redirect URI specified in the request does not match the redirect URIs configured for the application.`

**Fix**:
1. Go to Azure Portal → App registrations → your app → **Authentication**
2. Under **Single-page application**, add the exact URI your app uses
3. Common URIs to add: `http://localhost:3000`, `https://yourdomain.com`
4. The URI must match **exactly** — no trailing slash differences

---

### AADSTS65001 — Admin consent required

**Symptom**: `AADSTS65001: The user or administrator has not consented to use the application.`

**Fix**:
1. Go to Azure Portal → App registrations → your app → **API permissions**
2. Click **Grant admin consent for [your tenant]**
3. Or add `prompt: 'consent'` to force the consent dialog:

```tsx
const { loginRedirect } = useMsalAuth();
await loginRedirect(['User.Read']); // consent dialog shown on first login
```

---

### AADSTS700016 — Application not found in directory

**Symptom**: `AADSTS700016: Application with identifier '...' was not found in the directory.`

**Fix**: Your `clientId` or `tenantId` is wrong. Double-check them in Azure Portal → App registrations → Overview.

---

### CORS errors on Graph API calls

**Symptom**: `Access to fetch at 'https://graph.microsoft.com/...' has been blocked by CORS policy.`

**Fix**: CORS errors on Graph API calls are almost always caused by an expired or missing token. Make sure you're passing the `Authorization` header:

```tsx
const token = await acquireToken(['User.Read']);
const res = await fetch('https://graph.microsoft.com/v1.0/me', {
  headers: { Authorization: `Bearer ${token}` },  // ← required
});
```

Or use `useGraphApi()` which handles this automatically.

---

### Token expiration / silent token failure

**Symptom**: API calls fail after ~1 hour with `interaction_required` error.

**Fix**: Enable `autoRefreshToken` on the provider:

```tsx
<MSALProvider
  clientId="..."
  autoRefreshToken={true}
  refreshBeforeExpiry={300}
>
```

Or use `acquireToken()` (not `acquireTokenSilent()`) — it automatically falls back to a redirect if silent acquisition fails.

---

### "inProgress" is always true

**Symptom**: `inProgress` from `useMsalAuth()` never becomes `false`.

**Fix**: This usually means MSAL is stuck handling a redirect response. Make sure `MSALProvider` (or `MsalAuthProvider`) is at the root of your app and wraps all pages. Also check that your redirect URI is registered in Azure AD.

---

### Environment variables not loading

**Symptom**: `clientId is required` error even though `.env.local` is set.

**Fix**:
1. Variables exposed to the browser **must** be prefixed with `NEXT_PUBLIC_`
2. Restart the dev server after changing `.env.local`
3. Never commit `.env.local` to git

```bash
# .env.local
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=12345678-1234-1234-1234-123456789012
NEXT_PUBLIC_AZURE_AD_TENANT_ID=87654321-4321-4321-4321-210987654321
```

---

### Development config validation

The library automatically validates your config in development mode and prints helpful warnings to the console. Look for `[MSAL-Next]` messages when you start your dev server.

You can also run validation manually:

```tsx
import { validateConfig, displayValidationResults } from '@chemmangat/msal-next';

const result = validateConfig({
  clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!,
  tenantId: process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID,
});

displayValidationResults(result);
```

---

## Examples

See the [`examples/`](./examples/) folder for complete, runnable examples:

| Example | Description |
|---|---|
| [`basic/`](./examples/basic/) | Minimal setup with sign-in/sign-out |
| [`multi-tenant/`](./examples/multi-tenant/) | Multi-tenant SaaS with allow-list |
| [`rbac/`](./examples/rbac/) | Role-based access control |
| [`middleware-only/`](./examples/middleware-only/) | Edge middleware protection |
| [`per-page-only/`](./examples/per-page-only/) | Per-page auth exports |
| [`hybrid/`](./examples/hybrid/) | Middleware + per-page combined |
| [`b2c/`](./examples/b2c/) | Azure AD B2C custom policies |
| [`edge-runtime/`](./examples/edge-runtime/) | Edge runtime compatibility |

---

## Deployment Checklist

### Azure AD settings for production

- [ ] Add your production domain to **Redirect URIs** (e.g. `https://yourdomain.com`)
- [ ] Add your production domain to **Front-channel logout URL** if using logout
- [ ] Set **Supported account types** correctly for your use case
- [ ] Grant **admin consent** for all required API permissions
- [ ] Configure **App roles** if using RBAC
- [ ] Set **Token lifetime policies** if you need custom expiry
- [ ] Enable **Conditional Access** policies if required (MFA, compliant devices)
- [ ] Review **Authentication** → **Implicit grant** — ensure it is disabled for SPAs (use auth code flow)

### Environment variables

- [ ] Set `NEXT_PUBLIC_AZURE_AD_CLIENT_ID` in your hosting platform
- [ ] Set `NEXT_PUBLIC_AZURE_AD_TENANT_ID` in your hosting platform
- [ ] Never commit `.env.local` to source control
- [ ] Use separate Azure AD app registrations for dev/staging/production

### Security settings

- [ ] Use `cacheLocation: 'sessionStorage'` (default) — not `localStorage` unless you need persistence
- [ ] Set `allowedRedirectUris` to prevent open redirect attacks:

```tsx
<MSALProvider
  clientId="..."
  allowedRedirectUris={[
    'https://yourdomain.com',
    'https://staging.yourdomain.com',
  ]}
>
```

- [ ] Enable `autoRefreshToken` to prevent session interruptions
- [ ] Use HTTPS in production — HTTP will cause `AADSTS50011`
- [ ] Set `storeAuthStateInCookie: false` unless you need IE11 support

### Next.js settings

- [ ] Ensure `middleware.ts` matcher excludes `_next/static`, `_next/image`, and `favicon.ico`
- [ ] Set `navigateToLoginRequestUrl: true` to return users to their original page after login
- [ ] Test the full auth flow in a production build (`next build && next start`) before deploying

### Monitoring

- [ ] Enable `enableLogging: true` in staging to catch auth issues early
- [ ] Set up error tracking (Sentry, Datadog) with the `ErrorBoundary` component's `onError` callback
- [ ] Monitor token refresh failures with `useTokenRefresh`'s `onError` callback

---

## Advanced Utilities

### Debug logger

```tsx
import { getDebugLogger } from '@chemmangat/msal-next';

const logger = getDebugLogger({
  enabled: process.env.NODE_ENV === 'development',
  level: 'debug',
  enablePerformance: true,
  enableNetworkLogs: true,
});

logger.info('User logged in', { username: 'user@example.com' });

// Performance tracking
logger.startTiming('token-acquisition');
const token = await acquireToken(['User.Read']);
logger.endTiming('token-acquisition');

// Export logs for debugging
logger.downloadLogs('debug-logs.json');
```

### Retry with exponential backoff

```tsx
import { retryWithBackoff } from '@chemmangat/msal-next';

const token = await retryWithBackoff(
  () => acquireToken(['User.Read']),
  { maxRetries: 3, initialDelay: 1000 }
);
```

### Error handling

```tsx
import { wrapMsalError } from '@chemmangat/msal-next';

try {
  await loginRedirect();
} catch (error) {
  const msalError = wrapMsalError(error);

  if (msalError.isUserCancellation()) {
    return; // user closed the popup — not a real error
  }

  if (msalError.requiresInteraction()) {
    await loginRedirect(); // retry with interaction
    return;
  }

  console.error(msalError.toConsoleString()); // actionable message with fix steps
  throw msalError;
}
```

### getMsalInstance (advanced)

Access the underlying MSAL `PublicClientApplication` instance directly:

```tsx
import { getMsalInstance } from '@chemmangat/msal-next';

const instance = getMsalInstance();
if (instance) {
  const accounts = instance.getAllAccounts();
  console.log('All accounts:', accounts);
}
```

---

## Peer Dependencies

| Package | Version |
|---|---|
| `next` | `>=14.0.0` |
| `react` | `>=18.0.0` |
| `react-dom` | `>=18.0.0` |
| `@azure/msal-browser` | `^3.11.0 \|\| ^4.0.0` |
| `@azure/msal-react` | `^2.0.0 \|\| ^3.0.0` |

---

## License

MIT © [Hari Manoj (chemmangat)](https://github.com/chemmangat)

---

## Links

- [npm package](https://www.npmjs.com/package/@chemmangat/msal-next)
- [GitHub repository](https://github.com/chemmangat/msal-next)
- [Issue tracker](https://github.com/chemmangat/msal-next/issues)
- [Discussions](https://github.com/chemmangat/msal-next/discussions)
- [Changelog](./CHANGELOG.md)
- [Security policy](./SECURITY.md)
