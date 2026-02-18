import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '@chemmangat/msal-next - MSAL Authentication for Next.js',
  description: 'Fully configurable MSAL authentication package for Next.js App Router. Simple, powerful, and production-ready.',
  keywords: ['msal', 'nextjs', 'authentication', 'azure-ad', 'microsoft', 'oauth'],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: '@chemmangat/msal-next',
    description: 'Fully configurable MSAL authentication for Next.js App Router',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '@chemmangat/msal-next',
    description: 'Fully configurable MSAL authentication for Next.js App Router',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
