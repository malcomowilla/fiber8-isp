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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9tYWxjMG0wd2lsbGEvZmliZXI4LWlzcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvbWFsYzBtMHdpbGxhL2ZpYmVyOC1pc3Avdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvbWFsYzBtMHdpbGxhL2ZpYmVyOC1pc3Avdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIlxuaW1wb3J0IE1pbGxpb25MaW50IGZyb20gXCJAbWlsbGlvbi9saW50XCI7XG5cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksXG4gICAgIE1pbGxpb25MaW50LnZpdGUoeyBhdXRvOiB0cnVlIH0pXG4gIF0sXG4gIHNlcnZlcjoge1xuICAgIFxuICAgIHByb3h5OiB7XG4gICAgICAnL2FwaSc6IHtcbiAgICAgICAgLy8gdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo0MDAwJyxcbiAgICAgICAgLy8gLy8gdGFyZ2V0OiAnaHR0cDovLzAuMC4wLjA6MzAwMCcsXG4gICAgICAgIC8vIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgLy8gcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKSxcblxuICAgICAgICBcbiAgICAgICAgdGFyZ2V0OiAocmVxKSA9PiB7XG4gICAgICAgICAgY29uc3QgaG9zdCA9IHJlcS5oZWFkZXJzLmhvc3Q7IFxuICAgICAgXG4gICAgICAgICAgaWYgKGhvc3QgPT09ICdhaXRlY2hzLmNvLmtlJyB8fCBob3N0LmVuZHNXaXRoKCcuYWl0ZWNocy5jby5rZScpKSB7XG4gICAgICAgICAgICByZXR1cm4gYGh0dHBzOi8vJHtob3N0fWA7IFxuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICBob3N0LmVuZHNXaXRoKCcub3dpdGVjaC5jby5rZScpIFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gJ2h0dHA6Ly8wLjAuMC4wOjMwMDAnOyBcbiAgICAgICAgfSxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpLFxuXG4gICAgICAgIFxuICAgICAgfVxuICAgIH1cblxuICAgIFxuXG4gIH0sXG5cblxuXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiAnZGlzdCcsIFxuICAgICAgICBzb3VyY2VtYXA6IGZhbHNlLFxuXG4gICAgYXNzZXRzRGlyOiAnYXNzZXRzJywgXG4gICAgZW1wdHlPdXREaXI6IHRydWUsIFxuICAgIGNvbW1vbmpzT3B0aW9uczoge1xuICAgICAgaW5jbHVkZTogWy9ub2RlX21vZHVsZXMvXSxcbiAgICAgIHRyYW5zZm9ybU1peGVkRXNNb2R1bGVzOiB0cnVlXG4gICAgfVxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbJ3JlYWN0LWxvdHRpZSddLFxuICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICB0YXJnZXQ6ICdlczIwMjAnXG4gICAgfVxuICB9LFxuICBiYXNlOiAnLycsXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgICBkZWZpbmU6IHtcbiAgICAgIFwicHJvY2Vzcy5lbnZcIjoge30sXG4gICAgfSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlRLFNBQVMsb0JBQW9CO0FBQ3RTLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsT0FBTyxpQkFBaUI7QUFIeEIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQUMsTUFBTTtBQUFBLElBQ2IsWUFBWSxLQUFLLEVBQUUsTUFBTSxLQUFLLENBQUM7QUFBQSxFQUNsQztBQUFBLEVBQ0EsUUFBUTtBQUFBLElBRU4sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFPTixRQUFRLENBQUMsUUFBUTtBQUNmLGdCQUFNLE9BQU8sSUFBSSxRQUFRO0FBRXpCLGNBQUksU0FBUyxtQkFBbUIsS0FBSyxTQUFTLGdCQUFnQixHQUFHO0FBQy9ELG1CQUFPLFdBQVcsSUFBSTtBQUFBLFVBQ3hCLE9BQUs7QUFDSixpQkFBSyxTQUFTLGdCQUFnQjtBQUFBLFVBQy9CO0FBQ0EsaUJBQU87QUFBQSxRQUNUO0FBQUEsUUFDQSxjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxVQUFVLEVBQUU7QUFBQSxNQUc5QztBQUFBLElBQ0Y7QUFBQSxFQUlGO0FBQUEsRUFJQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDSixXQUFXO0FBQUEsSUFFZixXQUFXO0FBQUEsSUFDWCxhQUFhO0FBQUEsSUFDYixpQkFBaUI7QUFBQSxNQUNmLFNBQVMsQ0FBQyxjQUFjO0FBQUEsTUFDeEIseUJBQXlCO0FBQUEsSUFDM0I7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsY0FBYztBQUFBLElBQ3hCLGdCQUFnQjtBQUFBLE1BQ2QsUUFBUTtBQUFBLElBQ1Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLGVBQWUsQ0FBQztBQUFBLElBQ2xCO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiXQp9Cg==
