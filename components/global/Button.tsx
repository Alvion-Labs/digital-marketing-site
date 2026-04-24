'use client';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: (e?: React.MouseEvent) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  href?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  className = '',
  href,
  disabled = false,
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#1E6BFF] to-[#00A3FF] text-white hover:opacity-90 hover:scale-105 focus:ring-[#1E6BFF] shadow-lg shadow-blue-500/25',
    secondary:
      'border border-[#1E6BFF] text-[#1E6BFF] hover:bg-[#1E6BFF]/10 hover:scale-105 focus:ring-[#1E6BFF]',
  };

  if (href) {
    return (
      <a href={href} className={`${base} ${variants[variant]} ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
