'use client'

import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div className="relative bg-surface rounded-3xl p-6 shadow-[var(--shadow-md)] max-w-sm w-full">
        <h3 className="text-lg font-bold font-heading mb-2">{title}</h3>
        <p className="text-sm text-muted mb-6">{message}</p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 text-sm font-semibold text-white bg-red-500 rounded-2xl cursor-pointer hover:bg-red-600 transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
