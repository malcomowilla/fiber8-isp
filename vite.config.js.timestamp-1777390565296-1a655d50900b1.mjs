// vite.config.js
import { defineConfig } from "file:///home/malc0m0willa/fiber8-isp/node_modules/vite/dist/node/index.js";
import react from "file:///home/malc0m0willa/fiber8-isp/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import MillionLint from "file:///home/malc0m0willa/fiber8-isp/node_modules/@million/lint/dist/compiler/index.mjs";
var __vite_injected_original_dirname = "/home/malc0m0willa/fiber8-isp";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    MillionLint.vite({ auto: true })
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000"
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
    outDir: "dist",
    sourcemap: false,
    assetsDir: "assets",
    emptyOutDir: true,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  optimizeDeps: {
    include: ["react-lottie"],
    esbuildOptions: {
      target: "es2020"
    }
  },
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    },
    define: {
      "process.env": {}
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9tYWxjMG0wd2lsbGEvZmliZXI4LWlzcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvbWFsYzBtMHdpbGxhL2ZpYmVyOC1pc3Avdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvbWFsYzBtMHdpbGxhL2ZpYmVyOC1pc3Avdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIlxuaW1wb3J0IE1pbGxpb25MaW50IGZyb20gXCJAbWlsbGlvbi9saW50XCI7XG5cblxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSxcbiAgICAgTWlsbGlvbkxpbnQudml0ZSh7IGF1dG86IHRydWUgfSlcbiAgXSxcbiAgc2VydmVyOiB7XG4gICAgXG4gICAgcHJveHk6IHtcbiAgICAgICcvYXBpJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjQwMDAnLFxuICAgICAgICAvLyAvLyB0YXJnZXQ6ICdodHRwOi8vMC4wLjAuMDozMDAwJyxcbiAgICAgICAgLy8gY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAvLyByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpLFxuXG4gICAgICAgIFxuICAgICAgICAvLyB0YXJnZXQ6IChyZXEpID0+IHtcbiAgICAgICAgLy8gICBjb25zdCBob3N0ID0gcmVxLmhlYWRlcnMuaG9zdDsgXG4gICAgICBcbiAgICAgICAgLy8gICBpZiAoaG9zdCA9PT0gJ2FpdGVjaHMuY28ua2UnIHx8IGhvc3QuZW5kc1dpdGgoJy5haXRlY2hzLmNvLmtlJykpIHtcbiAgICAgICAgLy8gICAgIHJldHVybiBgaHR0cHM6Ly8ke2hvc3R9YDsgXG4gICAgICAgIC8vICAgfWVsc2V7XG4gICAgICAgIC8vICAgIGhvc3QuZW5kc1dpdGgoJy5vd2l0ZWNoLmNvLmtlJykgXG4gICAgICAgIC8vICAgfVxuICAgICAgICAvLyAgIHJldHVybiAnaHR0cDovLzAuMC4wLjA6MzAwMCc7IFxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIC8vIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXG5cbiAgICAgICAgXG4gICAgICB9XG4gICAgfVxuXG4gICAgXG5cbiAgfSxcblxuXG5cbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICdkaXN0JywgXG4gICAgICAgIHNvdXJjZW1hcDogZmFsc2UsXG5cbiAgICBhc3NldHNEaXI6ICdhc3NldHMnLCBcbiAgICBlbXB0eU91dERpcjogdHJ1ZSwgXG4gICAgY29tbW9uanNPcHRpb25zOiB7XG4gICAgICBpbmNsdWRlOiBbL25vZGVfbW9kdWxlcy9dLFxuICAgICAgdHJhbnNmb3JtTWl4ZWRFc01vZHVsZXM6IHRydWVcbiAgICB9XG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFsncmVhY3QtbG90dGllJ10sXG4gICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgIHRhcmdldDogJ2VzMjAyMCdcbiAgICB9XG4gIH0sXG4gIGJhc2U6ICcvJyxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICAgIGRlZmluZToge1xuICAgICAgXCJwcm9jZXNzLmVudlwiOiB7fSxcbiAgICB9LFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVEsU0FBUyxvQkFBb0I7QUFDdFMsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixPQUFPLGlCQUFpQjtBQUh4QixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFBQyxNQUFNO0FBQUEsSUFDYixZQUFZLEtBQUssRUFBRSxNQUFNLEtBQUssQ0FBQztBQUFBLEVBQ2xDO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFFTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1Bb0JWO0FBQUEsSUFDRjtBQUFBLEVBSUY7QUFBQSxFQUlBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNKLFdBQVc7QUFBQSxJQUVmLFdBQVc7QUFBQSxJQUNYLGFBQWE7QUFBQSxJQUNiLGlCQUFpQjtBQUFBLE1BQ2YsU0FBUyxDQUFDLGNBQWM7QUFBQSxNQUN4Qix5QkFBeUI7QUFBQSxJQUMzQjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxjQUFjO0FBQUEsSUFDeEIsZ0JBQWdCO0FBQUEsTUFDZCxRQUFRO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sZUFBZSxDQUFDO0FBQUEsSUFDbEI7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
