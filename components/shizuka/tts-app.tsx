'use client'

import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { CATEGORIES, CategoryKey } from '@/lib/phrases'
import { useTts } from '@/hooks/use-tts'
import { usePhrases } from '@/hooks/use-phrases'
import { PhraseButton } from './phrase-button'
import { StopFab } from './stop-fab'
import { VoiceSettingsSheet } from './voice-settings-sheet'
import { ManagePhrasesSheet } from './manage-phrases-sheet'
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate'

export function ShizukaTtsApp() {
  const [activeTab, setActiveTab] = useState<CategoryKey>('saludos')
  const { voices, settings, updateSettings, speak, stop, isSpeaking, activePhrase } = useTts()
  const { phrases, addPhrase, editPhrase, deletePhrase, resetToDefaults, getByCategory } = usePhrases()

  const handleTestVoice = () => {
    speak('Hola, soy Shizuka. Me gusta mucho leer.', 'test')
  }

  return (
    <div className="shizuka-bg min-h-screen pb-24">
      {/* Header */}
      <FadeIn>
        <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-border/50">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-base font-display font-bold tracking-tight text-foreground">Voz de Shizuka</h1>
                <p className="text-[10px] text-muted-foreground leading-none">Comunicación con frases 📖</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <VoiceSettingsSheet
                voices={voices}
                settings={settings}
                onUpdateSettings={updateSettings}
                onTestVoice={handleTestVoice}
              />
              <ManagePhrasesSheet
                phrases={phrases}
                onAdd={addPhrase}
                onEdit={editPhrase}
                onDelete={deletePhrase}
                onReset={resetToDefaults}
              />
            </div>
          </div>
        </header>
      </FadeIn>

      {/* Main content */}
      <main className="max-w-lg mx-auto px-4 pt-4">
        <FadeIn delay={0.1}>
          <p className="text-center text-sm text-muted-foreground mb-4">
            Pulsa una frase para que se lea en voz alta 🎀
          </p>
        </FadeIn>

        <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as CategoryKey)}>
          <FadeIn delay={0.15}>
            <TabsList className="w-full grid grid-cols-4 h-auto p-1 bg-white/60 dark:bg-white/5 rounded-xl border border-border/50">
              {CATEGORIES.map((cat: { key: CategoryKey; label: string; emoji: string }) => (
                <TabsTrigger
                  key={cat.key}
                  value={cat.key}
                  className="flex flex-col items-center gap-0.5 py-2 text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg cursor-pointer"
                >
                  <span className="text-base">{cat.emoji}</span>
                  <span className="font-medium">{cat.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </FadeIn>

          {CATEGORIES.map((cat: { key: CategoryKey; label: string; emoji: string; color: string }) => (
            <TabsContent key={cat.key} value={cat.key} className="mt-4">
              <Stagger staggerDelay={0.06}>
                <div className="space-y-2.5">
                  {getByCategory(cat.key).map((phrase: { id: string; text: string }) => (
                    <StaggerItem key={phrase?.id ?? ''}>
                      <PhraseButton
                        text={phrase?.text ?? ''}
                        isActive={activePhrase === phrase?.id}
                        categoryColor={cat.color}
                        onPress={() => speak(phrase?.text ?? '', phrase?.id ?? '')}
                      />
                    </StaggerItem>
                  ))}
                  {(getByCategory(cat.key)?.length ?? 0) === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      <p>No hay frases en esta categoría.</p>
                      <p className="text-xs mt-1">Pulsa + para agregar una.</p>
                    </div>
                  )}
                </div>
              </Stagger>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Stop FAB */}
      <StopFab visible={isSpeaking} onStop={stop} />
    </div>
  )
}
