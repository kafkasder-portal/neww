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
    logOverride: { "this-is-undefined-in-esm": "silent" },
    // Faster builds
    target: "esnext",
    // Keep names for better debugging in development
    keepNames: process.env.NODE_ENV === "development",
    // Completely disable source maps to prevent all JSON parse errors
    sourcemap: false,
    // Drop console in production
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
    // Faster minification
    minifyIdentifiers: process.env.NODE_ENV === "production",
    minifySyntax: process.env.NODE_ENV === "production",
    minifyWhitespace: process.env.NODE_ENV === "production"
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
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        timeout: 3e4,
        proxyTimeout: 3e4
      }
    },
    // Hot Module Replacement optimizations for Cursor
    hmr: {
      port: 5174,
      timeout: 15e3,
      overlay: false,
      clientPort: 5174,
      // Cursor için özel HMR ayarları
      host: "localhost"
    },
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
  // Optimize dependencies for better performance
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "@supabase/supabase-js",
      "@tanstack/react-query",
      "react-hook-form",
      "zod",
      "date-fns",
      "clsx",
      "tailwind-merge",
      "lucide-react",
      "framer-motion",
      "sonner",
      "react-error-boundary"
    ],
    exclude: [],
    force: true,
    esbuildOptions: {
      target: "esnext",
      sourcemap: false
    }
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwL2NvZGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9hcHAvY29kZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vYXBwL2NvZGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IGNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJ1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocydcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCh7XG4gICAgICAvLyBSZWFjdCBvcHRpbWl6YXRpb25zXG4gICAgICBiYWJlbDoge1xuICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgLy8gUmVtb3ZlIGNvbnNvbGUubG9nIGluIHByb2R1Y3Rpb25cbiAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nICYmICdiYWJlbC1wbHVnaW4tdHJhbnNmb3JtLXJlbW92ZS1jb25zb2xlJ1xuICAgICAgICBdLmZpbHRlcihCb29sZWFuKVxuICAgICAgfSxcbiAgICAgIC8vIEZhc3QgUmVmcmVzaCBpcyBlbmFibGVkIGJ5IGRlZmF1bHRcbiAgICAgIC8vIEluY2x1ZGUgSlNYIHJ1bnRpbWUgZm9yIGJldHRlciBITVJcbiAgICAgIGpzeFJ1bnRpbWU6ICdhdXRvbWF0aWMnLFxuICAgICAgLy8gRXhjbHVkZSBub2RlX21vZHVsZXMgZnJvbSB0cmFuc2Zvcm1hdGlvbiBmb3IgZmFzdGVyIGJ1aWxkc1xuICAgICAgZXhjbHVkZTogL25vZGVfbW9kdWxlcy8sXG4gICAgICAvLyBJbmNsdWRlIG9ubHkgbmVjZXNzYXJ5IGZpbGVzXG4gICAgICBpbmNsdWRlOiBbJyoqLyoudHN4JywgJyoqLyoudHMnLCAnKiovKi5qc3gnLCAnKiovKi5qcyddXG4gICAgfSksXG4gICAgdHNjb25maWdQYXRocygpLFxuICAgIC8vIEJ1bmRsZSBhbmFseXplclxuICAgIHZpc3VhbGl6ZXIoe1xuICAgICAgZmlsZW5hbWU6ICdkaXN0L3N0YXRzLmh0bWwnLFxuICAgICAgb3BlbjogZmFsc2UsXG4gICAgICBnemlwU2l6ZTogdHJ1ZSxcbiAgICAgIGJyb3RsaVNpemU6IHRydWVcbiAgICB9KSxcbiAgICAvLyBDb21wcmVzc2lvblxuICAgIGNvbXByZXNzaW9uKHtcbiAgICAgIGFsZ29yaXRobTogJ2d6aXAnLFxuICAgICAgZXh0OiAnLmd6J1xuICAgIH0pLFxuICAgIGNvbXByZXNzaW9uKHtcbiAgICAgIGFsZ29yaXRobTogJ2Jyb3RsaUNvbXByZXNzJyxcbiAgICAgIGV4dDogJy5icidcbiAgICB9KVxuICBdLFxuICBlc2J1aWxkOiB7XG4gICAgbG9nT3ZlcnJpZGU6IHsgJ3RoaXMtaXMtdW5kZWZpbmVkLWluLWVzbSc6ICdzaWxlbnQnIH0sXG4gICAgLy8gRmFzdGVyIGJ1aWxkc1xuICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgLy8gS2VlcCBuYW1lcyBmb3IgYmV0dGVyIGRlYnVnZ2luZyBpbiBkZXZlbG9wbWVudFxuICAgIGtlZXBOYW1lczogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcsXG4gICAgLy8gQ29tcGxldGVseSBkaXNhYmxlIHNvdXJjZSBtYXBzIHRvIHByZXZlbnQgYWxsIEpTT04gcGFyc2UgZXJyb3JzXG4gICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICAvLyBEcm9wIGNvbnNvbGUgaW4gcHJvZHVjdGlvblxuICAgIGRyb3A6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicgPyBbJ2NvbnNvbGUnLCAnZGVidWdnZXInXSA6IFtdLFxuICAgIC8vIEZhc3RlciBtaW5pZmljYXRpb25cbiAgICBtaW5pZnlJZGVudGlmaWVyczogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyxcbiAgICBtaW5pZnlTeW50YXg6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicsXG4gICAgbWluaWZ5V2hpdGVzcGFjZTogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJ1xuICB9LFxuICBidWlsZDoge1xuICAgIC8vIFRhcmdldCBtb2Rlcm4gYnJvd3NlcnMgZm9yIGJldHRlciBvcHRpbWl6YXRpb25cbiAgICB0YXJnZXQ6ICdlc25leHQnLFxuICAgIC8vIEluY3JlYXNlIGNodW5rIHNpemUgd2FybmluZyBsaW1pdFxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTAwMCxcbiAgICAvLyBFbmFibGUgbWluaWZpY2F0aW9uXG4gICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICAvLyBDb21wbGV0ZWx5IGRpc2FibGUgc291cmNlIG1hcHMgaW4gYnVpbGRcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSxcbiAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSxcbiAgICAgICAgcHVyZV9mdW5jczogWydjb25zb2xlLmxvZycsICdjb25zb2xlLmluZm8nLCAnY29uc29sZS5kZWJ1ZycsICdjb25zb2xlLnRyYWNlJ11cbiAgICAgIH0sXG4gICAgICBtYW5nbGU6IHtcbiAgICAgICAgc2FmYXJpMTA6IHRydWVcbiAgICAgIH1cbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiB7XG4gICAgICAgIG1haW46IHJlc29sdmUoX19kaXJuYW1lLCAnaW5kZXguaHRtbCcpXG4gICAgICB9LFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIC8vIEVuaGFuY2VkIG1hbnVhbCBjaHVuayBzcGxpdHRpbmcgZm9yIG9wdGltYWwgY2FjaGluZ1xuICAgICAgICBtYW51YWxDaHVua3M6IChpZCkgPT4ge1xuICAgICAgICAgIC8vIENvcmUgUmVhY3QgY2h1bmtzXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdyZWFjdCcpIHx8IGlkLmluY2x1ZGVzKCdyZWFjdC1kb20nKSkge1xuICAgICAgICAgICAgcmV0dXJuICdyZWFjdC1jb3JlJ1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFJvdXRlciBjaHVua1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygncmVhY3Qtcm91dGVyJykpIHtcbiAgICAgICAgICAgIHJldHVybiAncm91dGVyJ1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFVJIGNvbXBvbmVudHMgY2h1bmtcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ0ByYWRpeC11aScpIHx8IGlkLmluY2x1ZGVzKCdsdWNpZGUtcmVhY3QnKSkge1xuICAgICAgICAgICAgcmV0dXJuICd1aS1jb21wb25lbnRzJ1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIERhdGEgbWFuYWdlbWVudCBjaHVua1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5JykgfHwgaWQuaW5jbHVkZXMoJ3p1c3RhbmQnKSkge1xuICAgICAgICAgICAgcmV0dXJuICdkYXRhLW1hbmFnZW1lbnQnXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gRm9ybSBoYW5kbGluZyBjaHVua1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygncmVhY3QtaG9vay1mb3JtJykgfHwgaWQuaW5jbHVkZXMoJ0Bob29rZm9ybS9yZXNvbHZlcnMnKSB8fCBpZC5pbmNsdWRlcygnem9kJykpIHtcbiAgICAgICAgICAgIHJldHVybiAnZm9ybS1oYW5kbGluZydcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBDaGFydHMgYW5kIHZpc3VhbGl6YXRpb24gY2h1bmtcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ3JlY2hhcnRzJykgfHwgaWQuaW5jbHVkZXMoJ2ZyYW1lci1tb3Rpb24nKSkge1xuICAgICAgICAgICAgcmV0dXJuICd2aXN1YWxpemF0aW9uJ1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFV0aWxpdGllcyBjaHVua1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnZGF0ZS1mbnMnKSB8fCBpZC5pbmNsdWRlcygnY2xzeCcpIHx8IGlkLmluY2x1ZGVzKCd0YWlsd2luZC1tZXJnZScpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3V0aWxzJ1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEJhY2tlbmQgc2VydmljZXMgY2h1bmtcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ0BzdXBhYmFzZScpIHx8IGlkLmluY2x1ZGVzKCdheGlvcycpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2JhY2tlbmQtc2VydmljZXMnXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTGFyZ2UgdGhpcmQtcGFydHkgbGlicmFyaWVzXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCd0ZXNzZXJhY3QnKSB8fCBpZC5pbmNsdWRlcygnbGVhZmxldCcpIHx8IGlkLmluY2x1ZGVzKCdqc3BkZicpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2hlYXZ5LWxpYnMnXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gRGVmYXVsdCB2ZW5kb3IgY2h1bmsgZm9yIG90aGVyIGRlcGVuZGVuY2llc1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcbiAgICAgICAgICAgIHJldHVybiAndmVuZG9yJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gT3B0aW1pemUgY2h1bmsgZmlsZSBuYW1lc1xuICAgICAgICBjaHVua0ZpbGVOYW1lczogKGNodW5rSW5mbykgPT4ge1xuICAgICAgICAgIGNvbnN0IGZhY2FkZU1vZHVsZUlkID0gY2h1bmtJbmZvLmZhY2FkZU1vZHVsZUlkXG4gICAgICAgICAgICA/IGNodW5rSW5mby5mYWNhZGVNb2R1bGVJZC5zcGxpdCgnLycpLnBvcCgpLnJlcGxhY2UoL1xcLlteLl0qJC8sICcnKVxuICAgICAgICAgICAgOiAnY2h1bmsnXG4gICAgICAgICAgcmV0dXJuIGBqcy8ke2ZhY2FkZU1vZHVsZUlkfS1baGFzaF0uanNgXG4gICAgICAgIH0sXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvKSA9PiB7XG4gICAgICAgICAgY29uc3QgaW5mbyA9IGFzc2V0SW5mby5uYW1lLnNwbGl0KCcuJylcbiAgICAgICAgICBjb25zdCBleHQgPSBpbmZvW2luZm8ubGVuZ3RoIC0gMV1cbiAgICAgICAgICBpZiAoL3BuZ3xqcGU/Z3xzdmd8Z2lmfHRpZmZ8Ym1wfGljby9pLnRlc3QoZXh0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGBpbWcvW25hbWVdLVtoYXNoXVtleHRuYW1lXWBcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKC9jc3MvaS50ZXN0KGV4dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBgY3NzL1tuYW1lXS1baGFzaF1bZXh0bmFtZV1gXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBgYXNzZXRzL1tuYW1lXS1baGFzaF1bZXh0bmFtZV1gXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICAnQHVpJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9jb21wb25lbnRzL3VpJyksXG4gICAgICAnQGxpYic6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvbGliJyksXG4gICAgICAnQGNvbXBvbmVudHMnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2NvbXBvbmVudHMnKSxcbiAgICAgICdAaG9va3MnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2hvb2tzJyksXG4gICAgICAnQHV0aWxzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy91dGlscycpLFxuICAgICAgJ0B0eXBlcyc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvdHlwZXMnKSxcbiAgICAgICdAcGFnZXMnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3BhZ2VzJyksXG4gICAgICAnQHN0b3JlJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9zdG9yZScpLFxuICAgICAgJ0Bjb250ZXh0cyc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvY29udGV4dHMnKSxcbiAgICAgICdAc2VydmljZXMnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3NlcnZpY2VzJyksXG4gICAgICAnQGNvbnN0YW50cyc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvY29uc3RhbnRzJyksXG4gICAgICAnQHZhbGlkYXRvcnMnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3ZhbGlkYXRvcnMnKSxcbiAgICB9LFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiA1MTczLFxuICAgIGhvc3Q6IHRydWUsXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMScsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgICAgdGltZW91dDogMzAwMDAsXG4gICAgICAgIHByb3h5VGltZW91dDogMzAwMDAsXG4gICAgICB9LFxuICAgIH0sXG4gICAgLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudCBvcHRpbWl6YXRpb25zIGZvciBDdXJzb3JcbiAgICBobXI6IHtcbiAgICAgIHBvcnQ6IDUxNzQsXG4gICAgICB0aW1lb3V0OiAxNTAwMCxcbiAgICAgIG92ZXJsYXk6IGZhbHNlLFxuICAgICAgY2xpZW50UG9ydDogNTE3NCxcbiAgICAgIC8vIEN1cnNvciBpXHUwMEU3aW4gXHUwMEY2emVsIEhNUiBheWFybGFyXHUwMTMxXG4gICAgICBob3N0OiAnbG9jYWxob3N0J1xuICAgIH0sXG4gICAgLy8gRmlsZSB3YXRjaGluZyBvcHRpbWl6YXRpb25zIGZvciBDdXJzb3JcbiAgICB3YXRjaDoge1xuICAgICAgdXNlUG9sbGluZzogZmFsc2UsXG4gICAgICBpbnRlcnZhbDogMTAwLFxuICAgICAgYmluYXJ5SW50ZXJ2YWw6IDUwMCxcbiAgICAgIGlnbm9yZWQ6IFtcbiAgICAgICAgJyoqL25vZGVfbW9kdWxlcy8qKicsXG4gICAgICAgICcqKi8uZ2l0LyoqJyxcbiAgICAgICAgJyoqL2Rpc3QvKionLFxuICAgICAgICAnKiovY292ZXJhZ2UvKionLFxuICAgICAgICAnKiovLm55Y19vdXRwdXQvKionLFxuICAgICAgICAnKiovLnZzY29kZS8qKicsXG4gICAgICAgICcqKi8uaWRlYS8qKicsXG4gICAgICAgICcqKi90bXAvKionLFxuICAgICAgICAnKiovdGVtcC8qKicsXG4gICAgICAgICcqKi8qLmJhY2t1cCcsXG4gICAgICAgICcqKi9zY3JpcHRzLyoqJyxcbiAgICAgICAgJyoqL2RvY3MvKionLFxuICAgICAgICAnKiovZTJlLyoqJyxcbiAgICAgICAgJyoqL21pZ3JhdGlvbnMvKionXG4gICAgICBdLFxuICAgICAgLy8gVXNlIG5hdGl2ZSBmaWxlIHN5c3RlbSBldmVudHMgZm9yIGJldHRlciBwZXJmb3JtYW5jZVxuICAgICAgdXNlRnNFdmVudHM6IHRydWUsXG4gICAgICBkZXB0aDogNTBcbiAgICB9LFxuICAgIC8vIEZhc3RlciBzdGFydHVwIGZvciBDdXJzb3JcbiAgICB3YXJtdXA6IHtcbiAgICAgIGNsaWVudEZpbGVzOiBbXG4gICAgICAgICcuL3NyYy9tYWluLnRzeCcsXG4gICAgICAgICcuL3NyYy9BcHAudHN4JyxcbiAgICAgICAgJy4vc3JjL2NvbXBvbmVudHMvdWkvKiovKi50c3gnLFxuICAgICAgICAnLi9zcmMvcGFnZXMvKiovKi50c3gnLFxuICAgICAgICAnLi9zcmMvaG9va3MvKiovKi50cydcbiAgICAgIF1cbiAgICB9LFxuICAgIC8vIEN1cnNvciBpXHUwMEU3aW4gXHUwMEY2emVsIGF5YXJsYXJcbiAgICBjb3JzOiB0cnVlLFxuICAgIC8vIEZpeCBNSU1FIHR5cGUgaXNzdWVzXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcbiAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogJ0dFVCwgUE9TVCwgUFVULCBERUxFVEUsIE9QVElPTlMnLFxuICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiAnQ29udGVudC1UeXBlLCBBdXRob3JpemF0aW9uJ1xuICAgIH0sXG4gICAgLy8gQ3VzdG9tIG1pZGRsZXdhcmUgZm9yIENTUyBNSU1FIHR5cGUgZml4ZXNcbiAgICBtaWRkbGV3YXJlTW9kZTogZmFsc2VcbiAgfSxcbiAgLy8gT3B0aW1pemUgZGVwZW5kZW5jaWVzIGZvciBiZXR0ZXIgcGVyZm9ybWFuY2VcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogW1xuICAgICAgJ3JlYWN0JyxcbiAgICAgICdyZWFjdC1kb20nLFxuICAgICAgJ3JlYWN0L2pzeC1ydW50aW1lJyxcbiAgICAgICdAc3VwYWJhc2Uvc3VwYWJhc2UtanMnLFxuICAgICAgJ0B0YW5zdGFjay9yZWFjdC1xdWVyeScsXG4gICAgICAncmVhY3QtaG9vay1mb3JtJyxcbiAgICAgICd6b2QnLFxuICAgICAgJ2RhdGUtZm5zJyxcbiAgICAgICdjbHN4JyxcbiAgICAgICd0YWlsd2luZC1tZXJnZScsXG4gICAgICAnbHVjaWRlLXJlYWN0JyxcbiAgICAgICdmcmFtZXItbW90aW9uJyxcbiAgICAgICdzb25uZXInLFxuICAgICAgJ3JlYWN0LWVycm9yLWJvdW5kYXJ5J1xuICAgIF0sXG4gICAgZXhjbHVkZTogW10sXG4gICAgZm9yY2U6IHRydWUsXG4gICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgICBzb3VyY2VtYXA6IGZhbHNlXG4gICAgfVxuICB9LFxuICAvLyBDU1Mgb3B0aW1pemF0aW9uIC0gY29tcGxldGVseSBkaXNhYmxlIHNvdXJjZSBtYXBzIGFuZCBmaXggTUlNRSBpc3N1ZXNcbiAgY3NzOiB7XG4gICAgZGV2U291cmNlbWFwOiBmYWxzZSxcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICBzY3NzOiB7XG4gICAgICAgIGNoYXJzZXQ6IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICAvLyBGaXggQ1NTIE1JTUUgdHlwZSBpc3N1ZXNcbiAgICBtb2R1bGVzOiB7XG4gICAgICBsb2NhbHNDb252ZW50aW9uOiAnY2FtZWxDYXNlJ1xuICAgIH1cbiAgfSxcbiAgLy8gQmV0dGVyIGVycm9yIGhhbmRsaW5nXG4gIGxvZ0xldmVsOiAnaW5mbycsXG4gIGNsZWFyU2NyZWVuOiBmYWxzZSxcbiAgLy8gR2xvYmFsIHNvdXJjZSBtYXAgZGlzYWJsZVxuICBkZWZpbmU6IHtcbiAgICBfX1ZJVEVfRElTQUJMRV9TT1VSQ0VNQVBfXzogdHJ1ZVxuICB9LFxuICAvLyBGaXggbW9kdWxlIHJlc29sdXRpb24gaXNzdWVzXG4gIHB1YmxpY0RpcjogJ3B1YmxpYycsXG4gIC8vIEVuc3VyZSBwcm9wZXIgYXNzZXQgaGFuZGxpbmdcbiAgYXNzZXRzSW5jbHVkZTogWycqKi8qLndvZmYnLCAnKiov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
