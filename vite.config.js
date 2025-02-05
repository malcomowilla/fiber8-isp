import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // host: '0.0.0.0',
    // port: 3000,
    proxy: {
      '/api': {
        // target: 'https://38d6-102-221-35-116.ngrok-free.app',
        target: 'http://localhost:4000',
        // target: 'https://fiber8.aitechs.co.ke',
        // // target: 'http://0.0.0.0:3000',
        // changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),



        // target: (req) => {
        //   const host = req.headers.host; // Get the request hostname
      
        //   // Check if the host is "aitechs.co.ke" or any subdomain of it
        //   if (host === 'aitechs.co.ke' || host.endsWith('.aitechs.co.ke')) {
        //     return `https://${host}`; // Proxy dynamically based on the request domain
        //   }
        //   return 'http://0.0.0.0:3000'; // Default target if not matching
        // },
        // changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),

        
      },
    },

    

    // server: {
    //   host: '0.0.0.0',

    // },
    

    // proxy: {
    //   '/api': {
    //     // target: 'http://192.168.1.69:4000',
    //     target: 'https://fiber8.aitechs.co.ke',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //     configure: (proxy) => {
    //       proxy.on('proxyReq', (proxyReq, req, res, options) => {
    //         proxyReq.setHeader('X-Original-Host', req.headers.host);
    //       });
    //     },
    //   },
    
    
    // },
  },



  build: {
    outDir: 'dist', // This is the build output directory
    assetsDir: 'assets', // Directory for assets inside outDir
    emptyOutDir: true, // Empty the output directory before building
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
