# @chemmangat/msal-next

Production-grade MSAL authentication library for Next.js App Router with minimal boilerplate.

[![npm version](https://badge.fury.io/js/@chemmangat%2Fmsal-next.svg)](https://www.npmjs.com/package/@chemmangat/msal-next)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Security](https://img.shields.io/badge/Security-A+-green.svg)](./SECURITY.md)

> **📦 Current Version: 4.1.0** - Production-ready with automatic token refresh and enhanced security

---

## ⭐ Why Choose @chemmangat/msal-next?

### 🚀 **5-Minute Setup**
Get Azure AD authentication running in your Next.js app in just 5 minutes. No complex configuration, no boilerplate.

### 🔒 **Enterprise Security**
Built on Microsoft's official MSAL library. All authentication happens client-side - tokens never touch your server. [Read Security Policy →](./SECURITY.md)

### 🎯 **Production-Ready**
Used by 2,200+ developers in production. Automatic token refresh prevents unexpected logouts. Complete TypeScript support.

### 🤖 **AI-Friendly**
Complete documentation optimized for AI assistants. Setup instructions that work on the first try.

### ⚡ **Zero Boilerplate**
```tsx
<MSALProvider clientId="...">
  <MicrosoftSignInButton />
</MSALProvider>
```
That's it. You're done.

---

## 🎯 Top Features

| Feature | Description | Status |
|---------|-------------|--------|
| **Automatic Token Refresh** | Prevents unexpected logouts | ✅ v4.1.0 |
| **Complete TypeScript Types** | 30+ user profile fields | ✅ v4.0.2 |
| **Actionable Error Messages** | Fix instructions included | ✅ v4.0.2 |
| **Configuration Validation** | Catches mistakes in dev mode | ✅ v4.0.2 |
| **Zero-Config Protected Routes** | One line to protect pages | ✅ v4.0.1 |
| **Server Components Support** | Works in Next.js layouts | ✅ Always |
| **Microsoft Graph Integration** | Pre-configured API client | ✅ Always |
| **Role-Based Access Control** | Built-in RBAC support | ✅ Always |

---

## 🔒 Security First

**Your tokens never leave the browser:**
- ✅ Client-side authentication only
- ✅ No server-side token storage
- ✅ Microsoft's official MSAL library
- ✅ Secure token storage (sessionStorage/localStorage)
- ✅ Automatic error sanitization
- ✅ HTTPS enforcement in production

**[Read Complete Security Policy →](./SECURITY.md)**

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Install the Package

```bash
npm install @chemmangat/msal-next @azure/msal-browser @azure/msal-react
```

### Step 2: Get Your Azure AD Credentials

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **New registration**
4. Enter a name (e.g., "My Next.js App")
5. Select **Single-page application (SPA)**
6. Add redirect URI: `http://localhost:3000` (for development)
7. Click **Register**
8. Copy the **Application (client) ID** and **Directory (tenant) ID**

### Step 3: Configure Environment Variables

Create `.env.local` in your project root:

```bash
# .env.local
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=your-client-id-here
NEXT_PUBLIC_AZURE_AD_TENANT_ID=your-tenant-id-here
```

**Important:** 
- Replace `your-client-id-here` and `your-tenant-id-here` with actual values from Azure Portal
- Never commit `.env.local` to version control
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser (this is correct for MSAL)

**Security Note:** All authentication happens in the browser. Your tokens never touch your Next.js server. [Learn more →](./SECURITY.md)

### Step 4: Add Provider to Layout

```tsx
// app/layout.tsx (Server Component - no 'use client' needed!)
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

**Note:** MSALProvider is already marked as 'use client' internally. You don't need to add 'use client' to your layout.tsx!

### Step 5: Add Sign-In Button

```tsx
// app/page.tsx
'use client';

import { MicrosoftSignInButton, useMsalAuth } from '@chemmangat/msal-next';

export default function HomePage() {
  const { isAuthenticated, account } = useMsalAuth();

  if (isAuthenticated) {
    return (
      <div>
        <h1>Welcome, {account?.name}!</h1>
        <p>You are signed in as {account?.username}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome to My App</h1>
      <MicrosoftSignInButton />
    </div>
  );
}
```

### Step 6: Run Your App

```bash
npm run dev
```

Visit `http://localhost:3000` and click the sign-in button!

---

## 📋 Complete Setup Guide for AI Assistants

When implementing MSAL authentication in a Next.js project, follow these steps:

### 1. Installation

```bash
npm install @chemmangat/msal-next @azure/msal-browser@^4.0.0 @azure/msal-react@^3.0.0
```

### 2. Azure AD Configuration

**Required Azure AD Setup:**
- App registration created in Azure Portal
- Redirect URI configured: `http://localhost:3000` (dev) and `https://yourdomain.com` (prod)
- Platform type: **Single-page application (SPA)**
- API permissions: At minimum `User.Read` (usually granted by default)

**Get these values from Azure Portal:**
- `Application (client) ID` → Use as `NEXT_PUBLIC_AZURE_AD_CLIENT_ID`
- `Directory (tenant) ID` → Use as `NEXT_PUBLIC_AZURE_AD_TENANT_ID`

### 3. Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=12345678-1234-1234-1234-123456789012
NEXT_PUBLIC_AZURE_AD_TENANT_ID=87654321-4321-4321-4321-210987654321
```

**Critical Rules:**
- Variables MUST start with `NEXT_PUBLIC_` to be accessible in browser
- Use actual GUIDs, not placeholder text
- Never commit `.env.local` to version control
- Restart dev server after changing environment variables

### 4. Project Structure

```
your-app/
├── app/
│   ├── layout.tsx          # Add MSALProvider here
│   ├── page.tsx            # Add sign-in button here
│   └── dashboard/
│       └── page.tsx        # Protected page example
├── .env.local              # Environment variables
└── package.json
```

### 5. Implementation Files

**File 1: `app/layout.tsx` (Server Component)**

```tsx
import { MSALProvider } from '@chemmangat/msal-next';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

**File 2: `app/page.tsx` (Client Component)**

```tsx
'use client';

import { MicrosoftSignInButton, SignOutButton, useMsalAuth } from '@chemmangat/msal-next';

export default function HomePage() {
  const { isAuthenticated, account } = useMsalAuth();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>My App</h1>
      
      {isAuthenticated ? (
        <div>
          <p>Welcome, {account?.name}!</p>
          <p>Email: {account?.username}</p>
          <SignOutButton />
        </div>
      ) : (
        <div>
          <p>Please sign in to continue</p>
          <MicrosoftSignInButton />
        </div>
      )}
    </div>
  );
}
```

**File 3: `app/dashboard/page.tsx` (Protected Page)**

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

  if (loading) return <div>Loading profile...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>Name: {profile?.displayName}</p>
      <p>Email: {profile?.mail}</p>
      <p>Job Title: {profile?.jobTitle}</p>
      <p>Department: {profile?.department}</p>
    </div>
  );
}
```

### 6. Common Patterns

**Pattern 1: Check Authentication Status**

```tsx
'use client';

import { useMsalAuth } from '@chemmangat/msal-next';

export default function MyComponent() {
  const { isAuthenticated, account, inProgress } = useMsalAuth();

  if (inProgress) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;

  return <div>Hello, {account?.name}!</div>;
}
```

**Pattern 2: Get Access Token**

```tsx
'use client';

import { useMsalAuth } from '@chemmangat/msal-next';
import { useEffect, useState } from 'react';

export default function DataComponent() {
  const { acquireToken, isAuthenticated } = useMsalAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!isAuthenticated) return;

      try {
        const token = await acquireToken(['User.Read']);
        
        const response = await fetch('https://graph.microsoft.com/v1.0/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [isAuthenticated, acquireToken]);

  return <div>{/* Render data */}</div>;
}
```

**Pattern 3: Protect Routes**

```tsx
'use client';

import { AuthGuard } from '@chemmangat/msal-next';

export default function ProtectedPage() {
  return (
    <AuthGuard
      loadingComponent={<div>Checking authentication...</div>}
      fallbackComponent={<div>Redirecting to login...</div>}
    >
      <div>This content is protected</div>
    </AuthGuard>
  );
}
```

### 7. Configuration Options

```tsx
<MSALProvider
  // Required
  clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
  
  // Optional - for single-tenant apps
  tenantId={process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}
  
  // Optional - for multi-tenant apps (default: 'common')
  authorityType="common" // or "organizations", "consumers", "tenant"
  
  // Optional - default scopes (default: ['User.Read'])
  scopes={['User.Read', 'Mail.Read']}
  
  // Optional - enable debug logging (default: false)
  enableLogging={true}
  
  // Optional - custom redirect URI (default: window.location.origin)
  redirectUri="https://yourdomain.com"
  
  // Optional - cache location (default: 'sessionStorage')
  cacheLocation="sessionStorage" // or "localStorage", "memoryStorage"
  
  // NEW in v4.1.0 - automatic token refresh
  autoRefreshToken={true}        // Prevents unexpected logouts
  refreshBeforeExpiry={300}      // Refresh 5 min before expiry
>
  {children}
</MSALProvider>
```

### 8. Troubleshooting Checklist

**If authentication doesn't work:**

1. ✅ Check environment variables are set correctly
2. ✅ Restart dev server after adding `.env.local`
3. ✅ Verify redirect URI in Azure Portal matches your app URL
4. ✅ Ensure `'use client'` is at the TOP of files using hooks
5. ✅ Check browser console for errors
6. ✅ Enable debug logging: `enableLogging={true}`
7. ✅ Verify client ID and tenant ID are valid GUIDs

**Common Errors:**

- **"createContext only works in Client Components"** → Use `MSALProvider` (not `MsalAuthProvider`) in layout.tsx
- **"AADSTS50011: Redirect URI mismatch"** → Add your URL to Azure Portal → Authentication → Redirect URIs
- **"No active account"** → User needs to sign in first before calling `acquireToken()`
- **Environment variables undefined** → Restart dev server after creating `.env.local`

---

## 🎯 Key Features

- ✅ **Zero-Config Setup** - Works out of the box with minimal configuration
- ✅ **Automatic Token Refresh** - Prevents unexpected logouts (NEW in v4.1.0)
- ✅ **TypeScript First** - Complete type safety with 30+ user profile fields
- ✅ **Next.js 14+ Ready** - Built for App Router with Server Components support
- ✅ **Automatic Validation** - Catches configuration mistakes in development
- ✅ **Actionable Errors** - Clear error messages with fix instructions
- ✅ **Production Ready** - Used by 2,200+ developers in production
- ✅ **Fixed Interaction Issues** - No more "interaction in progress" errors (v4.1.0)

---

## 📚 API Reference

### Components

#### MSALProvider
Wrap your app to provide authentication context.

```tsx
<MSALProvider clientId="..." tenantId="...">
  {children}
</MSALProvider>
```

#### MicrosoftSignInButton
Pre-styled sign-in button with Microsoft branding.

```tsx
<MicrosoftSignInButton
  variant="dark" // or "light"
  size="medium"  // "small", "medium", "large"
  onSuccess={() => console.log('Signed in!')}
/>
```

#### SignOutButton
Pre-styled sign-out button.

```tsx
<SignOutButton
  variant="light"
  size="medium"
  onSuccess={() => console.log('Signed out!')}
/>
```

#### AuthGuard
Protect components that require authentication.

```tsx
<AuthGuard
  loadingComponent={<div>Loading...</div>}
  fallbackComponent={<div>Please sign in</div>}
>
  <ProtectedContent />
</AuthGuard>
```

#### UserAvatar
Display user photo from Microsoft Graph.

```tsx
<UserAvatar
  size={48}
  showTooltip={true}
  fallbackImage="/default-avatar.png"
/>
```

### Hooks

#### useMsalAuth()
Main authentication hook.

```tsx
const {
  account,           // Current user account
  accounts,          // All cached accounts
  isAuthenticated,   // Boolean: is user signed in?
  inProgress,        // Boolean: is auth in progress?
  loginRedirect,     // Function: sign in
  logoutRedirect,    // Function: sign out
  acquireToken,      // Function: get access token
} = useMsalAuth();
```

#### useUserProfile()
Fetch user profile from Microsoft Graph.

```tsx
const {
  profile,    // User profile with 30+ fields
  loading,    // Boolean: is loading?
  error,      // Error object if failed
  refetch,    // Function: refetch profile
  clearCache, // Function: clear cached profile
} = useUserProfile();

// Access profile fields
console.log(profile?.displayName);
console.log(profile?.department);
console.log(profile?.preferredLanguage);
console.log(profile?.employeeId);
```

#### useGraphApi()
Pre-configured Microsoft Graph API client.

```tsx
const graph = useGraphApi();

// GET request
const user = await graph.get('/me');

// POST request
const message = await graph.post('/me/messages', {
  subject: 'Hello',
  body: { content: 'World' }
});
```

#### useRoles()
Access user's Azure AD roles.

```tsx
const {
  roles,        // Array of role names
  groups,       // Array of group IDs
  hasRole,      // Function: check single role
  hasAnyRole,   // Function: check multiple roles
  hasAllRoles,  // Function: check all roles
} = useRoles();

if (hasRole('Admin')) {
  // Show admin content
}
```

---

## 🎓 Advanced Usage

### Automatic Token Refresh (NEW in v4.1.0)

Prevent unexpected logouts by automatically refreshing tokens before they expire:

```tsx
<MSALProvider
  clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
  autoRefreshToken={true}        // Enable automatic refresh
  refreshBeforeExpiry={300}      // Refresh 5 minutes before expiry
>
  {children}
</MSALProvider>
```

**Monitor token expiry:**

```tsx
'use client';

import { useTokenRefresh } from '@chemmangat/msal-next';

export default function SessionWarning() {
  const { expiresIn, isExpiringSoon } = useTokenRefresh();

  if (isExpiringSoon) {
    return (
      <div className="warning">
        ⚠️ Your session will expire in {Math.floor(expiresIn / 60)} minutes
      </div>
    );
  }

  return null;
}
```

### Multi-Tenant Applications

For apps that support any Azure AD tenant:

```tsx
<MSALProvider
  clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
  authorityType="common"  // No tenantId needed
>
  {children}
</MSALProvider>
```

### Custom Scopes

Request additional Microsoft Graph permissions:

```tsx
<MSALProvider
  clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
  scopes={['User.Read', 'Mail.Read', 'Calendars.Read', 'Files.Read']}
>
  {children}
</MSALProvider>
```

### Server-Side Session

Access authentication state in Server Components:

```tsx
// app/profile/page.tsx (Server Component)
import { getServerSession } from '@chemmangat/msal-next/server';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await getServerSession();

  if (!session.isAuthenticated) {
    redirect('/login');
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Welcome, {session.username}</p>
    </div>
  );
}
```

### Middleware Protection

Protect routes at the edge:

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

### Error Handling

Use enhanced error handling for better debugging:

```tsx
'use client';

import { useMsalAuth, wrapMsalError } from '@chemmangat/msal-next';

export default function LoginPage() {
  const { loginRedirect } = useMsalAuth();

  const handleLogin = async () => {
    try {
      await loginRedirect();
    } catch (error) {
      const msalError = wrapMsalError(error);
      
      // Check if user cancelled (not a real error)
      if (msalError.isUserCancellation()) {
        return;
      }
      
      // Display actionable error message
      console.error(msalError.toConsoleString());
    }
  };

  return <button onClick={handleLogin}>Sign In</button>;
}
```

### Custom Profile Fields

Extend UserProfile with organization-specific fields:

```tsx
'use client';

import { useUserProfile, UserProfile } from '@chemmangat/msal-next';

interface MyCompanyProfile extends UserProfile {
  customField: string;
}

export default function ProfilePage() {
  const { profile } = useUserProfile<MyCompanyProfile>();

  return (
    <div>
      <p>Department: {profile?.department}</p>
      <p>Custom Field: {profile?.customField}</p>
    </div>
  );
}
```

---

## 🔧 Configuration Reference

### MSALProvider Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `clientId` | `string` | ✅ Yes | - | Azure AD Application (client) ID |
| `tenantId` | `string` | No | - | Azure AD Directory (tenant) ID (for single-tenant) |
| `authorityType` | `'common' \| 'organizations' \| 'consumers' \| 'tenant'` | No | `'common'` | Authority type |
| `redirectUri` | `string` | No | `window.location.origin` | Redirect URI after authentication |
| `scopes` | `string[]` | No | `['User.Read']` | Default scopes |
| `cacheLocation` | `'sessionStorage' \| 'localStorage' \| 'memoryStorage'` | No | `'sessionStorage'` | Token cache location |
| `enableLogging` | `boolean` | No | `false` | Enable debug logging |

### Authority Types

- **`common`** - Multi-tenant (any Azure AD tenant or Microsoft account)
- **`organizations`** - Any organizational Azure AD tenant
- **`consumers`** - Microsoft personal accounts only
- **`tenant`** - Single-tenant (requires `tenantId`)

---

## 📖 Additional Resources

### Documentation
- [SECURITY.md](./SECURITY.md) - **Security policy and best practices** ⭐
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues and solutions
- [CHANGELOG.md](./CHANGELOG.md) - Version history
- [MIGRATION_GUIDE_v3.md](./MIGRATION_GUIDE_v3.md) - Migrating from v2.x
- [EXAMPLES_v4.0.2.md](./EXAMPLES_v4.0.2.md) - Code examples

### Security
- 🔒 [Security Policy](./SECURITY.md) - Complete security documentation
- 🛡️ [Best Practices](./SECURITY.md#-best-practices) - Security guidelines
- ⚠️ [Common Mistakes](./SECURITY.md#-common-security-mistakes) - What to avoid
- ✅ [Security Checklist](./SECURITY.md#-security-checklist) - Pre-deployment checklist

### Links
- 📦 [npm Package](https://www.npmjs.com/package/@chemmangat/msal-next)
- 🐛 [Report Issues](https://github.com/chemmangat/msal-next/issues)
- 💬 [Discussions](https://github.com/chemmangat/msal-next/discussions)
- ⭐ [GitHub Repository](https://github.com/chemmangat/msal-next)

### Microsoft Resources
- [Azure AD Documentation](https://learn.microsoft.com/en-us/azure/active-directory/)
- [MSAL.js Documentation](https://learn.microsoft.com/en-us/azure/active-directory/develop/msal-overview)
- [Microsoft Graph API](https://learn.microsoft.com/en-us/graph/overview)

---

## ❓ FAQ

**Q: Do I need to create an Azure AD app registration?**  
A: Yes, you need an app registration in Azure Portal to get the client ID and tenant ID.

**Q: Can I use this with Next.js Pages Router?**  
A: This package is designed for App Router. For Pages Router, use v2.x or consider migrating to App Router.

**Q: Is this free to use?**  
A: Yes, the package is MIT licensed and free. Azure AD has a free tier for up to 50,000 users.

**Q: Can I use this for multi-tenant SaaS apps?**  
A: Yes! Set `authorityType="common"` and omit `tenantId`.

**Q: How do I get additional user information?**  
A: Use `useUserProfile()` hook which provides 30+ fields from Microsoft Graph.

**Q: Can I customize the sign-in button?**  
A: Yes, `MicrosoftSignInButton` accepts `variant`, `size`, `className`, and `style` props.

**Q: Does this work with Azure AD B2C?**  
A: This package is designed for Azure AD. For B2C, you may need additional configuration.

**Q: How do I protect API routes?**  
A: Use `getServerSession()` in API routes or `createAuthMiddleware()` for edge protection.

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md) for details.

---

## 📄 License

MIT © [Chemmangat](https://github.com/chemmangat)

---

## 🙏 Acknowledgments

Built with:
- [@azure/msal-browser](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [@azure/msal-react](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Next.js](https://nextjs.org/)

---

## 📊 Stats

- 📦 2,200+ weekly downloads
- ⭐ Used in production by developers worldwide
- 🔒 Security-focused with regular updates
- 📚 Comprehensive documentation
- 🎯 TypeScript-first with complete type safety

---

**Need help?** Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) or [open an issue](https://github.com/chemmangat/msal-next/issues)!
