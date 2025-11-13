import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ReportsPage from './pages/ReportsPage';
import DecisionsPage from './pages/DecisionsPage'; 
import LandingPage from './pages/LandingPage';
import SetupPage from './pages/SetupPage';
import Sidebar from './components/Sidebar';
import { GameProvider, useGame } from './context/GameContext'; 
import './index.css'; 

const AppContent = () => {
    const { isAuthenticated, logoutUser, isLoading, user, gameState } = useGame(); 

    useEffect(() => {
        if (localStorage.getItem('isAuthenticated') === 'true' && !user && !isLoading) {
            logoutUser(); 
            window.location.href = '/'; 
        }
    }, [user, isAuthenticated, isLoading, logoutUser]);

    const handleLogout = () => { 
        logoutUser(); 
        window.location.href = '/'; 
    };

    const AuthenticatedLayout = ({ component: Component }) => (
      isAuthenticated ? (
        <div className="flex min-h-screen">
          {(gameState?.nombreEmpresa) && <Sidebar onLogout={handleLogout} />} 
          <main className={`flex-grow p-4 md:p-8 overflow-y-auto ${!(gameState?.nombreEmpresa) ? 'w-full' : ''}`}>
            <Component /> 
          </main>
        </div>
      ) : <Navigate to="/" />
    );
    
    if (isLoading || !gameState) {
        return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Cargando...</div>;
    }

    const isGameSetup = !!gameState.nombreEmpresa;

    return (
        // ✅ SOLO Routes aquí - HashRouter ya está en main.jsx
        <Routes>
          <Route 
              path="/" 
              element={
                  isAuthenticated ? 
                      (isGameSetup ? 
                          <Navigate to="/decisions" /> 
                        : <Navigate to="/setup" />) 
                    : <LandingPage /> 
              } 
          /> 
          <Route path="/auth" element={isAuthenticated ? <Navigate to="/" /> : <AuthPage />} /> 
          
          <Route 
              path="/setup" 
              element={<AuthenticatedLayout component={SetupPage} />} 
          />

          <Route path="/dashboard" element={isGameSetup ? <AuthenticatedLayout component={DashboardPage} /> : <Navigate to="/setup" />} />
          <Route path="/decisions" element={isGameSetup ? <AuthenticatedLayout component={DecisionsPage} /> : <Navigate to="/setup" />} /> 
          <Route path="/reports" element={isGameSetup ? <AuthenticatedLayout component={ReportsPage} /> : <Navigate to="/setup" />} />
          
          {/* ✅ Ruta 404 para HashRouter */}
          <Route path="*" element={<div className="flex items-center justify-center h-screen">
            <h1>Página no encontrada</h1>
          </div>} />
        </Routes>
    );
}

export default function App() { 
    return (
        <GameProvider>
            <AppContent />
        </GameProvider>
    ); 
}