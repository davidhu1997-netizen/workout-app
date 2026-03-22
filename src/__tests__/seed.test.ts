import { describe, it, expect } from 'vitest'
import { seedTemplates, seedSchedule, seedCompletedSession } from '@/lib/seed'

describe('seedTemplates', () => {
  const templates = seedTemplates()

  it('returns 3 workout templates', () => {
    expect(templates).toHaveLength(3)
  })

  it('each template has a name and exercises', () => {
    for (const t of templates) {
      expect(t.name).toBeTruthy()
      expect(t.exercises.length).toBeGreaterThanOrEqual(4)
    }
  })

  it('each exercise has required fields', () => {
    for (const t of templates) {
      for (const ex of t.exercises) {
        expect(ex.id).toBeTruthy()
        expect(ex.name).toBeTruthy()
        expect(ex.sets).toBeGreaterThanOrEqual(1)
        expect(ex.equipmentLabel).toBeTruthy()
        expect(ex.formCues.length).toBeGreaterThanOrEqual(1)
      }
    }
  })

  it('first exercise of each template can serve as warmup', () => {
    for (const t of templates) {
      const first = t.exercises[0]
      expect(first.name.toLowerCase()).toContain('warmup')
    }
  })
})

describe('seedSchedule', () => {
  const schedule = seedSchedule()

  it('returns 3 scheduled workouts', () => {
    expect(schedule).toHaveLength(3)
  })

  it('monday is completed', () => {
    expect(schedule[0].status).toBe('completed')
    expect(schedule[0].sessionId).toBe('session-mon')
  })

  it('wednesday and friday are upcoming', () => {
    expect(schedule[1].status).toBe('upcoming')
    expect(schedule[2].status).toBe('upcoming')
  })

  it('scheduled dates are Mon/Wed/Fri of current week', () => {
    // scheduledDate is YYYY-MM-DD, parse as local date (not UTC)
    const dates = schedule.map((s) => {
      const [y, m, d] = s.scheduledDate.split('-').map(Number)
      return new Date(y, m - 1, d)
    })
    expect(dates[0].getDay()).toBe(1) // Monday
    expect(dates[1].getDay()).toBe(3) // Wednesday
    expect(dates[2].getDay()).toBe(5) // Friday
  })
})

describe('seedCompletedSession', () => {
  const session = seedCompletedSession()

  it('has all exercises from the upper body template', () => {
    const template = seedTemplates()[0]
    expect(session.exercises).toHaveLength(template.exercises.length)
  })

  it('all sets are completed', () => {
    for (const ex of session.exercises) {
      for (const set of ex.sets) {
        expect(set.completed).toBe(true)
      }
    }
  })

  it('has an overall feeling', () => {
    expect(session.overallFeeling).toBe('good')
  })

  it('has both startedAt and completedAt', () => {
    expect(session.startedAt).toBeTruthy()
    expect(session.completedAt).toBeTruthy()
    expect(new Date(session.completedAt!).getTime()).toBeGreaterThan(
      new Date(session.startedAt).getTime()
    )
  })
})
