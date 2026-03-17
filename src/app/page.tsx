'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Github, Check, Zap, Shield, Code2, Terminal, Users, RefreshCw, Lock, Sparkles, TrendingUp, Award, ChevronLeft, ChevronRight, Wrench, GitMerge } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">msal-next</span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/docs"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium hidden sm:block"
              >
                Docs
              </Link>
              <a
                href="https://github.com/chemmangat/msal-next"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <Link
                href="/docs"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-32 pb-16 sm:pb-24">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 text-sm font-medium">v5.1.0 — Multi-Tenant Support</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Microsoft Auth for
              <br />
              <span className="text-blue-600">Next.js App Router</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
              Production-ready MSAL authentication with zero configuration.
              <br className="hidden sm:block" />
              TypeScript-first, secure, and developer-friendly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/docs"
                className="group w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="https://github.com/chemmangat/msal-next"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 rounded-lg font-medium transition-all border border-gray-300"
              >
                View on GitHub
              </a>
            </div>

            {/* Install Command */}
            <div className="inline-flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
              <Terminal className="w-4 h-4 text-gray-400" />
              <code className="text-sm text-gray-900">npx @chemmangat/msal-next-cli init</code>
            </div>
          </motion.div>
        </div>
      </section>

      {/* v5.1.0 What's New Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-blue-200">What&apos;s new</div>
              <div className="text-xl font-bold">Version 5.1.0</div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: <Users className="w-5 h-5" />,
                title: 'Multi-Tenant',
                desc: 'allowList, blockList, requireType and requireMFA — control exactly which tenants can sign in',
              },
              {
                icon: <Shield className="w-5 h-5" />,
                title: 'useTenant() Hook',
                desc: 'tenantId, tenantDomain, isGuestUser, homeTenantId — full B2B guest detection built-in',
              },
              {
                icon: <Lock className="w-5 h-5" />,
                title: 'Per-Page Tenant Rules',
                desc: 'export const auth = { tenant: { allowList, requireMFA } } — zero-config page protection',
              },
              {
                icon: <Zap className="w-5 h-5" />,
                title: 'Cross-Tenant Tokens',
                desc: 'acquireTokenForTenant(tenantId, scopes) — silent token acquisition for any tenant',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white/10 rounded-xl p-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                  {item.icon}
                </div>
                <div className="font-semibold text-sm mb-1">{item.title}</div>
                <div className="text-blue-100 text-xs leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Carousel */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Microsoft Auth
          </h2>
          <p className="text-lg text-gray-600">
            Production-ready features that developers love
          </p>
        </div>

        <FeatureCarousel />
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">2.9k+</div>
            <div className="text-gray-600">Weekly Downloads</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
            <div className="text-gray-600">TypeScript Coverage</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">5 min</div>
            <div className="text-gray-600">Setup Time</div>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Simple to Use</h2>
          <p className="text-lg text-gray-600">Scaffold a full auth setup in one command</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl">
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-2 border-b border-gray-700">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="ml-2 text-sm text-gray-400">terminal</span>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm leading-relaxed">
                <code className="text-gray-100">
{`# Scaffold everything interactively
npx @chemmangat/msal-next-cli init

# Migrate popup → redirect calls
npx @chemmangat/msal-next-cli migrate

# Or install the package directly
npm install @chemmangat/msal-next`}
                </code>
              </pre>
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Run init', desc: 'CLI asks for client ID, tenant, cache location' },
              { step: '2', title: 'Auto-wired', desc: '.env.local, layout.tsx and auth page created' },
              { step: '3', title: 'Done', desc: 'Sign in with Microsoft works immediately' },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm font-bold">{s.step}</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{s.title}</div>
                  <div className="text-gray-600 text-xs mt-1">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="bg-blue-600 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of developers using msal-next in production
          </p>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all"
          >
            <BookOpen className="w-5 h-5" />
            Read Documentation
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">
              © 2025 @chemmangat/msal-next · v5.1.0 · MIT License
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/chemmangat/msal-next"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                GitHub
              </a>
              <a
                href="https://www.npmjs.com/package/@chemmangat/msal-next"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                npm
              </a>
              <Link
                href="/docs"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                Documentation
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const features = [
    {
      icon: <Terminal className="w-8 h-8" />,
      title: 'CLI Init Command',
      description: 'Run npx init and answer a few prompts. The CLI writes .env.local, wires MSALProvider into layout.tsx, and creates a starter auth page — no boilerplate to copy.',
      badge: 'NEW in v5.0.0',
      color: 'blue',
      code: `npx @chemmangat/msal-next-cli init
# ✔ Client ID?  97f1e8c5-...
# ✔ Tenant ID?  common
# ✔ Cache?      sessionStorage
# ✅ .env.local created
# ✅ layout.tsx updated
# ✅ app/auth/page.tsx created`,
    },
    {
      icon: <GitMerge className="w-8 h-8" />,
      title: 'Codemod Migrate',
      description: 'Upgrading from popup-based auth? One command scans every .ts/.tsx file and rewrites loginPopup, logoutPopup, acquireTokenPopup and useRedirect={false} to their redirect equivalents.',
      badge: 'NEW in v5.0.0',
      color: 'indigo',
      code: `npx @chemmangat/msal-next-cli migrate
# Scanning 42 files...
# ✔ loginPopup → loginRedirect (3)
# ✔ logoutPopup → logoutRedirect (1)
# ✔ acquireTokenPopup → redirect (2)
# ✅ 6 changes across 4 files`,
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: 'renderAccount Slot',
      description: 'AccountSwitcher and AccountList now accept a renderAccount prop. Pass a render function to fully control how each account row looks — avatars, badges, custom layouts, anything.',
      badge: 'NEW in v5.0.0',
      color: 'purple',
      code: `<AccountSwitcher
  renderAccount={(account, isActive) => (
    <div className={isActive ? 'font-bold' : ''}>
      <img src={account.photo} />
      {account.name}
    </div>
  )}
/>`,
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Multi-Account Management',
      description: 'Switch between 5 Microsoft accounts instantly. Perfect for work + personal or multiple tenants.',
      badge: 'Since v4.2.0',
      color: 'green',
      code: `<AccountSwitcher
  showAvatars={true}
  maxAccounts={5}
  onSwitch={(account) => console.log(account.name)}
/>`,
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Multi-Tenant Support',
      description: 'Control exactly which tenants can access your app. Allow/block by domain or tenant ID, require MFA, detect B2B guests, and acquire cross-tenant tokens silently.',
      badge: 'NEW in v5.1.0',
      color: 'indigo',
      code: `<MSALProvider
  clientId="..."
  multiTenant={{
    type: 'multi',
    allowList: ['contoso.com'],
    requireMFA: true,
  }}
  onTenantDenied={(reason) => router.push('/denied')}
>

// In any component:
const { tenantDomain, isGuestUser } = useTenant();`,
    },    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Protected Routes',
      description: 'One-line route protection with role-based access control. Secure your pages effortlessly.',
      badge: 'Zero Config',
      color: 'red',
      code: `<AuthGuard>
  <ProtectedContent />
</AuthGuard>

// or with roles
export default withPageAuth(Dashboard, {
  required: true,
  roles: ['Admin'],
})`,
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Zero Configuration',
      description: 'Works out of the box with sensible defaults. No complex setup or boilerplate required.',
      badge: '5 Min Setup',
      color: 'yellow',
      code: `<MSALProvider
  clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
  autoRefreshToken={true}
>
  <MicrosoftSignInButton />
</MSALProvider>`,
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, features.length]);

  const goToNext = () => { setIsAutoPlaying(false); setCurrentIndex((prev) => (prev + 1) % features.length); };
  const goToPrev = () => { setIsAutoPlaying(false); setCurrentIndex((prev) => (prev - 1 + features.length) % features.length); };
  const goToSlide = (index: number) => { setIsAutoPlaying(false); setCurrentIndex(index); };

  const currentFeature = features[currentIndex];
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <div className="relative">
      <div className="relative bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-8 sm:p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 border ${colorClasses[currentFeature.color]}`}>
                  {currentFeature.badge}
                </div>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${colorClasses[currentFeature.color]}`}>
                  {currentFeature.icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{currentFeature.title}</h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">{currentFeature.description}</p>
                <Link href="/docs" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium group">
                  Learn more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl">
                <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>
                </div>
                <div className="p-6">
                  <pre className="text-sm leading-relaxed"><code className="text-gray-100">{currentFeature.code}</code></pre>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button onClick={goToPrev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm z-20" aria-label="Previous feature">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm z-20" aria-label="Next feature">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all ${index === currentIndex ? 'w-8 h-2 bg-blue-600' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'} rounded-full`}
            aria-label={`Go to feature ${index + 1}`}
          />
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
        {features.map((feature, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`p-4 text-left rounded-xl border-2 transition-all ${index === currentIndex ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${index === currentIndex ? colorClasses[feature.color] : 'bg-gray-100 text-gray-600'}`}>
              {feature.icon}
            </div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</h4>
            <p className="text-gray-600 text-xs line-clamp-2">{feature.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
