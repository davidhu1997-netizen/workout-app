'use client'

import { useRouter } from 'next/navigation'

export default function WorkoutError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center">
      <p className="text-3xl mb-3">⚠️</p>
      <h2 className="text-lg font-bold font-heading mb-1">Workout error</h2>
      <p className="text-sm text-muted mb-5">
        Something went wrong during your workout.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => router.push('/')}
          className="px-5 py-2 rounded-2xl border border-border text-sm font-medium"
        >
          Go home
        </button>
        <button
          onClick={reset}
          className="px-5 py-2 rounded-2xl bg-brand text-white text-sm font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
