
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
    },
  },
  build: {
    target: 'es2021',
    cssMinify: true,
    minify: 'terser' as const, // Fixed: Type assertion to make TypeScript happy
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
          'ui-vendor': ['@radix-ui'],
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
