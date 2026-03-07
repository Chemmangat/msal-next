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
    minify: false,
    treeshake: false, // Disable treeshaking to preserve directives
    splitting: false,
    esbuildOptions(options) {
      options.banner = {
        js: '"use client";',
      };
    },
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
  // Server entry point (without 'use client')
  {
    entry: {
      server: 'src/server.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: false,
    clean: false,
    minify: false,
    treeshake: true,
    splitting: false,
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
