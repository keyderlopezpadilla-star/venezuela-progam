import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { apiLimiter } from '@/lib/rate-limit';
import { headers } from 'next/headers';

export const runtime = 'nodejs';

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0] || 'unknown';
  if (!apiLimiter.take(`track:${ip}`)) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  const { code } = await params;
  const donation = await db.donation.findUnique({
    where: { trackingCode: code },
    include: {
      campaign: { select: { title: true, region: true } },
      delivery: {
        select: {
          status: true,
          origin: true,
          destination: true,
          scheduledFor: true,
          completedAt: true,
          proofPhotoUrls: true,
        },
      },
    },
  });

  if (!donation) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  // No exponer datos sensibles si es anónima.
  return NextResponse.json({
    trackingCode: donation.trackingCode,
    status: donation.status,
    amount: donation.amount.toString(),
    currency: donation.currency,
    isAnonymous: donation.isAnonymous,
    donorName: donation.isAnonymous ? null : donation.donorName,
    createdAt: donation.createdAt,
    campaign: donation.campaign,
    delivery: donation.delivery,
  });
}