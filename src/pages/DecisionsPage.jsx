// client/src/pages/DecisionsPage.jsx (CÓDIGO CON DETECCIÓN DE VICTORIA CORREGIDA)

import React, { useState, useMemo } from 'react'; 
import Notification from '../components/Notification';
import { useGame } from '../context/GameContext'; 
import { useNavigate } from 'react-router-dom'; 
import { mockRivalData, decisionCategories } from '../data/mockData'; 

// REGLA CRÍTICA: Límite de 10 inversiones por opción
const MAX_LEVEL_PER_OPTION = 10; 
const REVENUE_SHARE = 0.30; 
const BASE_EMPLOYEE_COST = 5000; 
const BASE_EMPLOYEES_NEUTRAL = 5; 

// --- FACTORES DE IMPACTO ESTRATÉGICO Y DE RIESGO (Mantenidos) ---
const ID_IMPACT_RATE = 0.005; 
const MKT_IMPACT_RATE = 0.01;  
const EFFICIENCY_IMPACT_RATE = 0.01;
const BASE_GROWTH_INITIAL = 0.05; 
// -----------------------------------------------------------------


// Función para consolidar y rankear a todos los jugadores
const getGlobalRanking = (kpis, rivals) => {
    // 1. Consolidar datos de todos los jugadores
    const allPlayers = [
        // Jugador (Tú)
        { 
            name: kpis.nombreEmpresa, 
            capital: kpis.capital || 0, 
            cuotaMercado: kpis.cuotaMercado || 0, 
            isPlayer: true 
        },
        // Rivales (IA)
        ...(rivals || []).filter(r => r && r.name).map(r => ({
            name: r.name,
            capital: r.capital || 0,
            cuotaMercado: r.cuotaMercado || 0,
            isPlayer: false
        }))
    ];

    // 2. Ordenar por Capital (el criterio de ranking principal)
    allPlayers.sort((a, b) => b.capital - a.capital);

    // 3. Asignar Ranking y formato
    return allPlayers.map((player, index) => ({
        ...player,
        rank: index + 1,
        color: player.isPlayer ? 'text-indigo-600' : 'text-gray-800'
    }));
};


// ✅ WIDGET: Carrera de Liderazgo (RESTABLECIDO)
const LeadershipRaceWidget = ({ ranking }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-green-500 mb-6">
            <h3 className="text-xl font-extrabold text-green-700 mb-4 flex items-center">
                🏆 Carrera de Liderazgo (Ranking Global)
            </h3>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-3 py-2 text-left text-xs font-bold text-gray-500 uppercase">#</th>
                        <th className="px-3 py-2 text-left text-xs font-bold text-gray-500 uppercase">Empresa</th>
                        <th className="px-3 py-2 text-left text-xs font-bold text-gray-500 uppercase">Capital</th>
                        <th className="px-3 py-2 text-left text-xs font-bold text-gray-500 uppercase">Cuota</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {ranking.map((player) => (
                        <tr 
                            key={player.name} 
                            className={`${player.isPlayer ? 'bg-indigo-50 font-extrabold' : 'hover:bg-gray-50'}`}
                        >
                            <td className={`px-3 py-3 whitespace-nowrap text-sm ${player.color}`}>{player.rank}</td>
                            <td className={`px-3 py-3 whitespace-nowrap text-sm ${player.color}`}>{player.name} {player.isPlayer && "(TÚ)"}</td>
                            <td className={`px-3 py-3 whitespace-nowrap text-sm ${player.color}`}>${player.capital.toLocaleString('es-CL')}</td>
                            <td className={`px-3 py-3 whitespace-nowrap text-sm ${player.color}`}>{player.cuotaMercado.toFixed(2)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


// Widget de Estado de Carrera (Mantenido)
const RaceStatusWidget = ({ kpis, settings }) => {
    let status = { text: 'Competitivo / Estable', color: 'bg-blue-100 text-blue-800 border-blue-500', icon: '⚖️' };
    const winGoalCapital = settings?.winGoal?.capital || 5000000; 
    const winGoalMarket = settings?.winGoal?.marketShare || 50;
    const currentCapital = kpis?.capital || 0;
    const currentShare = kpis?.cuotaMercado || 0;
    const maxWeeks = settings?.maxWeeks || 10;

    if (currentCapital < 200000) {
        status = { text: 'ALERTA: Liquidez Crítica', color: 'bg-red-100 text-red-800 border-red-500', icon: '🚨' };
    } else if (currentCapital >= winGoalCapital * 0.8 && currentShare >= winGoalMarket * 0.8) {
        status = { text: 'Liderando la Carrera', color: 'bg-green-100 text-green-800 border-green-500', icon: '🏆' };
    }

    return (
        <div className={`p-4 rounded-xl border-l-8 shadow-sm mb-6 flex justify-between items-center ${status.color} bg-white`}>
            <div>
                <h3 className="font-bold text-lg flex items-center">{status.icon} Estatus: {status.text}</h3>
            </div>
            <div className="text-right">
                <p className="text-xs font-semibold uppercase opacity-70">Meta S{maxWeeks}</p>
                <p className="font-bold">${(winGoalCapital/1000000).toFixed(1)}M / {winGoalMarket}% Cuota</p>
            </div>
        </div>
    );
};

// Widget de Resumen de Inversión con Impacto Estimado (Mantenido)
const InvestmentSummaryWidget = ({ totalInvestment, estimatedImpact, totalSelectedCount, maxCount, capitalAvailable, capitalRemaining, kpis }) => {
    const isOverspent = capitalRemaining < 0;
    
    const currentStrategicPerks = {
        nivelID: kpis?.nivelID || 0, 
        nivelMarketing: kpis?.nivelMarketing || 0,
        nivelEficiencia: kpis?.nivelEficiencia || 0,
    };
    
    const satisfactionBonus = (kpis?.satisfaccion || 0) >= 80 ? ' (Bono de Lealtad Activo)' : '';

    
    const renderImpactDescription = (impacts) => {
        const safeImpacts = impacts || []; 

        if (safeImpacts.includes('Mantenimiento')) return ["Sin nueva inversión. La proyección se basa en los niveles actuales."];
        
        const impactDescriptions = [];
        if (safeImpacts.includes('Cuota')) impactDescriptions.push("Potencial aumento de Cuota de Mercado.");
        if (safeImpacts.includes('Calidad')) impactDescriptions.push("Mejora la calidad del producto, aumentando la Cuota de Mercado a largo plazo y la Satisfacción.");
        if (safeImpacts.includes('Ingresos')) impactDescriptions.push("Aumento de la capacidad de Ingresos Semanales (mayor base de ganancias).");
        if (safeImpacts.includes('Satisfacción')) impactDescriptions.push("Aumento directo de la Satisfacción del Cliente (mitiga el riesgo de caídas).");
        if (safeImpacts.includes('Eficiencia')) impactDescriptions.push("Reduce los Gastos Fijos Semanales (Sueldos), impactando directamente la Ganancia Neta.");

        return impactDescriptions.map((desc, index) => (
            <p key={index} className="text-xs text-gray-700 mt-1 pl-2 border-l-2 border-green-500">{desc}</p>
        ));
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-indigo-300 mb-6">
            <h3 className="text-xl font-extrabold text-indigo-700 mb-2">✨ Impacto Estimado Semanal</h3>
            
            <div className="flex justify-between items-center mt-1">
                <p className="text-sm font-medium text-gray-700">Capital Disponible (Antes):</p>
                <p className="text-md font-bold text-gray-900">${capitalAvailable.toLocaleString('es-CL')}</p>
            </div>
            
            <div className="flex justify-between items-center mt-1">
                <p className="text-sm font-medium text-gray-700">Costo Proyectado de Inversiones:</p>
                <p className="text-lg font-bold text-red-600">${totalInvestment.toLocaleString('es-CL')}</p>
            </div>
            
            <div className="mt-3 pt-3 border-t">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-extrabold text-gray-700">Capital Restante:</p>
                    <p className={`text-xl font-extrabold ${isOverspent ? 'text-red-700 animate-pulse' : 'text-green-600'}`}>
                        ${capitalRemaining.toLocaleString('es-CL')}</p>
                </div>
            </div>
            
            {/* BENEFICIOS ACUMULADOS ACTUALES (Explicando Satisfacción e Ingresos Base) */}
            <div className="mt-3 pt-3 border-t">
                 <p className="text-sm font-extrabold text-gray-700 mb-2">Efectos Estratégicos Acumulados:</p>
                 <p className="text-xs text-gray-700 pl-2 border-l-2 border-orange-500">
                    <span className="font-bold text-xs">Satisfacción ({kpis?.satisfaccion || 0}%):</span> Alto nivel te protege de caídas de Ingresos{satisfactionBonus}. (Invertido en Soporte)
                 </p>
                 <p className="text-xs text-gray-700 pl-2 border-l-2 border-orange-500">
                    <span className="font-bold text-xs">Ingresos Base (${(kpis?.ingresos || 0).toLocaleString('es-CL')}):</span> Un alto Ingreso Base es la clave para una Ganancia Neta robusta. (Invertido en Marca/Ventas)
                 </p>
                 <p className="text-xs text-gray-700 pl-2 border-l-2 border-orange-500">
                    <span className="font-bold text-xs">Nivel I+D ({currentStrategicPerks.nivelID}):</span> Afecta positivamente la Calidad, el crecimiento de Cuota y la Satisfacción futura.
                 </p>
                 <p className="text-xs text-gray-700 pl-2 border-l-2 border-orange-500">
                    <span className="font-bold text-xs">Nivel Eficiencia ({currentStrategicPerks.nivelEficiencia}):</span> Reduce Gastos Fijos en un {Math.round(currentStrategicPerks.nivelEficiencia * EFFICIENCY_IMPACT_RATE * 100)}%.
                 </p>
            </div>


            {/* Impacto Proyectado (Con descripción estratégica) */}
            <div className="mt-3 pt-3 border-t">
                <p className="text-sm font-extrabold text-gray-700 mb-2">Beneficios Proyectados (Nueva Inversión):</p>
                {(estimatedImpact || []).map((impact, index) => (
                     <p key={index} className="text-xs text-gray-700 mt-1 pl-2 border-l-2 border-green-500">
                         {impact} 
                     </p>
                 ))}
                <p className="text-xs text-gray-500 mt-2">Niveles seleccionados: {totalSelectedCount} de {maxCount} máx. por opción.</p>
            </div>
        </div>
    );
};


// Widget de Controles de Costos (IMPLEMENTACIÓN COMPLETA RESTAURADA)
const CostControlWidget = ({ kpis, updateKpis, setNotification }) => {
    
    const employeeCount = kpis?.empleados || BASE_EMPLOYEES_NEUTRAL;

    const handleEmployeeChange = (increment) => {
        const newEmployees = employeeCount + increment;

        if (newEmployees < 1) { 
            setNotification({ message: "Se requiere al menos 1 empleado para operar.", type: 'warning' });
            return;
        }

        const costChange = increment * BASE_EMPLOYEE_COST; 
        const newCapital = kpis.capital - costChange; 

        updateKpis({ 
            ...kpis,
            capital: newCapital,
            empleados: newEmployees 
        });
        setNotification({ message: `Empleados ajustados a ${newEmployees}.`, type: 'success' });
    };

    const currentMargin = REVENUE_SHARE * 100;
    const fixedCosts = (kpis?.empleados || 0) * BASE_EMPLOYEE_COST; 

    // Lógica de Advertencia de Riesgo
    const employeeDiff = employeeCount - BASE_EMPLOYEES_NEUTRAL;
    let riskMessage = '';
    let riskColor = 'text-gray-600';

    if (employeeDiff > 2) {
        riskMessage = `¡Riesgo Alto! Mayor personal (+${employeeDiff}) aumenta el potencial, pero incrementa la VOLATILIDAD del mercado.`;
        riskColor = 'text-red-500 font-bold';
    } else if (employeeDiff < -2) {
        riskMessage = `¡Precaución! Menor personal (${employeeDiff}) reduce el potencial de crecimiento, aunque es más estable.`;
        riskColor = 'text-yellow-500 font-bold';
    } else {
        riskMessage = "Nivel de personal estable. Volatilidad del mercado en rango normal.";
    }


    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-orange-400 mb-6">
            <h3 className="text-xl font-extrabold text-gray-800 mb-4">💰 Control de Costos Operacionales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                    <p className="font-bold text-sm text-gray-700 mb-2">Gastos Fijos (Sueldos)</p>
                    <p className="text-2xl font-extrabold text-red-600 mb-3">${fixedCosts.toLocaleString('es-CL')}</p>
                    <p className="text-sm text-gray-500 mb-2">Empleados Actuales: **{employeeCount}**</p>
                    <div className="flex space-x-2">
                        <button onClick={() => handleEmployeeChange(-1)} className="px-3 py-1 bg-red-500 text-white rounded-lg font-bold disabled:bg-gray-300">Despedir (-1)</button>
                        <button onClick={() => handleEmployeeChange(1)} className="px-3 py-1 bg-green-500 text-white rounded-lg font-bold disabled:bg-gray-300">Contratar (+1)</button>
                    </div>
                    {/* ADVERTENCIA DE RIESGO POR PERSONAL */}
                    <p className={`text-xs mt-3 p-2 bg-gray-50 rounded ${riskColor}`}>{riskMessage}</p> 
                </div>

                <div>
                    <p className="font-bold text-sm text-gray-700 mb-2">Margen Bruto (COGS)</p>
                    <p className="text-2xl font-extrabold text-teal-600 mb-3">{currentMargin}%</p>
                    <p className="text-sm text-gray-500">Este es el porcentaje de tus ventas que se convierte en Beneficio Bruto.</p>
                </div>
            </div>
        </div>
    );
};

// Función auxiliar para simular el avance de un solo rival IA (CRÍTICO: Mantenido)
const simulateRivalAdvance = (rival, globalRanking) => {
    const RIVAL_EMPLOYEE_COST = 25000;
    const WEEKLY_PROFIT_BASE = rival.capital * 0.005;
    const RIVAL_INCOME_GROWTH_BASE = 0.01; 
    
    const rivalRank = globalRanking.find(p => p.name === rival.name)?.rank || 4;
    
    let INVESTMENT_COST = 0;
    let investmentType = 'Mantenimiento';
    let cuotaChange = (Math.random() * 0.3) - 0.15;
    let capitalChange = WEEKLY_PROFIT_BASE - RIVAL_EMPLOYEE_COST; 

    if (rival.capital > 250000 && rivalRank >= 2) {
        
        if (rivalRank >= 4) { 
            investmentType = Math.random() > 0.5 ? 'Marketing (Agresivo)' : 'I+D (Innovación)';
            INVESTMENT_COST = 150000 + Math.random() * 100000; 
            cuotaChange += (investmentType === 'Marketing (Agresivo)' ? 1.0 : 0.3); 
            
        } else if (rivalRank === 2 || rivalRank === 3) { 
            investmentType = 'Optimización (Eficiencia)';
            INVESTMENT_COST = 50000 + Math.random() * 50000; 
            capitalChange += INVESTMENT_COST * 0.5; 
        }
        
        capitalChange -= INVESTMENT_COST;
    }
    
    const newCapital = rival.capital + capitalChange;
    const newCuota = rival.cuotaMercado + cuotaChange + RIVAL_INCOME_GROWTH_BASE;

    return {
        ...rival,
        capital: newCapital,
        cuotaMercado: Math.max(0, newCuota),
        lastInvestment: INVESTMENT_COST > 0 ? `${investmentType} ($${INVESTMENT_COST.toLocaleString('es-CL')})` : 'Mantenimiento de Costos',
        lastActionEffect: `Capital: ${capitalChange >= 0 ? '+' : ''}${capitalChange.toLocaleString('es-CL')}, Cuota: ${cuotaChange >= 0 ? '+' : ''}${cuotaChange.toFixed(2)}%`,
    };
};


const DecisionsPage = () => {
    const { user, gameState, saveGameState, resetGame, isLoading } = useGame(); 
    const navigate = useNavigate(); 
    
    if (isLoading || !gameState || !gameState.nombreEmpresa) return <div className="flex h-screen items-center justify-center">Cargando...</div>;
    
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [investmentLevels, setInvestmentLevels] = useState({}); 
    
    const updateKpis = (newKpis) => {
        saveGameState(user.username, newKpis);
    };

    const kpis = gameState; 
    const settings = gameState.settings;

    // --- CÁLCULOS CRÍTICOS (Mantenidos) ---
    const fixedCosts = (kpis.empleados || 0) * BASE_EMPLOYEE_COST; 
    const grossIncome = Math.round((kpis.ingresos || 0) * REVENUE_SHARE);
    const weeklyProfit = grossIncome - fixedCosts;
    // ------------------------------------------

    // LECTURA DEL ESTADO PERSISTENTE DE RIVALES
    const currentRivals = (kpis.rivalsData || mockRivalData).filter(r => r && r.name);

    
    // Generar el ranking para el widget
    const globalRanking = getGlobalRanking(kpis, currentRivals);


    // 1. Recalcula la inversión total
    const totalInvestment = useMemo(() => {
        return Object.entries(investmentLevels).reduce((sum, [key, level]) => {
            const decision = decisionCategories.find(d => d.key === key);
            return sum + (decision ? decision.cost * level : 0);
        }, 0);
    }, [investmentLevels]);

    // 2. Cálculo Capital Restante
    const capitalRemaining = (kpis.capital || 0) - totalInvestment; 

    // 3. Calcula el total de niveles seleccionados para el resumen
    const totalSelectedCount = useMemo(() => {
        return Object.values(investmentLevels).reduce((sum, level) => sum + level, 0);
    }, [investmentLevels]);

    // 4. Función para manejar el cambio de nivel de inversión (Mantenido)
    const handleInvestmentChange = (key, newLevel) => {
        const level = Math.max(0, Math.min(MAX_LEVEL_PER_OPTION, newLevel));

        if (level === 0) {
            setInvestmentLevels(prev => {
                const newState = { ...prev };
                delete newState[key]; 
                return newState;
            });
        } else {
            setInvestmentLevels(prev => ({
                ...prev,
                [key]: level,
            }));
        }
    };
    
    // 5. Función para calcular el impacto estimado (Mantenido)
    const getPlayerEstimatedImpact = () => {
        const activeKeys = Object.keys(investmentLevels).filter(key => investmentLevels[key] > 0);

        if (activeKeys.length === 0) return ["Mantenimiento de posición actual"];

        const impacts = new Set();
        activeKeys.forEach(key => {
             const d = decisionCategories.find(d => d.key === key);
             if (d.affectsKPI === 'nivelMarketing') impacts.add('Cuota');
             if (d.affectsKPI === 'nivelID') impacts.add('Calidad');
             if (d.affectsKPI === 'ingresos') impacts.add('Ingresos');
             if (d.affectsKPI === 'satisfaccion') impacts.add('Satisfacción');
             if (d.affectsKPI === 'capital_boost') impacts.add('Eficiencia');
        });
        return Array.from(impacts); 
    };
    
    // 6. Extracción de Perks Estratégicos Actuales
    const currentStrategicPerks = {
        nivelID: kpis.nivelID || 0,
        nivelMarketing: kpis.nivelMarketing || 0,
        nivelEficiencia: kpis.nivelEficiencia || 0,
    };

    // 7. Advertencia de Saturación de Marketing
    const isMarketingSaturated = (currentStrategicPerks.nivelMarketing > 5 && currentStrategicPerks.nivelID < 3);

    
    const simulateNextWeek = () => {
        if (kpis.isGameOver) return;
        const nextWeek = kpis.semanaActual + 1;
        
        if (capitalRemaining < 0) {
             setNotification({ message: "No puedes avanzar. El costo de las inversiones excede el capital disponible.", type: 'error' });
             return;
        }
        
        // LECTURA DE NIVELES (con fallback a 0)
        const nivelID = kpis.nivelID || 0;
        const nivelMarketing = kpis.nivelMarketing || 0;
        const nivelEficiencia = kpis.nivelEficiencia || 0;

        // --- LÓGICA DE EMPLEADOS Y RIESGO ---
        const employeeCount = kpis.empleados || BASE_EMPLOYEES_NEUTRAL; 
        const EMPLOYEE_FACTOR = (employeeCount - BASE_EMPLOYEES_NEUTRAL) * 0.002; 
        const ADJUSTED_BASE_GROWTH = BASE_GROWTH_INITIAL + EMPLOYEE_FACTOR;
        const VOLATILITY_ADJUSTER = Math.abs(employeeCount - BASE_EMPLOYEES_NEUTRAL) * 0.002; 
        
        const MARKET_VOLATILITY = (Math.random() * (0.02 + VOLATILITY_ADJUSTER)) - (0.01 + (VOLATILITY_ADJUSTER / 2)); 
        const CUOTA_VOLATILITY = (Math.random() * (0.04 + VOLATILITY_ADJUSTER * 2)) - (0.02 + VOLATILITY_ADJUSTER);
        // ------------------------------------------

        // 1. GASTOS FIJOS AJUSTADOS (Eficiencia)
        const fixedCostReductionFactor = 1 - (nivelEficiencia * EFFICIENCY_IMPACT_RATE);
        const fixedCostsWeeklyAdjusted = Math.max(0, (kpis.empleados || 0) * BASE_EMPLOYEE_COST * fixedCostReductionFactor);
        
        // 2. CRECIMIENTO DE INGRESOS (Marketing + Base Ajustada + Riesgo)
        const MKT_Factor_Ingresos = nivelMarketing * MKT_IMPACT_RATE;
        let saturationPenalty = 0;
        if (isMarketingSaturated) { saturationPenalty = 0.02; } 

        const growthRateIngresos = ADJUSTED_BASE_GROWTH + MKT_Factor_Ingresos + MARKET_VOLATILITY - saturationPenalty;
        const newIngresos = Math.round((kpis.ingresos || 0) * (1 + growthRateIngresos)); 
        
        // 3. CRECIMIENTO DE CUOTA (I+D + Marketing + Base Ajustada + Riesgo)
        const ID_Factor_Cuota = nivelID * ID_IMPACT_RATE; 
        const MKT_Cuota_Factor = nivelMarketing * 0.005;
        
        const growthCuota = (ADJUSTED_BASE_GROWTH * 2) + ID_Factor_Cuota + MKT_Cuota_Factor + CUOTA_VOLATILITY;
        const newCuota = parseFloat(((kpis.cuotaMercado || 0) * (1 + growthCuota)).toFixed(2));
        
        // 4. CAPITAL FINAL
        const profit = (newIngresos * REVENUE_SHARE) - fixedCostsWeeklyAdjusted; 
        const newCapital = (kpis.capital || 0) + profit; 
        
        // 5. SATISFACCIÓN (I+D + Riesgo)
        const satisfactionDropRisk = newIngresos < (kpis.ingresos || 0) * 0.9 ? -5 : 0; 
        const newSatisfaccion = Math.min(100, Math.max(0, (kpis.satisfaccion || 0) + (nivelID * 2) + satisfactionDropRisk)); 

        // 6. CÓDIGO CRÍTICO DE DETECCIÓN DE VICTORIA
        const winGoalCapital = settings?.winGoal?.capital || 5000000;
        const winGoalMarket = settings?.winGoal?.marketShare || 50;
        const isGameWon = newCapital >= winGoalCapital && newCuota >= winGoalMarket; 

        // 7. GAME OVER
        const isGameOver = newCapital < 0 || isGameWon; 
        const winCondition = isGameWon ? 'win' : (newCapital < 0 ? 'lose' : 'none');

        // 8. GUARDADO DE DATOS (Manejando fallbacks para la carga inicial)
        const newLabels = [...(kpis.revenueChartData?.labels || ['S0']), `S${nextWeek}`];
        const newRevData = [...(kpis.revenueChartData?.datasets[0]?.data || [kpis.ingresos || 100000]), newIngresos];
        const newMktData = [...(kpis.marketShareChartData?.datasets[0]?.data || [kpis.cuotaMercado || 10.00]), newCuota];
        
        const newVolatilityLabels = kpis.volatilityChartData?.labels ? [...kpis.volatilityChartData.labels, `S${nextWeek}`] : [`S${nextWeek}`];
        const newVolatilityData = kpis.volatilityChartData?.datasets[0]?.data ? [...kpis.volatilityChartData.datasets[0].data, (MARKET_VOLATILITY * 100)] : [(MARKET_VOLATILITY * 100)];
        
        // CRÍTICO: SIMULACIÓN DE AVANCE DE RIVALES
        const newRivalsData = currentRivals.map(rival => simulateRivalAdvance(rival, globalRanking));


        const newState = {
            ...kpis,
            semanaActual: nextWeek,
            capital: newCapital,
            ingresos: newIngresos,
            cuotaMercado: newCuota,
            satisfaccion: Math.round(newSatisfaccion),
            
            rivalsData: newRivalsData, 
            
            lastDecisions: [],
            isGameOver: isGameOver, 
            winCondition: winCondition,
            
            // Reconstrucción segura de ChartData (usando un solo dataset por simpleza)
            revenueChartData: { labels: newLabels, datasets: [{ label: 'Ingresos', data: newRevData, borderColor: '#3B82F6', backgroundColor: 'rgba(59, 130, 246, 0.5)' }] },
            marketShareChartData: { labels: newLabels, datasets: [{ label: 'Cuota de Mercado', data: newMktData, borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.5)' }] },
            volatilityChartData: {
                labels: newVolatilityLabels,
                datasets: [{
                    label: 'Impacto Volátil Semanal (%)',
                    data: newVolatilityData,
                    borderColor: '#F87171',
                    backgroundColor: 'rgba(248, 113, 113, 0.2)',
                    fill: true,
                }]
            }
        };

        saveGameState(user.username, newState);
        
        // ✅ CRÍTICO: LIMPIEZA DEL ESTADO DE INVERSIÓN AL AVANZAR
        setInvestmentLevels({});
        
        navigate('/dashboard'); 
    };

    const handleSubmitDecisions = () => {
        if (totalInvestment === 0) {
            setNotification({ message: "Selecciona al menos 1 nivel de inversión.", type: 'error' });
            return;
        }

        if (capitalRemaining < 0) {
            setNotification({ message: "Capital insuficiente. Reduce las inversiones.", type: 'error' });
            return;
        }

        const effects = {};
        let newSatisfaction = kpis.satisfaccion || 0;
        let newIngresos = kpis.ingresos || 0;
        const lastDecisions = [];
        let newNivelEficiencia = kpis.nivelEficiencia || 0; 

        Object.entries(investmentLevels).forEach(([key, level]) => {
            if (level > 0) {
                const d = decisionCategories.find(d => d.key === key);
                lastDecisions.push(`${d.name} (x${level})`);
                
                if (d.affectsKPI.startsWith('nivel')) {
                    effects[d.affectsKPI] = (kpis[d.affectsKPI] || 0) + level;
                } else if (d.affectsKPI === 'satisfaccion') {
                    newSatisfaction = Math.min(100, newSatisfaction + (15 * level)); 
                } else if (d.affectsKPI === 'ingresos') {
                    newIngresos += (50000 * level);
                } else if (d.affectsKPI === 'capital_boost') {
                    newNivelEficiencia += level; 
                }
            }
        });

        const newState = {
            ...kpis,
            capital: capitalRemaining, 
            satisfaccion: newSatisfaction,
            ingresos: newIngresos,
            nivelEficiencia: newNivelEficiencia, 
            ...effects, 
            lastDecisions: lastDecisions,
            rivalsData: currentRivals 
        };

        saveGameState(user.username, newState);
        
        // ✅ CRÍTICO: FORZAR MENSAJE DE ÉXITO Y NO LIMPIAR investmentLevels aquí
        setNotification({ message: "Inversiones aplicadas. Puedes avanzar a la próxima semana.", type: 'success' });
        // NOTE: No eliminamos investmentLevels aquí para que el impacto se mantenga visible.
    };


    const handleRestartGame = () => {
        resetGame(user?.username || 'player');
        navigate('/setup'); 
    };

    if (kpis.isGameOver) { 
        const isWin = kpis.winCondition === 'win';
        const message = isWin 
            ? `¡Felicidades! 🎉 ${kpis.nombreEmpresa} ha alcanzado la meta de Capital y Cuota de Mercado.` 
            : `¡Una pena! 💀 El Capital de ${kpis.nombreEmpresa} ha caído a cero, finalizando el juego.`;
        const color = isWin ? 'bg-green-700' : 'bg-red-700';
        const textColor = isWin ? 'text-green-700' : 'text-red-700';
        const borderColor = isWin ? 'border-green-500' : 'border-red-500';

        // RETORNA ESTE JSX DE INMEDIATO, IGNORANDO EL RESTO DEL CÓDIGO
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-95 p-4">
                <div className={`bg-white p-10 rounded-xl shadow-2xl max-w-lg w-full text-center transform transition duration-500 scale-100 border-4 border-dashed ${borderColor}`}>
                    <p className="text-8xl mb-4">{isWin ? '🏆' : '📉'}</p>
                    <h1 className={`text-4xl font-extrabold mb-3 ${textColor}`}>{isWin ? '¡VICTORIA EMPRESARIAL!' : '¡CAPITAL CERO!'}</h1>
                    <p className="text-xl text-gray-800 mb-6">{message}</p>
                    <div className="space-y-2 text-left bg-gray-50 p-4 rounded">
                        <p className="font-semibold">Semana Final: <span className="font-bold">{kpis.semanaActual}</span></p>
                        <p className="font-semibold">Capital Final: <span className="font-bold text-green-600">${kpis.capital.toLocaleString('es-CL')}</span></p>
                        <p className="font-semibold">Cuota Final: <span className="font-bold text-blue-600">{kpis.cuotaMercado.toFixed(2)}%</span></p>
                    </div>
                    
                    <button 
                        onClick={handleRestartGame} 
                        className={`mt-6 w-full px-6 py-3 ${color} text-white font-bold rounded-lg hover:opacity-90 transition`}
                    >
                        Volver a Empezar
                    </button>
                </div>
            </div>
        );
    } // CIERRE DEL BLOQUE isGameOver

    return (
        <div className="p-4 bg-gray-50 min-h-full">
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
            
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">🛠️ Centro de Decisiones: {kpis.nombreEmpresa || user?.companyName || 'Empresa Genérica'}</h1>
            
            {/* ✅ WIDGET DE CARRERA DE LIDERAZGO (REEMPLAZANDO EL ESTADO FINANCIERO SIMPLE) */}
            <LeadershipRaceWidget ranking={globalRanking} />

            {/* Controles de Costos (CON ADVERTENCIA DE RIESGO) */}
            <CostControlWidget kpis={kpis} updateKpis={updateKpis} setNotification={setNotification} />

            <RaceStatusWidget kpis={kpis} settings={settings} />
            
            {/* ------------------------------------------ */}
            {/* SECCIÓN PRINCIPAL DE INVERSIÓN */}
            {/* ------------------------------------------ */}

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Inversión Estratégica (HU02) 
                <span className="text-base ml-4 text-indigo-600 font-extrabold">(Total Niveles Seleccionados: {totalSelectedCount})</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* ... (Mapeo de decisionCategories) ... */}
                {decisionCategories.map((decision) => {
                    const currentLevel = investmentLevels[decision.key] || 0;
                    
                    return (
                        <div key={decision.key} className={`p-4 rounded-xl shadow-lg border-2 ${currentLevel > 0 ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white'}`}>
                            <h3 className="font-bold text-sm">{decision.name}</h3>
                            <p className="text-xs text-gray-600 mb-2">⭐ {decision.gain}</p>
                            
                            <p className="text-xs text-gray-400 mb-2">Costo Base: <span className="font-bold">${decision.cost.toLocaleString('es-CL')}</span></p>
                            
                            <div className="mt-3 pt-3 border-t">
                                <p className="font-semibold text-xs mb-2">Nivel Actual: <span className="text-indigo-600 text-base font-extrabold">{currentLevel} / {MAX_LEVEL_PER_OPTION}</span></p>
                                
                                {/* Controles de Nivel */}
                                <div className="flex justify-between items-center space-x-2">
                                    <button 
                                        onClick={() => handleInvestmentChange(decision.key, currentLevel - 1)} 
                                        disabled={currentLevel === 0}
                                        className="px-3 py-1 bg-red-500 text-white rounded-lg font-bold disabled:bg-gray-300 text-sm">
                                        -
                                    </button>
                                    
                                    <button 
                                        onClick={() => handleInvestmentChange(decision.key, currentLevel + 1)} 
                                        disabled={currentLevel >= MAX_LEVEL_PER_OPTION}
                                        className="px-3 py-1 bg-green-500 text-white rounded-lg font-bold disabled:bg-gray-300 text-sm">
                                        +
                                    </button>
                                </div>
                            </div>
                            
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-center mb-10 space-x-4">
                <button 
                    onClick={handleSubmitDecisions} 
                    disabled={totalInvestment === 0 || capitalRemaining < 0} 
                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg disabled:bg-gray-400"
                >
                    Aplicar ({totalSelectedCount} Niveles | ${totalInvestment.toLocaleString('es-CL')})
                </button>
            </div>
            
            {/* ✅ WIDGET DE IMPACTO ESTIMADO SEMANAL (UBICACIÓN CORREGIDA) */}
            <InvestmentSummaryWidget 
                totalInvestment={totalInvestment}
                estimatedImpact={getPlayerEstimatedImpact()}
                totalSelectedCount={totalSelectedCount}
                maxCount={MAX_LEVEL_PER_OPTION}
                capitalAvailable={kpis.capital || 0} 
                capitalRemaining={capitalRemaining} 
                kpis={kpis} 
            />

            <hr className="my-8" />
            
            <div className="flex justify-center my-10">
                <button onClick={simulateNextWeek} className="px-8 py-4 bg-teal-600 text-white font-bold rounded-lg">Avanzar a Semana {kpis.semanaActual + 1}</button>
            </div>
            
            {/* ✅ RESTAURACIÓN DE LA TABLA DE TELEMETRÍA */}
            <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4 border-t pt-6">🤖 Telemetría de Competencia (IA)</h2>
            <div className="bg-white rounded-xl shadow overflow-hidden border">
                 <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                         <tr>
                             <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Empresa</th>
                             <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Capital</th>
                             <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Cuota</th>
                             <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Última Inversión (Apuesta)</th>
                             <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Efecto Estimado</th>
                         </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                         {/* Fila del Jugador */}
                         <tr className="bg-indigo-50 font-semibold">
                             <td className="px-6 py-4 text-indigo-900">{kpis.nombreEmpresa} (Tú)</td>
                             <td className="px-6 py-4 text-indigo-900">${(kpis.capital || 0).toLocaleString('es-CL')}</td>
                             <td className="px-6 py-4 text-indigo-900">{(kpis.cuotaMercado || 0).toFixed(2)}%</td>
                             
                             <td className="px-6 py-4 text-indigo-700">
                                 📈 **10 Niveles/Opción**
                                 <span className="block text-xs font-normal opacity-80">{kpis.lastDecisions?.join(', ') || 'Ninguna aplicada'}</span>
                             </td>
                             
                             <td className="px-6 py-4 text-green-600 font-bold">{getPlayerEstimatedImpact().join(', ')}</td>
                         </tr>
                         
                         {/* Filas de la Competencia IA */}
                         {currentRivals.map((rival, index) => (
                             <tr key={index}>
                                 <td className="px-6 py-4">{rival.name}</td>
                                 <td className="px-6 py-4">${rival.capital.toLocaleString('es-CL')}</td>
                                 <td className="px-6 py-4">{rival.cuotaMercado.toFixed(2)}%</td>
                                 <td className="px-6 py-4 text-red-600 font-medium">{rival.lastInvestment}</td>
                                 <td className="px-6 py-4 text-orange-600 font-bold">{rival.lastActionEffect}</td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>

            <div className="mt-8 text-center pb-20">
                <button 
                    onClick={handleRestartGame} 
                    className="text-sm text-red-500 hover:text-red-700 underline"
                 >
                    Reiniciar Juego
                 </button>
            </div>
        </div>
    );
};

export default DecisionsPage;