/**
 * @chemmangat/msal-next - Client Module
 * 
 * Production-grade MSAL authentication for Next.js App Router
 * 
 * @packageDocumentation
 */

// ============================================================================
// Core Provider & Instance
// ============================================================================

/**
 * Main authentication provider component for MSAL
 * Wraps your app to provide authentication context
 * 
 * @remarks
 * Use this in client components only. For server-side layouts, use MSALProvider instead.
 * 
 * @example
 * ```tsx
 * 'use client';
 * import { MsalAuthProvider } from '@chemmangat/msal-next';
 * 
 * export function Providers({ children }) {
 *   return (
 *     <MsalAuthProvider
 *       clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
 *       tenantId={process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID!}
 *     >
 *       {children}
 *     </MsalAuthProvider>
 *   );
 * }
 * ```
 */
export { MsalAuthProvider, getMsalInstance } from './components/MsalAuthProvider';

// ============================================================================
// Components
// ============================================================================

/**
 * Pre-configured provider component for App Router layouts
 * Already marked as 'use client' - safe to use in server components
 * 
 * @example
 * ```tsx
 * // app/layout.tsx (Server Component)
 * import { MSALProvider } from '@chemmangat/msal-next';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <MSALProvider
 *           clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
 *           tenantId={process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID!}
 *         >
 *           {children}
 *         </MSALProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export { MSALProvider } from './components/MSALProvider';

/**
 * Pre-styled Microsoft sign-in button with redirect flow
 * 
 * @example
 * ```tsx
 * <MicrosoftSignInButton
 *   variant="dark"
 *   size="medium"
 *   onSuccess={() => console.log('Signed in!')}
 * />
 * ```
 */
export { MicrosoftSignInButton } from './components/MicrosoftSignInButton';

/**
 * Pre-styled sign-out button
 * 
 * @example
 * ```tsx
 * <SignOutButton
 *   variant="light"
 *   size="medium"
 *   onSuccess={() => console.log('Signed out!')}
 * />
 * ```
 */
export { SignOutButton } from './components/SignOutButton';

/**
 * User avatar component with MS Graph photo support
 * 
 * @example
 * ```tsx
 * <UserAvatar
 *   size={48}
 *   showTooltip={true}
 *   fallbackImage="/default-avatar.png"
 * />
 * ```
 */
export { UserAvatar } from './components/UserAvatar';

/**
 * Display current authentication status
 * 
 * @example
 * ```tsx
 * <AuthStatus
 *   showDetails={true}
 *   renderAuthenticated={(username) => <div>Logged in as {username}</div>}
 * />
 * ```
 */
export { AuthStatus } from './components/AuthStatus';

/**
 * Protect components that require authentication
 * 
 * @example
 * ```tsx
 * <AuthGuard
 *   loadingComponent={<div>Loading...</div>}
 *   fallbackComponent={<div>Redirecting to login...</div>}
 * >
 *   <ProtectedContent />
 * </AuthGuard>
 * ```
 */
export { AuthGuard } from './components/AuthGuard';

/**
 * Error boundary for authentication errors
 * 
 * @example
 * ```tsx
 * <ErrorBoundary
 *   fallback={(error, reset) => (
 *     <div>
 *       <p>Error: {error.message}</p>
 *       <button onClick={reset}>Try Again</button>
 *     </div>
 *   )}
 * >
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export { ErrorBoundary } from './components/ErrorBoundary';

/**
 * Account switcher component for multi-account management (NEW in v4.2.0)
 * 
 * @remarks
 * Pre-built dropdown UI for switching between multiple Microsoft accounts.
 * Shows all signed-in accounts with avatars, allows switching with one click,
 * and supports adding/removing accounts. Perfect for headers and navigation bars.
 * 
 * @example
 * ```tsx
 * 'use client';
 * 
 * import { AccountSwitcher } from '@chemmangat/msal-next';
 * 
 * export default function Header() {
 *   return (
 *     <header>
 *       <h1>My App</h1>
 *       <AccountSwitcher
 *         showAvatars={true}
 *         maxAccounts={5}
 *         variant="default"
 *         onSwitch={(account) => console.log('Switched to', account.name)}
 *       />
 *     </header>
 *   );
 * }
 * ```
 */
export { AccountSwitcher } from './components/AccountSwitcher';

/**
 * Account list component for displaying all accounts (NEW in v4.2.0)
 * 
 * @remarks
 * Display all signed-in Microsoft accounts in a list format with details.
 * Useful for account management pages, settings screens, or profile pages.
 * Supports vertical and horizontal layouts.
 * 
 * @example
 * ```tsx
 * 'use client';
 * 
 * import { AccountList } from '@chemmangat/msal-next';
 * 
 * export default function AccountsPage() {
 *   return (
 *     <div>
 *       <h1>Your Accounts</h1>
 *       <AccountList
 *         showAvatars={true}
 *         showDetails={true}
 *         clickToSwitch={true}
 *         orientation="vertical"
 *         onAccountClick={(account) => console.log('Clicked', account.name)}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export { AccountList } from './components/AccountList';

// ============================================================================
// Hooks
// ============================================================================

/**
 * Main authentication hook with all auth operations
 * 
 * @example
 * ```tsx
 * const {
 *   account,
 *   isAuthenticated,
 *   loginRedirect,
 *   logoutRedirect,
 *   acquireToken,
 * } = useMsalAuth();
 * 
 * // Login
 * await loginRedirect(['User.Read']);
 * 
 * // Get token
 * const token = await acquireToken(['User.Read']);
 * 
 * // Logout
 * await logoutRedirect();
 * ```
 */
export { useMsalAuth } from './hooks/useMsalAuth';

/**
 * Pre-configured fetch wrapper for MS Graph API
 * 
 * @example
 * ```tsx
 * const graph = useGraphApi();
 * 
 * // GET request
 * const user = await graph.get('/me');
 * 
 * // POST request
 * const message = await graph.post('/me/messages', {
 *   subject: 'Hello',
 *   body: { content: 'World' }
 * });
 * ```
 */
export { useGraphApi } from './hooks/useGraphApi';

/**
 * Fetch and cache user profile from MS Graph
 * 
 * @remarks
 * Now supports complete Microsoft Graph user profile fields including department,
 * preferredLanguage, employeeId, and more. Supports generic type parameter for
 * custom profile extensions.
 * 
 * @example
 * ```tsx
 * // Basic usage with complete types
 * const { profile, loading, error, refetch } = useUserProfile();
 * 
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * 
 * return (
 *   <div>
 *     <h1>{profile.displayName}</h1>
 *     <p>{profile.department}</p>
 *     <p>{profile.preferredLanguage}</p>
 *   </div>
 * );
 * 
 * // With custom fields
 * interface MyProfile extends UserProfile {
 *   customField: string;
 * }
 * const { profile } = useUserProfile<MyProfile>();
 * ```
 */
export { useUserProfile } from './hooks/useUserProfile';

/**
 * Access user's Azure AD roles and groups
 * 
 * @example
 * ```tsx
 * const { roles, groups, hasRole, hasAnyRole } = useRoles();
 * 
 * if (hasRole('Admin')) {
 *   return <AdminPanel />;
 * }
 * ```
 */
export { useRoles } from './hooks/useRoles';

/**
 * Automatic token refresh hook
 * 
 * @remarks
 * Automatically refreshes access tokens before they expire to prevent
 * session interruptions. Can also be used to check token expiry status.
 * 
 * @example
 * ```tsx
 * // Automatic refresh (runs in background)
 * useTokenRefresh({
 *   refreshBeforeExpiry: 300, // 5 minutes
 *   scopes: ['User.Read'],
 * });
 * 
 * // With expiry warning
 * const { expiresIn, isExpiringSoon } = useTokenRefresh();
 * 
 * if (isExpiringSoon) {
 *   return <div>Your session will expire soon</div>;
 * }
 * ```
 */
export { useTokenRefresh } from './hooks/useTokenRefresh';

/**
 * Multi-account management hook (NEW in v4.2.0)
 * 
 * @remarks
 * Manage multiple Microsoft accounts seamlessly. Users can sign in with multiple
 * accounts (work + personal, or multiple work accounts) and switch between them
 * without signing out. Perfect for users who need to access different tenants.
 * 
 * @example
 * ```tsx
 * const {
 *   accounts,              // All signed-in accounts
 *   activeAccount,         // Current active account
 *   hasMultipleAccounts,   // Boolean: more than one account
 *   switchAccount,         // Switch to different account
 *   addAccount,            // Sign in with another account
 *   removeAccount,         // Remove account from cache
 *   signOutAccount,        // Sign out specific account
 *   signOutAll,            // Sign out all accounts
 * } = useMultiAccount();
 * 
 * // Switch accounts
 * const handleSwitch = (account) => {
 *   switchAccount(account);
 * };
 * 
 * // Add another account
 * await addAccount(['User.Read']);
 * 
 * // Remove account
 * await removeAccount(account);
 * ```
 */
export { useMultiAccount } from './hooks/useMultiAccount';

// ============================================================================
// Utilities
// ============================================================================

/**
 * Create MSAL configuration object
 * 
 * @internal
 * Used internally by MsalAuthProvider
 */
export { createMsalConfig } from './utils/createMsalConfig';

/**
 * Higher-order component for protecting pages
 * 
 * @example
 * ```tsx
 * const ProtectedPage = withAuth(MyPage, {
 *   useRedirect: true,
 *   scopes: ['User.Read']
 * });
 * 
 * export default ProtectedPage;
 * ```
 */
export { withAuth } from './utils/withAuth';

/**
 * Retry utilities with exponential backoff
 * 
 * @example
 * ```tsx
 * import { retryWithBackoff, createRetryWrapper } from '@chemmangat/msal-next';
 * 
 * // Wrap any async function with retry logic
 * const token = await retryWithBackoff(
 *   () => acquireToken(['User.Read']),
 *   { maxRetries: 3, initialDelay: 1000 }
 * );
 * 
 * // Create a reusable retry wrapper
 * const acquireTokenWithRetry = createRetryWrapper(acquireToken, {
 *   maxRetries: 3
 * });
 * ```
 */
export { retryWithBackoff, createRetryWrapper } from './utils/tokenRetry';

/**
 * Debug logger with performance tracking and log export
 * 
 * @example
 * ```tsx
 * import { getDebugLogger } from '@chemmangat/msal-next';
 * 
 * const logger = getDebugLogger({
 *   enabled: true,
 *   enablePerformance: true,
 *   enableNetworkLogs: true,
 * });
 * 
 * logger.info('User logged in', { username: 'user@example.com' });
 * 
 * // Performance tracking
 * logger.startTiming('token-acquisition');
 * await acquireToken(['User.Read']);
 * logger.endTiming('token-acquisition');
 * 
 * // Export logs
 * logger.downloadLogs('debug-logs.json');
 * ```
 */
export { getDebugLogger, createScopedLogger } from './utils/debugLogger';

/**
 * Validation utilities for MSAL configuration
 * 
 * @example
 * ```tsx
 * import { validateScopes, isValidRedirectUri } from '@chemmangat/msal-next';
 * 
 * const isValid = validateScopes(['User.Read', 'Mail.Read']);
 * const isValidUri = isValidRedirectUri('https://myapp.com/callback');
 * ```
 */
export { 
  safeJsonParse, 
  isValidAccountData, 
  sanitizeError, 
  isValidRedirectUri, 
  isValidScope, 
  validateScopes 
} from './utils/validation';

/**
 * Configuration validator for development mode
 * 
 * @remarks
 * Automatically validates MSAL configuration in development mode and displays
 * helpful warnings for common mistakes like placeholder values, invalid GUIDs,
 * missing environment variables, and HTTP in production.
 * 
 * @example
 * ```tsx
 * import { validateConfig, displayValidationResults } from '@chemmangat/msal-next';
 * 
 * const result = validateConfig({
 *   clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!,
 *   tenantId: process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID,
 * });
 * 
 * displayValidationResults(result);
 * ```
 */
export { validateConfig, displayValidationResults } from './utils/configValidator';

/**
 * Enhanced MSAL error handling
 * 
 * @remarks
 * Provides actionable error messages with fix instructions for common MSAL errors.
 * Automatically detects error codes like AADSTS50011 (redirect URI mismatch) and
 * provides step-by-step solutions.
 * 
 * @example
 * ```tsx
 * import { MsalError, wrapMsalError } from '@chemmangat/msal-next';
 * 
 * try {
 *   await loginRedirect();
 * } catch (error) {
 *   const msalError = wrapMsalError(error);
 *   
 *   if (msalError.isUserCancellation()) {
 *     // User cancelled, ignore
 *     return;
 *   }
 *   
 *   console.error(msalError.toConsoleString());
 *   throw msalError;
 * }
 * ```
 */
export { MsalError, wrapMsalError, createMissingEnvVarError } from './errors/MsalError';

// ============================================================================
// Zero-Config Protected Routes (v4.0.0)
// ============================================================================

/**
 * Zero-Config Protected Routes - Export from your page to enable protection
 * 
 * @example
 * ```tsx
 * // app/dashboard/page.tsx
 * export const auth = { required: true };
 * 
 * export default function Dashboard() {
 *   return <div>Protected content</div>;
 * }
 * 
 * // With roles
 * export const auth = { 
 *   required: true,
 *   roles: ['admin', 'editor']
 * };
 * 
 * // With custom validation
 * export const auth = {
 *   required: true,
 *   validate: (account) => account.username.endsWith('@company.com')
 * };
 * ```
 */
export { withPageAuth, ProtectedPage } from './protection';
export type { PageAuthConfig, AuthProtectionConfig } from './protection/types';

// ============================================================================
// Middleware
// ============================================================================

/**
 * Create authentication middleware for protecting routes at the edge
 * 
 * @example
 * ```tsx
 * // middleware.ts
 * import { createAuthMiddleware } from '@chemmangat/msal-next';
 * 
 * export const middleware = createAuthMiddleware({
 *   protectedRoutes: ['/dashboard', '/profile'],
 *   publicOnlyRoutes: ['/login'],
 *   loginPath: '/login',
 *   debug: true,
 * });
 * 
 * export const config = {
 *   matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
 * };
 * ```
 */
export { createAuthMiddleware } from './middleware/createAuthMiddleware';

// ============================================================================
// Type Exports
// ============================================================================

export type { MsalAuthConfig, MsalAuthProviderProps, CustomTokenClaims } from './types';
export type { UserProfile, UseUserProfileReturn } from './types/userProfile';
export type { MicrosoftSignInButtonProps } from './components/MicrosoftSignInButton';
export type { SignOutButtonProps } from './components/SignOutButton';
export type { UserAvatarProps } from './components/UserAvatar';
export type { AuthStatusProps } from './components/AuthStatus';
export type { AuthGuardProps } from './components/AuthGuard';
export type { ErrorBoundaryProps } from './components/ErrorBoundary';
export type { UseMsalAuthReturn } from './hooks/useMsalAuth';
export type { UseGraphApiReturn, GraphApiOptions } from './hooks/useGraphApi';
export type { UseRolesReturn } from './hooks/useRoles';
export type { UseTokenRefreshOptions, UseTokenRefreshReturn } from './hooks/useTokenRefresh';
export type { UseMultiAccountReturn } from './hooks/useMultiAccount';
export type { AccountSwitcherProps } from './components/AccountSwitcher';
export type { AccountListProps } from './components/AccountList';
export type { WithAuthOptions } from './utils/withAuth';
export type { ServerSession } from './utils/getServerSession';
export type { RetryConfig } from './utils/tokenRetry';
export type { DebugLoggerConfig } from './utils/debugLogger';
export type { AuthMiddlewareConfig } from './middleware/createAuthMiddleware';
export type { ValidatedAccountData } from './utils/validation';
export type { ValidationResult, ValidationWarning, ValidationError } from './utils/configValidator';

// ============================================================================
// Re-export MSAL Hooks & Types
// ============================================================================

/**
 * Re-exported MSAL hooks and types for advanced usage
 * 
 * @remarks
 * These are direct exports from @azure/msal-react and @azure/msal-browser
 * Use these for advanced scenarios not covered by the main hooks
 */
export { useMsal, useIsAuthenticated, useAccount } from '@azure/msal-react';
export type { AccountInfo } from '@azure/msal-browser';
