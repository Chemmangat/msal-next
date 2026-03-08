import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // TODO: Replace with your custom domain (e.g., 'https://msalnext.com')
  const baseUrl = 'https://msal.chemmangathari.in';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}
