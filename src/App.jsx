// client/src/App.jsx (CÓDIGO CORREGIDO PARA FALLO DE INICIO)

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ReportsPage from './pages/ReportsPage';
import DecisionsPage from './pages/DecisionsPage'; 
import LandingPage from './pages/LandingPage';
import SetupPage from './pages/SetupPage';
import Sidebar from './components/Sidebar';
import { GameProvider, useGame } from './context/GameContext'; 
import './index.css'; 

// Este componente consume el contexto y maneja el enrutamiento
const AppContent = () => {
    const { isAuthenticated, logoutUser, isLoading, user, gameState } = useGame(); 

    useEffect(() => {
        // Lógica de desautenticación (mantenida)
        if (localStorage.getItem('isAuthenticated') === 'true' && !user && !isLoading) {
            logoutUser(); window.location.href = '/'; 
        }
    }, [user, isAuthenticated, isLoading]);

    const handleLogout = () => { logoutUser(); window.location.href = '/'; };

    const AuthenticatedLayout = ({ component: Component }) => (
      isAuthenticated ? (
        <div className="flex min-h-screen">
          {/* Sidebar solo si gameState tiene datos básicos para evitar errores de renderizado */}
          {(gameState?.nombreEmpresa) && <Sidebar onLogout={handleLogout} />} 
          <main className={`flex-grow p-4 md:p-8 overflow-y-auto ${!(gameState?.nombreEmpresa) ? 'w-full' : ''}`}>
            <Component /> 
          </main>
        </div>
      ) : <Navigate to="/" />
    );
    
    // CRÍTICO: Si está cargando, o el gameState es nulo, no intentar renderizar nada complejo.
    if (isLoading || !gameState) return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Cargando...</div>;

    // Determina si el juego ha sido configurado (usando una propiedad clave como nombreEmpresa)
    const isGameSetup = !!gameState.nombreEmpresa;

    return (
        <Router>
          <Routes>
            <Route 
                path="/" 
                element={
                    isAuthenticated ? 
                        (isGameSetup ? 
                            <Navigate to="/decisions" /> // Juego configurado
                          : <Navigate to="/setup" />)   // Juego no configurado
                      : <LandingPage /> // No autenticado
                } 
            /> 
            <Route path="/auth" element={isAuthenticated ? <Navigate to="/" /> : <AuthPage />} /> 
            
            {/* Setup Page */}
            <Route 
                path="/setup" 
                element={<AuthenticatedLayout component={SetupPage} />} 
            />

            {/* Rutas del juego: Solo accesibles si isGameSetup es verdadero */}
            <Route path="/dashboard" element={isGameSetup ? <AuthenticatedLayout component={DashboardPage} /> : <Navigate to="/setup" />} />
            <Route path="/decisions" element={isGameSetup ? <AuthenticatedLayout component={DecisionsPage} /> : <Navigate to="/setup" />} /> 
            <Route path="/reports" element={isGameSetup ? <AuthenticatedLayout component={ReportsPage} /> : <Navigate to="/setup" />} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
    );
}

export default function App() { return <GameProvider><AppContent /></GameProvider>; }