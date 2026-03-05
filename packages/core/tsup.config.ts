import { defineConfig } from 'tsup';

export default defineConfig([
  // Client entry point (with 'use client')
  {
    entry: {
      index: 'src/client.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: false,
    clean: true,
    external: [
      'react',
      'react-dom',
      'next',
      'next/server',
      'next/headers',
      '@azure/msal-browser',
      '@azure/msal-react',
    ],
    esbuildOptions(options) {
      options.banner = {
        js: '"use client";',
      };
    },
  },
  // Server entry point (without 'use client')
  {
    entry: {
      server: 'src/server.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: false,
    clean: false,
    external: [
      'react',
      'react-dom',
      'next',
      'next/server',
      'next/headers',
      '@azure/msal-browser',
      '@azure/msal-react',
    ],
  },
]);
