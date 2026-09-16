import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
// import MillionLint from "@million/lint";

import million from 'million/compiler'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [react(),
    //  MillionLint.vite({ auto: true })
    VitePWA({
       registerType: 'autoUpdate',
       devOptions: {
        enabled: true
      },
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
       injectManifest: {
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
      },

      
      manifest: {
        name: 'Owitech Isp',
        short_name: 'Owitech',
        description: 'Owitech is a simple ISP billing and network management system for internet service providers.',

        theme_color: '#38bdf8',
        start_url: '/',
        background_color: '#1e293b',
        orientation: 'portrait',


        icons: [
    {
      "src": "pwa-64x64.png",
      "sizes": "64x64",
      "type": "image/png"
    },
    {
      "src": "pwa-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "pwa-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "maskable-icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
      }

      
      }),
        million.vite({ auto: true })
  ],
  server: {
    
    proxy: {
      '/api': {
        // target: 'http://localhost:4000',
        // // // target: 'http://0.0.0.0:3000',
        // changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),

        
        target: (req) => {
          const host = req.headers.host; 
      
          if (host === 'aitechs.co.ke' || host.endsWith('.aitechs.co.ke')) {
            return `https://${host}`; 
          }else{
           host.endsWith('.owitech.co.ke') 
          }
          return 'http://0.0.0.0:3000'; 
        },
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),

        
      }
    }

    

  },



  build: {
     cssCodeSplit: true,
    minify: "esbuild",
    chunkSizeWarningLimit: 1000,


    outDir: 'dist', 
        sourcemap: false,

    assetsDir: 'assets', 
    emptyOutDir: true, 
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  optimizeDeps: {
    include: ['react-lottie'],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  base: '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    define: {
      "process.env": {},
    },
  },
})
