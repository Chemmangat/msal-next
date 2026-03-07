'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Github, Check, Zap, Shield, Code2, Terminal } from 'lucide-react';
import Link from 'next/link';

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
              <span className="text-blue-600 text-sm font-medium">v4.1.0</span>
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
              <code className="text-sm text-gray-900">npm install @chemmangat/msal-next</code>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <FeatureCard
            icon={<Zap className="w-5 h-5" />}
            title="Zero Config"
            description="Works out of the box with sensible defaults. No complex setup required."
          />
          <FeatureCard
            icon={<Shield className="w-5 h-5" />}
            title="Secure by Default"
            description="Built on Microsoft's official MSAL library with enterprise-grade security."
          />
          <FeatureCard
            icon={<Code2 className="w-5 h-5" />}
            title="TypeScript First"
            description="Full type safety with comprehensive TypeScript definitions."
          />
          <FeatureCard
            icon={<Check className="w-5 h-5" />}
            title="Protected Routes"
            description="One-line route protection with role-based access control."
          />
          <FeatureCard
            icon={<Terminal className="w-5 h-5" />}
            title="Auto Token Refresh"
            description="Silent token refresh prevents unexpected logouts."
          />
          <FeatureCard
            icon={<BookOpen className="w-5 h-5" />}
            title="Great DX"
            description="Intuitive API with helpful error messages and debugging tools."
          />
        </div>
      </section>

      {/* Code Example */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Simple to Use</h2>
          <p className="text-lg text-gray-600">Add Microsoft authentication in minutes</p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl">
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-2 border-b border-gray-700">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="ml-2 text-sm text-gray-400">app/layout.tsx</span>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm leading-relaxed">
                <code className="text-gray-100">
{`import { MSALProvider } from '@chemmangat/msal-next';

export default function RootLayout({ children }) {
  return (
    <MSALProvider 
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
    >
      {children}
    </MSALProvider>
  );
}`}
                </code>
              </pre>
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm font-bold">1</span>
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Install</div>
                <div className="text-gray-600 text-xs mt-1">Add the package</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm font-bold">2</span>
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Configure</div>
                <div className="text-gray-600 text-xs mt-1">Wrap your app</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm font-bold">3</span>
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Done</div>
                <div className="text-gray-600 text-xs mt-1">Start building</div>
              </div>
            </div>
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
              © 2024 @chemmangat/msal-next. MIT License.
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

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all">
      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
