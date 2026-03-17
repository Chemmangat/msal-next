/**
 * Type definitions for @chemmangat/msal-next
 * 
 * @packageDocumentation
 */

import { Configuration, LogLevel, IPublicClientApplication } from '@azure/msal-browser';
import { ReactNode } from 'react';

/**
 * Custom token claims interface for TypeScript generics
 * 
 * @remarks
 * Extend this interface to add type-safe custom claims from your Azure AD tokens.
 * This is useful when you have custom claims configured in your Azure AD app registration.
 * 
 * @example
 * ```tsx
 * // Define your custom claims
 * interface MyCustomClaims extends CustomTokenClaims {
 *   roles: string[];
 *   department: string;
 *   employeeId: string;
 * }
 * 
 * // Use with type safety
 * const { account } = useMsalAuth();
 * const claims = account?.idTokenClaims as MyCustomClaims;
 * 
 * console.log(claims.roles); // Type-safe!
 * console.log(claims.department); // Type-safe!
 * ```
 */
export interface CustomTokenClaims {
  [key: string]: any;
}

/**
 * Configuration options for MSAL authentication
 * 
 * @remarks
 * This interface defines all available configuration options for the MSAL provider.
 * Most options have sensible defaults and only clientId is required.
 */
export interface MsalAuthConfig {
  /**
   * Azure AD Application (client) ID
   * 
   * @remarks
   * Required. Get this from your Azure AD app registration.
   * 
   * @example
   * ```tsx
   * clientId: "12345678-1234-1234-1234-123456789012"
   * ```
   */
  clientId: string;

  /**
   * Azure AD Directory (tenant) ID
   * 
   * @remarks
   * Optional. Required for single-tenant apps.
   * Omit for multi-tenant apps (use authorityType: 'common' instead).
   * 
   * @example
   * ```tsx
   * tenantId: "87654321-4321-4321-4321-210987654321"
   * ```
   */
  tenantId?: string;

  /**
   * Authority type for authentication
   * 
   * @remarks
   * - 'common': Multi-tenant (any Azure AD tenant)
   * - 'organizations': Any organizational Azure AD tenant
   * - 'consumers': Microsoft personal accounts only
   * - 'tenant': Single-tenant (requires tenantId)
   * 
   * @defaultValue 'common'
   * 
   * @example
   * ```tsx
   * // Multi-tenant SaaS app
   * authorityType: 'common'
   * 
   * // Single-tenant enterprise app
   * authorityType: 'tenant'
   * tenantId: "your-tenant-id"
   * ```
   */
  authorityType?: 'common' | 'organizations' | 'consumers' | 'tenant';

  /**
   * Redirect URI after authentication
   * 
   * @remarks
   * Must match a redirect URI configured in your Azure AD app registration.
   * 
   * @defaultValue window.location.origin
   * 
   * @example
   * ```tsx
   * redirectUri: "https://myapp.com/auth/callback"
   * ```
   */
  redirectUri?: string;

  /**
   * Post logout redirect URI
   * 
   * @remarks
   * Where to redirect after logout. Defaults to redirectUri if not specified.
   * 
   * @defaultValue redirectUri
   * 
   * @example
   * ```tsx
   * postLogoutRedirectUri: "https://myapp.com"
   * ```
   */
  postLogoutRedirectUri?: string;

  /**
   * Default scopes for authentication
   * 
   * @remarks
   * Scopes define what permissions your app requests.
   * Common scopes: 'User.Read', 'Mail.Read', 'Calendars.Read'
   * 
   * @defaultValue ['User.Read']
   * 
   * @example
   * ```tsx
   * scopes: ['User.Read', 'Mail.Read', 'Calendars.Read']
   * ```
   */
  scopes?: string[];

  /**
   * Cache location for tokens
   * 
   * @remarks
   * - 'sessionStorage': Tokens cleared when browser tab closes (more secure)
   * - 'localStorage': Tokens persist across browser sessions
   * - 'memoryStorage': Tokens only in memory (most secure, but lost on refresh)
   * 
   * @defaultValue 'sessionStorage'
   * 
   * @example
   * ```tsx
   * cacheLocation: 'sessionStorage'
   * ```
   */
  cacheLocation?: 'sessionStorage' | 'localStorage' | 'memoryStorage';

  /**
   * Store auth state in cookie
   * 
   * @remarks
   * Enable for IE11/Edge legacy support. Not needed for modern browsers.
   * 
   * @defaultValue false
   */
  storeAuthStateInCookie?: boolean;

  /**
   * Navigate to login request URL after authentication
   * 
   * @remarks
   * If true, redirects to the page that initiated login after successful auth.
   * 
   * @defaultValue true
   */
  navigateToLoginRequestUrl?: boolean;

  /**
   * Custom MSAL configuration
   * 
   * @remarks
   * Advanced: Provide a complete MSAL configuration object.
   * This overrides all other configuration options.
   * 
   * @example
   * ```tsx
   * msalConfig: {
   *   auth: {
   *     clientId: "your-client-id",
   *     authority: "https://login.microsoftonline.com/your-tenant-id",
   *   },
   *   cache: {
   *     cacheLocation: "sessionStorage",
   *   },
   * }
   * ```
   */
  msalConfig?: Configuration;

  /**
   * Enable debug logging
   * 
   * @remarks
   * Logs authentication events to the console. Useful for troubleshooting.
   * 
   * @defaultValue false
   * 
   * @example
   * ```tsx
   * enableLogging: true
   * ```
   */
  enableLogging?: boolean;

  /**
   * Custom logger callback
   * 
   * @remarks
   * Advanced: Provide a custom function to handle MSAL logs.
   * 
   * @example
   * ```tsx
   * loggerCallback: (level, message, containsPii) => {
   *   if (level === LogLevel.Error) {
   *     console.error('MSAL Error:', message);
   *   }
   * }
   * ```
   */
  loggerCallback?: (level: LogLevel, message: string, containsPii: boolean) => void;

  /**
   * Allowed redirect URIs for validation
   * 
   * @remarks
   * Security: Whitelist of allowed redirect URIs to prevent open redirect vulnerabilities.
   * Recommended for production apps.
   * 
   * @example
   * ```tsx
   * allowedRedirectUris: [
   *   'https://myapp.com',
   *   'https://staging.myapp.com',
   *   'http://localhost:3000'
   * ]
   * ```
   */
  allowedRedirectUris?: string[];

  /**
   * Loading component to show while MSAL initializes
   * 
   * @remarks
   * Custom React component to display during MSAL initialization.
   * 
   * @example
   * ```tsx
   * loadingComponent: <div className="spinner">Loading...</div>
   * ```
   */
  loadingComponent?: ReactNode;

  /**
   * Callback invoked after MSAL initialization completes
   * 
   * @remarks
   * Use this to perform actions after MSAL is ready, such as logging or analytics.
   * 
   * @example
   * ```tsx
   * onInitialized: (instance) => {
   *   console.log('MSAL initialized with', instance.getAllAccounts().length, 'accounts');
   * }
   * ```
   */
  onInitialized?: (instance: IPublicClientApplication) => void;

  /**
   * Enable automatic token refresh
   * 
   * @remarks
   * Automatically refreshes access tokens before they expire to prevent
   * session interruptions. Tokens are refreshed silently in the background.
   * 
   * @defaultValue false
   * 
   * @example
   * ```tsx
   * <MSALProvider
   *   clientId="..."
   *   autoRefreshToken={true}
   *   refreshBeforeExpiry={300} // Refresh 5 min before expiry
   * >
   *   {children}
   * </MSALProvider>
   * ```
   */
  autoRefreshToken?: boolean;

  /**
   * Refresh token this many seconds before expiry
   *
   * @remarks
   * Only used when autoRefreshToken is enabled.
   *
   * @defaultValue 300 (5 minutes)
   */
  refreshBeforeExpiry?: number;

  /**
   * Multi-tenant configuration (v5.1.0)
   *
   * @remarks
   * Controls which tenants are allowed to access the application and how
   * cross-tenant token acquisition is handled.
   *
   * @example
   * ```tsx
   * <MSALProvider
   *   clientId="..."
   *   multiTenant={{
   *     type: 'multi',
   *     allowList: ['contoso.com', 'fabrikam.com'],
   *     requireMFA: true,
   *   }}
   * >
   * ```
   */
  multiTenant?: MultiTenantConfig;
}

/**
 * Multi-tenant configuration for v5.1.0
 */
export interface MultiTenantConfig {
  /**
   * Tenant mode
   * - 'single'        — only your own tenant (maps to authorityType 'tenant')
   * - 'multi'         — any Azure AD tenant (maps to authorityType 'common')
   * - 'organizations' — any organisational tenant, no personal accounts
   * - 'consumers'     — Microsoft personal accounts only
   * - 'common'        — alias for 'multi'
   *
   * @defaultValue 'common'
   */
  type?: 'single' | 'multi' | 'organizations' | 'consumers' | 'common';

  /**
   * Tenant allow-list — only users from these tenant IDs or domains are permitted.
   * Checked after authentication; users from other tenants are shown an error.
   *
   * @example ['contoso.com', '72f988bf-86f1-41af-91ab-2d7cd011db47']
   */
  allowList?: string[];

  /**
   * Tenant block-list — users from these tenant IDs or domains are denied.
   * Takes precedence over allowList.
   */
  blockList?: string[];

  /**
   * Require a specific tenant type ('Member' | 'Guest').
   * Useful to block B2B guests or to allow only guests.
   */
  requireType?: 'Member' | 'Guest';

  /**
   * Require MFA claim in the token (amr claim must contain 'mfa').
   * @defaultValue false
   */
  requireMFA?: boolean;
}

/**
 * Props for MsalAuthProvider component
 * 
 * @remarks
 * Extends MsalAuthConfig with React children prop
 */
export interface MsalAuthProviderProps extends MsalAuthConfig {
  /**
   * Child components to wrap with authentication context
   */
  children: ReactNode;
}
