import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 🛑 CLAVE: Usar HashRouter para evitar el 404 en deploy
import { HashRouter } from 'react-router-dom'; 

// 🛑 CLAVE: 
// En 'PROD' (deploy), usa la base del repo.
// En 'DEV', usa la raíz '/'.
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