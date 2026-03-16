import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('../../hooks/useMsalAuth', () => ({
  useMsalAuth: vi.fn(),
}));

import { AuthGuard } from '../../components/AuthGuard';
import { useMsalAuth } from '../../hooks/useMsalAuth';

const mockLoginRedirect = vi.fn();

describe('AuthGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMsalAuth).mockReturnValue({
      isAuthenticated: true,
      inProgress: false,
      loginRedirect: mockLoginRedirect,
    } as any);
  });

  it('renders children when authenticated', () => {
    render(
      <AuthGuard>
        <div>Protected content</div>
      </AuthGuard>
    );
    expect(screen.getByText('Protected content')).toBeTruthy();
  });

  it('shows fallback when not authenticated', () => {
    vi.mocked(useMsalAuth).mockReturnValueOnce({
      isAuthenticated: false,
      inProgress: false,
      loginRedirect: mockLoginRedirect,
    } as any);
    render(
      <AuthGuard fallbackComponent={<div>Please wait...</div>}>
        <div>Protected</div>
      </AuthGuard>
    );
    expect(screen.getByText('Please wait...')).toBeTruthy();
  });

  it('shows default fallback text when not authenticated', () => {
    vi.mocked(useMsalAuth).mockReturnValueOnce({
      isAuthenticated: false,
      inProgress: false,
      loginRedirect: mockLoginRedirect,
    } as any);
    render(
      <AuthGuard>
        <div>Protected</div>
      </AuthGuard>
    );
    expect(screen.getByText('Redirecting to login...')).toBeTruthy();
  });

  it('shows loading component when inProgress', () => {
    vi.mocked(useMsalAuth).mockReturnValueOnce({
      isAuthenticated: false,
      inProgress: true,
      loginRedirect: mockLoginRedirect,
    } as any);
    render(
      <AuthGuard loadingComponent={<div>Loading auth...</div>}>
        <div>Protected</div>
      </AuthGuard>
    );
    expect(screen.getByText('Loading auth...')).toBeTruthy();
  });

  it('calls loginRedirect when not authenticated', async () => {
    mockLoginRedirect.mockResolvedValueOnce(undefined);
    vi.mocked(useMsalAuth).mockReturnValueOnce({
      isAuthenticated: false,
      inProgress: false,
      loginRedirect: mockLoginRedirect,
    } as any);
    render(
      <AuthGuard>
        <div>Protected</div>
      </AuthGuard>
    );
    await waitFor(() => expect(mockLoginRedirect).toHaveBeenCalled());
  });

  it('calls onAuthRequired callback', async () => {
    const onAuthRequired = vi.fn();
    vi.mocked(useMsalAuth).mockReturnValueOnce({
      isAuthenticated: false,
      inProgress: false,
      loginRedirect: mockLoginRedirect,
    } as any);
    render(
      <AuthGuard onAuthRequired={onAuthRequired}>
        <div>Protected</div>
      </AuthGuard>
    );
    await waitFor(() => expect(onAuthRequired).toHaveBeenCalled());
  });
});
