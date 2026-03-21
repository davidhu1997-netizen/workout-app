'use client'

import { useEffect } from 'react'
import { initializeSeedData } from '@/lib/storage'
import { AdminHeader } from '@/components/admin/admin-header'
import { AdminNav } from '@/components/admin/admin-nav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeSeedData()
  }, [])

  return (
    <div className="min-h-dvh flex flex-col">
      <AdminHeader />
      <AdminNav />
      <main className="flex-1 pb-8">{children}</main>
    </div>
  )
}
