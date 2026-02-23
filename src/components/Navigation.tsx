'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Github } from 'lucide-react';
import Link from 'next/link';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-dark-surface/95 backdrop-blur-lg border-b border-dark-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold text-gradient">@chemmangat/msal-next</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-dark-muted hover:text-dark-text transition-colors">
              Home
            </Link>
            <Link href="/docs" className="text-dark-muted hover:text-dark-text transition-colors">
              Documentation
            </Link>
            <a
              href="https://github.com/chemmangat/msal-next"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-muted hover:text-dark-text transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.npmjs.com/package/@chemmangat/msal-next"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-accent-primary hover:bg-accent-primary/90 text-white rounded-lg transition-colors text-sm font-medium"
            >
              npm
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-dark-text"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-dark-surface border-t border-dark-border">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              className="block text-dark-muted hover:text-dark-text transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/docs"
              className="block text-dark-muted hover:text-dark-text transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Documentation
            </Link>
            <a
              href="https://github.com/chemmangat/msal-next"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-dark-muted hover:text-dark-text transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/@chemmangat/msal-next"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-dark-muted hover:text-dark-text transition-colors"
            >
              npm Package
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
