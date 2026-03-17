/**
 * Zero-Config Protected Routes - Type Definitions
 * v4.0.0 Killer Feature
 */

import { ReactNode } from 'react';

/**
 * Per-page tenant access configuration (v5.1.0)
 */
export interface TenantAuthConfig {
  /**
   * Only users from these tenant IDs or domains are permitted on this page.
   * @example ['contoso.com', '72f988bf-86f1-41af-91ab-2d7cd011db47']
   */
  allowList?: string[];

  /**
   * Users from these tenant IDs or domains are denied on this page.
   * Takes precedence over allowList.
   */
  blockList?: string[];

  /**
   * Require a specific account type ('Member' | 'Guest').
   */
  requireType?: 'Member' | 'Guest';

  /**
   * Require MFA claim in the token (amr must contain 'mfa').
   */
  requireMFA?: boolean;
}

/**
 * Page-level auth configuration
 * Export this from your page to enable protection
 *
 * @example
 * ```tsx
 * // app/dashboard/page.tsx
 * export const auth = { required: true };
 *
 * // With tenant restriction (v5.1.0)
 * export const auth = {
 *   required: true,
 *   tenant: { allowList: ['contoso.com'], requireMFA: true }
 * };
 * ```
 */
export interface PageAuthConfig {
  /** Whether authentication is required for this page */
  required?: boolean;

  /**
   * Required roles for access (checks account.idTokenClaims.roles)
   * User must have at least one of these roles
   */
  roles?: string[];

  /** Custom redirect path when auth fails */
  redirectTo?: string;

  /** Custom loading component while checking auth */
  loading?: ReactNode;

  /** Custom unauthorized component (shown instead of redirect) */
  unauthorized?: ReactNode;

  /**
   * Custom validation function.
   * Return true to allow access, false to deny.
   */
  validate?: (account: any) => boolean | Promise<boolean>;

  /**
   * Per-page tenant access restrictions (v5.1.0).
   * Checked after role validation.
   */
  tenant?: TenantAuthConfig;
}

/**
 * Global auth configuration for the provider
 */
export interface AuthProtectionConfig {
  /** Default redirect path for unauthenticated users */
  defaultRedirectTo?: string;

  /** Default loading component */
  defaultLoading?: ReactNode;

  /** Default unauthorized component */
  defaultUnauthorized?: ReactNode;

  /** Enable debug logging */
  debug?: boolean;
}
