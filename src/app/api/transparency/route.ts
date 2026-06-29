import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * Endpoint público de transparencia — alimenta el dashboard.
 * Devuelve agregados que NO exponen datos personales.
 */
export const runtime = 'nodejs';
export const revalidate = 60; // ISR cada 60s.

export async function GET() {
  const [donationsAgg, deliveriesAgg, byCategory, byMonth] = await Promise.all([
    db.donation.aggregate({
      _sum: { amount: true },
      _count: { _all: true },
      where: { status: 'COMPLETED' },
    }),
    db.delivery.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
    db.donation.groupBy({
      by: ['campaignId'],
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    }),
    db.$queryRaw<
      { month: string; total: number }[]
    >`
      SELECT TO_CHAR("completedAt", 'YYYY-MM') AS month,
             SUM(amount)::float AS total
      FROM donations
      WHERE status = 'COMPLETED'
      GROUP BY month
      ORDER BY month ASC
      LIMIT 12;
    `,
  ]);

  return NextResponse.json({
    totalRaised: donationsAgg._sum.amount?.toString() ?? '0',
    donationsCount: donationsAgg._count._all,
    deliveriesByStatus: deliveriesAgg.map((d) => ({
      status: d.status,
      count: d._count._all,
    })),
    donationsByCampaign: byCategory.map((c) => ({
      campaignId: c.campaignId,
      total: c._sum.amount?.toString() ?? '0',
    })),
    donationsByMonth: byMonth,
    generatedAt: new Date().toISOString(),
  });
}