'use client'

import { useState } from 'react'
import { ScheduledWorkout, WorkoutTemplate } from '@/lib/types'
import {
  writeAddScheduledWorkout,
  writeDeleteScheduledWorkout,
} from '@/hooks/use-data'
import { generateId, toISODate } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function getWeekDays(monday: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function formatWeekRange(monday: Date): string {
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(monday)} - ${fmt(sunday)}`
}

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  in_progress: 'bg-amber-100 text-amber-700',
  upcoming: 'bg-surface-peach text-brand',
  skipped: 'bg-red-100 text-red-500',
}

interface ScheduleGridProps {
  schedule: ScheduledWorkout[]
  templates: WorkoutTemplate[]
  onRefresh: () => void
}

export function ScheduleGrid({ schedule, templates, onRefresh }: ScheduleGridProps) {
  const [weekOffset, setWeekOffset] = useState(0)
  const [error, setError] = useState('')

  const monday = getMonday(new Date())
  monday.setDate(monday.getDate() + weekOffset * 7)
  const weekDays = getWeekDays(monday)

  const getWorkoutForDay = (date: Date): ScheduledWorkout | undefined => {
    const iso = toISODate(date)
    return schedule.find((s) => s.scheduledDate === iso)
  }

  const handleAssign = async (date: Date, templateId: string) => {
    setError('')
    const iso = toISODate(date)
    const existing = schedule.find((s) => s.scheduledDate === iso)

    try {
      if (templateId === '') {
        if (existing) {
          await writeDeleteScheduledWorkout(existing.id)
          onRefresh()
        }
        return
      }

      if (existing) {
        await writeDeleteScheduledWorkout(existing.id)
      }

      await writeAddScheduledWorkout({
        id: generateId(),
        templateId,
        scheduledDate: iso,
        status: 'upcoming',
      })
      onRefresh()
    } catch {
      setError('Failed to update schedule. Please try again.')
    }
  }

  const handleCopyToNextWeek = async () => {
    setError('')
    const nextMonday = new Date(monday)
    nextMonday.setDate(monday.getDate() + 7)
    const nextWeekDays = getWeekDays(nextMonday)

    const thisWeekAssignments = weekDays
      .map((day, i) => ({
        dayIndex: i,
        workout: getWorkoutForDay(day),
      }))
      .filter((a) => a.workout)

    try {
      for (const day of nextWeekDays) {
        const iso = toISODate(day)
        const existing = schedule.find((s) => s.scheduledDate === iso)
        if (existing) {
          await writeDeleteScheduledWorkout(existing.id)
        }
      }

      for (const { dayIndex, workout } of thisWeekAssignments) {
        if (!workout) continue
        await writeAddScheduledWorkout({
          id: generateId(),
          templateId: workout.templateId,
          scheduledDate: toISODate(nextWeekDays[dayIndex]),
          status: 'upcoming',
        })
      }

      setWeekOffset(weekOffset + 1)
      onRefresh()
    } catch {
      setError('Failed to copy week. Please try again.')
    }
  }

  return (
    <div>
      {/* Week picker */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setWeekOffset(weekOffset - 1)}
          className="p-2 rounded-xl hover:bg-surface-warm cursor-pointer"
          aria-label="Previous week"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold font-heading">
            {formatWeekRange(monday)}
          </p>
          {weekOffset !== 0 && (
            <button
              onClick={() => setWeekOffset(0)}
              className="text-xs text-brand hover:underline cursor-pointer"
            >
              Jump to this week
            </button>
          )}
        </div>
        <button
          onClick={() => setWeekOffset(weekOffset + 1)}
          className="p-2 rounded-xl hover:bg-surface-warm cursor-pointer"
          aria-label="Next week"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Day grid */}
      <div className="space-y-2 mb-6">
        {weekDays.map((day, i) => {
          const workout = getWorkoutForDay(day)
          const template = workout
            ? templates.find((t) => t.id === workout.templateId)
            : undefined
          const isToday = toISODate(day) === toISODate(new Date())

          return (
            <div
              key={i}
              className={`bg-surface rounded-2xl border p-4 shadow-[var(--shadow)] ${
                isToday ? 'border-brand' : 'border-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold w-8 ${isToday ? 'text-brand' : 'text-muted'}`}>
                    {DAY_NAMES[i]}
                  </span>
                  <span className="text-xs text-muted">
                    {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  {workout && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[workout.status]}`}>
                      {workout.status.replace('_', ' ')}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <select
                  value={workout?.templateId ?? ''}
                  onChange={(e) => handleAssign(day, e.target.value)}
                  disabled={workout?.status === 'completed' || workout?.status === 'in_progress'}
                  className="w-full px-3 py-2 rounded-xl bg-surface-warm border border-border text-sm focus:outline-none focus:border-brand disabled:opacity-50 appearance-none cursor-pointer"
                >
                  <option value="">Rest day</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )
        })}
      </div>

      {error && (
        <p className="text-sm text-red-500 mb-3">{error}</p>
      )}
      {/* Copy to next week */}
      <Button variant="secondary" className="w-full" onClick={handleCopyToNextWeek}>
        Copy to Next Week
      </Button>
    </div>
  )
}
