'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WorkoutTemplate, Exercise } from '@/lib/types'
import { writeSaveTemplate } from '@/hooks/use-data'
import { generateId } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ExerciseEditor } from './exercise-editor'

function ensureStringArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.filter((v) => typeof v === 'string')
  if (typeof val === 'string') return val.split('\n').filter((l) => l.trim())
  return []
}

function parseImportedExercises(raw: unknown[]): Exercise[] {
  return raw.map((entry) => {
    const item = entry as Record<string, unknown>
    const cues = ensureStringArray(item.formCues)
    const mistakes = ensureStringArray(item.commonMistakes)
    return {
      id: typeof item.id === 'string' ? item.id : generateId(),
      name: typeof item.name === 'string' ? item.name : '',
      sets: typeof item.sets === 'number' ? item.sets : 3,
      reps: typeof item.reps === 'number' || typeof item.reps === 'string' ? item.reps : 10,
      defaultWeight: typeof item.defaultWeight === 'number' ? item.defaultWeight : 0,
      equipmentLabel: typeof item.equipmentLabel === 'string' ? item.equipmentLabel : '',
      formCues: cues,
      commonMistakes: mistakes.length > 0 ? mistakes : undefined,
      demoUrl: typeof item.demoUrl === 'string' && item.demoUrl ? item.demoUrl : undefined,
    }
  })
}

const IMPORT_EXAMPLE = `{
  "name": "Upper Body Strength",
  "exercises": [
    {
      "name": "Dumbbell Chest Press",
      "sets": 3,
      "reps": 10,
      "defaultWeight": 15,
      "equipmentLabel": "Two 15 lb dumbbells",
      "formCues": ["Keep back flat", "Press up"],
      "commonMistakes": ["Arching back"],
      "demoUrl": "https://youtube.com/watch?v=..."
    }
  ]
}`

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
  const [exercises, setExercises] = useState<Exercise[]>(
    template?.exercises ?? [createBlankExercise()]
  )
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [showImport, setShowImport] = useState(false)
  const [importText, setImportText] = useState('')
  const [importError, setImportError] = useState('')
  const [importPreview, setImportPreview] = useState<{
    exercises: Exercise[]
    name?: string
  } | null>(null)

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

  const handleSave = async () => {
    if (!name.trim()) return

    const validExercises = exercises.filter((e) => e.name.trim())
    if (validExercises.length === 0) return

    const saved: WorkoutTemplate = {
      id: template?.id ?? generateId(),
      name: name.trim(),
      exercises: validExercises,
    }

    setSaving(true)
    setSaveError('')
    try {
      await writeSaveTemplate(saved)
      router.push('/admin/templates')
    } catch {
      setSaveError('Failed to save. Please try again.')
      setSaving(false)
    }
  }

  const handleParseImport = () => {
    setImportError('')
    setImportPreview(null)
    try {
      const parsed = JSON.parse(importText)

      if (parsed.name && parsed.exercises && Array.isArray(parsed.exercises)) {
        const imported = parseImportedExercises(parsed.exercises)
        setImportPreview({
          exercises: imported,
          name: typeof parsed.name === 'string' ? parsed.name : undefined,
        })
      } else if (Array.isArray(parsed)) {
        const imported = parseImportedExercises(parsed)
        setImportPreview({ exercises: imported })
      } else {
        setImportError('Expected a JSON array of exercises or a template object with "exercises" key.')
      }
    } catch {
      setImportError('Invalid JSON. Make sure you copied the full output from ChatGPT/Claude.')
    }
  }

  const handleConfirmImport = () => {
    if (!importPreview) return
    if (importPreview.name && !name.trim()) setName(importPreview.name)
    setExercises(importPreview.exercises)
    setImportPreview(null)
    setImportText('')
    setShowImport(false)
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

      </div>

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold font-heading">
          Exercises ({exercises.length})
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImport(!showImport)}
            className="text-sm font-medium text-muted hover:text-foreground cursor-pointer"
          >
            {showImport ? 'Cancel Import' : 'Import JSON'}
          </button>
          <button
            onClick={handleAddExercise}
            className="text-sm font-medium text-brand hover:underline cursor-pointer"
          >
            + Add Exercise
          </button>
        </div>
      </div>

      {showImport && (
        <div className="mb-4 bg-surface-warm rounded-2xl border border-border p-4">
          {importPreview ? (
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Ready to import {importPreview.exercises.length} exercise{importPreview.exercises.length !== 1 ? 's' : ''}
              </p>
              {importPreview.name && (
                <p className="text-xs text-muted mb-1">Template: {importPreview.name}</p>
              )}
              <ul className="text-xs text-muted mb-3 space-y-0.5">
                {importPreview.exercises.map((ex, i) => (
                  <li key={i}>
                    {i + 1}. {ex.name || '(unnamed)'} — {ex.sets}&times;{ex.reps}
                    {ex.defaultWeight > 0 ? ` @ ${ex.defaultWeight} lb` : ''}
                    {ex.demoUrl ? ' (has video)' : ''}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-red-500 mb-3">
                This will replace your current {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setImportPreview(null)}>
                  Back
                </Button>
                <Button onClick={handleConfirmImport}>
                  Apply
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-muted mb-2">
                Paste a JSON array of exercises or a full template object.
              </p>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs font-mono focus:outline-none focus:border-brand resize-y"
                placeholder={IMPORT_EXAMPLE}
              />
              {importError && (
                <p className="text-xs text-red-500 mt-1">{importError}</p>
              )}
              <div className="flex justify-end mt-2">
                <Button
                  onClick={handleParseImport}
                  disabled={!importText.trim()}
                >
                  Preview Import
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

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

      {saveError && (
        <p className="text-sm text-red-500 mb-3">{saveError}</p>
      )}
      <div className="flex gap-3">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => router.push('/admin/templates')}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button
          className="flex-1"
          onClick={handleSave}
          disabled={!isValid || saving}
        >
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Template'}
        </Button>
      </div>
    </div>
  )
}
