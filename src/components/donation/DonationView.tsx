'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Heart, ShieldCheck, Lock, BadgeCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { formatCurrency } from '@/lib/utils';
import { DonationForm } from './DonationForm';

const PRESETS = [10, 25, 50, 100, 250, 500];

export function DonationView({ locale }: { locale: string }) {
  const t = useTranslations('donate');
  const [amount, setAmount] = useState<number>(50);
  const [type, setType] = useState<'ONE_TIME' | 'MONTHLY' | 'CORPORATE' | 'ANONYMOUS'>('ONE_TIME');
  const [campaignId, setCampaignId] = useState<string | null>(null);

  return (
    <div className="pt-32 pb-24">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Lado izquierdo: copy + hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start"
          >
            <Badge variant="glass" className="mb-4 px-4 py-1.5">
              <Heart className="h-3.5 w-3.5 fill-emergency text-emergency" />
              {t('title')}
            </Badge>
            <h1 className="font-display text-display-md text-balance">
              {t('subtitle')}
            </h1>

            <ul className="mt-8 space-y-4 text-sm">
              {[
                { Icon: ShieldCheck, label: 'Pago seguro con Stripe (PCI-DSS Nivel 1).' },
                { Icon: BadgeCheck, label: 'Código de seguimiento en cada donación.' },
                { Icon: Lock, label: 'No almacenamos datos de tarjeta.' },
              ].map(({ Icon, label }) => (
                <li key={label} className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-muted-foreground">{label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Impacto de tu donación</p>
              <ul className="mt-4 space-y-3 text-sm">
                <ImpactRow amount={10} text="Provee alimentos para 1 familia durante 3 días." />
                <ImpactRow amount={25} text="Suministra agua potable a 5 personas por 1 semana." />
                <ImpactRow amount={50} text="Cubre medicamentos básicos para 1 adulto mayor." />
                <ImpactRow amount={100} text="Habilita una ruta logística completa de entrega." />
              </ul>
            </div>
          </motion.div>

          {/* Lado derecho: formulario */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-soft-lg">
              {/* Tabs */}
              <div className="flex flex-wrap gap-2 rounded-full bg-muted p-1.5">
                {([
                  { v: 'ONE_TIME', l: t('oneTime') },
                  { v: 'MONTHLY', l: t('monthly') },
                  { v: 'CORPORATE', l: t('corporate') },
                  { v: 'ANONYMOUS', l: t('anonymous') },
                ] as const).map(({ v, l }) => (
                  <button
                    key={v}
                    onClick={() => setType(v)}
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      type === v ? 'bg-card shadow-soft text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {/* Presets */}
              <div className="mt-8">
                <p className="text-sm font-medium text-muted-foreground">{t('amount')}</p>
                <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {PRESETS.map((v) => (
                    <button
                      key={v}
                      onClick={() => setAmount(v)}
                      className={`rounded-2xl border py-3 text-sm font-semibold transition-all ${
                        amount === v
                          ? 'border-primary bg-primary text-primary-foreground shadow-soft'
                          : 'border-border bg-background hover:border-primary/40'
                      }`}
                    >
                      ${v}
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <input
                    type="number"
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value) || 0)}
                    placeholder={t('custom')}
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>≈ {formatCurrency(amount)} USD</span>
                  <span className="inline-flex items-center gap-1">
                    <Lock className="h-3 w-3" /> {t('secure')}
                  </span>
                </div>
              </div>

              {/* Selector de campaña */}
              <div className="mt-8">
                <label className="text-sm font-medium">{t('selectCampaign')}</label>
                <select
                  value={campaignId ?? ''}
                  onChange={(e) => setCampaignId(e.target.value || null)}
                  className="mt-2 h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                >
                  <option value="">{t('noCampaign')}</option>
                  <option value="inundaciones-zulia">Inundaciones en el Zulia</option>
                  <option value="agua-andes">Agua potable para los Andes</option>
                  <option value="medicamentos-caracas">Medicamentos para Caracas</option>
                </select>
              </div>

              <DonationForm
                amount={amount}
                type={type}
                campaignId={campaignId}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ImpactRow({ amount, text }: { amount: number; text: string }) {
  const active = true;
  return (
    <li className="flex items-center gap-3">
      <span
        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${
          active ? 'bg-secondary/10 text-secondary-600' : 'bg-muted text-muted-foreground'
        }`}
      >
        ${amount}
      </span>
      <span className="text-foreground/90">{text}</span>
    </li>
  );
}