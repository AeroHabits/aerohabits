
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { type ConfigEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Map specific Radix UI components individually
      "@radix-ui/react-avatar": path.resolve(__dirname, "./node_modules/@radix-ui/react-avatar"),
      "@radix-ui/react-dialog": path.resolve(__dirname, "./node_modules/@radix-ui/react-dialog"),
      "@radix-ui/react-dropdown-menu": path.resolve(__dirname, "./node_modules/@radix-ui/react-dropdown-menu"),
      "@radix-ui/react-label": path.resolve(__dirname, "./node_modules/@radix-ui/react-label"),
      "@radix-ui/react-slot": path.resolve(__dirname, "./node_modules/@radix-ui/react-slot"),
      "@radix-ui/react-toast": path.resolve(__dirname, "./node_modules/@radix-ui/react-toast"),
      "@radix-ui/react-tooltip": path.resolve(__dirname, "./node_modules/@radix-ui/react-tooltip"),
    },
  },
  build: {
    target: 'es2021',
    cssMinify: true,
    minify: 'terser' as const, // Type assertion to make TypeScript happy
    terserOptions: {
      compress: {
        // Properly typed terser options
        ...(mode === 'production' ? {
          drop_console: true,
          drop_debugger: true,
        } : {
          drop_console: false,
          drop_debugger: false
        })
      },
      mangle: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-avatar',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-slot',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip'
          ],
          'motion-vendor': ['framer-motion'],
          'data-vendor': ['@tanstack/react-query']
        }
      }
    },
    sourcemap: mode !== 'production',
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion']
  }
}));
