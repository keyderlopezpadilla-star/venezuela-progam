import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const revalidate = 60;

export async function GET() {
  const campaigns = await db.campaign.findMany({
    where: { status: 'ACTIVE' },
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      slug: true,
      title: true,
      subtitle: true,
      description: true,
      coverImage: true,
      goal: true,
      raised: true,
      donors: true,
      priority: true,
      region: true,
      endDate: true,
      emergencyType: true,
      beneficiaries: true,
    },
  });
  return NextResponse.json({ campaigns });
}
