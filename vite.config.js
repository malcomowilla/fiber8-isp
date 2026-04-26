import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import MillionLint from "@million/lint";



export default defineConfig({
  plugins: [react(),
     MillionLint.vite({ auto: true })
  ],
  server: {
    
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        // // target: 'http://0.0.0.0:3000',
        // changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),

        
        // target: (req) => {
        //   const host = req.headers.host; 
      
        //   if (host === 'aitechs.co.ke' || host.endsWith('.aitechs.co.ke')) {
        //     return `https://${host}`; 
        //   }else{
        //    host.endsWith('.owitech.co.ke') 
        //   }
        //   return 'http://0.0.0.0:3000'; 
        // },
        // changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),

        
      }
    }

    

  },



  build: {
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
