interface ProgressBarProps {
  value: number // 0-100
  className?: string
}

export function ProgressBar({ value, className = '' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={`h-1.5 w-full rounded-full bg-surface-peach ${className}`}>
      <div
        className="h-full rounded-full bg-brand transition-all duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
