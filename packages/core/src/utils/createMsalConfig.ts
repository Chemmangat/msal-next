import { Configuration, LogLevel } from '@azure/msal-browser';
import { MsalAuthConfig } from '../types';
import { isValidRedirectUri } from './validation';

export function createMsalConfig(config: MsalAuthConfig): Configuration {
  // If custom config provided, use it
  if (config.msalConfig) {
    return config.msalConfig;
  }

  const {
    clientId,
    tenantId,
    authorityType = 'common',
    redirectUri,
    postLogoutRedirectUri,
    cacheLocation = 'sessionStorage',
    storeAuthStateInCookie = false,
    navigateToLoginRequestUrl = false,
    enableLogging = false,
    loggerCallback,
    allowedRedirectUris,
    multiTenant,
  } = config;

  if (!clientId) {
    throw new Error('@chemmangat/msal-next: clientId is required');
  }

  // Resolve effective authority type:
  // multiTenant.type takes precedence over legacy authorityType prop
  const resolveAuthorityType = (): string => {
    if (multiTenant?.type) {
      switch (multiTenant.type) {
        case 'single':
          // single-tenant — requires tenantId
          if (!tenantId) {
            throw new Error(
              '@chemmangat/msal-next: tenantId is required when multiTenant.type is "single"'
            );
          }
          return tenantId;
        case 'multi':
        case 'common':
          return 'common';
        case 'organizations':
          return 'organizations';
        case 'consumers':
          return 'consumers';
      }
    }
    // Legacy authorityType
    if (authorityType === 'tenant') {
      if (!tenantId) {
        throw new Error(
          '@chemmangat/msal-next: tenantId is required when authorityType is "tenant"'
        );
      }
      return tenantId;
    }
    return authorityType;
  };

  // Build authority URL
  const getAuthority = (): string => {
    const resolved = resolveAuthorityType();
    return `https://login.microsoftonline.com/${resolved}`;
  };

  // Default redirect URI
  const defaultRedirectUri = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const finalRedirectUri = redirectUri || defaultRedirectUri;

  // Validate redirect URIs if allowedRedirectUris is provided
  if (allowedRedirectUris && allowedRedirectUris.length > 0) {
    if (!isValidRedirectUri(finalRedirectUri, allowedRedirectUris)) {
      throw new Error(
        `@chemmangat/msal-next: redirectUri "${finalRedirectUri}" is not in the allowed list`
      );
    }

    const finalPostLogoutUri = postLogoutRedirectUri || finalRedirectUri;
    if (!isValidRedirectUri(finalPostLogoutUri, allowedRedirectUris)) {
      throw new Error(
        `@chemmangat/msal-next: postLogoutRedirectUri "${finalPostLogoutUri}" is not in the allowed list`
      );
    }
  }

  const msalConfig: Configuration = {
    auth: {
      clientId,
      authority: getAuthority(),
      redirectUri: finalRedirectUri,
      postLogoutRedirectUri: postLogoutRedirectUri || finalRedirectUri,
      navigateToLoginRequestUrl,
    },
    cache: {
      cacheLocation,
      storeAuthStateInCookie,
    },
    system: {
      loggerOptions: {
        loggerCallback: loggerCallback || ((level: LogLevel, message: string, containsPii: boolean) => {
          if (containsPii || !enableLogging) return;
          
          switch (level) {
            case LogLevel.Error:
              console.error('[MSAL]', message);
              break;
            case LogLevel.Warning:
              console.warn('[MSAL]', message);
              break;
            case LogLevel.Info:
              console.info('[MSAL]', message);
              break;
            case LogLevel.Verbose:
              console.debug('[MSAL]', message);
              break;
          }
        }),
        logLevel: enableLogging ? LogLevel.Verbose : LogLevel.Error,
      },
    },
  };

  return msalConfig;
}
