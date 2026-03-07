/**
 * Automatic token refresh hook
 * Refreshes tokens before they expire to prevent session interruptions
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
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

  const { isAuthenticated, account, acquireTokenSilent } = useMsalAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastRefreshRef = useRef<Date | null>(null);
  const expiresInRef = useRef<number | null>(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated || !account) {
      return;
    }

    try {
      // Acquire token silently (this refreshes if needed)
      await acquireTokenSilent(scopes);
      
      lastRefreshRef.current = new Date();
      
      // Calculate expiry time (MSAL tokens typically expire in 1 hour)
      const expiresIn = 3600; // 1 hour in seconds
      expiresInRef.current = expiresIn;
      
      onRefresh?.(expiresIn);
    } catch (error) {
      console.error('[TokenRefresh] Failed to refresh token:', error);
      onError?.(error as Error);
    }
  }, [isAuthenticated, account, acquireTokenSilent, scopes, onRefresh, onError]);

  useEffect(() => {
    if (!enabled || !isAuthenticated) {
      return;
    }

    // Initial refresh to get token expiry
    refresh();

    // Set up interval to check and refresh token
    // Check every minute
    intervalRef.current = setInterval(() => {
      if (!expiresInRef.current) {
        return;
      }

      // Calculate time since last refresh
      const timeSinceRefresh = lastRefreshRef.current
        ? (Date.now() - lastRefreshRef.current.getTime()) / 1000
        : 0;

      const remainingTime = expiresInRef.current - timeSinceRefresh;

      // Update expires in
      expiresInRef.current = Math.max(0, remainingTime);

      // Refresh if token is expiring soon
      if (remainingTime <= refreshBeforeExpiry && remainingTime > 0) {
        refresh();
      }
    }, 60000); // Check every minute

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
