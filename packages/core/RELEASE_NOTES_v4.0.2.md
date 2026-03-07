# Release Notes - v4.0.2

## 🎉 Enhanced Developer Experience Release

Version 4.0.2 focuses on making @chemmangat/msal-next easier to use and debug with complete TypeScript types, actionable error messages, and automatic configuration validation.

---

## ✨ What's New

### 1. Complete TypeScript Types for User Profiles

The `UserProfile` interface now includes ALL fields from the Microsoft Graph /me endpoint:

**New fields added:**
- `department` - User's department
- `preferredLanguage` - Preferred language (e.g., "en-US")
- `employeeId` - Employee ID
- `companyName` - Company name
- `country`, `city`, `state` - Location information
- `streetAddress`, `postalCode` - Address details
- `usageLocation` - Usage location (ISO 3166 country code)
- `manager` - Manager's user ID
- `aboutMe` - Bio/about me
- `birthday` - Birthday
- `interests`, `skills`, `schools` - Profile details
- `pastProjects`, `responsibilities` - Work information
- `mySite`, `faxNumber` - Additional contact info
- `accountEnabled`, `ageGroup`, `userType` - Account details
- `employeeHireDate`, `employeeType` - Employment information

**Generic type support:**
```typescript
interface MyProfile extends UserProfile {
  customField: string;
}

const { profile } = useUserProfile<MyProfile>();
console.log(profile?.customField); // Type-safe!
```

### 2. Enhanced Error Handling with MsalError Class

New `MsalError` class that wraps MSAL errors with actionable messages and fix instructions:

**Supported error codes:**
- `AADSTS50011` - Redirect URI mismatch
- `AADSTS65001` - Admin consent required
- `AADSTS700016` - Invalid client application
- `AADSTS90002` - Invalid tenant
- `user_cancelled` - User cancelled authentication
- `no_token_request_cache_error` - No cached token request
- `interaction_required` - User interaction required
- `consent_required` - User consent required

**Features:**
- Colored console output in development mode
- Step-by-step fix instructions
- Documentation links
- Helper methods: `isUserCancellation()`, `requiresInteraction()`

**Example:**
```typescript
import { wrapMsalError } from '@chemmangat/msal-next';

try {
  await loginRedirect();
} catch (error) {
  const msalError = wrapMsalError(error);
  
  if (msalError.isUserCancellation()) {
    return; // User cancelled, not a real error
  }
  
  console.error(msalError.toConsoleString());
  // Outputs:
  // 🚨 MSAL Authentication Error
  // Error: Redirect URI mismatch
  // 💡 How to fix: [detailed instructions]
  // 📚 Documentation: [link]
}
```

### 3. Automatic Configuration Validation

New development-mode validator that checks for common configuration mistakes:

**Checks performed:**
- ✅ Placeholder values (e.g., "your-client-id-here")
- ✅ Missing environment variables
- ✅ Invalid GUID format for client/tenant IDs
- ✅ HTTP in production (should be HTTPS)
- ✅ Invalid scope formats
- ✅ Missing tenant ID when using single-tenant mode

**Features:**
- Runs automatically in development mode
- Displays warnings with emojis (⚠️, ✓, ✗)
- Provides fix instructions for each issue
- Caches results (runs only once)
- Zero performance impact in production

**Example output:**
```
🔍 MSAL Configuration Validation

⚠️  Warnings (should fix)

clientId:
  Client ID appears to be a placeholder

  Fix:
  Replace the placeholder with your actual Application (client) ID from Azure Portal.
  
  Current value: your-client-id-here
  Expected format: 12345678-1234-1234-1234-123456789012 (GUID)
```

### 4. Comprehensive TROUBLESHOOTING.md

New troubleshooting guide with:
- Common mistakes and how to avoid them
- Top 5 errors with detailed solutions
- Configuration issues troubleshooting
- Authentication flow issues
- Development tips
- Quick reference for Azure Portal tasks

---

## 📦 New Exports

```typescript
// Types
export type { UserProfile, UseUserProfileReturn } from '@chemmangat/msal-next';
export type { ValidationResult, ValidationWarning, ValidationError } from '@chemmangat/msal-next';

// Error handling
export { MsalError, wrapMsalError, createMissingEnvVarError } from '@chemmangat/msal-next';

// Configuration validation
export { validateConfig, displayValidationResults } from '@chemmangat/msal-next';
```

---

## 🔄 Migration from v4.0.1

**Good news:** This release is 100% backward compatible! No code changes required.

Simply update:
```bash
npm install @chemmangat/msal-next@4.0.2
```

### Optional Improvements

**1. Use complete types:**
```typescript
const { profile } = useUserProfile();

// Now available with full type safety!
console.log(profile?.department);
console.log(profile?.preferredLanguage);
console.log(profile?.employeeId);
```

**2. Better error handling:**
```typescript
import { wrapMsalError } from '@chemmangat/msal-next';

try {
  await loginRedirect();
} catch (error) {
  const msalError = wrapMsalError(error);
  if (msalError.isUserCancellation()) {
    return;
  }
  console.error(msalError.toConsoleString());
}
```

**3. Manual validation (optional):**
```typescript
import { validateConfig, displayValidationResults } from '@chemmangat/msal-next';

const result = validateConfig({
  clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!,
  tenantId: process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID,
});

displayValidationResults(result);
```

---

## 📚 Documentation Updates

### README.md
- Added "What's New in v4.0.2" section
- Added "Common Mistakes" section with examples
- Updated all TypeScript examples
- Enhanced troubleshooting section
- Added error handling examples

### CHANGELOG.md
- Complete v4.0.2 entry with all changes
- Migration guide from v4.0.1
- Examples for new features

### TROUBLESHOOTING.md (NEW)
- Common mistakes section
- Top 5 errors with solutions
- Configuration issues
- Authentication flow issues
- Development tips
- Quick reference

---

## 🐛 Bug Fixes

- Fixed missing TypeScript types for user profile fields
- Improved error handling in all authentication flows
- Better detection of user cancellation vs real errors
- Enhanced error messages throughout the package

---

## 🎯 What's Next

v4.1.0 will focus on:
- Additional Graph API helpers
- More authentication examples
- Performance optimizations
- Enhanced testing coverage

---

## 📖 Resources

- [README.md](./README.md) - Complete documentation
- [CHANGELOG.md](./CHANGELOG.md) - Full changelog
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Troubleshooting guide
- [MIGRATION_GUIDE_v3.md](./MIGRATION_GUIDE_v3.md) - Migration from v2.x
- [SECURITY.md](./SECURITY.md) - Security best practices

---

## 🙏 Thank You

Thank you to all users who provided feedback and reported issues. Your input helps make this package better!

If you encounter any issues or have suggestions, please:
- 🐛 [Report a bug](https://github.com/chemmangat/msal-next/issues/new)
- 💬 [Start a discussion](https://github.com/chemmangat/msal-next/discussions)
- ⭐ [Star the repo](https://github.com/chemmangat/msal-next)

---

**Version:** 4.0.2  
**Release Date:** March 7, 2026  
**License:** MIT
