import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!['ADMIN', 'SUPER_ADMIN'].includes((session.user as any).role)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    todayAgg,
    activeVolunteers,
    inTransit,
    warehouseCount,
    critical,
    total,
    recentDonations,
    criticalRequests,
  ] = await Promise.all([
    db.donation.aggregate({
      where: { createdAt: { gte: startOfDay }, status: 'COMPLETED' },
      _sum: { amount: true },
    }),
    db.volunteerProfile.count({ where: { status: 'ACTIVE' } }),
    db.delivery.count({ where: { status: 'IN_TRANSIT' } }),
    db.warehouse.count({ where: { isActive: true } }),
    db.helpRequest.count({ where: { urgency: 'CRITICAL', status: { not: 'RESOLVED' } } }),
    db.donation.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } }),
    db.donation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: { id: true, trackingCode: true, donorName: true, amount: true, createdAt: true },
    }),
    db.helpRequest.findMany({
      where: { urgency: 'CRITICAL', status: { not: 'RESOLVED' } },
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: { id: true, trackingCode: true, fullName: true, city: true, urgency: true },
    }),
  ]);

  return NextResponse.json({
    todayDonations: todayAgg._sum.amount?.toString() ?? '0',
    activeVolunteers,
    inTransit,
    warehouses: warehouseCount,
    criticalHelp: critical,
    totalRaised: total._sum.amount?.toString() ?? '0',
    recentDonations,
    criticalRequests,
  });
}