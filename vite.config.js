import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Define el nombre del repositorio
const repoName = '/business-wars-simulator/'; 

export default defineConfig({
  plugins: [react()],
  
  // 🔴 CAMBIO CLAVE: Usamos el repoName ABSOLUTO para asegurar el deploy.
  // Esto obliga al build a usar la subcarpeta para todos los assets.
  base: repoName, 
  
  // Configuraciones de servidor de desarrollo (se mantiene la lógica de main.jsx para el router)
  server: {
    // Es posible que al hacer 'npm run dev' debas acceder a:
    // http://localhost:5173/business-wars-simulator/
    open: true, 
  }
});