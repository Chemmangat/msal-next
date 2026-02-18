import { Configuration, LogLevel } from '@azure/msal-browser';
import { MsalAuthConfig } from '../types';

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
    navigateToLoginRequestUrl = true,
    enableLogging = false,
    loggerCallback,
  } = config;

  if (!clientId) {
    throw new Error('@chemmangat/msal-next: clientId is required');
  }

  // Build authority URL
  const getAuthority = (): string => {
    if (authorityType === 'tenant') {
      if (!tenantId) {
        throw new Error('@chemmangat/msal-next: tenantId is required when authorityType is "tenant"');
      }
      return `https://login.microsoftonline.com/${tenantId}`;
    }
    return `https://login.microsoftonline.com/${authorityType}`;
  };

  // Default redirect URI
  const defaultRedirectUri = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const finalRedirectUri = redirectUri || defaultRedirectUri;

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
