import { NextRequest, NextResponse } from 'next/server';

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
      
      // Try to add username from cookie
      try {
        const sessionData = request.cookies.get(sessionCookie);
        if (sessionData?.value) {
          const account = JSON.parse(sessionData.value);
          if (account.username) {
            response.headers.set('x-msal-username', account.username);
          }
        }
      } catch (error) {
        // Ignore parsing errors
      }
    }

    return response;
  };
}
