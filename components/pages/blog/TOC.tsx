'use client';

import { useState, useEffect, useRef } from 'react';

interface TOCItem {
  title: string;
  anchor: string;
}

interface TOCProps {
  items: TOCItem[];
}

export default function TOC({ items }: TOCProps) {
  const [activeAnchor, setActiveAnchor] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const userClickRef = useRef(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current || items.length === 0) return;

    const currentHash = window.location.hash.replace('#', '');
    const initialAnchor = items.find((item) => item.anchor === currentHash)?.anchor || items[0].anchor;

    setActiveAnchor(initialAnchor);
    initializedRef.current = true;
  }, [items]);

  useEffect(() => {
    // Don't run observer if user just clicked — wait for scroll to settle
    if (userClickRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Ignore observer callbacks for a short time after a manual click
        if (userClickRef.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveAnchor(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    // Observe all anchor elements
    items.forEach((item) => {
      const element = document.getElementById(item.anchor);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  const handleLinkClick = (anchor: string) => {
    // Close mobile menu
    setIsOpen(false);
    
    // Block observer from interfering during scroll
    userClickRef.current = true;
    
    // Set active immediately
    setActiveAnchor(anchor);
    
    // Wait for dropdown collapse animation, then scroll
    setTimeout(() => {
      const el = document.getElementById(anchor);
      if (!el) return;
      
      // Mobile: navbar (64px) + sticky TOC bar (~76px) + visible gap (40px) = 180px
      // Desktop: navbar (~96px) = 96px
      const offset = window.innerWidth < 768 ? 180 : 96;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
      
      // Re-enable observer after scroll
      setTimeout(() => { userClickRef.current = false; }, 800);
    }, 300);
  };

  if (!items || items.length === 0) {
    return null;
  }

  const renderTOCLink = (item: TOCItem, idx: number, variant: 'mobile' | 'desktop') => {
    const isActive = activeAnchor === item.anchor;

    return (
      <a
        key={item.anchor}
        href={`#${item.anchor}`}
        onClick={(e) => {
          e.preventDefault();
          handleLinkClick(item.anchor);
        }}
        className={`w-full text-left group flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all duration-200 relative ${
          variant === 'desktop' ? 'items-start' : ''
        } ${
          isActive
            ? 'text-gray-900'
            : 'text-gray-600 hover:text-gray-700'
        }`}
      >
        <span
          className={`text-xs font-bold transition-colors ${
            isActive ? 'text-gray-900 font-extrabold' : 'text-gray-600 group-hover:text-gray-700'
          }`}
        >
          {String(idx + 1).padStart(2, '0')}
        </span>

        <span
          className={`text-sm leading-snug transition-all flex-1 ${
            isActive ? 'text-gray-900 font-bold' : 'text-gray-600 group-hover:text-gray-700'
          }`}
        >
          {item.title}
        </span>
      </a>
    );
  };

  return (
    <>
      {/* Mobile TOC - Parent handles sticky */}
      <div className="md:hidden py-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full group text-left"
        >
          <div className="relative px-4 py-3 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center group-hover:from-accent-from/5 group-hover:to-accent-from/10 transition-all">
                  <svg className="w-5 h-5 text-accent-from" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-sm">Table of content</div>
                  <div className="text-xs text-gray-500">{items.length} sections</div>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 group-hover:text-gray-600 ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7" />
              </svg>
            </div>
          </div>
        </button>
        <nav className={`transition-all duration-300 ${
          isOpen 
            ? 'mt-3 space-y-1.5 px-2 opacity-100 max-h-96 overflow-y-auto' 
            : 'mt-0 opacity-0 max-h-0 overflow-hidden'
        }`}>
          {items.map((item, idx) => renderTOCLink(item, idx, 'mobile'))}
        </nav>
      </div>

      {/* Desktop TOC - Sticky Sidebar */}
      <nav className="hidden md:block md:sticky md:top-24 md:max-h-[calc(100vh-8rem)] md:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className="space-y-5">
          {/* Header */}
          <div className="pb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-from" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 text-base">Table of content</h3>
            </div>
            <p className="text-xs text-gray-500 ml-12">{items.length} sections to explore</p>
          </div>
          
          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {items.map((item, idx) => renderTOCLink(item, idx, 'desktop'))}
          </nav>
        </div>
      </nav>
    </>
  );
}
