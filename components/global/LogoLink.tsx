'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface LogoLinkProps {
  children: ReactNode;
  onClick?: () => void;
}

export default function LogoLink({ children, onClick }: LogoLinkProps) {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If we're already on the homepage, prevent navigation and smooth-scroll up.
    if (pathname === '/') {
      e.preventDefault();
      if (onClick) onClick();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Otherwise, allow the link to navigate to `/` normally.
  };

  return (
    <Link href="/" onClick={handleClick}>
      {children}
    </Link>
  );
}
