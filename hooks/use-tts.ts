'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export interface TtsSettings {
  rate: number
  pitch: number
  voiceURI: string
}

const DEFAULT_SETTINGS: TtsSettings = {
  rate: 1.0,
  pitch: 1.0,
  voiceURI: '',
}

const SETTINGS_KEY = 'shizuka-tts-settings'

export function useTts() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [settings, setSettings] = useState<TtsSettings>(DEFAULT_SETTINGS)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [activePhrase, setActivePhrase] = useState<string | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  // Load voices
  useEffect(() => {
    if (typeof window === 'undefined') return
    synthRef.current = window.speechSynthesis

    const loadVoices = () => {
      const allVoices = synthRef.current?.getVoices?.() ?? []
      const spanishVoices = allVoices.filter((v: SpeechSynthesisVoice) => v.lang?.startsWith?.('es'))
      setVoices(spanishVoices?.length > 0 ? spanishVoices : allVoices)
    }

    loadVoices()
    synthRef.current?.addEventListener?.('voiceschanged', loadVoices)

    // Load saved settings
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setSettings({ ...DEFAULT_SETTINGS, ...(parsed ?? {}) })
      }
    } catch { /* ignore */ }

    return () => {
      synthRef.current?.removeEventListener?.('voiceschanged', loadVoices)
    }
  }, [])

  // Persist settings
  const updateSettings = useCallback((partial: Partial<TtsSettings>) => {
    setSettings((prev: TtsSettings) => {
      const next = { ...(prev ?? DEFAULT_SETTINGS), ...partial }
      try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [])

  // Speak
  const speak = useCallback((text: string, phraseId: string) => {
    if (typeof window === 'undefined' || !synthRef.current) return
    synthRef.current.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = settings?.rate ?? 1.0
    utterance.pitch = settings?.pitch ?? 1.0

    const selectedVoice = voices?.find?.((v: SpeechSynthesisVoice) => v.voiceURI === settings?.voiceURI)
    if (selectedVoice) {
      utterance.voice = selectedVoice
    } else if ((voices?.length ?? 0) > 0) {
      utterance.voice = voices[0]
    }

    utterance.onstart = () => {
      setIsSpeaking(true)
      setActivePhrase(phraseId)
    }
    utterance.onend = () => {
      setIsSpeaking(false)
      setActivePhrase(null)
    }
    utterance.onerror = () => {
      setIsSpeaking(false)
      setActivePhrase(null)
    }

    synthRef.current.speak(utterance)
  }, [settings, voices])

  // Stop
  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !synthRef.current) return
    synthRef.current.cancel()
    setIsSpeaking(false)
    setActivePhrase(null)
  }, [])

  return {
    voices,
    settings,
    updateSettings,
    speak,
    stop,
    isSpeaking,
    activePhrase,
  }
}
