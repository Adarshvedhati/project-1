import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    // "/" when served by Django (default). For GitHub Pages use VITE_BASE=/project-1/
    base: env.VITE_BASE || '/',
  }
})
