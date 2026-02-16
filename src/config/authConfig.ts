import { Configuration, LogLevel } from '@azure/msal-browser';

// Validate required environment variables
const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
const authorityType = process.env.NEXT_PUBLIC_AUTHORITY_TYPE || 'common';
const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000';

if (!clientId) {
  throw new Error('NEXT_PUBLIC_CLIENT_ID is required. Please check your .env.local file.');
}

// Build authority URL based on type
const getAuthority = (): string => {
  if (authorityType === 'tenant' && tenantId) {
    return `https://login.microsoftonline.com/${tenantId}`;
  }
  return 'https://login.microsoftonline.com/common';
};

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: getAuthority(),
    redirectUri,
    postLogoutRedirectUri: redirectUri,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
          default:
            break;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: process.env.NEXT_PUBLIC_SCOPES?.split(',') || ['User.Read'],
};
