'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Users, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { volunteerSchema, type Volunteer } from '@/lib/validators';

const SKILLS = [
  'Logística',
  'Transporte',
  'Almacén',
  'Cocina',
  'Comunicación',
  'Salud',
  'Psicología',
  'Traducción',
  'Tecnología',
  'Traducción',
];

export function VolunteerView() {
  const [skills, setSkills] = useState<string[]>(['Logística']);
  const [languages, setLanguages] = useState<string[]>(['Español']);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<Volunteer>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      skills,
      languages,
      hasVehicle: false,
      country: 'Venezuela',
      consent: true as any,
    },
  });

  const onSubmit = async (data: Volunteer) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, skills, languages }),
      });
      if (res.ok) setSubmitted(true);
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
            className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-10 text-center shadow-soft-lg"
          >
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-secondary/15">
              <CheckCircle2 className="h-8 w-8 text-secondary-600" />
            </div>
            <h2 className="mt-6 font-display text-2xl font-semibold">¡Bienvenida/o!</h2>
            <p className="mt-2 text-muted-foreground">
              Pronto te contactaremos para completar tu registro y capacitación.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  const toggle = (arr: string[], v: string, set: (a: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className="pt-32 pb-24">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5"
          >
            <Badge variant="default" className="mb-4 px-4 py-1.5">
              <Users className="h-3.5 w-3.5" />
              Red de voluntarios
            </Badge>
            <h1 className="font-display text-display-md text-balance">Únete como voluntario</h1>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Logística, almacén, comunicación o transporte. Cada talento cuenta. Verificamos identidad y te capacitamos.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {[
                'Capacitación inicial de 1h.',
                'Seguro de responsabilidad civil durante actividades.',
                'Certificado oficial de horas y aporte.',
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
            transition={{ delay: 0.1 }}
            className="lg:col-span-7"
          >
            <Card>
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <Label>Habilidades</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {SKILLS.map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => toggle(skills, s, setSkills)}
                          className={`rounded-full border px-3 py-1 text-sm transition-all ${
                            skills.includes(s)
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border hover:border-primary/40'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Idiomas</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {['Español', 'Inglés', 'Portugués', 'Francés'].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => toggle(languages, s, setLanguages)}
                          className={`rounded-full border px-3 py-1 text-sm transition-all ${
                            languages.includes(s)
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border hover:border-primary/40'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Disponibilidad</Label>
                      <Input placeholder="Fines de semana" {...register('availability')} />
                    </div>
                    <div>
                      <Label>Ciudad</Label>
                      <Input {...register('city')} />
                    </div>
                  </div>

                  <div>
                    <Label>Cuéntanos sobre ti</Label>
                    <Textarea rows={4} {...register('bio')} />
                  </div>

                  <label className="flex items-start gap-2 text-sm">
                    <input type="checkbox" {...register('consent')} className="mt-1 h-4 w-4" />
                    <span className="text-muted-foreground">
                      Acepto la verificación de identidad necesaria para actividades logísticas.
                    </span>
                  </label>

                  <Button type="submit" size="lg" className="w-full" loading={submitting} rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Registrarme
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