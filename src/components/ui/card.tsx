import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'warm' | 'peach'
}

const bgStyles = {
  default: 'bg-surface',
  warm: 'bg-surface-warm',
  peach: 'bg-surface-peach',
}

export function Card({
  variant = 'default',
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-[32px] shadow-[var(--shadow)] ${bgStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
