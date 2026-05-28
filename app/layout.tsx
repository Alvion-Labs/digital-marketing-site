import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

import '@/styles/globals.css';
import SiteShell from '@/components/global/SiteShell';
import DynamicFloatingActionStack from '@/components/global/DynamicFloatingActionStack';
import AdSenseScript from '@/components/global/AdSenseScript';

const SITE_URL = 'https://www.alviondigital.in';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Digital Marketing Agency for Modern Businesses | Alvion Digital',
    template: '%s | Alvion Digital Marketing',
  },
  description:
    'At Alvion Digital, we help businesses to grow online, build a strong brand presence, and generate quality leads through SEO, social media marketing, paid ads, and high-performing websites backed by best industry practices for better ROI and long-term growth.',
  keywords: [
    'digital marketing agency',
    'social media management',
    'SEO services',
    'paid advertising',
    'paid media',
    'paid social ads',
    'Instagram marketing',
    'content strategy',
    'digital marketing India',
    'online marketing',
    'social media agency',
    'performance marketing',
    'search engine optimization',
    'website development',
    'brand building',
    'lead generation',
    'ROI-focused marketing',
    'long-term growth',
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
    url: SITE_URL,
    siteName: 'Alvion Digital Marketing',
    title: 'Digital Marketing Agency for Modern Businesses | Alvion Digital',
    description:
      'At Alvion Digital, we help businesses to grow online, build a strong brand presence, and generate quality leads through SEO, social media marketing, paid ads, and high-performing websites backed by best industry practices for better ROI and long-term growth.',
    images: [
      {
        url: '/Alvion%20Logo%20landsacpe.webp',
        width: 1200,
        height: 630,
        alt: 'Alvion Digital Marketing - Social Media, SEO & websites Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Marketing Agency for Modern Businesses | Alvion Digital',
    description:
      'At Alvion Digital, we help businesses grow online, build a strong brand presence, and generate quality leads through SEO, social media marketing, paid ads, and high-performing websites backed by best industry practices for better ROI and long-term growth.',
    images: ['/Alvion%20Logo%20landsacpe.webp'],
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
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFFFFF',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased">
        <SiteShell>{children}</SiteShell>
        <DynamicFloatingActionStack />

        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-V2BSEZKEX3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-V2BSEZKEX3');`}
        </Script>

        {/* Google AdSense */}
        <AdSenseScript />

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}