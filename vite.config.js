// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Define el nombre del repositorio
const repoName = '/business-wars-simulator/'; 

export default defineConfig(({ command }) => {
  
  // Determinamos si estamos en producción (comando 'build')
  const isProd = command === 'build';

  return {
    plugins: [react()],
    
    // 🔴 Configuración del base:
    // Para 'build', usamos la subcarpeta. 
    // Para 'dev', se omite la propiedad, forzando la base a la raíz ('/').
    base: isProd ? repoName : '/', 
    
    // No necesitamos definir VITE_APP_BASE_PATH aquí, ya que main.jsx usa import.meta.env.PROD
  }
});