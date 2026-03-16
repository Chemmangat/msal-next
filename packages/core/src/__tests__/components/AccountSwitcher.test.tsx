import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../../hooks/useMultiAccount', () => ({
  useMultiAccount: vi.fn(),
}));

import { AccountSwitcher } from '../../components/AccountSwitcher';
import { useMultiAccount } from '../../hooks/useMultiAccount';

const mockAccount1 = {
  homeAccountId: 'account-1',
  username: 'user1@example.com',
  name: 'User One',
  tenantId: 'tenant-1',
};

const mockAccount2 = {
  homeAccountId: 'account-2',
  username: 'user2@example.com',
  name: 'User Two',
  tenantId: 'tenant-2',
};

const mockSwitchAccount = vi.fn();
const mockAddAccount = vi.fn();
const mockRemoveAccount = vi.fn();

describe('AccountSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMultiAccount).mockReturnValue({
      accounts: [mockAccount1, mockAccount2] as any,
      activeAccount: mockAccount1 as any,
      switchAccount: mockSwitchAccount,
      addAccount: mockAddAccount,
      removeAccount: mockRemoveAccount,
      isActiveAccount: (acc: any) => acc.homeAccountId === 'account-1',
      accountCount: 2,
    } as any);
  });

  it('renders active account name', () => {
    render(<AccountSwitcher />);
    expect(screen.getByText('User One')).toBeTruthy();
  });

  it('opens dropdown on button click', () => {
    render(<AccountSwitcher />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('User Two')).toBeTruthy();
  });

  it('calls switchAccount when another account is clicked', () => {
    render(<AccountSwitcher />);
    fireEvent.click(screen.getByRole('button'));
    const items = screen.getAllByText('User Two');
    fireEvent.click(items[0]);
    expect(mockSwitchAccount).toHaveBeenCalledWith(mockAccount2);
  });

  it('calls onSwitch callback', () => {
    const onSwitch = vi.fn();
    render(<AccountSwitcher onSwitch={onSwitch} />);
    fireEvent.click(screen.getByRole('button'));
    const items = screen.getAllByText('User Two');
    fireEvent.click(items[0]);
    expect(onSwitch).toHaveBeenCalledWith(mockAccount2);
  });

  it('renders custom account via renderAccount prop', () => {
    render(
      <AccountSwitcher
        renderAccount={(account, isActive) => (
          <span data-testid="custom-row">
            {account.username} {isActive ? '(active)' : ''}
          </span>
        )}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    const rows = screen.getAllByTestId('custom-row');
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].textContent).toContain('user1@example.com');
    expect(rows[0].textContent).toContain('(active)');
  });

  it('returns null when no active account', () => {
    vi.mocked(useMultiAccount).mockReturnValueOnce({
      accounts: [] as any,
      activeAccount: null,
      switchAccount: mockSwitchAccount,
      addAccount: mockAddAccount,
      removeAccount: mockRemoveAccount,
      isActiveAccount: () => false,
      accountCount: 0,
    } as any);
    const { container } = render(<AccountSwitcher />);
    expect(container.firstChild).toBeNull();
  });
});
