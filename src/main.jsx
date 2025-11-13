import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 🛑 Usamos BrowserRouter para la estabilidad local.
import { BrowserRouter } from 'react-router-dom'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Usamos BrowserRouter, sin basename */}
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)