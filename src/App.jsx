import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AttendanceProvider } from './context/AttendanceContext'
import LoginView from './views/LoginView'
import RegistroView from './views/RegistroView'
import Dashboard from './pages/Dashboard'
import Programas from './pages/Programas'
import Institutos from './pages/Institutos'
import Materias from './pages/Materias'
import Estadisticas from './pages/Estadisticas'
import Reportes from './pages/Reportes'
import Ajustes from './pages/Ajustes'
import Calendario from './pages/Calendario'
import BaseDatos from './pages/BaseDatos'
import Tablero from './pages/Tablero'
import Notas from './pages/Notas'

export default function App() {
  return (
    <AttendanceProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/registro" element={<RegistroView />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/programas" element={<Programas />} />
          <Route path="/institutos" element={<Institutos />} />
          <Route path="/materias" element={<Materias />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/ajustes" element={<Ajustes />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/basedatos" element={<BaseDatos />} />
          <Route path="/tablero" element={<Tablero />} />
          <Route path="/notas" element={<Notas />} />
        </Routes>
      </BrowserRouter>
    </AttendanceProvider>
  )
}

window.addEventListener('error', function(e) {
  console.error('JS Error:', e.error)
})