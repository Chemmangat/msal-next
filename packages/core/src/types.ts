import { Configuration, LogLevel, IPublicClientApplication } from '@azure/msal-browser';
import { ReactNode } from 'react';

export interface MsalAuthConfig {
  /**
   * Azure AD Application (client) ID
   */
  clientId: string;

  /**
   * Azure AD Directory (tenant) ID (optional for multi-tenant)
   */
  tenantId?: string;

  /**
   * Authority type: 'common' for multi-tenant, 'organizations', 'consumers', or 'tenant' for single-tenant
   * @default 'common'
   */
  authorityType?: 'common' | 'organizations' | 'consumers' | 'tenant';

  /**
   * Redirect URI after authentication
   * @default window.location.origin
   */
  redirectUri?: string;

  /**
   * Post logout redirect URI
   * @default redirectUri
   */
  postLogoutRedirectUri?: string;

  /**
   * Default scopes for authentication
   * @default ['User.Read']
   */
  scopes?: string[];

  /**
   * Cache location: 'sessionStorage', 'localStorage', or 'memoryStorage'
   * @default 'sessionStorage'
   */
  cacheLocation?: 'sessionStorage' | 'localStorage' | 'memoryStorage';

  /**
   * Store auth state in cookie (for IE11/Edge legacy)
   * @default false
   */
  storeAuthStateInCookie?: boolean;

  /**
   * Navigate to login request URL after authentication
   * @default true
   */
  navigateToLoginRequestUrl?: boolean;

  /**
   * Custom MSAL configuration (overrides all other options)
   */
  msalConfig?: Configuration;

  /**
   * Enable debug logging
   * @default false
   */
  enableLogging?: boolean;

  /**
   * Custom logger callback
   */
  loggerCallback?: (level: LogLevel, message: string, containsPii: boolean) => void;

  /**
   * Loading component to show while MSAL initializes
   */
  loadingComponent?: ReactNode;

  /**
   * Callback invoked after MSAL initialization completes successfully
   */
  onInitialized?: (instance: IPublicClientApplication) => void;
}

export interface MsalAuthProviderProps extends MsalAuthConfig {
  children: ReactNode;
}
