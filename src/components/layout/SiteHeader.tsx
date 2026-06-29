'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X, Heart, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from './LanguageSwitcher';

const navItems = [
  { href: '/', key: 'home' },
  { href: '/campaigns', key: 'campaigns' },
  { href: '/transparency', key: 'transparency' },
  { href: '/volunteer', key: 'volunteer' },
  { href: '/track', key: 'track' },
  { href: '/about', key: 'about' },
] as const;

export function SiteHeader({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const localizedHref = (href: string) =>
    href === '/' ? `/${locale}` : `/${locale}${href}`;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled ? 'py-2' : 'py-4'
      )}
    >
      <div className="container">
        <nav
          className={cn(
            'flex h-16 items-center justify-between rounded-full px-4 sm:px-6 transition-all duration-500',
            scrolled
              ? 'glass shadow-soft-lg border-border/60'
              : 'bg-transparent border border-transparent'
          )}
        >
          {/* Logo */}
          <Link
            href={localizedHref('/')}
            className="flex items-center gap-2.5 group"
            aria-label="Venezuela Solidaria"
          >
            <div className="relative h-10 w-10 rounded-2xl bg-gradient-primary shadow-glow-primary grid place-items-center overflow-hidden">
              <Heart className="h-5 w-5 text-white fill-white" strokeWidth={2.5} />
              <span className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors" />
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="font-display text-base font-semibold tracking-tight">
                Venezuela Solidaria
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {tCommon('tagline')}
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const href = localizedHref(item.href);
              const active =
                item.href === '/'
                  ? pathname === `/${locale}` || pathname === `/${locale}/`
                  : pathname.startsWith(href);
              return (
                <li key={item.href}>
                  <Link
                    href={href}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium rounded-full transition-colors',
                      active
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {t(item.key)}
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-muted"
                        transition={{ type: 'spring', duration: 0.6, bounce: 0.2 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher currentLocale={locale} />
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="text-sm">
              <Link href={`/${locale}/login`}>{t('login')}</Link>
            </Button>
            <Button
              asChild
              variant="primary"
              size="sm"
              leftIcon={<Heart className="h-4 w-4 fill-white" />}
            >
              <Link href={`/${locale}/donate`}>{t('donate')}</Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-full p-2 hover:bg-muted"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? tCommon('close') : tCommon('menu')}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="container md:hidden"
          >
            <div className="mt-2 rounded-3xl glass border-border p-4 shadow-soft-xl">
              <ul className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={localizedHref(item.href)}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3 rounded-2xl text-sm font-medium hover:bg-muted"
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center gap-2 border-t pt-4">
                <LanguageSwitcher currentLocale={locale} />
                <ThemeToggle />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button asChild variant="outline" size="md">
                  <Link href={`/${locale}/login`}>{t('login')}</Link>
                </Button>
                <Button asChild variant="primary" size="md">
                  <Link href={`/${locale}/donate`}>{t('donate')}</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}