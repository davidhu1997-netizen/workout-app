'use client'

import { useState } from 'react'
import Link from 'next/link'
import { WorkoutTemplate } from '@/lib/types'
import { writeDeleteTemplate } from '@/hooks/use-data'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from './confirm-dialog'

interface TemplateListProps {
  templates: WorkoutTemplate[]
  onRefresh: () => void
}

export function TemplateList({ templates, onRefresh }: TemplateListProps) {
  const [deleteTarget, setDeleteTarget] = useState<WorkoutTemplate | null>(null)
  const [deleteError, setDeleteError] = useState('')

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteError('')
    try {
      await writeDeleteTemplate(deleteTarget.id)
      setDeleteTarget(null)
      onRefresh()
    } catch {
      setDeleteError('Failed to delete. Please try again.')
    }
  }

  return (
    <>
      <div className="space-y-2">
        {templates.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted text-sm mb-4">No templates yet.</p>
            <Link href="/admin/templates/new">
              <Button>Create Your First Template</Button>
            </Link>
          </div>
        ) : (
          templates.map((template) => (
            <div
              key={template.id}
              className="bg-surface rounded-2xl border border-border p-4 shadow-[var(--shadow)] flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{template.name}</p>
                <p className="text-xs text-muted mt-0.5">
                  {template.exercises.length} exercises
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/templates/${template.id}`}>
                  <Button variant="ghost" size="sm">Edit</Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteTarget(template)}
                >
                  <span className="text-red-500">Delete</span>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {deleteError && (
        <p className="text-sm text-red-500 mt-2 px-1">{deleteError}</p>
      )}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Template"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => { setDeleteTarget(null); setDeleteError('') }}
      />
    </>
  )
}
