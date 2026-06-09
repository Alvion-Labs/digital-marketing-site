import type { Metadata } from 'next';

import SeoPreviewTool from '@/components/pages/tools/SeoPreviewTool';
import SeoPreviewGuide from '@/components/pages/tools/SeoPreviewGuide';
import LatestArticles from '@/components/pages/tools/LatestArticles';
import JsonLdScript from '@/components/global/JsonLdScript';
import { getBreadcrumbSchema } from '@/lib/seo/structuredData';

const SITE_URL = 'https://www.alviondigital.in';
const PAGE_URL = `${SITE_URL}/tools/seo-preview`;
const PAGE_TITLE = '100% Match: Free Google Search Result Preview Tool';
const PAGE_DESCRIPTION =
  'See exactly how your SEO title and meta description will appear in Google search results before publishing.100% accuracy. Visit tool now!';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    'Meta preview tool',
    'SERP preview tool',
    'meta title checker',
    'meta description checker',
    'Google snippet preview',
    'Meta title preview',
    'Meta description preview',
    'SEO title preview',
    'SEO description preview',
    'Google search result preview',
    'SERP snippet preview',
    'Meta tag preview',
    'SEO snippet preview',
  ],
  authors: [{ name: 'Alvion Digital' }],
  creator: 'Alvion Digital',
  publisher: 'Alvion Digital',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: '/tools/seo-preview',
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: '/tools/seo-preview',
    type: 'website',
    images: [
      {
        url: '/Pages/Tools/Meta Preview/Example One Preview.webp',
        width: 1200,
        height: 630,
        alt: 'SEO preview tool showing a Google-style search result snippet',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ['/Pages/Tools/Meta Preview/Example One Preview.webp'],
  },
};

const toolSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': PAGE_URL,
      url: PAGE_URL,
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      isPartOf: {
        '@type': 'WebSite',
        name: 'Alvion Digital Marketing',
        url: SITE_URL,
      },
      mainEntity: {
        '@id': `${PAGE_URL}#tool`,
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${PAGE_URL}#tool`,
      name: 'SEO Preview Tool',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: PAGE_URL,
      description: PAGE_DESCRIPTION,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Alvion Digital Marketing',
        url: SITE_URL,
      },
    },
  ],
};

const breadcrumbSchema = getBreadcrumbSchema([
  { name: 'Home', url: SITE_URL },
  { name: 'SEO Preview Tool', url: PAGE_URL },
]);

export default function SeoPreviewPage() {
  return (
    <>
      <JsonLdScript id="seo-preview-tool-schema" data={toolSchema} />
      <JsonLdScript id="seo-preview-breadcrumb-schema" data={breadcrumbSchema} />
      <main className="min-h-screen bg-white">
        <SeoPreviewTool />
        <SeoPreviewGuide />
        <LatestArticles />
      </main>
    </>
  );
}
