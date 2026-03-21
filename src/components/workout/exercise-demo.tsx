'use client'

import { Exercise } from '@/lib/types'
import { BottomSheet } from '@/components/ui/bottom-sheet'

interface ExerciseDemoProps {
  open: boolean
  exercise: Exercise
  onClose: () => void
}

export function ExerciseDemo({ open, exercise, onClose }: ExerciseDemoProps) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="pt-2">
        <h3 className="text-xl font-bold font-heading mb-4">{exercise.name}</h3>

        {/* Demo placeholder */}
        <div className="w-full h-48 rounded-2xl bg-surface-peach flex items-center justify-center mb-4">
          <div className="text-center">
            <svg className="w-12 h-12 text-brand mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
            <p className="text-xs text-muted">Demo video coming soon</p>
          </div>
        </div>

        {/* Form cues */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-foreground mb-2">How to do it</h4>
          <ul className="space-y-2">
            {exercise.formCues.map((cue, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted">
                <span className="text-brand font-semibold">{i + 1}.</span>
                {cue}
              </li>
            ))}
          </ul>
        </div>

        {/* Common mistakes */}
        {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground mb-2">Common mistakes</h4>
            <ul className="space-y-2">
              {exercise.commonMistakes.map((mistake, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted">
                  <span className="text-red-400">✕</span>
                  {mistake}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 text-center text-brand font-semibold cursor-pointer mt-2"
        >
          Got it
        </button>
      </div>
    </BottomSheet>
  )
}
