import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTenant } from '../../hooks/useTenant';

// Mock useMsalAuth
vi.mock('../../hooks/useMsalAuth', () => ({
  useMsalAuth: vi.fn(),
}));

import { useMsalAuth } from '../../hooks/useMsalAuth';

const mockUseMsalAuth = vi.mocked(useMsalAuth);

function makeAccount(overrides: Record<string, any> = {}) {
  const { idTokenClaims: claimsOverride, ...rest } = overrides;
  return {
    homeAccountId: 'home-id',
    environment: 'login.microsoftonline.com',
    tenantId: 'resource-tenant-id',
    username: 'user@contoso.com',
    localAccountId: 'local-id',
    name: 'Test User',
    idTokenClaims: {
      tid: 'resource-tenant-id',
      iss: 'https://login.microsoftonline.com/resource-tenant-id/v2.0',
      preferred_username: 'user@contoso.com',
      ...claimsOverride,
    },
    ...rest,
  };
}

describe('useTenant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null values when not authenticated', () => {
    mockUseMsalAuth.mockReturnValue({
      account: null,
      isAuthenticated: false,
    } as any);

    const { result } = renderHook(() => useTenant());

    expect(result.current.tenantId).toBeNull();
    expect(result.current.tenantDomain).toBeNull();
    expect(result.current.isGuestUser).toBe(false);
    expect(result.current.homeTenantId).toBeNull();
    expect(result.current.resourceTenantId).toBeNull();
    expect(result.current.claims).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('returns correct tenant info for a member user', () => {
    mockUseMsalAuth.mockReturnValue({
      account: makeAccount(),
      isAuthenticated: true,
    } as any);

    const { result } = renderHook(() => useTenant());

    expect(result.current.tenantId).toBe('resource-tenant-id');
    expect(result.current.tenantDomain).toBe('contoso.com');
    expect(result.current.isGuestUser).toBe(false);
    expect(result.current.resourceTenantId).toBe('resource-tenant-id');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('detects B2B guest user when home tenant differs from resource tenant', () => {
    mockUseMsalAuth.mockReturnValue({
      account: makeAccount({
        tenantId: 'resource-tenant-id',
        username: 'guest@fabrikam.com',
        idTokenClaims: {
          tid: 'resource-tenant-id',
          // iss points to a DIFFERENT home tenant
          iss: 'https://login.microsoftonline.com/home-tenant-id/v2.0',
          preferred_username: 'guest@fabrikam.com',
        },
      }),
      isAuthenticated: true,
    } as any);

    const { result } = renderHook(() => useTenant());

    expect(result.current.isGuestUser).toBe(true);
    expect(result.current.homeTenantId).toBe('home-tenant-id');
    expect(result.current.resourceTenantId).toBe('resource-tenant-id');
    expect(result.current.tenantDomain).toBe('fabrikam.com');
  });

  it('returns isGuestUser false when home and resource tenant match', () => {
    mockUseMsalAuth.mockReturnValue({
      account: makeAccount({
        tenantId: 'same-tenant-id',
        idTokenClaims: {
          tid: 'same-tenant-id',
          iss: 'https://login.microsoftonline.com/same-tenant-id/v2.0',
          preferred_username: 'user@contoso.com',
        },
      }),
      isAuthenticated: true,
    } as any);

    const { result } = renderHook(() => useTenant());

    expect(result.current.isGuestUser).toBe(false);
  });

  it('derives tenantDomain from username when preferred_username is absent', () => {
    mockUseMsalAuth.mockReturnValue({
      account: makeAccount({
        username: 'admin@tailspin.com',
        idTokenClaims: {
          tid: 'some-tenant-id',
          iss: 'https://login.microsoftonline.com/some-tenant-id/v2.0',
        },
      }),
      isAuthenticated: true,
    } as any);

    const { result } = renderHook(() => useTenant());

    expect(result.current.tenantDomain).toBe('tailspin.com');
  });

  it('returns null tenantDomain when username has no @ symbol', () => {
    mockUseMsalAuth.mockReturnValue({
      account: makeAccount({
        username: 'noemail',
        idTokenClaims: {
          tid: 'some-tenant-id',
          iss: 'https://login.microsoftonline.com/some-tenant-id/v2.0',
        },
      }),
      isAuthenticated: true,
    } as any);

    const { result } = renderHook(() => useTenant());

    expect(result.current.tenantDomain).toBeNull();
  });

  it('exposes raw claims', () => {
    const claims = {
      tid: 'resource-tenant-id',
      iss: 'https://login.microsoftonline.com/resource-tenant-id/v2.0',
      preferred_username: 'user@contoso.com',
      roles: ['Admin'],
    };
    mockUseMsalAuth.mockReturnValue({
      account: makeAccount({ idTokenClaims: claims }),
      isAuthenticated: true,
    } as any);

    const { result } = renderHook(() => useTenant());

    expect(result.current.claims).toEqual(claims);
  });
});
