'use client'

import { useSessions, useTemplates } from '@/hooks/use-data'
import { WorkoutSession } from '@/lib/types'
import { formatDate, formatDuration } from '@/lib/utils'
import { PageHeader } from '@/components/layout/page-header'

function getThisWeekCount(sessions: WorkoutSession[]): number {
  const now = new Date()
  const day = now.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(now)
  monday.setDate(now.getDate() + diffToMonday)
  monday.setHours(0, 0, 0, 0)

  return sessions.filter((s) => {
    if (!s.completedAt) return false
    return new Date(s.completedAt) >= monday
  }).length
}

function getThisMonthCount(sessions: WorkoutSession[]): number {
  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  return sessions.filter((s) => {
    if (!s.completedAt) return false
    return new Date(s.completedAt) >= firstOfMonth
  }).length
}

const feelingBadge: Record<string, { label: string; color: string }> = {
  easy: { label: 'Easy', color: 'bg-green-100 text-green-700' },
  good: { label: 'Good', color: 'bg-amber-100 text-amber-700' },
  hard: { label: 'Hard', color: 'bg-red-100 text-red-700' },
}

export default function ProgressPage() {
  const { data: sessions, loading: sLoading } = useSessions()
  const { data: templates, loading: tLoading } = useTemplates()

  if (sLoading || tLoading) return null

  const completed = sessions
    .filter((s) => s.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())

  const weekCount = getThisWeekCount(sessions)
  const monthCount = getThisMonthCount(sessions)

  return (
    <div className="max-w-md mx-auto">
      <PageHeader title="Progress" />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 px-4 mb-6">
        <div className="bg-surface rounded-2xl border border-border p-5 text-center shadow-[var(--shadow)]">
          <p className="text-3xl font-bold font-heading text-brand">{weekCount}</p>
          <p className="text-xs text-muted mt-1">This week</p>
        </div>
        <div className="bg-surface rounded-2xl border border-border p-5 text-center shadow-[var(--shadow)]">
          <p className="text-3xl font-bold font-heading text-brand">{monthCount}</p>
          <p className="text-xs text-muted mt-1">This month</p>
        </div>
      </div>

      {/* Session history */}
      <div className="px-4">
        <h3 className="text-base font-semibold font-heading mb-3">Workout History</h3>
        {completed.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted text-sm">
              No workouts logged yet. Complete your first workout to see it here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {completed.map((session) => {
              const template = templates.find((t) => t.id === session.templateId)
              const badge = session.overallFeeling
                ? feelingBadge[session.overallFeeling]
                : null

              return (
                <div
                  key={session.id}
                  className="bg-surface rounded-2xl border border-border p-4 shadow-[var(--shadow)]"
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm font-semibold text-foreground">
                      {template?.name ?? 'Workout'}
                    </p>
                    {badge && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.color}`}>
                        {badge.label}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span>{formatDate(session.startedAt)}</span>
                    {session.completedAt && (
                      <span>
                        {formatDuration(session.startedAt, session.completedAt)}
                      </span>
                    )}
                    <span>
                      {session.exercises.filter((e) => !e.skipped).length} exercises
                    </span>
                  </div>
                  {session.notes && (
                    <p className="text-xs text-muted mt-2 italic">&quot;{session.notes}&quot;</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
