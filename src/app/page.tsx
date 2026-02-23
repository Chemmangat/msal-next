'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Check, Copy, Github, BookOpen, ArrowDown, Lock, Key, Shield, CheckCircle, Zap, Code2, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 20;
    const y = (clientY / window.innerHeight - 0.5) * 20;
    setMousePosition({ x, y });
  };

  const copyInstall = () => {
    navigator.clipboard.writeText('npm install @chemmangat/msal-next');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-dark-bg" onMouseMove={handleMouseMove}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Cool Authentication Background */}
        <div className="absolute inset-0 overflow-hidden z-0">
          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-primary/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-secondary/8 rounded-full blur-3xl" />
          
          {/* Animated authentication elements */}
          <AuthBackground />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
            }}
            className="text-center space-y-8 mb-20"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-dark-elevated border border-dark-border rounded-full text-sm text-dark-muted"
            >
              <span className="w-2 h-2 bg-accent-success rounded-full animate-pulse" />
              <span>v1.2.1 - Now with SSR support & v3/v4 compatibility</span>
            </motion.div>

            {/* Main heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className="text-dark-text">MSAL for Next.js</span>
              <br />
              <span className="text-gradient">Made Simple</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl text-dark-muted max-w-2xl mx-auto px-4">
              Production-ready Microsoft authentication for Next.js App Router.
              <br className="hidden sm:block" />
              Three steps. Five minutes. Zero complexity.
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 px-4"
            >
              <a
                href="/docs"
                className="w-full sm:w-auto group px-6 sm:px-8 py-3 sm:py-4 bg-accent-primary hover:bg-accent-primary/90 text-white rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Documentation</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://github.com/chemmangat/msal-next"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-dark-elevated hover:bg-dark-border text-dark-text rounded-lg font-semibold transition-all border border-dark-border flex items-center justify-center space-x-2"
              >
                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>GitHub</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Flow Chart - Actual Setup Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{
              transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
            }}
            className="max-w-4xl mx-auto"
          >
            <div className="space-y-6">
              {/* Step 1: Install */}
              <SetupStep
                number={1}
                title="Install"
                delay={0.6}
              >
                <div className="flex items-center bg-dark-bg border border-dark-border rounded-lg overflow-hidden">
                  <code className="px-6 py-4 text-accent-primary text-sm flex-1">
                    npm install @chemmangat/msal-next
                  </code>
                  <button
                    onClick={copyInstall}
                    className="px-4 py-4 border-l border-dark-border hover:bg-dark-elevated transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-accent-success" />
                    ) : (
                      <Copy className="w-4 h-4 text-dark-muted" />
                    )}
                  </button>
                </div>
              </SetupStep>

              <FlowArrow delay={0.7} />

              {/* Step 2: Wrap App */}
              <SetupStep
                number={2}
                title="Wrap your app"
                subtitle="app/layout.tsx"
                delay={0.8}
              >
                <CodeDisplay
                  code={`import { MsalAuthProvider } from '@chemmangat/msal-next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MsalAuthProvider clientId="your-client-id">
          {children}
        </MsalAuthProvider>
      </body>
    </html>
  );
}`}
                />
              </SetupStep>

              <FlowArrow delay={0.9} />

              {/* Step 3: Use Hook */}
              <SetupStep
                number={3}
                title="Use the hook"
                subtitle="app/page.tsx"
                delay={1.0}
              >
                <CodeDisplay
                  code={`'use client';
import { useMsalAuth } from '@chemmangat/msal-next';

export default function Home() {
  const { isAuthenticated, loginPopup } = useMsalAuth();

  return isAuthenticated ? (
    <h1>Welcome!</h1>
  ) : (
    <button onClick={() => loginPopup()}>Sign In</button>
  );
}`}
                />
              </SetupStep>

              {/* Done Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="flex justify-center pt-6"
              >
                <div className="inline-flex items-center space-x-2 px-6 py-3 bg-accent-success/10 border border-accent-success/30 rounded-full">
                  <Check className="w-5 h-5 text-accent-success" />
                  <span className="text-accent-success font-semibold">That's it! You're ready to go.</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            style={{
              transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`,
            }}
            className="mt-16 sm:mt-20 md:mt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
          >
            <FeatureCard
              title="Zero Config"
              description="Just add your client ID and you're ready to go. Sensible defaults for everything."
            />
            <FeatureCard
              title="TypeScript First"
              description="Full type definitions included. Autocomplete and type safety out of the box."
            />
            <FeatureCard
              title="Production Ready"
              description="Built-in token refresh, error handling, and security best practices."
            />
          </motion.div>
        </div>
      </section>

      {/* Why This Package Section */}
      <WhyThisPackage />
    </div>
  );
}

function SetupStep({
  number,
  title,
  subtitle,
  delay,
  children,
}: {
  number: number;
  title: string;
  subtitle?: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative"
    >
      <div className="bg-dark-elevated border border-dark-border rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-accent-primary/50 transition-all">
        <div className="flex items-center gap-3 sm:gap-4 mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-base sm:text-lg">{number}</span>
          </div>
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-dark-text truncate">{title}</h3>
            {subtitle && <p className="text-xs sm:text-sm text-dark-muted truncate">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </motion.div>
  );
}

function FlowArrow({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
      className="flex justify-center"
    >
      <ArrowDown className="w-6 h-6 text-accent-primary" />
    </motion.div>
  );
}

function CodeDisplay({ code }: { code: string }) {
  return (
    <div className="bg-dark-bg border border-dark-border rounded-lg sm:rounded-xl overflow-hidden">
      <div className="p-3 sm:p-4 overflow-x-auto">
        <pre className="text-xs sm:text-sm">
          <code className="text-dark-text">{code}</code>
        </pre>
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-dark-elevated border border-dark-border rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-accent-primary/50 transition-all">
      <h3 className="text-base sm:text-lg font-semibold text-dark-text mb-2">{title}</h3>
      <p className="text-sm text-dark-muted">{description}</p>
    </div>
  );
}

// Why This Package Section
function WhyThisPackage() {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('before');

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-dark-bg border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">
            <span className="text-dark-text">Why </span>
            <span className="text-gradient">@chemmangat/msal-next</span>
            <span className="text-dark-text">?</span>
          </h2>
          <p className="text-base sm:text-lg text-dark-muted max-w-2xl mx-auto px-4">
            Stop writing boilerplate. Start shipping features.
          </p>
        </motion.div>

        {/* Metrics Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16"
        >
          <MetricCard value="6 → 0" label="Boilerplate files" />
          <MetricCard value="~200 → ~30" label="Lines of code" />
          <MetricCard value="3 → 1" label="Packages to import" />
          <MetricCard value="0" label="Direct MSAL imports" />
        </motion.div>

        {/* Before/After Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-12 sm:mb-16"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-dark-text mb-4 sm:mb-6 text-center px-4">Before vs After</h3>
          
          {/* Tabs */}
          <div className="flex justify-center mb-4 sm:mb-6 px-4">
            <div className="inline-flex bg-dark-elevated border border-dark-border rounded-lg p-1 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('before')}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-md transition-all text-sm sm:text-base ${
                  activeTab === 'before'
                    ? 'bg-accent-primary text-white'
                    : 'text-dark-muted hover:text-dark-text'
                }`}
              >
                Before
              </button>
              <button
                onClick={() => setActiveTab('after')}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-md transition-all text-sm sm:text-base ${
                  activeTab === 'after'
                    ? 'bg-accent-primary text-white'
                    : 'text-dark-muted hover:text-dark-text'
                }`}
              >
                After
              </button>
            </div>
          </div>

          {/* Code Comparison */}
          <div className="bg-dark-elevated border border-dark-border rounded-xl overflow-hidden">
            {activeTab === 'before' ? (
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <span className="text-xs sm:text-sm text-dark-muted">~200 lines across 6 files</span>
                  <span className="text-xs px-3 py-1 bg-red-500/10 text-red-400 rounded-full w-fit">Complex</span>
                </div>
                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-dark-muted">
                  <div className="flex items-start gap-2">
                    <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Manually create <code className="text-accent-primary">PublicClientApplication</code> and track initialization with <code className="text-accent-primary">isInitialized</code> flag</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Write <code className="text-accent-primary">initializeMsal()</code>, <code className="text-accent-primary">signInWithPopup()</code>, <code className="text-accent-primary">signOut()</code>, <code className="text-accent-primary">getCurrentUser()</code>, <code className="text-accent-primary">isAuthenticated()</code> utility functions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Build a custom <code className="text-accent-primary">AuthProvider</code> with <code className="text-accent-primary">useState(isReady)</code> + <code className="text-accent-primary">useEffect</code> to call <code className="text-accent-primary">initializeMsal()</code></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Wrap children with <code className="text-accent-primary">&lt;MsalProvider instance={'{msalInstance}'}&gt;</code></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Write a <code className="text-accent-primary">useAuth</code> hook wrapping <code className="text-accent-primary">useMsal</code> from <code className="text-accent-primary">@azure/msal-react</code></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Import <code className="text-accent-primary">InteractionStatus</code> enum from <code className="text-accent-primary">@azure/msal-browser</code> and compare <code className="text-accent-primary">inProgress !== InteractionStatus.None</code></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Build bridge components to access MSAL instance outside React (e.g., Axios interceptors)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <span className="text-xs sm:text-sm text-dark-muted">~30 lines across 2 files</span>
                  <span className="text-xs px-3 py-1 bg-accent-success/10 text-accent-success rounded-full w-fit">Simple</span>
                </div>
                <CodeDisplay
                  code={`// app/layout.tsx
<MsalAuthProvider clientId="..." scopes={["User.Read"]}>
  {children}
</MsalAuthProvider>

// app/page.tsx
const { isAuthenticated, loginPopup, clearSession, inProgress } = useMsalAuth();

// Non-React code (API clients, middleware)
const instance = getMsalInstance();`}
                />
                <div className="mt-4 flex items-center gap-2 text-accent-success text-xs sm:text-sm">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Done. That's it.</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16"
        >
          <AdvantageCard
            icon={Zap}
            title="Zero Config"
            description="Just pass clientId and you're ready. Scopes, authority, cache — all have smart defaults."
          />
          <AdvantageCard
            icon={Code2}
            title="One Hook"
            description="useMsalAuth() replaces useMsal() + useAccount() + InteractionStatus enum checks."
          />
          <AdvantageCard
            icon={Shield}
            title="Silent Logout"
            description="clearSession() clears MSAL cache without triggering Microsoft's logout popup/redirect."
          />
          <AdvantageCard
            icon={Sparkles}
            title="Non-React Access"
            description="getMsalInstance() gives direct MSAL instance access for Axios interceptors and middleware."
          />
          <AdvantageCard
            icon={Check}
            title="SSR Safe"
            description="Handles server-side rendering internally. No typeof window checks needed in your code."
          />
          <AdvantageCard
            icon={Code2}
            title="Props-Based Config"
            description="No manual Configuration object construction. Pass clientId, authorityType, scopes as simple props."
          />
          <AdvantageCard
            icon={Sparkles}
            title="Pre-Built Button"
            description="<MicrosoftSignInButton /> with official Microsoft branding, dark/light variants, and loading state."
          />
          <AdvantageCard
            icon={Check}
            title="Full TypeScript"
            description="Complete type definitions with JSDoc comments. MsalAuthConfig, UseMsalAuthReturn exported."
          />
        </motion.div>

        {/* Elimination Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl sm:text-2xl font-bold text-dark-text mb-4 sm:mb-6 text-center px-4">What You No Longer Need to Write</h3>
          <div className="bg-dark-elevated border border-dark-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-dark-bg border-b border-dark-border">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-dark-text">What you used to write</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-dark-text">Now handled by</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border">
                  <EliminationRow
                    before="new PublicClientApplication(config)"
                    after="MsalAuthProvider"
                  />
                  <EliminationRow
                    before="await msalInstance.initialize()"
                    after="Automatic on mount"
                  />
                  <EliminationRow
                    before="isInitialized flag + isReady state"
                    after="Automatic"
                  />
                  <EliminationRow
                    before="signInWithPopup() wrapper"
                    after="loginPopup()"
                  />
                  <EliminationRow
                    before="Custom signOut() function"
                    after="clearSession()"
                  />
                  <EliminationRow
                    before="<MsalProvider instance={...}>"
                    after='<MsalAuthProvider clientId="..." />'
                  />
                  <EliminationRow
                    before="useMsal() + InteractionStatus enum"
                    after="useMsalAuth().inProgress (boolean)"
                  />
                  <EliminationRow
                    before="Bridge components for non-React access"
                    after="getMsalInstance()"
                  />
                  <EliminationRow
                    before="useAccount() + null checks"
                    after="useMsalAuth().account"
                  />
                  <EliminationRow
                    before="Token acquisition with fallback logic"
                    after="acquireToken() (auto silent→popup fallback)"
                  />
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-dark-elevated border border-dark-border rounded-lg sm:rounded-xl p-4 sm:p-6 text-center hover:border-accent-primary/50 transition-all">
      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient mb-2">{value}</div>
      <div className="text-xs sm:text-sm text-dark-muted">{label}</div>
    </div>
  );
}

function AdvantageCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="bg-dark-elevated border border-dark-border rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-accent-primary/50 transition-all">
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-lg flex items-center justify-center mb-3 sm:mb-4">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </div>
      <h4 className="text-base sm:text-lg font-semibold text-dark-text mb-2">{title}</h4>
      <p className="text-xs sm:text-sm text-dark-muted">{description}</p>
    </div>
  );
}

function EliminationRow({ before, after }: { before: string; after: string }) {
  return (
    <tr className="hover:bg-dark-bg/50 transition-colors">
      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-dark-muted">
        <code className="text-accent-primary break-all">{before}</code>
      </td>
      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-accent-success flex-shrink-0" />
          <code className="text-accent-primary break-all">{after}</code>
        </div>
      </td>
    </tr>
  );
}

// Animated Authentication Background
function AuthBackground() {
  const floatingElements = [
    { icon: Lock, x: '10%', y: '20%', delay: 0, duration: 20 },
    { icon: Key, x: '85%', y: '15%', delay: 2, duration: 25 },
    { icon: Shield, x: '15%', y: '70%', delay: 4, duration: 22 },
    { icon: CheckCircle, x: '80%', y: '75%', delay: 1, duration: 24 },
    { icon: Lock, x: '50%', y: '10%', delay: 3, duration: 26 },
    { icon: Key, x: '90%', y: '50%', delay: 5, duration: 23 },
    { icon: Shield, x: '5%', y: '45%', delay: 6, duration: 21 },
    { icon: CheckCircle, x: '95%', y: '30%', delay: 7, duration: 27 },
    { icon: Lock, x: '30%', y: '85%', delay: 8, duration: 24 },
    { icon: Key, x: '70%', y: '5%', delay: 9, duration: 22 },
  ];

  return (
    <>
      {/* Floating authentication icons */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute pointer-events-none"
          style={{ left: element.x, top: element.y }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.sin(index) * 20, 0],
            opacity: [0.1, 0.25, 0.1],
            scale: [1, 1.3, 1],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut",
          }}
        >
          <element.icon className="w-10 h-10 text-accent-primary" />
        </motion.div>
      ))}

      {/* Animated connection lines - more of them */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.12 }}>
        {/* Primary connections */}
        <motion.line
          x1="10%" y1="20%" x2="50%" y2="50%"
          stroke="url(#gradient1)" strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.line
          x1="85%" y1="15%" x2="50%" y2="50%"
          stroke="url(#gradient1)" strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2, ease: "easeInOut" }}
        />
        <motion.line
          x1="15%" y1="70%" x2="50%" y2="50%"
          stroke="url(#gradient1)" strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 4, ease: "easeInOut" }}
        />
        <motion.line
          x1="80%" y1="75%" x2="50%" y2="50%"
          stroke="url(#gradient1)" strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 6, ease: "easeInOut" }}
        />
        
        {/* Secondary connections */}
        <motion.line
          x1="10%" y1="20%" x2="85%" y2="15%"
          stroke="url(#gradient2)" strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1, ease: "easeInOut" }}
        />
        <motion.line
          x1="15%" y1="70%" x2="80%" y2="75%"
          stroke="url(#gradient2)" strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 3, ease: "easeInOut" }}
        />
        <motion.line
          x1="50%" y1="10%" x2="90%" y2="50%"
          stroke="url(#gradient1)" strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 9, repeat: Infinity, delay: 5, ease: "easeInOut" }}
        />
        
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Central authentication hub with pulse */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-accent-primary/30 to-accent-secondary/30 blur-3xl" />
      </motion.div>

      {/* More floating tokens/badges with varied sizes */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={`token-${i}`}
          className="absolute rounded-full pointer-events-none bg-accent-primary"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
          }}
          animate={{
            y: [0, -150 - Math.random() * 100, 0],
            x: [0, (Math.random() - 0.5) * 50, 0],
            opacity: [0, 0.4, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 12 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Multiple pulsing rings at different speeds */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        animate={{
          scale: [1, 2.2, 1],
          opacity: [0.2, 0, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeOut",
        }}
      >
        <div className="w-64 h-64 rounded-full border-2 border-accent-primary" />
      </motion.div>
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        animate={{
          scale: [1, 2.8, 1],
          opacity: [0.15, 0, 0.15],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          delay: 2,
          ease: "easeOut",
        }}
      >
        <div className="w-64 h-64 rounded-full border-2 border-accent-secondary" />
      </motion.div>
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        animate={{
          scale: [1, 3.5, 1],
          opacity: [0.1, 0, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          delay: 4,
          ease: "easeOut",
        }}
      >
        <div className="w-64 h-64 rounded-full border border-accent-primary" />
      </motion.div>

      {/* Orbiting elements around center */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`orbit-${i}`}
          className="absolute left-1/2 top-1/2 pointer-events-none"
          style={{
            width: '4px',
            height: '4px',
          }}
          animate={{
            rotate: [0, 360],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "linear",
            delay: i * 2,
          }}
        >
          <div 
            className="w-2 h-2 bg-accent-secondary rounded-full"
            style={{
              transform: `translate(${100 + i * 30}px, 0)`,
            }}
          />
        </motion.div>
      ))}

      {/* Diagonal moving particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`diagonal-${i}`}
          className="absolute w-1 h-1 bg-accent-primary rounded-full pointer-events-none"
          style={{
            left: `${i * 12}%`,
            top: '-5%',
          }}
          animate={{
            x: [0, 100],
            y: [0, typeof window !== 'undefined' ? window.innerHeight : 1000],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 2,
            ease: "linear",
          }}
        />
      ))}
    </>
  );
}
