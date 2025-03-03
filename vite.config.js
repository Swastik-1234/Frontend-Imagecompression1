import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,  // Changed to port 4000
    host: true,
    strictPort: true,
    open: true  // This will open browser automatically
  },
  build: {
    outDir: 'dist',
  }
})