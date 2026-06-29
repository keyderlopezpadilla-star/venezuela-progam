import Stripe from 'stripe';

/**
 * Cliente Stripe singleton (server-side).
 * Mantenemos el tipado en versión API específica para evitar deprecations.
 */
if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
  throw new Error('STRIPE_SECRET_KEY is required in production');
}

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ?? '',
  {
    apiVersion: '2024-10-28.acacia' as any,
    typescript: true,
    appInfo: {
      name: 'Venezuela Solidaria',
      version: '1.0.0',
    },
  }
);

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? '';
