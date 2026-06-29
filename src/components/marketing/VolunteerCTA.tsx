'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Truck, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function VolunteerCTA({ locale }: { locale: string }) {
  return (
    <section className="py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-hero p-10 sm:p-16"
        >
          <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay pointer-events-none" />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div className="text-white">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                <Users className="h-3.5 w-3.5" />
                Red de voluntarios
              </span>
              <h2 className="mt-4 font-display text-display-md text-balance">
                Sé parte del cambio que quieres ver.
              </h2>
              <p className="mt-4 max-w-xl text-lg text-white/85 text-pretty">
                Logística, almacén, transporte o comunicación. Cada talento cuenta. Verificamos identidad y te capacitamos.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="glass" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  <Link href={`/${locale}/volunteer`}>Registrarme como voluntario</Link>
                </Button>
                <Button asChild size="lg" variant="link" className="text-white">
                  <Link href={`/${locale}/about`}>Conoce el equipo</Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { Icon: Truck, k: '34', label: 'Rutas activas' },
                { Icon: ClipboardCheck, k: '12', label: 'Capacitaciones' },
                { Icon: Users, k: '2.8k', label: 'Voluntarios' },
                { Icon: Users, k: '47', label: 'Coordinadores' },
              ].map(({ Icon, k, label }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="rounded-3xl glass p-5 text-white"
                >
                  <Icon className="h-5 w-5" />
                  <p className="mt-4 font-display text-3xl font-semibold">{k}</p>
                  <p className="text-xs uppercase tracking-wider opacity-80">{label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}