import type { Metadata } from 'next';
import ServicesPage from '@/components/pages/services/ServicesPage';
import {
  getBreadcrumbSchema,
  getServiceSchema,
} from '@/lib/seo/structuredData';
import JsonLdScript from '@/components/global/JsonLdScript';

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
    title: 'Digital Marketing & Web Development Services - Alvion Digital Marketing',
    description:
      'Explore our digital marketing services to help your brand grow online, increase visibility, and generate quality leads.',
    url: '/services',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Marketing & Web Development Services - Alvion Digital Marketing',
    description:
      'Explore our digital marketing services to help your brand grow online, increase visibility, and generate quality leads.',
  },
};

const serviceSchema = getServiceSchema();
const breadcrumbSchema = getBreadcrumbSchema([
  { name: 'Home', url: 'https://www.alviondigital.in' },
  { name: 'Digital Marketing & Web Development Services', url: 'https://www.alviondigital.in/services' },
]);

export default function ServicesRoute() {
  return (
    <>
      <JsonLdScript id="services-schema" data={serviceSchema} />
      <JsonLdScript id="services-breadcrumb-schema" data={breadcrumbSchema} />
      <ServicesPage />
    </>
  );
}