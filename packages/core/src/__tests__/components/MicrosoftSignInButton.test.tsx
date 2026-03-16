import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('../../hooks/useMsalAuth', () => ({
  useMsalAuth: vi.fn(),
}));

import { MicrosoftSignInButton } from '../../components/MicrosoftSignInButton';
import { useMsalAuth } from '../../hooks/useMsalAuth';

const mockLoginRedirect = vi.fn();

describe('MicrosoftSignInButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMsalAuth).mockReturnValue({
      loginRedirect: mockLoginRedirect,
      inProgress: false,
      isAuthenticated: false,
    } as any);
  });

  it('renders with default text', () => {
    render(<MicrosoftSignInButton />);
    expect(screen.getByText('Sign in with Microsoft')).toBeTruthy();
  });

  it('renders with custom text', () => {
    render(<MicrosoftSignInButton text="Login" />);
    expect(screen.getByText('Login')).toBeTruthy();
  });

  it('calls loginRedirect on click', async () => {
    mockLoginRedirect.mockResolvedValueOnce(undefined);
    render(<MicrosoftSignInButton />);
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(mockLoginRedirect).toHaveBeenCalled());
  });

  it('is disabled when inProgress is true', () => {
    vi.mocked(useMsalAuth).mockReturnValueOnce({
      loginRedirect: mockLoginRedirect,
      inProgress: true,
      isAuthenticated: false,
    } as any);
    render(<MicrosoftSignInButton />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onError when loginRedirect throws', async () => {
    mockLoginRedirect.mockRejectedValueOnce(new Error('Login failed'));
    const onError = vi.fn();
    render(<MicrosoftSignInButton onError={onError} />);
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(onError).toHaveBeenCalled());
  });

  it('applies custom className', () => {
    render(<MicrosoftSignInButton className="my-btn" />);
    expect(screen.getByRole('button').className).toContain('my-btn');
  });
});
