# @chemmangat/msal-next

Fully configurable MSAL (Microsoft Authentication Library) package for Next.js App Router with TypeScript support.

## 🚀 Quick Start

```bash
npm install @chemmangat/msal-next @azure/msal-browser @azure/msal-react
```

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
>
  {children}
</MsalAuthProvider>
```

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
} = useMsalAuth();
```

## 🔗 Links

- [Documentation](https://msal-next.chemmangat.dev)
- [GitHub](https://github.com/chemmangat/msal-next)
- [npm](https://www.npmjs.com/package/@chemmangat/msal-next)
- [Examples](https://github.com/chemmangat/msal-next/tree/main/example)

## 📄 License

MIT © Chemmangat
