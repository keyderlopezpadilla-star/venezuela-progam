import { db } from '@/lib/db';

async function main() {
  console.log('🌱 Sembrando datos...');

  const admin = await db.user.upsert({
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

  await db.warehouse.createMany({
    data: [
      { name: 'Centro Caracas', address: 'Av. Bolívar, Caracas', city: 'Caracas', state: 'Distrito Capital', latitude: 10.4806, longitude: -66.9036, isActive: true },
      { name: 'Centro Maracaibo', address: 'Av. 5 de Julio, Maracaibo', city: 'Maracaibo', state: 'Zulia', latitude: 10.6666, longitude: -71.6125, isActive: true },
      { name: 'Centro Mérida', address: 'Av. Las Américas, Mérida', city: 'Mérida', state: 'Mérida', latitude: 8.5983, longitude: -71.1418, isActive: true },
      { name: 'Centro Valencia', address: 'Av. Bolívar, Valencia', city: 'Valencia', state: 'Carabobo', latitude: 10.1621, longitude: -68.0077, isActive: true },
    ],
    skipDuplicates: true,
  });

  const campaigns = [
    {
      slug: 'inundaciones-zulia',
      title: 'Inundaciones en el Zulia',
      subtitle: 'Familias damnificadas por las crecidas del Lago de Maracaibo.',
      description: 'Apoyo inmediato a las familias afectadas por las inundaciones en el estado Zulia. La campaña financia alimentos, agua potable, kits de higiene y atención médica primaria.',
      goal: 80_000,
      raised: 62_400,
      donors: 1_240,
      priority: 'CRITICAL',
      region: 'Zulia',
      coverImage: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80',
      emergencyType: 'INUNDACIÓN',
      beneficiaries: 3_400,
    },
    {
      slug: 'agua-andes',
      title: 'Agua potable para los Andes',
      subtitle: 'Suministro y potabilización en zonas rurales.',
      description: 'Llevamos agua potable y sistemas de purificación a comunidades rurales de Mérida y Táchira.',
      goal: 45_000,
      raised: 31_900,
      donors: 845,
      priority: 'HIGH',
      region: 'Mérida',
      coverImage: 'https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?auto=format&fit=crop&w=1200&q=80',
      emergencyType: 'SEQUÍA',
      beneficiaries: 1_800,
    },
    {
      slug: 'medicamentos-caracas',
      title: 'Medicamentos para Caracas',
      subtitle: 'Insumos médicos para comunidades vulnerables.',
      description: 'Medicamentos esenciales para adultos mayores, niños y personas con enfermedades crónicas en zonas populares de Caracas.',
      goal: 60_000,
      raised: 48_200,
      donors: 1_104,
      priority: 'MEDIUM',
      region: 'Distrito Capital',
      coverImage: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80',
      emergencyType: 'SALUD',
      beneficiaries: 2_200,
    },
    {
      slug: 'voluntariado-oriente',
      title: 'Red de voluntarios del Oriente',
      subtitle: 'Capacitación y logística para envíos regionales.',
      description: 'Capacitación, transporte y equipamiento para nuestra red de voluntarios en Sucre, Monagas y Bolívar.',
      goal: 25_000,
      raised: 12_300,
      donors: 380,
      priority: 'LOW',
      region: 'Oriente',
      coverImage: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
      emergencyType: 'LOGÍSTICA',
      beneficiaries: 800,
    },
  ];

  for (const c of campaigns) {
    await db.campaign.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }

  console.log('✅ Datos sembrados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());