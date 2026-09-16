import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// import MillionLint from "@million/lint";

import million from 'million/compiler'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    //  MillionLint.vite({ auto: true })
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      injectRegister: null, // we register manually in main.jsx
      devOptions: {
        enabled: true,
        type: 'module', // required for injectManifest in dev
        navigateFallback: 'index.html',
      },
      injectManifest: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
      },
      manifest: {
        id: '/',
        name: 'Owitech Isp',
        short_name: 'Owitech',
        description:
          'Owitech is a simple ISP billing and network management system for internet service providers.',

        display: 'standalone', // REQUIRED — without this no install prompt fires
        display_override: ['standalone', 'minimal-ui'],
        scope: '/',
        start_url: '/',
        orientation: 'portrait',

        theme_color: '#38bdf8',
        background_color: '#1e293b',

        icons: [
          {
            src: '/images/pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: '/images/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/images/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/images/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
    million.vite({ auto: true }),
  ],
  server: {
    proxy: {
      '/api': {
        target: (req) => {
          const host = req.headers.host || ''

          if (host === 'aitechs.co.ke' || host.endsWith('.aitechs.co.ke')) {
            return `https://${host}`
          }

          if (host.endsWith('.owitech.co.ke')) {
            return `https://${host}`
          }

          return 'http://0.0.0.0:3000'
        },
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    cssCodeSplit: true,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    outDir: 'dist',
    sourcemap: false,
    assetsDir: 'assets',
    emptyOutDir: true,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: ['react-lottie'],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': {},
  },
})