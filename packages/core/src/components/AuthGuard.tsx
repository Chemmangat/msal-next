'use client';

import { ReactNode, useEffect } from 'react';
import { useMsalAuth } from '../hooks/useMsalAuth';

export interface AuthGuardProps {
  /**
   * Content to render when authenticated
   */
  children: ReactNode;

  /**
   * Component to show while checking authentication
   */
  loadingComponent?: ReactNode;

  /**
   * Component to show when not authenticated (before redirect)
   */
  fallbackComponent?: ReactNode;

  /**
   * Scopes to request during authentication
   */
  scopes?: string[];

  /**
   * Callback when authentication is required
   */
  onAuthRequired?: () => void;
}

/**
 * AuthGuard component that protects content and auto-redirects to login
 * 
 * @example
 * ```tsx
 * <AuthGuard>
 *   <ProtectedContent />
 * </AuthGuard>
 * ```
 */
export function AuthGuard({
  children,
  loadingComponent,
  fallbackComponent,
  scopes,
  onAuthRequired,
}: AuthGuardProps) {
  const { isAuthenticated, inProgress, loginRedirect } = useMsalAuth();

  useEffect(() => {
    if (!isAuthenticated && !inProgress) {
      onAuthRequired?.();
      
      const login = async () => {
        try {
          await loginRedirect(scopes);
        } catch (error) {
          console.error('[AuthGuard] Authentication failed:', error);
        }
      };

      login();
    }
  }, [isAuthenticated, inProgress, scopes, loginRedirect, onAuthRequired]);

  if (inProgress) {
    return <>{loadingComponent || <div>Authenticating...</div>}</>;
  }

  if (!isAuthenticated) {
    return <>{fallbackComponent || <div>Redirecting to login...</div>}</>;
  }

  return <>{children}</>;
}
