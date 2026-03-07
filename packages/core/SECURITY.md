# Security Policy

## Overview

@chemmangat/msal-next is built on Microsoft's official MSAL (Microsoft Authentication Library) and follows industry best practices for secure authentication in Next.js applications.

---

## 🔒 Security Architecture

### Client-Side Authentication

**All authentication happens in the browser:**
- ✅ Tokens are never sent to your Next.js server
- ✅ Authentication flow handled by Microsoft's MSAL library
- ✅ Direct communication between browser and Azure AD
- ✅ No server-side token storage or handling

```
User Browser ←→ Azure AD (Microsoft)
     ↓
Your Next.js App (UI only)
```

**Your Next.js server never sees:**
- Access tokens
- Refresh tokens
- ID tokens
- User credentials

### Token Storage

**Secure token storage options:**

1. **sessionStorage** (Default - Recommended)
   - Tokens cleared when browser tab closes
   - Most secure for public computers
   - Isolated per tab

2. **localStorage**
   - Tokens persist across browser sessions
   - Shared across tabs
   - Use for "remember me" functionality

3. **memoryStorage**
   - Tokens only in memory
   - Most secure (lost on page refresh)
   - Use for maximum security

```tsx
<MSALProvider
  clientId="..."
  cacheLocation="sessionStorage"  // Recommended
>
```

---

## 🛡️ Security Features

### 1. Built on Microsoft MSAL

- **Industry Standard**: Uses Microsoft's official authentication library
- **Regular Updates**: Microsoft maintains and updates MSAL
- **Security Patches**: Automatic security fixes from Microsoft
- **Compliance**: Meets enterprise security requirements

### 2. Token Security

**Access Tokens:**
- Short-lived (1 hour by default)
- Automatically refreshed
- Never exposed to server
- Stored securely in browser

**Refresh Tokens:**
- Managed by MSAL
- Encrypted by browser
- Automatic rotation
- Secure storage

**ID Tokens:**
- Signed by Azure AD
- Verified by MSAL
- Contains user claims
- Tamper-proof

### 3. Redirect URI Validation

Prevent open redirect vulnerabilities:

```tsx
<MSALProvider
  clientId="..."
  allowedRedirectUris={[
    'https://myapp.com',
    'https://staging.myapp.com',
    'http://localhost:3000'  // Dev only
  ]}
>
```

### 4. Scope Validation

Validate requested permissions:

```tsx
// Only request necessary scopes
scopes={['User.Read']}  // ✅ Minimal permissions

// Avoid over-requesting
scopes={['User.Read', 'Mail.ReadWrite', 'Files.ReadWrite.All']}  // ❌ Too broad
```

### 5. Error Sanitization

Automatic removal of sensitive data from error messages:

```tsx
// Tokens and secrets automatically redacted
console.error(error);  // "[TOKEN_REDACTED]" instead of actual token
```

### 6. Configuration Validation

Development-mode validation catches security issues:

```tsx
// Warns about:
// - HTTP in production (should be HTTPS)
// - Placeholder values
// - Invalid configurations
```

---

## 🔐 Best Practices

### 1. Environment Variables

**Always use environment variables for sensitive data:**

```bash
# .env.local
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=your-client-id
NEXT_PUBLIC_AZURE_AD_TENANT_ID=your-tenant-id
```

**Never hardcode:**
```tsx
// ❌ BAD - Hardcoded
<MSALProvider clientId="12345678-1234-1234-1234-123456789012">

// ✅ GOOD - Environment variable
<MSALProvider clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}>
```

### 2. HTTPS in Production

**Always use HTTPS in production:**

```tsx
// ✅ GOOD
redirectUri: "https://myapp.com"

// ❌ BAD - HTTP in production
redirectUri: "http://myapp.com"
```

**HTTP is only acceptable for localhost:**
```tsx
redirectUri: "http://localhost:3000"  // ✅ OK for development
```

### 3. Minimal Scopes

**Request only necessary permissions:**

```tsx
// ✅ GOOD - Minimal scopes
scopes={['User.Read']}

// ❌ BAD - Excessive scopes
scopes={['User.Read', 'Mail.ReadWrite', 'Files.ReadWrite.All', 'Directory.ReadWrite.All']}
```

### 4. Token Refresh

**Use automatic token refresh to prevent token exposure:**

```tsx
<MSALProvider
  clientId="..."
  autoRefreshToken={true}  // Reduces token exposure window
  refreshBeforeExpiry={300}
>
```

### 5. Secure Cookie Settings

**When using server-side sessions:**

```tsx
// Set secure cookie options
const session = await getServerSession();

// Cookies should be:
// - HttpOnly: true
// - Secure: true (in production)
// - SameSite: 'lax' or 'strict'
```

### 6. Content Security Policy

**Add CSP headers to your Next.js app:**

```tsx
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      connect-src 'self' https://login.microsoftonline.com https://graph.microsoft.com;
      img-src 'self' data: https:;
      style-src 'self' 'unsafe-inline';
    `.replace(/\s{2,}/g, ' ').trim()
  }
];
```

---

## 🚨 Common Security Mistakes

### ❌ Mistake 1: Storing Tokens in Cookies

```tsx
// ❌ BAD - Don't store tokens in cookies
document.cookie = `token=${accessToken}`;

// ✅ GOOD - Let MSAL handle storage
const token = await acquireToken(['User.Read']);
```

### ❌ Mistake 2: Sending Tokens to Your Server

```tsx
// ❌ BAD - Don't send tokens to your server
fetch('/api/user', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// ✅ GOOD - Use tokens only for Microsoft Graph
fetch('https://graph.microsoft.com/v1.0/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### ❌ Mistake 3: Logging Tokens

```tsx
// ❌ BAD - Don't log tokens
console.log('Token:', token);

// ✅ GOOD - Log without sensitive data
console.log('Token acquired successfully');
```

### ❌ Mistake 4: Exposing Client Secret

```tsx
// ❌ BAD - Client secret in frontend
const clientSecret = "your-secret";  // NEVER DO THIS

// ✅ GOOD - No client secret needed
// SPAs don't use client secrets
```

### ❌ Mistake 5: Using localStorage in Public Computers

```tsx
// ❌ BAD - localStorage on public computers
cacheLocation: "localStorage"

// ✅ GOOD - sessionStorage for public computers
cacheLocation: "sessionStorage"
```

---

## 🔍 Security Checklist

Before deploying to production:

- [ ] Using HTTPS (not HTTP)
- [ ] Environment variables for sensitive data
- [ ] Minimal scopes requested
- [ ] Redirect URIs validated
- [ ] sessionStorage for token cache (or localStorage with caution)
- [ ] Content Security Policy configured
- [ ] Error logging doesn't expose tokens
- [ ] No client secrets in frontend code
- [ ] Regular dependency updates
- [ ] Security headers configured

---

## 🛠️ Security Monitoring

### 1. Enable Logging in Development

```tsx
<MSALProvider
  clientId="..."
  enableLogging={true}  // Only in development
>
```

### 2. Monitor Authentication Events

```tsx
<MSALProvider
  clientId="..."
  onInitialized={(instance) => {
    // Log authentication events
    instance.addEventCallback((event) => {
      if (event.eventType === 'LOGIN_FAILURE') {
        // Send to monitoring service
        logSecurityEvent('login_failure', event);
      }
    });
  }}
>
```

### 3. Track Token Acquisition

```tsx
const { acquireToken } = useMsalAuth();

try {
  const token = await acquireToken(['User.Read']);
  // Log successful acquisition
} catch (error) {
  // Log and monitor failures
  logSecurityEvent('token_acquisition_failed', error);
}
```

---

## 📊 Compliance

### GDPR Compliance

- ✅ No user data stored on your servers
- ✅ Authentication handled by Microsoft (GDPR compliant)
- ✅ User can revoke access anytime
- ✅ Clear data handling policies

### SOC 2 Compliance

- ✅ Uses Microsoft's SOC 2 compliant infrastructure
- ✅ Secure token storage
- ✅ Audit logging available
- ✅ Access controls via Azure AD

### HIPAA Compliance

- ✅ No PHI stored in frontend
- ✅ Secure authentication
- ✅ Microsoft Azure is HIPAA compliant
- ✅ Proper access controls

---

## 🐛 Reporting Security Issues

**If you discover a security vulnerability:**

1. **DO NOT** open a public GitHub issue
2. Email: [your-security-email@example.com]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

**We will:**
- Acknowledge within 48 hours
- Provide a fix within 7 days for critical issues
- Credit you in the security advisory (if desired)

---

## 📚 Security Resources

### Microsoft Documentation
- [MSAL.js Security](https://learn.microsoft.com/en-us/azure/active-directory/develop/msal-js-security)
- [Azure AD Security Best Practices](https://learn.microsoft.com/en-us/azure/active-directory/fundamentals/security-operations-introduction)
- [OAuth 2.0 Security](https://oauth.net/2/security-best-practices/)

### OWASP Guidelines
- [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

### Package Security
- [npm Security Advisories](https://www.npmjs.com/advisories)
- [Snyk Vulnerability Database](https://snyk.io/vuln/)

---

## 🔄 Security Updates

**We regularly:**
- Update MSAL dependencies
- Monitor security advisories
- Apply security patches
- Review code for vulnerabilities
- Update documentation

**You should:**
- Keep @chemmangat/msal-next updated
- Monitor security advisories
- Review Azure AD audit logs
- Update dependencies regularly
- Follow security best practices

---

## ✅ Security Guarantees

**What we guarantee:**
- ✅ No tokens sent to your server
- ✅ Secure token storage
- ✅ Regular security updates
- ✅ Industry-standard practices
- ✅ Microsoft MSAL compliance

**What you must ensure:**
- ✅ HTTPS in production
- ✅ Secure environment variables
- ✅ Regular updates
- ✅ Proper Azure AD configuration
- ✅ Security monitoring

---

## 📞 Support

For security questions:
- 📧 Email: [security@example.com]
- 💬 [GitHub Discussions](https://github.com/chemmangat/msal-next/discussions)
- 📖 [Documentation](./README.md)

**For urgent security issues, email directly.**

---

**Last Updated:** March 7, 2026  
**Version:** 4.1.0  
**License:** MIT
