import { WorkoutSession, WorkoutTemplate } from '@/lib/types'
import { formatDate, formatDuration } from '@/lib/utils'

interface RecentSessionsProps {
  sessions: WorkoutSession[]
  templates: WorkoutTemplate[]
}

export function RecentSessions({ sessions, templates }: RecentSessionsProps) {
  const completed = sessions
    .filter((s) => s.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
    .slice(0, 5)

  if (completed.length === 0) return null

  return (
    <div className="px-4 mt-8 mb-4">
      <h3 className="text-base font-semibold font-heading mb-1">Recently Logged</h3>
      <p className="text-sm text-muted mb-3">Your recent workout history</p>
      <div className="space-y-2">
        {completed.map((session) => {
          const template = templates.find((t) => t.id === session.templateId)
          return (
            <div
              key={session.id}
              className="flex items-center gap-3 bg-surface rounded-2xl border border-border p-3 shadow-[var(--shadow)]"
            >
              <div className="w-10 h-10 rounded-xl bg-surface-peach flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#944a00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {template?.name ?? 'Workout'}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>
                    {formatDate(session.startedAt)}
                    {session.completedAt &&
                      ` · ${formatDuration(session.startedAt, session.completedAt)}`}
                  </span>
                </div>
              </div>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="#8c7b73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 1 6 6 1 11" />
              </svg>
            </div>
          )
        })}
      </div>
    </div>
  )
}
