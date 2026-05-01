import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  href,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition';

  const variantClasses =
    variant === 'primary'
      ? 'bg-white text-black hover:bg-zinc-200'
      : 'border border-white/20 bg-white/5 text-white hover:bg-white/10';

  const classes = `${baseClasses}${variantClasses}${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        children
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
