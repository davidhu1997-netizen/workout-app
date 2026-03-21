'use client'

import Link from 'next/link'
import { useTemplates, useSchedule, useSessions } from '@/hooks/use-data'
import { Card } from '@/components/ui/card'

export default function AdminDashboard() {
  const { data: templates, loading: tl } = useTemplates()
  const { data: schedule, loading: sl } = useSchedule()
  const { data: sessions, loading: sel } = useSessions()

  if (tl || sl || sel) return null

  const completedThisWeek = (() => {
    const now = new Date()
    const day = now.getDay()
    const diffToMonday = day === 0 ? -6 : 1 - day
    const monday = new Date(now)
    monday.setDate(now.getDate() + diffToMonday)
    monday.setHours(0, 0, 0, 0)
    return sessions.filter(
      (s) => s.completedAt && new Date(s.completedAt) >= monday
    ).length
  })()

  const needsAttention = sessions.filter((s) => {
    if (!s.completedAt) return false
    return s.exercises.some(
      (e) =>
        e.skipped ||
        e.feedback === 'too_easy' ||
        e.feedback === 'too_hard'
    ) || s.overallFeeling === 'hard' || (s.notes && s.notes.trim().length > 0)
  }).length

  const cards = [
    {
      href: '/admin/templates',
      title: 'Templates',
      stat: `${templates.length} templates`,
      description: 'Create, edit, and manage workout templates',
    },
    {
      href: '/admin/schedule',
      title: 'Schedule',
      stat: `${schedule.length} scheduled`,
      description: 'Assign workouts to days of the week',
    },
    {
      href: '/admin/review',
      title: 'Review',
      stat: `${completedThisWeek} this week`,
      description: needsAttention > 0
        ? `${needsAttention} session${needsAttention > 1 ? 's' : ''} need attention`
        : 'All sessions looking good',
    },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold font-heading mb-6">Overview</h2>
      <div className="grid gap-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="p-5 hover:shadow-[var(--shadow-md)] transition-shadow cursor-pointer">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold font-heading text-foreground">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted mt-1">{card.description}</p>
                </div>
                <span className="text-sm font-medium text-brand bg-surface-peach px-3 py-1 rounded-full">
                  {card.stat}
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
