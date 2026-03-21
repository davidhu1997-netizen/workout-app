'use client'

import { ExerciseSession } from '@/lib/types'

interface FeedbackModalProps {
  open: boolean
  onSelect: (feedback: ExerciseSession['feedback']) => void
  onSkip: () => void
}

const options: { value: ExerciseSession['feedback']; label: string; emoji: string }[] = [
  { value: 'too_easy', label: 'Too easy', emoji: '💨' },
  { value: 'about_right', label: 'About right', emoji: '👍' },
  { value: 'too_hard', label: 'Too hard', emoji: '😤' },
]

export function FeedbackModal({ open, onSelect, onSkip }: FeedbackModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onSkip} />
      <div className="relative bg-surface rounded-3xl p-6 shadow-[var(--shadow-md)] max-w-sm w-full animate-slide-up">
        <h3 className="text-lg font-bold font-heading text-center mb-6">
          How did that feel?
        </h3>
        <div className="space-y-3 mb-4">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-surface-warm border border-border cursor-pointer hover:bg-surface-peach active:scale-[0.98] transition-all"
            >
              <span className="text-xl">{opt.emoji}</span>
              <span className="text-sm font-semibold text-foreground">{opt.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={onSkip}
          className="w-full py-2 text-center text-sm text-muted font-medium cursor-pointer hover:text-foreground transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  )
}
