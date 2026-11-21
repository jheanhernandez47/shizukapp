export interface Phrase {
  id: string
  text: string
  category: string
  isDefault: boolean
}

export type CategoryKey = 'saludos' | 'sentimientos' | 'libros' | 'personal'

export const CATEGORIES: { key: CategoryKey; label: string; emoji: string; color: string }[] = [
  { key: 'saludos', label: 'Saludos', emoji: '👋', color: 'bg-pink-100 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800' },
  { key: 'sentimientos', label: 'Sentimientos', emoji: '💕', color: 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800' },
  { key: 'libros', label: 'Libros', emoji: '📖', color: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' },
  { key: 'personal', label: 'Personal', emoji: '🌸', color: 'bg-rose-100 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800' },
]

export const DEFAULT_PHRASES: Phrase[] = [
  // Saludos
  { id: 'd1', text: 'Hola...', category: 'saludos', isDefault: true },
  { id: 'd2', text: 'Buenos días.', category: 'saludos', isDefault: true },
  { id: 'd3', text: '¿Cómo estás?', category: 'saludos', isDefault: true },
  { id: 'd4', text: 'Mucho gusto.', category: 'saludos', isDefault: true },
  { id: 'd5', text: 'Hasta luego.', category: 'saludos', isDefault: true },
  // Sentimientos
  { id: 'd6', text: 'Eso me pone nerviosa...', category: 'sentimientos', isDefault: true },
  { id: 'd7', text: 'Me alegra estar aquí contigo.', category: 'sentimientos', isDefault: true },
  { id: 'd8', text: 'Me gustas mucho.', category: 'sentimientos', isDefault: true },
  { id: 'd9', text: 'Contigo me siento segura.', category: 'sentimientos', isDefault: true },
  { id: 'd10', text: 'Gracias por todo.', category: 'sentimientos', isDefault: true },
  // Libros
  { id: 'd11', text: '¿Te gusta leer?', category: 'libros', isDefault: true },
  { id: 'd12', text: 'Los libros son mis mejores amigos.', category: 'libros', isDefault: true },
  { id: 'd13', text: 'Hoy leí algo muy interesante.', category: 'libros', isDefault: true },
  { id: 'd14', text: '¿Me recomiendas un libro?', category: 'libros', isDefault: true },
  { id: 'd15', text: 'Las palabras son mi refugio.', category: 'libros', isDefault: true },
  // Personal
  { id: 'd16', text: 'Disculpa, ¿podrías repetirlo?', category: 'personal', isDefault: true },
  { id: 'd17', text: 'Estoy bien, solo soy tímida.', category: 'personal', isDefault: true },
  { id: 'd18', text: '¿Podemos hablar un momento?', category: 'personal', isDefault: true },
  { id: 'd19', text: 'Por favor, no me dejes sola.', category: 'personal', isDefault: true },
  { id: 'd20', text: 'No sé cómo decirlo, pero...', category: 'personal', isDefault: true },
]
