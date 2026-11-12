import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';
import {
  getServerPublicCategories,
  getServerSitemapProducts,
} from '@/services/server-public.service';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  try {
    const [categories, products] = await Promise.all([
      getServerPublicCategories().catch(() => []),
      getServerSitemapProducts().catch(() => []),
    ]);

    const categoryRoutes: MetadataRoute.Sitemap = (Array.isArray(categories) ? categories : [])
      .filter((cat) => Boolean(cat?.slug))
      .map((cat) => ({
        url: `${siteUrl}/products?category=${encodeURIComponent(cat.slug)}`,
        lastModified: cat.updated_at ? new Date(cat.updated_at) : now,
        changeFrequency: 'weekly',
        priority: 0.85,
      }));

    const productRoutes: MetadataRoute.Sitemap = (Array.isArray(products) ? products : [])
      .filter((prod) => Boolean(prod?.slug))
      .map((prod) => ({
        url: `${siteUrl}/products/${encodeURIComponent(prod.slug)}`,
        lastModified: prod.updated_at ? new Date(prod.updated_at) : now,
        changeFrequency: 'daily',
        priority: 0.9,
      }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch (err) {
    console.error('Failed to generate dynamic sitemap entries', err);
    return staticRoutes;
  }
}
