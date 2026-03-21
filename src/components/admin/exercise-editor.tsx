'use client'

import { Exercise } from '@/lib/types'

interface ExerciseEditorProps {
  exercise: Exercise
  index: number
  onChange: (index: number, exercise: Exercise) => void
  onRemove: (index: number) => void
  onMoveUp: (index: number) => void
  onMoveDown: (index: number) => void
  isFirst: boolean
  isLast: boolean
}

export function ExerciseEditor({
  exercise,
  index,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: ExerciseEditorProps) {
  const update = (fields: Partial<Exercise>) => {
    onChange(index, { ...exercise, ...fields })
  }

  return (
    <div className="bg-surface rounded-2xl border border-border p-4 shadow-[var(--shadow)]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-muted uppercase tracking-wide">
          Exercise {index + 1}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMoveUp(index)}
            disabled={isFirst}
            className="p-1.5 rounded-lg hover:bg-surface-warm disabled:opacity-30 cursor-pointer disabled:cursor-default"
            aria-label="Move up"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
          <button
            onClick={() => onMoveDown(index)}
            disabled={isLast}
            className="p-1.5 rounded-lg hover:bg-surface-warm disabled:opacity-30 cursor-pointer disabled:cursor-default"
            aria-label="Move down"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <button
            onClick={() => onRemove(index)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 cursor-pointer"
            aria-label="Remove exercise"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Name</label>
          <input
            type="text"
            value={exercise.name}
            onChange={(e) => update({ name: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-surface-warm border border-border text-sm focus:outline-none focus:border-brand"
            placeholder="e.g. Dumbbell Chest Press"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Sets</label>
            <input
              type="number"
              value={exercise.sets}
              onChange={(e) => update({ sets: parseInt(e.target.value) || 1 })}
              min={1}
              className="w-full px-3 py-2 rounded-xl bg-surface-warm border border-border text-sm focus:outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Reps</label>
            <input
              type="text"
              value={exercise.reps}
              onChange={(e) => {
                const val = e.target.value
                const num = parseInt(val)
                update({ reps: isNaN(num) ? val : num })
              }}
              className="w-full px-3 py-2 rounded-xl bg-surface-warm border border-border text-sm focus:outline-none focus:border-brand"
              placeholder="10 or 5 min"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Weight (lb)</label>
            <input
              type="number"
              value={exercise.defaultWeight}
              onChange={(e) => update({ defaultWeight: parseInt(e.target.value) || 0 })}
              min={0}
              className="w-full px-3 py-2 rounded-xl bg-surface-warm border border-border text-sm focus:outline-none focus:border-brand"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1">Equipment Label</label>
          <input
            type="text"
            value={exercise.equipmentLabel}
            onChange={(e) => update({ equipmentLabel: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-surface-warm border border-border text-sm focus:outline-none focus:border-brand"
            placeholder="e.g. Two 15 lb dumbbells"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1">Form Cues (one per line)</label>
          <textarea
            value={exercise.formCues.join('\n')}
            onChange={(e) =>
              update({ formCues: e.target.value.split('\n').filter((l) => l.trim()) })
            }
            rows={3}
            className="w-full px-3 py-2 rounded-xl bg-surface-warm border border-border text-sm focus:outline-none focus:border-brand resize-none"
            placeholder="Keep your back flat on the bench&#10;Lower the dumbbells to chest level"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1">
            Common Mistakes (one per line, optional)
          </label>
          <textarea
            value={(exercise.commonMistakes ?? []).join('\n')}
            onChange={(e) =>
              update({
                commonMistakes: e.target.value.split('\n').filter((l) => l.trim()),
              })
            }
            rows={2}
            className="w-full px-3 py-2 rounded-xl bg-surface-warm border border-border text-sm focus:outline-none focus:border-brand resize-none"
            placeholder="Arching the lower back&#10;Flaring elbows too wide"
          />
        </div>
      </div>
    </div>
  )
}
