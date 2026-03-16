import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { detectProjectType, installDependencies } from '../utils/index.js';

export interface InitOptions {
  yes?: boolean;
  appRouter?: boolean;
  pagesRouter?: boolean;
  typescript?: boolean;
  javascript?: boolean;
}

export async function initCommand(options: InitOptions) {
  console.log(chalk.blue.bold('\n🚀 Welcome to @chemmangat/msal-next setup!\n'));

  const cwd = process.cwd();
  const projectType = await detectProjectType(cwd);

  if (!projectType.isNextJs) {
    console.log(chalk.red('❌ This doesn\'t appear to be a Next.js project.'));
    console.log(chalk.yellow('Please run this command in a Next.js project directory.'));
    process.exit(1);
  }

  let config: {
    router: 'app' | 'pages';
    language: 'typescript' | 'javascript';
    clientId: string;
    tenantId: string;
    authorityType: 'common' | 'organizations' | 'consumers' | 'tenant';
    cacheLocation: 'sessionStorage' | 'localStorage' | 'memoryStorage';
    installDeps: boolean;
    createExample: boolean;
  };

  if (options.yes) {
    config = {
      router: 'app',
      language: 'typescript',
      clientId: 'YOUR_CLIENT_ID',
      tenantId: 'common',
      authorityType: 'common',
      cacheLocation: 'sessionStorage',
      installDeps: true,
      createExample: true,
    };
  } else {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'router',
        message: 'Which router are you using?',
        choices: [
          { name: 'App Router (Next.js 13+)', value: 'app' },
          { name: 'Pages Router', value: 'pages' },
        ],
        default: projectType.hasAppRouter ? 'app' : 'pages',
      },
      {
        type: 'list',
        name: 'language',
        message: 'Which language are you using?',
        choices: [
          { name: 'TypeScript', value: 'typescript' },
          { name: 'JavaScript', value: 'javascript' },
        ],
        default: projectType.isTypeScript ? 'typescript' : 'javascript',
      },
      {
        type: 'input',
        name: 'clientId',
        message: 'Azure AD Client ID (leave empty to configure later):',
        default: '',
      },
      {
        type: 'input',
        name: 'tenantId',
        message: 'Azure AD Tenant ID (or "common" for multi-tenant):',
        default: 'common',
      },
      {
        type: 'list',
        name: 'authorityType',
        message: 'Authority type:',
        choices: [
          { name: 'common — multi-tenant (any Azure AD + personal accounts)', value: 'common' },
          { name: 'organizations — any organizational Azure AD tenant', value: 'organizations' },
          { name: 'consumers — Microsoft personal accounts only', value: 'consumers' },
          { name: 'tenant — single-tenant (uses your Tenant ID)', value: 'tenant' },
        ],
        default: 'common',
      },
      {
        type: 'list',
        name: 'cacheLocation',
        message: 'Token cache location:',
        choices: [
          { name: 'sessionStorage — cleared when tab closes (recommended)', value: 'sessionStorage' },
          { name: 'localStorage — persists across sessions', value: 'localStorage' },
          { name: 'memoryStorage — most secure, lost on refresh', value: 'memoryStorage' },
        ],
        default: 'sessionStorage',
      },
      {
        type: 'confirm',
        name: 'installDeps',
        message: 'Install dependencies now?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'createExample',
        message: 'Create example authentication page?',
        default: true,
      },
    ]);

    config = {
      ...answers,
      clientId: (answers.clientId as string) || 'YOUR_CLIENT_ID',
    } as typeof config;
  }

  console.log(chalk.blue('\n📦 Setting up your project...\n'));

  if (config.installDeps) {
    const spinner = ora('Installing dependencies...').start();
    try {
      await installDependencies(cwd);
      spinner.succeed('Dependencies installed');
    } catch (error) {
      spinner.fail('Failed to install dependencies');
      console.log(chalk.yellow('You can install them manually with:'));
      console.log(chalk.cyan('npm install @chemmangat/msal-next @azure/msal-browser @azure/msal-react'));
    }
  }

  const spinner1 = ora('Creating .env.local file...').start();
  try {
    await createEnvFile(cwd, config.clientId, config.tenantId, config.cacheLocation);
    spinner1.succeed('.env.local created');
  } catch (error) {
    spinner1.fail('Failed to create .env.local');
  }

  if (config.router === 'app') {
    const spinner2 = ora('Updating layout file with MSALProvider...').start();
    try {
      await updateLayoutFile(cwd, config.language, config.authorityType, config.cacheLocation);
      spinner2.succeed('layout.tsx updated with MSALProvider');
    } catch (error) {
      spinner2.fail('Failed to update layout file');
    }
  }

  if (config.createExample) {
    const spinner3 = ora('Creating starter page.tsx...').start();
    try {
      await createStarterPage(cwd, config.router, config.language);
      spinner3.succeed('Starter page created at app/auth/page.tsx');
    } catch (error) {
      spinner3.fail('Failed to create starter page');
    }
  }

  console.log(chalk.green.bold('\n✅ Setup complete!\n'));
  console.log(chalk.blue.bold('Next steps:\n'));
  console.log(chalk.white('1. Update .env.local with your Azure AD credentials'));
  console.log(chalk.white('2. Start your development server: npm run dev'));
  console.log(chalk.white('3. Visit http://localhost:3000/auth to test authentication\n'));
  console.log(chalk.gray('Need help? Visit: https://github.com/chemmangat/msal-next\n'));
}

async function createEnvFile(
  cwd: string,
  clientId: string,
  tenantId: string,
  cacheLocation: string
): Promise<void> {
  const envPath = path.join(cwd, '.env.local');
  const content = `# Azure AD Configuration — generated by @chemmangat/msal-next init
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=${clientId}
NEXT_PUBLIC_AZURE_AD_TENANT_ID=${tenantId}
NEXT_PUBLIC_AZURE_AD_CACHE_LOCATION=${cacheLocation}

# Optional: Redirect URI (defaults to window.location.origin)
# NEXT_PUBLIC_AZURE_AD_REDIRECT_URI=http://localhost:3000

# Optional: Default scopes
# NEXT_PUBLIC_AZURE_AD_SCOPES=User.Read,Mail.Read
`;
  await fs.writeFile(envPath, content, 'utf-8');
}

async function updateLayoutFile(
  cwd: string,
  language: 'typescript' | 'javascript',
  authorityType: string,
  cacheLocation: string
): Promise<void> {
  const ext = language === 'typescript' ? 'tsx' : 'jsx';
  const appDir = (await fs.pathExists(path.join(cwd, 'src/app')))
    ? path.join(cwd, 'src/app')
    : path.join(cwd, 'app');

  const layoutPath = path.join(appDir, `layout.${ext}`);

  if (await fs.pathExists(layoutPath)) {
    const existing = await fs.readFile(layoutPath, 'utf-8');
    if (existing.includes('MSALProvider') || existing.includes('MsalAuthProvider')) {
      return; // already configured
    }
    const wrapped = wrapWithProvider(existing, authorityType, cacheLocation);
    await fs.writeFile(layoutPath, wrapped, 'utf-8');
    return;
  }

  const providerProps = `clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID${language === 'typescript' ? '!' : ''}}
          tenantId={process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}
          authorityType="${authorityType}"
          cacheLocation="${cacheLocation}"
          enableLogging={process.env.NODE_ENV === 'development'}`;

  const childrenType = language === 'typescript' ? `{
  children,
}: {
  children: React.ReactNode;
}` : '{ children }';

  const content = `import { MSALProvider } from '@chemmangat/msal-next';
import './globals.css';

export default function RootLayout(${childrenType}) {
  return (
    <html lang="en">
      <body>
        <MSALProvider
          ${providerProps}
        >
          {children}
        </MSALProvider>
      </body>
    </html>
  );
}
`;

  await fs.ensureDir(appDir);
  await fs.writeFile(layoutPath, content, 'utf-8');
}

function wrapWithProvider(source: string, authorityType: string, cacheLocation: string): string {
  let result = source;
  if (!result.includes('@chemmangat/msal-next')) {
    result = `import { MSALProvider } from '@chemmangat/msal-next';\n` + result;
  }
  result = result.replace(
    /\{children\}/g,
    `<MSALProvider
          clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
          tenantId={process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}
          authorityType="${authorityType}"
          cacheLocation="${cacheLocation}"
          enableLogging={process.env.NODE_ENV === 'development'}
        >
          {children}
        </MSALProvider>`
  );
  return result;
}

async function createStarterPage(
  cwd: string,
  router: 'app' | 'pages',
  language: 'typescript' | 'javascript'
): Promise<void> {
  const ext = language === 'typescript' ? 'tsx' : 'jsx';

  const pageContent = `'use client';

import { useMsalAuth, MicrosoftSignInButton, SignOutButton, UserAvatar } from '@chemmangat/msal-next';

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
            <p style={{ color: '#6b7280' }}>{account.username}</p>
          </div>
        </div>
        <SignOutButton />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Sign In</h1>
      <p style={{ color: '#6b7280' }}>Sign in with your Microsoft account to continue.</p>
      <div style={{ marginTop: '2rem' }}>
        <MicrosoftSignInButton />
      </div>
    </div>
  );
}
`;

  if (router === 'app') {
    const appDir = (await fs.pathExists(path.join(cwd, 'src/app')))
      ? path.join(cwd, 'src/app')
      : path.join(cwd, 'app');
    const authDir = path.join(appDir, 'auth');
    await fs.ensureDir(authDir);
    await fs.writeFile(path.join(authDir, `page.${ext}`), pageContent, 'utf-8');
  } else {
    const pagesDir = (await fs.pathExists(path.join(cwd, 'src/pages')))
      ? path.join(cwd, 'src/pages')
      : path.join(cwd, 'pages');
    await fs.ensureDir(pagesDir);
    await fs.writeFile(path.join(pagesDir, `auth.${ext}`), pageContent, 'utf-8');
  }
}
