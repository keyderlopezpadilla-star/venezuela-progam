'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { donationSchema, type DonationInput } from '@/lib/validators';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/lib/utils';
import { copy } from '@/config/copy';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface Props {
  amount: number;
  type: 'ONE_TIME' | 'MONTHLY' | 'CORPORATE' | 'ANONYMOUS';
  campaignId: string | null;
}

export function DonationForm({ amount, type, campaignId }: Props) {
  const t = useTranslations('donate');
  const [step, setStep] = useState<'info' | 'pay' | 'done'>('info');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);
  const [donationId, setDonationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DonationInput>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount,
      currency: 'USD',
      type: type === 'ANONYMOUS' ? 'ANONYMOUS' : type === 'MONTHLY' ? 'RECURRING' : 'ONE_TIME',
      isAnonymous: type === 'ANONYMOUS',
      coverFees: false,
      campaignId,
    },
  });

  const onSubmitInfo = async (data: DonationInput) => {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, amount: Number(amount), campaignId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error');
      setClientSecret(json.clientSecret);
      setTrackingCode(json.trackingCode);
      setDonationId(json.donationId);
      setStep('pay');
    } catch (e: any) {
      setError(e.message || 'No se pudo iniciar el pago.');
    } finally {
      setSubmitting(false);
    }
  };

  const isAnonymous = type === 'ANONYMOUS' || watch('isAnonymous');

  return (
    <div className="mt-8">
      <AnimatePresence mode="wait">
        {step === 'info' && (
          <motion.form
            key="info"
            onSubmit={handleSubmit(onSubmitInfo)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="donorName">{t('name')}</Label>
                <Input id="donorName" placeholder="Tu nombre" {...register('donorName')} invalid={!!errors.donorName} />
              </div>
              <div>
                <Label htmlFor="donorEmail">{t('email')}</Label>
                <Input id="donorEmail" type="email" placeholder="tu@email.com" {...register('donorEmail')} invalid={!!errors.donorEmail} />
              </div>
            </div>

            <div>
              <Label htmlFor="message">{t('message')}</Label>
              <Textarea id="message" rows={3} placeholder="..." {...register('message')} />
            </div>

            {type !== 'ANONYMOUS' && (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register('isAnonymous')} className="h-4 w-4 rounded border-border" />
                <span>{t('anonymous')}</span>
              </label>
            )}

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register('coverFees')} className="h-4 w-4 rounded border-border" />
              <span>{t('fees')} (+3%)</span>
            </label>

            <div className="rounded-2xl bg-muted/50 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span>Donación</span>
                <span className="font-semibold">{formatCurrency(amount)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>Procesamiento seguro</span>
                <span>Stripe · TLS 1.3</span>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-emergency/30 bg-emergency/5 p-3 text-sm text-emergency-600">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" loading={submitting} rightIcon={<ArrowRight className="h-4 w-4" />}>
              {t('continueToPayment')}
            </Button>
          </motion.form>
        )}

        {step === 'pay' && clientSecret && (
          <motion.div
            key="pay"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
              <PaymentStep
                amount={amount}
                trackingCode={trackingCode}
                onSuccess={() => setStep('done')}
              />
            </Elements>
          </motion.div>
        )}

        {step === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-8"
          >
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-secondary/15">
              <CheckCircle2 className="h-8 w-8 text-secondary-600" />
            </div>
            <h3 className="mt-6 font-display text-2xl font-semibold">{t('thanks')}</h3>
            <p className="mt-2 text-muted-foreground">{t('code')}</p>
            <p className="mt-3 font-mono text-2xl font-bold tracking-wider">{trackingCode}</p>
            <p className="mt-6 text-sm text-muted-foreground">
              Recibirás un comprobante y fotos de la entrega asociada a tu donación.
            </p>
            {trackingCode && (
              <Button asChild variant="outline" size="lg" className="mt-8">
                <a href={`/${copy.defaultLocale}/track?code=${trackingCode}`}>Seguir mi donación</a>
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PaymentStep({
  amount,
  trackingCode,
  onSuccess,
}: {
  amount: number;
  trackingCode: string | null;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);
    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/${copy.defaultLocale}/track?code=${trackingCode}`,
      },
      redirect: 'if_required',
    });
    if (submitError) {
      setError(submitError.message ?? 'Pago fallido');
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    onSuccess();
  };

  return (
    <form onSubmit={onPay} className="space-y-5">
      <PaymentElement options={{ layout: 'tabs' }} />
      {error && (
        <div className="rounded-2xl border border-emergency/30 bg-emergency/5 p-3 text-sm text-emergency-600">
          {error}
        </div>
      )}
      <Button type="submit" size="lg" className="w-full" loading={submitting}>
        Donar {formatCurrency(amount)} ahora
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Al donar aceptas nuestros Términos y Política de Privacidad.
      </p>
    </form>
  );
}