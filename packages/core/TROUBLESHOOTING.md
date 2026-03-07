# Troubleshooting Guide

Common issues and solutions for @chemmangat/msal-next

## Table of Contents

1. [Common Mistakes](#common-mistakes)
2. [Top 5 Errors](#top-5-errors)
3. [Configuration Issues](#configuration-issues)
4. [Authentication Flow Issues](#authentication-flow-issues)
5. [Development Tips](#development-tips)

---

## Common Mistakes

### 1. Missing 'use client' Directive

**Problem:** You get an error: "createContext only works in Client Components"

**Solution:** Always place `'use client'` at the TOP of your file, before any imports:

```tsx
// ✅ CORRECT
'use client';

import { useMsalAuth } from '@chemmangat/msal-next';

export default function MyComponent() {
  const { isAuthenticated } = useMsalAuth();
  // ...
}
```

```tsx
// ❌ WRONG - 'use client' must be FIRST
import { useMsalAuth } from '@chemmangat/msal-next';

'use client';  // Too late!

export default function MyComponent() {
  // ...
}
```

### 2. Using MsalAuthProvider Instead of MSALProvider

**Problem:** Error in server-side layout.tsx

**Solution:** Use `MSALProvider` (not `MsalAuthProvider`) in your layout.tsx:

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

### 3. Missing Environment Variables

**Problem:** Authentication fails silently or with cryptic errors

**Solution:** Create `.env.local` with required variables:

```bash
# .env.local
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=12345678-1234-1234-1234-123456789012
NEXT_PUBLIC_AZURE_AD_TENANT_ID=87654321-4321-4321-4321-210987654321
```

**Important:** 
- Variables must start with `NEXT_PUBLIC_` to be accessible in the browser
- Restart your dev server after adding/changing environment variables
- Never commit `.env.local` to version control

### 4. Placeholder Values in Configuration

**Problem:** Authentication fails with "invalid client" error

**Solution:** Replace placeholder values with actual IDs from Azure Portal:

```tsx
// ❌ WRONG - Placeholder values
<MSALProvider
  clientId="your-client-id-here"
  tenantId="your-tenant-id-here"
>

// ✅ CORRECT - Actual GUIDs from Azure Portal
<MSALProvider
  clientId="12345678-1234-1234-1234-123456789012"
  tenantId="87654321-4321-4321-4321-210987654321"
>
```

### 5. HTTP in Production

**Problem:** Authentication fails in production with redirect URI error

**Solution:** Always use HTTPS in production:

```tsx
// ❌ WRONG - HTTP in production
redirectUri: "http://myapp.com"

// ✅ CORRECT - HTTPS in production
redirectUri: "https://myapp.com"

// ✅ CORRECT - HTTP only for localhost
redirectUri: "http://localhost:3000"
```

---

## Top 5 Errors

### Error 1: AADSTS50011 - Redirect URI Mismatch

**Error Message:**
```
AADSTS50011: The redirect URI 'http://localhost:3000' specified in the request does not match the redirect URIs configured for the application.
```

**What it means:** Your app is trying to redirect to a URL that's not registered in Azure AD.

**How to fix:**

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to: Azure Active Directory → App registrations → Your app
3. Click "Authentication" in the left sidebar
4. Under "Single-page application", click "Add URI"
5. Add your redirect URI:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
6. Click "Save"

**Pro tip:** You can add multiple redirect URIs for different environments.

---

### Error 2: AADSTS65001 - Admin Consent Required

**Error Message:**
```
AADSTS65001: The user or administrator has not consented to use the application.
```

**What it means:** Your app requires permissions that need admin approval.

**How to fix:**

**Option 1: Grant admin consent (if you're an admin)**
1. Go to Azure Portal → App registrations → Your app
2. Click "API permissions"
3. Click "Grant admin consent for [Your Organization]"
4. Confirm the consent

**Option 2: Request admin consent (if you're not an admin)**
1. Contact your Azure AD administrator
2. Ask them to grant consent for your app
3. Provide them with your Application (client) ID

**Option 3: Use delegated permissions**
- Change your app to use delegated permissions instead of application permissions
- Delegated permissions don't require admin consent

---

### Error 3: Missing Environment Variables

**Error Message:**
```
NEXT_PUBLIC_AZURE_AD_CLIENT_ID not found
```

**What it means:** Required environment variables are not set.

**How to fix:**

1. Create `.env.local` in your project root:

```bash
# .env.local
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=your-client-id
NEXT_PUBLIC_AZURE_AD_TENANT_ID=your-tenant-id
```

2. Get your IDs from Azure Portal:
   - Client ID: App registrations → Your app → Overview → Application (client) ID
   - Tenant ID: Azure Active Directory → Properties → Tenant ID

3. Restart your development server:
```bash
npm run dev
```

**Important:** Never commit `.env.local` to Git!

---

### Error 4: AADSTS700016 - Invalid Client

**Error Message:**
```
AADSTS700016: Application with identifier 'xxx' was not found in the directory.
```

**What it means:** The client ID is incorrect or the app doesn't exist.

**How to fix:**

1. Verify your client ID in Azure Portal:
   - Go to App registrations → Your app
   - Copy the "Application (client) ID" from the Overview page

2. Update your `.env.local`:
```bash
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=correct-client-id-here
```

3. Ensure the format is a GUID:
   - Correct: `12345678-1234-1234-1234-123456789012`
   - Wrong: `my-app-name` or `12345`

4. Restart your dev server

---

### Error 5: AADSTS90002 - Invalid Tenant

**Error Message:**
```
AADSTS90002: Tenant 'xxx' not found.
```

**What it means:** The tenant ID is incorrect or you're using the wrong authority type.

**How to fix:**

**Option 1: Fix tenant ID (for single-tenant apps)**
```tsx
<MSALProvider
  clientId="your-client-id"
  tenantId="correct-tenant-id"  // Get from Azure Portal
  authorityType="tenant"
>
```

**Option 2: Use multi-tenant (for apps supporting any Azure AD)**
```tsx
<MSALProvider
  clientId="your-client-id"
  authorityType="common"  // No tenantId needed
>
```

**Option 3: Organizations only (any organizational Azure AD)**
```tsx
<MSALProvider
  clientId="your-client-id"
  authorityType="organizations"  // No tenantId needed
>
```

---

## Configuration Issues

### Issue: Configuration Validation Warnings

**Problem:** You see warnings in the console about configuration issues.

**Solution:** The package includes automatic configuration validation in development mode. Follow the fix instructions in the console output.

**Example warning:**
```
⚠️  Warnings (should fix)

clientId:
  Client ID appears to be a placeholder

  Fix:
  Replace the placeholder with your actual Application (client) ID from Azure Portal.
```

**How to fix:** Follow the instructions in the warning message.

---

### Issue: Cookies Not Working

**Problem:** Authentication state is lost on page refresh.

**Solution:** Ensure cookies are enabled and not blocked:

1. Check browser settings - cookies must be enabled
2. Check for browser extensions blocking cookies
3. In production, ensure your domain is properly configured
4. For localhost, ensure you're using `http://localhost:3000` (not `127.0.0.1`)

---

## Authentication Flow Issues

### Issue: Infinite Redirect Loop

**Problem:** Page keeps redirecting back and forth.

**Solution:**

1. Check your middleware configuration:
```tsx
// middleware.ts
export const middleware = createAuthMiddleware({
  protectedRoutes: ['/dashboard'],
  publicOnlyRoutes: ['/login'],  // Don't protect login page!
  loginPath: '/login',
});
```

2. Ensure login page is not protected
3. Clear browser cache and cookies
4. Check for conflicting middleware

---

### Issue: Token Acquisition Fails

**Problem:** `acquireToken()` throws an error.

**Solution:**

1. Ensure user is logged in:
```tsx
const { isAuthenticated, acquireToken } = useMsalAuth();

if (!isAuthenticated) {
  // User must login first
  await loginRedirect();
  return;
}

const token = await acquireToken(['User.Read']);
```

2. Check that scopes are granted in Azure Portal:
   - Go to API permissions
   - Ensure required scopes are added
   - Grant admin consent if needed

3. Use correct scope format:
   - Correct: `User.Read`, `Mail.Read`
   - Wrong: `user.read`, `read_mail`

---

## Development Tips

### Enable Debug Logging

Get detailed logs to troubleshoot issues:

```tsx
<MSALProvider
  clientId="your-client-id"
  enableLogging={true}  // Enable debug logs
>
  {children}
</MSALProvider>
```

### Use the Enhanced Debug Logger

For more detailed logging:

```tsx
import { getDebugLogger } from '@chemmangat/msal-next';

const logger = getDebugLogger({
  enabled: true,
  enablePerformance: true,
  enableNetworkLogs: true,
});

// Track performance
logger.startTiming('token-acquisition');
const token = await acquireToken(['User.Read']);
logger.endTiming('token-acquisition');

// Export logs for debugging
logger.downloadLogs('debug-logs.json');
```

### Check MSAL Instance

Access the MSAL instance for debugging:

```tsx
import { getMsalInstance } from '@chemmangat/msal-next';

const instance = getMsalInstance();
console.log('Accounts:', instance?.getAllAccounts());
console.log('Active account:', instance?.getActiveAccount());
```

### Test in Incognito Mode

Many auth issues are caused by cached state. Test in incognito/private mode to rule out cache issues.

### Clear MSAL Cache

If you're experiencing persistent issues:

```tsx
const { clearSession } = useMsalAuth();

// Clear MSAL cache without logging out from Microsoft
await clearSession();
```

---

## Still Having Issues?

1. **Check the documentation:** [README.md](./README.md)
2. **Search existing issues:** [GitHub Issues](https://github.com/chemmangat/msal-next/issues)
3. **Ask for help:** [GitHub Discussions](https://github.com/chemmangat/msal-next/discussions)
4. **Report a bug:** [New Issue](https://github.com/chemmangat/msal-next/issues/new)

When reporting issues, please include:
- Package version
- Next.js version
- Node.js version
- Error messages (full stack trace)
- Minimal reproduction code
- Steps to reproduce

---

## Quick Reference

### Get Azure AD IDs

1. **Client ID:**
   - Azure Portal → App registrations → Your app → Overview
   - Copy "Application (client) ID"

2. **Tenant ID:**
   - Azure Portal → Azure Active Directory → Properties
   - Copy "Tenant ID"

### Add Redirect URI

1. Azure Portal → App registrations → Your app
2. Click "Authentication"
3. Under "Single-page application", click "Add URI"
4. Enter your URI (e.g., `http://localhost:3000`)
5. Click "Save"

### Grant API Permissions

1. Azure Portal → App registrations → Your app
2. Click "API permissions"
3. Click "Add a permission"
4. Select "Microsoft Graph"
5. Select "Delegated permissions"
6. Search and select permissions (e.g., "User.Read")
7. Click "Add permissions"
8. Click "Grant admin consent" (if required)

---

**Last updated:** v4.0.2
