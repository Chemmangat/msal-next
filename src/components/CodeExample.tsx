'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CodeExample() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const examples = [
    {
      title: 'Setup Provider',
      description: 'Wrap your app with MsalAuthProvider',
      code: `// app/layout.tsx
import { MsalAuthProvider } from '@chemmangat/msal-next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MsalAuthProvider
          clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}
          scopes={['User.Read']}
        >
          {children}
        </MsalAuthProvider>
      </body>
    </html>
  );
}`,
    },
    {
      title: 'Use Authentication',
      description: 'Simple hooks for authentication',
      code: `// app/page.tsx
'use client';

import { useMsalAuth } from '@chemmangat/msal-next';

export default function Home() {
  const { isAuthenticated, account, loginPopup, logoutPopup } = useMsalAuth();

  if (!isAuthenticated) {
    return <button onClick={() => loginPopup()}>Sign In</button>;
  }

  return (
    <div>
      <h1>Hello, {account?.name}!</h1>
      <button onClick={() => logoutPopup()}>Sign Out</button>
    </div>
  );
}`,
    },
    {
      title: 'Call Protected APIs',
      description: 'Automatic token acquisition',
      code: `const { acquireToken } = useMsalAuth();

const fetchUserProfile = async () => {
  const token = await acquireToken(['User.Read']);
  
  const response = await fetch('https://graph.microsoft.com/v1.0/me', {
    headers: { Authorization: \`Bearer \${token}\` }
  });
  
  return response.json();
};`,
    },
  ];

  const copyToClipboard = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

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
            <span className="text-dark-text">See It In </span>
            <span className="text-gradient">Action</span>
          </h2>
          <p className="text-xl text-dark-muted max-w-3xl mx-auto">
            Three simple steps to add Microsoft authentication to your Next.js app.
          </p>
        </motion.div>

        <div className="space-y-8">
          {examples.map((example, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-dark-elevated border border-dark-border rounded-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
                <div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-dark-text">{example.title}</h3>
                  </div>
                  <p className="text-dark-muted text-sm mt-1 ml-11">{example.description}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(example.code, index)}
                  className="p-2 hover:bg-dark-border rounded-lg transition-colors"
                  title="Copy code"
                >
                  {copiedIndex === index ? (
                    <Check className="w-5 h-5 text-accent-success" />
                  ) : (
                    <Copy className="w-5 h-5 text-dark-muted" />
                  )}
                </button>
              </div>
              <div className="p-6">
                <pre className="overflow-x-auto">
                  <code className="text-sm text-dark-text">{example.code}</code>
                </pre>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
