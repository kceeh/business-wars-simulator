// client/src/components/Sidebar.jsx (LECTURA DE NOMBRE REFORZADA)

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import { useGame } from '../context/GameContext'; 

const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📈' },
    { name: 'Decisiones Estratégicas', path: '/decisions', icon: '🎯' },
    { name: 'Reportes', path: '/reports', icon: '📄' },
    { name: 'Configuración', path: '/setup', icon: '⚙️' },
];

const Sidebar = () => {
    const location = useLocation();
    const { user, gameState, logoutUser } = useGame(); 
    const navigate = useNavigate();

    // ✅ LECTURA REFORZADA: Prioridad 1: gameState, 2: user, 3: fallback.
    const username = user?.username || 'Invitado';
    const companyName = gameState?.nombreEmpresa || user?.companyName || 'Cargando...';
    const currentWeek = gameState?.semanaActual || 1;

    const handleLogoutClick = () => {
        logoutUser(); 
        navigate('/'); 
        window.scrollTo(0, 0)
    };


    return (
        <div className="flex flex-col w-64 bg-gray-900 text-white min-h-screen p-4 shadow-2xl">
            <div className="text-2xl font-extrabold text-teal-400 mb-4 border-b border-gray-700 pb-3">
                Business Wars
            </div>
            
            <div className="mb-6 p-2 rounded bg-gray-800">
                <p className="text-sm text-gray-400">Jugador:</p>
                <p className="font-semibold text-white truncate" title={username}>{username}</p>
                <p className="text-sm text-teal-400 mt-1">Empresa (Semana {currentWeek}):</p>
                <p className="font-bold text-lg text-white truncate" title={companyName}>{companyName}</p>
            </div>
            
            <nav className="flex-grow space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center p-3 rounded-lg transition-colors duration-200 
                            ${location.pathname === item.path ? 'bg-indigo-600 font-bold shadow-md' : 'hover:bg-gray-700'}`}
                    >
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div className="mt-8 pt-4 border-t border-gray-700">
                <button 
                    onClick={handleLogoutClick} 
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-md transition duration-200"
                >
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default Sidebar;