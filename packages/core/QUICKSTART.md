# Quick Start Guide

Get up and running with @chemmangat/msal-next in 5 minutes.

## Prerequisites

- Next.js 14+ with App Router
- Azure AD application registration
- Node.js 18+

## Step 1: Install

```bash
npm install @chemmangat/msal-next @azure/msal-browser @azure/msal-react
```

## Step 2: Get Your Client ID

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to Azure Active Directory → App registrations
3. Create a new registration or select existing
4. Copy the "Application (client) ID"
5. Add redirect URI: `http://localhost:3000` (for development)

## Step 3: Setup Provider

Create or update your root layout:

```tsx
// app/layout.tsx
import { MsalAuthProvider } from '@chemmangat/msal-next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MsalAuthProvider clientId="YOUR_CLIENT_ID_HERE">
          {children}
        </MsalAuthProvider>
      </body>
    </html>
  );
}
```

## Step 4: Add Authentication

Create a simple login page:

```tsx
// app/page.tsx
'use client';

import {
  MicrosoftSignInButton,
  SignOutButton,
  useMsalAuth,
  UserAvatar,
} from '@chemmangat/msal-next';

export default function Home() {
  const { isAuthenticated, account } = useMsalAuth();

  if (isAuthenticated) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <UserAvatar size={48} />
          <div>
            <h1>Welcome, {account?.name}!</h1>
            <p>{account?.username}</p>
          </div>
        </div>
        <SignOutButton style={{ marginTop: '20px' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Sign in to continue</h1>
      <MicrosoftSignInButton />
    </div>
  );
}
```

## Step 5: Protect Routes (Optional)

Add middleware to protect routes:

```tsx
// middleware.ts
import { createAuthMiddleware } from '@chemmangat/msal-next';

export const middleware = createAuthMiddleware({
  protectedRoutes: ['/dashboard', '/profile'],
  loginPath: '/',
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

## Step 6: Run Your App

```bash
npm run dev
```

Visit `http://localhost:3000` and click "Sign in with Microsoft"!

## Next Steps

### Fetch User Data

```tsx
'use client';

import { useUserProfile } from '@chemmangat/msal-next';

export default function Profile() {
  const { profile, loading } = useUserProfile();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{profile?.displayName}</h1>
      <p>Email: {profile?.mail}</p>
      <p>Job Title: {profile?.jobTitle}</p>
    </div>
  );
}
```

### Call MS Graph API

```tsx
'use client';

import { useGraphApi } from '@chemmangat/msal-next';
import { useState } from 'react';

export default function Emails() {
  const graph = useGraphApi();
  const [emails, setEmails] = useState([]);

  const fetchEmails = async () => {
    const data = await graph.get('/me/messages', {
      scopes: ['Mail.Read'],
    });
    setEmails(data.value);
  };

  return (
    <div>
      <button onClick={fetchEmails}>Load Emails</button>
      {emails.map((email: any) => (
        <div key={email.id}>{email.subject}</div>
      ))}
    </div>
  );
}
```

### Check User Roles

```tsx
'use client';

import { useRoles } from '@chemmangat/msal-next';

export default function AdminPanel() {
  const { hasRole, loading } = useRoles();

  if (loading) return <div>Loading...</div>;

  if (!hasRole('Admin')) {
    return <div>Access denied</div>;
  }

  return <div>Admin content here</div>;
}
```

### Protect Components

```tsx
'use client';

import { AuthGuard } from '@chemmangat/msal-next';

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <div>This content requires authentication</div>
    </AuthGuard>
  );
}
```

## Common Issues

### "No active account" error

Make sure you're logged in before calling `acquireToken`:

```tsx
const { isAuthenticated, acquireToken } = useMsalAuth();

if (isAuthenticated) {
  const token = await acquireToken(['User.Read']);
}
```

### SSR Hydration Mismatch

Always use `'use client'` directive for components using auth hooks:

```tsx
'use client';

import { useMsalAuth } from '@chemmangat/msal-next';
```

### Redirect URI Mismatch

Ensure your redirect URI in Azure AD matches your app URL:
- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

## Environment Variables (Optional)

Create `.env.local`:

```env
NEXT_PUBLIC_MSAL_CLIENT_ID=your-client-id
NEXT_PUBLIC_MSAL_TENANT_ID=your-tenant-id
```

Use in your app:

```tsx
<MsalAuthProvider
  clientId={process.env.NEXT_PUBLIC_MSAL_CLIENT_ID!}
  tenantId={process.env.NEXT_PUBLIC_MSAL_TENANT_ID}
>
  {children}
</MsalAuthProvider>
```

## Need Help?

- 📖 [Full Documentation](./README.md)
- 🐛 [Report Issues](https://github.com/chemmangat/msal-next/issues)
- 💬 [Discussions](https://github.com/chemmangat/msal-next/discussions)

## What's Next?

- Explore all [components](./README.md#components)
- Learn about [hooks](./README.md#hooks)
- Set up [middleware](./README.md#middleware)
- Add [role-based access control](./README.md#role-based-access-control)
- Configure [debug logging](./README.md#debug-logger)

Happy coding! 🚀
