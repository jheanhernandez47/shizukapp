'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Pencil, RotateCcw, Check, X } from 'lucide-react'
import { CATEGORIES, Phrase, CategoryKey } from '@/lib/phrases'
import { toast } from 'sonner'

interface ManagePhrasesSheetProps {
  phrases: Phrase[]
  onAdd: (text: string, category: string) => void
  onEdit: (id: string, text: string, category: string) => void
  onDelete: (id: string) => void
  onReset: () => void
}

export function ManagePhrasesSheet({ phrases, onAdd, onEdit, onDelete, onReset }: ManagePhrasesSheetProps) {
  const [newText, setNewText] = useState('')
  const [newCategory, setNewCategory] = useState<CategoryKey>('saludos')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [editCategory, setEditCategory] = useState<CategoryKey>('saludos')

  const handleAdd = () => {
    const trimmed = newText?.trim?.() ?? ''
    if (!trimmed) {
      toast.error('Escribe una frase primero')
      return
    }
    onAdd?.(trimmed, newCategory)
    setNewText('')
    toast.success('Frase agregada ✨')
  }

  const startEdit = (phrase: Phrase) => {
    setEditingId(phrase?.id ?? null)
    setEditText(phrase?.text ?? '')
    setEditCategory((phrase?.category as CategoryKey) ?? 'saludos')
  }

  const confirmEdit = () => {
    if (!editingId) return
    const trimmed = editText?.trim?.() ?? ''
    if (!trimmed) {
      toast.error('La frase no puede estar vacía')
      return
    }
    onEdit?.(editingId, trimmed, editCategory)
    setEditingId(null)
    toast.success('Frase actualizada')
  }

  const handleDelete = (id: string) => {
    onDelete?.(id)
    toast.success('Frase eliminada')
  }

  const handleReset = () => {
    onReset?.()
    toast.success('Frases restauradas a las originales')
  }

  const userPhrases = (phrases ?? []).filter((p: Phrase) => !p?.isDefault)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary cursor-pointer">
          <Plus className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lg font-display">✏️ Gestionar Frases</SheetTitle>
        </SheetHeader>
        <div className="space-y-5 py-4">
          {/* Add new phrase */}
          <div className="space-y-3 p-3 bg-muted/50 rounded-xl">
            <p className="text-sm font-medium text-foreground">Agregar nueva frase</p>
            <Input
              value={newText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewText(e.target.value)}
              placeholder="Escribe tu frase..."
              className="text-sm"
              onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') handleAdd() }}
            />
            <div className="flex gap-2">
              <select
                value={newCategory}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewCategory(e.target.value as CategoryKey)}
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                {CATEGORIES.map((c: { key: CategoryKey; label: string; emoji: string }) => (
                  <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>
                ))}
              </select>
              <Button onClick={handleAdd} size="sm" className="gap-1 cursor-pointer">
                <Plus className="w-4 h-4" /> Agregar
              </Button>
            </div>
          </div>

          {/* User phrases list */}
          {(userPhrases?.length ?? 0) > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Tus frases personalizadas</p>
              {userPhrases.map((p: Phrase) => (
                <div key={p?.id ?? ''} className="flex items-center gap-2 p-2 bg-card rounded-lg border border-border">
                  {editingId === p?.id ? (
                    <>
                      <Input
                        value={editText}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditText(e.target.value)}
                        className="flex-1 text-sm h-8"
                      />
                      <select
                        value={editCategory}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditCategory(e.target.value as CategoryKey)}
                        className="rounded border border-input bg-background px-2 py-1 text-xs"
                      >
                        {CATEGORIES.map((c: { key: CategoryKey; label: string; emoji: string }) => (
                          <option key={c.key} value={c.key}>{c.emoji}</option>
                        ))}
                      </select>
                      <Button size="icon" variant="ghost" onClick={confirmEdit} className="h-8 w-8 text-green-600 cursor-pointer">
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="h-8 w-8 cursor-pointer">
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm text-foreground truncate">{p?.text ?? ''}</span>
                      <Button size="icon" variant="ghost" onClick={() => startEdit(p)} className="h-8 w-8 text-muted-foreground cursor-pointer">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(p?.id ?? '')} className="h-8 w-8 text-destructive cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Reset button */}
          <Button variant="outline" onClick={handleReset} className="w-full gap-2 text-muted-foreground cursor-pointer">
            <RotateCcw className="w-4 h-4" /> Restaurar frases originales
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
