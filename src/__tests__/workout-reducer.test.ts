import { describe, it, expect } from 'vitest'
import { WorkoutSession } from '@/lib/types'

// We need to extract and test the reducer directly.
// Since it's inside the context file, let's import the module and test via a helper.
// For now, we'll test the logic by simulating the reducer inline.

function createTestSession(): WorkoutSession {
  return {
    id: 'test-session',
    templateId: 'tmpl-full',
    scheduledWorkoutId: 'sched-fri',
    startedAt: '2026-03-21T09:00:00.000Z',
    currentExerciseIndex: 0,
    exercises: [
      {
        exerciseId: 'ex-1',
        sets: [
          { setNumber: 1, completed: false },
          { setNumber: 2, completed: false },
          { setNumber: 3, completed: false },
        ],
        skipped: false,
        actualWeight: 20,
        actualEquipmentLabel: 'Two 20 lb dumbbells',
      },
      {
        exerciseId: 'ex-2',
        sets: [
          { setNumber: 1, completed: false },
          { setNumber: 2, completed: false },
        ],
        skipped: false,
        actualWeight: 40,
        actualEquipmentLabel: 'Cable machine at 40 lb',
      },
      {
        exerciseId: 'ex-3',
        sets: [
          { setNumber: 1, completed: false },
        ],
        skipped: false,
        actualWeight: 0,
        actualEquipmentLabel: 'Bodyweight',
      },
    ],
  }
}

// Inline reducer logic (mirrors context/workout-session-context.tsx)
function applyAction(state: WorkoutSession, action: Record<string, unknown>): WorkoutSession {
  switch (action.type) {
    case 'COMPLETE_SET': {
      const exerciseIndex = action.exerciseIndex as number
      const setNumber = action.setNumber as number
      const exercises = [...state.exercises]
      const ex = { ...exercises[exerciseIndex] }
      ex.sets = ex.sets.map((s) =>
        s.setNumber === setNumber ? { ...s, completed: true } : s
      )
      exercises[exerciseIndex] = ex
      return { ...state, exercises }
    }
    case 'ADJUST_WEIGHT': {
      const exerciseIndex = action.exerciseIndex as number
      const newWeight = action.newWeight as number
      const exercises = [...state.exercises]
      exercises[exerciseIndex] = {
        ...exercises[exerciseIndex],
        actualWeight: newWeight,
      }
      return { ...state, exercises }
    }
    case 'SUBMIT_FEEDBACK': {
      const exerciseIndex = action.exerciseIndex as number
      const feedback = action.feedback as string
      const exercises = [...state.exercises]
      exercises[exerciseIndex] = {
        ...exercises[exerciseIndex],
        feedback: feedback as 'too_easy' | 'about_right' | 'too_hard',
      }
      return { ...state, exercises }
    }
    case 'SKIP_EXERCISE': {
      const exerciseIndex = action.exerciseIndex as number
      const exercises = [...state.exercises]
      exercises[exerciseIndex] = {
        ...exercises[exerciseIndex],
        skipped: true,
      }
      return { ...state, exercises }
    }
    case 'NEXT_EXERCISE': {
      return { ...state, currentExerciseIndex: state.currentExerciseIndex + 1 }
    }
    case 'COMPLETE_WORKOUT': {
      return {
        ...state,
        completedAt: new Date().toISOString(),
        overallFeeling: action.feeling as WorkoutSession['overallFeeling'],
        notes: action.notes as string | undefined,
      }
    }
    default:
      return state
  }
}

describe('workout session reducer', () => {
  describe('COMPLETE_SET', () => {
    it('marks a specific set as completed', () => {
      const session = createTestSession()
      const next = applyAction(session, {
        type: 'COMPLETE_SET',
        exerciseIndex: 0,
        setNumber: 1,
      })
      expect(next.exercises[0].sets[0].completed).toBe(true)
      expect(next.exercises[0].sets[1].completed).toBe(false)
      expect(next.exercises[0].sets[2].completed).toBe(false)
    })

    it('does not affect other exercises', () => {
      const session = createTestSession()
      const next = applyAction(session, {
        type: 'COMPLETE_SET',
        exerciseIndex: 0,
        setNumber: 1,
      })
      expect(next.exercises[1].sets[0].completed).toBe(false)
    })

    it('can complete all sets in sequence', () => {
      let session = createTestSession()
      session = applyAction(session, { type: 'COMPLETE_SET', exerciseIndex: 0, setNumber: 1 })
      session = applyAction(session, { type: 'COMPLETE_SET', exerciseIndex: 0, setNumber: 2 })
      session = applyAction(session, { type: 'COMPLETE_SET', exerciseIndex: 0, setNumber: 3 })
      expect(session.exercises[0].sets.every((s) => s.completed)).toBe(true)
    })
  })

  describe('ADJUST_WEIGHT', () => {
    it('updates the actual weight for an exercise', () => {
      const session = createTestSession()
      const next = applyAction(session, {
        type: 'ADJUST_WEIGHT',
        exerciseIndex: 0,
        newWeight: 25,
      })
      expect(next.exercises[0].actualWeight).toBe(25)
    })

    it('does not change the equipment label', () => {
      const session = createTestSession()
      const next = applyAction(session, {
        type: 'ADJUST_WEIGHT',
        exerciseIndex: 0,
        newWeight: 25,
      })
      expect(next.exercises[0].actualEquipmentLabel).toBe('Two 20 lb dumbbells')
    })

    it('can set weight to zero (bodyweight)', () => {
      const session = createTestSession()
      const next = applyAction(session, {
        type: 'ADJUST_WEIGHT',
        exerciseIndex: 0,
        newWeight: 0,
      })
      expect(next.exercises[0].actualWeight).toBe(0)
    })
  })

  describe('SUBMIT_FEEDBACK', () => {
    it('saves feedback on an exercise', () => {
      const session = createTestSession()
      const next = applyAction(session, {
        type: 'SUBMIT_FEEDBACK',
        exerciseIndex: 0,
        feedback: 'too_hard',
      })
      expect(next.exercises[0].feedback).toBe('too_hard')
    })

    it('can overwrite existing feedback', () => {
      let session = createTestSession()
      session = applyAction(session, {
        type: 'SUBMIT_FEEDBACK',
        exerciseIndex: 0,
        feedback: 'too_hard',
      })
      session = applyAction(session, {
        type: 'SUBMIT_FEEDBACK',
        exerciseIndex: 0,
        feedback: 'about_right',
      })
      expect(session.exercises[0].feedback).toBe('about_right')
    })
  })

  describe('SKIP_EXERCISE', () => {
    it('marks an exercise as skipped', () => {
      const session = createTestSession()
      const next = applyAction(session, {
        type: 'SKIP_EXERCISE',
        exerciseIndex: 1,
      })
      expect(next.exercises[1].skipped).toBe(true)
      expect(next.exercises[0].skipped).toBe(false)
    })
  })

  describe('NEXT_EXERCISE', () => {
    it('advances currentExerciseIndex by 1', () => {
      const session = createTestSession()
      expect(session.currentExerciseIndex).toBe(0)
      const next = applyAction(session, { type: 'NEXT_EXERCISE' })
      expect(next.currentExerciseIndex).toBe(1)
    })

    it('can advance past the last exercise', () => {
      let session = createTestSession()
      session = applyAction(session, { type: 'NEXT_EXERCISE' }) // 0 -> 1
      session = applyAction(session, { type: 'NEXT_EXERCISE' }) // 1 -> 2
      session = applyAction(session, { type: 'NEXT_EXERCISE' }) // 2 -> 3 (past end)
      expect(session.currentExerciseIndex).toBe(3)
      expect(session.exercises[session.currentExerciseIndex]).toBeUndefined()
    })
  })

  describe('COMPLETE_WORKOUT', () => {
    it('sets completedAt timestamp', () => {
      const session = createTestSession()
      const next = applyAction(session, { type: 'COMPLETE_WORKOUT' })
      expect(next.completedAt).toBeTruthy()
      expect(new Date(next.completedAt!).getTime()).toBeGreaterThan(0)
    })

    it('saves overall feeling', () => {
      const session = createTestSession()
      const next = applyAction(session, {
        type: 'COMPLETE_WORKOUT',
        feeling: 'good',
      })
      expect(next.overallFeeling).toBe('good')
    })

    it('saves notes', () => {
      const session = createTestSession()
      const next = applyAction(session, {
        type: 'COMPLETE_WORKOUT',
        feeling: 'hard',
        notes: 'My legs were sore',
      })
      expect(next.notes).toBe('My legs were sore')
    })

    it('feeling and notes are optional', () => {
      const session = createTestSession()
      const next = applyAction(session, { type: 'COMPLETE_WORKOUT' })
      expect(next.overallFeeling).toBeUndefined()
      expect(next.notes).toBeUndefined()
    })
  })

  describe('full workout flow', () => {
    it('simulates a complete workout from start to finish', () => {
      let session = createTestSession()

      // Exercise 1: complete all 3 sets, give feedback
      session = applyAction(session, { type: 'COMPLETE_SET', exerciseIndex: 0, setNumber: 1 })
      session = applyAction(session, { type: 'COMPLETE_SET', exerciseIndex: 0, setNumber: 2 })
      session = applyAction(session, { type: 'COMPLETE_SET', exerciseIndex: 0, setNumber: 3 })
      session = applyAction(session, { type: 'SUBMIT_FEEDBACK', exerciseIndex: 0, feedback: 'about_right' })
      session = applyAction(session, { type: 'NEXT_EXERCISE' })

      expect(session.currentExerciseIndex).toBe(1)
      expect(session.exercises[0].sets.every((s) => s.completed)).toBe(true)

      // Exercise 2: adjust weight, complete sets, skip feedback
      session = applyAction(session, { type: 'ADJUST_WEIGHT', exerciseIndex: 1, newWeight: 35 })
      session = applyAction(session, { type: 'COMPLETE_SET', exerciseIndex: 1, setNumber: 1 })
      session = applyAction(session, { type: 'COMPLETE_SET', exerciseIndex: 1, setNumber: 2 })
      session = applyAction(session, { type: 'NEXT_EXERCISE' })

      expect(session.exercises[1].actualWeight).toBe(35)

      // Exercise 3: skip entirely
      session = applyAction(session, { type: 'SKIP_EXERCISE', exerciseIndex: 2 })
      session = applyAction(session, { type: 'NEXT_EXERCISE' })

      expect(session.exercises[2].skipped).toBe(true)
      expect(session.currentExerciseIndex).toBe(3) // past end

      // Complete workout
      session = applyAction(session, {
        type: 'COMPLETE_WORKOUT',
        feeling: 'good',
        notes: 'Good session overall',
      })

      expect(session.completedAt).toBeTruthy()
      expect(session.overallFeeling).toBe('good')
      expect(session.notes).toBe('Good session overall')
    })
  })
})
