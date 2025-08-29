import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // preserveSymlinks: true, // remove to resolve to real paths for HMR
    dedupe: ["react", "react-dom"],
    alias: {
      // Always load the workspace source of @blog/ui
      '@blog/ui': fileURLToPath(new URL('../../packages/ui/src/index.ts', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['@blog/ui'], // do not prebundle UI; watch source instead
  },
  server: {
    fs: {
      allow: [path.resolve(process.cwd(), '../../')],
    },
    watch: {
      followSymlinks: true,
    },
  },
})
