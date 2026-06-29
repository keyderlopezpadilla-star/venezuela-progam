import type { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export const revalidate = 3600;

const locales = ['es', 'en', 'pt'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  let campaigns: { slug: string; updatedAt: Date }[] = [];
  try {
    campaigns = await db.campaign.findMany({
      where: { status: 'ACTIVE' },
      select: { slug: true, updatedAt: true },
    });
  } catch {
    // DB not available during build — return static routes only
  }

  const routes = ['', '/donate', '/volunteer', '/help', '/transparency', '/track', '/campaigns', '/about', '/privacy', '/terms'];

  const urls: MetadataRoute.Sitemap = routes.flatMap((r) =>
    locales.map((l) => ({
      url: `${base}/${l}${r}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: r === '' ? 1.0 : 0.7,
    }))
  );

  const campaignUrls: MetadataRoute.Sitemap = campaigns.flatMap((c) =>
    locales.map((l) => ({
      url: `${base}/${l}/campaigns/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.6,
    }))
  );

  return [...urls, ...campaignUrls];
}
