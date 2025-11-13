import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  
  // Determinamos si estamos en producción (comando 'build')
  const isProd = command === 'build';
  // Define el nombre del repositorio
  const repoName = '/business-wars-simulator/'; 

  return {
    plugins: [react()],
    
    // 🔴 CORRECCIÓN CLAVE: base debe ser la ruta del repositorio en producción, 
    // y la raíz ('/') en desarrollo para evitar el conflicto.
    base: isProd ? repoName : '/', 
    
    // Configuraciones de servidor de desarrollo (opcional)
    server: {
      open: true, // Abrir automáticamente en el navegador
    }
  }
});