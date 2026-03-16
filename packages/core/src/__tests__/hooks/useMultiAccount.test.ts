import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const mockInstance = {
  getActiveAccount: vi.fn(),
  setActiveAccount: vi.fn(),
  loginRedirect: vi.fn(),
  logoutRedirect: vi.fn(),
  clearCache: vi.fn(),
};

vi.mock('@azure/msal-react', () => ({
  useMsal: vi.fn(),
}));

import { useMultiAccount } from '../../hooks/useMultiAccount';
import { useMsal } from '@azure/msal-react';

const mockAccount1 = {
  homeAccountId: 'account-1',
  localAccountId: 'local-1',
  environment: 'login.microsoftonline.com',
  tenantId: 'tenant-1',
  username: 'user1@example.com',
  name: 'User One',
};

const mockAccount2 = {
  homeAccountId: 'account-2',
  localAccountId: 'local-2',
  environment: 'login.microsoftonline.com',
  tenantId: 'tenant-2',
  username: 'user2@example.com',
  name: 'User Two',
};

describe('useMultiAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInstance.getActiveAccount.mockReturnValue(mockAccount1);
    vi.mocked(useMsal).mockReturnValue({
      instance: mockInstance as any,
      accounts: [mockAccount1, mockAccount2] as any,
      inProgress: 'none' as any,
    });
  });

  it('returns all accounts', () => {
    const { result } = renderHook(() => useMultiAccount());
    expect(result.current.accounts).toHaveLength(2);
  });

  it('returns hasMultipleAccounts true when more than one account', () => {
    const { result } = renderHook(() => useMultiAccount());
    expect(result.current.hasMultipleAccounts).toBe(true);
  });

  it('returns accountCount', () => {
    const { result } = renderHook(() => useMultiAccount());
    expect(result.current.accountCount).toBe(2);
  });

  it('switchAccount calls setActiveAccount', () => {
    const { result } = renderHook(() => useMultiAccount());
    act(() => {
      result.current.switchAccount(mockAccount2 as any);
    });
    expect(mockInstance.setActiveAccount).toHaveBeenCalledWith(mockAccount2);
  });

  it('isActiveAccount returns true for active account', () => {
    const { result } = renderHook(() => useMultiAccount());
    expect(result.current.isActiveAccount(mockAccount1 as any)).toBe(true);
  });

  it('isActiveAccount returns false for inactive account', () => {
    const { result } = renderHook(() => useMultiAccount());
    expect(result.current.isActiveAccount(mockAccount2 as any)).toBe(false);
  });

  it('getAccountByUsername finds account', () => {
    const { result } = renderHook(() => useMultiAccount());
    const found = result.current.getAccountByUsername('user2@example.com');
    expect(found?.homeAccountId).toBe('account-2');
  });

  it('getAccountById finds account', () => {
    const { result } = renderHook(() => useMultiAccount());
    const found = result.current.getAccountById('account-1');
    expect(found?.username).toBe('user1@example.com');
  });

  it('addAccount calls loginRedirect', async () => {
    mockInstance.loginRedirect.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useMultiAccount());
    await act(async () => {
      await result.current.addAccount(['User.Read']);
    });
    expect(mockInstance.loginRedirect).toHaveBeenCalledWith(
      expect.objectContaining({ prompt: 'select_account' })
    );
  });

  it('removeAccount clears cache', async () => {
    mockInstance.clearCache.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useMultiAccount());
    await act(async () => {
      await result.current.removeAccount(mockAccount2 as any);
    });
    expect(mockInstance.clearCache).toHaveBeenCalledWith({ account: mockAccount2 });
  });

  it('signOutAccount calls logoutRedirect', async () => {
    mockInstance.logoutRedirect.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useMultiAccount());
    await act(async () => {
      await result.current.signOutAccount(mockAccount1 as any);
    });
    expect(mockInstance.logoutRedirect).toHaveBeenCalledWith({ account: mockAccount1 });
  });
});
