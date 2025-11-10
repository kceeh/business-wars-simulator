// client/src/components/AuthForm.jsx
import React, { useState } from 'react';

const AuthForm = ({ isRegister, onSubmit, onToggle }) => {
  // ✅ Inicialización de todos los estados en vacío
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister && password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    
    // El objeto formData se construye y se envía
    onSubmit({ username, password, companyName }); 
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* CAMPOS BÁSICOS (SIEMPRE VISIBLES PARA LOGIN Y REGISTRO) */}
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Usuario</label>
        <input
          type="text"
          id="username"
          // ⬅️ CRÍTICO: Desactiva el autocompletado del navegador
          autoComplete="off" 
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          // ⬅️ CRÍTICO: Desactiva el autocompletado del navegador
          autoComplete="new-password" 
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      {/* CAMPOS AVANZADOS (SOLO VISIBLES DURANTE EL REGISTRO) */}
      {isRegister && (
        <>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              autoComplete="new-password" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="companyName">
              Nombre de la Empresa (RF02)
            </label>
            <input
              type="text"
              id="companyName"
              autoComplete="off" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              placeholder="Ej: TechNova Corp."
            />
          </div>
        </>
      )}
      <button
        type="submit"
        className="w-full bg-primary hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
      >
        {isRegister ? 'Registrar y Crear Empresa' : 'Iniciar Sesión'}
      </button>
      <button
        type="button"
        onClick={onToggle}
        className="w-full mt-2 text-primary hover:underline text-sm focus:outline-none"
      >
        {isRegister ? 'Ya tienes cuenta? Inicia sesión' : 'No tienes cuenta? Regístrate'}
      </button>
    </form>
  );
};

export default AuthForm;