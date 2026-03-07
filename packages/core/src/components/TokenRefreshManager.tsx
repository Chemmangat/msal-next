/**
 * Internal component for managing automatic token refresh
 * Used by MSALProvider when autoRefreshToken is enabled
 */

'use client';

import { useTokenRefresh } from '../hooks/useTokenRefresh';

export interface TokenRefreshManagerProps {
  enabled: boolean;
  refreshBeforeExpiry?: number;
  scopes?: string[];
  enableLogging?: boolean;
}

export function TokenRefreshManager({
  enabled,
  refreshBeforeExpiry = 300,
  scopes = ['User.Read'],
  enableLogging = false,
}: TokenRefreshManagerProps) {
  useTokenRefresh({
    enabled,
    refreshBeforeExpiry,
    scopes,
    onRefresh: (expiresIn) => {
      if (enableLogging) {
        console.log(`[TokenRefresh] Token refreshed successfully. Expires in ${expiresIn} seconds.`);
      }
    },
    onError: (error) => {
      if (enableLogging) {
        console.error('[TokenRefresh] Failed to refresh token:', error);
      }
    },
  });

  // This component doesn't render anything
  return null;
}
