'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-dark-elevated border border-dark-border rounded-full"
            >
              <Sparkles className="w-4 h-4 text-accent-primary" />
              <span className="text-sm text-dark-muted">Production-ready MSAL for Next.js</span>
            </motion.div>

            {/* Main heading */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              <span className="text-dark-text">Authentication</span>
              <br />
              <span className="text-gradient">Made Simple</span>
            </h1>

            {/* Subheading */}
            <p className="text-base md:text-lg text-dark-muted">
              Fully configurable MSAL authentication for Next.js App Router.
              <br />
              Zero config to get started. Infinite flexibility when you need it.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-8">
              <a
                href="#quickstart"
                className="group px-8 py-4 bg-accent-primary hover:bg-accent-primary/90 text-white rounded-lg font-semibold transition-all flex items-center space-x-2 glow"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://github.com/chemmangat/msal-next"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-dark-elevated hover:bg-dark-border text-dark-text rounded-lg font-semibold transition-all border border-dark-border"
              >
                View on GitHub
              </a>
            </div>

            {/* Install command */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="pt-4"
            >
              <div className="inline-block bg-dark-elevated border border-dark-border rounded-lg px-6 py-4">
                <code className="text-accent-primary text-sm">
                  npm install @chemmangat/msal-next
                </code>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Animated demo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:block"
          >
            <AuthFlowAnimation />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-dark-border rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-accent-primary rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}

// Animated authentication flow component
function AuthFlowAnimation() {
  return (
    <div className="relative">
      <div className="bg-dark-elevated border border-dark-border rounded-2xl p-8 shadow-2xl">
        {/* Browser mockup */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>

        {/* Animation sequence */}
        <div className="space-y-4">
          {/* Step 1: Login button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-dark-bg rounded-lg p-4 border border-dark-border"
          >
            <div className="flex items-center justify-between">
              <span className="text-dark-muted text-sm">Not authenticated</span>
              <motion.button
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="px-4 py-2 bg-accent-primary text-white text-sm rounded-lg"
              >
                Sign In
              </motion.button>
            </div>
          </motion.div>

          {/* Step 2: Loading */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="bg-dark-bg rounded-lg p-4 border border-accent-primary/50"
          >
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-accent-primary border-t-transparent rounded-full"
              />
              <span className="text-dark-text text-sm">Authenticating...</span>
            </div>
          </motion.div>

          {/* Step 3: Success */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.5 }}
            className="bg-dark-bg rounded-lg p-4 border border-accent-success/50"
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 2.7, type: "spring" }}
                  className="w-5 h-5 bg-accent-success rounded-full flex items-center justify-center"
                >
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <span className="text-accent-success text-sm font-semibold">Authenticated</span>
              </div>
              <div className="text-dark-muted text-xs space-y-1">
                <div>Name: John Doe</div>
                <div>Email: john@example.com</div>
              </div>
            </div>
          </motion.div>

          {/* Code snippet */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5, duration: 0.5 }}
            className="bg-dark-bg rounded-lg p-4 border border-dark-border"
          >
            <code className="text-xs text-accent-primary">
              const {'{'} loginPopup {'}'} = useMsalAuth();
            </code>
          </motion.div>
        </div>
      </div>

      {/* Floating elements */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-2xl opacity-20 blur-xl"
      />
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-accent-secondary to-accent-primary rounded-2xl opacity-20 blur-xl"
      />
    </div>
  );
}
