// client/src/pages/AuthPage.jsx (CÓDIGO CON ENLACES DE PIE DE PÁGINA ELIMINADOS)

import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom'; 
import { useGame } from '../context/GameContext'; 
import Notification from '../components/Notification'; 
import AuthForm from '../components/AuthForm'; 


const AuthPage = () => {
    // Desestructuración de funciones y estado del contexto
    const { loginUser, registerUser } = useGame(); 
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
            // 🔴 MODIFICACIÓN CLAVE: Pasamos la contraseña al registro
            registerUser(username, password, companyName); 
            
            // Redirigir al modo LOGIN de la misma página /auth
            navigate('/auth'); 
            setNotification({ message: 'Registro exitoso. ¡Inicia sesión!', type: 'success' });
            return true;
            
        } else {
            // LOGIN:
            
            const storedUser = localStorage.getItem('user');
            
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                
                // 🛑 VALIDACIÓN FINAL: Comparamos el nombre de usuario Y la contraseña.
                if (parsedUser.username === username && parsedUser.password === password) { 
                    
                    // Si ambos coinciden, establecemos la sesión con el objeto guardado.
                    loginUser(parsedUser); 
                    
                    // Redirigimos a la ruta base para que el Router decida (/setup o /dashboard)
                    navigate('/');
                    return true;
                }
            }
            
            // Si no se encuentra el usuario, no coincide el nombre o la contraseña
            setNotification({ message: 'Usuario o Contraseña inválidos.', type: 'error' });
            return false;
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
        <div className="flex h-screen items-center justify-center bg-gray-50">
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
                
                {/* Componente de Formulario (Asumo que AuthForm contiene la alternancia) */}
                <AuthForm 
                    isRegister={isRegisterMode} 
                    onSubmit={handleAuthSubmit} 
                />
                
                {/* ✅ BLOQUE DE ENLACES ELIMINADO PARA EVITAR DUPLICACIÓN */}
                {/* Si AuthForm no tiene los enlaces, deberías moverlos DENTRO de AuthForm.jsx */}
            </div>
        </div>
    );
};

export default AuthPage;