'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, FileCheck2, Lock, ShieldCheck, BarChart3, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export function TransparencySection({ locale }: { locale: string }) {
  const t = useTranslations('home.sections');
  const tTrans = useTranslations('transparency');

  const PILLARS = [
    {
      Icon: Eye,
      title: 'Datos abiertos',
      body: 'Cada donación, gasto y entrega es pública y descargable.',
    },
    {
      Icon: ShieldCheck,
      title: 'Auditoría externa',
      body: 'Informes trimestrales firmados por auditores independientes.',
    },
    {
      Icon: Lock,
      title: 'Cifrado AES-256',
      body: 'Datos personales y financieros protegidos extremo a extremo.',
    },
    {
      Icon: FileCheck2,
      title: 'Pruebas de entrega',
      body: 'Cada entrega tiene foto, geolocalización y firma del beneficiario.',
    },
  ];

  return (
    <section className="bg-muted/30 py-24">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary-600">
              <BarChart3 className="h-3.5 w-3.5" />
              {t('transparency')}
            </span>
            <h2 className="mt-4 font-display text-display-md text-balance">
              Confianza que se demuestra, no se promete.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              {tTrans('subtitle')} Publicamos cada movimiento en tiempo real y entregamos reportes auditados a la comunidad.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                <Link href={`/${locale}/transparency`}>Abrir panel de transparencia</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/${locale}/transparency#reports`}>Descargar informes</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            className="lg:col-span-7"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {PILLARS.map(({ Icon, title, body }) => (
                <motion.div
                  key={title}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  }}
                >
                  <Card className="card-hover h-full border-border/60">
                    <CardContent className="p-6">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
                        {title}
                      </h3>
                      <p className="mt-1.5 text-sm text-muted-foreground text-pretty">{body}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}