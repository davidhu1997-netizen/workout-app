'use client'

import Link from 'next/link'
import { WorkoutSession, WorkoutTemplate, Exercise } from '@/lib/types'
import { formatDate, formatDuration } from '@/lib/utils'
import { ExceptionBadge } from './exception-badge'

interface ReviewListProps {
  sessions: WorkoutSession[]
  templates: WorkoutTemplate[]
}

function getExceptions(session: WorkoutSession, template?: WorkoutTemplate) {
  const exceptions: Array<'skipped' | 'too_easy' | 'too_hard' | 'weight_changed' | 'has_notes' | 'hard_overall'> = []

  if (session.exercises.some((e) => e.skipped)) exceptions.push('skipped')
  if (session.exercises.some((e) => e.feedback === 'too_easy')) exceptions.push('too_easy')
  if (session.exercises.some((e) => e.feedback === 'too_hard')) exceptions.push('too_hard')

  if (template) {
    const hasWeightChange = session.exercises.some((es) => {
      const templateEx = template.exercises.find((te: Exercise) => te.id === es.exerciseId)
      return templateEx && es.actualWeight !== templateEx.defaultWeight
    })
    if (hasWeightChange) exceptions.push('weight_changed')
  }

  if (session.notes && session.notes.trim()) exceptions.push('has_notes')
  if (session.overallFeeling === 'hard') exceptions.push('hard_overall')

  return exceptions
}

export function hasExceptions(session: WorkoutSession, template?: WorkoutTemplate): boolean {
  return getExceptions(session, template).length > 0
}

export function ReviewList({ sessions, templates }: ReviewListProps) {
  if (sessions.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted text-sm">No completed sessions to review.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {sessions.map((session) => {
        const template = templates.find((t) => t.id === session.templateId)
        const exceptions = getExceptions(session, template)

        return (
          <Link key={session.id} href={`/admin/review/${session.id}`}>
            <div className="bg-surface rounded-2xl border border-border p-4 shadow-[var(--shadow)] hover:shadow-[var(--shadow-md)] transition-shadow cursor-pointer mb-2">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {template?.name ?? 'Workout'}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted mt-0.5">
                    <span>{formatDate(session.startedAt)}</span>
                    {session.completedAt && (
                      <span>{formatDuration(session.startedAt, session.completedAt)}</span>
                    )}
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted mt-1">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
              {exceptions.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {exceptions.map((type) => (
                    <ExceptionBadge key={type} type={type} />
                  ))}
                </div>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
