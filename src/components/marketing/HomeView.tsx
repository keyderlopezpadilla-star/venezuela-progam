'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Hero } from '@/components/marketing/Hero';
import { StatsBar } from '@/components/marketing/StatsBar';
import { ImpactMap } from '@/components/marketing/ImpactMap';
import { CampaignsSection } from '@/components/marketing/CampaignsSection';
import { TransparencySection } from '@/components/marketing/TransparencySection';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { VolunteerCTA } from '@/components/marketing/VolunteerCTA';
import { Testimonials } from '@/components/marketing/Testimonials';
import { PartnersMarquee } from '@/components/marketing/PartnersMarquee';
import { FaqSection } from '@/components/marketing/FaqSection';
import { FinalCta } from '@/components/marketing/FinalCta';

export function HomeView({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <div ref={ref} className="relative">
      <motion.div style={{ y: heroY }}>
        <Hero locale={locale} />
      </motion.div>
      <StatsBar locale={locale} />
      <ImpactMap locale={locale} />
      <CampaignsSection locale={locale} />
      <TransparencySection locale={locale} />
      <HowItWorks locale={locale} />
      <VolunteerCTA locale={locale} />
      <Testimonials locale={locale} />
      <PartnersMarquee locale={locale} />
      <FaqSection locale={locale} />
      <FinalCta locale={locale} />
    </div>
  );
}