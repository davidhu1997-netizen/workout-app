'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useWorkoutSession } from '@/context/workout-session-context'
import { getTemplate } from '@/lib/storage'
import { PageHeader } from '@/components/layout/page-header'
import { ProgressBar } from '@/components/ui/progress-bar'
import { ExerciseView } from '@/components/workout/exercise-view'
import { WeightAdjuster } from '@/components/workout/weight-adjuster'
import { FeedbackModal } from '@/components/workout/feedback-modal'
import { ExerciseDemo } from '@/components/workout/exercise-demo'
import { ExerciseSession } from '@/lib/types'

export default function GuidedExercisePage() {
  const router = useRouter()
  const { session, dispatch } = useWorkoutSession()
  const [showWeightSheet, setShowWeightSheet] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  const template = session ? getTemplate(session.templateId) : null

  const handleBack = useCallback(() => {
    if (session && session.exercises.some((e) => e.sets.some((s) => s.completed))) {
      setShowExitConfirm(true)
    } else {
      router.push('/')
    }
  }, [session, router])

  if (!session || !template) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <p className="text-muted">Loading workout...</p>
      </div>
    )
  }

  const exerciseIndex = session.currentExerciseIndex
  const exercise = template.exercises[exerciseIndex]
  const exerciseSession = session.exercises[exerciseIndex]
  const totalExercises = template.exercises.length
  const progressPercent = (exerciseIndex / totalExercises) * 100

  if (!exercise || !exerciseSession) {
    router.push(`/workout/${session.id}/complete`)
    return null
  }

  const allSetsComplete = exerciseSession.sets.every((s) => s.completed)

  const handleCompleteSet = (setNumber: number) => {
    dispatch({ type: 'COMPLETE_SET', exerciseIndex, setNumber })

    // Check if this was the last set
    const setsAfterComplete = exerciseSession.sets.map((s) =>
      s.setNumber === setNumber ? { ...s, completed: true } : s
    )
    if (setsAfterComplete.every((s) => s.completed)) {
      // Show feedback after a brief delay
      setTimeout(() => setShowFeedback(true), 300)
    }
  }

  const handleFeedback = (feedback: ExerciseSession['feedback']) => {
    dispatch({ type: 'SUBMIT_FEEDBACK', exerciseIndex, feedback })
    setShowFeedback(false)
    advanceToNext()
  }

  const handleSkipFeedback = () => {
    setShowFeedback(false)
    advanceToNext()
  }

  const handleSkipExercise = () => {
    dispatch({ type: 'SKIP_EXERCISE', exerciseIndex })
    setShowFeedback(true)
  }

  const advanceToNext = () => {
    if (exerciseIndex + 1 >= totalExercises) {
      dispatch({ type: 'COMPLETE_WORKOUT' })
      router.push(`/workout/${session.id}/complete`)
    } else {
      dispatch({ type: 'NEXT_EXERCISE' })
    }
  }

  const handleWeightSave = (newWeight: number) => {
    dispatch({ type: 'ADJUST_WEIGHT', exerciseIndex, newWeight })
    setShowWeightSheet(false)
  }

  return (
    <div className="max-w-md mx-auto min-h-dvh flex flex-col">
      <PageHeader
        title={template.name}
        showBack
        onBack={handleBack}
      />

      {/* Progress */}
      <div className="px-4 mb-4">
        <div className="flex justify-between text-xs text-muted mb-1.5">
          <span>Exercise {exerciseIndex + 1} of {totalExercises}</span>
          <span>{Math.round(progressPercent)}% Session Complete</span>
        </div>
        <ProgressBar value={progressPercent} />
      </div>

      {/* Exercise content */}
      <div className="flex-1">
        <ExerciseView
          exercise={exercise}
          exerciseSession={exerciseSession}
          onCompleteSet={handleCompleteSet}
          onAdjustWeight={() => setShowWeightSheet(true)}
          onWatchDemo={() => setShowDemo(true)}
        />
      </div>

      {/* Skip / Next buttons */}
      <div className="px-4 py-4">
        {allSetsComplete && !showFeedback ? (
          <button
            onClick={() => setShowFeedback(true)}
            className="w-full text-center py-3 text-brand font-semibold cursor-pointer"
          >
            Continue to Next Exercise
          </button>
        ) : (
          <button
            onClick={handleSkipExercise}
            className="w-full text-center py-3 text-muted font-medium cursor-pointer hover:text-foreground transition-colors"
          >
            Skip Exercise
          </button>
        )}
      </div>

      {/* Overlays */}
      <WeightAdjuster
        open={showWeightSheet}
        exerciseName={exercise.name}
        currentWeight={exerciseSession.actualWeight}
        onSave={handleWeightSave}
        onClose={() => setShowWeightSheet(false)}
      />

      <FeedbackModal
        open={showFeedback}
        onSelect={handleFeedback}
        onSkip={handleSkipFeedback}
      />

      <ExerciseDemo
        open={showDemo}
        exercise={exercise}
        onClose={() => setShowDemo(false)}
      />

      {/* Exit confirmation */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowExitConfirm(false)} />
          <div className="relative bg-surface rounded-3xl p-6 shadow-[var(--shadow-md)] max-w-sm w-full">
            <h3 className="text-lg font-bold font-heading mb-2">Leave workout?</h3>
            <p className="text-sm text-muted mb-6">
              Your progress is saved. You can resume this workout later.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-3 text-sm font-semibold text-foreground bg-surface-warm rounded-2xl cursor-pointer"
              >
                Keep Going
              </button>
              <button
                onClick={() => router.push('/')}
                className="flex-1 py-3 text-sm font-semibold text-white bg-brand rounded-2xl cursor-pointer"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
