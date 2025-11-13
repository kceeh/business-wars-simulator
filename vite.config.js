import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // 🔴 SOLUCIÓN FINAL: Usar './' (punto-slash)
  // Esto obliga al build a generar rutas RELATIVAS al index.html, 
  // que es lo que GitHub Pages maneja correctamente en subdirectorios.
  base: './', 
  
  // Configuraciones de servidor de desarrollo (se mantiene la lógica de main.jsx para el router)
  server: {
    open: true, 
  }
});