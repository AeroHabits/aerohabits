
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
    react(), // Using react-swc without problematic plugins
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Production optimizations
    target: 'es2021', // Updated target to support modern JS features like replaceAll
    cssMinify: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        // Fix the typing issue by using correct format for drop_console
        ...(mode === 'production' ? {
          drop_console: true,
          pure_funcs: ['console.debug', 'console.log']
        } : {
          drop_console: false
        }),
        drop_debugger: mode === 'production'
      }
    },
    rollupOptions: {
      output: {
        // Using function form for manualChunks as recommended
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'motion-vendor';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'data-vendor';
            }
            // Default vendor chunk for other node_modules
            return 'vendor';
          }
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
