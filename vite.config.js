import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firebasestorage\.googleapis\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'firebase-images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icons/*.png'],
      manifest: {
        name: 'BeerTaste - Beer Reviews & Ratings',
        short_name: 'BeerTaste',
        description: 'Rate, review and discover amazing beers',
        theme_color: '#FF6B35',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        categories: ['food', 'lifestyle', 'social'],
        shortcuts: [
          {
            name: 'Add Review',
            short_name: 'Add Review',
            description: 'Add a new beer review',
            url: '/add-review',
            icons: [{ src: 'icons/icon-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'My Reviews',
            short_name: 'My Reviews',
            description: 'View your beer reviews',
            url: '/my-reviews',
            icons: [{ src: 'icons/icon-192x192.png', sizes: '192x192' }]
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    host: true
  }
})
