'use client';

import { useMemo } from 'react';
import { useMsalAuth } from './useMsalAuth';

export interface TenantInfo {
  /** The tenant ID from the current account's token claims */
  tenantId: string | null;
  /** The tenant domain (e.g. contoso.onmicrosoft.com) derived from the UPN */
  tenantDomain: string | null;
  /**
   * Whether the current user is a B2B guest in this tenant.
   * True when the home tenant (iss claim) differs from the resource tenant (tid claim).
   */
  isGuestUser: boolean;
  /** The user's home tenant ID (where their identity lives) */
  homeTenantId: string | null;
  /** The resource tenant ID (the tenant the token was issued for) */
  resourceTenantId: string | null;
  /** Raw idTokenClaims for advanced usage */
  claims: Record<string, any> | null;
}

export interface UseTenantReturn extends TenantInfo {
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
}

/**
 * Hook that exposes tenant context for the currently authenticated user.
 *
 * @remarks
 * Detects B2B guest users by comparing the `iss` (issuer / home tenant) claim
 * against the `tid` (resource tenant) claim. When they differ the user is a
 * cross-tenant guest.
 *
 * @example
 * ```tsx
 * 'use client';
 * import { useTenant } from '@chemmangat/msal-next';
 *
 * export default function TenantBadge() {
 *   const { tenantDomain, isGuestUser, tenantId } = useTenant();
 *
 *   return (
 *     <div>
 *       <span>{tenantDomain}</span>
 *       {isGuestUser && <span className="badge">Guest</span>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useTenant(): UseTenantReturn {
  const { account, isAuthenticated } = useMsalAuth();

  const tenantInfo = useMemo<TenantInfo>(() => {
    if (!account) {
      return {
        tenantId: null,
        tenantDomain: null,
        isGuestUser: false,
        homeTenantId: null,
        resourceTenantId: null,
        claims: null,
      };
    }

    const claims = (account.idTokenClaims as Record<string, any>) ?? {};

    // tid = resource tenant (the tenant the token was issued for)
    const resourceTenantId: string | null = account.tenantId || claims['tid'] || null;

    // iss = issuer URL, contains the home tenant ID
    // Format: https://login.microsoftonline.com/{homeTenantId}/v2.0
    const issuer: string | null = claims['iss'] || null;
    let homeTenantId: string | null = null;
    if (issuer) {
      const match = issuer.match(
        /https:\/\/login\.microsoftonline\.com\/([^/]+)(?:\/|$)/i
      );
      if (match) homeTenantId = match[1];
    }

    // Guest detection: home tenant differs from resource tenant
    const isGuestUser =
      !!homeTenantId &&
      !!resourceTenantId &&
      homeTenantId.toLowerCase() !== resourceTenantId.toLowerCase();

    // Derive tenant domain from UPN (user@domain.com → domain.com)
    // Fall back to preferred_username or upn claim
    const upn: string =
      account.username ||
      claims['preferred_username'] ||
      claims['upn'] ||
      '';
    const tenantDomain = upn.includes('@') ? upn.split('@')[1] : null;

    return {
      tenantId: resourceTenantId,
      tenantDomain,
      isGuestUser,
      homeTenantId,
      resourceTenantId,
      claims,
    };
  }, [account]);

  return { ...tenantInfo, isAuthenticated };
}
