# Release Notes - v4.2.0

## 🎉 Multi-Account Management - The Feature Everyone Wanted

Version 4.2.0 introduces **Multi-Account Management**, allowing users to sign in with multiple Microsoft accounts simultaneously and switch between them seamlessly. No more signing out and back in when you need to access different tenants!

---

## 🎯 Problem Solved

**Before v4.2.0:**
- Users had to sign out completely to switch between work and personal accounts
- No way to stay signed into multiple Microsoft accounts
- Switching contexts meant losing your session and re-authenticating
- Poor UX for users managing multiple tenants (IT admins, consultants, contractors)

**After v4.2.0:**
- Sign in with up to 5 Microsoft accounts simultaneously
- Switch between accounts with one click
- Stay authenticated in all accounts
- Perfect for work + personal, or multiple work accounts

---

## ✨ What's New

### 1. useMultiAccount Hook

New hook for programmatic multi-account management:

```tsx
'use client';

import { useMultiAccount } from '@chemmangat/msal-next';

export default function MyComponent() {
  const {
    accounts,              // All signed-in accounts
    activeAccount,         // Current active account
    hasMultipleAccounts,   // Boolean: more than one account
    accountCount,          // Number of accounts
    switchAccount,         // Switch to different account
    addAccount,            // Sign in with another account
    removeAccount,         // Remove account from cache
    signOutAccount,        // Sign out specific account
    signOutAll,            // Sign out all accounts
    getAccountByUsername,  // Find account by email
    getAccountById,        // Find account by ID
    isActiveAccount,       // Check if account is active
  } = useMultiAccount();

  return (
    <div>
      <h2>Active: {activeAccount?.name}</h2>
      <p>Total accounts: {accountCount}</p>
      
      {accounts.map(account => (
        <button
          key={account.homeAccountId}
          onClick={() => switchAccount(account)}
        >
          {account.name}
        </button>
      ))}
      
      <button onClick={() => addAccount()}>
        Add Another Account
      </button>
    </div>
  );
}
```

### 2. AccountSwitcher Component

Pre-built dropdown UI for account switching:

```tsx
'use client';

import { AccountSwitcher } from '@chemmangat/msal-next';

export default function Header() {
  return (
    <header>
      <h1>My App</h1>
      <AccountSwitcher
        showAvatars={true}
        maxAccounts={5}
        variant="default"  // or "compact", "minimal"
        onSwitch={(account) => console.log('Switched to', account.name)}
        onAdd={() => console.log('Adding account')}
        onRemove={(account) => console.log('Removed', account.name)}
      />
    </header>
  );
}
```

**Features:**
- Three variants: default, compact, minimal
- User avatars with initials
- Add/remove account buttons
- Configurable max accounts
- Active account indicator
- Smooth animations

### 3. AccountList Component

Display all accounts in a list format:

```tsx
'use client';

import { AccountList } from '@chemmangat/msal-next';

export default function AccountsPage() {
  return (
    <div>
      <h1>Your Accounts</h1>
      <AccountList
        showAvatars={true}
        showDetails={true}
        clickToSwitch={true}
        orientation="vertical"  // or "horizontal"
        onAccountClick={(account) => console.log('Clicked', account.name)}
      />
    </div>
  );
}
```

**Features:**
- Vertical or horizontal layout
- Detailed account information
- Click to switch accounts
- Active account highlighting
- Customizable styling

### 4. Complete Examples

New example file with 5 real-world scenarios:

1. **BasicMultiAccountExample** - Core functionality demo
2. **AccountSwitcherExample** - Component variants showcase
3. **AccountListExample** - List layouts demo
4. **HeaderWithAccountSwitcher** - Real navigation header
5. **AccountManagementPage** - Full-featured management page

Access examples:
```tsx
import {
  BasicMultiAccountExample,
  AccountSwitcherExample,
  AccountListExample,
  HeaderWithAccountSwitcher,
  AccountManagementPage,
} from '@chemmangat/msal-next/examples/multi-account-example';
```

---

## 🚀 Use Cases

### 1. Work + Personal Accounts
Users can stay signed into both their work Microsoft 365 account and personal Microsoft account:

```tsx
// User signs in with work@company.com
await addAccount(['User.Read']);

// Later, adds personal account
await addAccount(['User.Read']);

// Switch between them instantly
switchAccount(personalAccount);
```

### 2. Multiple Work Accounts
IT admins, consultants, or contractors managing multiple tenants:

```tsx
// Sign in to Client A tenant
await addAccount(['User.Read']);

// Add Client B tenant
await addAccount(['User.Read']);

// Switch between clients without re-authentication
switchAccount(clientBAccount);
```

### 3. Testing Different Roles
Developers testing role-based access:

```tsx
// Sign in as admin
await addAccount(['User.Read']);

// Add regular user account
await addAccount(['User.Read']);

// Switch to test different permissions
switchAccount(regularUserAccount);
```

### 4. Multi-Tenant SaaS
SaaS apps where users belong to multiple organizations:

```tsx
<AccountSwitcher
  maxAccounts={10}
  onSwitch={(account) => {
    // Load data for the selected organization
    loadOrganizationData(account.tenantId);
  }}
/>
```

---

## 📊 API Reference

### useMultiAccount Hook

```tsx
interface UseMultiAccountReturn {
  // State
  accounts: AccountInfo[];
  activeAccount: AccountInfo | null;
  hasMultipleAccounts: boolean;
  accountCount: number;
  inProgress: boolean;

  // Actions
  switchAccount: (account: AccountInfo) => void;
  addAccount: (scopes?: string[]) => Promise<void>;
  removeAccount: (account: AccountInfo) => Promise<void>;
  signOutAccount: (account: AccountInfo) => Promise<void>;
  signOutAll: () => Promise<void>;

  // Utilities
  getAccountByUsername: (username: string) => AccountInfo | undefined;
  getAccountById: (homeAccountId: string) => AccountInfo | undefined;
  isActiveAccount: (account: AccountInfo) => boolean;
}
```

### AccountSwitcher Props

```tsx
interface AccountSwitcherProps {
  showAvatars?: boolean;           // Default: true
  maxAccounts?: number;            // Default: 5
  variant?: 'default' | 'compact' | 'minimal';  // Default: 'default'
  showAddButton?: boolean;         // Default: true
  showRemoveButton?: boolean;      // Default: true
  onSwitch?: (account: AccountInfo) => void;
  onAdd?: () => void;
  onRemove?: (account: AccountInfo) => void;
  className?: string;
  style?: CSSProperties;
}
```

### AccountList Props

```tsx
interface AccountListProps {
  showAvatars?: boolean;           // Default: true
  showDetails?: boolean;           // Default: true
  showActiveIndicator?: boolean;   // Default: true
  clickToSwitch?: boolean;         // Default: true
  orientation?: 'vertical' | 'horizontal';  // Default: 'vertical'
  onAccountClick?: (account: AccountInfo) => void;
  className?: string;
  style?: CSSProperties;
}
```

---

## 🎨 Component Variants

### AccountSwitcher Variants

**Default:**
- Full account details
- Large avatars
- Email addresses visible
- Best for desktop apps

**Compact:**
- Smaller padding and fonts
- Medium avatars
- Condensed layout
- Good for tight spaces

**Minimal:**
- Name only (no email)
- No avatars
- Minimal UI
- Perfect for mobile

---

## 🔧 Technical Details

### How It Works

1. **MSAL Account Cache**: Uses MSAL's built-in account caching
2. **Active Account**: Tracks which account is currently active
3. **Token Isolation**: Each account has its own token cache
4. **Automatic Sync**: State syncs with MSAL instance automatically

### Account Switching

When you switch accounts:
1. MSAL sets the new active account
2. All subsequent token requests use the active account
3. UI updates automatically via React state
4. No re-authentication required

### Adding Accounts

When you add an account:
1. Triggers Microsoft login with `prompt: 'select_account'`
2. User selects or signs in with new account
3. Account is cached by MSAL
4. Available for switching immediately

### Removing Accounts

When you remove an account:
1. Clears account from MSAL cache
2. If active account, switches to another account
3. Tokens are cleared for that account
4. Does NOT sign out from Microsoft

### Signing Out

When you sign out an account:
1. Redirects to Microsoft sign-out page
2. Clears account from MSAL cache
3. Clears all tokens for that account
4. User is fully signed out

---

## 🔒 Security Considerations

### Token Isolation
- Each account has separate token storage
- Tokens never mix between accounts
- Switching accounts doesn't expose tokens

### Cache Security
- Accounts stored in sessionStorage by default
- Can use localStorage for persistence
- Encrypted in browser's secure storage

### Best Practices
- Limit max accounts (default: 5)
- Validate account switching in your app
- Log account switches for audit trails
- Clear sensitive data when switching

---

## 🎯 Migration from v4.1.x

**Good news:** No breaking changes! This is a feature addition.

Simply update:
```bash
npm install @chemmangat/msal-next@4.2.0
```

All existing code continues to work. Multi-account features are opt-in.

---

## 📝 Examples

### Example 1: Simple Account Switcher in Header

```tsx
'use client';

import { AccountSwitcher } from '@chemmangat/msal-next';

export default function AppHeader() {
  return (
    <header className="flex justify-between items-center p-4">
      <h1>My App</h1>
      <AccountSwitcher
        showAvatars={true}
        maxAccounts={5}
        onSwitch={(account) => {
          console.log('Switched to:', account.name);
          // Optionally reload data or redirect
        }}
      />
    </header>
  );
}
```

### Example 2: Account Management Page

```tsx
'use client';

import { useMultiAccount, AccountList } from '@chemmangat/msal-next';

export default function AccountsPage() {
  const { accountCount, addAccount, signOutAll } = useMultiAccount();

  return (
    <div className="p-8">
      <h1>Manage Your Accounts</h1>
      <p>You have {accountCount} account(s) signed in</p>

      <AccountList
        showAvatars={true}
        showDetails={true}
        clickToSwitch={true}
      />

      <div className="mt-4 flex gap-2">
        <button onClick={() => addAccount()}>
          Add Account
        </button>
        <button onClick={signOutAll}>
          Sign Out All
        </button>
      </div>
    </div>
  );
}
```

### Example 3: Programmatic Account Switching

```tsx
'use client';

import { useMultiAccount } from '@chemmangat/msal-next';
import { useEffect } from 'react';

export default function AutoSwitcher() {
  const { accounts, switchAccount, getAccountByUsername } = useMultiAccount();

  // Auto-switch to work account on /work routes
  useEffect(() => {
    if (window.location.pathname.startsWith('/work')) {
      const workAccount = getAccountByUsername('user@company.com');
      if (workAccount) {
        switchAccount(workAccount);
      }
    }
  }, []);

  return <div>Content</div>;
}
```

---

## 🐛 Bug Fixes

- Fixed type error in `clearCache` API call
- Removed unused variable in `AccountList` component
- Improved error handling for account operations

---

## 📚 Documentation Updates

- Added multi-account section to README
- Created comprehensive examples file
- Updated API reference with new exports
- Added TypeScript type exports

---

## 🎉 Why This Matters

### For Users
- No more signing out to switch accounts
- Seamless multi-tenant experience
- Better productivity for multi-account workflows

### For Developers
- Pre-built UI components save hours
- Comprehensive examples to copy-paste
- Type-safe API with full TypeScript support
- Zero configuration required

### For Enterprises
- Better support for contractors and consultants
- Improved IT admin workflows
- Multi-tenant SaaS enablement
- Audit trail for account switches

---

## 📊 Stats

- **New Hook:** 1 (`useMultiAccount`)
- **New Components:** 2 (`AccountSwitcher`, `AccountList`)
- **New Examples:** 5 complete scenarios
- **Lines of Code:** ~1,200 lines
- **TypeScript Types:** Fully typed
- **Breaking Changes:** 0

---

## 🔮 What's Next

Potential features for v4.3.0:
- Offline-first authentication with smart caching
- Smart token preloading for instant page loads
- Session analytics and monitoring
- Biometric re-authentication for sensitive actions

---

## 🙏 Thank You

This feature was highly requested by the community. Thank you for your feedback and suggestions!

If you have ideas for future features:
- 💬 [Start a discussion](https://github.com/chemmangat/msal-next/discussions)
- 🐛 [Report an issue](https://github.com/chemmangat/msal-next/issues)
- ⭐ [Star the repo](https://github.com/chemmangat/msal-next)

---

**Version:** 4.2.0  
**Release Date:** March 8, 2026  
**Type:** Feature Release  
**Breaking Changes:** None  
**License:** MIT

---

## 📖 Resources

- [README.md](./README.md) - Complete documentation
- [CHANGELOG.md](./CHANGELOG.md) - Full changelog
- [EXAMPLES_v4.0.2.md](./EXAMPLES_v4.0.2.md) - Code examples
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Troubleshooting guide
- [SECURITY.md](./SECURITY.md) - Security policy

---

**Ready to upgrade?**

```bash
npm install @chemmangat/msal-next@4.2.0
```

Start using multi-account features today! 🚀
