'use client'

import Link from 'next/link'

export function AdminHeader() {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border">
      <h1 className="text-lg font-bold font-heading text-foreground">Coach Dashboard</h1>
      <Link
        href="/"
        className="text-sm text-brand font-medium hover:underline"
      >
        Back to App
      </Link>
    </header>
  )
}
