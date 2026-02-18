# 🚀 Quick Reference - @chemmangat/msal-next

## Publishing the Package

```bash
cd packages/core
npm run build
npm publish --access public
```

## Running the Docs Website

```bash
npm install
npm run dev
```

Visit: http://localhost:3000

## Project Structure

```
packages/core/  → NPM package (publish this)
src/           → Documentation website
example/       → Example usage
```

## Key Files

| File | What It Does |
|------|--------------|
| `packages/core/src/` | Package source code |
| `packages/core/dist/` | Built package (generated) |
| `src/app/` | Docs website pages |
| `src/components/` | Docs website components |
| `example/` | Example implementation |

## Commands

```bash
# Build package
cd packages/core && npm run build

# Publish package
cd packages/core && npm publish --access public

# Run docs site
npm run dev

# Run example
cd example && npm run dev
```

## Package Usage

```tsx
// Install
npm install @chemmangat/msal-next

// Setup
<MsalAuthProvider clientId="...">
  {children}
</MsalAuthProvider>

// Use
const { isAuthenticated, loginPopup } = useMsalAuth();
```

## What Gets Published?

Only from `packages/core/`:
- ✅ `dist/` folder
- ✅ `README.md`

Everything else stays local.

## Deployment

**Package**: npm (via `npm publish`)
**Docs**: Vercel, Netlify, etc.
**Example**: For testing only

## Version Updates

Edit `packages/core/package.json`:
```json
{
  "version": "1.0.1"  // Change this
}
```

Then rebuild and republish.

## Need Help?

- `HOW_TO_PUBLISH.md` - Publishing guide
- `GETTING_STARTED.md` - Development guide
- `FINAL_SUMMARY.md` - Complete overview
- `README.md` - Main documentation

---

**Ready to publish?**
```bash
cd packages/core && npm publish --access public
```
