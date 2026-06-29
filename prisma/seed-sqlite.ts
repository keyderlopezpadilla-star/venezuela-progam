// Seed compatible con SQLite (modo demo local).
// Se ejecuta automáticamente con scripts/launch.sh o launch.bat.

import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando datos demo (SQLite)...');

  await db.user.upsert({
    where: { email: 'admin@venezuelasolidaria.org' },
    update: {},
    create: {
      email: 'admin@venezuelasolidaria.org',
      name: 'Administrador',
      role: 'SUPER_ADMIN',
      status: 'VERIFIED',
      emailVerified: new Date(),
    },
  });

  await db.user.upsert({
    where: { email: 'maria@example.com' },
    update: {},
    create: {
      email: 'maria@example.com',
      name: 'María González',
      role: 'DONOR',
      status: 'VERIFIED',
      emailVerified: new Date(),
    },
  });

  const warehouses = [
    { name: 'Centro Caracas', address: 'Av. Bolívar, Caracas', city: 'Caracas', state: 'Distrito Capital', latitude: 10.4806, longitude: -66.9036, isActive: true },
    { name: 'Centro Maracaibo', address: 'Av. 5 de Julio, Maracaibo', city: 'Maracaibo', state: 'Zulia', latitude: 10.6666, longitude: -71.6125, isActive: true },
    { name: 'Centro Mérida', address: 'Av. Las Américas, Mérida', city: 'Mérida', state: 'Mérida', latitude: 8.5983, longitude: -71.1418, isActive: true },
    { name: 'Centro Valencia', address: 'Av. Bolívar, Valencia', city: 'Valencia', state: 'Carabobo', latitude: 10.1621, longitude: -68.0077, isActive: true },
  ];

  for (const w of warehouses) {
    const existing = await db.warehouse.findFirst({ where: { name: w.name } });
    if (!existing) await db.warehouse.create({ data: w });
  }

  const campaigns = [
    {
      slug: 'inundaciones-zulia',
      title: 'Inundaciones en el Zulia',
      subtitle: 'Familias damnificadas por las crecidas del Lago de Maracaibo.',
      description: 'Apoyo inmediato a las familias afectadas por las inundaciones en el estado Zulia. La campaña financia alimentos, agua potable, kits de higiene y atención médica primaria.',
      goal: 80000, raised: 62400, donors: 1240,
      priority: 'CRITICAL', region: 'Zulia',
      coverImage: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80',
      emergencyType: 'INUNDACIÓN', beneficiaries: 3400,
    },
    {
      slug: 'agua-andes',
      title: 'Agua potable para los Andes',
      subtitle: 'Suministro y potabilización en zonas rurales.',
      description: 'Llevamos agua potable y sistemas de purificación a comunidades rurales de Mérida y Táchira.',
      goal: 45000, raised: 31900, donors: 845,
      priority: 'HIGH', region: 'Mérida',
      coverImage: 'https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?auto=format&fit=crop&w=1200&q=80',
      emergencyType: 'SEQUÍA', beneficiaries: 1800,
    },
    {
      slug: 'medicamentos-caracas',
      title: 'Medicamentos para Caracas',
      subtitle: 'Insumos médicos para comunidades vulnerables.',
      description: 'Medicamentos esenciales para adultos mayores, niños y personas con enfermedades crónicas en zonas populares de Caracas.',
      goal: 60000, raised: 48200, donors: 1104,
      priority: 'MEDIUM', region: 'Distrito Capital',
      coverImage: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80',
      emergencyType: 'SALUD', beneficiaries: 2200,
    },
    {
      slug: 'voluntariado-oriente',
      title: 'Red de voluntarios del Oriente',
      subtitle: 'Capacitación y logística para envíos regionales.',
      description: 'Capacitación, transporte y equipamiento para nuestra red de voluntarios en Sucre, Monagas y Bolívar.',
      goal: 25000, raised: 12300, donors: 380,
      priority: 'LOW', region: 'Oriente',
      coverImage: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
      emergencyType: 'LOGÍSTICA', beneficiaries: 800,
    },
  ];

  for (const c of campaigns) {
    await db.campaign.upsert({ where: { slug: c.slug }, update: c, create: c });
  }

  // Algunas donaciones demo
  const donor = await db.user.findUnique({ where: { email: 'maria@example.com' } });
  if (donor) {
    const existing = await db.donation.findFirst({ where: { donorUserId: donor.id } });
    if (!existing) {
      await db.donation.createMany({
        data: [
          { donorUserId: donor.id, amount: 50, currency: 'USD', type: 'ONE_TIME', status: 'COMPLETED', trackingCode: 'VZS-A7K9-P2QM', isAnonymous: false, donorName: 'María González', donorEmail: donor.email, completedAt: new Date() },
          { donorUserId: donor.id, amount: 25, currency: 'USD', type: 'ONE_TIME', status: 'COMPLETED', trackingCode: 'VZS-B3H8-Q1XL', isAnonymous: false, donorName: 'María González', donorEmail: donor.email, completedAt: new Date(Date.now() - 86400_000 * 12) },
          { donorUserId: donor.id, amount: 100, currency: 'USD', type: 'RECURRING', status: 'COMPLETED', trackingCode: 'VZS-C9L2-Z4NJ', isAnonymous: false, donorName: 'María González', donorEmail: donor.email, completedAt: new Date(Date.now() - 86400_000 * 32) },
        ],
      });
    }
  }

  console.log('✅ Datos demo sembrados.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());