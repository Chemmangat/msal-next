/**
 * @chemmangat/msal-next - Server Module
 * 
 * Server-only utilities for Next.js App Router Server Components
 * 
 * @packageDocumentation
 * 
 * @remarks
 * Import from '@chemmangat/msal-next/server' in Server Components only.
 * Do not import this module in Client Components.
 * 
 * @example
 * ```tsx
 * // app/dashboard/page.tsx (Server Component)
 * import { getServerSession } from '@chemmangat/msal-next/server';
 * import { redirect } from 'next/navigation';
 * 
 * export default async function DashboardPage() {
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

// ============================================================================
// Server-only Utilities
// ============================================================================

/**
 * Get the current user session from server-side cookies
 * 
 * @returns ServerSession object with authentication state
 * 
 * @remarks
 * This function reads session data from cookies set during authentication.
 * It does NOT provide access tokens - use client-side acquireToken() for that.
 * 
 * @example
 * ```tsx
 * // Server Component
 * import { getServerSession } from '@chemmangat/msal-next/server';
 * 
 * export default async function Page() {
 *   const session = await getServerSession();
 *   
 *   if (!session.isAuthenticated) {
 *     return <div>Please sign in</div>;
 *   }
 *   
 *   return (
 *     <div>
 *       <h1>Welcome {session.username}</h1>
 *       <p>Email: {session.email}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export { getServerSession, setServerSessionCookie } from './utils/getServerSession';

// ============================================================================
// Type Exports
// ============================================================================

/**
 * Server session type definition
 * 
 * @remarks
 * Contains user information from the authentication session.
 * Does NOT include access tokens for security reasons.
 */
export type { ServerSession } from './utils/getServerSession';
