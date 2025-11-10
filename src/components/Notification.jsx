// client/src/components/Notification.jsx
import React, { useEffect } from 'react';

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  const baseClasses = "fixed top-4 right-4 p-4 rounded-lg shadow-xl text-white font-semibold z-50 transition-transform duration-300 transform translate-x-0";
  let colorClasses = "";

  switch (type) {
    case 'success':
      colorClasses = "bg-green-600";
      break;
    case 'warning':
      colorClasses = "bg-yellow-600";
      break;
    case 'error':
      colorClasses = "bg-red-700";
      break;
    default:
      colorClasses = "bg-primary";
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // La notificación se cierra automáticamente después de 4 segundos
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className={`${baseClasses} ${colorClasses}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-xl font-bold leading-none align-middle">
        &times;
      </button>
    </div>
  );
};

export default Notification;