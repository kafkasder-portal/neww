import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { visualizer } from 'rollup-plugin-visualizer'
import compression from 'vite-plugin-compression'

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
      // Fast Refresh optimizations
      fastRefresh: true,
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
    // Faster source maps in development
    sourcemap: process.env.NODE_ENV === 'development' ? 'inline' : false,
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
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip'
          ],
          'query-vendor': ['@tanstack/react-query'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'chart-vendor': ['recharts'],
          'utils-vendor': ['date-fns', 'clsx', 'tailwind-merge'],
          'supabase-vendor': ['@supabase/supabase-js']
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
    port: 5174,
    host: true,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3004',
        changeOrigin: true,
        secure: false,
        timeout: 30000,
        proxyTimeout: 30000,
      },
    },
    // Hot Module Replacement optimizations
    hmr: {
      port: 5175,
      timeout: 5000,
      overlay: true,
      clientPort: 5175
    },
    // File watching optimizations
    watch: {
      usePolling: false,
      interval: 100,
      binaryInterval: 300,
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/coverage/**',
        '**/.nyc_output/**',
        '**/tmp/**',
        '**/temp/**'
      ],
      // Use native file system events for better performance
      useFsEvents: true,
      depth: 99
    },
    // Faster startup
    warmup: {
      clientFiles: [
        './src/main.tsx',
        './src/App.tsx',
        './src/components/**/*.tsx',
        './src/pages/**/*.tsx',
        './src/hooks/**/*.ts'
      ]
    }
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
      'framer-motion'
    ],
    exclude: [
      'react-error-boundary',
      'sonner'
    ],
    force: true,
    esbuildOptions: {
      target: 'esnext'
    }
  },
  // CSS optimization
  css: {
    devSourcemap: false,
    preprocessorOptions: {
      scss: {
        charset: false
      }
    }
  },
  // Better error handling
  logLevel: 'info',
  clearScreen: false,
})
