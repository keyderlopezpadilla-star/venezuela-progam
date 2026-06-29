'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, CheckCircle2, Truck, Package, MapPin, FileCheck2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';

const STAGES = [
  { key: 'received', label: 'Recibida', Icon: CheckCircle2 },
  { key: 'verified', label: 'Verificada', Icon: FileCheck2 },
  { key: 'allocated', label: 'Asignada', Icon: Package },
  { key: 'inTransit', label: 'En tránsito', Icon: Truck },
  { key: 'delivered', label: 'Entregada', Icon: MapPin },
  { key: 'confirmed', label: 'Confirmada por beneficiario', Icon: CheckCircle2 },
];

export function TrackView({ locale: _locale, initialCode }: { locale: string; initialCode?: string }) {
  const [code, setCode] = useState(initialCode ?? '');
  const [queryCode, setQueryCode] = useState<string | null>(initialCode ?? null);

  const { data, isLoading, error } = useQuery({
    enabled: !!queryCode,
    queryKey: ['track', queryCode],
    queryFn: async () => {
      const res = await fetch(`/api/track/${encodeURIComponent(queryCode!)}`);
      if (!res.ok) throw new Error('not_found');
      return res.json();
    },
  });

  const stageMap: Record<string, number> = {
    PENDING: 1,
    PROCESSING: 1,
    COMPLETED: 6,
    FAILED: 1,
  };
  const currentStage = data ? stageMap[data.status as string] ?? 2 : 0;

  return (
    <div className="pt-32 pb-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="glass" className="mb-4 px-4 py-1.5">
            <Search className="h-3.5 w-3.5" />
            Seguimiento en tiempo real
          </Badge>
          <h1 className="font-display text-display-md text-balance">Sigue tu donación</h1>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Ingresa tu código para ver el estado actual y la evidencia de entrega.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (code.trim()) setQueryCode(code.trim());
          }}
          className="mx-auto mt-10 flex max-w-xl gap-2"
        >
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="VZS-XXXX-XXXX"
            leftIcon={<Search className="h-4 w-4" />}
            className="font-mono uppercase tracking-wider"
          />
          <Button type="submit" size="lg" loading={isLoading}>
            Buscar
          </Button>
        </form>

        {error && (
          <p className="mx-auto mt-6 max-w-xl rounded-2xl border border-emergency/30 bg-emergency/5 p-4 text-center text-sm text-emergency-600">
            No encontramos esa donación. Verifica el código.
          </p>
        )}

        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mt-10 max-w-3xl"
          >
            <Card>
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-mono text-xl font-bold tracking-wider">{data.trackingCode}</h2>
                  <Badge variant={data.status === 'COMPLETED' ? 'success' : 'default'}>
                    {data.status}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {data.campaign?.title || 'Donación general'} · {formatCurrency(Number(data.amount), data.currency)}
                </p>

                <div className="mt-8">
                  <ol className="relative space-y-6 border-l border-border pl-6">
                    {STAGES.map((s, i) => {
                      const reached = i < currentStage;
                      const active = i === currentStage - 1;
                      return (
                        <li key={s.key} className="relative">
                          <span
                            className={`absolute -left-[33px] grid h-7 w-7 place-items-center rounded-full border-2 ${
                              reached
                                ? 'border-secondary bg-secondary text-white'
                                : 'border-border bg-background text-muted-foreground'
                            }`}
                          >
                            <s.Icon className="h-3.5 w-3.5" />
                          </span>
                          <p className={`text-sm font-medium ${reached ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {s.label}
                          </p>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}