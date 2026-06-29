'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent } from '@/components/ui/Card';
import { helpRequestSchema, type HelpRequest } from '@/lib/validators';

export function HelpView() {
  const [submitted, setSubmitted] = useState<{ code: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HelpRequest>({
    resolver: zodResolver(helpRequestSchema),
    defaultValues: {
      familySize: 1,
      urgency: 'MEDIUM',
      category: 'FOOD',
      hasChildren: false,
      hasElderly: false,
      hasDisabled: false,
      consent: true as any,
    },
  });

  const onSubmit = async (data: HelpRequest) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok) {
        setSubmitted({ code: json.trackingCode });
        reset();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-32 pb-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-10 text-center shadow-soft-lg"
          >
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-secondary/15">
              <CheckCircle2 className="h-8 w-8 text-secondary-600" />
            </div>
            <h2 className="mt-6 font-display text-2xl font-semibold">Hemos recibido tu solicitud</h2>
            <p className="mt-2 text-muted-foreground">
              Te contactaremos lo antes posible. Guarda tu código de seguimiento:
            </p>
            <p className="mt-4 font-mono text-2xl font-bold tracking-wider">{submitted.code}</p>
            <Button
              variant="outline"
              className="mt-8"
              onClick={() => setSubmitted(null)}
            >
              Enviar otra solicitud
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-emergency/10 px-3 py-1 text-xs font-medium text-emergency-600">
              <Heart className="h-3.5 w-3.5 fill-emergency text-emergency" />
              Solicitar ayuda
            </span>
            <h1 className="mt-4 font-display text-display-md text-balance">
              Estamos aquí para escucharte.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Tu información es confidencial. Validamos cada caso y te asignamos al centro más cercano.
            </p>
            <ul className="mt-8 space-y-4 text-sm">
              {[
                'Tu información personal está cifrada (AES-256).',
                'Validamos cada caso en menos de 24 horas.',
                'Si tu urgencia es crítica, te contactamos el mismo día.',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-muted-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <Card>
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Nombre completo</Label>
                      <Input {...register('fullName')} invalid={!!errors.fullName} />
                      {errors.fullName && <p className="mt-1 text-xs text-emergency-600">{errors.fullName.message}</p>}
                    </div>
                    <div>
                      <Label>Teléfono</Label>
                      <Input {...register('phone')} invalid={!!errors.phone} placeholder="+58 ..." />
                      {errors.phone && <p className="mt-1 text-xs text-emergency-600">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Estado</Label>
                      <Input {...register('region')} invalid={!!errors.region} placeholder="Ej: Miranda" />
                    </div>
                    <div>
                      <Label>Ciudad</Label>
                      <Input {...register('city')} invalid={!!errors.city} placeholder="Ej: Caracas" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label>Personas en familia</Label>
                      <Input type="number" min={1} {...register('familySize', { valueAsNumber: true })} />
                    </div>
                    <div>
                      <Label>Urgencia</Label>
                      <select
                        {...register('urgency')}
                        className="h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm"
                      >
                        <option value="LOW">Puedo esperar</option>
                        <option value="MEDIUM">Pronto</option>
                        <option value="HIGH">Urgente</option>
                        <option value="CRITICAL">Crítica</option>
                      </select>
                    </div>
                    <div>
                      <Label>Tipo de ayuda</Label>
                      <select
                        {...register('category')}
                        className="h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm"
                      >
                        <option value="FOOD">Alimentos</option>
                        <option value="WATER">Agua potable</option>
                        <option value="MEDICINE">Medicinas</option>
                        <option value="CLOTHING">Ropa</option>
                        <option value="SHELTER">Refugio</option>
                        <option value="OTHER">Otro</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-sm">
                    {[
                      { name: 'hasChildren', label: 'Niños' },
                      { name: 'hasElderly', label: 'Adultos mayores' },
                      { name: 'hasDisabled', label: 'Discapacidad' },
                    ].map((b) => (
                      <label key={b.name} className="flex items-center gap-2 rounded-2xl border border-border bg-background p-3">
                        <input type="checkbox" {...register(b.name as any)} className="h-4 w-4" />
                        {b.label}
                      </label>
                    ))}
                  </div>

                  <div>
                    <Label>Describe tu situación</Label>
                    <Textarea rows={4} {...register('description')} invalid={!!errors.description} />
                    {errors.description && (
                      <p className="mt-1 text-xs text-emergency-600">{errors.description.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>Subir pruebas (opcional)</Label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="mt-2 block w-full text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary"
                    />
                  </div>

                  <label className="flex items-start gap-2 text-sm">
                    <input type="checkbox" {...register('consent')} className="mt-1 h-4 w-4" />
                    <span className="text-muted-foreground">
                      Acepto que mi información sea tratada conforme a la Política de Privacidad y sea usada para gestionar mi solicitud.
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="text-xs text-emergency-600">{String(errors.consent.message)}</p>
                  )}

                  <Button type="submit" size="lg" className="w-full" loading={submitting} rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Enviar solicitud
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}