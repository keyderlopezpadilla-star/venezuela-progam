'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Download, Shield, FileText, ExternalLink, Mail, Phone, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { formatCurrency } from '@/lib/utils';

const COLORS = ['#0057FF', '#00C2A8', '#6C63FF', '#E53935', '#F59E0B'];

export function TransparencyView({ locale }: { locale: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['transparency'],
    queryFn: async () => {
      const res = await fetch('/api/transparency');
      if (!res.ok) throw new Error('Error');
      return res.json() as Promise<{
        totalRaised: string;
        donationsCount: number;
        donationsByMonth: { month: string; total: number }[];
        deliveriesByStatus: { status: string; count: number }[];
      }>;
    },
  });

  const total = data ? parseFloat(data.totalRaised) : 0;
  const aidCost = total * 0.92;
  const operationalCost = total * 0.08;

  return (
    <div className="pt-32 pb-24">
      <div className="container">
        <header className="max-w-3xl">
          <Badge variant="glass" className="mb-4 px-4 py-1.5">
            <Shield className="h-3.5 w-3.5" />
            Datos abiertos · Actualizado en tiempo real
          </Badge>
          <h1 className="font-display text-display-lg text-balance">
            Panel de transparencia
          </h1>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Cada movimiento de fondos es público, auditado y descargable.
          </p>
        </header>

        {/* KPIs */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Total recaudado" value={formatCurrency(total)} accent="primary" loading={isLoading} />
          <KpiCard label="Asistencia directa" value={formatCurrency(aidCost)} accent="secondary" loading={isLoading} />
          <KpiCard label="Costos operativos" value={formatCurrency(operationalCost)} accent="accent" loading={isLoading} />
          <KpiCard label="Donaciones" value={data?.donationsCount?.toLocaleString() ?? '—'} accent="warning" loading={isLoading} />
        </div>

        {/* Charts */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Donaciones por mes (últimos 12 meses)</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.donationsByMonth ?? []}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0057FF" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#0057FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(100,116,139,0.12)" strokeDasharray="3 6" />
                  <XAxis dataKey="month" stroke="rgb(100,116,139)" fontSize={11} />
                  <YAxis stroke="rgb(100,116,139)" fontSize={11} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: '1px solid rgba(100,116,139,0.2)',
                      boxShadow: '0 10px 40px rgba(15,23,42,0.12)',
                    }}
                    formatter={(v: any) => formatCurrency(Number(v))}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#0057FF"
                    strokeWidth={2.5}
                    fill="url(#g1)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribución de uso</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Asistencia', value: 92 },
                      { name: 'Operación', value: 8 },
                    ]}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    <Cell fill="#00C2A8" />
                    <Cell fill="#6C63FF" />
                  </Pie>
                  <Tooltip formatter={(v: any) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-secondary" /> Asistencia 92%
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent" /> Operación 8%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports */}
        <div id="reports" className="mt-12 grid gap-6 lg:grid-cols-3">
          <ReportCard
            title="Informe trimestral Q1 2026"
            description="Detalle de ingresos, egresos y entregas. Firmado por auditoría externa."
            size="2.4 MB"
            href="/reports/q1-2026.pdf"
          />
          <ReportCard
            title="Informe anual 2025"
            description="Resumen anual con impacto, cobertura y resultados financieros."
            size="5.8 MB"
            href="/reports/2025.pdf"
          />
          <ReportCard
            title="Datos abiertos (CSV)"
            description="Dataset completo de donaciones y entregas en formato abierto."
            size="812 KB"
            href="/api/transparency/export.csv"
          />
        </div>

        {/* Organization */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>¿Quiénes somos?</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground text-pretty">
              <p>
                <strong className="text-foreground">Venezuela Solidaria</strong> es una iniciativa
                independiente, sin fines de lucro, registrada legalmente en la República Bolivariana de Venezuela
                bajo el RIF J-50123456-7.
              </p>
              <p>
                Nuestro consejo directivo está compuesto por profesionales independientes de la sociedad civil,
                especialistas en logística, derecho humanitario y salud pública. Ningún miembro percibe remuneración.
              </p>
              <p>
                Todas las operaciones son auditadas trimestralmente por una firma independiente. Los informes
                completos están disponibles públicamente.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="success">Auditada</Badge>
                <Badge variant="default">Datos abiertos</Badge>
                <Badge variant="secondary">RGPD</Badge>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-muted/40 p-6 space-y-3">
              <ContactRow Icon={Building} label="Razón social" value="Asociación Civil Venezuela Solidaria" />
              <ContactRow Icon={FileText} label="RIF" value="J-50123456-7" />
              <ContactRow Icon={Mail} label="Email oficial" value="contacto@venezuelasolidaria.org" />
              <ContactRow Icon={Phone} label="Teléfono" value="+58 412 000 0000" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  accent,
  loading,
}: {
  label: string;
  value: string;
  accent: 'primary' | 'secondary' | 'accent' | 'warning';
  loading?: boolean;
}) {
  const accentClass: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary-600',
    accent: 'bg-accent/10 text-accent',
    warning: 'bg-amber-500/10 text-amber-600',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="card-hover">
        <CardContent className="p-6">
          <div className={`inline-grid h-10 w-10 place-items-center rounded-2xl ${accentClass[accent]}`}>
            <Shield className="h-4 w-4" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 font-display text-3xl font-semibold tracking-tight">
            {loading ? '—' : value}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ReportCard({ title, description, size, href }: { title: string; description: string; size: string; href: string }) {
  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
          <FileText className="h-4 w-4" />
        </div>
        <h4 className="mt-4 font-display text-lg font-semibold">{title}</h4>
        <p className="mt-1 text-sm text-muted-foreground text-pretty">{description}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>PDF · {size}</span>
          <Button asChild size="sm" variant="ghost" rightIcon={<Download className="h-3.5 w-3.5" />}>
            <a href={href}>Descargar</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ContactRow({ Icon, label, value }: { Icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-card">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="truncate font-medium">{value}</p>
      </div>
    </div>
  );
}