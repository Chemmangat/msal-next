# Manual Testing Guide - v3.0.8

## Before Publishing - YOU MUST TEST THESE

### Setup Test Environment

1. Create a fresh Next.js app:
```bash
npx create-next-app@latest test-msal-app
cd test-msal-app
```

2. Install the local build:
```bash
cd /path/to/msal-boilerplate/packages/core
npm pack
# This creates @chemmangat-msal-next-3.0.8.tgz

cd /path/to/test-msal-app
npm install /path/to/@chemmangat-msal-next-3.0.8.tgz
npm install @azure/msal-browser@^4.0.0 @azure/msal-react@^3.0.0
```

3. Setup environment:
```bash
# .env.local
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=your-client-id
NEXT_PUBLIC_AZURE_AD_TENANT_ID=your-tenant-id
```

4. Create layout:
```tsx
// app/layout.tsx
import { MSALProvider } from '@chemmangat/msal-next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MSALProvider
          clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
          tenantId={process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID!}
          enableLogging={true}
        >
          {children}
        </MSALProvider>
      </body>
    </html>
  )
}
```

5. Create test page:
```tsx
// app/page.tsx
'use client'
import { useMsalAuth, MicrosoftSignInButton } from '@chemmangat/msal-next'

export default function Home() {
  const { isAuthenticated, account } = useMsalAuth()

  return (
    <div style={{ padding: '2rem' }}>
      <h1>MSAL Test App</h1>
      {!isAuthenticated ? (
        <MicrosoftSignInButton />
      ) : (
        <div>
          <p>Logged in as: {account?.name}</p>
          <p>Email: {account?.username}</p>
        </div>
      )}
    </div>
  )
}
```

## Critical Test Cases

### Test 1: Popup Login (MOST IMPORTANT)
1. Open app in browser
2. Open browser console (F12)
3. Click "Sign in with Microsoft"
4. **VERIFY:** Popup window opens
5. Sign in with Microsoft account
6. **VERIFY:** Popup closes automatically
7. **VERIFY:** Main window shows "Logged in as..."
8. **VERIFY:** URL is clean (no #code=...)
9. **VERIFY:** Console shows no errors
10. **VERIFY:** Button is not greyed out

**Expected Result:** ✅ All verifications pass

### Test 2: User Cancellation
1. Refresh page
2. Click "Sign in with Microsoft"
3. **Close the popup** without signing in
4. **VERIFY:** Button re-enables
5. **VERIFY:** No error in console
6. **VERIFY:** Can click button again

**Expected Result:** ✅ Button works after cancellation

### Test 3: Page Refresh While Logged In
1. Complete Test 1 (login)
2. Refresh the page (F5)
3. **VERIFY:** Still logged in
4. **VERIFY:** User info still shows
5. **VERIFY:** No errors in console

**Expected Result:** ✅ Session persists

### Test 4: URL Cleanup
1. Complete Test 1 (login)
2. Check browser URL bar
3. **VERIFY:** URL is exactly `http://localhost:3000/` (or your base URL)
4. **VERIFY:** No `#code=` or `#state=` in URL

**Expected Result:** ✅ Clean URL

### Test 5: Multiple Rapid Clicks
1. Refresh page (logout first if needed)
2. Click sign-in button 5 times rapidly
3. **VERIFY:** Only one popup opens
4. **VERIFY:** No errors in console

**Expected Result:** ✅ No duplicate popups

### Test 6: Browser Console Check
1. Complete Test 1
2. Check console for:
   - ❌ No red errors
   - ✅ Green "[MSAL] Login successful" message
   - ✅ No warnings about "use client"

**Expected Result:** ✅ Clean console

## Browser Testing

Test in at least 2 browsers:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if on Mac)

## If Any Test Fails

**DO NOT PUBLISH**

1. Document the failure
2. Check console errors
3. Review the code change
4. Fix the issue
5. Rebuild: `npm run build`
6. Retest from scratch

## When All Tests Pass

✅ You can proceed with publishing:

```bash
cd packages/core
npm publish
```

## Post-Publish Verification

1. Install from npm in a fresh project:
```bash
npm install @chemmangat/msal-next@3.0.8
```

2. Run Test 1 again
3. If it works, you're done! 🎉

## Emergency Rollback

If users report issues after publishing:

```bash
# Deprecate the broken version
npm deprecate @chemmangat/msal-next@3.0.8 "Critical bug, use 2.x"

# Fix and publish 3.0.9
```
