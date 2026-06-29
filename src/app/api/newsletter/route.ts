import { NextResponse } from 'next/server';
import { z } from 'zod';
import { newsletterSchema } from '@/lib/validators';
import { sendEmail } from '@/lib/email';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get('email') ?? '');
  const parsed = newsletterSchema.safeParse({ email });
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }
  await sendEmail({
    to: parsed.data.email,
    subject: 'Bienvenida a Venezuela Solidaria',
    html: `<h1>Gracias por suscribirte</h1><p>Recibirás actualizaciones transparentes sobre entregas y campañas.</p>`,
    text: 'Gracias por suscribirte a Venezuela Solidaria.',
  });
  return NextResponse.json({ ok: true });
}