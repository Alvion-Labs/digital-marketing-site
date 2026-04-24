import Navbar from '@/components/global/Navbar';
import Footer from '@/components/global/Footer';
import Hero from '@/components/pages/home/Hero';
import Services from '@/components/pages/home/Services';
import SocialGallery from '@/components/pages/home/SocialGallery';
import Contact from '@/components/pages/home/Contact';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <SocialGallery />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
