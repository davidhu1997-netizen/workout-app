'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="min-h-dvh bg-[#fbf9f5] text-[#2c2320] flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
          <p className="text-sm text-[#8c7b73] mb-6">
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            className="px-6 py-2.5 rounded-2xl bg-[#944a00] text-white text-sm font-medium"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
