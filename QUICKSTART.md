# Quick Start Guide

Get up and running with `@chemmangat/msal-next` in 5 minutes.

## 1. Install

```bash
npm install @chemmangat/msal-next @azure/msal-browser @azure/msal-react
```

## 2. Get Azure AD Credentials

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to: Azure Active Directory → App registrations → New registration
3. Fill in:
   - Name: "My App"
   - Supported account types: "Accounts in any organizational directory"
   - Redirect URI: Web → `http://localhost:3000`
4. Click "Register"
5. Copy these values:
   - **Application (client) ID** → This is your `clientId`
   - **Directory (tenant) ID** → This is your `tenantId`
6. Go to "Authentication" → Enable "ID tokens" and "Access tokens"
7. Go to "API permissions" → Add "User.Read" permission

## 3. Setup Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_CLIENT_ID=your-client-id-here
NEXT_PUBLIC_TENANT_ID=your-tenant-id-here
```

## 4. Wrap Your App

```tsx
// app/layout.tsx
import { MsalAuthProvider } from '@chemmangat/msal-next';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MsalAuthProvider
          clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}
          tenantId={process.env.NEXT_PUBLIC_TENANT_ID}
        >
          {children}
        </MsalAuthProvider>
      </body>
    </html>
  );
}
```

## 5. Add Authentication

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

## 6. Run Your App

```bash
npm run dev
```

Visit `http://localhost:3000` and click "Sign In"!

## Next Steps

- [Full Documentation](./README.md)
- [API Reference](./README.md#api-reference)
- [Examples](./example)
- [Troubleshooting](./README.md#troubleshooting)

## Common Issues

### "clientId is required"
Make sure your `.env.local` file exists and has `NEXT_PUBLIC_CLIENT_ID`.

### Popup blocked
Use redirect flow instead:
```tsx
const { loginRedirect } = useMsalAuth();
```

### CORS errors
Ensure `http://localhost:3000` is added as a redirect URI in Azure AD.

## Need Help?

Open an issue on [GitHub](https://github.com/chemmangat/msal-next/issues).
