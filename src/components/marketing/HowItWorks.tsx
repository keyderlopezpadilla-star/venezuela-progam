'use client';

import { motion } from 'framer-motion';
import { Heart, HandHeart, Truck, MapPin, Camera, ShieldCheck } from 'lucide-react';

const STEPS = [
  { Icon: Heart, title: 'Donas', body: 'Eliges una causa o haces una donación general. 100% segura.' },
  { Icon: HandHeart, title: 'Asignamos', body: 'Cada donación se asigna a una campaña con responsable verificable.' },
  { Icon: Truck, title: 'Logística', body: 'Voluntarios y transportistas certificados llevan la ayuda.' },
  { Icon: Camera, title: 'Evidencia', body: 'Se capturan fotos, geolocalización y firma del beneficiario.' },
  { Icon: ShieldCheck, title: 'Auditoría', body: 'Cada movimiento queda registrado en nuestro panel público.' },
];

export function HowItWorks({ locale: _locale }: { locale: string }) {
  return (
    <section className="py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-display-md text-balance">Cómo funciona</h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Cada paso está diseñado para garantizar transparencia y dignidad.
          </p>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-border to-transparent lg:block" />
          <ol className="space-y-12 lg:space-y-0">
            {STEPS.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className={`grid items-center gap-8 lg:grid-cols-2 ${i % 2 ? 'lg:[&>div:first-child]:order-2' : ''}`}
              >
                <div className="flex justify-end">
                  <div className="relative max-w-md rounded-3xl border border-border bg-card p-8 shadow-soft card-hover">
                    <span className="absolute -top-4 left-8 grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-glow-primary">
                      {i + 1}
                    </span>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                      <s.Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">{s.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground text-pretty">{s.body}</p>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="grid h-12 w-12 place-items-center rounded-full border border-primary/30 bg-background text-primary">
                    <s.Icon className="h-5 w-5" />
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}