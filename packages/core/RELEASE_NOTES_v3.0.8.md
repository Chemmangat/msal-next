# Release Notes - v3.0.8 (Critical Bug Fix)

## 🚨 Critical Update Required

If you're using v3.0.6 or v3.0.7, please update immediately. These versions have a critical bug that breaks popup authentication.

## What Happened?

In v3.0.6, we attempted to fix a popup redirect issue by skipping `handleRedirectPromise()` in popup windows. This was incorrect and broke the authentication flow for popup-based logins.

## The Fix

v3.0.8 properly handles the popup flow by:
1. Calling `handleRedirectPromise()` in ALL windows (main and popup)
2. Only cleaning the URL in the main window
3. Allowing the popup to close naturally after MSAL processes the redirect

## Update Instructions

```bash
npm install @chemmangat/msal-next@3.0.8
```

No code changes required. Your existing implementation will work correctly.

## Verified Scenarios

### ✅ Working
- Popup login flow
- Redirect login flow
- User cancellation
- Page refresh during auth
- Multiple tabs
- Token acquisition
- Logout flows
- SSR/hydration

### ✅ Fixed Issues
- Popup not closing after authentication
- URL showing auth code after login
- Button staying disabled after popup closes
- Redirect happening in popup window

## For Users on v2.x

If you're still on v2.x, you can safely upgrade to v3.0.8. All v2.x functionality is preserved with additional improvements.

## Support

If you encounter any issues:
1. Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. Review [Test Scenarios](./TEST_SCENARIOS.md)
3. Open an issue on GitHub with:
   - Your version number
   - Browser and OS
   - Steps to reproduce
   - Console errors

## Apology

We sincerely apologize for the disruption caused by v3.0.6 and v3.0.7. We've implemented additional testing procedures to prevent similar issues in the future.

## Next Steps

1. Update to v3.0.8
2. Test your authentication flows
3. Report any issues immediately
4. Consider implementing the test scenarios in your own testing

Thank you for your patience and continued use of @chemmangat/msal-next.
