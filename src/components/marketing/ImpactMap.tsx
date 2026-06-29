'use client';

import { motion } from 'framer-motion';
import { MapPin, Truck, Warehouse, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';

const PINS = [
  { id: 1, x: 70, y: 28, label: 'Caracas', type: 'warehouse' },
  { id: 2, x: 50, y: 18, label: 'Maracaibo', type: 'active' },
  { id: 3, x: 78, y: 55, label: 'Maturín', type: 'warehouse' },
  { id: 4, x: 38, y: 40, label: 'Barquisimeto', type: 'active' },
  { id: 5, x: 60, y: 70, label: 'Ciudad Bolívar', type: 'warehouse' },
  { id: 6, x: 25, y: 75, label: 'San Cristóbal', type: 'active' },
];

export function ImpactMap({ locale }: { locale: string }) {
  const t = useTranslations('home.sections');
  return (
    <section className="py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-display-md text-balance">{t('liveImpact')}</h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Visualiza en tiempo real los centros de acopio, rutas activas y entregas en curso.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="relative mt-12 overflow-hidden rounded-[2.5rem] border bg-card shadow-soft-xl"
        >
          {/* Mapa estilizado */}
          <div className="relative aspect-[16/10] w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
            {/* Contorno SVG de Venezuela */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="mapGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="rgb(var(--secondary))" stopOpacity="0.18" />
                </linearGradient>
              </defs>
              {/* Polígono simplificado */}
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
                d="M 18 12 L 32 8 L 42 14 L 48 10 L 60 14 L 72 16 L 80 24 L 82 38 L 76 50 L 80 62 L 74 76 L 66 84 L 56 92 L 44 88 L 36 78 L 30 66 L 22 58 L 18 44 L 16 28 Z"
                fill="url(#mapGrad)"
                stroke="rgb(var(--primary) / 0.4)"
                strokeWidth="0.4"
              />
              {/* Líneas de rutas */}
              {[
                ['M 50 18 L 70 28', 'delay'],
                ['M 70 28 L 78 55', 'delay'],
                ['M 70 28 L 38 40', 'delay'],
                ['M 50 18 L 25 75', 'delay'],
              ].map(([d], i) => (
                <motion.path
                  key={i}
                  d={d as string}
                  stroke="rgb(var(--secondary))"
                  strokeWidth="0.3"
                  strokeDasharray="2 2"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.8 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, delay: 0.4 + i * 0.2 }}
                />
              ))}
            </svg>

            {/* Pins */}
            {PINS.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.12, type: 'spring', stiffness: 200 }}
                className="absolute"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                <Pin type={p.type as 'warehouse' | 'active'} label={p.label} />
              </motion.div>
            ))}
          </div>

          {/* Controles / overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl glass p-4">
            <div className="flex items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-secondary animate-pulse-soft" />
                {PINS.filter((p) => p.type === 'active').length} entregas activas
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                {PINS.filter((p) => p.type === 'warehouse').length} centros de acopio
              </span>
            </div>
            <Button asChild size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
              <Link href={`/${locale}/transparency`}>Ver panel completo</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Pin({ type, label }: { type: 'warehouse' | 'active'; label: string }) {
  const isActive = type === 'active';
  const color = isActive ? 'bg-secondary' : 'bg-primary';
  const Icon = isActive ? Truck : Warehouse;
  return (
    <div className="group relative -translate-x-1/2 -translate-y-1/2">
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`absolute inset-0 rounded-full ${color}/30`}
      />
      <div className={`relative grid h-9 w-9 place-items-center rounded-full ${color} text-white shadow-soft-lg ring-4 ring-card`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-card px-2.5 py-1 text-xs font-medium shadow-soft-lg opacity-0 transition-opacity group-hover:opacity-100">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {label}
        </span>
      </div>
    </div>
  );
}