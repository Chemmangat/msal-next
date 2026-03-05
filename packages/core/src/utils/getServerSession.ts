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
 * Helper to set server session in cookies (call from client-side after auth)
 * 
 * @example
 * ```tsx
 * // After successful login
 * await setServerSessionCookie(account, accessToken);
 * ```
 */
export async function setServerSessionCookie(account: any, accessToken?: string): Promise<void> {
  try {
    const accountData = {
      homeAccountId: account.homeAccountId,
      username: account.username,
      name: account.name,
    };

    // Set cookies via API route
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account: accountData,
        token: accessToken,
      }),
    });
  } catch (error) {
    console.error('[ServerSession] Failed to set session cookie:', error);
  }
}
