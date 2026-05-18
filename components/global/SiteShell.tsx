'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import Navbar from '@/components/global/Navbar';
import Footer from '@/components/global/Footer';

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}