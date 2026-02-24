// Example: middleware.ts
// This is an example middleware configuration for protecting routes

import { createAuthMiddleware } from '@chemmangat/msal-next';

/**
 * Basic middleware configuration
 */
export const middleware = createAuthMiddleware({
  // Routes that require authentication
  protectedRoutes: [
    '/dashboard',
    '/profile',
    '/settings',
    '/api/protected',
  ],

  // Routes that should only be accessible when NOT authenticated
  publicOnlyRoutes: [
    '/login',
    '/signup',
  ],

  // Where to redirect unauthenticated users
  loginPath: '/login',

  // Where to redirect after successful login
  redirectAfterLogin: '/dashboard',

  // Enable debug logging
  debug: process.env.NODE_ENV === 'development',
});

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};

/**
 * Advanced middleware with custom authentication check
 */
export const advancedMiddleware = createAuthMiddleware({
  protectedRoutes: ['/dashboard', '/admin'],
  loginPath: '/login',

  // Custom authentication check
  isAuthenticated: async (request) => {
    // Check custom header
    const authHeader = request.headers.get('x-custom-auth');
    if (authHeader) {
      return true;
    }

    // Check custom cookie
    const sessionCookie = request.cookies.get('custom-session');
    if (sessionCookie?.value) {
      // Validate session token
      try {
        const session = JSON.parse(sessionCookie.value);
        return session.isValid && session.expiresAt > Date.now();
      } catch {
        return false;
      }
    }

    return false;
  },

  debug: true,
});

/**
 * Role-based middleware example
 */
export const roleBasedMiddleware = createAuthMiddleware({
  protectedRoutes: ['/admin'],
  loginPath: '/login',

  isAuthenticated: async (request) => {
    const accountCookie = request.cookies.get('msal.account');
    
    if (!accountCookie?.value) {
      return false;
    }

    try {
      const account = JSON.parse(accountCookie.value);
      
      // Check if user has admin role
      const roles = account.idTokenClaims?.roles || [];
      
      // For admin routes, require admin role
      if (request.nextUrl.pathname.startsWith('/admin')) {
        return roles.includes('Admin');
      }

      // For other protected routes, just check authentication
      return true;
    } catch {
      return false;
    }
  },
});
