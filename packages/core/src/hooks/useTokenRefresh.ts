/**
 * Automatic token refresh hook
 * Refreshes tokens before they expire to prevent session interruptions
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useMsal } from '@azure/msal-react';
import { useMsalAuth } from './useMsalAuth';

export interface UseTokenRefreshOptions {
  /**
   * Enable automatic token refresh
   * @default true
   */
  enabled?: boolean;

  /**
   * Refresh token this many seconds before expiry
   * @default 300 (5 minutes)
   */
  refreshBeforeExpiry?: number;

  /**
   * Scopes to refresh
   * @default ['User.Read']
   */
  scopes?: string[];

  /**
   * Callback when token is refreshed
   */
  onRefresh?: (expiresIn: number) => void;

  /**
   * Callback when refresh fails
   */
  onError?: (error: Error) => void;
}

export interface UseTokenRefreshReturn {
  /**
   * Seconds until token expires
   */
  expiresIn: number | null;

  /**
   * Whether token is expiring soon
   */
  isExpiringSoon: boolean;

  /**
   * Manually trigger token refresh
   */
  refresh: () => Promise<void>;

  /**
   * Last refresh timestamp
   */
  lastRefresh: Date | null;
}

/**
 * Hook for automatic token refresh
 * 
 * @remarks
 * Automatically refreshes access tokens before they expire to prevent
 * session interruptions. Runs in the background without user interaction.
 * 
 * @example
 * ```tsx
 * // Basic usage - automatic refresh
 * useTokenRefresh();
 * 
 * // With options
 * const { expiresIn, isExpiringSoon } = useTokenRefresh({
 *   refreshBeforeExpiry: 600, // 10 minutes
 *   scopes: ['User.Read', 'Mail.Read'],
 *   onRefresh: (expiresIn) => console.log(`Token refreshed, expires in ${expiresIn}s`),
 * });
 * 
 * // Show warning when expiring soon
 * if (isExpiringSoon) {
 *   return <div>Your session will expire soon</div>;
 * }
 * ```
 */
export function useTokenRefresh(options: UseTokenRefreshOptions = {}): UseTokenRefreshReturn {
  const {
    enabled = true,
    refreshBeforeExpiry = 300, // 5 minutes
    scopes = ['User.Read'],
    onRefresh,
    onError,
  } = options;

  const { isAuthenticated, account } = useMsalAuth();
  const { instance } = useMsal();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastRefreshRef = useRef<Date | null>(null);
  const expiresInRef = useRef<number | null>(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated || !account) {
      return;
    }

    try {
      // Call instance.acquireTokenSilent directly to get the full AuthenticationResult
      // including expiresOn, which useMsalAuth.acquireTokenSilent discards.
      const response = await instance.acquireTokenSilent({
        scopes,
        account,
        forceRefresh: false,
      });

      lastRefreshRef.current = new Date();

      // Calculate real seconds until expiry from the token's expiresOn field
      const expiresIn = response.expiresOn
        ? Math.max(0, response.expiresOn.getTime() / 1000 - Date.now() / 1000)
        : 3600; // fallback: 1 hour

      expiresInRef.current = expiresIn;
      onRefresh?.(expiresIn);
    } catch (error) {
      console.error('[TokenRefresh] Failed to refresh token:', error);
      onError?.(error as Error);
    }
  }, [isAuthenticated, account, instance, scopes, onRefresh, onError]);

  useEffect(() => {
    if (!enabled || !isAuthenticated) {
      return;
    }

    // Initial refresh to get real token expiry
    refresh();

    // Check every minute whether the token needs refreshing
    intervalRef.current = setInterval(() => {
      if (expiresInRef.current === null) {
        return;
      }

      // Recalculate remaining time based on wall clock since last refresh
      const timeSinceRefresh = lastRefreshRef.current
        ? (Date.now() - lastRefreshRef.current.getTime()) / 1000
        : 0;

      const remainingTime = expiresInRef.current - timeSinceRefresh;
      expiresInRef.current = Math.max(0, remainingTime);

      if (remainingTime <= refreshBeforeExpiry && remainingTime > 0) {
        refresh();
      }
    }, 60_000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, isAuthenticated, refreshBeforeExpiry, refresh]);

  const isExpiringSoon = expiresInRef.current !== null && expiresInRef.current <= refreshBeforeExpiry;

  return {
    expiresIn: expiresInRef.current,
    isExpiringSoon,
    refresh,
    lastRefresh: lastRefreshRef.current,
  };
}
