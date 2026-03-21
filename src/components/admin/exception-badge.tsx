'use client'

type ExceptionType = 'skipped' | 'too_easy' | 'too_hard' | 'weight_changed' | 'has_notes' | 'hard_overall'

const config: Record<ExceptionType, { label: string; color: string }> = {
  skipped: { label: 'Skipped', color: 'bg-orange-100 text-orange-700' },
  too_easy: { label: 'Too Easy', color: 'bg-blue-100 text-blue-700' },
  too_hard: { label: 'Too Hard', color: 'bg-red-100 text-red-700' },
  weight_changed: { label: 'Weight Changed', color: 'bg-purple-100 text-purple-700' },
  has_notes: { label: 'Notes', color: 'bg-green-100 text-green-700' },
  hard_overall: { label: 'Felt Hard', color: 'bg-red-100 text-red-600' },
}

interface ExceptionBadgeProps {
  type: ExceptionType
}

export function ExceptionBadge({ type }: ExceptionBadgeProps) {
  const { label, color } = config[type]
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>
      {label}
    </span>
  )
}
