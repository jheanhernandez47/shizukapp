'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Square } from 'lucide-react'

interface StopFabProps {
  visible: boolean
  onStop: () => void
}

export function StopFab({ visible, onStop }: StopFabProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 0.9 }}
          onClick={onStop}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-destructive text-destructive-foreground shadow-lg flex items-center justify-center hover:brightness-110 transition-all cursor-pointer"
          aria-label="Detener voz"
        >
          <Square className="w-5 h-5 fill-current" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
