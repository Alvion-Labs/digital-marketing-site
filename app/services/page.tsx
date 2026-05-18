import type { Metadata } from 'next';
import Script from 'next/script';
import ServicesPage from '@/components/pages/services/ServicesPage';
import {
  getBreadcrumbSchema,
  getServiceSchema,
} from '@/lib/seo/structuredData';

export const metadata: Metadata = {
  title: 'Digital Marketing & Web Development Services',
  description:
    'Explore our digital marketing services to help your brand grow online, increase visibility, and generate quality leads.',
  keywords: [
    'digital marketing services',
    'social media marketing services',
    'SEO services',
    'paid advertising services',
    'website development services',
    'lead generation marketing',
    'digital marketing India',
  ],
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Services - Social Media Marketing, SEO, Ads & Web Development',
    description:
      'Explore our digital marketing services to help your brand grow online, increase visibility, and generate quality leads.',
    url: '/services',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services - Social Media Marketing, SEO, Ads & Web Development',
    description:
      'Explore our digital marketing services to help your brand grow online, increase visibility, and generate quality leads.',
  },
};

const serviceSchema = getServiceSchema();
const breadcrumbSchema = getBreadcrumbSchema([
  { name: 'Home', url: 'https://www.alviondigital.in' },
  { name: 'Services', url: 'https://www.alviondigital.in/services' },
]);

export default function ServicesRoute() {
  return (
    <>
      <Script id="services-schema" type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </Script>
      <Script id="services-breadcrumb-schema" type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      <ServicesPage />
    </>
  );
}