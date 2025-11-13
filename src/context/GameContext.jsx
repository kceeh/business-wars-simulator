// client/src/context/GameContext.jsx (CORRECCIÓN PARA MÚLTIPLES USUARIOS)

import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockRivalData } from '../data/mockData'; 

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
    
    rivalsData: mockRivalData.map(r => ({ 
        ...r, 
        lastInvestment: 'Esperando...', 
        lastActionEffect: 'Sin actividad',
        capital: 5200000, 
        cuotaMercado: 15.00
    })),

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

// 🔑 CLAVE: Funciones helper para manejar múltiples usuarios
const getUsers = () => {
    try {
        const users = localStorage.getItem('businessWars_users');
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        return [];
    }
};

const saveUser = (userData) => {
    try {
        const users = getUsers();
        const existingUserIndex = users.findIndex(u => u.username === userData.username);
        
        if (existingUserIndex >= 0) {
            // Actualizar usuario existente
            users[existingUserIndex] = userData;
        } else {
            // Agregar nuevo usuario
            users.push(userData);
        }
        
        localStorage.setItem('businessWars_users', JSON.stringify(users));
        return true;
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        return false;
    }
};

const findUserByUsername = (username) => {
    const users = getUsers();
    return users.find(u => u.username === username);
};

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storedUsername = localStorage.getItem('currentUser');
        const storedIsAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

        if (storedUsername && storedIsAuthenticated) {
            const foundUser = findUserByUsername(storedUsername);
            if (foundUser) {
                setUser(foundUser);
                setIsAuthenticated(true);
                
                // Cargar estado del juego específico del usuario
                const storedGameState = localStorage.getItem(`gameState_${foundUser.username}`);
                if (storedGameState) {
                    setGameState(JSON.parse(storedGameState));
                } else {
                    setGameState(INITIAL_GAME_STATE);
                }
            } else {
                // Usuario no encontrado en la lista, limpiar sesión
                localStorage.removeItem('currentUser');
                localStorage.removeItem('isAuthenticated');
                setGameState(INITIAL_GAME_STATE);
            }
        } else {
            setGameState(INITIAL_GAME_STATE);
        }

        setIsLoading(false);
    }, []);

    const loginUser = (userData) => { 
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', userData.username);
        localStorage.setItem('isAuthenticated', 'true');
        
        // Cargar estado del juego del usuario
        const storedGameState = localStorage.getItem(`gameState_${userData.username}`);
        if (storedGameState) {
            setGameState(JSON.parse(storedGameState));
        } else {
            setGameState(INITIAL_GAME_STATE);
        }
    };

    const registerUser = (username, password, companyName) => {
        // Validación básica de campos
        if (!username || !password || !companyName) {
            return { success: false, message: "Todos los campos son obligatorios." };
        }

        // Verificar si el usuario ya existe
        const existingUser = findUserByUsername(username);
        if (existingUser) {
            return { success: false, message: `El usuario '${username}' ya existe.` };
        }

        // Crear nuevo usuario
        const userData = { 
            username, 
            password, 
            companyName,
            createdAt: new Date().toISOString()
        };

        // Guardar en la lista de usuarios
        const saved = saveUser(userData);
        if (!saved) {
            return { success: false, message: "Error al guardar el usuario." };
        }

        return { success: true, message: "Registro exitoso." };
    };

    const logoutUser = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
        setGameState(INITIAL_GAME_STATE);
    };

    const saveGameState = (username, newState) => {
        setGameState(newState);
        const currentUsername = username || user?.username;
        if (currentUsername) {
            localStorage.setItem(`gameState_${currentUsername}`, JSON.stringify(newState));
        }
    };

    const resetGame = (username) => {
        const resetState = { 
            ...INITIAL_GAME_STATE, 
            nombreEmpresa: gameState?.nombreEmpresa || 'Mi Startup'
        };
        setGameState(resetState);
        const currentUsername = username || user?.username;
        if (currentUsername) {
            localStorage.removeItem(`gameState_${currentUsername}`);
        }
    };
    
    // ✅ FUNCIÓN CRÍTICA MODIFICADA: CREACIÓN DE JUEGO
    const createNewGame = (data) => {
        const startingCapital = data.startingCapital || INITIAL_GAME_STATE.capital;
        const initialMarketShare = data.initialMarketShare || INITIAL_GAME_STATE.cuotaMercado;
        const initialRevenue = data.initialRevenue || INITIAL_GAME_STATE.ingresos;

        let rivalCapital = 0;
        let rivalCuota = 0;
        
        if (data.difficultyKey === 'easy') {
            rivalCapital = startingCapital;
            rivalCuota = initialMarketShare;
        } else {
            const baseCap = data.difficultyKey === 'medium' ? 3000000 : 5000000;
            const baseShare = data.difficultyKey === 'medium' ? 12.00 : 15.00;
            rivalCapital = baseCap + (Math.random() * 100000); 
            rivalCuota = baseShare + (Math.random() * 1.0); 
        }
        
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
            rivalsData: initialRivalData,
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