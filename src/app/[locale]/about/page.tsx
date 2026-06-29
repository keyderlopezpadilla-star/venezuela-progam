import { setRequestLocale } from 'next-intl/server';

export const metadata = { title: 'Quiénes somos' };

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <article className="prose prose-slate dark:prose-invert mx-auto max-w-3xl pt-32 pb-24">
      <h1>Quiénes somos</h1>
      <p>
        Venezuela Solidaria es una asociación civil sin fines de lucro dedicada a canalizar ayuda internacional
        con transparencia y trazabilidad a familias afectadas por emergencias en Venezuela.
      </p>
      <h2>Nuestra misión</h2>
      <p>Asegurar que cada donación llegue de forma verificable a quien más la necesita.</p>
      <h2>Consejo directivo</h2>
      <ul>
        <li>Presidenta: Dra. Lucía Hernández</li>
        <li>Director de Logística: Ing. Rafael Martínez</li>
        <li>Directora Jurídica: Lic. Andrea Suárez</li>
        <li>Director de Auditoría: Cp. Daniel León</li>
      </ul>
      <h2>Datos legales</h2>
      <p>RIF: J-50123456-7 · Registro Mercantil N° 123456 · Acta constitutiva disponible bajo solicitud.</p>
    </article>
  );
}
