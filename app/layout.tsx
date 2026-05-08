import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import FloatingWhatsApp from '@/components/global/FloatingWhatsApp';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
export const metadata: Metadata = {
  metadataBase: new URL('https://alviondigital.in'),
  title: {
    default: 'Alvion Digital Marketing ( Social Media Expert, SEO & Ads Agency )',
    template: '%s | Alvion Digital Marketing',
  },
  description:
    'Leading digital marketing agency in India specializing in Social Media Management, Content Strategy, Google & Meta Ads, and SEO. Grow your business with data-driven marketing solutions.',
  keywords: [
    'digital marketing agency',
    'social media management',
    'SEO services',
    'Google Ads',
    'Meta Ads',
    'Facebook Ads',
    'Instagram marketing',
    'content strategy',
    'digital marketing India',
    'online marketing',
    'social media agency',
    'PPC management',
    'search engine optimization',
  ],
  authors: [{ name: 'Alvion Digital Marketing' }],
  creator: 'Alvion Digital Marketing',
  publisher: 'Alvion Digital Marketing',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/Croped%20SIngle%20%22A%22%20Logo.png',
    apple: '/Croped%20SIngle%20%22A%22%20Logo.png',
    shortcut: '/Croped%20SIngle%20%22A%22%20Logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://alviondigital.in',
    siteName: 'Alvion Digital Marketing',
    title: 'Alvion Digital Marketing  ( Social Media Expert, SEO & Ads Agency )',
    description: 'Leading digital marketing agency specializing in social media management, SEO, and paid advertising. Grow your business with proven strategies.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Alvion Digital Marketing - Social Media, SEO & Ads Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alvion Digital Marketing  ( Social Media Expert, SEO & Ads Agency )',
    description: 'Leading digital marketing agency specializing in social media management, SEO, and paid advertising.',
    images: ['/twitter-image'],
    creator: '@alviondigital',
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
  alternates: {
    canonical: 'https://alviondigital.in',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFFFFF',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}
        <FloatingWhatsApp />
        <Analytics/>
        <SpeedInsights/>
      </body>
    </html>
  );
}
