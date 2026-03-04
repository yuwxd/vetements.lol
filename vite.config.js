import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    __SHIVER_API_URL__: JSON.stringify(process.env.VITE_API_URL || 'https://api.shiver.lol')
  },
  build: {
    outDir: 'dist'
  }
})
