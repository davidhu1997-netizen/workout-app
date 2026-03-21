'use client'

export type ReviewFilter = 'all' | 'needs_attention' | 'this_week' | 'this_month'

const filters: { value: ReviewFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'needs_attention', label: 'Needs Attention' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
]

interface ReviewFiltersProps {
  current: ReviewFilter
  onChange: (filter: ReviewFilter) => void
}

export function ReviewFilters({ current, onChange }: ReviewFiltersProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
            current === f.value
              ? 'bg-brand text-white'
              : 'bg-surface-warm text-muted hover:text-foreground'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
