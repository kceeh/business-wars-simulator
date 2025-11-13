import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 🛑 VOLVEMOS a usar BrowserRouter para desarrollo local estable.
import { BrowserRouter } from 'react-router-dom'; 

// Eliminamos BASE_PATH
// const BASE_PATH = ...; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Usamos BrowserRouter, sin basename */}
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)