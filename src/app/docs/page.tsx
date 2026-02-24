'use client';

import { motion } from 'framer-motion';
import { Copy, Check, ChevronRight, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DocsPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState('installation');

  // Track scroll position to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'installation',
        'quickstart',
        'provider',
        'hook',
        'button',
        'advanced',
        'api',
        'changelog',
      ];

      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const copyToClipboard = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const sections = [
    { id: 'installation', label: 'Installation' },
    { id: 'quickstart', label: 'Quick Start' },
    { id: 'provider', label: 'MsalAuthProvider' },
    { id: 'hook', label: 'useMsalAuth Hook' },
    { id: 'button', label: 'Sign In Button' },
    { id: 'newcomponents', label: 'New Components (v2.0)' },
    { id: 'newhooks', label: 'New Hooks (v2.0)' },
    { id: 'advanced', label: 'Advanced Usage' },
    { id: 'api', label: 'API Reference' },
    { id: 'changelog', label: 'Changelog' },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Fixed Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-1">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-dark-text mb-2">Documentation</h2>
                <p className="text-sm text-dark-muted">@chemmangat/msal-next v1.2.1</p>
              </div>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                      activeSection === section.id
                        ? 'bg-accent-primary text-white'
                        : 'text-dark-muted hover:text-dark-text hover:bg-dark-elevated'
                    }`}
                  >
                    <span>{section.label}</span>
                    {activeSection === section.id && <ChevronRight className="w-4 h-4" />}
                  </button>
                ))}
              </nav>
              <div className="pt-6 mt-6 border-t border-dark-border">
                <a
                  href="/"
                  className="text-sm text-dark-muted hover:text-dark-text transition-colors flex items-center space-x-2"
                >
                  <span>← Back to Home</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-16"
            >
              {/* Installation */}
              <section id="installation">
                <h2 className="text-3xl font-bold text-dark-text mb-4">Installation</h2>
                <p className="text-dark-muted mb-6">
                  Install the package along with its peer dependencies. Supports both v3 and v4 of @azure/msal-browser.
                </p>
                <CodeBlock
                  title="Terminal"
                  code="npm install @chemmangat/msal-next @azure/msal-browser @azure/msal-react"
                  onCopy={() => copyToClipboard('npm install @chemmangat/msal-next @azure/msal-browser @azure/msal-react', 0)}
                  copied={copiedIndex === 0}
                />
              </section>

              {/* Quick Start */}
              <section id="quickstart">
                <h2 className="text-3xl font-bold text-dark-text mb-6">Quick Start</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-dark-text mb-3">1. Get Azure AD Credentials</h3>
                    <p className="text-dark-muted mb-4">
                      Register your app in{' '}
                      <a href="https://portal.azure.com" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline inline-flex items-center gap-1">
                        Azure Portal <ExternalLink className="w-3 h-3" />
                      </a>
                      {' '}and get your Client ID and Tenant ID.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-dark-text mb-3">2. Configure Environment</h3>
                    <CodeBlock
                      title=".env.local"
                      code={`NEXT_PUBLIC_CLIENT_ID=your-client-id\nNEXT_PUBLIC_TENANT_ID=your-tenant-id`}
                      onCopy={() => copyToClipboard('NEXT_PUBLIC_CLIENT_ID=your-client-id\nNEXT_PUBLIC_TENANT_ID=your-tenant-id', 1)}
                      copied={copiedIndex === 1}
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-dark-text mb-3">3. Wrap Your App</h3>
                    <CodeBlock
                      title="app/layout.tsx"
                      code={`import { MsalAuthProvider } from '@chemmangat/msal-next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MsalAuthProvider
          clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}
          tenantId={process.env.NEXT_PUBLIC_TENANT_ID}
        >
          {children}
        </MsalAuthProvider>
      </body>
    </html>
  );
}`}
                      onCopy={() => copyToClipboard(`import { MsalAuthProvider } from '@chemmangat/msal-next';\n\nexport default function RootLayout({ children }) {\n  return (\n    <html>\n      <body>\n        <MsalAuthProvider\n          clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}\n          tenantId={process.env.NEXT_PUBLIC_TENANT_ID}\n        >\n          {children}\n        </MsalAuthProvider>\n      </body>\n    </html>\n  );\n}`, 2)}
                      copied={copiedIndex === 2}
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-dark-text mb-3">4. Use the Hook</h3>
                    <CodeBlock
                      title="app/page.tsx"
                      code={`'use client';

import { useMsalAuth } from '@chemmangat/msal-next';

export default function Home() {
  const { isAuthenticated, account, loginPopup, logoutPopup } = useMsalAuth();

  if (!isAuthenticated) {
    return <button onClick={() => loginPopup()}>Sign In</button>;
  }

  return (
    <div>
      <h1>Hello, {account?.name}!</h1>
      <button onClick={() => logoutPopup()}>Sign Out</button>
    </div>
  );
}`}
                      onCopy={() => copyToClipboard(`'use client';\n\nimport { useMsalAuth } from '@chemmangat/msal-next';\n\nexport default function Home() {\n  const { isAuthenticated, account, loginPopup, logoutPopup } = useMsalAuth();\n\n  if (!isAuthenticated) {\n    return <button onClick={() => loginPopup()}>Sign In</button>;\n  }\n\n  return (\n    <div>\n      <h1>Hello, {account?.name}!</h1>\n      <button onClick={() => logoutPopup()}>Sign Out</button>\n    </div>\n  );\n}`, 3)}
                      copied={copiedIndex === 3}
                    />
                  </div>
                </div>
              </section>

              {/* Provider */}
              <section id="provider">
                <h2 className="text-3xl font-bold text-dark-text mb-6">MsalAuthProvider</h2>
                <p className="text-dark-muted mb-6">
                  The main provider component that initializes MSAL and wraps your application. Safe for SSR/SSG.
                </p>
                
                <div className="bg-dark-elevated border border-dark-border rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-dark-text mb-4">Props</h3>
                  <div className="space-y-4">
                    <PropDoc name="clientId" type="string" required>
                      Azure AD Application (client) ID
                    </PropDoc>
                    <PropDoc name="tenantId" type="string">
                      Azure AD Directory (tenant) ID (optional for multi-tenant)
                    </PropDoc>
                    <PropDoc name="authorityType" type="'common' | 'organizations' | 'consumers' | 'tenant'" defaultValue="'common'">
                      Authority type for authentication
                    </PropDoc>
                    <PropDoc name="scopes" type="string[]" defaultValue="['User.Read']">
                      Default scopes for authentication
                    </PropDoc>
                    <PropDoc name="cacheLocation" type="'sessionStorage' | 'localStorage' | 'memoryStorage'" defaultValue="'sessionStorage'">
                      Token cache location
                    </PropDoc>
                    <PropDoc name="enableLogging" type="boolean" defaultValue="false">
                      Enable debug logging (errors always log)
                    </PropDoc>
                    <PropDoc name="loadingComponent" type="ReactNode">
                      Custom loading component during initialization
                    </PropDoc>
                    <PropDoc name="onInitialized" type="(instance: IPublicClientApplication) => void" badge="New in v1.2">
                      Callback after MSAL initialization completes
                    </PropDoc>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-dark-text mb-3">Example with onInitialized</h3>
                  <CodeBlock
                    title="app/layout.tsx"
                    code={`import { MsalAuthProvider } from '@chemmangat/msal-next';
import { setupAxiosInterceptors } from '@/lib/axios';

export default function RootLayout({ children }) {
  return (
    <MsalAuthProvider
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}
      onInitialized={(instance) => {
        // Set up Axios interceptors with MSAL instance
        setupAxiosInterceptors(instance);
      }}
    >
      {children}
    </MsalAuthProvider>
  );
}`}
                    onCopy={() => copyToClipboard(`import { MsalAuthProvider } from '@chemmangat/msal-next';\nimport { setupAxiosInterceptors } from '@/lib/axios';\n\nexport default function RootLayout({ children }) {\n  return (\n    <MsalAuthProvider\n      clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}\n      onInitialized={(instance) => {\n        setupAxiosInterceptors(instance);\n      }}\n    >\n      {children}\n    </MsalAuthProvider>\n  );\n}`, 4)}
                    copied={copiedIndex === 4}
                  />
                </div>
              </section>

              {/* Hook */}
              <section id="hook">
                <h2 className="text-3xl font-bold text-dark-text mb-6">useMsalAuth Hook</h2>
                <p className="text-dark-muted mb-6">
                  The main hook for authentication operations in your components.
                </p>

                <div className="bg-dark-elevated border border-dark-border rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-dark-text mb-4">Return Values</h3>
                  <div className="space-y-4">
                    <PropDoc name="isAuthenticated" type="boolean">
                      Whether user is authenticated
                    </PropDoc>
                    <PropDoc name="account" type="AccountInfo | null">
                      Current authenticated account
                    </PropDoc>
                    <PropDoc name="accounts" type="AccountInfo[]">
                      All accounts in cache
                    </PropDoc>
                    <PropDoc name="inProgress" type="boolean">
                      Whether MSAL is performing an interaction
                    </PropDoc>
                    <PropDoc name="loginPopup" type="(scopes?: string[]) => Promise<void>">
                      Login using popup
                    </PropDoc>
                    <PropDoc name="loginRedirect" type="(scopes?: string[]) => Promise<void>">
                      Login using redirect
                    </PropDoc>
                    <PropDoc name="logoutPopup" type="() => Promise<void>">
                      Logout using popup
                    </PropDoc>
                    <PropDoc name="logoutRedirect" type="() => Promise<void>">
                      Logout using redirect
                    </PropDoc>
                    <PropDoc name="acquireToken" type="(scopes: string[]) => Promise<string>">
                      Acquire token silently with popup fallback
                    </PropDoc>
                    <PropDoc name="acquireTokenSilent" type="(scopes: string[]) => Promise<string>">
                      Acquire token silently only (no fallback)
                    </PropDoc>
                    <PropDoc name="acquireTokenPopup" type="(scopes: string[]) => Promise<string>">
                      Acquire token using popup
                    </PropDoc>
                    <PropDoc name="acquireTokenRedirect" type="(scopes: string[]) => Promise<void>">
                      Acquire token using redirect
                    </PropDoc>
                    <PropDoc name="clearSession" type="() => Promise<void>" badge="New in v1.2">
                      Clear MSAL cache without Microsoft logout
                    </PropDoc>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-dark-text mb-3">Example: Calling Protected APIs</h3>
                  <CodeBlock
                    title="Example"
                    code={`const { acquireToken } = useMsalAuth();

const fetchUserProfile = async () => {
  const token = await acquireToken(['User.Read']);
  
  const response = await fetch('https://graph.microsoft.com/v1.0/me', {
    headers: { Authorization: \`Bearer \${token}\` }
  });
  
  return response.json();
};`}
                    onCopy={() => copyToClipboard(`const { acquireToken } = useMsalAuth();\n\nconst fetchUserProfile = async () => {\n  const token = await acquireToken(['User.Read']);\n  \n  const response = await fetch('https://graph.microsoft.com/v1.0/me', {\n    headers: { Authorization: \`Bearer \${token}\` }\n  });\n  \n  return response.json();\n};`, 5)}
                    copied={copiedIndex === 5}
                  />
                </div>
              </section>

              {/* Button */}
              <section id="button">
                <h2 className="text-3xl font-bold text-dark-text mb-6">MicrosoftSignInButton</h2>
                <p className="text-dark-muted mb-6">
                  Pre-built button component with official Microsoft branding.
                </p>

                <div className="bg-dark-elevated border border-dark-border rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-dark-text mb-4">Props</h3>
                  <div className="space-y-4">
                    <PropDoc name="variant" type="'dark' | 'light'" defaultValue="'dark'">
                      Button color variant
                    </PropDoc>
                    <PropDoc name="size" type="'small' | 'medium' | 'large'" defaultValue="'medium'">
                      Button size
                    </PropDoc>
                    <PropDoc name="text" type="string" defaultValue="'Sign in with Microsoft'">
                      Button text
                    </PropDoc>
                    <PropDoc name="useRedirect" type="boolean" defaultValue="false">
                      Use redirect flow instead of popup
                    </PropDoc>
                    <PropDoc name="scopes" type="string[]">
                      Scopes to request (uses provider scopes if not specified)
                    </PropDoc>
                    <PropDoc name="onSuccess" type="() => void">
                      Callback on successful login
                    </PropDoc>
                    <PropDoc name="onError" type="(error: Error) => void">
                      Callback on error
                    </PropDoc>
                  </div>
                </div>

                <CodeBlock
                  title="Example"
                  code={`import { MicrosoftSignInButton } from '@chemmangat/msal-next';

<MicrosoftSignInButton
  variant="dark"
  size="medium"
  onSuccess={() => console.log('Login successful!')}
  onError={(error) => console.error('Login failed:', error)}
/>`}
                  onCopy={() => copyToClipboard(`import { MicrosoftSignInButton } from '@chemmangat/msal-next';\n\n<MicrosoftSignInButton\n  variant="dark"\n  size="medium"\n  onSuccess={() => console.log('Login successful!')}\n  onError={(error) => console.error('Login failed:', error)}\n/>`, 6)}
                  copied={copiedIndex === 6}
                />
              </section>

              {/* Advanced Usage */}
              <section id="advanced">
                <h2 className="text-3xl font-bold text-dark-text mb-6">Advanced Usage</h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-dark-text mb-3">
                      <span className="inline-flex items-center gap-2">
                        getMsalInstance()
                        <span className="text-xs px-2 py-1 bg-accent-primary/20 text-accent-primary rounded">New in v1.2</span>
                      </span>
                    </h3>
                    <p className="text-dark-muted mb-4">
                      Access the MSAL instance outside React components (API clients, middleware, etc.)
                    </p>
                    <CodeBlock
                      title="lib/api-client.ts"
                      code={`import { getMsalInstance } from '@chemmangat/msal-next';

export async function fetchUserData() {
  const instance = getMsalInstance();
  if (!instance) throw new Error('MSAL not initialized');

  const accounts = instance.getAllAccounts();
  if (accounts.length === 0) throw new Error('No authenticated user');

  const response = await instance.acquireTokenSilent({
    scopes: ['User.Read'],
    account: accounts[0],
  });

  return fetch('/api/user', {
    headers: { Authorization: \`Bearer \${response.accessToken}\` },
  });
}`}
                      onCopy={() => copyToClipboard(`import { getMsalInstance } from '@chemmangat/msal-next';\n\nexport async function fetchUserData() {\n  const instance = getMsalInstance();\n  if (!instance) throw new Error('MSAL not initialized');\n\n  const accounts = instance.getAllAccounts();\n  if (accounts.length === 0) throw new Error('No authenticated user');\n\n  const response = await instance.acquireTokenSilent({\n    scopes: ['User.Read'],\n    account: accounts[0],\n  });\n\n  return fetch('/api/user', {\n    headers: { Authorization: \`Bearer \${response.accessToken}\` },\n  });\n}`, 7)}
                      copied={copiedIndex === 7}
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-dark-text mb-3">
                      <span className="inline-flex items-center gap-2">
                        Axios Interceptors with onInitialized
                        <span className="text-xs px-2 py-1 bg-accent-primary/20 text-accent-primary rounded">New in v1.2</span>
                      </span>
                    </h3>
                    <p className="text-dark-muted mb-4">
                      Set up automatic token injection for all API calls
                    </p>
                    <CodeBlock
                      title="lib/axios.ts"
                      code={`import axios from 'axios';
import { IPublicClientApplication } from '@azure/msal-browser';

export function setupAxiosInterceptors(msalInstance: IPublicClientApplication) {
  axios.interceptors.request.use(async (config) => {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      try {
        const response = await msalInstance.acquireTokenSilent({
          scopes: ['User.Read'],
          account: accounts[0],
        });
        config.headers.Authorization = \`Bearer \${response.accessToken}\`;
      } catch (error) {
        console.error('Token acquisition failed:', error);
      }
    }
    return config;
  });
}`}
                      onCopy={() => copyToClipboard(`import axios from 'axios';\nimport { IPublicClientApplication } from '@azure/msal-browser';\n\nexport function setupAxiosInterceptors(msalInstance: IPublicClientApplication) {\n  axios.interceptors.request.use(async (config) => {\n    const accounts = msalInstance.getAllAccounts();\n    if (accounts.length > 0) {\n      try {\n        const response = await msalInstance.acquireTokenSilent({\n          scopes: ['User.Read'],\n          account: accounts[0],\n        });\n        config.headers.Authorization = \`Bearer \${response.accessToken}\`;\n      } catch (error) {\n        console.error('Token acquisition failed:', error);\n      }\n    }\n    return config;\n  });\n}`, 8)}
                      copied={copiedIndex === 8}
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-dark-text mb-3">
                      <span className="inline-flex items-center gap-2">
                        Silent Logout with clearSession()
                        <span className="text-xs px-2 py-1 bg-accent-primary/20 text-accent-primary rounded">New in v1.2</span>
                      </span>
                    </h3>
                    <p className="text-dark-muted mb-4">
                      Clear MSAL cache without redirecting to Microsoft logout (useful for backend-managed logout)
                    </p>
                    <CodeBlock
                      title="Example"
                      code={`const { clearSession } = useMsalAuth();

const handleLogout = async () => {
  // Call your backend logout API
  await fetch('/api/logout', { method: 'POST' });
  
  // Clear local MSAL cache without Microsoft redirect
  await clearSession();
  
  // Redirect to home
  window.location.href = '/';
};`}
                      onCopy={() => copyToClipboard(`const { clearSession } = useMsalAuth();\n\nconst handleLogout = async () => {\n  await fetch('/api/logout', { method: 'POST' });\n  await clearSession();\n  window.location.href = '/';\n};`, 9)}
                      copied={copiedIndex === 9}
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-dark-text mb-3">SSR/SSG Support</h3>
                    <p className="text-dark-muted mb-4">
                      The package is safe to use in server-rendered pages. MsalAuthProvider automatically detects SSR and skips initialization on the server.
                    </p>
                    <div className="bg-accent-success/10 border border-accent-success/30 rounded-xl p-4">
                      <p className="text-sm text-dark-text">
                        ✓ Works seamlessly with Next.js App Router SSR and SSG
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* API Reference */}
              <section id="api">
                <h2 className="text-3xl font-bold text-dark-text mb-6">API Reference</h2>
                
                <div className="space-y-6">
                  <div className="bg-dark-elevated border border-dark-border rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-dark-text mb-4">Exports</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <code className="text-accent-primary">MsalAuthProvider</code>
                        <span className="text-dark-muted">- Main provider component</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <code className="text-accent-primary">useMsalAuth</code>
                        <span className="text-dark-muted">- Authentication hook</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <code className="text-accent-primary">MicrosoftSignInButton</code>
                        <span className="text-dark-muted">- Pre-built sign-in button</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <code className="text-accent-primary">getMsalInstance</code>
                        <span className="text-dark-muted">- Get MSAL instance (v1.2+)</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <code className="text-accent-primary">UseMsalAuthReturn</code>
                        <span className="text-dark-muted">- TypeScript type for hook return</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <code className="text-accent-primary">MsalAuthConfig</code>
                        <span className="text-dark-muted">- TypeScript type for config</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-dark-elevated border border-dark-border rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-dark-text mb-4">Re-exported from @azure/msal-react</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <code className="text-accent-primary">useMsal</code>
                        <span className="text-dark-muted">- Access raw MSAL instance</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <code className="text-accent-primary">useIsAuthenticated</code>
                        <span className="text-dark-muted">- Check authentication status</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <code className="text-accent-primary">useAccount</code>
                        <span className="text-dark-muted">- Get account info</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Changelog */}
              <section id="changelog">
                <h2 className="text-3xl font-bold text-dark-text mb-6">Changelog</h2>
                
                <div className="space-y-8">
                  {/* v1.2.0 */}
                  <div className="border-l-4 border-accent-primary pl-6">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-dark-text">v1.2.0</h3>
                      <span className="text-sm px-3 py-1 bg-accent-primary/20 text-accent-primary rounded-full">Latest</span>
                      <span className="text-sm text-dark-muted">February 23, 2024</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-accent-success mb-2">✨ Added</h4>
                        <ul className="space-y-2 text-sm text-dark-muted">
                          <li className="flex items-start gap-2">
                            <span className="text-accent-success mt-1">•</span>
                            <span><code className="text-accent-primary">onInitialized</code> callback - Access MSAL instance after initialization for setting up interceptors</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-accent-success mt-1">•</span>
                            <span><code className="text-accent-primary">getMsalInstance()</code> utility - Access MSAL instance outside React components (API clients, middleware)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-accent-success mt-1">•</span>
                            <span><code className="text-accent-primary">clearSession()</code> method - Clear MSAL cache without triggering Microsoft logout redirect</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-accent-success mt-1">•</span>
                            <span>SSR safety guards - Automatic detection and handling of server-side rendering</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-accent-success mt-1">•</span>
                            <span><code className="text-accent-primary">UseMsalAuthReturn</code> type export - Type interface for hook return value</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-accent-primary mb-2">🔄 Changed</h4>
                        <ul className="space-y-2 text-sm text-dark-muted">
                          <li className="flex items-start gap-2">
                            <span className="text-accent-primary mt-1">•</span>
                            <span>Peer dependencies - Now supports both v3 and v4 of <code className="text-accent-primary">@azure/msal-browser</code> and v2/v3 of <code className="text-accent-primary">@azure/msal-react</code></span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-accent-primary mt-1">•</span>
                            <span>Logging behavior - Console logs now respect <code className="text-accent-primary">enableLogging</code> config (errors always log)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-accent-primary mt-1">•</span>
                            <span>Enhanced README with advanced usage examples (Axios interceptors, API clients, silent logout)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-accent-primary mt-1">•</span>
                            <span>Improved TypeScript type exports</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* v1.1.0 */}
                  <div className="border-l-4 border-dark-border pl-6">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-dark-text">v1.1.0</h3>
                      <span className="text-sm text-dark-muted">February 18, 2024</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-accent-success mb-2">✨ Added</h4>
                        <ul className="space-y-2 text-sm text-dark-muted">
                          <li className="flex items-start gap-2">
                            <span className="text-accent-success mt-1">•</span>
                            <span><code className="text-accent-primary">MicrosoftSignInButton</code> component with official Microsoft branding</span>
                          </li>
                          <li className="flex items-start gap-2 ml-6">
                            <span className="text-dark-muted">-</span>
                            <span>Dark and light variants</span>
                          </li>
                          <li className="flex items-start gap-2 ml-6">
                            <span className="text-dark-muted">-</span>
                            <span>Three size options (small, medium, large)</span>
                          </li>
                          <li className="flex items-start gap-2 ml-6">
                            <span className="text-dark-muted">-</span>
                            <span>Popup and redirect flow support</span>
                          </li>
                          <li className="flex items-start gap-2 ml-6">
                            <span className="text-dark-muted">-</span>
                            <span>Custom scopes support</span>
                          </li>
                          <li className="flex items-start gap-2 ml-6">
                            <span className="text-dark-muted">-</span>
                            <span>Success/error callbacks</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-accent-primary mb-2">🔄 Changed</h4>
                        <ul className="space-y-2 text-sm text-dark-muted">
                          <li className="flex items-start gap-2">
                            <span className="text-accent-primary mt-1">•</span>
                            <span>Improved TypeScript type exports</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-accent-primary mt-1">•</span>
                            <span>Enhanced documentation with button component examples</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* v1.0.0 */}
                  <div className="border-l-4 border-dark-border pl-6">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-dark-text">v1.0.0</h3>
                      <span className="text-sm text-dark-muted">February 18, 2024</span>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-accent-success mb-2">✨ Initial Release</h4>
                      <ul className="space-y-2 text-sm text-dark-muted">
                        <li className="flex items-start gap-2">
                          <span className="text-accent-success mt-1">•</span>
                          <span><code className="text-accent-primary">MsalAuthProvider</code> component for Next.js App Router</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent-success mt-1">•</span>
                          <span><code className="text-accent-primary">useMsalAuth</code> hook with comprehensive authentication methods</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent-success mt-1">•</span>
                          <span>Support for popup and redirect authentication flows</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent-success mt-1">•</span>
                          <span>Automatic token acquisition with silent refresh</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent-success mt-1">•</span>
                          <span>Multi-tenant and single-tenant authentication support</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent-success mt-1">•</span>
                          <span>Configurable cache location (sessionStorage, localStorage, memoryStorage)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent-success mt-1">•</span>
                          <span>Custom loading component support</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent-success mt-1">•</span>
                          <span>Debug logging support</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent-success mt-1">•</span>
                          <span>TypeScript support with full type definitions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent-success mt-1">•</span>
                          <span>Comprehensive documentation and examples</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function CodeBlock({ title, code, onCopy, copied }: { title: string; code: string; onCopy: () => void; copied: boolean }) {
  return (
    <div className="bg-dark-elevated border border-dark-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b border-dark-border">
        <span className="text-sm text-dark-muted">{title}</span>
        <button onClick={onCopy} className="p-2 hover:bg-dark-border rounded-lg transition-colors">
          {copied ? <Check className="w-4 h-4 text-accent-success" /> : <Copy className="w-4 h-4 text-dark-muted" />}
        </button>
      </div>
      <div className="p-6 overflow-x-auto">
        <pre className="text-sm">
          <code className="text-dark-text">{code}</code>
        </pre>
      </div>
    </div>
  );
}

function PropDoc({
  name,
  type,
  required,
  defaultValue,
  badge,
  children,
}: {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-sm border-b border-dark-border pb-4 last:border-0 last:pb-0">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <code className="text-accent-primary font-semibold">{name}</code>
        <span className="text-dark-muted">: {type}</span>
        {required && <span className="text-red-400 text-xs px-2 py-0.5 bg-red-400/10 rounded">required</span>}
        {defaultValue && <span className="text-dark-muted text-xs px-2 py-0.5 bg-dark-border rounded">default: {defaultValue}</span>}
        {badge && <span className="text-xs px-2 py-0.5 bg-accent-primary/20 text-accent-primary rounded">{badge}</span>}
      </div>
      <p className="text-dark-muted">{children}</p>
    </div>
  );
}
