import { NextRequest, NextResponse } from 'next/server';
import { safeJsonParse, isValidAccountData } from '../utils/validation';
import { validateTenantAccess } from '../utils/tenantValidator';
import type { MultiTenantConfig } from '../types';

export interface AuthMiddlewareConfig {
  /**
   * Routes that require authentication
   * @example ['/dashboard', '/profile', '/api/protected']
   */
  protectedRoutes?: string[];

  /**
   * Routes that should be accessible only when NOT authenticated
   * @example ['/login', '/signup']
   */
  publicOnlyRoutes?: string[];

  /**
   * Login page path
   * @default '/login'
   */
  loginPath?: string;

  /**
   * Redirect path after login
   * @default '/'
   */
  redirectAfterLogin?: string;

  /**
   * Cookie name for session
   * @default 'msal.account'
   */
  sessionCookie?: string;

  /**
   * Custom authentication check function
   */
  isAuthenticated?: (request: NextRequest) => boolean | Promise<boolean>;

  /**
   * Tenant access configuration (v5.1.0).
   * Validated against the account stored in the session cookie.
   */
  tenantConfig?: MultiTenantConfig;

  /**
   * Path to redirect to when tenant access is denied (v5.1.0).
   * @default '/unauthorized'
   */
  tenantDeniedPath?: string;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

/**
 * Creates authentication middleware for Next.js App Router
 * 
 * @example
 * ```tsx
 * // middleware.ts
 * import { createAuthMiddleware } from '@chemmangat/msal-next';
 * 
 * export const middleware = createAuthMiddleware({
 *   protectedRoutes: ['/dashboard', '/profile'],
 *   publicOnlyRoutes: ['/login'],
 *   loginPath: '/login',
 * });
 * 
 * export const config = {
 *   matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
 * };
 * ```
 */
export function createAuthMiddleware(config: AuthMiddlewareConfig = {}) {
  const {
    protectedRoutes = [],
    publicOnlyRoutes = [],
    loginPath = '/login',
    redirectAfterLogin = '/',
    sessionCookie = 'msal.account',
    isAuthenticated: customAuthCheck,
    tenantConfig,
    tenantDeniedPath = '/unauthorized',
    debug = false,
  } = config;

  return async function authMiddleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (debug) {
      console.log('[AuthMiddleware] Processing:', pathname);
    }

    // Check if user is authenticated
    let authenticated = false;

    if (customAuthCheck) {
      authenticated = await customAuthCheck(request);
    } else {
      // Default: check for session cookie
      const sessionData = request.cookies.get(sessionCookie);
      authenticated = !!sessionData?.value;
    }

    if (debug) {
      console.log('[AuthMiddleware] Authenticated:', authenticated);
    }

    // Check if route is protected
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // Check if route is public-only
    const isPublicOnlyRoute = publicOnlyRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute && !authenticated) {
      if (debug) {
        console.log('[AuthMiddleware] Redirecting to login');
      }

      const url = request.nextUrl.clone();
      url.pathname = loginPath;
      url.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(url);
    }

    // Tenant validation for authenticated users on protected routes (v5.1.0)
    if (isProtectedRoute && authenticated && tenantConfig) {
      try {
        const sessionData = request.cookies.get(sessionCookie);
        if (sessionData?.value) {
          const account = safeJsonParse(sessionData.value, isValidAccountData);
          if (account) {
            const tenantResult = validateTenantAccess(account as any, tenantConfig);
            if (!tenantResult.allowed) {
              if (debug) {
                console.log('[AuthMiddleware] Tenant access denied:', tenantResult.reason);
              }
              const url = request.nextUrl.clone();
              url.pathname = tenantDeniedPath;
              url.searchParams.set('reason', tenantResult.reason || 'access_denied');
              return NextResponse.redirect(url);
            }
          }
        }
      } catch (error) {
        if (debug) {
          console.warn('[AuthMiddleware] Tenant validation error:', error);
        }
      }
    }

    // Redirect authenticated users from public-only routes
    if (isPublicOnlyRoute && authenticated) {
      if (debug) {
        console.log('[AuthMiddleware] Redirecting to home');
      }

      const returnUrl = request.nextUrl.searchParams.get('returnUrl');
      const url = request.nextUrl.clone();
      url.pathname = returnUrl || redirectAfterLogin;
      url.searchParams.delete('returnUrl');
      return NextResponse.redirect(url);
    }

    // Add auth headers for server components
    const response = NextResponse.next();
    if (authenticated) {
      response.headers.set('x-msal-authenticated', 'true');
      
      // Try to add username from cookie with validation
      try {
        const sessionData = request.cookies.get(sessionCookie);
        if (sessionData?.value) {
          const account = safeJsonParse(sessionData.value, isValidAccountData);
          if (account?.username) {
            response.headers.set('x-msal-username', account.username);
          }
        }
      } catch (error) {
        // Ignore parsing errors
        if (debug) {
          console.warn('[AuthMiddleware] Failed to parse session data');
        }
      }
    }

    return response;
  };
}
