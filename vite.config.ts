import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/vue-pwa-timer/' : '/',
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Timer',
        short_name: 'Timer',
        description: 'A sleek timer application',
        theme_color: '#0d0d0d',
        background_color: '#0d0d0d',
        display: 'picture-in-picture' as any,
        id: '/vue-pwa-timer/',
        start_url: '/vue-pwa-timer/',
        scope: '/vue-pwa-timer/',
        icons: [
          {
            src: './favicon.ico',
            sizes: '32x32',
            type: 'image/x-icon'
          },
          {
            src: './pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: './pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        // Picture-in-picture for small widget window
        display_override: ['picture-in-picture' as any, 'window-controls-overlay', 'standalone'],
        // Window size preferences (Chrome/Edge specific)
        prefer_related_applications: false,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
