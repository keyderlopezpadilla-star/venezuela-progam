'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

export function CampaignsList({ locale }: { locale: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const res = await fetch('/api/campaigns');
      return res.json() as Promise<{ campaigns: any[] }>;
    },
  });

  return (
    <div className="pt-32 pb-24">
      <div className="container">
        <header className="max-w-2xl">
          <h1 className="font-display text-display-md text-balance">Campañas activas</h1>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Cada campaña tiene meta, región y responsable verificable.
          </p>
        </header>
        {isLoading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 rounded-3xl bg-muted animate-pulse-soft" />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(data?.campaigns ?? FALLBACK).map((c) => {
              const pct = Math.min(100, Math.round((Number(c.raised) / Number(c.goal)) * 100));
              return (
                <Card key={c.slug} className="card-hover overflow-hidden">
                  {c.coverImage && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img src={c.coverImage} alt={c.title} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <Badge variant="default" className="mb-2">{c.region}</Badge>
                    <h3 className="font-display text-lg font-semibold">{c.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{c.subtitle}</p>
                    <div className="mt-4">
                      <Progress value={pct} />
                      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                        <span>{formatCurrency(Number(c.raised))}</span>
                        <span>{formatCurrency(Number(c.goal))}</span>
                      </div>
                    </div>
                    <Button asChild className="mt-4 w-full" size="sm">
                      <Link href={`/${locale}/donate?campaign=${c.slug}`}>Donar a esta causa</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const FALLBACK = [
  {
    slug: 'inundaciones-zulia',
    title: 'Inundaciones en el Zulia',
    subtitle: 'Familias damnificadas por las crecidas del Lago de Maracaibo.',
    region: 'Zulia',
    goal: 80_000,
    raised: 62_400,
    coverImage: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80',
  },
];
