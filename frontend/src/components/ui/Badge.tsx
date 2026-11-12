import React from 'react';

export type BadgeVariant = 'navy' | 'amber' | 'success' | 'warning' | 'neutral' | 'assurance';

const BADGE_CLASSES: Record<BadgeVariant, string> = {
  navy: 'bg-navy-900 text-white border border-navy-900',
  amber: 'bg-amber-100 text-navy-900 border border-amber-500/40',
  success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  warning: 'bg-amber-50 text-amber-800 border border-amber-200',
  neutral: 'bg-slate-100 text-slate-700 border border-slate-300',
  assurance: 'bg-navy-800 text-ink-subtle border border-line-dark',
};

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

export default function Badge({ variant = 'neutral', className = '', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-[4px] whitespace-nowrap ${BADGE_CLASSES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
