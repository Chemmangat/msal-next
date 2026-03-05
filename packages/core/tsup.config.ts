import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/client.ts',
    server: 'src/server.ts',
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
});
