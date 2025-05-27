import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import React from 'react';


function Login() {
  const [user, setUser] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);
    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo_electronico: user, contrasena }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // ✅ Guardar el token correctamente
        localStorage.setItem('token', data.token);

        toast.success("Login exitoso");

        // ✅ Redirigir al dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(data.message || 'Error en login');
        toast.error(data.message || 'Error en login');
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
      toast.error("Login fallido");
    }
  };



  return (
    <>
      <h1>Login</h1>
      <div className="card">
        <p>
          Usuario
        </p>
        <input value={user} onChange={(e) => setUser(e.target.value)} style={{
          backgroundColor: '#e0e0e0',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '8px 12px',
          width: '100%',
          boxSizing: 'border-box',
          fontSize: '16px',
          outline: 'none',
        }}/>
        <p>
          Contraseña
        </p>
        <input value={contrasena} onChange={(e) => setContrasena(e.target.value)} style={{
          backgroundColor: '#e0e0e0',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '8px 12px',
          width: '100%',
          boxSizing: 'border-box',
          fontSize: '16px',
          outline: 'none',
        }}/>
      </div>
      <button onClick={handleLogin}>
          Iniciar sesión
        </button>
    </>
  )
}

export default Login;