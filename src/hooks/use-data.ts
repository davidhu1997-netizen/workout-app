'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import * as storage from '@/lib/storage'
import type {
  WorkoutTemplate,
  ScheduledWorkout,
  WorkoutSession,
} from '@/lib/types'

// --- Supabase row <-> type mappers ---

function rowToTemplate(row: Record<string, unknown>): WorkoutTemplate {
  return {
    id: row.id as string,
    name: row.name as string,
    exercises: row.exercises as WorkoutTemplate['exercises'],
    imageUrl: row.image_url as string | undefined,
  }
}

function rowToScheduled(row: Record<string, unknown>): ScheduledWorkout {
  return {
    id: row.id as string,
    templateId: row.template_id as string,
    scheduledDate: row.scheduled_date as string,
    status: row.status as ScheduledWorkout['status'],
    sessionId: row.session_id as string | undefined,
  }
}

function rowToSession(row: Record<string, unknown>): WorkoutSession {
  return {
    id: row.id as string,
    templateId: row.template_id as string,
    scheduledWorkoutId: row.scheduled_workout_id as string,
    startedAt: row.started_at as string,
    completedAt: row.completed_at as string | undefined,
    currentExerciseIndex: row.current_exercise_index as number,
    exercises: row.exercises as WorkoutSession['exercises'],
    overallFeeling: row.overall_feeling as WorkoutSession['overallFeeling'],
    notes: row.notes as string | undefined,
  }
}

// --- Async fetchers (Supabase or localStorage) ---

async function fetchTemplates(): Promise<WorkoutTemplate[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('workout_templates')
      .select('*')
      .order('created_at')
    if (error) throw error
    return (data ?? []).map(rowToTemplate)
  }
  return storage.getTemplates()
}

async function fetchTemplate(id: string): Promise<WorkoutTemplate | undefined> {
  if (supabase) {
    const { data, error } = await supabase
      .from('workout_templates')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return undefined
    return rowToTemplate(data)
  }
  return storage.getTemplate(id)
}

async function fetchSchedule(): Promise<ScheduledWorkout[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('scheduled_workouts')
      .select('*')
      .order('scheduled_date')
    if (error) throw error
    return (data ?? []).map(rowToScheduled)
  }
  return storage.getSchedule()
}

async function fetchSessions(): Promise<WorkoutSession[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .order('started_at', { ascending: false })
    if (error) throw error
    return (data ?? []).map(rowToSession)
  }
  return storage.getSessions()
}

async function fetchSession(id: string): Promise<WorkoutSession | undefined> {
  if (supabase) {
    const { data, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return undefined
    return rowToSession(data)
  }
  return storage.getSession(id)
}

// --- Write functions (Supabase or localStorage) ---

export async function writeSaveTemplate(template: WorkoutTemplate): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('workout_templates').upsert({
      id: template.id,
      name: template.name,
      exercises: template.exercises,
      image_url: template.imageUrl ?? null,
      updated_at: new Date().toISOString(),
    })
    if (error) throw error
    return
  }
  storage.saveTemplate(template)
}

export async function writeDeleteTemplate(id: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('workout_templates').delete().eq('id', id)
    if (error) throw error
    return
  }
  storage.deleteTemplate(id)
}

export async function writeSaveSession(session: WorkoutSession): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('workout_sessions').upsert({
      id: session.id,
      template_id: session.templateId,
      scheduled_workout_id: session.scheduledWorkoutId,
      started_at: session.startedAt,
      completed_at: session.completedAt ?? null,
      current_exercise_index: session.currentExerciseIndex,
      exercises: session.exercises,
      overall_feeling: session.overallFeeling ?? null,
      notes: session.notes ?? null,
    })
    if (error) throw error
    return
  }
  storage.saveSession(session)
}

export async function writeUpdateScheduledWorkout(workout: ScheduledWorkout): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('scheduled_workouts').upsert({
      id: workout.id,
      template_id: workout.templateId,
      scheduled_date: workout.scheduledDate,
      status: workout.status,
      session_id: workout.sessionId ?? null,
    })
    if (error) throw error
    return
  }
  storage.updateScheduledWorkout(workout)
}

export async function writeAddScheduledWorkout(workout: ScheduledWorkout): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('scheduled_workouts').insert({
      id: workout.id,
      template_id: workout.templateId,
      scheduled_date: workout.scheduledDate,
      status: workout.status,
      session_id: workout.sessionId ?? null,
    })
    if (error) throw error
    return
  }
  storage.addScheduledWorkout(workout)
}

export async function writeDeleteScheduledWorkout(id: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('scheduled_workouts').delete().eq('id', id)
    if (error) throw error
    return
  }
  storage.deleteScheduledWorkout(id)
}

// --- Hooks ---

interface DataResult<T> {
  data: T
  loading: boolean
  refetch: () => void
}

function useAsyncData<T>(fetcher: () => Promise<T>, initialValue: T, deps: unknown[] = []): DataResult<T> {
  const [data, setData] = useState<T>(initialValue)
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(() => {
    setLoading(true)
    fetcher()
      .then((result) => {
        setData(result)
      })
      .catch((err) => {
        console.error('Data fetch error:', err)
      })
      .finally(() => {
        setLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, loading, refetch }
}

export function useTemplates(): DataResult<WorkoutTemplate[]> {
  return useAsyncData(fetchTemplates, [])
}

export function useTemplate(id: string): DataResult<WorkoutTemplate | undefined> {
  return useAsyncData(() => fetchTemplate(id), undefined, [id])
}

export function useSchedule(): DataResult<ScheduledWorkout[]> {
  return useAsyncData(fetchSchedule, [])
}

export function useSessions(): DataResult<WorkoutSession[]> {
  return useAsyncData(fetchSessions, [])
}

export function useSession(id: string): DataResult<WorkoutSession | undefined> {
  return useAsyncData(() => fetchSession(id), undefined, [id])
}
