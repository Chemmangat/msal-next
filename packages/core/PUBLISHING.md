# Publishing @chemmangat/msal-next to npm

## Quick Publish

```bash
cd packages/core
npm run build
npm publish --access public
```

That's it! ✅

## Step-by-Step Guide

### 1. Make sure you're logged in to npm

```bash
npm login
```

Enter your npm credentials.

### 2. Update the version (if needed)

Edit `package.json` and update the version:

```json
{
  "version": "1.0.1"  // Increment this
}
```

Follow [Semantic Versioning](https://semver.org/):
- **Patch** (1.0.x): Bug fixes
- **Minor** (1.x.0): New features, backward compatible
- **Major** (x.0.0): Breaking changes

### 3. Build the package

```bash
npm run build
```

This creates the `dist/` folder with:
- `index.js` (CommonJS)
- `index.mjs` (ES Module)
- `index.d.ts` (TypeScript definitions)

### 4. Test locally (optional)

```bash
npm pack
```

This creates a `.tgz` file. Install it in another project to test:

```bash
npm install /path/to/chemmangat-msal-next-1.0.0.tgz
```

### 5. Publish to npm

```bash
npm publish --access public
```

The `--access public` flag is required for scoped packages (@chemmangat/...).

### 6. Verify

Check your package on npm:
```
https://www.npmjs.com/package/@chemmangat/msal-next
```

## What Gets Published?

Only these files (defined in `package.json` "files" field):
- `dist/` - Built JavaScript and TypeScript definitions
- `README.md` - Package documentation

Everything else is excluded via `.npmignore`.

## Troubleshooting

### "You do not have permission to publish"

Make sure:
1. You're logged in: `npm whoami`
2. You have access to the `@chemmangat` scope
3. The package name is available

### "Version already exists"

You cannot republish the same version. Update the version number in `package.json`.

### "prepublishOnly script failed"

The build failed. Check for TypeScript errors:
```bash
npm run build
```

## Automated Publishing (Optional)

Add to `.github/workflows/publish.yml`:

```yaml
name: Publish Package

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
      - run: cd packages/core && npm ci
      - run: cd packages/core && npm run build
      - run: cd packages/core && npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Pre-release Versions

For beta/alpha releases:

```bash
# Update version to beta
npm version 1.1.0-beta.0

# Publish with beta tag
npm publish --tag beta --access public

# Users install with:
npm install @chemmangat/msal-next@beta
```

## Checklist Before Publishing

- [ ] Version updated in `package.json`
- [ ] Code builds successfully: `npm run build`
- [ ] README.md is up to date
- [ ] No sensitive data in code
- [ ] Tested locally (optional but recommended)
- [ ] Logged in to npm: `npm whoami`

## After Publishing

1. Create a git tag:
```bash
git tag v1.0.0
git push --tags
```

2. Update CHANGELOG.md in the root

3. Announce on social media / GitHub discussions

---

**Ready to publish?**

```bash
cd packages/core
npm run build
npm publish --access public
```

🚀 Done!
