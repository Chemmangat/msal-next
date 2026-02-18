# Getting Started with @chemmangat/msal-next

This guide will help you understand the project structure and how to work with it.

## 📁 Project Structure

```
msal-next/
│
├── packages/core/              # 📦 The NPM Package (what you publish)
│   ├── src/
│   │   ├── components/
│   │   │   └── MsalAuthProvider.tsx
│   │   ├── hooks/
│   │   │   └── useMsalAuth.ts
│   │   ├── utils/
│   │   │   └── createMsalConfig.ts
│   │   ├── types.ts
│   │   └── index.ts           # Main exports
│   ├── package.json           # Package configuration
│   ├── tsconfig.json
│   ├── tsup.config.ts         # Build configuration
│   └── README.md
│
├── src/                        # 🌐 Documentation Website
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   └── components/
│       ├── Hero.tsx
│       ├── Features.tsx
│       ├── CodeExample.tsx
│       ├── QuickStart.tsx
│       ├── ProblemSolution.tsx
│       ├── Navigation.tsx
│       ├── Footer.tsx
│       └── CTA.tsx
│
├── example/                    # 📚 Example Usage
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx
│       └── globals.css
│
├── package.json               # Root package.json for docs site
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 🎯 What Goes Where?

### `packages/core/` - The NPM Package
This is what gets published to npm. It contains:
- React components (`MsalAuthProvider`)
- Custom hooks (`useMsalAuth`)
- TypeScript types
- Utility functions
- **NO Next.js specific code** (except it's designed for Next.js)

### Root `src/` - Documentation Website
This is a Next.js app that showcases the package:
- Beautiful dark-themed landing page
- Feature highlights
- Code examples
- Quick start guide
- Built with Tailwind CSS and Framer Motion

### `example/` - Example Implementation
Shows developers how to use the package in a real Next.js app.

## 🚀 Development Workflow

### 1. Working on the Package

```bash
# Navigate to the package
cd packages/core

# Install dependencies (if needed)
npm install

# Build the package
npm run build

# Watch mode for development
npm run dev
```

### 2. Running the Documentation Website

```bash
# From root directory
npm install
npm run dev
```

Visit `http://localhost:3000` to see the docs site.

### 3. Testing the Package

After publishing, test it in a new Next.js project:

```bash
npx create-next-app@latest test-app
cd test-app
npm install @chemmangat/msal-next @azure/msal-browser @azure/msal-react
```

Then use it as shown in the documentation.

## 📦 Publishing the Package

### Step 1: Build

```bash
npm run build:package
```

This runs `tsup` in `packages/core` and creates:
- `dist/index.js` (CommonJS)
- `dist/index.mjs` (ES Module)
- `dist/index.d.ts` (TypeScript definitions)

### Step 2: Test Locally (Optional)

```bash
cd packages/core
npm pack
```

This creates `chemmangat-msal-next-1.0.0.tgz`. Install it in another project:

```bash
npm install /path/to/chemmangat-msal-next-1.0.0.tgz
```

### Step 3: Publish to npm

```bash
# Make sure you're logged in
npm login

# Publish from root
npm run publish:package

# Or manually
cd packages/core
npm publish --access public
```

## 🌐 Deploying the Documentation Website

### Option 1: Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Deploy!

### Option 2: Netlify

```bash
npm run build
# Upload .next folder to Netlify
```

### Option 3: Static Export

```bash
# Add to next.config.js:
# output: 'export'

npm run build
# Deploy the 'out' folder
```

## 🔧 Making Changes

### Adding a New Feature to the Package

1. Edit files in `packages/core/src/`
2. Update exports in `packages/core/src/index.ts`
3. Build: `npm run build:package`
4. Test in example app
5. Update version in `packages/core/package.json`
6. Publish

### Updating the Documentation

1. Edit files in `src/`
2. Run `npm run dev` to preview
3. Commit and push
4. Deploy to Vercel/Netlify

### Adding Examples

1. Edit files in `example/`
2. Make sure it works with the published package
3. Document in README

## 📝 Version Management

When publishing a new version:

1. Update `packages/core/package.json` version
2. Update `CHANGELOG.md`
3. Build and test
4. Publish to npm
5. Create a git tag: `git tag v1.0.1`
6. Push tag: `git push --tags`

## 🐛 Troubleshooting

### "Module not found" errors
- Make sure you've run `npm install` in the correct directory
- Check that `packages/core` is built (`npm run build:package`)

### TypeScript errors in docs site
- The docs site doesn't import from `packages/core` directly
- It's just a showcase website

### Example app not working
- Make sure `.env` file exists in `example/`
- Check that Azure AD credentials are correct
- Verify redirect URI in Azure Portal

## 🎨 Customizing the Docs Site

The documentation website uses:
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

Colors are defined in `tailwind.config.ts`:
```ts
colors: {
  dark: { ... },
  accent: { ... }
}
```

## 📚 Resources

- [MSAL.js Docs](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)

## 🤝 Need Help?

- Open an issue on GitHub
- Check existing issues
- Read the full documentation

---

Happy coding! 🚀
