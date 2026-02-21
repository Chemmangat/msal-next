'use client';

import { motion } from 'framer-motion';
import { Copy, Check, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function DocsPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState('installation');

  const copyToClipboard = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const sections = [
    { id: 'installation', label: 'Installation' },
    { id: 'setup', label: 'Setup' },
    { id: 'usage', label: 'Usage' },
    { id: 'button', label: 'Sign In Button' },
    { id: 'api', label: 'API Reference' },
    { id: 'advanced', label: 'Advanced Usage' },
    { id: 'azure', label: 'Azure AD Setup' },
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
                <p className="text-sm text-dark-muted">Complete guide for @chemmangat/msal-next</p>
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
                <h2 className="text-2xl font-bold text-dark-text mb-4">Installation</h2>
                <div className="bg-dark-elevated border border-dark-border rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-3 border-b border-dark-border">
                    <span className="text-sm text-dark-muted">Terminal</span>
                    <button
                      onClick={() => copyToClipboard('npm install @chemmangat/msal-next @azure/msal-browser @azure/msal-react', 0)}
                      className="p-2 hover:bg-dark-border rounded-lg transition-colors"
                    >
                      {copiedIndex === 0 ? (
                        <Check className="w-4 h-4 text-accent-success" />
                      ) : (
                        <Copy className="w-4 h-4 text-dark-muted" />
                      )}
                    </button>
                  </div>
                  <div className="p-6">
                    <code className="text-accent-primary text-sm">
                      npm install @chemmangat/msal-next @azure/msal-browser @azure/msal-react
                    </code>
                  </div>
                </div>
              </section>

              {/* Setup */}
              <section id="setup">
                <h2 className="text-2xl font-bold text-dark-text mb-6">Setup</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-dark-text mb-3">1. Configure Environment Variables</h3>
                    <p className="text-dark-muted mb-4 text-sm">
                      Create a <code className="text-accent-primary">.env.local</code> file:
                    </p>
                    <CodeBlock
                      title=".env.local"
                      code={`NEXT_PUBLIC_CLIENT_ID=your-client-id\nNEXT_PUBLIC_TENANT_ID=your-tenant-id`}
                      onCopy={() => copyToClipboard('NEXT_PUBLIC_CLIENT_ID=your-client-id\nNEXT_PUBLIC_TENANT_ID=your-tenant-id', 1)}
                      copied={copiedIndex === 1}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-dark-text mb-3">2. Wrap Your App</h3>
                    <p className="text-dark-muted mb-4 text-sm">
                      Add the provider to your root layout:
                    </p>
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
          scopes={['User.Read']}
        >
          {children}
        </MsalAuthProvider>
      </body>
    </html>
  );
}`}
                      onCopy={() => copyToClipboard(`import { MsalAuthProvider } from '@chemmangat/msal-next';\n\nexport default function RootLayout({ children }) {\n  return (\n    <html>\n      <body>\n        <MsalAuthProvider\n          clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}\n          tenantId={process.env.NEXT_PUBLIC_TENANT_ID}\n          scopes={['User.Read']}\n        >\n          {children}\n        </MsalAuthProvider>\n      </body>\n    </html>\n  );\n}`, 2)}
                      copied={copiedIndex === 2}
                    />
                  </div>
                </div>
              </section>

              {/* Usage */}
              <section id="usage">
                <h2 className="text-2xl font-bold text-dark-text mb-6">Usage</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-dark-text mb-3">Using the Hook</h3>
                    <p className="text-dark-muted mb-4 text-sm">
                      Use the <code className="text-accent-primary">useMsalAuth</code> hook in your components:
                    </p>
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

              {/* Button Component */}
              <section id="button">
                <h2 className="text-2xl font-bold text-dark-text mb-6">Sign In Button Component</h2>
                <p className="text-dark-muted mb-6 text-sm">
                  Use our pre-built button with official Microsoft branding:
                </p>
                <CodeBlock
                  title="app/page.tsx"
                  code={`'use client';

import { MicrosoftSignInButton, useMsalAuth } from '@chemmangat/msal-next';

export default function Home() {
  const { isAuthenticated, account, logoutPopup } = useMsalAuth();

  if (!isAuthenticated) {
    return (
      <MicrosoftSignInButton
        variant="dark"
        size="medium"
        onSuccess={() => console.log('Login successful!')}
      />
    );
  }

  return (
    <div>
      <h1>Hello, {account?.name}!</h1>
      <button onClick={() => logoutPopup()}>Sign Out</button>
    </div>
  );
}`}
                  onCopy={() => copyToClipboard(`'use client';\n\nimport { MicrosoftSignInButton, useMsalAuth } from '@chemmangat/msal-next';\n\nexport default function Home() {\n  const { isAuthenticated, account, logoutPopup } = useMsalAuth();\n\n  if (!isAuthenticated) {\n    return (\n      <MicrosoftSignInButton\n        variant="dark"\n        size="medium"\n        onSuccess={() => console.log('Login successful!')}\n      />\n    );\n  }\n\n  return (\n    <div>\n      <h1>Hello, {account?.name}!</h1>\n      <button onClick={() => logoutPopup()}>Sign Out</button>\n    </div>\n  );\n}`, 4)}
                  copied={copiedIndex === 4}
                />
              </section>

              {/* API Reference */}
              <section id="api">
                <h2 className="text-2xl font-bold text-dark-text mb-6">API Reference</h2>
                <div className="space-y-6">
                  <ApiCard title="MsalAuthProvider Props">
                    <ApiProp name="clientId" type="string" required>
                      Azure AD Application (client) ID
                    </ApiProp>
                    <ApiProp name="tenantId" type="string">
                      Azure AD Directory (tenant) ID
                    </ApiProp>
                    <ApiProp name="authorityType" type="'common' | 'organizations' | 'consumers' | 'tenant'" defaultValue="'common'">
                      Authority type for authentication
                    </ApiProp>
                    <ApiProp name="scopes" type="string[]" defaultValue="['User.Read']">
                      Default scopes for authentication
                    </ApiProp>
                    <ApiProp name="cacheLocation" type="'sessionStorage' | 'localStorage' | 'memoryStorage'" defaultValue="'sessionStorage'">
                      Token cache location
                    </ApiProp>
                    <ApiProp name="enableLogging" type="boolean" defaultValue="false">
                      Enable debug logging
                    </ApiProp>
                  </ApiCard>

                  <ApiCard title="MicrosoftSignInButton Props">
                    <ApiProp name="variant" type="'dark' | 'light'" defaultValue="'dark'">
                      Button color variant
                    </ApiProp>
                    <ApiProp name="size" type="'small' | 'medium' | 'large'" defaultValue="'medium'">
                      Button size
                    </ApiProp>
                    <ApiProp name="text" type="string" defaultValue="'Sign in with Microsoft'">
                      Button text
                    </ApiProp>
                    <ApiProp name="useRedirect" type="boolean" defaultValue="false">
                      Use redirect flow instead of popup
                    </ApiProp>
                    <ApiProp name="scopes" type="string[]">
                      Scopes to request (uses provider scopes if not specified)
                    </ApiProp>
                    <ApiProp name="onSuccess" type="() => void">
                      Callback on successful login
                    </ApiProp>
                    <ApiProp name="onError" type="(error: Error) => void">
                      Callback on error
                    </ApiProp>
                  </ApiCard>

                  <ApiCard title="useMsalAuth Hook">
                    <ApiProp name="isAuthenticated" type="boolean">
                      Whether user is authenticated
                    </ApiProp>
                    <ApiProp name="account" type="AccountInfo | null">
                      Current authenticated account
                    </ApiProp>
                    <ApiProp name="loginPopup" type="(scopes?: string[]) => Promise<void>">
                      Login using popup
                    </ApiProp>
                    <ApiProp name="loginRedirect" type="(scopes?: string[]) => Promise<void>">
                      Login using redirect
                    </ApiProp>
                    <ApiProp name="logoutPopup" type="() => Promise<void>">
                      Logout using popup
                    </ApiProp>
                    <ApiProp name="acquireToken" type="(scopes: string[]) => Promise<string>">
                      Acquire access token (silent with popup fallback)
                    </ApiProp>
                  </ApiCard>
                </div>
              </section>

              {/* Advanced Usage */}
              <section id="advanced">
                <h2 className="text-2xl font-bold text-dark-text mb-6">Advanced Usage</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-dark-text mb-3">Calling Protected APIs</h3>
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

                  <div>
                    <h3 className="text-lg font-semibold text-dark-text mb-3">Multi-tenant vs Single-tenant</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-dark-elevated border border-dark-border rounded-xl p-4">
                        <h4 className="font-semibold text-dark-text mb-2 text-sm">Multi-tenant</h4>
                        <pre className="text-xs">
                          <code className="text-dark-text">
{`<MsalAuthProvider
  clientId="..."
  authorityType="common"
/>`}
                          </code>
                        </pre>
                      </div>
                      <div className="bg-dark-elevated border border-dark-border rounded-xl p-4">
                        <h4 className="font-semibold text-dark-text mb-2 text-sm">Single-tenant</h4>
                        <pre className="text-xs">
                          <code className="text-dark-text">
{`<MsalAuthProvider
  clientId="..."
  tenantId="..."
  authorityType="tenant"
/>`}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Azure AD Setup */}
              <section id="azure">
                <h2 className="text-2xl font-bold text-dark-text mb-6">Azure AD App Registration</h2>
                <div className="bg-dark-elevated border border-dark-border rounded-xl p-6">
                  <ol className="space-y-3 text-dark-muted text-sm">
                    <li className="flex items-start space-x-3">
                      <span className="text-accent-primary font-semibold flex-shrink-0">1.</span>
                      <span>
                        Go to{' '}
                        <a href="https://portal.azure.com" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline">
                          Azure Portal
                        </a>{' '}
                        → Azure Active Directory → App registrations
                      </span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-accent-primary font-semibold flex-shrink-0">2.</span>
                      <span>Click "New registration"</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-accent-primary font-semibold flex-shrink-0">3.</span>
                      <div>
                        <span>Configure:</span>
                        <ul className="ml-4 mt-2 space-y-1">
                          <li>• Name: Your app name</li>
                          <li>• Supported account types: Choose based on your needs</li>
                          <li>• Redirect URI: Web → http://localhost:3000</li>
                        </ul>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-accent-primary font-semibold flex-shrink-0">4.</span>
                      <span>
                        Copy Application (client) ID → Use as <code className="text-accent-primary">clientId</code>
                      </span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-accent-primary font-semibold flex-shrink-0">5.</span>
                      <span>
                        Copy Directory (tenant) ID → Use as <code className="text-accent-primary">tenantId</code>
                      </span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-accent-primary font-semibold flex-shrink-0">6.</span>
                      <span>Under "Authentication", enable Access tokens and ID tokens</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-accent-primary font-semibold flex-shrink-0">7.</span>
                      <span>Under "API permissions", add required scopes (e.g., User.Read)</span>
                    </li>
                  </ol>
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
      <div className="p-6">
        <pre className="text-sm overflow-x-auto">
          <code className="text-dark-text">{code}</code>
        </pre>
      </div>
    </div>
  );
}

function ApiCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-dark-elevated border border-dark-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-dark-text mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function ApiProp({
  name,
  type,
  required,
  defaultValue,
  children,
}: {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-sm">
      <div className="flex items-center gap-2 mb-1">
        <code className="text-accent-primary">{name}</code>
        <span className="text-dark-muted">: {type}</span>
        {required && <span className="text-red-400 text-xs">*required</span>}
        {defaultValue && <span className="text-dark-muted text-xs">= {defaultValue}</span>}
      </div>
      <p className="text-dark-muted">{children}</p>
    </div>
  );
}
