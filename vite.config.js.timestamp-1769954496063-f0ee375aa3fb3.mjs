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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9tYWxjMG0wd2lsbGEvZmliZXI4LWlzcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvbWFsYzBtMHdpbGxhL2ZpYmVyOC1pc3Avdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvbWFsYzBtMHdpbGxhL2ZpYmVyOC1pc3Avdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIlxuaW1wb3J0IE1pbGxpb25MaW50IGZyb20gXCJAbWlsbGlvbi9saW50XCI7XG5cblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpLFxuICAgICBNaWxsaW9uTGludC52aXRlKHsgYXV0bzogdHJ1ZSB9KVxuICBdLFxuICBzZXJ2ZXI6IHtcbiAgICAvLyBob3N0OiAnMC4wLjAuMCcsXG4gICAgLy8gcG9ydDogMzAwMCxcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NDAwMCcsXG4gICAgICAgIC8vIC8vIHRhcmdldDogJ2h0dHA6Ly8wLjAuMC4wOjMwMDAnLFxuICAgICAgICAvLyBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIC8vIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXG5cbiAgICAgICAgXG4gICAgICAgIC8vIHRhcmdldDogKHJlcSkgPT4ge1xuICAgICAgICAvLyAgIGNvbnN0IGhvc3QgPSByZXEuaGVhZGVycy5ob3N0OyAvLyBHZXQgdGhlIHJlcXVlc3QgaG9zdG5hbWVcbiAgICAgIFxuICAgICAgICAvLyAgIGlmIChob3N0ID09PSAnYWl0ZWNocy5jby5rZScgfHwgaG9zdC5lbmRzV2l0aCgnLmFpdGVjaHMuY28ua2UnKSkge1xuICAgICAgICAvLyAgICAgcmV0dXJuIGBodHRwczovLyR7aG9zdH1gOyAvLyBQcm94eSBkeW5hbWljYWxseSBiYXNlZCBvbiB0aGUgcmVxdWVzdCBkb21haW5cbiAgICAgICAgLy8gICB9XG4gICAgICAgIC8vICAgcmV0dXJuICdodHRwOi8vMC4wLjAuMDozMDAwJzsgLy8gRGVmYXVsdCB0YXJnZXQgaWYgbm90IG1hdGNoaW5nXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgLy8gcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKSxcblxuICAgICAgICBcbiAgICAgIH0sXG4gICAgfSxcblxuICAgIFxuXG5cbiAgICAvLyBwcm94eToge1xuICAgIC8vICAgJy9hcGknOiB7XG4gICAgLy8gICAgIC8vIHRhcmdldDogJ2h0dHA6Ly8xOTIuMTY4LjEuNjk6NDAwMCcsXG4gICAgLy8gICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAvLyAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKSxcbiAgICAvLyAgICAgY29uZmlndXJlOiAocHJveHkpID0+IHtcbiAgICAvLyAgICAgICBwcm94eS5vbigncHJveHlSZXEnLCAocHJveHlSZXEsIHJlcSwgcmVzLCBvcHRpb25zKSA9PiB7XG4gICAgLy8gICAgICAgICBwcm94eVJlcS5zZXRIZWFkZXIoJ1gtT3JpZ2luYWwtSG9zdCcsIHJlcS5oZWFkZXJzLmhvc3QpO1xuICAgIC8vICAgICAgIH0pO1xuICAgIC8vICAgICB9LFxuICAgIC8vICAgfSxcbiAgICBcbiAgICBcbiAgICAvLyB9LFxuICB9LFxuXG5cblxuICBidWlsZDoge1xuICAgIG91dERpcjogJ2Rpc3QnLCAvLyBUaGlzIGlzIHRoZSBidWlsZCBvdXRwdXQgZGlyZWN0b3J5XG4gICAgICAgIHNvdXJjZW1hcDogZmFsc2UsXG5cbiAgICBhc3NldHNEaXI6ICdhc3NldHMnLCAvLyBEaXJlY3RvcnkgZm9yIGFzc2V0cyBpbnNpZGUgb3V0RGlyXG4gICAgZW1wdHlPdXREaXI6IHRydWUsIC8vIEVtcHR5IHRoZSBvdXRwdXQgZGlyZWN0b3J5IGJlZm9yZSBidWlsZGluZ1xuICAgIGNvbW1vbmpzT3B0aW9uczoge1xuICAgICAgaW5jbHVkZTogWy9ub2RlX21vZHVsZXMvXSxcbiAgICAgIHRyYW5zZm9ybU1peGVkRXNNb2R1bGVzOiB0cnVlXG4gICAgfVxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbJ3JlYWN0LWxvdHRpZSddLFxuICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICB0YXJnZXQ6ICdlczIwMjAnXG4gICAgfVxuICB9LFxuICBiYXNlOiAnLycsXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgICBkZWZpbmU6IHtcbiAgICAgIFwicHJvY2Vzcy5lbnZcIjoge30sXG4gICAgfSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlRLFNBQVMsb0JBQW9CO0FBQ3RTLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsT0FBTyxpQkFBaUI7QUFIeEIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQUMsTUFBTTtBQUFBLElBQ2IsWUFBWSxLQUFLLEVBQUUsTUFBTSxLQUFLLENBQUM7QUFBQSxFQUNsQztBQUFBLEVBQ0EsUUFBUTtBQUFBO0FBQUE7QUFBQSxJQUdOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQWtCVjtBQUFBLElBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQW1CRjtBQUFBLEVBSUEsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBO0FBQUEsSUFDSixXQUFXO0FBQUEsSUFFZixXQUFXO0FBQUE7QUFBQSxJQUNYLGFBQWE7QUFBQTtBQUFBLElBQ2IsaUJBQWlCO0FBQUEsTUFDZixTQUFTLENBQUMsY0FBYztBQUFBLE1BQ3hCLHlCQUF5QjtBQUFBLElBQzNCO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGNBQWM7QUFBQSxJQUN4QixnQkFBZ0I7QUFBQSxNQUNkLFFBQVE7QUFBQSxJQUNWO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTTtBQUFBLEVBQ04sU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixlQUFlLENBQUM7QUFBQSxJQUNsQjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
