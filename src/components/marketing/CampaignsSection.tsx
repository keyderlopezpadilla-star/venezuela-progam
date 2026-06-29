'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowRight, MapPin, Clock, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

const CAMPAIGNS = [
  {
    slug: 'inundaciones-zulia',
    title: 'Inundaciones en el Zulia',
    description: 'Familias damnificadas por las crecidas del Lago de Maracaibo.',
    region: 'Zulia',
    goal: 80_000,
    raised: 62_400,
    donors: 1_240,
    daysLeft: 12,
    priority: 'CRITICAL',
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'agua-potable-andes',
    title: 'Agua potable para los Andes',
    description: 'Suministro y potabilización en zonas rurales de Mérida y Táchira.',
    region: 'Mérida',
    goal: 45_000,
    raised: 31_900,
    donors: 845,
    daysLeft: 21,
    priority: 'HIGH',
    image: 'https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'medicamentos-caracas',
    title: 'Medicamentos para Caracas',
    description: 'Insumos médicos para comunidades vulnerables en zonas populares.',
    region: 'Distrito Capital',
    goal: 60_000,
    raised: 48_200,
    donors: 1_104,
    daysLeft: 30,
    priority: 'MEDIUM',
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'voluntariado-oriente',
    title: 'Red de voluntarios del Oriente',
    description: 'Capacitación y logística para envíos hacia Sucre, Monagas y Bolívar.',
    region: 'Oriente',
    goal: 25_000,
    raised: 12_300,
    donors: 380,
    daysLeft: 45,
    priority: 'LOW',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
  },
];

const priorityVariant: Record<string, 'emergency' | 'secondary' | 'accent' | 'default'> = {
  CRITICAL: 'emergency',
  HIGH: 'secondary',
  MEDIUM: 'accent',
  LOW: 'default',
};

export function CampaignsSection({ locale }: { locale: string }) {
  const t = useTranslations('campaigns');

  return (
    <section className="py-24">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <h2 className="font-display text-display-md text-balance">Campañas activas</h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              {t('subtitle')}
            </p>
          </div>
          <Button asChild variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
            <Link href={`/${locale}/campaigns`}>Ver todas</Link>
          </Button>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {CAMPAIGNS.map((c) => {
            const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
            return (
              <motion.div
                key={c.slug}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
              >
                <Card className="card-hover group overflow-hidden border-border/60 h-full">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                    <div className="absolute left-3 top-3">
                      <Badge variant={priorityVariant[c.priority]} className="bg-white/90 text-foreground dark:bg-card/90">
                        {c.priority === 'CRITICAL' && 'Crítica'}
                        {c.priority === 'HIGH' && 'Alta'}
                        {c.priority === 'MEDIUM' && 'Media'}
                        {c.priority === 'LOW' && 'Estable'}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-foreground">
                      <MapPin className="h-3 w-3" />
                      {c.region}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-display text-lg font-semibold tracking-tight line-clamp-2 text-balance">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2 text-pretty">
                      {c.description}
                    </p>
                    <div className="mt-5 space-y-2">
                      <div className="flex items-baseline justify-between text-sm">
                        <span className="font-semibold tabular-nums">{formatCurrency(c.raised)}</span>
                        <span className="text-muted-foreground">
                          {t('goal')} {formatCurrency(c.goal)}
                        </span>
                      </div>
                      <Progress value={pct} indicatorClassName="bg-gradient-hero" />
                    </div>
                    <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" /> {c.donors.toLocaleString()} donantes
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {c.daysLeft} días
                      </span>
                    </div>
                    <Button asChild size="sm" className="mt-5 w-full">
                      <Link href={`/${locale}/campaigns/${c.slug}`}>{t('donate')}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}