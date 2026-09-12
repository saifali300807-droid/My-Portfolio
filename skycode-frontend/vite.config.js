import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Relative asset paths — GitHub Pages project pages (repo subfolder URLs)
  // par bhi images/CSS/JS sahi load hote hain.
  base: './',
})
