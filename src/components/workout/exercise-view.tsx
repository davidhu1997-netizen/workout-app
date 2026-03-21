'use client'

import { Exercise, ExerciseSession } from '@/lib/types'
import { SetRow } from './set-row'

interface ExerciseViewProps {
  exercise: Exercise
  exerciseSession: ExerciseSession
  onCompleteSet: (setNumber: number) => void
  onAdjustWeight: () => void
  onWatchDemo: () => void
}

export function ExerciseView({
  exercise,
  exerciseSession,
  onCompleteSet,
  onAdjustWeight,
  onWatchDemo,
}: ExerciseViewProps) {
  const completedSets = exerciseSession.sets.filter((s) => s.completed).length
  const firstIncomplete = exerciseSession.sets.find((s) => !s.completed)

  return (
    <div className="px-4">
      {/* Exercise Header Card */}
      <div className="bg-surface rounded-[32px] shadow-[var(--shadow)] p-5 mb-4">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold font-heading text-foreground">
            {exercise.name}
          </h2>
          <button
            onClick={onWatchDemo}
            className="flex items-center gap-1.5 text-sm text-brand font-medium cursor-pointer hover:underline"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
            Watch Demo
          </button>
        </div>

        {/* Plan & Weight blocks */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-surface-warm rounded-2xl p-3">
            <p className="text-xs text-muted mb-0.5">Plan</p>
            <p className="text-sm font-semibold text-foreground">
              {exercise.sets} sets x {exercise.reps} {typeof exercise.reps === 'number' ? 'reps' : ''}
            </p>
          </div>
          <div className="bg-surface-warm rounded-2xl p-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted mb-0.5">Weight</p>
                <p className="text-sm font-semibold text-foreground leading-tight">
                  {exerciseSession.actualEquipmentLabel}
                </p>
              </div>
              <button
                onClick={onAdjustWeight}
                className="text-xs text-brand font-semibold cursor-pointer hover:underline"
              >
                Adjust
              </button>
            </div>
          </div>
        </div>

        {/* Form cues */}
        {exercise.formCues.length > 0 && (
          <div className="space-y-2">
            {exercise.formCues.map((cue, i) => (
              <div key={i} className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <p className="text-xs text-muted leading-relaxed">{cue}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Set Rows */}
      <div className="mb-4">
        <p className="text-xs font-medium text-muted uppercase tracking-wide px-1 mb-2">
          Track workout · {completedSets}/{exerciseSession.sets.length} sets
        </p>
        <div className="space-y-2">
          {exerciseSession.sets.map((set) => {
            const status = set.completed
              ? 'completed' as const
              : firstIncomplete && set.setNumber === firstIncomplete.setNumber
                ? 'active' as const
                : 'upcoming' as const

            return (
              <SetRow
                key={set.setNumber}
                set={set}
                reps={exercise.reps}
                weight={exerciseSession.actualWeight}
                equipmentLabel={exerciseSession.actualEquipmentLabel}
                status={status}
                onComplete={() => onCompleteSet(set.setNumber)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
