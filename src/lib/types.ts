export interface Exercise {
  id: string
  name: string
  sets: number
  reps: number | string
  defaultWeight: number
  equipmentLabel: string
  formCues: string[]
  commonMistakes?: string[]
  demoUrl?: string
}

export interface WorkoutTemplate {
  id: string
  name: string
  exercises: Exercise[]
  imageUrl?: string
}

export interface ScheduledWorkout {
  id: string
  templateId: string
  scheduledDate: string
  status: 'upcoming' | 'in_progress' | 'completed' | 'skipped'
  sessionId?: string
}

export interface WorkoutSession {
  id: string
  templateId: string
  scheduledWorkoutId: string
  startedAt: string
  completedAt?: string
  currentExerciseIndex: number
  exercises: ExerciseSession[]
  overallFeeling?: 'easy' | 'good' | 'hard'
  notes?: string
}

export interface ExerciseSession {
  exerciseId: string
  sets: SetCompletion[]
  skipped: boolean
  feedback?: 'too_easy' | 'about_right' | 'too_hard'
  actualWeight: number
  actualEquipmentLabel: string
}

export interface SetCompletion {
  setNumber: number
  completed: boolean
  reps?: number
}
