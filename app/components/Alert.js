"use client";
import React, { useEffect } from 'react';
import { useMyContext } from '../context/MyContext'; 

function Alert() {
  const { alert, setAlert} = useMyContext(); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlert(null);
    }, 3000); 

    return () => clearTimeout(timer);
  }, [alert, setAlert]);

  if (!alert) return (
    <div className="bg-gray-100 h-12"></div>
  );

  const alertTypeClass = alert.type === 'success'
    ? 'bg-green-400'
    : alert.type === 'danger'
    ? 'bg-red-400'
    : alert.type === 'warning'
    ? 'bg-yellow-400'
    : 'bg-blue-400'; 
    
  return (
    <div className={`${alertTypeClass} h-12 flex justify-center items-center shadow-md transition-all duration-300 ease-in-out transform sticky top-28 md:top-16 z-50`}>
      <strong>
        <p className="text-white text-lg font-semibold">{alert.message}</p>
      </strong>
    </div>
  );
}

export default Alert;
