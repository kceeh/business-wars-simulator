// client/src/pages/AuthPage.jsx (FRAGMENTO CORREGIDO DEL FLUJO DE REGISTRO)

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext'; 
import Notification from '../components/Notification'; 
import AuthForm from '../components/AuthForm'; // Asumo este componente existe


const AuthPage = () => {
    // Desestructuración de funciones y estado del contexto
    const { loginUser, registerUser } = useGame(); // Note: isAuthenticated not needed here
    const navigate = useNavigate();
    const location = useLocation();

    const isRegisterMode = location.search.includes('mode=register');
    const [notification, setNotification] = useState({ message: '', type: '' });
    
    // Lógica que determina si se llama a login o register
    const handleAuthLogic = ({ username, password, companyName }) => {
        if (isRegisterMode) {
            if (!companyName) {
                setNotification({ message: 'El nombre de la empresa es obligatorio.', type: 'error' });
                return false;
            }
            // ✅ REGISTRO: Solo registra los datos en el sistema
            registerUser(username, companyName); 
            
            // ✅ CRÍTICO: Redirigir al modo LOGIN de la misma página /auth
            navigate('/auth'); 
            setNotification({ message: 'Registro exitoso. ¡Inicia sesión!', type: 'success' });
            return true;
            
        } else {
            // LOGIN: Asumimos que la autenticación es exitosa
            loginUser(username, companyName || 'Empresa Genérica'); 
            
            // Redirigimos a la ruta base para que el Router decida (debe ir a /setup o /dashboard)
            navigate('/');
            return true;
        }
    };

    // Manejador del submit del formulario
    const handleAuthSubmit = (formData) => {
        // Validación básica
        if (!formData.username || !formData.password) {
            setNotification({ message: 'Usuario y Contraseña son obligatorios.', type: 'error' });
            return;
        }

        handleAuthLogic(formData);
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-900">
            {/* Componente de Notificación Visible */}
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
            
            <div className="p-8 bg-white rounded-xl shadow-2xl max-w-md w-full">
                <header className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold text-indigo-600">
                        {isRegisterMode ? "Crear Cuenta de Jugador" : "Iniciar Sesión"}
                    </h1>
                    <p className="text-gray-500 mt-2">
                        {isRegisterMode ? "Define tu usuario y nombre de empresa." : "Bienvenido de vuelta."}
                    </p>
                </header>
                
                {/* Componente de Formulario */}
                <AuthForm 
                    isRegister={isRegisterMode} 
                    onSubmit={handleAuthSubmit} 
                />
            </div>
        </div>
    );
};

export default AuthPage;