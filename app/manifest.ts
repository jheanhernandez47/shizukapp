import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Voz de Shizuka',
    short_name: 'Shizuka',
    description: 'App de texto a voz inspirada en Shizuka — comunícate con frases predefinidas',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF0F5',
    theme_color: '#E891B2',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
