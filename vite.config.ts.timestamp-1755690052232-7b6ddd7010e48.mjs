// vite.config.ts
import react from "file:///app/code/node_modules/@vitejs/plugin-react/dist/index.js";
import { resolve } from "path";
import { visualizer } from "file:///app/code/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { defineConfig } from "file:///app/code/node_modules/vite/dist/node/index.js";
import compression from "file:///app/code/node_modules/vite-plugin-compression/dist/index.mjs";
import tsconfigPaths from "file:///app/code/node_modules/vite-tsconfig-paths/dist/index.js";
var __vite_injected_original_dirname = "/app/code";
var vite_config_default = defineConfig({
  plugins: [
    react({
      // React optimizations
      babel: {
        plugins: [
          // Remove console.log in production
          process.env.NODE_ENV === "production" && "babel-plugin-transform-remove-console"
        ].filter(Boolean)
      },
      // Fast Refresh is enabled by default
      // Include JSX runtime for better HMR
      jsxRuntime: "automatic",
      // Exclude node_modules from transformation for faster builds
      exclude: /node_modules/,
      // Include only necessary files
      include: ["**/*.tsx", "**/*.ts", "**/*.jsx", "**/*.js"]
    }),
    tsconfigPaths(),
    // Bundle analyzer
    visualizer({
      filename: "dist/stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true
    }),
    // Compression
    compression({
      algorithm: "gzip",
      ext: ".gz"
    }),
    compression({
      algorithm: "brotliCompress",
      ext: ".br"
    })
  ],
  esbuild: {
    target: "es2015",
    sourcemap: false
  },
  build: {
    // Target modern browsers for better optimization
    target: "esnext",
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1e3,
    // Enable minification
    minify: "terser",
    // Completely disable source maps in build
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug", "console.trace"]
      },
      mangle: {
        safari10: true
      }
    },
    rollupOptions: {
      input: {
        main: resolve(__vite_injected_original_dirname, "index.html")
      },
      output: {
        // Enhanced manual chunk splitting for optimal caching
        manualChunks: (id) => {
          if (id.includes("react") || id.includes("react-dom")) {
            return "react-core";
          }
          if (id.includes("react-router")) {
            return "router";
          }
          if (id.includes("@radix-ui") || id.includes("lucide-react")) {
            return "ui-components";
          }
          if (id.includes("@tanstack/react-query") || id.includes("zustand")) {
            return "data-management";
          }
          if (id.includes("react-hook-form") || id.includes("@hookform/resolvers") || id.includes("zod")) {
            return "form-handling";
          }
          if (id.includes("recharts") || id.includes("framer-motion")) {
            return "visualization";
          }
          if (id.includes("date-fns") || id.includes("clsx") || id.includes("tailwind-merge")) {
            return "utils";
          }
          if (id.includes("@supabase") || id.includes("axios")) {
            return "backend-services";
          }
          if (id.includes("tesseract") || id.includes("leaflet") || id.includes("jspdf")) {
            return "heavy-libs";
          }
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
        // Optimize chunk file names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split("/").pop().replace(/\.[^.]*$/, "") : "chunk";
          return `js/${facadeModuleId}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `img/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
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
    host: true,
    strictPort: true,
    // API proxy disabled - backend not running
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3001',
    //     changeOrigin: true,
    //     secure: false,
    //     timeout: 30000,
    //     proxyTimeout: 30000,
    //   },
    // },
    // Hot Module Replacement - simplified for stability
    hmr: true,
    // File watching optimizations for Cursor
    watch: {
      usePolling: false,
      interval: 100,
      binaryInterval: 500,
      ignored: [
        "**/node_modules/**",
        "**/.git/**",
        "**/dist/**",
        "**/coverage/**",
        "**/.nyc_output/**",
        "**/.vscode/**",
        "**/.idea/**",
        "**/tmp/**",
        "**/temp/**",
        "**/*.backup",
        "**/scripts/**",
        "**/docs/**",
        "**/e2e/**",
        "**/migrations/**"
      ],
      // Use native file system events for better performance
      useFsEvents: true,
      depth: 50
    },
    // Faster startup for Cursor
    warmup: {
      clientFiles: [
        "./src/main.tsx",
        "./src/App.tsx",
        "./src/components/ui/**/*.tsx",
        "./src/pages/**/*.tsx",
        "./src/hooks/**/*.ts"
      ]
    },
    // Cursor için özel ayarlar
    cors: true,
    // Fix MIME type issues
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    },
    // Custom middleware for CSS MIME type fixes
    middlewareMode: false
  },
  // Optimize dependencies for stability
  optimizeDeps: {
    include: [
      "react",
      "react-dom"
    ]
  },
  // CSS optimization - completely disable source maps and fix MIME issues
  css: {
    devSourcemap: false,
    preprocessorOptions: {
      scss: {
        charset: false
      }
    },
    // Fix CSS MIME type issues
    modules: {
      localsConvention: "camelCase"
    }
  },
  // Better error handling
  logLevel: "info",
  clearScreen: false,
  // Global source map disable
  define: {
    __VITE_DISABLE_SOURCEMAP__: true
  },
  // Fix module resolution issues
  publicDir: "public",
  // Ensure proper asset handling
  assetsInclude: ["**/*.woff", "**/*.woff2", "**/*.ttf", "**/*.eot"]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwL2NvZGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9hcHAvY29kZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vYXBwL2NvZGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IGNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJ1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocydcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCh7XG4gICAgICAvLyBSZWFjdCBvcHRpbWl6YXRpb25zXG4gICAgICBiYWJlbDoge1xuICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgLy8gUmVtb3ZlIGNvbnNvbGUubG9nIGluIHByb2R1Y3Rpb25cbiAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nICYmICdiYWJlbC1wbHVnaW4tdHJhbnNmb3JtLXJlbW92ZS1jb25zb2xlJ1xuICAgICAgICBdLmZpbHRlcihCb29sZWFuKVxuICAgICAgfSxcbiAgICAgIC8vIEZhc3QgUmVmcmVzaCBpcyBlbmFibGVkIGJ5IGRlZmF1bHRcbiAgICAgIC8vIEluY2x1ZGUgSlNYIHJ1bnRpbWUgZm9yIGJldHRlciBITVJcbiAgICAgIGpzeFJ1bnRpbWU6ICdhdXRvbWF0aWMnLFxuICAgICAgLy8gRXhjbHVkZSBub2RlX21vZHVsZXMgZnJvbSB0cmFuc2Zvcm1hdGlvbiBmb3IgZmFzdGVyIGJ1aWxkc1xuICAgICAgZXhjbHVkZTogL25vZGVfbW9kdWxlcy8sXG4gICAgICAvLyBJbmNsdWRlIG9ubHkgbmVjZXNzYXJ5IGZpbGVzXG4gICAgICBpbmNsdWRlOiBbJyoqLyoudHN4JywgJyoqLyoudHMnLCAnKiovKi5qc3gnLCAnKiovKi5qcyddXG4gICAgfSksXG4gICAgdHNjb25maWdQYXRocygpLFxuICAgIC8vIEJ1bmRsZSBhbmFseXplclxuICAgIHZpc3VhbGl6ZXIoe1xuICAgICAgZmlsZW5hbWU6ICdkaXN0L3N0YXRzLmh0bWwnLFxuICAgICAgb3BlbjogZmFsc2UsXG4gICAgICBnemlwU2l6ZTogdHJ1ZSxcbiAgICAgIGJyb3RsaVNpemU6IHRydWVcbiAgICB9KSxcbiAgICAvLyBDb21wcmVzc2lvblxuICAgIGNvbXByZXNzaW9uKHtcbiAgICAgIGFsZ29yaXRobTogJ2d6aXAnLFxuICAgICAgZXh0OiAnLmd6J1xuICAgIH0pLFxuICAgIGNvbXByZXNzaW9uKHtcbiAgICAgIGFsZ29yaXRobTogJ2Jyb3RsaUNvbXByZXNzJyxcbiAgICAgIGV4dDogJy5icidcbiAgICB9KVxuICBdLFxuICBlc2J1aWxkOiB7XG4gICAgdGFyZ2V0OiAnZXMyMDE1JyxcbiAgICBzb3VyY2VtYXA6IGZhbHNlXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgLy8gVGFyZ2V0IG1vZGVybiBicm93c2VycyBmb3IgYmV0dGVyIG9wdGltaXphdGlvblxuICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgLy8gSW5jcmVhc2UgY2h1bmsgc2l6ZSB3YXJuaW5nIGxpbWl0XG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwLFxuICAgIC8vIEVuYWJsZSBtaW5pZmljYXRpb25cbiAgICBtaW5pZnk6ICd0ZXJzZXInLFxuICAgIC8vIENvbXBsZXRlbHkgZGlzYWJsZSBzb3VyY2UgbWFwcyBpbiBidWlsZFxuICAgIHNvdXJjZW1hcDogZmFsc2UsXG4gICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxuICAgICAgICBwdXJlX2Z1bmNzOiBbJ2NvbnNvbGUubG9nJywgJ2NvbnNvbGUuaW5mbycsICdjb25zb2xlLmRlYnVnJywgJ2NvbnNvbGUudHJhY2UnXVxuICAgICAgfSxcbiAgICAgIG1hbmdsZToge1xuICAgICAgICBzYWZhcmkxMDogdHJ1ZVxuICAgICAgfVxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgbWFpbjogcmVzb2x2ZShfX2Rpcm5hbWUsICdpbmRleC5odG1sJylcbiAgICAgIH0sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgLy8gRW5oYW5jZWQgbWFudWFsIGNodW5rIHNwbGl0dGluZyBmb3Igb3B0aW1hbCBjYWNoaW5nXG4gICAgICAgIG1hbnVhbENodW5rczogKGlkKSA9PiB7XG4gICAgICAgICAgLy8gQ29yZSBSZWFjdCBjaHVua3NcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ3JlYWN0JykgfHwgaWQuaW5jbHVkZXMoJ3JlYWN0LWRvbScpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3JlYWN0LWNvcmUnXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gUm91dGVyIGNodW5rXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdyZWFjdC1yb3V0ZXInKSkge1xuICAgICAgICAgICAgcmV0dXJuICdyb3V0ZXInXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gVUkgY29tcG9uZW50cyBjaHVua1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnQHJhZGl4LXVpJykgfHwgaWQuaW5jbHVkZXMoJ2x1Y2lkZS1yZWFjdCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3VpLWNvbXBvbmVudHMnXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gRGF0YSBtYW5hZ2VtZW50IGNodW5rXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdAdGFuc3RhY2svcmVhY3QtcXVlcnknKSB8fCBpZC5pbmNsdWRlcygnenVzdGFuZCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2RhdGEtbWFuYWdlbWVudCdcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBGb3JtIGhhbmRsaW5nIGNodW5rXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdyZWFjdC1ob29rLWZvcm0nKSB8fCBpZC5pbmNsdWRlcygnQGhvb2tmb3JtL3Jlc29sdmVycycpIHx8IGlkLmluY2x1ZGVzKCd6b2QnKSkge1xuICAgICAgICAgICAgcmV0dXJuICdmb3JtLWhhbmRsaW5nJ1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIENoYXJ0cyBhbmQgdmlzdWFsaXphdGlvbiBjaHVua1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygncmVjaGFydHMnKSB8fCBpZC5pbmNsdWRlcygnZnJhbWVyLW1vdGlvbicpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3Zpc3VhbGl6YXRpb24nXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gVXRpbGl0aWVzIGNodW5rXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdkYXRlLWZucycpIHx8IGlkLmluY2x1ZGVzKCdjbHN4JykgfHwgaWQuaW5jbHVkZXMoJ3RhaWx3aW5kLW1lcmdlJykpIHtcbiAgICAgICAgICAgIHJldHVybiAndXRpbHMnXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQmFja2VuZCBzZXJ2aWNlcyBjaHVua1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnQHN1cGFiYXNlJykgfHwgaWQuaW5jbHVkZXMoJ2F4aW9zJykpIHtcbiAgICAgICAgICAgIHJldHVybiAnYmFja2VuZC1zZXJ2aWNlcydcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBMYXJnZSB0aGlyZC1wYXJ0eSBsaWJyYXJpZXNcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ3Rlc3NlcmFjdCcpIHx8IGlkLmluY2x1ZGVzKCdsZWFmbGV0JykgfHwgaWQuaW5jbHVkZXMoJ2pzcGRmJykpIHtcbiAgICAgICAgICAgIHJldHVybiAnaGVhdnktbGlicydcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBEZWZhdWx0IHZlbmRvciBjaHVuayBmb3Igb3RoZXIgZGVwZW5kZW5jaWVzXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xuICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3InXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyBPcHRpbWl6ZSBjaHVuayBmaWxlIG5hbWVzXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAoY2h1bmtJbmZvKSA9PiB7XG4gICAgICAgICAgY29uc3QgZmFjYWRlTW9kdWxlSWQgPSBjaHVua0luZm8uZmFjYWRlTW9kdWxlSWRcbiAgICAgICAgICAgID8gY2h1bmtJbmZvLmZhY2FkZU1vZHVsZUlkLnNwbGl0KCcvJykucG9wKCkucmVwbGFjZSgvXFwuW14uXSokLywgJycpXG4gICAgICAgICAgICA6ICdjaHVuaydcbiAgICAgICAgICByZXR1cm4gYGpzLyR7ZmFjYWRlTW9kdWxlSWR9LVtoYXNoXS5qc2BcbiAgICAgICAgfSxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm8pID0+IHtcbiAgICAgICAgICBjb25zdCBpbmZvID0gYXNzZXRJbmZvLm5hbWUuc3BsaXQoJy4nKVxuICAgICAgICAgIGNvbnN0IGV4dCA9IGluZm9baW5mby5sZW5ndGggLSAxXVxuICAgICAgICAgIGlmICgvcG5nfGpwZT9nfHN2Z3xnaWZ8dGlmZnxibXB8aWNvL2kudGVzdChleHQpKSB7XG4gICAgICAgICAgICByZXR1cm4gYGltZy9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdYFxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoL2Nzcy9pLnRlc3QoZXh0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGBjc3MvW25hbWVdLVtoYXNoXVtleHRuYW1lXWBcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGBhc3NldHMvW25hbWVdLVtoYXNoXVtleHRuYW1lXWBcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICAgICdAdWknOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2NvbXBvbmVudHMvdWknKSxcbiAgICAgICdAbGliJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9saWInKSxcbiAgICAgICdAY29tcG9uZW50cyc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvY29tcG9uZW50cycpLFxuICAgICAgJ0Bob29rcyc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvaG9va3MnKSxcbiAgICAgICdAdXRpbHMnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3V0aWxzJyksXG4gICAgICAnQHR5cGVzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy90eXBlcycpLFxuICAgICAgJ0BwYWdlcyc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvcGFnZXMnKSxcbiAgICAgICdAc3RvcmUnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3N0b3JlJyksXG4gICAgICAnQGNvbnRleHRzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9jb250ZXh0cycpLFxuICAgICAgJ0BzZXJ2aWNlcyc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvc2VydmljZXMnKSxcbiAgICAgICdAY29uc3RhbnRzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9jb25zdGFudHMnKSxcbiAgICAgICdAdmFsaWRhdG9ycyc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvdmFsaWRhdG9ycycpLFxuICAgIH0sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDUxNzMsXG4gICAgaG9zdDogdHJ1ZSxcbiAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICAgIC8vIEFQSSBwcm94eSBkaXNhYmxlZCAtIGJhY2tlbmQgbm90IHJ1bm5pbmdcbiAgICAvLyBwcm94eToge1xuICAgIC8vICAgJy9hcGknOiB7XG4gICAgLy8gICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMScsXG4gICAgLy8gICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAvLyAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAvLyAgICAgdGltZW91dDogMzAwMDAsXG4gICAgLy8gICAgIHByb3h5VGltZW91dDogMzAwMDAsXG4gICAgLy8gICB9LFxuICAgIC8vIH0sXG4gICAgLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudCAtIHNpbXBsaWZpZWQgZm9yIHN0YWJpbGl0eVxuICAgIGhtcjogdHJ1ZSxcbiAgICAvLyBGaWxlIHdhdGNoaW5nIG9wdGltaXphdGlvbnMgZm9yIEN1cnNvclxuICAgIHdhdGNoOiB7XG4gICAgICB1c2VQb2xsaW5nOiBmYWxzZSxcbiAgICAgIGludGVydmFsOiAxMDAsXG4gICAgICBiaW5hcnlJbnRlcnZhbDogNTAwLFxuICAgICAgaWdub3JlZDogW1xuICAgICAgICAnKiovbm9kZV9tb2R1bGVzLyoqJyxcbiAgICAgICAgJyoqLy5naXQvKionLFxuICAgICAgICAnKiovZGlzdC8qKicsXG4gICAgICAgICcqKi9jb3ZlcmFnZS8qKicsXG4gICAgICAgICcqKi8ubnljX291dHB1dC8qKicsXG4gICAgICAgICcqKi8udnNjb2RlLyoqJyxcbiAgICAgICAgJyoqLy5pZGVhLyoqJyxcbiAgICAgICAgJyoqL3RtcC8qKicsXG4gICAgICAgICcqKi90ZW1wLyoqJyxcbiAgICAgICAgJyoqLyouYmFja3VwJyxcbiAgICAgICAgJyoqL3NjcmlwdHMvKionLFxuICAgICAgICAnKiovZG9jcy8qKicsXG4gICAgICAgICcqKi9lMmUvKionLFxuICAgICAgICAnKiovbWlncmF0aW9ucy8qKidcbiAgICAgIF0sXG4gICAgICAvLyBVc2UgbmF0aXZlIGZpbGUgc3lzdGVtIGV2ZW50cyBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlXG4gICAgICB1c2VGc0V2ZW50czogdHJ1ZSxcbiAgICAgIGRlcHRoOiA1MFxuICAgIH0sXG4gICAgLy8gRmFzdGVyIHN0YXJ0dXAgZm9yIEN1cnNvclxuICAgIHdhcm11cDoge1xuICAgICAgY2xpZW50RmlsZXM6IFtcbiAgICAgICAgJy4vc3JjL21haW4udHN4JyxcbiAgICAgICAgJy4vc3JjL0FwcC50c3gnLFxuICAgICAgICAnLi9zcmMvY29tcG9uZW50cy91aS8qKi8qLnRzeCcsXG4gICAgICAgICcuL3NyYy9wYWdlcy8qKi8qLnRzeCcsXG4gICAgICAgICcuL3NyYy9ob29rcy8qKi8qLnRzJ1xuICAgICAgXVxuICAgIH0sXG4gICAgLy8gQ3Vyc29yIGlcdTAwRTdpbiBcdTAwRjZ6ZWwgYXlhcmxhclxuICAgIGNvcnM6IHRydWUsXG4gICAgLy8gRml4IE1JTUUgdHlwZSBpc3N1ZXNcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiAnR0VULCBQT1NULCBQVVQsIERFTEVURSwgT1BUSU9OUycsXG4gICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdDb250ZW50LVR5cGUsIEF1dGhvcml6YXRpb24nXG4gICAgfSxcbiAgICAvLyBDdXN0b20gbWlkZGxld2FyZSBmb3IgQ1NTIE1JTUUgdHlwZSBmaXhlc1xuICAgIG1pZGRsZXdhcmVNb2RlOiBmYWxzZVxuICB9LFxuICAvLyBPcHRpbWl6ZSBkZXBlbmRlbmNpZXMgZm9yIHN0YWJpbGl0eVxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbXG4gICAgICAncmVhY3QnLFxuICAgICAgJ3JlYWN0LWRvbSdcbiAgICBdXG4gIH0sXG4gIC8vIENTUyBvcHRpbWl6YXRpb24gLSBjb21wbGV0ZWx5IGRpc2FibGUgc291cmNlIG1hcHMgYW5kIGZpeCBNSU1FIGlzc3Vlc1xuICBjc3M6IHtcbiAgICBkZXZTb3VyY2VtYXA6IGZhbHNlLFxuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgIHNjc3M6IHtcbiAgICAgICAgY2hhcnNldDogZmFsc2VcbiAgICAgIH1cbiAgICB9LFxuICAgIC8vIEZpeCBDU1MgTUlNRSB0eXBlIGlzc3Vlc1xuICAgIG1vZHVsZXM6IHtcbiAgICAgIGxvY2Fsc0NvbnZlbnRpb246ICdjYW1lbENhc2UnXG4gICAgfVxuICB9LFxuICAvLyBCZXR0ZXIgZXJyb3IgaGFuZGxpbmdcbiAgbG9nTGV2ZWw6ICdpbmZvJyxcbiAgY2xlYXJTY3JlZW46IGZhbHNlLFxuICAvLyBHbG9iYWwgc291cmNlIG1hcCBkaXNhYmxlXG4gIGRlZmluZToge1xuICAgIF9fVklURV9ESVNBQkxFX1NPVVJDRU1BUF9fOiB0cnVlXG4gIH0sXG4gIC8vIEZpeCBtb2R1bGUgcmVzb2x1dGlvbiBpc3N1ZXNcbiAgcHVibGljRGlyOiAncHVibGljJyxcbiAgLy8gRW5zdXJlIHByb3BlciBhc3NldCBoYW5kbGluZ1xuICBhc3NldHNJbmNsdWRlOiBbJyoqLyoud29mZicsICcqKi8qLndvZmYyJywgJyoqLyoudHRmJywgJyoqLyouZW90J11cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZNLE9BQU8sV0FBVztBQUMvTixTQUFTLGVBQWU7QUFDeEIsU0FBUyxrQkFBa0I7QUFDM0IsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxtQkFBbUI7QUFMMUIsSUFBTSxtQ0FBbUM7QUFRekMsSUFBTyxzQkFBUSxh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
