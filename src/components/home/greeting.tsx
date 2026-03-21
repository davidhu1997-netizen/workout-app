interface GreetingProps {
  completedCount: number
  totalCount: number
}

export function Greeting({ completedCount, totalCount }: GreetingProps) {
  return (
    <div className="px-4 pt-12 pb-2">
      <h2 className="text-2xl font-bold font-heading text-foreground">
        Ready for your workout?
      </h2>
      <div className="mt-3">
        <div className="inline-flex items-center gap-3 bg-surface rounded-full border border-border px-4 py-2 shadow-[var(--shadow)]">
          <span className="text-sm font-medium text-foreground">
            Goal: {completedCount}/{totalCount} done
          </span>
          <div className="flex gap-1.5">
            {Array.from({ length: totalCount }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < completedCount ? 'bg-brand' : 'bg-muted-light'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
