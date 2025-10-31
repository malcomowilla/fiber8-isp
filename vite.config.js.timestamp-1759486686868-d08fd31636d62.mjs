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
    // host: '0.0.0.0',
    // port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:4000"
        // target: 'https://fiber8.aitechs.co.ke',
        // // target: 'http://0.0.0.0:3000',
        // changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
        // target: (req) => {
        //   const host = req.headers.host; // Get the request hostname
        //   if (host === 'aitechs.co.ke' || host.endsWith('.aitechs.co.ke')) {
        //     return `https://${host}`; // Proxy dynamically based on the request domain
        //   }
        //   return 'http://0.0.0.0:3000'; // Default target if not matching
        // },
        // changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
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
    outDir: "dist",
    // This is the build output directory
    sourcemap: false,
    assetsDir: "assets",
    // Directory for assets inside outDir
    emptyOutDir: true,
    // Empty the output directory before building
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9tYWxjMG0wd2lsbGEvZmliZXI4LWlzcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvbWFsYzBtMHdpbGxhL2ZpYmVyOC1pc3Avdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvbWFsYzBtMHdpbGxhL2ZpYmVyOC1pc3Avdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIlxuaW1wb3J0IE1pbGxpb25MaW50IGZyb20gXCJAbWlsbGlvbi9saW50XCI7XG5cblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpLFxuICAgICBNaWxsaW9uTGludC52aXRlKHsgYXV0bzogdHJ1ZSB9KVxuICBdLFxuICBzZXJ2ZXI6IHtcbiAgICAvLyBob3N0OiAnMC4wLjAuMCcsXG4gICAgLy8gcG9ydDogMzAwMCxcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NDAwMCcsXG4gICAgICAgIC8vIHRhcmdldDogJ2h0dHBzOi8vZmliZXI4LmFpdGVjaHMuY28ua2UnLFxuICAgICAgICAvLyAvLyB0YXJnZXQ6ICdodHRwOi8vMC4wLjAuMDozMDAwJyxcbiAgICAgICAgLy8gY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAvLyByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpLFxuXG4gICAgICAgIFxuICAgICAgICAvLyB0YXJnZXQ6IChyZXEpID0+IHtcbiAgICAgICAgLy8gICBjb25zdCBob3N0ID0gcmVxLmhlYWRlcnMuaG9zdDsgLy8gR2V0IHRoZSByZXF1ZXN0IGhvc3RuYW1lXG4gICAgICBcbiAgICAgICAgLy8gICBpZiAoaG9zdCA9PT0gJ2FpdGVjaHMuY28ua2UnIHx8IGhvc3QuZW5kc1dpdGgoJy5haXRlY2hzLmNvLmtlJykpIHtcbiAgICAgICAgLy8gICAgIHJldHVybiBgaHR0cHM6Ly8ke2hvc3R9YDsgLy8gUHJveHkgZHluYW1pY2FsbHkgYmFzZWQgb24gdGhlIHJlcXVlc3QgZG9tYWluXG4gICAgICAgIC8vICAgfVxuICAgICAgICAvLyAgIHJldHVybiAnaHR0cDovLzAuMC4wLjA6MzAwMCc7IC8vIERlZmF1bHQgdGFyZ2V0IGlmIG5vdCBtYXRjaGluZ1xuICAgICAgICAvLyB9LFxuICAgICAgICAvLyBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIC8vIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXG5cbiAgICAgICAgXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICBcblxuXG4gICAgLy8gcHJveHk6IHtcbiAgICAvLyAgICcvYXBpJzoge1xuICAgIC8vICAgICAvLyB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC4xLjY5OjQwMDAnLFxuICAgIC8vICAgICB0YXJnZXQ6ICdodHRwczovL2ZpYmVyOC5haXRlY2hzLmNvLmtlJyxcbiAgICAvLyAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgIC8vICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpLFxuICAgIC8vICAgICBjb25maWd1cmU6IChwcm94eSkgPT4ge1xuICAgIC8vICAgICAgIHByb3h5Lm9uKCdwcm94eVJlcScsIChwcm94eVJlcSwgcmVxLCByZXMsIG9wdGlvbnMpID0+IHtcbiAgICAvLyAgICAgICAgIHByb3h5UmVxLnNldEhlYWRlcignWC1PcmlnaW5hbC1Ib3N0JywgcmVxLmhlYWRlcnMuaG9zdCk7XG4gICAgLy8gICAgICAgfSk7XG4gICAgLy8gICAgIH0sXG4gICAgLy8gICB9LFxuICAgIFxuICAgIFxuICAgIC8vIH0sXG4gIH0sXG5cblxuXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiAnZGlzdCcsIC8vIFRoaXMgaXMgdGhlIGJ1aWxkIG91dHB1dCBkaXJlY3RvcnlcbiAgICAgICAgc291cmNlbWFwOiBmYWxzZSxcblxuICAgIGFzc2V0c0RpcjogJ2Fzc2V0cycsIC8vIERpcmVjdG9yeSBmb3IgYXNzZXRzIGluc2lkZSBvdXREaXJcbiAgICBlbXB0eU91dERpcjogdHJ1ZSwgLy8gRW1wdHkgdGhlIG91dHB1dCBkaXJlY3RvcnkgYmVmb3JlIGJ1aWxkaW5nXG4gICAgY29tbW9uanNPcHRpb25zOiB7XG4gICAgICBpbmNsdWRlOiBbL25vZGVfbW9kdWxlcy9dLFxuICAgICAgdHJhbnNmb3JtTWl4ZWRFc01vZHVsZXM6IHRydWVcbiAgICB9XG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFsncmVhY3QtbG90dGllJ10sXG4gICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgIHRhcmdldDogJ2VzMjAyMCdcbiAgICB9XG4gIH0sXG4gIGJhc2U6ICcvJyxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICAgIGRlZmluZToge1xuICAgICAgXCJwcm9jZXNzLmVudlwiOiB7fSxcbiAgICB9LFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVEsU0FBUyxvQkFBb0I7QUFDdFMsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixPQUFPLGlCQUFpQjtBQUh4QixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFBQyxNQUFNO0FBQUEsSUFDYixZQUFZLEtBQUssRUFBRSxNQUFNLEtBQUssQ0FBQztBQUFBLEVBQ2xDO0FBQUEsRUFDQSxRQUFRO0FBQUE7QUFBQTtBQUFBLElBR04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFtQlY7QUFBQSxJQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQW9CRjtBQUFBLEVBSUEsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBO0FBQUEsSUFDSixXQUFXO0FBQUEsSUFFZixXQUFXO0FBQUE7QUFBQSxJQUNYLGFBQWE7QUFBQTtBQUFBLElBQ2IsaUJBQWlCO0FBQUEsTUFDZixTQUFTLENBQUMsY0FBYztBQUFBLE1BQ3hCLHlCQUF5QjtBQUFBLElBQzNCO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGNBQWM7QUFBQSxJQUN4QixnQkFBZ0I7QUFBQSxNQUNkLFFBQVE7QUFBQSxJQUNWO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTTtBQUFBLEVBQ04sU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixlQUFlLENBQUM7QUFBQSxJQUNsQjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
