'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, Receipt, Clock, Award, Settings, CreditCard, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

export function DashboardView({ locale }: { locale: string }) {
  const t = useTranslations('dashboard');
  const { data } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await fetch('/api/me');
      if (!res.ok) return null;
      return res.json();
    },
  });

  const stats = [
    { label: t('totalDonated'), value: data?.totalDonated ?? 1_240, isCurrency: true },
    { label: t('donationsCount'), value: data?.donationsCount ?? 18 },
    { label: t('hoursLogged'), value: data?.hoursLogged ?? 24 },
    { label: t('certificate'), value: 'Activo' },
  ];

  return (
    <div className="pt-32 pb-24">
      <div className="container">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display-md">{t('welcome', { name: data?.name || 'María' })}</h1>
            <p className="mt-1 text-muted-foreground">Aquí ves el resumen de tu actividad.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline"><Link href={`/${locale}/dashboard/settings`}><Settings className="mr-2 h-4 w-4" />{t('settings')}</Link></Button>
          </div>
        </header>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card>
                <CardContent className="p-6">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
                  <p className="mt-2 font-display text-3xl font-semibold">
                    {s.isCurrency ? formatCurrency(Number(s.value)) : s.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Mis donaciones recientes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(data?.recent ?? FALLBACK_DONATIONS).map((d: any) => (
                <div key={d.trackingCode} className="flex items-center justify-between rounded-2xl border border-border p-4">
                  <div>
                    <p className="font-mono text-sm font-bold tracking-wider">{d.trackingCode}</p>
                    <p className="text-xs text-muted-foreground">{new Date(d.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={d.status === 'COMPLETED' ? 'success' : 'default'}>{d.status}</Badge>
                    <span className="font-semibold">{formatCurrency(Number(d.amount), d.currency)}</span>
                    <Button asChild variant="ghost" size="icon"><Link href={`/${locale}/track?code=${d.trackingCode}`}><ChevronRight className="h-4 w-4" /></Link></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Receipt className="h-4 w-4" />Recibos fiscales</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Generamos tu recibo anual automáticamente. Lo recibirás en febrero.
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-4 w-4" />Certificado</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Descarga tu certificado oficial de voluntariado y donaciones.
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-4 w-4" />Métodos de pago</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Gestiona tus tarjetas guardadas para donaciones rápidas.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

const FALLBACK_DONATIONS = [
  { trackingCode: 'VZS-A7K9-P2QM', amount: 50, currency: 'USD', status: 'COMPLETED', createdAt: new Date().toISOString() },
  { trackingCode: 'VZS-B3H8-Q1XL', amount: 25, currency: 'USD', status: 'COMPLETED', createdAt: new Date(Date.now() - 86400_000 * 12).toISOString() },
  { trackingCode: 'VZS-C9L2-Z4NJ', amount: 100, currency: 'USD', status: 'IN_TRANSIT', createdAt: new Date(Date.now() - 86400_000 * 32).toISOString() },
];