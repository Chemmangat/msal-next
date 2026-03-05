'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Github, Download, Users, Star, Code2 } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg via-dark-elevated to-dark-bg">
      {/* Navigation */}
      <nav className="border-b border-dark-border bg-dark-elevated/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-dark-text">@chemmangat/msal-next</span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/docs"
                className="text-dark-muted hover:text-dark-text transition-colors text-sm font-medium"
              >
                Documentation
              </Link>
              <a
                href="https://github.com/chemmangat/msal-next"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-muted hover:text-dark-text transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary/10 border border-accent-primary/20 rounded-full mb-8">
              <span className="text-accent-primary text-sm font-semibold">v3.1.7</span>
              <span className="text-dark-muted text-sm">Latest Release</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-dark-text mb-6 leading-tight">
              Microsoft Authentication
              <br />
              <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            
            <p className="text-xl text-dark-muted mb-12 max-w-2xl mx-auto leading-relaxed">
              Production-grade MSAL authentication for Next.js App Router. 
              Zero configuration, full TypeScript support, redirect-only flow.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/docs"
                className="group px-8 py-4 bg-accent-primary hover:bg-accent-primary/90 text-white rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg shadow-accent-primary/20"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <a
                href="https://www.npmjs.com/package/@chemmangat/msal-next"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-dark-elevated hover:bg-dark-border text-dark-text rounded-lg font-semibold transition-all border border-dark-border"
              >
                View on npm
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto"
        >
          <StatCard
            icon={<Users className="w-6 h-6" />}
            value="650+"
            label="Active Installations"
          />
          <StatCard
            icon={<Star className="w-6 h-6" />}
            label="Latest Version"
            value="v3.1.7"
          />
        </motion.div>
      </section>

      {/* Quick Install */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-dark-elevated border border-dark-border rounded-2xl p-8 sm:p-12"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-dark-text mb-4 text-center">Quick Install</h2>
            <p className="text-dark-muted text-center mb-8">Get started in under 2 minutes</p>
            
            <div className="bg-dark-bg border border-dark-border rounded-xl p-6 mb-8">
              <code className="text-accent-primary text-lg">
                npm install @chemmangat/msal-next
              </code>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard
                title="Zero Configuration"
                description="Works out of the box with sensible defaults"
              />
              <FeatureCard
                title="TypeScript First"
                description="Full type safety and IntelliSense support"
              />
              <FeatureCard
                title="Redirect Flow"
                description="Clean, reliable authentication flow"
              />
              <FeatureCard
                title="Next.js 14+"
                description="Built for App Router and Server Components"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Code Example */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-dark-text mb-4 text-center">Simple API</h2>
          <p className="text-dark-muted text-center mb-8">Three lines to add Microsoft authentication</p>
          
          <div className="bg-dark-elevated border border-dark-border rounded-2xl overflow-hidden">
            <div className="bg-dark-bg border-b border-dark-border px-6 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-sm text-dark-muted">app/layout.tsx</span>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm leading-relaxed">
                <code className="text-dark-text">
{`import { MSALProvider } from '@chemmangat/msal-next';

export default function RootLayout({ children }) {
  return (
    <MSALProvider 
      clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID}
      tenantId={process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}
    >
      {children}
    </MSALProvider>
  );
}`}
                </code>
              </pre>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl p-12 text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join 650+ developers using @chemmangat/msal-next in production
          </p>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-accent-primary rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg"
          >
            <BookOpen className="w-5 h-5" />
            Read Documentation
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-border bg-dark-elevated/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-dark-muted text-sm">
              © 2024 @chemmangat/msal-next. MIT License.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/chemmangat/msal-next"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-muted hover:text-dark-text transition-colors text-sm"
              >
                GitHub
              </a>
              <a
                href="https://www.npmjs.com/package/@chemmangat/msal-next"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-muted hover:text-dark-text transition-colors text-sm"
              >
                npm
              </a>
              <Link
                href="/docs"
                className="text-dark-muted hover:text-dark-text transition-colors text-sm"
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

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-dark-elevated border border-dark-border rounded-xl p-6 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-primary/10 rounded-lg mb-4 text-accent-primary">
        {icon}
      </div>
      <div className="text-3xl font-bold text-dark-text mb-1">{value}</div>
      <div className="text-dark-muted text-sm">{label}</div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 bg-accent-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <div className="w-2 h-2 bg-accent-success rounded-full" />
      </div>
      <div>
        <h3 className="text-dark-text font-semibold mb-1">{title}</h3>
        <p className="text-dark-muted text-sm">{description}</p>
      </div>
    </div>
  );
}
