import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Define el nombre del repositorio
const repoName = '/business-wars-simulator/'; 

export default defineConfig({
  plugins: [react()],
  
  // 🛑 CLAVE: La base debe ser la ruta absoluta del repositorio.
  base: repoName, 
  
  server: {
    open: true, 
  }
});