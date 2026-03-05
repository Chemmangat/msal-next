/**
 * Example: Role-Based Routing
 * 
 * This example demonstrates how to implement role-based access control
 * with automatic routing based on user roles.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRoles, AuthGuard } from '@chemmangat/msal-next';

/**
 * Role-based route configuration
 */
const ROLE_ROUTES = {
  Admin: '/admin/dashboard',
  Manager: '/manager/dashboard',
  User: '/user/dashboard',
} as const;

/**
 * Component that redirects users based on their role
 */
export function RoleBasedRedirect() {
  const router = useRouter();
  const { roles, loading } = useRoles();

  useEffect(() => {
    if (!loading && roles.length > 0) {
      // Find the highest priority role
      for (const [role, route] of Object.entries(ROLE_ROUTES)) {
        if (roles.includes(role)) {
          router.push(route);
          return;
        }
      }

      // Default route if no matching role
      router.push('/dashboard');
    }
  }, [roles, loading, router]);

  if (loading) {
    return <div>Loading your dashboard...</div>;
  }

  return <div>Redirecting...</div>;
}

/**
 * Protected page component with role check
 */
interface RoleGateProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGate({ allowedRoles, children, fallback }: RoleGateProps) {
  const { hasAnyRole, loading } = useRoles();

  if (loading) {
    return <div>Checking permissions...</div>;
  }

  if (!hasAnyRole(allowedRoles)) {
    return fallback || (
      <div>
        <h1>Access Denied</h1>
        <p>You don't have permission to view this page.</p>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Example usage in a page
 */
export default function AdminPage() {
  return (
    <AuthGuard>
      <RoleGate allowedRoles={['Admin']}>
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome to the admin panel!</p>
        </div>
      </RoleGate>
    </AuthGuard>
  );
}
