import { setRequestLocale } from 'next-intl/server';
import { VolunteerView } from '@/components/volunteer/VolunteerView';

export const metadata = { title: 'Voluntariado' };

export default async function VolunteerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <VolunteerView />;
}