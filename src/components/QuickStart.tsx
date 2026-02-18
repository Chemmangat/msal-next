'use client';

import { motion } from 'framer-motion';
import { Terminal, Package, Settings, Rocket } from 'lucide-react';

export default function QuickStart() {
  const steps = [
    {
      icon: Package,
      title: 'Install Package',
      command: 'npm install @chemmangat/msal-next @azure/msal-browser @azure/msal-react',
      description: 'Add the package and peer dependencies to your project',
    },
    {
      icon: Settings,
      title: 'Configure Azure AD',
      command: 'NEXT_PUBLIC_CLIENT_ID=your-client-id',
      description: 'Get your client ID from Azure Portal and add to .env.local',
    },
    {
      icon: Terminal,
      title: 'Wrap Your App',
      command: '<MsalAuthProvider clientId={...}>{children}</MsalAuthProvider>',
      description: 'Add the provider to your root layout',
    },
    {
      icon: Rocket,
      title: 'Start Building',
      command: 'const { loginPopup } = useMsalAuth();',
      description: 'Use the hook in your components',
    },
  ];

  return (
    <section id="quickstart" className="py-20 bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-dark-text">Quick </span>
            <span className="text-gradient">Start</span>
          </h2>
          <p className="text-xl text-dark-muted max-w-3xl mx-auto">
            Get up and running in less than 5 minutes. No complex configuration required.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-dark-elevated border border-dark-border rounded-2xl p-6 hover:border-accent-primary/50 transition-all"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-bold text-accent-primary">Step {index + 1}</span>
                    <h3 className="text-lg font-bold text-dark-text">{step.title}</h3>
                  </div>
                  <p className="text-dark-muted text-sm mb-3">{step.description}</p>
                  <div className="bg-dark-bg border border-dark-border rounded-lg p-3">
                    <code className="text-xs text-accent-primary break-all">{step.command}</code>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a
            href="https://github.com/chemmangat/msal-next#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-dark-elevated border border-dark-border rounded-lg hover:border-accent-primary transition-all"
          >
            <span className="text-dark-text">Read Full Documentation</span>
            <span className="text-accent-primary">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
