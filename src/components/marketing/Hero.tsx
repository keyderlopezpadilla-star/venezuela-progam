'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Lock, CheckCircle2, Play, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useTranslations } from 'next-intl';

export function Hero({ locale }: { locale: string }) {
  const t = useTranslations('home.hero');

  return (
    <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">
      {/* Fondo */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
        <div className="absolute -top-40 left-1/2 h-[600px] w-[1200px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="container">
        <div className="grid items-center gap-16 lg:grid-cols-12">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <Badge variant="glass" className="mb-6 px-4 py-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{t('badge')}</span>
            </Badge>

            <h1 className="font-display text-display-xl text-balance text-foreground">
              {t('title')}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty sm:text-xl">
              {t('subtitle')}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                <Link href={`/${locale}/donate`}>{t('cta_donate')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={`/${locale}/volunteer`}>{t('cta_volunteer')}</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href={`/${locale}/help`}>{t('cta_help')}</Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-secondary" />
                <span>100% trazable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-secondary" />
                <span>Pago seguro</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-secondary" />
                <span>Auditado</span>
              </div>
              <span className="hidden sm:inline">·</span>
              <span>{t('trust')}</span>
            </div>
          </motion.div>

          {/* Visual: glass card flotante */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="lg:col-span-5"
          >
            <HeroVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative aspect-[4/5] w-full max-w-md mx-auto">
      {/* Marco */}
      <motion.div
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 overflow-hidden rounded-[2.5rem] shadow-soft-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center mix-blend-overlay opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 rounded-2xl glass p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 backdrop-blur">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider opacity-80">Última entrega</p>
              <p className="font-semibold">Maracaibo, Zulia · hace 12 min</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <div className="flex -space-x-2">
              {['#00C2A8', '#6C63FF', '#0057FF'].map((c, i) => (
                <div key={i} className="h-6 w-6 rounded-full border-2 border-white" style={{ background: c }} />
              ))}
              <div className="grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-white/30 text-[10px]">+8</div>
            </div>
            <span className="opacity-90">Familias alcanzadas</span>
          </div>
        </div>
      </motion.div>

      {/* Floating card 1 */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -left-6 top-12 hidden rounded-2xl glass p-4 shadow-soft-xl sm:block"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-secondary/10">
            <Users className="h-4 w-4 text-secondary" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Voluntarios</p>
            <p className="font-semibold">2.847 activos</p>
          </div>
        </div>
      </motion.div>

      {/* Floating card 2 */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -right-6 bottom-24 hidden rounded-2xl glass p-4 shadow-soft-xl sm:block"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10">
            <Play className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Recaudado hoy</p>
            <p className="font-semibold">$ 18.430 USD</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}