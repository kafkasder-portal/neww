import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import compression from 'vite-plugin-compression'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // React optimizations
      babel: {
        plugins: [
          // Remove console.log in production
          process.env.NODE_ENV === 'production' && 'babel-plugin-transform-remove-console'
        ].filter(Boolean)
      },
      // Fast Refresh is enabled by default
      // Include JSX runtime for better HMR
      jsxRuntime: 'automatic',
      // Exclude node_modules from transformation for faster builds
      exclude: /node_modules/,
      // Include only necessary files
      include: ['**/*.tsx', '**/*.ts', '**/*.jsx', '**/*.js']
    }),
    tsconfigPaths(),
    // Bundle analyzer
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    }),
    // Compression
    compression({
      algorithm: 'gzip',
      ext: '.gz'
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br'
    })
  ],
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    // Faster builds
    target: 'esnext',
    // Keep names for better debugging in development
    keepNames: process.env.NODE_ENV === 'development',
    // Completely disable source maps to prevent all JSON parse errors
    sourcemap: false,
    // Drop console in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    // Faster minification
    minifyIdentifiers: process.env.NODE_ENV === 'production',
    minifySyntax: process.env.NODE_ENV === 'production',
    minifyWhitespace: process.env.NODE_ENV === 'production'
  },
  build: {
    // Target modern browsers for better optimization
    target: 'esnext',
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    // Completely disable source maps in build
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace']
      },
      mangle: {
        safari10: true
      }
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        // Enhanced manual chunk splitting for optimal caching
        manualChunks: (id) => {
          // Core React chunks
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-core'
          }

          // Router chunk
          if (id.includes('react-router')) {
            return 'router'
          }

          // UI components chunk
          if (id.includes('@radix-ui') || id.includes('lucide-react')) {
            return 'ui-components'
          }

          // Data management chunk
          if (id.includes('@tanstack/react-query') || id.includes('zustand')) {
            return 'data-management'
          }

          // Form handling chunk
          if (id.includes('react-hook-form') || id.includes('@hookform/resolvers') || id.includes('zod')) {
            return 'form-handling'
          }

          // Charts and visualization chunk
          if (id.includes('recharts') || id.includes('framer-motion')) {
            return 'visualization'
          }

          // Utilities chunk
          if (id.includes('date-fns') || id.includes('clsx') || id.includes('tailwind-merge')) {
            return 'utils'
          }

          // Backend services chunk
          if (id.includes('@supabase') || id.includes('axios')) {
            return 'backend-services'
          }

          // Large third-party libraries
          if (id.includes('tesseract') || id.includes('leaflet') || id.includes('jspdf')) {
            return 'heavy-libs'
          }

          // Default vendor chunk for other dependencies
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
        // Optimize chunk file names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop().replace(/\.[^.]*$/, '')
            : 'chunk'
          return `js/${facadeModuleId}-[hash].js`
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `img/[name]-[hash][extname]`
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@ui': resolve(__dirname, './src/components/ui'),
      '@lib': resolve(__dirname, './src/lib'),
      '@components': resolve(__dirname, './src/components'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@utils': resolve(__dirname, './src/utils'),
      '@types': resolve(__dirname, './src/types'),
      '@pages': resolve(__dirname, './src/pages'),
      '@store': resolve(__dirname, './src/store'),
      '@contexts': resolve(__dirname, './src/contexts'),
      '@services': resolve(__dirname, './src/services'),
      '@constants': resolve(__dirname, './src/constants'),
      '@validators': resolve(__dirname, './src/validators'),
    },
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
    // Hot Module Replacement optimizations for cloud environment
    hmr: {
      port: 5173,
      timeout: 30000,
      overlay: false,
      // Use same port as dev server for cloud compatibility
      clientPort: 5173,
      // Allow all hosts for cloud environment
      host: true
    },
    // File watching optimizations for Cursor
    watch: {
      usePolling: false,
      interval: 100,
      binaryInterval: 500,
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/coverage/**',
        '**/.nyc_output/**',
        '**/.vscode/**',
        '**/.idea/**',
        '**/tmp/**',
        '**/temp/**',
        '**/*.backup',
        '**/scripts/**',
        '**/docs/**',
        '**/e2e/**',
        '**/migrations/**'
      ],
      // Use native file system events for better performance
      useFsEvents: true,
      depth: 50
    },
    // Faster startup for Cursor
    warmup: {
      clientFiles: [
        './src/main.tsx',
        './src/App.tsx',
        './src/components/ui/**/*.tsx',
        './src/pages/**/*.tsx',
        './src/hooks/**/*.ts'
      ]
    },
    // Cursor için özel ayarlar
    cors: true,
    // Fix MIME type issues
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
    // Custom middleware for CSS MIME type fixes
    middlewareMode: false
  },
  // Optimize dependencies for better performance
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@supabase/supabase-js',
      '@tanstack/react-query',
      'react-hook-form',
      'zod',
      'date-fns',
      'clsx',
      'tailwind-merge',
      'lucide-react',
      'framer-motion',
      'sonner',
      'react-error-boundary'
    ],
    exclude: [],
    force: true,
    esbuildOptions: {
      target: 'esnext',
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
      localsConvention: 'camelCase'
    }
  },
  // Better error handling
  logLevel: 'info',
  clearScreen: false,
  // Global source map disable
  define: {
    __VITE_DISABLE_SOURCEMAP__: true
  },
  // Fix module resolution issues
  publicDir: 'public',
  // Ensure proper asset handling
  assetsInclude: ['**/*.woff', '**/*.woff2', '**/*.ttf', '**/*.eot']
})
