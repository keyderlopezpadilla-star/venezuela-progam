import { NextResponse } from 'next/server';
import { locales } from '@/i18n/request';
import { db } from '@/lib/db';

export const revalidate = 3600;

export async function GET() {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const campaigns = await db.campaign.findMany({
    where: { status: 'ACTIVE' },
    select: { slug: true, updatedAt: true },
  });

  const routes = ['', '/donate', '/volunteer', '/help', '/transparency', '/track', '/campaigns', '/about', '/privacy', '/terms'];

  const urls = routes.flatMap((r) =>
    locales.map((l) => ({
      loc: `${base}/${l}${r}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: r === '' ? 1.0 : 0.7,
    }))
  );

  const campaignUrls = campaigns.flatMap((c) =>
    locales.map((l) => ({
      loc: `${base}/${l}/campaigns/${c.slug}`,
      lastmod: c.updatedAt.toISOString(),
      changefreq: 'daily',
      priority: 0.6,
    }))
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...urls, ...campaignUrls]
  .map(
    (u) => `<url>
  <loc>${u.loc}</loc>
  <lastmod>${u.lastmod}</lastmod>
  <changefreq>${u.changefreq}</changefreq>
  <priority>${u.priority}</priority>
</url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
}