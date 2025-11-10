// client/src/pages/LandingPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom'; 

// Componente auxiliar para las características
const FeatureCard = ({ icon, title, description }) => (
    <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
        <div className="text-5xl mb-4">{icon}</div>
        <h4 className="text-xl font-bold text-gray-800 mb-2">{title}</h4>
        <p className="text-gray-500 text-sm">{description}</p>
    </div>
);

const LandingPage = () => {
    const navigate = useNavigate(); 

    const handleNavigateToAuth = (mode) => {
        // Usa navigate para una transición limpia sin recargar
        navigate(mode === 'register' ? '/auth?mode=register' : '/auth');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Encabezado con Navegación */}
            <header className="w-full bg-white shadow-md p-4 sticky top-0 z-10">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-extrabold text-indigo-600">Business Wars</h1>
                    <nav className="space-x-4">
                        <button 
                            onClick={() => handleNavigateToAuth('login')} 
                            className="text-gray-600 hover:text-indigo-600 font-semibold"
                        >
                            Iniciar Sesión
                        </button>
                        <button 
                            onClick={() => handleNavigateToAuth('register')} 
                            className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition duration-200"
                        >
                            Registrarse
                        </button>
                    </nav>
                </div>
            </header>

            {/* Sección Principal (Héroe) */}
            <section className="py-20 text-center bg-gray-100">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
                        Dirige. Compite. Gana.
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Business Wars es el simulador estratégico web definitivo para experimentar la gestión de una startup en un entorno dinámico y competitivo.
                    </p>
                    <button 
                        onClick={() => handleNavigateToAuth('register')} 
                        className="px-8 py-3 bg-indigo-600 text-white text-lg font-bold rounded-lg shadow-xl hover:bg-indigo-700 transition duration-200"
                    >
                        Empieza a Simular Ahora
                    </button>
                </div>
            </section>

            {/* Sección de Características (Propuesta de Valor) */}
            <section className="py-16 container mx-auto">
                <h3 className="text-3xl font-bold text-gray-800 text-center mb-12">
                    Nuestra Propuesta de Valor
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <FeatureCard 
                        icon="🤖" 
                        title="IA Adaptativa (RF04)" 
                        description="Enfréntate a competidores controlados por IA que reaccionan a cada decisión, asegurando un desafío continuo."
                    />
                    <FeatureCard 
                        icon="💰" 
                        title="Motor Económico Dinámico (RF03)" 
                        description="Experimenta la gestión de recursos, costos e ingresos que reflejan la lógica real del mercado, integrando IA y economía dinámica."
                    />
                    <FeatureCard 
                        icon="📊" 
                        title="Análisis de Rendimiento (RF05)" 
                        description="Visualiza tus indicadores de desempeño mediante dashboards, gráficos interactivos, y reportes detallados (RF07)."
                    />
                </div>
            </section>

            {/* Pie de Página */}
            <footer className="w-full bg-gray-900 text-gray-400 p-8 text-center mt-10">
                &copy; {new Date().getFullYear()} Business Wars. Proyecto Integrado TIHV43.
            </footer>
        </div>
    );
};

export default LandingPage;