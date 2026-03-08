'use client';

import { useMsal } from '@azure/msal-react';
import { AccountInfo, InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { wrapMsalError } from '../errors/MsalError';

export interface UseMultiAccountReturn {
  /**
   * All signed-in accounts
   */
  accounts: AccountInfo[];

  /**
   * Currently active account
   */
  activeAccount: AccountInfo | null;

  /**
   * Whether user has multiple accounts signed in
   */
  hasMultipleAccounts: boolean;

  /**
   * Number of signed-in accounts
   */
  accountCount: number;

  /**
   * Whether MSAL is currently performing an interaction
   */
  inProgress: boolean;

  /**
   * Switch to a different account
   * @param account - The account to switch to
   */
  switchAccount: (account: AccountInfo) => void;

  /**
   * Add a new account (sign in with another account)
   * @param scopes - Optional scopes for the new account
   */
  addAccount: (scopes?: string[]) => Promise<void>;

  /**
   * Remove an account from the cache
   * @param account - The account to remove
   */
  removeAccount: (account: AccountInfo) => Promise<void>;

  /**
   * Sign out from a specific account
   * @param account - The account to sign out from
   */
  signOutAccount: (account: AccountInfo) => Promise<void>;

  /**
   * Sign out from all accounts
   */
  signOutAll: () => Promise<void>;

  /**
   * Get account by username
   * @param username - The username to search for
   */
  getAccountByUsername: (username: string) => AccountInfo | undefined;

  /**
   * Get account by home account ID
   * @param homeAccountId - The home account ID to search for
   */
  getAccountById: (homeAccountId: string) => AccountInfo | undefined;

  /**
   * Check if a specific account is active
   * @param account - The account to check
   */
  isActiveAccount: (account: AccountInfo) => boolean;
}

/**
 * Hook for managing multiple Microsoft accounts
 * 
 * @remarks
 * Allows users to sign in with multiple Microsoft accounts and switch between them seamlessly.
 * Perfect for users who need to access both work and personal accounts, or multiple work accounts.
 * 
 * @example
 * ```tsx
 * 'use client';
 * 
 * import { useMultiAccount } from '@chemmangat/msal-next';
 * 
 * export default function AccountManager() {
 *   const {
 *     accounts,
 *     activeAccount,
 *     switchAccount,
 *     addAccount,
 *     removeAccount,
 *     hasMultipleAccounts
 *   } = useMultiAccount();
 * 
 *   return (
 *     <div>
 *       <h2>Active: {activeAccount?.name}</h2>
 *       
 *       {hasMultipleAccounts && (
 *         <div>
 *           <h3>Switch Account:</h3>
 *           {accounts.map(account => (
 *             <button
 *               key={account.homeAccountId}
 *               onClick={() => switchAccount(account)}
 *             >
 *               {account.name}
 *             </button>
 *           ))}
 *         </div>
 *       )}
 *       
 *       <button onClick={() => addAccount()}>
 *         Add Another Account
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useMultiAccount(defaultScopes: string[] = ['User.Read']): UseMultiAccountReturn {
  const { instance, accounts, inProgress } = useMsal();
  const [activeAccount, setActiveAccount] = useState<AccountInfo | null>(
    instance.getActiveAccount()
  );

  // Sync active account state with MSAL instance
  useEffect(() => {
    const currentActive = instance.getActiveAccount();
    if (currentActive?.homeAccountId !== activeAccount?.homeAccountId) {
      setActiveAccount(currentActive);
    }
  }, [instance, accounts, activeAccount]);

  const hasMultipleAccounts = useMemo(() => accounts.length > 1, [accounts]);
  const accountCount = useMemo(() => accounts.length, [accounts]);

  const switchAccount = useCallback(
    (account: AccountInfo) => {
      try {
        instance.setActiveAccount(account);
        setActiveAccount(account);

        if (process.env.NODE_ENV === 'development') {
          console.log('[MSAL Multi-Account] Switched to account:', account.username);
        }
      } catch (error) {
        const msalError = wrapMsalError(error);
        console.error('[MSAL Multi-Account] Failed to switch account:', msalError.message);
        throw msalError;
      }
    },
    [instance]
  );

  const addAccount = useCallback(
    async (scopes: string[] = defaultScopes) => {
      // Prevent adding account if already in progress
      if (inProgress !== InteractionStatus.None) {
        console.warn('[MSAL Multi-Account] Interaction already in progress');
        return;
      }

      try {
        const request: RedirectRequest = {
          scopes,
          prompt: 'select_account', // Force account selection
          loginHint: undefined, // Don't hint any account
        };

        await instance.loginRedirect(request);
      } catch (error: any) {
        const msalError = wrapMsalError(error);

        // Handle user cancellation gracefully
        if (msalError.isUserCancellation()) {
          console.log('[MSAL Multi-Account] User cancelled adding account');
          return;
        }

        if (process.env.NODE_ENV === 'development') {
          console.error(msalError.toConsoleString());
        } else {
          console.error('[MSAL Multi-Account] Failed to add account:', msalError.message);
        }

        throw msalError;
      }
    },
    [instance, defaultScopes, inProgress]
  );

  const removeAccount = useCallback(
    async (account: AccountInfo) => {
      try {
        // If removing the active account, switch to another account first
        if (activeAccount?.homeAccountId === account.homeAccountId) {
          const otherAccounts = accounts.filter(
            (acc) => acc.homeAccountId !== account.homeAccountId
          );

          if (otherAccounts.length > 0) {
            instance.setActiveAccount(otherAccounts[0]);
            setActiveAccount(otherAccounts[0]);
          } else {
            instance.setActiveAccount(null);
            setActiveAccount(null);
          }
        }

        // Remove account from cache
        await instance.clearCache({
          account,
        });

        if (process.env.NODE_ENV === 'development') {
          console.log('[MSAL Multi-Account] Removed account:', account.username);
        }
      } catch (error) {
        const msalError = wrapMsalError(error);
        console.error('[MSAL Multi-Account] Failed to remove account:', msalError.message);
        throw msalError;
      }
    },
    [instance, activeAccount, accounts]
  );

  const signOutAccount = useCallback(
    async (account: AccountInfo) => {
      try {
        await instance.logoutRedirect({
          account,
        });
      } catch (error) {
        const msalError = wrapMsalError(error);
        console.error('[MSAL Multi-Account] Failed to sign out account:', msalError.message);
        throw msalError;
      }
    },
    [instance]
  );

  const signOutAll = useCallback(async () => {
    try {
      // Sign out from all accounts
      await instance.logoutRedirect({
        account: activeAccount || undefined,
      });

      // Clear all cached accounts
      instance.setActiveAccount(null);
      await instance.clearCache();
    } catch (error) {
      const msalError = wrapMsalError(error);
      console.error('[MSAL Multi-Account] Failed to sign out all accounts:', msalError.message);
      throw msalError;
    }
  }, [instance, activeAccount]);

  const getAccountByUsername = useCallback(
    (username: string): AccountInfo | undefined => {
      return accounts.find((acc) => acc.username === username);
    },
    [accounts]
  );

  const getAccountById = useCallback(
    (homeAccountId: string): AccountInfo | undefined => {
      return accounts.find((acc) => acc.homeAccountId === homeAccountId);
    },
    [accounts]
  );

  const isActiveAccount = useCallback(
    (account: AccountInfo): boolean => {
      return activeAccount?.homeAccountId === account.homeAccountId;
    },
    [activeAccount]
  );

  return {
    accounts,
    activeAccount,
    hasMultipleAccounts,
    accountCount,
    inProgress: inProgress !== InteractionStatus.None,
    switchAccount,
    addAccount,
    removeAccount,
    signOutAccount,
    signOutAll,
    getAccountByUsername,
    getAccountById,
    isActiveAccount,
  };
}
