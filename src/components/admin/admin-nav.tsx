'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin/templates', label: 'Templates' },
  { href: '/admin/schedule', label: 'Schedule' },
  { href: '/admin/review', label: 'Review' },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-1 px-4 py-2 border-b border-border bg-surface">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-brand text-white'
                : 'text-muted hover:bg-surface-warm hover:text-foreground'
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
