# Troubleshooting Guide

Common issues and their solutions for @chemmangat/msal-next.

## "createContext only works in Client Components"

### Error Message
```
createContext only works in Client Components. Add the "use client" directive at the top of the file to use it.
```

### Solution
Use `MSALProvider` instead of `MsalAuthProvider` in your layout.tsx:

**❌ Wrong:**
```tsx
// app/layout.tsx
import { MsalAuthProvider } from '@chemmangat/msal-next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MsalAuthProvider clientId="...">
          {children}
        </MsalAuthProvider>
      </body>
    </html>
  );
}
```

**✅ Correct:**
```tsx
// app/layout.tsx
import { MSALProvider } from '@chemmangat/msal-next';

export default function RootLayout({ children }) {
  return (
    <html>
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

### Why?
- Next.js App Router layouts are Server Components by default
- `MsalAuthProvider` uses React Context, which requires client-side rendering
- `MSALProvider` is a pre-configured wrapper that's already marked as `'use client'`

---

## "no_token_request_cache_error"

### Error Message
```
BrowserAuthError: no_token_request_cache_error
```

### Solution
This error is now handled automatically in v3.0.2+. If you're still seeing it:

1. **Update to the latest version:**
   ```bash
   npm install @chemmangat/msal-next@latest
   ```

2. **Clear your browser cache and cookies** for your app's domain

3. **Ensure you're using the correct redirect URI** in Azure AD:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`

### Why?
This error occurs when:
- User refreshes the page during authentication flow
- There's a mismatch between cached auth state and current request
- The package now handles this gracefully (v3.0.2+)

---

## "User cancelled" or Popup Closed

### Error Message
```
user_cancelled: User cancelled the flow
```

### Solution
This is expected behavior when users close the popup. The package handles this gracefully.

If you want to show a message to users:

```tsx
<MicrosoftSignInButton
  onError={(error) => {
    if (error.message.includes('user_cancelled')) {
      console.log('User closed the login popup');
      // Show a friendly message
    }
  }}
/>
```

---

## Environment Variables Not Working

### Symptoms
- `undefined` values for clientId or tenantId
- Authentication not initializing

### Solution

1. **Check your .env.local file exists:**
   ```bash
   # .env.local
   NEXT_PUBLIC_AZURE_AD_CLIENT_ID=your-client-id
   NEXT_PUBLIC_AZURE_AD_TENANT_ID=your-tenant-id
   ```

2. **Restart your dev server** after adding environment variables:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

3. **Verify the variables are prefixed with `NEXT_PUBLIC_`:**
   - ✅ `NEXT_PUBLIC_AZURE_AD_CLIENT_ID`
   - ❌ `AZURE_AD_CLIENT_ID` (won't work in client components)

---

## "Interaction already in progress"

### Error Message
```
Interaction already in progress
```

### Solution
This is a safety feature to prevent multiple concurrent login attempts. Wait for the current interaction to complete.

The package automatically prevents this in v3.0.2+, but if you're manually calling login methods:

```tsx
const { loginPopup, inProgress } = useMsalAuth();

const handleLogin = async () => {
  // Check if interaction is in progress
  if (inProgress) {
    console.log('Please wait for current login to complete');
    return;
  }
  
  await loginPopup();
};
```

---

## Token Acquisition Fails

### Symptoms
- `acquireToken()` throws errors
- Silent token acquisition fails

### Solution

1. **Ensure user is logged in:**
   ```tsx
   const { isAuthenticated, acquireToken } = useMsalAuth();
   
   if (!isAuthenticated) {
     // User needs to login first
     await loginPopup();
   }
   
   const token = await acquireToken(['User.Read']);
   ```

2. **Check the scopes are granted in Azure AD:**
   - Go to Azure Portal → App Registrations → Your App → API Permissions
   - Ensure the scopes you're requesting are listed and granted

3. **Use the fallback pattern:**
   ```tsx
   // acquireToken automatically falls back to popup if silent fails
   const token = await acquireToken(['User.Read']);
   ```

---

## Build Errors with package.json

### Error Message
```
Error parsing package.json file
```

### Solution
This was fixed in v3.0.1. Update to the latest version:

```bash
npm install @chemmangat/msal-next@latest
```

If you're still having issues:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Clear Next.js cache: `rm -rf .next`

---

## TypeScript Errors

### Symptoms
- Type errors with MSAL types
- Missing type definitions

### Solution

1. **Ensure peer dependencies are installed:**
   ```bash
   npm install @azure/msal-browser@^4.0.0 @azure/msal-react@^3.0.0
   ```

2. **Check your tsconfig.json includes:**
   ```json
   {
     "compilerOptions": {
       "moduleResolution": "bundler",
       "jsx": "preserve",
       "lib": ["dom", "dom.iterable", "esnext"]
     }
   }
   ```

---

## Still Having Issues?

1. **Enable debug logging:**
   ```tsx
   <MSALProvider
     clientId="..."
     enableLogging={true}
   >
     {children}
   </MSALProvider>
   ```

2. **Check the browser console** for detailed error messages

3. **Verify Azure AD configuration:**
   - Redirect URIs are correct
   - App is not expired
   - Required permissions are granted

4. **Open an issue on GitHub:**
   - Include error messages
   - Include relevant code snippets
   - Include package versions: `npm list @chemmangat/msal-next`

---

## Common Azure AD Configuration Issues

### Redirect URI Mismatch
- **Error:** `redirect_uri_mismatch`
- **Solution:** Add your app's URL to Azure AD → App Registrations → Authentication → Redirect URIs

### Missing Permissions
- **Error:** `consent_required` or `invalid_grant`
- **Solution:** Add required API permissions in Azure AD and grant admin consent if needed

### Multi-tenant Issues
- **Solution:** Use `authorityType: "common"` for multi-tenant apps:
  ```tsx
  <MSALProvider
    clientId="..."
    authorityType="common"
  >
    {children}
  </MSALProvider>
  ```
