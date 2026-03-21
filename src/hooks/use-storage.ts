'use client'

import { useState, useEffect, useCallback } from 'react'

export function useStorage<T>(key: string, fallback: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(fallback)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored) setValue(JSON.parse(stored))
    } catch {
      // use fallback
    }
    setHydrated(true)
  }, [key])

  const update = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof newValue === 'function'
          ? (newValue as (prev: T) => T)(prev)
          : newValue
        localStorage.setItem(key, JSON.stringify(resolved))
        return resolved
      })
    },
    [key]
  )

  if (!hydrated) return [fallback, update]
  return [value, update]
}
