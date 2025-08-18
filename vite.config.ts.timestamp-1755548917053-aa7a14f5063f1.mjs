// vite.config.ts
import { defineConfig } from "file:///app/code/node_modules/vite/dist/node/index.js";
import react from "file:///app/code/node_modules/@vitejs/plugin-react/dist/index.js";
import tsconfigPaths from "file:///app/code/node_modules/vite-tsconfig-paths/dist/index.js";
import { resolve } from "path";
var __vite_injected_original_dirname = "/app/code";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    tsconfigPaths()
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__vite_injected_original_dirname, "index.html")
      }
    }
  },
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "./src"),
      "@ui": resolve(__vite_injected_original_dirname, "./src/components/ui"),
      "@lib": resolve(__vite_injected_original_dirname, "./src/lib"),
      "@components": resolve(__vite_injected_original_dirname, "./src/components"),
      "@hooks": resolve(__vite_injected_original_dirname, "./src/hooks"),
      "@utils": resolve(__vite_injected_original_dirname, "./src/utils"),
      "@types": resolve(__vite_injected_original_dirname, "./src/types"),
      "@pages": resolve(__vite_injected_original_dirname, "./src/pages"),
      "@store": resolve(__vite_injected_original_dirname, "./src/store"),
      "@contexts": resolve(__vite_injected_original_dirname, "./src/contexts"),
      "@services": resolve(__vite_injected_original_dirname, "./src/services"),
      "@constants": resolve(__vite_injected_original_dirname, "./src/constants"),
      "@validators": resolve(__vite_injected_original_dirname, "./src/validators")
    }
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3002",
        changeOrigin: true,
        secure: false
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwL2NvZGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9hcHAvY29kZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vYXBwL2NvZGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocydcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgdHNjb25maWdQYXRocygpLFxuICBdLFxuICBidWlsZDoge1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiB7XG4gICAgICAgIG1haW46IHJlc29sdmUoX19kaXJuYW1lLCAnaW5kZXguaHRtbCcpXG4gICAgICB9XG4gICAgfVxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgICAgJ0B1aSc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvY29tcG9uZW50cy91aScpLFxuICAgICAgJ0BsaWInOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2xpYicpLFxuICAgICAgJ0Bjb21wb25lbnRzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9jb21wb25lbnRzJyksXG4gICAgICAnQGhvb2tzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9ob29rcycpLFxuICAgICAgJ0B1dGlscyc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvdXRpbHMnKSxcbiAgICAgICdAdHlwZXMnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3R5cGVzJyksXG4gICAgICAnQHBhZ2VzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9wYWdlcycpLFxuICAgICAgJ0BzdG9yZSc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvc3RvcmUnKSxcbiAgICAgICdAY29udGV4dHMnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2NvbnRleHRzJyksXG4gICAgICAnQHNlcnZpY2VzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9zZXJ2aWNlcycpLFxuICAgICAgJ0Bjb25zdGFudHMnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2NvbnN0YW50cycpLFxuICAgICAgJ0B2YWxpZGF0b3JzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy92YWxpZGF0b3JzJyksXG4gICAgfSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogNTE3MyxcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMicsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZNLFNBQVMsb0JBQW9CO0FBQzFPLE9BQU8sV0FBVztBQUNsQixPQUFPLG1CQUFtQjtBQUMxQixTQUFTLGVBQWU7QUFIeEIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sY0FBYztBQUFBLEVBQ2hCO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxNQUFNLFFBQVEsa0NBQVcsWUFBWTtBQUFBLE1BQ3ZDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDL0IsT0FBTyxRQUFRLGtDQUFXLHFCQUFxQjtBQUFBLE1BQy9DLFFBQVEsUUFBUSxrQ0FBVyxXQUFXO0FBQUEsTUFDdEMsZUFBZSxRQUFRLGtDQUFXLGtCQUFrQjtBQUFBLE1BQ3BELFVBQVUsUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDMUMsVUFBVSxRQUFRLGtDQUFXLGFBQWE7QUFBQSxNQUMxQyxVQUFVLFFBQVEsa0NBQVcsYUFBYTtBQUFBLE1BQzFDLFVBQVUsUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDMUMsVUFBVSxRQUFRLGtDQUFXLGFBQWE7QUFBQSxNQUMxQyxhQUFhLFFBQVEsa0NBQVcsZ0JBQWdCO0FBQUEsTUFDaEQsYUFBYSxRQUFRLGtDQUFXLGdCQUFnQjtBQUFBLE1BQ2hELGNBQWMsUUFBUSxrQ0FBVyxpQkFBaUI7QUFBQSxNQUNsRCxlQUFlLFFBQVEsa0NBQVcsa0JBQWtCO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
