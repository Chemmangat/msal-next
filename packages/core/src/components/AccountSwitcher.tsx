'use client';

import { useMultiAccount } from '../hooks/useMultiAccount';
import { AccountInfo } from '@azure/msal-browser';
import { CSSProperties, useState } from 'react';

export interface AccountSwitcherProps {
  /**
   * Show user avatars (requires Microsoft Graph API access)
   * @defaultValue true
   */
  showAvatars?: boolean;

  /**
   * Maximum number of accounts to allow
   * @defaultValue 5
   */
  maxAccounts?: number;

  /**
   * Callback when account is switched
   */
  onSwitch?: (account: AccountInfo) => void;

  /**
   * Callback when account is added
   */
  onAdd?: () => void;

  /**
   * Callback when account is removed
   */
  onRemove?: (account: AccountInfo) => void;

  /**
   * Custom CSS class name
   */
  className?: string;

  /**
   * Custom inline styles
   */
  style?: CSSProperties;

  /**
   * Variant style
   * @defaultValue 'default'
   */
  variant?: 'default' | 'compact' | 'minimal';

  /**
   * Show "Add Account" button
   * @defaultValue true
   */
  showAddButton?: boolean;

  /**
   * Show "Remove Account" button for each account
   * @defaultValue true
   */
  showRemoveButton?: boolean;
}

/**
 * Account Switcher Component
 * 
 * @remarks
 * Pre-built UI component for switching between multiple Microsoft accounts.
 * Displays all signed-in accounts with avatars and allows users to switch or add accounts.
 * 
 * @example
 * ```tsx
 * 'use client';
 * 
 * import { AccountSwitcher } from '@chemmangat/msal-next';
 * 
 * export default function Header() {
 *   return (
 *     <div>
 *       <h1>My App</h1>
 *       <AccountSwitcher
 *         showAvatars={true}
 *         maxAccounts={5}
 *         onSwitch={(account) => console.log('Switched to', account.name)}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function AccountSwitcher({
  showAvatars = true,
  maxAccounts = 5,
  onSwitch,
  onAdd,
  onRemove,
  className = '',
  style,
  variant = 'default',
  showAddButton = true,
  showRemoveButton = true,
}: AccountSwitcherProps) {
  const {
    accounts,
    activeAccount,
    switchAccount,
    addAccount,
    removeAccount,
    isActiveAccount,
    accountCount,
  } = useMultiAccount();

  const [isOpen, setIsOpen] = useState(false);
  const [removingAccount, setRemovingAccount] = useState<string | null>(null);

  const handleSwitch = (account: AccountInfo) => {
    switchAccount(account);
    setIsOpen(false);
    onSwitch?.(account);
  };

  const handleAdd = async () => {
    if (accountCount >= maxAccounts) {
      alert(`Maximum ${maxAccounts} accounts allowed`);
      return;
    }

    await addAccount();
    onAdd?.();
  };

  const handleRemove = async (account: AccountInfo, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm(`Remove account ${account.username}?`)) {
      return;
    }

    setRemovingAccount(account.homeAccountId);
    try {
      await removeAccount(account);
      onRemove?.(account);
    } finally {
      setRemovingAccount(null);
    }
  };

  // Base styles
  const containerStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    ...style,
  };

  const buttonStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: variant === 'compact' ? '6px 12px' : '8px 16px',
    backgroundColor: '#fff',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: variant === 'compact' ? '13px' : '14px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const dropdownStyle: CSSProperties = {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '4px',
    backgroundColor: '#fff',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    minWidth: variant === 'minimal' ? '200px' : '280px',
    maxWidth: '320px',
    zIndex: 1000,
    overflow: 'hidden',
  };

  const accountItemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    cursor: 'pointer',
    borderBottom: '1px solid #f3f4f6',
    transition: 'background-color 0.15s',
  };

  const avatarStyle: CSSProperties = {
    width: variant === 'compact' ? '28px' : '32px',
    height: variant === 'compact' ? '28px' : '32px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: variant === 'compact' ? '12px' : '14px',
    fontWeight: '600',
    flexShrink: 0,
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (!activeAccount) {
    return null;
  }

  return (
    <div className={className} style={containerStyle}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f9fafb';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#fff';
        }}
      >
        {showAvatars && (
          <div style={avatarStyle}>
            {getInitials(activeAccount.name)}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ fontWeight: '500' }}>
            {activeAccount.name || activeAccount.username}
          </div>
          {variant !== 'minimal' && (
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {activeAccount.username}
            </div>
          )}
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            marginLeft: 'auto',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
            }}
            onClick={() => setIsOpen(false)}
          />
          <div style={dropdownStyle}>
            {accounts.map((account) => (
              <div
                key={account.homeAccountId}
                onClick={() => handleSwitch(account)}
                style={{
                  ...accountItemStyle,
                  backgroundColor: isActiveAccount(account) ? '#eff6ff' : '#fff',
                }}
                onMouseEnter={(e) => {
                  if (!isActiveAccount(account)) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActiveAccount(account)) {
                    e.currentTarget.style.backgroundColor = '#fff';
                  }
                }}
              >
                {showAvatars && (
                  <div style={avatarStyle}>
                    {getInitials(account.name)}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>
                    {account.name || account.username}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {account.username}
                  </div>
                </div>
                {isActiveAccount(account) && (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    style={{ flexShrink: 0 }}
                  >
                    <path
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      fill="#3b82f6"
                    />
                  </svg>
                )}
                {showRemoveButton && accounts.length > 1 && (
                  <button
                    onClick={(e) => handleRemove(account, e)}
                    disabled={removingAccount === account.homeAccountId}
                    style={{
                      padding: '4px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: removingAccount === account.homeAccountId ? 0.5 : 1,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fee2e2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 4L12 12M12 4L4 12"
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}

            {showAddButton && accountCount < maxAccounts && (
              <button
                onClick={handleAdd}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#fff',
                  border: 'none',
                  borderTop: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 3V13M3 8H13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Add Another Account
              </button>
            )}

            {accountCount >= maxAccounts && (
              <div
                style={{
                  padding: '8px 16px',
                  fontSize: '12px',
                  color: '#6b7280',
                  textAlign: 'center',
                  borderTop: '1px solid #e5e7eb',
                }}
              >
                Maximum {maxAccounts} accounts reached
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
