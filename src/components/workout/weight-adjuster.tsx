'use client'

import { useState, useEffect } from 'react'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'

const PRESETS = [10, 15, 20, 25, 30]
const STEP = 5

interface WeightAdjusterProps {
  open: boolean
  exerciseName: string
  currentWeight: number
  onSave: (weight: number) => void
  onClose: () => void
}

export function WeightAdjuster({
  open,
  exerciseName,
  currentWeight,
  onSave,
  onClose,
}: WeightAdjusterProps) {
  const [weight, setWeight] = useState(currentWeight)

  useEffect(() => {
    if (open) setWeight(currentWeight)
  }, [open, currentWeight])

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="pt-2">
        <p className="text-xs text-muted text-center mb-1">Adjust Equipment</p>
        <h3 className="text-xl font-bold font-heading text-center mb-6">
          {exerciseName}
        </h3>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <button
            onClick={() => setWeight(Math.max(0, weight - STEP))}
            className="w-14 h-14 rounded-full bg-surface-warm border border-border flex items-center justify-center cursor-pointer hover:bg-surface-peach active:scale-95 transition-all"
            aria-label="Decrease weight"
          >
            <svg width="16" height="2" viewBox="0 0 16 2" fill="none" stroke="#2c2320" strokeWidth="2.5" strokeLinecap="round">
              <line x1="1" y1="1" x2="15" y2="1" />
            </svg>
          </button>

          <div className="text-center min-w-[120px]">
            <span className="text-4xl font-bold font-heading text-foreground">{weight}</span>
            <span className="text-lg text-muted ml-1">lb</span>
          </div>

          <button
            onClick={() => setWeight(weight + STEP)}
            className="w-14 h-14 rounded-full bg-surface-warm border border-border flex items-center justify-center cursor-pointer hover:bg-surface-peach active:scale-95 transition-all"
            aria-label="Increase weight"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#2c2320" strokeWidth="2.5" strokeLinecap="round">
              <line x1="8" y1="1" x2="8" y2="15" />
              <line x1="1" y1="8" x2="15" y2="8" />
            </svg>
          </button>
        </div>

        {/* Presets */}
        <div className="flex justify-center gap-2 mb-8">
          {PRESETS.map((p) => (
            <Chip
              key={p}
              label={`${p} lb`}
              selected={weight === p}
              onClick={() => setWeight(p)}
            />
          ))}
        </div>

        {/* Actions */}
        <Button className="w-full mb-3" onClick={() => onSave(weight)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Save Weight
        </Button>
        <button
          onClick={onClose}
          className="w-full py-3 text-center text-muted font-medium cursor-pointer hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    </BottomSheet>
  )
}
