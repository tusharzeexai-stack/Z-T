import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      sourcemap: false,
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'leaflet-vendor': ['leaflet'],
            'lucide-icons': ['lucide-react']
          }
        }
      }
    },
    css: {
      devSourcemap: false,
    },
    esbuild: {
      legalComments: 'none',
      sourcemap: false,
      drop: ['console', 'debugger'], // Clean console logs in production for Best Practices boost
    },
  };
});
