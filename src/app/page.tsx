import { ArrowRight, Terminal, Shield, Users, RefreshCw, Lock, GitMerge } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-tight">msal-next</span>
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link href="/docs" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">
              Docs
            </Link>
            <a
              href="https://github.com/chemmangat/msal-next"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              GitHub
            </a>
            <Link
              href="/docs"
              className="text-sm px-3 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 pb-16 sm:pb-24">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 rounded-full px-3 py-1 mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
            v5.3.4 — latest
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.15] mb-5">
            Microsoft auth for Next.js App Router
          </h1>

          <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-8">
            MSAL integration that handles the hard parts — cookie sync, token refresh,
            multi-tenant access, and msal-browser v3 through v5 — so you don't have to.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Read the docs
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href="https://github.com/chemmangat/msal-next"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Install strip */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="bg-gray-950 rounded-xl overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            <span className="ml-2 text-xs text-white/25 font-mono">terminal</span>
          </div>
          <div className="p-5 sm:p-6 font-mono text-sm space-y-2 overflow-x-auto">
            <p>
              <span className="text-white/25 select-none">$ </span>
              <span className="text-white">npx @chemmangat/msal-next-cli init</span>
            </p>
            <p className="text-white/35 text-xs pl-2 sm:pl-4 space-y-0.5">
              <span className="block">✔ Client ID?  <span className="text-green-400">97f1e8c5-...</span></span>
              <span className="block">✔ Tenant?     <span className="text-green-400">common</span></span>
              <span className="block">✔ Cache?      <span className="text-green-400">sessionStorage</span></span>
            </p>
            <p className="text-white/50 text-xs pl-2 sm:pl-4 pt-1">
              ✅ .env.local · layout.tsx · app/auth/page.tsx — done
            </p>
          </div>
        </div>
      </section>

      {/* What it handles — the real differentiators */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-6">
          What it handles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
          {[
            {
              icon: <GitMerge className="w-4 h-4" />,
              title: 'msal-browser v3 · v4 · v5',
              desc: 'Runtime version detection. No code changes needed when you upgrade MSAL.',
            },
            {
              icon: <Shield className="w-4 h-4" />,
              title: 'Multi-tenant access control',
              desc: 'Allow/block by domain or tenant ID. Require MFA. Detect B2B guests.',
            },
            {
              icon: <Users className="w-4 h-4" />,
              title: 'Multi-account switching',
              desc: 'Up to five accounts in parallel. Switch without signing out.',
            },
            {
              icon: <RefreshCw className="w-4 h-4" />,
              title: 'Auto token refresh',
              desc: 'Reads real expiry from the token. Refreshes silently before it lapses.',
            },
            {
              icon: <Terminal className="w-4 h-4" />,
              title: 'CLI scaffold + codemod',
              desc: 'Init wires everything. Migrate rewrites popup calls to redirect.',
            },
            {
              icon: <Lock className="w-4 h-4" />,
              title: 'Cookie sync out of the box',
              desc: 'msal.account cookie written on every login — middleware just works.',
            },
          ].map((f) => (
            <div key={f.title} className="bg-white p-5 sm:p-6">
              <div className="text-gray-400 mb-3">{f.icon}</div>
              <p className="text-sm font-medium text-gray-900 mb-1">{f.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Code example */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div className="lg:pt-4">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-3">
              Wrap once, done
            </h2>
            <p className="text-gray-500 leading-relaxed mb-5 text-sm sm:text-base">
              Add <code className="text-gray-700 bg-gray-100 px-1 py-0.5 rounded text-xs">MSALProvider</code> to your root layout.
              Cookie sync, token refresh, and redirect handling are all automatic from there.
            </p>
            <p className="text-gray-500 leading-relaxed mb-6 text-sm sm:text-base">
              Use <code className="text-gray-700 bg-gray-100 px-1 py-0.5 rounded text-xs">useMsalAuth()</code> in any client component to get the account, trigger login, or acquire tokens.
            </p>
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-gray-500 transition-colors"
            >
              Full API reference
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-gray-950 rounded-xl overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              <span className="ml-2 text-xs text-white/25 font-mono">layout.tsx</span>
            </div>
            <pre className="p-5 sm:p-6 text-xs sm:text-sm leading-relaxed overflow-x-auto">
              <code className="text-gray-300 whitespace-pre">{`import { MSALProvider } from '@chemmangat/msal-next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MSALProvider
          clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
          autoRefreshToken
        >
          {children}
        </MSALProvider>
      </body>
    </html>
  );
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="border border-gray-100 rounded-xl p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="font-medium text-gray-900 mb-1">Ready to add Microsoft auth?</p>
            <p className="text-sm text-gray-500">One command gets you to a working sign-in page.</p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Get started
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href="https://www.npmjs.com/package/@chemmangat/msal-next"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View on npm
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            @chemmangat/msal-next · v5.3.4 · MIT License
          </p>
          <div className="flex items-center gap-5 text-xs text-gray-400">
            <a href="https://github.com/chemmangat/msal-next" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">GitHub</a>
            <a href="https://www.npmjs.com/package/@chemmangat/msal-next" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">npm</a>
            <Link href="/docs" className="hover:text-gray-900 transition-colors">Docs</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
