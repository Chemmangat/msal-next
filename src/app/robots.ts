import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // TODO: Replace with your custom domain (e.g., 'https://msalnext.com')
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://msal-next.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
