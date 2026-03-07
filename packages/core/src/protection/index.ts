/**
 * Zero-Config Protected Routes
 * v4.0.0 Killer Feature
 * 
 * Export this from your page to enable protection:
 * 
 * @example
 * ```tsx
 * // app/dashboard/page.tsx
 * export const auth = { required: true };
 * 
 * export default function Dashboard() {
 *   return <div>Protected content</div>;
 * }
 * ```
 */

export { ProtectedPage } from './ProtectedPage';
export { withPageAuth } from './withPageAuth';
export type { PageAuthConfig, AuthProtectionConfig } from './types';
