import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    __VETEMENTS_API_URL__: JSON.stringify(process.env.VITE_API_URL || 'https://api.shiver.one')
  },
  build: {
    outDir: 'dist'
  }
})
