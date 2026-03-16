import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      react: path.resolve(__dirname, '../../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
      'react/jsx-runtime': path.resolve(__dirname, '../../node_modules/react/jsx-runtime'),
      '@azure/msal-react': path.resolve(__dirname, '../../node_modules/@azure/msal-react'),
      '@azure/msal-browser': path.resolve(__dirname, '../../node_modules/@azure/msal-browser'),
      '@testing-library/react': path.resolve(__dirname, '../../node_modules/@testing-library/react'),
      '@testing-library/jest-dom': path.resolve(__dirname, '../../node_modules/@testing-library/jest-dom'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        'src/examples/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/',
        // Provider/wrapper components requiring full MSAL integration
        'src/components/MsalAuthProvider.tsx',
        'src/components/MSALProvider.tsx',
        'src/components/ErrorBoundary.tsx',
        'src/components/TokenRefreshManager.tsx',
        // Server-side utilities
        'src/server.ts',
        'src/client.ts',
        'src/utils/getServerSession.ts',
        'src/utils/withAuth.tsx',
        'src/utils/configValidator.ts',
        // Middleware and protection (integration-level)
        'src/middleware/',
        'src/protection/',
        // Error classes and low-level utilities
        'src/errors/',
        'src/utils/validation.ts',
        // Shim
        'use-client-shim.js',
      ],
      thresholds: {
        lines: 80,
        functions: 55,
        branches: 75,
        statements: 80,
      },
    },
  },
});
