import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../../hooks/useMultiAccount', () => ({
  useMultiAccount: vi.fn(),
}));

import { AccountList } from '../../components/AccountList';
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

describe('AccountList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMultiAccount).mockReturnValue({
      accounts: [mockAccount1, mockAccount2] as any,
      switchAccount: mockSwitchAccount,
      isActiveAccount: (acc: any) => acc.homeAccountId === 'account-1',
    } as any);
  });

  it('renders all accounts', () => {
    render(<AccountList />);
    expect(screen.getByText('User One')).toBeTruthy();
    expect(screen.getByText('User Two')).toBeTruthy();
  });

  it('shows "No accounts signed in" when empty', () => {
    vi.mocked(useMultiAccount).mockReturnValueOnce({
      accounts: [] as any,
      switchAccount: mockSwitchAccount,
      isActiveAccount: () => false,
    } as any);
    render(<AccountList />);
    expect(screen.getByText('No accounts signed in')).toBeTruthy();
  });

  it('calls switchAccount when clickToSwitch is true', () => {
    render(<AccountList clickToSwitch />);
    const rows = screen.getAllByText('User Two');
    fireEvent.click(rows[0].closest('div')!);
    expect(mockSwitchAccount).toHaveBeenCalledWith(mockAccount2);
  });

  it('does not call switchAccount for active account', () => {
    render(<AccountList clickToSwitch />);
    const rows = screen.getAllByText('User One');
    fireEvent.click(rows[0].closest('div')!);
    expect(mockSwitchAccount).not.toHaveBeenCalled();
  });

  it('calls onAccountClick callback', () => {
    const onAccountClick = vi.fn();
    render(<AccountList onAccountClick={onAccountClick} />);
    const rows = screen.getAllByText('User Two');
    fireEvent.click(rows[0].closest('div')!);
    expect(onAccountClick).toHaveBeenCalledWith(mockAccount2);
  });

  it('shows active indicator for active account', () => {
    render(<AccountList showActiveIndicator />);
    expect(screen.getByText('Active')).toBeTruthy();
  });

  it('renders custom account via renderAccount prop', () => {
    render(
      <AccountList
        renderAccount={(account, isActive) => (
          <span data-testid="custom-item">
            {account.name} {isActive ? '[active]' : '[inactive]'}
          </span>
        )}
      />
    );
    const items = screen.getAllByTestId('custom-item');
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain('[active]');
    expect(items[1].textContent).toContain('[inactive]');
  });

  it('shows email details when showDetails is true', () => {
    render(<AccountList showDetails />);
    expect(screen.getByText('user1@example.com')).toBeTruthy();
  });
});
