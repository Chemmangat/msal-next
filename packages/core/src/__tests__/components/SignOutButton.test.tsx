import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('../../hooks/useMsalAuth', () => ({
  useMsalAuth: vi.fn(),
}));

import { SignOutButton } from '../../components/SignOutButton';
import { useMsalAuth } from '../../hooks/useMsalAuth';

const mockLogoutRedirect = vi.fn();

describe('SignOutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMsalAuth).mockReturnValue({
      logoutRedirect: mockLogoutRedirect,
      inProgress: false,
    } as any);
  });

  it('renders with default text', () => {
    render(<SignOutButton />);
    expect(screen.getByText('Sign out')).toBeTruthy();
  });

  it('renders with custom text', () => {
    render(<SignOutButton text="Logout" />);
    expect(screen.getByText('Logout')).toBeTruthy();
  });

  it('calls logoutRedirect on click', async () => {
    mockLogoutRedirect.mockResolvedValueOnce(undefined);
    render(<SignOutButton />);
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(mockLogoutRedirect).toHaveBeenCalled());
  });

  it('is disabled when inProgress is true', () => {
    vi.mocked(useMsalAuth).mockReturnValueOnce({
      logoutRedirect: mockLogoutRedirect,
      inProgress: true,
    } as any);
    render(<SignOutButton />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onSuccess after logout', async () => {
    mockLogoutRedirect.mockResolvedValueOnce(undefined);
    const onSuccess = vi.fn();
    render(<SignOutButton onSuccess={onSuccess} />);
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  it('calls onError when logout throws', async () => {
    mockLogoutRedirect.mockRejectedValueOnce(new Error('Logout failed'));
    const onError = vi.fn();
    render(<SignOutButton onError={onError} />);
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(onError).toHaveBeenCalled());
  });
});
