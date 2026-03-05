# @chemmangat/msal-next-cli

CLI tool for setting up @chemmangat/msal-next in Next.js projects.

## Installation

No installation required! Use with `npx`:

```bash
npx @chemmangat/msal-next init
```

Or install globally:

```bash
npm install -g @chemmangat/msal-next-cli
msal-next init
```

## Commands

### `init`

Initialize MSAL authentication in your Next.js project.

```bash
npx @chemmangat/msal-next init
```

**Options**:
- `-y, --yes` - Skip prompts and use defaults
- `--app-router` - Use App Router (default)
- `--pages-router` - Use Pages Router
- `--typescript` - Use TypeScript (default)
- `--javascript` - Use JavaScript

**What it does**:
1. Detects your Next.js project structure
2. Installs required dependencies
3. Creates `.env.local` with Azure AD configuration
4. Generates layout file with `MsalAuthProvider`
5. Creates middleware for route protection
6. Adds example authentication page

**Example**:
```bash
# Interactive mode
npx @chemmangat/msal-next init

# Skip prompts
npx @chemmangat/msal-next init -y

# Specify options
npx @chemmangat/msal-next init --typescript --app-router
```

### `add`

Add a component or feature to your project.

```bash
npx @chemmangat/msal-next add <component>
```

**Available components**:
- `auth-guard` - Protected route wrapper component
- `user-avatar` - User avatar with MS Graph photo
- `role-gate` - Role-based conditional rendering
- `debug-panel` - Visual debug information panel

**Options**:
- `-p, --path <path>` - Custom output path

**Example**:
```bash
# Add AuthGuard component
npx @chemmangat/msal-next add auth-guard

# Add to custom path
npx @chemmangat/msal-next add user-avatar --path src/components
```

### `configure`

Configure Azure AD app registration.

```bash
npx @chemmangat/msal-next configure
```

**Options**:
- `--tenant-id <id>` - Azure AD Tenant ID
- `--client-id <id>` - Azure AD Client ID

**What it does**:
1. Prompts for Azure AD credentials
2. Updates `.env.local` file
3. Validates configuration

**Example**:
```bash
# Interactive mode
npx @chemmangat/msal-next configure

# With options
npx @chemmangat/msal-next configure \
  --client-id "your-client-id" \
  --tenant-id "your-tenant-id"
```

## Quick Start

### 1. Create a Next.js project

```bash
npx create-next-app@latest my-app
cd my-app
```

### 2. Initialize MSAL

```bash
npx @chemmangat/msal-next init
```

### 3. Configure Azure AD

Update `.env.local` with your Azure AD credentials:

```env
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=your-client-id
NEXT_PUBLIC_AZURE_AD_TENANT_ID=your-tenant-id
```

Or use the configure command:

```bash
npx @chemmangat/msal-next configure
```

### 4. Start your app

```bash
npm run dev
```

Visit `http://localhost:3000/auth` to test authentication!

## Project Structure

After running `init`, your project will have:

```
my-app/
├── .env.local                 # Azure AD configuration
├── app/
│   ├── layout.tsx            # With MsalAuthProvider
│   └── auth/
│       └── page.tsx          # Example auth page
├── middleware.ts             # Route protection
└── package.json              # With msal dependencies
```

## Features

### Auto-Detection

The CLI automatically detects:
- Next.js version
- App Router vs Pages Router
- TypeScript vs JavaScript
- Package manager (npm, yarn, pnpm)

### Smart Defaults

- Uses App Router by default (Next.js 13+)
- Uses TypeScript by default
- Configures sensible MSAL defaults
- Creates example pages for testing

### Zero Config

Run one command and you're ready to go:

```bash
npx @chemmangat/msal-next init -y
```

## Requirements

- Node.js 18+
- Next.js 14.1+
- npm, yarn, or pnpm

## Troubleshooting

### "Not a Next.js project"

Make sure you're in a Next.js project directory with a `package.json` file that includes Next.js as a dependency.

### "Permission denied"

Try running with `sudo` (not recommended) or fix npm permissions:

```bash
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

### "Module not found"

Make sure dependencies are installed:

```bash
npm install
```

## Examples

### Basic Setup

```bash
# Create new Next.js app
npx create-next-app@latest my-app
cd my-app

# Initialize MSAL
npx @chemmangat/msal-next init -y

# Configure Azure AD
npx @chemmangat/msal-next configure

# Start app
npm run dev
```

### Add Components

```bash
# Add AuthGuard
npx @chemmangat/msal-next add auth-guard

# Add UserAvatar
npx @chemmangat/msal-next add user-avatar

# Add RoleGate
npx @chemmangat/msal-next add role-gate
```

### Custom Configuration

```bash
# Use Pages Router
npx @chemmangat/msal-next init --pages-router

# Use JavaScript
npx @chemmangat/msal-next init --javascript

# Skip example page
npx @chemmangat/msal-next init --no-example
```

## Support

- 📖 [Documentation](https://github.com/chemmangat/msal-next#readme)
- 🐛 [Issue Tracker](https://github.com/chemmangat/msal-next/issues)
- 💬 [Discussions](https://github.com/chemmangat/msal-next/discussions)

## License

MIT © [Chemmangat](https://github.com/chemmangat)

## Related Packages

- [@chemmangat/msal-next](https://www.npmjs.com/package/@chemmangat/msal-next) - Core library
- [@azure/msal-browser](https://www.npmjs.com/package/@azure/msal-browser) - MSAL browser library
- [@azure/msal-react](https://www.npmjs.com/package/@azure/msal-react) - MSAL React library
