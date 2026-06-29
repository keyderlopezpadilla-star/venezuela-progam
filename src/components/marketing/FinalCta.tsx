'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function FinalCta({ locale }: { locale: string }) {
  return (
    <section className="pb-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-10 sm:p-16 text-center shadow-soft-2xl"
        >
          <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
          <div className="relative">
            <span className="inline-grid h-14 w-14 place-items-center rounded-3xl bg-gradient-primary shadow-glow-primary">
              <Heart className="h-6 w-6 fill-white text-white" />
            </span>
            <h2 className="mt-6 font-display text-display-md text-balance">
              Tu ayuda llega. Lo prometemos.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
              Únete a miles de personas que ya están transformando vidas. Cada donación es trazable, cada entrega es verificable.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="xl" rightIcon={<ArrowRight className="h-4 w-4" />}>
                <Link href={`/${locale}/donate`}>Donar ahora</Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href={`/${locale}/volunteer`}>Quiero ser voluntario</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}