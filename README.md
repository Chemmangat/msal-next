# MSAL Authentication Boilerplate

A clean, scalable, and easy-to-configure Microsoft Authentication Library (MSAL) boilerplate built with Next.js. Supports both multi-tenant (`/common`) and single-tenant configurations.

## Features

- ✅ Multi-tenant and single-tenant support
- ✅ TypeScript support
- ✅ Environment-based configuration
- ✅ Minimal, production-ready setup
- ✅ Easy to adapt to other frameworks

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Add your Azure AD app registration details (no quotes needed):

```env
NEXT_PUBLIC_CLIENT_ID=12345678-1234-1234-1234-123456789abc
NEXT_PUBLIC_TENANT_ID=87654321-4321-4321-4321-cba987654321
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000
NEXT_PUBLIC_AUTHORITY_TYPE=common
NEXT_PUBLIC_SCOPES=User.Read
```

**IMPORTANT:** 
- Replace the values with your actual Application (client) ID and Directory (tenant) ID from Azure Portal
- Do NOT use quotes around the values
- Restart the dev server after creating this file

### 3. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app in action.

## Configuration Options

### Authority Types

- **`common`** - Multi-tenant authentication (any Azure AD account)
- **`tenant`** - Single-tenant authentication (specific organization only)

Set via `NEXT_PUBLIC_AUTHORITY_TYPE` in `.env.local`.

### Scopes

Define the permissions your app needs (comma-separated):

```env
NEXT_PUBLIC_SCOPES=User.Read,Mail.Read,Calendars.Read
```

## Azure AD App Registration

1. Go to [Azure Portal](https://portal.azure.com) → Azure Active Directory → App registrations
2. Click "New registration"
3. Configure:
   - **Name**: Your app name
   - **Supported account types**:
     - Multi-tenant: "Accounts in any organizational directory"
     - Single-tenant: "Accounts in this organizational directory only"
   - **Redirect URI**: Web → `http://localhost:3000`
4. Copy the **Application (client) ID** → `NEXT_PUBLIC_CLIENT_ID`
5. Copy the **Directory (tenant) ID** → `NEXT_PUBLIC_TENANT_ID`
6. Under "Authentication", enable:
   - Access tokens
   - ID tokens
7. Under "API permissions", add required scopes (e.g., `User.Read`)

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (Server Component)
│   │   ├── page.tsx            # Main authentication page (Client Component)
│   │   └── globals.css         # Basic styles
│   ├── components/
│   │   └── MsalProviderWrapper.tsx  # MSAL Provider wrapper (Client Component)
│   └── config/
│       └── authConfig.ts       # MSAL configuration
├── .env.example                # Environment template
├── package.json
└── README.md
```

## Core MSAL Logic (Framework Agnostic)

The authentication logic can be adapted to any JavaScript framework. Here's the core implementation:

### 1. Configuration

```typescript
import { Configuration } from '@azure/msal-browser';

const msalConfig: Configuration = {
  auth: {
    clientId: 'YOUR_CLIENT_ID',
    authority: 'https://login.microsoftonline.com/common', // or /{tenantId}
    redirectUri: 'http://localhost:3000',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};
```

### 2. Initialize MSAL Instance

```typescript
import { PublicClientApplication } from '@azure/msal-browser';

const msalInstance = new PublicClientApplication(msalConfig);
await msalInstance.initialize();
```

### 3. Login

```typescript
const loginRequest = {
  scopes: ['User.Read'],
};

// Popup
await msalInstance.loginPopup(loginRequest);

// Redirect
await msalInstance.loginRedirect(loginRequest);
```

### 4. Get Accounts

```typescript
const accounts = msalInstance.getAllAccounts();
if (accounts.length > 0) {
  console.log('User is authenticated:', accounts[0]);
}
```

### 5. Acquire Token (for API calls)

```typescript
const request = {
  scopes: ['User.Read'],
  account: accounts[0],
};

try {
  const response = await msalInstance.acquireTokenSilent(request);
  const accessToken = response.accessToken;
  // Use token for API calls
} catch (error) {
  // Token expired, acquire interactively
  const response = await msalInstance.acquireTokenPopup(request);
  const accessToken = response.accessToken;
}
```

### 6. Logout

```typescript
await msalInstance.logoutPopup();
// or
await msalInstance.logoutRedirect();
```

## Adapting to Other Frameworks

### React (without Next.js)

Use `@azure/msal-react` with the same configuration:

```tsx
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';

const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <YourApp />
    </MsalProvider>
  );
}
```

### Next.js App Router (This Boilerplate)

Wrap your app with a client component provider:

```tsx
// components/MsalProviderWrapper.tsx
'use client';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';

const msalInstance = new PublicClientApplication(msalConfig);

export default function MsalProviderWrapper({ children }) {
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}

// app/layout.tsx
import MsalProviderWrapper from '@/components/MsalProviderWrapper';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MsalProviderWrapper>{children}</MsalProviderWrapper>
      </body>
    </html>
  );
}
```

### Vue.js

Use `@azure/msal-browser` directly:

```javascript
import { PublicClientApplication } from '@azure/msal-browser';

const msalInstance = new PublicClientApplication(msalConfig);

// In your Vue component
export default {
  methods: {
    async login() {
      await msalInstance.loginPopup(loginRequest);
    }
  }
}
```

### Angular

Use `@azure/msal-angular`:

```typescript
import { MsalModule } from '@azure/msal-angular';

@NgModule({
  imports: [
    MsalModule.forRoot(msalConfig, {
      interactionType: InteractionType.Popup,
      authRequest: loginRequest
    })
  ]
})
```

### Vanilla JavaScript

```javascript
import { PublicClientApplication } from '@azure/msal-browser';

const msalInstance = new PublicClientApplication(msalConfig);

document.getElementById('loginBtn').addEventListener('click', async () => {
  await msalInstance.loginPopup({ scopes: ['User.Read'] });
});
```

## Common Use Cases

### Protected API Calls

```typescript
const callApi = async () => {
  const accounts = msalInstance.getAllAccounts();
  const response = await msalInstance.acquireTokenSilent({
    scopes: ['User.Read'],
    account: accounts[0],
  });

  const data = await fetch('https://graph.microsoft.com/v1.0/me', {
    headers: {
      Authorization: `Bearer ${response.accessToken}`,
    },
  });

  return data.json();
};
```

### Handle Redirect After Login

```typescript
msalInstance.handleRedirectPromise().then((response) => {
  if (response) {
    console.log('Login successful:', response.account);
  }
});
```

## Troubleshooting

### "The request body must contain the following parameter: 'client_id'"

This error means your environment variables aren't loaded. Check:

1. You have created `.env` file (not just `.env.example`)
2. The file contains `NEXT_PUBLIC_CLIENT_ID=your-actual-client-id` (no quotes)
3. Restart the dev server after creating/modifying the env file
4. Verify the client ID is correct in Azure Portal

```bash
# Stop the server (Ctrl+C) and restart
npm run dev
```

### CORS Errors
Ensure your redirect URI is registered in Azure AD app registration.

### Token Expiration
Use `acquireTokenSilent` with fallback to `acquireTokenPopup` for automatic token refresh.

### Multi-tenant Issues
Verify "Supported account types" in Azure AD matches your `NEXT_PUBLIC_AUTHORITY_TYPE`.

## Resources

- [MSAL.js Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Azure AD Documentation](https://docs.microsoft.com/en-us/azure/active-directory/)
- [Microsoft Graph API](https://docs.microsoft.com/en-us/graph/)

## License

MIT
