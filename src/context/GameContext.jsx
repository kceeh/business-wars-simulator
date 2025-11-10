// client/src/context/GameContext.jsx (CORRECCIÓN FINAL DE LA INICIALIZACIÓN DE RIVALES)

import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockRivalData } from '../data/mockData'; // ✅ CRÍTICO: Asegurar la correcta importación

const GameContext = createContext();

// --- ESTADO INICIAL COMPLETO Y SEGURO ---
const INITIAL_GAME_STATE = {
    nombreEmpresa: '', 
    capital: 500000,
    ingresos: 100000,
    cuotaMercado: 10.00,
    satisfaccion: 70,
    empleados: 5,
    semanaActual: 1,
    isGameOver: false,
    winCondition: null,

    nivelID: 0,
    nivelMarketing: 0,
    nivelEficiencia: 0, 
    
    // ✅ INICIALIZACIÓN DE RIVALES (SEGURO)
    rivalsData: mockRivalData.map(r => ({ 
        ...r, 
        lastInvestment: 'Esperando...', 
        lastActionEffect: 'Sin actividad',
        capital: 5200000, 
        cuotaMercado: 15.00
    })),

    // ... (Inicialización de ChartData) ...
    revenueChartData: { 
        labels: ['S0'], 
        datasets: [{ label: 'Ingresos', data: [100000], borderColor: '#3B82F6', backgroundColor: 'rgba(59, 130, 246, 0.5)' }] 
    },
    marketShareChartData: { 
        labels: ['S0'], 
        datasets: [{ label: 'Cuota de Mercado', data: [10.00], borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.5)' }] 
    },
    volatilityChartData: {
        labels: ['S0'],
        datasets: [{
            label: 'Impacto Volátil Semanal (%)',
            data: [0],
            borderColor: '#F87171',
            backgroundColor: 'rgba(248, 113, 113, 0.2)',
            fill: true,
        }]
    },

    settings: {
        maxWeeks: 10,
        winGoal: { capital: 5000000, marketShare: 50 }
    },
    lastDecisions: [],
};
// ----------------------------------------------------


export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);


     useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
            
            const storedGameState = localStorage.getItem(`gameState_${parsedUser.username}`);
            if (storedGameState) {
                setGameState(JSON.parse(storedGameState));
            } else {
                setGameState(INITIAL_GAME_STATE);
            }
        } else {
             setGameState(INITIAL_GAME_STATE);
        }

        setIsLoading(false);
    }, []);

    const loginUser = (username, companyName) => {
        const userData = { username, companyName };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
    };

    const registerUser = (username, companyName) => {
        const userData = { username, companyName };
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logoutUser = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        setGameState(INITIAL_GAME_STATE); 
    };

    const saveGameState = (username, newState) => {
        setGameState(newState);
        const currentUsername = username || user?.username || 'player'; 
        localStorage.setItem(`gameState_${currentUsername}`, JSON.stringify(newState));
    };

    const resetGame = (username) => {
        const resetState = { 
             ...INITIAL_GAME_STATE, 
             nombreEmpresa: gameState?.nombreEmpresa || 'Mi Startup'
        };
        setGameState(resetState);
        const currentUsername = username || user?.username || 'player';
        localStorage.removeItem(`gameState_${currentUsername}`);
    };
    
    // ✅ FUNCIÓN CRÍTICA MODIFICADA: CREACIÓN DE JUEGO CON LÓGICA DE DIFICULTAD
    const createNewGame = (data) => {
        const startingCapital = data.startingCapital || INITIAL_GAME_STATE.capital;
        const initialMarketShare = data.initialMarketShare || INITIAL_GAME_STATE.cuotaMercado;
        const initialRevenue = data.initialRevenue || INITIAL_GAME_STATE.ingresos;

        let rivalCapital = 0;
        let rivalCuota = 0;
        
        // --- LÓGICA DE DIFICULTAD/START JUSTO ---
        if (data.difficultyKey === 'easy') {
            // IGUALDAD ABSOLUTA
            rivalCapital = startingCapital;
            rivalCuota = initialMarketShare;
        } else {
            // Nivel Normal/Difícil: Aplica variación aleatoria y valores base de IA
            const baseCap = data.difficultyKey === 'medium' ? 3000000 : 5000000;
            const baseShare = data.difficultyKey === 'medium' ? 12.00 : 15.00;

            rivalCapital = baseCap + (Math.random() * 100000); 
            rivalCuota = baseShare + (Math.random() * 1.0); 
        }
        
        // ✅ CRÍTICO: Inicialización de la IA con los datos calculados
        const initialRivalData = mockRivalData.map(r => ({ 
            ...r, 
            capital: rivalCapital, 
            cuotaMercado: rivalCuota,
            lastInvestment: 'Esperando...', 
            lastActionEffect: 'Sin actividad' 
        }));


        const newState = {
            ...INITIAL_GAME_STATE,
            nombreEmpresa: data.companyName,
            capital: startingCapital,
            ingresos: initialRevenue,
            cuotaMercado: initialMarketShare,
            settings: data.settings, 
            semanaActual: 1, 
            
            // ✅ GUARDANDO LA DATA DE RIVALES EN EL ESTADO
            rivalsData: initialRivalData, 
            
            // Inicialización de gráficos en S1 
            revenueChartData: { 
                labels: ['S1'], 
                datasets: [{ label: 'Ingresos', data: [initialRevenue], borderColor: '#3B82F6', backgroundColor: 'rgba(59, 130, 246, 0.5)' }] 
            },
            marketShareChartData: { 
                labels: ['S1'], 
                datasets: [{ label: 'Cuota de Mercado', data: [initialMarketShare], borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.5)' }] 
            },
            volatilityChartData: {
                labels: ['S1'],
                datasets: [{
                    label: 'Impacto Volátil Semanal (%)',
                    data: [0],
                    borderColor: '#F87171',
                    backgroundColor: 'rgba(248, 113, 113, 0.2)',
                    fill: true,
                }]
            },
        };

        saveGameState(data.username, newState);
    };


    const value = {
        user,
        isAuthenticated,
        loginUser, 
        registerUser,
        logoutUser, 
        
        gameState,
        isLoading,
        saveGameState,
        resetGame,
        createNewGame,
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    return useContext(GameContext);
};