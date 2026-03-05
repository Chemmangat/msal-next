/**
 * Example: Multi-Tenant SaaS Application
 * 
 * This example demonstrates how to build a multi-tenant SaaS application
 * with tenant isolation and custom branding per tenant.
 */

'use client';

import { useMemo } from 'react';
import { MsalAuthProvider, useMsalAuth, useUserProfile } from '@chemmangat/msal-next';

/**
 * Tenant configuration
 */
interface TenantConfig {
  id: string;
  name: string;
  domain: string;
  clientId: string;
  tenantId: string;
  brandColor: string;
  logo: string;
}

/**
 * Example tenant configurations
 */
const TENANTS: Record<string, TenantConfig> = {
  'acme': {
    id: 'acme',
    name: 'Acme Corporation',
    domain: 'acme.example.com',
    clientId: 'acme-client-id',
    tenantId: 'acme-tenant-id',
    brandColor: '#FF6B6B',
    logo: '/logos/acme.png',
  },
  'globex': {
    id: 'globex',
    name: 'Globex Corporation',
    domain: 'globex.example.com',
    clientId: 'globex-client-id',
    tenantId: 'globex-tenant-id',
    brandColor: '#4ECDC4',
    logo: '/logos/globex.png',
  },
};

/**
 * Get tenant from subdomain or path
 */
function getTenantFromUrl(): TenantConfig | null {
  if (typeof window === 'undefined') return null;

  // Check subdomain (e.g., acme.example.com)
  const subdomain = window.location.hostname.split('.')[0];
  if (TENANTS[subdomain]) {
    return TENANTS[subdomain];
  }

  // Check path (e.g., example.com/acme)
  const pathSegment = window.location.pathname.split('/')[1];
  if (TENANTS[pathSegment]) {
    return TENANTS[pathSegment];
  }

  return null;
}

/**
 * Multi-tenant auth provider wrapper
 */
export function MultiTenantAuthProvider({ children }: { children: React.ReactNode }) {
  const tenant = getTenantFromUrl();

  if (!tenant) {
    return (
      <div>
        <h1>Invalid Tenant</h1>
        <p>Please access the application through a valid tenant URL.</p>
      </div>
    );
  }

  return (
    <MsalAuthProvider
      clientId={tenant.clientId}
      tenantId={tenant.tenantId}
      redirectUri={`https://${tenant.domain}/auth/callback`}
    >
      <TenantBranding tenant={tenant}>
        {children}
      </TenantBranding>
    </MsalAuthProvider>
  );
}

/**
 * Apply tenant-specific branding
 */
function TenantBranding({ tenant, children }: { tenant: TenantConfig; children: React.ReactNode }) {
  useMemo(() => {
    // Apply brand color to CSS variables
    document.documentElement.style.setProperty('--brand-color', tenant.brandColor);
    document.title = `${tenant.name} - Dashboard`;
  }, [tenant]);

  return <>{children}</>;
}

/**
 * Tenant-aware user profile component
 */
export function TenantUserProfile() {
  const { profile, loading } = useUserProfile();
  const { account } = useMsalAuth();
  const tenant = getTenantFromUrl();

  if (loading) return <div>Loading...</div>;
  if (!profile || !tenant) return null;

  // Extract tenant-specific claims
  const tenantClaims = account?.idTokenClaims as any;
  const userRole = tenantClaims?.roles?.[0] || 'User';
  const department = tenantClaims?.department || 'N/A';

  return (
    <div style={{ borderColor: tenant.brandColor }}>
      <img src={tenant.logo} alt={tenant.name} />
      <h2>{profile.displayName}</h2>
      <p>Organization: {tenant.name}</p>
      <p>Role: {userRole}</p>
      <p>Department: {department}</p>
      <p>Email: {profile.mail}</p>
    </div>
  );
}

/**
 * Tenant isolation middleware example
 */
export function validateTenantAccess(userTenantId: string, requestedTenantId: string): boolean {
  // Ensure user can only access their own tenant's data
  return userTenantId === requestedTenantId;
}

/**
 * Example API route with tenant isolation
 */
export async function getTenantData(tenantId: string, userId: string) {
  // Validate tenant access
  const userTenant = await getUserTenant(userId);
  
  if (!validateTenantAccess(userTenant, tenantId)) {
    throw new Error('Access denied: Tenant mismatch');
  }

  // Fetch tenant-specific data
  return await fetchDataForTenant(tenantId);
}

// Helper functions (implementation depends on your backend)
async function getUserTenant(userId: string): Promise<string> {
  // Fetch user's tenant from database
  return 'acme-tenant-id';
}

async function fetchDataForTenant(tenantId: string): Promise<any> {
  // Fetch data scoped to tenant
  return {};
}
