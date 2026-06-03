import React from 'react';

type BadgeProps = React.PropsWithChildren<{
  className?: string;
  ariaLabel?: string;
  compact?: boolean;
}>;

export default function Badge({ children, className = '', ariaLabel, compact = false }: BadgeProps) {
  if (compact) {
    return (
      <div
        role={ariaLabel ? 'status' : undefined}
        aria-label={ariaLabel}
        className={`inline-flex items-center gap-2 h-8 px-3 rounded-full border border-accent-from/10 bg-accent-from/5 text-sm font-medium text-accent-from w-max whitespace-nowrap ${className}`}
      >
        <span className="h-2 w-2 rounded-full bg-linear-to-r from-accent-from to-accent-to" />
        <span className="leading-none">{children}</span>
      </div>
    );
  }

  return (
    <div
      role={ariaLabel ? 'status' : undefined}
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-2 h-8 px-4 rounded-full border border-accent-from/15 bg-white/80 shadow-sm shadow-accent-from/5 backdrop-blur-sm text-accent-from whitespace-nowrap w-max ${className}`}
    >
      <span className="h-2.5 w-2.5 rounded-full bg-linear-to-r from-accent-from to-accent-to shadow-[0_0_0_4px_rgba(37,95,241,0.12)]" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
        {children}
      </span>
    </div>
  );
}
