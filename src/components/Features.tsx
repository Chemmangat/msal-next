'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, Settings, Code2, Layers, Rocket } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Zap,
      title: 'Zero Config',
      description: 'Get started with just your client ID. Sensible defaults for everything else.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Settings,
      title: 'Fully Configurable',
      description: 'Override any setting when you need more control. From cache location to custom loggers.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Shield,
      title: 'Production Ready',
      description: 'Built-in token refresh, error handling, and security best practices.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Code2,
      title: 'TypeScript First',
      description: 'Full type definitions included. Autocomplete and type safety out of the box.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Layers,
      title: 'Next.js 14+ Ready',
      description: 'Built specifically for Next.js App Router with React Server Components support.',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: Rocket,
      title: 'Developer Experience',
      description: 'Simple hooks, clear errors, and comprehensive documentation.',
      color: 'from-red-500 to-pink-500',
    },
  ];

  return (
    <section id="features" className="py-20 bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-dark-text">Powerful </span>
            <span className="text-gradient">Features</span>
          </h2>
          <p className="text-xl text-dark-muted max-w-3xl mx-auto">
            Everything you need for enterprise-grade authentication in a simple, elegant package.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-dark-elevated border border-dark-border rounded-2xl p-6 hover:border-accent-primary/50 transition-all duration-300"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-dark-text mb-2">{feature.title}</h3>
              <p className="text-dark-muted">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
