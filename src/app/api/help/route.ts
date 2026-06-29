import { NextResponse } from 'next/server';
import { helpRequestSchema } from '@/lib/validators';
import { db } from '@/lib/db';
import { generateTrackingCode } from '@/lib/utils';
import { audit } from '@/lib/audit';
import { apiLimiter } from '@/lib/rate-limit';
import { headers } from 'next/headers';
import { sendEmail } from '@/lib/email';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0] || 'unknown';
  if (!apiLimiter.take(`help:${ip}`)) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  let json: unknown;
  try { json = await req.json(); } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }); }

  const parsed = helpRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const trackingCode = generateTrackingCode('HLP');

  const record = await db.helpRequest.create({
    data: {
      trackingCode,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      region: data.region,
      city: data.city,
      address: data.address,
      familySize: data.familySize,
      urgency: data.urgency,
      category: data.category,
      description: data.description,
      hasChildren: data.hasChildren,
      hasElderly: data.hasElderly,
      hasDisabled: data.hasDisabled,
      evidenceUrls: [],
    },
  });

  await audit({
    action: 'help.request.created',
    resource: 'help_request',
    resourceId: record.id,
    metadata: { trackingCode, urgency: data.urgency },
  });

  // Email notification (coordinadores).
  await sendEmail({
    to: process.env.EMAIL_REPLY_TO || 'coordinacion@venezuelasolidaria.org',
    subject: `Nueva solicitud de ayuda [${data.urgency}] - ${trackingCode}`,
    html: `<h2>Nueva solicitud de ayuda</h2>
      <p><strong>${data.fullName}</strong> · ${data.phone}</p>
      <p>${data.region}, ${data.city} · Familia: ${data.familySize}</p>
      <p>Categoría: ${data.category} · Urgencia: <strong>${data.urgency}</strong></p>
      <p>${data.description}</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/es/admin/help-requests">Ver panel</a></p>`,
  });

  return NextResponse.json({ trackingCode, id: record.id });
}
