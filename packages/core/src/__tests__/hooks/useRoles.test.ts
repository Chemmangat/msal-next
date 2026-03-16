import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

// Mock dependencies BEFORE importing the hook
vi.mock('../../hooks/useMsalAuth', () => ({
  useMsalAuth: vi.fn(),
}));

vi.mock('../../hooks/useGraphApi', () => ({
  useGraphApi: vi.fn(),
}));

import { useRoles } from '../../hooks/useRoles';
import { useMsalAuth } from '../../hooks/useMsalAuth';
import { useGraphApi } from '../../hooks/useGraphApi';

const mockGet = vi.fn();

describe('useRoles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMsalAuth).mockReturnValue({
      isAuthenticated: true,
      account: {
        homeAccountId: `home-id-${Math.random()}`,
        username: 'user@example.com',
        idTokenClaims: { roles: ['Admin', 'Editor'] },
      },
    } as any);
    vi.mocked(useGraphApi).mockReturnValue({ get: mockGet } as any);
    mockGet.mockResolvedValue({ value: [{ id: 'group-1' }, { id: 'group-2' }] });
  });

  it('returns roles from token claims', async () => {
    const { result } = renderHook(() => useRoles());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.roles).toContain('Admin');
    expect(result.current.roles).toContain('Editor');
  });

  it('returns groups from Graph API', async () => {
    const { result } = renderHook(() => useRoles());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.groups).toContain('group-1');
    expect(result.current.groups).toContain('group-2');
  });

  it('hasRole returns true for existing role', async () => {
    const { result } = renderHook(() => useRoles());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasRole('Admin')).toBe(true);
  });

  it('hasRole returns false for missing role', async () => {
    const { result } = renderHook(() => useRoles());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasRole('SuperAdmin')).toBe(false);
  });

  it('hasGroup returns true for existing group', async () => {
    const { result } = renderHook(() => useRoles());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasGroup('group-1')).toBe(true);
  });

  it('hasAnyRole returns true when at least one role matches', async () => {
    const { result } = renderHook(() => useRoles());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasAnyRole(['Admin', 'Unknown'])).toBe(true);
  });

  it('hasAllRoles returns false when not all roles match', async () => {
    const { result } = renderHook(() => useRoles());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasAllRoles(['Admin', 'Missing'])).toBe(false);
  });

  it('hasAllRoles returns true when all roles match', async () => {
    const { result } = renderHook(() => useRoles());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasAllRoles(['Admin', 'Editor'])).toBe(true);
  });

  it('falls back to token roles on Graph API error', async () => {
    mockGet.mockRejectedValueOnce(new Error('Graph error'));
    const { result } = renderHook(() => useRoles());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.roles).toContain('Admin');
  });

  it('returns empty arrays when not authenticated', async () => {
    vi.mocked(useMsalAuth).mockReturnValue({
      isAuthenticated: false,
      account: null,
    } as any);
    const { result } = renderHook(() => useRoles());
    await waitFor(() => {
      expect(result.current.roles).toHaveLength(0);
      expect(result.current.groups).toHaveLength(0);
    });
  });
});
