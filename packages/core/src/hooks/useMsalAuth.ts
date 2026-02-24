'use client';

import { useMsal, useAccount } from '@azure/msal-react';
import { AccountInfo, InteractionStatus, PopupRequest, RedirectRequest, SilentRequest } from '@azure/msal-browser';
import { useCallback, useMemo } from 'react';

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
   * Login using popup
   */
  loginPopup: (scopes?: string[]) => Promise<void>;

  /**
   * Login using redirect
   */
  loginRedirect: (scopes?: string[]) => Promise<void>;

  /**
   * Logout using popup
   */
  logoutPopup: () => Promise<void>;

  /**
   * Logout using redirect
   */
  logoutRedirect: () => Promise<void>;

  /**
   * Acquire access token silently (with fallback to popup)
   */
  acquireToken: (scopes: string[]) => Promise<string>;

  /**
   * Acquire access token silently only (no fallback)
   */
  acquireTokenSilent: (scopes: string[]) => Promise<string>;

  /**
   * Acquire access token using popup
   */
  acquireTokenPopup: (scopes: string[]) => Promise<string>;

  /**
   * Acquire access token using redirect
   */
  acquireTokenRedirect: (scopes: string[]) => Promise<void>;

  /**
   * Clear MSAL session without triggering Microsoft logout
   */
  clearSession: () => Promise<void>;
}

export function useMsalAuth(defaultScopes: string[] = ['User.Read']): UseMsalAuthReturn {
  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || null);

  const isAuthenticated = useMemo(() => accounts.length > 0, [accounts]);

  const loginPopup = useCallback(
    async (scopes: string[] = defaultScopes) => {
      try {
        const request: PopupRequest = {
          scopes,
          prompt: 'select_account',
        };
        await instance.loginPopup(request);
      } catch (error) {
        console.error('[MSAL] Login popup failed:', error);
        throw error;
      }
    },
    [instance, defaultScopes]
  );

  const loginRedirect = useCallback(
    async (scopes: string[] = defaultScopes) => {
      try {
        const request: RedirectRequest = {
          scopes,
          prompt: 'select_account',
        };
        await instance.loginRedirect(request);
      } catch (error) {
        console.error('[MSAL] Login redirect failed:', error);
        throw error;
      }
    },
    [instance, defaultScopes]
  );

  const logoutPopup = useCallback(async () => {
    try {
      await instance.logoutPopup({
        account: account || undefined,
      });
    } catch (error) {
      console.error('[MSAL] Logout popup failed:', error);
      throw error;
    }
  }, [instance, account]);

  const logoutRedirect = useCallback(async () => {
    try {
      await instance.logoutRedirect({
        account: account || undefined,
      });
    } catch (error) {
      console.error('[MSAL] Logout redirect failed:', error);
      throw error;
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
        console.error('[MSAL] Silent token acquisition failed:', error);
        throw error;
      }
    },
    [instance, account, defaultScopes]
  );

  const acquireTokenPopup = useCallback(
    async (scopes: string[] = defaultScopes): Promise<string> => {
      if (!account) {
        throw new Error('[MSAL] No active account. Please login first.');
      }

      try {
        const request: PopupRequest = {
          scopes,
          account,
        };
        const response = await instance.acquireTokenPopup(request);
        return response.accessToken;
      } catch (error) {
        console.error('[MSAL] Token popup acquisition failed:', error);
        throw error;
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
        console.error('[MSAL] Token redirect acquisition failed:', error);
        throw error;
      }
    },
    [instance, account, defaultScopes]
  );

  const acquireToken = useCallback(
    async (scopes: string[] = defaultScopes): Promise<string> => {
      try {
        return await acquireTokenSilent(scopes);
      } catch (error) {
        console.warn('[MSAL] Silent token acquisition failed, falling back to popup');
        return await acquireTokenPopup(scopes);
      }
    },
    [acquireTokenSilent, acquireTokenPopup, defaultScopes]
  );

  const clearSession = useCallback(async () => {
    instance.setActiveAccount(null);
    await instance.clearCache();
  }, [instance]);

  return {
    account,
    accounts,
    isAuthenticated,
    inProgress: inProgress !== InteractionStatus.None,
    loginPopup,
    loginRedirect,
    logoutPopup,
    logoutRedirect,
    acquireToken,
    acquireTokenSilent,
    acquireTokenPopup,
    acquireTokenRedirect,
    clearSession,
  };
}
