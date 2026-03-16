import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

vi.mock('../../hooks/useMsalAuth', () => ({
  useMsalAuth: vi.fn(),
}));

import { useGraphApi } from '../../hooks/useGraphApi';
import { useMsalAuth } from '../../hooks/useMsalAuth';

const mockAcquireToken = vi.fn();
const mockFetch = vi.fn();
global.fetch = mockFetch;

function makeResponse(data: any, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => null },
    json: vi.fn().mockResolvedValue(data),
    text: vi.fn().mockResolvedValue(JSON.stringify(data)),
  };
}

describe('useGraphApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAcquireToken.mockResolvedValue('access-token');
    vi.mocked(useMsalAuth).mockReturnValue({
      acquireToken: mockAcquireToken,
    } as any);
  });

  it('get sends GET request with Authorization header', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ id: 'user-id' }));
    const { result } = renderHook(() => useGraphApi());
    const data = await result.current.get('/me');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://graph.microsoft.com/v1.0/me',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer access-token' }),
      })
    );
    expect(data).toEqual({ id: 'user-id' });
  });

  it('post sends POST request with body', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ id: 'msg-id' }));
    const { result } = renderHook(() => useGraphApi());
    await result.current.post('/me/messages', { subject: 'Hello' });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ subject: 'Hello' }),
      })
    );
  });

  it('patch sends PATCH request', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ updated: true }));
    const { result } = renderHook(() => useGraphApi());
    await result.current.patch('/me', { displayName: 'New Name' });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'PATCH' })
    );
  });

  it('delete sends DELETE request', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 204, headers: { get: () => '0' }, json: vi.fn(), text: vi.fn() });
    const { result } = renderHook(() => useGraphApi());
    await result.current.delete('/me/messages/msg-id');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ error: 'Forbidden' }, 403));
    const { result } = renderHook(() => useGraphApi());
    await expect(result.current.get('/me')).rejects.toThrow();
  });

  it('uses beta version when specified', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({}));
    const { result } = renderHook(() => useGraphApi());
    await result.current.get('/me', { version: 'beta' });
    expect(mockFetch).toHaveBeenCalledWith(
      'https://graph.microsoft.com/beta/me',
      expect.any(Object)
    );
  });

  it('handles absolute URLs', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({}));
    const { result } = renderHook(() => useGraphApi());
    await result.current.get('https://graph.microsoft.com/v1.0/me');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://graph.microsoft.com/v1.0/me',
      expect.any(Object)
    );
  });
});
