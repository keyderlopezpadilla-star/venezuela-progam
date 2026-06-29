import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY && process.env.NODE_ENV === 'production') {
  // No throw: el cliente es opcional. Solo advertimos.
  console.warn('[email] RESEND_API_KEY no configurada');
}

export const resend = new Resend(process.env.RESEND_API_KEY || '');

export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL || 'noreply@venezuelasolidaria.org';
export const EMAIL_REPLY_TO = process.env.RESEND_REPLY_TO || 'contacto@venezuelasolidaria.org';

export type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export async function sendEmail({ to, subject, html, text, replyTo }: SendArgs) {
  if (!process.env.RESEND_API_KEY) {
    console.info('[email] dry-run:', { to, subject });
    return { id: 'dry-run' };
  }
  return resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    html,
    text,
    replyTo: replyTo || EMAIL_REPLY_TO,
  });
}
