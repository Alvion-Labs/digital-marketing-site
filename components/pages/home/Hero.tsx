'use client';

import Container from '@/components/global/Container';
import Button from '@/components/global/Button';

export default function Hero() {
  const handleScroll = (selector: string) => {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary"
    >
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#1E6BFF]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#00A3FF]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1E6BFF]/5 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10 text-center py-24 pt-32">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1E6BFF]/40 bg-[#1E6BFF]/10 text-[#00A3FF] text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-[#00A3FF] animate-pulse" />
          Digital Marketing Agency
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
          Crafting digital presence{' '}
          <span className="gradient-text">that actually works</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Social Media Management &nbsp;|&nbsp; Ads &nbsp;|&nbsp; Content Strategy &nbsp;|&nbsp; SEO
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" onClick={() => handleScroll('#contact')} className="text-base px-8 py-4">
            Get Started
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleScroll('#services')}
            className="text-base px-8 py-4"
          >
            Our Services
          </Button>
        </div>

        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { value: '200+', label: 'Clients Served' },
            { value: '3x', label: 'Avg. ROI' },
            { value: '5M+', label: 'Reach Generated' },
            { value: '98%', label: 'Satisfaction Rate' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-3xl font-extrabold gradient-text">{stat.value}</span>
              <span className="text-slate-400 text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
