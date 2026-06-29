import { NextResponse } from 'next/server';
import { z } from 'zod';
import { donationSchema } from '@/lib/validators';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { audit } from '@/lib/audit';
import { generateTrackingCode } from '@/lib/utils';
import { apiLimiter } from '@/lib/rate-limit';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  // Rate limit por IP.
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0] || 'unknown';
  if (!apiLimiter.take(`donate:${ip}`)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const session = await auth();
  let json: unknown;
  try { json = await req.json(); } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }); }

  const parsed = donationSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const trackingCode = generateTrackingCode();

  // Crear registro de donación pendiente.
  const donation = await db.donation.create({
    data: {
      trackingCode,
      amount: data.amount,
      currency: data.currency,
      type: data.type,
      status: 'PROCESSING',
      isAnonymous: data.isAnonymous,
      donorName: data.donorName,
      donorEmail: data.donorEmail,
      donorPhone: data.donorPhone,
      donorUserId: session?.user?.id,
      message: data.message,
      campaignId: data.campaignId || null,
    },
  });

  await audit({
    userId: session?.user?.id ?? null,
    action: 'donation.created',
    resource: 'donation',
    resourceId: donation.id,
    ipAddress: ip,
    userAgent: (await headers()).get('user-agent') ?? undefined,
    metadata: { amount: donation.amount, trackingCode },
  });

  // Crear PaymentIntent en Stripe.
  const intent = await stripe.paymentIntents.create({
    amount: Math.round(data.amount * 100),
    currency: data.currency.toLowerCase(),
    metadata: {
      donationId: donation.id,
      trackingCode,
      donorEmail: data.donorEmail ?? '',
    },
    description: `Donación VZS ${trackingCode}`,
    receipt_email: data.donorEmail || undefined,
  });

  await db.donation.update({
    where: { id: donation.id },
    data: { stripePaymentIntent: intent.id },
  });

  return NextResponse.json({
    donationId: donation.id,
    trackingCode,
    clientSecret: intent.client_secret,
  });
}