'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Container from './Container';
import { Bars3Icon, XMarkIcon } from './icons';
import LogoLink from './LogoLink';

const navLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'About Us', href: '/#about' },
  { label: 'Services', href: '/services' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Blogs', href: '/blog' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSectionClick = (href: string) => {
    const hash = href.split('#')[1];
    if (!hash) return;

    setMenuOpen(false);

    if (pathname !== '/') {
      router.push(href, { scroll: false });
      return;
    }

    const target = document.getElementById(hash);
    if (target) {
      const headerOffset = 88;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      history.replaceState(null, '', `#${hash}`);
    }
  };

  const handleNavClick = (href: string) => {
    // Close mobile menu first
    setMenuOpen(false);

    // If it's a hash link, reuse the section handler (it handles navigation/scroll)
    if (href.includes('#')) {
      handleSectionClick(href);
      return;
    }

    // Otherwise navigate normally
    router.push(href);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  // When the mobile menu closes, ensure any focused element inside it is blurred
  // and mark the container inert so assistive tech won't focus hidden children.
  useEffect(() => {
    const el = mobileMenuRef.current;
    if (!el) return;

    if (menuOpen) {
      el.removeAttribute('inert');
      el.setAttribute('aria-hidden', 'false');
    } else {
      // If some child still has focus, blur it to avoid aria-hidden focus violation
      const active = document.activeElement as HTMLElement | null;
      if (active && el.contains(active)) {
        try {
          active.blur();
        } catch (_) {
          // ignore
        }
      }
      el.setAttribute('inert', '');
      el.setAttribute('aria-hidden', 'true');
    }
  }, [menuOpen]);

  useEffect(() => {
    if (pathname !== '/') return;

    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const target = document.getElementById(hash);
    if (!target) return;

    const headerOffset = 88;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  }, [pathname]);

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
              <div className="relative w-24 md:w-32" style={{ aspectRatio: '128 / 56' }}>
                <Image
                  src="/Alvion%20Logo%20landsacpe.png"
                  alt="Alvion Digital Marketing"
                  fill
                  priority
                  sizes="(max-width: 768px) 96px, 128px"
                  className="object-contain"
                />
              </div>
            </div>
          </LogoLink>

          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={(e) => {
                    setMenuOpen(false);
                    if (link.href.includes('#')) {
                      e.preventDefault();
                      handleSectionClick(link.href);
                    }
                  }}
                  className="cursor-pointer text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-linear-to-r after:from-accent-from after:to-accent-to hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/#contact"
            className="hidden md:inline-flex cursor-pointer items-center justify-center px-5 py-2 rounded-full font-semibold text-sm bg-linear-to-r from-accent-from to-accent-to text-white hover:opacity-90 transition-all duration-200 shadow-lg shadow-blue-500/25"
          >
            Get Started
          </Link>

          <button
            className="md:hidden p-2 text-gray-700 hover:text-black"
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

      <div
        className="md:hidden glass border-t border-gray-200"
        aria-hidden={!menuOpen}
        style={{
          maxHeight: menuOpen ? '420px' : '0px',
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? 'translateY(0)' : 'translateY(-6px)',
          transition: 'max-height 320ms ease, opacity 240ms ease, transform 240ms ease',
          overflow: 'hidden',
        }}
      >
        <Container>
          <ul className="py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={(e) => {
                    // Blur active element before hiding the menu to avoid aria-hidden focus violation
                    if (document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                    setMenuOpen(false);
                    if (link.href.includes('#')) {
                      e.preventDefault();
                      handleSectionClick(link.href);
                    }
                  }}
                  className="block cursor-pointer text-sm font-medium text-gray-700 hover:text-black transition-colors py-1"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#contact"
                onClick={() => {
                  if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                  }
                  setMenuOpen(false);
                }}
                className="inline-flex cursor-pointer items-center justify-center px-5 py-2 rounded-full font-semibold text-sm bg-linear-to-r from-accent-from to-accent-to text-white"
              >
                Get Started
              </Link>
            </li>
          </ul>
        </Container>
      </div>
    </header>
  );
}
