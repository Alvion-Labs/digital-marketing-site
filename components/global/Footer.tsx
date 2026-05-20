import Link from 'next/link';
import Image from 'next/image';
import Container from './Container';
import LogoLink from './LogoLink';
import { CONTACT_INFO, MAILTO_LINK, WHATSAPP_LINK } from '@/lib/contact';

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/alviondigitalmarketing/',
    icon: '/logos/insta filled.svg',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61562935378228',
    icon: '/logos/facebook filled.svg',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: '/logos/linkedInFilled.svg',
  },
  {
    label: 'Twitter',
    href: 'https://x.com/AlvionDigital',
    icon: '/logos/X-twitter filled.svg',
  },
];

const quickLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'About Us', href: '/#about' },
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/#contact' },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <LogoLink>
              <div className="inline-flex items-center gap-3 mb-4">
                <Image
                  src="/Alvion%20Logo%20landsacpe.png"
                  alt="Alvion Digital Marketing"
                  width={128}
                  height={56}
                  sizes="(max-width: 768px) 96px, 144px"
                  className="h-auto w-24 md:w-36 object-contain shrink-0"
                  style={{ height: 'auto' }}
                />
              </div>
            </LogoLink>
            <p className="text-gray-700 text-sm leading-relaxed max-w-xs">
              Crafting powerful digital experiences that grow your brand and drive real results.
            </p>
            <div className="flex items-center gap-4 mt-5">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-gray-600 hover:text-accent-to transition transform duration-200 hover:scale-110 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent-to rounded"
                >
                  <img src={s.icon} alt={s.label} className="w-7 h-7" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-black uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-600 text-sm hover:text-black transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-black uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a
                  href={MAILTO_LINK}
                  className="inline-flex items-center gap-2 hover:text-black transition-colors"
                >
                  <img src="/logos/Mail .svg" alt="Email" className="w-7 h-7" />
                  {CONTACT_INFO.emailAddress}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-accent-to transition-colors"
                >
                  <img src="/logos/whatsapp filled.svg" alt="WhatsApp" className="w-7 h-7" />
                  {CONTACT_INFO.whatsappSubtitle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col items-center gap-2 text-center text-sm text-gray-500 md:flex-row md:justify-center md:gap-0">
          <span>&copy; {new Date().getFullYear()} Alvion Digital Marketing. All rights reserved.</span>
          <span className="hidden text-gray-300 md:inline-block md:mx-2">|</span>
          <Link
            href="/privacy-policy"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </Container>
    </footer>
  );
}
