'use client'

import { useSchedule, useTemplates } from '@/hooks/use-data'
import { ScheduleGrid } from '@/components/admin/schedule-grid'
import { PageSpinner } from '@/components/ui/spinner'

export default function SchedulePage() {
  const { data: schedule, loading: sl, refetch: refetchSchedule } = useSchedule()
  const { data: templates, loading: tl } = useTemplates()

  if (sl || tl) return <PageSpinner />

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold font-heading mb-6">Weekly Schedule</h2>
      <ScheduleGrid
        schedule={schedule}
        templates={templates}
        onRefresh={refetchSchedule}
      />
    </div>
  )
}
