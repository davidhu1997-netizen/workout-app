'use client'

import { useRouter } from 'next/navigation'

interface PageHeaderProps {
  title?: string
  showBack?: boolean
  onBack?: () => void
  right?: React.ReactNode
}

export function PageHeader({ title, showBack = false, onBack, right }: PageHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 min-h-[48px]">
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-xl hover:bg-surface-warm transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        {title && (
          <h1 className="text-lg font-semibold font-heading">{title}</h1>
        )}
      </div>
      {right && <div>{right}</div>}
    </header>
  )
}
