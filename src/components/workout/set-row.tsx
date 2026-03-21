'use client'

import { SetCompletion } from '@/lib/types'

interface SetRowProps {
  set: SetCompletion
  reps: number | string
  weight: number
  equipmentLabel: string
  status: 'completed' | 'active' | 'upcoming'
  onComplete: () => void
}

export function SetRow({ set, reps, weight, status, onComplete }: SetRowProps) {
  const repsLabel = typeof reps === 'number' ? `${reps} reps` : reps
  const weightLabel = weight > 0 ? ` x ${weight} lb` : ''

  return (
    <button
      type="button"
      onClick={status === 'active' ? onComplete : undefined}
      disabled={status !== 'active'}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left ${
        status === 'completed'
          ? 'bg-surface-peach/50 opacity-70'
          : status === 'active'
            ? 'bg-surface shadow-[var(--shadow-md)] cursor-pointer hover:shadow-[var(--shadow)] active:scale-[0.99]'
            : 'bg-transparent opacity-50'
      }`}
    >
      {/* Set number / check circle */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          status === 'completed'
            ? 'bg-brand'
            : status === 'active'
              ? 'border-2 border-brand'
              : 'border-2 border-muted-light'
        }`}
      >
        {status === 'completed' ? (
          <svg width="14" height="11" viewBox="0 0 14 11" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 5.5 5 9.5 13 1.5" />
          </svg>
        ) : (
          <span className={`text-sm font-semibold ${status === 'active' ? 'text-brand' : 'text-muted-light'}`}>
            {set.setNumber}
          </span>
        )}
      </div>

      {/* Set info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${status === 'completed' ? 'text-muted' : 'text-foreground'}`}>
          Set {set.setNumber}
        </p>
        <p className="text-xs text-muted">
          {repsLabel}{weightLabel}
        </p>
      </div>

      {/* Action */}
      {status === 'active' && (
        <span className="px-4 py-2 text-sm font-semibold text-white bg-brand rounded-xl shadow-[var(--shadow)]">
          Complete Set
        </span>
      )}
    </button>
  )
}
