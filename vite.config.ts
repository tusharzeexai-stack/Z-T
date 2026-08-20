import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

// Plugin to strip source maps completely and return 404 for any .map request
const disableSourcemapPlugin = (): Plugin => ({
  name: 'disable-sourcemap-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url && (req.url.endsWith('.map') || req.url.includes('sourcemap'))) {
        res.statusCode = 404;
        return res.end('Source maps disabled for security.');
      }
      next();
    });
  },
  transform(code) {
    return {
      code,
      map: null, // Strip inline & external sourcemaps
    };
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), disableSourcemapPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      sourcemap: false, // Completely disables JS & CSS source maps in production build
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
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      sourcemapIgnoreList: () => true,
    },
    preview: {
      sourcemapIgnoreList: () => true,
    },
  };
});
