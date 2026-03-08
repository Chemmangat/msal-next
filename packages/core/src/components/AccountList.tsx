'use client';

import { useMultiAccount } from '../hooks/useMultiAccount';
import { AccountInfo } from '@azure/msal-browser';
import { CSSProperties } from 'react';

export interface AccountListProps {
  /**
   * Show user avatars
   * @defaultValue true
   */
  showAvatars?: boolean;

  /**
   * Show account details (email, tenant)
   * @defaultValue true
   */
  showDetails?: boolean;

  /**
   * Show active account indicator
   * @defaultValue true
   */
  showActiveIndicator?: boolean;

  /**
   * Allow clicking to switch accounts
   * @defaultValue true
   */
  clickToSwitch?: boolean;

  /**
   * Callback when account is clicked
   */
  onAccountClick?: (account: AccountInfo) => void;

  /**
   * Custom CSS class name
   */
  className?: string;

  /**
   * Custom inline styles
   */
  style?: CSSProperties;

  /**
   * Layout orientation
   * @defaultValue 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';
}

/**
 * Account List Component
 * 
 * @remarks
 * Display all signed-in Microsoft accounts in a list format.
 * Useful for account management pages or settings screens.
 * 
 * @example
 * ```tsx
 * 'use client';
 * 
 * import { AccountList } from '@chemmangat/msal-next';
 * 
 * export default function AccountsPage() {
 *   return (
 *     <div>
 *       <h1>Your Accounts</h1>
 *       <AccountList
 *         showAvatars={true}
 *         showDetails={true}
 *         clickToSwitch={true}
 *         onAccountClick={(account) => console.log('Clicked', account.name)}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function AccountList({
  showAvatars = true,
  showDetails = true,
  showActiveIndicator = true,
  clickToSwitch = true,
  onAccountClick,
  className = '',
  style,
  orientation = 'vertical',
}: AccountListProps) {
  const { accounts, switchAccount, isActiveAccount } = useMultiAccount();

  const handleAccountClick = (account: AccountInfo) => {
    if (clickToSwitch && !isActiveAccount(account)) {
      switchAccount(account);
    }
    onAccountClick?.(account);
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    gap: orientation === 'vertical' ? '12px' : '16px',
    ...style,
  };

  const accountItemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: clickToSwitch ? 'pointer' : 'default',
    transition: 'all 0.15s',
    position: 'relative',
  };

  const avatarStyle: CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '600',
    flexShrink: 0,
  };

  if (accounts.length === 0) {
    return (
      <div
        className={className}
        style={{
          padding: '24px',
          textAlign: 'center',
          color: '#6b7280',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          ...style,
        }}
      >
        No accounts signed in
      </div>
    );
  }

  return (
    <div className={className} style={containerStyle}>
      {accounts.map((account) => {
        const isActive = isActiveAccount(account);

        return (
          <div
            key={account.homeAccountId}
            onClick={() => handleAccountClick(account)}
            style={{
              ...accountItemStyle,
              borderColor: isActive ? '#3b82f6' : '#e5e7eb',
              backgroundColor: isActive ? '#eff6ff' : '#fff',
              boxShadow: isActive
                ? '0 0 0 3px rgba(59, 130, 246, 0.1)'
                : 'none',
            }}
            onMouseEnter={(e) => {
              if (clickToSwitch && !isActive) {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#d1d5db';
              }
            }}
            onMouseLeave={(e) => {
              if (clickToSwitch && !isActive) {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }
            }}
          >
            {showAvatars && (
              <div style={avatarStyle}>{getInitials(account.name)}</div>
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: showDetails ? '4px' : 0,
                }}
              >
                {account.name || account.username}
              </div>

              {showDetails && (
                <>
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {account.username}
                  </div>

                  {account.tenantId && (
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#9ca3af',
                        marginTop: '2px',
                      }}
                    >
                      Tenant: {account.tenantId.substring(0, 8)}...
                    </div>
                  )}
                </>
              )}
            </div>

            {showActiveIndicator && isActive && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  backgroundColor: '#3b82f6',
                  color: '#fff',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  flexShrink: 0,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M10 3L4.5 8.5L2 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Active
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
