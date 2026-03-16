import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('../../hooks/useUserProfile', () => ({
  useUserProfile: vi.fn(),
}));

import { UserAvatar } from '../../components/UserAvatar';
import { useUserProfile } from '../../hooks/useUserProfile';

describe('UserAvatar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUserProfile).mockReturnValue({
      profile: {
        displayName: 'Test User',
        givenName: 'Test',
        surname: 'User',
        photo: null,
      } as any,
      loading: false,
      error: null,
      refetch: vi.fn(),
      clearCache: vi.fn(),
    });
  });

  it('renders initials when no photo', () => {
    render(<UserAvatar />);
    expect(screen.getByText('TU')).toBeTruthy();
  });

  it('shows loading state', () => {
    vi.mocked(useUserProfile).mockReturnValueOnce({
      profile: null,
      loading: true,
      error: null,
      refetch: vi.fn(),
      clearCache: vi.fn(),
    });
    render(<UserAvatar />);
    expect(screen.getByLabelText('Loading user avatar')).toBeTruthy();
  });

  it('renders with custom size', () => {
    render(<UserAvatar size={64} />);
    const el = screen.getByLabelText('Test User avatar');
    expect(el.style.width).toBe('64px');
    expect(el.style.height).toBe('64px');
  });

  it('shows tooltip by default', () => {
    render(<UserAvatar showTooltip />);
    const el = screen.getByLabelText('Test User avatar');
    expect(el.title).toBe('Test User');
  });

  it('hides tooltip when showTooltip is false', () => {
    render(<UserAvatar showTooltip={false} />);
    const el = screen.getByLabelText('Test User avatar');
    expect(el.title).toBe('');
  });

  it('renders photo when available', async () => {
    vi.mocked(useUserProfile).mockReturnValueOnce({
      profile: { displayName: 'Test User', givenName: 'Test', surname: 'User', photo: 'blob:photo' } as any,
      loading: false,
      error: null,
      refetch: vi.fn(),
      clearCache: vi.fn(),
    });
    render(<UserAvatar />);
    await waitFor(() => {
      const img = screen.queryByRole('img');
      expect(img).toBeTruthy();
    });
  });

  it('applies custom className', () => {
    render(<UserAvatar className="my-avatar" />);
    const el = screen.getByLabelText('Test User avatar');
    expect(el.className).toContain('my-avatar');
  });
});
