import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('../../hooks/useMsalAuth', () => ({
  useMsalAuth: vi.fn(),
}));

import { useTokenRefresh } from '../../hooks/useTokenRefresh';
import { useMsalAuth } from '../../hooks/useMsalAuth';

const mockAcquireTokenSilent = vi.fn();

describe('useTokenRefresh', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockAcquireTokenSilent.mockResolvedValue('token');
    vi.mocked(useMsalAuth).mockReturnValue({
      isAuthenticated: true,
      account: { homeAccountId: 'home-id', username: 'user@example.com' },
      acquireTokenSilent: mockAcquireTokenSilent,
    } as any);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls acquireTokenSilent on mount when enabled', async () => {
    renderHook(() => useTokenRefresh({ enabled: true }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });
    expect(mockAcquireTokenSilent).toHaveBeenCalled();
  });

  it('does not call acquireTokenSilent when disabled', async () => {
    renderHook(() => useTokenRefresh({ enabled: false }));
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(mockAcquireTokenSilent).not.toHaveBeenCalled();
  });

  it('manual refresh calls acquireTokenSilent', async () => {
    const { result } = renderHook(() => useTokenRefresh());
    await act(async () => {
      await result.current.refresh();
    });
    expect(mockAcquireTokenSilent).toHaveBeenCalled();
  });

  it('calls onRefresh callback after successful refresh', async () => {
    const onRefresh = vi.fn();
    const { result } = renderHook(() => useTokenRefresh({ onRefresh }));
    await act(async () => {
      await result.current.refresh();
    });
    expect(onRefresh).toHaveBeenCalled();
  });

  it('calls onError callback on refresh failure', async () => {
    mockAcquireTokenSilent.mockRejectedValueOnce(new Error('Token error'));
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
      acquireTokenSilent: mockAcquireTokenSilent,
    } as any);
    const { result } = renderHook(() => useTokenRefresh());
    await act(async () => {
      await result.current.refresh();
    });
    expect(mockAcquireTokenSilent).not.toHaveBeenCalled();
  });
});
