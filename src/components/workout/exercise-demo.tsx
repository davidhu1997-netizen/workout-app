'use client'

import { useState } from 'react'
import { Exercise } from '@/lib/types'
import { BottomSheet } from '@/components/ui/bottom-sheet'

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/
  )
  return match ? match[1] : null
}

function LiteYouTube({ videoId }: { videoId: string }) {
  const [activated, setActivated] = useState(false)
  const thumbUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

  if (activated) {
    return (
      <iframe
        className="w-full h-48 rounded-2xl"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    )
  }

  return (
    <button
      onClick={() => setActivated(true)}
      className="relative w-full h-48 rounded-2xl overflow-hidden cursor-pointer group"
    >
      <img
        src={thumbUrl}
        alt="Video thumbnail"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
        <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="6 3 20 12 6 21 6 3" />
          </svg>
        </div>
      </div>
    </button>
  )
}

interface ExerciseDemoProps {
  open: boolean
  exercise: Exercise
  onClose: () => void
}

export function ExerciseDemo({ open, exercise, onClose }: ExerciseDemoProps) {
  const videoId = exercise.demoUrl ? getYouTubeId(exercise.demoUrl) : null

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="pt-2">
        <h3 className="text-xl font-bold font-heading mb-4">{exercise.name}</h3>

        {/* Video player or placeholder */}
        {videoId ? (
          <div className="mb-4">
            <LiteYouTube key={String(open)} videoId={videoId} />
          </div>
        ) : (
          <div className="w-full h-48 rounded-2xl bg-surface-peach flex items-center justify-center mb-4">
            <div className="text-center">
              <svg className="w-12 h-12 text-brand mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              <p className="text-xs text-muted">No demo video yet</p>
            </div>
          </div>
        )}

        {/* Form cues */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-foreground mb-2">How to do it</h4>
          <ul className="space-y-2">
            {exercise.formCues.map((cue, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted">
                <span className="text-brand font-semibold">{i + 1}.</span>
                {cue}
              </li>
            ))}
          </ul>
        </div>

        {/* Common mistakes */}
        {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground mb-2">Common mistakes</h4>
            <ul className="space-y-2">
              {exercise.commonMistakes.map((mistake, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted">
                  <span className="text-red-400">✕</span>
                  {mistake}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 text-center text-brand font-semibold cursor-pointer mt-2"
        >
          Got it
        </button>
      </div>
    </BottomSheet>
  )
}
