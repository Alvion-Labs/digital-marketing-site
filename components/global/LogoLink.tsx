'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface LogoLinkProps {
  children: ReactNode;
  onClick?: () => void;
}

export default function LogoLink({ children, onClick }: LogoLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onClick) onClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Link href="/" onClick={handleClick}>
      {children}
    </Link>
  );
}
