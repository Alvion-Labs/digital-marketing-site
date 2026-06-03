import type { Metadata } from 'next';
import JsonLdScript from '@/components/global/JsonLdScript';
import PricingPage from '@/components/pages/pricing/PricingPage';
import { getBreadcrumbSchema } from '@/lib/seo/structuredData';

const SITE_URL = 'https://www.alviondigital.in';

export const metadata: Metadata = {
  title: 'Pricing & Payment Process',
  description:
    'Explore Alvion Digital’s transparent pricing and two-week delivery and billing cycles for custom digital marketing projects.',
  keywords: [
    'pricing page',
    'digital marketing pricing',
    'payment process',
    'two-week delivery and billing cycles',
    'custom marketing pricing',
    'transparent pricing',
    'UPI payment',
    'credit card payment',
  ],
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Pricing & Payment Process - Alvion Digital Marketing',
    description:
      'Transparent, performance-focused pricing with two-week delivery and billing cycles and custom proposals tailored to your business goals.',
    url: '/pricing',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing & Payment Process - Alvion Digital Marketing',
    description:
      'Transparent, performance-focused pricing with two-week delivery and billing cycles and custom proposals tailored to your business goals.',
  },
};

const breadcrumbSchema = getBreadcrumbSchema([
  { name: 'Home', url: SITE_URL },
  { name: 'Pricing & Payment Process', url: `${SITE_URL}/pricing` },
]);

export default function PricingRoute() {
  return (
    <>
      <JsonLdScript id="pricing-breadcrumb-schema" data={breadcrumbSchema} />
      <PricingPage />
    </>
  );
}