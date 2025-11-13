// client/src/pages/AuthPage.jsx (CORRECCIÓN PARA MÚLTIPLES USUARIOS)

import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom'; 
import { useGame } from '../context/GameContext'; 
import Notification from '../components/Notification'; 
import AuthForm from '../components/AuthForm'; 

const AuthPage = () => {
    const { loginUser, registerUser } = useGame(); 
    const navigate = useNavigate();
    const location = useLocation();

    const isRegisterMode = location.search.includes('mode=register');
    const [notification, setNotification] = useState({ message: '', type: '' });
    
    const handleAuthLogic = ({ username, password, companyName }) => {
        if (isRegisterMode) {
            if (!companyName) {
                setNotification({ message: 'El nombre de la empresa es obligatorio.', type: 'error' });
                return false;
            }
            
            const result = registerUser(username, password, companyName);
            if (result.success) {
                // Redirigir al modo LOGIN después del registro exitoso
                navigate('/auth');
                setNotification({ message: result.message, type: 'success' });
                return true;
            } else {
                setNotification({ message: result.message, type: 'error' });
                return false;
            }
            
        } else {
            // LOGIN: Buscar usuario en la lista de usuarios
            const getUsers = () => {
                try {
                    const users = localStorage.getItem('businessWars_users');
                    return users ? JSON.parse(users) : [];
                } catch (error) {
                    return [];
                }
            };

            const users = getUsers();
            const foundUser = users.find(u => u.username === username && u.password === password);
            
            if (foundUser) {
                loginUser(foundUser);
                navigate('/');
                return true;
            }
            
            setNotification({ message: 'Usuario o Contraseña inválidos.', type: 'error' });
            return false;
        }
    };

    const handleAuthSubmit = (formData) => {
        if (!formData.username || !formData.password) {
            setNotification({ message: 'Usuario y Contraseña son obligatorios.', type: 'error' });
            return;
        }

        handleAuthLogic(formData);
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
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
                
                <AuthForm 
                    isRegister={isRegisterMode} 
                    onSubmit={handleAuthSubmit} 
                />
            </div>
        </div>
    );
};

export default AuthPage;