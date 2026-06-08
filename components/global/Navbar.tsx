'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Container from './Container';
import { Bars3Icon, XMarkIcon } from './icons';
import LogoLink from './LogoLink';

type NavLink = { label: string; href: string };
type NavGroup = { label: string; children: NavLink[] };

const navLinks: (NavLink | NavGroup)[] = [
  { label: 'Home', href: '/#home' },
  { label: 'About Us', href: '/#about' },
  { label: 'Services', href: '/services' },
  { label: 'Pricing', href: '/pricing' },
  {
    label: 'Tools',
    children: [
      { label: 'Meta Preview', href: '/tools/seo-preview' },
    ],
  },
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
        } catch {
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
                  src="/Alvion%20Logo%20landsacpe.webp"
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
            {navLinks.map((link) => {
              if ('children' in link) {
                return (
                  <li key={link.label} className="relative group">
                    <span className="cursor-pointer text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-linear-to-r after:from-accent-from after:to-accent-to group-hover:after:w-full after:transition-all after:duration-300 inline-block">
                      {link.label}
                    </span>
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                      <div className="bg-white rounded-xl border border-gray-200 shadow-lg py-2 min-w-[180px]">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </li>
                );
              }
              const navLink = link as NavLink;
              return (
                <li key={navLink.label}>
                  <Link
                    href={navLink.href}
                    onClick={(e) => {
                      setMenuOpen(false);
                      if (navLink.href.includes('#')) {
                        e.preventDefault();
                        handleSectionClick(navLink.href);
                      }
                    }}
                    className="cursor-pointer text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-linear-to-r after:from-accent-from after:to-accent-to hover:after:w-full after:transition-all after:duration-300"
                  >
                    {navLink.label}
                  </Link>
                </li>
              );
            })}
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
          maxHeight: menuOpen ? '520px' : '0px',
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? 'translateY(0)' : 'translateY(-6px)',
          transition: 'max-height 320ms ease, opacity 240ms ease, transform 240ms ease',
          overflow: 'hidden',
        }}
      >
        <Container>
          <ul className="py-4 flex flex-col gap-4">
            {navLinks.map((link) => {
              if ('children' in link) {
                return (
                  <li key={link.label}>
                    <span className="block text-sm font-medium text-gray-400 py-1 cursor-default">
                      {link.label}
                    </span>
                    <ul className="ml-3 mt-1 flex flex-col gap-2">
                      {link.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            href={child.href}
                            onClick={() => {
                              if (document.activeElement instanceof HTMLElement) {
                                document.activeElement.blur();
                              }
                              setMenuOpen(false);
                            }}
                            className="block cursor-pointer text-sm font-medium text-gray-700 hover:text-black transition-colors py-1"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }
              const navLink = link as NavLink;
              return (
                <li key={navLink.label}>
                  <Link
                    href={navLink.href}
                    onClick={(e) => {
                      // Blur active element before hiding the menu to avoid aria-hidden focus violation
                      if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                      }
                      setMenuOpen(false);
                      if (navLink.href.includes('#')) {
                        e.preventDefault();
                        handleSectionClick(navLink.href);
                      }
                    }}
                    className="block cursor-pointer text-sm font-medium text-gray-700 hover:text-black transition-colors py-1"
                  >
                    {navLink.label}
                  </Link>
                </li>
              );
            })}
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
