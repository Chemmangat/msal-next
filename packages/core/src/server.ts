/**
 * Server-only utilities for @chemmangat/msal-next
 * 
 * Import from '@chemmangat/msal-next/server' in Server Components only
 * 
 * @example
 * ```tsx
 * // app/dashboard/page.tsx (Server Component)
 * import { getServerSession } from '@chemmangat/msal-next/server';
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
export { getServerSession, setServerSessionCookie } from './utils/getServerSession';

// ============================================================================
// Type Exports
// ============================================================================
export type { ServerSession } from './utils/getServerSession';
