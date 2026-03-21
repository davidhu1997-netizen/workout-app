'use client'

import { use } from 'react'
import { WorkoutSessionProvider } from '@/context/workout-session-context'
import { initializeSeedData } from '@/lib/storage'
import { useEffect } from 'react'

export default function WorkoutLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = use(params)

  useEffect(() => {
    initializeSeedData()
  }, [])

  return (
    <WorkoutSessionProvider sessionId={sessionId}>
      <div className="min-h-dvh bg-background">{children}</div>
    </WorkoutSessionProvider>
  )
}
