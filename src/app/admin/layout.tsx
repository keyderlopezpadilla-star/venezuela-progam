import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { LayoutDashboard, Heart, Users, Warehouse, Truck, FileText, Shield, Settings, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin', label: 'Overview', Icon: LayoutDashboard },
  { href: '/admin/donations', label: 'Donaciones', Icon: Heart },
  { href: '/admin/volunteers', label: 'Voluntarios', Icon: Users },
  { href: '/admin/warehouses', label: 'Almacenes', Icon: Warehouse },
  { href: '/admin/deliveries', label: 'Entregas', Icon: Truck },
  { href: '/admin/inventory', label: 'Inventario', Icon: FileText },
  { href: '/admin/campaigns', label: 'Campañas', Icon: FileText },
  { href: '/admin/reports', label: 'Reportes', Icon: FileText },
  { href: '/admin/users', label: 'Usuarios', Icon: Users },
  { href: '/admin/audit', label: 'Auditoría', Icon: Shield },
  { href: '/admin/settings', label: 'Configuración', Icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/es/login');
  if (!['ADMIN', 'SUPER_ADMIN'].includes((session.user as any).role)) {
    redirect('/es');
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r bg-card lg:block">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-primary shadow-glow-primary">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-base font-semibold">Admin VZS</span>
          </Link>
        </div>
        <nav className="p-3">
          {NAV.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="p-6 sm:p-10">{children}</main>
    </div>
  );
}