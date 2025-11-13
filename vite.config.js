import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Define el nombre del repositorio
const repoName = '/business-wars-simulator/'; 

export default defineConfig(({ command }) => {
  
  // Determinamos si estamos en producción (comando 'build')
  const isProd = command === 'build';

  return {
    plugins: [react()],
    
    // 🛑 CLAVE: 
    // En 'build' (deploy), usa la base del repo.
    // En 'serve' (dev), usa la raíz '/'.
    base: isProd ? repoName : '/', 
    
    server: {
      open: true, 
    }
  }
});