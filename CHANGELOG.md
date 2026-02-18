# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-02-18

### Added
- Initial release of `@chemmangat/msal-next`
- `MsalAuthProvider` component for Next.js App Router
- `useMsalAuth` hook with comprehensive authentication methods
- Support for popup and redirect authentication flows
- Automatic token acquisition with silent refresh
- Multi-tenant and single-tenant authentication support
- Configurable cache location (sessionStorage, localStorage, memoryStorage)
- Custom loading component support
- Debug logging support
- TypeScript support with full type definitions
- Comprehensive documentation and examples
- Example Next.js app demonstrating usage

### Features
- **MsalAuthProvider**: Fully configurable provider component
  - Simple configuration with sensible defaults
  - Support for custom MSAL configuration
  - Environment variable support
  - Custom loading component
  - Debug logging

- **useMsalAuth Hook**: Complete authentication API
  - `loginPopup()` - Popup authentication
  - `loginRedirect()` - Redirect authentication
  - `logoutPopup()` - Popup logout
  - `logoutRedirect()` - Redirect logout
  - `acquireToken()` - Token acquisition with fallback
  - `acquireTokenSilent()` - Silent token acquisition
  - `acquireTokenPopup()` - Popup token acquisition
  - `acquireTokenRedirect()` - Redirect token acquisition
  - `isAuthenticated` - Authentication state
  - `account` - Current account info
  - `accounts` - All cached accounts
  - `inProgress` - Interaction status

### Documentation
- Comprehensive README with examples
- API reference documentation
- Azure AD setup guide
- Troubleshooting guide
- Contributing guidelines
- Publishing guide

## [Unreleased]

### Planned
- Server-side authentication support
- Protected route components
- Token caching improvements
- Additional authentication hooks
- More examples (API routes, middleware, etc.)
