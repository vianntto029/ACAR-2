/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Programas from './pages/Programas';
import Institutos from './pages/Institutos';
import Materias from './pages/Materias';
import Estadisticas from './pages/Estadisticas';
import Ajustes from './pages/Ajustes';
import Reportes from './pages/Reportes';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/programas" element={<Programas />} />
        <Route path="/institutos" element={<Institutos />} />
        <Route path="/materias" element={<Materias />} />
        <Route path="/estadisticas" element={<Estadisticas />} />
        <Route path="/ajustes" element={<Ajustes />} />
        <Route path="/reportes" element={<Reportes />} />
      </Routes>
    </BrowserRouter>
  );
}
