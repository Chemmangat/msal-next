import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('../../hooks/useMsalAuth', () => ({
  useMsalAuth: vi.fn(),
}));

vi.mock('@azure/msal-react', () => ({
  useMsal: vi.fn(),
}));

import { useTokenRefresh } from '../../hooks/useTokenRefresh';
import { useMsalAuth } from '../../hooks/useMsalAuth';
import { useMsal } from '@azure/msal-react';

// instance.acquireTokenSilent returns a full AuthenticationResult-like object
const mockInstanceAcquireTokenSilent = vi.fn();
const mockInstance = {
  acquireTokenSilent: mockInstanceAcquireTokenSilent,
};

describe('useTokenRefresh', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Return a realistic response with expiresOn so real-expiry logic is exercised
    const expiresOn = new Date(Date.now() + 3600 * 1000);
    mockInstanceAcquireTokenSilent.mockResolvedValue({
      accessToken: 'token',
      expiresOn,
    });

    vi.mocked(useMsalAuth).mockReturnValue({
      isAuthenticated: true,
      account: { homeAccountId: 'home-id', username: 'user@example.com' },
    } as any);

    vi.mocked(useMsal).mockReturnValue({
      instance: mockInstance,
    } as any);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls instance.acquireTokenSilent on mount when enabled', async () => {
    renderHook(() => useTokenRefresh({ enabled: true }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });
    expect(mockInstanceAcquireTokenSilent).toHaveBeenCalled();
  });

  it('does not call acquireTokenSilent when disabled', async () => {
    renderHook(() => useTokenRefresh({ enabled: false }));
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(mockInstanceAcquireTokenSilent).not.toHaveBeenCalled();
  });

  it('manual refresh calls instance.acquireTokenSilent', async () => {
    const { result } = renderHook(() => useTokenRefresh());
    await act(async () => {
      await result.current.refresh();
    });
    expect(mockInstanceAcquireTokenSilent).toHaveBeenCalled();
  });

  it('calls onRefresh callback with real expiresIn after successful refresh', async () => {
    const onRefresh = vi.fn();
    const { result } = renderHook(() => useTokenRefresh({ onRefresh }));
    await act(async () => {
      await result.current.refresh();
    });
    expect(onRefresh).toHaveBeenCalled();
    // expiresIn should be close to 3600 (within a few seconds of test execution time)
    const [expiresIn] = onRefresh.mock.calls[0];
    expect(expiresIn).toBeGreaterThan(3590);
    expect(expiresIn).toBeLessThanOrEqual(3600);
  });

  it('falls back to 3600 when expiresOn is null', async () => {
    mockInstanceAcquireTokenSilent.mockResolvedValueOnce({
      accessToken: 'token',
      expiresOn: null,
    });
    const onRefresh = vi.fn();
    const { result } = renderHook(() => useTokenRefresh({ onRefresh }));
    await act(async () => {
      await result.current.refresh();
    });
    expect(onRefresh).toHaveBeenCalledWith(3600);
  });

  it('calls onError callback on refresh failure', async () => {
    mockInstanceAcquireTokenSilent.mockRejectedValueOnce(new Error('Token error'));
    const onError = vi.fn();
    const { result } = renderHook(() => useTokenRefresh({ onError }));
    await act(async () => {
      await result.current.refresh();
    });
    expect(onError).toHaveBeenCalled();
  });

  it('does not refresh when not authenticated', async () => {
    vi.mocked(useMsalAuth).mockReturnValueOnce({
      isAuthenticated: false,
      account: null,
    } as any);
    const { result } = renderHook(() => useTokenRefresh());
    await act(async () => {
      await result.current.refresh();
    });
    expect(mockInstanceAcquireTokenSilent).not.toHaveBeenCalled();
  });
});
