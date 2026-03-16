# How to Create and Publish an npm Package

A complete guide using `@chemmangat/msal-next` as a real-world example.

---

## 📋 Table of Contents

1. [Project Setup](#1-project-setup)
2. [Package Configuration](#2-package-configuration)
3. [TypeScript Setup](#3-typescript-setup)
4. [Build Configuration](#4-build-configuration)
5. [Writing Your Code](#5-writing-your-code)
6. [Testing](#6-testing)
7. [Documentation](#7-documentation)
8. [Publishing to npm](#8-publishing-to-npm)
9. [Versioning & Updates](#9-versioning--updates)
10. [Marketing & Growth](#10-marketing--growth)

---

## 1. Project Setup

### Create Your Project Structure

```bash
mkdir my-package
cd my-package
npm init -y
```

### Folder Structure (Example from @chemmangat/msal-next)

```
my-package/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utility functions
│   ├── types.ts           # TypeScript types
│   └── index.ts           # Main entry point
├── dist/                  # Built files (generated)
├── __tests__/            # Test files
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript config
├── tsup.config.ts        # Build config
├── README.md             # Documentation
├── CHANGELOG.md          # Version history
├── LICENSE               # MIT license
└── .gitignore           # Git ignore rules
```

---

## 2. Package Configuration

### package.json (Real Example)

```json
{
  "name": "@chemmangat/msal-next",
  "version": "4.2.0",
  "description": "Production-ready Microsoft/Azure AD authentication for Next.js App Router. Zero-config setup, TypeScript-first, multi-account support, auto token refresh.",
  
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./server": {
      "types": "./dist/server.d.ts",
      "import": "./dist/server.mjs",
      "require": "./dist/server.js"
    }
  },
  
  "files": [
    "dist",
    "README.md",
    "CHANGELOG.md",
    "LICENSE"
  ],
  
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "prepublishOnly": "npm run build"
  },
  
  "keywords": [
    "msal",
    "nextjs",
    "authentication",
    "azure-ad",
    "microsoft",
    "typescript",
    "multi-account"
  ],
  
  "author": "Your Name (username)",
  "license": "MIT",
  
  "repository": {
    "type": "git",
    "url": "https://github.com/username/package-name.git"
  },
  
  "homepage": "https://github.com/username/package-name#readme",
  "bugs": {
    "url": "https://github.com/username/package-name/issues"
  },
  
  "peerDependencies": {
    "react": ">=18.0.0",
    "next": ">=14.0.0"
  },
  
  "devDependencies": {
    "@types/react": "^18.2.0",
    "tsup": "^8.0.1",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0"
  }
}
```

### Key Fields Explained

**Essential:**
- `name`: Package name (use `@username/package-name` for scoped packages)
- `version`: Semantic versioning (1.0.0)
- `description`: Clear, searchable description
- `main`: CommonJS entry point
- `module`: ESM entry point
- `types`: TypeScript definitions

**Important:**
- `exports`: Modern way to define entry points (supports subpaths)
- `files`: What gets published to npm (keep it minimal)
- `keywords`: SEO for npm search (use 10-30 relevant keywords)
- `author`: Your name and username
- `license`: MIT is most common

**Optional but Recommended:**
- `repository`: GitHub URL
- `homepage`: Documentation site
- `bugs`: Issue tracker URL
- `peerDependencies`: Dependencies users must install

---

## 3. TypeScript Setup

### tsconfig.json (Real Example)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    
    "outDir": "./dist",
    "rootDir": "./src",
    
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "__tests__"]
}
```

---

## 4. Build Configuration

### tsup.config.ts (Real Example)

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    server: 'src/server.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'next',
    '@azure/msal-browser',
    '@azure/msal-react',
  ],
});
```

### Why tsup?

- Builds CJS + ESM + TypeScript definitions
- Fast (uses esbuild)
- Zero config for most cases
- Tree-shakeable output

### Alternative: tsc + rollup

```bash
npm install -D rollup @rollup/plugin-typescript
```

---

## 5. Writing Your Code

### src/index.ts (Main Entry Point)

```typescript
// Export everything users need
export { MsalAuthProvider } from './components/MsalAuthProvider';
export { useMsalAuth } from './hooks/useMsalAuth';
export { useMultiAccount } from './hooks/useMultiAccount';

// Export types
export type { MsalConfig, AuthResult } from './types';
```

### Example Component (src/components/AccountSwitcher.tsx)

```typescript
'use client';

import React from 'react';
import { useMultiAccount } from '../hooks/useMultiAccount';
import type { AccountInfo } from '@azure/msal-browser';

export interface AccountSwitcherProps {
  showAvatars?: boolean;
  maxAccounts?: number;
  onSwitch?: (account: AccountInfo) => void;
}

export function AccountSwitcher({
  showAvatars = true,
  maxAccounts = 5,
  onSwitch,
}: AccountSwitcherProps) {
  const { accounts, activeAccount, switchAccount } = useMultiAccount();

  const handleSwitch = (account: AccountInfo) => {
    switchAccount(account);
    onSwitch?.(account);
  };

  return (
    <div className="account-switcher">
      {accounts.slice(0, maxAccounts).map((account) => (
        <button
          key={account.homeAccountId}
          onClick={() => handleSwitch(account)}
          className={activeAccount?.homeAccountId === account.homeAccountId ? 'active' : ''}
        >
          {showAvatars && <Avatar name={account.name} />}
          <span>{account.name}</span>
        </button>
      ))}
    </div>
  );
}
```

### Example Hook (src/hooks/useMultiAccount.ts)

```typescript
'use client';

import { useMsal } from '@azure/msal-react';
import { useState, useEffect } from 'react';
import type { AccountInfo } from '@azure/msal-browser';

export function useMultiAccount() {
  const { instance, accounts: msalAccounts } = useMsal();
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [activeAccount, setActiveAccount] = useState<AccountInfo | null>(null);

  useEffect(() => {
    setAccounts(msalAccounts);
    setActiveAccount(instance.getActiveAccount());
  }, [msalAccounts, instance]);

  const switchAccount = (account: AccountInfo) => {
    instance.setActiveAccount(account);
    setActiveAccount(account);
  };

  const addAccount = async (scopes: string[] = ['User.Read']) => {
    try {
      await instance.loginPopup({
        scopes,
        prompt: 'select_account',
      });
    } catch (error) {
      console.error('Failed to add account:', error);
    }
  };

  return {
    accounts,
    activeAccount,
    switchAccount,
    addAccount,
    accountCount: accounts.length,
    hasMultipleAccounts: accounts.length > 1,
  };
}
```

### Types (src/types.ts)

```typescript
import type { AccountInfo } from '@azure/msal-browser';

export interface MsalConfig {
  clientId: string;
  authority: string;
  redirectUri: string;
}

export interface AuthResult {
  account: AccountInfo;
  accessToken: string;
  idToken: string;
}

export interface UseMultiAccountReturn {
  accounts: AccountInfo[];
  activeAccount: AccountInfo | null;
  switchAccount: (account: AccountInfo) => void;
  addAccount: (scopes?: string[]) => Promise<void>;
  accountCount: number;
  hasMultipleAccounts: boolean;
}
```

---

## 6. Testing

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

### Example Test (src/__tests__/hooks/useMultiAccount.test.ts)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useMultiAccount } from '../../hooks/useMultiAccount';

describe('useMultiAccount', () => {
  it('should return accounts', () => {
    const { result } = renderHook(() => useMultiAccount());
    
    expect(result.current.accounts).toBeDefined();
    expect(Array.isArray(result.current.accounts)).toBe(true);
  });

  it('should switch accounts', async () => {
    const { result } = renderHook(() => useMultiAccount());
    const mockAccount = { homeAccountId: '123', name: 'Test User' };
    
    act(() => {
      result.current.switchAccount(mockAccount);
    });
    
    expect(result.current.activeAccount).toEqual(mockAccount);
  });
});
```

### Run Tests

```bash
npm test                 # Run once
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage
```

---

## 7. Documentation

### README.md Structure

```markdown
# @chemmangat/msal-next

> Production-ready Microsoft/Azure AD authentication for Next.js App Router

## Features

- ✅ Zero-config setup
- ✅ TypeScript-first
- ✅ Multi-account support
- ✅ Auto token refresh
- ✅ Protected routes

## Installation

\`\`\`bash
npm install @chemmangat/msal-next
\`\`\`

## Quick Start

\`\`\`tsx
import { MsalAuthProvider } from '@chemmangat/msal-next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MsalAuthProvider>
          {children}
        </MsalAuthProvider>
      </body>
    </html>
  );
}
\`\`\`

## Usage

### Basic Authentication

\`\`\`tsx
'use client';

import { useMsalAuth } from '@chemmangat/msal-next';

export default function LoginButton() {
  const { login, logout, user, isAuthenticated } = useMsalAuth();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.name}</p>
          <button onClick={logout}>Sign Out</button>
        </>
      ) : (
        <button onClick={login}>Sign In</button>
      )}
    </div>
  );
}
\`\`\`

### Multi-Account Management

\`\`\`tsx
'use client';

import { AccountSwitcher } from '@chemmangat/msal-next';

export default function Header() {
  return (
    <header>
      <h1>My App</h1>
      <AccountSwitcher maxAccounts={5} />
    </header>
  );
}
\`\`\`

## API Reference

### useMsalAuth()

\`\`\`typescript
const {
  login,
  logout,
  user,
  isAuthenticated,
  isLoading,
  error,
} = useMsalAuth();
\`\`\`

### useMultiAccount()

\`\`\`typescript
const {
  accounts,
  activeAccount,
  switchAccount,
  addAccount,
} = useMultiAccount();
\`\`\`

## Examples

See [examples](./examples) for complete working examples.

## License

MIT © Hari Manoj (chemmangat)
```

### CHANGELOG.md

```markdown
# Changelog

## [4.2.0] - 2026-03-08

### Added
- Multi-account management with `useMultiAccount` hook
- `AccountSwitcher` component with 3 variants
- `AccountList` component for account display
- Support for up to 5 simultaneous accounts

### Fixed
- Type error in clearCache API call
- Improved error handling

## [4.1.0] - 2026-02-15

### Added
- Auto token refresh functionality
- `useTokenRefresh` hook

## [4.0.0] - 2026-01-01

### Added
- Initial release
```

---

## 8. Publishing to npm

### Step 1: Create npm Account

```bash
# Sign up at https://www.npmjs.com/signup
# Then login
npm login
```

### Step 2: Prepare for Publishing

```bash
# Build your package
npm run build

# Test the build
npm pack
# This creates a .tgz file - inspect it to see what will be published

# Test installation locally
npm install ./chemmangat-msal-next-4.2.0.tgz
```

### Step 3: Publish

```bash
# First time (public package)
npm publish --access public

# Scoped package (@username/package)
npm publish --access public

# Private package (requires paid npm account)
npm publish --access restricted
```

### Step 4: Verify

```bash
# Check on npm
https://www.npmjs.com/package/@chemmangat/msal-next

# Install and test
npm install @chemmangat/msal-next
```

---

## 9. Versioning & Updates

### Semantic Versioning (SemVer)

```
MAJOR.MINOR.PATCH
4.2.0
```

- **MAJOR** (4): Breaking changes
- **MINOR** (2): New features (backward compatible)
- **PATCH** (0): Bug fixes

### Update Version

```bash
# Patch (4.2.0 → 4.2.1)
npm version patch

# Minor (4.2.0 → 4.3.0)
npm version minor

# Major (4.2.0 → 5.0.0)
npm version major
```

### Publish Update

```bash
# Update version
npm version minor

# Build
npm run build

# Publish
npm publish

# Push git tags
git push --follow-tags
```

### Real Example from @chemmangat/msal-next

```bash
# v4.1.0 → v4.2.0 (added multi-account feature)
npm version minor
npm run build
npm publish
git push --follow-tags
```

---

## 10. Marketing & Growth

### SEO Optimization

**package.json keywords (30+ keywords):**
```json
{
  "keywords": [
    "msal",
    "nextjs",
    "next.js",
    "authentication",
    "auth",
    "azure-ad",
    "microsoft",
    "microsoft-auth",
    "oauth",
    "typescript",
    "multi-account",
    "zero-config"
  ]
}
```

### GitHub Optimization

1. **Add Topics** (GitHub repo settings)
   - nextjs, authentication, msal, typescript, azure-ad

2. **Good README**
   - Clear description
   - Installation instructions
   - Code examples
   - Badges (npm version, downloads, license)

3. **GitHub Actions**
   - Auto-publish on release
   - Run tests on PR
   - Generate documentation

### Content Marketing

**Write Blog Posts:**
- "How to Add Microsoft Auth to Next.js in 5 Minutes"
- "Multi-Account Management in Next.js"
- "Why We Built @chemmangat/msal-next"

**Share on:**
- Dev.to
- Medium
- Reddit (r/nextjs, r/webdev)
- Twitter/X
- LinkedIn

### Landing Page

Create a documentation site with:
- SEO meta tags
- Code examples
- Feature showcase
- Getting started guide

**Example:** https://msal-next.vercel.app

### Google Search Console

1. Add your site
2. Submit sitemap
3. Monitor search performance
4. Optimize based on data

---

## 📊 Real Results: @chemmangat/msal-next

**Timeline:**
- v1.0.0: Initial release
- v2.0.0: Added components
- v3.0.0: Next.js 14 support
- v4.0.0: Production features
- v4.1.0: Token refresh
- v4.2.0: Multi-account (current)

**Growth:**
- 2.9k+ downloads
- 100% TypeScript
- MIT License
- Active maintenance

**Target:**
- 29k downloads (10x growth)
- 6-12 month timeline

---

## 🎯 Checklist

### Before Publishing

- [ ] Code is tested and working
- [ ] TypeScript types are correct
- [ ] Build succeeds (`npm run build`)
- [ ] README is complete
- [ ] CHANGELOG is updated
- [ ] Version is bumped
- [ ] LICENSE file exists
- [ ] .npmignore or package.json "files" is configured
- [ ] Keywords are optimized
- [ ] Repository URL is set

### After Publishing

- [ ] Verify on npmjs.com
- [ ] Test installation
- [ ] Create GitHub release
- [ ] Write announcement blog post
- [ ] Share on social media
- [ ] Update documentation site
- [ ] Submit to Google Search Console

---

## 🚀 Quick Commands Reference

```bash
# Setup
npm init -y
npm install -D typescript tsup vitest

# Development
npm run dev          # Watch mode
npm run build        # Build package
npm test            # Run tests

# Publishing
npm login
npm version minor
npm run build
npm publish --access public

# Updates
npm version patch    # Bug fix
npm version minor    # New feature
npm version major    # Breaking change
```

---

## 📚 Resources

- [npm Documentation](https://docs.npmjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [tsup Documentation](https://tsup.egoist.dev/)
- [Semantic Versioning](https://semver.org/)
- [@chemmangat/msal-next Source](https://github.com/chemmangat/msal-next)

---

## 💡 Pro Tips

1. **Start Simple**: Don't over-engineer v1.0.0
2. **TypeScript First**: Types make your package professional
3. **Good Documentation**: README is your marketing page
4. **Test Everything**: Bugs hurt adoption
5. **Semantic Versioning**: Be consistent with versions
6. **Respond Quickly**: Answer issues within 24 hours
7. **Keep It Updated**: Regular updates show active maintenance
8. **Listen to Users**: Feature requests guide your roadmap

---

**Created by:** Hari Manoj (chemmangat)  
**Example Package:** [@chemmangat/msal-next](https://www.npmjs.com/package/@chemmangat/msal-next)  
**License:** MIT
