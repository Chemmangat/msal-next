'use client';

import { motion } from 'framer-motion';
import { Copy, Check, ChevronRight, Menu, X, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DocsPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState('installation');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'installation',
        'quickstart',
        'provider',
        'hook',
        'protected-routes',
        'token-refresh',
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
    handleScroll();

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
    { id: 'provider', label: 'MSALProvider' },
    { id: 'hook', label: 'useMsalAuth' },
    { id: 'protected-routes', label: 'Protected Routes' },
    { id: 'token-refresh', label: 'Token Refresh' },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">msal-next</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 transition-colors hidden sm:block"
              >
                <Home className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-gray-600"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-1">Documentation</h2>
                <p className="text-xs text-gray-500">v4.1.0</p>
              </div>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span>{section.label}</span>
                    {activeSection === section.id && <ChevronRight className="w-4 h-4" />}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Mobile Sidebar */}
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-40 bg-white pt-16">
              <div className="p-4">
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {section.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-gray max-w-none"
            >
              {/* Installation */}
              <section id="installation" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Installation</h2>
                <p className="text-gray-600 mb-6">
                  Install the package along with its peer dependencies.
                </p>
                <CodeBlock
                  code="npm install @chemmangat/msal-next @azure/msal-browser @azure/msal-react"
                  onCopy={() => copyToClipboard('npm install @chemmangat/msal-next @azure/msal-browser @azure/msal-react', 0)}
                  copied={copiedIndex === 0}
                />
              </section>

              {/* Quick Start */}
              <section id="quickstart" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick Start</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Configure Environment</h3>
                    <CodeBlock
                      title=".env.local"
                      code={`NEXT_PUBLIC_CLIENT_ID=your-client-id\nNEXT_PUBLIC_TENANT_ID=your-tenant-id`}
                      onCopy={() => copyToClipboard('NEXT_PUBLIC_CLIENT_ID=your-client-id\nNEXT_PUBLIC_TENANT_ID=your-tenant-id', 1)}
                      copied={copiedIndex === 1}
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Wrap Your App</h3>
                    <CodeBlock
                      title="app/layout.tsx"
                      code={`import { MSALProvider } from '@chemmangat/msal-next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MSALProvider
          clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}
        >
          {children}
        </MSALProvider>
      </body>
    </html>
  );
}`}
                      onCopy={() => copyToClipboard(`import { MSALProvider } from '@chemmangat/msal-next';\n\nexport default function RootLayout({ children }) {\n  return (\n    <html>\n      <body>\n        <MSALProvider\n          clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}\n        >\n          {children}\n        </MSALProvider>\n      </body>\n    </html>\n  );\n}`, 2)}
                      copied={copiedIndex === 2}
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Use the Hook</h3>
                    <CodeBlock
                      title="app/page.tsx"
                      code={`'use client';

import { MicrosoftSignInButton, useMsalAuth } from '@chemmangat/msal-next';

export default function Home() {
  const { isAuthenticated, account } = useMsalAuth();

  if (!isAuthenticated) {
    return <MicrosoftSignInButton />;
  }

  return <div>Hello, {account?.name}!</div>;
}`}
                      onCopy={() => copyToClipboard(`'use client';\n\nimport { MicrosoftSignInButton, useMsalAuth } from '@chemmangat/msal-next';\n\nexport default function Home() {\n  const { isAuthenticated, account } = useMsalAuth();\n\n  if (!isAuthenticated) {\n    return <MicrosoftSignInButton />;\n  }\n\n  return <div>Hello, {account?.name}!</div>;\n}`, 3)}
                      copied={copiedIndex === 3}
                    />
                  </div>
                </div>
              </section>

              {/* Provider */}
              <section id="provider" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">MSALProvider</h2>
                <p className="text-gray-600 mb-6">
                  The main provider component that initializes MSAL and wraps your application.
                </p>
                
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Props</h3>
                  <div className="space-y-4">
                    <PropDoc name="clientId" type="string" required>
                      Azure AD Application (client) ID
                    </PropDoc>
                    <PropDoc name="tenantId" type="string">
                      Azure AD Directory (tenant) ID (optional for multi-tenant)
                    </PropDoc>
                    <PropDoc name="autoRefreshToken" type="boolean" defaultValue="false" badge="New in v4.1">
                      Enable automatic silent token refresh
                    </PropDoc>
                    <PropDoc name="refreshBeforeExpiry" type="number" defaultValue="300">
                      Seconds before expiry to refresh token
                    </PropDoc>
                  </div>
                </div>
              </section>

              {/* Hook */}
              <section id="hook" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">useMsalAuth Hook</h2>
                <p className="text-gray-600 mb-6">
                  The main hook for authentication operations in your components.
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Values</h3>
                  <div className="space-y-4">
                    <PropDoc name="isAuthenticated" type="boolean">
                      Whether user is authenticated
                    </PropDoc>
                    <PropDoc name="account" type="AccountInfo | null">
                      Current authenticated account
                    </PropDoc>
                    <PropDoc name="loginRedirect" type="() => Promise<void>">
                      Login using redirect
                    </PropDoc>
                    <PropDoc name="logoutRedirect" type="() => Promise<void>">
                      Logout using redirect
                    </PropDoc>
                  </div>
                </div>
              </section>

              {/* Protected Routes */}
              <section id="protected-routes" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Protected Routes <span className="text-sm text-blue-600 font-normal">(v4.0)</span>
                </h2>
                <p className="text-gray-600 mb-6">
                  Protect any route with one line of code.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                  <CodeBlock
                    title="app/dashboard/page.tsx"
                    code={`export const auth = { required: true };

export default function Dashboard() {
  return <div>Protected content</div>;
}`}
                    onCopy={() => copyToClipboard(`export const auth = { required: true };\n\nexport default function Dashboard() {\n  return <div>Protected content</div>;\n}`, 10)}
                    copied={copiedIndex === 10}
                  />
                </div>
              </section>

              {/* Token Refresh */}
              <section id="token-refresh" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Automatic Token Refresh <span className="text-sm text-blue-600 font-normal">(v4.1)</span>
                </h2>
                <p className="text-gray-600 mb-6">
                  Prevent unexpected logouts with automatic silent token refresh.
                </p>

                <CodeBlock
                  title="app/layout.tsx"
                  code={`<MSALProvider
  clientId="..."
  autoRefreshToken={true}
  refreshBeforeExpiry={300}
>
  {children}
</MSALProvider>`}
                  onCopy={() => copyToClipboard(`<MSALProvider\n  clientId="..."\n  autoRefreshToken={true}\n  refreshBeforeExpiry={300}\n>\n  {children}\n</MSALProvider>`, 11)}
                  copied={copiedIndex === 11}
                />
              </section>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ title, code, onCopy, copied }: { title?: string; code: string; onCopy: () => void; copied: boolean }) {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-sm my-4">
      {title && (
        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
          <span className="text-sm text-gray-300">{title}</span>
          <button
            onClick={onCopy}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      )}
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm leading-relaxed">
          <code className="text-gray-100">{code}</code>
        </pre>
      </div>
    </div>
  );
}

function PropDoc({ name, type, required, defaultValue, badge, children }: {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
      <div className="flex items-center gap-2 mb-2">
        <code className="text-sm font-mono text-blue-600">{name}</code>
        <code className="text-xs font-mono text-gray-500">{type}</code>
        {required && (
          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded">required</span>
        )}
        {badge && (
          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded">{badge}</span>
        )}
      </div>
      <p className="text-sm text-gray-600">{children}</p>
      {defaultValue && (
        <p className="text-xs text-gray-500 mt-1">Default: <code>{defaultValue}</code></p>
      )}
    </div>
  );
}
