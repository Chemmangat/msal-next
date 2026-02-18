import { Github, Twitter, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-surface border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-lg font-bold text-gradient">@chemmangat/msal-next</span>
            </div>
            <p className="text-dark-muted text-sm max-w-md">
              Fully configurable MSAL authentication package for Next.js App Router. 
              Built with TypeScript, designed for developers.
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <a
                href="https://github.com/chemmangat/msal-next"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-muted hover:text-dark-text transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/chemmangat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-muted hover:text-dark-text transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-dark-text font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#docs" className="text-dark-muted hover:text-dark-text transition-colors text-sm">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#quickstart" className="text-dark-muted hover:text-dark-text transition-colors text-sm">
                  Quick Start
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/chemmangat/msal-next/tree/main/example"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-muted hover:text-dark-text transition-colors text-sm"
                >
                  Examples
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/chemmangat/msal-next/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-muted hover:text-dark-text transition-colors text-sm"
                >
                  Issues
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-dark-text font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/chemmangat/msal-next"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-muted hover:text-dark-text transition-colors text-sm"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/@chemmangat/msal-next"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-muted hover:text-dark-text transition-colors text-sm"
                >
                  npm
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/chemmangat/msal-next/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-muted hover:text-dark-text transition-colors text-sm"
                >
                  Contributing
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-dark-muted text-sm">
            © {new Date().getFullYear()} Chemmangat. Released under MIT License.
          </p>
          <p className="text-dark-muted text-sm flex items-center space-x-1 mt-4 md:mt-0">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for developers</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
