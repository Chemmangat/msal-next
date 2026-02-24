// ============================================================================
// Core Provider & Instance
// ============================================================================
export { MsalAuthProvider, getMsalInstance } from './components/MsalAuthProvider';

// ============================================================================
// Components
// ============================================================================
export { MicrosoftSignInButton } from './components/MicrosoftSignInButton';
export { SignOutButton } from './components/SignOutButton';
export { UserAvatar } from './components/UserAvatar';
export { AuthStatus } from './components/AuthStatus';
export { AuthGuard } from './components/AuthGuard';
export { ErrorBoundary } from './components/ErrorBoundary';

// ============================================================================
// Hooks
// ============================================================================
export { useMsalAuth } from './hooks/useMsalAuth';
export { useGraphApi } from './hooks/useGraphApi';
export { useUserProfile } from './hooks/useUserProfile';
export { useRoles } from './hooks/useRoles';

// ============================================================================
// Utilities (Client-safe only)
// ============================================================================
export { createMsalConfig } from './utils/createMsalConfig';
export { withAuth } from './utils/withAuth';
export { retryWithBackoff, createRetryWrapper } from './utils/tokenRetry';
export { getDebugLogger, createScopedLogger } from './utils/debugLogger';

// ============================================================================
// Middleware (Edge-compatible)
// ============================================================================
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

// ============================================================================
// Re-export useful MSAL hooks and types
// ============================================================================
export { useMsal, useIsAuthenticated, useAccount } from '@azure/msal-react';
export type { AccountInfo } from '@azure/msal-browser';
