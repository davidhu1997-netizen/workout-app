'use client'

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 text-center">
      <p className="text-3xl mb-3">⚠️</p>
      <h2 className="text-lg font-bold font-heading mb-1">Something went wrong</h2>
      <p className="text-sm text-muted mb-5">
        We couldn&apos;t load this page. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-5 py-2 rounded-2xl bg-brand text-white text-sm font-medium"
      >
        Try again
      </button>
    </div>
  )
}
