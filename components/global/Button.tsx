'use client';

import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: (e?: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  href?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  className = '',
  href,
  disabled = false,
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

  const sizeMap: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2 text-sm h-10',
    lg: 'px-8 py-3.5 text-base h-12',
  };

  const variants: Record<string, string> = {
    primary: 'bg-linear-to-r from-accent-from to-accent-to text-white shadow-md hover:shadow-lg',
    secondary: 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100',
    outline: 'bg-transparent text-accent-from border border-accent-from/20 hover:bg-accent-from/5',
    danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700',
  };

  const classes = `${base} ${sizeMap[size]} ${variants[variant] ?? variants.primary} ${className}`.trim();

  if (href) {
    const isInternal = href.startsWith('/');

    if (isInternal) {
      return (
        <Link href={disabled ? '#' : href} className={classes} aria-disabled={disabled}>
          {children}
        </Link>
      );
    }

    return (
      <a
        href={disabled ? undefined : href}
        role="button"
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
          if (disabled) e.preventDefault();
          else onClick?.(e);
        }}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={(e) => onClick?.(e)} disabled={disabled} aria-disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
