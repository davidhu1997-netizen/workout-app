import { describe, it, expect } from 'vitest'
import { generateId, formatDate, formatDuration, getWeekDates, toISODate } from '@/lib/utils'

describe('generateId', () => {
  it('returns a non-empty string', () => {
    expect(generateId()).toBeTruthy()
    expect(typeof generateId()).toBe('string')
  })

  it('returns unique values', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()))
    expect(ids.size).toBe(100)
  })
})

describe('formatDate', () => {
  it('formats an ISO date string into human-readable form', () => {
    const result = formatDate('2026-03-21T09:00:00.000Z')
    expect(result).toMatch(/Mar/)
    expect(result).toMatch(/21/)
  })
})

describe('formatDuration', () => {
  it('returns minutes for short durations', () => {
    const start = '2026-03-21T09:00:00.000Z'
    const end = '2026-03-21T09:35:00.000Z'
    expect(formatDuration(start, end)).toBe('35 min')
  })

  it('returns hours and minutes for long durations', () => {
    const start = '2026-03-21T09:00:00.000Z'
    const end = '2026-03-21T10:15:00.000Z'
    expect(formatDuration(start, end)).toBe('1h 15m')
  })

  it('handles exact hour', () => {
    const start = '2026-03-21T09:00:00.000Z'
    const end = '2026-03-21T10:00:00.000Z'
    expect(formatDuration(start, end)).toBe('1h 0m')
  })
})

describe('getWeekDates', () => {
  it('returns monday and friday of the current week', () => {
    const { monday, friday } = getWeekDates()
    expect(monday.getDay()).toBe(1) // Monday
    expect(friday.getDay()).toBe(5) // Friday
    expect(friday.getTime() - monday.getTime()).toBe(4 * 24 * 60 * 60 * 1000)
  })
})

describe('toISODate', () => {
  it('returns YYYY-MM-DD format', () => {
    const date = new Date('2026-03-21T12:00:00.000Z')
    expect(toISODate(date)).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
