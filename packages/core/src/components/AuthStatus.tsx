'use client';

import { CSSProperties, ReactNode } from 'react';
import { useMsalAuth } from '../hooks/useMsalAuth';

export interface AuthStatusProps {
  /**
   * Custom className
   */
  className?: string;

  /**
   * Custom styles
   */
  style?: CSSProperties;

  /**
   * Show detailed status (includes username)
   * @default false
   */
  showDetails?: boolean;

  /**
   * Custom render function for loading state
   */
  renderLoading?: () => ReactNode;

  /**
   * Custom render function for authenticated state
   */
  renderAuthenticated?: (username: string) => ReactNode;

  /**
   * Custom render function for unauthenticated state
   */
  renderUnauthenticated?: () => ReactNode;
}

/**
 * AuthStatus component that shows current authentication state
 * 
 * @example
 * ```tsx
 * <AuthStatus showDetails />
 * ```
 */
export function AuthStatus({
  className = '',
  style,
  showDetails = false,
  renderLoading,
  renderAuthenticated,
  renderUnauthenticated,
}: AuthStatusProps) {
  const { isAuthenticated, inProgress, account } = useMsalAuth();

  const baseStyles: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '4px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    ...style,
  };

  if (inProgress) {
    if (renderLoading) {
      return <>{renderLoading()}</>;
    }

    return (
      <div
        className={className}
        style={{ ...baseStyles, backgroundColor: '#FFF4CE', color: '#8A6D3B' }}
        role="status"
        aria-live="polite"
      >
        <StatusIndicator color="#FFA500" />
        <span>Loading...</span>
      </div>
    );
  }

  if (isAuthenticated) {
    const username = account?.username || account?.name || 'User';

    if (renderAuthenticated) {
      return <>{renderAuthenticated(username)}</>;
    }

    return (
      <div
        className={className}
        style={{ ...baseStyles, backgroundColor: '#D4EDDA', color: '#155724' }}
        role="status"
        aria-live="polite"
      >
        <StatusIndicator color="#28A745" />
        <span>
          {showDetails ? `Authenticated as ${username}` : 'Authenticated'}
        </span>
      </div>
    );
  }

  if (renderUnauthenticated) {
    return <>{renderUnauthenticated()}</>;
  }

  return (
    <div
      className={className}
      style={{ ...baseStyles, backgroundColor: '#F8D7DA', color: '#721C24' }}
      role="status"
      aria-live="polite"
    >
      <StatusIndicator color="#DC3545" />
      <span>Not authenticated</span>
    </div>
  );
}

function StatusIndicator({ color }: { color: string }) {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="4" r="4" fill={color} />
    </svg>
  );
}
