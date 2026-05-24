import Hero from '@/components/pages/home/Hero';
import About from '@/components/pages/home/About';
import Services from '@/components/pages/home/Services';
import BlogSection from '@/components/pages/home/Blog';
import Pricing from '@/components/pages/home/Pricing';
import Contact from '@/components/pages/home/Contact';
import JsonLdScript from '@/components/global/JsonLdScript';

export default function Home() {
  return (
    <main className="bg-white">
      {/* FAQ JSON-LD removed per request to avoid Search Console issues */}
      <Hero />
      <div className="border-t border-gray-100 bg-white">
        <About />
      </div>
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
