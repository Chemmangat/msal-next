/**
 * Zero-Config Protected Routes - HOC Wrapper
 * v4.0.0 Killer Feature
 * 
 * This HOC automatically wraps pages that export an `auth` config
 */

'use client';

import { ComponentType } from 'react';
import { ProtectedPage } from './ProtectedPage';
import { PageAuthConfig, AuthProtectionConfig } from './types';

/**
 * Higher-order component that adds auth protection to a page
 * 
 * @example
 * ```tsx
 * // Automatic usage (recommended):
 * export const auth = { required: true };
 * export default function Dashboard() { ... }
 * 
 * // Manual usage:
 * const ProtectedDashboard = withPageAuth(Dashboard, { required: true });
 * export default ProtectedDashboard;
 * ```
 */
export function withPageAuth<P extends object>(
  Component: ComponentType<P>,
  authConfig: PageAuthConfig,
  globalConfig?: AuthProtectionConfig
) {
  const WrappedComponent = (props: P) => {
    return (
      <ProtectedPage
        config={authConfig}
        defaultRedirectTo={globalConfig?.defaultRedirectTo}
        defaultLoading={globalConfig?.defaultLoading}
        defaultUnauthorized={globalConfig?.defaultUnauthorized}
        debug={globalConfig?.debug}
      >
        <Component {...props} />
      </ProtectedPage>
    );
  };

  WrappedComponent.displayName = `withPageAuth(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}
