'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Heart, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent } from '@/components/ui/Card';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get('name'),
      email: fd.get('email'),
      password: fd.get('password'),
      confirmPassword: fd.get('confirmPassword'),
      acceptTerms: fd.get('acceptTerms') === 'on',
    };
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error');
      router.push('/es/login');
    } catch (err: any) {
      setError(err.message || 'No se pudo crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardContent className="p-8 sm:p-10">
              <h1 className="font-display text-3xl font-semibold tracking-tight">Crea tu cuenta</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Únete a la comunidad de Venezuela Solidaria.
              </p>

              <form onSubmit={onSubmit} className="mt-8 space-y-4">
                <div>
                  <Label>Nombre completo</Label>
                  <Input name="name" required leftIcon={<UserIcon className="h-4 w-4" />} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" name="email" required leftIcon={<Mail className="h-4 w-4" />} />
                </div>
                <div>
                  <Label>Contraseña</Label>
                  <Input type="password" name="password" required minLength={8} leftIcon={<Lock className="h-4 w-4" />} />
                </div>
                <div>
                  <Label>Repetir contraseña</Label>
                  <Input type="password" name="confirmPassword" required minLength={8} leftIcon={<Lock className="h-4 w-4" />} />
                </div>
                <label className="flex items-start gap-2 text-sm">
                  <input type="checkbox" name="acceptTerms" required className="mt-1 h-4 w-4" />
                  <span className="text-muted-foreground">
                    Acepto los <Link href="/es/terms" className="text-primary hover:underline">Términos</Link> y la <Link href="/es/privacy" className="text-primary hover:underline">Política de Privacidad</Link>.
                  </span>
                </label>
                {error && (
                  <div className="rounded-2xl border border-emergency/30 bg-emergency/5 p-3 text-sm text-emergency-600">
                    {error}
                  </div>
                )}
                <Button type="submit" size="lg" className="w-full" loading={loading} rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Crear cuenta
                </Button>
              </form>

              <p className="mt-8 text-center text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{' '}
                <Link href="/es/login" className="font-medium text-primary hover:underline">
                  Ingresa
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

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
              Tu ayuda, trazable. Tu impacto, verificable.
            </h2>
            <p className="mt-4 text-white/85 text-pretty">
              Crea tu cuenta para gestionar donaciones, voluntariado y recibir recibos fiscales.
            </p>
          </div>
          <p className="text-xs text-white/70">Datos cifrados AES-256 · RGPD</p>
        </div>
      </div>
    </div>
  );
}