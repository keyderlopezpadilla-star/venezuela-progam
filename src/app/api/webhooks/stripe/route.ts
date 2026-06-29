import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { audit } from '@/lib/audit';
import { headers } from 'next/headers';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'missing signature' }, { status: 400 });

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET ?? ''
    );

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as any;
        await db.donation.updateMany({
          where: { stripePaymentIntent: pi.id },
          data: {
            status: 'COMPLETED',
            receiptUrl: pi.charges?.data?.[0]?.receipt_url,
            completedAt: new Date(),
          },
        });
        const donation = await db.donation.findFirst({
          where: { stripePaymentIntent: pi.id },
          select: { id: true, trackingCode: true, amount: true, donorEmail: true, donorName: true, donorUserId: true },
        });
        if (donation) {
          await audit({
            userId: donation.donorUserId,
            action: 'donation.completed',
            resource: 'donation',
            resourceId: donation.id,
            metadata: { amount: donation.amount, trackingCode: donation.trackingCode },
            severity: 'info',
          });
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as any;
        await db.donation.updateMany({
          where: { stripePaymentIntent: pi.id },
          data: { status: 'FAILED' },
        });
        break;
      }
      case 'charge.refunded': {
        const ch = event.data.object as any;
        await db.donation.updateMany({
          where: { stripeChargeId: ch.id },
          data: { status: 'REFUNDED' },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('webhook error', err);
    return NextResponse.json({ error: 'webhook error' }, { status: 400 });
  }
}