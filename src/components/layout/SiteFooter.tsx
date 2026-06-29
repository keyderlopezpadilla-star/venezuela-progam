'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Heart, Mail, Twitter, Instagram, Facebook, Linkedin, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function SiteFooter({ locale }: { locale: string }) {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t bg-card">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30 pointer-events-none" />
      <div className="container relative py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <Link href={`/${locale}`} className="flex items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-primary shadow-glow-primary">
                <Heart className="h-5 w-5 fill-white text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display text-lg font-semibold">Venezuela Solidaria</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-md text-pretty">
              {t('about')}
            </p>
            <div className="flex items-center gap-2">
              {[
                { Icon: Twitter, href: '#' },
                { Icon: Instagram, href: '#' },
                { Icon: Facebook, href: '#' },
                { Icon: Linkedin, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted transition-colors"
                  aria-label="social"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider">Navegación</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {(['home', 'campaigns', 'transparency', 'volunteer', 'about'] as const).map((k) => (
                <li key={k}>
                  <Link href={`/${locale}${k === 'home' ? '' : `/${k}`}`} className="hover:text-foreground transition-colors">
                    {tNav(k)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider">{t('newsletter')}</h4>
            <p className="text-sm text-muted-foreground">
              Recibe actualizaciones sobre entregas y emergencias.
            </p>
            <form className="flex gap-2" action="/api/newsletter" method="POST">
              <Input
                type="email"
                name="email"
                required
                placeholder={t('emailPlaceholder')}
                leftIcon={<Mail className="h-4 w-4" />}
              />
              <Button type="submit" variant="primary">
                {t('subscribe')}
              </Button>
            </form>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              <span>Datos protegidos · RGPD · Cifrado AES-256</span>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">{t('rights', { year })}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <li><Link href={`/${locale}/privacy`} className="hover:text-foreground">{t('privacy')}</Link></li>
            <li><Link href={`/${locale}/terms`} className="hover:text-foreground">{t('terms')}</Link></li>
            <li><Link href={`/${locale}/about`} className="hover:text-foreground">{tNav('about')}</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}