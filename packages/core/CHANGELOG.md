# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2024-02-23

### Added
- **onInitialized callback** - Access MSAL instance after initialization for setting up interceptors
- **getMsalInstance() utility** - Access MSAL instance outside React components (API clients, middleware)
- **clearSession() method** - Clear MSAL cache without triggering Microsoft logout redirect
- **SSR safety guards** - Automatic detection and handling of server-side rendering
- **UseMsalAuthReturn type export** - Type interface for hook return value

### Changed
- **Peer dependencies** - Now supports both v3 and v4 of `@azure/msal-browser` and v2/v3 of `@azure/msal-react`
- **Logging behavior** - Console logs now respect `enableLogging` config (errors always log)
- Enhanced README with advanced usage examples (Axios interceptors, API clients, silent logout)
- Improved TypeScript type exports

## [1.1.0] - 2024-02-18

### Added
- **MicrosoftSignInButton** component with official Microsoft branding
  - Dark and light variants
  - Three size options (small, medium, large)
  - Popup and redirect flow support
  - Custom scopes support
  - Success/error callbacks
  - Fully customizable with className and style props
  - Loading and disabled states

### Changed
- Improved TypeScript type exports
- Enhanced documentation with button component examples

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
