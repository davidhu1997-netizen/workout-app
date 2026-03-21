'use client'

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { WorkoutSession, ExerciseSession } from '@/lib/types'
import { getSchedule } from '@/lib/storage'
import { writeSaveSession, writeUpdateScheduledWorkout } from '@/hooks/use-data'

type Action =
  | { type: 'LOAD_SESSION'; session: WorkoutSession }
  | { type: 'COMPLETE_SET'; exerciseIndex: number; setNumber: number }
  | { type: 'ADJUST_WEIGHT'; exerciseIndex: number; newWeight: number }
  | { type: 'SUBMIT_FEEDBACK'; exerciseIndex: number; feedback: ExerciseSession['feedback'] }
  | { type: 'SKIP_EXERCISE'; exerciseIndex: number }
  | { type: 'NEXT_EXERCISE' }
  | { type: 'COMPLETE_WORKOUT'; feeling?: WorkoutSession['overallFeeling']; notes?: string }

function reducer(state: WorkoutSession | null, action: Action): WorkoutSession | null {
  if (!state) {
    if (action.type === 'LOAD_SESSION') return action.session
    return null
  }

  switch (action.type) {
    case 'LOAD_SESSION':
      return action.session

    case 'COMPLETE_SET': {
      const exercises = [...state.exercises]
      const ex = { ...exercises[action.exerciseIndex] }
      ex.sets = ex.sets.map((s) =>
        s.setNumber === action.setNumber ? { ...s, completed: true } : s
      )
      exercises[action.exerciseIndex] = ex
      return { ...state, exercises }
    }

    case 'ADJUST_WEIGHT': {
      const exercises = [...state.exercises]
      exercises[action.exerciseIndex] = {
        ...exercises[action.exerciseIndex],
        actualWeight: action.newWeight,
      }
      return { ...state, exercises }
    }

    case 'SUBMIT_FEEDBACK': {
      const exercises = [...state.exercises]
      exercises[action.exerciseIndex] = {
        ...exercises[action.exerciseIndex],
        feedback: action.feedback,
      }
      return { ...state, exercises }
    }

    case 'SKIP_EXERCISE': {
      const exercises = [...state.exercises]
      exercises[action.exerciseIndex] = {
        ...exercises[action.exerciseIndex],
        skipped: true,
      }
      return { ...state, exercises }
    }

    case 'NEXT_EXERCISE': {
      const next = state.currentExerciseIndex + 1
      return { ...state, currentExerciseIndex: next }
    }

    case 'COMPLETE_WORKOUT': {
      return {
        ...state,
        completedAt: new Date().toISOString(),
        overallFeeling: action.feeling,
        notes: action.notes,
      }
    }

    default:
      return state
  }
}

interface WorkoutContextValue {
  session: WorkoutSession | null
  dispatch: (action: Action) => void
}

const WorkoutContext = createContext<WorkoutContextValue>({
  session: null,
  dispatch: () => {},
})

export function useWorkoutSession() {
  return useContext(WorkoutContext)
}

export function WorkoutSessionProvider({
  sessionId,
  children,
}: {
  sessionId: string
  children: React.ReactNode
}) {
  const [session, rawDispatch] = useReducer(reducer, null)

  useEffect(() => {
    // Load session - try Supabase first via use-data, fallback to localStorage
    import('@/hooks/use-data').then(async () => {
      // Use storage directly for initial load since we can't use hooks here
      const { getSession } = await import('@/lib/storage')
      const { supabase } = await import('@/lib/supabase')
      if (supabase) {
        const { data } = await supabase
          .from('workout_sessions')
          .select('*')
          .eq('id', sessionId)
          .single()
        if (data) {
          rawDispatch({
            type: 'LOAD_SESSION',
            session: {
              id: data.id,
              templateId: data.template_id,
              scheduledWorkoutId: data.scheduled_workout_id,
              startedAt: data.started_at,
              completedAt: data.completed_at ?? undefined,
              currentExerciseIndex: data.current_exercise_index,
              exercises: data.exercises,
              overallFeeling: data.overall_feeling ?? undefined,
              notes: data.notes ?? undefined,
            },
          })
          return
        }
      }
      const loaded = getSession(sessionId)
      if (loaded) {
        rawDispatch({ type: 'LOAD_SESSION', session: loaded })
      }
    })
  }, [sessionId])

  const dispatch = useCallback(
    (action: Action) => {
      rawDispatch(action)
    },
    []
  )

  // Persist on every state change
  useEffect(() => {
    if (session) {
      writeSaveSession(session)

      // Also update ScheduledWorkout status
      if (session.completedAt) {
        const schedule = getSchedule()
        const sw = schedule.find((s) => s.id === session.scheduledWorkoutId)
        if (sw && sw.status !== 'completed') {
          writeUpdateScheduledWorkout({ ...sw, status: 'completed' })
        }
      }
    }
  }, [session])

  return (
    <WorkoutContext.Provider value={{ session, dispatch }}>
      {children}
    </WorkoutContext.Provider>
  )
}
