import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-surface border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Brand */}
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-lg font-bold text-gradient">@chemmangat/msal-next</span>
            </div>
            <p className="text-dark-muted text-sm">
              MSAL authentication for Next.js App Router
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-8">
            <a
              href="/docs"
              className="text-dark-muted hover:text-dark-text transition-colors text-sm"
            >
              Documentation
            </a>
            <a
              href="https://github.com/chemmangat/msal-next"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-muted hover:text-dark-text transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.npmjs.com/package/@chemmangat/msal-next"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-muted hover:text-dark-text transition-colors text-sm"
            >
              npm
            </a>
          </div>
        </div>

        <div className="border-t border-dark-border mt-8 pt-8 text-center">
          <p className="text-dark-muted text-sm">
            © {new Date().getFullYear()} Chemmangat. Released under MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
}
