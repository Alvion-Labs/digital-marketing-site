import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://alviondigital.com'),
  title: 'Alvion Digital Marketing — Crafting Digital Presence That Works',
  description:
    'Alvion Digital Marketing is a full-service digital marketing agency specializing in Social Media Management, Content Strategy, Google & Meta Ads, and SEO.',
  keywords: ['digital marketing', 'social media management', 'SEO', 'Google Ads', 'Meta Ads', 'content strategy', 'Alvion'],
  icons: {
    icon: '/AlvionLogo.png',
    apple: '/AlvionLogo.png',
  },
  openGraph: {
    title: 'Alvion Digital Marketing',
    description: 'Crafting digital presence that actually works.',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Alvion Digital Marketing' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alvion Digital Marketing',
    description: 'Crafting digital presence that actually works.',
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A2A43',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
