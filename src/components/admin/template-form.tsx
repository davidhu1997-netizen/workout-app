'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WorkoutTemplate, Exercise } from '@/lib/types'
import { writeSaveTemplate } from '@/hooks/use-data'
import { generateId } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ExerciseEditor } from './exercise-editor'

interface TemplateFormProps {
  template?: WorkoutTemplate
}

function createBlankExercise(): Exercise {
  return {
    id: generateId(),
    name: '',
    sets: 3,
    reps: 10,
    defaultWeight: 0,
    equipmentLabel: '',
    formCues: [],
  }
}

export function TemplateForm({ template }: TemplateFormProps) {
  const router = useRouter()
  const isEdit = !!template

  const [name, setName] = useState(template?.name ?? '')
  const [estimatedMinutes, setEstimatedMinutes] = useState(template?.estimatedMinutes ?? 30)
  const [exercises, setExercises] = useState<Exercise[]>(
    template?.exercises ?? [createBlankExercise()]
  )

  const handleExerciseChange = (index: number, exercise: Exercise) => {
    const updated = [...exercises]
    updated[index] = exercise
    setExercises(updated)
  }

  const handleRemoveExercise = (index: number) => {
    if (exercises.length <= 1) return
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const updated = [...exercises]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    setExercises(updated)
  }

  const handleMoveDown = (index: number) => {
    if (index >= exercises.length - 1) return
    const updated = [...exercises]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    setExercises(updated)
  }

  const handleAddExercise = () => {
    setExercises([...exercises, createBlankExercise()])
  }

  const handleSave = () => {
    if (!name.trim()) return

    const validExercises = exercises.filter((e) => e.name.trim())
    if (validExercises.length === 0) return

    const saved: WorkoutTemplate = {
      id: template?.id ?? generateId(),
      name: name.trim(),
      estimatedMinutes,
      exercises: validExercises,
    }

    writeSaveTemplate(saved).then(() => {
      router.push('/admin/templates')
    })
  }

  const isValid = name.trim() && exercises.some((e) => e.name.trim())

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold font-heading mb-6">
        {isEdit ? 'Edit Template' : 'New Template'}
      </h2>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Workout Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-surface-warm border border-border text-sm focus:outline-none focus:border-brand"
            placeholder="e.g. Upper Body Strength"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Estimated Duration (minutes)
          </label>
          <input
            type="number"
            value={estimatedMinutes}
            onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 30)}
            min={5}
            className="w-24 px-3 py-2 rounded-xl bg-surface-warm border border-border text-sm focus:outline-none focus:border-brand"
          />
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold font-heading">
          Exercises ({exercises.length})
        </h3>
        <button
          onClick={handleAddExercise}
          className="text-sm font-medium text-brand hover:underline cursor-pointer"
        >
          + Add Exercise
        </button>
      </div>

      <div className="space-y-3 mb-8">
        {exercises.map((exercise, i) => (
          <ExerciseEditor
            key={exercise.id}
            exercise={exercise}
            index={i}
            onChange={handleExerciseChange}
            onRemove={handleRemoveExercise}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            isFirst={i === 0}
            isLast={i === exercises.length - 1}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => router.push('/admin/templates')}
        >
          Cancel
        </Button>
        <Button
          className="flex-1"
          onClick={handleSave}
          disabled={!isValid}
        >
          {isEdit ? 'Save Changes' : 'Create Template'}
        </Button>
      </div>
    </div>
  )
}
