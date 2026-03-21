'use client'

import { WorkoutSession, WorkoutTemplate, Exercise } from '@/lib/types'
import { formatDate, formatDuration } from '@/lib/utils'
import { ExceptionBadge } from './exception-badge'

const feelingDisplay: Record<string, { label: string; color: string }> = {
  easy: { label: 'Easy', color: 'bg-green-100 text-green-700' },
  good: { label: 'Good', color: 'bg-amber-100 text-amber-700' },
  hard: { label: 'Hard', color: 'bg-red-100 text-red-700' },
}

const feedbackDisplay: Record<string, string> = {
  too_easy: 'Too Easy',
  about_right: 'About Right',
  too_hard: 'Too Hard',
}

interface SessionDetailProps {
  session: WorkoutSession
  template: WorkoutTemplate | undefined
}

export function SessionDetail({ session, template }: SessionDetailProps) {
  const feeling = session.overallFeeling ? feelingDisplay[session.overallFeeling] : null
  const completedAt = session.completedAt ?? session.startedAt
  const duration = formatDuration(session.startedAt, completedAt)

  return (
    <div>
      {/* Header */}
      <div className="bg-surface rounded-2xl border border-border p-5 shadow-[var(--shadow)] mb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold font-heading">{template?.name ?? 'Workout'}</h3>
            <p className="text-sm text-muted mt-0.5">{formatDate(session.startedAt)}</p>
          </div>
          {feeling && (
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${feeling.color}`}>
              {feeling.label}
            </span>
          )}
        </div>
        <div className="flex gap-6 text-sm text-muted">
          <span>Duration: {duration}</span>
          <span>
            {session.exercises.filter((e) => !e.skipped).length} / {session.exercises.length} exercises
          </span>
        </div>
      </div>

      {/* Notes */}
      {session.notes && (
        <div className="bg-surface-warm rounded-2xl p-4 mb-4">
          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Notes</p>
          <p className="text-sm text-foreground italic">&quot;{session.notes}&quot;</p>
        </div>
      )}

      {/* Exercise breakdown */}
      <h4 className="text-sm font-semibold font-heading mb-3">Exercise Breakdown</h4>
      <div className="space-y-2">
        {session.exercises.map((es, i) => {
          const templateEx: Exercise | undefined = template?.exercises.find((te) => te.id === es.exerciseId)
          const exerciseName = templateEx?.name ?? `Exercise ${i + 1}`
          const weightChanged = templateEx && es.actualWeight !== templateEx.defaultWeight
          const setsCompleted = es.sets.filter((s) => s.completed).length
          const totalSets = es.sets.length

          return (
            <div
              key={es.exerciseId}
              className={`bg-surface rounded-2xl border p-4 shadow-[var(--shadow)] ${
                es.skipped ? 'border-orange-200 opacity-75' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{exerciseName}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {setsCompleted} / {totalSets} sets completed
                  </p>
                </div>
                <div className="flex gap-1.5 flex-wrap justify-end">
                  {es.skipped && <ExceptionBadge type="skipped" />}
                  {es.feedback === 'too_easy' && <ExceptionBadge type="too_easy" />}
                  {es.feedback === 'too_hard' && <ExceptionBadge type="too_hard" />}
                  {weightChanged && <ExceptionBadge type="weight_changed" />}
                </div>
              </div>

              <div className="flex gap-4 text-xs text-muted">
                <span>
                  Weight: {es.actualWeight} lb
                  {weightChanged && templateEx && (
                    <span className="text-purple-600 ml-1">
                      (was {templateEx.defaultWeight} lb)
                    </span>
                  )}
                </span>
                {es.feedback && (
                  <span>Feedback: {feedbackDisplay[es.feedback] ?? es.feedback}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
