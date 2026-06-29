import { NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validators';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/lib/email';
import { audit } from '@/lib/audit';
import { apiLimiter } from '@/lib/rate-limit';
import { headers } from 'next/headers';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0] || 'unknown';
  if (!apiLimiter.take(`register:${ip}`)) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  let json: unknown;
  try { json = await req.json(); } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }); }

  const parsed = registerSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', details: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return NextResponse.json({ error: 'email_in_use' }, { status: 409 });

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const user = await db.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      passwordHash,
      role: 'DONOR',
      status: 'PENDING',
    },
  });

  // Enviar email de verificación (placeholder: link simbólico).
  await sendEmail({
    to: user.email,
    subject: 'Verifica tu email · Venezuela Solidaria',
    html: `<h1>Bienvenida/o ${user.name}</h1><p>Verifica tu email para activar tu cuenta: <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify?token=EMAIL_TOKEN">Verificar email</a></p>`,
  });

  await audit({
    userId: user.id,
    action: 'user.registered',
    resource: 'user',
    resourceId: user.id,
  });

  return NextResponse.json({ ok: true, id: user.id });
}
