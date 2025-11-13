// client/src/components/AuthForm.jsx (CON BOTÓN DE VOLVER)

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AuthForm = ({ isRegister, onSubmit }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        companyName: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isRegister) {
            if (formData.password !== formData.confirmPassword) {
                alert('Las contraseñas no coinciden. Por favor, revísalas.');
                return;
            }
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
                    Usuario (RF01)
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder=""
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                    Contraseña
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder=""
                />
            </div>

            {isRegister && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                        Confirmar Contraseña
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder=""
                    />
                </div>
            )}
            
            {isRegister && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="companyName">
                        Nombre de la Empresa (RF02)
                    </label>
                    <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder=""
                    />
                </div>
            )}

            {/* ✅ BOTÓN PRINCIPAL DE ACCIÓN */}
            <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
            >
                {isRegister ? 'Registrar y Crear Empresa' : 'Iniciar Sesión'}
            </button>

            {/* ✅ NUEVO BOTÓN PARA VOLVER A LANDING PAGE */}
            <Link 
                to="/"
                className="w-full py-3 bg-gray-300 text-gray-700 font-bold rounded-lg shadow-md hover:bg-gray-400 transition duration-200 flex items-center justify-center"
            >
                ← Volver al Inicio
            </Link>
            
            {/* ENLACES DE ALTERNANCIA */}
            <div className="mt-4 text-center text-sm">
                {isRegister ? (
                    <p>
                        Ya tienes cuenta? 
                        <Link to="/auth" className="text-indigo-600 hover:text-indigo-800 underline ml-1 font-semibold">
                            Inicia sesión
                        </Link>
                    </p>
                ) : (
                    <p>
                        No tienes cuenta? 
                        <Link to="/auth?mode=register" className="text-indigo-600 hover:text-indigo-800 underline ml-1 font-semibold">
                            Regístrate
                        </Link>
                    </p>
                )}
            </div>
        </form>
    );
};

export default AuthForm;