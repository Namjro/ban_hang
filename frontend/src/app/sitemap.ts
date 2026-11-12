import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';
import {
  getServerPublicCategories,
  getServerSitemapProducts,
} from '@/services/server-public.service';

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

  const categories = await getServerPublicCategories();
  const categoryRoutes: MetadataRoute.Sitemap = categories
    .filter((cat) => Boolean(cat.slug))
    .map((cat) => ({
      url: `${siteUrl}/products?category=${encodeURIComponent(cat.slug)}`,
      lastModified: cat.updated_at ? new Date(cat.updated_at) : now,
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

  const products = await getServerSitemapProducts();
  const productRoutes: MetadataRoute.Sitemap = products
    .filter((prod) => Boolean(prod.slug))
    .map((prod) => ({
      url: `${siteUrl}/products/${encodeURIComponent(prod.slug)}`,
      lastModified: prod.updated_at ? new Date(prod.updated_at) : now,
      changeFrequency: 'daily',
      priority: 0.9,
    }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
