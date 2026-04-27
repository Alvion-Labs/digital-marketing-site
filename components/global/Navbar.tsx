'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Container from './Container';
import { Bars3Icon, XMarkIcon } from './icons';
import LogoLink from './LogoLink';

const navLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'Services', href: '/#services' },
  { label: 'Gallery', href: '/#gallery' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass' : 'bg-transparent'
      }`}
    >
      <Container>
        <nav className="flex items-center justify-between h-16 md:h-20">
          <LogoLink onClick={() => setMenuOpen(false)}>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full overflow-hidden ring-1 ring-white/20 bg-white/10 shrink-0">
                <Image
                  src="/AlvionLogo.png"
                  alt="Alvion Digital Marketing"
                  width={40}
                  height={40}
                  priority
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="text-lg md:text-xl font-bold gradient-text whitespace-nowrap">
                Alvion Digital
              </span>
            </div>
          </LogoLink>

          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-linear-to-r after:from-accent-from after:to-accent-to hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/#contact"
            className="hidden md:inline-flex items-center justify-center px-5 py-2 rounded-lg font-semibold text-sm bg-linear-to-r from-accent-from to-accent-to text-white hover:opacity-90 transition-all duration-200 shadow-lg shadow-blue-500/25"
          >
            Get Started
          </Link>

          <button
            className="md:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </nav>
      </Container>

      {menuOpen && (
        <div className="md:hidden glass border-t border-white/10">
          <Container>
            <ul className="py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block text-sm font-medium text-slate-300 hover:text-white transition-colors py-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/#contact"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center justify-center px-5 py-2 rounded-lg font-semibold text-sm bg-linear-to-r from-accent-from to-accent-to text-white"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </Container>
        </div>
      )}
    </header>
  );
}
