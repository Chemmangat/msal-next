export { MsalAuthProvider, getMsalInstance } from './components/MsalAuthProvider';
export { MicrosoftSignInButton } from './components/MicrosoftSignInButton';
export { useMsalAuth } from './hooks/useMsalAuth';
export type { UseMsalAuthReturn } from './hooks/useMsalAuth';
export type { MsalAuthConfig, MsalAuthProviderProps } from './types';
export type { MicrosoftSignInButtonProps } from './components/MicrosoftSignInButton';

// Re-export useful MSAL hooks
export { useMsal, useIsAuthenticated, useAccount } from '@azure/msal-react';
