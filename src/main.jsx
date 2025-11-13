import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 🛑 CLAVE: Usar HashRouter
import { HashRouter } from 'react-router-dom'; 

// CLAVE: El basename debe coincidir con la base de vite.config.js
const BASE_PATH = '/business-wars-simulator/'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter basename={BASE_PATH}> 
      <App />
    </HashRouter>
  </React.StrictMode>,
)