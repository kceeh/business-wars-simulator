import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Definición de la ruta base del repositorio
const repoName = '/business-wars-simulator/'; 

export default defineConfig({
  plugins: [react()],
  
  // 🔴 CORRECCIÓN CLAVE 1: Base ABSOLUTA.
  base: repoName, 
  
  // 🔴 CORRECCIÓN CLAVE 2: Forzar la salida de build para compatibilidad con gh-pages
  build: {
    // Es posible que necesites esta propiedad si estás usando gh-pages
    outDir: 'dist', 
    // Aseguramos que la aplicación se cargue como módulo.
    assetsDir: 'assets', 
  },
  
  // Configuraciones de servidor de desarrollo (para desarrollo local)
  server: {
    open: true, 
  }
});