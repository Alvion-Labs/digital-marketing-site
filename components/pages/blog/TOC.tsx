'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
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
    // Close mobile menu on link click
    setIsOpen(false);
    
    // Scroll to the element with offset for sticky header and mobile TOC
    setTimeout(() => {
      const element = document.getElementById(anchor);
      if (element) {
        // Calculate offset: header + mobile TOC (if on mobile) + extra padding
        // Mobile: header (~64px) + sticky TOC (~80px) + padding (~24px) = ~168px
        // Desktop: header (~96px) = ~96px
        const headerHeight = window.innerWidth < 768 ? 168 : 96;
        
        // Calculate position accounting for sticky header/TOC
        const elementPosition = element.getBoundingClientRect().top + window.scrollY - headerHeight;
        
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
        setActiveAnchor(anchor);
      }
    }, 0);
  };

  if (!items || items.length === 0) {
    return null;
  }

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
        <nav className={`overflow-hidden transition-all duration-300 ${
          isOpen 
            ? 'mt-3 space-y-1.5 px-2 opacity-100 max-h-96' 
            : 'mt-0 opacity-0 max-h-0'
        }`}>
          {items.map((item, idx) => (
            <button
              key={item.anchor}
              onClick={() => handleLinkClick(item.anchor)}
              className={`w-full text-left group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 relative ${
                activeAnchor === item.anchor
                  ? 'text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 shadow-sm'
                  : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50/50'
              }`}
            >
              {activeAnchor === item.anchor && (
                <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-100 to-blue-50 -z-10" />
              )}
              <span className={`text-xs font-bold transition-colors group-hover:underline ${
                activeAnchor === item.anchor
                  ? 'text-blue-700'
                  : 'text-blue-600 group-hover:text-blue-700'
              }`}>
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="text-sm leading-snug group-hover:underline transition-all flex-1 text-blue-600 group-hover:text-blue-700">{item.title}</span>
            </button>
          ))}
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
            {items.map((item, idx) => (
              <button
                key={item.anchor}
                onClick={() => handleLinkClick(item.anchor)}
                className={`w-full text-left group flex items-start gap-3 px-4 py-2.5 rounded-2xl transition-all duration-200 relative ${
                  activeAnchor === item.anchor
                    ? 'text-blue-700 bg-blue-50 hover:bg-blue-100 shadow-sm'
                    : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50/40'
                }`}
              >
                {activeAnchor === item.anchor && (
                  <>
                    <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-100 to-blue-50 -z-10" />
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-linear-to-b from-blue-600 to-blue-500 rounded-full" />
                  </>
                )}
                <span className={`text-xs font-bold pt-0.5 transition-colors group-hover:underline ${
                  activeAnchor === item.anchor
                    ? 'text-blue-700'
                    : 'text-blue-600 group-hover:text-blue-700'
                }`}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className={`text-sm leading-snug group-hover:translate-x-0.5 transition-all flex-1 text-blue-600 group-hover:text-blue-700 group-hover:underline ${
                  activeAnchor === item.anchor
                    ? 'font-semibold'
                    : ''
                }`}>
                  {item.title}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </nav>
    </>
  );
}
