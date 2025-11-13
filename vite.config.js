import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // 🔴 SOLUCIÓN FINAL: Usar './' (punto-slash)
  // Esto obliga al build a generar rutas RELATIVAS.
  base: './', 
  
  server: {
    open: true, 
  }
});