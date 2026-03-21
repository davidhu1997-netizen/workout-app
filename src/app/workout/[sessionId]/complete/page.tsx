'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWorkoutSession } from '@/context/workout-session-context'
import { useTemplate } from '@/hooks/use-data'
import { formatDuration } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { WorkoutSession } from '@/lib/types'

const feelings: { value: WorkoutSession['overallFeeling']; label: string; emoji: string }[] = [
  { value: 'easy', label: 'Easy', emoji: '😊' },
  { value: 'good', label: 'Good', emoji: '💪' },
  { value: 'hard', label: 'Hard', emoji: '😅' },
]

export default function WorkoutCompletePage() {
  const router = useRouter()
  const { session, dispatch } = useWorkoutSession()
  const [selectedFeeling, setSelectedFeeling] = useState<WorkoutSession['overallFeeling']>()
  const [notes, setNotes] = useState('')

  const { data: template } = useTemplate(session?.templateId ?? '')

  if (!session || !template) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <p className="text-muted">Loading...</p>
      </div>
    )
  }

  const completedExercises = session.exercises.filter(
    (e) => !e.skipped && e.sets.some((s) => s.completed)
  ).length
  const totalSetsCompleted = session.exercises.reduce(
    (sum, e) => sum + e.sets.filter((s) => s.completed).length,
    0
  )
  const completedAt = session.completedAt ?? new Date().toISOString()
  const duration = formatDuration(session.startedAt, completedAt)

  const handleFinish = () => {
    dispatch({
      type: 'COMPLETE_WORKOUT',
      feeling: selectedFeeling,
      notes: notes || undefined,
    })
    router.push('/')
  }

  return (
    <div className="max-w-md mx-auto min-h-dvh flex flex-col items-center justify-center px-4 py-8">
      {/* Success icon */}
      <div className="w-20 h-20 rounded-full bg-brand/10 flex items-center justify-center mb-6">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#944a00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold font-heading text-foreground mb-2">
        Workout Complete
      </h1>
      <p className="text-sm text-muted mb-8">Great work today!</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 w-full mb-8">
        <div className="bg-surface-warm rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold font-heading text-foreground">{completedExercises}</p>
          <p className="text-xs text-muted mt-1">Exercises</p>
        </div>
        <div className="bg-surface-warm rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold font-heading text-foreground">{totalSetsCompleted}</p>
          <p className="text-xs text-muted mt-1">Sets</p>
        </div>
        <div className="bg-surface-warm rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold font-heading text-foreground">{duration}</p>
          <p className="text-xs text-muted mt-1">Duration</p>
        </div>
      </div>

      {/* Overall feeling */}
      <div className="w-full mb-6">
        <p className="text-sm font-medium text-foreground mb-3 text-center">
          How was the workout overall?
        </p>
        <div className="flex gap-3 justify-center">
          {feelings.map((f) => (
            <button
              key={f.value}
              onClick={() => setSelectedFeeling(f.value)}
              className={`flex flex-col items-center gap-1 px-5 py-3 rounded-2xl cursor-pointer transition-all ${
                selectedFeeling === f.value
                  ? 'bg-brand text-white scale-105'
                  : 'bg-surface-warm text-foreground hover:bg-surface-peach'
              }`}
            >
              <span className="text-xl">{f.emoji}</span>
              <span className="text-xs font-medium">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="w-full mb-8">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything to note? (optional)"
          rows={3}
          className="w-full px-4 py-3 rounded-2xl bg-surface-warm border border-border text-sm text-foreground placeholder:text-muted-light resize-none focus:outline-none focus:border-brand"
        />
      </div>

      {/* Finish */}
      <Button size="lg" className="w-full" onClick={handleFinish}>
        Finish
      </Button>
    </div>
  )
}
