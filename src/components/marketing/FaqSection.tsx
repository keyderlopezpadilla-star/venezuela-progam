'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const FAQ_ITEMS = [
  {
    q: '¿Cómo se garantiza que mi donación llega al beneficiario?',
    a: 'Cada donación tiene un código de seguimiento. Puedes ver en tiempo real la campaña asignada, el centro de acopio, la ruta y la evidencia fotográfica de la entrega. Publicamos informes auditados trimestralmente.',
  },
  {
    q: '¿Qué porcentaje se destina a costos operativos?',
    a: 'Menos del 8% se destina a operación y logística. El resto se entrega directamente como asistencia. Lo detallamos en el panel de transparencia con comprobantes.',
  },
  {
    q: '¿Puedo donar de forma anónima?',
    a: 'Sí. Al finalizar tu donación puedes marcar la casilla de anonimato. Tu nombre no aparecerá en ninguna comunicación pública, aunque el código de seguimiento seguirá siendo válido.',
  },
  {
    q: '¿Aceptan donaciones corporativas o en especie?',
    a: 'Sí. Ofrecemos planes corporativos con convenios, recibos fiscales y reportes a medida. Para donaciones en especie (alimentos, medicinas, ropa), contáctanos y coordinamos logística.',
  },
  {
    q: '¿Cómo puedo solicitar ayuda?',
    a: 'Completa el formulario de Solicitar Ayuda con tu información y, si es posible, evidencia. Validamos cada caso y te asignamos al centro más cercano. El proceso es confidencial.',
  },
  {
    q: '¿Qué métodos de pago aceptan?',
    a: 'Tarjetas Visa, Mastercard, Amex y transferencias SEPA / SWIFT. Todos los pagos son procesados por Stripe con cifrado bancario. No almacenamos datos de tarjeta.',
  },
];

export function FaqSection({ locale: _locale }: { locale: string }) {
  return (
    <section className="py-24">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4"
          >
            <h2 className="font-display text-display-md text-balance">Preguntas frecuentes</h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              ¿Tienes otra duda? Escríbenos y te respondemos en menos de 24 horas.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8"
          >
            <AccordionPrimitive.Root type="single" collapsible className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionPrimitive.Item
                  key={i}
                  value={`item-${i}`}
                  className="rounded-3xl border border-border bg-card px-6 shadow-soft transition-all data-[state=open]:shadow-soft-lg"
                >
                  <AccordionPrimitive.Header>
                    <AccordionPrimitive.Trigger
                      className={cn(
                        'group flex w-full items-center justify-between gap-4 py-5 text-left text-base font-medium transition-all',
                        'hover:text-primary'
                      )}
                    >
                      <span>{item.q}</span>
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted transition-transform group-data-[state=open]:rotate-45">
                        <Plus className="h-4 w-4" />
                      </span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionPrimitive.Content className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <div className="pb-5 pr-12 text-muted-foreground leading-relaxed text-pretty">
                      {item.a}
                    </div>
                  </AccordionPrimitive.Content>
                </AccordionPrimitive.Item>
              ))}
            </AccordionPrimitive.Root>
          </motion.div>
        </div>
      </div>
    </section>
  );
}