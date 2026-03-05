# Testing Guide for @chemmangat/msal-next

This guide covers testing strategies, patterns, and best practices for the msal-next library.

## Test Coverage Goals

- **Overall Coverage**: 80%+
- **Critical Paths**: 95%+
- **Hooks**: 90%+
- **Components**: 85%+
- **Utilities**: 90%+

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- src/hooks/useMsalAuth.test.ts
```

## Test Structure

```
src/
├── __tests__/
│   ├── setup.ts                    # Test setup and global mocks
│   ├── utils/                      # Utility tests
│   │   ├── createMsalConfig.test.ts
│   │   ├── debugLogger.test.ts
│   │   └── tokenRetry.test.ts
│   ├── hooks/                      # Hook tests
│   │   ├── useMsalAuth.test.ts
│   │   ├── useGraphApi.test.ts
│   │   ├── useUserProfile.test.ts
│   │   └── useRoles.test.ts
│   ├── components/                 # Component tests
│   │   ├── AuthGuard.test.tsx
│   │   ├── MicrosoftSignInButton.test.tsx
│   │   ├── SignOutButton.test.tsx
│   │   └── UserAvatar.test.tsx
│   └── middleware/                 # Middleware tests
│       └── createAuthMiddleware.test.ts
```

## Testing Patterns

### 1. Testing Hooks

Use `@testing-library/react-hooks` for testing custom hooks:

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useMsalAuth } from '../hooks/useMsalAuth';

describe('useMsalAuth', () => {
  it('should return authentication state', () => {
    const { result } = renderHook(() => useMsalAuth());
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.account).toBeNull();
  });

  it('should handle login', async () => {
    const { result } = renderHook(() => useMsalAuth());
    
    await act(async () => {
      await result.current.loginPopup();
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
  });
});
```

### 2. Testing Components

Use `@testing-library/react` for component testing:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MicrosoftSignInButton } from '../components/MicrosoftSignInButton';

describe('MicrosoftSignInButton', () => {
  it('should render sign in button', () => {
    render(<MicrosoftSignInButton />);
    
    expect(screen.getByText(/sign in with microsoft/i)).toBeInTheDocument();
  });

  it('should call onSuccess after login', async () => {
    const onSuccess = jest.fn();
    render(<MicrosoftSignInButton onSuccess={onSuccess} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
```

### 3. Testing Utilities

Standard unit testing for utility functions:

```typescript
import { retryWithBackoff } from '../utils/tokenRetry';

describe('retryWithBackoff', () => {
  it('should succeed on first try', async () => {
    const fn = jest.fn().mockResolvedValue('success');
    
    const result = await retryWithBackoff(fn);
    
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure', async () => {
    const fn = jest.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success');
    
    const result = await retryWithBackoff(fn, { maxRetries: 3 });
    
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
```

### 4. Testing Middleware

Test middleware with mock requests and responses:

```typescript
import { createAuthMiddleware } from '../middleware/createAuthMiddleware';
import { NextRequest, NextResponse } from 'next/server';

describe('createAuthMiddleware', () => {
  it('should allow access to public routes', async () => {
    const middleware = createAuthMiddleware({
      protectedRoutes: ['/dashboard'],
    });

    const request = new NextRequest('http://localhost:3000/');
    const response = await middleware(request);

    expect(response).toBeUndefined(); // No redirect
  });

  it('should redirect unauthenticated users', async () => {
    const middleware = createAuthMiddleware({
      protectedRoutes: ['/dashboard'],
      loginPath: '/login',
    });

    const request = new NextRequest('http://localhost:3000/dashboard');
    const response = await middleware(request);

    expect(response?.status).toBe(307);
    expect(response?.headers.get('location')).toContain('/login');
  });
});
```

## Mocking MSAL

### Mock MSAL Instance

```typescript
// __tests__/setup.ts
import { vi } from 'vitest';

export const mockMsalInstance = {
  initialize: vi.fn().mockResolvedValue(undefined),
  loginPopup: vi.fn().mockResolvedValue({
    account: {
      homeAccountId: '123',
      environment: 'login.windows.net',
      tenantId: 'tenant-id',
      username: 'user@example.com',
      localAccountId: 'local-id',
      name: 'Test User',
      idTokenClaims: {},
    },
  }),
  loginRedirect: vi.fn(),
  logoutPopup: vi.fn().mockResolvedValue(undefined),
  logoutRedirect: vi.fn(),
  acquireTokenSilent: vi.fn().mockResolvedValue({
    accessToken: 'mock-token',
    account: {},
  }),
  acquireTokenPopup: vi.fn().mockResolvedValue({
    accessToken: 'mock-token',
    account: {},
  }),
  getAllAccounts: vi.fn().mockReturnValue([]),
  getActiveAccount: vi.fn().mockReturnValue(null),
  setActiveAccount: vi.fn(),
};

vi.mock('@azure/msal-browser', () => ({
  PublicClientApplication: vi.fn(() => mockMsalInstance),
  InteractionStatus: {
    None: 'none',
    Login: 'login',
    Logout: 'logout',
  },
}));
```

### Mock useMsal Hook

```typescript
vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: mockMsalInstance,
    accounts: [],
    inProgress: 'none',
  }),
  MsalProvider: ({ children }: any) => children,
}));
```

## Testing Edge Cases

### 1. Error Scenarios

```typescript
it('should handle token acquisition errors', async () => {
  const { result } = renderHook(() => useMsalAuth());
  
  mockMsalInstance.acquireTokenSilent.mockRejectedValue(
    new Error('Token expired')
  );

  await expect(
    result.current.acquireToken(['User.Read'])
  ).rejects.toThrow('Token expired');
});
```

### 2. Race Conditions

```typescript
it('should handle concurrent token requests', async () => {
  const { result } = renderHook(() => useMsalAuth());
  
  const promises = [
    result.current.acquireToken(['User.Read']),
    result.current.acquireToken(['User.Read']),
    result.current.acquireToken(['User.Read']),
  ];

  const tokens = await Promise.all(promises);
  
  // Should only call MSAL once due to deduplication
  expect(mockMsalInstance.acquireTokenSilent).toHaveBeenCalledTimes(1);
  expect(tokens).toHaveLength(3);
});
```

### 3. Memory Leaks

```typescript
it('should cleanup on unmount', () => {
  const { unmount } = renderHook(() => useUserProfile());
  
  // Trigger some async operations
  act(() => {
    // ... trigger operations
  });

  unmount();

  // Verify cleanup happened
  expect(/* cleanup verification */).toBe(true);
});
```

## Performance Testing

### Measure Hook Performance

```typescript
it('should complete token acquisition within 100ms', async () => {
  const { result } = renderHook(() => useMsalAuth());
  
  const start = performance.now();
  await result.current.acquireToken(['User.Read']);
  const duration = performance.now() - start;

  expect(duration).toBeLessThan(100);
});
```

## Integration Testing

### Full Authentication Flow

```typescript
describe('Full Authentication Flow', () => {
  it('should complete login -> token -> logout flow', async () => {
    const { result } = renderHook(() => useMsalAuth());

    // Login
    await act(async () => {
      await result.current.loginPopup();
    });
    expect(result.current.isAuthenticated).toBe(true);

    // Get token
    const token = await result.current.acquireToken(['User.Read']);
    expect(token).toBeTruthy();

    // Logout
    await act(async () => {
      await result.current.logoutPopup();
    });
    expect(result.current.isAuthenticated).toBe(false);
  });
});
```

## Coverage Reports

After running `npm run test:coverage`, view the report:

```bash
# Open HTML coverage report
open coverage/index.html
```

### Coverage Thresholds

Configured in `vitest.config.ts`:

```typescript
coverage: {
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80,
  },
}
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

## Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what the code does, not how it does it
   - Avoid testing internal state

2. **Use Descriptive Test Names**
   - `it('should redirect to login when unauthenticated')`
   - Not: `it('works')`

3. **Arrange-Act-Assert Pattern**
   ```typescript
   it('should do something', () => {
     // Arrange
     const input = 'test';
     
     // Act
     const result = doSomething(input);
     
     // Assert
     expect(result).toBe('expected');
   });
   ```

4. **One Assertion Per Test** (when possible)
   - Makes failures easier to diagnose
   - More granular test coverage

5. **Mock External Dependencies**
   - Don't make real API calls
   - Use mocks for MSAL, fetch, etc.

6. **Test Edge Cases**
   - Empty inputs
   - Null/undefined values
   - Error conditions
   - Boundary values

## Troubleshooting

### Tests Timing Out

Increase timeout in test file:

```typescript
it('should complete', async () => {
  // ...
}, 10000); // 10 second timeout
```

### Flaky Tests

- Use `waitFor` for async operations
- Avoid hardcoded delays
- Mock timers when needed

### Memory Leaks

- Always cleanup in `afterEach`
- Unmount components
- Clear timers and intervals

---

**Last Updated**: March 5, 2026  
**Coverage Target**: 80%+  
**Test Framework**: Vitest + Testing Library
