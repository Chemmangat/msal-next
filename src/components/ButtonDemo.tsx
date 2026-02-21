'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ButtonDemo() {
  const [selectedVariant, setSelectedVariant] = useState<'dark' | 'light'>('dark');
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');

  return (
    <section className="py-20 bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            <span className="text-dark-text">Pre-built </span>
            <span className="text-gradient">Sign In Button</span>
          </h2>
          <p className="text-base text-dark-muted max-w-3xl mx-auto">
            Use our ready-made Microsoft Sign In button component with official branding.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Preview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-dark-elevated border border-dark-border rounded-2xl p-8"
            >
              <h3 className="text-xl font-semibold text-dark-text mb-6">Preview</h3>
              
              <div className={`flex items-center justify-center p-12 rounded-xl ${selectedVariant === 'dark' ? 'bg-dark-bg' : 'bg-white'}`}>
                <MockMicrosoftButton variant={selectedVariant} size={selectedSize} />
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm text-dark-muted mb-2 block">Variant</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedVariant('dark')}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        selectedVariant === 'dark'
                          ? 'bg-accent-primary text-white'
                          : 'bg-dark-bg text-dark-muted hover:text-dark-text'
                      }`}
                    >
                      Dark
                    </button>
                    <button
                      onClick={() => setSelectedVariant('light')}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        selectedVariant === 'light'
                          ? 'bg-accent-primary text-white'
                          : 'bg-dark-bg text-dark-muted hover:text-dark-text'
                      }`}
                    >
                      Light
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-dark-muted mb-2 block">Size</label>
                  <div className="flex gap-2">
                    {(['small', 'medium', 'large'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors capitalize ${
                          selectedSize === size
                            ? 'bg-accent-primary text-white'
                            : 'bg-dark-bg text-dark-muted hover:text-dark-text'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Code */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-dark-elevated border border-dark-border rounded-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-dark-border">
                <h3 className="text-xl font-semibold text-dark-text">Usage</h3>
              </div>
              <div className="p-6">
                <pre className="text-sm overflow-x-auto">
                  <code className="text-dark-text">
{`import { MicrosoftSignInButton } from '@chemmangat/msal-next';

export default function LoginPage() {
  return (
    <MicrosoftSignInButton
      variant="${selectedVariant}"
      size="${selectedSize}"
      onSuccess={() => {
        console.log('Login successful!');
      }}
      onError={(error) => {
        console.error('Login failed:', error);
      }}
    />
  );
}`}
                  </code>
                </pre>
              </div>
            </motion.div>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 bg-dark-elevated border border-dark-border rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-dark-text mb-4">Button Features</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-dark-muted">
              <div className="flex items-start space-x-2">
                <span className="text-accent-success">✓</span>
                <span>Official Microsoft branding</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-accent-success">✓</span>
                <span>Dark and light variants</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-accent-success">✓</span>
                <span>Three size options</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-accent-success">✓</span>
                <span>Popup or redirect flow</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-accent-success">✓</span>
                <span>Custom scopes support</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-accent-success">✓</span>
                <span>Success/error callbacks</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MockMicrosoftButton({ 
  variant, 
  size 
}: { 
  variant: 'dark' | 'light'; 
  size: 'small' | 'medium' | 'large';
}) {
  const sizeStyles = {
    small: { padding: '8px 16px', fontSize: '14px', height: '36px' },
    medium: { padding: '10px 20px', fontSize: '15px', height: '41px' },
    large: { padding: '12px 24px', fontSize: '16px', height: '48px' },
  };

  const variantStyles = {
    dark: {
      backgroundColor: '#2F2F2F',
      color: '#FFFFFF',
      border: '1px solid #8C8C8C',
    },
    light: {
      backgroundColor: '#FFFFFF',
      color: '#5E5E5E',
      border: '1px solid #8C8C8C',
    },
  };

  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        fontWeight: 600,
        borderRadius: '2px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ...variantStyles[variant],
        ...sizeStyles[size],
      }}
    >
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="10" height="10" fill="#F25022" />
        <rect x="11" width="10" height="10" fill="#7FBA00" />
        <rect y="11" width="10" height="10" fill="#00A4EF" />
        <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
      </svg>
      <span>Sign in with Microsoft</span>
    </button>
  );
}
