import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ProjectType {
  isNextJs: boolean;
  hasAppRouter: boolean;
  hasPagesRouter: boolean;
  isTypeScript: boolean;
  packageManager: 'npm' | 'yarn' | 'pnpm';
}

/**
 * Detect project type and configuration
 */
export async function detectProjectType(cwd: string): Promise<ProjectType> {
  const packageJsonPath = path.join(cwd, 'package.json');
  
  if (!await fs.pathExists(packageJsonPath)) {
    return {
      isNextJs: false,
      hasAppRouter: false,
      hasPagesRouter: false,
      isTypeScript: false,
      packageManager: 'npm',
    };
  }

  const packageJson = await fs.readJson(packageJsonPath);
  const isNextJs = !!packageJson.dependencies?.next || !!packageJson.devDependencies?.next;

  const hasAppRouter = await fs.pathExists(path.join(cwd, 'app')) || 
                       await fs.pathExists(path.join(cwd, 'src/app'));
  
  const hasPagesRouter = await fs.pathExists(path.join(cwd, 'pages')) || 
                         await fs.pathExists(path.join(cwd, 'src/pages'));

  const isTypeScript = await fs.pathExists(path.join(cwd, 'tsconfig.json'));

  // Detect package manager
  let packageManager: 'npm' | 'yarn' | 'pnpm' = 'npm';
  if (await fs.pathExists(path.join(cwd, 'yarn.lock'))) {
    packageManager = 'yarn';
  } else if (await fs.pathExists(path.join(cwd, 'pnpm-lock.yaml'))) {
    packageManager = 'pnpm';
  }

  return {
    isNextJs,
    hasAppRouter,
    hasPagesRouter,
    isTypeScript,
    packageManager,
  };
}

/**
 * Install dependencies
 */
export async function installDependencies(cwd: string): Promise<void> {
  const projectType = await detectProjectType(cwd);
  
  const packages = [
    '@chemmangat/msal-next',
    '@azure/msal-browser',
    '@azure/msal-react',
  ];

  const command = projectType.packageManager === 'yarn'
    ? `yarn add ${packages.join(' ')}`
    : projectType.packageManager === 'pnpm'
    ? `pnpm add ${packages.join(' ')}`
    : `npm install ${packages.join(' ')}`;

  await execAsync(command, { cwd });
}

/**
 * Create .env.local file
 */
export async function createEnvFile(
  cwd: string,
  clientId: string,
  tenantId: string
): Promise<void> {
  const envPath = path.join(cwd, '.env.local');
  
  const content = `# Azure AD Configuration
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=${clientId}
NEXT_PUBLIC_AZURE_AD_TENANT_ID=${tenantId}

# Optional: Redirect URI (defaults to window.location.origin)
# NEXT_PUBLIC_AZURE_AD_REDIRECT_URI=http://localhost:3000

# Optional: Default scopes
# NEXT_PUBLIC_AZURE_AD_SCOPES=User.Read,Mail.Read
`;

  await fs.writeFile(envPath, content, 'utf-8');
}

/**
 * Create layout file for App Router
 */
export async function createLayoutFile(
  cwd: string,
  language: 'typescript' | 'javascript'
): Promise<void> {
  const ext = language === 'typescript' ? 'tsx' : 'jsx';
  const appDir = await fs.pathExists(path.join(cwd, 'src/app'))
    ? path.join(cwd, 'src/app')
    : path.join(cwd, 'app');

  const layoutPath = path.join(appDir, `layout.${ext}`);

  // Check if layout already exists
  if (await fs.pathExists(layoutPath)) {
    // Read existing layout and check if MsalAuthProvider is already there
    const content = await fs.readFile(layoutPath, 'utf-8');
    if (content.includes('MsalAuthProvider')) {
      return; // Already configured
    }
  }

  const content = language === 'typescript' ? `import { MsalAuthProvider } from '@chemmangat/msal-next';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MsalAuthProvider
          clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
          tenantId={process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}
          enableLogging={process.env.NODE_ENV === 'development'}
        >
          {children}
        </MsalAuthProvider>
      </body>
    </html>
  );
}
` : `import { MsalAuthProvider } from '@chemmangat/msal-next';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MsalAuthProvider
          clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID}
          tenantId={process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}
          enableLogging={process.env.NODE_ENV === 'development'}
        >
          {children}
        </MsalAuthProvider>
      </body>
    </html>
  );
}
`;

  await fs.ensureDir(appDir);
  await fs.writeFile(layoutPath, content, 'utf-8');
}

/**
 * Create middleware file
 */
export async function createMiddlewareFile(
  cwd: string,
  language: 'typescript' | 'javascript'
): Promise<void> {
  const ext = language === 'typescript' ? 'ts' : 'js';
  const middlewarePath = path.join(cwd, `middleware.${ext}`);

  const content = `import { createAuthMiddleware } from '@chemmangat/msal-next';

export const middleware = createAuthMiddleware({
  protectedRoutes: ['/dashboard', '/profile', '/api/protected'],
  publicOnlyRoutes: ['/login'],
  loginPath: '/auth',
  debug: process.env.NODE_ENV === 'development',
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
`;

  await fs.writeFile(middlewarePath, content, 'utf-8');
}

/**
 * Create example authentication page
 */
export async function createExamplePage(
  cwd: string,
  router: 'app' | 'pages',
  language: 'typescript' | 'javascript'
): Promise<void> {
  const ext = language === 'typescript' ? 'tsx' : 'jsx';

  if (router === 'app') {
    const appDir = await fs.pathExists(path.join(cwd, 'src/app'))
      ? path.join(cwd, 'src/app')
      : path.join(cwd, 'app');

    const authDir = path.join(appDir, 'auth');
    const pagePath = path.join(authDir, `page.${ext}`);

    const content = `'use client';

import { MicrosoftSignInButton, SignOutButton, useMsalAuth, UserAvatar } from '@chemmangat/msal-next';

export default function AuthPage() {
  const { isAuthenticated, account } = useMsalAuth();

  if (isAuthenticated && account) {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Welcome!</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
          <UserAvatar size={64} />
          <div>
            <h2>{account.name}</h2>
            <p>{account.username}</p>
          </div>
        </div>
        <SignOutButton />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Sign In</h1>
      <p>Sign in with your Microsoft account to continue.</p>
      <div style={{ marginTop: '2rem' }}>
        <MicrosoftSignInButton />
      </div>
    </div>
  );
}
`;

    await fs.ensureDir(authDir);
    await fs.writeFile(pagePath, content, 'utf-8');
  }
}
