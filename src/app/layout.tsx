import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AppProviders } from '@/components/providers/AppProviders';
import '@/styles/globals.css';

// Inter como fuente principal (Apple-grade legibilidad).
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Venezuela Solidaria · Ayuda transparente y verificable',
    template: '%s · Venezuela Solidaria',
  },
  description:
    'Plataforma humanitaria que conecta donaciones internacionales con familias afectadas por emergencias en Venezuela. Trazabilidad total, evidencia fotográfica y reportes auditados.',
  applicationName: 'Venezuela Solidaria',
  keywords: [
    'Venezuela',
    'solidaridad',
    'donaciones',
    'ayuda humanitaria',
    'transparencia',
    'voluntariado',
    'emergencias',
    'ONG',
    'caridad',
  ],
  authors: [{ name: 'Venezuela Solidaria' }],
  creator: 'Venezuela Solidaria',
  publisher: 'Venezuela Solidaria',
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: '/',
    languages: { es: '/es', en: '/en', pt: '/pt' },
  },
  openGraph: {
    type: 'website',
    locale: 'es_VE',
    url: '/',
    siteName: 'Venezuela Solidaria',
    title: 'Venezuela Solidaria · Ayuda transparente y verificable',
    description:
      'Cada granito cuenta. Cada vida importa. Plataforma humanitaria verificada.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Venezuela Solidaria',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Venezuela Solidaria',
    description: 'Ayuda transparente y verificable para Venezuela',
    images: ['/og-image.jpg'],
    creator: '@venezuelasolidaria',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Venezuela Solidaria',
  },
  verification: {
    google: '',
  },
  category: 'nonprofit',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0F1C' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD: organización sin fines de lucro.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'Venezuela Solidaria',
    url: process.env.NEXT_PUBLIC_APP_URL,
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/icons/icon-512x512.png`,
    description:
      'Plataforma humanitaria sin fines de lucro. Conectamos donaciones internacionales con familias afectadas por emergencias en Venezuela.',
    sameAs: [
      'https://twitter.com/venezuelasolidaria',
      'https://instagram.com/venezuelasolidaria',
      'https://facebook.com/venezuelasolidaria',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'VE',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'contacto@venezuelasolidaria.org',
      availableLanguage: ['Spanish', 'English', 'Portuguese'],
    },
    nonProfitStatus: 'Nonprofit501c3',
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}