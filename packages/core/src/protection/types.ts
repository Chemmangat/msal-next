/**
 * Zero-Config Protected Routes - Type Definitions
 * v4.0.0 Killer Feature
 */

import { ReactNode } from 'react';

/**
 * Page-level auth configuration
 * Export this from your page to enable protection
 * 
 * @example
 * ```tsx
 * // app/dashboard/page.tsx
 * export const auth = { required: true };
 * 
 * export default function Dashboard() {
 *   return <div>Protected content</div>;
 * }
 * ```
 */
export interface PageAuthConfig {
  /**
   * Whether authentication is required for this page
   * @default false
   */
  required?: boolean;

  /**
   * Required roles for access (checks account.idTokenClaims.roles)
   * User must have at least one of these roles
   * 
   * @example
   * ```tsx
   * export const auth = { 
   *   required: true,
   *   roles: ['admin', 'editor'] 
   * };
   * ```
   */
  roles?: string[];

  /**
   * Custom redirect path when auth fails
   * @default '/login'
   */
  redirectTo?: string;

  /**
   * Custom loading component while checking auth
   */
  loading?: ReactNode;

  /**
   * Custom unauthorized component (shown instead of redirect)
   */
  unauthorized?: ReactNode;

  /**
   * Custom validation function
   * Return true to allow access, false to deny
   * 
   * @example
   * ```tsx
   * export const auth = {
   *   required: true,
   *   validate: (account) => account.username.endsWith('@company.com')
   * };
   * ```
   */
  validate?: (account: any) => boolean | Promise<boolean>;
}

/**
 * Global auth configuration for the provider
 */
export interface AuthProtectionConfig {
  /**
   * Default redirect path for unauthenticated users
   * @default '/login'
   */
  defaultRedirectTo?: string;

  /**
   * Default loading component
   */
  defaultLoading?: ReactNode;

  /**
   * Default unauthorized component
   */
  defaultUnauthorized?: ReactNode;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}
