import { cookies, headers } from 'next/headers';
import { safeJsonParse, isValidAccountData, ValidatedAccountData } from './validation';

export interface ServerSession {
  /**
   * Whether user is authenticated
   */
  isAuthenticated: boolean;

  /**
   * User's account ID from MSAL cache
   */
  accountId?: string;

  /**
   * User's username/email
   */
  username?: string;

  /**
   * Access token (if available in cookie)
   * @deprecated Storing tokens in cookies is not recommended for security reasons
   */
  accessToken?: string;
}

/**
 * Server-side session helper for Next.js App Router
 * 
 * Note: This is a basic implementation that reads from cookies.
 * For production use, consider implementing a proper session store.
 * 
 * @example
 * ```tsx
 * // In a Server Component or Route Handler
 * import { getServerSession } from '@chemmangat/msal-next';
 * 
 * export default async function Page() {
 *   const session = await getServerSession();
 *   
 *   if (!session.isAuthenticated) {
 *     redirect('/login');
 *   }
 *   
 *   return <div>Welcome {session.username}</div>;
 * }
 * ```
 */
export async function getServerSession(): Promise<ServerSession> {
  try {
    const cookieStore = await cookies();
    const headersList = await headers();

    // Try to read MSAL session from cookies
    // MSAL stores data in sessionStorage/localStorage by default,
    // so this requires custom implementation to sync to cookies
    const msalAccount = cookieStore.get('msal.account');
    const msalToken = cookieStore.get('msal.token');

    if (msalAccount?.value) {
      // Safely parse and validate account data
      const accountData = safeJsonParse<ValidatedAccountData>(
        msalAccount.value,
        isValidAccountData
      );

      if (accountData) {
        return {
          isAuthenticated: true,
          accountId: accountData.homeAccountId,
          username: accountData.username,
          accessToken: msalToken?.value,
        };
      } else {
        console.warn('[ServerSession] Invalid account data in cookie');
      }
    }

    // Fallback: check for custom auth header
    const authHeader = headersList.get('x-msal-authenticated');
    if (authHeader === 'true') {
      const username = headersList.get('x-msal-username');
      return {
        isAuthenticated: true,
        username: username || undefined,
      };
    }

    return {
      isAuthenticated: false,
    };
  } catch (error) {
    console.error('[ServerSession] Error reading session:', error);
    return {
      isAuthenticated: false,
    };
  }
}

/**
 * Writes the `msal.account` session cookie directly via `document.cookie`.
 *
 * @remarks
 * **Must be called from a Client Component** (browser context only).
 *
 * As of v5.3.0 this is no longer necessary for most apps — `MsalAuthProvider`
 * automatically writes and clears the cookie on every login/logout event.
 * Only call this manually if you need to set the cookie outside of the normal
 * MSAL auth flow (e.g. after a silent SSO check in a custom component).
 *
 * @example
 * ```tsx
 * 'use client';
 * import { setServerSessionCookie } from '@chemmangat/msal-next/server';
 *
 * // After a custom auth event:
 * setServerSessionCookie(account);
 * ```
 */
export function setServerSessionCookie(account: any): void {
  if (typeof document === 'undefined') {
    console.warn('[ServerSession] setServerSessionCookie must be called in a browser (Client Component) context.');
    return;
  }
  try {
    const data = encodeURIComponent(JSON.stringify({
      homeAccountId: account.homeAccountId,
      username: account.username,
      name: account.name ?? '',
    }));
    document.cookie = `msal.account=${data}; path=/; SameSite=Lax; Secure`;
  } catch (error) {
    console.error('[ServerSession] Failed to set session cookie:', error);
  }
}

/**
 * Clears the `msal.account` session cookie.
 *
 * @remarks
 * **Must be called from a Client Component** (browser context only).
 * As of v5.3.0 this is handled automatically by `MsalAuthProvider` on logout.
 */
export function clearServerSessionCookie(): void {
  if (typeof document === 'undefined') {
    return;
  }
  document.cookie = 'msal.account=; path=/; SameSite=Lax; Secure; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}
