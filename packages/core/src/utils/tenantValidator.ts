/**
 * Tenant validation utility for multi-tenant support (v5.1.0)
 */

import { AccountInfo } from '@azure/msal-browser';
import { MultiTenantConfig } from '../types';

export interface TenantValidationResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Extracts the tenant domain from an account's UPN or username.
 */
function getTenantDomain(account: AccountInfo): string | null {
  const upn =
    account.username ||
    (account.idTokenClaims as any)?.preferred_username ||
    (account.idTokenClaims as any)?.upn ||
    '';
  return upn.includes('@') ? upn.split('@')[1].toLowerCase() : null;
}

/**
 * Extracts the tenant ID from an account.
 */
function getTenantId(account: AccountInfo): string | null {
  return (
    account.tenantId ||
    (account.idTokenClaims as any)?.tid ||
    null
  );
}

/**
 * Checks whether a value matches a tenant identifier (ID or domain).
 */
function matchesTenant(
  value: string,
  tenantId: string | null,
  tenantDomain: string | null
): boolean {
  const v = value.toLowerCase();
  if (tenantId && v === tenantId.toLowerCase()) return true;
  if (tenantDomain && v === tenantDomain.toLowerCase()) return true;
  return false;
}

/**
 * Detects whether the authenticated account is a B2B guest.
 * A guest's home tenant (from `iss` claim) differs from the resource tenant (`tid`).
 */
function isGuestAccount(account: AccountInfo): boolean {
  const claims = (account.idTokenClaims as Record<string, any>) ?? {};
  const resourceTenantId: string | null = account.tenantId || claims['tid'] || null;
  const issuer: string | null = claims['iss'] || null;

  if (!issuer || !resourceTenantId) return false;

  // Match any tenant identifier (UUID or named) after the base URL
  // Format: https://login.microsoftonline.com/{tenantId}/v2.0
  const match = issuer.match(
    /https:\/\/login\.microsoftonline\.com\/([^/]+)(?:\/|$)/i
  );
  if (!match) return false;

  const homeTenantId = match[1];
  return homeTenantId.toLowerCase() !== resourceTenantId.toLowerCase();
}

/**
 * Validates whether an authenticated account is permitted to access the app
 * based on the provided multi-tenant configuration.
 *
 * @param account - The MSAL AccountInfo for the authenticated user
 * @param config  - The MultiTenantConfig from MsalAuthConfig
 * @returns `{ allowed: true }` or `{ allowed: false, reason: string }`
 *
 * @example
 * ```ts
 * const result = validateTenantAccess(account, {
 *   allowList: ['contoso.com'],
 *   requireMFA: true,
 * });
 * if (!result.allowed) throw new Error(result.reason);
 * ```
 */
export function validateTenantAccess(
  account: AccountInfo,
  config: MultiTenantConfig
): TenantValidationResult {
  const tenantId = getTenantId(account);
  const tenantDomain = getTenantDomain(account);
  const claims = (account.idTokenClaims as Record<string, any>) ?? {};

  // --- blockList check (takes precedence over allowList) ---
  if (config.blockList && config.blockList.length > 0) {
    const blocked = config.blockList.some((entry) =>
      matchesTenant(entry, tenantId, tenantDomain)
    );
    if (blocked) {
      return {
        allowed: false,
        reason: `Tenant "${tenantDomain || tenantId}" is blocked from accessing this application.`,
      };
    }
  }

  // --- allowList check ---
  if (config.allowList && config.allowList.length > 0) {
    const allowed = config.allowList.some((entry) =>
      matchesTenant(entry, tenantId, tenantDomain)
    );
    if (!allowed) {
      return {
        allowed: false,
        reason: `Tenant "${tenantDomain || tenantId}" is not in the allowed list for this application.`,
      };
    }
  }

  // --- requireType check (Member / Guest) ---
  if (config.requireType) {
    const isGuest = isGuestAccount(account);
    if (config.requireType === 'Member' && isGuest) {
      return {
        allowed: false,
        reason: 'Only member accounts are allowed. Guest (B2B) accounts are not permitted.',
      };
    }
    if (config.requireType === 'Guest' && !isGuest) {
      return {
        allowed: false,
        reason: 'Only guest (B2B) accounts are allowed.',
      };
    }
  }

  // --- requireMFA check ---
  if (config.requireMFA) {
    const amr: string[] = claims['amr'] || [];
    const hasMfa =
      amr.includes('mfa') ||
      amr.includes('ngcmfa') ||
      amr.includes('hwk') ||
      amr.includes('swk');
    if (!hasMfa) {
      return {
        allowed: false,
        reason: 'Multi-factor authentication (MFA) is required to access this application.',
      };
    }
  }

  return { allowed: true };
}
