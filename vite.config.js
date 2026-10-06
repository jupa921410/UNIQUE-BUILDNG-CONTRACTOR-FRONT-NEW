import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    // Inline PostCSS config — prevents Vite from searching parent directories
    // for postcss.config files from unrelated projects.
    // This project uses vanilla CSS and needs no PostCSS plugins.
    postcss: {
      plugins: [],
    },
  },
})

