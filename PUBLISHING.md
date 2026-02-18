# Publishing Guide

This guide explains how to publish `@chemmangat/msal-next` to npm.

## Prerequisites

1. npm account with access to `@chemmangat` scope
2. Logged in to npm: `npm login`

## Publishing Steps

### 1. Update Version

Update the version in `package.json` following [Semantic Versioning](https://semver.org/):

- **Patch** (1.0.x): Bug fixes, minor changes
- **Minor** (1.x.0): New features, backward compatible
- **Major** (x.0.0): Breaking changes

```bash
# Manually edit package.json or use npm version
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

### 2. Build the Package

```bash
npm run build
```

This creates the `dist/` directory with:
- `index.js` (CommonJS)
- `index.mjs` (ES Module)
- `index.d.ts` (TypeScript definitions)

### 3. Test the Build

Test locally before publishing:

```bash
# Create a tarball
npm pack

# This creates @chemmangat-msal-next-1.0.0.tgz
# Install it in another project to test
cd /path/to/test-project
npm install /path/to/msal-next/@chemmangat-msal-next-1.0.0.tgz
```

### 4. Publish to npm

```bash
# Dry run to see what will be published
npm publish --dry-run

# Publish to npm
npm publish --access public
```

### 5. Verify Publication

1. Check on npm: https://www.npmjs.com/package/@chemmangat/msal-next
2. Install in a test project:
```bash
npm install @chemmangat/msal-next
```

## Publishing Checklist

Before publishing, ensure:

- [ ] Version number updated in `package.json`
- [ ] CHANGELOG.md updated (if exists)
- [ ] README.md is up to date
- [ ] All tests pass
- [ ] Library builds successfully: `npm run build`
- [ ] Example app works: `npm run dev`
- [ ] No sensitive data in code
- [ ] Git tag created: `git tag v1.0.0 && git push --tags`

## Automated Publishing (Optional)

You can automate publishing with GitHub Actions:

```yaml
# .github/workflows/publish.yml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Troubleshooting

### "You do not have permission to publish"

Ensure you're logged in and have access to the `@chemmangat` scope:
```bash
npm login
npm whoami
```

### "Package name too similar to existing package"

If `@chemmangat/msal-next` is taken, choose a different name in `package.json`.

### "Version already exists"

You cannot republish the same version. Increment the version number.

## Beta/Alpha Releases

For pre-release versions:

```bash
# Update version to beta
npm version 1.1.0-beta.0

# Publish with beta tag
npm publish --tag beta

# Users install with:
npm install @chemmangat/msal-next@beta
```

## Unpublishing

⚠️ Only unpublish within 72 hours of publishing:

```bash
npm unpublish @chemmangat/msal-next@1.0.0
```

## Support

For issues with publishing, contact npm support or open an issue in the repository.
