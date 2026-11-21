'use client'

import { useState, useEffect, useCallback } from 'react'
import { Phrase, DEFAULT_PHRASES } from '@/lib/phrases'

const STORAGE_KEY = 'shizuka-phrases'

export function usePhrases() {
  const [phrases, setPhrases] = useState<Phrase[]>(DEFAULT_PHRASES)
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPhrases(parsed)
        }
      }
    } catch { /* ignore */ }
    setLoaded(true)
  }, [])

  // Persist whenever phrases change (after initial load)
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(phrases))
    } catch { /* ignore */ }
  }, [phrases, loaded])

  const addPhrase = useCallback((text: string, category: string) => {
    const newPhrase: Phrase = {
      id: `u${Date.now()}`,
      text,
      category,
      isDefault: false,
    }
    setPhrases((prev: Phrase[]) => [...(prev ?? []), newPhrase])
  }, [])

  const editPhrase = useCallback((id: string, text: string, category: string) => {
    setPhrases((prev: Phrase[]) =>
      (prev ?? []).map((p: Phrase) => p?.id === id ? { ...p, text, category } : p)
    )
  }, [])

  const deletePhrase = useCallback((id: string) => {
    setPhrases((prev: Phrase[]) => (prev ?? []).filter((p: Phrase) => p?.id !== id))
  }, [])

  const resetToDefaults = useCallback(() => {
    setPhrases(DEFAULT_PHRASES)
  }, [])

  const getByCategory = useCallback((category: string) => {
    return (phrases ?? []).filter((p: Phrase) => p?.category === category)
  }, [phrases])

  return {
    phrases,
    loaded,
    addPhrase,
    editPhrase,
    deletePhrase,
    resetToDefaults,
    getByCategory,
  }
}
