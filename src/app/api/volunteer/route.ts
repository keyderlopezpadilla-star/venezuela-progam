import { NextResponse } from 'next/server';
import { volunteerSchema } from '@/lib/validators';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { audit } from '@/lib/audit';
import { apiLimiter } from '@/lib/rate-limit';
import { headers } from 'next/headers';
import { sendEmail } from '@/lib/email';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0] || 'unknown';
  if (!apiLimiter.take(`volunteer:${ip}`)) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  const session = await auth();

  let json: unknown;
  try { json = await req.json(); } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }); }

  const parsed = volunteerSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  // Si no hay usuario autenticado, creamos uno con rol DONOR por defecto y un email provisional.
  let userId = session?.user?.id;
  if (!userId && data.bio) {
    // Email provisional basado en teléfono; el usuario lo actualizará al verificar.
    const tmpEmail = `volunteer-${Date.now()}@pending.venezuelasolidaria.org`;
    const user = await db.user.create({
      data: {
        email: tmpEmail,
        name: undefined,
        role: 'VOLUNTEER',
        status: 'PENDING',
      },
    });
    userId = user.id;
  }

  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const profile = await db.volunteerProfile.create({
    data: {
      userId,
      bio: data.bio,
      skills: data.skills,
      languages: data.languages,
      availability: data.availability,
      hasVehicle: data.hasVehicle,
      city: data.city,
      state: data.state,
      country: data.country,
      emergencyContact: data.emergencyContact,
      emergencyPhone: data.emergencyPhone,
      status: 'REGISTERED',
    },
  });

  await audit({
    userId,
    action: 'volunteer.registered',
    resource: 'volunteer',
    resourceId: profile.id,
  });

  await sendEmail({
    to: process.env.EMAIL_REPLY_TO || 'coordinacion@venezuelasolidaria.org',
    subject: `Nuevo voluntario registrado`,
    html: `<p>Nuevo voluntario en ${data.city}, ${data.state}. Habilidades: ${data.skills.join(', ')}.</p>`,
  });

  return NextResponse.json({ ok: true });
}
