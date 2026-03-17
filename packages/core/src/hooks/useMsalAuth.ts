'use client';

import { useMsal, useAccount } from '@azure/msal-react';
import { AccountInfo, InteractionStatus, RedirectRequest, SilentRequest } from '@azure/msal-browser';
import { useCallback, useMemo } from 'react';
import { wrapMsalError } from '../errors/MsalError';

export interface UseMsalAuthReturn {
  /**
   * Current authenticated account
   */
  account: AccountInfo | null;

  /**
   * All accounts in the cache
   */
  accounts: AccountInfo[];

  /**
   * Whether user is authenticated
   */
  isAuthenticated: boolean;

  /**
   * Whether MSAL is currently performing an interaction
   */
  inProgress: boolean;

  /**
   * Login using redirect
   */
  loginRedirect: (scopes?: string[]) => Promise<void>;

  /**
   * Logout using redirect
   */
  logoutRedirect: () => Promise<void>;

  /**
   * Acquire access token silently
   */
  acquireToken: (scopes: string[]) => Promise<string>;

  /**
   * Acquire access token silently only (no fallback)
   */
  acquireTokenSilent: (scopes: string[]) => Promise<string>;

  /**
   * Acquire access token using redirect
   */
  acquireTokenRedirect: (scopes: string[]) => Promise<void>;

  /**
   * Clear MSAL session without triggering Microsoft logout
   */
  clearSession: () => Promise<void>;

  /**
   * Acquire an access token for a specific tenant (cross-tenant, v5.1.0).
   * Uses acquireTokenSilent with an explicit authority for the target tenant.
   */
  acquireTokenForTenant: (tenantId: string, scopes: string[]) => Promise<string>;
}

// Request deduplication map to prevent race conditions
const pendingTokenRequests = new Map<string, Promise<string>>();

export function useMsalAuth(defaultScopes: string[] = ['User.Read']): UseMsalAuthReturn {
  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || null);

  const isAuthenticated = useMemo(() => accounts.length > 0, [accounts]);

  const loginRedirect = useCallback(
    async (scopes: string[] = defaultScopes) => {
      // Prevent login if already in progress
      if (inProgress !== InteractionStatus.None) {
        console.warn('[MSAL] Interaction already in progress');
        return;
      }

      try {
        const request: RedirectRequest = {
          scopes,
          prompt: 'select_account',
        };
        await instance.loginRedirect(request);
      } catch (error: any) {
        const msalError = wrapMsalError(error);
        
        // Handle user cancellation gracefully (not a real error)
        if (msalError.isUserCancellation()) {
          console.log('[MSAL] User cancelled login');
          return;
        }
        
        // Log enhanced error in development
        if (process.env.NODE_ENV === 'development') {
          console.error(msalError.toConsoleString());
        } else {
          console.error('[MSAL] Login redirect failed:', msalError.message);
        }
        
        throw msalError;
      }
    },
    [instance, defaultScopes, inProgress]
  );

  const logoutRedirect = useCallback(async () => {
    try {
      await instance.logoutRedirect({
        account: account || undefined,
      });
    } catch (error) {
      const msalError = wrapMsalError(error);
      
      if (process.env.NODE_ENV === 'development') {
        console.error(msalError.toConsoleString());
      } else {
        console.error('[MSAL] Logout redirect failed:', msalError.message);
      }
      
      throw msalError;
    }
  }, [instance, account]);

  const acquireTokenSilent = useCallback(
    async (scopes: string[] = defaultScopes): Promise<string> => {
      if (!account) {
        throw new Error('[MSAL] No active account. Please login first.');
      }

      try {
        const request: SilentRequest = {
          scopes,
          account,
          forceRefresh: false,
        };
        const response = await instance.acquireTokenSilent(request);
        return response.accessToken;
      } catch (error) {
        const msalError = wrapMsalError(error);
        
        if (process.env.NODE_ENV === 'development') {
          console.error(msalError.toConsoleString());
        } else {
          console.error('[MSAL] Silent token acquisition failed:', msalError.message);
        }
        
        throw msalError;
      }
    },
    [instance, account, defaultScopes]
  );

  const acquireTokenRedirect = useCallback(
    async (scopes: string[] = defaultScopes): Promise<void> => {
      if (!account) {
        throw new Error('[MSAL] No active account. Please login first.');
      }

      try {
        const request: RedirectRequest = {
          scopes,
          account,
        };
        await instance.acquireTokenRedirect(request);
      } catch (error) {
        const msalError = wrapMsalError(error);
        
        if (process.env.NODE_ENV === 'development') {
          console.error(msalError.toConsoleString());
        } else {
          console.error('[MSAL] Token redirect acquisition failed:', msalError.message);
        }
        
        throw msalError;
      }
    },
    [instance, account, defaultScopes]
  );

  const acquireToken = useCallback(
    async (scopes: string[] = defaultScopes): Promise<string> => {
      // Create a unique key for request deduplication
      const requestKey = `${account?.homeAccountId || 'anonymous'}-${scopes.sort().join(',')}`;

      // Check if there's already a pending request for these scopes
      const pendingRequest = pendingTokenRequests.get(requestKey);
      if (pendingRequest) {
        return pendingRequest;
      }

      // Create new request
      const tokenRequest = (async () => {
        try {
          return await acquireTokenSilent(scopes);
        } catch (error) {
          console.warn('[MSAL] Silent token acquisition failed, falling back to redirect');
          await acquireTokenRedirect(scopes);
          throw new Error('[MSAL] Redirecting for token acquisition');
        } finally {
          // Clean up pending request
          pendingTokenRequests.delete(requestKey);
        }
      })();

      // Store pending request
      pendingTokenRequests.set(requestKey, tokenRequest);

      return tokenRequest;
    },
    [acquireTokenSilent, acquireTokenRedirect, defaultScopes, account]
  );

  const clearSession = useCallback(async () => {
    instance.setActiveAccount(null);
    await instance.clearCache();
  }, [instance]);

  const acquireTokenForTenant = useCallback(
    async (tenantId: string, scopes: string[]): Promise<string> => {
      if (!account) {
        throw new Error('[MSAL] No active account. Please login first.');
      }
      try {
        const response = await instance.acquireTokenSilent({
          scopes,
          account,
          authority: `https://login.microsoftonline.com/${tenantId}`,
          forceRefresh: false,
        });
        return response.accessToken;
      } catch (error) {
        const msalError = wrapMsalError(error);
        if (process.env.NODE_ENV === 'development') {
          console.error(msalError.toConsoleString());
        } else {
          console.error('[MSAL] Cross-tenant token acquisition failed:', msalError.message);
        }
        throw msalError;
      }
    },
    [instance, account]
  );

  return {
    account,
    accounts,
    isAuthenticated,
    inProgress: inProgress !== InteractionStatus.None,
    loginRedirect,
    logoutRedirect,
    acquireToken,
    acquireTokenSilent,
    acquireTokenRedirect,
    clearSession,
    acquireTokenForTenant,
  };
}
