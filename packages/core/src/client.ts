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
 * @example
 * ```tsx
 * const { profile, loading, error, refetch } = useUserProfile();
 * 
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * 
 * return <div>{profile.displayName}</div>;
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
export type { MicrosoftSignInButtonProps } from './components/MicrosoftSignInButton';
export type { SignOutButtonProps } from './components/SignOutButton';
export type { UserAvatarProps } from './components/UserAvatar';
export type { AuthStatusProps } from './components/AuthStatus';
export type { AuthGuardProps } from './components/AuthGuard';
export type { ErrorBoundaryProps } from './components/ErrorBoundary';
export type { UseMsalAuthReturn } from './hooks/useMsalAuth';
export type { UseGraphApiReturn, GraphApiOptions } from './hooks/useGraphApi';
export type { UseUserProfileReturn, UserProfile } from './hooks/useUserProfile';
export type { UseRolesReturn } from './hooks/useRoles';
export type { WithAuthOptions } from './utils/withAuth';
export type { ServerSession } from './utils/getServerSession';
export type { RetryConfig } from './utils/tokenRetry';
export type { DebugLoggerConfig } from './utils/debugLogger';
export type { AuthMiddlewareConfig } from './middleware/createAuthMiddleware';
export type { ValidatedAccountData } from './utils/validation';

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
