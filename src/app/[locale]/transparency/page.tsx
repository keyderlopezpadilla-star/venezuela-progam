import { setRequestLocale } from 'next-intl/server';
import { TransparencyView } from '@/components/transparency/TransparencyView';

export const metadata = { title: 'Transparencia' };

export default async function TransparencyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TransparencyView locale={locale} />;
}