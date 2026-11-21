'use client'

import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'

interface PhraseButtonProps {
  text: string
  isActive: boolean
  categoryColor: string
  onPress: () => void
}

export function PhraseButton({ text, isActive, categoryColor, onPress }: PhraseButtonProps) {
  return (
    <motion.button
      onClick={onPress}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200
        ${categoryColor}
        ${isActive
          ? 'ring-2 ring-primary shadow-lg scale-[1.02]'
          : 'shadow-sm hover:shadow-md'
        }
        relative overflow-hidden group cursor-pointer`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors
          ${isActive ? 'bg-primary text-primary-foreground' : 'bg-white/60 dark:bg-white/10 text-muted-foreground group-hover:text-primary'}`}>
          <Volume2 className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium text-foreground leading-snug">
          {text ?? ''}
        </span>
      </div>
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-primary"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'linear' }}
        />
      )}
    </motion.button>
  )
}
