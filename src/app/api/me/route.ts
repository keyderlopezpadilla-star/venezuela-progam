import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const [donations, count, profile] = await Promise.all([
    db.donation.findMany({
      where: { donorUserId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, trackingCode: true, amount: true, currency: true, status: true, createdAt: true },
    }),
    db.donation.count({ where: { donorUserId: session.user.id } }),
    db.volunteerProfile.findUnique({ where: { userId: session.user.id } }),
  ]);

  const total = await db.donation.aggregate({
    where: { donorUserId: session.user.id, status: 'COMPLETED' },
    _sum: { amount: true },
  });

  return NextResponse.json({
    name: session.user.name,
    email: session.user.email,
    totalDonated: total._sum.amount?.toString() ?? '0',
    donationsCount: count,
    hoursLogged: profile?.totalHours ?? 0,
    recent: donations,
  });
}