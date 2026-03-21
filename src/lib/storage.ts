import { ScheduledWorkout, WorkoutSession, WorkoutTemplate } from './types'
import { seedTemplates, seedSchedule, seedCompletedSession } from './seed'

const KEYS = {
  templates: 'workout-templates',
  schedule: 'workout-schedule',
  sessions: 'workout-sessions',
  initialized: 'workout-initialized',
} as const

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

function getItem<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function setItem<T>(key: string, value: T): void {
  if (!isBrowser()) return
  localStorage.setItem(key, JSON.stringify(value))
}

export function initializeSeedData(): void {
  if (!isBrowser()) return
  if (localStorage.getItem(KEYS.initialized)) return

  setItem(KEYS.templates, seedTemplates())
  setItem(KEYS.schedule, seedSchedule())
  setItem(KEYS.sessions, [seedCompletedSession()])
  localStorage.setItem(KEYS.initialized, 'true')
}

export function getTemplates(): WorkoutTemplate[] {
  return getItem<WorkoutTemplate[]>(KEYS.templates, [])
}

export function getTemplate(id: string): WorkoutTemplate | undefined {
  return getTemplates().find((t) => t.id === id)
}

export function getSchedule(): ScheduledWorkout[] {
  return getItem<ScheduledWorkout[]>(KEYS.schedule, [])
}

export function updateScheduledWorkout(updated: ScheduledWorkout): void {
  const schedule = getSchedule().map((s) => (s.id === updated.id ? updated : s))
  setItem(KEYS.schedule, schedule)
}

export function getSessions(): WorkoutSession[] {
  return getItem<WorkoutSession[]>(KEYS.sessions, [])
}

export function getSession(id: string): WorkoutSession | undefined {
  return getSessions().find((s) => s.id === id)
}

export function saveSession(session: WorkoutSession): void {
  const sessions = getSessions()
  const index = sessions.findIndex((s) => s.id === session.id)
  if (index >= 0) {
    sessions[index] = session
  } else {
    sessions.push(session)
  }
  setItem(KEYS.sessions, sessions)
}
