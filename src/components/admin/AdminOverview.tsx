'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Users, Heart, Truck, Package, AlertTriangle, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';

export function AdminOverview() {
  const { data } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: async () => {
      const r = await fetch('/api/admin/overview');
      if (!r.ok) return null;
      return r.json();
    },
  });

  const stats = [
    { Icon: Heart, label: 'Donaciones hoy', value: data?.todayDonations ?? '$ 18,430' },
    { Icon: Users, label: 'Voluntarios activos', value: data?.activeVolunteers?.toLocaleString() ?? '2,847' },
    { Icon: Truck, label: 'Entregas en tránsito', value: data?.inTransit?.toLocaleString() ?? '34' },
    { Icon: Package, label: 'Centros activos', value: data?.warehouses?.toString() ?? '14' },
    { Icon: AlertTriangle, label: 'Solicitudes críticas', value: data?.criticalHelp?.toString() ?? '7' },
    { Icon: Activity, label: 'Total recaudado', value: data?.totalRaised ? formatCurrency(Number(data.totalRaised)) : '$ 1.8M' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Panel de administración</h1>
        <p className="mt-1 text-sm text-muted-foreground">Visión global y operativa de la plataforma.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ Icon, label, value }) => (
          <Card key={label}>
            <CardContent className="p-6">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
              <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Últimas donaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {(data?.recentDonations ?? []).slice(0, 6).map((d: any) => (
              <div key={d.id} className="flex items-center justify-between rounded-2xl border border-border p-3">
                <div>
                  <p className="font-mono text-xs">{d.trackingCode}</p>
                  <p className="text-xs text-muted-foreground">{d.donorName || 'Anónimo'}</p>
                </div>
                <span className="font-semibold">{formatCurrency(Number(d.amount))}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Solicitudes críticas pendientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {(data?.criticalRequests ?? []).slice(0, 6).map((h: any) => (
              <div key={h.id} className="flex items-center justify-between rounded-2xl border border-border p-3">
                <div>
                  <p className="font-mono text-xs">{h.trackingCode}</p>
                  <p className="text-xs text-muted-foreground">{h.fullName} · {h.city}</p>
                </div>
                <Link href="/admin/help" className="text-xs font-medium text-primary hover:underline">
                  Gestionar
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}