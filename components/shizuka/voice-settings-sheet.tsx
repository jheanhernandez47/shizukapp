'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Settings, Play } from 'lucide-react'
import type { TtsSettings } from '@/hooks/use-tts'

interface VoiceSettingsSheetProps {
  voices: SpeechSynthesisVoice[]
  settings: TtsSettings
  onUpdateSettings: (partial: Partial<TtsSettings>) => void
  onTestVoice: () => void
}

export function VoiceSettingsSheet({ voices, settings, onUpdateSettings, onTestVoice }: VoiceSettingsSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary cursor-pointer">
          <Settings className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lg font-display">⚙️ Configuración de Voz</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 py-4">
          {/* Voice selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Voz</label>
            <select
              value={settings?.voiceURI ?? ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onUpdateSettings?.({ voiceURI: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-ring outline-none"
            >
              <option value="">Voz predeterminada</option>
              {(voices ?? []).map((v: SpeechSynthesisVoice, i: number) => (
                <option key={`${v?.voiceURI ?? ''}-${i}`} value={v?.voiceURI ?? ''}>
                  {v?.name ?? 'Sin nombre'} ({v?.lang ?? ''})
                </option>
              ))}
            </select>
          </div>

          {/* Rate slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="font-medium text-foreground">Velocidad</label>
              <span className="text-muted-foreground">{(settings?.rate ?? 1).toFixed?.(1) ?? '1.0'}x</span>
            </div>
            <Slider
              value={[settings?.rate ?? 1]}
              min={0.5}
              max={2}
              step={0.1}
              onValueChange={(val: number[]) => onUpdateSettings?.({ rate: val?.[0] ?? 1 })}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Lento</span>
              <span>Rápido</span>
            </div>
          </div>

          {/* Pitch slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="font-medium text-foreground">Tono</label>
              <span className="text-muted-foreground">{(settings?.pitch ?? 1).toFixed?.(1) ?? '1.0'}</span>
            </div>
            <Slider
              value={[settings?.pitch ?? 1]}
              min={0.5}
              max={2}
              step={0.1}
              onValueChange={(val: number[]) => onUpdateSettings?.({ pitch: val?.[0] ?? 1 })}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Grave</span>
              <span>Agudo</span>
            </div>
          </div>

          {/* Test button */}
          <Button
            onClick={() => onTestVoice?.()}
            className="w-full gap-2 cursor-pointer"
            variant="secondary"
          >
            <Play className="w-4 h-4" />
            Probar voz
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
