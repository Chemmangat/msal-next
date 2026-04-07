/**
 * @chemmangat/msal-next - Middleware Module
 *
 * Edge-compatible middleware for protecting Next.js routes.
 * Import from '@chemmangat/msal-next/middleware' in middleware.ts.
 *
 * @example
 * ```ts
 * // middleware.ts
 * import { createAuthMiddleware } from '@chemmangat/msal-next/middleware';
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

export { createAuthMiddleware } from './middleware/createAuthMiddleware';
export type { AuthMiddlewareConfig } from './middleware/createAuthMiddleware';
