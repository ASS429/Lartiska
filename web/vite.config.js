import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // SW custom (src/sw.js) : précache Workbox + cache runtime
      // photos/vidéos R2 + handlers de notifications push.
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      injectManifest: {
        // Précache : uniquement l'app shell (JS/CSS/HTML/fonts/icônes).
        // Les vidéos et grandes images passent par le cache runtime.
        globPatterns: ['**/*.{js,css,html,svg,woff2,ico}', 'icons/*.png'],
        globIgnores: ['**/*.mp4', 'img/**', 'videos/**'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      },
      manifest: {
        name: 'Lartiska — Finition & décoration d\'art',
        short_name: 'Lartiska',
        description: 'Peinture, carrelage, plafonnage, menuiserie, aluminium, étanchéité et décoration d\'art au Sénégal. Portfolio et devis gratuit.',
        lang: 'fr',
        start_url: '/',
        display: 'standalone',
        background_color: '#07060A',
        theme_color: '#07060A',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/storage': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
