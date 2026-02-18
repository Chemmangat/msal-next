export { MsalAuthProvider } from './components/MsalAuthProvider';
export { useMsalAuth } from './hooks/useMsalAuth';
export type { MsalAuthConfig, MsalAuthProviderProps } from './types';

// Re-export useful MSAL hooks
export { useMsal, useIsAuthenticated, useAccount } from '@azure/msal-react';
