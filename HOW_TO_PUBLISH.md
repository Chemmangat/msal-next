# 📦 How to Publish @chemmangat/msal-next

## TL;DR - Quick Publish

```bash
cd packages/core
npm run build
npm publish --access public
```

Done! ✅

---

## Complete Guide

### Prerequisites

1. **npm account** - Create one at [npmjs.com](https://www.npmjs.com/signup)
2. **Login to npm**:
   ```bash
   npm login
   ```
3. **Verify login**:
   ```bash
   npm whoami
   ```

### Step 1: Navigate to the Package

```bash
cd packages/core
```

This is the ONLY folder you need to publish. It contains:
- `src/` - Source code
- `dist/` - Built files (generated)
- `package.json` - Package configuration
- `README.md` - Package documentation

### Step 2: Update Version (if needed)

Edit `packages/core/package.json`:

```json
{
  "version": "1.0.1"  // Change this
}
```

**Version Guidelines:**
- `1.0.0` → `1.0.1` - Bug fixes (patch)
- `1.0.0` → `1.1.0` - New features (minor)
- `1.0.0` → `2.0.0` - Breaking changes (major)

### Step 3: Build

```bash
npm run build
```

This runs `tsup` and creates:
```
dist/
├── index.js        # CommonJS
├── index.mjs       # ES Module
├── index.d.ts      # TypeScript types
└── *.map           # Source maps
```

### Step 4: Test (Optional but Recommended)

Create a test package:
```bash
npm pack
```

This creates `chemmangat-msal-next-1.0.0.tgz`.

Install it in another Next.js project:
```bash
npm install /path/to/chemmangat-msal-next-1.0.0.tgz
```

Test that it works!

### Step 5: Publish

```bash
npm publish --access public
```

**Why `--access public`?**
Scoped packages (@chemmangat/...) are private by default. This flag makes it public.

### Step 6: Verify

Visit: `https://www.npmjs.com/package/@chemmangat/msal-next`

You should see your package! 🎉

---

## What Gets Published?

Only these files (defined in `package.json` → `"files"`):
- ✅ `dist/` folder
- ✅ `README.md`

Everything else is excluded:
- ❌ `src/` (source code)
- ❌ `node_modules/`
- ❌ Config files (tsconfig.json, tsup.config.ts)
- ❌ `.git/`

---

## Common Issues

### ❌ "You do not have permission to publish"

**Solution:**
1. Make sure you're logged in: `npm whoami`
2. Check if the package name is available
3. Verify you have access to `@chemmangat` scope

### ❌ "Version 1.0.0 already exists"

**Solution:**
Update the version in `package.json` to a new number.

### ❌ "prepublishOnly script failed"

**Solution:**
The build failed. Run `npm run build` to see the error.

### ❌ "Module not found" after installing

**Solution:**
Make sure the build completed successfully and `dist/` folder exists.

---

## Publishing Checklist

Before you publish, check:

- [ ] You're in `packages/core` directory
- [ ] Version number updated in `package.json`
- [ ] Code builds: `npm run build`
- [ ] `dist/` folder exists with files
- [ ] README.md is up to date
- [ ] Logged in to npm: `npm whoami`
- [ ] No sensitive data in code

---

## After Publishing

### 1. Tag the Release

```bash
git tag v1.0.0
git push origin v1.0.0
```

### 2. Update Changelog

Add to `CHANGELOG.md` in the root:

```markdown
## [1.0.0] - 2024-02-18
### Added
- Initial release
```

### 3. Test Installation

In a new project:
```bash
npm install @chemmangat/msal-next
```

### 4. Announce

- Tweet about it
- Post on Reddit (r/nextjs, r/reactjs)
- Share on LinkedIn
- Update your portfolio

---

## Unpublishing (Emergency Only)

⚠️ **Warning:** Only unpublish within 72 hours of publishing!

```bash
npm unpublish @chemmangat/msal-next@1.0.0
```

After 72 hours, you can only deprecate:
```bash
npm deprecate @chemmangat/msal-next@1.0.0 "Use version 1.0.1 instead"
```

---

## Beta/Alpha Releases

For pre-release versions:

```bash
# Update version
npm version 1.1.0-beta.0

# Publish with tag
npm publish --tag beta --access public
```

Users install with:
```bash
npm install @chemmangat/msal-next@beta
```

---

## Automated Publishing with GitHub Actions

Create `.github/workflows/publish.yml`:

```yaml
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
      
      - name: Install dependencies
        run: cd packages/core && npm ci
      
      - name: Build
        run: cd packages/core && npm run build
      
      - name: Publish
        run: cd packages/core && npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Add `NPM_TOKEN` to GitHub Secrets:
1. Go to npmjs.com → Account → Access Tokens
2. Create new token (Automation)
3. Add to GitHub: Settings → Secrets → New secret

---

## Summary

**To publish:**
```bash
cd packages/core
npm run build
npm publish --access public
```

**To update:**
1. Change version in `package.json`
2. Build and publish again

**That's it!** 🚀

---

## Need Help?

- Check [npm documentation](https://docs.npmjs.com/cli/v9/commands/npm-publish)
- Open an issue on GitHub
- Ask on [npm support](https://www.npmjs.com/support)

Happy publishing! 🎉
