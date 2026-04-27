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
      <main>
        <Hero />
        <Services />
        <BlogSection />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
