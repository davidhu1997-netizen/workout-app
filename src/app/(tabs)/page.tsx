'use client'

import { useEffect, useState } from 'react'
import { WorkoutTemplate, ScheduledWorkout, WorkoutSession } from '@/lib/types'
import { getTemplates, getSchedule, getSessions } from '@/lib/storage'
import { Greeting } from '@/components/home/greeting'
import { NextWorkoutCard } from '@/components/home/next-workout-card'
import { RecentSessions } from '@/components/home/recent-sessions'

export default function HomePage() {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([])
  const [schedule, setSchedule] = useState<ScheduledWorkout[]>([])
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setTemplates(getTemplates())
    setSchedule(getSchedule())
    setSessions(getSessions())
    setReady(true)
  }, [])

  if (!ready) return null

  const completedCount = schedule.filter((s) => s.status === 'completed').length
  const totalCount = schedule.length

  // Find next workout: in_progress first, then first upcoming
  const inProgress = schedule.find((s) => s.status === 'in_progress')
  const nextScheduled = inProgress ?? schedule.find((s) => s.status === 'upcoming')
  const nextTemplate = nextScheduled
    ? templates.find((t) => t.id === nextScheduled.templateId)
    : undefined
  const existingSession = inProgress?.sessionId
    ? sessions.find((s) => s.id === inProgress.sessionId)
    : undefined

  return (
    <div className="max-w-md mx-auto">
      <Greeting completedCount={completedCount} totalCount={totalCount} />

      {nextTemplate && nextScheduled ? (
        <div className="mt-4">
          <NextWorkoutCard
            template={nextTemplate}
            scheduled={nextScheduled}
            existingSession={existingSession}
          />
        </div>
      ) : (
        <div className="mx-4 mt-8 p-8 text-center rounded-[32px] bg-surface-warm">
          <p className="text-lg font-heading font-semibold text-foreground mb-2">
            All done this week!
          </p>
          <p className="text-sm text-muted">
            You&apos;ve completed all your scheduled workouts. Enjoy the rest.
          </p>
        </div>
      )}

      <RecentSessions sessions={sessions} templates={templates} />
    </div>
  )
}
