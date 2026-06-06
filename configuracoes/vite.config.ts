import { defineConfig, type Plugin } from 'vite'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { IncomingMessage, ServerResponse } from 'http'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Custom plugin to serve index.html from configuracoes folder when root is the workspace root
function serveIndexPlugin(): Plugin {
  return {
    name: 'serve-index-plugin',
    configureServer(server) {
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: (err?: any) => void) => {
        if (req.url === '/' || req.url === '/index.html') {
          try {
            const indexPath = path.resolve(__dirname, 'index.html')
            const html = fs.readFileSync(indexPath, 'utf-8')
            
            server.transformIndexHtml(req.url || '/', html)
              .then((transformedHtml: string) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'text/html')
                res.end(transformedHtml)
              })
              .catch((err: any) => next(err))
          } catch (err: any) {
            next(err)
          }
        } else {
          next()
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), serveIndexPlugin()],
  server: {
    allowedHosts: true,
  },
  // Set root to the workspace root (parent of configuracoes)
  root: path.resolve(__dirname, '..'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
  assetsInclude: ['**/*.csv'],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 400,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'radix-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tooltip',
          ],
        },
      },
    },
  },
})

