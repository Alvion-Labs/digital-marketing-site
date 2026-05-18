import Script from 'next/script';
import Hero from '@/components/pages/home/Hero';
import Services from '@/components/pages/home/Services';
import BlogSection from '@/components/pages/home/Blog';
import Pricing from '@/components/pages/home/Pricing';
import Contact from '@/components/pages/home/Contact';
import { getFAQSchema } from '@/lib/seo/structuredData';

const faqSchema = getFAQSchema();

export default function Home() {
  return (
    <main className="bg-white">
      <Script id="faq-schema" type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </Script>
      <Hero />
      <div className="border-t border-gray-100 bg-linear-to-b from-gray-50/70 to-white">
        <Services />
      </div>
      <div className="border-t border-gray-100 bg-white">
        <BlogSection />
      </div>
      <div className="border-t border-gray-100 bg-linear-to-b from-gray-50/70 to-white">
        <Pricing />
      </div>
      <div className="border-t border-gray-100 bg-white">
        <Contact />
      </div>
    </main>
  );
}
