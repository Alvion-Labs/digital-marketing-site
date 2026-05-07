'use client';

import Image from 'next/image';
import Container from '@/components/global/Container';
import Button from '@/components/global/Button';
import { useEffect, useState } from 'react';

const FloatingLogo = ({ 
  src, 
  delay, 
  duration,
  top,
  left,
  size = 120
}: { 
  src: string; 
  delay: number; 
  duration: number;
  top: string;
  left: string;
  size?: number;
}) => {
  return (
    <div
      className="absolute hidden md:block opacity-10 pointer-events-none"
      style={{
        animation: `slideUp ${duration}s ease-out ${delay}s forwards`,
        animationFillMode: 'backwards',
        width: `${size}px`,
        height: `${size}px`,
        top,
        left,
      }}
    >
      <Image src={src} alt="logo" fill className="object-contain" sizes="(max-width: 768px) 0px, 120px" />
    </div>
  );
};

export default function Hero() {
  const handleScroll = (selector: string) => {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white"
    >
      {/* Animated floating 3D logos background */}
      <style>{`
        @keyframes slideUp {
          0% { 
            transform: translateY(100px);
            opacity: 0;
          }
          60% {
            opacity: 0.2;
          }
          100% { 
            transform: translateY(0px);
            opacity: 0.2;
          }
        }
        @keyframes typing {
          0% {
            clip-path: inset(0 100% 0 0);
          }
          1% {
            clip-path: inset(0 100% 0 0);
          }
          15% {
            clip-path: inset(0 0% 0 0);
          }
          85% {
            clip-path: inset(0 0% 0 0);
          }
          99% {
            clip-path: inset(0 100% 0 0);
          }
          100% {
            clip-path: inset(0 100% 0 0);
          }
        }
        .typing-text {
          display: inline-block;
          white-space: nowrap;
          animation: typing 8s ease-in-out infinite;
        }
      `}</style>
      
      {/* Bottom left corner */}
      <FloatingLogo src="/logos/instagram 3d.png" delay={0} duration={8} top="72%" left="2%" size={90} />
      <FloatingLogo src="/logos/facebook 3d.png" delay={0.5} duration={8.5} top="78%" left="12%" size={85} />
      <FloatingLogo src="/logos/linkedin 3d.png" delay={1} duration={9} top="75%" left="22%" size={80} />
      
      {/* Bottom right corner */}
      <FloatingLogo src="/logos/google 3d.png" delay={1.5} duration={8.5} top="78%" left="76%" size={85} />
      <FloatingLogo src="/logos/meta 3d.png" delay={0.8} duration={9} top="72%" left="86%" size={90} />
      <FloatingLogo src="/logos/facebook 3d.png" delay={1.3} duration={8.7} top="75%" left="66%" size={80} />
      
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-from/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-to/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-accent-from/10 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10 text-center py-24 pt-32">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-from/40 bg-accent-from/10 text-accent-to text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-accent-to animate-pulse" />
          Digital Marketing Agency
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tight text-black">
          Crafting digital presence{' '}
          <span className="gradient-text typing-text">That actually works</span>
        </h1>

        <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
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

        <div className="mt-20">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <a
              href="https://www.instagram.com/alviondigitalmarketing/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="group relative p-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-pink-400/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/20"
            >
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Image src="/logos/insta filled.svg" alt="Instagram" width={32} height={32} className="relative w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=61562935378228"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="group relative p-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-blue-400/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Image src="/logos/facebook filled.svg" alt="Facebook" width={32} height={32} className="relative w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="group relative p-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-blue-600/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-600/20"
            >
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-600/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Image src="/logos/linkedInFilled.svg" alt="LinkedIn" width={32} height={32} className="relative w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="group relative p-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-gray-800/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-gray-800/20"
            >
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-gray-800/10 to-gray-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Image src="/logos/X-twitter filled.svg" alt="Twitter" width={32} height={32} className="relative w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
