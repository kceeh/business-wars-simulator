import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Eliminamos toda la lógica de base
export default defineConfig({
  plugins: [react()],
  
  // Base eliminada
  
  server: {
    open: true, 
  }
});