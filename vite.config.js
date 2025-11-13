import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Usamos la base absoluta, necesaria para el build
const repoName = '/business-wars-simulator/'; 

export default defineConfig({
  plugins: [react()],
  
  // 🔴 Base para el BUILD: Esto corrige la carga de assets.
  base: repoName, 
  
  server: {
    open: true, 
  }
});