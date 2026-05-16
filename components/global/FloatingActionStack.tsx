'use client';

import { useEffect, useState } from 'react';
import FloatingScrollControls from './FloatingScrollControls';
import FloatingWhatsApp from './FloatingWhatsApp';

export default function FloatingActionStack() {
  const [scrolledDown, setScrolledDown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolledDown(window.scrollY > 120);

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <div className={scrolledDown ? 'order-first' : 'order-last'}>
        <FloatingWhatsApp />
      </div>
      <div className={scrolledDown ? 'order-last' : 'order-first'}>
        <FloatingScrollControls />
      </div>
    </div>
  );
}
