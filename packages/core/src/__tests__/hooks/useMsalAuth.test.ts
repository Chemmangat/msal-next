import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const mockInstance = {
  loginRedirect: vi.fn(),
  logoutRedirect: vi.fn(),
  acquireTokenSilent: vi.fn(),
  acquireTokenRedirect: vi.fn(),
  setActiveAccount: vi.fn(),
  clearCache: vi.fn(),
};

const mockAccount = {
  homeAccountId: 'home-account-id',
  localAccountId: 'local-account-id',
  environment: 'login.microsoftonline.com',
  tenantId: 'tenant-id',
  username: 'user@example.com',
  name: 'Test User',
  idTokenClaims: { roles: ['Admin'] },
};

vi.mock('@azure/msal-react', () => ({
  useMsal: vi.fn(),
  useAccount: vi.fn((account: any) => account),
}));

import { useMsalAuth } from '../../hooks/useMsalAuth';
import { useMsal, useAccount } from '@azure/msal-react';

describe('useMsalAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMsal).mockReturnValue({
      instance: mockInstance as any,
      accounts: [mockAccount] as any,
      inProgress: 'none' as any,
    });
    vi.mocked(useAccount).mockReturnValue(mockAccount as any);
  });

  it('returns isAuthenticated true when accounts exist', () => {
    const { result } = renderHook(() => useMsalAuth());
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('returns the first account', () => {
    const { result } = renderHook(() => useMsalAuth());
    expect(result.current.account?.username).toBe('user@example.com');
  });

  it('returns inProgress false when status is none', () => {
    const { result } = renderHook(() => useMsalAuth());
    expect(result.current.inProgress).toBe(false);
  });

  it('loginRedirect calls instance.loginRedirect', async () => {
    mockInstance.loginRedirect.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useMsalAuth());
    await act(async () => {
      await result.current.loginRedirect(['User.Read']);
    });
    expect(mockInstance.loginRedirect).toHaveBeenCalledWith(
      expect.objectContaining({ scopes: ['User.Read'] })
    );
  });

  it('logoutRedirect calls instance.logoutRedirect', async () => {
    mockInstance.logoutRedirect.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useMsalAuth());
    await act(async () => {
      await result.current.logoutRedirect();
    });
    expect(mockInstance.logoutRedirect).toHaveBeenCalled();
  });

  it('acquireTokenSilent returns access token', async () => {
    mockInstance.acquireTokenSilent.mockResolvedValueOnce({ accessToken: 'test-token' });
    const { result } = renderHook(() => useMsalAuth());
    let token: string = '';
    await act(async () => {
      token = await result.current.acquireTokenSilent(['User.Read']);
    });
    expect(token).toBe('test-token');
  });

  it('acquireTokenSilent throws when no account', async () => {
    vi.mocked(useAccount).mockReturnValueOnce(null);
    const { result } = renderHook(() => useMsalAuth());
    await expect(result.current.acquireTokenSilent(['User.Read'])).rejects.toThrow();
  });

  it('clearSession calls setActiveAccount and clearCache', async () => {
    mockInstance.clearCache.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useMsalAuth());
    await act(async () => {
      await result.current.clearSession();
    });
    expect(mockInstance.setActiveAccount).toHaveBeenCalledWith(null);
    expect(mockInstance.clearCache).toHaveBeenCalled();
  });

  it('isAuthenticated is false when no accounts', () => {
    vi.mocked(useMsal).mockReturnValueOnce({
      instance: mockInstance as any,
      accounts: [] as any,
      inProgress: 'none' as any,
    });
    const { result } = renderHook(() => useMsalAuth());
    expect(result.current.isAuthenticated).toBe(false);
  });
});
