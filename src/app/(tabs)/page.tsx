'use client'

import { useTemplates, useSchedule, useSessions } from '@/hooks/use-data'
import { Greeting } from '@/components/home/greeting'
import { NextWorkoutCard } from '@/components/home/next-workout-card'
import { RecentSessions } from '@/components/home/recent-sessions'
import { WorkoutSession } from '@/lib/types'
import { PageSpinner } from '@/components/ui/spinner'

function getThisWeekCount(sessions: WorkoutSession[]): number {
  const now = new Date()
  const day = now.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(now)
  monday.setDate(now.getDate() + diffToMonday)
  monday.setHours(0, 0, 0, 0)
  return sessions.filter((s) => s.completedAt && new Date(s.completedAt) >= monday).length
}

function getThisMonthCount(sessions: WorkoutSession[]): number {
  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  return sessions.filter((s) => s.completedAt && new Date(s.completedAt) >= firstOfMonth).length
}

export default function HomePage() {
  const { data: templates, loading: tLoading } = useTemplates()
  const { data: schedule, loading: sLoading } = useSchedule()
  const { data: sessions, loading: sessLoading } = useSessions()

  if (tLoading || sLoading || sessLoading) return <PageSpinner />

  const completedCount = schedule.filter((s) => s.status === 'completed').length
  const totalCount = schedule.length
  const weekCount = getThisWeekCount(sessions)
  const monthCount = getThisMonthCount(sessions)

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

      {(weekCount > 0 || monthCount > 0) && (
        <div className="grid grid-cols-2 gap-3 px-4 mt-4">
          <div className="bg-surface rounded-2xl border border-border p-4 text-center shadow-[var(--shadow)]">
            <p className="text-2xl font-bold font-heading text-brand">{weekCount}</p>
            <p className="text-xs text-muted mt-0.5">This week</p>
          </div>
          <div className="bg-surface rounded-2xl border border-border p-4 text-center shadow-[var(--shadow)]">
            <p className="text-2xl font-bold font-heading text-brand">{monthCount}</p>
            <p className="text-xs text-muted mt-0.5">This month</p>
          </div>
        </div>
      )}

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
          {totalCount > 0 ? (
            <>
              <p className="text-lg font-heading font-semibold text-foreground mb-2">
                All done this week!
              </p>
              <p className="text-sm text-muted">
                You&apos;ve completed all your scheduled workouts. Enjoy the rest.
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-heading font-semibold text-foreground mb-2">
                No workouts scheduled yet
              </p>
              <p className="text-sm text-muted">
                Your workouts will show up here once they&apos;re ready.
              </p>
            </>
          )}
        </div>
      )}

      <RecentSessions sessions={sessions} templates={templates} />
    </div>
  )
}
