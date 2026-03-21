'use client'

interface ChipProps {
  label: string
  selected?: boolean
  onClick?: () => void
}

export function Chip({ label, selected = false, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
        selected
          ? 'bg-brand text-white'
          : 'bg-surface-warm text-foreground border border-border hover:bg-surface-peach'
      }`}
    >
      {label}
    </button>
  )
}
