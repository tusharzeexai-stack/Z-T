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
      sourcemap: false, // Completely disables JS & CSS source maps (hides src/ in Inspect Sources)
      minify: 'esbuild',
    },
    css: {
      devSourcemap: false, // Disables dev CSS source maps
    },
    esbuild: {
      legalComments: 'none',
      sourcemap: false,
    },
    server: {
      // HMR configuration
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      sourcemapIgnoreList: () => true, // Hides source files from browser devtools sources tab
    },
  };
});
