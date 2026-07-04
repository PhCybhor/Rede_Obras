import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const preregistroHtml = resolve(__dirname, 'index-preregistro.html');

/** Em dev, / e /index.html servem a landing de pré-registro (não a oficial). */
function preregistroDevEntry() {
  return {
    name: 'preregistro-dev-entry',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === '/' || req.url === '/index.html') {
          req.url = '/index-preregistro.html';
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), preregistroDevEntry()],
  server: {
    port: 5174,
    strictPort: true,
    open: '/',
    host: true,
    allowedHosts: ['.trycloudflare.com', 'redeobras.com', 'www.redeobras.com', 'cadastro.redeobras.com'],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
    watch: {
      ignored: ['**/dist/**', '**/dist-preregistro/**'],
    },
  },
  build: {
    outDir: 'dist-preregistro',
    rollupOptions: {
      input: preregistroHtml,
    },
  },
});
