import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../../hooks/useMsalAuth', () => ({
  useMsalAuth: vi.fn(),
}));

import { AuthStatus } from '../../components/AuthStatus';
import { useMsalAuth } from '../../hooks/useMsalAuth';

describe('AuthStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMsalAuth).mockReturnValue({
      isAuthenticated: false,
      inProgress: false,
      account: null,
    } as any);
  });

  it('shows "Not authenticated" when not logged in', () => {
    render(<AuthStatus />);
    expect(screen.getByText('Not authenticated')).toBeTruthy();
  });

  it('shows "Authenticated" when logged in', () => {
    vi.mocked(useMsalAuth).mockReturnValueOnce({
      isAuthenticated: true,
      inProgress: false,
      account: { username: 'user@example.com', name: 'Test User' },
    } as any);
    render(<AuthStatus />);
    expect(screen.getByText('Authenticated')).toBeTruthy();
  });

  it('shows username when showDetails is true', () => {
    vi.mocked(useMsalAuth).mockReturnValueOnce({
      isAuthenticated: true,
      inProgress: false,
      account: { username: 'user@example.com', name: 'Test User' },
    } as any);
    render(<AuthStatus showDetails />);
    expect(screen.getByText(/user@example\.com/)).toBeTruthy();
  });

  it('shows loading state when inProgress', () => {
    vi.mocked(useMsalAuth).mockReturnValueOnce({
      isAuthenticated: false,
      inProgress: true,
      account: null,
    } as any);
    render(<AuthStatus />);
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('uses renderLoading when provided', () => {
    vi.mocked(useMsalAuth).mockReturnValueOnce({
      isAuthenticated: false,
      inProgress: true,
      account: null,
    } as any);
    render(<AuthStatus renderLoading={() => <span>Custom loading</span>} />);
    expect(screen.getByText('Custom loading')).toBeTruthy();
  });

  it('uses renderAuthenticated when provided', () => {
    vi.mocked(useMsalAuth).mockReturnValueOnce({
      isAuthenticated: true,
      inProgress: false,
      account: { username: 'user@example.com' },
    } as any);
    render(<AuthStatus renderAuthenticated={(u) => <span>Hello {u}</span>} />);
    expect(screen.getByText('Hello user@example.com')).toBeTruthy();
  });

  it('uses renderUnauthenticated when provided', () => {
    render(<AuthStatus renderUnauthenticated={() => <span>Please sign in</span>} />);
    expect(screen.getByText('Please sign in')).toBeTruthy();
  });

  it('has role="status" for accessibility', () => {
    render(<AuthStatus />);
    expect(screen.getByRole('status')).toBeTruthy();
  });
});
