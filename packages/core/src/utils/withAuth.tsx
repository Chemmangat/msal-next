'use client';

import { ComponentType } from 'react';
import { AuthGuard, AuthGuardProps } from '../components/AuthGuard';

export interface WithAuthOptions extends Omit<AuthGuardProps, 'children'> {
  /**
   * Display name for the wrapped component (for debugging)
   */
  displayName?: string;
}

/**
 * Higher-order component for protecting pages/components
 * 
 * @example
 * ```tsx
 * const ProtectedPage = withAuth(MyPage);
 * 
 * // With options
 * const ProtectedPage = withAuth(MyPage, {
 *   useRedirect: true,
 *   scopes: ['User.Read', 'Mail.Read']
 * });
 * ```
 */
export function withAuth<P extends object>(
  Component: ComponentType<P>,
  options: WithAuthOptions = {}
): ComponentType<P> {
  const { displayName, ...guardProps } = options;

  const WrappedComponent = (props: P) => {
    return (
      <AuthGuard {...guardProps}>
        <Component {...props} />
      </AuthGuard>
    );
  };

  WrappedComponent.displayName = displayName || `withAuth(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}
