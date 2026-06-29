'use client';

import { useTranslations } from 'next-intl';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { motion } from 'framer-motion';

export function StatsBar({ locale: _locale }: { locale: string }) {
  const t = useTranslations('home.stats');

  const stats = [
    { key: 'raised', value: 1_842_350, prefix: '$ ', suffix: ' USD' },
    { key: 'delivered', value: 947, suffix: ' t' },
    { key: 'families', value: 23_140 },
    { key: 'volunteers', value: 2_847 },
    { key: 'warehouses', value: 14 },
    { key: 'cities', value: 36 },
  ];

  return (
    <section className="border-y bg-card">
      <div className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6"
        >
          {stats.map((s) => (
            <div key={s.key} className="text-center sm:text-left">
              <p className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                <AnimatedCounter
                  value={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{t(s.key as any)}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}