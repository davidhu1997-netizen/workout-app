'use client'

import { useEffect } from 'react'
import { BottomNav } from '@/components/layout/bottom-nav'
import { initializeSeedData } from '@/lib/storage'

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeSeedData()
  }, [])

  return (
    <div className="flex flex-col min-h-dvh pb-20">
      <main className="flex-1">{children}</main>
      <BottomNav />
    </div>
  )
}
