'use client';

import React from 'react';
import Link from 'next/link';

export type ButtonVariant = 'primary' | 'secondary' | 'outline-dark' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'lg';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-amber-500 hover:bg-amber-600 text-navy-900 font-semibold shadow-sm',
  secondary: 'bg-surface hover:bg-canvas text-ink border border-line font-medium',
  'outline-dark': 'bg-transparent hover:bg-white/10 text-white border border-line-dark font-medium',
  ghost: 'bg-transparent hover:bg-canvas text-ink-muted hover:text-ink font-medium',
  danger: 'bg-red-600 hover:bg-red-700 text-white font-medium',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'h-[44px] px-4 text-[13px] sm:text-[14px]',
  lg: 'h-[50px] px-5 text-[14px]',
};

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = BaseButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = BaseButtonProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-[4px] transition-colors cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap';
  const combinedClasses = `${baseClasses} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`;

  if ('href' in props && props.href !== undefined) {
    const { href, ...linkProps } = props;
    return (
      <Link href={href} className={combinedClasses} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={combinedClasses} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
