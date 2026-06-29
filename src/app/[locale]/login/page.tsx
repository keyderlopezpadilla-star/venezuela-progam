'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Mail, Lock, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent } from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations('auth');
  const tNav = useTranslations('nav');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') ?? '');
    const password = String(fd.get('password') ?? '');
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (res?.error) setError('Credenciales inválidas');
    else router.push('/es/dashboard');
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Visual */}
      <div className="relative hidden overflow-hidden bg-gradient-hero lg:block">
        <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link href="/es" className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15 backdrop-blur">
              <Heart className="h-5 w-5 fill-white text-white" />
            </div>
            <span className="font-display text-lg font-semibold">Venezuela Solidaria</span>
          </Link>
          <div className="max-w-md">
            <h2 className="font-display text-display-md text-balance">
              “Cada granito cuenta. Cada vida importa.”
            </h2>
            <p className="mt-4 text-white/85 text-pretty">
              Ingresa para gestionar tus donaciones, voluntariado y recibir reportes personalizados.
            </p>
          </div>
          <p className="text-xs text-white/70">© 2026 Venezuela Solidaria · Datos cifrados AES-256</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardContent className="p-8 sm:p-10">
              <h1 className="font-display text-3xl font-semibold tracking-tight">{t('loginTitle')}</h1>
              <p className="mt-1 text-sm text-muted-foreground">Bienvenida/o de vuelta.</p>

              <form onSubmit={onSubmit} className="mt-8 space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input type="email" name="email" required leftIcon={<Mail className="h-4 w-4" />} />
                </div>
                <div>
                  <Label>Contraseña</Label>
                  <Input type="password" name="password" required leftIcon={<Lock className="h-4 w-4" />} />
                </div>
                {error && (
                  <div className="rounded-2xl border border-emergency/30 bg-emergency/5 p-3 text-sm text-emergency-600">
                    {error}
                  </div>
                )}
                <Button type="submit" size="lg" className="w-full" loading={loading} rightIcon={<ArrowRight className="h-4 w-4" />}>
                  {t('login')}
                </Button>
              </form>

              <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border" />
                {t('orWith')}
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" type="button" onClick={() => signIn('google')}>Google</Button>
                <Button variant="outline" type="button" onClick={() => signIn('github')}>GitHub</Button>
              </div>

              <p className="mt-8 text-center text-sm text-muted-foreground">
                {t('noAccount')}{' '}
                <Link href="/es/register" className="font-medium text-primary hover:underline">
                  {t('createAccount')}
                </Link>
              </p>
            </CardContent>
          </Card>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            <Link href="/es" className="hover:text-foreground">{tNav('home')}</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}