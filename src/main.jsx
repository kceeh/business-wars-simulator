// client/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { HashRouter } from 'react-router-dom'; 

// 🔴 AJUSTE: El basename debe ser la ruta del repositorio para que el HashRouter funcione.
const BASE_PATH = '/business-wars-simulator/'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter basename={BASE_PATH}> 
      <App />
    </HashRouter>
  </React.StrictMode>,
)