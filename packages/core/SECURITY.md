# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| < 2.0   | :x:                |

## Security Updates in v2.0.1

This release addresses several security vulnerabilities discovered in v2.0.0. We strongly recommend all users upgrade immediately.

### Fixed Vulnerabilities

#### 1. Memory Leaks from Blob URLs (Medium Severity)
**Affected:** `useUserProfile` hook
**Fixed:** Added proper cleanup of blob URLs using `URL.revokeObjectURL()` in useEffect cleanup functions.

#### 2. Unbounded Cache Growth (Medium Severity)
**Affected:** `useRoles` and `useUserProfile` hooks
**Fixed:** Implemented LRU cache eviction with a maximum size limit of 100 entries to prevent memory exhaustion.

#### 3. Race Conditions in Token Acquisition (Medium Severity)
**Affected:** `useMsalAuth` hook
**Fixed:** Implemented request deduplication to prevent multiple concurrent popup windows and token requests.

#### 4. JSON Parsing Without Validation (High Severity)
**Affected:** `getServerSession`, `createAuthMiddleware`
**Fixed:** Added schema validation for all JSON parsing operations using the new `safeJsonParse` utility.

#### 5. Information Disclosure in Error Messages (Medium Severity)
**Affected:** All hooks and utilities
**Fixed:** Implemented error sanitization to remove tokens, secrets, and sensitive information from error messages.

#### 6. Missing Redirect URI Validation (Medium Severity)
**Affected:** `createMsalConfig`
**Fixed:** Added optional `allowedRedirectUris` configuration to validate redirect URIs and prevent open redirect vulnerabilities.

### New Security Features

- **Input Validation Utilities**: New `validation.ts` module with functions for safe JSON parsing, scope validation, and redirect URI validation
- **Error Sanitization**: Automatic removal of tokens and secrets from error messages
- **Cache Management**: Proper cache size limits and cleanup on component unmount
- **Request Deduplication**: Prevention of concurrent token acquisition requests

## Best Practices

### DO NOT Store Tokens in Cookies

The example code in `src/examples/api-route-session.ts` demonstrates cookie-based session management but includes a warning. **Do not use this pattern in production** as it exposes tokens to CSRF attacks.

Instead:
- Use MSAL's built-in sessionStorage/localStorage (client-side only)
- Implement proper server-side session management with encrypted session IDs
- Never store access tokens in cookies

### Use Redirect URI Validation

```typescript
<MsalAuthProvider
  clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}
  allowedRedirectUris={[
    'https://myapp.com',
    'https://staging.myapp.com',
    'http://localhost:3000'
  ]}
>
  {children}
</MsalAuthProvider>
```

### Implement Security Headers

Add comprehensive security headers in your `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self'; connect-src 'self' https://login.microsoftonline.com https://graph.microsoft.com;"
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()'
        }
      ]
    }
  ];
}
```

### Validate Scopes

Use the built-in scope validation:

```typescript
import { validateScopes } from '@chemmangat/msal-next';

const scopes = ['User.Read', 'Mail.Read'];
if (!validateScopes(scopes)) {
  throw new Error('Invalid scopes');
}
```

### Use HTTPS in Development

Always test with HTTPS locally to catch security issues early:

```bash
# Use mkcert or similar tools
mkcert localhost
```

## Reporting a Vulnerability

If you discover a security vulnerability, please email security@chemmangat.com with:

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)

We will respond within 48 hours and provide a timeline for a fix.

## Security Checklist

- [ ] Updated to v2.0.1 or later
- [ ] Not storing tokens in cookies
- [ ] Security headers configured in next.config.js
- [ ] Redirect URI validation enabled
- [ ] Using HTTPS in production
- [ ] Regular dependency audits (`npm audit`)
- [ ] Environment variables properly secured
- [ ] CSRF protection on state-changing endpoints
- [ ] Rate limiting on authentication endpoints
