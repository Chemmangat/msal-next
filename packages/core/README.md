# @chemmangat/msal-next

Fully configurable MSAL (Microsoft Authentication Library) package for Next.js App Router with TypeScript support.

## 🚀 Quick Start

```bash
npm install @chemmangat/msal-next @azure/msal-browser @azure/msal-react
```

> Supports both v3 and v4 of `@azure/msal-browser` and v2/v3 of `@azure/msal-react`

```tsx
// app/layout.tsx
import { MsalAuthProvider } from '@chemmangat/msal-next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MsalAuthProvider clientId="your-client-id">
          {children}
        </MsalAuthProvider>
      </body>
    </html>
  );
}
```

```tsx
// app/page.tsx
'use client';
import { useMsalAuth } from '@chemmangat/msal-next';

export default function Home() {
  const { isAuthenticated, loginPopup } = useMsalAuth();
  
  if (!isAuthenticated) {
    return <button onClick={() => loginPopup()}>Sign In</button>;
  }
  
  return <div>Welcome!</div>;
}
```

## 📚 Documentation

Visit [https://msal-next.chemmangat.dev](https://msal-next.chemmangat.dev) for full documentation.

## ✨ Features

- ✅ Next.js 14+ App Router support
- ✅ TypeScript with full type definitions
- ✅ Multi-tenant and single-tenant authentication
- ✅ Popup and redirect authentication flows
- ✅ Automatic token acquisition with silent refresh
- ✅ Zero configuration for simple use cases
- ✅ Highly configurable when needed
- ✅ SSR/SSG safe - works seamlessly with server-rendered pages

## 📖 API

### MsalAuthProvider

```tsx
<MsalAuthProvider
  clientId="required"
  tenantId="optional"
  authorityType="common" // 'common' | 'organizations' | 'consumers' | 'tenant'
  scopes={['User.Read']}
  cacheLocation="sessionStorage"
  enableLogging={false}
  loadingComponent={<div>Loading...</div>}
  onInitialized={(instance) => {
    // Optional: Access MSAL instance after initialization
    console.log('MSAL initialized');
  }}
>
  {children}
</MsalAuthProvider>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `clientId` | `string` | required | Azure AD Application (client) ID |
| `tenantId` | `string` | optional | Azure AD Directory (tenant) ID |
| `authorityType` | `'common' \| 'organizations' \| 'consumers' \| 'tenant'` | `'common'` | Authority type |
| `scopes` | `string[]` | `['User.Read']` | Default scopes |
| `cacheLocation` | `'sessionStorage' \| 'localStorage' \| 'memoryStorage'` | `'sessionStorage'` | Cache location |
| `enableLogging` | `boolean` | `false` | Enable debug logging |
| `loadingComponent` | `ReactNode` | Loading message | Custom loading component |
| `onInitialized` | `(instance: IPublicClientApplication) => void` | optional | Callback after initialization |

### MicrosoftSignInButton

Pre-built button component with official Microsoft branding:

```tsx
<MicrosoftSignInButton
  variant="dark" // 'dark' | 'light'
  size="medium" // 'small' | 'medium' | 'large'
  text="Sign in with Microsoft"
  useRedirect={false}
  scopes={['User.Read']}
  onSuccess={() => console.log('Success!')}
  onError={(error) => console.error(error)}
/>
```

### useMsalAuth Hook

```tsx
const {
  isAuthenticated,
  account,
  accounts,
  inProgress,
  loginPopup,
  loginRedirect,
  logoutPopup,
  logoutRedirect,
  acquireToken,
  acquireTokenSilent,
  acquireTokenPopup,
  acquireTokenRedirect,
  clearSession,
} = useMsalAuth();
```

#### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `isAuthenticated` | `boolean` | Whether user is authenticated |
| `account` | `AccountInfo \| null` | Current authenticated account |
| `accounts` | `AccountInfo[]` | All accounts in cache |
| `inProgress` | `boolean` | Whether MSAL is performing an interaction |
| `loginPopup` | `(scopes?: string[]) => Promise<void>` | Login using popup |
| `loginRedirect` | `(scopes?: string[]) => Promise<void>` | Login using redirect |
| `logoutPopup` | `() => Promise<void>` | Logout using popup |
| `logoutRedirect` | `() => Promise<void>` | Logout using redirect |
| `acquireToken` | `(scopes: string[]) => Promise<string>` | Acquire token silently with popup fallback |
| `acquireTokenSilent` | `(scopes: string[]) => Promise<string>` | Acquire token silently only |
| `acquireTokenPopup` | `(scopes: string[]) => Promise<string>` | Acquire token using popup |
| `acquireTokenRedirect` | `(scopes: string[]) => Promise<void>` | Acquire token using redirect |
| `clearSession` | `() => Promise<void>` | Clear MSAL cache without Microsoft logout |

### getMsalInstance()

Access the MSAL instance outside of React components:

```tsx
import { getMsalInstance } from '@chemmangat/msal-next';

// In API clients, middleware, etc.
const instance = getMsalInstance();
if (instance) {
  const accounts = instance.getAllAccounts();
}
```

## 🔧 Advanced Usage

### Using onInitialized for Axios Interceptors

Access the MSAL instance to set up API interceptors:

```tsx
// app/layout.tsx
'use client';
import { MsalAuthProvider } from '@chemmangat/msal-next';
import { setupAxiosInterceptors } from '@/lib/axios';

export default function RootLayout({ children }) {
  return (
    <MsalAuthProvider
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}
      onInitialized={(instance) => {
        // Set up Axios interceptors with MSAL instance
        setupAxiosInterceptors(instance);
      }}
    >
      {children}
    </MsalAuthProvider>
  );
}
```

```tsx
// lib/axios.ts
import axios from 'axios';
import { IPublicClientApplication } from '@azure/msal-browser';

export function setupAxiosInterceptors(msalInstance: IPublicClientApplication) {
  axios.interceptors.request.use(async (config) => {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      try {
        const response = await msalInstance.acquireTokenSilent({
          scopes: ['User.Read'],
          account: accounts[0],
        });
        config.headers.Authorization = `Bearer ${response.accessToken}`;
      } catch (error) {
        console.error('Token acquisition failed:', error);
      }
    }
    return config;
  });
}
```

### Using getMsalInstance() in API Clients

For non-React code like API clients or middleware:

```tsx
// lib/api-client.ts
import { getMsalInstance } from '@chemmangat/msal-next';

export async function fetchUserData() {
  const instance = getMsalInstance();
  if (!instance) {
    throw new Error('MSAL not initialized');
  }

  const accounts = instance.getAllAccounts();
  if (accounts.length === 0) {
    throw new Error('No authenticated user');
  }

  const response = await instance.acquireTokenSilent({
    scopes: ['User.Read'],
    account: accounts[0],
  });

  return fetch('/api/user', {
    headers: {
      Authorization: `Bearer ${response.accessToken}`,
    },
  });
}
```

### Silent Logout with clearSession()

Clear MSAL cache without redirecting to Microsoft logout:

```tsx
'use client';
import { useMsalAuth } from '@chemmangat/msal-next';

export function LogoutButton() {
  const { clearSession } = useMsalAuth();

  const handleLogout = async () => {
    // Call your backend logout API
    await fetch('/api/logout', { method: 'POST' });
    
    // Clear local MSAL cache without Microsoft redirect
    await clearSession();
    
    // Redirect to home
    window.location.href = '/';
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

### SSR/SSG Notes

This package is safe to use in server-rendered pages. The `MsalAuthProvider` automatically detects server-side rendering and skips MSAL initialization on the server, rendering the loading component instead. MSAL will initialize normally on the client side.

```tsx
// This works in both SSR and SSG pages
export default function Page() {
  return (
    <MsalAuthProvider clientId="...">
      <YourApp />
    </MsalAuthProvider>
  );
}
```

## 🔗 Links

- [Documentation](https://msal-next.chemmangat.dev)
- [GitHub](https://github.com/chemmangat/msal-next)
- [npm](https://www.npmjs.com/package/@chemmangat/msal-next)
- [Examples](https://github.com/chemmangat/msal-next/tree/main/example)

## 📄 License

MIT © Chemmangat
