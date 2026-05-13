import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  School, Plus, LayoutDashboard, BookOpen, BarChart3, Settings,
  LogOut, Bell, User, Clock, X, Menu
} from 'lucide-react'

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [time, setTime] = useState(new Date())
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Panel de Control' },
    { to: '/programas', icon: BookOpen, label: 'Programas' },
    { to: '/institutos', icon: School, label: 'Instituciones | Convenio' },
    { to: '/materias', icon: BookOpen, label: 'Materias' },
    { to: '/estadisticas', icon: BarChart3, label: 'Estadísticas' },
    { to: '/reportes', icon: BarChart3, label: 'Reportes' },
    { to: '/ajustes', icon: Settings, label: 'Ajustes' },
  ]

  return (
    <div className="flex bg-surface h-screen overflow-hidden text-secondary">
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col gap-2 p-6 border-r border-outline-variant/30 bg-surface/95 backdrop-blur-2xl w-80 shadow-2xl transform transition-transform duration-300 md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <div>
            <h2 className="text-[1.8rem] leading-tight text-primary font-heading uppercase tracking-tight">
              <span className="font-bold">ACAR</span><br/>
              <span className="font-light">Gestión Educativa</span>
            </h2>
          </div>
        </div>

        <button
          onClick={() => navigate('/registro')}
          className="w-full py-3.5 rounded-xl text-xs flex justify-center items-center gap-2 mb-6 tracking-widest uppercase font-bold bg-[#a2d2b2] text-white shadow-[0_4px_14px_0_rgba(162,210,178,0.39)] hover:shadow-[0_6px_20px_rgba(162,210,178,0.3)] transition-all duration-300"
        >
          <Plus className="w-4 h-4 text-white" />
          <span className="text-white">Nuevo Registro</span>
        </button>

        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {({ isActive }) => (
                <div
                  className={`flex items-center gap-4 p-4 rounded-xl text-xs tracking-widest uppercase font-bold transition-all duration-300 shadow-sm ${isActive ? 'text-primary bg-primary/10 shadow-md' : 'text-secondary hover:bg-surface-variant/50'}`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-2 border-t border-outline-variant/20 pt-6">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-4 p-4 rounded-xl text-xs tracking-widest uppercase font-bold transition-all duration-300 shadow-sm text-secondary text-left w-full hover:bg-surface-variant/50"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white/40 backdrop-blur-xl border-b border-white/40 shadow-sm flex justify-between items-center px-4 md:px-6 h-16 flex-shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-surface-variant/50 transition-colors"
            >
              <Menu className="w-5 h-5 text-primary" />
            </button>
            <span className="font-heading text-lg font-bold text-primary">ACAR</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 h-full">
            <NavLink to="/dashboard" className={({ isActive }) => `font-bold h-full flex items-center transition-colors uppercase tracking-wide text-sm ${isActive ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}>Panel de Control</NavLink>
            <NavLink to="/programas" className={({ isActive }) => `font-bold h-full flex items-center transition-colors uppercase tracking-wide text-sm ${isActive ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}>Programas</NavLink>
            <NavLink to="/institutos" className={({ isActive }) => `font-bold h-full flex items-center transition-colors uppercase tracking-wide text-sm ${isActive ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}>Instituciones | Convenio</NavLink>
            <NavLink to="/materias" className={({ isActive }) => `font-bold h-full flex items-center transition-colors uppercase tracking-wide text-sm ${isActive ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}>Materias</NavLink>
            <NavLink to="/reportes" className={({ isActive }) => `font-bold h-full flex items-center transition-colors uppercase tracking-wide text-sm ${isActive ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}>Reportes</NavLink>
          </nav>

          <div className="flex items-center gap-3 text-primary">
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-surface-variant/50 rounded-full font-bold text-sm text-primary">
              <Clock className="w-4 h-4" />
              <span>{formatTime(time)}</span>
            </div>
            <button className="p-2 rounded-full hover:bg-surface-variant/50 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 rounded-full hover:bg-surface-variant/50 transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 relative">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>

          <footer className="mt-10 py-6 border-t border-white/20 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-white/90 text-xs uppercase tracking-wide font-medium">
            <div className="mb-4 md:mb-0">
              <span className="font-bold text-white mr-2">ACAR</span>
              <span>© 2024 Fundación Mochila de Sueños & Programa ACAR. Todos los derechos reservados.</span>
            </div>
            <div className="flex gap-6 font-bold text-white/80">
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Soporte</a>
              <a href="#" className="hover:text-white transition-colors">Términos</a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}