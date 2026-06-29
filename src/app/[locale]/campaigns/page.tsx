import { setRequestLocale } from 'next-intl/server';
import { CampaignsList } from '@/components/marketing/CampaignsList';

export const metadata = { title: 'Campañas' };

export default async function CampaignsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CampaignsList locale={locale} />;
}
