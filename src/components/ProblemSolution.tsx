'use client';

import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ProblemSolution() {
  const problems = [
    'Complex MSAL setup with boilerplate code',
    'Managing authentication state manually',
    'Handling token refresh and expiration',
    'Configuring for different environments',
    'Dealing with popup vs redirect flows',
  ];

  const solutions = [
    'One-line provider setup with sensible defaults',
    'Built-in hooks for authentication state',
    'Automatic token refresh with fallback',
    'Environment-based configuration support',
    'Simple API for both popup and redirect',
  ];

  return (
    <section className="py-20 bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-dark-text">The Problem We </span>
            <span className="text-gradient">Solve</span>
          </h2>
          <p className="text-xl text-dark-muted max-w-3xl mx-auto">
            MSAL authentication shouldn't be complicated. We've done the heavy lifting so you don't have to.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Problems */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-dark-elevated border border-red-500/20 rounded-2xl p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-dark-text">Without @chemmangat/msal-next</h3>
            </div>
            <ul className="space-y-4">
              {problems.map((problem, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                  </div>
                  <span className="text-dark-muted">{problem}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Solutions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-dark-elevated border border-accent-success/20 rounded-2xl p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-accent-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-accent-success" />
              </div>
              <h3 className="text-2xl font-bold text-dark-text">With @chemmangat/msal-next</h3>
            </div>
            <ul className="space-y-4">
              {solutions.map((solution, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-accent-success mt-0.5 flex-shrink-0" />
                  <span className="text-dark-text font-medium">{solution}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
