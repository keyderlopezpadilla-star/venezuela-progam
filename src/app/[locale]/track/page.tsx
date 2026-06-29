import { setRequestLocale } from 'next-intl/server';
import { TrackView } from '@/components/track/TrackView';

export const metadata = { title: 'Seguimiento' };

export default async function TrackPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ code?: string }>;
}) {
  const { locale } = await params;
  const { code } = await searchParams;
  setRequestLocale(locale);
  return <TrackView locale={locale} initialCode={code} />;
}