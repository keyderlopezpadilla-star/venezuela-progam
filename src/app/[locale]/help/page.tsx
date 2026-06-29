import { setRequestLocale } from 'next-intl/server';
import { HelpView } from '@/components/help/HelpView';

export const metadata = { title: 'Solicitar ayuda' };

export default async function HelpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HelpView />;
}