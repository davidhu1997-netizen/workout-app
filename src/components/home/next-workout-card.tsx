'use client'

import { useRouter } from 'next/navigation'
import { WorkoutTemplate, ScheduledWorkout, WorkoutSession } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { generateId } from '@/lib/utils'
import { writeSaveSession, writeUpdateScheduledWorkout } from '@/hooks/use-data'

interface NextWorkoutCardProps {
  template: WorkoutTemplate
  scheduled: ScheduledWorkout
  existingSession?: WorkoutSession
}

export function NextWorkoutCard({ template, scheduled, existingSession }: NextWorkoutCardProps) {
  const router = useRouter()
  const isResume = scheduled.status === 'in_progress' && existingSession

  const handleStart = () => {
    if (isResume && existingSession) {
      router.push(`/workout/${existingSession.id}`)
      return
    }

    const sessionId = generateId()
    const session: WorkoutSession = {
      id: sessionId,
      templateId: template.id,
      scheduledWorkoutId: scheduled.id,
      startedAt: new Date().toISOString(),
      currentExerciseIndex: 0,
      exercises: template.exercises.map((ex) => ({
        exerciseId: ex.id,
        sets: Array.from({ length: ex.sets }, (_, i) => ({
          setNumber: i + 1,
          completed: false,
        })),
        skipped: false,
        actualWeight: ex.defaultWeight,
        actualEquipmentLabel: ex.equipmentLabel,
      })),
    }

    writeSaveSession(session)
    writeUpdateScheduledWorkout({ ...scheduled, status: 'in_progress', sessionId })
    router.push(`/workout/${sessionId}`)
  }

  return (
    <Card className="mx-4 overflow-hidden">
      <div className="relative h-36 bg-gradient-to-br from-brand/20 to-surface-peach flex items-end p-5">
        <h3 className="text-2xl font-bold font-heading text-foreground leading-tight">
          {template.name}
        </h3>
      </div>
      <div className="p-5">
        <p className="text-xs font-medium text-muted uppercase tracking-wide mb-3">
          Exercise List
        </p>
        <ol className="space-y-2 mb-6">
          {template.exercises.map((ex, i) => (
            <li key={ex.id} className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-surface-peach text-xs font-semibold flex items-center justify-center text-brand">
                {i + 1}
              </span>
              <span className="text-sm text-foreground">{ex.name}</span>
            </li>
          ))}
        </ol>
        <p className="text-xs text-muted mb-4">~{template.estimatedMinutes} min</p>
        <Button size="lg" className="w-full" onClick={handleStart}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          {isResume ? 'Resume Workout' : 'Start Workout'}
        </Button>
      </div>
    </Card>
  )
}
