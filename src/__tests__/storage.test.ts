import { describe, it, expect } from 'vitest'
import {
  initializeSeedData,
  getTemplates,
  getTemplate,
  getSchedule,
  updateScheduledWorkout,
  getSessions,
  getSession,
  saveSession,
} from '@/lib/storage'
import { WorkoutSession } from '@/lib/types'

describe('storage', () => {
  describe('before initialization', () => {
    it('returns empty arrays', () => {
      expect(getTemplates()).toEqual([])
      expect(getSchedule()).toEqual([])
      expect(getSessions()).toEqual([])
    })
  })

  describe('after initializeSeedData', () => {
    it('populates templates, schedule, and sessions', () => {
      initializeSeedData()
      expect(getTemplates().length).toBe(3)
      expect(getSchedule().length).toBe(3)
      expect(getSessions().length).toBe(1)
    })

    it('does not re-initialize on second call', () => {
      initializeSeedData()
      const sessions = getSessions()
      initializeSeedData() // second call should be no-op
      expect(getSessions()).toEqual(sessions)
    })
  })

  describe('getTemplate', () => {
    it('returns a template by id', () => {
      initializeSeedData()
      const t = getTemplate('tmpl-upper')
      expect(t).toBeDefined()
      expect(t!.name).toBe('Upper Body Strength')
    })

    it('returns undefined for unknown id', () => {
      initializeSeedData()
      expect(getTemplate('nonexistent')).toBeUndefined()
    })
  })

  describe('updateScheduledWorkout', () => {
    it('updates a scheduled workout in place', () => {
      initializeSeedData()
      const schedule = getSchedule()
      const updated = { ...schedule[1], status: 'in_progress' as const, sessionId: 'test-session' }
      updateScheduledWorkout(updated)

      const refreshed = getSchedule()
      expect(refreshed[1].status).toBe('in_progress')
      expect(refreshed[1].sessionId).toBe('test-session')
    })
  })

  describe('saveSession', () => {
    it('adds a new session', () => {
      initializeSeedData()
      const newSession: WorkoutSession = {
        id: 'test-new',
        templateId: 'tmpl-lower',
        scheduledWorkoutId: 'sched-wed',
        startedAt: new Date().toISOString(),
        currentExerciseIndex: 0,
        exercises: [],
      }
      saveSession(newSession)
      expect(getSessions().length).toBe(2)
      expect(getSession('test-new')).toBeDefined()
    })

    it('updates an existing session', () => {
      initializeSeedData()
      const existing = getSessions()[0]
      const updated = { ...existing, notes: 'felt great' }
      saveSession(updated)

      expect(getSessions().length).toBe(1) // didn't duplicate
      expect(getSession(existing.id)!.notes).toBe('felt great')
    })
  })
})
