'use client'

import { useState, useMemo } from 'react'
import { useSessions, useTemplates } from '@/hooks/use-data'
import { WorkoutSession } from '@/lib/types'
import { ReviewFilters, ReviewFilter } from '@/components/admin/review-filters'
import { ReviewList, hasExceptions } from '@/components/admin/review-list'
import { PageSpinner } from '@/components/ui/spinner'

function getMonday(): Date {
  const now = new Date()
  const day = now.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(now)
  monday.setDate(now.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  return monday
}

export default function ReviewPage() {
  const { data: sessions, loading: sl } = useSessions()
  const { data: templates, loading: tl } = useTemplates()
  const [filter, setFilter] = useState<ReviewFilter>('all')

  const completed = useMemo(
    () =>
      sessions
        .filter((s) => s.completedAt)
        .sort(
          (a, b) =>
            new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
        ),
    [sessions]
  )

  const filtered = useMemo(() => {
    const filterSession = (s: WorkoutSession): boolean => {
      switch (filter) {
        case 'needs_attention': {
          const template = templates.find((t) => t.id === s.templateId)
          return hasExceptions(s, template)
        }
        case 'this_week': {
          const monday = getMonday()
          return !!s.completedAt && new Date(s.completedAt) >= monday
        }
        case 'this_month': {
          const now = new Date()
          const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
          return !!s.completedAt && new Date(s.completedAt) >= firstOfMonth
        }
        default:
          return true
      }
    }
    return completed.filter(filterSession)
  }, [completed, filter, templates])

  if (sl || tl) return <PageSpinner />

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold font-heading mb-4">Review Sessions</h2>
      <div className="mb-4">
        <ReviewFilters current={filter} onChange={setFilter} />
      </div>
      <ReviewList sessions={filtered} templates={templates} />
    </div>
  )
}
