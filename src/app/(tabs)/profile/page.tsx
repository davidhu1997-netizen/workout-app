'use client'

import { PageHeader } from '@/components/layout/page-header'

export default function ProfilePage() {
  return (
    <div className="max-w-md mx-auto">
      <PageHeader title="Profile" />

      <div className="px-4">
        <div className="bg-surface rounded-2xl border border-border p-6 text-center shadow-[var(--shadow)]">
          <div className="w-16 h-16 rounded-full bg-surface-peach flex items-center justify-center mx-auto mb-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#944a00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 className="text-lg font-bold font-heading text-foreground">Mom</h2>
          <p className="text-sm text-muted mt-1">Workout Companion</p>
        </div>

        <div className="mt-4 bg-surface rounded-2xl border border-border p-4 shadow-[var(--shadow)]">
          <p className="text-xs text-muted">App Version</p>
          <p className="text-sm font-medium text-foreground">v0.1.0</p>
        </div>

        <div className="mt-4 bg-surface-warm rounded-2xl p-4 text-center">
          <p className="text-sm text-muted">
            More settings coming soon.
          </p>
        </div>
      </div>
    </div>
  )
}
