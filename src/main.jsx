// client/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { HashRouter } from 'react-router-dom'; 

// 🔴 CORRECCIÓN CLAVE: Usamos la variable PROD de Vite
// Si es PROD (despliegue), usa la subcarpeta. Si no (DEV), usa la raíz '/'.
const BASE_PATH = import.meta.env.PROD 
    ? '/business-wars-simulator/' 
    : '/'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter basename={BASE_PATH}> 
      <App />
    </HashRouter>
  </React.StrictMode>,
)