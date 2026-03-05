# Migration Guide: v2.x to v3.0.0

This guide will help you migrate from @chemmangat/msal-next v2.x to v3.0.0.

## Overview

v3.0.0 is a major release with breaking changes focused on:
- Updated minimum requirements
- Removed deprecated APIs
- Enhanced debugging capabilities
- New CLI tool for easier setup

## Quick Migration Checklist

- [ ] Update Node.js to v18+
- [ ] Update Next.js to v14.1+
- [ ] Update MSAL packages to v4+
- [ ] Update @chemmangat/msal-next to v3.0.0
- [ ] Remove usage of deprecated APIs
- [ ] Test your application thoroughly

## Step-by-Step Migration

### 1. Update Node.js

v3.0.0 requires Node.js 18 or higher.

```bash
# Check your current version
node --version

# If < 18, update Node.js
# Using nvm:
nvm install 18
nvm use 18

# Or download from nodejs.org
```

### 2. Update Dependencies

Update your `package.json`:

```bash
# Update core packages
npm install @chemmangat/msal-next@^3.0.0
npm install @azure/msal-browser@^4.0.0
npm install @azure/msal-react@^3.0.0
npm install next@^14.1.0

# Or use the CLI
npx @chemmangat/msal-next init
```

**Before** (package.json):
```json
{
  "dependencies": {
    "@chemmangat/msal-next": "^2.3.0",
    "@azure/msal-browser": "^3.11.0",
    "@azure/msal-react": "^2.0.0",
    "next": "^14.0.0"
  }
}
```

**After** (package.json):
```json
{
  "dependencies": {
    "@chemmangat/msal-next": "^3.0.0",
    "@azure/msal-browser": "^4.0.0",
    "@azure/msal-react": "^3.0.0",
    "next": "^14.1.0"
  }
}
```

### 3. Remove Deprecated APIs

#### ServerSession.accessToken

The `ServerSession.accessToken` property has been removed for security reasons.

**Before** (v2.x):
```typescript
// ❌ This no longer works
import { getServerSession } from '@chemmangat/msal-next/server';

export default async function Page() {
  const session = await getServerSession();
  const token = session.accessToken; // ❌ Removed
  
  // Use token for API calls
  const response = await fetch('https://graph.microsoft.com/v1.0/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
}
```

**After** (v3.0.0):
```typescript
// ✅ Use client-side token acquisition
'use client';

import { useMsalAuth } from '@chemmangat/msal-next';

export default function Page() {
  const { acquireToken } = useMsalAuth();
  
  const fetchData = async () => {
    const token = await acquireToken(['User.Read']);
    
    const response = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
  };
  
  return <button onClick={fetchData}>Fetch Data</button>;
}
```

**Alternative**: Use the `useGraphApi` hook:
```typescript
'use client';

import { useGraphApi } from '@chemmangat/msal-next';

export default function Page() {
  const graph = useGraphApi();
  
  const fetchData = async () => {
    const user = await graph.get('/me');
    console.log(user);
  };
  
  return <button onClick={fetchData}>Fetch Data</button>;
}
```

### 4. Update Debug Configuration

The debug logger has been enhanced with new options.

**Before** (v2.x):
```typescript
<MsalAuthProvider
  clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}
  enableLogging={true}
>
  {children}
</MsalAuthProvider>
```

**After** (v3.0.0) - Same API, but with new capabilities:
```typescript
<MsalAuthProvider
  clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}
  enableLogging={true}
  // New: Enhanced logging is automatic
>
  {children}
</MsalAuthProvider>

// Access enhanced logger features
import { getDebugLogger } from '@chemmangat/msal-next';

const logger = getDebugLogger({
  enabled: true,
  enablePerformance: true,    // NEW
  enableNetworkLogs: true,    // NEW
  maxHistorySize: 100,        // NEW
});

// NEW: Performance tracking
logger.startTiming('operation');
// ... do work
logger.endTiming('operation');

// NEW: Export logs
logger.downloadLogs();
```

### 5. Update TypeScript Configuration (if needed)

Ensure your `tsconfig.json` is compatible:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true
  }
}
```

## New Features You Can Use

### 1. CLI Tool

Use the new CLI for easier setup:

```bash
# Initialize in existing project
npx @chemmangat/msal-next init

# Add components
npx @chemmangat/msal-next add auth-guard

# Configure Azure AD
npx @chemmangat/msal-next configure
```

### 2. Enhanced Debug Logger

```typescript
import { getDebugLogger } from '@chemmangat/msal-next';

const logger = getDebugLogger({
  enabled: true,
  level: 'debug',
  enablePerformance: true,
  enableNetworkLogs: true,
});

// Track performance
logger.startTiming('token-acquisition');
const token = await acquireToken(['User.Read']);
logger.endTiming('token-acquisition');

// Log network requests
logger.logRequest('GET', '/me');
logger.logResponse('GET', '/me', 200, userData);

// Export logs for debugging
logger.downloadLogs('debug-logs.json');
```

### 3. New Examples

Check out the new examples in `src/examples/`:
- Role-based routing
- Multi-tenant SaaS
- API route protection
- Graph API integration

## Common Issues and Solutions

### Issue: "Module not found: @azure/msal-browser"

**Solution**: Update to MSAL v4:
```bash
npm install @azure/msal-browser@^4.0.0 @azure/msal-react@^3.0.0
```

### Issue: "ServerSession.accessToken is undefined"

**Solution**: This property was removed. Use client-side token acquisition:
```typescript
const { acquireToken } = useMsalAuth();
const token = await acquireToken(['User.Read']);
```

### Issue: "Node.js version not supported"

**Solution**: Update to Node.js 18+:
```bash
nvm install 18
nvm use 18
```

### Issue: TypeScript errors after upgrade

**Solution**: Update TypeScript and type definitions:
```bash
npm install -D typescript@^5.3.0
npm install -D @types/react@^18.2.0
```

## Testing Your Migration

After migrating, test these critical paths:

1. **Authentication Flow**
   ```typescript
   // Test login
   await loginPopup();
   
   // Test token acquisition
   const token = await acquireToken(['User.Read']);
   
   // Test logout
   await logoutPopup();
   ```

2. **Protected Routes**
   - Visit protected pages
   - Verify redirects work
   - Check middleware behavior

3. **API Calls**
   - Test Graph API calls
   - Verify token refresh
   - Check error handling

4. **Components**
   - Test all auth components
   - Verify UI renders correctly
   - Check loading states

## Rollback Plan

If you encounter issues, you can rollback:

```bash
# Rollback to v2.3.0
npm install @chemmangat/msal-next@2.3.0
npm install @azure/msal-browser@^3.11.0
npm install @azure/msal-react@^2.0.0
```

## Getting Help

If you need assistance:

1. **Documentation**: Check the [README](./README.md) and [SECURITY.md](./SECURITY.md)
2. **Examples**: Review examples in `src/examples/`
3. **Issues**: Open an issue on [GitHub](https://github.com/chemmangat/msal-next/issues)
4. **Discussions**: Ask questions in [GitHub Discussions](https://github.com/chemmangat/msal-next/discussions)

## Automated Migration (Coming Soon)

We're working on an automated migration tool:

```bash
# Future feature
npx @chemmangat/msal-next migrate
```

This will automatically:
- Update dependencies
- Remove deprecated code
- Update configuration
- Generate migration report

## Summary

v3.0.0 brings enhanced debugging, a new CLI tool, and better developer experience. While there are breaking changes, the migration path is straightforward:

1. Update Node.js to 18+
2. Update dependencies
3. Remove `ServerSession.accessToken` usage
4. Test thoroughly

The new features make it worth the upgrade!

---

**Need Help?** Open an issue or discussion on GitHub.  
**Found a Bug?** Please report it with reproduction steps.  
**Have Feedback?** We'd love to hear from you!

**Last Updated**: March 5, 2026  
**Version**: 3.0.0
