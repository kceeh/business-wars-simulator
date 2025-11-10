// client/src/pages/DashboardPage.jsx (CÓDIGO CON BOTÓN DE NAVEGACIÓN ARREGLADO)

import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext'; 
import { useNavigate } from 'react-router-dom'; // Importación necesaria
// ... (Otros imports, asumo que ChartCard, KPIWidget, etc. están en subcarpetas)
import KPIWidget from '../components/Dashboard/KPIWidget'; 
import ChartCard from '../components/Dashboard/ChartCard';
import { mockRivalData } from '../data/mockData'; 
import { Pie, Line } from 'react-chartjs-2'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

// ==========================================================
// WeeklyProfitLossWidget: Desglose de Ganancias/Pérdidas Semanales (Mantenido)
// ==========================================================
const WeeklyProfitLossWidget = ({ kpis }) => {
    // Definiciones necesarias para el cálculo (Asumidas de DecisionsPage)
    const BASE_EMPLOYEE_COST = 5000; 
    const REVENUE_SHARE = 0.30;
    
    // Cálculo seguro con fallback a 0
    const currentEmployees = kpis?.empleados || 0;
    const currentIngresos = kpis?.ingresos || 0;
    
    const FIXED_COSTS = currentEmployees * BASE_EMPLOYEE_COST; 
    const grossIncome = Math.round(currentIngresos * REVENUE_SHARE);
    const weeklyProfit = grossIncome - FIXED_COSTS;
    
    const capitalFinal = kpis?.capital || 0;
    // Cálculo seguro del capital inicial
    const capitalInicial = capitalFinal - weeklyProfit; 
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-teal-500 mt-6 mb-8">
            <h3 className="text-xl font-extrabold text-gray-800 mb-4">💰 Flujo de Caja y Desglose Financiero Semanal</h3>
            
            <div className="flex justify-between font-extrabold text-xl border-b border-gray-300 pb-2 mb-2">
                <span>CAPITAL AL INICIO DE SEMANA</span>
                <span className="text-gray-900">${capitalInicial.toLocaleString('es-CL')}</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">Monto disponible de la semana anterior. La Ganancia Neta se suma a este valor.</p>
            
            <div className="space-y-4">
                
                {/* Ingresos Totales (Ventas) */}
                <div>
                    <div className="flex justify-between font-semibold text-lg border-b pb-2">
                        <span>Ingresos Totales (Ventas)</span>
                        <span className="text-blue-600">${currentIngresos.toLocaleString('es-CL')}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Dinero total generado por las ventas de tus productos/servicios esta semana.</p>
                </div>

                {/* Costo de Ventas (COGS) / Margen */}
                <div>
                    <div className="flex justify-between text-gray-700">
                        <span className="text-sm">(-) Costo de Ventas (COGS) / Margen (30% aplicado)</span>
                        <span className="text-sm text-gray-500">-${(currentIngresos - grossIncome).toLocaleString('es-CL')}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Costo directo asociado a las ventas (ej. producción). Aquí se aplica tu margen bruto fijo del 30%. </p>
                </div>
                
                {/* Beneficio Bruto y Gastos Fijos */}
                <div>
                    <div className="flex justify-between font-semibold pt-1">
                        <span>Beneficio Bruto</span>
                        <span className="text-green-600">${grossIncome.toLocaleString('es-CL')}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 mb-2">Ganancia residual después de cubrir el Costo de Ventas, antes de otros gastos.</p>
                    
                    <div className="flex justify-between text-red-700 pt-3 border-t mt-3">
                        <span className="text-sm">(-) **Gastos Fijos** / Sueldos ({currentEmployees} empleados)</span>
                        <span>-${FIXED_COSTS.toLocaleString('es-CL')}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Costos operativos que se incurren sin importar el nivel de ventas (ej. salarios, arriendos).</p>
                </div>

                {/* Ganancia Neta que se Suma (o Resta) */}
                <div>
                    <div className="flex justify-between font-extrabold text-xl pt-3 border-t-2 border-gray-300">
                        <span>GANANCIA NETA (SUMA al Capital)</span>
                        <span className={weeklyProfit >= 0 ? 'text-green-700' : 'text-red-700'}>
                            +${weeklyProfit.toLocaleString('es-CL')}
                        </span>
                    </div>
                </div>

            </div>
            
            {/* CAPITAL DISPONIBLE FINAL */}
            <div className="flex justify-between font-extrabold text-xl pt-4 border-t-2 border-teal-500 mt-4">
                <span>CAPITAL DISPONIBLE (Final KPI)</span>
                <span className={capitalFinal >= 0 ? 'text-green-700' : 'text-red-700'}>
                    ${capitalFinal.toLocaleString('es-CL')}
                </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">El Capital Inicial más la Ganancia Neta de esta semana.</p>
        </div>
    );
};

// Widget de Recomendación Estratégica (Mantenido)
const RecommendationWidget = ({ kpis }) => {
    return (
        <div className="p-5 rounded-xl shadow-md border-l-8 bg-white border-blue-500 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-2">💡 Análisis de Situación</h3>
            <p className="text-gray-700">El rendimiento es estable. Monitorea los movimientos de la IA en la próxima semana.</p>
        </div>
    );
};

// ==========================================================
// DashboardPage Componente Principal
// ==========================================================
const DashboardPage = () => {
    const { gameState, isLoading, user } = useGame(); 
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (isLoading || !gameState || !gameState.nombreEmpresa) return <div className="p-8 text-xl">Cargando Dashboard...</div>;

    const kpis = gameState; 
    
    // ✅ FUNCIÓN DE NAVEGACIÓN
    const handleGoToDecisions = () => {
        navigate('/decisions'); 
    };
    
    // LECTURA CON FALLBACK SEGURO DEL NOMBRE
    const displayCompanyName = kpis?.nombreEmpresa || user?.companyName || 'Dashboard';
    
    const currentRivals = kpis.semanaActual === 1 ? mockRivalData.map(r => ({...r, cuotaMercado: 1.0, lastInvestment: 'Esperando...'})) : mockRivalData;

    const playerShare = kpis.cuotaMercado || 0;
    const totalRivalShare = currentRivals.reduce((sum, r) => sum + (r.cuotaMercado || 0), 0);
    
    // Colores para el gráfico de pastel (Asegurando distinción de "Resto del Mercado")
    const chartColors = [
        '#6366F1', // Jugador (Indigo)
        '#EF4444', // Alpha Corp (Red)
        '#10B981', // Beta Solutions (Green)
        '#F59E0B', // Gamma Dynamics (Orange)
        '#A855F7'  // Resto del Mercado (Purple)
    ];

    const pieData = {
        labels: [kpis.nombreEmpresa, ...currentRivals.map(r => r.name), 'Resto del Mercado'],
        datasets: [{
            data: [playerShare, ...currentRivals.map(r => r.cuotaMercado), Math.max(0, 100 - (playerShare + totalRivalShare))],
            backgroundColor: chartColors,
            hoverBackgroundColor: chartColors,
            borderWidth: 1,
            borderColor: '#ffffff'
        }]
    };

    // LECTURA SEGURA DE DATOS DE GRÁFICOS
    const safeRevenueData = kpis.revenueChartData || { labels: [], datasets: [] };
    const safeMarketData = kpis.marketShareChartData || { labels: [], datasets: [] };
    const safeVolatilityData = kpis.volatilityChartData || { labels: [], datasets: [] };


    return (
        <div className="p-6 bg-gray-100 min-h-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900">
                        Dashboard Ejecutivo: <span className="text-indigo-600">{displayCompanyName}</span>
                    </h1>
                    <p className="text-lg text-gray-500 mt-2">Reporte de situación - Semana {kpis.semanaActual}</p>
                </div>
                <button 
                    onClick={handleGoToDecisions} // ✅ Llamada a la función
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition"
                >
                    🛠️ Ir a Decisiones
                </button>
            </div>

            <RecommendationWidget kpis={kpis} />

            {/* SECCIÓN 1: KPIs */}
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Indicadores Clave (KPIs)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KPIWidget title="Capital Disponible" value={`$${(kpis.capital || 0).toLocaleString('es-CL')}`} color="bg-white" />
                    <KPIWidget title="Ingresos Semanales" value={`$${(kpis.ingresos || 0).toLocaleString('es-CL')}`} color="bg-white" />
                    <KPIWidget title="Cuota de Mercado" value={`${(kpis.cuotaMercado || 0).toFixed(2)}%`} color="bg-white" />
                    <KPIWidget title="Satisfacción Cliente" value={`${kpis.satisfaccion || 0}%`} color="bg-white" />
                </div>
            </div>

            {/* Desglose Financiero Semanal */}
            <WeeklyProfitLossWidget kpis={kpis} />

            {/* SECCIÓN 2: GRÁFICOS HISTÓRICOS */}
            <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📈 Tendencias Históricas</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Asumo que ChartCard usa Line o Bar */}
                    <ChartCard title="Historial de Ingresos" data={safeRevenueData} type="line" /> 
                    <ChartCard title="Historial de Cuota de Mercado" data={safeMarketData} type="line" />
                </div>
                
                {/* Gráfico de Volatilidad (Riesgo de Mercado) */}
                <div className="mt-8">
                    <ChartCard title="Impacto de la Volatilidad Semanal (%)" data={safeVolatilityData} type="line" />
                    <p className="text-xs text-gray-600 mt-2">Esta gráfica muestra el impacto de los factores aleatorios (Volatilidad) en tu rendimiento de Ingresos. Las fluctuaciones son mayores si tienes un número alto o bajo de empleados.</p>
                </div>
            </div>

            {/* SECCIÓN 3: COMPETENCIA DETALLADA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Distribución del Mercado Total</h3>
                    {/* Uso de la etiqueta <Pie> directamente con pieData */}
                    <div className="h-80 flex justify-center"><Pie data={pieData} options={{ maintainAspectRatio: false }} /></div>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-white overflow-y-auto max-h-[450px]">
                    <h3 className="text-xl font-bold mb-6 text-teal-400">🤖 Inteligencia Rival (IA)</h3>
                    <div className="space-y-6">
                        {currentRivals.map((rival, idx) => (
                            <div key={idx} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                                <h4 className="font-bold text-lg mb-2">{rival.name}</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><p className="text-gray-400">Cuota Actual</p><p className="font-bold text-white">{rival.cuotaMercado}%</p></div>
                                    <div><p className="text-gray-400">Amenaza</p><p className={`font-bold ${rival.strength === 'Alta' ? 'text-red-400' : 'text-yellow-400'}`}>{rival.strength}</p></div>
                                    <div className="col-span-2 border-t border-gray-600 pt-2 mt-2"><p className="text-gray-400">Último Movimiento Detectado</p><p className="font-mono text-teal-300">{rival.lastInvestment}</p></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;