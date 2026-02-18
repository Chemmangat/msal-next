# @chemmangat/msal-next

<div align="center">
  <h3>Fully configurable MSAL authentication for Next.js App Router</h3>
  <p>Simple, powerful, and production-ready Microsoft authentication</p>
  
  [![npm version](https://badge.fury.io/js/@chemmangat%2Fmsal-next.svg)](https://www.npmjs.com/package/@chemmangat/msal-next)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

---

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
        <MsalAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}>
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
  const { isAuthenticated, account, loginPopup, logoutPopup } = useMsalAuth();
  
  if (!isAuthenticated) {
    return <button onClick={() => loginPopup()}>Sign In</button>;
  }
  
  return (
    <div>
      <h1>Hello, {account?.name}!</h1>
      <button onClick={() => logoutPopup()}>Sign Out</button>
    </div>
  );
}
```

## ✨ Features

- ✅ **Next.js 14+ App Router** - Built specifically for the App Router
- ✅ **TypeScript First** - Full type definitions included
- ✅ **Zero Config** - Sensible defaults, works out of the box
- ✅ **Fully Configurable** - Override anything when you need control
- ✅ **Multi-tenant Support** - Works with any Azure AD account
- ✅ **Token Management** - Automatic refresh with silent fallback
- ✅ **Popup & Redirect** - Support for both authentication flows
- ✅ **Production Ready** - Error handling and security best practices

## 📦 Project Structure

```
msal-next/
├── packages/core/          # 📦 NPM package (publish this)
│   ├── src/
│   │   ├── components/     # MsalAuthProvider
│   │   ├── hooks/          # useMsalAuth
│   │   ├── utils/          # Helper functions
│   │   ├── types.ts        # TypeScript types
│   │   └── index.ts        # Main exports
│   ├── package.json
│   └── tsup.config.ts
├── src/                    # 🌐 Documentation website
│   ├── app/
│   └── components/
└── README.md
```

## 🔧 Publishing the Package

### 1. Build the package

```bash
npm run build:package
```

This builds `packages/core` into the `dist/` folder.

### 2. Test locally (optional)

```bash
cd packages/core
npm pack
# Install the .tgz file in another project to test
```

### 3. Publish to npm

```bash
npm run publish:package
```

Or manually:

```bash
cd packages/core
npm publish --access public
```

## 🌐 Documentation Website

This repository includes a stunning dark-themed documentation website built with Next.js, Tailwind CSS, and Framer Motion.

### Run the docs locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see the documentation site.

### Deploy the docs

The documentation site can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **GitHub Pages**
- Any static hosting service

```bash
npm run build
npm run start
```

## 📖 Full Documentation

### MsalAuthProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `clientId` | `string` | **Required** | Azure AD Application (client) ID |
| `tenantId` | `string` | `undefined` | Azure AD Directory (tenant) ID |
| `authorityType` | `'common' \| 'organizations' \| 'consumers' \| 'tenant'` | `'common'` | Authority type |
| `scopes` | `string[]` | `['User.Read']` | Default scopes |
| `redirectUri` | `string` | `window.location.origin` | Redirect URI |
| `cacheLocation` | `'sessionStorage' \| 'localStorage' \| 'memoryStorage'` | `'sessionStorage'` | Cache location |
| `enableLogging` | `boolean` | `false` | Enable debug logging |
| `loadingComponent` | `ReactNode` | `<div>Loading...</div>` | Custom loading component |

### useMsalAuth Hook

```tsx
const {
  // State
  isAuthenticated,    // boolean
  account,           // AccountInfo | null
  accounts,          // AccountInfo[]
  inProgress,        // boolean
  
  // Login
  loginPopup,        // (scopes?: string[]) => Promise<void>
  loginRedirect,     // (scopes?: string[]) => Promise<void>
  
  // Logout
  logoutPopup,       // () => Promise<void>
  logoutRedirect,    // () => Promise<void>
  
  // Tokens
  acquireToken,      // (scopes: string[]) => Promise<string>
  acquireTokenSilent,    // (scopes: string[]) => Promise<string>
  acquireTokenPopup,     // (scopes: string[]) => Promise<string>
  acquireTokenRedirect,  // (scopes: string[]) => Promise<void>
} = useMsalAuth();
```

## 🎯 Use Cases

### Protected API Calls

```tsx
const { acquireToken } = useMsalAuth();

const fetchData = async () => {
  const token = await acquireToken(['User.Read']);
  const response = await fetch('https://graph.microsoft.com/v1.0/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.json();
};
```

### Environment Variables

```env
NEXT_PUBLIC_CLIENT_ID=your-client-id
NEXT_PUBLIC_TENANT_ID=your-tenant-id
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000
```

### Multi-tenant vs Single-tenant

```tsx
// Multi-tenant (any Azure AD account)
<MsalAuthProvider
  clientId="..."
  authorityType="common"
/>

// Single-tenant (specific organization)
<MsalAuthProvider
  clientId="..."
  tenantId="..."
  authorityType="tenant"
/>
```

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## 📄 License

MIT © Chemmangat

## 🔗 Links

- [npm Package](https://www.npmjs.com/package/@chemmangat/msal-next)
- [GitHub Repository](https://github.com/chemmangat/msal-next)
- [Example App](./example)
- [MSAL.js Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Azure AD Documentation](https://docs.microsoft.com/en-us/azure/active-directory/)

---

<div align="center">
  Made with ❤️ for developers
</div>
