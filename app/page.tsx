import Navbar from '@/components/global/Navbar';
import Footer from '@/components/global/Footer';
import Hero from '@/components/pages/home/Hero';
import Services from '@/components/pages/home/Services';
import BlogSection from '@/components/pages/home/Blog';
import Pricing from '@/components/pages/home/Pricing';
import Contact from '@/components/pages/home/Contact';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
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
      <Footer />
    </>
  );
}
