import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/dashboard.jsx'; 
import Login from './pages/login.jsx'; 

function App() {
  return (
    <Router>
      <ToastContainer
      position="top-right"       // posición arriba a la derecha
      autoClose={5000}           // se cierra automáticamente después de 5 segundos
      hideProgressBar={false}    // muestra barra de progreso
      newestOnTop={false}        // los toasts nuevos van al final (false) o al principio (true)
      closeOnClick={true}        // se puede cerrar haciendo click en el toast
      rtl={false}                // texto no está en modo RTL (de derecha a izquierda)
      pauseOnFocusLoss={true}    // pausa cuando cambias de pestaña
      draggable={true}           // se puede arrastrar para cerrar
      pauseOnHover={true}        // pausa la cuenta regresiva cuando el mouse está encima
    />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Ruta para redirigir en caso de URL no encontrada */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App;