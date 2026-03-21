'use client'

import { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'default' | 'lg' | 'sm'

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-brand text-white hover:bg-brand-dark active:scale-[0.98] shadow-[var(--shadow)]',
  secondary:
    'bg-surface-warm text-foreground border border-border hover:bg-surface-peach active:scale-[0.98]',
  ghost: 'text-muted hover:text-foreground',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-2xl',
  default: 'px-6 py-3 text-base rounded-2xl',
  lg: 'px-8 py-4 text-lg rounded-3xl',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export function Button({
  variant = 'primary',
  size = 'default',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-body ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
