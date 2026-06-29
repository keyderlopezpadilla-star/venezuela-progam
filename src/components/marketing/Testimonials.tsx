'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'María González',
    role: 'Madre beneficiaria · Caracas',
    body: 'Recibimos un paquete de alimentos con foto y mi firma. Es la primera vez que siento que mi ayuda no se pierde en el camino.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    rating: 5,
  },
  {
    name: 'José Ramírez',
    role: 'Donante recurrente · Madrid',
    body: 'Poder ver exactamente a dónde va cada euro me dio la confianza para aumentar mi aporte mensual.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    rating: 5,
  },
  {
    name: 'Ana Pérez',
    role: 'Voluntaria logística · Mérida',
    body: 'La plataforma organiza todo: rutas, destinatarios, evidencia. Llego a cada entrega sabiendo que importa.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
    rating: 5,
  },
];

export function Testimonials({ locale: _locale }: { locale: string }) {
  return (
    <section className="py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-display-md text-balance">Voces de esperanza</h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Lo que dicen quienes confían en nuestra labor.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {TESTIMONIALS.map((t) => (
            <motion.figure
              key={t.name}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="rounded-3xl border border-border bg-card p-8 shadow-soft card-hover"
            >
              <Quote className="h-6 w-6 text-primary/40" />
              <blockquote className="mt-4 text-base leading-relaxed text-pretty">
                “{t.body}”
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-12 w-12 rounded-2xl object-cover"
                />
                <div>
                  <figcaption className="font-semibold">{t.name}</figcaption>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
                <div className="ml-auto flex items-center gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}