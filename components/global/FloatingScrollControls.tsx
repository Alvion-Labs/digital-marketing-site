'use client';

import { useEffect, useState } from 'react';

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
  const scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  window.scrollTo({ top: scrollHeight, behavior: 'smooth' });
}

export default function FloatingScrollControls() {
  const [scrolledDown, setScrolledDown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolledDown(window.scrollY > 120);

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={scrollToTop}
        className={`group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg shadow-blue-500/10 transition-all duration-300 hover:scale-110 hover:border-blue-400/50 hover:shadow-blue-500/20 ${
          scrolledDown ? 'pointer-events-auto opacity-100 translate-y-0 scale-100' : 'pointer-events-none opacity-0 -translate-y-2 scale-95'
        }`}
        aria-label="Scroll to top"
      >
        <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-sky-500/10 to-blue-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <img
          src="/icons/up%20Arrow.webp"
          alt="Scroll up"
          className="relative h-8 w-8 object-contain transition-transform duration-300 group-hover:-translate-y-0.5"
        />
      </button>

      <button
        type="button"
        onClick={scrollToBottom}
        className="group relative hidden h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg shadow-blue-500/10 transition-all duration-300 hover:scale-110 hover:border-blue-400/50 hover:shadow-blue-500/20 md:flex"
        aria-label="Scroll to bottom"
      >
        <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-sky-500/10 to-blue-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <img
          src="/icons/down%20Arrow.webp"
          alt="Scroll down"
          className="relative h-8 w-8 object-contain transition-transform duration-300 group-hover:translate-y-0.5"
        />
      </button>
    </div>
  );
}
