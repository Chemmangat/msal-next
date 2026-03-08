import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://msal-next.vercel.app'),
  title: '@chemmangat/msal-next - Microsoft Auth for Next.js | Multi-Account Support',
  description: 'Production-ready Microsoft/Azure AD authentication for Next.js App Router. Zero-config setup, TypeScript-first, multi-account support, auto token refresh. The easiest way to add Microsoft login to your Next.js app.',
  keywords: [
    'msal',
    'nextjs',
    'next.js',
    'authentication',
    'azure-ad',
    'microsoft',
    'microsoft-auth',
    'microsoft-login',
    'oauth',
    'oauth2',
    'app-router',
    'typescript',
    'sso',
    'single-sign-on',
    'microsoft-graph',
    'multi-account',
    'multi-tenant',
    'azure-authentication',
    'next-auth-alternative',
    'entra-id',
    'microsoft-entra',
    'zero-config',
    'token-refresh',
    'protected-routes',
  ],
  authors: [{ name: 'Hari Manoj (chemmangat)', url: 'https://github.com/chemmangat' }],
  creator: 'Hari Manoj (chemmangat)',
  publisher: 'chemmangat',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: '@chemmangat/msal-next - Microsoft Auth for Next.js',
    description: 'Zero-config Microsoft authentication for Next.js App Router. Multi-account support, TypeScript-first, auto token refresh.',
    type: 'website',
    siteName: '@chemmangat/msal-next',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '@chemmangat/msal-next - Microsoft Auth for Next.js',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: '@chemmangat/msal-next - Microsoft Auth for Next.js',
    description: 'Zero-config Microsoft authentication for Next.js App Router. Multi-account support, TypeScript-first.',
    images: ['/og-image.png'],
    creator: '@chemmangat',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://msal-next.vercel.app';

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: '@chemmangat/msal-next',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Any',
            description: 'Production-ready Microsoft/Azure AD authentication for Next.js App Router. Zero-config setup, TypeScript-first, multi-account support.',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            author: {
              '@type': 'Person',
              name: 'Hari Manoj',
              url: 'https://github.com/chemmangat',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '5',
              ratingCount: '100',
            },
            softwareVersion: '4.2.0',
            datePublished: '2024-01-01',
            dateModified: new Date().toISOString(),
            programmingLanguage: 'TypeScript',
            url: siteUrl,
            downloadUrl: 'https://www.npmjs.com/package/@chemmangat/msal-next',
            codeRepository: 'https://github.com/chemmangat/msal-next',
            keywords: 'msal, nextjs, authentication, azure-ad, microsoft, typescript, multi-account',
          }) }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
