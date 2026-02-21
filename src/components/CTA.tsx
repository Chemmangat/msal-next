'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Github, BookOpen } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20 bg-dark-bg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold">
            <span className="text-dark-text">Ready to </span>
            <span className="text-gradient">Get Started?</span>
          </h2>
          
          <p className="text-base text-dark-muted max-w-2xl mx-auto">
            Join developers who are building secure, production-ready authentication with @chemmangat/msal-next.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="https://www.npmjs.com/package/@chemmangat/msal-next"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 bg-accent-primary hover:bg-accent-primary/90 text-white rounded-lg font-semibold transition-all flex items-center space-x-2 glow"
            >
              <span>Install Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a
              href="https://github.com/chemmangat/msal-next"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-dark-elevated hover:bg-dark-border text-dark-text rounded-lg font-semibold transition-all border border-dark-border flex items-center space-x-2"
            >
              <Github className="w-5 h-5" />
              <span>View on GitHub</span>
            </a>
          </div>

          <div className="pt-8 flex items-center justify-center space-x-8 text-sm text-dark-muted">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent-success rounded-full" />
              <span>MIT Licensed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent-primary rounded-full" />
              <span>TypeScript</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent-secondary rounded-full" />
              <span>Next.js 14+</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
