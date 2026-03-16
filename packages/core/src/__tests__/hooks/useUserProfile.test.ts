import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

vi.mock('../../hooks/useMsalAuth', () => ({
  useMsalAuth: vi.fn(),
}));

vi.mock('../../hooks/useGraphApi', () => ({
  useGraphApi: vi.fn(),
}));

import { useUserProfile } from '../../hooks/useUserProfile';
import { useMsalAuth } from '../../hooks/useMsalAuth';
import { useGraphApi } from '../../hooks/useGraphApi';

const mockGet = vi.fn();

const mockProfile = {
  id: 'user-id',
  displayName: 'Test User',
  givenName: 'Test',
  surname: 'User',
  userPrincipalName: 'user@example.com',
  mail: 'user@example.com',
  department: 'Engineering',
};

const defaultAccount = {
  homeAccountId: 'home-id-unique-' + Math.random(), // unique to avoid cache hits
  username: 'user@example.com',
  name: 'Test User',
};

describe('useUserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMsalAuth).mockReturnValue({
      isAuthenticated: true,
      account: { ...defaultAccount, homeAccountId: 'home-id-' + Math.random() },
    } as any);
    vi.mocked(useGraphApi).mockReturnValue({ get: mockGet } as any);
    mockGet.mockResolvedValue(mockProfile);
  });

  it('fetches and returns user profile', async () => {
    const { result } = renderHook(() => useUserProfile());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.profile?.displayName).toBe('Test User');
    expect(result.current.profile?.department).toBe('Engineering');
  });

  it('starts in loading state', () => {
    mockGet.mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useUserProfile());
    expect(result.current.loading).toBe(true);
  });

  it('sets error on fetch failure', async () => {
    mockGet.mockRejectedValueOnce(new Error('Graph error'));
    const { result } = renderHook(() => useUserProfile());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).not.toBeNull();
  });

  it('returns null profile when not authenticated', async () => {
    vi.mocked(useMsalAuth).mockReturnValueOnce({
      isAuthenticated: false,
      account: null,
    } as any);
    const { result } = renderHook(() => useUserProfile());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.profile).toBeNull();
  });

  it('refetch re-fetches profile', async () => {
    const { result } = renderHook(() => useUserProfile());
    await waitFor(() => expect(result.current.loading).toBe(false));
    mockGet.mockResolvedValueOnce({ ...mockProfile, displayName: 'Updated User' });
    await act(async () => {
      await result.current.refetch();
    });
    expect(mockGet).toHaveBeenCalled();
  });

  it('clearCache sets profile to null', async () => {
    const { result } = renderHook(() => useUserProfile());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => {
      result.current.clearCache();
    });
    expect(result.current.profile).toBeNull();
  });
});
