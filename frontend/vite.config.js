import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0"
  },
  preview: {
    host: "0.0.0.0",
    allowedHosts: ["team-task-manager-production-15e1.up.railway.app"]
  }
})
