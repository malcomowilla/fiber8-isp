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
        // target: 'http://localhost:4000',
        // // target: 'http://0.0.0.0:3000',
        // changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
        target: (req) => {
          const host = req.headers.host;
          if (host === "aitechs.co.ke" || host.endsWith(".aitechs.co.ke")) {
            return `https://${host}`;
          } else {
            host.endsWith(".owitech.co.ke");
          }
          return "http://0.0.0.0:3000";
        },
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/api/, "")
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9tYWxjMG0wd2lsbGEvZmliZXI4LWlzcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvbWFsYzBtMHdpbGxhL2ZpYmVyOC1pc3Avdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvbWFsYzBtMHdpbGxhL2ZpYmVyOC1pc3Avdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIlxuaW1wb3J0IE1pbGxpb25MaW50IGZyb20gXCJAbWlsbGlvbi9saW50XCI7XG5cblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpLFxuICAgICBNaWxsaW9uTGludC52aXRlKHsgYXV0bzogdHJ1ZSB9KVxuICBdLFxuICBzZXJ2ZXI6IHtcbiAgICAvLyBob3N0OiAnMC4wLjAuMCcsXG4gICAgLy8gcG9ydDogMzAwMCxcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIC8vIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NDAwMCcsXG4gICAgICAgIC8vIC8vIHRhcmdldDogJ2h0dHA6Ly8wLjAuMC4wOjMwMDAnLFxuICAgICAgICAvLyBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIC8vIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXG5cbiAgICAgICAgXG4gICAgICAgIHRhcmdldDogKHJlcSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGhvc3QgPSByZXEuaGVhZGVycy5ob3N0OyAvLyBHZXQgdGhlIHJlcXVlc3QgaG9zdG5hbWVcbiAgICAgIFxuICAgICAgICAgIGlmIChob3N0ID09PSAnYWl0ZWNocy5jby5rZScgfHwgaG9zdC5lbmRzV2l0aCgnLmFpdGVjaHMuY28ua2UnKSkge1xuICAgICAgICAgICAgcmV0dXJuIGBodHRwczovLyR7aG9zdH1gOyAvLyBQcm94eSBkeW5hbWljYWxseSBiYXNlZCBvbiB0aGUgcmVxdWVzdCBkb21haW5cbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgaG9zdC5lbmRzV2l0aCgnLm93aXRlY2guY28ua2UnKSBcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICdodHRwOi8vMC4wLjAuMDozMDAwJzsgLy8gRGVmYXVsdCB0YXJnZXQgaWYgbm90IG1hdGNoaW5nXG4gICAgICAgIH0sXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKSxcblxuICAgICAgICBcbiAgICAgIH1cbiAgICB9XG5cbiAgICBcblxuXG4gICAgLy8gcHJveHk6IHtcbiAgICAvLyAgICcvYXBpJzoge1xuICAgIC8vICAgICAvLyB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC4xLjY5OjQwMDAnLFxuICAgIC8vICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgLy8gICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXG4gICAgLy8gICAgIGNvbmZpZ3VyZTogKHByb3h5KSA9PiB7XG4gICAgLy8gICAgICAgcHJveHkub24oJ3Byb3h5UmVxJywgKHByb3h5UmVxLCByZXEsIHJlcywgb3B0aW9ucykgPT4ge1xuICAgIC8vICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKCdYLU9yaWdpbmFsLUhvc3QnLCByZXEuaGVhZGVycy5ob3N0KTtcbiAgICAvLyAgICAgICB9KTtcbiAgICAvLyAgICAgfSxcbiAgICAvLyAgIH0sXG4gICAgXG4gICAgXG4gICAgLy8gfSxcbiAgfSxcblxuXG5cbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICdkaXN0JywgLy8gVGhpcyBpcyB0aGUgYnVpbGQgb3V0cHV0IGRpcmVjdG9yeVxuICAgICAgICBzb3VyY2VtYXA6IGZhbHNlLFxuXG4gICAgYXNzZXRzRGlyOiAnYXNzZXRzJywgLy8gRGlyZWN0b3J5IGZvciBhc3NldHMgaW5zaWRlIG91dERpclxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLCAvLyBFbXB0eSB0aGUgb3V0cHV0IGRpcmVjdG9yeSBiZWZvcmUgYnVpbGRpbmdcbiAgICBjb21tb25qc09wdGlvbnM6IHtcbiAgICAgIGluY2x1ZGU6IFsvbm9kZV9tb2R1bGVzL10sXG4gICAgICB0cmFuc2Zvcm1NaXhlZEVzTW9kdWxlczogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogWydyZWFjdC1sb3R0aWUnXSxcbiAgICBlc2J1aWxkT3B0aW9uczoge1xuICAgICAgdGFyZ2V0OiAnZXMyMDIwJ1xuICAgIH1cbiAgfSxcbiAgYmFzZTogJy8nLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gICAgZGVmaW5lOiB7XG4gICAgICBcInByb2Nlc3MuZW52XCI6IHt9LFxuICAgIH0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5USxTQUFTLG9CQUFvQjtBQUN0UyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8saUJBQWlCO0FBSHhCLElBQU0sbUNBQW1DO0FBT3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUFDLE1BQU07QUFBQSxJQUNiLFlBQVksS0FBSyxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBQUEsRUFDbEM7QUFBQSxFQUNBLFFBQVE7QUFBQTtBQUFBO0FBQUEsSUFHTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQU9OLFFBQVEsQ0FBQyxRQUFRO0FBQ2YsZ0JBQU0sT0FBTyxJQUFJLFFBQVE7QUFFekIsY0FBSSxTQUFTLG1CQUFtQixLQUFLLFNBQVMsZ0JBQWdCLEdBQUc7QUFDL0QsbUJBQU8sV0FBVyxJQUFJO0FBQUEsVUFDeEIsT0FBSztBQUNKLGlCQUFLLFNBQVMsZ0JBQWdCO0FBQUEsVUFDL0I7QUFDQSxpQkFBTztBQUFBLFFBQ1Q7QUFBQSxRQUNBLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQ0EsVUFBU0EsTUFBSyxRQUFRLFVBQVUsRUFBRTtBQUFBLE1BRzlDO0FBQUEsSUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBbUJGO0FBQUEsRUFJQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUE7QUFBQSxJQUNKLFdBQVc7QUFBQSxJQUVmLFdBQVc7QUFBQTtBQUFBLElBQ1gsYUFBYTtBQUFBO0FBQUEsSUFDYixpQkFBaUI7QUFBQSxNQUNmLFNBQVMsQ0FBQyxjQUFjO0FBQUEsTUFDeEIseUJBQXlCO0FBQUEsSUFDM0I7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsY0FBYztBQUFBLElBQ3hCLGdCQUFnQjtBQUFBLE1BQ2QsUUFBUTtBQUFBLElBQ1Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLGVBQWUsQ0FBQztBQUFBLElBQ2xCO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiXQp9Cg==
