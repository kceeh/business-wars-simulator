// client/src/pages/SetupPage.jsx (CÓDIGO CON REDIRECCIÓN FORZADA Y SCOPE SEGURO)

import React from 'react'; 
import { useGame } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';

const difficultyOptions = {
    easy: {
        label: 'Fácil (Start-up Financiada)',
        capital: 2500000,
        marketShare: 5.0,
        maxWeeks: 52,
        winGoal: { capital: 6000000, marketShare: 20.0 },
        description: 'Empiezas con fuerte respaldo financiero y algo de tracción. Ideal para aprender las mecánicas sin presión inmediata.',
        color: 'border-green-500 bg-green-50 hover:bg-green-100'
    },
    medium: {
        label: 'Normal (El Desafío Estándar)',
        capital: 1000000,
        marketShare: 1.0,
        maxWeeks: 40,
        winGoal: { capital: 5000000, marketShare: 25.0 },
        description: 'Recursos limitados, competencia establecida. Tendrás que equilibrar crecimiento y supervivencia cuidadosamente.',
        color: 'border-blue-500 bg-blue-50 hover:bg-blue-100'
    },
    hard: {
        label: 'Difícil (Bootstrapping)',
        capital: 500000,
        marketShare: 0.1,
        maxWeeks: 30,
        winGoal: { capital: 8000000, marketShare: 30.0 },
        description: 'Sin margen de error. Empiezas casi desde cero y el tiempo corre rápido. Solo para estrategas expertos.',
        color: 'border-red-500 bg-red-50 hover:bg-red-100'
    }
};

const SetupPage = () => {
    // Aseguramos leer user y gameState del contexto
    const { createNewGame, user, gameState } = useGame();
    const navigate = useNavigate();
    
    // LECTURA DIRECTA Y SEGURA DEL NOMBRE
    const username = user?.username || 'Invitado';
    const companyName = user?.companyName || 'Empresa Genérica'; 

    // Si el juego ya está configurado, redirige (mantenido)
    if (gameState && gameState.nombreEmpresa && gameState.semanaActual > 1) {
        navigate('/decisions');
    }


    const handleSelectDifficulty = (difficultyKey) => {
        const option = difficultyOptions[difficultyKey];
        
        // La validación ahora solo verifica si es el fallback
        if (companyName === 'Empresa Genérica') { 
             alert('Error: No se encontró el nombre de la empresa. Por favor, inicia sesión con un nombre válido.');
             return;
        }

        // Llamar a createNewGame con el nombre del usuario
        createNewGame({
            difficultyKey: difficultyKey, 
            companyName: companyName, // USAMOS EL NOMBRE CARGADO DEL USER
            username: user?.username || 'player',
            startingCapital: option.capital,
            initialMarketShare: option.marketShare,
            initialRevenue: 100000, 
            settings: {
                 maxWeeks: option.maxWeeks,
                 winGoal: option.winGoal
            }
        });
        
        // CRÍTICO: Navegación asegurada
        navigate('/decisions');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-5xl w-full">
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Configuración de Partida</h1>
                    <p className="text-xl text-gray-600">
                        Bienvenido, <span className="font-bold text-indigo-600">{username}</span>. 
                        Inicia tu simulación como:
                    </p>
                    
                    {/* MOSTRANDO EL NOMBRE CARGADO COMO TEXTO FIJO */}
                    <div className="mt-4 max-w-sm mx-auto">
                        <p className="w-full p-3 border-2 border-indigo-300 bg-indigo-50 rounded-lg text-center text-lg font-bold text-indigo-700">
                            {companyName}
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(difficultyOptions).map(([key, option]) => (
                        <div key={key} className={`flex flex-col h-full border-4 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 ${option.color}`}>
                            <div className="p-6 flex-grow">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">{option.label}</h3>
                                <p className="text-gray-700 mb-6 min-h-[80px]">{option.description}</p>
                                
                                <ul className="space-y-3 text-sm">
                                    <li className="flex justify-between py-2 border-b border-gray-300/50">
                                        <span className="text-gray-600">💰 Capital Inicial:</span>
                                        <span className="font-bold text-gray-900">${option.capital.toLocaleString('es-CL')}</span>
                                    </li>
                                    <li className="flex justify-between py-2 border-b border-gray-300/50">
                                        <span className="text-gray-600">🌍 Cuota Inicial:</span>
                                        <span className="font-bold text-gray-900">{option.marketShare}%</span>
                                    </li>
                                    <li className="flex justify-between py-2 border-b border-gray-300/50">
                                        <span className="text-gray-600">⏳ Tiempo Límite:</span>
                                        <span className="font-bold text-gray-900">{option.maxWeeks} Semanas</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="p-6 pt-0 mt-auto">
                                <div className="bg-white/50 p-3 rounded-lg mb-4 text-center border border-gray-300/30">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">🎯 Meta de Victoria</p>
                                    <p className="text-indigo-700 font-bold">
                                        ${(option.winGoal.capital / 1000000).toFixed(1)}M Capital  /  {option.winGoal.marketShare}% Cuota
                                    </p>
                                </div>
                                <button 
                                    onClick={() => handleSelectDifficulty(key)} 
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors"
                                >
                                    Seleccionar y Empezar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
            {/* Mensaje de Advertencia */}
            {companyName === 'Empresa Genérica' && (
                <div className="mt-6 text-center text-red-600 font-bold p-3 bg-red-100 rounded-lg">
                    ⚠️ Advertencia: El nombre de la empresa es provisional. Inicia sesión o regístrate para usar tu nombre real.
                </div>
            )}
            </div>
        </div>
    );
};

export default SetupPage;