import Link from 'next/link';
import Image from 'next/image';
import Container from './Container';
import LogoLink from './LogoLink';
import { EnvelopeIcon, FacebookIcon, InstagramIcon, LinkedInIcon, WhatsAppIcon, XTwitterIcon } from './icons';
import { CONTACT_INFO, GMAIL_COMPOSE_LINK, WHATSAPP_LINK } from '@/lib/contact';

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/alviondigitalmarketing/',
    icon: <InstagramIcon className="w-5 h-5" />,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61562935378228',
    icon: <FacebookIcon className="w-5 h-5" />,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: <LinkedInIcon className="w-5 h-5" />,
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com',
    icon: <XTwitterIcon className="w-5 h-5" />,
  },
];

const quickLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'Services', href: '/#services' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/#contact' },
];

export default function Footer() {
  return (
    <footer className="bg-[#061c2e] border-t border-white/10 py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <LogoLink>
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full overflow-hidden ring-1 ring-white/20 bg-white/10 shrink-0">
                  <Image
                    src="/AlvionLogo.png"
                    alt="Alvion Digital Marketing"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="text-xl font-bold gradient-text whitespace-nowrap">Alvion Digital</span>
              </div>
            </LogoLink>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
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
                  className="text-slate-400 hover:text-accent-to transition-colors duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href={GMAIL_COMPOSE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <span className="w-7 h-7 rounded-lg bg-accent-from/20 flex items-center justify-center text-accent-to">
                    <EnvelopeIcon className="w-4 h-4" />
                  </span>
                  {CONTACT_INFO.emailAddress}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <span className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                    <WhatsAppIcon className="w-4 h-4" />
                  </span>
                  {CONTACT_INFO.whatsappSubtitle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Alvion Digital Marketing. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
