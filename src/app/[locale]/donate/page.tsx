import { setRequestLocale } from 'next-intl/server';
import { DonationView } from '@/components/donation/DonationView';

export const metadata = { title: 'Donar' };

export default async function DonatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DonationView locale={locale} />;
}