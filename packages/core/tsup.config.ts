import { defineConfig } from 'tsup';

export default defineConfig([
  // Client entry point
  {
    entry: {
      index: 'src/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: true,
    sourcemap: false, // Disabled to reduce package size
    clean: true,
    treeshake: true,
    minify: true, // Enable minification
    external: [
      'react',
      'react-dom',
      'next',
      'next/server',
      'next/headers',
      '@azure/msal-browser',
      '@azure/msal-react',
    ],
    banner: {
      js: '"use client";',
    },
    esbuildOptions(options) {
      options.banner = {
        js: '"use client";',
      };
    },
  },
  // Server entry point (no "use client" banner)
  {
    entry: {
      server: 'src/server.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: false, // Disabled to reduce package size
    clean: false,
    treeshake: true,
    minify: true, // Enable minification
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
