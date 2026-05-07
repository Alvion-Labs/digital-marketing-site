'use client';

import Link from 'next/link';
import { WHATSAPP_LINK } from '@/lib/contact';

export default function FloatingWhatsApp() {
  return (
    <Link
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-40 p-2 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-green-400/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-green-500/20"
      aria-label="Chat with us on WhatsApp"
    >
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <img src="/logos/whatsapp filled.svg" alt="WhatsApp" className="relative w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
    </Link>
  );
}
